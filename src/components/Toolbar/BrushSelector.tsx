import React from 'react';
import type { BrushMode } from '../../types/drawing';
import { 
  Sparkles, 
  Rainbow, 
  PenTool, 
  Pencil, 
  Highlighter, 
  Zap, 
  Eraser 
} from 'lucide-react';

interface BrushSelectorProps {
  selectedMode: BrushMode;
  onSelectMode: (mode: BrushMode) => void;
}

interface BrushOption {
  mode: BrushMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BRUSH_OPTIONS: BrushOption[] = [
  { mode: 'neon', label: 'Neon Glow', icon: Sparkles, description: 'Luminous glowing bloom stroke' },
  { mode: 'rainbow', label: 'Rainbow', icon: Rainbow, description: 'Dynamic cycling color spectrum' },
  { mode: 'normal', label: 'Solid Line', icon: PenTool, description: 'Clean smooth anti-aliased stroke' },
  { mode: 'sparkle', label: 'Laser Star', icon: Zap, description: 'Sparkling laser beam trail' },
  { mode: 'pencil', label: 'Pencil', icon: Pencil, description: 'Textured fine sketch line' },
  { mode: 'marker', label: 'Highlighter', icon: Highlighter, description: 'Translucent broad marker' },
  { mode: 'eraser', label: 'Eraser', icon: Eraser, description: 'Erase strokes with finger' },
];

export const BrushSelector: React.FC<BrushSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
      {BRUSH_OPTIONS.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedMode === item.mode;

        return (
          <button
            key={item.mode}
            onClick={() => onSelectMode(item.mode)}
            title={`${item.label} - ${item.description}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 scale-[1.03]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
            <span className="hidden md:inline font-semibold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
