// src/SoundManager.js
// Audio playback (SYSTEM layer).
//
// Responsibilities:
// - Load sound assets during preload() (via loadSound)
// - Play sounds by key (SFX/music)
// - Provide a simple abstraction so gameplay code never touches audio directly
//
// Non-goals:
// - Does NOT subscribe to EventBus directly (Game wires events → play())
// - Does NOT decide when events happen (WORLD logic emits events)
// - Does NOT manage UI
//
// Architectural notes:
// - Game connects EventBus events (leaf:collected, player:damaged, etc.) to SoundManager.play().
// - This keeps audio concerns isolated from gameplay and supports easy swapping/muting.

export class SoundManager {
  constructor() {
    this.sfx = {};
  }

  load(name, path) {
    this.sfx[name] = loadSound(
      path,
      () => {
        const track = this.sfx[name];
        if (!track) return;
        track._ready = true;
        if (track._loopWanted) {
          track.setLoop(true);
        }
        if (track._playWanted) {
          track.play();
          track._playWanted = false;
        }
      },
      (err) => {
        console.warn(`Failed to load sound '${name}' at '${path}':`, err);
      },
    );

    this.sfx[name]._ready = false;
    this.sfx[name]._playWanted = false;
    this.sfx[name]._loopWanted = false;
  }

  setLoop(name, shouldLoop = true) {
    const track = this.sfx[name];
    if (!track) return;
    track._loopWanted = shouldLoop;
    if (track.isLoaded && track.isLoaded()) {
      track.setLoop(shouldLoop);
    }
  }

  play(name) {
    const track = this.sfx[name];
    if (!track) return;

    if (track.isLoaded && track.isLoaded()) {
      if (!track.isPlaying || !track.isPlaying()) {
        track.play();
      }
      return;
    }

    console.warn(`Sound '${name}' not ready yet; queuing play once ready.`);
    track._playWanted = true;
  }
}
