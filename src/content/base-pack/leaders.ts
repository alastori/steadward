import type { LeaderDefinition } from '../../types/content';

export const baseLeaders: LeaderDefinition[] = [
  {
    id: 'leader-maren',
    name: 'Maren Stahl',
    portrait: 'portraits/maren.png',
    backstory:
      'Ran logistics for three colony expeditions before Steadward. Has seen what happens when systems fail. No patience for optimism without a plan.',
    stats: {
      judgment: 8,
      speed: 5,
      reliability: 9,
      adaptability: 4,
      communication: 6,
      riskTolerance: 3,
    },
    tendencies: {
      autonomousDecisionStyle: 'cautious',
      fatigueRate: 0.9,
      trustGrowthRate: 0.8,
    },
    tags: ['base'],
  },
  {
    id: 'leader-osei',
    name: 'Kael Osei',
    portrait: 'portraits/osei.png',
    backstory:
      'Former field surveyor turned External Affairs lead. Calm under pressure, genuinely interested in what lies beyond the perimeter. Sometimes overcommits.',
    stats: {
      judgment: 7,
      speed: 6,
      reliability: 6,
      adaptability: 8,
      communication: 9,
      riskTolerance: 7,
    },
    tendencies: {
      autonomousDecisionStyle: 'balanced',
      fatigueRate: 1.0,
      trustGrowthRate: 1.2,
    },
    tags: ['base'],
  },
  {
    id: 'leader-fen',
    name: 'Dr. Fen Vasara',
    portrait: 'portraits/fen.png',
    backstory:
      'The settlement\'s most qualified scientist and its most frustrating leader. Brilliant at analysis, constitutionally incapable of giving a simple answer.',
    stats: {
      judgment: 9,
      speed: 3,
      reliability: 7,
      adaptability: 7,
      communication: 5,
      riskTolerance: 4,
    },
    tendencies: {
      autonomousDecisionStyle: 'cautious',
      fatigueRate: 1.1,
      trustGrowthRate: 0.9,
    },
    tags: ['base'],
  },
  {
    id: 'leader-rook',
    name: 'Rook Tannis',
    portrait: 'portraits/rook.png',
    backstory:
      'Built things on three different worlds. Fast, confident, willing to cut corners if the alternative is missing a deadline. Respects materials more than plans.',
    stats: {
      judgment: 5,
      speed: 9,
      reliability: 5,
      adaptability: 6,
      communication: 4,
      riskTolerance: 8,
    },
    tendencies: {
      autonomousDecisionStyle: 'aggressive',
      fatigueRate: 1.0,
      trustGrowthRate: 1.0,
    },
    tags: ['base'],
  },
  {
    id: 'leader-lin',
    name: 'Lin Seo-yun',
    portrait: 'portraits/lin.png',
    backstory:
      'Administrative coordinator from the colony ship. Good at everything, exceptional at nothing. The most versatile leader and the one most likely to be overworked.',
    stats: {
      judgment: 6,
      speed: 6,
      reliability: 7,
      adaptability: 9,
      communication: 8,
      riskTolerance: 5,
    },
    tendencies: {
      autonomousDecisionStyle: 'balanced',
      fatigueRate: 1.3,
      trustGrowthRate: 1.1,
    },
    tags: ['base'],
  },
];
