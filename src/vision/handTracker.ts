import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { HandTrackerOptions } from '../types/vision';

class HandTrackerService {
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<HandLandmarker> | null = null;
  private lastVideoTime: number = -1;

  public async initialize(options: HandTrackerOptions = {}): Promise<HandLandmarker> {
    if (this.handLandmarker) {
      return this.handLandmarker;
    }

    if (this.isInitializing && this.initializationPromise) {
      return this.initializationPromise;
    }

    this.isInitializing = true;
    this.initializationPromise = (async () => {
      try {
        // Resolve MediaPipe vision WASM binaries from reliable CDN
        const wasmPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
        const vision = await FilesetResolver.forVisionTasks(wasmPath);

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: options.delegate || 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: options.maxHands || 1, // Single hand detection gives maximum FPS boost
          minHandDetectionConfidence: options.minDetectionConfidence || 0.45,
          minHandPresenceConfidence: options.minPresenceConfidence || 0.45,
          minTrackingConfidence: options.minTrackingConfidence || 0.45,
        });

        this.handLandmarker = landmarker;
        this.isInitializing = false;
        return landmarker;
      } catch (error) {
        console.warn('Failed GPU HandLandmarker initialization, attempting CPU fallback...', error);
        try {
          const wasmPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
          const vision = await FilesetResolver.forVisionTasks(wasmPath);

          const landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: options.maxHands || 1,
            minHandDetectionConfidence: 0.45,
            minHandPresenceConfidence: 0.45,
            minTrackingConfidence: 0.45,
          });

          this.handLandmarker = landmarker;
          this.isInitializing = false;
          return landmarker;
        } catch (cpuError) {
          this.isInitializing = false;
          this.initializationPromise = null;
          throw new Error(`MediaPipe HandLandmarker initialization failed: ${cpuError instanceof Error ? cpuError.message : String(cpuError)}`);
        }
      }
    })();

    return this.initializationPromise;
  }

  public detect(videoElement: HTMLVideoElement, timestampMs: number): HandLandmarkerResult | null {
    if (!this.handLandmarker) {
      return null;
    }

    if (
      videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      videoElement.videoWidth === 0 ||
      videoElement.videoHeight === 0
    ) {
      return null;
    }

    // Ensure monotonically increasing timestamp for MediaPipe Video mode
    if (timestampMs <= this.lastVideoTime) {
      timestampMs = this.lastVideoTime + 1;
    }
    this.lastVideoTime = timestampMs;

    try {
      return this.handLandmarker.detectForVideo(videoElement, timestampMs);
    } catch (err) {
      console.error('Error during hand detection frame:', err);
      return null;
    }
  }

  public isReady(): boolean {
    return this.handLandmarker !== null;
  }

  public dispose(): void {
    if (this.handLandmarker) {
      try {
        this.handLandmarker.close();
      } catch (e) {
        console.warn('Error closing hand landmarker:', e);
      }
      this.handLandmarker = null;
    }
    this.isInitializing = false;
    this.initializationPromise = null;
    this.lastVideoTime = -1;
  }
}

export const handTracker = new HandTrackerService();
