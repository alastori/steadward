import { describe, it, expect } from 'vitest';
import { calculateDelegationQuality, getDelegationOutcome, scaleEffects } from '../../src/systems/delegation';
import { BASE_BALANCE } from '../../src/content/base-pack/balance';
import type { LeaderStats } from '../../src/types/leaders';

const goodStats: LeaderStats = {
  judgment: 8, speed: 7, reliability: 9, adaptability: 6, communication: 7, riskTolerance: 5,
};

const poorStats: LeaderStats = {
  judgment: 3, speed: 3, reliability: 3, adaptability: 3, communication: 3, riskTolerance: 3,
};

describe('Delegation system', () => {
  it('high-stat leader produces high quality', () => {
    const q = calculateDelegationQuality(goodStats, 0, 50, BASE_BALANCE.delegationQualityWeights);
    expect(q).toBeGreaterThan(0.65);
  });

  it('low-stat leader produces low quality', () => {
    const q = calculateDelegationQuality(poorStats, 0, 50, BASE_BALANCE.delegationQualityWeights);
    expect(q).toBeLessThan(0.5);
  });

  it('high fatigue reduces quality', () => {
    const fresh = calculateDelegationQuality(goodStats, 0, 50, BASE_BALANCE.delegationQualityWeights);
    const tired = calculateDelegationQuality(goodStats, 80, 50, BASE_BALANCE.delegationQualityWeights);
    expect(tired).toBeLessThan(fresh);
  });

  it('high trust increases quality', () => {
    const base = calculateDelegationQuality(goodStats, 0, 50, BASE_BALANCE.delegationQualityWeights);
    const trusted = calculateDelegationQuality(goodStats, 0, 90, BASE_BALANCE.delegationQualityWeights);
    expect(trusted).toBeGreaterThan(base);
  });

  it('quality is clamped to 0-1', () => {
    const q = calculateDelegationQuality(goodStats, 0, 100, BASE_BALANCE.delegationQualityWeights);
    expect(q).toBeLessThanOrEqual(1);
    expect(q).toBeGreaterThanOrEqual(0);
  });

  it('getDelegationOutcome returns correct tiers', () => {
    expect(getDelegationOutcome(0.8)).toBe('success');
    expect(getDelegationOutcome(0.5)).toBe('partial');
    expect(getDelegationOutcome(0.2)).toBe('failure');
  });

  it('scaleEffects preserves costs (negative values)', () => {
    const effects = { materials: 10, trust: -5 };
    const scaled = scaleEffects(effects, 'partial');
    expect(scaled.materials).toBe(6); // 10 * 0.6
    expect(scaled.trust).toBe(-5); // costs stay full
  });

  it('scaleEffects at failure gives 25%', () => {
    const effects = { knowledge: 12 };
    const scaled = scaleEffects(effects, 'failure');
    expect(scaled.knowledge).toBe(3); // 12 * 0.25
  });
});
