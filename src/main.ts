import '../styles/main.css';
import { parseGameConfig } from './utils/url';
import { GamePhase, PHASE_ORDER } from './types/modes';

const config = parseGameConfig();

if (config.seed) {
  console.log(`Seed: ${config.seed}`);
}
if (config.challenge) {
  console.log(`Challenge: ${config.challenge}`);
}

function setMode(phase: GamePhase): void {
  document.documentElement.setAttribute('data-mode', phase);
}

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const seedInfo = config.seed ? `<p class="seed-display">Seed: ${config.seed}</p>` : '';
  const challengeInfo = config.challenge
    ? `<p class="seed-display">Challenge: ${config.challenge}</p>`
    : '';

  app.innerHTML = `
    <header class="header">
      <h1 class="title">STEADWARD</h1>
      <p class="subtitle" id="mode-label">OBSERVE</p>
    </header>
    <main class="content">
      ${seedInfo}
      ${challengeInfo}
      <p class="tagline">Coordinate. Delegate. Survive.</p>
    </main>
  `;
}

// Set initial mode and render
setMode(GamePhase.Observe);
render();

// Cycle modes every 3 seconds (temporary demo)
let phaseIndex = 0;
setInterval(() => {
  phaseIndex = (phaseIndex + 1) % PHASE_ORDER.length;
  const phase = PHASE_ORDER[phaseIndex];
  setMode(phase);
  const label = document.getElementById('mode-label');
  if (label) {
    label.textContent = phase.toUpperCase();
  }
}, 3000);
