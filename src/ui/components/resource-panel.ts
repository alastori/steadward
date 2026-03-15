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

export function renderResourcePanel(container: HTMLElement, resources: Resources): void {
  const panel = document.createElement('aside');
  panel.className = 'resource-panel';

  const heading = document.createElement('h2');
  heading.className = 'panel-heading';
  heading.textContent = 'Resources';
  panel.appendChild(heading);

  for (const key of RESOURCE_TYPES) {
    const value = resources[key];
    const row = document.createElement('div');
    row.className = 'resource-row';
    row.innerHTML = `
      <span class="resource-label">${RESOURCE_LABELS[key]}</span>
      <div class="resource-bar-track">
        <div class="resource-bar-fill resource-bar--${key}" style="width: ${value}%"></div>
      </div>
      <span class="resource-value">${value}</span>
    `;
    panel.appendChild(row);
  }

  container.appendChild(panel);
}
