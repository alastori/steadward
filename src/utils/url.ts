export interface GameConfig {
  seed: string | null;
  challenge: string | null;
}

export function parseGameConfig(): GameConfig {
  const params = new URLSearchParams(window.location.search);
  return {
    seed: params.get('seed'),
    challenge: params.get('challenge'),
  };
}
