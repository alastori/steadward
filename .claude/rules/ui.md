---
paths:
  - "src/ui/**"
  - "styles/**"
---

# UI Rules

## Architecture
- UI is a pure projection of GameState — same state = same DOM
- UI dispatches actions to the store, never mutates state directly
- UI subscribes to store changes and re-renders affected components

## Interaction Model
- Click-to-select only. NO drag-and-drop.
- Button labels use Title Case: "Confirm Plan", "Begin Week 4", "Advance to Review"
- Confirmation required for: Plan → Execute (show plan summary), Review → next week
- Undo is allowed within a phase but not across phases

## Color System (from art-direction.md)
- Background: `#0D1117` (darkest), `#161B22` (dark), `#21262D` (medium)
- Text: `#C9D1D9` (primary), `#8B949E` (secondary), `#484F58` (muted)
- Mode accents: Observe `#58A6FF`, Plan `#D2A8FF`, Execute `#F0883E`, Review `#7EE787`
- Resource colors: Materials `#F0883E`, Trust `#56D4E8`, Clarity `#58A6FF`, Resilience `#5EC269`, Knowledge `#C490FF`, Momentum `#FFD666`
- Department colors: Ops `#F0883E`, Infra `#8B949E`, Research `#D2A8FF`, External `#58A6FF`
- Alerts: Low `#FFD666`, Medium `#F0883E`, High `#F85149`

## Typography
- Primary: Inter (body, numbers — use tabular figures for resource counts)
- Display: Press Start 2P (headers, game title)
- Monospace: IBM Plex Mono (debug panel only)
- Minimum font size: 11px (for stream readability)

## Accessibility (WCAG 2.1 AA)
- Never rely on color alone — always pair with icon, border, or text
- All interactive elements must be keyboard-navigable
- ARIA live regions for resource changes and event alerts
- Support `data-high-contrast`, `data-reduced-motion`, `data-streamer-mode` attributes
- No essential information in hover-only tooltips

## Resource Bars
- Warning thresholds: 25 (caution/gold), 15 (danger/orange), 10 (critical/red+pulse)
- Attention displayed as segmented bar in header (10 discrete segments)

## Screens
- `outcome-screen.ts` handles both victory AND loss
- `demo-wall-screen.ts` includes email capture + purchase CTA
