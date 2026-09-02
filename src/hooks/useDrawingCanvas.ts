import { useRef, useEffect, useState, useCallback } from 'react';
import type React from 'react';
import { DrawingEngine } from '../drawing/drawingEngine';
import { OverlayRenderer } from '../drawing/overlayRenderer';
import { soundManager } from '../utils/audioUtils';
import { ExportUtils } from '../utils/exportUtils';
import type { DrawingSettings, SavedDrawing } from '../types/drawing';
import type { LiveTrackingData, ScreenPoint } from '../types/vision';

const STORAGE_KEY_GALLERY = 'airdraw_saved_gallery';

interface UseDrawingCanvasOptions {
  canvasWidth: number;
  canvasHeight: number;
  liveTrackingRef: React.RefObject<LiveTrackingData>;
  settings: DrawingSettings;
  isDrawingEnabled?: boolean;
}

export function useDrawingCanvas({
  canvasWidth,
  canvasHeight,
  liveTrackingRef,
  settings,
  isDrawingEnabled = true,
}: UseDrawingCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingEngineRef = useRef<DrawingEngine>(new DrawingEngine());

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);

  const isDrawingRef = useRef(false);
  const isPointerDrawingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastGestureRef = useRef<string | null>(null);

  // Load saved drawings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (stored) {
        setSavedDrawings(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const persistGallery = (items: SavedDrawing[]) => {
    setSavedDrawings(items);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(items));
    } catch {}
  };

  const syncHistoryState = useCallback(() => {
    setCanUndo(drawingEngineRef.current.canUndo());
    setCanRedo(drawingEngineRef.current.canRedo());
    setStrokeCount(drawingEngineRef.current.getStrokes().length);
  }, []);

  // Real-time 60+ FPS Rendering and Stroke Processing Loop
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const tracking = liveTrackingRef.current;
        const brushColor = settings.brushMode === 'eraser' ? '#cbd5e1' : settings.brushColor;

        // Process Stroke Input ONLY if in Draw mode
        if (isDrawingEnabled && tracking && tracking.gestureResult.isDrawing && tracking.smoothedPoint) {
          if (!isDrawingRef.current) {
            isDrawingRef.current = true;
            drawingEngineRef.current.startStroke(tracking.smoothedPoint, settings);
            soundManager.playDrawStart();
          } else {
            drawingEngineRef.current.addPoint(tracking.smoothedPoint, settings);
          }
        } else {
          if (isDrawingRef.current) {
            isDrawingRef.current = false;
            drawingEngineRef.current.endStroke();
            soundManager.playDrawEnd();
            syncHistoryState();
          }
        }

        // Gesture shortcut triggers (when in Draw mode)
        if (isDrawingEnabled && settings.enableGestureShortcuts && tracking && tracking.gestureResult.gesture !== lastGestureRef.current) {
          if (tracking.gestureResult.gesture === 'THUMBS_UP') {
            soundManager.playActionTrigger();
            ExportUtils.triggerCelebration();
          }
          lastGestureRef.current = tracking.gestureResult.gesture;
        }

        // 1. Render all drawing strokes + particles with O(1) double buffer
        drawingEngineRef.current.render(ctx, canvasWidth, canvasHeight);

        // 2. Render Hand Skeleton overlay directly on 2D context
        if (settings.showSkeleton && tracking && tracking.allScreenLandmarks.length > 0) {
          OverlayRenderer.renderSkeleton(
            ctx,
            tracking.allScreenLandmarks,
            isDrawingEnabled && tracking.gestureResult.isDrawing,
            brushColor
          );
        }

        // 3. Render Glowing Fingertip Reticle & Badge (when in Draw mode)
        if (isDrawingEnabled && settings.showFingertipCursor && tracking && tracking.smoothedPoint) {
          OverlayRenderer.renderFingertipCursor(
            ctx,
            tracking.smoothedPoint,
            tracking.gestureResult.gesture,
            tracking.gestureResult.isDrawing,
            brushColor,
            settings.brushSize
          );
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [canvasWidth, canvasHeight, liveTrackingRef, settings, isDrawingEnabled, syncHistoryState]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderLoop]);

  // Actions
  const undo = useCallback(() => {
    const success = drawingEngineRef.current.undo();
    if (success) {
      soundManager.playActionTrigger();
      syncHistoryState();
    }
  }, [syncHistoryState]);

  const redo = useCallback(() => {
    const success = drawingEngineRef.current.redo();
    if (success) {
      soundManager.playActionTrigger();
      syncHistoryState();
    }
  }, [syncHistoryState]);

  const clearCanvas = useCallback(() => {
    drawingEngineRef.current.clear();
    soundManager.playActionTrigger();
    syncHistoryState();
  }, [syncHistoryState]);

  const saveToGallery = useCallback((thumbnailDataUrl?: string) => {
    const canvas = canvasRef.current;
    const dataUrl = thumbnailDataUrl || (canvas ? canvas.toDataURL('image/png') : '');
    const newEntry: SavedDrawing = {
      id: `drawing-${Date.now()}`,
      title: `Air Artwork #${savedDrawings.length + 1}`,
      timestamp: Date.now(),
      thumbnailUrl: dataUrl,
      imageDataUrl: dataUrl,
      strokeCount: drawingEngineRef.current.getStrokes().length,
    };

    const updated = [newEntry, ...savedDrawings];
    persistGallery(updated);
    soundManager.playActionTrigger();
    ExportUtils.triggerCelebration();
    return newEntry;
  }, [savedDrawings]);

  const deleteSavedDrawing = useCallback((id: string) => {
    const updated = savedDrawings.filter(item => item.id !== id);
    persistGallery(updated);
  }, [savedDrawings]);

  // Pointer / Touch fallback event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const point: ScreenPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: performance.now(),
    };
    isPointerDrawingRef.current = true;
    drawingEngineRef.current.startStroke(point, settings);
    soundManager.playDrawStart();
  }, [settings, isDrawingEnabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    if (isPointerDrawingRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const point: ScreenPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        timestamp: performance.now(),
      };
      drawingEngineRef.current.addPoint(point, settings);
    }
  }, [settings, isDrawingEnabled]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawingEnabled) return;
    if (isPointerDrawingRef.current) {
      isPointerDrawingRef.current = false;
      drawingEngineRef.current.endStroke();
      soundManager.playDrawEnd();
      syncHistoryState();
    }
  }, [syncHistoryState, isDrawingEnabled]);

  return {
    canvasRef,
    canUndo,
    canRedo,
    strokeCount,
    savedDrawings,
    undo,
    redo,
    clearCanvas,
    saveToGallery,
    deleteSavedDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
