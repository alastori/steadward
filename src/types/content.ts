import type { LeaderStats, LeaderTendencies } from './leaders';
import type { InitiativeDefinition } from './initiatives';
import type { EventDefinition } from './events';
import type { Resources } from './resources';

export interface LeaderDefinition {
  id: string;
  name: string;
  portrait: string;
  backstory: string;
  stats: LeaderStats;
  tendencies: LeaderTendencies;
  tags: string[];
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  winCondition: { type: string; threshold: number; sustainedWeeks: number };
  startingResources: Partial<Resources>;
}

export interface BalanceConstants {
  baseAttentionBudget: number;
  clarityAttentionModifier: number;
  resourceDecayRate: number;
  fatiguePerWeek: number;
  trustGrowthBase: number;
  delegationQualityWeights: Record<string, number>;
  autonomyScoreWeights: Record<string, number>;
  demoWeekLimit: number;
}

export interface ContentPack {
  id: string;
  name: string;
  version: string;
  requires?: string[];
  leaders: LeaderDefinition[];
  initiatives: InitiativeDefinition[];
  events: EventDefinition[];
  balance?: Partial<BalanceConstants>;
  scenarios?: ScenarioDefinition[];
}
