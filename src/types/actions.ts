import type { Department } from './departments';
import type { Leader } from './leaders';
import type { ActiveEvent } from './events';
import type { ActiveInitiative } from './initiatives';
import type { Resources } from './resources';

export type Action =
  | { type: 'ADVANCE_PHASE' }
  | { type: 'ASSIGN_LEADER'; leaderId: string; departmentId: string }
  | { type: 'UNASSIGN_LEADER'; leaderId: string }
  | { type: 'START_INITIATIVE'; initiativeId: string; departmentId: string; leaderId: string | null; duration: number; overseen: boolean }
  | { type: 'SPEND_ATTENTION'; amount: number; target: string }
  | { type: 'RESOLVE_EVENT'; eventId: string; choiceIndex: number }
  | {
      type: 'TICK_WEEK';
      departments: Department[];
      leaders: Leader[];
      activeInitiatives: ActiveInitiative[];
      completedInitiativeEffects: Partial<Resources>;
      drawnEvents: ActiveEvent[];
      newFiredEventIds: string[];
      newAttentionBudget: number;
      autonomyScore: number;
      autonomyStreakWeeks: number;
      outcome: 'win' | 'loss' | null;
    }
  | { type: 'REST_LEADER'; leaderId: string }
  | { type: 'APPLY_EFFECTS'; effects: Partial<Resources> }
  | { type: 'LOAD_STATE'; state: import('./game-state').GameState };
