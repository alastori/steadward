# Steadward — Infrastructure & Architecture

**Author**: Architecture
**Date**: 2026-03-14
**Status**: Draft v1
**Prerequisite reading**: [Game Design](game-design.md), [Monetization Strategy](monetization-strategy.md)

---

## Table of Contents

1. [Architectural Principles](#1-architectural-principles)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [State Management](#3-state-management)
4. [Game Loop & Phase State Machine](#4-game-loop--phase-state-machine)
5. [Content Architecture](#5-content-architecture)
6. [Persistence Layer](#6-persistence-layer)
7. [Demo/Paid Gating](#7-demopaid-gating)
8. [Distribution Pipeline](#8-distribution-pipeline)
9. [Analytics & Telemetry](#9-analytics--telemetry)
10. [Offline/PWA Strategy](#10-offlinepwa-strategy)
11. [Testing Architecture](#11-testing-architecture)
12. [Evolutionary Architecture](#12-evolutionary-architecture)
13. [GTM Architecture](#13-gtm-architecture)

---

## 1. Architectural Principles

The guiding philosophy for Steadward's architecture draws heavily from Martin Fowler's writings on evolutionary architecture and sacrificial architecture.

### Principle 1: Sacrificial First Version

Fowler argues that "the best code you can write now is code you'll discard in a couple of years time." Steadward is a pre-alpha project with an unproven game design. The architecture should optimize for **learning speed** — discovering what the right game is — not for handling 100K concurrent users. Every decision below is made with the explicit understanding that this code may be rewritten when the game's actual shape becomes clear.

**Implication**: Favor simplicity over abstraction. A 200-line module that does one thing well is better than a 50-line module that requires three layers of indirection to understand.

### Principle 2: Make Small Changes with Feedback Loops

Fowler's foreword to *Building Evolutionary Architectures* emphasizes that "the heart of doing evolutionary architecture is to make small changes, and put in feedback loops that allow everyone to learn from how the system is developing." For Steadward, the feedback loop is playtesting. Every architectural decision must support the ability to change game rules, add content, and rebalance without touching structural code.

**Implication**: Game data lives in data files, not in system logic. Systems are parameterized by data, not hardcoded.

### Principle 3: One-Way Data Flow

Complex game state is the primary risk for a management/strategy game with six resources, four departments, five leaders, multiple active initiatives, and a four-phase turn cycle. Inspired by Redux's success in making "state mutations predictable," all state changes in Steadward flow through a single pipeline: **Action -> Reducer -> New State -> Notify Listeners**. No component mutates state directly.

**Implication**: State is always a plain, serializable object. Side effects are separated from state transitions.

### Principle 4: UI as a Projection of State

The UI is a pure function of game state. Given the same `GameState` object, the renderer always produces the same DOM. This is the same principle behind React, but implemented with vanilla DOM operations as specified in the tech stack. The game engine has zero knowledge of the DOM.

**Implication**: The `src/systems/` directory never imports from `src/ui/`. The `src/ui/` directory never mutates state directly.

### Principle 5: Content as Data, Not Code

Leaders, initiatives, events, and balance constants are data — JSON-serializable objects conforming to TypeScript interfaces. This is the foundation for DLC content packs, modding, and balance iteration. Unreal Engine 5's "Modular Game Features" plugin architecture validates this: "the core game is completely unaware of [the content module's] existence."

**Implication**: Adding a new leader or event should require creating a data file and registering it, never modifying a system file.

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        ENTRY POINT                          │
│                        (main.ts)                            │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              ▼                               ▼
┌──────────────────────┐        ┌──────────────────────────┐
│     GAME ENGINE      │        │       UI LAYER           │
│  (no DOM knowledge)  │        │  (subscribes to state)   │
│                      │        │                          │
│  ┌────────────────┐  │  emit  │  ┌────────────────────┐  │
│  │   GameStore    │──┼────────┼─►│   Renderer         │  │
│  │  (state + bus) │  │ events │  │  (DOM orchestrator) │  │
│  └───────┬────────┘  │        │  └────────┬───────────┘  │
│          │           │        │           │              │
│          │ dispatch  │        │           ▼              │
│          ▼           │        │  ┌────────────────────┐  │
│  ┌────────────────┐  │        │  │  Mode Views        │  │
│  │   Reducers     │  │        │  │  (observe/plan/    │  │
│  │  (pure fns)    │  │        │  │   execute/review)  │  │
│  └───────┬────────┘  │        │  └────────┬───────────┘  │
│          │           │        │           │              │
│          ▼           │        │           ▼              │
│  ┌────────────────┐  │        │  ┌────────────────────┐  │
│  │   Systems      │  │        │  │  Components        │  │
│  │  (attention,   │  │        │  │  (cards, panels,   │  │
│  │   leaders,     │  │        │  │   modals, bars)    │  │
│  │   departments, │  │        │  └────────────────────┘  │
│  │   initiatives, │  │        │                          │
│  │   events,      │  │        └──────────────────────────┘
│  │   scoring)     │  │
│  └───────┬────────┘  │
│          │           │        ┌──────────────────────────┐
│          ▼           │        │     CONTENT LAYER        │
│  ┌────────────────┐  │        │  (data files only)       │
│  │  Turn Manager  │  │        │                          │
│  │  (phase FSM)   │  │        │  ┌────────────────────┐  │
│  └────────────────┘  │        │  │ Content Registry   │  │
│                      │        │  │  - leaders          │  │
└──────────────────────┘        │  │  - initiatives      │  │
                                │  │  - events           │  │
┌──────────────────────┐        │  │  - balance          │  │
│   PERSISTENCE LAYER  │        │  │  - scenarios        │  │
│                      │        │  └────────────────────┘  │
│  ┌────────────────┐  │        │                          │
│  │  SaveManager   │  │        │  ┌────────────────────┐  │
│  │  (IndexedDB +  │  │        │  │ Content Packs      │  │
│  │   migration)   │  │        │  │  (base, DLC1, ...) │  │
│  └────────────────┘  │        │  └────────────────────┘  │
│                      │        │                          │
└──────────────────────┘        └──────────────────────────┘

┌──────────────────────┐        ┌──────────────────────────┐
│   PLATFORM LAYER     │        │   ANALYTICS LAYER        │
│                      │        │                          │
│  ┌────────────────┐  │        │  ┌────────────────────┐  │
│  │  Platform      │  │        │  │  Telemetry         │  │
│  │  Adapter       │  │        │  │  (event queue +    │  │
│  │  (web/Steam/   │  │        │  │   batch send)      │  │
│  │   itch.io)     │  │        │  └────────────────────┘  │
│  └────────────────┘  │        │                          │
│                      │        └──────────────────────────┘
└──────────────────────┘
```

### Key Boundaries

1. **Game Engine / UI**: The engine produces state; the UI reads state and dispatches actions. They share only the `GameState` type and the `Action` union type.
2. **Game Engine / Content**: The engine is parameterized by content data loaded from the Content Registry. It never hardcodes leader names, initiative stats, or event text.
3. **Game Engine / Persistence**: The engine provides `getState()` and `loadState()`. The persistence layer handles serialization, storage, versioning, and migration.
4. **Game Engine / Platform**: The platform adapter wraps environment-specific APIs (save location, achievements, analytics transport). The engine is platform-agnostic.

### Proposed Folder Structure Evolution

The game-design.md project structure is a solid starting point. The architecture adds these refinements:

```
steadward/
├── src/
│   ├── main.ts                      # Parses URL params (seed, challenge) at startup
│   ├── types/
│   │   ├── game-state.ts
│   │   ├── actions.ts              # NEW: Action union type
│   │   ├── content.ts              # NEW: Content pack interfaces
│   │   ├── sharing.ts              # NEW: RunSummary, ShareConfig types
│   │   ├── resources.ts
│   │   ├── leaders.ts
│   │   ├── departments.ts
│   │   ├── initiatives.ts
│   │   ├── events.ts
│   │   └── modes.ts               # GamePhase enum (Observe/Plan/Execute/Review)
│   ├── engine/                     # RENAMED from state/
│   │   ├── game-store.ts           # State container + dispatch + subscribe
│   │   ├── reducer.ts              # NEW: Root reducer composing system reducers
│   │   ├── action-log.ts           # NEW: Action history for replay/debug
│   │   └── turn-manager.ts
│   ├── systems/                    # Pure functions: (state, action) => state
│   │   ├── attention.ts
│   │   ├── departments.ts
│   │   ├── leaders.ts
│   │   ├── initiatives.ts
│   │   ├── delegation.ts
│   │   ├── events.ts
│   │   └── scoring.ts
│   ├── content/                    # RENAMED from data/
│   │   ├── registry.ts             # NEW: Content registration + lookup
│   │   ├── strings.ts              # NEW: Keyed UI string constants (all player-facing copy)
│   │   ├── hints.ts                # NEW: Hint text with trigger conditions
│   │   ├── base-pack/              # NEW: Base game content as a pack
│   │   │   ├── leaders.ts
│   │   │   ├── initiatives.ts
│   │   │   ├── events.ts
│   │   │   └── balance.ts
│   │   └── index.ts                # Assembles active content packs
│   ├── persistence/                # NEW: Extracted from state/
│   │   ├── save-manager.ts
│   │   ├── serializer.ts
│   │   ├── migrations/
│   │   │   ├── index.ts
│   │   │   └── v1-to-v2.ts         # Example migration
│   │   └── storage-adapter.ts      # Abstract over localStorage/IndexedDB
│   ├── platform/                   # NEW
│   │   ├── adapter.ts              # Platform abstraction interface
│   │   ├── web-adapter.ts
│   │   └── steam-adapter.ts        # Deferred
│   ├── audio/                      # NEW
│   │   ├── audio-manager.ts        # Top-level audio facade
│   │   ├── audio-config.ts         # Volume defaults, sprite definitions
│   │   ├── music-controller.ts     # Background music playback + crossfade
│   │   └── sfx-controller.ts       # Sound effect triggers
│   ├── analytics/                  # NEW
│   │   ├── telemetry.ts
│   │   └── events.ts               # Analytics event definitions
│   ├── ui/
│   │   ├── renderer.ts
│   │   ├── components/
│   │   ├── modes/
│   │   ├── screens/
│   │   │   ├── title-screen.ts
│   │   │   ├── game-screen.ts
│   │   │   ├── demo-wall-screen.ts # NEW: Demo paywall + email capture
│   │   │   ├── settings-screen.ts # NEW: Volume, accessibility, streamer mode
│   │   │   ├── credits-screen.ts  # NEW: Credits and attribution
│   │   │   └── victory-screen.ts   # Designed as shareable composition
│   │   └── share.ts                # NEW: Share card renderer + clipboard/navigator.share
│   └── utils/
│       ├── random.ts               # Seeded PRNG
│       ├── dom.ts
│       └── url.ts                  # NEW: URL param parsing for seed/challenge deep links
├── content-packs/                  # NEW: DLC content lives outside src/
│   └── new-horizons/               # Future Expansion 1
│       ├── leaders.ts
│       ├── initiatives.ts
│       ├── events.ts
│       └── manifest.ts
├── assets/                         # NEW: Static game assets
│   ├── icons/
│   ├── portraits/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── fonts/
│   └── share/                      # Share card templates, OG images
├── styles/
├── tests/
│   ├── systems/                    # Unit tests
│   ├── engine/                     # Integration tests
│   ├── persistence/                # Migration tests
│   ├── architecture/               # NEW: Fitness function tests (boundary enforcement)
│   ├── content/                    # NEW: Content validation tests (IDs, ranges, refs)
│   └── simulations/                # NEW: Automated playthrough tests
└── public/
    └── manifest.json               # NEW: PWA manifest
    # Note: Service worker is auto-generated by vite-plugin-pwa (not checked in)
```

---

## 3. State Management

### Chosen Pattern: Action-Reducer with Event Log

**Pattern**: A single immutable `GameState` object is the source of truth. All mutations happen through dispatching typed `Action` objects to a root reducer that returns a new `GameState`. Every action is appended to an ordered log.

This is not Redux (no middleware, no selectors library, no devtools protocol). It is the core Redux *insight* — unidirectional data flow with a single state tree — implemented in ~100 lines of TypeScript without the framework overhead.

### Why This Pattern

**Alternatives considered:**

| Pattern | Pros | Cons | Verdict |
|---|---|---|---|
| **Mutable state + pub/sub** | Simple, fast to implement | Impossible to replay, hard to debug, race conditions between listeners, no undo | Reject |
| **Redux (library)** | Battle-tested, devtools, middleware | 15KB+ dependency for a pattern we can implement in 100 lines. Middleware and selectors are overkill for a single-player offline game. | Reject the library, adopt the pattern |
| **Event Sourcing (full)** | Complete history, temporal queries, retroactive corrections | Overkill for MVP. Requires event store, projections, snapshots. Fowler himself notes it's "very hard" to retrofit but premature to adopt before the need is proven. | Defer — but design for upgrade path |
| **XState / Statecharts** | Formal state machine, visual editor, actor model | XState is a 30KB+ dependency. The phase state machine (4 states, linear transitions) doesn't justify it. Risk of over-formalizing game logic that needs rapid iteration. | Reject for global state, consider for phase FSM if complexity grows |
| **ECS (Entity Component System)** | Great for games with thousands of entities and composition-heavy logic | Steadward has ~5 leaders, ~4 departments, ~10 initiatives. ECS is designed for scale we don't have. Adds conceptual overhead without benefit. | Reject |
| **Action-Reducer with log** | Simple, debuggable, replayable, serializable. Proven in Slay the Web (open-source browser card game with identical architecture). | No time-travel devtools (we build a simple one). No middleware (we don't need it). | **Adopt** |

**Research precedent**: [Slay the Web](https://github.com/oskarrough/slaytheweb), an open-source browser card game inspired by Slay the Spire, uses exactly this pattern: "The full game state is always stored in a single, large 'game state' object ... The state is always modified using 'actions' — functions that take a state object, modify it, and return a new one." This architecture has proven stable and maintainable for a game with similar complexity to Steadward.

### GameState Interface

The top-level state object that flows through the entire system:

```typescript
// src/types/game-state.ts
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

### Supporting Type Definitions

Types referenced by `GameState`, content interfaces, and system logic:

```typescript
// src/types/resources.ts
type ResourceType = 'materials' | 'trust' | 'clarity' | 'resilience' | 'knowledge' | 'momentum'
type Resources = Record<ResourceType, number>

// src/types/departments.ts
type DepartmentId = 'operations' | 'infrastructure' | 'research' | 'external-affairs'

// src/types/leaders.ts
interface LeaderStats {
  judgment: number      // 1-10
  speed: number         // 1-10
  reliability: number   // 1-10
  adaptability: number  // 1-10
  communication: number // 1-10
  riskTolerance: number // 1-10
}

interface LeaderTendencies {
  autonomousDecisionStyle: 'cautious' | 'balanced' | 'aggressive'
  fatigueRate: number    // multiplier, 1.0 = normal
  trustGrowthRate: number // multiplier, 1.0 = normal
}

// src/types/events.ts
interface EventChoiceDefinition {
  id: string
  name: string
  description: string
  attentionCost: number
  resourceEffects: Partial<Resources>
}

interface EventCondition {
  type: 'week_min' | 'week_max' | 'resource_below' | 'resource_above' | 'department_health_below'
  target?: string
  value: number
}

// src/types/initiatives.ts
interface OutcomeDefinition {
  resourceEffects: Partial<Resources>
  description: string
  descriptionPartial?: string  // For partial success
  descriptionFailure?: string  // For failure
}

// src/types/content.ts
interface ScenarioDefinition {
  id: string
  name: string
  description: string
  winCondition: { type: string; threshold: number; sustainedWeeks: number }
  startingResources: Partial<Resources>
}

// src/types/game-state.ts
interface BalanceConstants {
  baseAttentionBudget: number
  clarityAttentionModifier: number
  resourceDecayRate: number
  fatiguePerWeek: number
  trustGrowthBase: number
  delegationQualityWeights: Record<string, number>
  autonomyScoreWeights: Record<string, number>
  demoWeekLimit: number
}
```

### Implementation

```typescript
// src/types/actions.ts
type Action =
  | { type: 'ADVANCE_PHASE' }
  | { type: 'ASSIGN_LEADER'; leaderId: string; departmentId: string }
  | { type: 'START_INITIATIVE'; initiativeId: string; departmentId: string }
  | { type: 'SPEND_ATTENTION'; amount: number; target: string }
  | { type: 'RESOLVE_EVENT'; eventId: string; choiceIndex: number }
  | { type: 'DELEGATE_INITIATIVE'; initiativeId: string }
  | { type: 'TICK_WEEK' }
  // ... exhaustive union

// src/engine/game-store.ts
interface ActionLogEntry {
  action: Action
  timestamp: number
  highlight?: boolean  // True for critical events, close-call saves, win/loss
}

interface GameStore {
  getState(): GameState
  dispatch(action: Action): void
  subscribe(listener: (state: GameState, action: Action) => void): () => void
  getActionLog(): ReadonlyArray<ActionLogEntry>
  getHighlights(): ReadonlyArray<ActionLogEntry>
}

function createGameStore(initialState: GameState, reducer: Reducer): GameStore {
  let state = initialState
  const listeners: Set<(state: GameState, action: Action) => void> = new Set()
  const actionLog: ActionLogEntry[] = []

  return {
    getState: () => state,
    dispatch(action: Action) {
      const prevState = state
      state = reducer(state, action)
      const highlight = isHighlightAction(state, prevState, action)
      actionLog.push({ action, timestamp: Date.now(), highlight })
      listeners.forEach(fn => fn(state, action))
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getActionLog: () => actionLog,
    getHighlights: () => actionLog.filter(e => e.highlight),
  }
}
```

### Highlight Detection

The `isHighlightAction` function identifies high-drama moments for the action log:

```typescript
// src/engine/action-log.ts
function isHighlightAction(newState: GameState, prevState: GameState, action: Action): boolean {
  // Critical event resolved
  if (action.type === 'RESOLVE_EVENT' && getEvent(action.eventId)?.urgency === 'critical') return true
  // Resource dropped below 20 (danger zone)
  for (const [key, value] of Object.entries(newState.resources)) {
    if (value < 20 && prevState.resources[key] >= 20) return true
  }
  // Leader burned out
  if (action.type === 'TICK_WEEK') {
    for (const leader of newState.leaders) {
      const prev = prevState.leaders.find(l => l.id === leader.id)
      if (leader.fatigue >= 100 && prev && prev.fatigue < 100) return true
    }
  }
  // Win or loss triggered
  if (newState.outcome && !prevState.outcome) return true
  return false
}
```

### Immutability Strategy

**Do NOT use Immer for the MVP.** Immer adds convenience for deeply nested mutations but introduces performance overhead via `Object.freeze` at every nesting level and proxy-based interception. For a game state with ~50 top-level fields and moderate nesting, manual spread operators are clear and fast:

```typescript
// Preferred: explicit, zero-dependency
function reduceAttention(state: GameState, amount: number): GameState {
  return {
    ...state,
    attention: {
      ...state.attention,
      remaining: state.attention.remaining - amount,
    },
  }
}
```

If nesting depth becomes painful (3+ levels), revisit Immer. The structural sharing it provides (unchanged branches keep the same object reference) becomes valuable when the state tree grows, but that complexity is premature today.

### Action Log for Debug and Replay

Every dispatched action is recorded with a timestamp. This enables:

1. **Debug panel**: `window.__actionLog` shows the full sequence of player decisions.
2. **Replay**: Given a seed and an action log, the game can be perfectly replayed by re-dispatching actions against initial state.
3. **Bug reports**: Players can export their action log, and developers can replay the exact game.
4. **Future event sourcing upgrade**: If full event sourcing is needed later (e.g., for multiplayer or leaderboard verification), the action log is already the event stream. The upgrade path is: add snapshots, add projections, add an event store.

Fowler notes that "retrofitting [event sourcing] is very hard," but by logging actions from day one, we keep the door open without paying the full event sourcing cost.

---

## 4. Game Loop & Phase State Machine

### Chosen Pattern: Explicit Finite State Machine (No Library)

The game cycles through four phases per week: **Observe -> Plan -> Execute -> Review**. This is a simple, linear state machine with exactly four states and four transitions. It does not branch, it does not have parallel states, it does not have guards or hierarchical substates.

**Why not XState**: XState is a powerful statechart library (30KB+) designed for complex state machines with parallel regions, hierarchical states, guards, actions, and the actor model. Steadward's phase machine is a four-element enum with a `next()` function. Using XState here would be like using a database for a four-row lookup table. If the phase machine grows to include branching (e.g., "crisis mode" that interrupts normal flow), XState becomes a reasonable upgrade.

### Implementation

```typescript
// src/types/modes.ts
enum GamePhase {
  Observe = 'OBSERVE',
  Plan = 'PLAN',
  Execute = 'EXECUTE',
  Review = 'REVIEW',
}

// src/engine/turn-manager.ts
const PHASE_ORDER: readonly GamePhase[] = [
  GamePhase.Observe,
  GamePhase.Plan,
  GamePhase.Execute,
  GamePhase.Review,
]

interface TurnState {
  week: number
  phase: GamePhase
  phaseIndex: number
}

function advancePhase(turn: TurnState): TurnState {
  const nextIndex = turn.phaseIndex + 1
  if (nextIndex >= PHASE_ORDER.length) {
    // Wrap to next week
    return {
      week: turn.week + 1,
      phase: PHASE_ORDER[0],
      phaseIndex: 0,
    }
  }
  return {
    ...turn,
    phase: PHASE_ORDER[nextIndex],
    phaseIndex: nextIndex,
  }
}
```

### Phase Responsibilities

Each phase is a **bounded context** (Fowler's DDD terminology) with clearly defined inputs and outputs:

| Phase | Player Actions | System Actions | Outputs |
|---|---|---|---|
| **Observe** | Read-only. Examine dashboards, resource trends, leader status, department health. | Calculate and display trend indicators (up/down arrows), highlight departments below thresholds. | Player's mental model of the current state. |
| **Plan** | Assign leaders to departments. Select initiatives to start (max 2 per department). Allocate attention budget. | Validate assignments (leader not already assigned, attention budget not exceeded). | `PlanCommitment` — a list of intended actions for the Execute phase. |
| **Execute** | Respond to interruption events (spend attention, make choices). Optionally oversee delegated initiatives (spend attention for quality boost). | Progress all active initiatives by one tick. Fire random events based on event pool. Apply delegation outcomes using leader stats. | Resource deltas, initiative progress, event outcomes. |
| **Review** | Read-only. Examine what happened, resource changes, autonomy score. "Begin Next Week" button. | Calculate autonomy score. Check win/loss conditions. Apply end-of-week decay/recovery to fatigue, department health. | Autonomy score, win/loss determination. |

### Phase Transition Validation

Each transition has a **guard** — a pure function that returns true if the transition is valid:

```typescript
type PhaseGuard = (state: GameState) => { valid: boolean; reason?: string }

const phaseGuards: Record<GamePhase, PhaseGuard> = {
  [GamePhase.Observe]: () => ({ valid: true }), // Always valid to observe
  [GamePhase.Plan]: (state) => ({
    valid: state.turn.phase === GamePhase.Observe,
    reason: 'Must complete Observe phase first',
  }),
  [GamePhase.Execute]: (state) => ({
    valid: state.turn.phase === GamePhase.Plan,
    reason: 'Must complete Plan phase first',
  }),
  [GamePhase.Review]: (state) => ({
    valid: state.turn.phase === GamePhase.Execute,
    reason: 'Must complete Execute phase first',
  }),
}
```

---

## 5. Content Architecture

### Chosen Pattern: Content Registry with Typed Data Packs

Game content (leaders, initiatives, events, balance constants, scenarios) is organized into **content packs** — self-contained bundles of data conforming to TypeScript interfaces. A central **Content Registry** loads, validates, and indexes all active content packs at game initialization.

### Why This Pattern

The monetization strategy calls for three paid expansions ("New Horizons", "The Inner Circle", "Long Winter") plus free content updates. The content architecture must support:

1. **Adding content without modifying core code** — new leaders, events, and initiatives are data, not behavior changes.
2. **Build-time separation** — DLC content is excluded from the demo/base build entirely (see Section 7).
3. **Content validation** — malformed content data is caught at load time, not at runtime when a player encounters it.
4. **Modding potential** — if community modding is ever enabled, the content pack format is the mod format.

This follows Unreal Engine 5's Modular Game Features principle: "the core game is completely unaware of [the content module's] existence, eliminating the need for creating dependencies from the game to the new content."

### Content Pack Interface

```typescript
// src/types/content.ts
interface ContentPack {
  id: string                        // 'base' | 'new-horizons' | 'inner-circle'
  name: string                      // Human-readable name
  version: string                   // Semver
  requires?: string[]               // Dependencies (e.g., 'base')
  leaders: LeaderDefinition[]
  initiatives: InitiativeDefinition[]
  events: EventDefinition[]
  balance?: Partial<BalanceConstants>  // Override specific balance values
  scenarios?: ScenarioDefinition[]
}

// Content definitions are pure data — no behavior, no functions
interface LeaderDefinition {
  id: string
  name: string
  portrait: string                  // Asset path
  backstory: string
  stats: LeaderStats                // judgment, speed, reliability, etc.
  tendencies: LeaderTendencies      // Behavioral patterns for delegation
  tags: string[]                    // For content filtering: ['base', 'expansion-1']
}

interface InitiativeDefinition {
  id: string
  name: string
  description: string
  department: DepartmentId
  attentionCost: number
  duration: number                  // Weeks
  requiredResources: Partial<Resources>
  outcomeOverseen: OutcomeDefinition
  outcomeDelegated: OutcomeDefinition
  tags: string[]
}

interface EventDefinition {
  id: string
  name: string
  description: string
  urgency: 'ignorable' | 'pressing' | 'critical'
  choices: EventChoiceDefinition[]
  conditions?: EventCondition[]     // When can this event fire?
  tags: string[]
}
```

### Content Registry

```typescript
// src/content/registry.ts
interface ContentRegistry {
  registerPack(pack: ContentPack): void
  getLeaders(): ReadonlyArray<LeaderDefinition>
  getInitiatives(department?: DepartmentId): ReadonlyArray<InitiativeDefinition>
  getEvents(urgency?: string): ReadonlyArray<EventDefinition>
  getBalance(): BalanceConstants
  getScenarios(): ReadonlyArray<ScenarioDefinition>
  validate(): ValidationResult[]     // Check for missing refs, duplicate IDs, etc.
}
```

The registry merges all registered content packs, with later packs overriding earlier ones for balance constants. It validates:
- No duplicate IDs across packs
- All cross-references resolve (e.g., initiative references a valid department)
- Required resources reference valid resource types
- Leader stats are within valid ranges (1-10)

### Base Pack Structure

```typescript
// src/content/base-pack/leaders.ts
import type { LeaderDefinition } from '../../types/content'

export const baseLeaders: LeaderDefinition[] = [
  {
    id: 'leader-chen',
    name: 'Dr. Mei Chen',
    portrait: 'portraits/chen.png',
    backstory: 'Former crisis coordinator. Thrives under pressure, burns out fast.',
    stats: {
      judgment: 8, speed: 6, reliability: 7,
      adaptability: 5, communication: 7, riskTolerance: 4,
    },
    tendencies: {
      autonomousDecisionStyle: 'cautious',
      fatigueRate: 1.2,
      trustGrowthRate: 0.8,
    },
    tags: ['base'],
  },
  // ... more leaders
]
```

### DLC Pack Structure (Future)

```typescript
// content-packs/new-horizons/manifest.ts
import type { ContentPack } from '../../src/types/content'
import { newHorizonsLeaders } from './leaders'
import { newHorizonsInitiatives } from './initiatives'
import { newHorizonsEvents } from './events'

export const newHorizonsPack: ContentPack = {
  id: 'new-horizons',
  name: 'New Horizons',
  version: '1.0.0',
  requires: ['base'],
  leaders: newHorizonsLeaders,
  initiatives: newHorizonsInitiatives,
  events: newHorizonsEvents,
  balance: {
    resourceDecayRate: 1.5,  // Harsher environment
  },
  scenarios: [
    {
      id: 'scarcity-world',
      name: 'World of Scarcity',
      description: 'Achieve Autonomy 80 under perpetual resource pressure.',
      winCondition: { type: 'autonomy', threshold: 80, sustainedWeeks: 3 },
      startingResources: { materials: 30, trust: 40, clarity: 50 },
    },
  ],
}
```

### String & Copy Management

All player-facing text is centralized for consistency and future localization:

- **UI copy** lives in `src/content/strings.ts` as keyed string constants. Button labels, phase descriptions, tooltip text, and status messages are all accessed by key rather than hardcoded inline.
- **Hint text** is stored in `src/content/hints.ts` with associated trigger conditions (e.g., show hint when a resource drops below a threshold for the first time, or when the player enters a phase for the first time).
- **Localization** is deferred but the extension point is designed in: all player-facing strings go through a `t(key)` lookup function that returns the string for the current locale. For MVP, `t()` is a simple object lookup against `strings.ts`. When localization is needed, `t()` is swapped to load locale-specific string tables without changing any call sites.

```typescript
// src/content/strings.ts
export const strings: Record<string, string> = {
  'phase.observe.title': 'Observe',
  'phase.observe.description': 'Survey your settlement. Review resource trends and department health.',
  'button.advance_phase': 'Continue',
  'button.begin_week': 'Begin Next Week',
  // ...
}

export function t(key: string): string {
  return strings[key] ?? `[missing: ${key}]`
}
```

---

## 6. Persistence Layer

### Chosen Pattern: IndexedDB with Versioned JSON and Chained Migrations

**Primary storage**: IndexedDB via a thin wrapper. **Fallback**: localStorage (for browsers with IndexedDB issues). **Export format**: JSON file download for manual backup.

### Why IndexedDB Over localStorage

| Criteria | localStorage | IndexedDB |
|---|---|---|
| **Size limit** | 5MB (hard limit in most browsers) | Hundreds of MB (browser-managed quota) |
| **API** | Synchronous (blocks main thread) | Asynchronous (non-blocking) |
| **Data types** | Strings only (must JSON.stringify) | Native objects, blobs, typed arrays |
| **Migration support** | Manual version tracking | Built-in `onupgradeneeded` with version numbers |
| **Multiple saves** | Must namespace keys manually | Native object stores with indexes |

For a game that may eventually store multiple save slots, replay logs, and user preferences, IndexedDB is the right choice. The 5MB localStorage limit could be hit by a single long game with a full action log.

**Research precedent**: Browser storage comparison research confirms that "IndexedDB is an asynchronous, non-blocking API, which makes it much faster than synchronous storage options like LocalStorage, and saving and restoring large chunks of state will not block the main thread."

### Save File Format

```typescript
// src/persistence/serializer.ts
interface SaveFile {
  version: number              // Schema version, starts at 1
  savedAt: string              // ISO 8601 timestamp
  seed: number                 // Game seed for RNG reproducibility
  gameState: GameState         // Full state snapshot
  actionLog?: ActionLogEntry[] // Optional: for replay capability
  metadata: {
    weekNumber: number
    autonomyScore: number
    runScore: number           // Composite numeric score for leaderboards/sharing
    playTimeSeconds: number
    contentPacks: string[]     // Which packs were active
  }
}
```

### Migration Chain

Following the pattern described in [Versioning TypeScript Types](https://blog.saleae.com/versioning-typescript-types/) and [JavaScript Object Schema Migration](https://dev.to/nas5w/an-approach-to-javascript-object-schema-migration-1a94), migrations are chained functions that upgrade saves one version at a time:

```typescript
// src/persistence/migrations/index.ts
type Migration = {
  from: number
  to: number
  up: (save: unknown) => unknown
}

const migrations: Migration[] = [
  { from: 1, to: 2, up: migrateV1toV2 },
  { from: 2, to: 3, up: migrateV2toV3 },
  // ...
]

function migrateSave(save: { version: number }, targetVersion: number): SaveFile {
  let current = save
  while (current.version < targetVersion) {
    const migration = migrations.find(m => m.from === current.version)
    if (!migration) {
      throw new Error(`No migration path from v${current.version}`)
    }
    current = migration.up(current) as { version: number }
  }
  return current as SaveFile
}
```

### Migration Testing

Every migration function gets a dedicated test with a fixture of the old save format. This is non-negotiable — a broken migration means players lose their save files.

```typescript
// tests/persistence/migrations.test.ts
import { migrateV1toV2 } from '../../src/persistence/migrations/v1-to-v2'
import v1Fixture from './fixtures/save-v1.json'

test('v1 -> v2 adds momentum resource with default value', () => {
  const result = migrateV1toV2(v1Fixture)
  expect(result.version).toBe(2)
  expect(result.gameState.resources.momentum).toBe(50)
})
```

### Save Slots

IndexedDB naturally supports multiple save slots via separate records in an object store:

```typescript
// src/persistence/storage-adapter.ts
interface StorageAdapter {
  listSaves(): Promise<SaveMetadata[]>
  loadSave(slotId: string): Promise<SaveFile>
  writeSave(slotId: string, save: SaveFile): Promise<void>
  deleteSave(slotId: string): Promise<void>
  exportSave(slotId: string): Promise<string>   // JSON string for download
  importSave(json: string): Promise<SaveFile>    // Parse + validate + migrate
}
```

### Autosave Strategy

- Autosave at the end of every **Review** phase (once per in-game week).
- Autosave to a dedicated `autosave` slot, separate from manual save slots.
- Keep the previous autosave as `autosave-backup` (two-deep rotation) so a corrupted autosave doesn't destroy progress.
- Manual save available at any time via the UI.

### User Preferences

User preferences are stored separately from game saves in `localStorage` (not IndexedDB), since they are global settings that apply across all save slots and should persist even if game data is cleared.

```typescript
// src/types/game-state.ts
interface UserPreferences {
  volumeMaster: number    // 0-1
  volumeMusic: number     // 0-1
  volumeSfx: number       // 0-1
  showHints: boolean
  highContrast: boolean
  reducedMotion: boolean
  streamerMode: boolean
}
```

- **volumeMaster / volumeMusic / volumeSfx**: Independent volume sliders for the audio system. `volumeMaster` scales all audio output.
- **showHints**: Toggles contextual hints (sourced from `src/content/hints.ts`).
- **highContrast**: Enables a high-contrast color scheme for accessibility.
- **reducedMotion**: Disables animations and transitions (respects `prefers-reduced-motion` media query as default).
- **streamerMode**: Hides any potentially identifying information (e.g., email in demo wall) for content creators.

Preferences are loaded at startup and written on change via `localStorage.setItem('steadward-preferences', JSON.stringify(prefs))`. The settings screen (`src/ui/screens/settings-screen.ts`) provides the UI for modifying all preference values.

---

## 7. Demo/Paid Gating

### Chosen Pattern: Build-Time Content Exclusion with Runtime Feature Flags

This is the most architecturally sensitive decision. The monetization strategy specifies a free demo (3-5 in-game weeks) converting to a paid full game. The gating must ensure:

1. **Paid content is not shipped in the demo build** — client-side JavaScript is trivially inspectable. If DLC content exists in the demo bundle, determined users will extract it.
2. **One codebase** — maintaining two separate codebases (demo and full) is a maintenance nightmare.
3. **Clean upgrade path** — purchasing the game should feel seamless, not require a separate download.

### How It Works

Fowler categorizes feature toggles into four types. The demo/paid gate is a **Permissioning Toggle** — a long-lived, per-user toggle that controls feature access. However, unlike a typical server-side permissioning toggle, Steadward has no server. The solution combines two mechanisms:

**1. Build-Time Content Exclusion (Primary)**

Vite's build system handles conditional compilation via environment variables and dynamic imports:

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __EDITION__: JSON.stringify(process.env.EDITION || 'demo'),
  },
})
```

```typescript
// src/content/index.ts
import { basePack } from './base-pack'
import type { ContentPack } from '../types/content'

const packs: ContentPack[] = [basePack]

if (__EDITION__ === 'full') {
  // Vite tree-shakes this entire branch in demo builds.
  // The full content is never in the demo bundle.
  const { fullContentPack } = await import('./full-pack')
  packs.push(fullContentPack)
}

export function getActivePacks(): ContentPack[] {
  return packs
}
```

This produces **two separate builds**:
- `npm run build:demo` — only base-pack content, demo-limited week count
- `npm run build:full` — all content, no week limit

The demo build literally does not contain the full game's content in its JavaScript bundle. There is nothing to extract.

**2. Runtime Week Gate (Secondary)**

Even within the demo build, the turn manager enforces a hard stop:

```typescript
// src/engine/turn-manager.ts
const DEMO_WEEK_LIMIT = 5

function canAdvanceWeek(state: GameState): boolean {
  if (__EDITION__ === 'demo' && state.turn.week >= DEMO_WEEK_LIMIT) {
    return false // Trigger demo paywall screen
  }
  return true
}
```

**3. DLC Content Packs (Future)**

Each paid expansion is a separate content pack that is only included in builds that have that expansion enabled:

```typescript
// npm run build:full-with-dlc1
// EDITION=full DLC_NEW_HORIZONS=true vite build
```

### Build Matrix

| Build | Command | Contents | Distribution |
|---|---|---|---|
| Demo | `npm run build:demo` | Base pack, 5-week limit | steadward.com, itch.io (free) |
| Full (web) | `npm run build:full` | All base content, no limit | steadward.com (paid), itch.io (paid) |
| Full (Steam) | `npm run build:steam` | Full + Steam adapter + achievements | Steam |
| Full + DLC1 | `npm run build:full-dlc1` | Full + New Horizons pack | All platforms (paid upgrade) |

---

## 8. Distribution Pipeline

### Chosen Pattern: Web-First, NW.js for Desktop, Platform Adapters

Steadward's monetization strategy defines a clear platform rollout: web + itch.io (launch) -> Steam (month 3-6) -> mobile (month 6-12). The architecture must support this progression without rewrites.

### Why NW.js for Desktop (Not Electron, Not Tauri)

Research into browser-game-to-desktop distribution revealed a clear picture:

| Framework | Bundle Size | Steam Support | Cross-Platform Build | Ecosystem |
|---|---|---|---|---|
| **Electron** | ~100MB+ (bundles Chromium) | Official via Steamworks.js | Supported via electron-builder | Largest ecosystem, but bloated |
| **Tauri** | ~6MB (uses OS webview) | No official Steam library; requires Rust for complex integrations | Can only build for current dev platform | Lightweight but immature for games |
| **NW.js** | ~80MB (bundles Chromium) | Official via Steamworks.js and Greenworks | Supported via nw-builder | Powers 5,700+ Steam games via RPG Maker, Construct |
| **WebView2** | Tiny (uses Edge) | Manual C++ integration | Windows only | Not viable for cross-platform |

**NW.js is the pragmatic choice** for these reasons:

1. **Proven at scale**: 5,700+ games on Steam use NW.js (via RPG Maker and Construct exports). It is the most battle-tested browser-game-to-Steam pipeline.
2. **No frontend/backend split**: "NW.js does not make a separation between the JavaScript that runs in the browser and the one that runs in Node.js." This means the game code runs identically in the browser and in NW.js — no IPC layer, no preload scripts, no context bridge.
3. **Steamworks.js support**: The actively maintained [Steamworks.js](https://github.com/ceifa/steamworks.js) library provides TypeScript bindings for the Steamworks SDK and officially supports NW.js.
4. **Simple cross-compilation**: nw-builder produces Win64, Win32, macOS, and Linux binaries from a single command.

**Why not Electron**: Electron is viable but adds unnecessary complexity. The separate main/renderer process model requires IPC for file system access and Steam API calls. For a single-player game with no complex native integrations beyond Steam, this overhead is unjustified.

**Why not Tauri**: Tauri's 6MB bundle size is appealing, but it uses OS-native webviews (WebKit on macOS, WebView2 on Windows, WebKitGTK on Linux), which means inconsistent rendering across platforms. More critically, there is no official Steam integration library for Tauri — Steamworks.js does not support it. The dependency count (1,200+) and the requirement to write Rust for any complex native functionality make it a poor fit for a solo developer.

### Platform Adapter Interface

```typescript
// src/platform/adapter.ts
interface PlatformAdapter {
  // Identity
  getPlatform(): 'web' | 'steam' | 'itch'

  // Persistence (platform-specific save locations)
  getSaveDir(): string | null          // null for web (uses IndexedDB)
  supportsCloudSave(): boolean

  // Analytics
  sendEvent(event: AnalyticsEvent): void

  // Platform features
  unlockAchievement?(id: string): void
  setRichPresence?(status: string): void

  // Social sharing (platform-specific)
  canShare(): boolean
  shareRun?(summary: RunSummary): Promise<void>  // navigator.share on web, Steam overlay on Steam

  // Purchasing (for demo -> full upgrade on web)
  canPurchase(): boolean
  openPurchaseFlow?(): void
}
```

### Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build:demo": "EDITION=demo vite build",
    "build:full": "EDITION=full vite build",
    "build:steam": "EDITION=full PLATFORM=steam vite build && nw-builder --platforms win64,osx64,linux64 ./dist",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

### Progressive Rollout

**Phase 0.5 (Week 6, game jam build)**: A stripped-down playable prototype for itch.io game jams. Technically, this is the Phase 4 engine (all systems, seeded RNG, core loop) with a minimal temporary UI — enough to play in a browser but not the final UI. The engine/UI separation makes this possible: build a quick `jam-ui/` that renders state to basic HTML tables/buttons, submit to jams for feedback and discovery, then replace with the real UI in Phase 5-6. The jam UI is disposable.

**Phase 1 (Launch)**: Web build only. Deploy demo to steadward.com and itch.io. Full version available via itch.io purchase or direct web purchase (Stripe/Paddle checkout).

**Phase 2 (Month 3-6)**: Add NW.js packaging. Create `steam-adapter.ts` implementing `PlatformAdapter`. Integrate Steamworks.js for achievements, cloud saves, and overlay. Submit to Steam.

**Phase 2.5 (Week 10, alongside Steam page)**: Landing page at `steadward.com` — not just the game, but a marketing wrapper. Structure:
- Playable demo iframe (or direct embed)
- 4-6 screenshots, 30-second GIF/trailer
- Purchase links (itch.io, Steam, direct)
- Email capture form
- Presskit page (use [presskit.gg](https://presskit.gg/) or a static `/press/` route) with downloadable assets, logo variations, one-paragraph pitch
- This is a static site (Vite can build it) — no separate framework needed

**Phase 3 (Week 24-48, if warranted)**: Evaluate mobile. The vanilla DOM approach means the game already works in mobile browsers. A dedicated mobile build would use a PWA wrapper (Capacitor or TWA) rather than a native port.

---

## 9. Analytics & Telemetry

### Chosen Pattern: Privacy-First Custom Events with Plausible Analytics

### Philosophy

The monetization strategy targets Into the Breach / Slay the Spire players — a demographic that is privacy-conscious and hostile to invasive tracking. The analytics system must:

1. **Collect no PII** — no IP addresses, no device fingerprints, no user accounts.
2. **Require no consent banner** — by collecting only anonymous aggregate data, we avoid GDPR/CCPA consent flows that add friction to a zero-friction demo.
3. **Be lightweight** — the analytics script must not impact game performance or bundle size.
4. **Be optional** — the game works identically with analytics disabled.

### Implementation

**[Plausible Analytics](https://plausible.io/)** is the recommended analytics platform. It is:
- Open source (AGPL), self-hostable
- < 1KB script, no cookies, GDPR-compliant without consent banners
- Supports custom events for game-specific metrics
- Cloud-hosted plan starts at $9/month; self-hosted is free

**Alternative considered**: GameAnalytics (free tier, game-specific metrics). Rejected because it requires user identification, sets cookies, and the SDK is 50KB+ — inappropriate for a privacy-first browser game.

**Alternative considered**: Custom telemetry endpoint. Rejected for MVP — building and hosting a custom analytics backend is unnecessary when Plausible exists.

### What We Track

```typescript
// src/analytics/events.ts
type AnalyticsEvent =
  // Funnel events
  | { name: 'game_start'; props: { edition: 'demo' | 'full'; seed: number } }
  | { name: 'week_complete'; props: { week: number; autonomyScore: number } }
  | { name: 'demo_wall_hit'; props: { week: number; playTimeSeconds: number } }
  | { name: 'purchase_clicked'; props: { source: 'demo_wall' | 'menu' } }
  | { name: 'game_won'; props: { weeks: number; playTimeSeconds: number } }
  | { name: 'game_lost'; props: { weeks: number; cause: string } }
  // Balance insight events
  | { name: 'initiative_completed'; props: { id: string; delegated: boolean } }
  | { name: 'event_choice'; props: { eventId: string; choiceIndex: number } }
  | { name: 'leader_burnout'; props: { leaderId: string; week: number } }
```

### What We Do NOT Track

- No player identity or session linking
- No mouse movements, click heatmaps, or scroll tracking
- No save file contents
- No IP-based geolocation
- No third-party cookies or cross-site tracking

### Integration

```typescript
// src/analytics/telemetry.ts
class Telemetry {
  private enabled: boolean
  private queue: AnalyticsEvent[] = []

  constructor(enabled: boolean) {
    this.enabled = enabled
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled) return
    this.queue.push(event)
    this.flush()
  }

  private flush(): void {
    // Plausible custom event API
    // https://plausible.io/docs/custom-event-goals
    if (typeof plausible === 'function') {
      for (const event of this.queue) {
        plausible(event.name, { props: event.props })
      }
      this.queue = []
    }
  }
}
```

**Timing**: Analytics must be wired in **Phase 2** (when the game store is built), not deferred to Polish. Funnel data (`game_start` → `week_complete` → `demo_wall_hit`) must be live before any public beta or Steam Next Fest. Without this, you go into open beta blind.

The telemetry instance is injected into the game store as a subscriber, not embedded in game logic:

```typescript
const telemetry = new Telemetry(/* enabled */ true)
store.subscribe((state, action) => {
  if (action.type === 'TICK_WEEK') {
    telemetry.track({
      name: 'week_complete',
      props: { week: state.turn.week, autonomyScore: state.autonomyScore },
    })
  }
})
```

---

## 10. Offline/PWA Strategy

### Chosen Pattern: Vite PWA Plugin with Cache-First Static Assets

Steadward is a single-player, offline-first game with no server-side logic. It should work perfectly without an internet connection after the first load. This is a natural fit for a Progressive Web App.

### Implementation

**[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** automates service worker generation with Workbox. It:
- Pre-caches all static assets (HTML, CSS, JS, images, fonts) on first visit
- Uses a **Cache-First** strategy for versioned assets — serve from cache, never hit the network
- Uses **Stale-While-Revalidate** for the HTML shell — serve cached version immediately, update in background
- Generates a web app manifest for installability

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [],  // No runtime caching needed — everything is pre-cached
      },
      manifest: {
        name: 'Steadward',
        short_name: 'Steadward',
        description: 'A strategy game about attention, delegation, and building autonomy.',
        theme_color: '#0D1117',
        background_color: '#0D1117',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
```

### What This Enables

1. **Instant loading** — after first visit, the game loads entirely from cache. No network requests.
2. **Offline play** — the game works in airplane mode, in spotty Wi-Fi, anywhere.
3. **Installability** — browsers show an "Add to Home Screen" prompt. The game appears as a native app icon on desktop and mobile.
4. **Update mechanism** — when a new version is deployed, the service worker detects the change and updates assets in the background. On next load, the player gets the new version with a subtle "New version available" toast.

### PWA vs. Native (for Mobile)

The monetization strategy mentions an eventual mobile port. Before investing in Capacitor or a native wrapper, test whether the PWA experience is sufficient:

- PWA on iOS: Limitations include no push notifications (changing in recent WebKit), no background sync, 50MB total storage limit. For Steadward (no push, no background sync, save files under 1MB), these limitations are irrelevant.
- PWA on Android: Near-native experience. Chrome supports full-screen, installable PWAs with no practical limitations for a single-player game.

**Recommendation**: Ship the PWA first. Only build a native mobile wrapper if PWA adoption metrics (installed users, session length) indicate demand and the platform limitations prove real.

---

## 11. Testing Architecture

### Testing Pyramid

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲         Playwright: Full game flow
                 ╱______╲        (2-3 critical paths)
                ╱        ╲
               ╱Simulation╲     Automated playthroughs
              ╱____________╲    (balance testing, win rate)
             ╱              ╲
            ╱  Integration   ╲   Multi-system interactions
           ╱__________________╲  (turn cycle, save/load roundtrip)
          ╱                    ╲
         ╱     Unit Tests       ╲  Individual system functions
        ╱________________________╲ (attention calc, delegation formula)
```

### Unit Tests (vitest)

Every function in `src/systems/` gets unit tests. These are pure functions — no DOM, no side effects, no mocking needed.

```typescript
// tests/systems/attention.test.ts
import { calculateAttentionBudget, spendAttention } from '../../src/systems/attention'

test('base attention budget is 10', () => {
  const state = createTestState()
  expect(calculateAttentionBudget(state)).toBe(10)
})

test('low clarity increases attention cost by 20%', () => {
  const state = createTestState({ resources: { clarity: 20 } })
  const cost = calculateAttentionCost(state, someInitiative)
  expect(cost).toBe(Math.ceil(someInitiative.attentionCost * 1.2))
})
```

### Integration Tests (vitest)

Multi-system interactions: dispatching an action and verifying the resulting state across multiple systems.

```typescript
// tests/engine/turn-cycle.test.ts
test('completing a full week cycle advances the week counter', () => {
  const store = createTestStore()
  store.dispatch({ type: 'ADVANCE_PHASE' }) // Observe -> Plan
  store.dispatch({ type: 'ASSIGN_LEADER', leaderId: 'chen', departmentId: 'ops' })
  store.dispatch({ type: 'ADVANCE_PHASE' }) // Plan -> Execute
  store.dispatch({ type: 'ADVANCE_PHASE' }) // Execute -> Review
  store.dispatch({ type: 'ADVANCE_PHASE' }) // Review -> Observe (week 2)
  expect(store.getState().turn.week).toBe(2)
})
```

### Simulation Tests (vitest)

Automated playthroughs that run the game headlessly (no DOM) for hundreds of games with different seeds. These are the **architectural fitness functions** from *Building Evolutionary Architectures*:

```typescript
// tests/simulations/balance.test.ts
test('win rate with random play is between 5% and 30%', () => {
  const results = runSimulations({
    count: 500,
    strategy: 'random',  // Random valid actions
    maxWeeks: 30,
  })
  const winRate = results.wins / results.total
  expect(winRate).toBeGreaterThan(0.05)
  expect(winRate).toBeLessThan(0.30)
})

test('average game length is between 12 and 25 weeks', () => {
  const results = runSimulations({ count: 500, strategy: 'random', maxWeeks: 40 })
  expect(results.averageWeeks).toBeGreaterThan(12)
  expect(results.averageWeeks).toBeLessThan(25)
})

test('no resource consistently hits zero before week 5', () => {
  const results = runSimulations({ count: 200, strategy: 'random', maxWeeks: 5 })
  expect(results.earlyLossRate).toBeLessThan(0.10)
})
```

These simulations serve as **fitness functions** — they run in CI and fail the build if a balance change breaks the game's statistical properties. As Fowler and the *Building Evolutionary Architectures* authors define it: "An architectural fitness function provides an objective integrity assessment of some architectural characteristic." Here, the characteristics being protected are game balance, pacing, and fairness.

### E2E Tests (Playwright)

2-3 critical user journeys tested in a real browser:

1. **New game to first week completion**: Start game -> Observe -> Plan (assign leader) -> Execute -> Review -> verify week 2.
2. **Save/load roundtrip**: Play 3 weeks -> save -> reload page -> load save -> verify state matches.
3. **Demo paywall**: Play demo build to week 5 -> verify paywall screen appears -> verify "Purchase" link works.

### Seeded RNG for Reproducibility

The game uses a seeded pseudo-random number generator (Mulberry32 or sfc32 — both are fast 32-bit PRNGs suitable for games). The seed is stored in the save file. This means:

- Every test runs with a known seed, making results deterministic.
- Bug reports can include the seed, allowing exact reproduction.
- Simulation tests produce consistent results across runs (same seed batch = same statistics).

```typescript
// src/utils/random.ts
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface SeededRNG {
  next(): number                    // 0-1
  nextInt(min: number, max: number): number
  pick<T>(array: T[]): T
  shuffle<T>(array: T[]): T[]
  getSeed(): number
}
```

---

## 12. Evolutionary Architecture

### What to Build Now vs. What to Defer

Fowler's core insight: "One of the best things to do with an early version of a system is to explore what the best modular structure should be so that you can build on that knowledge for the replacement." The MVP should validate the modular boundaries, not build every feature.

### Phase Map

| Component | Build Now (MVP) | Build for Steam (Month 3-6) | Build if Proven (Month 6+) |
|---|---|---|---|
| **State management** | Action-reducer with log | No changes needed | Event sourcing upgrade if multiplayer/leaderboards |
| **Phase state machine** | Enum + switch | No changes needed | XState if crisis modes / branching phases added |
| **Content system** | Content Registry + base pack | DLC pack loading | Mod loader / user content packs |
| **Persistence** | IndexedDB + migrations | Steam Cloud adapter | Cross-device sync |
| **Gating** | Build-time exclusion + week limit | Steam DLC integration | License server if web piracy is a problem |
| **Distribution** | Vite build for web | NW.js + Steamworks.js | PWA / Capacitor for mobile |
| **Analytics** | Plausible custom events (**Phase 2**, not deferred) | Steam analytics integration | Custom telemetry if scale demands it |
| **PWA** | vite-plugin-pwa + manifest | Not needed for Steam | Service worker for mobile PWA |
| **Testing** | Unit + integration tests | Simulation fitness functions | Playwright E2E |
| **Save system** | Single autosave slot | Multiple save slots + export | Steam Cloud saves |
| **Sharing** | Share card renderer, challenge URLs, OG meta tags | Steam screenshot/overlay integration | Replay highlights, Discord webhook |
| **SEO** | OG meta, Twitter Cards, Schema.org structured data | Steam page metadata | Dynamic OG via edge function for shared run URLs |
| **Email capture** | Demo wall email form (Buttondown/Mailchimp) | N/A | Automated drip campaigns |

### Fitness Functions (Automated Architecture Guards)

These run in CI and protect architectural properties from degradation:

```typescript
// tests/architecture/fitness.test.ts

test('systems/ has no imports from ui/', () => {
  // Enforces the engine/UI boundary
  const systemFiles = glob.sync('src/systems/**/*.ts')
  for (const file of systemFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    expect(content).not.toMatch(/from ['"]\.\.\/ui\//)
    expect(content).not.toMatch(/from ['"]\.\.\/\.\.\/ui\//)
  }
})

test('content definitions contain no function values', () => {
  // Enforces "content is data, not code"
  const registry = loadContentRegistry()
  for (const leader of registry.getLeaders()) {
    for (const value of Object.values(leader)) {
      expect(typeof value).not.toBe('function')
    }
  }
})

test('game state is JSON-serializable', () => {
  // Enforces serializability for save/load
  const store = createTestStore()
  const state = store.getState()
  const roundTripped = JSON.parse(JSON.stringify(state))
  expect(roundTripped).toEqual(state)
})

test('demo build does not contain full content', () => {
  // Run against the demo build output
  const demoBundle = fs.readFileSync('dist/demo/assets/index.js', 'utf-8')
  expect(demoBundle).not.toContain('new-horizons')
  expect(demoBundle).not.toContain('inner-circle')
  // Check that full-only leaders aren't in the demo
  expect(demoBundle).not.toContain('expansion-leader-')
})

test('all content IDs are unique across packs', () => {
  const registry = loadContentRegistry()
  const allIds = [
    ...registry.getLeaders().map(l => l.id),
    ...registry.getInitiatives().map(i => i.id),
    ...registry.getEvents().map(e => e.id),
  ]
  const unique = new Set(allIds)
  expect(unique.size).toBe(allIds.length)
})
```

### Architectural Decision Records

As the project evolves, decisions should be recorded. The format is simple:

```
docs/decisions/
  001-action-reducer-over-event-sourcing.md
  002-indexeddb-over-localstorage.md
  003-nwjs-over-electron-for-steam.md
  004-plausible-over-gameanalytics.md
```

Each file contains: **Context** (what prompted the decision), **Decision** (what was chosen), **Consequences** (what follows from this choice), and **Status** (proposed/accepted/superseded). This is Fowler's recommended practice for maintaining institutional knowledge as architecture evolves.

### When to Reconsider

| Signal | Architectural Response |
|---|---|
| State bugs from mutation | Adopt Immer for immutability enforcement |
| Phase machine needs branching (crisis mode, parallel events) | Introduce XState for the phase FSM |
| DLC content packs exceed 5 | Build a proper mod loader with dynamic import and sandboxing |
| Save files exceed 5MB | Add action-log compression (LZString) or switch to snapshot-only saves |
| Web piracy significantly impacts revenue | Add lightweight license validation (still no account required — one-time token) |
| Mobile PWA adoption is high | Invest in Capacitor wrapper for app store presence |
| Multiplayer or leaderboard verification needed | Upgrade action log to full event sourcing with server-side replay |

---

## 13. GTM Architecture

Growth-driven features that impact the technical architecture. These were identified by Growth PM review and validated against research on indie browser game distribution patterns.

### 13.1 URL Routing & Deep Linking

The `main.ts` entry point must parse URL state at startup. This is the foundation for seed-based challenges, shared runs, and embeddable demos.

```typescript
// src/utils/url.ts
interface GameConfig {
  seed?: number          // /play?seed=12345
  challenge?: string     // /play?challenge=weekly-2026-03-14
  mode?: 'demo' | 'full'
}

function parseGameConfig(): GameConfig {
  const params = new URLSearchParams(window.location.search)
  return {
    seed: params.has('seed') ? Number(params.get('seed')) : undefined,
    challenge: params.get('challenge') ?? undefined,
    mode: (__EDITION__ as string) === 'demo' ? 'demo' : 'full',
  }
}
```

`main.ts` calls `parseGameConfig()` and passes the result to `createGameStore()`. This is 20 lines of code but must be designed in from Phase 1 — retrofitting URL-based initialization means rewriting the startup flow.

### 13.2 Shareable Run Summary & Victory Screen

The victory/loss screen is the game's primary marketing asset. Every completed run should produce a shareable composition.

```typescript
// src/types/sharing.ts
interface RunSummary {
  seed: number
  outcome: 'win' | 'loss'
  weeksPlayed: number
  runScore: number              // Composite numeric score
  autonomyScore: number
  leadersUsed: string[]
  keyEvents: string[]           // Names of critical events weathered
  resourcesAtEnd: Record<string, number>
  highlights: ActionLogEntry[]  // Interesting moments from the action log
}

// src/ui/share.ts
function generateShareImage(summary: RunSummary): Promise<Blob> {
  // Renders summary to an offscreen canvas at 1200x630 (OG image size)
  // Returns a PNG blob for download or navigator.share()
}

function generateChallengeUrl(seed: number): string {
  return `${window.location.origin}/play?seed=${seed}`
}

function shareRun(summary: RunSummary): Promise<void> {
  if (navigator.share) {
    return navigator.share({
      title: `Steadward — ${summary.outcome === 'win' ? 'Victory' : 'Defeat'} in ${summary.weeksPlayed} weeks`,
      text: `Score: ${summary.runScore}. Can you beat my run?`,
      url: generateChallengeUrl(summary.seed),
    })
  }
  // Fallback: copy challenge URL to clipboard
  return navigator.clipboard.writeText(generateChallengeUrl(summary.seed))
}
```

The `RunSummary` is a serializable data object, not a DOM element. This enables future Discord webhook posting, leaderboard submission, and content creator tools without refactoring.

### 13.3 SEO & Social Meta Tags

`index.html` includes these from Phase 1:

```html
<!-- Primary meta -->
<title>Steadward — A Strategy Game About Attention and Delegation</title>
<meta name="description" content="Manage a frontier settlement by choosing where to focus, who to trust, and when to let go. A browser-based strategy game.">

<!-- Open Graph (Discord, Facebook, Slack, iMessage) -->
<meta property="og:title" content="Steadward — A Strategy Game About Attention and Delegation">
<meta property="og:description" content="Manage a frontier settlement by choosing where to focus, who to trust, and when to let go.">
<meta property="og:image" content="https://steadward.com/og-image.png">
<meta property="og:url" content="https://steadward.com">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Steadward">
<meta name="twitter:description" content="A strategy game about attention, delegation, and building autonomy.">
<meta name="twitter:image" content="https://steadward.com/og-image.png">

<!-- Schema.org structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Steadward",
  "description": "A browser-based strategy game about managing attention, delegation, and coordination.",
  "genre": ["Strategy", "Management", "Turn-Based"],
  "gamePlatform": "Web Browser",
  "operatingSystem": "Any",
  "playMode": "SinglePlayer",
  "applicationCategory": "Game"
}
</script>
```

The `og:image` must be a 1200x630 gameplay screenshot (not a logo). This is the single most important marketing asset for social sharing.

### 13.4 Demo Wall with Email Capture

The demo paywall screen at week 5 includes an email capture field alongside the purchase CTA.

```typescript
// src/ui/screens/demo-wall-screen.ts
// Renders:
//   - "Your settlement is growing..." narrative hook
//   - Summary of what's in the full game (X more leaders, Y events, Z scenarios)
//   - Purchase button (links to itch.io/Steam/direct)
//   - Email input: "Not ready? Get notified when the full game launches."
//   - Submit POSTs to email service (Buttondown API or Mailchimp)
//   - Fire-and-forget: graceful failure, no retry, no blocking

async function submitEmail(email: string): Promise<void> {
  try {
    await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch {
    // Silent failure — do not block the player
  }
}
```

This is the only network call the game makes besides analytics. The email list is the highest-converting channel on launch day.

### 13.5 Composite Run Scoring

The scoring system must output a numeric score from day one, not just binary win/lose:

```typescript
// src/systems/scoring.ts
function calculateRunScore(state: GameState): number {
  // Factors: weeks-to-win (fewer = better), resources remaining,
  // leaders not burned out, events weathered, attention efficiency
  // Returns 0-10000 scale for leaderboard granularity
}
```

This score appears on the victory screen, the share card, and powers future challenge leaderboards. Without it, seed-based competitions have no comparison metric.

### 13.6 Action Log Highlights

Add a `highlight` flag to action log entries for high-drama moments:

```typescript
interface ActionLogEntry {
  action: Action
  timestamp: number
  highlight?: boolean   // True for critical events, close-call saves, win/loss
}

function isHighlightAction(newState: GameState, prevState: GameState, action: Action): boolean {
  // Flag if: critical event resolved, resource dropped below 20, resource saved from <10,
  // leader burned out, autonomy score crossed 80, win/loss triggered
}
```

Cost: one boolean field per action. Enables future "run replay highlights" for content creators and short-form video generation.

### 13.7 Iframeability

The game must be embeddable in iframes for press sites, itch.io pages, and potential widget distribution. Ensure:
- No `X-Frame-Options: DENY` header on the demo build
- Game renders correctly within constrained viewport sizes
- No `target="_top"` or `window.top` references that break iframe embedding

---

## Appendix A: Technology Choices Summary

| Concern | Choice | Alternatives Rejected | Key Reason |
|---|---|---|---|
| Language | TypeScript | JavaScript | Type safety for complex game state |
| UI framework | Vanilla DOM | React, Svelte, Phaser | Dashboard game = HTML/CSS native; no 60fps loop |
| Build tool | Vite | Webpack, Parcel | Fast HMR, native ESM, PWA plugin ecosystem |
| State pattern | Action-Reducer + Log | Redux, XState, ECS, MobX | Simplest pattern that gives replay + debug |
| Persistence | IndexedDB (primary) | localStorage | Async, larger quota, native versioning |
| Save format | Versioned JSON | Binary, Protobuf | Human-readable, debuggable, trivial to serialize |
| Desktop wrapper | NW.js | Electron, Tauri | 5,700+ Steam games, no IPC split, Steamworks.js support |
| Analytics | Plausible | GameAnalytics, custom | < 1KB, no cookies, GDPR-compliant, custom events |
| PWA | vite-plugin-pwa | Custom service worker | Workbox integration, auto-precaching, manifest generation |
| Testing | vitest + Playwright | Jest + Cypress | Native Vite integration, faster execution |
| Audio | Howler.js | Web Audio API (raw), Tone.js | Web audio playback; 7KB gzipped, supports sprites, fading, spatial audio |
| RNG | Mulberry32 (seeded) | Math.random | Deterministic replay, reproducible tests |

## Appendix B: Research Sources

### Martin Fowler's Writings
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) — principles of storing all state changes as events
- [Sacrificial Architecture](https://martinfowler.com/bliki/SacrificialArchitecture.html) — designing systems you plan to replace
- [Foreword to Building Evolutionary Architectures](https://martinfowler.com/articles/evo-arch-forward.html) — fitness functions and incremental change
- [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — categories and implementation patterns for feature flags

### Browser Game Architecture
- [Slay the Web](https://github.com/oskarrough/slaytheweb) — open-source browser card game using action-reducer state management
- [Undo/Redo State with Event Sourcing](https://ericjinks.com/blog/2025/event-sourcing/) — event log patterns for browser applications
- [The Struggle of Wrapping a JavaScript Game for Desktop](https://jslegenddev.substack.com/p/the-struggle-of-wrapping-a-javascript) — NW.js vs Electron vs Tauri comparison
- [Desktop Publishing for Web Games](https://www.webgamedev.com/publishing/desktop) — comprehensive framework comparison

### Browser Persistence and Storage
- [Browser Storage Comparison](https://recca0120.github.io/en/2026/03/06/browser-storage-comparison/) — sql.js vs IndexedDB vs localStorage benchmarks
- [Versioning TypeScript Types](https://blog.saleae.com/versioning-typescript-types/) — DeepUnion pattern for schema evolution
- [JavaScript Object Schema Migration](https://dev.to/nas5w/an-approach-to-javascript-object-schema-migration-1a94) — chained migration functions

### Distribution and Steam Integration
- [Porting a Browser Game to Steam (Part 1)](https://log.schemescape.com/posts/game-development/browser-based-game-on-steam.html) — research on framework selection
- [Porting a Browser Game to Steam (Part 2)](https://log.schemescape.com/posts/game-development/browser-based-game-on-steam-2.html) — WebView2 vs Electron vs Tauri evaluation
- [Steamworks.js](https://github.com/ceifa/steamworks.js) — TypeScript Steamworks SDK for NW.js/Electron
- [Releasing a Web Game onto Steam](https://dev.to/jacklehamster/releasing-a-web-game-onto-steam-47cd) — practical guide

### Analytics and Telemetry
- [Plausible Analytics](https://plausible.io/) — privacy-first, open-source web analytics
- [GameAnalytics](https://www.gameanalytics.com/) — game-specific analytics (evaluated, not chosen)

### PWA and Offline
- [vite-plugin-pwa Documentation](https://vite-pwa-org.netlify.app/) — service worker precaching and manifest generation
- [MDN: Making PWAs Work Offline](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers) — service worker fundamentals for games
- [Workbox Caching Strategies](https://vite-pwa-org.netlify.app/workbox/generate-sw) — CacheFirst, NetworkFirst, StaleWhileRevalidate

### Content and Plugin Architecture
- [Designing a Plugin System in TypeScript](https://dev.to/hexshift/designing-a-plugin-system-in-typescript-for-modular-web-applications-4db5) — plugin registration, lifecycle, and type safety
- [Modular Game Features in UE5](https://www.unrealengine.com/en-US/blog/modular-game-features-in-ue5-plug-n-play-the-unreal-way) — content pack architecture principles

### Seeded Randomness
- [Mulberry32 for Deterministic Randomness](https://emanueleferonato.com/2026/01/08/understanding-how-to-use-mulberry32-to-achieve-deterministic-randomness-in-javascript/) — implementation and use in games
- [Prando](https://github.com/zeh/prando) — deterministic PRNG library for TypeScript
