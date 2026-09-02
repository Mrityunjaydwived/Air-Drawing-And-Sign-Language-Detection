import { useState, useEffect, useCallback } from 'react';
import { useCamera } from './hooks/useCamera';
import { useHandTracking } from './hooks/useHandTracking';
import { useDrawingCanvas } from './hooks/useDrawingCanvas';
import { useSignLanguage } from './hooks/useSignLanguage';
import type { DrawingSettings, BrushMode } from './types/drawing';
import type { AppMode, SpeechSettings } from './types/signLanguage';

import { CameraView } from './components/CameraView';
import { DrawingCanvas } from './components/DrawingCanvas';

import { StatusPanel } from './components/HUD/StatusPanel';
import { GestureGuide } from './components/HUD/GestureGuide';
import { FloatingToolbar } from './components/Toolbar/FloatingToolbar';

import { SignHUD } from './components/SignLanguage/SignHUD';
import { TranscriptBar } from './components/SignLanguage/TranscriptBar';

import { ExportModal } from './components/Modals/ExportModal';
import { GalleryModal } from './components/Modals/GalleryModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { SignDictionaryModal } from './components/Modals/SignDictionaryModal';

import { PermissionPrompt } from './components/Feedback/PermissionPrompt';
import { LoadingOverlay } from './components/Feedback/LoadingOverlay';

