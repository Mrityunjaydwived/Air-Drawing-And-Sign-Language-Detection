import { useState } from 'react';
import { ExportUtils } from '../../utils/exportUtils';
import { soundManager } from '../../utils/audioUtils';
import { 
  Sparkles, 
  MousePointer, 
  Volume2, 
  CheckCircle2, 
  RotateCcw,
  Laptop,
  Check
} from 'lucide-react';

interface MousePlaygroundProps {
  isSystemConnected?: boolean;
}

export const MousePlayground: React.FC<MousePlaygroundProps> = ({
  isSystemConnected = false,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [toggleState, setToggleState] = useState(true);
  const [accentHue, setAccentHue] = useState(195); // Cyan
  const [activeTab, setActiveTab] = useState<'widgets' | 'gestures'>('widgets');
  const [soundPadActive, setSoundPadActive] = useState<number | null>(null);

  const handleClickTarget = () => {
    setClickCount(prev => prev + 1);
    soundManager.playActionTrigger();
    if ((clickCount + 1) % 5 === 0) {
      ExportUtils.triggerCelebration();
    }
  };

  const handleDoubleClickTarget = () => {
    setDoubleClickCount(prev => prev + 1);
    soundManager.playActionTrigger();
    ExportUtils.triggerCelebration();
  };

  const handleSoundPad = (idx: number) => {
    setSoundPadActive(idx);
    soundManager.playDrawStart();
    setTimeout(() => setSoundPadActive(null), 200);
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-25 w-[92vw] max-w-3xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-slate-100 pointer-events-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <MousePointer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Full-Screen Laptop Air Mouse</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSystemConnected
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    : 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300'
                }`}>
                  <Laptop className="w-3 h-3" />
                  <span>{isSystemConnected ? 'System OS Mouse Active' : 'In-Browser Mouse'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Control whole laptop screen: Left click, Double click, Right click, Drag, Scroll & Tab Switch</p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('widgets')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeTab === 'widgets' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Widgets
            </button>
            <button
              onClick={() => setActiveTab('gestures')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                activeTab === 'gestures' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gesture Map
            </button>
          </div>
        </div>

        {activeTab === 'widgets' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
            {/* Widget 1: Single Click Target */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-between text-center gap-2 shadow-lg">
              <span className="font-semibold text-slate-200">Left Click (Single)</span>
              <button
                onClick={handleClickTarget}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold shadow-md cursor-pointer active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clicked: {clickCount}</span>
              </button>
              <button onClick={() => setClickCount(0)} className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Widget 2: Double Click Target */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-between text-center gap-2 shadow-lg">
              <span className="font-semibold text-slate-200">Double Click Target</span>
              <button
                onDoubleClick={handleDoubleClickTarget}
                onClick={handleDoubleClickTarget}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold shadow-md cursor-pointer active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Dbl Click: {doubleClickCount}</span>
              </button>
              <span className="text-[10px] text-slate-400 italic">2 fast pinches</span>
            </div>

            {/* Widget 3: Toggle Switch */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-between text-center gap-2 shadow-lg">
              <span className="font-semibold text-slate-200">Toggle Switch</span>
              <button
                onClick={() => {
                  setToggleState(!toggleState);
                  soundManager.playDrawStart();
                }}
                className={`w-full py-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                  toggleState
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-white/10 text-slate-400'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${toggleState ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{toggleState ? 'ACTIVE' : 'IDLE'}</span>
              </button>
              <span className="text-[10px] text-slate-500 font-mono">{toggleState ? '🟢 Online' : '⚪ Standby'}</span>
            </div>

            {/* Widget 4: Hue Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-between text-center gap-2 shadow-lg">
              <span className="font-semibold text-slate-200">Hue Slider</span>
              <input
                type="range"
                min="0"
                max="360"
                value={accentHue}
                onChange={(e) => setAccentHue(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`,
                }}
              />
              <div
                className="w-full py-1 rounded-lg font-bold text-[10px] text-center"
                style={{
                  backgroundColor: `hsl(${accentHue}, 100%, 50%)`,
                  color: '#020617',
                }}
              >
                Hue: {accentHue}°
              </div>
            </div>

            {/* Sound Pads */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col gap-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Sound Pads (Click with Hand Mouse)</span>
              </span>

              <div className="grid grid-cols-4 gap-2 pt-0.5">
                {['Pad 1 (D5)', 'Pad 2 (E5)', 'Pad 3 (A5)', 'Pad 4 (Chord)'].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => handleSoundPad(i)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                      soundPadActive === i
                        ? 'bg-cyan-400 text-slate-950 border-white shadow-lg shadow-cyan-400/50 scale-[1.03]'
                        : 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Mouse Gestures Reference Tab */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs pt-1">
            {[
              {
                emoji: '🖐️',
                title: 'Move Cursor',
                gesture: 'Hand open / Index extended',
                desc: 'Glide your hand naturally across the camera to move the OS mouse pointer across the whole screen.',
              },
              {
                emoji: '🤏',
                title: 'Left Click',
                gesture: 'Pinch Index + Thumb',
                desc: 'Quickly touch index fingertip and thumb tip together to trigger a left click on any app.',
              },
              {
                emoji: '⚡',
                title: 'Double Click',
                gesture: 'Double Pinch Index + Thumb',
                desc: 'Pinch twice rapidly (<380ms) to double click and open files, desktop icons, or apps.',
              },
              {
                emoji: '🤏',
                title: 'Right Click',
                gesture: 'Pinch Middle + Thumb',
                desc: 'Touch middle fingertip and thumb tip together to open context menus anywhere.',
              },
              {
                emoji: '✊',
                title: 'Drag & Drop',
                gesture: 'Hold Pinch for >220ms',
                desc: 'Sustain your pinch to hold the mouse down and drag windows, sliders, or files.',
              },
              {
                emoji: '✌️',
                title: 'Scroll & Switch Tabs',
                gesture: 'Two Fingers Up/Down or Swipe',
                desc: 'Move 2 fingers up/down to scroll. Swipe 2 fingers left/right to switch browser tabs (Ctrl+Tab).',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-2.5"
              >
                <span className="text-2xl select-none">{item.emoji}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-xs">{item.title}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{item.gesture}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
