import { useState, useEffect, useRef, useCallback } from 'react';
import { handTracker } from '../vision/handTracker';
import { gestureDetector } from '../vision/gestureDetector';
import { CoordinateMapper } from '../vision/coordinateMapper';
import { PointSmoother } from '../vision/smoothing';
import type { 
  NormalizedLandmark, 
  GestureDetectionResult,
  LiveTrackingData 
} from '../types/vision';
import { LANDMARK_INDEX } from '../types/vision';

interface HandTrackingOptions {
  videoElement: HTMLVideoElement | null;
  canvasWidth: number;
  canvasHeight: number;
  isStreaming: boolean;
  isMirrored: boolean;
  smoothingFactor: number;
}

export function useHandTracking({
  videoElement,
  canvasWidth,
  canvasHeight,
  isStreaming,
  isMirrored,
  smoothingFactor,
}: HandTrackingOptions) {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);

  // Throttled UI state updates to prevent React re-render lag
  const [activeGesture, setActiveGesture] = useState<GestureDetectionResult>({
    gesture: 'UNKNOWN',
    confidence: 0,
    isDrawing: false,
    activeHandIndex: -1,
    fingertip: null,
    rawLandmarks: [],
    handScore: 0,
  });
  const [isHandDetected, setIsHandDetected] = useState(false);

  // Fast mutable tracking state for 60+ FPS zero-overhead drawing loop
  const liveTrackingRef = useRef<LiveTrackingData>({
    smoothedPoint: null,
    rawScreenPoint: null,
    allScreenLandmarks: [],
    gestureResult: {
      gesture: 'UNKNOWN',
      confidence: 0,
      isDrawing: false,
      activeHandIndex: -1,
      fingertip: null,
      rawLandmarks: [],
      handScore: 0,
    },
    handDetected: false,
    timestamp: 0,
  });

  const smootherRef = useRef<PointSmoother>(new PointSmoother());
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(performance.now());
  const animationFrameIdRef = useRef<number | null>(null);
  const lastGestureReportedRef = useRef<string>('UNKNOWN');
  const lastHandDetectedReportedRef = useRef<boolean>(false);

  // Update 1-Euro smoother sensitivity
  useEffect(() => {
    smootherRef.current.setBaseAlpha(smoothingFactor);
  }, [smoothingFactor]);

  // Initialize MediaPipe HandLandmarker with high performance settings
  useEffect(() => {
    let isCancelled = false;
    setIsModelLoading(true);
    setModelError(null);

    handTracker.initialize({
      delegate: 'GPU',
      maxHands: 1, // Single hand detection gives maximum FPS
      minDetectionConfidence: 0.45,
      minPresenceConfidence: 0.45,
      minTrackingConfidence: 0.45,
    })
      .then(() => {
        if (!isCancelled) {
          setIsModelLoaded(true);
          setIsModelLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to load HandLandmarker model:', err);
          setIsModelLoaded(false);
          setIsModelLoading(false);
          setModelError(err instanceof Error ? err.message : 'Failed to load hand tracking model.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Tracking Inference & Coordinate Transform Loop (Runs at full camera/display speed)
  const runVisionLoop = useCallback(() => {
    if (!videoElement || !isStreaming || !handTracker.isReady()) {
      animationFrameIdRef.current = requestAnimationFrame(runVisionLoop);
      return;
    }

    const now = performance.now();

    // 1. Calculate FPS once per second
    frameCountRef.current++;
    if (now - fpsTimerRef.current >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - fpsTimerRef.current)));
      frameCountRef.current = 0;
      fpsTimerRef.current = now;
    }

    try {
      const results = handTracker.detect(videoElement, now);

      if (results && results.landmarks && results.landmarks.length > 0) {
        const rawLandmarks = results.landmarks[0] as unknown as NormalizedLandmark[];
        const handScore = results.handedness?.[0]?.[0]?.score ?? 0.95;

        // 1. Gesture Recognition
        const detection = gestureDetector.detectGesture(rawLandmarks, 0, handScore);

        // 2. Coordinate Mapping
        const rawFingertip = rawLandmarks[LANDMARK_INDEX.INDEX_TIP];
        const rawScreenPoint = CoordinateMapper.mapLandmarkToCanvas(rawFingertip, {
          canvasWidth,
          canvasHeight,
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight,
          isMirrored,
          fitMode: 'cover',
        });

        // 3. 1-Euro Dynamic Jitter Filter
        const smoothed = smootherRef.current.smooth(rawScreenPoint);

        // 4. Map all 21 landmarks for skeleton overlay
        const screenLandmarks = CoordinateMapper.mapAllLandmarks(rawLandmarks, {
          canvasWidth,
          canvasHeight,
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight,
          isMirrored,
          fitMode: 'cover',
        });

        // 5. Update high-speed ref without React re-render overhead
        liveTrackingRef.current = {
          smoothedPoint: smoothed,
          rawScreenPoint,
          allScreenLandmarks: screenLandmarks,
          gestureResult: detection,
          handDetected: true,
          timestamp: now,
        };

        // 6. Only trigger React state update if gesture or detection status actually changed
        if (detection.gesture !== lastGestureReportedRef.current || !lastHandDetectedReportedRef.current) {
          lastGestureReportedRef.current = detection.gesture;
          lastHandDetectedReportedRef.current = true;
          setActiveGesture(detection);
          setIsHandDetected(true);
        }
      } else {
        smootherRef.current.reset();
        gestureDetector.reset();

        liveTrackingRef.current = {
          smoothedPoint: null,
          rawScreenPoint: null,
          allScreenLandmarks: [],
          gestureResult: {
            gesture: 'UNKNOWN',
            confidence: 0,
            isDrawing: false,
            activeHandIndex: -1,
            fingertip: null,
            rawLandmarks: [],
            handScore: 0,
          },
          handDetected: false,
          timestamp: now,
        };

        if (lastHandDetectedReportedRef.current) {
          lastGestureReportedRef.current = 'UNKNOWN';
          lastHandDetectedReportedRef.current = false;
          setActiveGesture(liveTrackingRef.current.gestureResult);
          setIsHandDetected(false);
        }
      }
    } catch (err) {
      console.warn('Inference frame warning:', err);
    }

    animationFrameIdRef.current = requestAnimationFrame(runVisionLoop);
  }, [videoElement, isStreaming, canvasWidth, canvasHeight, isMirrored]);

  useEffect(() => {
    if (isStreaming && isModelLoaded) {
      animationFrameIdRef.current = requestAnimationFrame(runVisionLoop);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isStreaming, isModelLoaded, runVisionLoop]);

  return {
    isModelLoaded,
    isModelLoading,
    modelError,
    fps,
    gestureResult: activeGesture,
    handDetected: isHandDetected,
    liveTrackingRef,
  };
}
