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

## Visual Constants
- For exact color hex values, typography specs, and spacing: use the `/color-palette` skill
- Mode accents applied via `data-mode` attribute on `<html>` + `@property --mode-current`
- All CSS tokens defined in `styles/variables.css`

## Typography
- Primary: Inter (body, numbers — use `font-variant-numeric: tabular-nums` for resource counts)
- Display: Press Start 2P (headers, mode labels, game title)
- Monospace: IBM Plex Mono (debug panel, seed display)
- Minimum font size: 11px (for stream readability)

## Accessibility (WCAG 2.1 AA)
- Never rely on color alone — always pair with icon, border, or text
- All interactive elements must be keyboard-navigable
- ARIA live regions for resource changes and event alerts
- Respect `prefers-reduced-motion` media query
- No essential information in hover-only tooltips

## Resource Bars
- Warning thresholds: 25 (caution), 15 (danger/red styling)
- Attention displayed in header with remaining/budget format

## Screens
- `outcome-screen.ts` handles both victory AND loss
- `demo-wall-screen.ts` includes email capture + share + play again
- `briefing-screen.ts` handles the 3-screen onboarding sequence
