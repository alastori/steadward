import type { GameState } from '../../types/game-state';
import type { RunSummary } from '../../types/sharing';
import { calculateRunScore } from '../../systems/scoring';
import { shareRun, getChallengeUrl } from '../share';

export function renderOutcomeScreen(
  container: HTMLElement,
  state: GameState,
): void {
  const eventsResolved = state.activeEvents.filter((e) => e.resolved).length;
  const runScore = calculateRunScore(state, eventsResolved);

  const summary: RunSummary = {
    seed: state.seed,
    weeksSurvived: state.turn.week,
    outcome: state.outcome!,
    autonomyScore: state.autonomyScore,
    runScore,
    leadersUsed: state.leaders
      .filter((l) => l.assignedDepartmentId)
      .map((l) => l.name),
    keyEvents: [],
    timestamp: new Date().toISOString(),
  };

  const isWin = state.outcome === 'win';
  const challengeUrl = getChallengeUrl(state.seed);

  const screen = document.createElement('div');
  screen.className = 'outcome-screen';
  screen.innerHTML = `
    <div class="outcome-screen-card">
      <h2 class="outcome-screen-title ${isWin ? 'outcome--win' : 'outcome--loss'}">
        ${isWin ? 'AUTONOMY ACHIEVED' : 'SETTLEMENT FAILED'}
      </h2>
      <div class="outcome-stats">
        <div class="outcome-stat">
          <span class="outcome-stat-label">Weeks</span>
          <span class="outcome-stat-value">${state.turn.week}</span>
        </div>
        <div class="outcome-stat">
          <span class="outcome-stat-label">Score</span>
          <span class="outcome-stat-value">${runScore}</span>
        </div>
        <div class="outcome-stat">
          <span class="outcome-stat-label">Autonomy</span>
          <span class="outcome-stat-value">${state.autonomyScore}</span>
        </div>
      </div>
      <div class="outcome-seed">SEED: ${state.seed}</div>
      <div class="outcome-actions">
        <button class="btn-primary outcome-share" type="button">Share Run</button>
        <button class="btn-secondary outcome-challenge" type="button">Challenge a Friend</button>
      </div>
    </div>
  `;
  container.appendChild(screen);

  screen.querySelector('.outcome-share')?.addEventListener('click', () => {
    shareRun(summary);
  });

  screen.querySelector('.outcome-challenge')?.addEventListener('click', () => {
    navigator.clipboard.writeText(challengeUrl).then(() => {
      const btn = screen.querySelector('.outcome-challenge') as HTMLButtonElement;
      if (btn) btn.textContent = 'Link Copied';
    });
  });
}
