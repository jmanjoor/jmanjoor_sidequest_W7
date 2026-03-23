// src/DebugOverlay.js
// Week 9 — Debug overlay (VIEW tool, driven by SYSTEM events).
//
// Responsibilities:
// - Render debug info in screen-space (camera.off())
// - Visualize hitboxes in world-space (camera on, drawn first)
// - Toggle visibility via debugTogglePressed (D or T key)
// - Show invincibility status
// - Log events from EventBus wildcard "*"
//
// Non-goals:
// - Does NOT change world state, physics, or outcomes
// - Does NOT own input polling (InputManager does)

export class DebugOverlay {
  constructor() {
    this.enabled = false;

    // ring buffer for recent EventBus events
    this.lines = [];
    this.maxLines = 3;
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  // Called by Game when any EventBus event fires (wildcard "*")
  log(evt) {
    if (!evt) return;
    this.lines.push(evt.name);          // newest at end
    if (this.lines.length > this.maxLines) this.lines.shift(); // drop oldest
  }

  // ─────────────────────────────────────────────────────────────
  // Main draw — called from Game.draw() while camera is ON
  // ─────────────────────────────────────────────────────────────
  draw({ game } = {}) {
    if (!this.enabled) return;

    // 1. Hitboxes in world-space (camera must be ON here)
    this._drawHitboxes(game);

    // 2. HUD panel in screen-space
    camera.off();
    push();
    this._drawPanel(game);
    pop();
    camera.on();
  }

  // ─────────────────────────────────────────────────────────────
  // Hitbox visualization — drawn BEFORE camera.off()
  // ─────────────────────────────────────────────────────────────
  _drawHitboxes(game) {
    const lvl = game?.level;
    if (!lvl) return;

    push();
    noFill();
    strokeWeight(1);
    rectMode(CENTER);

    // Player — bright green
    const pSprite = lvl.playerCtrl?.sprite;
    if (pSprite) {
      stroke(0, 255, 80);
      const pw = pSprite.width ?? pSprite.w ?? 18;
      const ph = pSprite.height ?? pSprite.h ?? 12;
      rect(pSprite.x, pSprite.y, pw, ph);
    }

    // Enemies (boars) — red; skip fully dead/removed ones
    if (lvl.boar) {
      stroke(255, 50, 50);
      for (const e of lvl.boar) {
        if (e.dead && e.visible === false) continue;
        const ew = e.width ?? e.w ?? 18;
        const eh = e.height ?? e.h ?? 12;
        rect(e.x, e.y, ew, eh);
      }
    }

    // Leaves — yellow; skip collected ones
    if (lvl.leaf) {
      stroke(255, 230, 0);
      for (const l of lvl.leaf) {
        if (l.active === false || l.visible === false) continue;
        const lw = l.width ?? l.w ?? 16;
        const lh = l.height ?? l.h ?? 16;
        rect(l.x, l.y, lw, lh);
      }
    }

    pop();
  }

  // ─────────────────────────────────────────────────────────────
  // HUD panel — drawn in screen-space (camera is OFF here)
  // ─────────────────────────────────────────────────────────────
  _drawPanel(game) {
    // ── gather data ───────────────────────────────────────────
    const lvl = game?.level ?? null;
    const playerCtrl = lvl?.playerCtrl ?? null;
    const player = playerCtrl?.player ?? null;
    const pSprite = playerCtrl?.sprite ?? null;

    const px  = pSprite ? Math.round(pSprite.x)          : "?";
    const py  = pSprite ? Math.round(pSprite.y)          : "?";
    const pvx = pSprite ? pSprite.vel.x.toFixed(1)       : "?";
    const pvy = pSprite ? pSprite.vel.y.toFixed(1)       : "?";

    const hp     = player?.health    ?? "?";
    const maxHp  = player?.maxHealth ?? "?";
    const invinc = player?.invincible === true;

    const score    = lvl?.score    ?? 0;
    const winScore = lvl?.WIN_SCORE ?? "?";

    // count live enemies
    let enemyCount = 0;
    if (lvl?.boar) {
      for (const e of lvl.boar) {
        if (!e.dead) enemyCount++;
      }
    }

    // count visible leaves
    let leafCount = 0;
    if (lvl?.leaf) {
      for (const l of lvl.leaf) {
        if (l.active !== false && l.visible !== false) leafCount++;
      }
    }

    // ── layout constants ──────────────────────────────────────
    const BX   = 6;   // box x
    const BY   = 6;   // box y
    const BW   = 218; // box width
    const PAD  = 10;  // left text padding
    const LINE = 11;  // line height

    // Fixed content height (everything except event lines):
    //   22px = header bar height + gap to first line
    //    9 fixed text lines (PLAYER: label+pos+vel+HP, WORLD: label+score+enemies+leaves, EVENTS label)
    //   16px = two 8px dividers
    //    8px = bottom padding
    const FIXED_H = 22 + 9 * LINE + 16 + 8;

    // How many event lines can fit without overflowing the canvas
    const maxBH        = height - BY - 4;
    const spaceForEvt  = maxBH - FIXED_H;
    const maxEvtLines  = Math.max(0, Math.floor(spaceForEvt / LINE));
    const eventsToShow = Math.min(this.lines.length, maxEvtLines);

    // Final clamped panel height
    const BH = Math.min(FIXED_H + (eventsToShow > 0 ? eventsToShow : 1) * LINE, maxBH);

    // Safe bottom boundary — no text must render below this y
    const maxRenderY = BY + BH - 4;

    // ── background panel ──────────────────────────────────────
    noStroke();

    // outer shadow/border
    fill(0, 0, 0, 60);
    rect(BX + 2, BY + 2, BW, BH, 6);

    // main panel background — low opacity per spec
    fill(0, 0, 0, 80);
    rect(BX, BY, BW, BH, 6);

    // header bar
    fill(0, 200, 80, 220);
    rect(BX, BY, BW, 16, 6, 6, 0, 0);

    // ── header text — single left-aligned line to avoid overlap ──
    textSize(10);
    noStroke();
    fill(10, 18, 28);
    textAlign(LEFT, TOP);
    text(" DEBUG MODE  [D] [I]", BX + PAD - 4, BY + 3);

    // ── section: PLAYER ───────────────────────────────────────
    let ty = BY + 22;

    fill(120, 200, 255); // section label color
    text("PLAYER", BX + PAD, ty);
    ty += LINE;

    fill(200, 230, 200); // label color
    text("pos", BX + PAD, ty);
    fill(255);           // value color
    text(`x=${px}   y=${py}`, BX + PAD + 34, ty);
    ty += LINE;

    fill(200, 230, 200);
    text("vel", BX + PAD, ty);
    fill(255);
    text(`vx=${pvx}   vy=${pvy}`, BX + PAD + 34, ty);
    ty += LINE;

    fill(200, 230, 200);
    text("HP", BX + PAD, ty);
    // color HP: green when full, yellow when half, red when low
    const hpRatio = Number(hp) / Number(maxHp) || 0;
    if (hpRatio > 0.6)       fill(80, 255, 80);
    else if (hpRatio > 0.3)  fill(255, 220, 0);
    else                     fill(255, 60, 60);
    text(`${hp} / ${maxHp}`, BX + PAD + 34, ty);

    // invincibility badge on the same row
    if (invinc) {
      fill(255, 215, 0);
      text("[INVINCIBLE]", BX + PAD + 100, ty);
    }
    ty += LINE;

    // ── divider ───────────────────────────────────────────────
    stroke(60, 90, 60);
    strokeWeight(1);
    line(BX + PAD, ty + 2, BX + BW - PAD, ty + 2);
    noStroke();
    ty += 8;

    // ── section: WORLD ────────────────────────────────────────
    fill(120, 200, 255);
    text("WORLD", BX + PAD, ty);
    ty += LINE;

    fill(200, 230, 200);
    text("Score", BX + PAD, ty);
    fill(255);
    text(`${score} / ${winScore}`, BX + PAD + 50, ty);
    ty += LINE;

    fill(200, 230, 200);
    text("Enemies", BX + PAD, ty);
    fill(enemyCount > 0 ? color(255, 120, 80) : color(180));
    text(`${enemyCount}`, BX + PAD + 50, ty);
    ty += LINE;

    fill(200, 230, 200);
    text("Leaves", BX + PAD, ty);
    fill(leafCount > 0 ? color(255, 230, 0) : color(180));
    text(`${leafCount}`, BX + PAD + 50, ty);
    ty += LINE;

    // ── divider ───────────────────────────────────────────────
    stroke(60, 90, 60);
    strokeWeight(1);
    line(BX + PAD, ty + 2, BX + BW - PAD, ty + 2);
    noStroke();
    ty += 8;

    // ── section: EVENTS ───────────────────────────────────────
    if (ty >= maxRenderY) return; // no space left — skip entirely
    fill(120, 200, 255);
    text("EVENTS", BX + PAD, ty);
    ty += LINE;

    // Render oldest→newest; stop at panel boundary
    const visibleLines = this.lines.slice(-eventsToShow); // newest N events
    fill(160, 210, 160);
    for (const evtLine of visibleLines) {
      if (ty + LINE > maxRenderY) break; // clip guard — never draw past panel
      text(evtLine, BX + PAD, ty);
      ty += LINE;
    }
    if (this.lines.length === 0 && ty + LINE <= maxRenderY) {
      fill(80, 100, 80);
      text("(none yet)", BX + PAD, ty);
    }
  }
}
