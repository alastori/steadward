export enum GamePhase {
  Observe = 'observe',
  Plan = 'plan',
  Execute = 'execute',
  Review = 'review',
}

export const PHASE_ORDER: readonly GamePhase[] = [
  GamePhase.Observe,
  GamePhase.Plan,
  GamePhase.Execute,
  GamePhase.Review,
] as const;
