import { Howl } from 'howler';
import type { GameState } from '../types/game-state';
import type { Action } from '../types/actions';
import type { GameStore } from '../engine/game-store';
import type { UserPreferences } from '../types/game-state';
import { MODE_TRACKS, SFX } from './audio-config';

interface AudioState {
  currentMode: string | null;
  modeHowl: Howl | null;
  sfxCache: Map<string, Howl>;
  muted: boolean;
}

function createHowl(src: string, volume: number, loop: boolean): Howl {
  return new Howl({ src: [src], volume, loop, preload: true });
}

function loadSfx(state: AudioState): void {
  for (const [key, def] of Object.entries(SFX)) {
    state.sfxCache.set(key, createHowl(def.src, def.volume, false));
  }
}

function playSfx(state: AudioState, id: string): void {
  if (state.muted) return;
  const howl = state.sfxCache.get(id);
  howl?.play();
}

function switchAmbient(state: AudioState, mode: string): void {
  if (state.currentMode === mode) return;
  state.currentMode = mode;

  // Fade out current
  if (state.modeHowl) {
    const old = state.modeHowl;
    old.fade(old.volume(), 0, 800);
    setTimeout(() => old.stop(), 800);
  }

  // Start new
  const track = MODE_TRACKS[mode];
  if (!track) return;
  state.modeHowl = createHowl(track.src, 0, track.loop);
  state.modeHowl.play();
  state.modeHowl.fade(0, track.volume, 800);
}

/**
 * Wire audio as a store subscriber. Call once at startup.
 * Silently fails if audio files are missing (placeholder setup).
 */
export function wireAudio(store: GameStore, prefs?: UserPreferences): () => void {
  const audioState: AudioState = {
    currentMode: null,
    modeHowl: null,
    sfxCache: new Map(),
    muted: prefs?.volumeMaster === 0,
  };

  // Pre-load SFX (fails silently if files don't exist)
  try {
    loadSfx(audioState);
  } catch {
    // Audio files not yet produced — fail silently
  }

  return store.subscribe((gameState: GameState, action: Action) => {
    // Switch ambient on phase change
    if (action.type === 'ADVANCE_PHASE' || action.type === 'TICK_WEEK') {
      switchAmbient(audioState, gameState.turn.phase);
      if (action.type === 'ADVANCE_PHASE') {
        playSfx(audioState, 'advance');
      }
      if (action.type === 'TICK_WEEK') {
        playSfx(audioState, 'weekEnd');
      }
    }

    // SFX on specific actions
    if (action.type === 'START_INITIATIVE') {
      playSfx(audioState, 'startInit');
    }
    if (action.type === 'RESOLVE_EVENT') {
      playSfx(audioState, 'eventResolve');
    }
  });
}
