import '../styles/main.css';
import { parseGameConfig } from './utils/url';
import { GamePhase } from './types/modes';
import { DEFAULT_RESOURCES } from './types/resources';
import { createGameStore } from './engine/game-store';
import { rootReducer } from './engine/reducer';
import { createContentRegistry } from './content/registry';
import { basePack } from './content/index';
import { createInitialDepartments } from './systems/departments';
import { createInitialLeaders } from './systems/leaders';
import { renderTitleView } from './ui/renderer';
import { wireAnalytics } from './analytics/telemetry';
import { wireAudio } from './audio/audio-manager';
import { setupDebugPanel } from './ui/components/debug-panel';
import type { GameState } from './types/game-state';

const config = parseGameConfig();
const seed = config.seed ? parseInt(config.seed, 10) || Date.now() : Date.now();

if (config.seed) {
  console.log(`Seed: ${config.seed}`);
}
if (config.challenge) {
  console.log(`Challenge: ${config.challenge}`);
}

// Set up content registry
const registry = createContentRegistry();
registry.registerPack(basePack);
const balance = registry.getBalance();

// Create initial game state
function createInitialState(): GameState {
  return {
    turn: { week: 1, phase: GamePhase.Observe, phaseIndex: 0 },
    resources: { ...DEFAULT_RESOURCES },
    previousResources: null,
    departments: createInitialDepartments(),
    leaders: createInitialLeaders(registry.getLeaders()),
    attention: { budget: balance.baseAttentionBudget, remaining: balance.baseAttentionBudget },
    activeInitiatives: [],
    activeEvents: [],
    firedEventIds: [],
    lastCompletedInitiatives: [],
    hintsShown: [],
    autonomyScore: 0,
    autonomyStreakWeeks: 0,
    outcome: null,
    seed,
  };
}

// Initialize store
const store = createGameStore(createInitialState(), rootReducer);

// Wire analytics + audio + debug
wireAnalytics(store);
wireAudio(store);
setupDebugPanel(store);

// Mount UI
const app = document.getElementById('app');
if (app) {
  renderTitleView({ store, registry, app });
}
