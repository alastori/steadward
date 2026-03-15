import type { BalanceConstants } from '../../types/content';

export const BASE_BALANCE: BalanceConstants = {
  baseAttentionBudget: 10,
  clarityAttentionModifier: 0.1, // +/- 0.1 per clarity point from 50 (10-point swing = ±1 ATT)
  resourceDecayRate: 5, // per-week passive decay for unattended departments
  fatiguePerWeek: 20, // base fatigue gain per assigned week (bites by week 3)
  trustGrowthBase: 3, // base trust gain per successful delegation
  delegationQualityWeights: {
    judgment: 0.3,
    reliability: 0.25,
    speed: 0.15,
    adaptability: 0.15,
    communication: 0.1,
    riskTolerance: 0.05,
  },
  autonomyScoreWeights: {
    delegationRate: 0.3,
    leaderTrust: 0.25,
    resourceStability: 0.2,
    departmentHealth: 0.15,
    eventsHandled: 0.1,
  },
  demoWeekLimit: 5,
};
