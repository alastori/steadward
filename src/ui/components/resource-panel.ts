import type { Resources, ResourceType } from '../../types/resources';
import { RESOURCE_TYPES } from '../../types/resources';

const RESOURCE_LABELS: Record<ResourceType, string> = {
  materials: 'Materials',
  trust: 'Trust',
  clarity: 'Clarity',
  resilience: 'Resilience',
  knowledge: 'Knowledge',
  momentum: 'Momentum',
};

const RESOURCE_TOOLTIPS: Record<ResourceType, string> = {
  materials: 'Construction and repair supplies. Consumed by initiatives and events. Healthy departments (70+) generate +2/week.',
  trust: 'How much the settlement trusts your leadership. Drops to 0 = game over.',
  clarity: 'Understanding of your situation. Affects weekly attention budget (+/- 1 ATT per 10 points from 50).',
  resilience: 'Ability to absorb shocks. Drops to 0 = game over.',
  knowledge: 'Accumulated understanding of Sable. Required for research initiatives.',
  momentum: 'Forward progress and morale. Drops to 0 = game over.',
};

export function renderResourcePanel(container: HTMLElement, resources: Resources): void {
  const panel = document.createElement('aside');
  panel.className = 'resource-panel';

  const heading = document.createElement('h2');
  heading.className = 'panel-heading';
  heading.textContent = 'Resources';
  panel.appendChild(heading);

  for (const key of RESOURCE_TYPES) {
    const value = resources[key];
    const danger = value <= 15;
    const row = document.createElement('div');
    row.className = `resource-row ${danger ? 'resource-row--danger' : ''}`;
    row.title = RESOURCE_TOOLTIPS[key];
    row.innerHTML = `
      <span class="resource-label">${RESOURCE_LABELS[key]}</span>
      <div class="resource-bar-track">
        <div class="resource-bar-fill resource-bar--${key}" style="width: ${value}%"></div>
      </div>
      <span class="resource-value ${danger ? 'resource-value--danger' : ''}">${value}</span>
    `;
    panel.appendChild(row);
  }

  container.appendChild(panel);
}
