import React from 'react';
import type { SavedDrawing } from '../../types/drawing';
import { ExportUtils } from '../../utils/exportUtils';
import { X, Trash2, Download, Images, Sparkles } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDrawings: SavedDrawing[];
  onDeleteDrawing: (id: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  savedDrawings,
  onDeleteDrawing,
}) => {
  if (!isOpen) return null;

  const handleDownloadSingle = (drawing: SavedDrawing) => {
    ExportUtils.downloadDataUrl(drawing.imageDataUrl, `${drawing.title.toLowerCase().replace(/\s+/g, '-')}.png`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Images className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Saved Artworks Gallery</h2>
              <p className="text-xs text-slate-400">{savedDrawings.length} air drawings saved locally in browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {savedDrawings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 border border-white/5">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="text-sm font-medium text-slate-300">No saved drawings yet</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Draw something in the air with your finger and click the bookmark button in the toolbar to save!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {savedDrawings.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-lg hover:border-cyan-500/40 transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info & Action Bar */}
                  <div className="p-3 flex items-center justify-between border-t border-white/5 bg-slate-900/90">
                    <div className="flex flex-col truncate pr-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.strokeCount} strokes
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDownloadSingle(item)}
                        title="Download Artwork"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDrawing(item.id)}
                        title="Delete Artwork"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
