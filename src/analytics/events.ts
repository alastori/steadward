export type AnalyticsEvent =
  | { name: 'game_start'; props: { seed: number; edition: string } }
  | { name: 'week_complete'; props: { week: number; autonomyScore: number } }
  | { name: 'demo_wall_hit'; props: { week: number; autonomyScore: number } }
  | { name: 'purchase_clicked'; props: { source: string } }
  | { name: 'phase_advance'; props: { phase: string; week: number } };
