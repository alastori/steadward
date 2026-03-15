# Steadward — MVP Implementation Plan

## Context

Building a browser-based strategy/management game called **Steadward** from scratch. The core fantasy: "You are the coordinator of a living system. You cannot do everything. You must sense, choose, focus, delegate, absorb surprises, and keep momentum." The differentiator is that the player explicitly manages **attention, prioritization, and coordination modes** — not just resources and buildings.

Setting: A new settlement on a harsh frontier world. The player manages 4 departments, 5 leaders, an attention budget, and cycles through Observe → Plan → Execute → Review phases each week.

**Visual style**: Into the Breach — clean, information-dense, muted blues/grays with sharp accent colors for mode states and alerts. Readable grid layouts, pixel-precise UI, minimal but purposeful animation. Dense information without clutter.

**Contacts & channels**:
- **Email**: steadwardgame@gmail.com
- **X/Twitter**: [@steadwardgame](https://x.com/steadwardgame)
- **GitHub**: [alastori/steadward](https://github.com/alastori/steadward)
- **Domain** (to register): steadward.com, steadward.gg

---

## Tech Stack

| Choice | Rationale |
|---|---|
| **TypeScript** | Type safety for complex game state |
| **Vanilla DOM** (no React/Phaser) | This is a dashboard/card-heavy strategy game — HTML/CSS handles panels, text, and layout natively. No 60fps render loop needed. |
| **Vite** | Fast dev server with HMR |
| **vitest** | Unit testing for game systems |
| **CSS custom properties** | Mode-specific theming via `data-mode` attribute on root |
| **Howler.js** | Web audio playback and management |
| **NW.js** (deferred) | Desktop wrapper for Steam distribution |

---

## Project Structure

```
steadward/
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
│   ├── engine/
│   │   ├── game-store.ts          # State container + dispatch + subscribe
│   │   ├── reducer.ts             # Root reducer composing system reducers
│   │   ├── action-log.ts          # Action history for replay/debug
│   │   └── turn-manager.ts        # Week/phase progression
│   ├── systems/
│   │   ├── attention.ts           # Budget calc, spending, validation
│   │   ├── departments.ts         # Health decay, passive output
│   │   ├── leaders.ts             # Assignment, fatigue, trust
│   │   ├── initiatives.ts         # Start, progress, resolve projects
│   │   ├── delegation.ts          # Outcome quality from leader stats
│   │   ├── events.ts              # Draw & resolve interruptions
│   │   └── scoring.ts             # Autonomy score, win/loss
│   ├── content/
│   │   ├── registry.ts            # Content registration + lookup
│   │   ├── base-pack/             # Base game content as a pack
│   │   │   ├── leaders.ts         # 5 predefined leaders
│   │   │   ├── initiatives.ts     # 15 initiative cards
│   │   │   ├── events.ts          # 10 interruption events
│   │   │   └── balance.ts         # All tuning constants
│   │   └── index.ts               # Assembles active content packs
│   ├── persistence/
│   │   ├── save-manager.ts        # Save/load orchestration
│   │   ├── serializer.ts          # Versioned JSON serialization
│   │   ├── migrations/            # Schema migration chain
│   │   └── storage-adapter.ts     # Abstract over IndexedDB/localStorage
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
│   │   ├── screens/
│   │   │   ├── title-screen.ts
│   │   │   ├── game-screen.ts
│   │   │   ├── demo-wall-screen.ts  # Demo paywall + email capture
│   │   │   └── outcome-screen.ts
│   │   └── share.ts                 # Share card renderer + clipboard/share API
│   ├── platform/
│   │   ├── adapter.ts             # Platform abstraction interface
│   │   └── web-adapter.ts         # Browser platform implementation
│   ├── analytics/
│   │   ├── telemetry.ts           # Telemetry pipeline
│   │   └── events.ts              # Analytics event definitions
│   ├── audio/
│   │   ├── audio-manager.ts       # Playback orchestration
│   │   └── audio-config.ts        # Track definitions & volume config
│   └── utils/
│       ├── random.ts              # Seeded RNG
│       ├── dom.ts                 # DOM helpers
│       └── url.ts                 # URL param parsing for seed/challenge deep links
├── public/
│   ├── manifest.json              # PWA manifest
│   └── content-packs/             # Downloadable content pack bundles
├── assets/
│   ├── icons/                     # UI and app icons
│   ├── portraits/                 # Leader portrait art
│   └── audio/                     # Music and SFX files
├── styles/
│   ├── main.css
│   ├── variables.css              # Mode color themes
│   ├── layout.css
│   ├── components.css
│   └── modes.css
└── tests/
    ├── engine/                    # Engine and state management tests
    ├── persistence/               # Save/load and migration tests
    ├── simulations/               # Monte Carlo balance simulations
    ├── architecture/              # Dependency and structure tests
    └── systems/                   # Unit tests for core systems
```

---

## Core Data Model

**Primary resource: Attention** — finite weekly budget (10 points), spent on overseeing initiatives, handling interruptions, reading reports. Does NOT carry over between weeks.

**Secondary resources** (0-100 each): Materials, Trust, Clarity, Resilience, Knowledge, Momentum. These interact (e.g., low Clarity increases coordination cost, low Trust weakens delegation).

**Departments**: Operations, Infrastructure, Research, External Affairs — each with health (0-100), assigned leader, active initiatives (max 2), and passive weekly output.

**Leaders**: 5 characters with stats (judgment, speed, reliability, adaptability, communication, riskTolerance) on 1-10 scale, plus dynamic fatigue and trust levels. Leaders have behavioral tendencies that affect autonomous decisions.

**Initiatives**: Project cards with attention cost, duration (1-3 weeks), required resources, and two outcome tracks (delegated vs. player-overseen). Outcome quality depends on leader stats weighted by initiative type.

**Events**: Interruptions during Execute phase with urgency levels (ignorable/pressing/critical) and 2-3 choices costing attention with different resource outcomes.

**Win**: Autonomy score ≥ 80 sustained for 3 consecutive weeks. **Lose**: Trust or any critical resource hits 0.

**Composite run score**: Beyond the binary win/lose, every run produces a numeric score (0-10,000 scale) factoring in weeks-to-win, resources remaining, leaders not burned out, and events weathered. This score powers challenge leaderboards, social sharing, and seed-based competitions.

### Onboarding & Progressive Disclosure

- **Week 1**: 2 departments active (Operations, Infrastructure), 2 leaders available, 3 initiative cards, 0-1 ignorable events only
- **Week 2**: Research department unlocks, 3rd leader available, full initiative pool for 3 departments
- **Week 3+**: External Affairs unlocks, all 5 leaders available, full event pool including pressing/critical

---

## Implementation Phases

### Phase 1: Project Skeleton
- Initialize package.json, tsconfig, vite config, index.html
- index.html includes OG meta tags, Twitter Card tags, SEO meta description, and Schema.org VideoGame structured data from day one
- Create src/main.ts entry point with URL param parsing (`seed`, `challenge` query params)
- Set up CSS files with mode color variables
- Verify Vite dev server runs

### Phase 2: Types & State
- Define all interfaces in src/types/
- Implement game-store.ts (state container + dispatch + subscribe)
- Implement reducer.ts (root reducer composing system reducers; resource clamping 0-100 lives here)
- Implement turn-manager.ts (mode cycling: Observe → Plan → Execute → Review → next week)
- Implement persistence/save-manager.ts + storage-adapter.ts (IndexedDB with localStorage fallback, single autosave slot)
- Implement utils/random.ts (seeded RNG)
- Wire analytics telemetry as a store subscriber (Plausible custom events for `game_start`, `week_complete`, `demo_wall_hit`) — analytics must be live before beta, not deferred to Phase 7

### Phase 3: Game Data
- content/base-pack/balance.ts — all tuning constants
- content/base-pack/leaders.ts — 5 leaders with stats & backstories
- content/base-pack/initiatives.ts — 15 initiative cards across departments
- content/base-pack/events.ts — 10 interruption events

### Phase 4: Core Systems (no UI)
- attention.ts — budget calculation, spending, validation
- departments.ts — health decay, passive output
- leaders.ts — assignment, fatigue tick, trust changes
- delegation.ts — outcome quality from leader stats vs player oversight
- initiatives.ts — start, progress, resolve
- events.ts — draw events, apply choices
- scoring.ts — autonomy score calculation + composite numeric run score (`calculateRunScore()`)
- Unit tests for each system

### Phase 5: UI Shell
- renderer.ts — top-level orchestrator, mode-based view switching
- header-bar.ts — current mode, week number, attention remaining
- resource-panel.ts — bars/numbers for all resources
- game-screen.ts — grid layout (header + sidebar + main content)
- title-screen.ts — "New Game" button
- CSS layout with mode-specific theming
- Integrate Howler.js, basic UI click SFX, title screen ambient

### Phase 6: Mode Views
- **Observe view**: Department health dashboard, leader status, resource trends. Read-only. "Advance to Plan" button.
- **Plan view**: Available initiative cards, assign leaders, allocate attention. "Confirm Plan" button.
- **Execute view**: Progress bars, event popups with choices, attention spending. "Advance to Review" button.
- **Review view**: Outcome summaries, resource deltas, autonomy score. "Begin Next Week" button.
- Mode-specific ambient tracks, phase transition stingers, resource/event SFX

### Phase 7: Polish & GTM Readiness
- Victory/loss screens designed as **shareable compositions** (render at 1200x630 for OG/Discord, include seed, composite score, key stats, "Share" + "Challenge a Friend" buttons)
- Demo wall screen with email capture (POST to Buttondown/Mailchimp, fire-and-forget)
- Share module: `generateShareImage()` via canvas, `navigator.share()` / clipboard fallback, challenge URL generation (`/play?seed=XXXX`)
- Multiple save slots + JSON export/import (basic autosave is in Phase 2)
- Tooltips, CSS transitions on mode switch
- Balance tuning
- Debug panel (`window.__gameState`, `window.__cheat`)
- Adaptive tension layers, victory/loss stingers, audio polish

---

## Verification

- **Unit tests (vitest)**: All systems in src/systems/ — turn progression, resource clamping, delegation formula, initiative lifecycle, event resolution, win/loss conditions
- **Manual playtesting**: After Phase 4, temporary console-based cycle runner. After Phase 6, full browser playthrough.
- **Debug tools**: `window.__gameState` for inspection, `window.__cheat` for testing, seeded RNG for reproducibility
- Run: `npm run dev` to start Vite dev server, `npm test` for vitest

---

## GTM-Driven Architecture Requirements

These features are informed by Growth PM review and must be designed in from v1 (hard to retrofit later).

### Must be in v1

1. **Shareable run summary** — Victory/loss screen renders as a canvas image (1200x630). Includes seed, composite score, weeks survived, leaders used, key events. "Share" button copies image or link. Every completed run is a marketing impression.

2. **OG meta tags + SEO** — `index.html` includes `og:title`, `og:description`, `og:image` (1200x630 gameplay screenshot), Twitter Card tags, canonical URL, and `Schema.org/VideoGame` structured data. 30 minutes of work, permanent impact on every shared link.

3. **URL deep linking** — `steadward-game.com/play?seed=12345` starts a seeded game. `main.ts` parses query params at startup via `utils/url.ts` and passes config to `createGameStore()`. Enables "Challenge a Friend" growth loop.

4. **Email capture on demo wall** — At week 5 paywall, include an email input + submit. Single POST to Buttondown/Mailchimp. No account required. Fire-and-forget with graceful failure.

5. **Analytics from Phase 2** — Plausible telemetry wired as a store subscriber in Phase 2, not Phase 7. Funnel data (`game_start` → `week_complete` → `demo_wall_hit` → `purchase_clicked`) must be live before any public beta or Steam Next Fest.

### Extension points (leave room, build later)

- **Streamer mode** — `data-streamer-mode` CSS attribute. Avoid hover-only interactions (use click/tap-to-reveal). Benefits streamers and mobile.
- **Embeddable iframe** — No `X-Frame-Options: DENY`. Game should be iframeable for press sites and itch.io embeds.
- **Action log highlights** — Add `highlight?: boolean` to action log entries for critical events, close-call saves, win/loss moments. Enables future replay highlights for content creators.
- **Run summary as serializable data** — `RunSummary` type (not just DOM) enables future Discord webhook posting.

### Revised launch timeline

```
Week 0-8:     Build Phase 1-4 (skeleton + types + data + core systems)
Week 6:       Submit to 1-2 itch.io game jams with minimal UI prototype
Week 8-12:    Build Phase 5-6 (UI shell + mode views)
Week 10:      Steam page live ($100 fee, 4-6 screenshots, GIF)
Week 12:      Closed alpha — 20-50 players, analytics active, email capture live
Week 12-16:   Open beta on itch.io (free browser demo), bi-weekly devlogs
Week 16:      Apply for Steam Next Fest
Week 18-20:   Steam Next Fest — target 2,000-5,000 wishlists
Week 20-24:   Polish, balance, NW.js Steam packaging
Week 24:      Launch — simultaneous on itch.io (paid), web (paid), Steam
Week 26-28:   Post-launch patches, respond to every Steam review
Week 32:      Free content update (new events, challenge seeds)
Week 36:      Expansion 1 if base game revenue justifies it
```
