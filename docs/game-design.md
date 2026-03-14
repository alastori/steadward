# Inhabit — MVP Implementation Plan

## Context

Building a browser-based strategy/management game called **Inhabit** from scratch. The core fantasy: "You are the coordinator of a living system. You cannot do everything. You must sense, choose, focus, delegate, absorb surprises, and keep momentum." The differentiator is that the player explicitly manages **attention, prioritization, and coordination modes** — not just resources and buildings.

Setting: A new settlement on a harsh frontier world. The player manages 4 departments, 3-5 leaders, an attention budget, and cycles through Observe → Plan → Execute → Review phases each week.

**Visual style**: Into the Breach — clean, information-dense, muted blues/grays with sharp accent colors for mode states and alerts. Readable grid layouts, pixel-precise UI, minimal but purposeful animation. Dense information without clutter.

---

## Tech Stack

| Choice | Rationale |
|---|---|
| **TypeScript** | Type safety for complex game state |
| **Vanilla DOM** (no React/Phaser) | This is a dashboard/card-heavy strategy game — HTML/CSS handles panels, text, and layout natively. No 60fps render loop needed. |
| **Vite** | Fast dev server with HMR |
| **vitest** | Unit testing for game systems |
| **CSS custom properties** | Mode-specific theming via `data-mode` attribute on root |

---

## Project Structure

```
inhabit/
├── index.html
├── package.json / tsconfig.json / vite.config.ts
├── src/
│   ├── main.ts                    # Entry point
│   ├── types/                     # All interfaces & enums
│   │   ├── game-state.ts          # Central GameState interface
│   │   ├── resources.ts           # Resource types
│   │   ├── leaders.ts             # Leader stats & interfaces
│   │   ├── departments.ts         # Department types
│   │   ├── initiatives.ts         # Project card types
│   │   ├── events.ts              # Interruption event types
│   │   └── modes.ts               # GameMode enum
│   ├── state/
│   │   ├── game-store.ts          # Central state + pub/sub event bus
│   │   ├── resource-manager.ts    # Apply deltas, clamping
│   │   ├── turn-manager.ts        # Week/phase progression
│   │   └── save-load.ts           # LocalStorage persistence
│   ├── systems/
│   │   ├── attention.ts           # Budget calc, spending, validation
│   │   ├── departments.ts         # Health decay, passive output
│   │   ├── leaders.ts             # Assignment, fatigue, trust
│   │   ├── initiatives.ts         # Start, progress, resolve projects
│   │   ├── delegation.ts          # Outcome quality from leader stats
│   │   ├── events.ts              # Draw & resolve interruptions
│   │   └── scoring.ts             # Autonomy score, win/loss
│   ├── data/
│   │   ├── balance.ts             # All tuning constants
│   │   ├── starter-leaders.ts     # 3-5 predefined leaders
│   │   ├── starter-initiatives.ts # 10-15 initiative cards
│   │   └── event-pool.ts          # 8-10 interruption events
│   ├── ui/
│   │   ├── renderer.ts            # Top-level DOM orchestrator
│   │   ├── components/            # Reusable UI pieces
│   │   │   ├── header-bar.ts
│   │   │   ├── resource-panel.ts
│   │   │   ├── department-card.ts
│   │   │   ├── leader-card.ts
│   │   │   ├── initiative-card.ts
│   │   │   └── event-modal.ts
│   │   ├── modes/                 # One view per game mode
│   │   │   ├── observe-view.ts
│   │   │   ├── plan-view.ts
│   │   │   ├── execute-view.ts
│   │   │   └── review-view.ts
│   │   └── screens/
│   │       ├── title-screen.ts
│   │       ├── game-screen.ts
│   │       └── victory-screen.ts
│   └── utils/
│       ├── random.ts              # Seeded RNG
│       └── dom.ts                 # DOM helpers
├── styles/
│   ├── main.css
│   ├── variables.css              # Mode color themes
│   ├── layout.css
│   ├── components.css
│   └── modes.css
└── tests/
    └── systems/                   # Unit tests for core systems
```

