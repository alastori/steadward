import type { GameState } from '../types/game-state';
import type { EventDefinition, EventCondition, ActiveEvent } from '../types/events';
import type { SeededRandom } from '../utils/random';

/** Check if an event's conditions are met */
export function meetsConditions(
  conditions: EventCondition[] | undefined,
  state: GameState,
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((cond) => {
    switch (cond.type) {
      case 'week_min':
        return state.turn.week >= cond.value;
      case 'week_max':
        return state.turn.week <= cond.value;
      case 'resource_below':
        return cond.target
          ? state.resources[cond.target as keyof typeof state.resources] < cond.value
          : false;
      case 'resource_above':
        return cond.target
          ? state.resources[cond.target as keyof typeof state.resources] > cond.value
          : false;
      case 'department_health_below':
        return cond.target
          ? (state.departments.find((d) => d.id === cond.target)?.health ?? 100) < cond.value
          : false;
      default:
        return true;
    }
  });
}

/** Draw events for the Execute phase based on conditions and RNG */
export function drawEvents(
  pool: ReadonlyArray<EventDefinition>,
  state: GameState,
  rng: SeededRandom,
  maxEvents: number = 2,
): EventDefinition[] {
  const eligible = pool.filter((e) => meetsConditions(e.conditions, state));
  if (eligible.length === 0) return [];

  const shuffled = rng.shuffle(eligible);
  return shuffled.slice(0, Math.min(maxEvents, shuffled.length));
}

/** Create active event records from drawn definitions */
export function createActiveEvents(
  definitions: EventDefinition[],
): ActiveEvent[] {
  return definitions.map((def) => ({
    definitionId: def.id,
    resolved: false,
    chosenOptionIndex: null,
  }));
}

/** Check if all events have been resolved */
export function allEventsResolved(events: ActiveEvent[]): boolean {
  return events.every((e) => e.resolved);
}
