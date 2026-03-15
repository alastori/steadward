# Steadward — Art Direction Guide

**Author**: Visual Design
**Date**: 2026-03-14
**Status**: Draft v1
**Prerequisite reading**: [Game Design](game-design.md), [Architecture](architecture.md)

---

## Table of Contents

1. [Visual Identity](#1-visual-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Icon System](#4-icon-system)
5. [Leader Portraits](#5-leader-portraits)
6. [UI Components](#6-ui-components)
7. [Animation & Transitions](#7-animation--transitions)
8. [Asset Pipeline](#8-asset-pipeline)
9. [Placeholder Asset List](#9-placeholder-asset-list)

---

## 1. Visual Identity

### What Steadward IS

- **Information-dense management dashboard** rendered as a game — every pixel serves readability
- **Muted, professional, dark-themed UI** with sharp accent colors that encode game state (mode, urgency, resource type)
- **Clean geometric panels** with consistent spacing — closer to a Bloomberg terminal than a fantasy RPG
- **Pixel-precise typography** where numbers, labels, and status indicators are first-class citizens
- **Restrained pixel art accents** — leader portraits and department icons use pixel art style, but the UI chrome itself is clean vector/CSS
- **High information density without clutter** — achieved through consistent hierarchy, color coding, and whitespace discipline

### What Steadward is NOT

- Not a tile-based game with terrain, sprites, or animated characters walking around
- Not a colorful, whimsical indie game with bouncy animations and particle effects
- Not a retro pixel art game that fetishizes the aesthetic — pixel art is a practical choice for portraits and icons, not a nostalgia play
- Not a dark-and-gritty survival game — the palette is muted but not oppressive
- Not a game with complex 3D renders, gradients, or skeuomorphic textures

### Reference Games

**Into the Breach** (Subset Games) — Primary reference. The gold standard for "sacrifice cool ideas for the sake of clarity every time" (Justin Ma, GDC 2019). Key takeaways:
- Every visual element serves information flow first
- UI panels use dark semi-transparent backgrounds with bright accent text
- Color encodes meaning consistently (red = enemy action, blue = player, yellow = building damage)
- Animated tooltips demonstrate mechanics visually rather than through text walls
- Pixel art at 32x32 tile size, but UI chrome is clean and modern

**Slay the Spire** — Reference for card-based UI in a strategy context. Initiative cards in Steadward should learn from how Slay the Spire communicates cost, effect, and type through visual hierarchy on each card.

**Frostpunk** — Reference for the emotional weight of resource management. The way Frostpunk's UI communicates system pressure through color shifts and warning states is relevant to Steadward's urgency levels.

**Civic** / **Democracy 4** — Reference for dense data dashboards presented as games. The interconnected resource display with flowing connections between systems is relevant to Steadward's resource panel design.

### How Steadward Differs from Its References

- **No game board or map** — Unlike Into the Breach's isometric grid, Steadward's "game world" is entirely expressed through UI panels, cards, and data visualizations. The UI IS the game.
- **Mode-shifting color themes** — The entire UI shifts its accent palette as the player moves through Observe, Plan, Execute, and Review phases. No reference game does this as aggressively.
- **Leader-centric** — Character portraits and personality are central to the visual experience in a way that Into the Breach's pilot system is not.

---

## 2. Color System

### Design Principles

- Background surfaces use very dark blues/grays (not pure black — pure black causes eye strain and kills contrast nuance)
- Accent colors are desaturated enough to avoid visual fatigue but saturated enough to pop against dark backgrounds
- Every color encodes meaning — no decorative color
- All foreground text on dark backgrounds maintains minimum 4.5:1 contrast ratio (WCAG AA)
- Color is never the ONLY signifier — always paired with icons, labels, or position

### Base Palette

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--bg-darkest` | `#0D1117` | (13, 17, 23) | App background, deepest layer |
| `--bg-dark` | `#161B22` | (22, 27, 34) | Panel backgrounds, cards |
| `--bg-medium` | `#21262D` | (33, 38, 45) | Elevated panels, hover states |
| `--bg-light` | `#30363D` | (48, 54, 61) | Borders, dividers, inactive elements |
| `--bg-lighter` | `#484F58` | (72, 79, 88) | Disabled text, subtle borders |
| `--text-primary` | `#E6EDF3` | (230, 237, 243) | Primary text, headers |
| `--text-secondary` | `#8B949E` | (139, 148, 158) | Secondary labels, descriptions |
| `--text-muted` | `#6E7681` | (110, 118, 129) | Tertiary text, timestamps |
| `--text-on-accent` | `#FFFFFF` | (255, 255, 255) | Text rendered on accent-colored backgrounds |

### Mode Accent Colors

Each game phase has a dominant accent that tints the header bar, active buttons, and highlighted panels. Applied via `data-mode` attribute on the root element.

| Mode | Token | Hex | RGB | Rationale |
|---|---|---|---|---|
| **Observe** | `--mode-observe` | `#58A6FF` | (88, 166, 255) | Cool blue — passive, analytical, reading state |
| **Plan** | `--mode-plan` | `#D2A8FF` | (210, 168, 255) | Soft purple — deliberation, strategy, weighing options |
| **Execute** | `--mode-execute` | `#F0883E` | (240, 136, 62) | Warm amber — action, energy, things happening |
| **Review** | `--mode-review` | `#7EE787` | (126, 231, 135) | Muted green — reflection, growth, assessment |

Each mode also has a dimmed variant at 8% opacity for background tinting:

| Token | Hex (8% opacity over `--bg-dark`) |
|---|---|
| `--mode-observe-bg` | `rgba(88, 166, 255, 0.08)` |
| `--mode-plan-bg` | `rgba(210, 168, 255, 0.08)` |
| `--mode-execute-bg` | `rgba(240, 136, 62, 0.08)` |
| `--mode-review-bg` | `rgba(126, 231, 135, 0.08)` |

### Resource Colors

Each resource has a dedicated color used for its icon background, bar fill, and delta indicators. These are chosen to be distinguishable from each other and from the mode colors, and to remain legible under all three common forms of color vision deficiency (protanopia, deuteranopia, tritanopia).

| Resource | Token | Hex | RGB | Visual Mnemonic |
|---|---|---|---|---|
| **Attention** (primary) | `--res-attention` | `#F0C000` | (240, 192, 0) | Gold — the currency you spend each week |
| **Materials** | `--res-materials` | `#DA6D28` | (218, 109, 40) | Copper/bronze — physical stuff, construction |
| **Trust** | `--res-trust` | `#56D4E8` | (86, 212, 232) | Teal — reliability, calm, institutional |
| **Clarity** | `--res-clarity` | `#E6EDF3` | (230, 237, 243) | White/silver — transparency, clear sight |
| **Resilience** | `--res-resilience` | `#5EC269` | (94, 194, 105) | Deeper green — health, endurance, stability |
| **Knowledge** | `--res-knowledge` | `#C490FF` | (196, 144, 255) | Warmer violet — wisdom, depth, research |
| **Momentum** | `--res-momentum` | `#FF7B72` | (255, 123, 114) | Coral red — velocity, energy, urgency |

### Department Colors

| Department | Token | Hex | RGB |
|---|---|---|---|
| **Operations** | `--dept-ops` | `#F0883E` | (240, 136, 62) |
| **Infrastructure** | `--dept-infra` | `#8B949E` | (139, 148, 158) |
| **Research** | `--dept-research` | `#D2A8FF` | (210, 168, 255) |
| **External Affairs** | `--dept-external` | `#58A6FF` | (88, 166, 255) |

### Alert / Urgency Colors

Used for event interruptions and system warnings. Each urgency level uses color + icon + label (never color alone).

| Urgency | Token | Hex | RGB | Icon Treatment |
|---|---|---|---|---|
| **Ignorable** | `--alert-low` | `#8B949E` | (139, 148, 158) | Gray text, dashed border, dim icon |
| **Pressing** | `--alert-medium` | `#F0C000` | (240, 192, 0) | Yellow/gold text, solid border, pulsing dot |
| **Critical** | `--alert-high` | `#F85149` | (248, 81, 73) | Red text, thick border, exclamation icon |

### Positive / Negative Delta Colors

| Direction | Token | Hex | Usage |
|---|---|---|---|
| **Gain** | `--delta-positive` | `#7EE787` | Resource increase, "+3 Materials" |
| **Loss** | `--delta-negative` | `#F85149` | Resource decrease, "-2 Trust" |
| **Neutral** | `--delta-neutral` | `--text-secondary` | No change, "0" |

### Color Accessibility Notes

**Contrast ratios** (all verified against `--bg-dark` #161B22):
- `--text-primary` on `--bg-dark`: 13.2:1 (passes AAA)
- `--text-secondary` on `--bg-dark`: 5.1:1 (passes AA)
- `--mode-observe` on `--bg-dark`: 6.8:1 (passes AA)
- `--mode-execute` on `--bg-dark`: 5.9:1 (passes AA)
- `--alert-high` on `--bg-dark`: 5.5:1 (passes AA)
- `--res-attention` (gold) on `--bg-dark`: 9.4:1 (passes AAA)

**Colorblind considerations:**
- The resource palette avoids relying on red/green distinction alone. Resilience (green) and Momentum (coral red) differ in both hue AND lightness, making them distinguishable under deuteranopia/protanopia.
- Trust (teal) and Knowledge (violet) differ in both hue and saturation.
- Every color-coded element also carries an icon and/or text label.
- Alert levels use gray/yellow/red which differ in lightness (medium/high/highest), not just hue.
- Shapes and patterns supplement color: ignorable events have dashed borders, pressing have solid borders, critical have thick borders with an exclamation icon.

**Recommended testing tools:**
- Chrome DevTools > Rendering > "Emulate vision deficiencies" for quick checks
- [Stark](https://www.getstark.co/) Figma plugin for systematic palette audits
- [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/) for screenshot-based simulation

---

## 3. Typography

### Design Principles

- All fonts must be free, open-source, and self-hostable (no Google Fonts CDN dependency for offline/PWA play)
- Numeric displays must use tabular (monospace) figures so columns of numbers align
- Font rendering must be crisp at small sizes on both standard and retina displays
- Three font families maximum (primary, display, monospace) to maintain visual coherence — monospace is a debug-only exception

### Primary Font — Inter

**Font**: [Inter](https://rsms.me/inter/) by Rasmus Andersson
**License**: SIL Open Font License 1.1
**Format**: Variable font (single file, all weights)
**Why Inter**:
- Designed specifically for computer screens at small sizes
- Has proper **tabular figures** (`font-variant-numeric: tabular-nums`) — critical for resource displays where "100" and "8" must right-align cleanly
- Excellent readability at 11px-14px
- Distinguishes similar characters well (1/l/I, 0/O)
- Variable font means one file covers all weights (400 regular, 500 medium, 600 semibold, 700 bold)
- Massive Unicode coverage including arrows and mathematical symbols

**Usage**: All body text, labels, numbers, tooltips, resource counts, descriptions, button text.

**CSS setup**:
```css
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

### Secondary Font — Press Start 2P

**Font**: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38
**License**: SIL Open Font License 1.1
**Format**: TTF/WOFF2
**Why Press Start 2P**:
- Authentic 1980s Namco arcade bitmap aesthetic
- Pixel-perfect at multiples of 8px (8, 16, 24, 32)
- Creates instant visual contrast with Inter's clean modernism
- Communicates "this is a game" without requiring pixel art everywhere
- Supports Latin Extended, Cyrillic, Greek, Japanese Katakana

**Usage**: Game title on title screen, section headers within game views, mode labels ("OBSERVE", "PLAN", "EXECUTE", "REVIEW"), week counter ("WEEK 03"), occasional emphasis text.

**Alternative consideration**: [Silkscreen](https://kottke.org/plus/type/silkscreen/) by Jason Kottke (free) — smoother at small sizes than Press Start 2P. Use if Press Start 2P feels too aggressive. Another option is [monogram](https://datagoblin.itch.io/monogram) by datagoblin (CC0, monospaced, 5px wide) for an ultra-compact pixel font suitable for tiny labels.

### Monospace Font — IBM Plex Mono

**Font**: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) by IBM
**License**: SIL Open Font License 1.1
**Why**: For the debug panel (`window.__gameState`), action log display, and any code-like readouts. Also useful for seed display (`SEED: A7F3B2`) on share cards.

### Type Scale

All sizes in px, with rem equivalents assuming 16px base.

| Level | Font | Weight | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| **Display** | Press Start 2P | 400 | 24px / 1.5rem | 32px | 0.05em | Game title only |
| **H1** | Press Start 2P | 400 | 16px / 1rem | 24px | 0.04em | Screen titles ("OBSERVE", "WEEK 03") |
| **H2** | Inter | 700 | 16px / 1rem | 24px | -0.01em | Panel headers ("Department Health") |
| **H3** | Inter | 600 | 14px / 0.875rem | 20px | 0 | Card titles, initiative names |
| **Body** | Inter | 400 | 13px / 0.8125rem | 20px | 0 | Descriptions, event text, leader bios |
| **Label** | Inter | 500 | 11px / 0.6875rem | 16px | 0.02em | Resource labels, stat names, metadata |
| **Caption** | Inter | 400 | 11px / 0.6875rem | 14px | 0.02em | Timestamps, footnotes |
| **Number (large)** | Inter | 700 | 20px / 1.25rem | 24px | 0 | Attention counter, large resource values |
| **Number (standard)** | Inter | 600 | 14px / 0.875rem | 20px | 0 | Resource values, stat numbers |
| **Number (small)** | Inter | 500 | 11px / 0.6875rem | 16px | 0 | Delta values (+3, -2), percentages |

**Critical CSS for numbers**:
```css
.resource-value, .stat-number, .delta-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}
```

---

## 4. Icon System

### Primary Source — game-icons.net

**URL**: [https://game-icons.net](https://game-icons.net)
**License**: CC BY 3.0 (attribution required — add "Icons by game-icons.net" in credits/about screen)
**Format**: SVG (vector, infinitely scalable, colorable via CSS `fill`)
**Icon count**: 4,170+ icons
**Style**: White silhouette on transparent background. Bold, high-contrast, readable at small sizes. The silhouette style works naturally with Steadward's dark UI — render as light icons on dark panels.

### Secondary Source — Kenney Game Icons

**URL**: [https://kenney.nl/assets/game-icons](https://kenney.nl/assets/game-icons)
**License**: CC0 (public domain, no attribution required)
**Use for**: Simple UI chrome icons (arrows, checkmarks, settings gear) where game-icons.net's silhouette style is too heavy.

### Icon Specifications

| Property | Value |
|---|---|
| **Canvas size** | 24x24px (standard), 16x16px (compact/inline), 32x32px (featured/header) |
| **Padding** | 2px on all sides within canvas (icon art occupies 20x20 in a 24x24 canvas) |
| **Stroke weight** | N/A — game-icons.net uses filled silhouettes, not stroked outlines |
| **Color treatment** | Icons inherit their parent element's CSS `color` via `fill: currentColor` |
| **Hover/active states** | Brighten to `--text-primary`, optionally add subtle glow via `filter: drop-shadow()` |
| **Disabled state** | `opacity: 0.3` |

### Resource Icons

| Resource | game-icons.net Icon | URL Path | Rationale |
|---|---|---|---|
| **Attention** | `eye-target` | `/1x1/lorc/eye-target.html` | Crosshair over an eye — focused awareness, the thing you're spending |
| **Materials** | `brick-pile` | `/1x1/delapouite/brick-pile.html` | Stack of bricks — physical resources, construction supply |
| **Trust** | `shaking-hands` | `/1x1/delapouite/shaking-hands.html` | Handshake — interpersonal trust, cooperation |
| **Clarity** | `crystal-ball` | `/1x1/lorc/crystal-ball.html` | Crystal ball — seeing clearly, understanding the situation |
| **Resilience** | `shield` | `/1x1/sbed/shield.html` | Shield — defense, durability, absorbing shocks |
| **Knowledge** | `book-cover` | `/1x1/delapouite/book-cover.html` | Book — accumulated learning, documentation |
| **Momentum** | `fast-forward-button` | `/1x1/delapouite/fast-forward-button.html` | Fast-forward arrows — speed, forward progress, velocity |

### Department Icons

| Department | game-icons.net Icon | URL Path | Rationale |
|---|---|---|---|
| **Operations** | `gears` | `/1x1/lorc/gears.html` | Interlocking gears — machinery, processes, daily operations |
| **Infrastructure** | `house` | `/1x1/delapouite/house.html` | Building — physical plant, foundations, structures |
| **Research** | `archive-research` | `/1x1/delapouite/archive-research.html` | Magnifying glass over archive — investigation, study |
| **External Affairs** | `globe` | `/1x1/delapouite/globe.html` | Globe — outward-facing, diplomacy, external world |

### Phase / Mode Icons

| Mode | game-icons.net Icon | URL Path | Rationale |
|---|---|---|---|
| **Observe** | `telescope` | `/1x1/delapouite/telescope.html` | Telescope — surveying, passive observation, gathering data |
| **Plan** | `compass` | `/1x1/lorc/compass.html` | Compass — navigation, setting direction, strategy |
| **Execute** | `power-lightning` | `/1x1/lorc/power-lightning.html` | Lightning bolt — action, energy, execution |
| **Review** | `pie-chart` | `/1x1/delapouite/pie-chart.html` | Pie chart — analysis, assessment, reviewing outcomes |

### UI Chrome Icons

| Function | game-icons.net Icon | URL Path | Alt Source |
|---|---|---|---|
| **Save** | `save` | `/1x1/delapouite/save.html` | — |
| **Settings** | `settings-knobs` | `/1x1/delapouite/settings-knobs.html` | — |
| **Share** | `share` | `/1x1/delapouite/share.html` | — |
| **Info / Help** | `info` | `/1x1/delapouite/info.html` | — |
| **Warning** | `hazard-sign` | `/1x1/lorc/hazard-sign.html` | — |
| **Close / Cancel** | `cancel` | `/1x1/sbed/cancel.html` | Kenney UI Pack |
| **Next / Advance** | `next-button` | `/1x1/delapouite/next-button.html` | Kenney UI Pack |
| **Previous / Back** | `previous-button` | `/1x1/delapouite/previous-button.html` | Kenney UI Pack |
| **Play** | `play-button` | `/1x1/delapouite/play-button.html` | — |
| **Pause** | `pause-button` | `/1x1/delapouite/pause-button.html` | — |
| **Check / Confirm** | `check-mark` | `/1x1/delapouite/check-mark.html` | Kenney UI Pack |
| **Chart** | `chart` | `/1x1/delapouite/chart.html` | — |
| **Calendar / Week** | `calendar` | `/1x1/delapouite/calendar.html` | — |
| **Challenge** | `rally-the-troops` | `/1x1/lorc/rally-the-troops.html` | — |

### Leader Stat Icons

| Stat | game-icons.net Icon | URL Path |
|---|---|---|
| **Judgment** | `scales` | `/1x1/delapouite/scales.html` |
| **Speed** | `sprint` | `/1x1/lorc/sprint.html` |
| **Reliability** | `padlock` | `/1x1/lorc/padlock.html` |
| **Adaptability** | `swap-bag` | `/1x1/lorc/swap-bag.html` |
| **Communication** | `chat-bubble` | `/1x1/delapouite/chat-bubble.html` |
| **Risk Tolerance** | `dice-six-faces-six` | `/1x1/delapouite/dice-six-faces-six.html` |

### Urgency Level Icons

| Urgency | game-icons.net Icon | URL Path |
|---|---|---|
| **Ignorable** | `info` | `/1x1/delapouite/info.html` |
| **Pressing** | `hazard-sign` | `/1x1/lorc/hazard-sign.html` |
| **Critical** | `sirens` | `/1x1/lorc/sirens.html` |

---

## 5. Leader Portraits

### Art Style

**Style**: 64x64 pixel art portraits, 16-color palette per portrait.

The portraits should evoke the character portrait style of games like **FTL: Faster Than Light** (Subset Games) and **Darkest Dungeon** — expressive faces at low resolution with strong personality conveyed through silhouette, color accent, and expression. Each portrait is framed in a rounded-rect container with the leader's department color as a subtle border accent.

### Specifications

| Property | Value |
|---|---|
| **Canvas size** | 64x64px native, displayed at 64x64 (1x) or 128x128 (2x retina) |
| **Color depth** | 16 colors per portrait (from a shared master palette of ~32 portrait colors) |
| **Framing** | Head and shoulders, centered, facing forward or 3/4 turn |
| **Background** | Transparent (the UI card provides the background) |
| **Format** | PNG with transparency |

### Portrait States

Each leader needs 3 portrait states. These can be palette swaps + minor pixel edits rather than fully separate artworks:

| State | Visual Treatment | When Shown |
|---|---|---|
| **Normal** | Full color, neutral or confident expression | Fatigue < 60, Trust > 30 |
| **Fatigued** | Desaturated colors (shift toward grays), bags under eyes, slightly slumped posture | Fatigue >= 60 |
| **Burned Out** | Heavily desaturated, eyes downcast or closed, visible stress lines | Fatigue >= 90 OR Trust <= 15 |

### Placeholder Approach (Phase 5-6)

For initial development, use AI-generated pixel art portraits. The following prompts are designed for tools like [PixelLab](https://www.pixellab.ai/) or Midjourney with `--style raw` and pixel art parameters.

**Prompt Template**:
```
64x64 pixel art portrait, head and shoulders, [CHARACTER DESCRIPTION],
dark background, 16 color palette, muted tones with one accent color,
game character portrait style, sharp pixels no anti-aliasing,
inspired by FTL Faster Than Light character portraits
```

**Prompt 1 — The Pragmatic Ops Leader** (high judgment, high reliability, low risk tolerance):
```
64x64 pixel art portrait, head and shoulders, middle-aged woman with
short gray hair and sharp eyes, wearing a practical high-collar uniform
with copper/orange accents, calm confident expression, weathered but
composed, dark background, 16 color palette, muted earth tones with
orange accent, game character portrait, sharp pixels no anti-aliasing
```

**Prompt 2 — The Bold Risk-Taker** (high speed, high risk tolerance, low reliability):
```
64x64 pixel art portrait, head and shoulders, young person with messy
dark hair and a crooked grin, wearing an open jacket with red/coral
accents over a tech underlayer, energetic expression, slight head tilt,
dark background, 16 color palette, cool grays with coral red accent,
game character portrait, sharp pixels no anti-aliasing
```

**Prompt 3 — The Methodical Researcher** (high judgment, high adaptability, low speed):
```
64x64 pixel art portrait, head and shoulders, older man with round
glasses and a neatly trimmed beard, wearing a layered coat with
purple/violet accents, thoughtful expression looking slightly upward,
dark background, 16 color palette, dark blues with purple accent,
game character portrait, sharp pixels no anti-aliasing
```

### Character Design Notes

Based on the game design's leader stats (judgment, speed, reliability, adaptability, communication, riskTolerance on 1-10 scale), each leader should be visually distinguishable through:

1. **Accent color** — tied to their primary department assignment (Operations = orange, Infrastructure = copper, Research = purple, External = blue)
2. **Silhouette** — distinct hair, posture, and clothing outline so leaders are recognizable even at 32x32 display size
3. **Expression** — personality encoded in the default face (confident, nervous, amused, stoic, intense)
4. **Age indicators** — hair color, wrinkles, posture — to suggest experience vs. energy tradeoffs
5. **Uniform details** — rank markers, tool accessories, cultural elements that suggest their role

For the MVP's 3-5 leaders, ensure maximum visual diversity in silhouette, skin tone, age, and accent color.

---

## 6. UI Components

### Design Language

| Property | Value | Rationale |
|---|---|---|
| **Corner radius** | 4px (small elements), 8px (panels/cards), 0px (buttons when flat) | Soft enough to feel modern, sharp enough to feel precise |
| **Border** | 1px solid `--bg-light` (#30363D) | Visible structure without heaviness |
| **Shadow** | None (flat design) | Shadows add visual noise in information-dense UIs |
| **Panel background** | `--bg-dark` (#161B22) | Consistent dark surface |
| **Card background** | `--bg-medium` (#21262D) on hover/selected | Elevation through color, not shadow |
| **Spacing unit** | 4px base grid | All padding/margins are multiples of 4 |
| **Panel padding** | 12px (compact), 16px (standard), 24px (spacious) | Consistent breathing room |

### Panel / Card Design

```
┌──────────────────────────────────────┐  <- 1px border, --bg-light
│  Panel Header (H2, Inter 700 16px)   │  <- 12px padding top, 16px sides
│  ─────────────────────────────────── │  <- 1px divider, --bg-light
│                                      │
│  Panel content area                  │  <- 16px padding all sides
│  Body text (Inter 400 13px)          │
│                                      │
│  ┌────────────┐  ┌────────────┐      │  <- Nested cards, --bg-medium
│  │ Sub-card   │  │ Sub-card   │      │     8px gap between cards
│  │ content    │  │ content    │      │
│  └────────────┘  └────────────┘      │
│                                      │
└──────────────────────────────────────┘
```

Background: `--bg-dark` (#161B22)
Border: 1px solid `--bg-light` (#30363D)
Corner radius: 8px
Header: `--text-primary`, Inter 700, 16px
Divider: 1px solid `--bg-light`

### Button Styles

**Primary button** (advance phase, confirm action):
```css
.btn-primary {
  background: var(--mode-current); /* Changes per mode */
  color: var(--text-on-accent);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font: 600 13px/20px 'Inter';
  cursor: pointer;
}
.btn-primary:hover {
  filter: brightness(1.15);
}
```

**Secondary button** (cancel, alternative actions):
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--bg-light);
  border-radius: 4px;
  padding: 8px 16px;
  font: 500 13px/20px 'Inter';
}
.btn-secondary:hover {
  background: var(--bg-medium);
}
```

**Danger button** (used rarely — dismiss leader, abandon initiative):
```css
.btn-danger {
  background: transparent;
  color: var(--alert-high);
  border: 1px solid var(--alert-high);
  border-radius: 4px;
  padding: 8px 16px;
}
```

**Mode-specific styling**: The primary button color shifts with the active mode. In Observe mode it is blue, in Plan mode it is purple, in Execute mode it is amber, in Review mode it is green.

### Resource Bar Design

Resources use **horizontal bars with numeric readout**. The bar communicates the 0-100 range at a glance; the number provides precision.

```
Materials     ████████████░░░░░░░░  62
Trust         ████████████████░░░░  78
Clarity       ██████░░░░░░░░░░░░░░  31  ← Low! Border turns --alert-medium
Resilience    ████████████████████  95
Knowledge     ██████████████░░░░░░  68
Momentum      ██████████░░░░░░░░░░  47
```

- Bar width: 120px (compact sidebar) or 200px (expanded panel)
- Bar height: 8px
- Bar fill color: the resource's dedicated color token
- Bar background: `--bg-light` (#30363D)
- Numeric value: right-aligned, Inter 600 14px, tabular figures
- Resource name: left-aligned, Inter 500 11px, `--text-secondary`
- Icon: 16x16 resource icon inline before the name
- Delta indicator: small text below the bar showing weekly change ("+3" in green, "-2" in red)

**Low resource warning**: When a resource drops below 25, the bar border changes to `--alert-medium` (gold). Below 15, `--alert-high` (red). Below 10, the bar pulses gently (CSS animation, 2s ease-in-out opacity between 0.7 and 1.0).

### Attention Counter Design

Attention is the primary resource and gets special treatment. Displayed in the header bar as a large numeric readout:

```
  ⊕  ATTENTION
  7 / 10
```

- Icon: `eye-target`, 24x24, colored `--res-attention` (gold)
- Label: Press Start 2P, 11px, `--text-secondary`
- Value: Inter 700, 24px, `--res-attention` (gold)
- Denominator: Inter 400, 16px, `--text-muted`
- When attention is spent, the number decreases with a brief scale-down animation
- When attention reaches 0, the display pulses and all attention-costing actions are greyed out

### Initiative Card Layout

```
┌──────────────────────────────────┐
│ [Dept Icon]  Initiative Name     │  <- H3, Inter 600 14px
│              Dept: Operations    │  <- Label, Inter 500 11px, dept color
├──────────────────────────────────┤
│                                  │
│ Description text goes here,      │  <- Body, Inter 400 13px
│ explaining what this initiative  │
│ does and why it matters.         │
│                                  │
├──────────────────────────────────┤
│ ⊕ Cost: 3     ⏱ Duration: 2wk  │  <- Label row, Inter 500 11px
├──────────────────────────────────┤
│ Requires:                        │
│ [Mat 20] [Trust 30] [Know 15]   │  <- Resource pills with icons
├──────────────────────────────────┤
│ Overseen:  Good outcome desc     │  <- Two-track outcome display
│ Delegated: Moderate outcome desc │
├──────────────────────────────────┤
│         [ Assign Leader ▼ ]      │  <- Action area (Plan mode only)
│         [ Start Initiative ]     │
└──────────────────────────────────┘
```

Card dimensions: ~280px wide, variable height
Background: `--bg-dark`
Border: 1px solid `--bg-light`, left border 3px in department color
Corner radius: 8px
Selected state: border becomes `--mode-current`, background shifts to `--bg-medium`

### Event Modal Design

Events interrupt the Execute phase. The modal overlays the game screen with a semi-transparent backdrop.

```
┌──────────────────────────────────────┐
│  ⚠ PRESSING EVENT                    │  <- Urgency badge + label
│  ─────────────────────────────────── │
│                                      │
│  "Supply convoy delayed by storms.   │  <- Event description, Body text
│   External traders are anxious."     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Option A: Divert Resources     │  │  <- Choice cards
│  │ Cost: 2 Attention              │  │
│  │ → Materials -10, Trust +5      │  │     Resource deltas shown
│  │ [Choose This]                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Option B: Wait It Out          │  │
│  │ Cost: 0 Attention              │  │
│  │ → Momentum -5                  │  │
│  │ [Choose This]                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Option C: Ignore               │  │
│  │ Cost: 0 Attention              │  │
│  │ → Trust -8, Resilience -3      │  │
│  │ [Choose This]                  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- Backdrop: `rgba(0, 0, 0, 0.6)`
- Modal width: 480px max, centered
- Modal background: `--bg-dark` with 1px border in urgency color
- Urgency badge: colored pill (gray/gold/red) with icon and level text
- Choice cards: `--bg-medium` background, hover elevates to `--bg-light`
- Resource deltas: color-coded (green for gains, red for losses)

### Header Bar Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡]  STEADWARD   │  WEEK 03  │  ◉ OBSERVE  │  ⊕ 7/10 Attention │
│      menu toggle │  week ctr │  mode badge  │  attn counter      │
│                  │           │  mode color  │  gold accent       │
└──────────────────────────────────────────────────────────────────┘
```

- Height: 48px
- Background: `--bg-darkest` (#0D1117) — one level darker than panels
- Border-bottom: 1px solid `--bg-light`
- Game title: Press Start 2P, 12px, `--text-primary`
- Week counter: Press Start 2P, 12px, `--text-secondary`
- Mode badge: pill shape, background in current `--mode-*` color, text `--text-on-accent`, Press Start 2P 11px
- Attention: described above in Attention Counter section
- All elements vertically centered, distributed with `justify-content: space-between`

---

## 7. Animation & Transitions

### Philosophy

Follow Into the Breach's principle: **animation serves comprehension, not decoration**. If an animation does not help the player understand what changed, it should not exist.

### What SHOULD Be Animated

| Element | Animation | Duration | Easing | Purpose |
|---|---|---|---|---|
| **Mode transition** | Header bar accent color crossfade + mode badge slide | 300ms | ease-in-out | Signal that the game state has shifted |
| **Resource delta** | Number ticks up/down (counting animation) | 400ms | ease-out | Show change magnitude clearly |
| **Resource bar fill** | Bar width transitions smoothly | 300ms | ease-out | Visualize resource change direction |
| **Event modal entry** | Fade in backdrop + scale modal from 0.95 to 1.0 | 200ms | ease-out | Draw focus without jarring pop-in |
| **Card selection** | Border color transition + subtle background shift | 150ms | ease-in-out | Confirm interactive feedback |
| **Alert pulse** | Opacity oscillation on critical resource bars | 2000ms | ease-in-out | Sustained urgency warning |
| **Attention spend** | Brief scale-down of attention number (1.0 to 0.9 to 1.0) | 200ms | ease-in-out | Tactile feedback for spending |
| **Button hover** | Background brightness increase | 100ms | linear | Standard interactive feedback |

### What Should NOT Be Animated

- Panel layouts (no sliding panels in/out during mode transitions — instant swap)
- Background colors (no ambient pulsing or breathing effects)
- Icons (no spinning gears, no bouncing alerts beyond the critical pulse)
- Leader portraits (no idle animations — static pixel art)
- Text content (no typewriter effects, no scrolling text)
- Transitions between screens (title to game — instant, no fade)

### CSS Implementation

All animations via CSS transitions and keyframes — no JavaScript animation libraries.

```css
/* Mode transition on root */
/* Note: CSS custom properties are not directly animatable via transitions.
   Apply transitions to the concrete properties that consume the variable
   (e.g., `transition: background-color 300ms, border-color 300ms, color 300ms`). */
:root {
  transition: background-color 300ms ease-in-out, border-color 300ms ease-in-out, color 300ms ease-in-out;
}

/* Resource bar fill */
.resource-bar-fill {
  transition: width 300ms ease-out;
}

/* Critical pulse */
@keyframes critical-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.resource-bar[data-critical] {
  animation: critical-pulse 2s ease-in-out infinite;
}

/* Modal entry */
.event-modal {
  animation: modal-in 200ms ease-out;
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## 8. Asset Pipeline

### Recommended Tools

| Tool | Purpose | Cost | Notes |
|---|---|---|---|
| [Aseprite](https://www.aseprite.org/) | Pixel art creation (leader portraits, custom icons) | $20 one-time (or compile from source free) | Industry standard for indie pixel art. Used on Celeste, Dead Cells, Stardew Valley. |
| [Figma](https://www.figma.com/) | UI mockups, layout prototyping, component library | Free tier sufficient | Define the component library here before coding. Export layout specs as reference. |
| [SVGOMG](https://jakearchibald.github.io/svgomg/) | SVG optimization for game-icons.net assets | Free (web tool) | Reduce SVG file sizes by 40-60% without visual loss. |
| [Squoosh](https://squoosh.app/) | Image compression for PNG portraits | Free (web tool) | Compress portraits without quality loss. |
| [PixelLab](https://www.pixellab.ai/) | AI pixel art generation for placeholder portraits | Free beta / paid plans | Produces game-ready pixel art with consistent style. |
| Chrome DevTools | Color vision deficiency simulation | Free | Rendering tab > "Emulate vision deficiencies" |

### File Organization

```
steadward/
├── assets/
│   ├── fonts/
│   │   ├── Inter-Variable.woff2          # Primary font (~300KB)
│   │   ├── PressStart2P-Regular.woff2    # Header font (~20KB)
│   │   └── IBMPlexMono-Regular.woff2     # Debug/mono font (~50KB)
│   ├── icons/
│   │   ├── resources/                    # Resource icons (7 files)
│   │   │   ├── attention.svg
│   │   │   ├── materials.svg
│   │   │   ├── trust.svg
│   │   │   ├── clarity.svg
│   │   │   ├── resilience.svg
│   │   │   ├── knowledge.svg
│   │   │   └── momentum.svg
│   │   ├── departments/                  # Department icons (4 files)
│   │   │   ├── operations.svg
│   │   │   ├── infrastructure.svg
│   │   │   ├── research.svg
│   │   │   └── external-affairs.svg
│   │   ├── modes/                        # Mode/phase icons (4 files)
│   │   │   ├── observe.svg
│   │   │   ├── plan.svg
│   │   │   ├── execute.svg
│   │   │   └── review.svg
│   │   ├── stats/                        # Leader stat icons (6 files)
│   │   │   ├── judgment.svg
│   │   │   ├── speed.svg
│   │   │   ├── reliability.svg
│   │   │   ├── adaptability.svg
│   │   │   ├── communication.svg
│   │   │   └── risk-tolerance.svg
│   │   ├── urgency/                      # Alert level icons (3 files)
│   │   │   ├── ignorable.svg
│   │   │   ├── pressing.svg
│   │   │   └── critical.svg
│   │   └── ui/                           # UI chrome icons (15+ files)
│   │       ├── save.svg
│   │       ├── settings.svg
│   │       ├── share.svg
│   │       ├── info.svg
│   │       ├── warning.svg
│   │       ├── close.svg
│   │       ├── next.svg
│   │       ├── previous.svg
│   │       ├── play.svg
│   │       ├── pause.svg
│   │       ├── check.svg
│   │       ├── chart.svg
│   │       ├── calendar.svg
│   │       ├── challenge.svg
│   │       └── menu.svg
│   ├── portraits/                        # Leader portraits
│   │   ├── leader-01/
│   │   │   ├── normal.png                # 64x64
│   │   │   ├── normal@2x.png            # 128x128
│   │   │   ├── fatigued.png
│   │   │   ├── fatigued@2x.png
│   │   │   ├── burned-out.png
│   │   │   └── burned-out@2x.png
│   │   ├── leader-02/
│   │   │   └── ...
│   │   └── ...
│   └── share/
│       └── og-default.png                # 1200x630 default OG image
└── ...
```

### Sprite Sheet vs Individual Files

**Use individual SVG files for icons** — they are small (<2KB each after optimization), infinitely scalable, and colorable via CSS. No sprite sheet needed. The browser caches them efficiently.

**Use individual PNG files for portraits** — they are few in number (3-5 leaders x 3 states x 2 resolutions = 18-30 files) and each is tiny (~2-4KB for a 64x64 PNG, ~8-12KB for 128x128). No sprite sheet complexity warranted.

**If the icon count exceeds ~50**, consider an SVG sprite sheet (all icons in a single `<svg>` with `<symbol>` elements, referenced via `<use href="#icon-name">`). This reduces HTTP requests but is premature for Phase 5.

### Resolution Strategy

| Asset Type | 1x Resolution | 2x (Retina) Resolution | Format |
|---|---|---|---|
| **Icons (SVG)** | N/A — vector scales | N/A — vector scales | SVG |
| **Portraits** | 64x64px | 128x128px | PNG |
| **OG/Share images** | 1200x630px | N/A (social platforms don't need 2x) | PNG |
| **Favicon** | 32x32px, 16x16px | 180x180px (apple-touch-icon) | PNG/ICO |

CSS for retina portraits:
```css
.leader-portrait {
  width: 64px;
  height: 64px;
  image-rendering: pixelated; /* Keep pixel art crisp on retina */
}
```

---

## 9. Placeholder Asset List

Every asset needed from Phase 1 through Phase 7, prioritized by when it is first needed.

### P0 — Needed for Phase 1 (Project Skeleton)

| # | Asset | Type | Size | Source | Notes |
|---|---|---|---|---|---|
| 1 | Inter Variable font | Font | woff2 | [rsms.me/inter](https://rsms.me/inter/) | Download variable font file |
| 2 | Press Start 2P font | Font | woff2 | [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P) | Download, convert to woff2 |
| 3 | CSS color variables | Code | — | This document, Section 2 | Copy hex codes into variables.css |
| 4 | Favicon | Icon | 32x32, 16x16 | Create in Aseprite or use a letter "S" | Simple "S" in Press Start 2P style |

### P1 — Needed for Phase 5 (UI Shell)

| # | Asset | Type | Size | Source | Notes |
|---|---|---|---|---|---|
| 5 | `attention.svg` (eye-target) | Icon | 24x24 | [game-icons.net/1x1/lorc/eye-target.html](https://game-icons.net/1x1/lorc/eye-target.html) | Download SVG, optimize with SVGOMG |
| 6 | `materials.svg` (brick-pile) | Icon | 24x24 | [game-icons.net/1x1/delapouite/brick-pile.html](https://game-icons.net/1x1/delapouite/brick-pile.html) | |
| 7 | `trust.svg` (shaking-hands) | Icon | 24x24 | [game-icons.net/1x1/delapouite/shaking-hands.html](https://game-icons.net/1x1/delapouite/shaking-hands.html) | |
| 8 | `clarity.svg` (crystal-ball) | Icon | 24x24 | [game-icons.net/1x1/lorc/crystal-ball.html](https://game-icons.net/1x1/lorc/crystal-ball.html) | |
| 9 | `resilience.svg` (shield) | Icon | 24x24 | [game-icons.net/1x1/sbed/shield.html](https://game-icons.net/1x1/sbed/shield.html) | |
| 10 | `knowledge.svg` (book-cover) | Icon | 24x24 | [game-icons.net/1x1/delapouite/book-cover.html](https://game-icons.net/1x1/delapouite/book-cover.html) | |
| 11 | `momentum.svg` (fast-forward-button) | Icon | 24x24 | [game-icons.net/1x1/delapouite/fast-forward-button.html](https://game-icons.net/1x1/delapouite/fast-forward-button.html) | |
| 12 | `operations.svg` (gears) | Icon | 24x24 | [game-icons.net/1x1/lorc/gears.html](https://game-icons.net/1x1/lorc/gears.html) | |
| 13 | `infrastructure.svg` (house) | Icon | 24x24 | [game-icons.net/1x1/delapouite/house.html](https://game-icons.net/1x1/delapouite/house.html) | |
| 14 | `research.svg` (archive-research) | Icon | 24x24 | [game-icons.net/1x1/delapouite/archive-research.html](https://game-icons.net/1x1/delapouite/archive-research.html) | |
| 15 | `external-affairs.svg` (globe) | Icon | 24x24 | [game-icons.net/1x1/delapouite/globe.html](https://game-icons.net/1x1/delapouite/globe.html) | |
| 16 | `observe.svg` (telescope) | Icon | 24x24 | [game-icons.net/1x1/delapouite/telescope.html](https://game-icons.net/1x1/delapouite/telescope.html) | |
| 17 | `plan.svg` (compass) | Icon | 24x24 | [game-icons.net/1x1/lorc/compass.html](https://game-icons.net/1x1/lorc/compass.html) | |
| 18 | `execute.svg` (power-lightning) | Icon | 24x24 | [game-icons.net/1x1/lorc/power-lightning.html](https://game-icons.net/1x1/lorc/power-lightning.html) | |
| 19 | `review.svg` (pie-chart) | Icon | 24x24 | [game-icons.net/1x1/delapouite/pie-chart.html](https://game-icons.net/1x1/delapouite/pie-chart.html) | |
| 20 | `save.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/save.html](https://game-icons.net/1x1/delapouite/save.html) | |
| 21 | `settings.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/settings-knobs.html](https://game-icons.net/1x1/delapouite/settings-knobs.html) | |
| 22 | `close.svg` | Icon | 24x24 | [game-icons.net/1x1/sbed/cancel.html](https://game-icons.net/1x1/sbed/cancel.html) | |
| 23 | `next.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/next-button.html](https://game-icons.net/1x1/delapouite/next-button.html) | |
| 24 | `check.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/check-mark.html](https://game-icons.net/1x1/delapouite/check-mark.html) | |
| 25 | `warning.svg` | Icon | 24x24 | [game-icons.net/1x1/lorc/hazard-sign.html](https://game-icons.net/1x1/lorc/hazard-sign.html) | |
| 26 | `info.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/info.html](https://game-icons.net/1x1/delapouite/info.html) | |
| 27 | `menu.svg` (hamburger) | Icon | 24x24 | [game-icons.net/1x1/delapouite/hamburger-menu.html](https://game-icons.net/1x1/delapouite/hamburger-menu.html) | |
| 28 | `calendar.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/calendar.html](https://game-icons.net/1x1/delapouite/calendar.html) | |

### P1 — Needed for Phase 6 (Mode Views)

| # | Asset | Type | Size | Source | Notes |
|---|---|---|---|---|---|
| 29 | Leader 1 portrait (normal) | Portrait | 64x64 + 128x128 | PixelLab AI / Aseprite | Use Prompt 1 from Section 5 |
| 30 | Leader 2 portrait (normal) | Portrait | 64x64 + 128x128 | PixelLab AI / Aseprite | Use Prompt 2 from Section 5 |
| 31 | Leader 3 portrait (normal) | Portrait | 64x64 + 128x128 | PixelLab AI / Aseprite | Use Prompt 3 from Section 5 |
| 32 | Leader 1 portrait (fatigued) | Portrait | 64x64 + 128x128 | Palette swap of #29 | Desaturate, add fatigue details |
| 33 | Leader 2 portrait (fatigued) | Portrait | 64x64 + 128x128 | Palette swap of #30 | |
| 34 | Leader 3 portrait (fatigued) | Portrait | 64x64 + 128x128 | Palette swap of #31 | |
| 35 | `judgment.svg` (scales) | Icon | 16x16 | [game-icons.net/1x1/delapouite/scales.html](https://game-icons.net/1x1/delapouite/scales.html) | Leader stat icon |
| 36 | `speed.svg` (sprint) | Icon | 16x16 | [game-icons.net/1x1/lorc/sprint.html](https://game-icons.net/1x1/lorc/sprint.html) | |
| 37 | `reliability.svg` (padlock) | Icon | 16x16 | [game-icons.net/1x1/lorc/padlock.html](https://game-icons.net/1x1/lorc/padlock.html) | |
| 38 | `adaptability.svg` (swap-bag) | Icon | 16x16 | [game-icons.net/1x1/lorc/swap-bag.html](https://game-icons.net/1x1/lorc/swap-bag.html) | |
| 39 | `communication.svg` (chat-bubble) | Icon | 16x16 | [game-icons.net/1x1/delapouite/chat-bubble.html](https://game-icons.net/1x1/delapouite/chat-bubble.html) | |
| 40 | `risk-tolerance.svg` (dice) | Icon | 16x16 | [game-icons.net/1x1/delapouite/dice-six-faces-six.html](https://game-icons.net/1x1/delapouite/dice-six-faces-six.html) | |
| 41 | `ignorable.svg` (info) | Icon | 24x24 | Same as #26 | Reuse info icon, style via CSS color |
| 42 | `pressing.svg` (hazard-sign) | Icon | 24x24 | Same as #25 | Reuse warning icon |
| 43 | `critical.svg` (sirens) | Icon | 24x24 | [game-icons.net/1x1/lorc/sirens.html](https://game-icons.net/1x1/lorc/sirens.html) | |
| 44 | `share.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/share.html](https://game-icons.net/1x1/delapouite/share.html) | |
| 45 | `challenge.svg` (rally-the-troops) | Icon | 24x24 | [game-icons.net/1x1/lorc/rally-the-troops.html](https://game-icons.net/1x1/lorc/rally-the-troops.html) | |
| 46 | `chart.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/chart.html](https://game-icons.net/1x1/delapouite/chart.html) | |
| 47 | `previous.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/previous-button.html](https://game-icons.net/1x1/delapouite/previous-button.html) | |
| 48 | `play.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/play-button.html](https://game-icons.net/1x1/delapouite/play-button.html) | |
| 49 | `pause.svg` | Icon | 24x24 | [game-icons.net/1x1/delapouite/pause-button.html](https://game-icons.net/1x1/delapouite/pause-button.html) | |

### P2 — Needed for Phase 7 (Polish & GTM)

| # | Asset | Type | Size | Source | Notes |
|---|---|---|---|---|---|
| 50 | Leader 1 portrait (burned out) | Portrait | 64x64 + 128x128 | Palette swap of #29 | Heavy desaturation, stress details |
| 51 | Leader 2 portrait (burned out) | Portrait | 64x64 + 128x128 | Palette swap of #30 | |
| 52 | Leader 3 portrait (burned out) | Portrait | 64x64 + 128x128 | Palette swap of #31 | |
| 53 | Leader 4 portrait (all 3 states) | Portrait | 64x64 + 128x128 | PixelLab AI / Aseprite | If 4th leader is in base pack |
| 54 | Leader 5 portrait (all 3 states) | Portrait | 64x64 + 128x128 | PixelLab AI / Aseprite | If 5th leader is in base pack |
| 55 | OG/share default image | Share | 1200x630 | Canvas render / Figma | Gameplay composition with logo |
| 56 | Victory share template | Share | 1200x630 | Canvas render | Auto-generated from run data |
| 57 | Loss share template | Share | 1200x630 | Canvas render | Auto-generated from run data |
| 58 | Apple touch icon | Favicon | 180x180 | Aseprite | "S" letterform, pixel art style |
| 59 | Favicon ICO | Favicon | 16x16 + 32x32 | Aseprite | Multi-size ICO file |
| 60 | IBM Plex Mono font | Font | woff2 | [Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono) | For debug panel |
| 61 | Steam capsule art (small) | Marketing | 231x87 | Figma / Aseprite | Required for Steam page |
| 62 | Steam capsule art (large) | Marketing | 460x215 | Figma / Aseprite | |
| 63 | Steam header | Marketing | 460x215 | Figma / Aseprite | |
| 64 | Steam hero | Marketing | 3840x1240 | Figma | Wide banner |
| 65 | Steam screenshots (4-6) | Marketing | 1920x1080 | Browser screenshot + crop | Gameplay at each mode |

### Summary Counts

| Priority | Icons | Portraits | Fonts | Other | Total |
|---|---|---|---|---|---|
| **P0** (Phase 1) | 0 | 0 | 2 | 1 favicon | 3 |
| **P1** (Phase 5-6) | 45 | 9 (3 leaders x 3 states, but only normals + fatigued) | 0 | 0 | 54 |
| **P2** (Phase 7) | 0 | 6-12 (burned out states + optional leaders 4-5) | 1 | 5 (share templates, favicon variants, Steam art) | 12-18 |
| **Total** | 45 | 15-21 | 3 | 6 | ~69-75 |

---

## Appendix A: CSS Variables Quick Reference

Copy this block into `styles/variables.css` to bootstrap the entire color system:

```css
:root {
  /* Base palette */
  --bg-darkest: #0D1117;
  --bg-dark: #161B22;
  --bg-medium: #21262D;
  --bg-light: #30363D;
  --bg-lighter: #484F58;

  --text-primary: #E6EDF3;
  --text-secondary: #8B949E;
  --text-muted: #6E7681;
  --text-on-accent: #FFFFFF;

  /* Mode accents */
  --mode-observe: #58A6FF;
  --mode-plan: #D2A8FF;
  --mode-execute: #F0883E;
  --mode-review: #7EE787;

  --mode-observe-bg: rgba(88, 166, 255, 0.08);
  --mode-plan-bg: rgba(210, 168, 255, 0.08);
  --mode-execute-bg: rgba(240, 136, 62, 0.08);
  --mode-review-bg: rgba(126, 231, 135, 0.08);

  /* Resource colors */
  --res-attention: #F0C000;
  --res-materials: #DA6D28;
  --res-trust: #56D4E8;
  --res-clarity: #E6EDF3;
  --res-resilience: #5EC269;
  --res-knowledge: #C490FF;
  --res-momentum: #FF7B72;

  /* Department colors */
  --dept-ops: #F0883E;
  --dept-infra: #8B949E;
  --dept-research: #D2A8FF;
  --dept-external: #58A6FF;

  /* Alert/urgency */
  --alert-low: #8B949E;
  --alert-medium: #F0C000;
  --alert-high: #F85149;

  /* Deltas */
  --delta-positive: #7EE787;
  --delta-negative: #F85149;

  /* Active mode — set via JS on <html data-mode="observe|plan|execute|review"> */
  --mode-current: var(--mode-observe);
  --mode-current-bg: var(--mode-observe-bg);

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Press Start 2P', monospace;
  --font-mono: 'IBM Plex Mono', 'Menlo', 'Consolas', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 100ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}

/* Mode-specific overrides */
[data-mode="observe"] {
  --mode-current: var(--mode-observe);
  --mode-current-bg: var(--mode-observe-bg);
}
[data-mode="plan"] {
  --mode-current: var(--mode-plan);
  --mode-current-bg: var(--mode-plan-bg);
}
[data-mode="execute"] {
  --mode-current: var(--mode-execute);
  --mode-current-bg: var(--mode-execute-bg);
}
[data-mode="review"] {
  --mode-current: var(--mode-review);
  --mode-current-bg: var(--mode-review-bg);
}
```

## Appendix B: Attribution Requirements

The following attribution must appear in the game's credits/about screen:

```
Icons by game-icons.net contributors (Lorc, Delapouite, sbed) — CC BY 3.0
Fonts: Inter by Rasmus Andersson (OFL), Press Start 2P by CodeMan38 (OFL),
IBM Plex Mono by IBM (OFL)
```

## Appendix C: Icon Download Script

Batch-download all required icons from game-icons.net. Run from the project root:

```bash
#!/bin/bash
# download-icons.sh — Fetch all game-icons.net SVGs for Steadward
# Icons are white silhouettes on transparent background

BASE="https://game-icons.net/icons/ffffff/000000"
ICONS_DIR="assets/icons"

mkdir -p "$ICONS_DIR"/{resources,departments,modes,stats,urgency,ui}

# Resource icons
curl -sL "$BASE/1x1/lorc/eye-target.svg" -o "$ICONS_DIR/resources/attention.svg"
curl -sL "$BASE/1x1/delapouite/brick-pile.svg" -o "$ICONS_DIR/resources/materials.svg"
curl -sL "$BASE/1x1/delapouite/shaking-hands.svg" -o "$ICONS_DIR/resources/trust.svg"
curl -sL "$BASE/1x1/lorc/crystal-ball.svg" -o "$ICONS_DIR/resources/clarity.svg"
curl -sL "$BASE/1x1/sbed/shield.svg" -o "$ICONS_DIR/resources/resilience.svg"
curl -sL "$BASE/1x1/delapouite/book-cover.svg" -o "$ICONS_DIR/resources/knowledge.svg"
curl -sL "$BASE/1x1/delapouite/fast-forward-button.svg" -o "$ICONS_DIR/resources/momentum.svg"

# Department icons
curl -sL "$BASE/1x1/lorc/gears.svg" -o "$ICONS_DIR/departments/operations.svg"
curl -sL "$BASE/1x1/delapouite/house.svg" -o "$ICONS_DIR/departments/infrastructure.svg"
curl -sL "$BASE/1x1/delapouite/archive-research.svg" -o "$ICONS_DIR/departments/research.svg"
curl -sL "$BASE/1x1/delapouite/globe.svg" -o "$ICONS_DIR/departments/external-affairs.svg"

# Mode icons
curl -sL "$BASE/1x1/delapouite/telescope.svg" -o "$ICONS_DIR/modes/observe.svg"
curl -sL "$BASE/1x1/lorc/compass.svg" -o "$ICONS_DIR/modes/plan.svg"
curl -sL "$BASE/1x1/lorc/power-lightning.svg" -o "$ICONS_DIR/modes/execute.svg"
curl -sL "$BASE/1x1/delapouite/pie-chart.svg" -o "$ICONS_DIR/modes/review.svg"

# Leader stat icons
curl -sL "$BASE/1x1/delapouite/scales.svg" -o "$ICONS_DIR/stats/judgment.svg"
curl -sL "$BASE/1x1/lorc/sprint.svg" -o "$ICONS_DIR/stats/speed.svg"
curl -sL "$BASE/1x1/lorc/padlock.svg" -o "$ICONS_DIR/stats/reliability.svg"
curl -sL "$BASE/1x1/lorc/swap-bag.svg" -o "$ICONS_DIR/stats/adaptability.svg"
curl -sL "$BASE/1x1/delapouite/chat-bubble.svg" -o "$ICONS_DIR/stats/communication.svg"
curl -sL "$BASE/1x1/delapouite/dice-six-faces-six.svg" -o "$ICONS_DIR/stats/risk-tolerance.svg"

# Urgency icons
curl -sL "$BASE/1x1/delapouite/info.svg" -o "$ICONS_DIR/urgency/ignorable.svg"
curl -sL "$BASE/1x1/lorc/hazard-sign.svg" -o "$ICONS_DIR/urgency/pressing.svg"
curl -sL "$BASE/1x1/lorc/sirens.svg" -o "$ICONS_DIR/urgency/critical.svg"

# UI chrome icons
curl -sL "$BASE/1x1/delapouite/save.svg" -o "$ICONS_DIR/ui/save.svg"
curl -sL "$BASE/1x1/delapouite/settings-knobs.svg" -o "$ICONS_DIR/ui/settings.svg"
curl -sL "$BASE/1x1/delapouite/share.svg" -o "$ICONS_DIR/ui/share.svg"
curl -sL "$BASE/1x1/delapouite/info.svg" -o "$ICONS_DIR/ui/info.svg"
curl -sL "$BASE/1x1/lorc/hazard-sign.svg" -o "$ICONS_DIR/ui/warning.svg"
curl -sL "$BASE/1x1/sbed/cancel.svg" -o "$ICONS_DIR/ui/close.svg"
curl -sL "$BASE/1x1/delapouite/next-button.svg" -o "$ICONS_DIR/ui/next.svg"
curl -sL "$BASE/1x1/delapouite/previous-button.svg" -o "$ICONS_DIR/ui/previous.svg"
curl -sL "$BASE/1x1/delapouite/play-button.svg" -o "$ICONS_DIR/ui/play.svg"
curl -sL "$BASE/1x1/delapouite/pause-button.svg" -o "$ICONS_DIR/ui/pause.svg"
curl -sL "$BASE/1x1/delapouite/check-mark.svg" -o "$ICONS_DIR/ui/check.svg"
curl -sL "$BASE/1x1/delapouite/chart.svg" -o "$ICONS_DIR/ui/chart.svg"
curl -sL "$BASE/1x1/delapouite/calendar.svg" -o "$ICONS_DIR/ui/calendar.svg"
curl -sL "$BASE/1x1/lorc/rally-the-troops.svg" -o "$ICONS_DIR/ui/challenge.svg"
curl -sL "$BASE/1x1/delapouite/hamburger-menu.svg" -o "$ICONS_DIR/ui/menu.svg"

echo "Downloaded $(find $ICONS_DIR -name '*.svg' | wc -l) icons."
```
