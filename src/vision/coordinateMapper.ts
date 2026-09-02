import type { NormalizedLandmark, ScreenPoint } from '../types/vision';

export interface CoordinateMappingOptions {
  canvasWidth: number;
  canvasHeight: number;
  videoWidth?: number;
  videoHeight?: number;
  isMirrored?: boolean;
  fitMode?: 'cover' | 'contain' | 'fill';
}

export class CoordinateMapper {
  /**
   * Transforms a normalized landmark point [0..1] to precise canvas pixel coordinates
   */
  public static mapLandmarkToCanvas(
    landmark: NormalizedLandmark,
    options: CoordinateMappingOptions
  ): ScreenPoint {
    const {
      canvasWidth,
      canvasHeight,
      videoWidth = 640,
      videoHeight = 480,
      isMirrored = true,
      fitMode = 'cover'
    } = options;

    if (canvasWidth <= 0 || canvasHeight <= 0) {
      return { x: 0, y: 0, timestamp: Date.now() };
    }

    // Mirror horizontal coordinate if camera is mirrored
    const rawX = isMirrored ? 1.0 - landmark.x : landmark.x;
    const rawY = landmark.y;

    if (fitMode === 'fill' || !videoWidth || !videoHeight) {
      return {
        x: rawX * canvasWidth,
        y: rawY * canvasHeight,
        timestamp: Date.now(),
      };
    }

    const canvasAspect = canvasWidth / canvasHeight;
    const videoAspect = videoWidth / videoHeight;

    let targetX = rawX * canvasWidth;
    let targetY = rawY * canvasHeight;

    if (fitMode === 'cover') {
      if (canvasAspect > videoAspect) {
        // Video is stretched horizontally to fill width, cropped on top/bottom
        const scale = canvasWidth / videoWidth;
        const renderedHeight = videoHeight * scale;
        const offsetY = (canvasHeight - renderedHeight) / 2;
        targetX = rawX * canvasWidth;
        targetY = rawY * renderedHeight + offsetY;
      } else {
        // Video is stretched vertically to fill height, cropped on left/right
        const scale = canvasHeight / videoHeight;
        const renderedWidth = videoWidth * scale;
        const offsetX = (canvasWidth - renderedWidth) / 2;
        targetX = rawX * renderedWidth + offsetX;
        targetY = rawY * canvasHeight;
      }
    } else if (fitMode === 'contain') {
      if (canvasAspect > videoAspect) {
        // Video fits vertically, letterboxed on left/right
        const scale = canvasHeight / videoHeight;
        const renderedWidth = videoWidth * scale;
        const offsetX = (canvasWidth - renderedWidth) / 2;
        targetX = rawX * renderedWidth + offsetX;
        targetY = rawY * canvasHeight;
      } else {
        // Video fits horizontally, pillarboxed on top/bottom
        const scale = canvasWidth / videoWidth;
        const renderedHeight = videoHeight * scale;
        const offsetY = (canvasHeight - renderedHeight) / 2;
        targetX = rawX * canvasWidth;
        targetY = rawY * renderedHeight + offsetY;
      }
    }

    return {
      x: Math.max(0, Math.min(canvasWidth, targetX)),
      y: Math.max(0, Math.min(canvasHeight, targetY)),
      timestamp: Date.now(),
    };
  }

  /**
   * Batch maps an array of 21 landmarks for skeleton rendering
   */
  public static mapAllLandmarks(
    landmarks: NormalizedLandmark[],
    options: CoordinateMappingOptions
  ): ScreenPoint[] {
    return landmarks.map(lm => this.mapLandmarkToCanvas(lm, options));
  }
}
