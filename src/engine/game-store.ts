import type { GameState } from '../types/game-state';
import type { Action } from '../types/actions';

export interface ActionLogEntry {
  action: Action;
  timestamp: number;
  highlight?: boolean;
}

export type Reducer = (state: GameState, action: Action) => GameState;
export type Listener = (state: GameState, action: Action) => void;

export interface GameStore {
  getState(): GameState;
  dispatch(action: Action): void;
  subscribe(listener: Listener): () => void;
  getActionLog(): ReadonlyArray<ActionLogEntry>;
  getHighlights(): ReadonlyArray<ActionLogEntry>;
}

export function createGameStore(initialState: GameState, reducer: Reducer): GameStore {
  let state = initialState;
  const listeners = new Set<Listener>();
  const actionLog: ActionLogEntry[] = [];

  return {
    getState: () => state,

    dispatch(action: Action) {
      const prevState = state;
      state = reducer(state, action);
      const highlight = isHighlightAction(state, prevState, action);
      actionLog.push({ action, timestamp: Date.now(), highlight });
      listeners.forEach((fn) => fn(state, action));
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getActionLog: () => actionLog,
    getHighlights: () => actionLog.filter((e) => e.highlight),
  };
}

function isHighlightAction(newState: GameState, prevState: GameState, action: Action): boolean {
  // Resource dropped below 20 (danger zone)
  for (const key of Object.keys(newState.resources) as Array<keyof typeof newState.resources>) {
    if (newState.resources[key] < 20 && prevState.resources[key] >= 20) return true;
  }

  // Leader burned out
  if (action.type === 'TICK_WEEK') {
    for (const leader of newState.leaders) {
      const prev = prevState.leaders.find((l) => l.id === leader.id);
      if (leader.fatigue >= 100 && prev && prev.fatigue < 100) return true;
    }
  }

  // Win or loss triggered
  if (newState.outcome && !prevState.outcome) return true;

  return false;
}
