/**
 * Seeded PRNG using mulberry32 algorithm.
 * Deterministic: same seed always produces the same sequence.
 */
export function createRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SeededRandom {
  next(): number;
  nextInt(min: number, max: number): number;
  pick<T>(array: readonly T[]): T;
  shuffle<T>(array: readonly T[]): T[];
  seed: number;
}

export function createSeededRandom(seed: number): SeededRandom {
  const rng = createRNG(seed);

  return {
    seed,
    next: rng,
    nextInt(min: number, max: number): number {
      return Math.floor(rng() * (max - min + 1)) + min;
    },
    pick<T>(array: readonly T[]): T {
      return array[Math.floor(rng() * array.length)];
    },
    shuffle<T>(array: readonly T[]): T[] {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
  };
}
