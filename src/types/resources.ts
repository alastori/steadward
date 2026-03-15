export type ResourceType = 'materials' | 'trust' | 'clarity' | 'resilience' | 'knowledge' | 'momentum';

export type Resources = Record<ResourceType, number>;

export const RESOURCE_TYPES: readonly ResourceType[] = [
  'materials',
  'trust',
  'clarity',
  'resilience',
  'knowledge',
  'momentum',
] as const;

export const DEFAULT_RESOURCES: Resources = {
  materials: 50,
  trust: 50,
  clarity: 50,
  resilience: 50,
  knowledge: 50,
  momentum: 50,
};
