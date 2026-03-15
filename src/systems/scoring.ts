import type { GameState } from '../types/game-state';
import type { BalanceConstants } from '../types/content';
import type { Resources, ResourceType } from '../types/resources';
import { RESOURCE_TYPES } from '../types/resources';

/**
 * Calculate autonomy score (0-100).
 * Measures how well the settlement functions without direct player intervention.
 */
export function calculateAutonomyScore(
  state: GameState,
  balance: BalanceConstants,
): number {
  const weights = balance.autonomyScoreWeights;

  // Delegation rate: what fraction of initiatives are delegated vs overseen
  const totalInits = state.activeInitiatives.length;
  const delegated = state.activeInitiatives.filter((i) => !i.overseen).length;
  const delegationRate = totalInits > 0 ? delegated / totalInits : 0.5;
  const delegationScore = delegationRate * 100;

  // Leader trust: average trust across assigned leaders
  const assignedLeaders = state.leaders.filter((l) => l.assignedDepartmentId);
  const avgTrust =
    assignedLeaders.length > 0
      ? assignedLeaders.reduce((sum, l) => sum + l.trust, 0) / assignedLeaders.length
      : 50;

  // Resource stability: average resource level
  const avgResources = resourceAverage(state.resources);

  // Department health: average health
  const avgDeptHealth =
    state.departments.length > 0
      ? state.departments.reduce((sum, d) => sum + d.health, 0) / state.departments.length
      : 50;

  // Initiative success: based on remaining attention (less spent = more delegated)
  const attentionEfficiency =
    state.attention.budget > 0
      ? (state.attention.remaining / state.attention.budget) * 100
      : 50;

  const score =
    delegationScore * (weights.delegationRate ?? 0.3) +
    avgTrust * (weights.leaderTrust ?? 0.25) +
    avgResources * (weights.resourceStability ?? 0.2) +
    avgDeptHealth * (weights.departmentHealth ?? 0.15) +
    attentionEfficiency * (weights.initiativeSuccess ?? 0.1);

  return Math.round(Math.max(0, Math.min(100, score)));
}

/** Check win condition: autonomy >= 80 for 3 consecutive weeks */
export function checkWinCondition(
  autonomyScore: number,
  streakWeeks: number,
): { won: boolean; newStreak: number } {
  if (autonomyScore >= 80) {
    const newStreak = streakWeeks + 1;
    return { won: newStreak >= 3, newStreak };
  }
  return { won: false, newStreak: 0 };
}

/** Check loss condition: any critical resource hits 0 */
export function checkLossCondition(resources: Resources): boolean {
  return RESOURCE_TYPES.some((key) => resources[key] <= 0);
}

/**
 * Calculate composite run score (0-10000).
 * Factors in weeks-to-win, resources, leader health, events handled.
 */
export function calculateRunScore(
  state: GameState,
  eventsResolved: number,
): number {
  const weekBonus = Math.max(0, 2000 - state.turn.week * 100);
  const resourceScore = resourceAverage(state.resources) * 30;
  const leaderScore =
    state.leaders.reduce((sum, l) => sum + (100 - l.fatigue), 0) *
    (20 / Math.max(1, state.leaders.length));
  const eventScore = eventsResolved * 50;
  const autonomyBonus = state.autonomyScore * 20;

  return Math.round(
    Math.max(0, Math.min(10000, weekBonus + resourceScore + leaderScore + eventScore + autonomyBonus)),
  );
}

function resourceAverage(resources: Resources): number {
  let sum = 0;
  for (const key of RESOURCE_TYPES) {
    sum += resources[key];
  }
  return sum / RESOURCE_TYPES.length;
}
