export interface RunSummary {
  seed: number;
  weeksSurvived: number;
  outcome: 'win' | 'loss';
  autonomyScore: number;
  runScore: number;
  leadersUsed: string[];
  keyEvents: string[];
  timestamp: string;
}

export interface ShareConfig {
  imageWidth: number;
  imageHeight: number;
  challengeUrl: string;
}
