import type { DrawingStroke, StrokePoint, DrawingSettings } from '../types/drawing';
import type { ScreenPoint } from '../types/vision';
import { BrushEngine } from './brushEngine';
import { ParticleSystem } from './particleSystem';
import { HistoryManager } from './historyManager';

export class DrawingEngine {
  private strokes: DrawingStroke[] = [];
  private currentStroke: DrawingStroke | null = null;
  private history: HistoryManager = new HistoryManager();
  private particles: ParticleSystem = new ParticleSystem();
  private rainbowHue: number = 0;

  // Offscreen buffer for O(1) blitting of historical strokes
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;
  private bufferWidth: number = 0;
  private bufferHeight: number = 0;

  constructor() {
    this.history.pushState([]);
  }

  public getStrokes(): DrawingStroke[] {
    return this.strokes;
  }

  public getCurrentStroke(): DrawingStroke | null {
    return this.currentStroke;
  }

  public getParticleSystem(): ParticleSystem {
    return this.particles;
  }

  private ensureOffscreenBuffer(width: number, height: number): void {
    if (
      !this.offscreenCanvas ||
      this.bufferWidth !== width ||
      this.bufferHeight !== height
    ) {
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCanvas.width = width;
      this.offscreenCanvas.height = height;
      this.offscreenCtx = this.offscreenCanvas.getContext('2d');
      this.bufferWidth = width;
      this.bufferHeight = height;
      this.rebuildOffscreenBuffer();
    }
  }

  public rebuildOffscreenBuffer(): void {
    if (!this.offscreenCtx || !this.offscreenCanvas) return;
    this.offscreenCtx.clearRect(0, 0, this.bufferWidth, this.bufferHeight);

    for (const stroke of this.strokes) {
      BrushEngine.renderStroke(this.offscreenCtx, stroke);
    }
  }

  /**
   * Start a new stroke at a starting point
   */
  public startStroke(point: ScreenPoint, settings: DrawingSettings): void {
    if (this.currentStroke) {
      this.endStroke();
    }

    const strokeId = `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const strokePoint: StrokePoint = {
      ...point,
      color: settings.brushColor,
      size: settings.brushSize,
      hue: this.rainbowHue,
    };

    this.currentStroke = {
      id: strokeId,
      mode: settings.brushMode,
      color: settings.brushColor,
      size: settings.brushSize,
      opacity: settings.brushOpacity,
      points: [strokePoint],
    };

    // Emit initial ripple and particles
    if (settings.showParticles) {
      this.particles.addRipple(point.x, point.y, settings.brushColor, settings.brushSize * 3);
      this.particles.emitFingertipParticles(point.x, point.y, settings.brushColor, 5, true);
    }
  }

  /**
   * Add a continuous movement point to the active stroke
   */
  public addPoint(point: ScreenPoint, settings: DrawingSettings): void {
    if (!this.currentStroke) {
      this.startStroke(point, settings);
      return;
    }

    const points = this.currentStroke.points;
    const lastPoint = points[points.length - 1];

    if (lastPoint) {
      const dist = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
      // Ignore identical or micro points to prevent bloating array
      if (dist < 1.0) {
        return;
      }

      // Progress rainbow hue by travel distance
      this.rainbowHue = (this.rainbowHue + dist * settings.rainbowSpeed * 0.4) % 360;
    }

    const strokePoint: StrokePoint = {
      ...point,
      color: settings.brushColor,
      size: settings.brushSize,
      hue: this.rainbowHue,
    };

    this.currentStroke.points.push(strokePoint);

    // Particle trail emission during drawing
    if (settings.showParticles) {
      const emitColor = settings.brushMode === 'rainbow' ? `hsl(${this.rainbowHue}, 100%, 65%)` : settings.brushColor;
      this.particles.emitFingertipParticles(point.x, point.y, emitColor, 2, true);
    }
  }

  /**
   * End current stroke, bake into offscreen buffer, and commit to history
   */
  public endStroke(): void {
    if (this.currentStroke && this.currentStroke.points.length > 0) {
      this.strokes.push(this.currentStroke);

      // Fast bake: draw just this stroke onto the offscreen buffer
      if (this.offscreenCtx) {
        BrushEngine.renderStroke(this.offscreenCtx, this.currentStroke);
      }

      this.history.pushState(this.strokes);
    }
    this.currentStroke = null;
  }

  /**
   * High-speed composite render to main canvas (O(1) frame cost)
   */
  public render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.ensureOffscreenBuffer(width, height);

    ctx.clearRect(0, 0, width, height);

    // 1. Blit baked historical strokes in a single drawImage call
    if (this.offscreenCanvas) {
      ctx.drawImage(this.offscreenCanvas, 0, 0);
    }

    // 2. Render only the active in-progress stroke on top
    if (this.currentStroke) {
      BrushEngine.renderStroke(ctx, this.currentStroke);
    }

    // 3. Render particle layer
    this.particles.update();
    this.particles.render(ctx);
  }

  /**
   * Undo the last stroke
   */
  public undo(): boolean {
    if (this.currentStroke) {
      this.currentStroke = null;
    }

    const prevState = this.history.undo(this.strokes);
    if (prevState !== null) {
      this.strokes = prevState;
      this.rebuildOffscreenBuffer();
      return true;
    }
    return false;
  }

  /**
   * Redo the last undone stroke
   */
  public redo(): boolean {
    const nextState = this.history.redo(this.strokes);
    if (nextState !== null) {
      this.strokes = nextState;
      this.rebuildOffscreenBuffer();
      return true;
    }
    return false;
  }

  public canUndo(): boolean {
    return this.history.canUndo();
  }

  public canRedo(): boolean {
    return this.history.canRedo();
  }

  /**
   * Clear all canvas strokes
   */
  public clear(): void {
    this.endStroke();
    if (this.strokes.length > 0) {
      this.strokes = [];
      this.history.pushState([]);
      this.rebuildOffscreenBuffer();
    }
    this.particles.clear();
  }

  /**
   * Load strokes from saved snapshot
   */
  public loadStrokes(strokes: DrawingStroke[]): void {
    this.strokes = strokes.map(s => ({
      ...s,
      points: s.points.map(p => ({ ...p })),
    }));
    this.history.pushState(this.strokes);
    this.rebuildOffscreenBuffer();
  }
}
