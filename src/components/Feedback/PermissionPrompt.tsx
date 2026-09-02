import React from 'react';
import { Camera, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

interface PermissionPromptProps {
  error: string | null;
  onRetry: () => void;
}

export const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col items-center text-center gap-4 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20">
          <Camera className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-white">Camera Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            AirDraw AI tracks your index fingertip in real-time using your webcam to allow drawing directly in the air.
          </p>
        </div>

        {error && (
          <div className="w-full p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <div className="w-full flex items-center gap-2 text-[11px] text-emerald-400/90 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20 text-left">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Your video stream is processed 100% locally in your browser and is never stored or uploaded.</span>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Allow Camera Access & Retry</span>
        </button>
      </div>
    </div>
  );
};
