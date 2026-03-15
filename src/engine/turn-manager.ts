import { GamePhase, PHASE_ORDER } from '../types/modes';
import type { TurnState, GameState } from '../types/game-state';

export function advancePhase(turn: TurnState): TurnState {
  const nextIndex = turn.phaseIndex + 1;
  if (nextIndex >= PHASE_ORDER.length) {
    return {
      week: turn.week + 1,
      phase: PHASE_ORDER[0],
      phaseIndex: 0,
    };
  }
  return {
    ...turn,
    phase: PHASE_ORDER[nextIndex],
    phaseIndex: nextIndex,
  };
}

export type PhaseGuard = (state: GameState) => { valid: boolean; reason?: string };

export const phaseGuards: Record<GamePhase, PhaseGuard> = {
  [GamePhase.Observe]: () => ({ valid: true }),
  [GamePhase.Plan]: (state) => ({
    valid: state.turn.phase === GamePhase.Observe,
    reason: 'Must complete Observe phase first',
  }),
  [GamePhase.Execute]: (state) => ({
    valid: state.turn.phase === GamePhase.Plan,
    reason: 'Must complete Plan phase first',
  }),
  [GamePhase.Review]: (state) => ({
    valid: state.turn.phase === GamePhase.Execute,
    reason: 'Must complete Execute phase first',
  }),
};

export function createInitialTurn(): TurnState {
  return {
    week: 1,
    phase: GamePhase.Observe,
    phaseIndex: 0,
  };
}
