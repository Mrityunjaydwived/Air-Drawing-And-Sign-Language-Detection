import type { Particle } from '../types/drawing';

export interface RippleEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private ripples: RippleEffect[] = [];
  private maxParticles: number = 200;

  /**
   * Emit particles at a specific coordinate (e.g. fingertip)
   */
  public emitFingertipParticles(
    x: number, 
    y: number, 
    color: string = '#38bdf8', 
    count: number = 3,
    isDrawing: boolean = false
  ): void {
    if (this.particles.length >= this.maxParticles) {
      this.particles.splice(0, count);
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2 + 1) * (isDrawing ? 1.5 : 0.8);
      const life = Math.random() * 25 + 15;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isDrawing ? 0.5 : 0),
        size: Math.random() * (isDrawing ? 3.5 : 2.5) + 1.2,
        color,
        alpha: 1.0,
        life,
        maxLife: life,
      });
    }
  }

  /**
   * Trigger expanding circular ripple when a stroke begins
   */
  public addRipple(x: number, y: number, color: string = '#38bdf8', maxRadius: number = 40): void {
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius,
      color,
      alpha: 0.9,
    });
  }

  /**
   * Update particle positions and fade lifetimes
   */
  public update(): void {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // Gentle gravity
      p.vx *= 0.96;
      p.life -= 1;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0 || p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += (r.maxRadius - r.radius) * 0.15 + 0.8;
      r.alpha = Math.max(0, 1 - (r.radius / r.maxRadius));

      if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
        this.ripples.splice(i, 1);
      }
    }
  }

  /**
   * Render all active particles and ripples on canvas context
   */
  public render(ctx: CanvasRenderingContext2D): void {
    if (this.particles.length === 0 && this.ripples.length === 0) return;

    ctx.save();

    // Render ripples
    for (const r of this.ripples) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5 * r.alpha;
      ctx.globalAlpha = r.alpha;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    // Render particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.restore();
  }

  public clear(): void {
    this.particles = [];
    this.ripples = [];
  }
}
