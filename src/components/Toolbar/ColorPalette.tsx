import React from 'react';
import { Pipette } from 'lucide-react';

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  disabled?: boolean;
}

export const PRESET_COLORS = [
  { name: 'Cyan Glow', hex: '#38bdf8' },
  { name: 'Emerald Neon', hex: '#10b981' },
  { name: 'Hot Pink', hex: '#ec4899' },
  { name: 'Solar Yellow', hex: '#fbbf24' },
  { name: 'Ultra Violet', hex: '#a855f7' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Flame Orange', hex: '#f97316' },
  { name: 'Crimson Red', hex: '#ef4444' },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onSelectColor,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
      {PRESET_COLORS.map((color) => {
        const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
        return (
          <button
            key={color.hex}
            disabled={disabled}
            onClick={() => onSelectColor(color.hex)}
            title={color.name}
            className={`relative w-6 h-6 rounded-full transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-md'
                : 'hover:scale-110 opacity-80 hover:opacity-100'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: color.hex,
              boxShadow: isSelected ? `0 0 10px ${color.hex}` : undefined,
            }}
          />
        );
      })}

      {/* Custom Color Picker Input */}
      <label
        title="Custom Color Picker"
        className="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-white/20 hover:border-cyan-400 cursor-pointer hover:scale-110 transition-all ml-0.5 text-slate-300 hover:text-cyan-300"
      >
        <Pipette className="w-3.5 h-3.5" />
        <input
          type="color"
          disabled={disabled}
          value={selectedColor}
          onChange={(e) => onSelectColor(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
    </div>
  );
};
