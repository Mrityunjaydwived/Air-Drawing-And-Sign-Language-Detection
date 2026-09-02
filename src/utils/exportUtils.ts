import confetti from 'canvas-confetti';
import type { ExportOptions } from '../types/drawing';

export class ExportUtils {
  /**
   * Export the drawing or drawing + camera composite as an image
   */
  public static async exportImage(
    drawingCanvas: HTMLCanvasElement,
    videoElement: HTMLVideoElement | null,
    options: ExportOptions
  ): Promise<string> {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = drawingCanvas.width;
    exportCanvas.height = drawingCanvas.height;
    const ctx = exportCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D context for export');
    }

    // Optional background fill
    if (options.backgroundColor && options.backgroundColor !== 'transparent') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    // Include Camera video frame if requested
    if (options.includeCamera && videoElement && videoElement.videoWidth > 0) {
      ctx.save();
      // Mirror horizontal for realistic camera snapshot
      ctx.translate(exportCanvas.width, 0);
      ctx.scale(-1, 1);
      
      const vWidth = videoElement.videoWidth;
      const vHeight = videoElement.videoHeight;
      const cWidth = exportCanvas.width;
      const cHeight = exportCanvas.height;

      const canvasAspect = cWidth / cHeight;
      const videoAspect = vWidth / vHeight;

      if (canvasAspect > videoAspect) {
        const scale = cWidth / vWidth;
        const renderedH = vHeight * scale;
        const offsetY = (cHeight - renderedH) / 2;
        ctx.drawImage(videoElement, 0, offsetY, cWidth, renderedH);
      } else {
        const scale = cHeight / vHeight;
        const renderedW = vWidth * scale;
        const offsetX = (cWidth - renderedW) / 2;
        ctx.drawImage(videoElement, offsetX, 0, renderedW, cHeight);
      }

      ctx.restore();
    }

    // Draw the transparent drawing canvas over the background
    ctx.drawImage(drawingCanvas, 0, 0);

    const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return exportCanvas.toDataURL(mimeType, options.quality);
  }

  /**
   * Triggers a browser download for a data URL
   */
  public static downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger celebratory confetti burst
    this.triggerCelebration();
  }

  /**
   * Copy image to clipboard as PNG blob
   */
  public static async copyImageToClipboard(dataUrl: string): Promise<boolean> {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      this.triggerCelebration();
      return true;
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      return false;
    }
  }

  /**
   * Fire confetti celebratory animation
   */
  public static triggerCelebration(): void {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#38bdf8', '#818cf8', '#ec4899', '#10b981', '#fbbf24'],
      });
    } catch {}
  }
}
