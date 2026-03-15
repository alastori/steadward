---
paths:
  - "src/content/**"
---

# Content Rules

## Tone of Voice
- Active voice. Present tense. No exclamation marks.
- Direct but not cold. Calm under pressure, occasionally wry.
- Consequences, not judgment. Report what happened, don't moralize.
- One idea per sentence. Max 15 words for labels, max 60 words for descriptions.

## Terminology (always use / never use)
- Attention (not "focus points" or "action points")
- Leaders (not "managers" or "officers")
- Delegate / Delegated (not "auto", "AI", "autonomous", "automatic")
- Initiatives (not "projects", "tasks", "quests")
- Modes (not "phases" in player-facing text; "phase" = mode within a week)
- Weeks (not "turns", "rounds", "cycles")
- Settlement (not "base", "colony", "outpost")

## The 5 Leaders
1. **Maren Stahl** — Operations. Reliable/rigid. High reliability, low adaptability.
2. **Kael Osei** — External Affairs. Optimistic/overcommitting. High communication, low reliability.
3. **Dr. Fen Vasara** — Research. Thorough/slow. High judgment, low speed.
4. **Rook Tannis** — Infrastructure. Fast/sloppy. High speed, low reliability.
5. **Lin Seo-yun** — Generalist/floater. Versatile/burnout-prone. Balanced stats, high fatigue rate.

## Content Pack Structure
- All content is data (JSON-serializable), never behavior
- Content packs: `{ id, name, version, requires?, leaders, initiatives, events, balance?, scenarios? }`
- Adding a leader or event = creating a data file + registering it. Never modify a system file.

## String Management
- All player-facing strings go through `src/content/strings.ts` (keyed constants)
- Contextual hints in `src/content/hints.ts` with trigger conditions
- Design for localization: use `t(key)` lookup pattern, avoid concatenated strings
- Budget 35% text expansion for future translations

## Progressive Disclosure
- Week 1: Operations + Infrastructure only, 2 leaders (Maren, Rook), 3 initiatives, 0-1 ignorable events
- Week 2: Research unlocks, Fen available
- Week 3: External Affairs unlocks, Osei available
- Week 4+: Lin available, full event pool
