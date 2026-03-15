---
paths:
  - "src/audio/**"
  - "assets/audio/**"
---

# Audio Rules

## Architecture
- Audio manager subscribes to the game store (same pattern as analytics telemetry)
- Audio manager reacts to state changes and dispatched actions
- Audio has ZERO knowledge of the DOM

## Library
- Use Howler.js for all audio playback
- SFX as audio sprites where possible (single file, multiple sounds)
- Format: WebM/Opus primary, MP3 fallback

## Mode Music
- Each mode has its own ambient track. Crossfade on mode transition (300ms).
- Observe: ambient, atmospheric, 65 BPM
- Plan: contemplative, piano-led, 70 BPM
- Execute: rhythmic tension, percussive, 100 BPM
- Review: reflective, strings, 55 BPM. NO tension layer in Review.

## Adaptive Tension
- Tension layer fades in when resources drop below 25 or leaders are fatigued
- `tensionLevel` (0-1) derived from: resource health, leader fatigue, department health, week number
- Tension layer crossfades with base track (never cuts abruptly)

## SFX Categories
- UI interactions (button clicks, card select, tab switch, panel open/close)
- Phase transitions (mode shift stingers)
- Resource changes (gain, loss, caution at 25, danger at 15, critical at 10)
- Leader actions (assignment, fatigue warning, burnout)
- Initiatives (start, progress, completion, failure)
- Events (alert by urgency: ignorable/pressing/critical)
- Attention (each point spent gets a subtle tick)
- NO drag-and-drop sounds (click-only interaction model)

## Loading
- Load 0KB on initial page load
- Tier 1 (title screen): title music only
- Tier 2 (game start): UI SFX sprite + first mode track
- Tier 3 (during play): remaining tracks loaded progressively

## Volume
- Three channels: master, music, SFX (stored in UserPreferences, localStorage)
- Web Audio autoplay: require user gesture before playing audio
