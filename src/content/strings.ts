/**
 * Centralized player-facing strings. All UI copy goes through t(key)
 * for future localization support. When localization is needed, swap
 * the lookup to load locale-specific string tables.
 */

const strings: Record<string, string> = {
  // Phases
  'phase.observe.title': 'Observe',
  'phase.observe.description': 'Survey your settlement. Review resource trends and department health.',
  'phase.plan.title': 'Plan',
  'phase.plan.description': 'Assign leaders, start initiatives, and allocate your attention.',
  'phase.execute.title': 'Execute',
  'phase.execute.description': 'Initiatives progress. Events interrupt. Spend attention where it matters.',
  'phase.review.title': 'Review',
  'phase.review.description': 'See what changed. Assess autonomy. Prepare for next week.',

  // Buttons
  'button.new_game': 'New Game',
  'button.advance_observe': 'Advance to Plan',
  'button.confirm_plan': 'Confirm Plan',
  'button.advance_execute': 'Advance to Review',
  'button.begin_week': 'Begin Next Week',
  'button.share': 'Share Run',
  'button.challenge': 'Challenge a Friend',
  'button.play_again': 'Play Again',

  // Header
  'header.attention_label': 'Attention remaining',
  'header.autonomy_label': 'Autonomy score — sustain 80+ for 3 weeks to win',

  // Resources
  'resource.materials': 'Materials',
  'resource.trust': 'Trust',
  'resource.clarity': 'Clarity',
  'resource.resilience': 'Resilience',
  'resource.knowledge': 'Knowledge',
  'resource.momentum': 'Momentum',

  'resource.materials.tip': 'Construction and repair supplies. Consumed by initiatives and events. Healthy departments (70+) generate +2/week.',
  'resource.trust.tip': 'How much the settlement trusts your leadership. Drops to 0 = game over.',
  'resource.clarity.tip': 'Understanding of your situation. Affects weekly attention budget (+/- 1 ATT per 10 points from 50).',
  'resource.resilience.tip': 'Ability to absorb shocks. Drops to 0 = game over.',
  'resource.knowledge.tip': 'Accumulated understanding of Sable. Required for research initiatives.',
  'resource.momentum.tip': 'Forward progress and morale. Drops to 0 = game over.',

  // Departments
  'dept.operations': 'Operations',
  'dept.infrastructure': 'Infrastructure',
  'dept.research': 'Research',
  'dept.external-affairs': 'External Affairs',

  // Leaders
  'leader.unassigned': 'Unassigned',
  'leader.available': 'Available',

  // Initiatives
  'init.oversee': 'Oversee',
  'init.delegate': 'Delegate',
  'init.in_progress': 'In Progress',
  'init.dept_full': 'Dept Full',
  'init.insufficient': 'Insufficient',
  'init.no_leader': 'no leader',
  'init.outcome.overseen': 'Overseen',
  'init.outcome.success': 'Success',
  'init.outcome.partial': 'Partial',
  'init.outcome.failure': 'Failure',

  // Events
  'event.resolved': 'Resolved',

  // Review
  'review.autonomy_score': 'Autonomy Score',
  'review.autonomy_streak': 'Autonomy Streak',
  'review.attention_used': 'Attention Used',
  'review.resource_changes': 'Resource Changes',
  'review.dept_status': 'Department Status',
  'review.leader_status': 'Leader Status',
  'review.completed': 'Completed This Week',

  // Outcomes
  'outcome.win': 'Autonomy sustained for 3 weeks. The settlement stands on its own.',
  'outcome.loss': 'A critical resource has been depleted. The settlement cannot recover.',
  'outcome.win_title': 'AUTONOMY ACHIEVED',
  'outcome.loss_title': 'SETTLEMENT FAILED',

  // Demo wall
  'demo.title': 'END OF DEMO',
  'demo.email_label': 'Get notified when Steadward launches:',
  'demo.email_thanks': "Thanks. We'll let you know.",
  'demo.cta': 'Get the Full Game',

  // Briefing
  'briefing.1.label': 'TRANSFER NOTICE',
  'briefing.1.p1': 'Steadward settlement, planet Sable. Population 200. Functional infrastructure. No functional governance.',
  'briefing.1.p2': "The founders built this place. They didn't build a system to run it without them.",
  'briefing.1.p3': "That's your job now.",
  'briefing.2.label': 'SITUATION REPORT',
  'briefing.2.p1': 'Four departments. Five leaders. Limited attention. Every week follows the same cycle: observe, plan, execute, review.',
  'briefing.2.p2': 'You have ten attention points per week. Spend them on what matters. Delegate the rest.',
  'briefing.2.p3': "The settlement doesn't need a hero. It needs a system that works when you're not watching.",
  'briefing.3.label': 'STANDING ORDERS',
  'briefing.3.p1': 'Build autonomy. When the settlement can sustain itself for three consecutive weeks, your work here is done.',
  'briefing.3.p2': "If trust collapses or any critical resource runs dry, it's over.",
  'briefing.3.secondary': 'Week 1. Two departments online. Two leaders on site. Begin when ready.',
  'briefing.continue': 'Continue',
  'briefing.begin': 'Begin Week 1',

  // Save/Load
  'save.title': 'Save / Load',
  'save.close': 'Close',
  'save.no_saves': 'No saves yet.',
  'save.export': 'Export JSON',
  'save.import': 'Import JSON',

  // Debug
  'debug.ready': 'Debug panel ready. Type __cheat.help() for commands.',
};

/** Look up a string by key. Returns `[missing: key]` if not found. */
export function t(key: string): string {
  return strings[key] ?? `[missing: ${key}]`;
}
