import type { ScreenPoint } from './vision';

export type MouseActionType = 
  | 'MOVE' 
  | 'LEFT_CLICK' 
  | 'RIGHT_CLICK' 
  | 'DOUBLE_CLICK' 
  | 'DRAG' 
  | 'SCROLL_UP' 
  | 'SCROLL_DOWN' 
  | 'IDLE';

export interface VirtualMouseState {
  point: ScreenPoint | null;
  action: MouseActionType;
  isLeftClicking: boolean;
  isRightClicking: boolean;
  isDragging: boolean;
  isScrolling: boolean;
  clickProgress: number; // 0 to 1 for pinch feedback
  hoveredElementDescription: string | null;
  timestamp: number;
}

export interface MouseSettings {
  enabled: boolean;
  cursorSpeed: number; // 0.5 to 2.0
  pinchSensitivity: number; // 0.5 to 1.5
  enableRealDomClicks: boolean;
  soundEnabled: boolean;
  scrollSpeed: number;
}
