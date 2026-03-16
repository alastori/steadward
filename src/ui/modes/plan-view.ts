import type { RenderContext } from '../renderer';
import type { Department } from '../../types/departments';
import { getAvailableDepartments } from '../../systems/departments';
import { getAvailableLeaders } from '../../systems/leaders';
import { canStartInitiative, canAddInitiative } from '../../systems/initiatives';
import { createSeededRandom } from '../../utils/random';
import { renderHintBanner } from '../components/hint-banner';

export function renderPlanView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();
  const departments = getAvailableDepartments(state.departments, state.turn.week);
  const leaders = getAvailableLeaders(state.leaders, state.turn.week);
  const registry = ctx.registry;
  const activeIds = new Set(state.activeInitiatives.map((i) => i.definitionId));
  const initRng = createSeededRandom(state.seed * 1000 + state.turn.week);

  const view = document.createElement('div');
  view.className = 'mode-view plan-view';

  renderHintBanner(view, ctx.store);

  // Kanban board
  const board = document.createElement('div');
  board.className = 'plan-board';
  board.style.setProperty('--plan-cols', String(departments.length));

  for (const dept of departments) {
    const column = createDeptColumn(dept, ctx, state, leaders, registry, activeIds, initRng);
    board.appendChild(column);
  }

  view.appendChild(board);

  // Confirm Plan button
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-primary plan-confirm-btn';
  confirmBtn.textContent = 'Confirm Plan';
  confirmBtn.addEventListener('click', () => {
    ctx.store.dispatch({ type: 'ADVANCE_PHASE' });
  });
  view.appendChild(confirmBtn);

  container.appendChild(view);
}

