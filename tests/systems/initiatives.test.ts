import { describe, it, expect } from 'vitest';
import { canStartInitiative, canAddInitiative, tickInitiatives, startInitiative } from '../../src/systems/initiatives';
import { DEFAULT_RESOURCES } from '../../src/types/resources';

describe('Initiatives system', () => {
  it('canStartInitiative returns true when resources are sufficient', () => {
    expect(canStartInitiative(DEFAULT_RESOURCES, { materials: 20, trust: 30 })).toBe(true);
  });

  it('canStartInitiative returns false when resources are insufficient', () => {
    expect(canStartInitiative({ ...DEFAULT_RESOURCES, materials: 10 }, { materials: 20 })).toBe(false);
  });

  it('canAddInitiative allows up to 2 per department', () => {
    const active = [
      startInitiative('a', 'ops', 1, null, false),
    ];
    expect(canAddInitiative(active, 'ops')).toBe(true);
  });

  it('canAddInitiative blocks third initiative', () => {
    const active = [
      startInitiative('a', 'ops', 1, null, false),
      startInitiative('b', 'ops', 1, null, false),
    ];
    expect(canAddInitiative(active, 'ops')).toBe(false);
  });

  it('canAddInitiative allows different department', () => {
    const active = [
      startInitiative('a', 'ops', 1, null, false),
      startInitiative('b', 'ops', 1, null, false),
    ];
    expect(canAddInitiative(active, 'research')).toBe(true);
  });

  it('tickInitiatives reduces weeks remaining', () => {
    const active = [startInitiative('a', 'ops', 3, null, false)];
    const { active: remaining } = tickInitiatives(active);
    expect(remaining[0].weeksRemaining).toBe(2);
  });

  it('tickInitiatives moves completed initiatives', () => {
    const active = [
      startInitiative('a', 'ops', 1, null, false),
      startInitiative('b', 'ops', 3, null, false),
    ];
    const { active: remaining, completed } = tickInitiatives(active);
    expect(remaining).toHaveLength(1);
    expect(completed).toHaveLength(1);
    expect(completed[0].definitionId).toBe('a');
  });

  it('startInitiative creates correct structure', () => {
    const init = startInitiative('test-init', 'research', 2, 'leader-fen', true);
    expect(init.definitionId).toBe('test-init');
    expect(init.departmentId).toBe('research');
    expect(init.weeksRemaining).toBe(2);
    expect(init.assignedLeaderId).toBe('leader-fen');
    expect(init.overseen).toBe(true);
  });
});
