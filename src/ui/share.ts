import type { RunSummary } from '../types/sharing';

const SHARE_WIDTH = 1200;
const SHARE_HEIGHT = 630;

/** Generate a shareable image as a canvas */
export function generateShareImage(summary: RunSummary): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0D1117';
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);

  // Border accent
  const accentColor = summary.outcome === 'win' ? '#7EE787' : '#F85149';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, SHARE_WIDTH - 4, SHARE_HEIGHT - 4);

  // Title
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('STEADWARD', SHARE_WIDTH / 2, 80);

  // Outcome
  ctx.fillStyle = '#E6EDF3';
  ctx.font = 'bold 32px monospace';
  const outcomeText = summary.outcome === 'win' ? 'AUTONOMY ACHIEVED' : 'SETTLEMENT FAILED';
  ctx.fillText(outcomeText, SHARE_WIDTH / 2, 140);

  // Stats
  ctx.fillStyle = '#8B949E';
  ctx.font = '24px sans-serif';
  ctx.fillText(`Week ${summary.weeksSurvived} · Score ${summary.runScore}`, SHARE_WIDTH / 2, 200);
  ctx.fillText(`Autonomy: ${summary.autonomyScore}`, SHARE_WIDTH / 2, 240);

  // Seed
  ctx.fillStyle = '#6E7681';
  ctx.font = '18px monospace';
  ctx.fillText(`SEED: ${summary.seed}`, SHARE_WIDTH / 2, 580);

  return canvas;
}

/** Copy share image to clipboard or trigger download */
export async function shareRun(summary: RunSummary): Promise<void> {
  const canvas = generateShareImage(summary);

  // Try navigator.share first (mobile)
  if (navigator.share) {
    try {
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], 'steadward-run.png', { type: 'image/png' });
      await navigator.share({
        title: `Steadward — ${summary.outcome === 'win' ? 'Victory' : 'Defeat'}`,
        text: `Week ${summary.weeksSurvived}, Score ${summary.runScore}. Can you beat my run?`,
        files: [file],
      });
      return;
    } catch {
      // Fall through to clipboard
    }
  }

  // Clipboard fallback
  try {
    const blob = await canvasToBlob(canvas);
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
  } catch {
    // Download fallback
    const link = document.createElement('a');
    link.download = 'steadward-run.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

/** Generate challenge URL */
export function getChallengeUrl(seed: number): string {
  return `${window.location.origin}${window.location.pathname}?seed=${seed}&challenge=1`;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}
