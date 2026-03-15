import { describe, it, expect } from 'vitest';
import { clampResources, applyResourceEffects } from '../../src/engine/reducer';
import { DEFAULT_RESOURCES } from '../../src/types/resources';

describe('clampResources', () => {
  it('clamps values above 100', () => {
    const res = { ...DEFAULT_RESOURCES, materials: 120 };
    expect(clampResources(res).materials).toBe(100);
  });

  it('clamps values below 0', () => {
    const res = { ...DEFAULT_RESOURCES, trust: -10 };
    expect(clampResources(res).trust).toBe(0);
  });

  it('leaves values in range unchanged', () => {
    const res = { ...DEFAULT_RESOURCES };
    expect(clampResources(res)).toEqual(DEFAULT_RESOURCES);
  });
});

describe('applyResourceEffects', () => {
  it('adds positive effects', () => {
    const result = applyResourceEffects(DEFAULT_RESOURCES, { materials: 10 });
    expect(result.materials).toBe(60);
  });

  it('subtracts negative effects', () => {
    const result = applyResourceEffects(DEFAULT_RESOURCES, { trust: -20 });
    expect(result.trust).toBe(30);
  });

  it('clamps after applying', () => {
    const result = applyResourceEffects(DEFAULT_RESOURCES, { materials: 80 });
    expect(result.materials).toBe(100);
  });

  it('applies multiple effects', () => {
    const result = applyResourceEffects(DEFAULT_RESOURCES, {
      materials: 10,
      trust: -5,
      knowledge: 20,
    });
    expect(result.materials).toBe(60);
    expect(result.trust).toBe(45);
    expect(result.knowledge).toBe(70);
  });
});
