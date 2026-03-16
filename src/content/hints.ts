import type { GameState } from '../types/game-state';
import { GamePhase } from '../types/modes';

export interface ContextualHint {
  id: string;
  trigger: (state: GameState) => boolean;
  mode?: GamePhase | GamePhase[];
  text: string;
  priority: number;
}

export const HINTS: ContextualHint[] = [
  {
    id: 'first-observe',
    trigger: (s) => s.turn.week === 1 && s.turn.phase === GamePhase.Observe,
    mode: GamePhase.Observe,
    text: 'Your settlement. The bars on the left track your resources. Two departments are operational. When you\'ve seen enough, advance to Plan.',
    priority: 1,
  },
  {
    id: 'first-plan',
    trigger: (s) => s.turn.week === 1 && s.turn.phase === GamePhase.Plan,
    mode: GamePhase.Plan,
    text: 'Each initiative can be overseen or delegated. Overseeing costs attention but gives better results. Delegating is free but depends on the leader\'s stats.',
    priority: 1,
  },
  {
    id: 'first-event',
    trigger: (s) => s.turn.phase === GamePhase.Execute && s.activeEvents.length > 0,
    mode: GamePhase.Execute,
    text: 'An interruption. Read the options. Each costs attention and changes resources. Or let it pass.',
    priority: 1,
  },
  {
    id: 'first-review',
    trigger: (s) => s.turn.week === 1 && s.turn.phase === GamePhase.Review,
    mode: GamePhase.Review,
    text: 'Autonomy measures how well the settlement runs without you. Reach 80 and sustain it for three weeks.',
    priority: 1,
  },
  {
    id: 'dept-unlock',
    trigger: (s) => s.turn.week === 2 && s.turn.phase === GamePhase.Observe,
    mode: GamePhase.Observe,
    text: 'Research is now active. Dr. Fen Vasara is available. More departments mean more to manage — and more to delegate.',
    priority: 2,
  },
  {
    id: 'resource-low',
    trigger: (s) => Object.values(s.resources).some((v) => typeof v === 'number' && v <= 25 && v > 0),
    text: 'A resource is running low. If any critical resource reaches zero, the settlement fails.',
    priority: 3,
  },
  {
    id: 'leader-fatigued',
    trigger: (s) => s.leaders.some((l) => l.fatigue >= 50),
    mode: [GamePhase.Observe, GamePhase.Plan],
    text: 'A leader is wearing down. Fatigued leaders produce worse outcomes. Rest them during Plan phase to recover.',
    priority: 4,
  },
  {
    id: 'attention-depleted',
    trigger: (s) => s.turn.phase === GamePhase.Execute && s.attention.remaining === 0 && s.activeEvents.some((e) => !e.resolved),
    mode: GamePhase.Execute,
    text: 'No attention remaining. Unresolved events will play out on their own.',
    priority: 3,
  },
  {
    id: 'autonomy-rising',
    trigger: (s) => s.autonomyScore >= 55,
    mode: GamePhase.Review,
    text: 'Autonomy is climbing. The settlement is learning to function without constant oversight. Keep delegating.',
    priority: 5,
  },
  {
    id: 'week3-full-roster',
    trigger: (s) => s.turn.week === 3 && s.turn.phase === GamePhase.Observe,
    mode: GamePhase.Observe,
    text: 'External Affairs is online. All departments active, full leader roster available. The real challenge starts now.',
    priority: 2,
  },
];

/** Get the highest-priority hint that should show for the current state */
export function getActiveHint(state: GameState): ContextualHint | null {
  const shownIds = new Set(state.hintsShown);

  const eligible = HINTS.filter((hint) => {
    if (shownIds.has(hint.id)) return false;
    if (hint.mode) {
      const modes = Array.isArray(hint.mode) ? hint.mode : [hint.mode];
      if (!modes.includes(state.turn.phase)) return false;
    }
    return hint.trigger(state);
  });

  if (eligible.length === 0) return null;
  eligible.sort((a, b) => a.priority - b.priority);
  return eligible[0];
}
