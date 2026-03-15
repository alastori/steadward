import { describe, it, expect } from 'vitest';
import { createContentRegistry } from '../../src/content/registry';
import { basePack } from '../../src/content/index';

describe('Content validation', () => {
  it('base pack registers without errors', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    const errors = registry.validate().filter((r) => r.level === 'error');
    expect(errors).toEqual([]);
  });

  it('base pack has 5 leaders', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    expect(registry.getLeaders()).toHaveLength(5);
  });

  it('base pack has 15 initiatives', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    expect(registry.getInitiatives()).toHaveLength(15);
  });

  it('base pack has 10 events', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    expect(registry.getEvents()).toHaveLength(10);
  });

  it('all leader stats are within 1-10 range', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    for (const leader of registry.getLeaders()) {
      for (const [stat, val] of Object.entries(leader.stats)) {
        expect(val, `${leader.name}.${stat}`).toBeGreaterThanOrEqual(1);
        expect(val, `${leader.name}.${stat}`).toBeLessThanOrEqual(10);
      }
    }
  });

  it('all events have at least 2 choices', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    for (const event of registry.getEvents()) {
      expect(event.choices.length, event.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('initiatives cover all departments', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    const departments = new Set(registry.getInitiatives().map((i) => i.department));
    expect(departments).toContain('operations');
    expect(departments).toContain('infrastructure');
    expect(departments).toContain('research');
    expect(departments).toContain('external-affairs');
  });

  it('events cover all urgency levels', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    expect(registry.getEvents('ignorable').length).toBeGreaterThan(0);
    expect(registry.getEvents('pressing').length).toBeGreaterThan(0);
    expect(registry.getEvents('critical').length).toBeGreaterThan(0);
  });

  it('balance constants are loaded', () => {
    const registry = createContentRegistry();
    registry.registerPack(basePack);
    const balance = registry.getBalance();
    expect(balance.baseAttentionBudget).toBe(10);
    expect(balance.demoWeekLimit).toBe(5);
  });
});
