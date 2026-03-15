import { describe, it, expect } from 'vitest';
import { calculateAttentionBudget, canSpendAttention, spendAttention, resetAttention } from '../../src/systems/attention';
import { BASE_BALANCE } from '../../src/content/base-pack/balance';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';

function makeState(overrides?: Partial<GameState>): GameState {
  return {
    turn: { week: 1, phase: GamePhase.Observe, phaseIndex: 0 },
    resources: { ...DEFAULT_RESOURCES },
    previousResources: null,
    departments: [],
    leaders: [],
    attention: { budget: 10, remaining: 10 },
    activeInitiatives: [],
    activeEvents: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed: 1,
    ...overrides,
  };
}

describe('Attention system', () => {
  it('calculates base budget at clarity 50', () => {
    expect(calculateAttentionBudget(50, BASE_BALANCE)).toBe(10);
  });

  it('increases budget at high clarity', () => {
    expect(calculateAttentionBudget(100, BASE_BALANCE)).toBe(15);
  });

  it('decreases budget at low clarity', () => {
    const budget = calculateAttentionBudget(0, BASE_BALANCE);
    expect(budget).toBe(5);
  });

  it('budget never drops below 1', () => {
    const budget = calculateAttentionBudget(0, { ...BASE_BALANCE, clarityAttentionModifier: 1 });
    expect(budget).toBeGreaterThanOrEqual(1);
  });

  it('canSpendAttention returns true when enough remaining', () => {
    expect(canSpendAttention(makeState(), 5)).toBe(true);
  });

  it('canSpendAttention returns false when not enough', () => {
    expect(canSpendAttention(makeState({ attention: { budget: 10, remaining: 2 } }), 5)).toBe(false);
  });

  it('spendAttention reduces remaining', () => {
    const state = spendAttention(makeState(), 3);
    expect(state.attention.remaining).toBe(7);
  });

  it('spendAttention clamps to zero', () => {
    const state = spendAttention(makeState({ attention: { budget: 10, remaining: 2 } }), 5);
    expect(state.attention.remaining).toBe(0);
  });

  it('resetAttention recalculates budget', () => {
    const state = makeState({ attention: { budget: 10, remaining: 3 } });
    const reset = resetAttention(state, BASE_BALANCE);
    expect(reset.attention.budget).toBe(10);
    expect(reset.attention.remaining).toBe(10);
  });
});
