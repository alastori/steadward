export type Action =
  | { type: 'ADVANCE_PHASE' }
  | { type: 'ASSIGN_LEADER'; leaderId: string; departmentId: string }
  | { type: 'UNASSIGN_LEADER'; leaderId: string }
  | { type: 'START_INITIATIVE'; initiativeId: string; departmentId: string }
  | { type: 'SPEND_ATTENTION'; amount: number; target: string }
  | { type: 'RESOLVE_EVENT'; eventId: string; choiceIndex: number }
  | { type: 'DELEGATE_INITIATIVE'; initiativeId: string }
  | { type: 'OVERSEE_INITIATIVE'; initiativeId: string }
  | { type: 'TICK_WEEK' }
  | { type: 'LOAD_STATE'; state: import('./game-state').GameState };
