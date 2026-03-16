import { describe, it, expect } from 'vitest';
import { createGameStore } from '../../src/engine/game-store';
import { rootReducer } from '../../src/engine/reducer';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';
import type { Action } from '../../src/types/actions';

function createTestState(overrides?: Partial<GameState>): GameState {
  return {
    turn: { week: 1, phase: GamePhase.Review, phaseIndex: 3 },
    resources: { ...DEFAULT_RESOURCES },
    previousResources: null,
    departments: [
      { id: 'operations', health: 60, assignedLeaderId: 'l1', activeInitiativeIds: [], unlockedAtWeek: 1 },
      { id: 'infrastructure', health: 55, assignedLeaderId: null, activeInitiativeIds: [], unlockedAtWeek: 1 },
    ],
    leaders: [
      { id: 'l1', name: 'Leader A', fatigue: 30, trust: 55, assignedDepartmentId: 'operations', availableAtWeek: 1 },
      { id: 'l2', name: 'Leader B', fatigue: 0, trust: 50, assignedDepartmentId: null, availableAtWeek: 1 },
    ],
    attention: { budget: 10, remaining: 4 },
    activeInitiatives: [
      { definitionId: 'init-1', departmentId: 'operations', assignedLeaderId: 'l1', weeksRemaining: 1, overseen: false },
    ],
    activeEvents: [],
    firedEventIds: [],
    lastCompletedInitiatives: [],
    hintsShown: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed: 42,
    ...overrides,
  };
}

function tickWeekAction(overrides?: Partial<Extract<Action, { type: 'TICK_WEEK' }>>): Extract<Action, { type: 'TICK_WEEK' }> {
  return {
    type: 'TICK_WEEK',
    departments: [
      { id: 'operations', health: 61, assignedLeaderId: 'l1', activeInitiativeIds: [], unlockedAtWeek: 1 },
      { id: 'infrastructure', health: 50, assignedLeaderId: null, activeInitiativeIds: [], unlockedAtWeek: 1 },
    ],
    leaders: [
      { id: 'l1', name: 'Leader A', fatigue: 50, trust: 58, assignedDepartmentId: 'operations', availableAtWeek: 1 },
      { id: 'l2', name: 'Leader B', fatigue: 0, trust: 50, assignedDepartmentId: null, availableAtWeek: 1 },
    ],
    activeInitiatives: [],
    completedInitiativeEffects: { resilience: 6, materials: -5 },
    drawnEvents: [{ definitionId: 'event-1', resolved: false, chosenOptionIndex: null }],
    newFiredEventIds: ['event-1'],
    completedInitiatives: [
      { definitionId: 'init-1', leaderId: 'l1', overseen: false, outcome: 'success' },
    ],
    newAttentionBudget: 10,
    autonomyScore: 55,
    autonomyStreakWeeks: 0,
    outcome: null,
    ...overrides,
  };
}

describe('TICK_WEEK integration', () => {
  it('updates all state fields correctly', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch(tickWeekAction());
    const state = store.getState();

    // Departments updated
    expect(state.departments[0].health).toBe(61);
    expect(state.departments[1].health).toBe(50);

    // Leaders updated (fatigue, trust)
    expect(state.leaders[0].fatigue).toBe(50);
    expect(state.leaders[0].trust).toBe(58);

    // Initiatives cleared (completed)
    expect(state.activeInitiatives).toHaveLength(0);

    // Events drawn for next week
    expect(state.activeEvents).toHaveLength(1);
    expect(state.activeEvents[0].definitionId).toBe('event-1');

    // Fired event IDs tracked
    expect(state.firedEventIds).toContain('event-1');

    // Completed initiatives recorded
    expect(state.lastCompletedInitiatives).toHaveLength(1);
    expect(state.lastCompletedInitiatives[0].outcome).toBe('success');

    // Resource effects applied
    expect(state.resources.resilience).toBe(56); // 50 + 6
    expect(state.resources.materials).toBe(45); // 50 - 5

    // Attention reset
    expect(state.attention.budget).toBe(10);
    expect(state.attention.remaining).toBe(10);

    // Autonomy updated
    expect(state.autonomyScore).toBe(55);

    // Previous resources saved
    expect(state.previousResources).toEqual(DEFAULT_RESOURCES);
  });

  it('preserves outcome when set', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch(tickWeekAction({ outcome: 'loss' }));
    expect(store.getState().outcome).toBe('loss');
  });

  it('clamps resources after effects', () => {
    const store = createGameStore(
      createTestState({ resources: { ...DEFAULT_RESOURCES, materials: 3 } }),
      rootReducer,
    );
    store.dispatch(tickWeekAction({ completedInitiativeEffects: { materials: -10 } }));
    expect(store.getState().resources.materials).toBe(0); // clamped, not -7
  });

  it('START_INITIATIVE adds to activeInitiatives and department', () => {
    const store = createGameStore(createTestState({ activeInitiatives: [] }), rootReducer);
    store.dispatch({
      type: 'START_INITIATIVE',
      initiativeId: 'init-test',
      departmentId: 'operations',
      leaderId: 'l1',
      duration: 2,
      overseen: false,
    });
    const state = store.getState();
    expect(state.activeInitiatives).toHaveLength(1);
    expect(state.activeInitiatives[0].definitionId).toBe('init-test');
    expect(state.activeInitiatives[0].overseen).toBe(false);
    expect(state.departments[0].activeInitiativeIds).toContain('init-test');
  });

  it('REST_LEADER reduces fatigue by 25', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'REST_LEADER', leaderId: 'l1' });
    expect(store.getState().leaders[0].fatigue).toBe(5); // 30 - 25
  });

  it('REST_LEADER clamps fatigue to 0', () => {
    const store = createGameStore(
      createTestState({
        leaders: [
          { id: 'l1', name: 'A', fatigue: 10, trust: 50, assignedDepartmentId: 'operations', availableAtWeek: 1 },
          { id: 'l2', name: 'B', fatigue: 0, trust: 50, assignedDepartmentId: null, availableAtWeek: 1 },
        ],
      }),
      rootReducer,
    );
    store.dispatch({ type: 'REST_LEADER', leaderId: 'l1' });
    expect(store.getState().leaders[0].fatigue).toBe(0);
  });

  it('MARK_HINT_SHOWN adds to hintsShown', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'MARK_HINT_SHOWN', hintId: 'first-observe' });
    expect(store.getState().hintsShown).toContain('first-observe');
  });

  it('APPLY_EFFECTS modifies resources with clamping', () => {
    const store = createGameStore(createTestState(), rootReducer);
    store.dispatch({ type: 'APPLY_EFFECTS', effects: { trust: 60 } });
    expect(store.getState().resources.trust).toBe(100); // 50 + 60, clamped to 100
  });
});
