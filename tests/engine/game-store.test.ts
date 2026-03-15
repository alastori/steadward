import { describe, it, expect } from 'vitest';
import { createGameStore } from '../../src/engine/game-store';
import { rootReducer } from '../../src/engine/reducer';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';

function createTestState(): GameState {
  return {
    turn: { week: 1, phase: GamePhase.Observe, phaseIndex: 0 },
    resources: { ...DEFAULT_RESOURCES },
    previousResources: null,
    departments: [],
    leaders: [],
    attention: { budget: 10, remaining: 10 },
    activeInitiatives: [],
    activeEvents: [],
    firedEventIds: [],
    lastCompletedInitiatives: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed: 42,
  };
}

describe('GameStore', () => {
  it('returns initial state', () => {
    const store = createGameStore(createTestState(), rootReducer);
    expect(store.getState().turn.week).toBe(1);
    expect(store.getState().seed).toBe(42);
  });

  it('dispatches ADVANCE_PHASE', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'ADVANCE_PHASE' });
    expect(store.getState().turn.phase).toBe(GamePhase.Plan);
  });

  it('cycles through all phases and increments week', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'ADVANCE_PHASE' }); // Plan
    store.dispatch({ type: 'ADVANCE_PHASE' }); // Execute
    store.dispatch({ type: 'ADVANCE_PHASE' }); // Review
    store.dispatch({ type: 'ADVANCE_PHASE' }); // Observe (week 2)
    expect(store.getState().turn.phase).toBe(GamePhase.Observe);
    expect(store.getState().turn.week).toBe(2);
  });

  it('notifies subscribers on dispatch', () => {
    const store = createGameStore(createTestState(), rootReducer);
    let notified = false;
    store.subscribe(() => { notified = true; });
    store.dispatch({ type: 'ADVANCE_PHASE' });
    expect(notified).toBe(true);
  });

  it('unsubscribe stops notifications', () => {
    const store = createGameStore(createTestState(), rootReducer);
    let count = 0;
    const unsub = store.subscribe(() => { count++; });
    store.dispatch({ type: 'ADVANCE_PHASE' });
    unsub();
    store.dispatch({ type: 'ADVANCE_PHASE' });
    expect(count).toBe(1);
  });

  it('records action log', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'ADVANCE_PHASE' });
    store.dispatch({ type: 'SPEND_ATTENTION', amount: 3, target: 'test' });
    expect(store.getActionLog()).toHaveLength(2);
    expect(store.getActionLog()[0].action.type).toBe('ADVANCE_PHASE');
  });

  it('SPEND_ATTENTION reduces remaining', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'SPEND_ATTENTION', amount: 3, target: 'test' });
    expect(store.getState().attention.remaining).toBe(7);
  });

  it('SPEND_ATTENTION clamps to zero', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'SPEND_ATTENTION', amount: 15, target: 'test' });
    expect(store.getState().attention.remaining).toBe(0);
  });

  it('LOAD_STATE replaces entire state', () => {
    const store = createGameStore(createTestState(), rootReducer);
    const newState = createTestState();
    newState.turn.week = 5;
    newState.seed = 999;
    store.dispatch({ type: 'LOAD_STATE', state: newState });
    expect(store.getState().turn.week).toBe(5);
    expect(store.getState().seed).toBe(999);
  });
});
