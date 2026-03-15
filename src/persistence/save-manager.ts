import type { GameStore } from '../engine/game-store';
import type { StorageAdapter } from './storage-adapter';
import { createSaveFile } from './serializer';
import { migrateSave } from './migrations';

export interface SaveManager {
  save(slotId?: string): Promise<void>;
  load(slotId?: string): Promise<boolean>;
  autosave(): Promise<void>;
}

const AUTOSAVE_SLOT = 'autosave';
const AUTOSAVE_BACKUP_SLOT = 'autosave-backup';

export function createSaveManager(
  store: GameStore,
  storage: StorageAdapter,
): SaveManager {
  return {
    async save(slotId = 'manual-1') {
      const save = createSaveFile(
        store.getState(),
        [...store.getActionLog()],
      );
      await storage.writeSave(slotId, save);
    },

    async load(slotId = 'manual-1') {
      const raw = await storage.loadSave(slotId);
      if (!raw) return false;
      const save = migrateSave(raw);
      store.dispatch({ type: 'LOAD_STATE', state: save.gameState });
      return true;
    },

    async autosave() {
      // Rotate: current autosave becomes backup
      const existing = await storage.loadSave(AUTOSAVE_SLOT);
      if (existing) {
        await storage.writeSave(AUTOSAVE_BACKUP_SLOT, existing);
      }
      const save = createSaveFile(
        store.getState(),
        [...store.getActionLog()],
      );
      await storage.writeSave(AUTOSAVE_SLOT, save);
    },
  };
}
