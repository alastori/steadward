import type { RenderContext } from '../renderer';
import { getAvailableDepartments } from '../../systems/departments';
import { getAvailableLeaders } from '../../systems/leaders';

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
    assignSection.appendChild(card);
  }
  view.appendChild(assignSection);

  // Available initiatives
  const initSection = document.createElement('section');
  initSection.className = 'plan-section';
  initSection.innerHTML = `<h2 class="section-heading">Available Initiatives</h2>`;

  for (const dept of departments) {
    const deptInits = registry.getInitiatives(dept.id);
    for (const init of deptInits) {
      const card = document.createElement('div');
      card.className = 'initiative-card';
      card.innerHTML = `
        <div class="init-header">
          <span class="init-name">${init.name}</span>
          <span class="init-cost">${init.attentionCost} ATT · ${init.duration}w</span>
        </div>
        <p class="init-desc">${init.description}</p>
        <span class="init-dept">${formatDeptName(init.department)}</span>
      `;
      initSection.appendChild(card);
    }
  }
  view.appendChild(initSection);

  // Confirm plan button
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-primary advance-btn';
  confirmBtn.textContent = 'Confirm Plan';
  confirmBtn.addEventListener('click', () => {
    // Apply leader assignments from selects
    const selects = view.querySelectorAll<HTMLSelectElement>('.leader-select');
    for (const select of selects) {
      const deptId = select.dataset.dept!;
      const leaderId = select.value;
      const currentLeader = state.departments.find((d) => d.id === deptId)?.assignedLeaderId;

      if (leaderId && leaderId !== currentLeader) {
        ctx.store.dispatch({ type: 'ASSIGN_LEADER', leaderId, departmentId: deptId });
      } else if (!leaderId && currentLeader) {
        ctx.store.dispatch({ type: 'UNASSIGN_LEADER', leaderId: currentLeader });
      }
    }
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
