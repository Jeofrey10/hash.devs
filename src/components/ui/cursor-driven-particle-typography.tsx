"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useMemo } from "react";
import { prefersReducedMotion } from "@/lib/animations";

export interface CursorDrivenParticleTypographyProps {
  /** Additional CSS classes */
  className?: string;
  /** The text to render (supports \n for intentional editorial line breaks) */
  text: string;
  /** Custom particle size (default: 1.25) */
  particleSize?: number;
  /** Density of particles (step size: lower = denser, default: 5) */
  particleDensity?: number;
  /** How strongly the cursor pushes particles away (default: 10) */
  dispersionStrength?: number;
  /** Speed at which particles return to origin (default: 0.08) */
  returnSpeed?: number;
  /** Custom color for particles. Defaults to #FFFFFF. */
  color?: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  dispersion: number;
  returnSpd: number;
  alpha: number;

  constructor(
    x: number,
    y: number,
    size: number,
    dispersion: number,
    returnSpd: number
  ) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
    this.alpha = 0; // Pure rest state: zero ghosting
  }

  update(mouseX: number, mouseY: number): boolean {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceSq = dx * dx + dy * dy;

    // Controlled interaction radius: 95px
    const interactionRadius = 95;
    const interactionRadiusSq = interactionRadius * interactionRadius;

    let isInteracting = false;

    if (distanceSq < interactionRadiusSq && mouseX > -500 && mouseY > -500) {
      const distance = Math.sqrt(distanceSq);
      const forceDirectionX = dx / (distance || 1);
      const forceDirectionY = dy / (distance || 1);
      const force = (interactionRadius - distance) / interactionRadius;

      // Smooth quadratic ease for repulsion force
      const easeForce = force * force;
      const repulsionX = forceDirectionX * easeForce * this.dispersion;
      const repulsionY = forceDirectionY * easeForce * this.dispersion;

      this.vx -= repulsionX;
      this.vy -= repulsionY;
      isInteracting = true;
    }

    // Natural spring return to exact origin on the letterforms
    const returnForceX = (this.originX - this.x) * this.returnSpd;
    const returnForceY = (this.originY - this.y) * this.returnSpd;
    this.vx += returnForceX;
    this.vy += returnForceY;

    // Precision friction damping
    this.vx *= 0.88;
    this.vy *= 0.88;

    this.x += this.vx;
    this.y += this.vy;

    const distFromOrigin = Math.hypot(this.x - this.originX, this.y - this.originY);
    const isMoving =
      Math.abs(this.vx) > 0.02 ||
      Math.abs(this.vy) > 0.02 ||
      distFromOrigin > 0.1;

    // Dynamic alpha:
    // When particles are energized by cursor proximity or displacement, they illuminate.
    // When resting at origin, alpha settles to 0, eliminating any grey-white ghosting.
    if (isInteracting || distFromOrigin > 0.5) {
      this.alpha = Math.min(0.9, Math.max(0.2, distFromOrigin / 10));
    } else {
      this.alpha = 0;
    }

    if (!isMoving && mouseX <= -500) {
      this.x = this.originX;
      this.y = this.originY;
      this.vx = 0;
      this.vy = 0;
      this.alpha = 0;
    }

    return isMoving;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0.01) return;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  particleSize = 1.25,
  particleDensity = 5,
  dispersionStrength = 10,
  returnSpeed = 0.08,
}: CursorDrivenParticleTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReduced, setIsReduced] = useState(false);

  const lines = useMemo(() => text.split("\n"), [text]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = prefersReducedMotion();
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || (isTouch && window.innerWidth < 768)) {
      setIsReduced(true);
      return;
    }
    setIsReduced(false);

    const container = containerRef.current;
    const headline = headlineRef.current;
    const canvas = canvasRef.current;
    if (!container || !headline || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let particles: Particle[] = [];
    let isVisible = true;
    let isRunning = false;
    let isDisposed = false;

    let mouseX = -1000;
    let mouseY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;

    const sampleParticles = async () => {
      if (isDisposed || !container || !headline || !canvas) return;

      // Ensure web fonts are completely loaded before measuring and sampling
      if (document.fonts) {
        await document.fonts.ready;
      }
      if (isDisposed) return;

      const rect = container.getBoundingClientRect();
      containerWidth = Math.ceil(rect.width) || 800;
      containerHeight = Math.ceil(rect.height) || 240;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      // Create an offscreen canvas for crisp raster text sampling
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.setTransform(1, 0, 0, 1, 0, 0);
      offCtx.scale(dpr, dpr);

      // Extract exact computed styles from the visible HTML headline
      const compStyle = window.getComputedStyle(headline);
      const fontSize = parseFloat(compStyle.fontSize) || 48;
      const fontFamily = compStyle.fontFamily || "Syne, sans-serif";
      const fontWeight = compStyle.fontWeight || "800";
      const letterSpacing = compStyle.letterSpacing;

      offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      if (letterSpacing && letterSpacing !== "normal") {
        offCtx.letterSpacing = letterSpacing;
      }
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#FFFFFF";

      // Render each line on the offscreen canvas matching the visible DOM line coordinates
      const lineSpans = headline.querySelectorAll<HTMLElement>(".manifesto-line");
      const containerRect = container.getBoundingClientRect();

      lineSpans.forEach((span) => {
        const lineRect = span.getBoundingClientRect();
        const lineCenterX = lineRect.left - containerRect.left + lineRect.width / 2;
        const lineCenterY = lineRect.top - containerRect.top + lineRect.height / 2;
        offCtx.fillText(span.innerText.trim(), lineCenterX, lineCenterY);
      });

      // Sample pixel data from the offscreen canvas
      const imgData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const step = Math.max(1, Math.floor(particleDensity * dpr));

      particles = [];
      for (let y = 0; y < imgData.height; y += step) {
        for (let x = 0; x < imgData.width; x += step) {
          const index = (y * imgData.width + x) * 4;
          const alpha = imgData.data[index + 3] || 0;

          if (alpha > 140) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }

      // Initial clean state: canvas is 100% transparent at rest (zero ghosting)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, containerWidth, containerHeight);
    };

    const animate = () => {
      if (isDisposed || !isVisible) {
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      let anyMoving = false;
      for (let i = 0; i < particles.length; i++) {
        const moving = particles[i].update(mouseX, mouseY);
        if (moving) anyMoving = true;
        particles[i].draw(ctx);
      }

      // If mouse is outside and all particles have settled, stop rAF loop to preserve CPU/GPU
      if (!anyMoving && mouseX <= -500) {
        isRunning = false;
        animationFrameId = null;
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (isRunning || isDisposed || !isVisible) return;
      isRunning = true;
      animationFrameId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startLoop();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      // Keep loop running until particles return to rest
      startLoop();
    };

    // Viewport gating via IntersectionObserver
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Initial sampling after DOM layout settles
    const timeoutId = setTimeout(() => {
      sampleParticles();
    }, 100);

    // Resize observer to recalculate positions on window/viewport resize
    const resizeObserver = new ResizeObserver(() => {
      sampleParticles();
    });
    resizeObserver.observe(container);

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      isDisposed = true;
      stopLoop();
      clearTimeout(timeoutId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    text,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-5xl mx-auto flex items-center justify-center select-text py-2 overflow-visible",
        className
      )}
    >
      {/* 
        PRIMARY MONUMENTAL MANIFESTO HEADLINE (HTML DOM)
        Always 100% visible, selectable, accessible, and visually dominant.
      */}
      <h2
        ref={headlineRef}
        className="relative z-10 font-display text-[clamp(1.4rem,3.4vw,3.25rem)] font-extrabold tracking-tight text-brand-white uppercase leading-[1.08] text-center max-w-5xl mx-auto select-text"
      >
        {lines.map((line, idx) => (
          <span key={idx} className="block manifesto-line whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>

      {/* 
        SECONDARY INTERACTIVE PARTICLE LAYER (TRANSPARENT CANVAS)
        Overlays the visible headline without replacing or duplicating it.
      */}
      {!isReduced && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        />
      )}
    </div>
  );
}
