import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  BookmarkCheck, 
  Download, 
  Bone, 
  FlipHorizontal2, 
  Settings, 
  Maximize, 
  Minimize,
  Images
} from 'lucide-react';

interface ActionControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSaveGallery: () => void;
  onOpenExport: () => void;
  onOpenGallery: () => void;
  onOpenSettings: () => void;
  showSkeleton: boolean;
  onToggleSkeleton: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  savedCount: number;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSaveGallery,
  onOpenExport,
  onOpenGallery,
  onOpenSettings,
  showSkeleton,
  onToggleSkeleton,
  isMirrored,
  onToggleMirror,
  savedCount,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
      {/* Undo */}
      <button
        disabled={!canUndo}
        onClick={onUndo}
        title="Undo Stroke (Ctrl+Z)"
        className="glass-button p-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      {/* Redo */}
      <button
        disabled={!canRedo}
        onClick={onRedo}
        title="Redo Stroke (Ctrl+Y)"
        className="glass-button p-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      {/* Clear Canvas */}
      <button
        onClick={onClear}
        title="Clear Drawing Canvas"
        className="glass-button p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-0.5" />

      {/* Save to In-App Gallery */}
      <button
        onClick={onSaveGallery}
        title="Save Drawing to Gallery"
        className="glass-button p-2 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 cursor-pointer"
      >
        <BookmarkCheck className="w-4 h-4" />
      </button>

      {/* Open Saved Gallery */}
      <button
        onClick={onOpenGallery}
        title="Open Saved Drawings Gallery"
        className="glass-button relative p-2 rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 cursor-pointer"
      >
        <Images className="w-4 h-4" />
        {savedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>

      {/* Download / Export Modal */}
      <button
        onClick={onOpenExport}
        title="Download Image (PNG/Camera composite)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      <div className="w-px h-5 bg-white/10 mx-0.5" />

      {/* Toggle Hand Skeleton */}
      <button
        onClick={onToggleSkeleton}
        title={showSkeleton ? 'Hide Hand Skeleton Overlay' : 'Show Hand Skeleton Overlay'}
        className={`glass-button p-2 rounded-xl cursor-pointer transition-all ${
          showSkeleton
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bone className="w-4 h-4" />
      </button>

      {/* Toggle Camera Mirror */}
      <button
        onClick={onToggleMirror}
        title={isMirrored ? 'Camera Mirrored (Selfie)' : 'Camera Normal'}
        className={`glass-button p-2 rounded-xl cursor-pointer transition-all ${
          isMirrored
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FlipHorizontal2 className="w-4 h-4" />
      </button>

      {/* Settings Modal */}
      <button
        onClick={onOpenSettings}
        title="Open App Settings"
        className="glass-button p-2 rounded-xl text-slate-300 hover:text-white cursor-pointer"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
        className="glass-button p-2 rounded-xl text-slate-300 hover:text-white cursor-pointer"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
};
