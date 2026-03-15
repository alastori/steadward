import type { SaveFile } from '../serializer';
import { CURRENT_SAVE_VERSION } from '../serializer';

export interface Migration {
  from: number;
  to: number;
  up: (save: unknown) => unknown;
}

const migrations: Migration[] = [
  // Add migrations here as the schema evolves:
  // { from: 1, to: 2, up: migrateV1toV2 },
];

export function migrateSave(save: { version: number }): SaveFile {
  let current = save;
  while (current.version < CURRENT_SAVE_VERSION) {
    const migration = migrations.find((m) => m.from === current.version);
    if (!migration) {
      throw new Error(`No migration path from v${current.version} to v${CURRENT_SAVE_VERSION}`);
    }
    current = migration.up(current) as { version: number };
  }
  return current as SaveFile;
}
