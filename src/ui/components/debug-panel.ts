import type { GameStore } from '../../engine/game-store';
import type { GameState } from '../../types/game-state';
import type { Resources, ResourceType } from '../../types/resources';
import { RESOURCE_TYPES } from '../../types/resources';

/** Expose debug tools on window for development */
export function setupDebugPanel(store: GameStore): void {
  const win = window as unknown as Record<string, unknown>;

  win.__gameState = () => store.getState();
  win.__actionLog = () => store.getActionLog();

  win.__cheat = {
    setResource(resource: ResourceType, value: number) {
      const state = store.getState();
      const effects: Partial<Resources> = {};
      effects[resource] = value - state.resources[resource];
      store.dispatch({ type: 'APPLY_EFFECTS', effects });
      console.log(`${resource}: ${state.resources[resource]} -> ${value}`);
    },
    setAllResources(value: number) {
      const state = store.getState();
      const effects: Partial<Resources> = {};
      for (const key of RESOURCE_TYPES) {
        effects[key] = value - state.resources[key];
      }
      store.dispatch({ type: 'APPLY_EFFECTS', effects });
      console.log(`All resources set to ${value}`);
    },
    setFatigue(leaderId: string, value: number) {
      // REST_LEADER reduces by 25, so we adjust manually via LOAD_STATE
      const state = store.getState();
      const newState: GameState = {
        ...state,
        leaders: state.leaders.map((l) =>
          l.id === leaderId ? { ...l, fatigue: Math.max(0, Math.min(100, value)) } : l
        ),
      };
      store.dispatch({ type: 'LOAD_STATE', state: newState });
      console.log(`${leaderId} fatigue set to ${value}`);
    },
    setTrust(leaderId: string, value: number) {
      const state = store.getState();
      const newState: GameState = {
        ...state,
        leaders: state.leaders.map((l) =>
          l.id === leaderId ? { ...l, trust: Math.max(0, Math.min(100, value)) } : l
        ),
      };
      store.dispatch({ type: 'LOAD_STATE', state: newState });
      console.log(`${leaderId} trust set to ${value}`);
    },
    skipToWeek(week: number) {
      const state = store.getState();
      store.dispatch({
        type: 'LOAD_STATE',
        state: { ...state, turn: { ...state.turn, week } },
      });
      console.log(`Skipped to week ${week}`);
    },
    win() {
      const state = store.getState();
      store.dispatch({
        type: 'LOAD_STATE',
        state: { ...state, outcome: 'win', autonomyScore: 100 },
      });
    },
    lose() {
      const state = store.getState();
      store.dispatch({
        type: 'LOAD_STATE',
        state: { ...state, outcome: 'loss' },
      });
    },
    help() {
      console.log(`Steadward Debug Commands:
  __cheat.setResource('materials', 80)
  __cheat.setAllResources(50)
  __cheat.setFatigue('leader-maren', 0)
  __cheat.setTrust('leader-rook', 80)
  __cheat.skipToWeek(5)
  __cheat.win()
  __cheat.lose()
  __gameState()
  __actionLog()`);
    },
  };

  console.log('Debug panel ready. Type __cheat.help() for commands.');
}
