---
name: color-palette
description: Quick-reference color palette, typography, and spacing values for Steadward. Use when implementing UI components or reviewing visual consistency.
user-invocable: false
---

# Steadward Visual Quick Reference

## Base Colors
| Token | Hex | Use |
|---|---|---|
| `--bg-darkest` | `#0D1117` | Page background |
| `--bg-dark` | `#161B22` | Panel background |
| `--bg-medium` | `#21262D` | Elevated panels, cards |
| `--border-default` | `#30363D` | Panel borders |
| `--border-subtle` | `#21262D` | Dividers |
| `--text-primary` | `#C9D1D9` | Body text |
| `--text-secondary` | `#8B949E` | Labels, metadata |
| `--text-muted` | `#484F58` | Disabled, decorative |

## Mode Accents
| Mode | Hex | Token |
|---|---|---|
| Observe | `#58A6FF` | `--mode-observe` |
| Plan | `#D2A8FF` | `--mode-plan` |
| Execute | `#F0883E` | `--mode-execute` |
| Review | `#7EE787` | `--mode-review` |

## Resource Colors
| Resource | Hex | Token |
|---|---|---|
| Materials | `#F0883E` | `--res-materials` |
| Trust | `#56D4E8` | `--res-trust` |
| Clarity | `#58A6FF` | `--res-clarity` |
| Resilience | `#5EC269` | `--res-resilience` |
| Knowledge | `#C490FF` | `--res-knowledge` |
| Momentum | `#FFD666` | `--res-momentum` |
| Attention | `#FF7B72` | `--res-attention` |

## Department Colors
| Dept | Hex | Token |
|---|---|---|
| Operations | `#F0883E` | `--dept-ops` |
| Infrastructure | `#8B949E` | `--dept-infra` |
| Research | `#D2A8FF` | `--dept-research` |
| External Affairs | `#58A6FF` | `--dept-external` |

## Alerts
| Level | Hex | Token |
|---|---|---|
| Low (ignorable) | `#FFD666` | `--alert-low` |
| Medium (pressing) | `#F0883E` | `--alert-medium` |
| High (critical) | `#F85149` | `--alert-high` |
| Positive delta | `#7EE787` | `--delta-positive` |
| Negative delta | `#F85149` | `--delta-negative` |

## Typography
| Level | Font | Size | Weight |
|---|---|---|---|
| Display | Press Start 2P | 24px | 400 |
| H1 | Press Start 2P | 18px | 400 |
| H2 | Inter | 16px | 600 |
| H3 | Inter | 14px | 600 |
| Body | Inter | 13px | 400 |
| Label | Inter | 12px | 500 |
| Caption | Inter | 11px | 400 |
| Mono | IBM Plex Mono | 12px | 400 |

## Resource Bar Thresholds
| Value | State | Visual |
|---|---|---|
| 50-100 | Healthy | Default color |
| 25-49 | Caution | Gold border (`--alert-low`) |
| 15-24 | Danger | Orange border (`--alert-medium`) |
| 10-14 | Critical | Red border + gentle pulse (`--alert-high`) |
| 0-9 | Emergency | Red fill + rapid pulse |

## Spacing
- Panel padding: 16px
- Card padding: 12px
- Gap between cards: 8px
- Border radius: 4px (panels), 2px (buttons)
