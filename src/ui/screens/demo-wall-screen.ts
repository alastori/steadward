export function renderDemoWall(container: HTMLElement, week: number, autonomyScore: number): void {
  const screen = document.createElement('div');
  screen.className = 'demo-wall';
  screen.innerHTML = `
    <div class="demo-wall-content">
      <h2 class="demo-wall-title">END OF DEMO</h2>
      <p class="demo-wall-body">
        Week ${week}. Autonomy at ${autonomyScore}. The settlement's story continues in the full game.
      </p>
      <div class="demo-wall-email">
        <p class="demo-wall-email-label">Get notified when Steadward launches:</p>
        <form class="demo-wall-form" id="demo-wall-form">
          <input type="email" class="demo-wall-input" placeholder="your@email.com" required />
          <button type="submit" class="btn-primary demo-wall-submit">Notify Me</button>
        </form>
        <p class="demo-wall-status" id="demo-wall-status"></p>
      </div>
      <div class="demo-wall-actions">
        <a href="https://steadward.com" class="btn-primary demo-wall-cta">Get the Full Game</a>
      </div>
    </div>
  `;
  container.appendChild(screen);

  const form = screen.querySelector('#demo-wall-form') as HTMLFormElement;
  const status = screen.querySelector('#demo-wall-status') as HTMLElement;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input') as HTMLInputElement;
    const email = input?.value;
    if (!email) return;

    // Fire-and-forget email capture
    status.textContent = 'Thanks. We\'ll let you know.';
    form.style.display = 'none';

    // Plausible event
    const plausible = (window as unknown as Record<string, unknown>).plausible as
      | ((name: string, opts: { props: Record<string, unknown> }) => void)
      | undefined;
    plausible?.('demo_wall_hit', { props: { week, autonomyScore } });
  });
}
