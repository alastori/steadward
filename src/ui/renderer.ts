import type { GameStore } from '../engine/game-store';
import type { ContentRegistry } from '../content/registry';
import { renderTitleScreen } from './screens/title-screen';
import { renderGameScreen } from './screens/game-screen';
import { renderOutcomeScreen } from './screens/outcome-screen';
import { renderDemoWall } from './screens/demo-wall-screen';

export interface RenderContext {
  store: GameStore;
  registry: ContentRegistry;
  app: HTMLElement;
}

export function createRenderer(ctx: RenderContext): () => void {
  function render() {
    const state = ctx.store.getState();
    const balance = ctx.registry.getBalance();
    ctx.app.innerHTML = '';

    // Set mode on root element
    document.documentElement.setAttribute('data-mode', state.turn.phase);

    // Demo wall check
    if (__EDITION__ === 'demo' && state.turn.week > balance.demoWeekLimit) {
      renderDemoWall(ctx.app, state);
      return;
    }

    // Outcome screen
    if (state.outcome) {
      renderOutcomeScreen(ctx.app, state);
      return;
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
    createRenderer(ctx);
  });
}
