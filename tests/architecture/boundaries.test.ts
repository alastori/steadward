import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        files.push(...getAllTsFiles(full));
      } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
        files.push(full);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

describe('Architecture boundary enforcement', () => {
  const systemsFiles = getAllTsFiles('src/systems');
  const engineFiles = getAllTsFiles('src/engine');

  it('src/systems/ never imports from src/ui/', () => {
    for (const file of systemsFiles) {
      const content = readFileSync(file, 'utf-8');
      expect(content, `${file} imports from ui/`).not.toMatch(/from\s+['"].*\/ui\//);
    }
  });

  it('src/engine/ never imports from src/ui/', () => {
    for (const file of engineFiles) {
      const content = readFileSync(file, 'utf-8');
      expect(content, `${file} imports from ui/`).not.toMatch(/from\s+['"].*\/ui\//);
    }
  });

  it('src/systems/ never imports from src/content/', () => {
    for (const file of systemsFiles) {
      const content = readFileSync(file, 'utf-8');
      // Systems are parameterized by content, not dependent on it
      expect(content, `${file} imports from content/`).not.toMatch(/from\s+['"].*\/content\//);
    }
  });

  it('GameState has no function-typed fields (must be serializable)', () => {
    const gameStateFile = readFileSync('src/types/game-state.ts', 'utf-8');
    // No arrow functions or Function type in interface fields
    expect(gameStateFile).not.toMatch(/:\s*\(.*\)\s*=>/);
    expect(gameStateFile).not.toMatch(/:\s*Function/);
  });
});
