import type { GameState } from '../../types/game-state';

export function renderHeaderBar(container: HTMLElement, state: GameState): void {
  const header = document.createElement('header');
  header.className = 'game-header';
  header.innerHTML = `
    <div class="header-left">
      <span class="header-title">STEADWARD</span>
      <span class="header-week">WEEK ${String(state.turn.week).padStart(2, '0')}</span>
    </div>
    <div class="header-center">
      <span class="header-phase">${state.turn.phase.toUpperCase()}</span>
    </div>
    <div class="header-right">
      <span class="header-attention" title="Attention remaining">
        <span class="attention-icon">◉</span>
        <span class="attention-value">${state.attention.remaining}</span>
        <span class="attention-sep">/</span>
        <span class="attention-budget">${state.attention.budget}</span>
      </span>
    </div>
  `;
  container.appendChild(header);
}
