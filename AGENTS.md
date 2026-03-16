# Steadward

Browser-based strategy/management game. TypeScript + Vanilla DOM + Vite.

## Enforcement Rules (MUST Follow)

1. **Engine/UI boundary**: `src/systems/` and `src/engine/` MUST NEVER import from `src/ui/`. UI dispatches actions, never mutates state directly.
2. **Content as data**: Leaders, initiatives, events are data in `src/content/base-pack/`. Adding content means creating data, never modifying system files.
3. **State is serializable**: `GameState` must always be JSON-serializable. No functions, no DOM references, no class instances in state.
4. **Resource clamping**: All resources (0-100) are clamped in the reducer. Systems never clamp — the reducer owns clamping.
5. **Test before commit**: Run `npx tsc --noEmit && npx vitest run` before every commit. Both must pass.

## Agent Triggers

| When you hear... | Invoke agent | What it does |
|---|---|---|
| "review the architecture" / "check boundaries" | **architect** | Validates state management, engine/UI boundary, serialization |
| "check the colors" / "review the UI" | **art-director** | Validates color accuracy, typography, spacing, accessibility |
| "write initiative text" / "write event text" | **narrative-writer** | Writes game text in Steadward's tone |
| "review the UX" / "check the flow" | **ux-reviewer** | Validates player flow, onboarding, accessibility |
| "review the balance" / "simulate a run" | **game-designer** | Reviews mechanics balance, scoring, delegation math |
| "check GTM" / "review analytics" | **growth-pm** | Validates shareability, analytics, demo wall, OG tags |

## Quick Reference

- **Repo**: [alastori/steadward](https://github.com/alastori/steadward)
- **Stack**: TypeScript, Vanilla DOM, Vite, vitest, Howler.js, CSS custom properties
- **Dev**: `npm run dev` | **Test**: `npm test` | **Build**: `npm run build:demo` / `npm run build:full`

## Core Concept

You coordinate a frontier settlement on planet Sable. You cannot do everything — you must delegate, prioritize, and build autonomy. The player manages 10 Attention points per week across 4 departments, 5 leaders, and a 4-mode cycle (Observe → Plan → Execute → Review).

## Game Constants

- **Resources**: Attention (primary, 10/week) + Materials, Trust, Clarity, Resilience, Knowledge, Momentum (secondary, 0-100)
- **Departments**: Operations, Infrastructure, Research, External Affairs
- **Leaders**: Maren Stahl, Kael Osei, Dr. Fen Vasara, Rook Tannis, Lin Seo-yun
- **Modes**: Observe → Plan → Execute → Review (one cycle = one week)
- **Win**: Autonomy ≥ 80 sustained 3 consecutive weeks | **Lose**: any critical resource hits 0
- **Demo wall**: End of Week 5

## Architecture

- **State**: Action-Reducer pattern with event log (not Redux library). `GameState` is the single source of truth.
- **Engine/UI boundary**: `src/systems/` never imports from `src/ui/`. UI dispatches actions, never mutates state.
- **Content as data**: Leaders, initiatives, events are data in `src/content/base-pack/`, not hardcoded.
- **Persistence**: IndexedDB with versioned JSON and chained migrations.
- **Analytics**: Plausible custom events, wired as a store subscriber.
- **Audio**: Howler.js, wired as a store subscriber.

## How to Use Agents

This project has 6 specialist agents in `.claude/agents/`. Invoke them by name:

| Agent | Invoke with | Model | Purpose |
|---|---|---|---|
| **architect** | "Use the architect agent to review this" | opus | Architecture, state management, engine/UI boundary enforcement |
| **art-director** | "Use the art-director agent to check this" | sonnet | Color accuracy, typography, spacing, visual accessibility |
| **narrative-writer** | "Use the narrative-writer agent to write this" | opus | Game text — initiatives, events, dialogue, UI copy |
| **ux-reviewer** | "Use the ux-reviewer agent to review this" | sonnet | Player flow, onboarding, keyboard nav, accessibility |
| **game-designer** | "Use the game-designer agent to review this" | opus | Mechanics balance, design pillar alignment, scoring |
| **growth-pm** | "Use the growth-pm agent to check this" | sonnet | GTM features, analytics, shareability, demo wall |

**Model rationale**: opus for complex decisions (architecture, creative writing, balance). sonnet for pattern-matching checks (visual, UX, GTM checklists).

**Tool restrictions**: art-director, ux-reviewer, growth-pm are read-only (Read, Grep, Glob). narrative-writer has Edit+Write for content authoring. architect and game-designer also have Bash for running tests/git.

## GTM Launch Checklist

- [x] OG meta tags in index.html (og:title, og:description, og:image 1200x630, Twitter Cards, Schema.org)
- [x] URL deep linking: `?seed=` and `?challenge=` parsed in main.ts
- [x] Analytics: Plausible wired as store subscriber (game_start, week_complete, demo_wall_hit, purchase_clicked)
- [x] Demo wall at Week 5: narrative hook + email capture + purchase CTA + share + play again
- [x] Shareable run summary: canvas 1200x630 with seed, score, stats, Share + Challenge buttons
- [ ] Domain: steadward.com, steadward.gg | X: @steadwardgame | Email: steadwardgame@gmail.com
- [x] Deployed: https://alastori.github.io/steadward/

## Full Documentation

See `docs/` for complete specs:
- `game-design.md` — mechanics, phases, implementation plan
- `architecture.md` — state management, types, infrastructure
- `monetization-strategy.md` — pricing, platform, launch timeline
- `art-direction.md` — colors, typography, icons, portraits
- `audio-direction.md` — music, SFX, adaptive audio
- `narrative-direction.md` — tone, leader profiles, event text
- `ux-direction.md` — player flow, layouts, accessibility
- `development-workflow.md` — how the AI tooling works, how to replicate
