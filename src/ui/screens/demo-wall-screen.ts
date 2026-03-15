import type { GameState } from '../../types/game-state';
import type { Resources, ResourceType } from '../../types/resources';
import { RESOURCE_TYPES } from '../../types/resources';
import { generateShareImage, getChallengeUrl } from '../share';

function getLowestResource(resources: Resources): ResourceType {
  let lowest: ResourceType = 'materials';
  let lowestVal = Infinity;
  for (const key of RESOURCE_TYPES) {
    if (resources[key] < lowestVal) {
      lowestVal = resources[key];
      lowest = key;
    }
  }
  return lowest;
}

function getMostUsedLeader(state: GameState): string {
  // Leader with highest fatigue was used most
  let best = state.leaders[0];
  for (const l of state.leaders) {
    if (l.fatigue > best.fatigue) best = l;
  }
  return best.name;
}

const HOOKS: Record<ResourceType, string> = {
  materials: 'Supplies are running thin. The next shipment is weeks away — if it comes at all.',
  trust: 'The crew is losing faith. One more broken promise and the best people start walking.',
  clarity: 'Nobody knows what the plan is anymore. Decisions are being made in the dark.',
  resilience: 'The settlement is fragile. One bad storm, one equipment failure, and it all comes apart.',
  knowledge: 'There is so much we still do not understand about this place.',
  momentum: 'Progress has stalled. The energy that built this settlement is draining away.',
};

export function renderDemoWall(container: HTMLElement, state: GameState): void {
  const lowest = getLowestResource(state.resources);
  const leaderName = getMostUsedLeader(state);
  const hook = HOOKS[lowest];
  const challengeUrl = getChallengeUrl(state.seed);

  const screen = document.createElement('div');
  screen.className = 'demo-wall';
  screen.innerHTML = `
    <div class="demo-wall-content">
      <h2 class="demo-wall-title">END OF DEMO</h2>
      <p class="demo-wall-hook">${hook}</p>
      <p class="demo-wall-body">
        Week ${state.turn.week}. Autonomy at ${state.autonomyScore}.
        ${leaderName} is carrying the settlement on their back.
        The story continues in the full game.
      </p>
      <div class="demo-wall-run-stats">
        <span class="demo-wall-stat">Seed: ${state.seed}</span>
        <span class="demo-wall-stat">Score: ${state.autonomyScore}</span>
      </div>
      <div class="demo-wall-actions">
        <button class="btn-primary demo-wall-share" type="button">Share Run</button>
        <button class="btn-secondary demo-wall-challenge" type="button">Challenge a Friend</button>
      </div>
      <div class="demo-wall-email">
        <p class="demo-wall-email-label">Get notified when Steadward launches:</p>
        <form class="demo-wall-form" id="demo-wall-form">
          <input type="email" class="demo-wall-input" placeholder="your@email.com" required />
          <button type="submit" class="btn-primary demo-wall-submit">Notify Me</button>
        </form>
        <p class="demo-wall-status" id="demo-wall-status"></p>
      </div>
      <button class="btn-secondary demo-wall-restart" type="button">Play Again</button>
    </div>
  `;
  container.appendChild(screen);

  // Share button
  screen.querySelector('.demo-wall-share')?.addEventListener('click', () => {
    const canvas = generateShareImage({
      seed: state.seed,
      weeksSurvived: state.turn.week,
      outcome: 'loss', // demo wall = didn't win yet
      autonomyScore: state.autonomyScore,
      runScore: state.autonomyScore * 100,
      leadersUsed: state.leaders.filter((l) => l.fatigue > 0).map((l) => l.name),
      keyEvents: [],
      timestamp: new Date().toISOString(),
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      try {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        const btn = screen.querySelector('.demo-wall-share') as HTMLButtonElement;
        if (btn) btn.textContent = 'Copied';
      } catch {
        const link = document.createElement('a');
        link.download = 'steadward-run.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }, 'image/png');
  });

  // Challenge button
  screen.querySelector('.demo-wall-challenge')?.addEventListener('click', () => {
    navigator.clipboard.writeText(challengeUrl).then(() => {
      const btn = screen.querySelector('.demo-wall-challenge') as HTMLButtonElement;
      if (btn) btn.textContent = 'Link Copied';
    });
  });

  // Email form
  const form = screen.querySelector('#demo-wall-form') as HTMLFormElement;
  const status = screen.querySelector('#demo-wall-status') as HTMLElement;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input') as HTMLInputElement;
    if (!input?.value) return;
    status.textContent = 'Thanks. We\'ll let you know.';
    form.style.display = 'none';
  });

  // Play again
  screen.querySelector('.demo-wall-restart')?.addEventListener('click', () => {
    window.location.reload();
  });
}
