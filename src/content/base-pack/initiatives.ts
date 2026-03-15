import type { InitiativeDefinition } from '../../types/initiatives';

export const baseInitiatives: InitiativeDefinition[] = [
  // === OPERATIONS (5) ===
  {
    id: 'init-water-recycler',
    name: 'Water Recycler Overhaul',
    description:
      'The Module 7 recycler is running at 70% efficiency. A full teardown and rebuild would restore it, but the unit cannot be offline for more than three days without rationing.',
    department: 'operations',
    attentionCost: 3,
    duration: 2,
    requiredResources: { materials: 20, knowledge: 15 },
    outcomeOverseen: {
      resourceEffects: { resilience: 10, materials: -8 },
      description:
        'Recycler restored to full capacity. The rebuild revealed a corroded intake valve — replacing it now prevents a failure in four weeks.',
    },
    outcomeDelegated: {
      resourceEffects: { resilience: 6, materials: -5 },
      description:
        'Recycler is functional. The crew replaced obvious components but skipped the deep inspection to stay on schedule.',
      descriptionPartial:
        'Recycler partially restored. Some components were back-ordered from storage.',
    },
    tags: ['base', 'week-1'],
  },
  {
    id: 'init-crew-rotation',
    name: 'Crew Rotation Restructure',
    description:
      'The current shift schedule was designed for a smaller crew. People are covering gaps with overtime, and fatigue complaints are increasing.',
    department: 'operations',
    attentionCost: 2,
    duration: 1,
    requiredResources: { trust: 25, clarity: 20 },
    outcomeOverseen: {
      resourceEffects: { trust: 5, momentum: 8, resilience: 4 },
      description:
        'New rotation implemented with minimal friction. Crew leads were consulted individually, and the transition was phased over three days.',
    },
    outcomeDelegated: {
      resourceEffects: { trust: 1, momentum: 6 },
      description:
        'Rotation changed. Some crew members feel the new schedule was imposed without input.',
    },
    tags: ['base', 'week-1'],
  },
  {
    id: 'init-supply-audit',
    name: 'Supply Chain Audit',
    description:
      'Inventory records have drifted from reality. A full audit would surface shortages before they become emergencies, but it means halting distribution for two days.',
    department: 'operations',
    attentionCost: 2,
    duration: 1,
    requiredResources: { clarity: 15 },
    outcomeOverseen: {
      resourceEffects: { clarity: 10, materials: 5, knowledge: 3 },
      description:
        'Audit complete. Found twelve mislogged crates and a medical supply surplus that was recorded as consumed.',
    },
    outcomeDelegated: {
      resourceEffects: { clarity: 6, materials: 3 },
      description:
        'Audit finished. The broad strokes are accurate now, but some category-level discrepancies remain unresolved.',
    },
    tags: ['base'],
  },
  {
    id: 'init-power-grid',
    name: 'Power Grid Stabilization',
    description:
      'Voltage fluctuations have tripped breakers in three modules this week. The grid needs load balancing and a few aging conduits replaced.',
    department: 'operations',
    attentionCost: 3,
    duration: 2,
    requiredResources: { materials: 25, knowledge: 10 },
    outcomeOverseen: {
      resourceEffects: { resilience: 12, momentum: 4, materials: -10 },
      description:
        'Grid stabilized. Load balancing reconfigured and conduits replaced. The voltage log shows clean output for the first time in weeks.',
    },
    outcomeDelegated: {
      resourceEffects: { resilience: 7, materials: -8 },
      description:
        'Main conduits replaced. Load balancing improved but not fully optimized. Fluctuations may recur under peak demand.',
    },
    tags: ['base'],
  },
  {
    id: 'init-food-preservation',
    name: 'Food Preservation Upgrade',
    description:
      'Current cold storage is losing temperature control. Half the perishable stock is at risk if the cooling units fail during the warm season.',
    department: 'operations',
    attentionCost: 2,
    duration: 2,
    requiredResources: { materials: 15, resilience: 10 },
    outcomeOverseen: {
      resourceEffects: { resilience: 8, materials: -6, trust: 3 },
      description:
        'Cold storage rebuilt with redundant cooling. Food waste dropped to near zero. The crew appreciated someone noticing the problem before it became a crisis.',
    },
    outcomeDelegated: {
      resourceEffects: { resilience: 5, materials: -5 },
      description:
        'Primary cooling unit replaced. Backup still running on the old system. Better, but not redundant.',
    },
    tags: ['base'],
  },

  // === INFRASTRUCTURE (4) ===
  {
    id: 'init-south-expansion',
    name: 'Southern Module Expansion',
    description:
      'The settlement is running out of living space. Expanding the southern module would house twenty more people and relieve pressure on the overcrowded eastern quarters.',
    department: 'infrastructure',
    attentionCost: 4,
    duration: 3,
    requiredResources: { materials: 35, trust: 20, momentum: 15 },
    outcomeOverseen: {
      resourceEffects: { trust: 10, resilience: 6, materials: -20 },
      description:
        'Expansion complete and occupied. The new module includes improved ventilation based on lessons from Module 7.',
    },
    outcomeDelegated: {
      resourceEffects: { trust: 6, resilience: 3, materials: -15 },
      description:
        'Module is built and livable, but Rook cut the ventilation ducting short to save time.',
      descriptionPartial:
        'Structure complete but interior work is unfinished. Occupants are making do.',
    },
    tags: ['base', 'week-1'],
  },
  {
    id: 'init-perimeter-wall',
    name: 'Perimeter Wall Reinforcement',
    description:
      'Sections of the outer wall are deteriorating. Storm season will test every weak point. Reinforcing now is cheaper than repairing after a breach.',
    department: 'infrastructure',
    attentionCost: 3,
    duration: 2,
    requiredResources: { materials: 30, momentum: 10 },
    outcomeOverseen: {
      resourceEffects: { resilience: 10, materials: -15, momentum: 3 },
      description:
        'Wall reinforced along the full eastern face. Foundation anchors replaced where erosion had undercut the base.',
    },
    outcomeDelegated: {
      resourceEffects: { resilience: 6, materials: -12 },
      description:
        'Priority sections reinforced. Three secondary sections deferred to next cycle.',
    },
    tags: ['base'],
  },
  {
    id: 'init-workshop-setup',
    name: 'Workshop Consolidation',
    description:
      'Tools and fabrication equipment are scattered across four modules. Centralizing into a proper workshop would speed every future construction project.',
    department: 'infrastructure',
    attentionCost: 2,
    duration: 1,
    requiredResources: { materials: 15, clarity: 10 },
    outcomeOverseen: {
      resourceEffects: { momentum: 10, clarity: 5, materials: -8 },
      description:
        'Workshop operational. Tools inventoried, benches arranged by function, power feeds consolidated. First project out: replacement brackets for Module 3.',
    },
    outcomeDelegated: {
      resourceEffects: { momentum: 6, materials: -6 },
      description:
        'Equipment moved, mostly organized. Some crews are still going to the old locations out of habit.',
    },
    tags: ['base'],
  },
  {
    id: 'init-road-repair',
    name: 'Access Road Repair',
    description:
      'The main supply road between the settlement and the eastern depot is rutted and partially washed out. Heavy transport is taking twice as long.',
    department: 'infrastructure',
    attentionCost: 2,
    duration: 1,
    requiredResources: { materials: 20 },
    outcomeOverseen: {
      resourceEffects: { momentum: 8, materials: -10, resilience: 3 },
      description:
        'Road graded, drainage channels cleared, worst sections resurfaced. Transport times back to normal.',
    },
    outcomeDelegated: {
      resourceEffects: { momentum: 5, materials: -8 },
      description:
        'Main route passable again. Side access still rough. Good enough for now.',
    },
    tags: ['base'],
  },

  // === RESEARCH (3) ===
  {
    id: 'init-fungal-filtration',
    name: 'Fungal Filtration Prototype',
    description:
      'Fen\'s team identified a local fungal strain with promising filtration properties. A working prototype could reduce dependence on imported filter components.',
    department: 'research',
    attentionCost: 3,
    duration: 3,
    requiredResources: { knowledge: 30, materials: 15 },
    outcomeOverseen: {
      resourceEffects: { knowledge: 15, resilience: 8, materials: 5 },
      description:
        'Prototype functional. Filtration rate exceeds synthetic filters by 15%. Fen documented the full cultivation process.',
    },
    outcomeDelegated: {
      resourceEffects: { knowledge: 10, resilience: 3 },
      description:
        'Prototype works intermittently. Cultures are sensitive to temperature variation. Fen needs another cycle to stabilize.',
    },
    tags: ['base'],
  },
  {
    id: 'init-soil-analysis',
    name: 'Agricultural Soil Analysis',
    description:
      'The eastern plots might support grain cultivation, but nobody has tested the soil composition systematically. Proper analysis takes time but could open a food source.',
    department: 'research',
    attentionCost: 2,
    duration: 2,
    requiredResources: { knowledge: 20 },
    outcomeOverseen: {
      resourceEffects: { knowledge: 12, clarity: 8, materials: 3 },
      description:
        'Analysis complete. Eastern plots viable for warm-season grain. Mineral anomalies documented for future study.',
    },
    outcomeDelegated: {
      resourceEffects: { knowledge: 8, clarity: 4 },
      description:
        'Broad results in. Soil is suitable, probably. Fen wants more samples before she commits to a recommendation.',
    },
    tags: ['base'],
  },
  {
    id: 'init-weather-modeling',
    name: 'Weather Pattern Modeling',
    description:
      'Storm predictions are based on last year\'s patterns and guesswork. A systematic weather model would give the settlement advance warning of severe conditions.',
    department: 'research',
    attentionCost: 2,
    duration: 2,
    requiredResources: { knowledge: 15, clarity: 15 },
    outcomeOverseen: {
      resourceEffects: { clarity: 12, knowledge: 8, resilience: 4 },
      description:
        'Model operational. Three-day forecasts now reliable. Detected a pressure pattern that suggests early storm season this year.',
    },
    outcomeDelegated: {
      resourceEffects: { clarity: 7, knowledge: 5 },
      description:
        'Basic model running. One-day forecasts are useful. Longer range still unreliable. More sensor data needed.',
    },
    tags: ['base'],
  },

  // === EXTERNAL AFFAIRS (3) ===
  {
    id: 'init-eastern-survey',
    name: 'Eastern Ridge Survey',
    description:
      'Satellite scans suggest mineral deposits in the eastern ridge, but the data is low-resolution. A ground team needs three days on-site to confirm.',
    department: 'external-affairs',
    attentionCost: 2,
    duration: 1,
    requiredResources: { materials: 10, momentum: 20 },
    outcomeOverseen: {
      resourceEffects: { knowledge: 12, clarity: 5 },
      description:
        'Survey complete. Copper and silicate deposits confirmed at accessible depth. Team also identified a sheltered campsite for future expeditions.',
    },
    outcomeDelegated: {
      resourceEffects: { knowledge: 8, clarity: 3 },
      description:
        'Deposits confirmed, but the team turned back before mapping the full vein extent. We know there is copper — not yet how much.',
    },
    tags: ['base', 'week-1'],
  },
  {
    id: 'init-relay-expansion',
    name: 'Communications Relay Expansion',
    description:
      'The relay network covers the settlement and nearby zones but has dead spots in the eastern valleys. Expanding coverage would improve survey safety and enable trade contacts.',
    department: 'external-affairs',
    attentionCost: 3,
    duration: 2,
    requiredResources: { materials: 20, knowledge: 15 },
    outcomeOverseen: {
      resourceEffects: { clarity: 10, knowledge: 5, momentum: 5, materials: -12 },
      description:
        'Two new relay nodes installed. Coverage now extends to the eastern ridge and the northern basin. Signal quality is strong.',
    },
    outcomeDelegated: {
      resourceEffects: { clarity: 6, knowledge: 3, materials: -10 },
      description:
        'One relay node installed at the primary location. Second node deferred due to weather. Coverage improved but gaps remain.',
    },
    tags: ['base'],
  },
  {
    id: 'init-trade-route',
    name: 'Trade Route Scouting',
    description:
      'If other settlements are reachable, trade could solve resource bottlenecks that internal production cannot. But scouting takes people away from the settlement.',
    department: 'external-affairs',
    attentionCost: 3,
    duration: 2,
    requiredResources: { momentum: 25, trust: 15 },
    outcomeOverseen: {
      resourceEffects: { materials: 10, trust: 5, knowledge: 8, momentum: -5 },
      description:
        'Route established to a small settlement 80km northeast. They have surplus medical supplies and need construction materials. First exchange scheduled.',
    },
    outcomeDelegated: {
      resourceEffects: { materials: 5, knowledge: 5, momentum: -3 },
      description:
        'Team found a viable path but did not make formal contact. The settlement was observed from a distance. Osei recommends a follow-up expedition.',
    },
    tags: ['base'],
  },
];
