---
paths:
  - "src/persistence/**"
---

# Persistence Rules

## Storage
- Primary: IndexedDB via thin wrapper. Fallback: localStorage.
- Async API only (IndexedDB is non-blocking)
- Game saves are separate from user preferences

## Save Format
```typescript
interface SaveFile {
  version: number              // Schema version, starts at 1
  savedAt: string              // ISO 8601
  seed: number                 // For RNG reproducibility
  gameState: GameState         // Full state snapshot
  actionLog?: ActionLogEntry[] // Optional: for replay
  metadata: {
    weekNumber: number
    autonomyScore: number
    runScore: number           // Composite 0-10,000
    playTimeSeconds: number
    contentPacks: string[]
  }
}
```

## Migrations
- Chained functions: v1→v2, v2→v3, etc.
- Every migration gets a dedicated test with a fixture of the old format
- A broken migration = players lose saves. Migration tests are non-negotiable.

## Autosave
- Autosave at end of every Review phase (once per week)
- Keep previous autosave as backup (two-deep rotation)
- Manual save available at any time via UI

## User Preferences
- Stored in localStorage (NOT IndexedDB, NOT per-save)
- Includes: volume (master/music/SFX), showHints, highContrast, reducedMotion, streamerMode
- Loaded at app start, before game state

## Demo Gating
- `DEMO_WEEK_LIMIT = 5` (hard-coded, build-time excluded in full build)
- Demo build: `npm run build:demo` (EDITION=demo)
- Full build: `npm run build:full` (EDITION=full)
- Paid content never ships in demo bundle (Vite tree-shaking)
