import React from 'react';
import type { ScreenPoint, HandGestureType } from '../types/vision';

interface FingertipCursorProps {
  point: ScreenPoint | null;
  gesture: HandGestureType;
  isDrawing: boolean;
  brushColor: string;
  brushSize: number;
  showCursor: boolean;
}

export const FingertipCursor: React.FC<FingertipCursorProps> = ({
  point,
  gesture,
  isDrawing,
  brushColor,
  brushSize,
  showCursor,
}) => {
  if (!showCursor || !point) return null;

  return (
    <div
      className="absolute pointer-events-none z-20 transition-transform duration-75 ease-out"
      style={{
        left: `${point.x}px`,
        top: `${point.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer Glow / Ripple Ring when Drawing */}
      {isDrawing && (
        <div
          className="absolute -inset-4 rounded-full animate-cursor-ripple opacity-60 pointer-events-none"
          style={{
            borderColor: brushColor,
            borderWidth: '2px',
          }}
        />
      )}

      {/* Dynamic Cursor Outer Reticle */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-150 ${
          isDrawing
            ? 'scale-110 shadow-lg'
            : gesture === 'HOVER'
            ? 'scale-90 border-dashed'
            : 'scale-75 opacity-70'
        }`}
        style={{
          width: `${Math.max(24, brushSize * 1.5)}px`,
          height: `${Math.max(24, brushSize * 1.5)}px`,
          border: isDrawing ? `2px solid ${brushColor}` : '1.5px solid rgba(56, 189, 248, 0.7)',
          boxShadow: isDrawing ? `0 0 16px ${brushColor}` : '0 0 8px rgba(56, 189, 248, 0.4)',
        }}
      >
        {/* Center Point */}
        <div
          className="rounded-full transition-all duration-100"
          style={{
            width: `${Math.max(6, brushSize * 0.6)}px`,
            height: `${Math.max(6, brushSize * 0.6)}px`,
            backgroundColor: isDrawing ? brushColor : '#38bdf8',
            boxShadow: `0 0 10px ${isDrawing ? brushColor : '#38bdf8'}`,
          }}
        />

        {/* Crosshair micro marks */}
        <div className="absolute top-0 w-1 h-0.5 bg-cyan-400/80 -translate-y-1" />
        <div className="absolute bottom-0 w-1 h-0.5 bg-cyan-400/80 translate-y-1" />
        <div className="absolute left-0 h-1 w-0.5 bg-cyan-400/80 -translate-x-1" />
        <div className="absolute right-0 h-1 w-0.5 bg-cyan-400/80 translate-x-1" />
      </div>

      {/* Floating State Badge */}
      <div 
        className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-mono font-medium backdrop-blur-md border shadow-md flex items-center gap-1.5"
        style={{
          backgroundColor: isDrawing ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.7)',
          borderColor: isDrawing ? brushColor : 'rgba(56, 189, 248, 0.4)',
          color: isDrawing ? brushColor : '#94a3b8',
        }}
      >
        <span 
          className={`w-1.5 h-1.5 rounded-full ${
            isDrawing ? 'animate-ping' : ''
          }`} 
          style={{ backgroundColor: isDrawing ? brushColor : '#38bdf8' }} 
        />
        <span>
          {isDrawing ? 'DRAWING' : gesture === 'HOVER' ? 'HOVER' : gesture === 'PINCH' ? 'PINCH' : 'READY'}
        </span>
      </div>
    </div>
  );
};
