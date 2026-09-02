import React, { useRef, useEffect } from 'react';
import type { ScreenPoint } from '../types/vision';
import { HAND_CONNECTIONS, LANDMARK_INDEX } from '../types/vision';

interface HandSkeletonProps {
  landmarks: ScreenPoint[];
  width: number;
  height: number;
  showSkeleton: boolean;
  isDrawing: boolean;
  brushColor: string;
}

export const HandSkeleton: React.FC<HandSkeletonProps> = ({
  landmarks,
  width,
  height,
  showSkeleton,
  isDrawing,
  brushColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (!showSkeleton || landmarks.length < 21) {
      return;
    }

    ctx.save();

    // 1. Draw connecting bones
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)'; // Cyan neon bone
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // 2. Draw Joints
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      if (!p) continue;

      ctx.beginPath();
      if (i === LANDMARK_INDEX.INDEX_TIP) {
        // Highlight active drawing fingertip
        ctx.arc(p.x, p.y, isDrawing ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = brushColor;
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else if (i === LANDMARK_INDEX.WRIST) {
        // Wrist base
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        // Standard Joint
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }

    ctx.restore();
  }, [landmarks, width, height, showSkeleton, isDrawing, brushColor]);

  if (!showSkeleton) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
    />
  );
};
