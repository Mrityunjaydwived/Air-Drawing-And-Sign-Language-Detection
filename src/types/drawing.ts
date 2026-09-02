import type { ScreenPoint } from './vision';

export type BrushMode = 
  | 'normal'     // Smooth anti-aliased studio line
  | 'neon'       // Multi-layered glowing neon bloom
  | 'rainbow'    // Continuous color shifting spectrum
  | 'pencil'     // Textured fine sketch line
  | 'marker'     // Broad translucent highlighter
  | 'sparkle'    // Trail of glowing stardust and light sparks
  | 'eraser';    // Canvas stroke eraser

export interface StrokePoint extends ScreenPoint {
  color?: string;
  size?: number;
  hue?: number;
}

export interface DrawingStroke {
  id: string;
  mode: BrushMode;
  color: string;
  size: number;
  points: StrokePoint[];
  opacity?: number;
}

export interface DrawingSettings {
  brushMode: BrushMode;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  smoothingFactor: number; // 0.1 (high smoothing) to 0.9 (raw/responsive)
  glowIntensity: number;
  showSkeleton: boolean;
  showFingertipCursor: boolean;
  showParticles: boolean;
  showHUD: boolean;
  enableGestureShortcuts: boolean;
  soundEnabled: boolean;
  rainbowSpeed: number;
  canvasBackgroundColor: 'transparent' | '#000000' | '#ffffff' | '#0f172a';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface SavedDrawing {
  id: string;
  title: string;
  timestamp: number;
  thumbnailUrl: string;
  imageDataUrl: string;
  strokeCount: number;
}

export interface ExportOptions {
  includeCamera: boolean;
  format: 'png' | 'jpeg';
  quality: number;
  backgroundColor: string;
}