---

## Core Data Model

**Primary resource: Attention** — finite weekly budget (~10 points), spent on overseeing initiatives, handling interruptions, reading reports. Does NOT carry over between weeks.

**Secondary resources** (0-100 each): Materials, Trust, Clarity, Resilience, Knowledge, Momentum. These interact (e.g., low Clarity increases coordination cost, low Trust weakens delegation).

**Departments**: Operations, Infrastructure, Research, External Affairs — each with health (0-100), assigned leader, active initiatives (max 2), and passive weekly output.

**Leaders**: 3-5 characters with stats (judgment, speed, reliability, adaptability, communication, riskTolerance) on 1-10 scale, plus dynamic fatigue and trust levels. Leaders have behavioral tendencies that affect autonomous decisions.

**Initiatives**: Project cards with attention cost, duration (1-3 weeks), required resources, and two outcome tracks (delegated vs. player-overseen). Outcome quality depends on leader stats weighted by initiative type.

**Events**: Interruptions during Execute phase with urgency levels (ignorable/pressing/critical) and 2-3 choices costing attention with different resource outcomes.

**Win**: Autonomy score ≥ 80 sustained for 3 consecutive weeks. **Lose**: Trust or any critical resource hits 0.

---

## Implementation Phases

### Phase 1: Project Skeleton
- Initialize package.json, tsconfig, vite config, index.html
- Create src/main.ts entry point rendering a basic page
- Set up CSS files with mode color variables
- Verify Vite dev server runs

### Phase 2: Types & State
- Define all interfaces in src/types/
- Implement game-store.ts (state container + event bus)
- Implement turn-manager.ts (mode cycling: Observe → Plan → Execute → Review → next week)
- Implement resource-manager.ts (apply deltas, clamp 0-100)
- Implement utils/random.ts (seeded RNG)

### Phase 3: Game Data
- balance.ts — all tuning constants
- starter-leaders.ts — 3-5 leaders with stats & backstories
- starter-initiatives.ts — 10-15 initiative cards across departments
- event-pool.ts — 8-10 interruption events

### Phase 4: Core Systems (no UI)
- attention.ts — budget calculation, spending, validation
- departments.ts — health decay, passive output
- leaders.ts — assignment, fatigue tick, trust changes
- delegation.ts — outcome quality from leader stats vs player oversight
- initiatives.ts — start, progress, resolve
- events.ts — draw events, apply choices
- scoring.ts — autonomy score calculation
- Unit tests for each system

### Phase 5: UI Shell
- renderer.ts — top-level orchestrator, mode-based view switching
- header-bar.ts — current mode, week number, attention remaining
- resource-panel.ts — bars/numbers for all resources
- game-screen.ts — grid layout (header + sidebar + main content)
- title-screen.ts — "New Game" button
- CSS layout with mode-specific theming

### Phase 6: Mode Views
- **Observe view**: Department health dashboard, leader status, resource trends. Read-only. "Advance to Plan" button.
- **Plan view**: Available initiative cards, assign leaders, allocate attention. "Confirm Plan" button.
- **Execute view**: Progress bars, event popups with choices, attention spending. "Advance to Review" button.
- **Review view**: Outcome summaries, resource deltas, autonomy score. "Begin Next Week" button.

### Phase 7: Polish
- Victory/loss screens
- Save/load to localStorage
- Tooltips, CSS transitions on mode switch
- Balance tuning
- Debug panel (`window.__gameState`, `window.__cheat`)

---

## Verification

- **Unit tests (vitest)**: All systems in src/systems/ — turn progression, resource clamping, delegation formula, initiative lifecycle, event resolution, win/loss conditions
- **Manual playtesting**: After Phase 4, temporary console-based cycle runner. After Phase 6, full browser playthrough.
- **Debug tools**: `window.__gameState` for inspection, `window.__cheat` for testing, seeded RNG for reproducibility
- Run: `npm run dev` to start Vite dev server, `npm test` for vitest
