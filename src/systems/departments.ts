import type { GameState } from '../types/game-state';
import type { Department } from '../types/departments';
import type { BalanceConstants } from '../types/content';

/** Apply passive health decay to departments without leaders */
export function tickDepartmentHealth(
  departments: Department[],
  balance: BalanceConstants,
): Department[] {
  return departments.map((dept) => {
    if (dept.assignedLeaderId) {
      // Departments with leaders slowly recover
      return {
        ...dept,
        health: Math.min(100, dept.health + 1),
      };
    }
    // Unattended departments decay
    return {
      ...dept,
      health: Math.max(0, dept.health - balance.resourceDecayRate),
    };
  });
}

/** Get departments available for the current week (progressive unlock) */
export function getAvailableDepartments(
  departments: Department[],
  week: number,
): Department[] {
  return departments.filter((d) => d.unlockedAtWeek <= week);
}

/** Create initial department state */
export function createInitialDepartments(): Department[] {
  return [
    {
      id: 'operations',
      health: 60,
      assignedLeaderId: null,
      activeInitiativeIds: [],
      unlockedAtWeek: 1,
    },
    {
      id: 'infrastructure',
      health: 55,
      assignedLeaderId: null,
      activeInitiativeIds: [],
      unlockedAtWeek: 1,
    },
    {
      id: 'research',
      health: 50,
      assignedLeaderId: null,
      activeInitiativeIds: [],
      unlockedAtWeek: 2,
    },
    {
      id: 'external-affairs',
      health: 45,
      assignedLeaderId: null,
      activeInitiativeIds: [],
      unlockedAtWeek: 3,
    },
  ];
}
