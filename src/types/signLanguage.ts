import type { NormalizedLandmark } from './vision';

export type AppMode = 'draw' | 'sign';

export type SignCategory = 'alphabet' | 'phrase' | 'number' | 'action';

export interface SignDefinition {
  id: string;
  name: string;
  category: SignCategory;
  symbol: string;
  spokenText: string;
  description: string;
  emoji: string;
  tips: string;
}

export interface SignDetection {
  id: string;
  name: string;
  symbol: string;
  spokenText: string;
  category: SignCategory;
  emoji: string;
  confidence: number;
  isStable: boolean;
  holdProgress: number; // 0.0 to 1.0 (reaches 1.0 when committed)
  rawLandmarks: NormalizedLandmark[];
}

export interface SpeechSettings {
  enabled: boolean;
  rate: number;       // 0.5 to 2.0 (default 1.0)
  pitch: number;      // 0.5 to 2.0 (default 1.0)
  voiceURI: string | null;
  autoPronounce: boolean;
  pronounceLetters: boolean;
  pronounceWords: boolean;
}

export interface TranscriptItem {
  id: string;
  text: string;
  type: 'letter' | 'word' | 'phrase' | 'space';
  timestamp: number;
  signId?: string;
  emoji?: string;
}
