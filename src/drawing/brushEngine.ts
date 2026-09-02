import type { DrawingStroke, StrokePoint } from '../types/drawing';

export class BrushEngine {
  /**
   * Render a complete stroke on a Canvas 2D rendering context with quadratic smoothing
   */
  public static renderStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    if (points.length === 0) return;

    ctx.save();

    if (stroke.mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = stroke.size * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (points.length === 1) {
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, stroke.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      this.drawSmoothPath(ctx, points);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.globalCompositeOperation = 'source-over';

    switch (stroke.mode) {
      case 'neon':
        this.renderNeonStroke(ctx, stroke);
        break;
      case 'rainbow':
        this.renderRainbowStroke(ctx, stroke);
        break;
      case 'pencil':
        this.renderPencilStroke(ctx, stroke);
        break;
      case 'marker':
        this.renderMarkerStroke(ctx, stroke);
        break;
      case 'sparkle':
        this.renderSparkleStroke(ctx, stroke);
        break;
      case 'normal':
      default:
        this.renderNormalStroke(ctx, stroke);
        break;
    }

    ctx.restore();
  }

  /**
   * Standard solid anti-aliased stroke
   */
  private static renderNormalStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = stroke.opacity ?? 1.0;

    if (points.length === 1) {
      ctx.fillStyle = stroke.color;
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, stroke.size / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    this.drawSmoothPath(ctx, points);
    ctx.stroke();
  }

  /**
   * Multi-pass glowing neon bloom stroke
   */
  private static renderNeonStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    if (points.length === 0) return;

    // Pass 1: Wide Outer Neon Glow
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = stroke.color;
    ctx.shadowBlur = stroke.size * 2.2;
    ctx.globalAlpha = 0.45;
    this.drawSmoothPath(ctx, points);
    ctx.stroke();
    ctx.restore();

    // Pass 2: Medium Aura
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * 1.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = stroke.color;
    ctx.shadowBlur = stroke.size * 1.2;
    ctx.globalAlpha = 0.85;
    this.drawSmoothPath(ctx, points);
    ctx.stroke();
    ctx.restore();

    // Pass 3: Crisp Bright Core
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, stroke.size * 0.45);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.95;
    this.drawSmoothPath(ctx, points);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Continuously cycling rainbow HSL spectrum stroke
   */
  private static renderRainbowStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    if (points.length < 2) {
      if (points.length === 1) {
        ctx.fillStyle = 'hsl(0, 100%, 60%)';
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = stroke.size;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const hue = ((p1.hue ?? (i * 7)) % 360);

      ctx.save();
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = stroke.size * 0.8;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Textured sketch pencil stroke
   */
  private static renderPencilStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = Math.max(1.5, stroke.size * 0.7);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.7;

    this.drawSmoothPath(ctx, points);
    ctx.stroke();

    // Subtle parallel grain layer for pencil texture
    if (points.length > 2) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = Math.max(1, stroke.size * 0.3);
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const jitterX = (Math.sin(i * 1.5) * 1.2);
        const jitterY = (Math.cos(i * 1.5) * 1.2);
        if (i === 0) {
          ctx.moveTo(points[i].x + jitterX, points[i].y + jitterY);
        } else {
          ctx.lineTo(points[i].x + jitterX, points[i].y + jitterY);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Translucent broad highlighter / marker stroke
   */
  private static renderMarkerStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * 1.8;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'bevel';
    ctx.globalAlpha = stroke.opacity ?? 0.55;

    this.drawSmoothPath(ctx, points);
    ctx.stroke();
  }

  /**
   * Glowing sparkle laser line
   */
  private static renderSparkleStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
    const points = stroke.points;
    
    // Core beam
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * 0.9;
    ctx.shadowColor = stroke.color;
    ctx.shadowBlur = stroke.size * 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    this.drawSmoothPath(ctx, points);
    ctx.stroke();
    ctx.restore();

    // Sparkle diamond stars along stroke points
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = stroke.color;
    ctx.shadowBlur = 10;
    const step = Math.max(3, Math.floor(points.length / 15));
    for (let i = 0; i < points.length; i += step) {
      const p = points[i];
      const starSize = Math.max(2, (stroke.size * 0.45));
      this.drawStar(ctx, p.x, p.y, starSize);
    }
    ctx.restore();
  }

  /**
   * Draws a smooth quadratic bezier curve through a list of points
   */
  public static drawSmoothPath(ctx: CanvasRenderingContext2D, points: StrokePoint[]): void {
    if (points.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 1) {
      ctx.lineTo(points[0].x, points[0].y);
      return;
    }

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
      return;
    }

    // Quadratic bezier spline through midpoints
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
    }

    // Connect final point
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  private static drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx - r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - r);
    ctx.fill();
  }
}
