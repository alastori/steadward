import type { Resources } from './resources';

export interface OutcomeDefinition {
  resourceEffects: Partial<Resources>;
  description: string;
  descriptionPartial?: string;
  descriptionFailure?: string;
}

export interface InitiativeDefinition {
  id: string;
  name: string;
  description: string;
  department: string;
  attentionCost: number;
  duration: number; // weeks
  requiredResources: Partial<Resources>;
  outcomeOverseen: OutcomeDefinition;
  outcomeDelegated: OutcomeDefinition;
  tags: string[];
}

export interface ActiveInitiative {
  definitionId: string;
  departmentId: string;
  assignedLeaderId: string | null;
  weeksRemaining: number;
  overseen: boolean;
}
