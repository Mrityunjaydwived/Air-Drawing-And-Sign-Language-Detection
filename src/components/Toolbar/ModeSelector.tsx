import React from 'react';
import type { AppMode } from '../../types/signLanguage';
import { PenTool, Hand } from 'lucide-react';

interface ModeSelectorProps {
  mode: AppMode;
  onChangeMode: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onChangeMode,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'draw', label: 'Air Draw', icon: PenTool, desc: 'Draw in the air with index finger' },
    { id: 'sign', label: 'Sign Language', icon: Hand, desc: 'Detect hand signs, write & pronounce aloud' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg">
      {modes.map((item) => {
        const Icon = item.icon;
        const isSelected = mode === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChangeMode(item.id)}
            title={`${item.label} - ${item.desc}`}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 scale-[1.03]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
