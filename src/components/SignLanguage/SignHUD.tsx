import React from 'react';
import type { SignDetection, SpeechSettings } from '../../types/signLanguage';
import { Volume2, Sparkles, Hand } from 'lucide-react';

interface SignHUDProps {
  activeSign: SignDetection | null;
  speechSettings: SpeechSettings;
  onPronounce: (text: string) => void;
}

export const SignHUD: React.FC<SignHUDProps> = ({
  activeSign,
  speechSettings,
  onPronounce,
}) => {
  if (!activeSign) {
    return (
      <div className="absolute top-20 right-4 z-25 pointer-events-none">
        <div className="glass-panel p-3 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-2.5 text-xs text-slate-400">
          <Hand className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Show a hand sign to translate & speak</span>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(activeSign.holdProgress * 100);

  return (
    <div className="absolute top-20 right-4 z-25 max-w-sm pointer-events-none animate-in fade-in zoom-in-95 duration-150">
      <div className="glass-panel p-4 rounded-3xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 pointer-events-auto">
        {/* Main Sign Header */}
        <div className="flex items-center gap-3.5">
          {/* Sign Emoji Avatar with Hold Progress Ring */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-400/50 shadow-lg shadow-cyan-500/25 shrink-0">
            <span className="text-3xl select-none">{activeSign.emoji}</span>

            {/* Circular Hold Progress Ring */}
            <svg className="absolute -inset-1 w-16 h-16 pointer-events-none -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-800"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-cyan-400 transition-all duration-75"
                strokeWidth="2.5"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * activeSign.holdProgress)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>

          {/* Name & Spoken Label */}
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {activeSign.category === 'alphabet' ? 'ASL Letter' : 'Sign Phrase'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({Math.round(activeSign.confidence * 100)}% match)</span>
            </div>

            <h3 className="text-lg font-extrabold text-white truncate flex items-center gap-2">
              <span>{activeSign.name}</span>
              <span className="text-cyan-300 font-mono text-base font-bold bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                "{activeSign.symbol}"
              </span>
            </h3>

            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <span>Speaks:</span>
              <strong className="text-cyan-200">"{activeSign.spokenText}"</strong>
            </span>
          </div>
        </div>

        {/* Hold to Type Countdown Bar */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{activeSign.isStable ? '✨ Sign Written!' : 'Hold steady to write...'}</span>
            </span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                activeSign.isStable
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                  : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Pronounce Button & Voice Status */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className={`w-2 h-2 rounded-full ${speechSettings.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{speechSettings.enabled ? 'Voice Speech Ready' : 'Speech Muted'}</span>
          </div>

          <button
            onClick={() => onPronounce(activeSign.spokenText)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold cursor-pointer transition-all active:scale-95"
            title="Pronounce this sign aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Pronounce</span>
          </button>
        </div>
      </div>
    </div>
  );
};
