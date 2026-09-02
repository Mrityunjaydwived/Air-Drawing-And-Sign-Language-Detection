import type { 
  NormalizedLandmark, 
  GestureDetectionResult, 
  HandGestureType 
} from '../types/vision';
import { LANDMARK_INDEX } from '../types/vision';

// Utility helper to calculate Euclidean distance between two 3D or 2D landmarks
export function getDistance(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Utility helper to calculate 2D Euclidean distance
export function get2DDistance(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export class GestureDetector {
  private gestureHistory: HandGestureType[] = [];
  private readonly historyWindowSize: number = 3;

  /**
   * Analyzes a single hand's 21 landmarks to determine the active gesture
   */
  public detectGesture(
    landmarks: NormalizedLandmark[], 
    handIndex: number = 0,
    handScore: number = 1.0
  ): GestureDetectionResult {
    if (!landmarks || landmarks.length < 21) {
      return {
        gesture: 'UNKNOWN',
        confidence: 0,
        isDrawing: false,
        activeHandIndex: handIndex,
        fingertip: null,
        rawLandmarks: [],
        handScore: 0,
      };
    }

    const wrist = landmarks[LANDMARK_INDEX.WRIST];
    const thumbTip = landmarks[LANDMARK_INDEX.THUMB_TIP];
    const thumbIP = landmarks[LANDMARK_INDEX.THUMB_IP];
    const thumbMCP = landmarks[LANDMARK_INDEX.THUMB_MCP];

    const indexTip = landmarks[LANDMARK_INDEX.INDEX_TIP];
    const indexPIP = landmarks[LANDMARK_INDEX.INDEX_PIP];
    const indexMCP = landmarks[LANDMARK_INDEX.INDEX_MCP];

    const middleTip = landmarks[LANDMARK_INDEX.MIDDLE_TIP];
    const middlePIP = landmarks[LANDMARK_INDEX.MIDDLE_PIP];
    const middleMCP = landmarks[LANDMARK_INDEX.MIDDLE_MCP];

    const ringTip = landmarks[LANDMARK_INDEX.RING_TIP];
    const ringPIP = landmarks[LANDMARK_INDEX.RING_PIP];
    const ringMCP = landmarks[LANDMARK_INDEX.RING_MCP];

    const pinkyTip = landmarks[LANDMARK_INDEX.PINKY_TIP];
    const pinkyPIP = landmarks[LANDMARK_INDEX.PINKY_PIP];
    const pinkyMCP = landmarks[LANDMARK_INDEX.PINKY_MCP];

    // Reference scale: distance between wrist and index MCP (palm size)
    const palmScale = Math.max(getDistance(wrist, indexMCP), 0.08);

    // Finger extension checks:
    // A finger is extended if its TIP is further from the wrist than its PIP/MCP joint by a margin relative to palm scale
    const isIndexExtended = 
      getDistance(indexTip, wrist) > getDistance(indexPIP, wrist) * 1.15 &&
      getDistance(indexTip, indexMCP) > getDistance(indexPIP, indexMCP) * 1.35;

    const isMiddleExtended = 
      getDistance(middleTip, wrist) > getDistance(middlePIP, wrist) * 1.12 &&
      getDistance(middleTip, middleMCP) > getDistance(middlePIP, middleMCP) * 1.35;

    const isRingExtended = 
      getDistance(ringTip, wrist) > getDistance(ringPIP, wrist) * 1.12 &&
      getDistance(ringTip, ringMCP) > getDistance(ringPIP, ringMCP) * 1.35;

    const isPinkyExtended = 
      getDistance(pinkyTip, wrist) > getDistance(pinkyPIP, wrist) * 1.12 &&
      getDistance(pinkyTip, pinkyMCP) > getDistance(pinkyPIP, pinkyMCP) * 1.35;

    // Thumb extension check
    const isThumbExtended = 
      getDistance(thumbTip, pinkyMCP) > getDistance(thumbIP, pinkyMCP) * 1.15 &&
      getDistance(thumbTip, wrist) > getDistance(thumbMCP, wrist) * 1.15;

    // Pinch check (Distance between index tip and thumb tip)
    const pinchDistance = getDistance(indexTip, thumbTip) / palmScale;
    const isPinching = pinchDistance < 0.45;

    // Thumbs up check: Thumb extended upwards (thumbTip.y < thumbMCP.y - 0.05), others curled
    const isThumbUp = 
      isThumbExtended && 
      (thumbTip.y < thumbMCP.y - 0.04) && 
      !isIndexExtended && 
      !isMiddleExtended && 
      !isRingExtended && 
      !isPinkyExtended;

    let detectedGesture: HandGestureType = 'UNKNOWN';
    let confidence = 0.8;

    // Gesture Classification:
    if (isPinching) {
      detectedGesture = 'PINCH';
      confidence = Math.max(0.7, 1 - pinchDistance);
    } else if (isThumbUp) {
      detectedGesture = 'THUMBS_UP';
      confidence = 0.92;
    } else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // ☝️ Clear index finger extended drawing gesture
      detectedGesture = 'DRAWING';
      confidence = 0.95;
    } else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // ✌️ Peace sign / Hover
      detectedGesture = 'HOVER';
      confidence = 0.9;
    } else if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      // ✋ Open palm
      detectedGesture = 'OPEN_PALM';
      confidence = 0.88;
    } else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // ✊ Fist / Closed hand
      detectedGesture = 'FIST';
      confidence = 0.85;
    } else {
      // Ambiguous or transitioning gesture - if index is extended, default to hover
      detectedGesture = isIndexExtended ? 'HOVER' : 'UNKNOWN';
      confidence = 0.6;
    }

    // Debounce / Smooth gesture transitions
    const smoothedGesture = this.smoothGesture(detectedGesture);
    const isDrawing = smoothedGesture === 'DRAWING';

    return {
      gesture: smoothedGesture,
      confidence,
      isDrawing,
      activeHandIndex: handIndex,
      fingertip: indexTip,
      rawLandmarks: landmarks,
      handScore,
    };
  }

  private smoothGesture(current: HandGestureType): HandGestureType {
    this.gestureHistory.push(current);
    if (this.gestureHistory.length > this.historyWindowSize) {
      this.gestureHistory.shift();
    }

    // Fast-path: if current is drawing, transition immediately to avoid drawing lag
    if (current === 'DRAWING') {
      return 'DRAWING';
    }

    // Otherwise require majority in window to prevent noisy false drops
    const counts = new Map<HandGestureType, number>();
    for (const g of this.gestureHistory) {
      counts.set(g, (counts.get(g) || 0) + 1);
    }

    let dominantGesture: HandGestureType = current;
    let maxCount = 0;
    counts.forEach((count, gesture) => {
      if (count > maxCount) {
        maxCount = count;
        dominantGesture = gesture;
      }
    });

    return dominantGesture;
  }

  public reset(): void {
    this.gestureHistory = [];
  }
}

export const gestureDetector = new GestureDetector();
