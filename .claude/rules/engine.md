---
paths:
  - "src/engine/**"
  - "src/systems/**"
  - "src/types/**"
---

# Engine & Systems Rules

## State Management
- All state changes flow through: Action → Reducer → New State → Notify Listeners
- State is always a plain, serializable object. No classes, no functions in state.
- Reducers are pure functions: `(state: GameState, action: Action) => GameState`
- Use manual spread operators for immutability, not Immer
- Every dispatched action is recorded in the action log with a timestamp

## GameState Shape
```typescript
interface GameState {
  turn: TurnState
  resources: Resources
  departments: Department[]
  leaders: Leader[]
  attention: { budget: number; remaining: number }
  activeInitiatives: ActiveInitiative[]
  autonomyScore: number
  autonomyStreakWeeks: number
  outcome: 'win' | 'loss' | null
}
```

## Key Types
- `ResourceType`: 'materials' | 'trust' | 'clarity' | 'resilience' | 'knowledge' | 'momentum'
- `Resources`: `Record<ResourceType, number>` (0-100 clamped)
- `DepartmentId`: 'operations' | 'infrastructure' | 'research' | 'external-affairs'
- `GamePhase`: Observe | Plan | Execute | Review (enum in `src/types/modes.ts`)
- Attention budget is exactly 10 (fixed base, not approximate)

## Phase Rules
- Phase cycle: Observe → Plan → Execute → Review → next week
- Empty plans are valid — the Execute guard must NOT require leader assignments
- Phase guards are pure functions: `(state) => { valid: boolean; reason?: string }`

## Systems Boundary
- `src/systems/` NEVER imports from `src/ui/`
- `src/systems/` NEVER imports from `src/audio/` or `src/analytics/`
- Systems are parameterized by content data, never hardcode leader names or initiative stats

## Scoring
- `calculateRunScore()` returns 0-10,000 scale
- Factors: weeks-to-win, resources remaining, leaders not burned out, events weathered
