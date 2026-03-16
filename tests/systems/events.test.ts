import { describe, it, expect } from 'vitest';
import { meetsConditions, drawEvents, createActiveEvents, allEventsResolved } from '../../src/systems/events';
import { createSeededRandom } from '../../src/utils/random';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';
import type { EventDefinition } from '../../src/types/events';

function makeState(overrides?: Partial<GameState>): GameState {
  return {
    turn: { week: 3, phase: GamePhase.Execute, phaseIndex: 2 },
    resources: { ...DEFAULT_RESOURCES },
    previousResources: null,
    departments: [
      { id: 'operations', health: 60, assignedLeaderId: null, activeInitiativeIds: [], unlockedAtWeek: 1 },
    ],
    leaders: [],
    attention: { budget: 10, remaining: 10 },
    activeInitiatives: [],
    activeEvents: [],
    firedEventIds: [],
    lastCompletedInitiatives: [],
    hintsShown: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed: 1,
    ...overrides,
  };
}

const testEvent: EventDefinition = {
  id: 'test-event',
  name: 'Test',
  description: 'A test event',
  urgency: 'pressing',
  choices: [
    { id: 'a', name: 'Option A', description: 'Do A', attentionCost: 1, resourceEffects: {} },
    { id: 'b', name: 'Option B', description: 'Do B', attentionCost: 0, resourceEffects: {} },
  ],
  conditions: [{ type: 'week_min', value: 2 }],
  tags: ['test'],
};

describe('Events system', () => {
  it('meetsConditions returns true when no conditions', () => {
    expect(meetsConditions(undefined, makeState())).toBe(true);
    expect(meetsConditions([], makeState())).toBe(true);
  });

  it('meetsConditions checks week_min', () => {
    const state = makeState({ turn: { week: 1, phase: GamePhase.Execute, phaseIndex: 2 } });
    expect(meetsConditions([{ type: 'week_min', value: 2 }], state)).toBe(false);
    expect(meetsConditions([{ type: 'week_min', value: 1 }], state)).toBe(true);
  });

  it('meetsConditions checks resource_below', () => {
    const state = makeState({ resources: { ...DEFAULT_RESOURCES, trust: 30 } });
    expect(meetsConditions([{ type: 'resource_below', target: 'trust', value: 40 }], state)).toBe(true);
    expect(meetsConditions([{ type: 'resource_below', target: 'trust', value: 20 }], state)).toBe(false);
  });

  it('drawEvents returns eligible events', () => {
    const rng = createSeededRandom(42);
    const events = drawEvents([testEvent], makeState(), rng);
    expect(events).toHaveLength(1);
  });

  it('drawEvents respects conditions', () => {
    const rng = createSeededRandom(42);
    const state = makeState({ turn: { week: 1, phase: GamePhase.Execute, phaseIndex: 2 } });
    const events = drawEvents([testEvent], state, rng);
    expect(events).toHaveLength(0);
  });

  it('drawEvents limits to maxEvents', () => {
    const rng = createSeededRandom(42);
    const pool = [testEvent, { ...testEvent, id: 'test-2' }, { ...testEvent, id: 'test-3' }];
    const events = drawEvents(pool, makeState(), rng, 2);
    expect(events.length).toBeLessThanOrEqual(2);
  });

  it('createActiveEvents makes unresolved records', () => {
    const active = createActiveEvents([testEvent]);
    expect(active).toHaveLength(1);
    expect(active[0].resolved).toBe(false);
    expect(active[0].chosenOptionIndex).toBeNull();
  });

  it('allEventsResolved checks all events', () => {
    const events = [
      { definitionId: 'a', resolved: true, chosenOptionIndex: 0 },
      { definitionId: 'b', resolved: false, chosenOptionIndex: null },
    ];
    expect(allEventsResolved(events)).toBe(false);
    events[1].resolved = true;
    events[1].chosenOptionIndex = 1;
    expect(allEventsResolved(events)).toBe(true);
  });
});
