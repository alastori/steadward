import { describe, it, expect } from 'vitest';
import { calculateAutonomyScore, checkWinCondition, checkLossCondition, calculateRunScore } from '../../src/systems/scoring';
import { BASE_BALANCE } from '../../src/content/base-pack/balance';
import { GamePhase } from '../../src/types/modes';
import { DEFAULT_RESOURCES } from '../../src/types/resources';
import type { GameState } from '../../src/types/game-state';

function makeState(overrides?: Partial<GameState>): GameState {
  return {
    turn: { week: 5, phase: GamePhase.Review, phaseIndex: 3 },
    resources: { ...DEFAULT_RESOURCES },
    departments: [
      { id: 'operations', health: 70, assignedLeaderId: 'l1', activeInitiativeIds: [], unlockedAtWeek: 1 },
      { id: 'infrastructure', health: 65, assignedLeaderId: 'l2', activeInitiativeIds: [], unlockedAtWeek: 1 },
    ],
    leaders: [
      { id: 'l1', name: 'A', fatigue: 20, trust: 70, assignedDepartmentId: 'operations', availableAtWeek: 1 },
      { id: 'l2', name: 'B', fatigue: 30, trust: 60, assignedDepartmentId: 'infrastructure', availableAtWeek: 1 },
    ],
    attention: { budget: 10, remaining: 6 },
    activeInitiatives: [
      { definitionId: 'i1', departmentId: 'operations', assignedLeaderId: 'l1', weeksRemaining: 1, overseen: false },
      { definitionId: 'i2', departmentId: 'infrastructure', assignedLeaderId: 'l2', weeksRemaining: 2, overseen: false },
    ],
    activeEvents: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed: 1,
    ...overrides,
  };
}

describe('Scoring system', () => {
  it('calculateAutonomyScore returns value between 0 and 100', () => {
    const score = calculateAutonomyScore(makeState(), BASE_BALANCE);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('more delegation increases autonomy score', () => {
    const delegated = makeState();
    const overseen = makeState({
      activeInitiatives: delegated.activeInitiatives.map((i) => ({ ...i, overseen: true })),
    });
    const delegatedScore = calculateAutonomyScore(delegated, BASE_BALANCE);
    const overseenScore = calculateAutonomyScore(overseen, BASE_BALANCE);
    expect(delegatedScore).toBeGreaterThan(overseenScore);
  });

  it('checkWinCondition triggers at 3 consecutive weeks >= 80', () => {
    expect(checkWinCondition(80, 2)).toEqual({ won: true, newStreak: 3 });
  });

  it('checkWinCondition resets streak below 80', () => {
    expect(checkWinCondition(79, 2)).toEqual({ won: false, newStreak: 0 });
  });

  it('checkWinCondition does not trigger at 2 weeks', () => {
    expect(checkWinCondition(85, 1)).toEqual({ won: false, newStreak: 2 });
  });

  it('checkLossCondition triggers when any resource hits 0', () => {
    expect(checkLossCondition({ ...DEFAULT_RESOURCES, trust: 0 })).toBe(true);
  });

  it('checkLossCondition returns false when all resources positive', () => {
    expect(checkLossCondition(DEFAULT_RESOURCES)).toBe(false);
  });

  it('calculateRunScore returns value between 0 and 10000', () => {
    const score = calculateRunScore(makeState(), 5);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10000);
  });
});
