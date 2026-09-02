import React, { useState, useEffect } from 'react';
import type { ExportOptions } from '../../types/drawing';
import { ExportUtils } from '../../utils/exportUtils';
import { X, Download, Copy, Check, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawingCanvas: HTMLCanvasElement | null;
  videoElement: HTMLVideoElement | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  drawingCanvas,
  videoElement,
}) => {
  const [includeCamera, setIncludeCamera] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [backgroundColor, setBackgroundColor] = useState<'transparent' | '#000000' | '#ffffff'>('transparent');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate live preview when settings change
  useEffect(() => {
    if (!isOpen || !drawingCanvas) return;

    let isMounted = true;
    setIsGenerating(true);

    const options: ExportOptions = {
      includeCamera,
      format,
      quality: 0.95,
      backgroundColor: includeCamera ? 'transparent' : backgroundColor,
    };

    ExportUtils.exportImage(drawingCanvas, videoElement, options)
      .then((url) => {
        if (isMounted) {
          setPreviewUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((e) => {
        console.error('Failed to generate preview:', e);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, includeCamera, format, backgroundColor, drawingCanvas, videoElement]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!previewUrl) return;
    const filename = `airdraw-${Date.now()}.${format}`;
    ExportUtils.downloadDataUrl(previewUrl, filename);
    onClose();
  };

  const handleCopy = async () => {
    if (!previewUrl) return;
    const success = await ExportUtils.copyImageToClipboard(previewUrl);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export & Download Drawing</h2>
              <p className="text-xs text-slate-400">Save your AI air drawing artwork</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center shadow-inner group">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Drawing Export Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Generating preview...</span>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center text-xs text-cyan-300">
              Updating preview...
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3.5 text-xs">
          {/* Layer Mode (Drawing Only vs Drawing + Camera) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-300">Content Layers</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIncludeCamera(false)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-medium cursor-pointer transition-all ${
                  !includeCamera
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Drawing Only</span>
              </button>

              <button
                onClick={() => setIncludeCamera(true)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-medium cursor-pointer transition-all ${
                  includeCamera
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Drawing + Camera</span>
              </button>
            </div>
          </div>

          {/* Background color for Drawing Only */}
          {!includeCamera && (
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Background</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'transparent', label: 'Transparent' },
                  { id: '#000000', label: 'Solid Black' },
                  { id: '#ffffff', label: 'Pure White' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackgroundColor(bg.id as 'transparent' | '#000000' | '#ffffff')}
                    className={`p-2 rounded-xl border font-medium cursor-pointer transition-all ${
                      backgroundColor === bg.id
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format selection */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-slate-300">File Format</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                  format === 'png'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                PNG (Lossless)
              </button>
              <button
                onClick={() => setFormat('jpeg')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                  format === 'jpeg'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                JPEG
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            disabled={!previewUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl glass-button text-slate-200 text-xs font-semibold hover:text-white cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!previewUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
