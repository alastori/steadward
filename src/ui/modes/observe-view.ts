import type { RenderContext } from '../renderer';
import { getAvailableDepartments } from '../../systems/departments';
import { getAvailableLeaders } from '../../systems/leaders';
import { renderHintBanner } from '../components/hint-banner';

export function renderObserveView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();
  const departments = getAvailableDepartments(state.departments, state.turn.week);
  const leaders = getAvailableLeaders(state.leaders, state.turn.week);

  const view = document.createElement('div');
  view.className = 'mode-view observe-view';

  renderHintBanner(view, ctx.store);

  // Locked departments (future unlocks)
  const allDepts = state.departments;
  const lockedDepts = allDepts.filter((d) => d.unlockedAtWeek > state.turn.week);

  // Department overview
  const deptSection = document.createElement('section');
  deptSection.className = 'observe-section';
  deptSection.innerHTML = `<h2 class="section-heading">Department Health</h2>`;
  for (const dept of departments) {
    const leaderName = dept.assignedLeaderId
      ? leaders.find((l) => l.id === dept.assignedLeaderId)?.name ?? 'Unassigned'
      : 'Unassigned';
    const card = document.createElement('div');
    card.className = 'dept-card';
    card.innerHTML = `
      <div class="dept-card-header">
        <span class="dept-name">${formatDeptName(dept.id)}</span>
        <span class="dept-health">${dept.health}</span>
      </div>
      <div class="dept-bar-track">
        <div class="dept-bar-fill" style="width: ${dept.health}%"></div>
      </div>
      <span class="dept-leader">${leaderName}</span>
    `;
    deptSection.appendChild(card);
  }
  // Locked departments
  for (const dept of lockedDepts) {
    const card = document.createElement('div');
    card.className = 'dept-card dept-card--locked';
    card.innerHTML = `
      <div class="dept-card-header">
        <span class="dept-name">${formatDeptName(dept.id)}</span>
      </div>
      <span class="dept-unlock-label">Available Week ${dept.unlockedAtWeek}</span>
    `;
    deptSection.appendChild(card);
  }
  view.appendChild(deptSection);

  // Leader status
  const leaderSection = document.createElement('section');
  leaderSection.className = 'observe-section';
  leaderSection.innerHTML = `<h2 class="section-heading">Leader Status</h2>`;
  for (const leader of leaders) {
    const card = document.createElement('div');
    card.className = 'leader-status-card';
    card.innerHTML = `
      <span class="leader-name">${leader.name}</span>
      <div class="leader-stats-row">
        <span class="leader-stat">Fatigue: ${Math.round(leader.fatigue)}</span>
        <span class="leader-stat">Trust: ${Math.round(leader.trust)}</span>
      </div>
      <span class="leader-assignment">${leader.assignedDepartmentId ? formatDeptName(leader.assignedDepartmentId) : 'Available'}</span>
    `;
    leaderSection.appendChild(card);
  }
  view.appendChild(leaderSection);

  // Advance button
  const advanceBtn = document.createElement('button');
  advanceBtn.className = 'btn-primary advance-btn';
  advanceBtn.textContent = 'Advance to Plan';
  advanceBtn.addEventListener('click', () => {
    ctx.store.dispatch({ type: 'ADVANCE_PHASE' });
  });
  view.appendChild(advanceBtn);

  container.appendChild(view);
}

function formatDeptName(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
