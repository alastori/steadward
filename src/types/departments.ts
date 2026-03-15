export type DepartmentId = 'operations' | 'infrastructure' | 'research' | 'external-affairs';

export const DEPARTMENT_IDS: readonly DepartmentId[] = [
  'operations',
  'infrastructure',
  'research',
  'external-affairs',
] as const;

export interface Department {
  id: DepartmentId;
  health: number; // 0-100
  assignedLeaderId: string | null;
  activeInitiativeIds: string[]; // max 2
  unlockedAtWeek: number;
}
