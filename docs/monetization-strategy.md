# Steadward — Monetization Strategy

**Author**: Product Strategy
**Date**: 2026-03-14
**Status**: Draft v1
**Game stage**: Pre-alpha (design doc complete, implementation not started)

**Contacts & channels**:
- **Email**: steadwardgame@gmail.com
- **X/Twitter**: [@steadwardgame](https://x.com/steadwardgame)
- **GitHub**: [alastori/steadward](https://github.com/alastori/steadward)
- **Domain** (to register): steadward.com, steadward.gg

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Recommended Monetization Model](#2-recommended-monetization-model)
3. [Revenue Streams](#3-revenue-streams)
4. [Pricing Strategy](#4-pricing-strategy)
5. [Content Expansion Opportunities](#5-content-expansion-opportunities)
6. [Platform Strategy](#6-platform-strategy)
7. [Risks and Anti-Patterns](#7-risks-and-anti-patterns)
8. [Projected Revenue Benchmarks](#8-projected-revenue-benchmarks)
9. [Launch Strategy](#9-launch-strategy)
10. [Comparable Games Reference Table](#10-comparable-games-reference-table)

---

## 1. Executive Summary

Steadward is a niche strategy game targeting an audience that overlaps with Into the Breach, Slay the Spire, and Frostpunk players. The mechanics are systems-heavy, run-based, and highly replayable. This profile strongly favors a **premium model with a free demo** over free-to-play. The attention-budget mechanic is the game's signature; any monetization that touches it would destroy the core loop.

**Recommended model**: Free web demo (5 weeks of gameplay) converting to a one-time premium purchase ($7.99-$12.99), with optional paid content expansions post-launch.

**Projected Year 1 revenue range**: $1,000-$5,600 (organic only, no Steam) to $17,000-$43,000 (with Steam launch and some press/streamer attention). Breakout scenario (Steam feature or viral moment): $117,000-$296,000.

---

## 2. Recommended Monetization Model

### Model: Premium with Free Demo (a.k.a. "Shareware 2.0")

**Why this model, not F2P or donation-ware:**

| Model | Fit for Steadward | Verdict |
|---|---|---|
| **Free-to-play with ads** | Destroys the information-dense UI. Banner ads over a dashboard game are unacceptable. Interstitial ads break the Observe-Plan-Execute-Review flow. | Reject |
| **Free-to-play with IAP** | The core resource is Attention. Selling attention points or skips would obliterate the design thesis. The game is about constraint; removing constraint for money makes it pointless. | Reject |
| **Donation-ware / tip jar** | Conversion rates for browser games are 0.5-2%. For a niche title without massive traffic, this produces $200-$2,000/year. Not sustainable. | Fallback only |
| **Subscription** | Game is session-based, not live-service. No persistent server. No reason for recurring payment. | Reject |
| **Premium (one-time purchase)** | Aligns with the target audience's buying habits (they pay $15-25 for Into the Breach, Slay the Spire, FTL). Clean value proposition. No design compromises. | **Recommended** |
| **Freemium (free core + paid extras)** | Viable variant of premium if the "free core" is generous enough to build word-of-mouth. | **Secondary option** |

### Why Premium Works for This Audience

The target player — strategy/management enthusiasts — has the highest willingness to pay among PC game demographics. Data points:

- Into the Breach: $14.99, 2M+ units sold
- Slay the Spire: $24.99, 5M+ units sold
- FTL: $9.99, 3M+ units sold
- Papers Please: $9.99, 5M+ units sold
- Beholder: $9.99, 1M+ units sold

These players do not expect games to be free. They expect polish, depth, and fair pricing.

### The Free Demo as Growth Engine

The browser-native format is Steadward's secret weapon. Unlike a Steam-only game, anyone can try Steadward with zero friction — no download, no account, no install. This means:

- Free demo on the web = viral distribution channel
- Demo plays 5 in-game weeks (enough to understand and get hooked)
- Clear paywall at the point of maximum engagement ("Your settlement is growing. Unlock the full campaign for $X.")
- Paid version can also be browser-based (unlock code / account) or a downloadable build

---

## 3. Revenue Streams

### 3.1 Primary: Base Game Sale

One-time purchase unlocking the full game beyond the demo. This is 70-85% of revenue.

### 3.2 Secondary: Content Expansions (DLC)

Post-launch paid content packs. See Section 5 for details. This is ~20% of revenue.

### 3.3 Tertiary: Soundtrack / Art Book / Digital Extras

Low-effort digital goods for superfans. Bundled as a "Supporter Pack" tier. This is 2-5% of revenue.

### 3.4 Optional: Ko-fi / Patreon During Development

Pre-launch community funding while the game is in open beta. Not a primary revenue source but builds audience and validates demand.

**What is NOT monetized:**

- Attention points or budget boosts (pay-to-win)
- Leader unlocks or stat boosts (pay-to-win)
- Cosmetic skins (wrong genre — this is an information-dense dashboard, not a character showcase)
- Loot boxes or gacha mechanics (ethically wrong for this game, audience hostile to these)
- Time-skip or wait-timer removal (there are no wait timers — game is turn-based)

---

## 4. Pricing Strategy

### Base Game Price Points by Platform

| Platform | Price | Rationale |
|---|---|---|
| **itch.io** | $7.99 (minimum $4.99 "pay what you want") | itch.io audience expects lower prices. PWYW with minimum captures whales while lowering barrier. |
| **Steam** | $9.99 | Sweet spot for indie strategy. Below the $14.99 tier of Into the Breach (which has a known studio behind it). Allows meaningful 20-30% sale discounts. |
| **Web (direct)** | $7.99 | No platform cut. 100% margin. Stripe/Paddle/Gumroad checkout. |
| **Mobile (if ported)** | $4.99 | Mobile audience has lower WTP. Premium mobile strategy is a proven niche (see: Slay the Spire mobile at $9.99, but it had brand recognition). |

### Tiered Pricing (Launch)

| Tier | Price | Includes |
|---|---|---|
| **Base Game** | $7.99-$9.99 | Full campaign, all base leaders, all base initiatives, all base events |
| **Supporter Edition** | $14.99-$17.99 | Base game + soundtrack + developer commentary mode + "Founding Coordinator" title in credits |
| **Expansion Pass** | $4.99-$6.99 | Pre-purchase of Expansions 1 & 2 at a discount (individual price: $3.99 each). Expansion 3 sold separately at $4.99. |

### Sale Strategy

- **Launch week**: 10% discount ($8.99 on Steam) to drive initial reviews
- **First major sale** (1-2 months post-launch): 20% off
- **Seasonal sales**: 30-40% off after 6 months
- **Never below $4.99** in the first year — deep discounts devalue the product and train players to wait
- **itch.io community copies**: Enable itch.io's community copy feature (every N purchases generates a free copy for someone who can't afford it) — builds goodwill, costs almost nothing

Steam refund rates for indie strategy games typically run 5-15%. Revenue projections are gross figures before refunds.

---

## 5. Content Expansion Opportunities

The game's modular design (leaders, initiatives, events, departments) is expansion-friendly. Each expansion should add meaningful strategic variety without being required for the base experience.

### Expansion 1: "New Horizons" — $3.99

**Theme**: A second biome/world with different environmental pressures.

Contents:
- 1 new scenario with modified win/loss conditions (e.g., achieve Autonomy 80 while under perpetual resource scarcity)
- 3 new leaders with unique stat distributions and personality quirks
- 8-10 new initiative cards themed to the new environment
- 5-6 new interruption events
- 1 new secondary resource (e.g., "Morale" or "Reputation") that interacts with existing systems

### Expansion 2: "The Inner Circle" — $3.99

**Theme**: Leader relationships and politics.

Contents:
- Leader relationship system (alliances, rivalries, mentorship)
- 3 new leaders with complex interpersonal dynamics
- "Council meeting" events where leaders disagree and the player must mediate
- Adds a per-leader Loyalty stat alongside the global Trust resource. Loyalty affects delegation quality and can trigger leader departures.
- New lose condition: faction split (2+ leaders leave simultaneously)

### Expansion 3: "Long Winter" — $4.99

**Theme**: Extended campaign with multi-settlement play.

Contents:
- 2-settlement management (split attention across locations)
- Supply chain mechanic between settlements
- 20+ new initiatives specific to inter-settlement coordination
- New win condition: both settlements autonomous
- Significantly increases replayability and challenge ceiling

### Free Content Updates (Between Paid Expansions)

- Balance patches
- 2-3 new events per update
- Daily/weekly challenge seeds (seeded RNG)
- Community leaderboard for challenge runs (score = weeks to autonomy)
- Quality-of-life improvements

**Rationale for free updates**: Keeps the game in the conversation, drives word-of-mouth, signals active development. Costs dev time but pays back in sustained sales.

---

## 6. Platform Strategy

### Phase 1 (Weeks 0-12): Web + itch.io (Prep & Development)

| Platform | Purpose | Revenue share |
|---|---|---|
| **steadward.com** (or subdomain) | Free demo, direct sales | 0% platform cut (only payment processor ~3%) |
| **itch.io** | Distribution, discoverability, community | 0-10% (developer chooses) |

**Why start here:**
- Zero upfront cost
- Instant distribution (browser-based = no approval process)
- itch.io has a strong indie/strategy community
- Validates demand before investing in Steam

### Phase 2 (Weeks 10-24): Steam (Prep & Development)

| Platform | Purpose | Revenue share |
|---|---|---|
| **Steam** | Primary revenue driver | 30% (drops to 25% at $10M, 20% at $50M — irrelevant for indie) |

**Why Steam matters:**
- Steam is where the target audience lives. Into the Breach, Slay the Spire, FTL — all Steam hits.
- Steam Discovery queue, tags, and recommendations are the best organic discovery channel.
- Steam wishlists convert at 10-20% on launch.
- Cost: $100 per app submission fee (one-time, recouped after ~15 sales).

**Steam page should go live as early as possible** (even during web beta) to accumulate wishlists. Target: 2,000-5,000 wishlists before Steam launch.

### Phase 3 (Weeks 24-48): Mobile (Optional)

| Platform | Purpose | Revenue share |
|---|---|---|
| **iOS App Store** | Secondary revenue, new audience | 15-30% (15% under Small Business Program if <$1M revenue) |
| **Google Play** | Secondary revenue, new audience | 15% (first $1M/year) |

**Steadward is unusually mobile-friendly** for a strategy game:
- Turn-based (no real-time pressure)
- Dashboard UI can adapt to portrait/landscape
- Session length (one weekly cycle) fits mobile play patterns
- No twitch mechanics, no hover states to rework

**But defer mobile until the game is proven on web/Steam.** Mobile porting costs time and introduces platform-specific bugs. Only worth it if web/Steam sales demonstrate demand.

All platforms launch simultaneously at Week 24. These phases describe preparation, not active sales.

### Platform Priority Matrix

| Platform | Priority | When | Expected Revenue Share |
|---|---|---|---|
| Own website | P0 | Launch | 5-10% of total |
| itch.io | P0 | Launch | 5-15% of total |
| Steam | P1 | Week 10-24 | 60-75% of total |
| iOS | P2 | Week 24-48 | 5-10% of total |
| Android | P3 | Week 36-60 | 3-5% of total |

Note: Percentages represent estimated share of total revenue at maturity. Not all platforms will be active in Year 1, so ranges will not sum to 100%.

---

## 7. Risks and Anti-Patterns

### NEVER Do These

| Anti-Pattern | Why It Would Kill Steadward |
|---|---|
| **Sell attention points** | The game IS about finite attention. Selling more is literally selling a cheat code. It undermines every design decision. |
| **Energy/stamina timers** | "You've used your 3 daily plays, wait or pay." This is hostile, un-fun, and the #1 reason strategy players avoid mobile F2P. |
| **Pay-to-skip weeks** | The game is 15-25 weeks long. Skipping content is skipping the game. |
| **Loot boxes for leaders/initiatives** | Random paid unlocks are antithetical to strategic planning. The audience actively despises these. |
| **Mandatory account creation for the demo** | Friction kills browser game conversion. Demo must be zero-friction. |
| **Aggressive pop-up upsells** | One tasteful prompt at the demo wall is fine. Repeated "BUY NOW" interruptions during gameplay will generate negative reviews and social media backlash. |
| **NFTs, blockchain, play-to-earn** | The target audience (Into the Breach / Slay the Spire players) is overwhelmingly hostile to crypto integration in games. Mentioning it would be a PR crisis. |
| **Cosmetic microtransactions** | This is a dashboard game. There's nothing meaningful to skin. Attempting this signals the developer doesn't understand their own game. |

### Risks to Monitor

| Risk | Mitigation |
|---|---|
| **Demo is too generous — players feel "done" without paying** | Demo must end at a cliffhanger moment (Week 5, right when complexity spikes). Include a visible "there are X more leaders, Y more events, and Z more scenarios in the full game" prompt. |
| **Demo is too stingy — players can't evaluate the game** | Minimum 3 full weekly cycles. Player must experience delegation, an interruption event, and at least one initiative completing. |
| **Steam reviews focus on "it's just a web game"** | The Steam build should include exclusive QoL: local save management, Steam achievements, Steam Cloud saves, perhaps a slightly enhanced visual polish pass. |
| **Price too high for perceived scope** | At $9.99, the game needs 4-8 hours of content minimum for first playthrough, with meaningful replayability. If the MVP is shorter, launch at $7.99 and raise price when content is added. |
| **Expansion fatigue** | Max 3 paid expansions in Year 1. After that, transition to a sequel or new project. Don't milk the install base. |
| **Piracy of the web version** | Browser games are inherently easy to copy. Accept this. Make the paid version convenient (cloud saves, auto-updates, achievement tracking). Piracy is not lost sales — most pirates wouldn't have paid. Some will convert later. |

---

## 8. Projected Revenue Benchmarks

### Disclaimer

These projections assume a solo developer with no existing audience. Numbers shift dramatically with an established following, streamer coverage, or press features.

### Scenario A: Modest (No Breakout, Organic Only)

| Metric | Value |
|---|---|
| Demo plays (Year 1) | 5,000-15,000 |
| Demo-to-purchase conversion | 3-5% |
| Paid units (Year 1) | 150-750 |
| Average revenue per unit (after platform cuts) | $6.50 |
| **Gross revenue (Year 1)** | **$1,000-$5,000** |
| Expansion upsell (20% of buyers) | $150-$600 |
| **Total Year 1** | **$1,150-$5,600** |

This is the "hobby project that covers hosting costs" scenario.

### Scenario B: Moderate (Some Press/Streamer Attention, Steam Launch)

| Metric | Value |
|---|---|
| Steam wishlists at launch | 2,000-5,000 |
| Steam launch week sales | 400-1,000 |
| Long-tail Steam sales (Year 1) | 1,500-4,000 |
| Web/itch.io sales | 200-600 |
| Total paid units (Year 1) | 2,100-5,600 |
| Average revenue per unit | $6.50 |
| **Gross revenue (Year 1)** | **$14,000-$36,000** |
| Expansion revenue | $2,800-$7,200 |
| **Total Year 1** | **$16,800-$43,200** |

This is the "sustainable side project / ramen-profitable solo dev" scenario.

### Scenario C: Breakout (Featured on Steam, Streamer Viral Moment)

| Metric | Value |
|---|---|
| Steam wishlists at launch | 10,000-30,000 |
| Steam launch week sales | 3,000-8,000 |
| Long-tail Steam sales (Year 1) | 10,000-25,000 |
| Web/itch.io/mobile sales | 2,000-5,000 |
| Total paid units (Year 1) | 15,000-38,000 |
| Average revenue per unit | $6.50 |
| **Gross revenue (Year 1)** | **$97,500-$247,000** |
| Expansion revenue | $19,500-$49,400 |
| **Total Year 1** | **$117,000-$296,400** |

This is the "Into the Breach at launch" scenario. It requires either press coverage, a popular streamer/YouTuber playing the game, or a Steam feature. It is not the base case.

### Comparable Indie Revenue Data Points

| Game | Genre | Price | Approx. Units (Lifetime) | Notes |
|---|---|---|---|---|
| **Luck be a Landlord** | Roguelike/strategy | $9.99 | 500K+ | Solo dev, browser prototype led to Steam hit |
| **Dome Keeper** | Management/roguelike | $16.99 | 300K+ | Small team, Steam-first |
| **Stacklands** | Card/management | $4.99 | 500K+ | Solo dev, low price + high volume |
| **Loop Hero** | Strategy/idle | $14.99 | 1M+ | Small team, publisher (Devolver) |
| **Vampire Survivors** | Roguelike (different genre but relevant trajectory) | $4.99 | 6M+ | Solo dev, browser → Steam pipeline |

The **Luck be a Landlord** trajectory is the most relevant comp: browser prototype builds audience, Steam launch captures revenue.

---

## 9. Launch Strategy

### Timeline (Revised per Growth PM Review)

```
Week 0-8:     BUILD — Phase 1-4 (skeleton + types + data + core systems)
              Analytics wired from Phase 2. OG meta tags from Phase 1.
Week 6:       GAME JAMS — Submit to 1-2 itch.io jams with minimal UI prototype
Week 8-12:    BUILD — Phase 5-6 (UI shell + mode views)
Week 10:      STEAM PAGE LIVE — $100 fee, 4-6 screenshots, GIF, description
              Start wishlist accumulation immediately (moved up from Month 4)
Week 12:      CLOSED ALPHA — 20-50 players, analytics + email capture live
Week 12-16:   OPEN BETA — Free demo on itch.io, bi-weekly devlogs, Reddit
Week 16:      Apply for STEAM NEXT FEST (next available window)
              Begin press/streamer outreach (4-6 weeks before fest)
Week 18-20:   STEAM NEXT FEST — Target 2,000-5,000 wishlists
Week 20-24:   POLISH — Balance, NW.js Steam packaging, share card, demo wall
Week 24:      LAUNCH — Simultaneous on itch.io (paid), web (paid), Steam
              10% launch week discount. Email blast. Coordinated Reddit posts.
Week 26-28:   Post-launch patches, respond to every Steam review
Week 32:      Free content update (new events, challenge seeds, leaderboard)
Week 36:      EXPANSION 1 — "New Horizons" (if base revenue justifies it)
Week 44:      EXPANSION 2 — "The Inner Circle"
Week 48:      YEAR-IN-REVIEW — Evaluate mobile port, sequel potential
```

Key changes from initial plan:
- **Steam page at Week 10**, not Month 4 — 6+ extra weeks of wishlist accumulation
- **Steam Next Fest explicitly scheduled** — highest-leverage marketing event for indie Steam games
- **Game jams at Week 6** — early discovery and feedback before the game is polished
- **Simultaneous launch** across all platforms — staggering dilutes the launch spike and confuses the Steam algorithm

### Pre-Launch Audience Building

**Goal**: 2,000-5,000 Steam wishlists and 500-1,000 email subscribers by launch day.

Tactics:

1. **Free web demo from Day 1 of open beta.** The demo IS the marketing. Every play is a potential conversion.

2. **Devlog on itch.io** — Regular updates (biweekly) showing development progress. itch.io devlogs appear in follower feeds and can trend on the platform.

3. **Reddit presence** — Target subreddits:
   - r/BaseBuildingGames
   - r/StrategyGames
   - r/IndieGaming
   - r/WebGames
   - r/gamedev (for devlog posts)
   - Post the free demo as a "Feedback Friday" or "Screenshot Saturday" entry.

4. **Strategy game Discord servers** — Join and participate genuinely before promoting.

5. **YouTube/Twitch outreach** — Identify 10-20 small-to-mid strategy game content creators (1K-50K subscribers). Send a personalized email from steadwardgame@gmail.com with a free key and a 1-paragraph pitch. Target creators who cover Into the Breach, Slay the Spire, or Frostpunk.

6. **Email list** — Capture emails on the demo page ("Get notified when the full game launches"). Use a simple Buttondown or Mailchimp list linked to steadwardgame@gmail.com. This is the highest-conversion channel on launch day.

7. **X/Twitter** — Post devlog updates, GIFs of gameplay, and Screenshot Saturday entries from [@steadwardgame](https://x.com/steadwardgame). Cross-promote from personal account.

8. **Steam "Coming Soon" page** — Should include:
   - A 30-second GIF or trailer showing the core loop
   - 4-6 screenshots of the UI in different modes
   - Clear description of the core mechanic (attention as a resource)
   - Tags: Strategy, Management, Turn-Based, Indie, Roguelike (if run-based), Card Game (if initiative cards are prominent)

### Launch Day Tactics

- **Steam launch discount**: 10% off for the first week
- **Email blast**: "The game you've been testing is now available" to all beta testers
- **Reddit posts**: Coordinated posts on 3-4 subreddits (space them out, don't spam)
- **Press release**: Send to IndieGamesPlus, Rock Paper Shotgun indie section, PC Gamer indie roundup
- **Update the free demo**: Demo should now show "Full Game Available" with a purchase link at the demo paywall

### Post-Launch Retention

- **Weekly challenge runs** (seeded RNG) — Free, keeps players engaged and sharing scores
- **Balance patches** every 2-3 weeks for the first 2 months
- **Respond to every Steam review** (positive and negative) in the first month — this signals active development and boosts review sentiment
- **Community feedback loop** — Track most-requested features, implement 2-3 of them as free updates before the first paid expansion

---

## 10. Comparable Games Reference Table

| Game | Model | Base Price | Expansions | Browser Version | Notes for Steadward |
|---|---|---|---|---|---|
| **Into the Breach** | Premium | $14.99 | 1 free major update | No | Closest design comp. Proves strategy gamers pay premium. |
| **Slay the Spire** | Premium | $24.99 | Paid sequel | No | Proves card-based strategy has legs. |
| **FTL** | Premium | $9.99 | 1 free expansion | No | Proves management-under-pressure works at $9.99. |
| **Luck be a Landlord** | Premium | $9.99 | None yet | Yes (prototype) | Best trajectory comp: browser demo to Steam. |
| **Stacklands** | Premium | $4.99 | Paid expansion ($3.99) | No | Proves low price + expansion model for card/management. |
| **Papers, Please** | Premium | $9.99 | None | No | Proves dashboard/UI-heavy games sell at $9.99. |
| **Vampire Survivors** | Premium | $4.99 | 4 paid DLC ($1.99 each) | Yes (prototype) | Proves browser-to-Steam pipeline at scale. |
| **Dome Keeper** | Premium | $16.99 | Paid DLC | No | Proves niche management at higher price point. |

---

## Key Decisions for the Developer

These are the critical calls that need to be made. Everything else follows from these:

1. **Are you optimizing for revenue or audience?** If audience: free or very cheap ($2.99). If revenue: $7.99-$9.99 premium.

2. **Will you invest in a Steam release?** Steam is 60-75% of revenue for indie games in this genre. Without Steam, realistic Year 1 revenue ceiling is ~$5,000-$10,000 unless the game goes viral.

3. **How generous is the demo?** Recommendation: 5 in-game weeks (enough for 2-3 sessions). This is the single most important conversion optimization decision.

4. **Are you willing to do marketing work?** The best game in the world with zero marketing makes zero dollars. Budget 20-30% of development time for community building, devlogs, and outreach.

5. **What's your minimum viable revenue?** If the answer is "$0 — this is a passion project," consider launching free with a tip jar and revisiting monetization when you have player data. If the answer is "needs to generate income," commit to the premium model and the Steam release from Day 1.

---

## Appendix: Quick-Reference Decision Matrix

```
IF game scope is < 4 hours first playthrough:
    Price at $4.99-$6.99
    Launch on itch.io + web only
    Consider Steam later

IF game scope is 4-8 hours first playthrough with replayability:
    Price at $7.99-$9.99
    Launch on itch.io + web + Steam
    Plan 1-2 expansions

IF game scope is 8+ hours with high replayability:
    Price at $9.99-$14.99
    Launch on Steam as primary platform
    Plan 2-3 expansions
    Consider mobile port

IF you have an existing audience (> 5K followers / 3K wishlists):
    Add $2-3 to all price points
    Launch with Supporter Edition tier
    Pre-sell expansion pass
```
