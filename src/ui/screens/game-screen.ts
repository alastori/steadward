import type { RenderContext } from '../renderer';
import { renderHeaderBar } from '../components/header-bar';
import { renderResourcePanel } from '../components/resource-panel';
import { renderObserveView } from '../modes/observe-view';
import { renderPlanView } from '../modes/plan-view';
import { renderExecuteView } from '../modes/execute-view';
import { renderReviewView } from '../modes/review-view';
import { GamePhase } from '../../types/modes';

export function renderGameScreen(ctx: RenderContext): void {
  const state = ctx.store.getState();

  // Header
  renderHeaderBar(ctx.app, state);

  // Main layout
  const layout = document.createElement('div');
  layout.className = 'game-layout';

  // Sidebar: resources
  renderResourcePanel(layout, state.resources);

  // Main content: mode-specific view
  const main = document.createElement('main');
  main.className = 'game-main';

  switch (state.turn.phase) {
    case GamePhase.Observe:
      renderObserveView(main, ctx);
      break;
    case GamePhase.Plan:
      renderPlanView(main, ctx);
      break;
    case GamePhase.Execute:
      renderExecuteView(main, ctx);
      break;
    case GamePhase.Review:
      renderReviewView(main, ctx);
      break;
  }

  layout.appendChild(main);
  ctx.app.appendChild(layout);
}
