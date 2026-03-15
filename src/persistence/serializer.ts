import type { GameState } from '../types/game-state';
import type { ActionLogEntry } from '../engine/game-store';

export const CURRENT_SAVE_VERSION = 1;

export interface SaveFile {
  version: number;
  savedAt: string;
  seed: number;
  gameState: GameState;
  actionLog?: ActionLogEntry[];
  metadata: {
    weekNumber: number;
    autonomyScore: number;
    runScore: number;
    playTimeSeconds: number;
    contentPacks: string[];
  };
}

export function createSaveFile(
  gameState: GameState,
  actionLog?: ActionLogEntry[],
): SaveFile {
  return {
    version: CURRENT_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    seed: gameState.seed,
    gameState,
    actionLog,
    metadata: {
      weekNumber: gameState.turn.week,
      autonomyScore: gameState.autonomyScore,
      runScore: 0,
      playTimeSeconds: 0,
      contentPacks: ['base'],
    },
  };
}

export interface SaveMetadata {
  slotId: string;
  savedAt: string;
  weekNumber: number;
  autonomyScore: number;
}
