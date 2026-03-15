import type { GameState } from '../types/game-state';
import type { Department } from '../types/departments';
import type { BalanceConstants } from '../types/content';

/** Materials generated per week by healthy departments */
export const DEPT_MATERIALS_THRESHOLD = 70;
export const DEPT_MATERIALS_PER_WEEK = 2;

/** Apply passive health decay/recovery and calculate materials output */
export function tickDepartmentHealth(
  departments: Department[],
  balance: BalanceConstants,
): { departments: Department[]; materialsGenerated: number } {
  let materialsGenerated = 0;
  const updated = departments.map((dept) => {
    if (dept.assignedLeaderId) {
      const newHealth = Math.min(100, dept.health + 1);
      if (newHealth >= DEPT_MATERIALS_THRESHOLD) {
        materialsGenerated += DEPT_MATERIALS_PER_WEEK;
      }
      return { ...dept, health: newHealth };
    }
    return {
      ...dept,
      health: Math.max(0, dept.health - balance.resourceDecayRate),
    };
  });
  return { departments: updated, materialsGenerated };
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
