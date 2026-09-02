import React from 'react';
import type { HandGestureType, ScreenPoint } from '../../types/vision';
import { Activity, ShieldCheck, Sparkles, Hand } from 'lucide-react';

interface StatusPanelProps {
  fps: number;
  handDetected: boolean;
  isStreaming: boolean;
  gesture: HandGestureType;
  isDrawing: boolean;
  point: ScreenPoint | null;
  strokeCount: number;
  showHUD: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  fps,
  handDetected,
  isStreaming,
  gesture,
  isDrawing,
  point,
  strokeCount,
  showHUD,
}) => {
  if (!showHUD) return null;

  const getGestureLabel = (g: HandGestureType) => {
    switch (g) {
      case 'DRAWING':
        return { label: '☝️ Index Drawing', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' };
      case 'HOVER':
        return { label: '✌️ Hover / Pointer', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30' };
      case 'OPEN_PALM':
        return { label: '✋ Open Palm (Pause)', color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' };
      case 'FIST':
        return { label: '✊ Closed Fist', color: 'text-slate-400 bg-slate-800/40 border-slate-700/30' };
      case 'PINCH':
        return { label: '🤏 Pinch Action', color: 'text-pink-400 bg-pink-950/40 border-pink-500/30' };
      case 'THUMBS_UP':
        return { label: '👍 Thumbs Up!', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' };
      default:
        return { label: 'Searching gesture...', color: 'text-slate-400 bg-slate-900/40 border-slate-800' };
    }
  };

  const gestureInfo = getGestureLabel(gesture);

  return (
    <div className="absolute top-4 left-4 z-25 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {/* Brand & Main Status Panel */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col gap-3 pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">AirDraw AI</h1>
              <p className="text-[10px] text-cyan-400/80 font-mono">Vision Air Canvas v1.0</p>
            </div>
          </div>

          {/* FPS Counter Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 font-mono text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-semibold text-slate-100">{fps}</span>
            <span className="text-[10px] text-slate-400">FPS</span>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs">
          {/* Camera & Hand Status */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="relative">
              <span
                className={`flex w-2.5 h-2.5 rounded-full ${
                  !isStreaming
                    ? 'bg-rose-500 shadow-rose-500/50 shadow-md'
                    : handDetected
                    ? 'bg-emerald-400 shadow-emerald-400/50 shadow-md animate-pulse'
                    : 'bg-amber-400 shadow-amber-400/50 shadow-md'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Tracking</span>
              <span className="text-xs font-medium text-slate-200 truncate">
                {!isStreaming
                  ? 'Disabled'
                  : handDetected
                  ? 'Hand Active'
                  : 'Searching...'}
              </span>
            </div>
          </div>

          {/* Gesture Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5">
            <Hand className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Gesture</span>
              <span className="text-xs font-medium text-slate-200 truncate">
                {isDrawing ? '☝️ Drawing' : gestureInfo.label.split(' ')[1] || 'Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Coordinates & Strokes Info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">POS:</span>
            <span className="text-cyan-400">
              {point ? `X:${Math.round(point.x)} Y:${Math.round(point.y)}` : '-- : --'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">STROKES: </span>
            <span className="text-slate-200 font-semibold">{strokeCount}</span>
          </div>
        </div>

        {/* 100% On-device Privacy note */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">100% Local Browser AI • Zero Data Upload</span>
        </div>
      </div>
    </div>
  );
};
