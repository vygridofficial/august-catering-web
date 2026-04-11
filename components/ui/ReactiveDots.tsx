'use client';

import React, { useRef, useEffect } from 'react';

interface ReactiveDotsProps {
  dotSize?: number;
  spacing?: number;
  activeRadius?: number;
  activeScale?: number;
  inactiveColor?: string;
  activeColor?: string;
  className?: string;
}

export function ReactiveDots({
  dotSize = 2,
  spacing = 24,
  activeRadius = 150,
  activeScale = 2.5,
  inactiveColor = 'rgba(255, 255, 255, 0.1)',
  activeColor = 'rgba(255, 204, 0, 0.8)',
  className = "absolute inset-0",
}: ReactiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(Date.now());
  const globalOpacity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      cols = Math.floor(canvas.width / spacing);
      rows = Math.floor(canvas.height / spacing);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isIdle = Date.now() - lastMoveTime.current > 1500;
      if (isIdle) {
        globalOpacity.current = Math.max(0, globalOpacity.current - 0.02);
      } else {
        globalOpacity.current = Math.min(1, globalOpacity.current + 0.1);
      }

      if (globalOpacity.current > 0) {
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = i * spacing + spacing / 2;
            const y = j * spacing + spacing / 2;

            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < activeRadius) {
              const factor = 1 - distance / activeRadius;
              const currentScale = 1 + factor * (activeScale - 1);
              
              ctx.globalAlpha = factor * 0.8 * globalOpacity.current;
              ctx.fillStyle = activeColor;

              ctx.beginPath();
              ctx.arc(x, y, (dotSize / 2) * currentScale, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      lastMoveTime.current = Date.now();
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotSize, spacing, activeRadius, activeScale, inactiveColor, activeColor]);

  return (
    <div ref={containerRef} className={`${className} z-0 overflow-hidden pointer-events-none`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
