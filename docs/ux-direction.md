# Steadward — UX Direction

**Author**: UX Design
**Date**: 2026-03-14
**Status**: Draft v1
**Prerequisite reading**: [Game Design](game-design.md), [Art Direction](art-direction.md)

---

## Table of Contents

1. [UX Philosophy](#1-ux-philosophy)
2. [Information Architecture](#2-information-architecture)
3. [Player Flow](#3-player-flow)
4. [Onboarding Design](#4-onboarding-design)
5. [Layout Specifications](#5-layout-specifications)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Accessibility](#7-accessibility)
8. [Error States & Edge Cases](#8-error-states--edge-cases)
9. [Streamer & Spectator UX](#9-streamer--spectator-ux)
10. [Localization](#10-localization)

---

## 1. UX Philosophy

### Core Principles

**Principle 1: Show the Consequence, Not the Mechanic**

Into the Breach's defining UX insight is that showing *what will happen* is more powerful than explaining *how things work*. Steadward applies this everywhere: when a player hovers an initiative card during Plan, the resource panel previews the cost by dimming the affected bars. When a leader is assigned, their fatigue projection appears next to their current fatigue. The UI answers "what happens if I do this?" before the player asks.

This principle is borrowed directly from Justin Ma's GDC 2019 talk: "Sacrifice cool ideas for the sake of clarity every time." If a feature cannot be shown clearly, it does not ship.

**Principle 2: The Screen IS the Game World**

Steadward has no map, no grid, no animated characters. The dashboard *is* the settlement. Resource bars are the frontier's pulse. Leader portraits are the people. Department panels are the buildings. This means every UI element carries double duty — it is both interface chrome and game world representation. Nothing on screen is "just UI." The resource panel is not a HUD overlaying the game; it is the game.

This creates an unusual design constraint: the UI cannot feel like a skin over a data layer. It must feel like a place. The mode color shifts (blue Observe, purple Plan, amber Execute, green Review) are the closest Steadward gets to environmental storytelling — they are the weather of the settlement.

**Principle 3: Attention is Spatial, Not Just Numerical**

The player's attention budget (10 points/week) is the game's defining resource, and the UX must make attention *feel* finite. Every attention cost appears inline at the point of decision — on initiative cards, on event choices, on leader assignments. The attention counter in the header depletes visually as decisions are committed. The player should always be able to glance at the header and understand "I have 3 points left. That event costs 2. I can only handle one more thing."

Slay the Spire's energy orbs achieve this for card costs — the current energy is always visible, card costs are always on the card, and the subtraction is immediate and tactile. Steadward's attention counter follows this model exactly.

**Principle 4: Every Phase Has One Job for the Player's Eyes**

Information overload in strategy games happens when everything is shown with equal visual weight. Steadward prevents this by changing what is *emphasized* per mode, not what is *visible*. In Observe, resource trends and department health are emphasized; initiative cards are visible but muted. In Plan, initiative cards and leader assignments are emphasized; resource bars are visible but secondary. The same information is on screen across all modes, but the visual hierarchy rotates.

This is the dashboard UX principle of "progressive emphasis" — the data does not change, but the spotlight does.

**Principle 5: Reversibility Reduces Anxiety**

Turn-based games with finite resources create decision paralysis. Steadward mitigates this by making Plan phase decisions freely reversible — assignments can be undone, initiatives can be unselected, attention allocations can be reshuffled — until the player explicitly confirms their plan. Execute phase is irreversible (events happen, outcomes resolve), but the player entered it by choice. The UX clearly distinguishes "drafting" (safe) from "committed" (permanent) through visual state.

### What Makes Steadward's UX Unique

Most strategy games present a world and overlay a UI on top of it. Steadward inverts this: the UI *is* the world. This means:

- **No minimap, no fog of war, no terrain** — the cognitive load budget goes entirely toward systems comprehension
- **Mode color shifts** are environmental storytelling — the settlement "feels different" in each phase
- **Information density is a feature, not a problem** — the target player enjoys dashboards, spreadsheets, and systems thinking. The UX should respect this by making density *legible*, not reducing it

The closest reference is not another game — it is a well-designed trading terminal or analytics dashboard, but one that tells a story about people and places.

### The Complexity-Clarity Tension

Steadward has 6 resources, 4 departments, 3-5 leaders with 6 stats each, an attention budget, initiative cards with dual outcome tracks, and interruption events with 2-3 branching choices. This is a lot.

The resolution is **layered reading depth**:

| Layer | What the Player Sees | How |
|---|---|---|
| **Glance (0.5s)** | Mode color, attention remaining, any red/critical alerts | Header bar, color coding, pulse animations |
| **Scan (3s)** | Resource levels, department health, leader availability | Resource bars, department cards, portrait states |
| **Read (10s)** | Initiative details, event descriptions, outcome projections | Card text, tooltips, delta previews |
| **Analyze (30s+)** | Cross-system interactions, optimal leader-initiative pairings, long-term strategy | Trend lines (Review mode), stat comparisons, resource projection |

Every piece of information lives at exactly one layer. Nothing important is buried at the Analyze layer. Nothing trivial clutters the Glance layer.

---

## 2. Information Architecture

### Always Visible (Persistent UI)

These elements are on screen in every mode, every week, from the first game to the last.

| Element | Location | Content | Rationale |
|---|---|---|---|
| **Header bar** | Top, full width, 48px tall | Game title, week number, current mode badge, attention counter | Orientation — the player always knows where and when they are |
| **Resource panel** | Left sidebar, 200px wide | 6 resource bars with numeric values and delta indicators | The settlement's vital signs — always monitored, like a heart rate display |
| **Phase stepper** | Bottom of sidebar or bottom bar | 4 phase indicators (Observe/Plan/Execute/Review) with current highlighted | Navigation — where am I in the turn cycle? |

### Contextual Per Mode

These elements change content or emphasis based on the active mode.

| Mode | Primary Content Area | Emphasized Sidebar Data |
|---|---|---|
| **Observe** | Department health dashboard (4 panels), leader status grid, trend arrows on resources | Resource deltas from last week, department health trend arrows |
| **Plan** | Available initiative cards (scrollable grid), leader assignment panel, attention budget planner | Resource requirements for selected initiatives, leader fatigue/trust |
| **Execute** | Event queue (events appear sequentially), initiative progress bars, delegation log | Attention remaining (prominently), resource changes in real-time |
| **Review** | Outcome summary cards, resource delta comparison (before/after), autonomy score gauge | Week-over-week trends, scoring breakdown |

### On-Demand (Tooltips & Detail Panels)

| Trigger | Content | Implementation |
|---|---|---|
| **Click a resource bar** | Expanded panel: current value, last 4 weeks trend sparkline, list of active modifiers ("Low Clarity: +1 coordination cost") | Slide-out detail panel, 320px wide, replaces or overlays main content |
| **Click a leader portrait** | Leader detail card: all 6 stats with bar charts, current assignment, fatigue level, trust level, behavioral tendency description | Modal overlay, 480px wide |
| **Click an initiative card** | Expanded card: full description, resource requirements with current levels shown, both outcome tracks with probability, assigned leader compatibility score | Card expands in-place or opens as modal on smaller screens |
| **Hover a resource cost pill** | Tooltip: "Requires 20 Materials. You have 62. (Sufficient)" or "Requires 30 Trust. You have 18. (Insufficient — need 12 more)" | Inline tooltip, 200ms delay, positioned above the pill |
| **Hover an attention cost** | Tooltip: "Costs 3 Attention. You have 7 remaining. After this: 4 remaining." | Inline tooltip with projected remainder |

### Information Hierarchy Per Mode

The hierarchy follows dashboard UX F-pattern scanning: the eye starts top-left and sweeps right, then drops down and sweeps right again, with decreasing scan width on each row.

**Observe Mode Hierarchy**:
```
Priority 1 (top-left):  Department health panels — are any departments in danger?
Priority 2 (top-right): Resource trend arrows — which resources are rising/falling?
Priority 3 (mid-left):  Leader status — who is available, fatigued, burned out?
Priority 4 (mid-right): Last week's event outcomes — what happened?
Priority 5 (bottom):    Autonomy score gauge — how close are we to winning?
```

**Plan Mode Hierarchy**:
```
Priority 1 (top-left):  Available initiative cards — what can I do this week?
Priority 2 (top-right): Attention budget bar — how much can I afford?
Priority 3 (mid-left):  Leader assignment slots — who is free to lead what?
Priority 4 (mid-right): Resource requirements — can I afford these initiatives?
Priority 5 (bottom):    Outcome previews — what happens if I oversee vs delegate?
```

**Execute Mode Hierarchy**:
```
Priority 1 (center):    Active event (modal) — what is happening right now?
Priority 2 (top-right): Attention remaining — can I afford to respond?
Priority 3 (mid-left):  Initiative progress — what is completing this week?
Priority 4 (sidebar):   Resource changes — what is shifting as events resolve?
Priority 5 (bottom):    Delegation log — what happened without my input?
```

**Review Mode Hierarchy**:
```
Priority 1 (top-left):  Resource deltas — what changed this week? (big numbers with +/-)
Priority 2 (top-right): Autonomy score — am I closer to winning?
Priority 3 (mid-left):  Initiative outcomes — what completed, what progressed?
Priority 4 (mid-right): Leader fatigue changes — who is tired, who recovered?
Priority 5 (bottom):    "Begin Next Week" button — the only action available
```

---

## 3. Player Flow

### Core Loop Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        TITLE SCREEN                             │
│                    [ New Game ]  [ Continue ]                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GAME SCREEN — WEEK 1                        │
│                                                                 │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│    │ OBSERVE  │───▶│   PLAN   │───▶│ EXECUTE  │───▶│  REVIEW  │ │
│    │ (blue)   │    │ (purple) │    │ (amber)  │    │ (green)  │ │
│    │          │    │          │    │          │    │          │ │
│    │ Read the │    │ Choose   │    │ Events   │    │ See what │ │
│    │ state of │    │ what to  │    │ happen.  │    │ changed. │ │
│    │ things.  │    │ focus on.│    │ Respond. │    │ Learn.   │ │
│    └──────────┘    └──────────┘    └──────────┘    └────┬─────┘ │
│                                                         │       │
│                                                         ▼       │
│                                                  ┌────────────┐ │
│                                                  │ NEXT WEEK  │ │
│                                                  │ Week++ → 1 │ │
│                                                  └────────────┘ │
│                                                         │       │
│         ┌───────────────────────────────────────────────┘       │
│         │                                                       │
│         ▼                                                       │
│    ┌──────────┐                                                 │
│    │ OBSERVE  │  ← Cycle repeats                                │
│    │ Week N+1 │                                                 │
│    └──────────┘                                                 │
│                                                                 │
│    Win condition: Autonomy ≥ 80 for 3 consecutive weeks         │
│    Lose condition: Trust or critical resource hits 0             │
│                                                                 │
│    Demo wall: After Week 5, show demo-wall-screen               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### First-Time Player Experience

```
TITLE SCREEN
  │
  ├─ Player sees: Game title (Press Start 2P, large), dark background,
  │  single "New Game" button glowing in Observe blue.
  │  No settings, no credits, no options clutter on first view.
  │  "Continue" button only appears if a save exists.
  │
  ▼
WEEK 1 — OBSERVE (first-ever mode)
  │
  ├─ The screen populates with department panels and resource bars.
  │  A single contextual hint banner appears at the top of the main area:
  │  "This is your settlement. Look around. When you're ready, advance to Plan."
  │  The hint is dismissible and has a "Don't show hints" checkbox.
  │
  ├─ Resources start at moderate levels (40-60 range) — nothing is critical,
  │  nothing is maxed. The player has room to explore without crisis.
  │
  ├─ Only 2 of 4 departments are active in Week 1 (Operations, Infrastructure).
  │  Research and External Affairs panels exist but are greyed with a lock icon
  │  and a label: "Unlocks Week 2" / "Unlocks Week 3".
  │
  ├─ The "Advance to Plan" button pulses gently after 10 seconds if the player
  │  has not interacted with anything, providing a nudge without prescription.
  │
  ▼
WEEK 1 — PLAN (first planning decisions)
  │
  ├─ 3 initiative cards are available (not the full 10-15). All are simple:
  │  low attention cost (1-2), short duration (1 week), clear outcomes.
  │
  ├─ Only 2 leaders are available (the third unlocks Week 2).
  │  Leader cards show a simplified stat view (3 key stats, not all 6).
  │
  ├─ A contextual hint appears on the first initiative card:
  │  "Click a card to see details. Assign a leader to begin."
  │
  ├─ Attention budget is 10. The first initiatives cost 1-2 each.
  │  The player can comfortably start 2-3 initiatives. Underspending is fine.
  │
  ├─ The "Confirm Plan" button is always available — even if the player assigns
  │  nothing. The hint says: "You can confirm with an empty plan. Unassigned
  │  departments will produce passive output only."
  │
  ▼
WEEK 1 — EXECUTE (first events)
  │
  ├─ 0-1 events occur (Week 1 is calm). If an event occurs, it is "ignorable"
  │  urgency — gray border, low stakes, clear choices.
  │
  ├─ Initiative progress is shown with a simple progress bar filling.
  │  If a 1-week initiative was started, it completes here.
  │
  ├─ The delegation log shows what happened without player input:
  │  "Operations produced +3 Materials (passive)."
  │
  ▼
WEEK 1 — REVIEW (first feedback)
  │
  ├─ Resource deltas are shown as large numbers: "+3 Materials", "+2 Knowledge".
  │  The delta colors (green for gains, red for losses) reinforce the visual
  │  language that will persist throughout the game.
  │
  ├─ Autonomy score is shown for the first time: a gauge at ~20-30%.
  │  A hint says: "Reach 80% autonomy and sustain it for 3 weeks to win."
  │
  ├─ "Begin Next Week" button is the only action. It is prominent, centered,
  │  and colored in the next mode's accent (Observe blue, since Week 2 starts
  │  in Observe).
  │
  ▼
WEEK 2 — OBSERVE
  │
  ├─ Research department unlocks. A brief notification: "Research is now active."
  │  The department panel fades in from its locked state.
  │
  ├─ 3rd leader becomes available. New initiative cards appear.
  │
  ├─ The full resource panel now shows all 6 stats with deltas from Week 1.
  │  The player can now compare "last week" to "this week."
  │
  └─ Progressive complexity continues through Week 3 (External Affairs unlocks,
     event urgency increases, attention budget feels tighter).
```

### Decision Flow Within Each Mode

#### Observe Mode: "Read the Board"

```
Player enters Observe
  │
  ├─ Eyes go to HEADER: Week number, attention budget (full)
  │
  ├─ Eyes scan LEFT SIDEBAR: Resource bars — any red/critical alerts?
  │  If yes → player clicks the critical resource to see modifiers
  │  If no → player scans department panels
  │
  ├─ Eyes scan MAIN AREA: Department health panels (2-4 visible)
  │  Each panel shows: health bar, assigned leader, active initiatives, trend arrow
  │  Player clicks a department panel to see detail
  │
  ├─ Player checks LEADER STATUS: portraits in a row below departments
  │  Fatigued leaders have desaturated portraits (immediately visible)
  │
  ├─ Player knows they have "seen enough" when:
  │  - They have identified any critical resources (red bars)
  │  - They have noted which departments need attention (low health)
  │  - They know which leaders are available vs fatigued
  │  Visual cue: a subtle checkmark appears next to each panel the player
  │  has viewed (not clicked — just scrolled past / had in viewport for 2s).
  │  When all panels have been "seen," the advance button gets a green dot.
  │
  └─ Player clicks "Advance to Plan" button (always available, no gate)
```

#### Plan Mode: "Make Choices"

```
Player enters Plan
  │
  ├─ ATTENTION BUDGET prominently displayed: "10/10 ATTENTION"
  │
  ├─ INITIATIVE CARDS appear in main area as a grid (2-3 columns)
  │  Each card shows: name, department, attention cost, duration
  │  Cards are sorted by department, then by cost
  │
  ├─ Player CLICKS a card → card expands to show full detail
  │  Resource requirements are shown as pills with current levels
  │  Outcome tracks (overseen vs delegated) are visible
  │  "Assign Leader" dropdown appears
  │
  ├─ Player ASSIGNS a leader → leader portrait appears on the card
  │  Attention budget decreases in the header (e.g., 10 → 7)
  │  The leader's row in the sidebar updates to show "Assigned: [Initiative]"
  │  If the player chose to oversee, additional attention cost is shown
  │
  ├─ Player can UNDO any assignment by clicking the X on the leader portrait
  │  Attention budget restores. Leader returns to available pool.
  │
  ├─ Player repeats for 1-4 initiatives until attention budget is spent
  │  or they are satisfied with their plan
  │
  ├─ CONSTRAINTS ARE VISIBLE:
  │  - Cards the player cannot afford (insufficient resources) have dimmed
  │    backgrounds and a "Requires: Materials 30 (you have 18)" warning
  │  - Cards that cost more attention than remaining show dimmed attention cost
  │  - Leaders already assigned are removed from other cards' dropdowns
  │  - Departments at max capacity (2 initiatives) show "Full" badge
  │
  └─ Player clicks "Confirm Plan" → CONFIRMATION DIALOG:
     "Begin this week with [N] initiatives and [M] attention reserved?"
     [ Confirm ] [ Back to Planning ]
     The dialog shows a summary: which initiatives, which leaders, attention
     spent vs reserved.
```

#### Execute Mode: "React to Events"

```
Player enters Execute
  │
  ├─ INITIATIVE PROGRESS resolves first (automatic, ~2s animation)
  │  Progress bars fill, completion notifications appear in the log
  │  Player watches but does not interact with initiative resolution
  │
  ├─ EVENTS APPEAR sequentially (not all at once)
  │  Each event is a modal overlay:
  │  - Urgency badge (ignorable/pressing/critical) with icon + color + label
  │  - Description text (2-3 sentences)
  │  - 2-3 choice cards, each showing:
  │    - Choice name
  │    - Attention cost
  │    - Projected resource changes ("+5 Trust, -10 Materials")
  │  - Player clicks a choice → modal closes, outcome applies
  │  - If attention is insufficient for a choice, that choice is greyed out
  │    with text: "Costs 2 Attention. You have 0."
  │
  ├─ BETWEEN EVENTS, the main view shows:
  │  - Updated resource bars (animating changes)
  │  - Delegation log scrolling with passive department outputs
  │  - Leaders executing their assignments (portrait shows active state)
  │
  ├─ If NO EVENTS occur this week:
  │  The main area shows: "A quiet week. Your departments operate undisturbed."
  │  With a subtle animation of resource bars updating from passive output.
  │  The advance button is immediately available.
  │
  └─ After all events resolve → "Advance to Review" button activates
     (it is greyed out until all events are resolved)
```

#### Review Mode: "Learn and Decide to Continue"

```
Player enters Review
  │
  ├─ DELTA SUMMARY fills the main area:
  │  Large numbers showing resource changes: "+8 Materials  -3 Trust  +5 Knowledge"
  │  Each delta is color-coded (green positive, red negative)
  │  Below each delta: sparkline of the resource over the last 4 weeks
  │
  ├─ INITIATIVE OUTCOMES are shown as cards:
  │  "Completed: Reinforce Perimeter — Resilience +12, Materials -8"
  │  "In progress: Survey Northern Ridge — 1/2 weeks complete"
  │  Quality indicator: "Delegated to [Leader]: Good outcome (Judgment 8 applied)"
  │
  ├─ LEADER CHANGES:
  │  "Maren: Fatigue 40 → 55 (rested: no). Trust 72 → 68."
  │  Fatigued leaders have a warning icon
  │
  ├─ AUTONOMY SCORE:
  │  Gauge showing current autonomy %. If ≥ 80, a streak counter: "Week 1 of 3"
  │  If below 80, hint: "Autonomy is at 64%. Delegate more to increase it."
  │
  ├─ What drives the player to start the next week:
  │  - Curiosity: "What events will happen next?"
  │  - Ambition: "Can I get autonomy higher?"
  │  - Anxiety: "Trust dropped — I need to fix that"
  │  - Progress: "Survey completes next week — I want to see the outcome"
  │
  └─ "Begin Next Week" — large, centered, colored Observe blue
     No confirmation dialog — transitioning to the next week's Observe is
     low-stakes (no irreversible action occurs)
```

### Mode Transition UX

Mode transitions are always player-initiated via a single prominent button. The button lives in a consistent location — the **bottom-right of the main content area**, 48px tall, full accent color.

```
┌─────────────────────────────────────────┐
│                                         │
│           Main Content Area             │
│                                         │
│                                         │
│                                         │
│                                         │
│                        ┌──────────────┐ │
│                        │ Advance to   │ │
│                        │ Plan     →   │ │
│                        └──────────────┘ │
└─────────────────────────────────────────┘
```

**Transition behavior**:

| Transition | Button Label | Confirmation? | Color |
|---|---|---|---|
| Observe → Plan | "Advance to Plan" | No | `--mode-plan` (purple) |
| Plan → Execute | "Confirm Plan" | Yes (summary dialog) | `--mode-execute` (amber) |
| Execute → Review | "Advance to Review" | No (only available after all events resolve) | `--mode-review` (green) |
| Review → Observe (next week) | "Begin Week [N+1]" | No | `--mode-observe` (blue) |

**Why only Plan → Execute has a confirmation**: This is the only transition where the player commits to irreversible decisions. All other transitions are either purely informational (Observe) or finalize already-resolved outcomes (Execute, Review).

**Keyboard shortcut**: `Enter` or `Space` activates the current advance button when it has focus. `Tab` cycles through interactive elements, and the advance button is always last in tab order (so the player naturally reaches it after interacting with the mode's content).

---

## 4. Onboarding Design

### No Tutorial Screen Approach

Steadward never shows a tutorial screen, a popup walkthrough, or a forced interactive guide. The philosophy: the best gaming onboarding lets players figure things out themselves within a scaffolded environment. Players do not hate learning — they hate being denied the chance to learn in their own way.

Instead, the game teaches through three mechanisms:

1. **Scaffolded first weeks** (reduced complexity)
2. **Contextual hint banners** (dismissible, non-blocking)
3. **Self-evident UI** (labels, icons, and layout that communicate purpose without explanation)

### Week 1 Scaffolding

| Dimension | Week 1 (Scaffolded) | Week 2 (Expanding) | Week 3 (Growing) | Week 4+ (Full) |
|---|---|---|---|---|
| **Departments active** | 2 (Operations, Infrastructure) | 3 (+ Research) | 4 (+ External Affairs) | 4 |
| **Leaders available** | 2 (Maren, Rook) | 3 (+ Fen) | 4 (+ Osei) | 5 (+ Lin) |
| **Initiative cards** | 3 (simple, 1-week, low cost) | 5-6 (mixed duration) | 8-10 | Full pool (10-15) |
| **Event frequency** | 0-1 events, ignorable only | 1-2 events, ignorable or pressing | 1-3 events, all urgency levels | 1-3 events, all urgency levels |
| **Leader stat display** | 3 key stats per leader | All 6 stats visible | All 6 stats + behavioral tendency | All 6 stats + behavioral tendency |
| **Resource interactions** | Not shown | Hinted ("Low Clarity increases coordination cost") | Fully visible with modifier list | Fully visible with modifier list |
| **Autonomy score** | Shown in Review only | Shown in sidebar | Always visible in header | Always visible in header |

### Progressive Disclosure Schedule

```
Week 1: Core loop mechanics — 2 leaders (Maren, Rook)
  ├─ Resource bars exist and change
  ├─ Leaders can be assigned to initiatives
  ├─ Events can be responded to
  └─ The 4-phase cycle completes

Week 2: System depth — 3 leaders (+ Fen)
  ├─ 3rd department unlocks (Research) → more initiatives available
  ├─ 3rd leader unlocks (Fen) → assignment tradeoffs begin
  ├─ Leader fatigue becomes visible (first leader hits 40+ fatigue)
  ├─ Resource interactions hinted in tooltips
  └─ Pressing events appear → attention budget feels tighter

Week 3: Growing complexity — 4 leaders (+ Osei)
  ├─ 4th department unlocks (External Affairs) → all departments active
  ├─ 4th leader unlocks (Osei) → more assignment flexibility
  ├─ Delegation vs oversight tradeoff becomes meaningful
  │   (leader trust affects outcome quality)
  ├─ Cross-resource dependencies visible
  ├─ Critical events can appear
  └─ Win/lose conditions feel tangible

Week 4+: Full complexity — 5 leaders (+ Lin)
  ├─ 5th leader unlocks (Lin, generalist) → full roster available
  ├─ All content active, no more unlocks
  ├─ Player is managing attention scarcity
  ├─ Strategic depth: which initiatives to abandon?
  └─ Autonomy score optimization
```

### Contextual Hint System

Hints are short text banners that appear at the top of the main content area. They are:
- Dismissible (X button on the right)
- Non-blocking (the player can interact with everything behind them)
- Shown once per trigger (tracked in save state, never repeated)
- Accompanied by a global "Don't show hints" toggle in the settings menu

| Trigger | Hint Text | Mode |
|---|---|---|
| First Observe ever | "This is your settlement. The bars on the left show your resources. When you're ready, advance to Plan." | Observe |
| First Plan ever | "Click an initiative card, then assign a leader. Each costs attention from your weekly budget." | Plan |
| First Event ever | "Events interrupt your week. Choose a response — each costs attention and changes resources." | Execute |
| First Review ever | "Here's what changed this week. Green numbers are gains. Red numbers are losses." | Review |
| Resource drops below 25 | "Your [resource] is low. If it reaches 0, you lose." | Any |
| Leader fatigue exceeds 60 | "[Leader] is fatigued. Consider resting them (don't assign next week) or their work quality will suffer." | Observe/Plan |
| Autonomy hits 60+ | "Autonomy is rising. Delegate more and maintain stability to reach 80% and win." | Review |
| Player spends 0 attention in Plan | "You can advance with no plan — departments will produce passive output only. But you'll miss opportunities." | Plan |
| All attention spent before all events resolved | "You're out of attention. Remaining events will resolve without your input (passive resolution based on leader stats)." | Execute |

### Handling "I Don't Know What to Do"

When the player is idle for 15+ seconds on any interactive mode (Plan or Execute), the UI provides a subtle nudge — not a blinking arrow, but a gentle visual emphasis:

1. **Plan mode idle**: The cheapest available initiative card gets a soft glow border (the mode accent color at 30% opacity). This does not select it — it just draws the eye. The hint text: "Start with something simple. You can always undo."
2. **Execute mode idle** (event modal open): The lowest-cost choice gets a subtle border highlight. No hint text — the player should still choose freely.
3. **Observe mode idle**: The advance button pulses gently after 10s. The player may just be reading, so the nudge is very soft.

These nudges are disabled by the "Don't show hints" toggle.

---

## 5. Layout Specifications

### Desktop Layout (1280px+ viewport)

```
┌──────────────────────────────────────────────────────────────────────┐
│                           HEADER BAR (48px)                          │
│  [≡] STEADWARD  │  WEEK 03  │  ◉ OBSERVE  │ ⊕ 7/10 Attention  [⚙] │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│  SIDEBAR   │                   MAIN CONTENT AREA                     │
│  (200px)   │                   (flex: 1, min 600px)                  │
│            │                                                         │
│ ┌────────┐ │  ┌─────────────────────────────────────────────────┐    │
│ │Resource│ │  │                                                 │    │
│ │ Panel  │ │  │  Mode-specific content                         │    │
│ │        │ │  │  (Department panels / Initiative cards /       │    │
│ │ Matl 62│ │  │   Event modals / Review summaries)             │    │
│ │ Trst 78│ │  │                                                 │    │
│ │ Clrt 31│ │  │                                                 │    │
│ │ Rsln 95│ │  │                                                 │    │
│ │ Knwl 68│ │  │                                                 │    │
│ │ Mmtm 47│ │  │                                                 │    │
│ │        │ │  │                                                 │    │
│ ├────────┤ │  │                                                 │    │
│ │Phase   │ │  │                                                 │    │
│ │Stepper │ │  │                                                 │    │
│ │        │ │  │                                                 │    │
│ │◉ Obsrv │ │  │                                 ┌─────────────┐│    │
│ │○ Plan  │ │  │                                 │ Advance to  ││    │
│ │○ Exec  │ │  │                                 │ Plan    →   ││    │
│ │○ Revw  │ │  │                                 └─────────────┘│    │
│ └────────┘ │  └─────────────────────────────────────────────────┘    │
│            │                                                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

**Exact dimensions (desktop, 1280px+)**:

| Region | Width | Height | Position |
|---|---|---|---|
| Header bar | 100% viewport | 48px | Fixed top |
| Sidebar | 200px | calc(100vh - 48px) | Fixed left, below header |
| Main content | calc(100% - 200px) | calc(100vh - 48px) | Scrollable if needed |
| Resource panel | 200px (fills sidebar width) | Auto (content-driven, ~320px for 6 resources) | Top of sidebar |
| Phase stepper | 200px | 160px | Bottom of sidebar, sticky |
| Advance button | 180px x 48px | — | Bottom-right of main content, sticky |

**Spacing**:
- Sidebar padding: 12px
- Main content padding: 24px
- Gap between cards in grid: 16px
- Resource bar row height: 44px (icon 16px + label 11px + bar 8px + delta 11px + spacing)

### Tablet Layout (768px - 1279px)

```
┌──────────────────────────────────────────────────────┐
│                    HEADER BAR (48px)                  │
│  [≡] STEADWARD  │ WK03 │ ◉ OBS │ ⊕ 7/10       [⚙] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ RESOURCE BAR (horizontal, collapsible)       │    │
│  │ Mat 62 │ Trs 78 │ Cla 31 │ Res 95 │ Kn 68  │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │                                              │    │
│  │          MAIN CONTENT AREA                   │    │
│  │          (full width, scrollable)            │    │
│  │                                              │    │
│  │                                              │    │
│  │                                              │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ PHASE STEPPER (horizontal)  │ Advance →      │    │
│  │ ◉ Obs  ○ Plan  ○ Exec  ○ Rev                │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key tablet changes**:
- Sidebar collapses into a horizontal resource strip below the header (40px tall, scrollable horizontally if needed)
- Resource bars become compact: icon + abbreviated label + value only (no bar visualization, just numbers)
- Click the resource strip to expand into full resource panel (overlay, 320px tall)
- Phase stepper moves to bottom bar (48px, fixed bottom)
- Main content area is full width with 16px padding
- Initiative cards stack in a single column instead of 2-3 columns
- Advance button integrates into the bottom bar, right-aligned

### Mobile Layout (375px - 767px)

```
┌────────────────────────────────┐
│     HEADER BAR (48px)          │
│ [≡] STEADWARD │ ⊕ 7/10   [⚙] │
├────────────────────────────────┤
│                                │
│ ┌────────────────────────────┐ │
│ │ Mode Badge: ◉ OBSERVE     │ │
│ │ Week 03                   │ │
│ └────────────────────────────┘ │
│                                │
│  MAIN CONTENT                  │
│  (full width, scrollable)      │
│                                │
│  Single-column layout          │
│  Cards stack vertically        │
│                                │
│                                │
│                                │
│                                │
│                                │
├────────────────────────────────┤
│ BOTTOM BAR (56px)              │
│ [Resources ▲] [Advance →]     │
│  ◉  ○  ○  ○   phase dots      │
└────────────────────────────────┘
```

**Key mobile changes**:
- Header simplified: title + attention counter + settings
- Week number and mode badge move below header (32px strip)
- Resources hidden behind a "Resources" button in bottom bar (opens as bottom sheet, 50% viewport height)
- Phase stepper becomes 4 dots in bottom bar
- All content is single-column, full-width (375px - 32px padding = 343px content width)
- Initiative cards are full-width, stacked vertically
- Event modals are full-screen overlays (not centered floating modals)
- Leader portraits reduce to 32x32
- Font sizes remain the same — do not reduce below art direction minimums

### Minimum Viable Viewport

**768px x 600px** — the game is playable but cramped below this. At 768px, the tablet layout activates with the horizontal resource strip and bottom bar. Below 768px, the mobile layout takes over with bottom sheets and stacked cards.

**The game does not support viewports below 375px wide.** At 375px, a single initiative card (343px with padding) fills the screen width. Below this, card text becomes unreadable.

**Below 600px viewport height**: The bottom bar and header together consume 104px (48 + 56), leaving only 496px for content. This is sufficient for a single initiative card (variable height, typically 280-400px) or an event modal, but not for the Observe dashboard view. A "compact mode" hint appears: "Rotate to landscape for the best experience" on phones with < 600px height in portrait.

---

## 6. Interaction Patterns

### Primary Interaction Model

Steadward is a **click-to-select, click-to-confirm** game. There is no drag-and-drop in the core loop. This simplifies the interaction model, makes the game fully keyboard-accessible, and avoids the drag-and-drop usability pitfalls on touch devices.

| Action | Desktop Interaction | Tablet/Mobile Interaction | Keyboard |
|---|---|---|---|
| View initiative details | Click card | Tap card | `Enter` on focused card |
| Assign leader to initiative | Click "Assign Leader" dropdown → click leader | Same (native `<select>` or custom dropdown) | `Space` to open dropdown, `Arrow keys` to select, `Enter` to confirm |
| Choose oversee vs delegate | Click radio toggle on expanded card | Tap toggle | `Arrow keys` while toggle focused |
| Respond to event | Click choice card | Tap choice card | `Enter` on focused choice |
| Advance phase | Click advance button | Tap advance button | `Enter` when button focused |
| View resource detail | Click resource bar in sidebar | Tap resource in strip / bottom sheet | `Enter` on focused resource |
| View leader detail | Click leader portrait | Tap portrait | `Enter` on focused portrait |
| Dismiss hint | Click X on hint banner | Tap X | `Escape` |
| Undo leader assignment | Click X on assigned leader portrait (on card) | Tap X | `Delete` or `Backspace` when assignment focused |

### Keyboard Shortcuts

Keyboard shortcuts are for power users and accessibility. They are discoverable via a `?` key that opens a shortcut reference overlay.

| Key | Action | Available In |
|---|---|---|
| `Enter` / `Space` | Activate focused element / advance phase | All modes |
| `Tab` | Next interactive element | All modes |
| `Shift+Tab` | Previous interactive element | All modes |
| `Escape` | Close modal / dismiss hint / cancel assignment | All modes |
| `1` - `4` | Focus department panel 1-4 | Observe, Plan |
| `A` | Focus attention counter | All modes |
| `R` | Toggle resource detail panel | All modes |
| `N` | Advance to next phase (same as clicking advance button) | All modes |
| `U` | Undo last assignment in Plan mode | Plan |
| `?` | Open keyboard shortcut reference | All modes |
| `S` | Open settings | All modes |

### How Cards Work

**Initiative Cards** (Plan mode):

```
Unselected State:            Selected State:
┌──────────────────────┐     ┌══════════════════════┐  ← border becomes mode accent
│ [Dept] Card Name     │     ║ [Dept] Card Name     ║
│ ⊕ 2  ⏱ 1wk         │     ║ ⊕ 2  ⏱ 1wk         ║
│                      │     ║                      ║
│ Brief description... │     ║ Full description of  ║
│                      │     ║ the initiative and   ║
└──────────────────────┘     ║ what it does...      ║
                             ║                      ║
                             ║ Requires:            ║
                             ║ [Mat 20] [Trust 30]  ║
                             ║                      ║
                             ║ ○ Oversee  ● Delegate║
                             ║ [Assign Leader ▼]    ║
                             ║ [ Start Initiative ] ║
                             ╚══════════════════════╝
```

1. **Click to select** → card expands in-place, showing full details
2. **Choose oversee/delegate** → radio toggle (oversee costs additional attention)
3. **Assign leader** → dropdown populated with available leaders, showing compatibility score
4. **Click "Start Initiative"** → initiative is queued, attention is deducted from budget
5. **Click X or click elsewhere** → card collapses (if no assignment made); if assigned, the card stays expanded but shows a compact "Assigned" state with the leader portrait

No drag-and-drop. No dragging leaders onto cards. The click-click-click flow is sequential and unambiguous.

**Leader Cards** (always visible in sidebar or leader panel):

```
┌──────────────────────────┐
│ [Portrait 48x48]  Maren  │
│                   Ops    │
│  Judgment ████████ 8     │
│  Speed    ██████   6     │
│  Reliab   █████████ 9   │
│  Status: Available       │  ← or "Assigned: Reinforce Perimeter"
│  Fatigue: ████░░░ 55     │     or "Resting"
└──────────────────────────┘
```

### Resource Bar Urgency Communication

Resource bars use **three channels** to communicate urgency — never color alone:

| Resource Level | Bar Color | Border Treatment | Additional Signal |
|---|---|---|---|
| 50-100 (healthy) | Resource's dedicated color at full opacity | 1px `--bg-light` border | None |
| 25-49 (caution) | Resource color at full opacity | 1px `--alert-medium` (gold) border | Small warning triangle icon appears next to value |
| 10-24 (danger) | Resource color at full opacity | 2px `--alert-high` (red) border | Warning icon + label text turns `--alert-high` |
| 0-9 (critical) | Resource color at full opacity | 2px `--alert-high` border | Gentle pulse animation (2s cycle), warning icon, label text red |

The bar fill color itself never changes — the resource's identity color is consistent. Urgency is communicated through the border, icon, and text treatment.

### Attention Budget Visualization

The attention counter in the header uses a **segmented bar** — 10 discrete segments, one per attention point. As attention is spent, segments empty from right to left.

```
Full:     ⊕ [██ ██ ██ ██ ██ ██ ██ ██ ██ ██] 10/10
Partial:  ⊕ [██ ██ ██ ██ ██ ██ ██ ░░ ░░ ░░]  7/10
Low:      ⊕ [██ ██ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░]  2/10  ← gold border
Empty:    ⊕ [░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░]  0/10  ← red border, pulse
```

Each segment is 12px wide x 16px tall, with 2px gaps. The filled color is `--res-attention` (gold). The empty color is `--bg-light`. The bar total width is 140px.

**During Plan mode**: When the player hovers/focuses an initiative card, the attention bar *previews* the cost by changing the relevant segments to a dimmed gold (50% opacity). This shows "if you start this, you'll have X remaining" without requiring mental arithmetic.

**During Execute mode**: When an event modal shows choices with attention costs, the same preview behavior applies — hovering a choice dims the corresponding segments.

### Confirmation Patterns

| Action | Confirmation? | Rationale |
|---|---|---|
| Assign leader to initiative (Plan) | No | Freely reversible within Plan |
| Remove leader from initiative (Plan) | No | Freely reversible within Plan |
| Confirm plan (Plan → Execute) | Yes (summary dialog) | Irreversible — commits to this week's strategy |
| Choose event response (Execute) | No | Events are immediate — deliberation happened in the choice, not after. Requiring a second click would add friction to an already tense moment. |
| Begin next week (Review → Observe) | No | Low-stakes transition, no irreversible action |
| Abandon an in-progress initiative (Plan) | Yes ("Abandon [name]? Progress will be lost.") | Destructive action affecting multi-week investment |
| Exit to title screen | Yes ("Unsaved progress will be lost. Continue?") | Data loss risk |

**General rule**: Confirm destructive or irreversible actions. Do not confirm navigational or reversible actions. Never ask "are you sure?" for something the player can undo.

### Undo Within Phases

| Mode | Undo Available? | Scope | Implementation |
|---|---|---|---|
| **Observe** | N/A | Read-only mode, no actions to undo | — |
| **Plan** | Yes, unlimited | Any assignment or initiative selection can be undone individually. A global "Clear Plan" button resets all assignments. | Each assignment is tracked in a stack. `Ctrl+Z` / `Cmd+Z` pops the last assignment. `U` key also works. |
| **Execute** | No | Event responses are immediate and irreversible. This is intentional — the tension of Execute comes from committing under pressure. | — |
| **Review** | N/A | Read-only mode, no actions to undo | — |

---

## 7. Accessibility

### WCAG AA Compliance Checklist

Steadward targets **WCAG 2.1 AA** compliance across all interactive elements. The game is rendered as HTML/CSS in the browser, so standard web accessibility techniques apply directly.

| WCAG Criterion | Requirement | Steadward Implementation |
|---|---|---|
| **1.1.1 Non-text Content** | All non-text content has text alternatives | All icons have `aria-label` or accompanying text labels. Leader portraits have alt text ("Maren, Operations leader, fatigue 55"). Resource bars have `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| **1.3.1 Info and Relationships** | Structure and relationships conveyed through presentation are programmatically determinable | Semantic HTML: `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`. Department panels use `<article>`. Initiative cards are `<button>` or `role="button"`. |
| **1.3.2 Meaningful Sequence** | Reading order matches visual order | DOM order matches visual layout. Tab order follows F-pattern: header → sidebar → main content → advance button. |
| **1.4.1 Use of Color** | Color is not the only visual means of conveying information | Every color-coded element has an accompanying icon, label, or pattern. Resource urgency uses color + border weight + icon. Event urgency uses color + icon + text label + border style. |
| **1.4.3 Contrast (Minimum)** | Text has 4.5:1 contrast ratio against background (3:1 for large text) | All text-on-background combinations verified in art-direction.md. `--text-primary` on `--bg-dark`: 13.2:1. `--text-secondary` on `--bg-dark`: 5.1:1. |
| **1.4.11 Non-text Contrast** | UI components and graphical objects have 3:1 contrast | Resource bar fills, button borders, and interactive element outlines all meet 3:1. |
| **2.1.1 Keyboard** | All functionality operable through keyboard | Full keyboard navigation (Tab, Enter, Space, Escape, arrow keys). Keyboard shortcuts for common actions. No keyboard traps. |
| **2.1.2 No Keyboard Trap** | Focus can be moved away from any component using keyboard | All modals have a close button. `Escape` closes any overlay. Focus returns to the triggering element after modal close. |
| **2.3.1 Three Flashes** | No content flashes more than 3 times per second | The critical pulse animation is 2s cycle (0.5 Hz) — well under the 3/s threshold. No other flashing content exists. |
| **2.4.3 Focus Order** | Focus order preserves meaning and operability | Tab order: header controls → sidebar resources → main content (top-to-bottom, left-to-right) → advance button. |
| **2.4.7 Focus Visible** | Keyboard focus indicator is visible | 2px outline in `--mode-current` color with 2px offset. Visible on all interactive elements. Never suppressed via `outline: none` without replacement. |
| **2.5.1 Pointer Gestures** | Functionality requiring multipoint or path-based gestures has single-pointer alternatives | No drag-and-drop, no swipe gestures, no pinch-to-zoom requirements. All interactions are single-click/tap. |
| **3.1.1 Language of Page** | Default human language is programmatically determined | `<html lang="en">` |
| **4.1.2 Name, Role, Value** | All UI components have accessible name, role, and value | Custom components use ARIA roles (`role="button"`, `role="progressbar"`, `role="dialog"`, `role="tablist"` for phase stepper). |

### Keyboard Navigation Flow

```
Tab Order (per mode):

HEADER:
  1. Menu toggle button
  2. Settings button

SIDEBAR:
  3-8. Resource bars (each is focusable, Enter to expand detail)
  9-12. Phase stepper steps (informational, not interactive)

MAIN CONTENT (varies by mode):
  Observe: 13+. Department panels (each focusable, Enter to expand)
  Plan:    13+. Initiative cards → leader dropdowns → start buttons
  Execute: 13+. Event choice cards (when modal is open, focus is trapped in modal)
  Review:  13+. Outcome cards (informational, focusable for screen readers)

ADVANCE BUTTON:
  Last. The advance button is always last in tab order.
```

**Focus trapping in modals**: When an event modal opens in Execute mode, focus is trapped within the modal. Tab cycles through the choice cards and a close/dismiss button (if the event is ignorable). `Escape` closes ignorable events. Pressing/critical events cannot be dismissed — the player must choose.

### Screen Reader Considerations

| Game Element | ARIA Implementation | Screen Reader Announcement |
|---|---|---|
| **Mode changes** | `aria-live="polite"` region in header for mode badge | "Mode changed to Plan. Week 3." |
| **Resource changes** | `aria-live="polite"` on resource panel during Execute/Review | "Materials changed from 62 to 55. Down 7." |
| **Event appearance** | `role="alertdialog"` on event modal | "Pressing event: Supply convoy delayed by storms. 3 choices available." |
| **Attention spent** | `aria-live="assertive"` on attention counter | "Attention spent. 5 of 10 remaining." |
| **Initiative assignment** | Confirmation announcement | "Maren assigned to Reinforce Perimeter. 2 attention spent. 8 remaining." |
| **Phase advance** | `aria-live="polite"` | "Advanced to Execute phase. 2 events pending." |
| **Game over** | `role="alert"` | "Game over. Trust reached 0. Final autonomy: 64%." |
| **Resource urgency** | `aria-label` on resource bar includes urgency | "Materials: 18 of 100. Warning: low." |

### Color-Blind Safe Design

Already specified in art-direction.md, but reinforced here with specific UX patterns:

1. **Never rely on red/green distinction** — resource gains and losses use green (`#7EE787`) and red (`#F85149`) which differ in lightness as well as hue. Additionally, gains always show a "+" prefix and losses show a "-" prefix.
2. **Department colors** use hue AND lightness variation — Operations (orange, medium), Infrastructure (copper, dark), Research (purple, light), External Affairs (blue, medium).
3. **Event urgency** uses icon + text label + border weight — even in full grayscale, ignorable (thin dashed border), pressing (solid border + triangle icon), and critical (thick border + exclamation icon) are distinguishable.
4. **Settings menu includes**: "High contrast mode" toggle that increases all borders to 2px and adds pattern fills to resource bars (hatching for caution, cross-hatching for danger).

### Reduced Motion Mode

Detectable via `prefers-reduced-motion: reduce` media query. When active:

| Normal Animation | Reduced Motion Alternative |
|---|---|
| Mode color crossfade (300ms) | Instant color swap |
| Resource bar fill transition (300ms) | Instant width change |
| Resource number counting animation (400ms) | Instant number update |
| Event modal scale-in (200ms) | Instant appearance (opacity: 0 → 1, no transform) |
| Alert pulse animation (2s loop) | Static — no pulse. Border color alone communicates urgency. |
| Attention spend scale animation (200ms) | Instant number update |
| Button hover brightness (100ms) | Instant brightness change |
| Card selection border transition (150ms) | Instant border change |

Implementation:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Additionally, a manual "Reduce motion" toggle in settings applies `data-reduced-motion` to the root element, overriding the media query for users who want reduced motion but whose OS does not expose the preference.

### Font Size Scaling

The game respects the browser's font size setting. All sizes in the art direction are specified in px for precision, but the implementation uses `rem` units based on a 16px root size. If the user sets their browser to 20px base, all text scales proportionally.

**Critical constraint**: At 200% font scaling (32px base), the layout must remain functional. This means:
- Resource bars must accommodate 2-line labels at large font sizes
- Initiative cards must not overflow their containers
- The header bar height increases from 48px to 64px at 150%+ scaling
- The sidebar width increases from 200px to 260px at 150%+ scaling

Test at 100%, 125%, 150%, and 200% browser zoom levels.

### High Contrast Mode

Activated via settings toggle. Applies `data-high-contrast` to root element.

Changes:
- All borders increase to 2px minimum
- Background surfaces reduce to two levels: `#000000` (darkest) and `#1A1A1A` (panels)
- Text colors reduce to two levels: `#FFFFFF` (primary) and `#AAAAAA` (secondary)
- Accent colors increase saturation by 20%
- Focus outlines increase to 3px with 3px offset
- Resource bar backgrounds become `#333333` for higher contrast against fills

---

## 8. Error States & Edge Cases

### Invalid Actions

| Invalid Action | What the Player Sees | How It's Communicated |
|---|---|---|
| **Assign a busy leader** | Leader does not appear in the dropdown — they are removed from the available list while assigned. If only 1 leader is free, the dropdown has 1 option. If 0 leaders are free, the dropdown is disabled with text: "No leaders available." | Prevention (remove from options) rather than error message |
| **Start initiative without enough resources** | Card shows resource requirements with red text on insufficient resources: "Materials: 20 required (you have 12)". The "Start Initiative" button is disabled (greyed out, `cursor: not-allowed`). | Disabled state + inline explanation |
| **Spend more attention than remaining** | Initiative cards and event choices that cost more than remaining attention show their attention cost in `--text-muted` with a strikethrough. Tooltip: "Not enough attention. You have 3, this costs 5." | Disabled state + crossed-out cost |
| **Assign leader to department they are incompatible with** | This is not an error — leaders can be assigned to any department. However, the compatibility score is shown: "Compatibility: Low (Judgment 3, this initiative weights Judgment heavily)". The player can still assign. | Warning, not prevention — "you shouldn't" vs "you can't" |
| **Start more than 2 initiatives per department** | The 3rd initiative card for that department shows: "Department full (2/2 active)". Card is not selectable. | Prevention + explanation |

### "Can't Do This" vs "Shouldn't Do This"

Steadward distinguishes between **hard constraints** (system prevents the action) and **soft warnings** (system advises against the action).

**Hard constraints** (action is impossible):
- Visual: element is **disabled** — greyed out background, `--text-muted` text, `cursor: not-allowed`, no hover effect
- Screen reader: `aria-disabled="true"` with `aria-describedby` pointing to explanation text
- Examples: insufficient resources, no available leaders, department at capacity, zero attention

**Soft warnings** (action is possible but suboptimal):
- Visual: element is **enabled** but displays a **warning indicator** — small triangle icon in `--alert-medium` (gold), tooltip explains the concern
- The player can still click through and take the action
- Screen reader: `aria-describedby` includes warning text
- Examples: assigning a fatigued leader, starting an initiative with low compatibility, leaving a department unstaffed

### Empty States

| Empty State | What the Player Sees | Design |
|---|---|---|
| **No initiatives available** | Main content area shows: "No new initiatives this week. Your active initiatives continue." Below this, any in-progress initiatives are shown. The advance button remains available. | Centered text in `--text-secondary`, 16px Inter 400. An illustration of an empty clipboard (optional, Phase 7 polish) |
| **No events this week** (Execute) | "A quiet week. Departments operate on their own." Resource bars update with passive output. The advance button is immediately available. | Same centered text style. The quiet state is a deliberate game design choice — weeks without events are restful. |
| **No leaders available** (all assigned or resting) | "All leaders are assigned or resting. You can still advance with your current plan." Initiative cards that require leader assignment are disabled. | Explanation text at top of leader panel. Available initiatives shrink to only those that can proceed without new assignments. |
| **No resource changes this week** (Review) | Individual resource deltas show "0" in `--text-muted` with `--delta-neutral` color. The line still appears — the absence of change is itself information. | Do not hide zero-change resources. The player needs to see that Materials did not change. |

### The "Empty Plan" Edge Case

**Can the player skip Plan with no assignments?**

Yes. This is a valid strategy. The "Confirm Plan" dialog adapts:

```
┌──────────────────────────────────────────┐
│  Confirm Plan — Week 3                    │
│  ──────────────────────────────────────── │
│                                          │
│  No initiatives assigned this week.      │
│  Departments will produce passive output │
│  only. 10/10 attention reserved for      │
│  events.                                 │
│                                          │
│  [ Confirm Empty Plan ]  [ Back ]        │
└──────────────────────────────────────────┘
```

The button label changes to "Confirm Empty Plan" to ensure the player is intentional. This is not an error — sometimes the optimal play is to save attention for a heavy event week.

### Other Edge Cases

| Scenario | Behavior |
|---|---|
| **Player rapidly clicks advance button** | Debounced — 500ms cooldown after each phase transition. Button shows disabled state during transition. |
| **Browser tab is backgrounded during Execute** | Game state is frozen — no timers, no auto-advance. The game resumes exactly where it was when the tab regains focus. (Steadward is turn-based; there are no real-time elements.) |
| **LocalStorage/IndexedDB unavailable** | Game still runs — autosave silently fails. A small warning icon appears in the header: "Save unavailable — your progress won't be saved between sessions." Tooltip explains the browser restriction. |
| **Seed URL with invalid seed** | Fall back to random seed. No error shown — the player does not know or care. Console log: `Invalid seed parameter "${param}", using random seed.` |
| **Demo wall reached (Week 5)** | Game state is saved. The demo-wall-screen shows email capture and purchase CTA. "Continue" button loads the saved state if the player has access. "New Game" starts fresh. The game does not delete the save — the player's progress is preserved. |

---

## 9. Streamer & Spectator UX

### Design for 720p Readability

Twitch streams commonly run at 720p (1280x720) or 900p (1600x900). At 720p, every pixel is precious and compression artifacts reduce text clarity. Steadward must be readable to *viewers* at this resolution, not just to the streamer.

**Minimum font sizes for stream readability**:

| Element | Art Direction Size | Stream-Safe Minimum | Verdict |
|---|---|---|---|
| Phase labels (Press Start 2P) | 16px (H1) | 14px | OK — already above minimum |
| Panel headers (Inter 700) | 16px (H2) | 14px | OK |
| Card titles (Inter 600) | 14px (H3) | 12px | OK |
| Body text (Inter 400) | 13px | 12px | OK — 13px is above threshold |
| Labels (Inter 500) | 11px | 11px | Borderline — test at 720p with stream compression |
| Captions (Inter 400) | 10px | 11px | PROBLEM — 10px is unreadable on stream |
| Small numbers (Inter 500) | 11px | 11px | Borderline |

**Action item**: The 10px caption size from the art direction (timestamps, footnotes) must increase to 11px minimum, or captions must be removed from any game-critical context. Captions should only appear in tooltips or detail panels — never as the sole display of important information.

### Streamer Mode (`data-streamer-mode`)

Activated via settings toggle. When active:

1. **No hover-dependent information** — everything that is normally tooltip-on-hover becomes visible inline or on-click. Specifically:
   - Resource modifier lists (normally tooltip on resource bar) display expanded below the bar
   - Initiative compatibility scores (normally tooltip) display as a visible badge on the card
   - Attention cost previews (normally on hover) are shown for the *selected* card instead

2. **Larger UI scale** — all font sizes increase by 2px. Labels go from 11px to 13px. Body goes from 13px to 15px. This pushes the layout slightly but is necessary for stream readability at 720p with compression.

3. **Click-to-reveal replaces hover-to-reveal** — any element that shows additional information on hover now requires a click. This benefits both streamers (viewers can see what is clicked, not what is hovered) and mobile/tablet users.

4. **No cursor-position-dependent UI** — tooltips do not follow the cursor. All expanded information appears in a fixed position (typically below the triggering element or in a dedicated detail panel).

### Avoiding Hover-Dependent Information

Even outside streamer mode, the core game must function without hover. This is a fundamental design constraint for three audiences:

1. **Streamers** — viewers cannot see the streamer's cursor hover
2. **Tablet/mobile users** — no hover state exists on touch devices
3. **Keyboard users** — keyboard focus triggers the same expanded states as mouse hover, but this must be explicitly implemented

**Rule**: If information is important enough to affect a decision, it must be visible without hovering. Tooltips provide *supplementary* detail (exact numbers, flavor text), not *essential* information (resource requirements, attention costs, leader availability).

Every tooltip in the game should be audited against this question: "If the player never saw this tooltip, would they make a worse decision?" If yes, the information belongs in the persistent UI, not in a tooltip.

### Spectator Clarity

A viewer watching a Steadward stream should be able to understand the game's state within 10 seconds of tuning in. This requires:

1. **The mode badge is always visible and color-coded** — even a new viewer can see "OBSERVE" in blue and understand the current phase
2. **The attention counter is large and prominent** — "7/10" is instantly readable
3. **Resource bars are always visible in the sidebar** — the settlement's health is a glance away
4. **Events are full-screen modals with clear choice text** — the most dramatic moments (event choices) are the most visually prominent, which is ideal for spectators
5. **The advance button has a clear label** — "Advance to Plan" tells the viewer what is about to happen

**What spectators miss**: Without tooltips and hover previews, spectators miss leader stat details, resource modifier explanations, and initiative compatibility scores. This is acceptable — these are depth-of-play details, not essential for following the narrative. The game's story (resources rising/falling, events happening, leaders getting fatigued) is readable at the surface level.

### Stream-Optimized Color Contrast

Twitch's video compression (typically H.264 at 6000 kbps for 720p) degrades color accuracy, especially in dark scenes with subtle color differences. Steadward's dark palette is at risk.

**Mitigations**:
- The mode accent colors (`--mode-observe` blue, `--mode-plan` purple, `--mode-execute` amber, `--mode-review` green) are saturated enough to survive compression
- The base palette uses `--bg-dark` (#161B22) instead of pure black (#000000) — pure black creates banding artifacts under compression
- Text uses `--text-primary` (#E6EDF3, nearly white) which remains legible after compression
- Resource bar fills use fully saturated colors — they remain distinguishable even with color accuracy loss
- The critical pulse animation (opacity oscillation) survives compression because it affects luminance, not chroma

**Testing protocol**: Before launch, record 5 minutes of gameplay, encode at 720p/6000kbps H.264, and review on a secondary monitor at 100% zoom. All text and UI elements must remain legible. Run this test for each mode.

---

## 10. Localization

### Text Expansion Budget

All layout regions must accommodate **35% text expansion** for localization. German, French, and other target languages routinely produce strings 30-35% longer than equivalent English. Designs that fit English text with zero margin will break in translation.

The following UI elements must be tested at 135% of their English string length:

- **Sidebar labels** — resource names, department names, phase stepper labels
- **Card descriptions** — initiative card text, event descriptions, outcome text
- **Event text** — event names, choice text, outcome text
- **Button labels** — all CTA and navigation buttons ("Advance to Plan," "Confirm Plan," "Begin Week [N+1]")

Use pseudo-localization during development to validate layout flexibility: replace characters with accented variants and pad all strings by 35%.

For full localization guidelines — including string key conventions, gendered language handling, pluralization rules, and cultural sensitivity notes — see [narrative-direction.md Section 8](narrative-direction.md#8-writing-production-guide).

---

## Appendix A: Complete Tab Order Reference

Each mode's tab order, for implementation and QA testing.

### All Modes (persistent elements)

```
1.  Header: Menu toggle [button]
2.  Header: Settings [button]
3.  Sidebar: Materials resource bar [role="progressbar", clickable]
4.  Sidebar: Trust resource bar
5.  Sidebar: Clarity resource bar
6.  Sidebar: Resilience resource bar
7.  Sidebar: Knowledge resource bar
8.  Sidebar: Momentum resource bar
```

### Observe Mode (main content)

```
9.  Department 1: Operations panel [button/expandable]
10. Department 2: Infrastructure panel
11. Department 3: Research panel (if unlocked)
12. Department 4: External Affairs panel (if unlocked)
13. Leader 1 portrait [button, opens detail]
14. Leader 2 portrait
15. Leader 3 portrait (if unlocked)
16. Autonomy score gauge [informational, focusable]
17. Advance button: "Advance to Plan"
```

### Plan Mode (main content)

```
9.  Initiative card 1 [button, expands on activate]
    9a. (expanded) Oversee/Delegate toggle [radio group]
    9b. (expanded) Assign Leader dropdown [select]
    9c. (expanded) Start Initiative button
10. Initiative card 2
    10a-c. (same sub-elements)
...
N-1. Clear Plan button [button]
N.   Advance button: "Confirm Plan"
```

### Execute Mode (main content)

When an event modal is open, focus is trapped within the modal:
```
Modal:
  M1. Choice 1 [button]
  M2. Choice 2 [button]
  M3. Choice 3 [button] (if exists)
  M4. Dismiss [button] (only for ignorable events)
```

When no modal is open:
```
9.  Initiative progress panel 1 [informational, focusable]
10. Initiative progress panel 2
11. Delegation log [region, focusable for screen reader]
12. Advance button: "Advance to Review" (disabled until events resolved)
```

### Review Mode (main content)

```
9.  Resource delta summary [region, focusable]
10. Initiative outcome 1 [informational, focusable]
11. Initiative outcome 2
12. Leader change summary [region, focusable]
13. Autonomy score gauge
14. Advance button: "Begin Week [N+1]"
```

---

## Appendix B: Interaction State Matrix

Every interactive element and its visual states.

| Element | Default | Hover | Focus | Active (pressed) | Disabled | Selected/Active |
|---|---|---|---|---|---|---|
| **Primary button** | `--mode-current` bg, white text | brightness(1.15) | 2px outline `--mode-current`, 2px offset | brightness(0.9) | `--bg-lighter` bg, `--text-muted` text | N/A |
| **Secondary button** | transparent bg, `--text-primary` text, 1px `--bg-light` border | `--bg-medium` bg | 2px outline `--mode-current` | `--bg-light` bg | `--bg-lighter` border, `--text-muted` text | N/A |
| **Initiative card** | `--bg-dark` bg, 1px `--bg-light` border | `--bg-medium` bg | 2px outline `--mode-current` | N/A | `--bg-dark` bg, 0.5 opacity | `--bg-medium` bg, 2px `--mode-current` border |
| **Resource bar** | resource color fill, `--bg-light` track | brightness(1.1) on fill | 2px outline `--mode-current` | N/A | 0.3 opacity | N/A |
| **Leader portrait** | full color | subtle glow (box-shadow) | 2px outline `--mode-current` | N/A | grayscale + 0.5 opacity | 2px border in dept color |
| **Event choice card** | `--bg-medium` bg | `--bg-light` bg | 2px outline `--mode-current` | brightness(0.9) | 0.5 opacity, `--text-muted` text | N/A |
| **Dropdown (leader)** | standard select styling | browser default | 2px outline `--mode-current` | browser default | `--bg-lighter` bg, not clickable | N/A |
| **Phase stepper dot** | `--bg-lighter` (inactive) | N/A (not interactive) | N/A | N/A | N/A | `--mode-current` (active phase) |

---

## Appendix C: Responsive Breakpoint Summary

| Breakpoint | Layout | Sidebar | Resources | Phase Stepper | Cards | Event Modal |
|---|---|---|---|---|---|---|
| **1280px+** (desktop) | Sidebar + main | 200px left column | Vertical bars in sidebar | Vertical in sidebar | 2-3 column grid | Centered floating, 480px wide |
| **1024px - 1279px** (small desktop) | Sidebar + main | 180px left column | Vertical bars, compact labels | Vertical in sidebar | 2 column grid | Centered floating, 480px wide |
| **768px - 1023px** (tablet) | Stacked | Hidden — horizontal strip below header | Horizontal compact strip (tap to expand) | Horizontal bottom bar | 1-2 column grid | Centered floating, 90% width |
| **375px - 767px** (mobile) | Stacked | Hidden — bottom sheet on demand | Bottom sheet (tap "Resources" button) | Dots in bottom bar | Single column, full width | Full-screen overlay |
| **< 375px** | Not supported | — | — | — | — | — |

---

## Appendix D: Animation Timing Reference

All animation durations, for implementation consistency and reduced-motion mode.

| Animation | Duration | Easing | CSS Property | Reduced Motion |
|---|---|---|---|---|
| Mode color transition | 300ms | ease-in-out | `transition: background-color, border-color, color` | 0ms (instant) |
| Resource bar fill | 300ms | ease-out | `transition: width` | 0ms |
| Resource number count | 400ms | ease-out | JS-driven (requestAnimationFrame) | 0ms (instant set) |
| Event modal enter | 200ms | ease-out | `animation: scale(0.95→1) + opacity(0→1)` | 0ms (instant appear) |
| Event modal exit | 150ms | ease-in | `animation: opacity(1→0)` | 0ms (instant disappear) |
| Card selection border | 150ms | ease-in-out | `transition: border-color, background-color` | 0ms |
| Alert pulse | 2000ms | ease-in-out | `animation: opacity(1→0.7→1) infinite` | No animation (static) |
| Attention spend | 200ms | ease-in-out | `animation: scale(1→0.9→1)` on number | 0ms |
| Button hover | 100ms | linear | `transition: filter` or `background-color` | 0ms |
| Tooltip appear | 200ms delay + 150ms fade | ease-out | `transition: opacity` with `transition-delay` | 0ms delay, 0ms fade |
| Phase advance debounce | 500ms | N/A | JS-driven (setTimeout) | Same (functional, not visual) |
