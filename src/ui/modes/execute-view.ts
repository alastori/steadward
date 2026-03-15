import type { RenderContext } from '../renderer';
import { canSpendAttention } from '../../systems/attention';

export function renderExecuteView(container: HTMLElement, ctx: RenderContext): void {
  const state = ctx.store.getState();

  const view = document.createElement('div');
  view.className = 'mode-view execute-view';

  // Active initiatives
  const initSection = document.createElement('section');
  initSection.className = 'execute-section';
  initSection.innerHTML = `<h2 class="section-heading">Active Initiatives</h2>`;

  if (state.activeInitiatives.length === 0) {
    initSection.innerHTML += `<p class="empty-state">No active initiatives this week.</p>`;
  } else {
    for (const init of state.activeInitiatives) {
      const def = ctx.registry.getInitiative(init.definitionId);
      const leader = init.assignedLeaderId
        ? state.leaders.find((l) => l.id === init.assignedLeaderId)
        : null;
      const card = document.createElement('div');
      card.className = 'exec-init-card';
      card.innerHTML = `
        <span class="exec-init-name">${def?.name ?? init.definitionId}</span>
        <span class="exec-init-progress">${init.weeksRemaining}w remaining</span>
        <span class="exec-init-status">${init.overseen ? 'Overseen' : leader ? `Delegated to ${leader.name}` : 'Delegated'}</span>
      `;
      initSection.appendChild(card);
    }
  }
  view.appendChild(initSection);

  // Active events
  if (state.activeEvents.length > 0) {
    const eventSection = document.createElement('section');
    eventSection.className = 'execute-section';
    eventSection.innerHTML = `<h2 class="section-heading">Events</h2>`;

    for (const event of state.activeEvents) {
      const def = ctx.registry.getEvent(event.definitionId);
      if (!def) continue;

      const card = document.createElement('div');
      card.className = `event-card event-card--${def.urgency}`;

      if (event.resolved) {
        const chosenChoice = event.chosenOptionIndex !== null ? def.choices[event.chosenOptionIndex] : null;
        card.innerHTML = `
          <span class="event-name">${def.name}</span>
          <span class="event-resolved">${chosenChoice ? chosenChoice.name : 'Resolved'}</span>
        `;
      } else {
        card.innerHTML = `
          <div class="event-header">
            <span class="event-urgency">${def.urgency.toUpperCase()}</span>
            <span class="event-name">${def.name}</span>
          </div>
          <p class="event-desc">${def.description}</p>
          <div class="event-choices">
            ${def.choices
              .map((choice, i) => {
                const canAfford = canSpendAttention(state, choice.attentionCost);
                return `
              <button class="btn-secondary event-choice-btn ${!canAfford ? 'event-choice--disabled' : ''}"
                data-event="${event.definitionId}" data-choice="${i}" ${!canAfford ? 'disabled' : ''}>
                <span class="choice-name">${choice.name}</span>
                <span class="choice-cost">${choice.attentionCost} ATT</span>
              </button>
            `;
              })
              .join('')}
          </div>
        `;
      }

      eventSection.appendChild(card);
    }

    // Attach event choice handlers — spend attention + apply resource effects
    eventSection.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.event-choice-btn') as HTMLButtonElement | null;
      if (!btn || btn.disabled) return;
      const eventId = btn.dataset.event!;
      const choiceIndex = parseInt(btn.dataset.choice!, 10);

      const def = ctx.registry.getEvent(eventId);
      if (!def) return;
      const choice = def.choices[choiceIndex];

      // Spend attention
      if (choice.attentionCost > 0) {
        ctx.store.dispatch({ type: 'SPEND_ATTENTION', amount: choice.attentionCost, target: eventId });
      }

      // Apply resource effects
      if (Object.keys(choice.resourceEffects).length > 0) {
        ctx.store.dispatch({ type: 'APPLY_EFFECTS', effects: choice.resourceEffects });
      }

      // Mark resolved
      ctx.store.dispatch({ type: 'RESOLVE_EVENT', eventId, choiceIndex });
    });

    view.appendChild(eventSection);
  }

  // Advance button
  const advanceBtn = document.createElement('button');
  advanceBtn.className = 'btn-primary advance-btn';
  advanceBtn.textContent = 'Advance to Review';
  advanceBtn.addEventListener('click', () => {
    ctx.store.dispatch({ type: 'ADVANCE_PHASE' });
  });
  view.appendChild(advanceBtn);

  container.appendChild(view);
}
