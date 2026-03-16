# Steadward — Roadmap

**Last updated**: 2026-03-16
**Live demo**: https://alastori.github.io/steadward/

---

## Now: Get Feedback

- [ ] Play it yourself for 10 minutes — find UX issues faster than any agent
- [ ] Send the link to 3 people — watch them play, note where they get confused
- [ ] Real OG image — screenshot the Plan view kanban, 1200x630, replace placeholder in `index.html`

## Next: Content Depth (replay is weak)

- [ ] Write 10 more events — pool exhausts by week 5 with deduplication. Use the narrative-writer agent
- [ ] Write 10 more initiatives — 15 is thin with randomization. Need more Research and External Affairs cards
- [ ] Produce placeholder audio — synth pad per mode + click SFX. sfxr for SFX, Suno for ambient

## Then: Template Extraction (for game #2)

- [ ] Extract reusable skeleton — fork repo, strip game-specific content, keep infrastructure (agents, rules, skills, engine, CSS theming, build pipeline)
- [ ] Write `TEMPLATE.md` — "to start a new game: 1) write your 7 docs, 2) customize these 5 files, 3) run this command"

## Later: Technical Debt

- [ ] Update `docs/game-design.md` — balance constants changed 3x, Phase 6 merged into 5, delegation threshold moved. Doc is stale
- [ ] E2E test — one Playwright test: New Game → briefing → Week 1 full cycle. Catches regressions unit tests can't
- [ ] Lin float mechanic — she competes for department slots; needs a unique "assist any department" assignment
- [ ] Centralize UI copy — wire `t(key)` from `src/content/strings.ts` into actual UI components (strings file exists, not yet used)
- [ ] Architecture fitness tests — add CI that runs `npx tsc --noEmit && npx vitest run` on every push

---

## Done

- [x] Phase 1-7: Full game implementation from zero
- [x] 3 rounds of game design evaluation with balance fixes
- [x] Onboarding: briefing sequence, contextual hints, locked departments
- [x] Kanban Plan view with expandable initiative cards
- [x] Resource requirements + outcome previews on cards
- [x] Trust economy, event dedup, initiative gating, rest mechanic
- [x] Decision style variance (cautious/balanced/aggressive)
- [x] Audio system wired (placeholder paths)
- [x] Save/load UI, debug panel, demo wall with share
- [x] Scaffolding hardened: enforcement rules, permissions, 93 tests, boundary tests
- [x] Deployed to GitHub Pages
- [x] Development workflow documented
