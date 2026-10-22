'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating Micro-Energy Particles / Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Pause when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Particle system definition
    const PARTICLE_COUNT = Math.min(38, Math.floor((width * height) / 25000));
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      color: string;
    }

    const colors = [
      'rgba(56, 189, 248,', // Cyan
      'rgba(8, 120, 255,',  // Electric blue
      'rgba(129, 140, 248,', // Indigo
      'rgba(255, 255, 255,', // Soft white
    ];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const baseAlpha = 0.15 + Math.random() * 0.45;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 0.8 + Math.random() * 1.5,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    let tick = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      tick++;

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            const lineAlpha = (1 - dist / 90) * 0.12 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Gentle pulse
        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed + i) * 0.15;
        p.alpha = Math.max(0.05, Math.min(0.75, p.alpha));

        // Draw particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-fx-container" aria-hidden="true">
      {/* 1. Top Cyber Aurora Spotlight Beam */}
      <div className="hero-fx-aurora-beam" />

      {/* 2. Volumetric Globe Aura (Right Column Depth) */}
      <div className="hero-fx-globe-aura" />

      {/* 3. Headline Atmospheric Bloom (Left Column) */}
      <div className="hero-fx-headline-bloom" />

      {/* 4. Subtle Digital Constellation & Energy Particles Canvas */}
      <canvas ref={canvasRef} className="hero-fx-canvas" />

      {/* 5. Bottom Borderless Dissolve into #030407 */}
      <div className="hero-fx-bottom-dissolve" />
    </div>
  );
}
