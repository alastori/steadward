export interface TrackDef {
  id: string;
  src: string;
  volume: number;
  loop: boolean;
}

export interface SfxDef {
  id: string;
  src: string;
  volume: number;
}

// Mode ambient tracks — placeholder paths until real audio is produced
export const MODE_TRACKS: Record<string, TrackDef> = {
  observe: { id: 'amb-observe', src: '/assets/audio/music/observe-ambient.mp3', volume: 0.3, loop: true },
  plan: { id: 'amb-plan', src: '/assets/audio/music/plan-ambient.mp3', volume: 0.3, loop: true },
  execute: { id: 'amb-execute', src: '/assets/audio/music/execute-ambient.mp3', volume: 0.35, loop: true },
  review: { id: 'amb-review', src: '/assets/audio/music/review-ambient.mp3', volume: 0.3, loop: true },
};

// UI sound effects
export const SFX: Record<string, SfxDef> = {
  click: { id: 'sfx-click', src: '/assets/audio/sfx/click.mp3', volume: 0.4 },
  advance: { id: 'sfx-advance', src: '/assets/audio/sfx/phase-advance.mp3', volume: 0.5 },
  startInit: { id: 'sfx-start-init', src: '/assets/audio/sfx/initiative-start.mp3', volume: 0.4 },
  eventAppear: { id: 'sfx-event', src: '/assets/audio/sfx/event-appear.mp3', volume: 0.5 },
  eventResolve: { id: 'sfx-resolve', src: '/assets/audio/sfx/event-resolve.mp3', volume: 0.4 },
  weekEnd: { id: 'sfx-week-end', src: '/assets/audio/sfx/week-end.mp3', volume: 0.5 },
  alertCritical: { id: 'sfx-alert', src: '/assets/audio/sfx/alert-critical.mp3', volume: 0.6 },
};
