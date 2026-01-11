
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';

type DottedGlowBackgroundProps = {
  className?: string;
  gap?: number;
  radius?: number;
  color?: string;
  glowColor?: string;
  opacity?: number;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
};

export default function DottedGlowBackground({
  className,
  gap = 12,
  radius = 2,
  color = "rgba(255,255,255,0.1)",
  glowColor = "rgba(255, 255, 255, 0.8)",
  opacity = 1,
  speedMin = 0.5,
  speedMax = 1.5,
  speedScale = 0.8,
}: DottedGlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const ctx = el.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let raf = 0;
    let resizeRaf = 0;
    let stopped = false;

    const dpr = Math.min(2, window.devicePixelRatio || 1); // Cap DPR at 2 for performance

    const resize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (stopped || !container || !el) return;
        
        const rect = container.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.floor(rect.width * dpr));
        const nextHeight = Math.max(1, Math.floor(rect.height * dpr));
        
        if (el.width !== nextWidth || el.height !== nextHeight) {
          el.width = nextWidth;
          el.height = nextHeight;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          regenDots();
        }
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let dots: { x: number; y: number; phase: number; speed: number }[] = [];

    const regenDots = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const newDots = [];
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          newDots.push({
            x: i * gap + (j % 2 === 0 ? 0 : gap * 0.5),
            y: j * gap,
            phase: Math.random() * Math.PI * 2,
            speed: speedMin + Math.random() * (speedMax - speedMin),
          });
        }
      }
      dots = newDots;
    };

    const draw = (now: number) => {
      if (stopped || !container) return;
      
      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      
      const time = (now / 1000) * speedScale;

      // Grouping draw calls - drawing basic dots first (most performance critical)
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      dots.forEach((d) => {
        const mod = (time * d.speed + d.phase) % 2;
        const lin = mod < 1 ? mod : 2 - mod;
        const intensity = 0.1 + 0.9 * (lin * lin);

        if (intensity <= 0.7) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw glowing dots separately to batch context changes
            ctx.save();
            ctx.globalAlpha = opacity * intensity;
            ctx.fillStyle = glowColor;
            // Limit shadow usage to high intensity only
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 4; 
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    regenDots();
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
    };
  }, [gap, radius, color, glowColor, opacity, speedMin, speedMax, speedScale]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        position: "absolute", 
        inset: 0, 
        zIndex: 0, 
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'strict'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: "block", 
          width: '100%', 
          height: '100%' 
        }} 
      />
    </div>
  );
}