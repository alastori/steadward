export interface LeaderStats {
  judgment: number;      // 1-10
  speed: number;         // 1-10
  reliability: number;   // 1-10
  adaptability: number;  // 1-10
  communication: number; // 1-10
  riskTolerance: number; // 1-10
}

export interface LeaderTendencies {
  autonomousDecisionStyle: 'cautious' | 'balanced' | 'aggressive';
  fatigueRate: number;    // multiplier, 1.0 = normal
  trustGrowthRate: number; // multiplier, 1.0 = normal
}

export interface Leader {
  id: string;
  name: string;
  fatigue: number;  // 0-100
  trust: number;    // 0-100
  assignedDepartmentId: string | null;
  availableAtWeek: number;
}
