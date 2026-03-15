import type { Leader } from '../types/leaders';
import type { LeaderDefinition } from '../types/content';
import type { BalanceConstants } from '../types/content';

/** Apply weekly fatigue to assigned leaders */
export function tickLeaderFatigue(
  leaders: Leader[],
  leaderDefs: ReadonlyArray<LeaderDefinition>,
  balance: BalanceConstants,
): Leader[] {
  return leaders.map((leader) => {
    if (!leader.assignedDepartmentId) {
      // Unassigned leaders recover fatigue
      return {
        ...leader,
        fatigue: Math.max(0, leader.fatigue - balance.fatiguePerWeek * 0.5),
      };
    }
    const def = leaderDefs.find((d) => d.id === leader.id);
    const rate = def?.tendencies.fatigueRate ?? 1.0;
    return {
      ...leader,
      fatigue: Math.min(100, leader.fatigue + balance.fatiguePerWeek * rate),
    };
  });
}

/** Apply trust growth after a successful delegation */
export function growTrust(
  leader: Leader,
  leaderDef: LeaderDefinition,
  balance: BalanceConstants,
): Leader {
  const rate = leaderDef.tendencies.trustGrowthRate;
  return {
    ...leader,
    trust: Math.min(100, leader.trust + balance.trustGrowthBase * rate),
  };
}

/** Decay trust after a failed delegation */
export function decayTrust(leader: Leader, amount: number): Leader {
  return {
    ...leader,
    trust: Math.max(0, leader.trust - amount),
  };
}

/** Check if a leader is burned out */
export function isBurnedOut(leader: Leader): boolean {
  return leader.fatigue >= 100;
}

/** Get leaders available for the current week (progressive unlock) */
export function getAvailableLeaders(
  leaders: Leader[],
  week: number,
): Leader[] {
  return leaders.filter((l) => l.availableAtWeek <= week);
}

/** Create initial leader state from definitions */
export function createInitialLeaders(defs: ReadonlyArray<LeaderDefinition>): Leader[] {
  const weekUnlock = [1, 1, 2, 3, 3]; // Progressive unlock schedule
  return defs.map((def, i) => ({
    id: def.id,
    name: def.name,
    fatigue: 0,
    trust: 50,
    assignedDepartmentId: null,
    availableAtWeek: weekUnlock[i] ?? 1,
  }));
}
