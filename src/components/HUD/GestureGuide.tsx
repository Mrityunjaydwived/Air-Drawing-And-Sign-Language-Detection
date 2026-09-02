import React, { useState } from 'react';
import type { HandGestureType } from '../../types/vision';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface GestureGuideProps {
  currentGesture: HandGestureType;
  isDrawing: boolean;
  showHUD: boolean;
}

export const GestureGuide: React.FC<GestureGuideProps> = ({
  currentGesture,
  isDrawing,
  showHUD,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!showHUD) return null;

  const gestures = [
    {
      emoji: '☝️',
      title: 'Draw in Air',
      desc: 'Raise index finger only',
      active: isDrawing || currentGesture === 'DRAWING',
      accent: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
    },
    {
      emoji: '✌️',
      title: 'Hover / Move',
      desc: 'Index + middle fingers up',
      active: currentGesture === 'HOVER',
      accent: 'border-indigo-400 bg-indigo-500/10 text-indigo-300',
    },
    {
      emoji: '✋',
      title: 'Pause / Open',
      desc: 'Open all fingers wide',
      active: currentGesture === 'OPEN_PALM',
      accent: 'border-amber-400 bg-amber-500/10 text-amber-300',
    },
    {
      emoji: '🤏',
      title: 'Pinch Tool',
      desc: 'Touch thumb & index tip',
      active: currentGesture === 'PINCH',
      accent: 'border-pink-400 bg-pink-500/10 text-pink-300',
    },
    {
      emoji: '👍',
      title: 'Snapshot FX',
      desc: 'Thumbs up for confetti!',
      active: currentGesture === 'THUMBS_UP',
      accent: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
    },
  ];

  return (
    <div className="absolute top-4 right-4 z-25 max-w-xs flex flex-col items-end pointer-events-none">
      <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2.5 pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between gap-3 w-full text-xs font-semibold text-slate-200 hover:text-white cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Gesture Controls</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
            {gestures.map((g) => (
              <div
                key={g.title}
                className={`flex items-center justify-between p-1.5 px-2 rounded-xl border transition-all duration-200 ${
                  g.active
                    ? `${g.accent} shadow-md scale-[1.02]`
                    : 'border-white/5 bg-slate-900/40 text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{g.emoji}</span>
                  <div className="flex flex-col">
                    <span className={`text-xs font-medium ${g.active ? 'text-white' : 'text-slate-300'}`}>
                      {g.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{g.desc}</span>
                  </div>
                </div>
                {g.active && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
