import type { GameState } from '../types/game-state';
import type { Action } from '../types/actions';
import type { GameStore } from '../engine/game-store';
import type { AnalyticsEvent } from './events';
import { GamePhase } from '../types/modes';

type SendFn = (event: AnalyticsEvent) => void;

function createPlausibleSender(): SendFn {
  return (event: AnalyticsEvent) => {
    // Plausible Analytics custom event API
    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as Record<string, unknown>).plausible as
        | ((name: string, opts: { props: Record<string, unknown> }) => void)
        | undefined;
      plausible?.(event.name, { props: event.props });
    }
  };
}

export function wireAnalytics(store: GameStore, send?: SendFn): () => void {
  const sender = send ?? createPlausibleSender();

  return store.subscribe((state: GameState, action: Action) => {
    if (action.type === 'ADVANCE_PHASE') {
      sender({
        name: 'phase_advance',
        props: { phase: state.turn.phase, week: state.turn.week },
      });

      // Week complete when cycling back to Observe (new week started)
      if (state.turn.phase === GamePhase.Observe && state.turn.week > 1) {
        sender({
          name: 'week_complete',
          props: {
            week: state.turn.week - 1,
            autonomyScore: state.autonomyScore,
          },
        });
      }
    }
  });
}
