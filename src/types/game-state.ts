import type { GamePhase } from './modes';
import type { Resources } from './resources';
import type { Department } from './departments';
import type { Leader } from './leaders';
import type { ActiveInitiative } from './initiatives';
import type { ActiveEvent } from './events';

export interface TurnState {
  week: number;
  phase: GamePhase;
  phaseIndex: number;
}

export interface GameState {
  turn: TurnState;
  resources: Resources;
  previousResources: Resources | null;
  departments: Department[];
  leaders: Leader[];
  attention: { budget: number; remaining: number };
  activeInitiatives: ActiveInitiative[];
  activeEvents: ActiveEvent[];
  firedEventIds: string[];
  lastCompletedInitiatives: Array<{
    definitionId: string;
    leaderId: string | null;
    overseen: boolean;
    outcome: 'success' | 'partial' | 'failure' | 'overseen';
  }>;
  autonomyScore: number;
  autonomyStreakWeeks: number;
  hintsShown: string[];
  outcome: 'win' | 'loss' | null;
  seed: number;
}

export interface UserPreferences {
  volumeMaster: number;
  volumeMusic: number;
  volumeSfx: number;
  showHints: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  streamerMode: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  volumeMaster: 0.8,
  volumeMusic: 0.6,
  volumeSfx: 0.8,
  showHints: true,
  highContrast: false,
  reducedMotion: false,
  streamerMode: false,
};
