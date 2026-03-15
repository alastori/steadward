import type { GameState } from '../types/game-state';
import type { BalanceConstants } from '../types/content';

/** Calculate the attention budget for a given week based on clarity */
export function calculateAttentionBudget(
  clarity: number,
  balance: BalanceConstants,
): number {
  const modifier = (clarity - 50) * balance.clarityAttentionModifier;
  return Math.max(1, Math.round(balance.baseAttentionBudget + modifier));
}

/** Check if an attention spend is valid */
export function canSpendAttention(state: GameState, amount: number): boolean {
  return state.attention.remaining >= amount && amount > 0;
}

/** Apply an attention spend, clamping to zero */
export function spendAttention(
  state: GameState,
  amount: number,
): GameState {
  return {
    ...state,
    attention: {
      ...state.attention,
      remaining: Math.max(0, state.attention.remaining - amount),
    },
  };
}

/** Reset attention for a new week */
export function resetAttention(
  state: GameState,
  balance: BalanceConstants,
): GameState {
  const budget = calculateAttentionBudget(state.resources.clarity, balance);
  return {
    ...state,
    attention: { budget, remaining: budget },
  };
}
