import type { ScreenPoint, HandGestureType } from '../types/vision';
import { HAND_CONNECTIONS, LANDMARK_INDEX } from '../types/vision';

export class OverlayRenderer {
  /**
   * Render Hand Skeleton directly on canvas context at 60+ FPS
   */
  public static renderSkeleton(
    ctx: CanvasRenderingContext2D,
    landmarks: ScreenPoint[],
    isDrawing: boolean,
    brushColor: string
  ): void {
    if (landmarks.length < 21) return;

    ctx.save();

    // 1. Cybernetic Bones
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // 2. Joints
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      if (!p) continue;

      ctx.beginPath();
      if (i === LANDMARK_INDEX.INDEX_TIP) {
        ctx.arc(p.x, p.y, isDrawing ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = brushColor;
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else if (i === LANDMARK_INDEX.WRIST) {
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Render Glowing Fingertip Reticle and state badge directly on canvas
   */
  public static renderFingertipCursor(
    ctx: CanvasRenderingContext2D,
    point: ScreenPoint | null,
    gesture: HandGestureType,
    isDrawing: boolean,
    brushColor: string,
    brushSize: number
  ): void {
    if (!point) return;

    ctx.save();
    const radius = Math.max(12, brushSize * 0.85);

    // 1. Drawing state ripple ring
    if (isDrawing) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
    }

    // 2. Main Outer Reticle
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.lineWidth = isDrawing ? 2.5 : 1.5;
    ctx.strokeStyle = isDrawing ? brushColor : '#38bdf8';
    ctx.shadowColor = isDrawing ? brushColor : '#38bdf8';
    ctx.shadowBlur = isDrawing ? 14 : 8;
    ctx.globalAlpha = isDrawing ? 0.95 : 0.75;
    ctx.stroke();

    // 3. Center Target Core
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(3, brushSize * 0.3), 0, Math.PI * 2);
    ctx.fillStyle = isDrawing ? brushColor : '#ffffff';
    ctx.shadowColor = isDrawing ? brushColor : '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 1.0;
    ctx.fill();

    // 4. Subtle Crosshair Marks
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(point.x - radius - 4, point.y);
    ctx.lineTo(point.x - radius + 2, point.y);
    ctx.moveTo(point.x + radius - 2, point.y);
    ctx.lineTo(point.x + radius + 4, point.y);
    ctx.moveTo(point.x, point.y - radius - 4);
    ctx.lineTo(point.x, point.y - radius + 2);
    ctx.moveTo(point.x, point.y + radius - 2);
    ctx.lineTo(point.x, point.y + radius + 4);
    ctx.stroke();

    // 5. Floating Badge Label
    const label = isDrawing ? 'DRAWING' : gesture === 'HOVER' ? 'HOVER' : gesture === 'PINCH' ? 'PINCH' : 'READY';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(label).width;
    const badgeW = textWidth + 14;
    const badgeH = 18;
    const badgeX = point.x - badgeW / 2;
    const badgeY = point.y + radius + 8;

    // Badge pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = isDrawing ? brushColor : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 9);
    ctx.fill();
    ctx.stroke();

    // Badge dot
    ctx.fillStyle = isDrawing ? brushColor : '#38bdf8';
    ctx.beginPath();
    ctx.arc(badgeX + 7, badgeY + badgeH / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Badge text
    ctx.fillStyle = isDrawing ? brushColor : '#cbd5e1';
    ctx.fillText(label, badgeX + badgeW / 2 + 4, badgeY + badgeH / 2);

    ctx.restore();
  }
}
