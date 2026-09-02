export interface NormalizedLandmark {
  x: number; // 0.0 to 1.0 (horizontal normalized coordinate)
  y: number; // 0.0 to 1.0 (vertical normalized coordinate)
  z: number; // depth landmark relative to wrist
  visibility?: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export type HandGestureType = 
  | 'DRAWING'         // ☝️ Index finger up, other fingers curled
  | 'HOVER'           // ✌️ Peace sign or moving finger without drawing
  | 'OPEN_PALM'       // ✋ All fingers extended (pause / navigation)
  | 'FIST'            // ✊ All fingers curled (standby / inactive)
  | 'PINCH'           // 🤏 Index and thumb touching (quick action / color switch)
  | 'THUMBS_UP'       // 👍 Thumbs up (quick save / snapshot)
  | 'UNKNOWN';

export interface GestureDetectionResult {
  gesture: HandGestureType;
  confidence: number;
  isDrawing: boolean;
  activeHandIndex: number;
  fingertip: NormalizedLandmark | null;
  rawLandmarks: NormalizedLandmark[];
  handScore?: number;
}

export interface LiveTrackingData {
  smoothedPoint: ScreenPoint | null;
  rawScreenPoint: ScreenPoint | null;
  allScreenLandmarks: ScreenPoint[];
  gestureResult: GestureDetectionResult;
  handDetected: boolean;
  timestamp: number;
}

export interface HandTrackerOptions {
  maxHands?: number;
  minDetectionConfidence?: number;
  minPresenceConfidence?: number;
  minTrackingConfidence?: number;
  delegate?: 'GPU' | 'CPU';
  mirror?: boolean;
}

export interface CameraState {
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  selectedDeviceId: string | null;
  devices: MediaDeviceInfo[];
  videoWidth: number;
  videoHeight: number;
  isMirrored: boolean;
}

export interface VisionStatus {
  isModelLoaded: boolean;
  isModelLoading: boolean;
  modelError: string | null;
  fps: number;
  handDetected: boolean;
  currentGesture: HandGestureType;
  fingertipCoords: { x: number; y: number } | null;
  screenCoords: { x: number; y: number } | null;
  smoothingFactor: number;
  showSkeleton: boolean;
}

// MediaPipe Hand Landmark IDs
export const LANDMARK_INDEX = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

// Bones/Connections for hand skeleton visualization
export const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [LANDMARK_INDEX.WRIST, LANDMARK_INDEX.THUMB_CMC],
  [LANDMARK_INDEX.THUMB_CMC, LANDMARK_INDEX.THUMB_MCP],
  [LANDMARK_INDEX.THUMB_MCP, LANDMARK_INDEX.THUMB_IP],
  [LANDMARK_INDEX.THUMB_IP, LANDMARK_INDEX.THUMB_TIP],
  // Index Finger
  [LANDMARK_INDEX.WRIST, LANDMARK_INDEX.INDEX_MCP],
  [LANDMARK_INDEX.INDEX_MCP, LANDMARK_INDEX.INDEX_PIP],
  [LANDMARK_INDEX.INDEX_PIP, LANDMARK_INDEX.INDEX_DIP],
  [LANDMARK_INDEX.INDEX_DIP, LANDMARK_INDEX.INDEX_TIP],
  // Middle Finger
  [LANDMARK_INDEX.WRIST, LANDMARK_INDEX.MIDDLE_MCP],
  [LANDMARK_INDEX.MIDDLE_MCP, LANDMARK_INDEX.MIDDLE_PIP],
  [LANDMARK_INDEX.MIDDLE_PIP, LANDMARK_INDEX.MIDDLE_DIP],
  [LANDMARK_INDEX.MIDDLE_DIP, LANDMARK_INDEX.MIDDLE_TIP],
  // Ring Finger
  [LANDMARK_INDEX.WRIST, LANDMARK_INDEX.RING_MCP],
  [LANDMARK_INDEX.RING_MCP, LANDMARK_INDEX.RING_PIP],
  [LANDMARK_INDEX.RING_PIP, LANDMARK_INDEX.RING_DIP],
  [LANDMARK_INDEX.RING_DIP, LANDMARK_INDEX.RING_TIP],
  // Pinky
  [LANDMARK_INDEX.WRIST, LANDMARK_INDEX.PINKY_MCP],
  [LANDMARK_INDEX.PINKY_MCP, LANDMARK_INDEX.PINKY_PIP],
  [LANDMARK_INDEX.PINKY_PIP, LANDMARK_INDEX.PINKY_DIP],
  [LANDMARK_INDEX.PINKY_DIP, LANDMARK_INDEX.PINKY_TIP],
  // Palm Base connections
  [LANDMARK_INDEX.INDEX_MCP, LANDMARK_INDEX.MIDDLE_MCP],
  [LANDMARK_INDEX.MIDDLE_MCP, LANDMARK_INDEX.RING_MCP],
  [LANDMARK_INDEX.RING_MCP, LANDMARK_INDEX.PINKY_MCP],
];
