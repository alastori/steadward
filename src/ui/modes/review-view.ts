import type { RenderContext } from '../renderer';
import { calculateAutonomyScore, checkWinCondition, checkLossCondition } from '../../systems/scoring';

export function renderReviewView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();
  const balance = ctx.registry.getBalance();
  const autonomy = calculateAutonomyScore(state, balance);

  const view = document.createElement('div');
  view.className = 'mode-view review-view';

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

  // Check win/loss
  const { won } = checkWinCondition(autonomy, state.autonomyStreakWeeks);
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
    ctx.store.dispatch({ type: 'TICK_WEEK' });
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
