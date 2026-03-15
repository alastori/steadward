import type { EventDefinition } from '../../types/events';

export const baseEvents: EventDefinition[] = [
  // === IGNORABLE (3) ===
  {
    id: 'event-ardmore-signal',
    name: 'Signal From Ardmore',
    description:
      'A faint signal on the long-range relay. It matches the frequency used by the Ardmore settlement, two hundred kilometers east. The pattern suggests a routine broadcast — not a distress call.',
    urgency: 'ignorable',
    choices: [
      {
        id: 'ardmore-respond',
        name: 'Respond to the signal',
        description:
          'Realign the relay and attempt contact. Half a day of communications crew time.',
        attentionCost: 1,
        resourceEffects: { trust: 3, knowledge: 4, clarity: 2 },
      },
      {
        id: 'ardmore-log',
        name: 'Log it and move on',
        description:
          'Note the signal in the communications log. We have higher priorities this week.',
        attentionCost: 0,
        resourceEffects: {},
      },
      {
        id: 'ardmore-boost',
        name: 'Boost the relay for a full scan',
        description:
          'Spend extra time scanning the full frequency range. There might be other settlements out there.',
        attentionCost: 2,
        resourceEffects: { knowledge: 8, clarity: 5, momentum: 3 },
      },
    ],
    conditions: [{ type: 'week_min', value: 2 }],
    tags: ['base'],
  },
  {
    id: 'event-transfer-requests',
    name: 'Housing Transfer Requests',
    description:
      'Three families requested transfers to the southern module. No complaints filed — they just want more space. Reasonable, if we had any.',
    urgency: 'ignorable',
    choices: [
      {
        id: 'transfer-approve',
        name: 'Approve the transfers',
        description:
          'Shuffle quarters to accommodate. Some disruption, but people feel heard.',
        attentionCost: 1,
        resourceEffects: { trust: 4, momentum: -2 },
      },
      {
        id: 'transfer-defer',
        name: 'Defer until expansion completes',
        description:
          'Acknowledge the request, promise space when the southern module is done.',
        attentionCost: 0,
        resourceEffects: { trust: -1 },
      },
    ],
    tags: ['base'],
  },
  {
    id: 'event-equipment-wear',
    name: 'Tool Wear Report',
    description:
      'Maintenance flagged that drill bits and cutting tools are wearing faster than expected. Not urgent, but replacement stock is limited.',
    urgency: 'ignorable',
    choices: [
      {
        id: 'tools-fabricate',
        name: 'Fabricate replacements locally',
        description:
          'Divert workshop time to make new tools. Costs materials but builds self-sufficiency.',
        attentionCost: 1,
        resourceEffects: { materials: -5, knowledge: 3, resilience: 4 },
      },
      {
        id: 'tools-ration',
        name: 'Ration the existing stock',
        description:
          'Extend tool life through careful allocation. Slows some projects.',
        attentionCost: 0,
        resourceEffects: { momentum: -3 },
      },
    ],
    tags: ['base'],
  },

  // === PRESSING (4) ===
  {
    id: 'event-module3-crack',
    name: 'Structural Crack in Module 3',
    description:
      'A hairline crack appeared in the load-bearing wall of Module 3 during last night\'s temperature drop. The module houses twelve people and the secondary medical bay. The crack will worsen with the next freeze-thaw cycle in five days.',
    urgency: 'pressing',
    choices: [
      {
        id: 'crack-full-repair',
        name: 'Emergency repair — full resources',
        description:
          'Pull a construction crew and materials for a proper structural repair.',
        attentionCost: 3,
        resourceEffects: { resilience: 8, materials: -12 },
      },
      {
        id: 'crack-patch',
        name: 'Temporary patch',
        description:
          'Apply a surface seal and monitor. Good enough for now, not a permanent fix.',
        attentionCost: 1,
        resourceEffects: { resilience: 3, materials: -4 },
      },
      {
        id: 'crack-evacuate',
        name: 'Evacuate and seal the module',
        description:
          'Move everyone out and seal it until repair can be scheduled. Safe, but disruptive.',
        attentionCost: 2,
        resourceEffects: { trust: -5, resilience: 6 },
      },
    ],
    conditions: [{ type: 'week_min', value: 2 }],
    tags: ['base'],
  },
  {
    id: 'event-dust-storm',
    name: 'Dust Storm Warning',
    description:
      'Sensors detect a significant dust storm forming to the west. Estimated arrival in 18 hours. Outdoor work will be impossible for at least two days.',
    urgency: 'pressing',
    choices: [
      {
        id: 'storm-full-prep',
        name: 'Full storm preparation',
        description:
          'Secure all external equipment, seal vents, stockpile water. Comprehensive but labor-intensive.',
        attentionCost: 2,
        resourceEffects: { resilience: 6, momentum: -4, materials: -3 },
      },
      {
        id: 'storm-essential',
        name: 'Essential precautions only',
        description:
          'Seal critical systems and bring in sensitive equipment. Accept some losses.',
        attentionCost: 1,
        resourceEffects: { resilience: 2, momentum: -2 },
      },
    ],
    conditions: [{ type: 'week_min', value: 1 }],
    tags: ['base'],
  },
  {
    id: 'event-supply-shortage',
    name: 'Medical Supply Shortage',
    description:
      'The medical bay is running low on antibiotics and wound care supplies. Current stock covers routine needs for about two weeks. Any serious injury would deplete reserves immediately.',
    urgency: 'pressing',
    choices: [
      {
        id: 'medical-fabricate',
        name: 'Redirect research to synthesis',
        description:
          'Fen\'s team could synthesize basic antibiotics, but it would pause other research.',
        attentionCost: 2,
        resourceEffects: { resilience: 8, knowledge: -3, materials: -5 },
      },
      {
        id: 'medical-ration',
        name: 'Implement strict rationing',
        description:
          'Stretch existing supplies with careful allocation. Risk if a real emergency hits.',
        attentionCost: 1,
        resourceEffects: { resilience: 3, trust: -3 },
      },
    ],
    conditions: [
      { type: 'week_min', value: 2 },
      { type: 'resource_below', target: 'resilience', value: 80 },
    ],
    tags: ['base'],
  },
  {
    id: 'event-leadership-dispute',
    name: 'Department Dispute',
    description:
      'Operations and Infrastructure are both claiming priority on the same material allocation. Neither lead will back down. The crews are watching to see how this gets resolved.',
    urgency: 'pressing',
    choices: [
      {
        id: 'dispute-mediate',
        name: 'Mediate in person',
        description:
          'Sit both leads down and work out a compromise. Takes time but builds trust.',
        attentionCost: 2,
        resourceEffects: { trust: 6, clarity: 3, momentum: -2 },
      },
      {
        id: 'dispute-decide',
        name: 'Make the call yourself',
        description:
          'Assign the materials to one department. Fast, but the other department feels overruled.',
        attentionCost: 1,
        resourceEffects: { momentum: 4, trust: -3 },
      },
      {
        id: 'dispute-split',
        name: 'Split the allocation evenly',
        description:
          'Neither gets everything they wanted. Neither is satisfied, but neither is ignored.',
        attentionCost: 1,
        resourceEffects: { trust: 1, materials: -3 },
      },
    ],
    conditions: [{ type: 'week_min', value: 3 }],
    tags: ['base'],
  },

  // === CRITICAL (3) ===
  {
    id: 'event-water-contamination',
    name: 'Contaminated Water Supply',
    description:
      'Routine testing detected microbial contamination in the primary water tank. Concentration is rising. At current rates, the water becomes unsafe within 48 hours. No secondary supply can sustain the full population.',
    urgency: 'critical',
    choices: [
      {
        id: 'water-purge',
        name: 'Shut down and purge the system',
        description:
          'Take the entire water system offline and sterilize the intake. Forty-eight hours without running water.',
        attentionCost: 4,
        resourceEffects: { trust: -6, resilience: 12, momentum: -5 },
      },
      {
        id: 'water-treat',
        name: 'Chemical treatment while operational',
        description:
          'Treat the water in-place. Faster, but chemical taste will persist for a week.',
        attentionCost: 2,
        resourceEffects: { resilience: 6, trust: -2, materials: -5 },
      },
    ],
    conditions: [{ type: 'week_min', value: 3 }],
    tags: ['base'],
  },
  {
    id: 'event-power-failure',
    name: 'Fusion Plant Shutdown',
    description:
      'The fusion plant\'s containment system triggered an automatic shutdown. Backup generators are holding, but they cannot sustain full settlement load for more than 12 hours.',
    urgency: 'critical',
    choices: [
      {
        id: 'power-restart',
        name: 'Emergency restart procedure',
        description:
          'Attempt to restart the fusion plant. Risk of further damage if the containment fault is real.',
        attentionCost: 3,
        resourceEffects: { resilience: 8, materials: -10, momentum: -3 },
      },
      {
        id: 'power-shed',
        name: 'Load shedding — non-essential systems off',
        description:
          'Shut down greenhouses, workshops, and external lighting. Buy time for a proper diagnostic.',
        attentionCost: 2,
        resourceEffects: { resilience: 5, momentum: -8, trust: -3 },
      },
    ],
    conditions: [{ type: 'week_min', value: 3 }],
    tags: ['base'],
  },
  {
    id: 'event-injury-accident',
    name: 'Construction Accident',
    description:
      'A scaffolding collapse on the southern expansion injured two workers. One has a broken arm, the other a concussion. The crew is shaken. Work has stopped.',
    urgency: 'critical',
    choices: [
      {
        id: 'accident-full-response',
        name: 'Full safety stand-down',
        description:
          'Halt all construction, inspect every site, treat the injured, address the crew. Thorough but costly.',
        attentionCost: 3,
        resourceEffects: { trust: 5, resilience: 4, momentum: -8, clarity: 4 },
      },
      {
        id: 'accident-targeted',
        name: 'Treat and investigate the site',
        description:
          'Focus on the injured workers and the specific failure. Other projects continue.',
        attentionCost: 2,
        resourceEffects: { trust: -2, resilience: 2, momentum: -3, clarity: 2 },
      },
    ],
    conditions: [{ type: 'week_min', value: 3 }],
    tags: ['base'],
  },
];
