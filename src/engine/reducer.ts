import type { GameState } from '../types/game-state';
import type { Action } from '../types/actions';
import type { Resources, ResourceType } from '../types/resources';
import { RESOURCE_TYPES } from '../types/resources';
import { advancePhase } from './turn-manager';

export function rootReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'ADVANCE_PHASE':
      return {
        ...state,
        turn: advancePhase(state.turn),
      };

    case 'ASSIGN_LEADER':
      return {
        ...state,
        leaders: state.leaders.map((l) =>
          l.id === action.leaderId
            ? { ...l, assignedDepartmentId: action.departmentId }
            : l
        ),
        departments: state.departments.map((d) =>
          d.id === action.departmentId
            ? { ...d, assignedLeaderId: action.leaderId }
            : d
        ),
      };

    case 'UNASSIGN_LEADER':
      return {
        ...state,
        leaders: state.leaders.map((l) =>
          l.id === action.leaderId ? { ...l, assignedDepartmentId: null } : l
        ),
        departments: state.departments.map((d) =>
          d.assignedLeaderId === action.leaderId ? { ...d, assignedLeaderId: null } : d
        ),
      };

    case 'START_INITIATIVE':
      return {
        ...state,
        activeInitiatives: [
          ...state.activeInitiatives,
          {
            definitionId: action.initiativeId,
            departmentId: action.departmentId,
            assignedLeaderId: action.leaderId,
            weeksRemaining: action.duration,
            overseen: action.overseen,
          },
        ],
        departments: state.departments.map((d) =>
          d.id === action.departmentId
            ? { ...d, activeInitiativeIds: [...d.activeInitiativeIds, action.initiativeId] }
            : d
        ),
      };

    case 'SPEND_ATTENTION':
      return {
        ...state,
        attention: {
          ...state.attention,
          remaining: Math.max(0, state.attention.remaining - action.amount),
        },
      };

    case 'RESOLVE_EVENT':
      return {
        ...state,
        activeEvents: state.activeEvents.map((e) =>
          e.definitionId === action.eventId
            ? { ...e, resolved: true, chosenOptionIndex: action.choiceIndex }
            : e
        ),
      };

    case 'APPLY_EFFECTS':
      return {
        ...state,
        resources: applyResourceEffects(state.resources, action.effects),
      };

    case 'TICK_WEEK':
      return {
        ...state,
        previousResources: { ...state.resources },
        departments: action.departments,
        leaders: action.leaders,
        activeInitiatives: action.activeInitiatives,
        activeEvents: action.drawnEvents,
        resources: applyResourceEffects(state.resources, action.completedInitiativeEffects),
        attention: {
          budget: action.newAttentionBudget,
          remaining: action.newAttentionBudget,
        },
        autonomyScore: action.autonomyScore,
        autonomyStreakWeeks: action.autonomyStreakWeeks,
        outcome: action.outcome,
      };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

/** Clamp all resources to 0-100 range */
export function clampResources(resources: Resources): Resources {
  const clamped = { ...resources };
  for (const key of RESOURCE_TYPES) {
    clamped[key] = Math.max(0, Math.min(100, clamped[key]));
  }
  return clamped;
}

/** Apply resource effects with clamping */
export function applyResourceEffects(
  resources: Resources,
  effects: Partial<Resources>,
): Resources {
  const updated = { ...resources };
  for (const [key, value] of Object.entries(effects)) {
    if (value !== undefined) {
      updated[key as ResourceType] += value;
    }
  }
  return clampResources(updated);
}
