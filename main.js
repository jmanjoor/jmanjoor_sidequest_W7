// main.js
// Sketch entry point (VIEW + orchestration layer).

import { LevelLoader } from "./src/LevelLoader.js";
import { Game } from "./src/Game.js";
import { ParallaxBackground } from "./src/ParallaxBackground.js";
import { loadAssets } from "./src/AssetLoader.js";
import {
  applyIntegerScale,
  installResizeHandler,
} from "./src/utils/IntegerScale.js";

import { CameraController } from "./src/CameraController.js";
import { InputManager } from "./src/InputManager.js";
import { SoundManager } from "./src/SoundManager.js";
import { DebugOverlay } from "./src/DebugOverlay.js";

import { WinScreen } from "./src/ui/WinScreen.js";
import { LoseScreen } from "./src/ui/LoseScreen.js";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function loadJSONAsync(url) {
  return new Promise((resolve, reject) => {
    loadJSON(url, resolve, reject);
  });
}

let audioUnlocked = false;
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  if (typeof userStartAudio === "function") userStartAudio();

  if (soundManager?.sfx?.music) {
    soundManager.sfx.music.setLoop(true);
    if (!soundManager.sfx.music.isPlaying()) {
      soundManager.play("music");
    }
  }
}

function preventKeysThatScroll(evt) {
  const k = (evt?.key ?? "").toLowerCase();
  const scrollKeys = [" ", "arrowup", "arrowdown", "arrowleft", "arrowright"];
  if (scrollKeys.includes(k)) {
    evt.preventDefault?.();
    return false;
  }
  return true;
}

// ------------------------------------------------------------
// State (WORLD + VIEW glue)
// ------------------------------------------------------------

let game;
let parallax;
let hudGfx;

let tuningDoc;
let levelPkg;
let assets;

let loader;

let cameraController;
let inputManager;
let soundManager;
let debugOverlay;

let winScreen;
let loseScreen;
let parallaxLayers = [];

// Make URLs absolute so they can't accidentally resolve relative to /src/...
const LEVELS_URL = new URL("./data/levels.json", window.location.href).href;
const TUNING_URL = new URL("./data/tuning.json", window.location.href).href;

const START_LEVEL_ID = "ex5_level1";

// Boot flags
let bootStarted = false;
let bootDone = false;

// ------------------------------------------------------------
// Boot pipeline (async) — runs from setup()
// ------------------------------------------------------------

async function boot() {
  console.log("BOOT: start");

  // --- Data ---
  tuningDoc = await loadJSONAsync(TUNING_URL);

  loader = new LevelLoader(tuningDoc);
  levelPkg = await loader.load(LEVELS_URL, START_LEVEL_ID);

  // --- Assets (images/animations/etc.) ---
  assets = await loadAssets(levelPkg, tuningDoc);

  // --- Audio registry ---
  soundManager = new SoundManager();
  soundManager.load("jump",          "assets/sfx/jump.wav");
  soundManager.load("hitEnemy",      "assets/sfx/hitEnemy.wav");
  soundManager.load("leafCollect",   "assets/sfx/leafCollect.wav");
  soundManager.load("receiveDamage", "assets/sfx/receiveDamage.wav");
  soundManager.load("music",         "assets/sfx/music.wav");
  soundManager.load("attack",        "assets/sfx/attack.wav");

  initRuntime();

  bootDone = true;
  console.log("BOOT: done");
}

// ------------------------------------------------------------
// Runtime init (sync) — called once after boot() finishes
// ------------------------------------------------------------

function initRuntime() {
  const { viewW, viewH } = levelPkg.view;

  resizeCanvas(viewW, viewH);

  pixelDensity(1);
  noSmooth();
  drawingContext.imageSmoothingEnabled = false;

  frameRate(60);

  applyIntegerScale(viewW, viewH);
  installResizeHandler(viewW, viewH);

  allSprites.pixelPerfect = true;
  world.autoStep = false;

  hudGfx = createGraphics(viewW, viewH);
  hudGfx.noSmooth();
  hudGfx.pixelDensity(1);

  inputManager  = new InputManager();
  debugOverlay  = new DebugOverlay();

  setParallaxFromLevel();
  buildGameInstance();

  loop();
}

// ------------------------------------------------------------
// Level helpers
// ------------------------------------------------------------

function setParallaxFromLevel() {
  const defs = levelPkg.level?.view?.parallax ?? [];
  parallaxLayers = defs
    .map((d) => ({ img: loadImage(d.img), factor: Number(d.speed ?? 0) }))
    .filter((l) => l.img);

  parallax = new ParallaxBackground(parallaxLayers);
}

function buildGameInstance() {
  if (!levelPkg || !assets) return;

  game = new Game(levelPkg, assets, {
    hudGfx,
    inputManager,
    soundManager,
    debugOverlay,
  });
  game.build();

  winScreen  = new WinScreen(levelPkg, assets);
  loseScreen = new LoseScreen(levelPkg, assets);

  cameraController = new CameraController(levelPkg);
  cameraController.setTarget(game.level.playerCtrl.sprite);
  cameraController.reset();

  game.events.on("level:restarted", () => {
    cameraController?.reset();
  });
}

// ------------------------------------------------------------
// p5 lifecycle (module-safe)
// ------------------------------------------------------------

function setup() {
  new Canvas(10, 10, "pixelated");
  pixelDensity(1);
  noLoop();

  if (bootStarted) return;
  bootStarted = true;

  boot().catch((err) => {
    console.error("BOOT FAILED:", err);
  });
}

function draw() {
  if (!bootDone || !levelPkg || !game) return;

  const viewW = levelPkg.view.viewW;
  const viewH = levelPkg.view.viewH;

  const bg = levelPkg.level?.view?.background ?? [69, 61, 79];
  background(bg[0], bg[1], bg[2]);

  parallax?.draw({
    cameraX: camera.x || 0,
    viewW,
    viewH,
  });

  game.update();

  cameraController?.update({
    viewW,
    viewH,
    levelW: game.level.bounds.levelW,
    levelH: game.level.bounds.levelH,
  });
  cameraController?.applyToP5Camera();

  game.draw({
    drawHudFn: () => {
      camera.off();
      try {
        drawingContext.imageSmoothingEnabled = false;
        imageMode(CORNER);
        image(hudGfx, 0, 0);
      } finally {
        camera.on();
        noTint();
      }
    },
  });

  const won  = game?.won === true || game?.level?.won === true;
  const dead = game?.lost === true || game?.level?.player?.dead === true;

  const elapsedMs = Number(game?.elapsedMs ?? game?.level?.elapsedMs ?? 0);

  if (won)  winScreen?.draw({ elapsedMs, game });
  if (dead) loseScreen?.draw({ elapsedMs, game });
}

// ------------------------------------------------------------
// Input callbacks
// ------------------------------------------------------------

function mousePressed() {
  unlockAudioOnce();
}

function keyPressed(evt) {
  unlockAudioOnce();

  if (evt?.repeat) return preventKeysThatScroll(evt);

  return preventKeysThatScroll(evt);
}

window.addEventListener(
  "keydown",
  (e) => {
    const k = (e.key ?? "").toLowerCase();
    if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      e.preventDefault();
    }
  },
  { passive: false },
);

// ------------------------------------------------------------
// IMPORTANT: expose p5 entrypoints in module scope
// ------------------------------------------------------------

window.setup    = setup;
window.draw     = draw;
window.mousePressed = mousePressed;
window.keyPressed   = keyPressed;
