import React from 'react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMirrored: boolean;
  isStreaming: boolean;
  backgroundColor: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isMirrored,
  isStreaming,
  backgroundColor,
}) => {
  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: backgroundColor === 'transparent' ? '#020617' : backgroundColor }}
    >
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial from-slate-900/50 via-slate-950/90 to-slate-950 pointer-events-none z-0" />

      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`w-full h-full object-cover transition-transform duration-300 ${
          isMirrored ? '-scale-x-100' : 'scale-x-100'
        } ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
        style={{
          // Hardware acceleration for video
          transform: isMirrored ? 'scaleX(-1) translateZ(0)' : 'scaleX(1) translateZ(0)',
        }}
      />

      {/* Subtle futuristic HUD scanline and vignette */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-radial-[circle_at_center,transparent_40%,rgba(2,6,23,0.7)_100%]" />
      <div className="scanline-effect z-1" />
    </div>
  );
};
