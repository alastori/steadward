import type { RenderContext } from '../renderer';
import { getAvailableDepartments } from '../../systems/departments';
import { getAvailableLeaders } from '../../systems/leaders';
import { canStartInitiative, canAddInitiative } from '../../systems/initiatives';
import { createSeededRandom } from '../../utils/random';

export function renderPlanView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();
  const departments = getAvailableDepartments(state.departments, state.turn.week);
  const leaders = getAvailableLeaders(state.leaders, state.turn.week);
  const registry = ctx.registry;

  const view = document.createElement('div');
  view.className = 'mode-view plan-view';

  // Leader assignment
  const assignSection = document.createElement('section');
  assignSection.className = 'plan-section';
  assignSection.innerHTML = `<h2 class="section-heading">Assign Leaders</h2>`;

  for (const dept of departments) {
    const card = document.createElement('div');
    card.className = 'plan-dept-card';

    const availableLeaders = leaders.filter(
      (l) => !l.assignedDepartmentId || l.assignedDepartmentId === dept.id,
    );

    card.innerHTML = `
      <span class="plan-dept-name">${formatDeptName(dept.id)}</span>
      <select class="leader-select" data-dept="${dept.id}">
        <option value="">— Unassigned —</option>
        ${availableLeaders
          .map(
            (l) =>
              `<option value="${l.id}" ${l.assignedDepartmentId === dept.id ? 'selected' : ''}>${l.name} (F:${Math.round(l.fatigue)} T:${Math.round(l.trust)})</option>`,
          )
          .join('')}
      </select>
    `;
    // Dispatch assignment immediately on change so it survives re-renders
    const select = card.querySelector('select')!;
    select.addEventListener('change', () => {
      const deptId = select.dataset.dept!;
      const leaderId = select.value;
      const currentLeader = ctx.store.getState().departments.find((d) => d.id === deptId)?.assignedLeaderId;

      if (leaderId && leaderId !== currentLeader) {
        if (currentLeader) {
          ctx.store.dispatch({ type: 'UNASSIGN_LEADER', leaderId: currentLeader });
        }
        ctx.store.dispatch({ type: 'ASSIGN_LEADER', leaderId, departmentId: deptId });
      } else if (!leaderId && currentLeader) {
        ctx.store.dispatch({ type: 'UNASSIGN_LEADER', leaderId: currentLeader });
      }
    });

    assignSection.appendChild(card);
  }
  view.appendChild(assignSection);

  // Available initiatives with start buttons
  const initSection = document.createElement('section');
  initSection.className = 'plan-section';
  initSection.innerHTML = `<h2 class="section-heading">Available Initiatives</h2>`;

  // Already active initiative IDs
  const activeIds = new Set(state.activeInitiatives.map((i) => i.definitionId));

  // Seed-based RNG for initiative selection — same seed+week = same offerings
  const initRng = createSeededRandom(state.seed * 1000 + state.turn.week);

  for (const dept of departments) {
    const allDeptInits = registry.getInitiatives(dept.id);
    // Gate by week tags, then randomly select a subset for variety
    const eligible = allDeptInits.filter((init) => {
      // Already active initiatives are always shown
      if (activeIds.has(init.id)) return true;
      if (init.tags.includes('week-1')) return true;
      return state.turn.week >= 3;
    });
    // Show max 3 per department (plus any already active)
    const activeForDept = eligible.filter((i) => activeIds.has(i.id));
    const available = eligible.filter((i) => !activeIds.has(i.id));
    const shuffled = initRng.shuffle(available);
    const deptInits = [...activeForDept, ...shuffled.slice(0, 3)];
    const canAdd = canAddInitiative(state.activeInitiatives, dept.id);
    const deptLeader = dept.assignedLeaderId;

    for (const init of deptInits) {
      const isActive = activeIds.has(init.id);
      const meetsResources = canStartInitiative(state.resources, init.requiredResources);
      const canStart = !isActive && canAdd && meetsResources;

      const card = document.createElement('div');
      card.className = `initiative-card ${isActive ? 'initiative-card--active' : ''} ${!canStart && !isActive ? 'initiative-card--disabled' : ''}`;

      let statusHtml = '';
      if (isActive) {
        statusHtml = `<span class="init-status init-status--active">In Progress</span>`;
      } else if (!canAdd) {
        statusHtml = `<span class="init-status init-status--full">Dept Full (2/2)</span>`;
      } else if (!meetsResources) {
        const missing = Object.entries(init.requiredResources)
          .filter(([key, val]) => val !== undefined && state.resources[key as keyof typeof state.resources] < val)
          .map(([key]) => key)
          .join(', ');
        statusHtml = `<span class="init-status init-status--blocked">Need: ${missing}</span>`;
      } else {
        statusHtml = `
          <div class="init-actions">
            <button class="btn-primary init-start-btn" data-init="${init.id}" data-dept="${init.department}" data-dur="${init.duration}" data-oversee="true" data-cost="${init.attentionCost}">
              Oversee (${init.attentionCost} ATT)
            </button>
            <button class="btn-secondary init-start-btn" data-init="${init.id}" data-dept="${init.department}" data-dur="${init.duration}" data-oversee="false" data-leader="${deptLeader || ''}" data-cost="0">
              Delegate${deptLeader ? '' : ' (no leader)'}
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="init-header">
          <span class="init-name">${init.name}</span>
          <span class="init-cost">${init.attentionCost} ATT · ${init.duration}w</span>
        </div>
        <p class="init-desc">${init.description}</p>
        <div class="init-footer">
          <span class="init-dept">${formatDeptName(init.department)}</span>
          ${statusHtml}
        </div>
      `;
      initSection.appendChild(card);
    }
  }

  // Initiative start handler
  initSection.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.init-start-btn') as HTMLElement | null;
    if (!btn) return;

    const initId = btn.dataset.init!;
    const deptId = btn.dataset.dept!;
    const duration = parseInt(btn.dataset.dur!, 10);
    const overseen = btn.dataset.oversee === 'true';
    const cost = parseInt(btn.dataset.cost!, 10);
    const leaderId = btn.dataset.leader || null;

    // Spend attention for overseen initiatives
    if (overseen && cost > 0) {
      ctx.store.dispatch({ type: 'SPEND_ATTENTION', amount: cost, target: initId });
    }

    ctx.store.dispatch({
      type: 'START_INITIATIVE',
      initiativeId: initId,
      departmentId: deptId,
      leaderId: overseen ? null : leaderId,
      duration,
      overseen,
    });
  });

  view.appendChild(initSection);

  // Confirm plan button
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-primary advance-btn';
  confirmBtn.textContent = 'Confirm Plan';
  confirmBtn.addEventListener('click', () => {
    ctx.store.dispatch({ type: 'ADVANCE_PHASE' });
  });
  view.appendChild(confirmBtn);

  container.appendChild(view);
}

function formatDeptName(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
