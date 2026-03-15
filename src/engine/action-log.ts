import type { ActionLogEntry } from './game-store';

export function formatActionLog(log: ReadonlyArray<ActionLogEntry>): string {
  return log
    .map((entry, i) => {
      const mark = entry.highlight ? ' [!]' : '';
      return `${i + 1}. ${entry.action.type}${mark}`;
    })
    .join('\n');
}
