import type { ActiveInitiative } from '../types/initiatives';
import type { Resources } from '../types/resources';

/** Check if resources meet initiative requirements */
export function canStartInitiative(
  resources: Resources,
  required: Partial<Resources>,
): boolean {
  for (const [key, value] of Object.entries(required)) {
    if (value !== undefined && resources[key as keyof Resources] < value) {
      return false;
    }
  }
  return true;
}

/** Check if department has room for another initiative (max 2) */
export function canAddInitiative(
  activeInitiatives: ActiveInitiative[],
  departmentId: string,
): boolean {
  const count = activeInitiatives.filter(
    (i) => i.departmentId === departmentId,
  ).length;
  return count < 2;
}

/** Progress all active initiatives by one week */
export function tickInitiatives(
  initiatives: ActiveInitiative[],
): { active: ActiveInitiative[]; completed: ActiveInitiative[] } {
  const active: ActiveInitiative[] = [];
  const completed: ActiveInitiative[] = [];

  for (const init of initiatives) {
    const updated = {
      ...init,
      weeksRemaining: init.weeksRemaining - 1,
    };
    if (updated.weeksRemaining <= 0) {
      completed.push(updated);
    } else {
      active.push(updated);
    }
  }

  return { active, completed };
}

/** Create a new active initiative */
export function startInitiative(
  definitionId: string,
  departmentId: string,
  duration: number,
  leaderId: string | null,
  overseen: boolean,
): ActiveInitiative {
  return {
    definitionId,
    departmentId,
    assignedLeaderId: leaderId,
    weeksRemaining: duration,
    overseen,
  };
}
