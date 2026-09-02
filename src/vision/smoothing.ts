import type { ScreenPoint } from '../types/vision';

/**
 * 1€ (One-Euro) Filter for low-latency, jitter-free real-time hand & finger tracking.
 * Reference: Casiez, Roussel, Vogel (CHI 2012) - "1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in HCI"
 */

class LowPassFilter {
  private y: number | null = null;
  private s: number | null = null;

  constructor() {}

  public filter(value: number, alpha: number): number {
    if (this.y === null) {
      this.s = value;
      this.y = value;
      return value;
    }
    this.s = alpha * value + (1.0 - alpha) * (this.s ?? value);
    this.y = this.s;
    return this.s;
  }

  public last(): number | null {
    return this.y;
  }

  public reset(): void {
    this.y = null;
    this.s = null;
  }
}

export interface OneEuroConfig {
  minCutoff: number; // Minimum cutoff frequency (Hz) for low speed (e.g. 1.0)
  beta: number;      // Speed coefficient for high speed responsiveness (e.g. 0.007)
  dCutoff: number;   // Cutoff frequency for derivative (e.g. 1.0)
}

export class PointSmoother {
  private xFilter: LowPassFilter = new LowPassFilter();
  private yFilter: LowPassFilter = new LowPassFilter();
  private dxFilter: LowPassFilter = new LowPassFilter();
  private dyFilter: LowPassFilter = new LowPassFilter();
  private lastTime: number = 0;
  private lastPoint: ScreenPoint | null = null;
  private config: OneEuroConfig;

  constructor(config: Partial<OneEuroConfig> = {}) {
    this.config = {
      minCutoff: 0.8,   // Low cutoff when still (eliminates 100% micro-jitter)
      beta: 0.012,      // High responsiveness when moving (zero lag for fast strokes)
      dCutoff: 1.0,     // Derivative filter
      ...config,
    };
  }

  public setBaseAlpha(sensitivityFactor: number): void {
    // sensitivityFactor: 0.1 (ultra smooth) to 0.9 (ultra responsive)
    const factor = Math.max(0.1, Math.min(0.9, sensitivityFactor));
    this.config.minCutoff = 0.3 + factor * 1.5;
    this.config.beta = 0.002 + factor * 0.025;
  }

  private calculateAlpha(rate: number, cutoff: number): number {
    const tau = 1.0 / (2.0 * Math.PI * cutoff);
    const te = 1.0 / rate;
    return 1.0 / (1.0 + tau / te);
  }

  public smooth(rawPoint: ScreenPoint): ScreenPoint {
    const now = rawPoint.timestamp || performance.now();

    if (!this.lastPoint || this.lastTime === 0) {
      this.lastTime = now;
      this.lastPoint = { ...rawPoint };
      this.xFilter.filter(rawPoint.x, 1.0);
      this.yFilter.filter(rawPoint.y, 1.0);
      return { ...rawPoint };
    }

    const dt = Math.max(0.001, (now - this.lastTime) / 1000.0); // in seconds
    const rate = 1.0 / dt;
    this.lastTime = now;

    // Outlier rejection for teleports / glitchy frames
    const dist = Math.hypot(rawPoint.x - this.lastPoint.x, rawPoint.y - this.lastPoint.y);
    if (dist > 350) {
      this.reset();
      this.lastPoint = { ...rawPoint };
      return { ...rawPoint };
    }

    // 1. Calculate raw derivative (speed in px/sec)
    const rawDx = (rawPoint.x - (this.lastPoint.x || rawPoint.x)) * rate;
    const rawDy = (rawPoint.y - (this.lastPoint.y || rawPoint.y)) * rate;

    // 2. Filter derivative
    const dAlpha = this.calculateAlpha(rate, this.config.dCutoff);
    const dx = this.dxFilter.filter(rawDx, dAlpha);
    const dy = this.dyFilter.filter(rawDy, dAlpha);
    const speed = Math.hypot(dx, dy);

    // 3. Dynamic cutoff frequency based on velocity
    const cutoff = this.config.minCutoff + this.config.beta * speed;
    const alpha = this.calculateAlpha(rate, cutoff);

    // 4. Filter position
    const smoothedX = this.xFilter.filter(rawPoint.x, alpha);
    const smoothedY = this.yFilter.filter(rawPoint.y, alpha);

    const result: ScreenPoint = {
      x: smoothedX,
      y: smoothedY,
      pressure: rawPoint.pressure,
      timestamp: now,
    };

    this.lastPoint = result;
    return result;
  }

  public reset(): void {
    this.xFilter.reset();
    this.yFilter.reset();
    this.dxFilter.reset();
    this.dyFilter.reset();
    this.lastTime = 0;
    this.lastPoint = null;
  }

  public getCurrent(): ScreenPoint | null {
    return this.lastPoint ? { ...this.lastPoint } : null;
  }
}
