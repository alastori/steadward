import type { GameStore } from '../engine/game-store';
import type { ContentRegistry } from '../content/registry';
import type { GameState } from '../types/game-state';
import { renderTitleScreen } from './screens/title-screen';
import { renderGameScreen } from './screens/game-screen';

export interface RenderContext {
  store: GameStore;
  registry: ContentRegistry;
  app: HTMLElement;
}

export function createRenderer(ctx: RenderContext): () => void {
  function render() {
    const state = ctx.store.getState();
    ctx.app.innerHTML = '';

    // Set mode on root element
    document.documentElement.setAttribute('data-mode', state.turn.phase);

    if (state.outcome) {
      renderOutcomeOverlay(ctx.app, state);
    }

    renderGameScreen(ctx);
  }

  // Subscribe to state changes
  const unsubscribe = ctx.store.subscribe(() => render());

  // Initial render
  render();

  return unsubscribe;
}

export function renderTitleView(ctx: RenderContext): void {
  ctx.app.innerHTML = '';
  renderTitleScreen(ctx.app, () => {
    // Start the game — initial render will pick up the game state
    createRenderer(ctx);
  });
}

function renderOutcomeOverlay(container: HTMLElement, state: GameState): void {
  const overlay = document.createElement('div');
  overlay.className = 'outcome-overlay';
  overlay.innerHTML = `
    <div class="outcome-card">
      <h2 class="outcome-title">${state.outcome === 'win' ? 'AUTONOMY ACHIEVED' : 'SETTLEMENT FAILED'}</h2>
      <p class="outcome-detail">Week ${state.turn.week} — Autonomy: ${state.autonomyScore}</p>
    </div>
  `;
  container.appendChild(overlay);
}
