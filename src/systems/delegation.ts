import type { LeaderStats } from '../types/leaders';
import type { BalanceConstants } from '../types/content';

/**
 * Calculate delegation quality score (0-1) based on leader stats.
 * Higher score = better autonomous outcome.
 */
export function calculateDelegationQuality(
  stats: LeaderStats,
  fatigue: number,
  trust: number,
  weights: Record<string, number>,
): number {
  const statKeys = Object.keys(weights) as Array<keyof LeaderStats>;
  let weighted = 0;
  let totalWeight = 0;

  for (const key of statKeys) {
    const stat = stats[key] ?? 5;
    const weight = weights[key] ?? 0;
    weighted += (stat / 10) * weight;
    totalWeight += weight;
  }

  const baseQuality = totalWeight > 0 ? weighted / totalWeight : 0.5;

  // Fatigue penalty: quality drops linearly above 50 fatigue
  const fatiguePenalty = fatigue > 50 ? ((fatigue - 50) / 50) * 0.3 : 0;

  // Trust bonus: quality improves linearly above 50 trust
  const trustBonus = trust > 50 ? ((trust - 50) / 50) * 0.15 : 0;

  return Math.max(0, Math.min(1, baseQuality - fatiguePenalty + trustBonus));
}

/**
 * Determine delegation outcome tier based on quality score.
 */
export function getDelegationOutcome(
  quality: number,
): 'success' | 'partial' | 'failure' {
  if (quality >= 0.75) return 'success';
  if (quality >= 0.45) return 'partial';
  return 'failure';
}

/**
 * Scale resource effects based on delegation quality.
 * Full effects for success, reduced for partial, minimal for failure.
 */
export function scaleEffects(
  effects: Record<string, number>,
  outcome: 'success' | 'partial' | 'failure',
): Record<string, number> {
  const multiplier = outcome === 'success' ? 1.0 : outcome === 'partial' ? 0.6 : 0.25;
  const scaled: Record<string, number> = {};
  for (const [key, value] of Object.entries(effects)) {
    // Costs (negative values) are not reduced — you always pay full price
    scaled[key] = value >= 0 ? Math.round(value * multiplier) : value;
  }
  return scaled;
}
