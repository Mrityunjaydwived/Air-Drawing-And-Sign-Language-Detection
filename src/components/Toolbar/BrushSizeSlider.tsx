import React from 'react';

interface BrushSizeSliderProps {
  brushSize: number;
  brushColor: string;
  onChangeSize: (size: number) => void;
}

export const BrushSizeSlider: React.FC<BrushSizeSliderProps> = ({
  brushSize,
  brushColor,
  onChangeSize,
}) => {
  const PRESET_SIZES = [
    { label: 'S', size: 4 },
    { label: 'M', size: 12 },
    { label: 'L', size: 24 },
    { label: 'XL', size: 40 },
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
      {/* Preset Buttons */}
      <div className="flex items-center gap-1">
        {PRESET_SIZES.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChangeSize(preset.size)}
            className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              brushSize === preset.size
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="flex items-center gap-2 min-w-[90px]">
        <input
          type="range"
          min="2"
          max="60"
          value={brushSize}
          onChange={(e) => onChangeSize(Number(e.target.value))}
          className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Live Preview Dot */}
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-950 border border-white/5 shrink-0">
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: `${Math.min(24, Math.max(3, brushSize * 0.75))}px`,
            height: `${Math.min(24, Math.max(3, brushSize * 0.75))}px`,
            backgroundColor: brushColor,
            boxShadow: `0 0 8px ${brushColor}`,
          }}
        />
      </div>
    </div>
  );
};
