import React, { useState } from 'react';
import type { TranscriptItem } from '../../types/signLanguage';
import { 
  Volume2, 
  Copy, 
  Check, 
  Trash2, 
  Space, 
  Delete, 
  BookOpen,
  Sparkles 
} from 'lucide-react';

interface TranscriptBarProps {
  transcriptItems: TranscriptItem[];
  fullText: string;
  isSpeaking: boolean;
  onSpeakAll: () => void;
  onAddSpace: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onCopy: () => Promise<boolean>;
  onOpenDictionary: () => void;
}

export const TranscriptBar: React.FC<TranscriptBarProps> = ({
  transcriptItems,
  fullText,
  isSpeaking,
  onSpeakAll,
  onAddSpace,
  onBackspace,
  onClear,
  onCopy,
  onOpenDictionary,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy();
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-25 w-[92vw] max-w-2xl pointer-events-none">
      <div className="glass-panel p-3 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-2xl flex flex-col gap-2.5 pointer-events-auto transition-all duration-200">
        {/* Top Transcript Title Bar */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Live Sign Subtitles & Transcription</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDictionary}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium cursor-pointer transition-all"
            >
              <BookOpen className="w-3 h-3" />
              <span>ASL Guide</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Transcribed Text Display */}
        <div className="relative min-h-[44px] max-h-[72px] overflow-y-auto p-2.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center flex-wrap gap-1 shadow-inner">
          {transcriptItems.length === 0 ? (
            <span className="text-xs text-slate-500 italic flex items-center gap-1.5 font-mono">
              <span>Hold a sign steady for ~0.8s to type here (or spell with ASL letters)...</span>
            </span>
          ) : (
            <div className="flex items-center flex-wrap gap-1 text-sm font-semibold text-white tracking-wide">
              {transcriptItems.map((item) => (
                <span
                  key={item.id}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-md ${
                    item.type === 'phrase'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs'
                      : item.type === 'space'
                      ? 'w-2'
                      : 'bg-indigo-950/40 text-white font-mono text-base'
                  }`}
                >
                  {item.emoji && <span className="mr-1">{item.emoji}</span>}
                  {item.text}
                </span>
              ))}
              {/* Blinking typing cursor */}
              <span className="w-2 h-4 bg-cyan-400 rounded-sm animate-pulse inline-block" />
            </div>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
          {/* Main Speak Sentence Button */}
          <button
            onClick={onSpeakAll}
            disabled={!fullText.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
            title="Pronounce entire transcribed sentence aloud"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-yellow-300' : ''}`} />
            <span>{isSpeaking ? 'Speaking...' : 'Pronounce All'}</span>
          </button>

          {/* Quick Editing Actions */}
          <div className="flex items-center gap-1.5">
            {/* Space */}
            <button
              onClick={onAddSpace}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-button text-slate-300 hover:text-white cursor-pointer"
              title="Add Space between words"
            >
              <Space className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Space</span>
            </button>

            {/* Backspace */}
            <button
              onClick={onBackspace}
              disabled={transcriptItems.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-button text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Delete last letter/word"
            >
              <Delete className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Backspace</span>
            </button>

            {/* Clear All */}
            <button
              onClick={onClear}
              disabled={transcriptItems.length === 0}
              className="p-1.5 rounded-xl glass-button text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Clear all transcribed text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-white/10 mx-0.5" />

            {/* Copy text */}
            <button
              onClick={handleCopy}
              disabled={!fullText.trim()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-button text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Copy text to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
