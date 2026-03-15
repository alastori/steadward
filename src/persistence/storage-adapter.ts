import type { SaveFile, SaveMetadata } from './serializer';

export interface StorageAdapter {
  listSaves(): Promise<SaveMetadata[]>;
  loadSave(slotId: string): Promise<SaveFile | null>;
  writeSave(slotId: string, save: SaveFile): Promise<void>;
  deleteSave(slotId: string): Promise<void>;
  exportSave(slotId: string): Promise<string>;
  importSave(json: string): Promise<SaveFile>;
}

const DB_NAME = 'steadward';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createIndexedDBAdapter(): StorageAdapter {
  return {
    async listSaves(): Promise<SaveMetadata[]> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAllKeys();
        request.onsuccess = () => {
          const keys = request.result as string[];
          const metaRequests = keys.map(
            (key) =>
              new Promise<SaveMetadata | null>((res) => {
                const r = store.get(key);
                r.onsuccess = () => {
                  const save = r.result as SaveFile | undefined;
                  if (!save) return res(null);
                  res({
                    slotId: key,
                    savedAt: save.savedAt,
                    weekNumber: save.metadata.weekNumber,
                    autonomyScore: save.metadata.autonomyScore,
                  });
                };
                r.onerror = () => res(null);
              }),
          );
          Promise.all(metaRequests).then((results) =>
            resolve(results.filter((r): r is SaveMetadata => r !== null)),
          );
        };
        request.onerror = () => reject(request.error);
      });
    },

    async loadSave(slotId: string): Promise<SaveFile | null> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).get(slotId);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
      });
    },

    async writeSave(slotId: string, save: SaveFile): Promise<void> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const request = tx.objectStore(STORE_NAME).put(save, slotId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async deleteSave(slotId: string): Promise<void> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const request = tx.objectStore(STORE_NAME).delete(slotId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async exportSave(slotId: string): Promise<string> {
      const save = await this.loadSave(slotId);
      if (!save) throw new Error(`No save in slot: ${slotId}`);
      return JSON.stringify(save);
    },

    async importSave(json: string): Promise<SaveFile> {
      const save = JSON.parse(json) as SaveFile;
      if (typeof save.version !== 'number') {
        throw new Error('Invalid save file: missing version');
      }
      return save;
    },
  };
}
