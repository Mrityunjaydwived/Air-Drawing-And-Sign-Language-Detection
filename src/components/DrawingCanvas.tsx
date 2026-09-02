import React from 'react';

interface DrawingCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  canvasRef,
  width,
  height,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="absolute inset-0 w-full h-full z-10 cursor-crosshair touch-none"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
