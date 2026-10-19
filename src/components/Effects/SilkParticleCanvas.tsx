import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  alphaSpeed: number;
}

interface SilkWave {
  yOffset: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
}

export const SilkParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize subtle floating gold & silk stardust
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particles: Particle[] = [];
    const colors = [
      'rgba(223, 181, 108, ',  // Luxury Champagne Gold
      'rgba(247, 226, 169, ',  // Radiant Pale Gold
      'rgba(201, 154, 69, ',   // Deep Imperial Gold
      'rgba(142, 33, 56, ',    // Atelier Crimson
      'rgba(84, 13, 24, ',     // Dark Regal Burgundy
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: -Math.random() * 0.35 - 0.12, // gentle upward drift
        alpha: Math.random() * 0.5 + 0.15,
        alphaSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Dynamic silk ribbon curves
    const silkWaves: SilkWave[] = [
      {
        yOffset: 0.25,
        amplitude: 55,
        frequency: 0.0018,
        speed: 0.0006,
        phase: 0,
        color: 'rgba(223, 181, 108, 0.07)',
        lineWidth: 1.5,
      },
      {
        yOffset: 0.45,
        amplitude: 75,
        frequency: 0.0014,
        speed: 0.00045,
        phase: Math.PI / 3,
        color: 'rgba(201, 154, 69, 0.05)',
        lineWidth: 2,
      },
      {
        yOffset: 0.70,
        amplitude: 65,
        frequency: 0.002,
        speed: 0.0007,
        phase: Math.PI / 1.5,
        color: 'rgba(128, 16, 32, 0.06)',
        lineWidth: 1.8,
      },
      {
        yOffset: 0.85,
        amplitude: 85,
        frequency: 0.0012,
        speed: 0.0005,
        phase: Math.PI,
        color: 'rgba(247, 226, 169, 0.04)',
        lineWidth: 1.2,
      },
    ];

    let time = 0;
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;

      // 1. Draw flowing silk ribbons
      silkWaves.forEach((wave) => {
        ctx.beginPath();
        ctx.lineWidth = wave.lineWidth;
        ctx.strokeStyle = wave.color;

        const baseHeight = height * wave.yOffset;
        const currentPhase = wave.phase + time * wave.speed;

        ctx.moveTo(0, baseHeight + Math.sin(currentPhase) * wave.amplitude);

        const step = 20;
        for (let x = step; x <= width + step; x += step) {
          const y =
            baseHeight +
            Math.sin(x * wave.frequency + currentPhase) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.5 + currentPhase * 0.7) * (wave.amplitude * 0.35);
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      });

      // 2. Draw floating micro silk particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.65 || p.alpha < 0.1) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
