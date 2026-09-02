import React from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  error,
  onRetry,
}) => {
  if (!isLoading && !error) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm">
        {isLoading ? (
          <>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-7 h-7 animate-spin" />
              <div className="absolute inset-0 rounded-2xl animate-ping bg-cyan-500/10 pointer-events-none" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-white tracking-wide">Initializing Vision Model</h3>
              <p className="text-xs text-slate-400">Loading MediaPipe Tasks WebAssembly & Hand Landmark weights...</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 bg-slate-900/80 px-3 py-1 rounded-full border border-white/5">
              <Cpu className="w-3 h-3 animate-pulse" />
              <span>WASM + WebGL Acceleration</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-white">Model Initialization Error</h3>
              <p className="text-xs text-rose-300/90">{error}</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-1 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Retry Model Initialization
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
