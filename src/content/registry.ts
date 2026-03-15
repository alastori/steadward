import type { ContentPack, BalanceConstants, LeaderDefinition, ScenarioDefinition } from '../types/content';
import type { InitiativeDefinition } from '../types/initiatives';
import type { EventDefinition } from '../types/events';
import type { DepartmentId } from '../types/departments';
import { BASE_BALANCE } from './base-pack/balance';

export interface ValidationResult {
  level: 'error' | 'warning';
  message: string;
}

export interface ContentRegistry {
  registerPack(pack: ContentPack): void;
  getLeaders(): ReadonlyArray<LeaderDefinition>;
  getLeader(id: string): LeaderDefinition | undefined;
  getInitiatives(department?: DepartmentId): ReadonlyArray<InitiativeDefinition>;
  getInitiative(id: string): InitiativeDefinition | undefined;
  getEvents(urgency?: string): ReadonlyArray<EventDefinition>;
  getEvent(id: string): EventDefinition | undefined;
  getBalance(): BalanceConstants;
  getScenarios(): ReadonlyArray<ScenarioDefinition>;
  validate(): ValidationResult[];
}

export function createContentRegistry(): ContentRegistry {
  const leaders: LeaderDefinition[] = [];
  const initiatives: InitiativeDefinition[] = [];
  const events: EventDefinition[] = [];
  const scenarios: ScenarioDefinition[] = [];
  let balance: BalanceConstants = { ...BASE_BALANCE };

  return {
    registerPack(pack: ContentPack) {
      leaders.push(...pack.leaders);
      initiatives.push(...pack.initiatives);
      events.push(...pack.events);
      if (pack.scenarios) scenarios.push(...pack.scenarios);
      if (pack.balance) {
        balance = { ...balance, ...pack.balance };
      }
    },

    getLeaders: () => leaders,
    getLeader: (id) => leaders.find((l) => l.id === id),
    getInitiatives: (department) =>
      department ? initiatives.filter((i) => i.department === department) : initiatives,
    getInitiative: (id) => initiatives.find((i) => i.id === id),
    getEvents: (urgency) =>
      urgency ? events.filter((e) => e.urgency === urgency) : events,
    getEvent: (id) => events.find((e) => e.id === id),
    getBalance: () => balance,
    getScenarios: () => scenarios,

    validate(): ValidationResult[] {
      const results: ValidationResult[] = [];
      const ids = new Set<string>();

      for (const leader of leaders) {
        if (ids.has(leader.id)) {
          results.push({ level: 'error', message: `Duplicate leader ID: ${leader.id}` });
        }
        ids.add(leader.id);
        for (const [stat, val] of Object.entries(leader.stats)) {
          if (val < 1 || val > 10) {
            results.push({
              level: 'error',
              message: `Leader ${leader.id} stat ${stat} out of range: ${val}`,
            });
          }
        }
      }

      for (const init of initiatives) {
        if (ids.has(init.id)) {
          results.push({ level: 'error', message: `Duplicate initiative ID: ${init.id}` });
        }
        ids.add(init.id);
      }

      for (const event of events) {
        if (ids.has(event.id)) {
          results.push({ level: 'error', message: `Duplicate event ID: ${event.id}` });
        }
        ids.add(event.id);
        if (event.choices.length < 2) {
          results.push({
            level: 'warning',
            message: `Event ${event.id} has fewer than 2 choices`,
          });
        }
      }

      return results;
    },
  };
}
