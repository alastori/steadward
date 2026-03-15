import type { Resources } from './resources';

export type UrgencyLevel = 'ignorable' | 'pressing' | 'critical';

export interface EventChoiceDefinition {
  id: string;
  name: string;
  description: string;
  attentionCost: number;
  resourceEffects: Partial<Resources>;
}

export interface EventCondition {
  type: 'week_min' | 'week_max' | 'resource_below' | 'resource_above' | 'department_health_below';
  target?: string;
  value: number;
}

export interface EventDefinition {
  id: string;
  name: string;
  description: string;
  urgency: UrgencyLevel;
  choices: EventChoiceDefinition[];
  conditions?: EventCondition[];
  tags: string[];
}

export interface ActiveEvent {
  definitionId: string;
  resolved: boolean;
  chosenOptionIndex: number | null;
}
