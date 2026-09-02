import { useState } from 'react';
import { SIGN_DICTIONARY } from '../../vision/signLanguageDetector';
import type { SignDefinition, SignCategory } from '../../types/signLanguage';
import { X, BookOpen, Volume2, Search, Sparkles } from 'lucide-react';

interface SignDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPronounce: (text: string) => void;
}

export const SignDictionaryModal: React.FC<SignDictionaryModalProps> = ({
  isOpen,
  onClose,
  onPronounce,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SignCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSigns = SIGN_DICTIONARY.filter((sign: SignDefinition) => {
    const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
    const matchesSearch = 
      sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ASL & Hand Sign Dictionary</h2>
              <p className="text-xs text-slate-400">Hold any of these signs steady to type and pronounce aloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
            {[
              { id: 'all', label: 'All Signs' },
              { id: 'phrase', label: 'Phrases & Words' },
              { id: 'alphabet', label: 'ASL Alphabet' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as SignCategory | 'all')}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sign, letter, phrase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Signs Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredSigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 gap-2">
              <Sparkles className="w-6 h-6 text-slate-500" />
              <p className="text-xs">No matching signs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredSigns.map((sign) => (
                <div
                  key={sign.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-2.5 shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                        {sign.emoji}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{sign.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">Type: "{sign.symbol}"</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onPronounce(sign.spokenText)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer shrink-0"
                      title={`Pronounce "${sign.spokenText}"`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 text-[11px] text-slate-300 leading-snug">
                    <p>{sign.description}</p>
                    <p className="text-[10px] text-slate-500 italic">💡 {sign.tips}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
