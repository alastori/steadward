import type { ContentPack } from '../types/content';
import { baseLeaders } from './base-pack/leaders';
import { baseInitiatives } from './base-pack/initiatives';
import { baseEvents } from './base-pack/events';
import { BASE_BALANCE } from './base-pack/balance';

export const basePack: ContentPack = {
  id: 'base',
  name: 'Base Game',
  version: '1.0.0',
  leaders: baseLeaders,
  initiatives: baseInitiatives,
  events: baseEvents,
  balance: BASE_BALANCE,
};