export function App() {
  // Window dimensions state
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  // App operating mode: 'draw' | 'sign'
  const [appMode, setAppMode] = useState<AppMode>('draw');

  // Modal open states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSignDictionaryOpen, setIsSignDictionaryOpen] = useState(false);

  // Drawing and visual configurations
  const [settings, setSettings] = useState<DrawingSettings>({
    brushMode: 'neon',
    brushColor: '#38bdf8',
    brushSize: 12,
    brushOpacity: 1.0,
    smoothingFactor: 0.5,
    glowIntensity: 1.5,
    showSkeleton: true,
    showFingertipCursor: true,
    showParticles: true,
    showHUD: true,
    enableGestureShortcuts: true,
    soundEnabled: true,
    rainbowSpeed: 1.0,
    canvasBackgroundColor: 'transparent',
  });

  // Speech synthesis configuration (Used exclusively in Sign Language mode)
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    enabled: true,
    rate: 1.0,
    pitch: 1.0,
    voiceURI: null,
    autoPronounce: true,
    pronounceLetters: true,
    pronounceWords: true,
  });

  const updateSettings = useCallback((updates: Partial<DrawingSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSpeechSettings = useCallback((updates: Partial<SpeechSettings>) => {
    setSpeechSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Camera Hook
  const {
    videoRef,
    cameraState,
    startCamera,
    toggleMirror,
    selectDevice,
  } = useCamera();

  // 2. High-speed Hand Tracking Vision Hook (Zero-overhead ref pipeline)
  const {
    isModelLoading,
    modelError,
    fps,
    gestureResult,
    handDetected,
    liveTrackingRef,
  } = useHandTracking({
    videoElement: videoRef.current,
    canvasWidth: dimensions.width,
    canvasHeight: dimensions.height,
    isStreaming: cameraState.isStreaming,
    isMirrored: cameraState.isMirrored,
    smoothingFactor: settings.smoothingFactor,
  });

  // 3. Hardware-Accelerated Canvas Engine Hook (Active exclusively in Draw mode)
  const {
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
  } = useDrawingCanvas({
    canvasWidth: dimensions.width,
    canvasHeight: dimensions.height,
    liveTrackingRef,
    settings,
    isDrawingEnabled: appMode === 'draw',
  });

  // 4. Sign Language Detection, Live Writing, and Pronunciation Hook (Active exclusively in Sign mode)
  const {
    activeSign,
    transcriptItems,
    fullTranscriptText,
    isSpeaking,
    addSpace,
    backspace,
    clearTranscript,
    speakCurrentText,
    speakCustomText,
    copyTranscript,
  } = useSignLanguage({
    liveTrackingRef,
    appMode,
    speechSettings,
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        clearCanvas();
      } else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        saveToGallery();
      } else if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
        setIsExportOpen(true);
      } else if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
        toggleMirror();
      } else if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
        updateSettings({ showSkeleton: !settings.showSkeleton });
      } else if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
        updateSettings({ showHUD: !settings.showHUD });
      } else if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey && appMode === 'sign') {
        speakCurrentText();
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
        const modes: BrushMode[] = ['neon', 'rainbow', 'normal', 'sparkle', 'pencil', 'marker', 'eraser'];
        const idx = parseInt(e.key, 10) - 1;
        if (modes[idx]) {
          updateSettings({ brushMode: modes[idx] });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, clearCanvas, saveToGallery, toggleMirror, settings.showSkeleton, settings.showHUD, speakCurrentText, updateSettings, appMode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 1. Camera Feed Layer */}
      <CameraView
        videoRef={videoRef}
        isMirrored={cameraState.isMirrored}
        isStreaming={cameraState.isStreaming}
        backgroundColor={settings.canvasBackgroundColor}
      />

      {/* 2. Hardware Accelerated Drawing + Skeleton + Cursor Unified Canvas */}
      <DrawingCanvas
        canvasRef={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* 3. Live AI Vision Status HUD */}
      <StatusPanel
        fps={fps}
        handDetected={handDetected}
        isStreaming={cameraState.isStreaming}
        gesture={gestureResult.gesture}
        isDrawing={gestureResult.isDrawing}
        point={liveTrackingRef.current?.smoothedPoint || null}
        strokeCount={strokeCount}
        showHUD={settings.showHUD}
      />

      {/* 4. Visual Gesture Reference Guide (Active in Draw Mode) */}
      {appMode === 'draw' && (
        <GestureGuide
          currentGesture={gestureResult.gesture}
          isDrawing={gestureResult.isDrawing}
          showHUD={settings.showHUD}
        />
      )}

      {/* 5. Live Sign Language HUD & Subtitles (Active exclusively in Sign Mode) */}
      {appMode === 'sign' && settings.showHUD && (
        <>
          <SignHUD
            activeSign={activeSign}
            speechSettings={speechSettings}
            onPronounce={speakCustomText}
          />
          <TranscriptBar
            transcriptItems={transcriptItems}
            fullText={fullTranscriptText}
            isSpeaking={isSpeaking}
            onSpeakAll={speakCurrentText}
            onAddSpace={addSpace}
            onBackspace={backspace}
            onClear={clearTranscript}
            onCopy={copyTranscript}
            onOpenDictionary={() => setIsSignDictionaryOpen(true)}
          />
        </>
      )}

      {/* 6. Bottom Floating Control Dock */}
      <FloatingToolbar
        appMode={appMode}
        onChangeAppMode={setAppMode}
        settings={settings}
        onUpdateSettings={updateSettings}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        onSaveGallery={() => saveToGallery()}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMirrored={cameraState.isMirrored}
        onToggleMirror={toggleMirror}
        savedCount={savedDrawings.length}
      />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        drawingCanvas={canvasRef.current}
        videoElement={videoRef.current}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        savedDrawings={savedDrawings}
        onDeleteDrawing={deleteSavedDrawing}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        cameraState={cameraState}
        onSelectCamera={selectDevice}
        speechSettings={speechSettings}
        onUpdateSpeechSettings={updateSpeechSettings}
      />

      <SignDictionaryModal
        isOpen={isSignDictionaryOpen}
        onClose={() => setIsSignDictionaryOpen(false)}
        onPronounce={speakCustomText}
      />

      {/* Feedback States */}
      {(!cameraState.isStreaming || cameraState.error) && !cameraState.isLoading && (
        <PermissionPrompt
          error={cameraState.error}
          onRetry={() => startCamera(cameraState.selectedDeviceId || undefined)}
        />
      )}

      <LoadingOverlay
        isLoading={isModelLoading || cameraState.isLoading}
        error={modelError}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}

export default App;
