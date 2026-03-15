import type { GameStore } from '../../engine/game-store';
import { createIndexedDBAdapter } from '../../persistence/storage-adapter';
import { createSaveManager } from '../../persistence/save-manager';

export function renderSaveLoadPanel(
  container: HTMLElement,
  store: GameStore,
  onClose: () => void,
): void {
  const storage = createIndexedDBAdapter();
  const saveManager = createSaveManager(store, storage);

  const overlay = document.createElement('div');
  overlay.className = 'save-overlay';
  overlay.innerHTML = `
    <div class="save-panel">
      <div class="save-panel-header">
        <h2 class="section-heading">Save / Load</h2>
        <button class="btn-secondary save-close" type="button">Close</button>
      </div>
      <div class="save-slots" id="save-slots">Loading...</div>
      <div class="save-actions">
        <button class="btn-primary save-btn" data-slot="manual-1" type="button">Save to Slot 1</button>
        <button class="btn-primary save-btn" data-slot="manual-2" type="button">Save to Slot 2</button>
        <button class="btn-primary save-btn" data-slot="manual-3" type="button">Save to Slot 3</button>
      </div>
      <div class="save-export">
        <button class="btn-secondary export-btn" type="button">Export JSON</button>
        <button class="btn-secondary import-btn" type="button">Import JSON</button>
        <input type="file" class="import-input" accept=".json" style="display:none" />
      </div>
      <p class="save-status" id="save-status"></p>
    </div>
  `;
  container.appendChild(overlay);

  const statusEl = overlay.querySelector('#save-status') as HTMLElement;
  const slotsEl = overlay.querySelector('#save-slots') as HTMLElement;

  function setStatus(msg: string) {
    statusEl.textContent = msg;
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  }

  // Load slot list
  async function refreshSlots() {
    const saves = await storage.listSaves();
    if (saves.length === 0) {
      slotsEl.innerHTML = '<p class="empty-state">No saves yet.</p>';
      return;
    }
    slotsEl.innerHTML = saves
      .map(
        (s) => `
      <div class="save-slot-row">
        <span class="save-slot-name">${s.slotId}</span>
        <span class="save-slot-info">Week ${s.weekNumber} · Autonomy ${s.autonomyScore}</span>
        <span class="save-slot-date">${new Date(s.savedAt).toLocaleDateString()}</span>
        <button class="btn-secondary load-btn" data-slot="${s.slotId}" type="button">Load</button>
      </div>
    `,
      )
      .join('');
  }
  refreshSlots();

  // Save
  overlay.addEventListener('click', async (e) => {
    const saveBtn = (e.target as HTMLElement).closest('.save-btn') as HTMLElement | null;
    if (saveBtn) {
      const slot = saveBtn.dataset.slot!;
      await saveManager.save(slot);
      setStatus(`Saved to ${slot}.`);
      refreshSlots();
      return;
    }

    const loadBtn = (e.target as HTMLElement).closest('.load-btn') as HTMLElement | null;
    if (loadBtn) {
      const slot = loadBtn.dataset.slot!;
      const loaded = await saveManager.load(slot);
      if (loaded) {
        setStatus(`Loaded ${slot}.`);
        onClose();
      } else {
        setStatus('Failed to load.');
      }
      return;
    }

    if ((e.target as HTMLElement).closest('.save-close')) {
      onClose();
      return;
    }

    if ((e.target as HTMLElement).closest('.export-btn')) {
      const json = JSON.stringify(store.getState(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `steadward-save-week${store.getState().turn.week}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setStatus('Exported.');
      return;
    }

    if ((e.target as HTMLElement).closest('.import-btn')) {
      const input = overlay.querySelector('.import-input') as HTMLInputElement;
      input.click();
      return;
    }
  });

  // Import
  const importInput = overlay.querySelector('.import-input') as HTMLInputElement;
  importInput.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const state = JSON.parse(text);
      store.dispatch({ type: 'LOAD_STATE', state });
      setStatus('Imported.');
      onClose();
    } catch {
      setStatus('Invalid save file.');
    }
  });
}
