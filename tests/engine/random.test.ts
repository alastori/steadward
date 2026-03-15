import { describe, it, expect } from 'vitest';
import { createSeededRandom } from '../../src/utils/random';

describe('SeededRandom', () => {
  it('produces deterministic sequences', () => {
    const rng1 = createSeededRandom(42);
    const rng2 = createSeededRandom(42);
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    expect(seq1).toEqual(seq2);
  });

  it('different seeds produce different sequences', () => {
    const rng1 = createSeededRandom(1);
    const rng2 = createSeededRandom(2);
    expect(rng1.next()).not.toBe(rng2.next());
  });

  it('nextInt returns values in range', () => {
    const rng = createSeededRandom(42);
    for (let i = 0; i < 100; i++) {
      const val = rng.nextInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
    }
  });

  it('pick returns element from array', () => {
    const rng = createSeededRandom(42);
    const arr = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 20; i++) {
      expect(arr).toContain(rng.pick(arr));
    }
  });

  it('shuffle returns all elements', () => {
    const rng = createSeededRandom(42);
    const arr = [1, 2, 3, 4, 5];
    const shuffled = rng.shuffle(arr);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('shuffle does not mutate original', () => {
    const rng = createSeededRandom(42);
    const arr = [1, 2, 3, 4, 5];
    rng.shuffle(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