function createDeptColumn(
  dept: Department,
  ctx: RenderContext,
  state: import('../../types/game-state').GameState,
  leaders: import('../../types/leaders').Leader[],
  registry: import('../../content/registry').ContentRegistry,
  activeIds: Set<string>,
  initRng: import('../../utils/random').SeededRandom,
): HTMLElement {
  const column = document.createElement('div');
  column.className = 'plan-column';
  column.dataset.dept = dept.id;

  const activeCount = state.activeInitiatives.filter((i) => i.departmentId === dept.id).length;

  // Column header
  const header = document.createElement('div');
  header.className = 'plan-column-header';
  header.innerHTML = `
    <span class="plan-column-title">${formatDeptName(dept.id)}</span>
    <span class="plan-column-slots ${activeCount >= 2 ? 'plan-column-slots--full' : ''}">${activeCount}/2</span>
  `;
  column.appendChild(header);

  // Leader slot
  const leaderSlot = document.createElement('div');
  leaderSlot.className = 'plan-leader-slot';

  const availableLeaders = leaders.filter(
    (l) => !l.assignedDepartmentId || l.assignedDepartmentId === dept.id,
  );

  const select = document.createElement('select');
  select.className = 'leader-select';
  select.dataset.dept = dept.id;
  select.innerHTML = `
    <option value="">— Unassigned —</option>
    ${availableLeaders
      .map(
        (l) =>
          `<option value="${l.id}" ${l.assignedDepartmentId === dept.id ? 'selected' : ''}>${l.name} (F:${Math.round(l.fatigue)} T:${Math.round(l.trust)})</option>`,
      )
      .join('')}
  `;

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

  leaderSlot.appendChild(select);

  // Inline rest for fatigued assigned leader
  const assignedLeader = dept.assignedLeaderId
    ? leaders.find((l) => l.id === dept.assignedLeaderId)
    : null;
  if (assignedLeader && assignedLeader.fatigue >= 20) {
    const restRow = document.createElement('div');
    restRow.className = 'plan-leader-rest';
    const canAffordRest = state.attention.remaining >= 2;
    const fatigueClass = assignedLeader.fatigue >= 60 ? 'high' : 'mid';
    restRow.innerHTML = `
      <span class="plan-rest-indicator fatigue--${fatigueClass}">Fatigue: ${Math.round(assignedLeader.fatigue)}</span>
      <button class="btn-secondary plan-rest-btn" data-leader="${assignedLeader.id}" ${!canAffordRest ? 'disabled' : ''}>
        Rest (-25F, 2 ATT)
      </button>
    `;
    restRow.querySelector('.plan-rest-btn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      if (btn.disabled) return;
      ctx.store.dispatch({ type: 'SPEND_ATTENTION', amount: 2, target: `rest-${assignedLeader.id}` });
      ctx.store.dispatch({ type: 'REST_LEADER', leaderId: assignedLeader.id });
    });
    leaderSlot.appendChild(restRow);
  }

  column.appendChild(leaderSlot);

  // Initiative cards
  const initList = document.createElement('div');
  initList.className = 'plan-initiatives';

  // Get and filter initiatives for this department
  const allDeptInits = registry.getInitiatives(dept.id);
  const eligible = allDeptInits.filter((init: { id: string; tags: string[] }) => {
    if (activeIds.has(init.id)) return true;
    if (init.tags.includes('week-1')) return true;
    return state.turn.week >= 3;
  });
  const activeForDept = eligible.filter((i: { id: string }) => activeIds.has(i.id));
  const available = eligible.filter((i: { id: string }) => !activeIds.has(i.id));
  const shuffled = initRng.shuffle(available);
  const deptInits = [...activeForDept, ...shuffled.slice(0, 3)];

  const canAdd = canAddInitiative(state.activeInitiatives, dept.id);
  const deptLeader = dept.assignedLeaderId;
  const healthPenalty = dept.health < 40 ? 1 : 0;

  if (deptInits.length === 0) {
    initList.innerHTML = '<div class="plan-empty">No initiatives available</div>';
  }

  for (const init of deptInits) {
    const isActive = activeIds.has(init.id);
    const meetsResources = canStartInitiative(state.resources, init.requiredResources);
    const canStart = !isActive && canAdd && meetsResources;

    const card = document.createElement('div');
    card.className = `plan-init-card ${isActive ? 'plan-init-card--active' : ''} ${!canStart && !isActive ? 'plan-init-card--disabled' : ''}`;

    // Requirements
    const reqEntries = Object.entries(init.requiredResources).filter(([, v]) => v !== undefined && (v as number) > 0);
    const reqHtml = reqEntries.length > 0
      ? `<div class="init-requires">
          ${reqEntries.map(([key, val]) => {
            const current = state.resources[key as keyof typeof state.resources];
            const met = current >= (val as number);
            return `<span class="init-req ${met ? 'init-req--met' : 'init-req--unmet'}">${key} ${val}${met ? ' ✓' : ''}</span>`;
          }).join('')}
        </div>`
      : '';

    // Outcomes (shown on expand)
    const overseeEffects = Object.entries(init.outcomeOverseen.resourceEffects)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `<span class="${(v as number) >= 0 ? 'effect-pos' : 'effect-neg'}">${(v as number) >= 0 ? '+' : ''}${v} ${k}</span>`)
      .join(' ');
    const delegateEffects = Object.entries(init.outcomeDelegated.resourceEffects)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `<span class="${(v as number) >= 0 ? 'effect-pos' : 'effect-neg'}">${(v as number) >= 0 ? '+' : ''}${v} ${k}</span>`)
      .join(' ');

    // Action buttons or status
    let actionsHtml = '';
    if (isActive) {
      actionsHtml = '<span class="init-status init-status--active">In Progress</span>';
    } else if (!canAdd) {
      actionsHtml = '<span class="init-status init-status--full">Dept Full</span>';
    } else if (!meetsResources) {
      actionsHtml = '<span class="init-status init-status--blocked">Insufficient</span>';
    } else {
      const overseeCost = init.attentionCost + healthPenalty;
      actionsHtml = `
        <div class="plan-init-actions">
          <button class="btn-primary init-start-btn" data-init="${init.id}" data-dept="${init.department}" data-dur="${init.duration}" data-oversee="true" data-cost="${overseeCost}">
            Oversee ${overseeCost}A
          </button>
          <button class="btn-secondary init-start-btn" data-init="${init.id}" data-dept="${init.department}" data-dur="${init.duration}" data-oversee="false" data-leader="${deptLeader || ''}" data-cost="0">
            Delegate
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="init-header">
        <span class="init-name">${init.name}</span>
        <span class="init-cost">${init.attentionCost}A · ${init.duration}w</span>
      </div>
      <p class="plan-init-desc">${init.description}</p>
      ${reqHtml}
      <div class="plan-init-outcomes">
        <div class="init-outcome-row">
          <span class="init-outcome-label">Overseen:</span>
          <span class="init-outcome-effects">${overseeEffects}</span>
        </div>
        <div class="init-outcome-row">
          <span class="init-outcome-label">Delegated:</span>
          <span class="init-outcome-effects">${delegateEffects}</span>
        </div>
      </div>
      ${actionsHtml}
    `;

    // Expand/collapse on card click (except buttons)
    if (!isActive) {
      card.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.init-start-btn')) return;
        const wasExpanded = card.classList.contains('plan-init-card--expanded');
        // Collapse siblings
        initList.querySelectorAll('.plan-init-card--expanded').forEach((c) => c.classList.remove('plan-init-card--expanded'));
        if (!wasExpanded) card.classList.add('plan-init-card--expanded');
      });
    }

    initList.appendChild(card);
  }

  // Initiative start handler (delegated to list)
  initList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.init-start-btn') as HTMLElement | null;
    if (!btn) return;
    e.stopPropagation();

    const initId = btn.dataset.init!;
    const deptId = btn.dataset.dept!;
    const duration = parseInt(btn.dataset.dur!, 10);
    const overseen = btn.dataset.oversee === 'true';
    const cost = parseInt(btn.dataset.cost!, 10);
    const leaderId = btn.dataset.leader || null;

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

  column.appendChild(initList);
  return column;
}

function formatDeptName(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
