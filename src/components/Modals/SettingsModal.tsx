import React, { useEffect, useState } from 'react';
import type { DrawingSettings } from '../../types/drawing';
import type { CameraState } from '../../types/vision';
import type { SpeechSettings } from '../../types/signLanguage';
import { speechManager } from '../../utils/speechUtils';
import { 
  X, 
  Settings as SettingsIcon, 
  Video, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sliders, 
  Hand,
  Bone,
  Mic
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DrawingSettings;
  onUpdateSettings: (updates: Partial<DrawingSettings>) => void;
  cameraState: CameraState;
  onSelectCamera: (deviceId: string) => void;
  speechSettings: SpeechSettings;
  onUpdateSpeechSettings: (updates: Partial<SpeechSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  cameraState,
  onSelectCamera,
  speechSettings,
  onUpdateSpeechSettings,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isOpen) {
      setVoices(speechManager.getVoices());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">App & Tracking Settings</h2>
              <p className="text-xs text-slate-400">Customize tracking sensitivity, speech synthesis & overlays</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="flex flex-col gap-4 text-xs">
          {/* Camera Selection */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Camera Input Device</span>
            </div>
            <select
              value={cameraState.selectedDeviceId || ''}
              onChange={(e) => onSelectCamera(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {cameraState.devices.map((device, index) => (
                <option key={device.deviceId || index} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sign Language & Text-to-Speech Settings */}
          <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>Voice Pronunciation & Speech (TTS)</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${speechSettings.enabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {speechSettings.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Enable Speech */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Enable Voice Pronunciation</span>
                <input
                  type="checkbox"
                  checked={speechSettings.enabled}
                  onChange={(e) => onUpdateSpeechSettings({ enabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </label>

              {/* Auto Pronounce on Sign Detection */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Auto-Pronounce on Sign Detection</span>
                <input
                  type="checkbox"
                  checked={speechSettings.autoPronounce}
                  onChange={(e) => onUpdateSpeechSettings({ autoPronounce: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </label>

              {/* Voice Selector */}
              {voices.length > 0 && (
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-[11px] text-slate-400">TTS Voice</span>
                  <select
                    value={speechSettings.voiceURI || ''}
                    onChange={(e) => {
                      onUpdateSpeechSettings({ voiceURI: e.target.value });
                      speechManager.setVoice(e.target.value);
                    }}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speech Rate Slider */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Speech Rate</span>
                  <span className="font-mono text-cyan-400">{speechSettings.rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.1"
                  value={speechSettings.rate}
                  onChange={(e) => onUpdateSpeechSettings({ rate: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Coordinate Smoothing Factor Slider */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>1€ Jitter Filter Sensitivity</span>
              </div>
              <span className="font-mono text-cyan-400">{Math.round(settings.smoothingFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={settings.smoothingFactor}
              onChange={(e) => onUpdateSettings({ smoothingFactor: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>High Stability (Anti-jitter)</span>
              <span>Ultra Responsive</span>
            </div>
          </div>

          {/* Visual Overlays Toggles */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="font-semibold text-slate-200">Visual Overlays & FX</span>

            <div className="flex flex-col gap-2.5 pt-1">
              {/* Hand Skeleton */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-slate-300">
                  <Bone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Show Hand Skeleton Overlay</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSkeleton}
                  onChange={(e) => onUpdateSettings({ showSkeleton: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </label>

              {/* Fingertip Cursor */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-slate-300">
                  <Hand className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Show Glowing Fingertip Reticle</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showFingertipCursor}
                  onChange={(e) => onUpdateSettings({ showFingertipCursor: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </label>

              {/* Particle Trail */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Enable Fingertip Stardust Particles</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showParticles}
                  onChange={(e) => onUpdateSettings({ showParticles: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Audio Sound FX */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="font-semibold text-slate-200">Audio Feedback</span>
            <label className="flex items-center justify-between cursor-pointer pt-1">
              <div className="flex items-center gap-2 text-slate-300">
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>Synthesizer Sound Effects</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
