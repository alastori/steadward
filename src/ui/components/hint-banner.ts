import type { GameStore } from '../../engine/game-store';
import { getActiveHint } from '../../content/hints';

/** Render a contextual hint banner if one is active. Returns the element or null. */
export function renderHintBanner(container: HTMLElement, store: GameStore): void {
  const state = store.getState();
  const hint = getActiveHint(state);
  if (!hint) return;

  const banner = document.createElement('div');
  banner.className = 'hint-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = `
    <span class="hint-icon">&#9432;</span>
    <p class="hint-text">${hint.text}</p>
    <button class="hint-dismiss" type="button" aria-label="Dismiss hint">&times;</button>
  `;

  banner.querySelector('.hint-dismiss')?.addEventListener('click', () => {
    store.dispatch({ type: 'MARK_HINT_SHOWN', hintId: hint.id });
    banner.remove();
  });

  // Auto-mark as shown after 15 seconds
  setTimeout(() => {
    if (banner.isConnected) {
      store.dispatch({ type: 'MARK_HINT_SHOWN', hintId: hint.id });
    }
  }, 15000);

  container.prepend(banner);
}
