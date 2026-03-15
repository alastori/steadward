import { describe, it, expect } from 'vitest';
import { advancePhase, createInitialTurn } from '../../src/engine/turn-manager';
import { GamePhase } from '../../src/types/modes';

describe('TurnManager', () => {
  it('creates initial turn at week 1, Observe', () => {
    const turn = createInitialTurn();
    expect(turn.week).toBe(1);
    expect(turn.phase).toBe(GamePhase.Observe);
    expect(turn.phaseIndex).toBe(0);
  });

  it('advances Observe -> Plan', () => {
    const turn = advancePhase(createInitialTurn());
    expect(turn.phase).toBe(GamePhase.Plan);
    expect(turn.phaseIndex).toBe(1);
    expect(turn.week).toBe(1);
  });

  it('advances Plan -> Execute', () => {
    let turn = createInitialTurn();
    turn = advancePhase(turn);
    turn = advancePhase(turn);
    expect(turn.phase).toBe(GamePhase.Execute);
  });

  it('advances Execute -> Review', () => {
    let turn = createInitialTurn();
    turn = advancePhase(turn);
    turn = advancePhase(turn);
    turn = advancePhase(turn);
    expect(turn.phase).toBe(GamePhase.Review);
  });

  it('wraps Review -> Observe and increments week', () => {
    let turn = createInitialTurn();
    turn = advancePhase(turn); // Plan
    turn = advancePhase(turn); // Execute
    turn = advancePhase(turn); // Review
    turn = advancePhase(turn); // Observe, week 2
    expect(turn.phase).toBe(GamePhase.Observe);
    expect(turn.week).toBe(2);
    expect(turn.phaseIndex).toBe(0);
  });
});
