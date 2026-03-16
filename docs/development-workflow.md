# Steadward — Development Workflow

**Author**: Engineering
**Date**: 2026-03-16
**Status**: Living document

---

## How to Build a Game with This Infrastructure

### The Setup

The project has three layers of AI tooling that work together:

```
.claude/
├── agents/          # 6 specialist reviewers (architect, art-director, etc.)
├── rules/           # 5 domain guardrails (engine, ui, content, audio, persistence)
└── skills/          # 3 quick-reference lookups (colors, templates, leader profiles)
docs/                # 7 design documents (the source of truth)
AGENTS.md            # Project instructions Claude Code reads on every conversation
```

### The Workflow

**Step 1: Write the design docs first.**

Everything starts in `docs/`. Each doc is a complete spec for one domain:

| Doc | What it defines |
|---|---|
| `game-design.md` | Mechanics, data model, implementation phases, verification criteria |
| `architecture.md` | State management pattern, folder structure, type definitions, boundaries |
| `art-direction.md` | Colors (exact hex), typography (exact fonts/sizes), spacing, component specs |
| `narrative-direction.md` | Tone of voice, leader profiles with stats and example dialogue, writing rules |
| `ux-direction.md` | Player flow, layouts, onboarding, accessibility, interaction patterns |
| `audio-direction.md` | Track specs per mode, SFX catalog, volume mixing, adaptive tension system |
| `monetization-strategy.md` | Pricing, platforms, demo wall strategy, launch timeline |

These aren't vague — they have exact numbers, exact hex codes, exact TypeScript interfaces. The more specific the docs, the better every agent performs.

**Step 2: Set up AGENTS.md (= CLAUDE.md) as the entry point.**

This is what Claude Code reads first. It contains:
- Tech stack and build commands
- Core game constants (so Claude doesn't have to re-read docs every time)
- Architecture boundaries (engine/UI separation, content-as-data)
- Agent table (how to invoke each specialist)
- GTM checklist (tracks what's shipped)

**Step 3: Rules auto-load as guardrails.**

Files in `.claude/rules/` are loaded automatically based on what code you're touching. When you edit `src/engine/`, the `engine.md` rule kicks in with constraints like "state is always serializable" and "systems never import from UI." You don't invoke rules — they enforce themselves.

**Step 4: Agents review specific domains on demand.**

When you say "use the game-designer agent to review this", Claude spawns a specialist subprocess that:
- Reads only with the tools it's allowed (read-only for most, Bash for architect/game-designer)
- Has domain expertise from its agent file (design pillars, balance boundaries, review checklist)
- References the relevant docs
- Returns a focused evaluation

The key insight: **agents don't build, they review**. The main Claude Code session builds. Agents catch mistakes.

**Step 5: Skills provide instant reference.**

When implementing UI, invoke `/color-palette` to get exact hex values without re-reading the 1200-line art direction doc. When writing event text, invoke `/content-templates` for the template structure. When writing delegation outcomes, invoke `/leader-profiles` for voice and stats.

---

## How Steadward Was Actually Built

The session that built this game followed this pattern:

```
1. Plan phase implementation          → Claude reads docs, writes code
2. Smoke test in browser              → Claude uses Chrome tools to verify
3. Commit                             → Small, focused commits
4. "Use the game-designer agent"      → Specialist reviews for balance issues
5. Fix what the agent found           → Claude implements fixes
6. Repeat from step 2
```

This loop ran 3 times. Each pass caught different issues:
- **Pass 1**: Structural (initiatives not wired, TICK_WEEK inert)
- **Pass 2**: Economic (trust never grew, events duplicated, no recovery)
- **Pass 3**: Feel (delegation always partial, materials death spiral, no emotional arc)

### Implementation Phases

The build followed the phases defined in `game-design.md`:

| Phase | What | Commits |
|---|---|---|
| 1 | Project skeleton — Vite, TS, CSS, OG/SEO, fonts, URL parsing | 1 |
| 2 | Types & state — GameState, store, reducer, persistence, RNG, analytics | 1 |
| 3 | Game content — 5 leaders, 15 initiatives, 10 events, balance constants | 1 |
| 4 | Core systems — attention, departments, leaders, delegation, initiatives, events, scoring | 1 |
| 5 | UI shell — title screen, 4 mode views, CSS components | 1 |
| 7 | GTM polish — demo wall, outcome screen, share module | 1 |
| Balance | 3 rounds of game designer evaluation with fixes | 3 |
| Features | Autonomy HUD, initiative randomization, audio, tooltips, save/load, debug panel, onboarding | 4 |
| UX | Kanban plan view, resource/outcome display on cards | 2 |

Each phase was smoke-tested (TypeScript check, vitest, browser verification) before committing.

---

## How to Replicate for a Different Game

### 1. Write your 7 docs

Swap the domain (e.g., a tower defense game would have different mechanics, art style, and narrative tone), but keep the same doc structure. The seven docs cover the seven dimensions of a game:

- **What it plays like** (game-design.md)
- **How it's built** (architecture.md)
- **What it looks like** (art-direction.md)
- **What it sounds like** (audio-direction.md)
- **What it says** (narrative-direction.md)
- **How it feels to use** (ux-direction.md)
- **How it makes money** (monetization-strategy.md)

### 2. Customize agents

The 6 agent roles are generic enough for any game:

| Agent | Role | Works for any game? |
|---|---|---|
| architect | Validates state/systems boundaries | Yes |
| art-director | Validates visual consistency | Yes — update color/typography specs |
| narrative-writer | Produces in-world text | Yes — update tone guide |
| ux-reviewer | Catches flow/accessibility issues | Yes |
| game-designer | Simulates runs, finds balance problems | Yes — update design pillars |
| growth-pm | Checks GTM/analytics/shareability | Yes |

### 3. Customize rules

Update the 5 rule files with your game's constraints:
- `engine.md` — your state shape, your phase rules, your systems
- `ui.md` — your UI framework, your interaction model, your accessibility requirements
- `content.md` — your tone, your terminology, your content structure
- `audio.md` — your audio library, your track structure, your mixing rules
- `persistence.md` — your save format, your migration strategy

### 4. Customize skills

Create quick-reference cards for your game's constants:
- Color palette with exact hex values
- Content templates with field definitions
- Character/unit profiles with stats and flavor text

### 5. Build in phases

The implementation phases pattern works well:
1. **Skeleton** — config, entry point, CSS theming, HTML with SEO
2. **Types** — all interfaces and enums, state container, reducer
3. **Content** — game data as typed objects, content registry
4. **Systems** — pure functions with unit tests, no UI dependencies
5. **UI** — render functions that project state to DOM
6. **Polish** — GTM features, share module, demo wall, onboarding
7. **Balance** — agent-driven review and iteration

Commit after each phase. Review with agents between phases.

---

## The Key Principle

**Docs are the single source of truth. Agents enforce the docs. Rules constrain the code. Skills speed up lookups.**

The human makes creative decisions. The AI implements and reviews. The agents catch what the human misses.
