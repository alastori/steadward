import { describe, it, expect } from 'vitest';
import { createSaveFile, CURRENT_SAVE_VERSION } from '../../src/persistence/serializer';
import { migrateSave } from '../../src/persistence/migrations';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';

function createTestState(): GameState {
  return {
    turn: { week: 3, phase: GamePhase.Review, phaseIndex: 3 },
    resources: { ...DEFAULT_RESOURCES, materials: 35, trust: 62 },
    previousResources: { ...DEFAULT_RESOURCES },
    departments: [
      { id: 'operations', health: 65, assignedLeaderId: 'leader-maren', activeInitiativeIds: ['init-1'], unlockedAtWeek: 1 },
    ],
    leaders: [
      { id: 'leader-maren', name: 'Maren Stahl', fatigue: 42, trust: 58, assignedDepartmentId: 'operations', availableAtWeek: 1 },
    ],
    attention: { budget: 11, remaining: 3 },
    activeInitiatives: [
      { definitionId: 'init-1', departmentId: 'operations', assignedLeaderId: 'leader-maren', weeksRemaining: 1, overseen: false },
    ],
    activeEvents: [
      { definitionId: 'event-1', resolved: true, chosenOptionIndex: 0 },
    ],
    firedEventIds: ['event-1', 'event-2'],
    lastCompletedInitiatives: [
      { definitionId: 'init-old', leaderId: 'leader-maren', overseen: false, outcome: 'success' },
    ],
    hintsShown: ['first-observe', 'first-plan'],
    autonomyScore: 55,
    autonomyStreakWeeks: 1,
    outcome: null,
    seed: 42,
  };
}

describe('Save file roundtrip', () => {
  it('createSaveFile produces valid structure', () => {
    const state = createTestState();
    const save = createSaveFile(state);

    expect(save.version).toBe(CURRENT_SAVE_VERSION);
    expect(save.seed).toBe(42);
    expect(save.gameState).toEqual(state);
    expect(save.metadata.weekNumber).toBe(3);
    expect(save.metadata.autonomyScore).toBe(55);
    expect(save.savedAt).toBeTruthy();
  });

  it('save file is JSON-serializable', () => {
    const state = createTestState();
    const save = createSaveFile(state);

    // Roundtrip through JSON
    const json = JSON.stringify(save);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe(save.version);
    expect(parsed.gameState.turn.week).toBe(3);
    expect(parsed.gameState.resources.materials).toBe(35);
    expect(parsed.gameState.leaders[0].fatigue).toBe(42);
    expect(parsed.gameState.firedEventIds).toEqual(['event-1', 'event-2']);
    expect(parsed.gameState.hintsShown).toEqual(['first-observe', 'first-plan']);
  });

  it('migrateSave handles current version without modification', () => {
    const state = createTestState();
    const save = createSaveFile(state);

    const migrated = migrateSave(save);
    expect(migrated.version).toBe(CURRENT_SAVE_VERSION);
    expect(migrated.gameState).toEqual(state);
  });

  it('GameState contains no undefined values after serialization', () => {
    const state = createTestState();
    const json = JSON.stringify(state);
    const parsed = JSON.parse(json);

    // Walk all values and ensure none are undefined
    function checkNoUndefined(obj: unknown, path: string): void {
      if (obj === null) return;
      if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          expect(value, `${path}.${key} is undefined`).not.toBeUndefined();
          checkNoUndefined(value, `${path}.${key}`);
        }
      }
    }

    checkNoUndefined(parsed, 'GameState');
  });
});
