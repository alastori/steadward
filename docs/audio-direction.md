# Steadward — Audio Direction Guide

**Author**: Audio Design
**Date**: 2026-03-14
**Status**: Draft v1
**Prerequisite reading**: [Game Design](game-design.md), [Art Direction](art-direction.md)

---

## Table of Contents

1. [Audio Philosophy](#1-audio-philosophy)
2. [Music Direction](#2-music-direction)
3. [Sound Effects (SFX)](#3-sound-effects-sfx)
4. [Adaptive Audio System](#4-adaptive-audio-system)
5. [Technical Architecture](#5-technical-architecture)
6. [Placeholder Asset List](#6-placeholder-asset-list)
7. [Audio Budget](#7-audio-budget)

---

## 1. Audio Philosophy

### What Audio Does in a Dashboard Strategy Game

Steadward is not an action game. There are no explosions, no combat animations, no characters running across a screen. The player stares at panels, reads numbers, weighs tradeoffs, and clicks buttons. In this context, audio serves three narrow functions:

1. **State confirmation** — The player clicks "Advance to Plan." The sound confirms the transition happened. Without it, the mode shift feels ghostly, like dragging a slider on a broken web form. A short, distinct tone says: "You are now in a different place."

2. **Peripheral awareness** — The player is reading an initiative card description when a resource drops below 25. They are not looking at the resource panel. A subtle warning tone pulls the corner of their attention without demanding they stop reading. Audio communicates what the eyes are not currently watching.

3. **Emotional texture** — Steadward's visual style is deliberately clinical: dark panels, muted colors, monospace numbers. Without audio, the experience feels like a spreadsheet. Ambient music provides the emotional register that the UI deliberately does not — the feeling of presiding over a living settlement where things matter.

Audio in Steadward is **information, not decoration**. Every sound must pass a simple test: "Does this help the player understand what just changed, or does it just fill silence?" If the answer is the latter, cut it.

### What Silence Does

Silence is not a failure state. It is a tool. Steadward should use silence in these situations:

- **During reading** — When the player opens an event modal and is reading the description and weighing choices, the ambient music should remain but no additional sounds should trigger. The player is thinking. Do not interrupt thinking.
- **Before a critical moment** — When the player is about to confirm their plan and commit to the Execute phase, a brief gap of reduced audio (not full silence, but a ducking of the ambient track) creates anticipation.
- **After a loss** — When a critical resource hits zero and the game ends, the music should cut abruptly, leaving 1-2 seconds of silence before the loss stinger plays. The sudden absence of sound is more jarring than any alarm.

### Reference Games and Why Their Audio Works

**Into the Breach** (Ben Prunty, 2018) — The primary audio reference, matching the visual reference. Prunty's approach is instructive: he initially tried quiet ambient drones for the turn-based strategy format, assuming strategy music should stay out of the way. This sounded like a horror game. He then tried somber cello — too depressing. The breakthrough came when he layered muted rhythm guitar over synthesizers and cello, creating what became the game's signature sound: music with rhythmic energy but without melodic complexity that would compete with strategic thinking. The melodies are strong but simple enough that they do not distract a player who is counting tiles and predicting outcomes. The soundtrack features electric guitar, cello, harp, piano, and synthesizers — an unusual mix that feels neither purely electronic nor purely orchestral. Critically, Prunty wrote a detailed document for the developers specifying exactly when music should start and stop, including cutting music before a mission starts and restarting it when the last mech lands. This discipline — knowing when NOT to play — is the most important lesson for Steadward.

**FTL: Faster Than Light** (Ben Prunty, 2012) — The template for adaptive game music on a budget. Every FTL track exists in two versions: an "Explore" layer (ambient, sparse, contemplative) and a "Battle" layer (driving, rhythmic, urgent). The game crossfades between them based on combat state. This two-layer approach is simple to implement, cheap to produce (each track needs two mixes, not a complex middleware system), and remarkably effective. The player feels the shift in game state through their ears before they consciously register it visually. Steadward should adapt this approach to its four-mode structure: each mode has a distinct ambient character, and transitions between them use crossfades.

**Frostpunk** (Piotr Musial, 2018) — The reference for emotional weight in a management game. Musial's signature technique was "freezing" sounds — taking a 5-second musical phrase and stretching it over 2 minutes, creating eerie, evolving ambient textures that mirror the frozen world. He used intimate string quartets (the Atom String Quartet, emphasizing viola and cello) to represent the human element, with the Sofia Session Orchestra for escalation. Themes recur in varied forms throughout the game, "sometimes as just an echo lasting a few sounds, sometimes a variation on a theme." This gradual thematic development mirrors the player's growing familiarity with their settlement. Steadward should learn from this: musical themes that evolve subtly week over week, creating a sense of progression even when the player is not consciously tracking the music.

**Slay the Spire** (Clark Aboud, 2017) — The reference for UI sound design in a card-based strategy game. Card draw has a crisp, satisfying sound. Card play produces a distinct thump. Relic acquisition plays a clear chime. Every interaction sounds different from every other interaction, creating an audio vocabulary that the player learns unconsciously. After a few runs, the player can identify what is happening from sound alone — a new relic sounds different from a card reward, which sounds different from a curse. This is the target for Steadward's SFX: each category of interaction should have a distinct sonic identity.

---

## 2. Music Direction

### Overall Musical Identity

**Instruments**: Synthesizer pads (warm analog-style), electric guitar (clean tone, muted rhythm), cello (solo, not orchestral), piano (sparse, high-register), and subtle electronic percussion. No drums or drum machines in ambient tracks — rhythm comes from guitar picking patterns and synthesizer pulses.

**Tempo**: 60-80 BPM for Observe and Plan modes, 90-110 BPM for Execute mode, 50-65 BPM for Review mode. These are underlying pulse rates, not drumbeat tempos — the music should feel like it breathes rather than marches.

**Mood**: Professional melancholy with undercurrents of determination. The settlement is struggling but not hopeless. The coordinator (player) is competent but overwhelmed. The music should feel like the quiet hum of a control room at 2 AM — focused, slightly tense, aware that things could go wrong but steadily working to prevent it.

**Key**: Minor keys predominantly (Am, Dm, Em), with shifts to relative majors (C, F, G) during Review mode when outcomes are positive. The harmonic language should be simple — mostly triads and suspended chords, avoiding jazz complexity or atonal dissonance.

**What the music is NOT**: Epic orchestral. Chiptune or retro. Lo-fi beats. Ambient drone without melody. Aggressive electronic. The music occupies a specific niche: the "thoughtful indie strategy" sound that Into the Breach pioneered — emotionally present but cognitively unobtrusive.

### Mode-Specific Ambient Tracks

#### Observe Mode — "Surveying the Field"

**What it sounds like**: A slowly evolving synthesizer pad with a clean electric guitar playing sparse, arpeggiated figures in the upper register. A solo cello enters occasionally with a four-note descending motif (the "settlement theme"). The overall texture is open and spacious — lots of room between notes. Think of looking out over a landscape from a high vantage point.

**Why**: Observe mode is passive and analytical. The player is reading dashboards, checking department health, scanning for problems. The music should support concentration without creating urgency. The spaciousness reflects the player's broad situational awareness — they are seeing everything at once, not focusing on any one thing.

**Palette**: Synth pad (warm, wide stereo), clean electric guitar (reverb, slight delay), solo cello (dry, close-mic feel), occasional piano (single notes, high register).

**Duration**: 3:00-4:00, loopable with a seamless loop point.

#### Plan Mode — "Setting the Course"

**What it sounds like**: The synthesizer pad shifts to a slightly brighter voicing (still minor key, but with suspended 4ths that create a sense of possibility). A fingerpicked acoustic guitar replaces the electric guitar, playing a gentle rhythmic pattern that suggests forward motion without rushing. The cello drops out. A soft, pulsing bass synth enters at a very low volume, providing subtle rhythmic grounding. The texture is warmer and more intimate than Observe — the player has moved from surveying to deciding.

**Why**: Plan mode is where the player makes commitments: assigning leaders, choosing initiatives, allocating attention. The music should feel like deliberation — weighing options, feeling the weight of choice. The acoustic guitar's organic texture contrasts with Observe's more electronic palette, reinforcing the mode shift even if the player is not consciously listening.

**Palette**: Synth pad (brighter voicing), fingerpicked acoustic guitar, soft bass synth pulse, occasional high piano notes.

**Duration**: 3:00-4:00, loopable.

#### Execute Mode — "Things in Motion"

**What it sounds like**: The energy increases noticeably. The electric guitar returns with a muted rhythm pattern (think Into the Breach's signature sound — not power chords, but a percussive, chugging palm-muted figure). The synth pad gains movement — a slow filter sweep that opens and closes over 8-bar phrases. A subtle electronic percussion element enters: not a full drum beat, but isolated elements like a distant snare hit every 4 bars or a shaker pattern at low volume. The cello returns with more urgency, playing sustained notes that create harmonic tension against the guitar. This is the most energetic mode, but still restrained — the player is watching progress bars and handling interruptions, not fighting a boss.

**Why**: Execute is where plans meet reality. Events fire. Resources change. Leaders act autonomously. The music should communicate that things are happening — the system is alive and responding to the player's earlier choices. But it should not become so intense that it creates anxiety during what is still fundamentally a reading-and-clicking interface.

**Palette**: Muted rhythm electric guitar, filtered synth pad, light electronic percussion elements, cello (sustained, tense), bass synth (more prominent).

**Duration**: 3:30-4:30, loopable.

#### Review Mode — "Taking Stock"

**What it sounds like**: Everything calms. The percussion elements drop out entirely. The synth pad returns to a warm, resolved voicing — if the week went well, it shifts toward the relative major key. A solo piano plays a reflective melody, the simplest and most lyrical music in the game. The cello plays long, sustained tones underneath. The overall feeling is like the moment after a long exhale — the tension of Execute is released, and the player can assess what happened without time pressure.

**Why**: Review is the emotional processing phase. The player sees outcomes, resource deltas, autonomy score changes. If things went well, the music should quietly validate that. If things went poorly, the same music in its minor-key version should feel contemplative rather than punishing. The player should feel like a thoughtful leader reviewing reports, not a failure being scolded.

**Palette**: Solo piano (close, intimate), warm synth pad, solo cello (sustained), no guitar, no percussion.

**Duration**: 2:30-3:30, loopable.

### Transitions Between Modes

**Approach**: Crossfade with a brief transitional stinger.

When the player advances from one mode to the next:

1. The current mode's track fades out over 1.5 seconds
2. A short transitional stinger plays (0.5-1.0 second) — a distinct sound per transition that marks the boundary (see SFX section)
3. The new mode's track fades in over 1.5 seconds, starting at a random position within the first 30 seconds (to avoid the player always hearing the same opening phrase)

**Why not hard cuts?** Hard cuts feel jarring in a dashboard game. The player is not jumping between levels — they are shifting their attention within the same workspace. The crossfade mirrors the visual mode transition (300ms header bar color crossfade defined in the art direction).

**Why not silence gaps?** Extended silence gaps (2+ seconds) create an awkward void. The player might think the audio broke. A brief duck during the stinger is enough to mark the boundary.

### Title Screen Music

**What it sounds like**: A reduced arrangement of the Observe mode track — just the synth pad and a solo cello playing the settlement theme at a slower tempo. Sparse, inviting, slightly mysterious. The player should feel like they are looking at a door they could choose to open. Duration: 2:00-3:00, loopable, with a 4-second intro that plays only on first load (not on loop).

### Victory Music

**What it sounds like**: The settlement theme (cello motif from Observe mode) played in a major key, with all instruments joining gradually: piano enters first, then guitar (clean arpeggios, not muted rhythm), then a fuller synth pad. The texture builds over 15-20 seconds from solo cello to full ensemble. Ends with a sustained major chord that rings and fades naturally. Duration: 25-35 seconds total. Not a fanfare — a quiet, earned resolution.

### Loss Music

**What it sounds like**: 1-2 seconds of silence (music cuts abruptly on game-over trigger), then a single low piano note struck and left to decay. After 3 seconds, the cello plays the settlement theme one last time, very slowly, in its minor-key form, with no accompaniment. The note trails off into nothing. Duration: 15-25 seconds total. Not dramatic — somber and final, like closing a book.

### Track List Summary

| # | Track | Mode/Context | Duration | BPM | Key |
|---|---|---|---|---|---|
| 1 | Title Theme | Title screen | 2:00-3:00 | 55 | Am |
| 2 | Surveying the Field | Observe | 3:00-4:00 | 65 | Am |
| 3 | Setting the Course | Plan | 3:00-4:00 | 70 | Dm |
| 4 | Things in Motion | Execute | 3:30-4:30 | 100 | Em |
| 5 | Taking Stock | Review | 2:30-3:30 | 55 | Am/C |
| 6 | Victory Stinger | Win screen | 0:25-0:35 | 60 | C |
| 7 | Loss Stinger | Loss screen | 0:15-0:25 | — | Am |
| 8 | Tension Layer (Observe) | Adaptive overlay | 3:00-4:00 | 65 | Am |
| 9 | Tension Layer (Plan) | Adaptive overlay | 3:00-4:00 | 70 | Dm |
| 10 | Tension Layer (Execute) | Adaptive overlay | 3:30-4:30 | 100 | Em |

**Total**: 10 tracks, approximately 25-35 minutes of music.

---

## 3. Sound Effects (SFX)

### Design Principles

All SFX should share a consistent sonic palette:

- **Material**: Clean, digital tones — synthesized rather than sampled from physical objects. This matches the UI's clean, geometric aesthetic. No wood knocks, paper shuffles, or metal clangs.
- **Duration**: Short. Most UI sounds should be 50-200ms. Transition stingers 500-1000ms. Alert sounds up to 1500ms. Nothing longer.
- **Frequency range**: Mid to high (800Hz-6000Hz) for UI interactions, which keeps them distinct from the music's lower-frequency content (bass synth, cello). Warning sounds can dip lower (400Hz) for gravity.
- **Repetition tolerance**: Any sound that plays more than 3 times per minute must be subtle enough that it does not become irritating. Attention-spending sounds, button clicks, and tab switches fall into this category. Err toward quieter and simpler for high-frequency sounds.
- **Volume relative to music**: SFX should sit 3-6dB above the ambient music level so they are clearly audible without dominating. Alert sounds (pressing, critical) should be 6-10dB above music.

### Complete SFX List

#### UI Interactions

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| U1 | Button click | A soft, bright "tick" — a synthesized click with a fast attack and immediate decay. Think of tapping a touchscreen with a fingernail but pitched up and made digital. Two subtle pitch variants to prevent monotony. | 80ms | Music +3dB | Any button press (advance phase, confirm plan, choose event option) |
| U2 | Button hover | An extremely subtle, low-volume tonal shift — barely audible, more felt than heard. A 2000Hz sine wave at very low amplitude with a 30ms fade. Most players should not consciously notice this. | 30ms | Music -3dB | Mouse enters any clickable element |
| U3 | Panel open | A gentle upward sweep — a filtered noise burst that rises in pitch over 150ms. Like a drawer sliding open smoothly. Implies something new is being revealed. | 150ms | Music +3dB | Opening a tooltip, expanding a collapsed section, opening settings |
| U4 | Panel close | The reverse of U3 — a downward sweep, same character, mirror image. | 120ms | Music +3dB | Closing a tooltip, collapsing a section, closing settings |
| U5 | Tab switch | A short, two-note ascending figure — "dit-dah" — on a soft synth bell. Slightly different from a button click to indicate navigation rather than action. | 120ms | Music +3dB | Switching between tabs in any panel |
| U6 | Card select | A warm, resonant "plunk" — like plucking a single string on a dulcimer. More organic than the button click, suggesting you are picking up something tangible. | 100ms | Music +4dB | Selecting an initiative card, selecting a leader card |
| U7 | Card deselect | A softer, lower-pitched version of U6 — the string unplugged, the thing set back down. | 80ms | Music +3dB | Deselecting a card, canceling a selection |
| U8 | Modal open | The event modal appearance sound: a brief, attention-getting tone that is warmer for ignorable events, sharper for pressing events, and alarming for critical events. Three variants tied to urgency level (see Interruption Events section). | 200ms | Music +6dB | Event modal appearing during Execute phase |
| U9 | Modal close | A soft "whoosh-down" — filtered noise fading out. Resolution, the event has been dealt with. | 150ms | Music +3dB | Dismissing the event modal after choosing |

#### Phase Transitions

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| T1 | Observe start | A crystalline ascending chime sequence — three notes ascending in a minor triad (root, minor third, fifth). Cool, analytical, like instruments calibrating. Evokes the blue accent color of Observe mode. | 800ms | Music +6dB | Entering Observe mode (week start or return) |
| T2 | Plan start | A warm, resonant two-note figure — root and suspended fourth, played on a soft synth bell with reverb. Implies opening a map, spreading out papers, deliberation beginning. Evokes the purple accent of Plan mode. | 700ms | Music +6dB | Transitioning from Observe to Plan |
| T3 | Execute start | A more energetic three-note descending figure with a subtle percussive attack on each note — like keys being turned in ignition. The muted guitar tone from the Execute track briefly previewed. Evokes the amber accent of Execute mode. | 900ms | Music +7dB | Transitioning from Plan to Execute |
| T4 | Review start | A single, sustained piano note (high register) with a soft reverb tail — like the last note of a song fading out. Calm, reflective. Evokes the green accent of Review mode. | 1000ms | Music +5dB | Transitioning from Execute to Review |
| T5 | Week advance | A composite sound: a soft clock-tick followed by a brief ascending synth sweep. The clock-tick is consistent every week; the sweep varies slightly in pitch based on the week number (higher pitch = later in the game). Implies the passage of time and progress. | 600ms | Music +6dB | Advancing from Review to next week's Observe |

#### Resource Changes

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| R1 | Resource gain (small) | A quick, bright upward blip — a sine wave gliding from 1000Hz to 1500Hz over 80ms. Like a positive data point appearing on a graph. | 80ms | Music +2dB | Any resource increases by 1-10 points |
| R2 | Resource gain (large) | Two upward blips in quick succession (R1 played twice with 60ms gap), slightly longer sustain. More noticeable for significant gains. | 200ms | Music +4dB | Any resource increases by 11+ points |
| R3 | Resource loss (small) | A quick downward blip — sine wave gliding from 1500Hz to 1000Hz. The inverse of R1. Subtle enough to not alarm for routine losses. | 80ms | Music +2dB | Any resource decreases by 1-10 points |
| R4 | Resource loss (large) | Two downward blips in succession, with the second one lower-pitched than the first. More alarming than R3 but not a klaxon. | 200ms | Music +4dB | Any resource decreases by 11+ points |
| R5 | Resource warning (caution) | A gentle pulsing tone at ~600Hz — two pulses, 300ms each with 200ms gap. Warm, advisory, not urgent. Matches the `--alert-medium` gold color. Plays once when the threshold is crossed, not repeatedly. | 800ms | Music +6dB | Any resource drops below 25 (caution threshold) |
| R6 | Resource warning (danger) | A sharper pulsing tone at ~400Hz — three short pulses, more strident than R5. Matches the `--alert-high` red color. Plays once on threshold crossing. | 1000ms | Music +8dB | Any resource drops below 15 (danger threshold) |
| R7 | Resource recovery | A relieving upward glissando — a sine wave sweeping from 800Hz to 2000Hz over 300ms with a soft sustain. The audio equivalent of seeing a warning light turn off. Plays once when a resource recovers above the warning threshold. | 400ms | Music +5dB | A resource rises back above 25 after being below 25 |

#### Leader Actions

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| L1 | Leader assigned | A warm, affirming two-note figure — root and major third, played on a soft plucked synth. Like a handshake. Brief and professional. | 150ms | Music +4dB | Assigning a leader to a department or initiative |
| L2 | Leader unassigned | A soft descending single note — the reverse emotional register of L1. Not negative, just neutral. | 100ms | Music +3dB | Removing a leader from an assignment |
| L3 | Fatigue warning | A tired, slightly detuned tone — a sawtooth wave at low amplitude with slow vibrato, suggesting strain. Subtle enough to not alarm, but distinct enough to register. | 300ms | Music +4dB | A leader's fatigue crosses 60 (fatigued state) |
| L4 | Burnout alert | A more alarming version of L3 — the vibrato is faster, the tone lower, and there is a slight "wobble" suggesting instability. Paired with the leader portrait shifting to burned-out state. | 500ms | Music +7dB | A leader's fatigue crosses 90 or trust drops below 15 |
| L5 | Trust change (positive) | A brief, clear bell tone — trust is restored, relationships are solid. | 100ms | Music +3dB | A leader's trust value increases |
| L6 | Trust change (negative) | A muted, dampened version of L5 — the bell tone with heavy damping, like a bell struck while being held. Trust is eroding. | 100ms | Music +3dB | A leader's trust value decreases |

#### Initiative Events

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| I1 | Initiative started | A purposeful, forward-moving sound — a short ascending three-note arpeggio on a clean synth, suggesting a project being set in motion. Similar energy to the "card select" (U6) but more developed. | 200ms | Music +5dB | An initiative begins during Execute phase |
| I2 | Initiative progress tick | An extremely subtle, low-volume click — barely perceptible, like a clock ticking in another room. Confirms progress is happening without demanding attention. Two pitch variants to prevent monotony. | 50ms | Music +1dB | An initiative's progress increments during Execute phase |
| I3 | Initiative completed (success) | A satisfying, resolving three-note descending figure on a soft bell/chime — the "project delivered" sound. Warm, accomplished, brief. | 300ms | Music +6dB | An initiative resolves with a positive outcome |
| I4 | Initiative completed (partial) | A modified version of I3 — same three notes but the final note is slightly flat or unresolved (suspended rather than resolved chord). "Done, but not perfectly." | 300ms | Music +5dB | An initiative resolves with a mixed outcome |
| I5 | Initiative failed | A low, single piano note struck hard and left to decay — stark, final, like a door closing. Not dramatic, just definitive. | 500ms | Music +6dB | An initiative fails or is abandoned |

#### Interruption Events

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| E1 | Event alert (ignorable) | A soft, rounded notification tone — a single sine-wave "bing" at ~1200Hz with gentle attack and quick decay. Like a text message notification. Does not demand immediate attention. Matches `--alert-low` gray styling. | 200ms | Music +4dB | An ignorable-urgency event fires during Execute |
| E2 | Event alert (pressing) | A more insistent two-tone notification — "bing-bing" at ~1000Hz and ~1200Hz, with sharper attack. Like an email marked urgent. Demands notice but not panic. Matches `--alert-medium` gold styling. | 400ms | Music +7dB | A pressing-urgency event fires during Execute |
| E3 | Event alert (critical) | A three-pulse alarm at ~600Hz — lower pitch, faster repetition, slight distortion on the attack. Unmistakable. The player should feel compelled to act. But still controlled — not a fire alarm, more like a critical system notification in a control room. Matches `--alert-high` red styling. | 600ms | Music +10dB | A critical-urgency event fires during Execute |
| E4 | Event choice made | A clean, decisive "click-confirm" — slightly weightier than U1 (button click), implying a consequential decision rather than a routine interaction. | 100ms | Music +4dB | Player selects an option in an event modal |
| E5 | Event auto-resolved | A soft, ambiguous tone — neither positive nor negative. A mid-range hum that suggests "something happened without your input." Slightly unsettling because the player chose to ignore this. | 200ms | Music +3dB | An ignorable event resolves without player intervention |

#### Attention System

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| A1 | Attention spent | A crisp, precise "coin-clink" — a high-frequency metallic tap that suggests currency being spent. Satisfying but not so pleasant that the player wants to hear it more (attention is scarce and spending it should feel consequential). Pitch decreases very slightly with each point spent in a week, creating a subtle sense of depletion. | 80ms | Music +4dB | Each attention point spent |
| A2 | Attention depleted | A hollow, resonant "empty vessel" tone — like tapping an empty glass. Played once when attention reaches 0. The player has nothing left to spend this week. | 300ms | Music +6dB | Attention budget reaches 0 |
| A3 | Attention restored | A bright, full "refill" sweep — a quick ascending glissando suggesting replenishment. Plays at the start of each new week when the attention budget resets. | 200ms | Music +5dB | Attention budget resets at week start |

#### Win/Loss

| # | Sound | Description | Duration | Volume | Trigger |
|---|---|---|---|---|---|
| W1 | Victory stinger | See Music Direction section — the settlement theme in major key with gradual instrument build. This is a music cue, not an SFX, but is listed here for completeness. | 25-35s | Music level | Autonomy score >= 80 sustained for 3 weeks |
| W2 | Loss stinger | See Music Direction section — silence, then solo piano and cello. Music cue. | 15-25s | Music level | Trust or any critical resource hits 0 |
| W3 | Achievement ping | A bright, distinct chime — two ascending notes (perfect fifth interval) on a bell synth. Used for any notable milestone (first week completed, first initiative succeeded, etc.) if an achievement system is added later. | 200ms | Music +6dB | Achievement unlocked (future feature) |

### SFX Summary

| Category | Count | Average Duration |
|---|---|---|
| UI Interactions | 9 | 105ms |
| Phase Transitions | 5 | 820ms |
| Resource Changes | 7 | 350ms |
| Leader Actions | 6 | 210ms |
| Initiative Events | 5 | 270ms |
| Interruption Events | 5 | 300ms |
| Attention System | 3 | 190ms |
| Win/Loss | 3 | — |
| **Total** | **43** | — |

---

## 4. Adaptive Audio System

### How Music Layers Respond to Game State

Steadward's adaptive music uses a simple two-layer system inspired by FTL's Explore/Battle approach:

**Layer 1 — Base Track**: The mode-specific ambient track (Observe, Plan, Execute, or Review) plays continuously at full volume. This is the foundation that provides mode identity.

**Layer 2 — Tension Layer**: An additional musical layer that fades in when the game state warrants it. This layer adds harmonic tension, rhythmic urgency, or tonal darkness to the base track. It is composed in the same key, tempo, and time signature as the base track, so they can be mixed freely without harmonic clashes.

The tension layer volume is controlled by a single `tensionLevel` value (0.0 to 1.0) derived from game state:

```
tensionLevel = max(
  resourceTension,    // derived from how many resources are below warning thresholds
  leaderTension,      // derived from how many leaders are fatigued/burned out
  departmentTension,  // derived from how many departments are below 50 health
  weekTension         // gradually increases as weeks progress (0.0 at week 1, 0.3 at week 8)
)
```

When `tensionLevel` is 0.0, only the base track plays. When it is 1.0, the tension layer is at full volume alongside the base track. Changes to tension level are smoothed over 3-5 seconds to prevent abrupt audio shifts from a single resource change.

### Resource Tension Mapping

| Condition | Contribution to tensionLevel |
|---|---|
| No resources below 25 | 0.0 |
| 1 resource below 25 | 0.2 |
| 2 resources below 25 | 0.4 |
| Any resource below 15 | 0.5 (minimum) |
| 2+ resources below 15 | 0.7 |
| Any resource below 10 | 0.8 (minimum) |
| Trust below 10 | 0.9 (Trust approaching 0 is near-loss) |

### Leader Tension Mapping

| Condition | Contribution to tensionLevel |
|---|---|
| No leaders fatigued | 0.0 |
| 1 leader fatigued (fatigue >= 60) | 0.15 |
| 2+ leaders fatigued | 0.3 |
| Any leader burned out (fatigue >= 90) | 0.4 |
| 2+ leaders burned out | 0.6 |

### Department Health Mapping

| Condition | Contribution to tensionLevel |
|---|---|
| All departments above 50 health | 0.0 |
| 1 department below 50 | 0.15 |
| 2 departments below 50 | 0.3 |
| Any department below 25 | 0.4 |
| 2+ departments below 25 | 0.6 |

### Week Progression Mapping

| Week | Contribution to tensionLevel |
|---|---|
| Week 1-2 | 0.0 |
| Week 3-4 | 0.05 |
| Week 5-6 | 0.10 |
| Week 7-8 | 0.15 |
| Week 9-10 | 0.20 |
| Week 11+ | 0.25 |

This creates a gradual baseline tension increase that makes later weeks feel inherently more pressured than early weeks, even if resource levels are identical.

### What the Tension Layer Sounds Like

**Observe tension layer**: A low, sustained drone (two notes a semitone apart creating a slow beat frequency) and sparse, irregular high-pitched metallic taps. Adds unease without disrupting the analytical feel. Like distant machinery behaving slightly wrong.

**Plan tension layer**: A more insistent bass synth pulse (quarter notes instead of the base track's half notes) and a faint, detuned echo of the acoustic guitar melody. Creates a sense of time pressure during planning — "you need to choose wisely because things are not going well."

**Execute tension layer**: Additional percussive elements — a faster hi-hat pattern, a more prominent snare hit, and the guitar tone becomes slightly overdriven. The most noticeable tension shift, reflecting that Execute is where consequences are most immediate.

**Review tension layer**: None. Review mode has no tension layer. The music is already reflective and contemplative; adding a tension layer would undermine the mode's purpose as a space for calm assessment. If the game state is dire, the tension will have been communicated during Execute. Review should feel like a respite regardless of how badly things are going — the player needs emotional breathing room to process outcomes and plan their next move.

### Handling Multiple Simultaneous Alerts

When multiple events or state changes occur simultaneously (which can happen during Execute phase), audio is prioritized and queued:

1. **Critical alerts** always play immediately, interrupting any other SFX
2. **Pressing alerts** queue behind critical alerts with a 300ms gap
3. **Ignorable alerts** queue behind pressing with a 500ms gap
4. **Resource change sounds** are batched: if 3 resources change in the same frame, only the most significant change plays its SFX (largest absolute delta), and the others are suppressed
5. **Never more than 2 alert sounds within any 1-second window** — additional alerts are suppressed and the player is informed visually only

This prevents the audio from becoming a cacophony during complex Execute phases where multiple events, resource changes, and initiative progress ticks might all occur at once.

---

## 5. Technical Architecture

### Recommended Audio Library

**Primary recommendation: [Howler.js](https://howlerjs.com/) v2.2+**

| Criterion | Howler.js | Tone.js | Pizzicato.js | Raw Web Audio API |
|---|---|---|---|---|
| **Purpose fit** | Audio playback and management — exactly what Steadward needs | Music synthesis and generation — overkill | Simplified Web Audio wrapper — limited feature set | Maximum control, maximum boilerplate |
| **File size** | 7KB gzipped | ~150KB | ~15KB | 0KB (native) |
| **Audio sprites** | Built-in support | No | No | Manual implementation |
| **Format fallback** | Automatic Web Audio to HTML5 Audio fallback | Web Audio only | Web Audio only | Web Audio only |
| **Browser support** | IE9+ through modern browsers, Cordova | Modern browsers only | Modern browsers only | Modern browsers only |
| **Caching** | Automatic — loaded sounds are cached and reused | Manual | Manual | Manual |
| **Community** | 25,000+ GitHub stars, 700K+ weekly npm downloads | 14,700 stars, 198K downloads | 1,500 stars, low downloads | N/A |
| **Learning curve** | Low — simple play/pause/volume API | High — synthesizer concepts | Low | High — raw AudioContext management |

**Rationale**: Howler.js is the standard library for web game audio. It handles the hard parts (browser compatibility, autoplay restrictions, format detection, caching) while providing a clean API for exactly what Steadward needs: playing audio files with volume control, fading, and sprite support. Tone.js is designed for building synthesizers and sequencers — powerful but wrong tool for the job. Pizzicato.js is simpler but less actively maintained and lacks audio sprite support. Raw Web Audio API would work but requires writing hundreds of lines of boilerplate that Howler.js already handles.

### Audio Manager Design

The audio manager integrates with Steadward's existing action-reducer architecture by subscribing to the game store, exactly as the telemetry system does.

```
src/
├── audio/
│   ├── audio-manager.ts      # Core manager — subscribes to store, routes state changes to sounds
│   ├── audio-config.ts        # Sound definitions, sprite maps, volume levels
│   ├── music-controller.ts    # Manages ambient tracks, crossfading, tension layers
│   ├── sfx-controller.ts      # Manages one-shot SFX, queuing, priority
│   └── audio-settings.ts      # User preferences (master/music/sfx volumes, mute state)
```

**audio-manager.ts** subscribes to the game store via `store.subscribe()` and receives every state change. It compares the previous state to the new state and triggers appropriate audio responses:

```typescript
// Pseudocode — not implementation, just architecture illustration
class AudioManager {
  private previousState: GameState | null = null;

  initialize(store: GameStore) {
    store.subscribe((state: GameState) => {
      if (!this.previousState) {
        this.previousState = state;
        return;
      }

      // Detect mode changes
      if (state.currentMode !== this.previousState.currentMode) {
        this.musicController.transitionToMode(state.currentMode);
        this.sfxController.playModeTransition(state.currentMode);
      }

      // Detect resource changes
      for (const resource of RESOURCE_KEYS) {
        const delta = state.resources[resource] - this.previousState.resources[resource];
        if (delta !== 0) {
          this.sfxController.playResourceChange(resource, delta, state.resources[resource]);
        }
      }

      // Detect tension level changes
      const tension = calculateTensionLevel(state);
      this.musicController.setTensionLevel(tension);

      // ... other state comparisons

      this.previousState = state;
    });
  }
}
```

The audio manager is initialized during the game startup sequence (after the store is created, alongside telemetry). It is a passive subscriber — it never dispatches actions or modifies game state. It only reads state and plays sounds.

### Lazy Loading Strategy

**Do not load all audio on first page load.** The title screen needs exactly two things: the title theme music track and the button click SFX. Everything else can wait.

**Loading tiers**:

| Tier | When Loaded | What | Estimated Size |
|---|---|---|---|
| **Tier 0** (immediate) | On page load | Button click SFX (U1), silence buffer for autoplay unlock | ~5KB |
| **Tier 1** (title screen) | After first user interaction | Title theme music | ~200KB |
| **Tier 2** (game start) | When "New Game" is clicked | All mode transition SFX (T1-T5), Observe base track, Observe tension layer, all UI SFX | ~600KB |
| **Tier 3** (deferred) | During Observe mode (background) | Plan/Execute/Review base tracks and tension layers, all remaining SFX | ~1.2MB |
| **Tier 4** (on demand) | When triggered | Victory/loss stingers (loaded when autonomy score first exceeds 60 or any resource drops below 20) | ~200KB |

Howler.js supports lazy loading natively — sounds can be created with `preload: false` and loaded later via `.load()`. The audio manager tracks loading state and gracefully handles the case where a sound is triggered before its file has loaded (the sound simply does not play — no error, no crash).

### Web Audio API Autoplay Restrictions

**The problem**: All modern browsers (Chrome, Firefox, Safari, Edge) block audio playback until the user has interacted with the page via a click, tap, or key press. Creating an `AudioContext` before user interaction leaves it in a `suspended` state.

**The solution**: Steadward's title screen requires a "New Game" button click to start. This click is the user gesture that unlocks audio.

```typescript
// Implementation approach
class AudioManager {
  private context: AudioContext | null = null;
  private unlocked = false;

  async unlock(): Promise<void> {
    if (this.unlocked) return;

    // Create context on first user gesture
    if (!this.context) {
      this.context = new AudioContext();
    }

    // Resume if suspended
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.unlocked = true;
  }
}

// In title screen click handler:
document.querySelector('.new-game-btn').addEventListener('click', async () => {
  await audioManager.unlock();
  // ... start game
});
```

**Howler.js handles most of this automatically** — it creates and manages the AudioContext internally and attempts to resume it on user interaction. However, explicitly calling `Howler.ctx.resume()` on the first click provides a safety net.

**Edge case**: If the player returns to the game after a long idle period, the browser may re-suspend the AudioContext. The audio manager should check `Howler.ctx.state` on each interaction and resume if needed.

### Audio Sprite Sheets vs Individual Files

**Use audio sprites for SFX. Use individual files for music tracks.**

**SFX sprites**: Combine all UI interaction sounds (U1-U9) into a single audio sprite file. Combine all transition sounds (T1-T5) into another. Combine all resource/leader/initiative/event sounds (R1-R7, L1-L6, I1-I5, E1-E5, A1-A3) into a third. This reduces the 43 SFX files to 3 HTTP requests.

Howler.js has built-in sprite support:

```typescript
const uiSprite = new Howl({
  src: ['sfx/ui-sprite.webm', 'sfx/ui-sprite.mp3'],
  sprite: {
    buttonClick: [0, 80],      // start ms, duration ms
    buttonHover: [100, 30],
    panelOpen: [150, 150],
    panelClose: [320, 120],
    tabSwitch: [460, 120],
    // ...
  }
});

// Play a specific sprite segment
uiSprite.play('buttonClick');
```

**Music tracks**: Keep as individual files. They are large (150-400KB each), loaded at different times, and need independent volume/fade control. Sprite sheets for music would create unnecessarily large files that must be fully loaded before any track can play.

### Format Recommendations

| Format | Use For | Why |
|---|---|---|
| **WebM (Opus codec)** | Primary format for all audio | Smallest file size at equivalent quality. Opus is the best lossy audio codec available. Supported by Chrome, Firefox, Edge. |
| **MP3** | Fallback format for all audio | Universal browser support including Safari (which does not support Opus in WebM containers as of 2026). Larger files but guaranteed playback. |

**Do not use**: OGG Vorbis (superseded by Opus, poor Safari support), WAV (uncompressed, 10x file size), AAC/M4A (licensing complexity, no advantage over MP3 for this use case), FLAC (lossless is unnecessary for game audio delivered over the web).

**Encoding settings**:
- Music tracks: Opus at 96kbps (stereo) / MP3 at 128kbps. These are ambient background tracks, not audiophile listening — 96kbps Opus is perceptually transparent for this use case.
- SFX: Opus at 64kbps (mono) / MP3 at 96kbps (mono). Short, simple tones do not need high bitrates.
- Sample rate: 44.1kHz for music, 22.05kHz for SFX (saves file size, SFX have no content above 10kHz).

Howler.js handles format fallback automatically — provide both formats in the `src` array and it will use the first one the browser supports:

```typescript
const music = new Howl({
  src: ['music/observe.webm', 'music/observe.mp3'],
  loop: true,
  volume: 0.5
});
```

### Volume Controls

Three independent volume channels, persisted to localStorage:

| Channel | Default | Range | Controls |
|---|---|---|---|
| **Master** | 80% | 0-100% | Scales all audio output |
| **Music** | 70% | 0-100% | Scales ambient tracks and tension layers |
| **SFX** | 90% | 0-100% | Scales all one-shot sound effects |

Plus a **Mute** toggle that silences all audio without changing the volume sliders (so the player can unmute and return to their preferred levels).

These controls should be accessible from the settings panel (gear icon in the header bar). The settings panel is defined in the art direction as part of the UI chrome.

**Implementation**: `Howler.volume()` sets global volume (master). Individual `Howl` instances have their own `.volume()` for per-channel control. Effective volume for any sound = `master * channel * soundBaseVolume`.

---

## 6. Placeholder Asset List

### Priority Definitions

- **P0 (Phase 5)**: Minimum viable audio. The game should not feel silent, but placeholder quality is acceptable. A few key sounds and one ambient track.
- **P1 (Phase 6)**: Full audio coverage. All mode-specific tracks, all SFX categories populated. Placeholder sources acceptable, but the full audio vocabulary should be present.
- **P2 (Phase 7)**: Polish pass. Adaptive tension layers, victory/loss music, custom-composed tracks replacing placeholders, volume tuning.

### P0 — Minimum Viable Audio (Phase 5)

| # | Asset | Type | Duration | Source | Notes |
|---|---|---|---|---|---|
| P0-1 | Button click (U1) | SFX | 80ms | [Kenney UI Audio](https://kenney.nl/assets/ui-audio) — "click1.ogg" or "click3.ogg" from the 50-asset pack | CC0, free. These are clean, neutral clicks suitable for placeholder use. |
| P0-2 | Panel open (U3) | SFX | 150ms | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) — select a short whoosh/sweep from the 100-asset pack | CC0, free. |
| P0-3 | Panel close (U4) | SFX | 120ms | Reverse of P0-2 (reverse the audio file in any editor) | Derived from P0-2. |
| P0-4 | Mode transition (generic) | SFX | 800ms | [Freesound "Game Audio - UI SFX" pack by GameAudio](https://freesound.org/people/GameAudio/packs/13940/) — select a notification/transition chime | CC0. Use one generic transition sound for all 4 modes initially. |
| P0-5 | Resource change (generic positive) | SFX | 80ms | [Freesound "Clicks, Buttons & UI sounds" by Breviceps](https://freesound.org/people/Breviceps/packs/25371/) — a short bright blip | CC-BY 3.0. One sound for all gains initially. |
| P0-6 | Resource change (generic negative) | SFX | 80ms | Pitch-shifted version of P0-5 (lower by ~200Hz) | Derived from P0-5. |
| P0-7 | Event alert (generic) | SFX | 400ms | [Freesound "UI Button Click Snap" by el_boss](https://freesound.org/people/el_boss/sounds/677860/) or similar notification tone from the Breviceps pack | One alert sound for all urgency levels initially. |
| P0-8 | Ambient track (generic) | Music | 3:00 | Kevin MacLeod (Incompetech) — ["Crypto"](https://incompetech.com/music/royalty-free/music.html) or ["Ossuary 7 - Resolve"](https://incompetech.com/music/royalty-free/music.html) | CC-BY 4.0, search for "ambient" + "dark" at incompetech.com. One track for all modes initially. These are atmospheric, dark ambient pieces that fit the management game aesthetic. Attribution: "Music by Kevin MacLeod (incompetech.com), licensed under CC BY 4.0." |

**P0 Total: 8 assets, ~250KB estimated**

### P1 — Full Audio Coverage (Phase 6)

| # | Asset | Type | Duration | Source | Notes |
|---|---|---|---|---|---|
| | **UI Interactions** | | | | |
| P1-1 | Button click — 2 variants (U1) | SFX | 80ms each | [Kenney UI Audio](https://kenney.nl/assets/ui-audio) — select 2 click variants | CC0. Pitch-shift one slightly for the second variant. |
| P1-2 | Button hover (U2) | SFX | 30ms | Generate programmatically — a 2000Hz sine wave at -20dB with 30ms linear fade. Can be created in Audacity or via Web Audio API `OscillatorNode` at runtime. | No file needed if generated in code. Otherwise, Audacity export. |
| P1-3 | Tab switch (U5) | SFX | 120ms | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) — a two-tone blip | CC0 |
| P1-4 | Card select (U6) | SFX | 100ms | [Freesound "Game Audio - UI SFX" pack by GameAudio](https://freesound.org/people/GameAudio/packs/13940/) — select a pluck or tap | CC0 |
| P1-5 | Card deselect (U7) | SFX | 80ms | Pitch-shifted version of P1-4 (lower) | Derived |
| P1-6 | Modal open — 3 urgency variants (U8) | SFX | 200ms each | [Freesound "Error UI Sounds" by yake01](https://freesound.org/people/yake01/packs/32374/) — select notification tones of increasing intensity | CC0. Use pitch and filter to differentiate 3 urgency levels. |
| P1-7 | Modal close (U9) | SFX | 150ms | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) — a soft close/dismiss sound | CC0 |
| | **Phase Transitions** | | | | |
| P1-8 | Observe start (T1) | SFX | 800ms | Compose custom — 3-note ascending minor triad on a sine/triangle wave in Audacity or a free synth (e.g., [Vital](https://vital.audio/) free tier). Alternatively, layer 3 tones from the Kenney packs with different pitches. | Custom or derived |
| P1-9 | Plan start (T2) | SFX | 700ms | Compose custom — 2-note suspended 4th figure on a bell synth | Custom |
| P1-10 | Execute start (T3) | SFX | 900ms | Compose custom — 3-note descending figure with percussive attack | Custom |
| P1-11 | Review start (T4) | SFX | 1000ms | Compose custom — single sustained piano note with reverb. Use a free piano sample from [Freesound](https://freesound.org/search/?q=piano+single+note). | Custom or [Freesound piano note](https://freesound.org/search/?q=single+piano+note+reverb) |
| P1-12 | Week advance (T5) | SFX | 600ms | Compose custom — clock tick + ascending sweep | Custom |
| | **Resource & Leader SFX** | | | | |
| P1-13 | Resource gain small (R1) | SFX | 80ms | Generate — ascending sine glide 1000-1500Hz | Audacity tone generator |
| P1-14 | Resource gain large (R2) | SFX | 200ms | Two instances of P1-13 with 60ms gap | Derived |
| P1-15 | Resource loss small (R3) | SFX | 80ms | Generate — descending sine glide 1500-1000Hz | Audacity tone generator |
| P1-16 | Resource loss large (R4) | SFX | 200ms | Two instances of P1-15, second lower-pitched | Derived |
| P1-17 | Resource warning caution (R5) | SFX | 800ms | [Freesound "Error UI Sounds" by yake01](https://freesound.org/people/yake01/packs/32374/) — a pulsing warning tone | CC0 |
| P1-18 | Resource warning danger (R6) | SFX | 1000ms | More intense version of P1-17, or [Freesound alarm search](https://freesound.org/search/?q=alarm+subtle+short) | CC0 or CC-BY |
| P1-19 | Resource recovery (R7) | SFX | 400ms | Ascending glissando — generate in Audacity | Custom |
| P1-20 | Leader assigned (L1) | SFX | 150ms | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) — affirming two-note sound | CC0 |
| P1-21 | Leader unassigned (L2) | SFX | 100ms | Lower-pitched version of P1-20 | Derived |
| P1-22 | Fatigue warning (L3) | SFX | 300ms | Generate — detuned sawtooth wave with slow vibrato | Audacity or Vital synth |
| P1-23 | Burnout alert (L4) | SFX | 500ms | More intense version of P1-22 | Derived |
| P1-24 | Trust change positive (L5) | SFX | 100ms | [Kenney UI Audio](https://kenney.nl/assets/ui-audio) — a bright bell-like tone | CC0 |
| P1-25 | Trust change negative (L6) | SFX | 100ms | Dampened version of P1-24 | Derived |
| | **Initiative & Event SFX** | | | | |
| P1-26 | Initiative started (I1) | SFX | 200ms | Compose — ascending 3-note arpeggio | Custom |
| P1-27 | Initiative progress tick (I2) | SFX | 50ms | [Kenney UI Audio](https://kenney.nl/assets/ui-audio) — quietest, shortest click in the pack | CC0, set very low volume |
| P1-28 | Initiative completed success (I3) | SFX | 300ms | Compose — descending 3-note bell chime, resolved | Custom |
| P1-29 | Initiative completed partial (I4) | SFX | 300ms | Modified P1-28 — final note slightly flat | Derived |
| P1-30 | Initiative failed (I5) | SFX | 500ms | [Freesound piano note search](https://freesound.org/search/?q=piano+single+note+low) — single low piano note | CC0 or CC-BY |
| P1-31 | Event choice made (E4) | SFX | 100ms | Weighted version of P1-1 (button click) — slightly deeper | Derived |
| P1-32 | Event auto-resolved (E5) | SFX | 200ms | Generate — mid-range ambiguous hum | Custom |
| P1-33 | Attention spent (A1) | SFX | 80ms | [Kenney UI Audio](https://kenney.nl/assets/ui-audio) — a crisp metallic tap, or generate a coin-clink in Audacity | CC0 or custom |
| P1-34 | Attention depleted (A2) | SFX | 300ms | Generate — hollow low tone | Custom |
| P1-35 | Attention restored (A3) | SFX | 200ms | Generate — ascending bright sweep | Custom |
| | **Music Tracks** | | | | |
| P1-36 | Title theme | Music | 2:30 | Kevin MacLeod — ["Long Note Four"](https://incompetech.com/music/royalty-free/music.html) or similar dark ambient piece. Alternatively, compose custom using [LMMS](https://lmms.io/) (free DAW) or [Vital](https://vital.audio/) synth. | CC-BY 4.0 (MacLeod) or custom |
| P1-37 | Observe base track | Music | 3:30 | Kevin MacLeod — search Incompetech for "ambient" + "building" + "dark". Candidate: ["Anxiety"](https://incompetech.com/music/royalty-free/music.html) or ["Comfortable Mystery"](https://incompetech.com/music/royalty-free/music.html). Alternatively, source from [SoundImage.org](https://soundimage.org/) free library. | CC-BY 4.0 or custom |
| P1-38 | Plan base track | Music | 3:30 | Kevin MacLeod or SoundImage.org — search for "thoughtful" + "ambient" + "contemplative" | CC-BY 4.0 or custom |
| P1-39 | Execute base track | Music | 4:00 | Kevin MacLeod — search for "tension" + "action" + "building". Candidate: ["Deliberate Thought"](https://incompetech.com/music/royalty-free/music.html) which has a driving but restrained energy. | CC-BY 4.0 or custom |
| P1-40 | Review base track | Music | 3:00 | Kevin MacLeod — search for "reflective" + "calm" + "piano". Candidate: ["Reaching the Sky"](https://incompetech.com/music/royalty-free/music.html) or similar piano-led ambient. | CC-BY 4.0 or custom |

**P1 Total: 40 assets (35 SFX + 5 music), ~2.4MB estimated**

### P2 — Polish & Adaptive Layers (Phase 7)

| # | Asset | Type | Duration | Source | Notes |
|---|---|---|---|---|---|
| P2-1 | Observe tension layer | Music | 3:30 | Compose custom — must match key/tempo of P1-40 | Drone + metallic taps overlay. Requires custom composition. |
| P2-2 | Plan tension layer | Music | 3:30 | Compose custom — must match key/tempo of P1-41 | Insistent bass pulse + detuned echo overlay |
| P2-3 | Execute tension layer | Music | 4:00 | Compose custom — must match key/tempo of P1-42 | Percussive elements + overdriven guitar overlay |
| P2-4 | Victory stinger (W1) | Music | 30s | Compose custom — settlement theme in major key with instrument build | Must be original composition |
| P2-5 | Loss stinger (W2) | Music | 20s | Compose custom — silence + solo piano + cello | Must be original composition |
| P2-6 | Achievement ping (W3) | SFX | 200ms | Compose custom — two ascending bell notes (perfect fifth) | Custom |
| P2-7 | Replace all placeholder music with custom compositions | Music | ~18 min total | Commission or compose — 5 base tracks + title theme | See composer brief below |
| P2-8 | Audio sprite compilation | Build step | — | Combine all SFX into 3 sprite files (UI, transitions, game events) using [audiosprite](https://www.npmjs.com/package/audiosprite) npm package | Build pipeline addition |

**P2 Total: 8 items (4 new music tracks, 1 SFX, 1 music replacement pass, 1 build step, 1 sprite compilation), ~1.5MB additional**

### Asset Count Summary

| Priority | SFX | Music Tracks | Build/Config | Total Items |
|---|---|---|---|---|
| **P0** (Phase 5) | 7 | 1 | 0 | 8 |
| **P1** (Phase 6) | 35 | 5 | 0 | 40 |
| **P2** (Phase 7) | 1 | 9 (3 tension layers + victory + loss + 4 replacement custom tracks) | 1 | 11 |
| **Grand Total** | 43 | 15 | 1 | **59** |

### Composer Brief (for P2 custom music)

If commissioning a composer for Phase 7 custom tracks, provide them with this brief:

**Style**: Into the Breach meets Frostpunk — synthesizer pads, clean electric guitar (muted rhythm), solo cello, sparse piano. Not chiptune. Not orchestral. Not lo-fi. The sound of a control room on a frontier world.

**Mood**: Professional melancholy with undercurrents of determination. The settlement is struggling but not hopeless.

**Technical requirements**:
- 10 tracks total (5 base + 3 tension layers + victory stinger + loss stinger)
- All base tracks must loop seamlessly
- Tension layers must be in the same key, tempo, and time signature as their corresponding base track, and must be musically coherent when mixed at any volume level (0-100%)
- Deliver as stems (separate instrument tracks) AND pre-mixed stereo files
- 44.1kHz / 16-bit WAV delivery; the dev team will encode to WebM/MP3
- Total duration: ~25-30 minutes of unique music

**Budget reference**: Indie game composer rates for ~30 minutes of adaptive music typically range from $1,500-$5,000 USD depending on experience and licensing terms. Ben Prunty, the Into the Breach composer, is available for commissions through [benpruntymusic.com](https://www.benpruntymusic.com/). Other composers working in this style space include Chris Schlarb, Lena Raine (Celeste), and Amos Roddy (Darkest Dungeon).

---

## 7. Audio Budget

### File Size Estimates

| Category | Asset Count | Format (Primary) | Estimated Size (WebM/Opus) | Estimated Size (MP3 fallback) |
|---|---|---|---|---|
| SFX sprites (3 files) | 43 sounds compiled into 3 sprites | WebM Opus 64kbps mono | ~80KB total | ~120KB total |
| Music — Title | 1 track | WebM Opus 96kbps stereo | ~180KB | ~280KB |
| Music — Base tracks (4) | 4 tracks, avg 3:30 each | WebM Opus 96kbps stereo | ~600KB total | ~950KB total |
| Music — Tension layers (3) | 3 tracks, avg 3:30 each | WebM Opus 96kbps stereo | ~450KB total | ~700KB total |
| Music — Victory stinger | 1 track, 30s | WebM Opus 96kbps stereo | ~25KB | ~40KB |
| Music — Loss stinger | 1 track, 20s | WebM Opus 96kbps stereo | ~17KB | ~28KB |
| **Total (WebM primary)** | | | **~1.35MB** | |
| **Total (MP3 fallback)** | | | | **~2.12MB** |
| **Total (both formats)** | | | **~3.47MB** | |

### Loading Strategy

**Initial page load**: 0KB of audio. No audio files are loaded until the user interacts with the page.

**After first click** (title screen): ~185KB (title music WebM + UI click sprite). This loads in <1 second on a 3G connection and is invisible on broadband.

**On game start**: ~680KB (Observe track + Observe tension layer + all SFX sprites). Loaded asynchronously while the Observe view renders. The player sees the dashboard before they hear it, but the delay is <2 seconds on broadband.

**Background loading during gameplay**: Remaining tracks (~600KB) loaded progressively during the first Observe mode. By the time the player advances to Plan mode, all music is cached.

**Victory/loss stingers**: Loaded when conditions suggest they may be needed (autonomy score > 60 or any resource < 20). ~42KB, negligible.

**Total loaded over a full game session**: ~1.35MB (WebM) or ~2.12MB (MP3). For comparison, a single hero image on a marketing page is typically 200-500KB. The entire audio package is smaller than most web page hero sections.

### Compression Recommendations

| Setting | Value | Rationale |
|---|---|---|
| **Music codec** | Opus at 96kbps stereo (WebM container) | Perceptually transparent for ambient music. Opus outperforms MP3 at every bitrate — 96kbps Opus roughly equals 160kbps MP3. |
| **SFX codec** | Opus at 64kbps mono (WebM container) | Short, simple tones. Mono is sufficient — UI sounds do not need stereo imaging. |
| **Fallback codec** | MP3 at 128kbps stereo (music), 96kbps mono (SFX) | Safari compatibility. Joint stereo encoding for additional savings. |
| **Sample rate** | 44.1kHz (music), 22.05kHz (SFX) | Standard music rate. SFX downsampled because they contain no content above 10kHz. |
| **Music loop metadata** | Include `LOOPSTART` and `LOOPLENGTH` tags if encoding to OGG | Howler.js can use these for seamless looping. For WebM/MP3, rely on the composition itself having a seamless edit point. |

### Build Pipeline

Add an audio build step to `vite.config.ts` or as an npm script:

1. Source audio files live in `assets/audio/src/` (WAV originals, not committed to git if large)
2. Build step encodes to WebM (Opus) and MP3 using [ffmpeg](https://ffmpeg.org/):
   ```bash
   # Music track encoding
   ffmpeg -i input.wav -c:a libopus -b:a 96k -ar 44100 output.webm
   ffmpeg -i input.wav -c:a libmp3lame -b:a 128k -ar 44100 output.mp3

   # SFX encoding (mono, lower bitrate, lower sample rate)
   ffmpeg -i input.wav -c:a libopus -b:a 64k -ar 22050 -ac 1 output.webm
   ffmpeg -i input.wav -c:a libmp3lame -b:a 96k -ar 22050 -ac 1 output.mp3
   ```
3. SFX sprites compiled using [audiosprite](https://www.npmjs.com/package/audiosprite):
   ```bash
   npx audiosprite -f howler -o sfx/ui-sprite sfx/src/button-click.wav sfx/src/panel-open.wav ...
   ```
   This generates the sprite file AND a JSON definition file that Howler.js consumes directly.
4. Encoded files placed in `assets/audio/` for Vite to serve
5. WAV source files excluded from the production build via `.gitignore` or Vite configuration

### File Organization

```
steadward/
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   │   ├── title.webm              # ~180KB
│   │   │   ├── title.mp3               # ~280KB
│   │   │   ├── observe.webm            # ~150KB
│   │   │   ├── observe.mp3             # ~240KB
│   │   │   ├── observe-tension.webm    # ~150KB
│   │   │   ├── observe-tension.mp3     # ~240KB
│   │   │   ├── plan.webm
│   │   │   ├── plan.mp3
│   │   │   ├── plan-tension.webm
│   │   │   ├── plan-tension.mp3
│   │   │   ├── execute.webm
│   │   │   ├── execute.mp3
│   │   │   ├── execute-tension.webm
│   │   │   ├── execute-tension.mp3
│   │   │   ├── review.webm
│   │   │   ├── review.mp3
│   │   │   ├── victory.webm
│   │   │   ├── victory.mp3
│   │   │   ├── loss.webm
│   │   │   └── loss.mp3
│   │   └── sfx/
│   │       ├── ui-sprite.webm          # ~25KB (9 UI sounds)
│   │       ├── ui-sprite.mp3
│   │       ├── ui-sprite.json          # Howler.js sprite definition
│   │       ├── transition-sprite.webm  # ~15KB (5 transition sounds)
│   │       ├── transition-sprite.mp3
│   │       ├── transition-sprite.json
│   │       ├── game-sprite.webm        # ~35KB (29 game event sounds)│   │       ├── game-sprite.mp3
│   │       └── game-sprite.json
│   └── ...
```

---

## Appendix A: Key Audio Sources Quick Reference

| Source | URL | License | Best For |
|---|---|---|---|
| **Kenney UI Audio** | [kenney.nl/assets/ui-audio](https://kenney.nl/assets/ui-audio) | CC0 (public domain) | Button clicks, basic UI interactions (50 assets) |
| **Kenney Interface Sounds** | [kenney.nl/assets/interface-sounds](https://kenney.nl/assets/interface-sounds) | CC0 | Whooshes, confirms, tabs, panels (100 assets) |
| **Kenney Impact Sounds** | [kenney.nl/assets/impact-sounds](https://kenney.nl/assets/impact-sounds) | CC0 | Thuds, drops, physical feedback (130 assets) |
| **Freesound.org** | [freesound.org](https://freesound.org/) | Varies (check per sound: CC0, CC-BY, CC-BY-NC) | Specific SFX searches, wide variety |
| **OpenGameArt.org** | [opengameart.org](https://opengameart.org/) | Varies (mostly CC0, CC-BY) | Game-specific audio packs, community collections |
| **Incompetech (Kevin MacLeod)** | [incompetech.com](https://incompetech.com/music/royalty-free/music.html) | CC-BY 4.0 (free w/ attribution) or $30+/song no-attribution | Placeholder ambient music tracks |
| **SoundImage.org** | [soundimage.org](https://soundimage.org/) | Free for developers (check site terms) | 600+ ambient/atmospheric tracks |
| **Zapsplat** | [zapsplat.com](https://www.zapsplat.com/) | Free tier (attribution) / paid (no attribution) | 19,000+ professional SFX, WAV and MP3 |
| **Vital Synth** | [vital.audio](https://vital.audio/) | Free tier available | Creating custom synth-based SFX and tones |
| **LMMS** | [lmms.io](https://lmms.io/) | Free, open-source | Composing placeholder music tracks (DAW) |
| **Audacity** | [audacityteam.org](https://www.audacityteam.org/) | Free, open-source | Editing, pitch-shifting, encoding SFX files |

## Appendix B: Attribution Requirements

If using CC-BY licensed assets in the shipped game, include an "Audio Credits" section accessible from the settings or about screen:

```
AUDIO CREDITS

Music:
"[Track Name]" by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Sound Effects:
Sounds from Freesound.org:
- "[Sound Name]" by [Username] (freesound.org/people/[username]/)
  Licensed under CC-BY 3.0

Kenney UI Audio and Interface Sounds (kenney.nl) — CC0 Public Domain
```

CC0 assets (Kenney) do not legally require attribution but it is good practice to credit them anyway.

## Appendix C: Howler.js Quick Start

Minimal setup to verify audio works in the Steadward project:

```typescript
// src/audio/audio-manager.ts
import { Howl, Howler } from 'howler';

// Master volume (0.0 - 1.0)
Howler.volume(0.8);

// Load a single SFX for testing
const buttonClick = new Howl({
  src: ['/assets/audio/sfx/ui-sprite.webm', '/assets/audio/sfx/ui-sprite.mp3'],
  sprite: {
    click: [0, 80],
  },
});

// Load ambient music
const observeTrack = new Howl({
  src: ['/assets/audio/music/observe.webm', '/assets/audio/music/observe.mp3'],
  loop: true,
  volume: 0.5,
  preload: false, // Lazy load — call .load() when needed
});

// Play button click
export function playButtonClick(): void {
  buttonClick.play('click');
}

// Start ambient music (call after user gesture)
export function startMusic(): void {
  observeTrack.load();
  observeTrack.once('load', () => {
    observeTrack.play();
  });
}

// Crossfade between two tracks
export function crossfade(from: Howl, to: Howl, duration: number = 1500): void {
  to.volume(0);
  to.play();
  to.fade(0, 0.5, duration);
  from.fade(from.volume(), 0, duration);
  setTimeout(() => from.stop(), duration);
}

// Unlock audio context on first user interaction
export function unlockAudio(): void {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume();
  }
}
```

Install Howler.js:
```bash
npm install howler
npm install --save-dev @types/howler
```
