import React from 'react';
import type { DrawingSettings } from '../../types/drawing';
import type { AppMode } from '../../types/signLanguage';
import { ColorPalette } from './ColorPalette';
import { BrushSelector } from './BrushSelector';
import { BrushSizeSlider } from './BrushSizeSlider';
import { ActionControls } from './ActionControls';
import { ModeSelector } from './ModeSelector';

interface FloatingToolbarProps {
  appMode: AppMode;
  onChangeAppMode: (mode: AppMode) => void;
  settings: DrawingSettings;
  onUpdateSettings: (updates: Partial<DrawingSettings>) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSaveGallery: () => void;
  onOpenExport: () => void;
  onOpenGallery: () => void;
  onOpenSettings: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  savedCount: number;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  appMode,
  onChangeAppMode,
  settings,
  onUpdateSettings,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSaveGallery,
  onOpenExport,
  onOpenGallery,
  onOpenSettings,
  isMirrored,
  onToggleMirror,
  savedCount,
}) => {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-25 max-w-[96vw] pointer-events-none flex flex-col items-center gap-2">
      {/* Mode Selector & Helper Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        <ModeSelector
          mode={appMode}
          onChangeMode={onChangeAppMode}
        />

        <div className="px-3.5 py-1.5 rounded-2xl glass-panel text-slate-300 text-xs font-mono flex items-center gap-2 border border-cyan-500/20 shadow-lg">
          {appMode === 'sign' ? (
            <>
              <span className="text-cyan-400 font-bold">🤟 SIGN LANGUAGE:</span>
              <span>Hold sign steady (~0.65s) to write & pronounce aloud</span>
            </>
          ) : (
            <>
              <span className="text-cyan-400 font-bold">✨ AIR DRAW:</span>
              <span>Raise index finger <strong className="text-white">☝️</strong> to draw freely in the air</span>
            </>
          )}
        </div>
      </div>

      {/* Main Glassmorphic Control Dock */}
      <div className="glass-panel p-2 rounded-3xl flex flex-wrap items-center justify-center gap-2.5 pointer-events-auto border border-white/15 shadow-2xl backdrop-blur-2xl transition-all duration-300">
        {/* Brush Mode Picker (in Draw mode) */}
        {appMode === 'draw' && (
          <BrushSelector
            selectedMode={settings.brushMode}
            onSelectMode={(mode) => onUpdateSettings({ brushMode: mode })}
          />
        )}

        {/* Color Swatches (in Draw mode) */}
        {appMode === 'draw' && settings.brushMode !== 'eraser' && (
          <ColorPalette
            selectedColor={settings.brushColor}
            onSelectColor={(color) => onUpdateSettings({ brushColor: color })}
          />
        )}

        {/* Brush Size Slider (in Draw mode) */}
        {appMode === 'draw' && (
          <BrushSizeSlider
            brushSize={settings.brushSize}
            brushColor={settings.brushMode === 'eraser' ? '#cbd5e1' : settings.brushColor}
            onChangeSize={(size) => onUpdateSettings({ brushSize: size })}
          />
        )}

        {/* Actions (Undo, Redo, Clear, Export, etc.) */}
        <ActionControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onClear={onClear}
          onSaveGallery={onSaveGallery}
          onOpenExport={onOpenExport}
          onOpenGallery={onOpenGallery}
          onOpenSettings={onOpenSettings}
          showSkeleton={settings.showSkeleton}
          onToggleSkeleton={() => onUpdateSettings({ showSkeleton: !settings.showSkeleton })}
          isMirrored={isMirrored}
          onToggleMirror={onToggleMirror}
          savedCount={savedCount}
        />
      </div>
    </div>
  );
};
