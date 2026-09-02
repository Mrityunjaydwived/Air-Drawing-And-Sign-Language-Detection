import React from 'react';
import type { VirtualMouseState } from '../../types/mouse';
import { MousePointer, ArrowDownUp } from 'lucide-react';

interface VirtualCursorProps {
  mouseState: VirtualMouseState;
}

export const VirtualCursor: React.FC<VirtualCursorProps> = ({
  mouseState,
}) => {
  const { point, action, isLeftClicking, isRightClicking, isDragging, isScrolling, clickProgress } = mouseState;

  if (!point) return null;

  return (
    <div
      id="virtual-cursor-layer"
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${point.x}px`,
        top: `${point.y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Click Wave Ripple */}
      {(isLeftClicking || isRightClicking) && (
        <div
          className={`absolute -inset-6 rounded-full animate-cursor-ripple ${
            isRightClicking ? 'border-indigo-400 bg-indigo-500/20' : 'border-cyan-400 bg-cyan-500/20'
          }`}
          style={{ borderWidth: '3px' }}
        />
      )}

      {/* Main Holographic Arrow Pointer */}
      <div className="relative flex items-center justify-center">
        {isScrolling ? (
          <div className="w-9 h-9 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/40 animate-pulse">
            <ArrowDownUp className="w-5 h-5" />
          </div>
        ) : (
          <div
            className={`transition-transform duration-100 ${
              isLeftClicking || isDragging
                ? 'scale-90 rotate-[-15deg]'
                : isRightClicking
                ? 'scale-95 rotate-[15deg]'
                : 'scale-100'
            }`}
          >
            {/* Holographic Cursor Arrow */}
            <MousePointer
              className={`w-7 h-7 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] ${
                isDragging
                  ? 'text-amber-400 fill-amber-400'
                  : isRightClicking
                  ? 'text-indigo-400 fill-indigo-400'
                  : isLeftClicking
                  ? 'text-emerald-400 fill-emerald-400'
                  : 'text-cyan-400 fill-cyan-400/80'
              }`}
            />
          </div>
        )}

        {/* Pinch Progress Reticle */}
        {clickProgress > 0.1 && !isLeftClicking && (
          <svg className="absolute -inset-2 w-11 h-11 pointer-events-none -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="16"
              className="stroke-cyan-500/30"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r="16"
              className="stroke-cyan-400"
              strokeWidth="2.5"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (100.5 * clickProgress)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        )}
      </div>

      {/* Action State Floating Badge */}
      <div 
        className="absolute top-7 left-3 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-mono font-bold backdrop-blur-md border shadow-lg flex items-center gap-1.5"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          borderColor: isDragging ? '#fbbf24' : isRightClicking ? '#818cf8' : isLeftClicking ? '#34d399' : 'rgba(56, 189, 248, 0.4)',
          color: isDragging ? '#fbbf24' : isRightClicking ? '#818cf8' : isLeftClicking ? '#34d399' : '#38bdf8',
        }}
      >
        <span 
          className={`w-1.5 h-1.5 rounded-full ${isLeftClicking || isDragging ? 'animate-ping' : ''}`} 
          style={{
            backgroundColor: isDragging ? '#fbbf24' : isRightClicking ? '#818cf8' : isLeftClicking ? '#34d399' : '#38bdf8',
          }} 
        />
        <span>
          {isDragging
            ? 'DRAGGING'
            : isRightClicking
            ? 'RIGHT CLICK'
            : isLeftClicking
            ? 'CLICK!'
            : action === 'SCROLL_UP'
            ? 'SCROLL UP'
            : action === 'SCROLL_DOWN'
            ? 'SCROLL DOWN'
            : 'AIR MOUSE'}
        </span>
      </div>
    </div>
  );
};
