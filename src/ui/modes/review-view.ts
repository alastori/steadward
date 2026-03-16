import type { RenderContext } from '../renderer';
import { renderHintBanner } from '../components/hint-banner';
import type { Resources, ResourceType } from '../../types/resources';
import { RESOURCE_TYPES } from '../../types/resources';
import { calculateAutonomyScore, checkWinCondition, checkLossCondition } from '../../systems/scoring';
import { calculateAttentionBudget } from '../../systems/attention';
import { tickDepartmentHealth } from '../../systems/departments';
import { tickLeaderFatigue, growTrust, decayTrust } from '../../systems/leaders';
import { tickInitiatives } from '../../systems/initiatives';
import { drawEvents, createActiveEvents } from '../../systems/events';
import { calculateDelegationQuality, applyDecisionStyleVariance, getDelegationOutcome, scaleEffects } from '../../systems/delegation';
import { createSeededRandom } from '../../utils/random';

const RESOURCE_LABELS: Record<ResourceType, string> = {
  materials: 'Materials',
  trust: 'Trust',
  clarity: 'Clarity',
  resilience: 'Resilience',
  knowledge: 'Knowledge',
  momentum: 'Momentum',
};

export function renderReviewView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();
  const balance = ctx.registry.getBalance();
  const autonomy = calculateAutonomyScore(state, balance);

  const view = document.createElement('div');
  view.className = 'mode-view review-view';

  renderHintBanner(view, ctx.store);

  // Week summary
  const summary = document.createElement('section');
  summary.className = 'review-section';
  summary.innerHTML = `
    <h2 class="section-heading">Week ${state.turn.week} Review</h2>
    <div class="review-stats">
      <div class="review-stat">
        <span class="review-stat-label">Autonomy Score</span>
        <span class="review-stat-value review-stat--autonomy">${autonomy}</span>
      </div>
      <div class="review-stat">
        <span class="review-stat-label">Autonomy Streak</span>
        <span class="review-stat-value">${state.autonomyStreakWeeks} / 3 weeks</span>
      </div>
      <div class="review-stat">
        <span class="review-stat-label">Attention Used</span>
        <span class="review-stat-value">${state.attention.budget - state.attention.remaining} / ${state.attention.budget}</span>
      </div>
    </div>
  `;
  view.appendChild(summary);

  // Resource deltas
  if (state.previousResources) {
    const deltaSection = document.createElement('section');
    deltaSection.className = 'review-section';
    deltaSection.innerHTML = `<h2 class="section-heading">Resource Changes</h2>`;
    for (const key of RESOURCE_TYPES) {
      const current = state.resources[key];
      const prev = state.previousResources[key];
      const delta = current - prev;
      if (delta === 0) continue;
      const sign = delta > 0 ? '+' : '';
      const cls = delta > 0 ? 'delta-positive' : 'delta-negative';
      const row = document.createElement('div');
      row.className = 'review-delta-row';
      row.innerHTML = `
        <span class="review-delta-label">${RESOURCE_LABELS[key]}</span>
        <span class="review-delta-value ${cls}">${sign}${delta}</span>
        <span class="review-delta-current">${current}</span>
      `;
      deltaSection.appendChild(row);
    }
    view.appendChild(deltaSection);
  }

  // Completed initiative outcomes with narrative text
  if (state.lastCompletedInitiatives.length > 0) {
    const compSection = document.createElement('section');
    compSection.className = 'review-section';
    compSection.innerHTML = `<h2 class="section-heading">Completed This Week</h2>`;
    for (const comp of state.lastCompletedInitiatives) {
      const def = ctx.registry.getInitiative(comp.definitionId);
      if (!def) continue;
      const leader = comp.leaderId
        ? state.leaders.find((l) => l.id === comp.leaderId)
        : null;
      const outcomeText = comp.overseen
        ? def.outcomeOverseen.description
        : comp.outcome === 'success'
          ? def.outcomeDelegated.description
          : comp.outcome === 'partial' && def.outcomeDelegated.descriptionPartial
            ? def.outcomeDelegated.descriptionPartial
            : comp.outcome === 'failure' && def.outcomeDelegated.descriptionFailure
              ? def.outcomeDelegated.descriptionFailure
              : def.outcomeDelegated.description;
      const outcomeLabel = comp.overseen ? 'Overseen' : comp.outcome.charAt(0).toUpperCase() + comp.outcome.slice(1);
      const outcomeClass = comp.outcome === 'success' || comp.overseen ? 'outcome--success' : comp.outcome === 'failure' ? 'outcome--failure' : 'outcome--partial';

      const card = document.createElement('div');
      card.className = `review-completed-card ${outcomeClass}`;
      card.innerHTML = `
        <div class="completed-header">
          <span class="completed-name">${def.name}</span>
          <span class="completed-outcome">${outcomeLabel}${leader ? ` — ${leader.name}` : ''}</span>
        </div>
        <p class="completed-text">${outcomeText}</p>
      `;
      compSection.appendChild(card);
    }
    view.appendChild(compSection);
  }

  // Department summary
  const deptSection = document.createElement('section');
  deptSection.className = 'review-section';
  deptSection.innerHTML = `<h2 class="section-heading">Department Status</h2>`;
  for (const dept of state.departments) {
    if (dept.unlockedAtWeek > state.turn.week) continue;
    const row = document.createElement('div');
    row.className = 'review-dept-row';
    row.innerHTML = `
      <span class="review-dept-name">${formatDeptName(dept.id)}</span>
      <span class="review-dept-health">${dept.health}</span>
    `;
    deptSection.appendChild(row);
  }
  view.appendChild(deptSection);

  // Leader fatigue summary (read-only — rest is in Plan phase)
  const leaderSection = document.createElement('section');
  leaderSection.className = 'review-section';
  leaderSection.innerHTML = `<h2 class="section-heading">Leader Status</h2>`;
  for (const leader of state.leaders) {
    if (leader.availableAtWeek > state.turn.week) continue;
    const fatigueLevel = leader.fatigue >= 60 ? 'high' : leader.fatigue >= 30 ? 'mid' : 'low';
    const row = document.createElement('div');
    row.className = 'review-leader-row';
    row.innerHTML = `
      <span class="review-leader-name">${leader.name}</span>
      <span class="review-leader-fatigue fatigue--${fatigueLevel}">F:${Math.round(leader.fatigue)}</span>
      <span class="review-leader-trust">T:${Math.round(leader.trust)}</span>
    `;
    leaderSection.appendChild(row);
  }
  view.appendChild(leaderSection);

  // Check win/loss
  const { won, newStreak } = checkWinCondition(autonomy, state.autonomyStreakWeeks);
  const lost = checkLossCondition(state.resources);

  if (won) {
    const winMsg = document.createElement('div');
    winMsg.className = 'review-outcome review-outcome--win';
    winMsg.textContent = 'Autonomy sustained for 3 weeks. The settlement stands on its own.';
    view.appendChild(winMsg);
  } else if (lost) {
    const loseMsg = document.createElement('div');
    loseMsg.className = 'review-outcome review-outcome--loss';
    loseMsg.textContent = 'A critical resource has been depleted. The settlement cannot recover.';
    view.appendChild(loseMsg);
  }

  // Begin next week
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-primary advance-btn';
  nextBtn.textContent = 'Begin Next Week';
  nextBtn.addEventListener('click', () => {
    const leaderDefs = ctx.registry.getLeaders();

    // Tick departments (health + passive materials)
    const { departments: tickedDepts, materialsGenerated } = tickDepartmentHealth(state.departments, balance);

    // Tick leaders (fatigue)
    let tickedLeaders = tickLeaderFatigue(state.leaders, leaderDefs, balance);

    // Tick initiatives and resolve completed ones
    const { active: remainingInits, completed } = tickInitiatives(state.activeInitiatives);
    let completedEffects: Partial<Resources> = {};
    const completedRecords: Array<{
      definitionId: string;
      leaderId: string | null;
      overseen: boolean;
      outcome: 'success' | 'partial' | 'failure' | 'overseen';
    }> = [];

    for (const init of completed) {
      const def = ctx.registry.getInitiative(init.definitionId);
      if (!def) continue;

      if (init.overseen) {
        completedEffects = mergeEffects(completedEffects, def.outcomeOverseen.resourceEffects);
        completedRecords.push({
          definitionId: init.definitionId,
          leaderId: null,
          overseen: true,
          outcome: 'overseen',
        });
      } else {
        const leader = tickedLeaders.find((l) => l.id === init.assignedLeaderId);
        const leaderDef = leaderDefs.find((d) => d.id === init.assignedLeaderId);
        if (leader && leaderDef) {
          const baseQuality = calculateDelegationQuality(
            leaderDef.stats,
            leader.fatigue,
            leader.trust,
            balance.delegationQualityWeights,
          );
          const varianceRng = createSeededRandom(
            state.seed + state.turn.week * 100 +
            leader.id.charCodeAt(leader.id.length - 1) +
            init.definitionId.charCodeAt(init.definitionId.length - 1),
          );
          const quality = applyDecisionStyleVariance(
            baseQuality,
            leaderDef.tendencies.autonomousDecisionStyle,
            varianceRng.next(),
          );
          const outcome = getDelegationOutcome(quality);
          const scaled = scaleEffects(
            def.outcomeDelegated.resourceEffects as Record<string, number>,
            outcome,
          );
          completedEffects = mergeEffects(completedEffects, scaled as Partial<Resources>);
          completedRecords.push({
            definitionId: init.definitionId,
            leaderId: init.assignedLeaderId,
            overseen: false,
            outcome,
          });

          tickedLeaders = tickedLeaders.map((l) => {
            if (l.id !== init.assignedLeaderId) return l;
            if (outcome === 'success' || outcome === 'partial') {
              return growTrust(l, leaderDef, balance);
            } else {
              return decayTrust(l, balance.trustGrowthBase);
            }
          });
        } else {
          completedEffects = mergeEffects(completedEffects, def.outcomeDelegated.resourceEffects);
          completedRecords.push({
            definitionId: init.definitionId,
            leaderId: init.assignedLeaderId,
            overseen: false,
            outcome: 'partial',
          });
        }
      }
    }

    // Add passive materials from healthy departments
    if (materialsGenerated > 0) {
      completedEffects = mergeEffects(completedEffects, { materials: materialsGenerated });
    }

    // Clean up completed initiative IDs from departments
    const completedIds = new Set(completed.map((c) => c.definitionId));
    const cleanedDepts = tickedDepts.map((d) => ({
      ...d,
      activeInitiativeIds: d.activeInitiativeIds.filter((id) => !completedIds.has(id)),
    }));

    // Draw events for next week (excluding already-fired events)
    const rng = createSeededRandom(state.seed + state.turn.week);
    const nextWeekState = {
      ...state,
      turn: { ...state.turn, week: state.turn.week + 1 },
    };
    const eventDefs = drawEvents(ctx.registry.getEvents(), nextWeekState, rng, 2);
    const drawnEvents = createActiveEvents(eventDefs);
    const newFiredEventIds = [
      ...state.firedEventIds,
      ...eventDefs.map((e) => e.id),
    ];

    // Calculate new attention budget
    const newBudget = calculateAttentionBudget(state.resources.clarity, balance);

    // Determine outcome
    let outcome: 'win' | 'loss' | null = null;
    if (won) outcome = 'win';
    else if (lost) outcome = 'loss';

    ctx.store.dispatch({
      type: 'TICK_WEEK',
      departments: cleanedDepts,
      leaders: tickedLeaders,
      activeInitiatives: remainingInits,
      completedInitiativeEffects: completedEffects,
      drawnEvents,
      newFiredEventIds,
      completedInitiatives: completedRecords,
      newAttentionBudget: newBudget,
      autonomyScore: autonomy,
      autonomyStreakWeeks: autonomy >= 80 ? newStreak : 0,
      outcome,
    });
    ctx.store.dispatch({ type: 'ADVANCE_PHASE' });
  });
  view.appendChild(nextBtn);

  container.appendChild(view);
}

function formatDeptName(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function mergeEffects(a: Partial<Resources>, b: Partial<Resources>): Partial<Resources> {
  const result = { ...a };
  for (const [key, value] of Object.entries(b)) {
    if (value !== undefined) {
      result[key as keyof Resources] = ((result[key as keyof Resources] as number) ?? 0) + value;
    }
  }
  return result;
}
