export function renderTitleScreen(
  container: HTMLElement,
  onStart: () => void,
): void {
  const screen = document.createElement('div');
  screen.className = 'title-screen';
  screen.innerHTML = `
    <div class="title-content">
      <h1 class="title-logo">STEADWARD</h1>
      <p class="title-tagline">Coordinate. Delegate. Survive.</p>
      <button class="btn-primary title-start" type="button">New Game</button>
    </div>
  `;
  container.appendChild(screen);

  const btn = screen.querySelector('.title-start');
  btn?.addEventListener('click', onStart);
}
