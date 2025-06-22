'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';

// Particle System Component
interface ParticleSystemProps {
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
  trail?: boolean;
  interactive?: boolean;
  className?: string;
}

export const ParticleSystem = ({
  count = 50,
  speed = 1,
  color = '#4ade80',
  size = 2,
  trail = false,
  interactive = false,
  className = ''
}: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * size + 1
      });
    }
    particlesRef.current = particles;
  }, [count, speed, size]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas or create trail effect
    if (trail) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Interactive mode - attract to mouse
      if (interactive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }
      }

      // Update life
      particle.life -= 0.5;

      // Reset particle if dead or out of bounds
      if (particle.life <= 0 || 
          particle.x < 0 || particle.x > canvas.width ||
          particle.y < 0 || particle.y > canvas.height) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * speed;
        particle.vy = (Math.random() - 0.5) * speed;
        particle.life = particle.maxLife;
      }

      // Draw particle
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [color, speed, trail, interactive]);

  useEffect(() => {
    initParticles();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      initParticles();
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [initParticles, animate, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

// Shader-like CSS Filters Component
interface ShaderEffectsProps {
  children: React.ReactNode;
  effect?: 'glitch' | 'chromatic' | 'noise' | 'blur' | 'distortion' | 'none';
  intensity?: number;
  animated?: boolean;
  className?: string;
}

export const ShaderEffects = ({
  children,
  effect = 'none',
  intensity = 1,
  animated = false,
  className = ''
}: ShaderEffectsProps) => {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [animated]);

  const getFilterStyle = () => {
    const animationOffset = animated ? animationState / 100 : 0;
    const baseIntensity = intensity * (1 + animationOffset * 0.5);

    switch (effect) {
      case 'glitch':
        return {
          filter: `
            contrast(${1 + baseIntensity * 0.2}) 
            saturate(${1 + baseIntensity * 0.3})
            hue-rotate(${animationOffset * 360}deg)
          `,
          animation: animated ? 'glitchEffect 0.1s infinite' : undefined
        };
      
      case 'chromatic':
        return {
          filter: `
            drop-shadow(${baseIntensity * 2}px 0 red)
            drop-shadow(-${baseIntensity * 2}px 0 cyan)
          `
        };
      
      case 'noise':
        return {
          filter: `
            contrast(${1 + baseIntensity * 0.5})
            brightness(${1 + baseIntensity * 0.1})
          `,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${baseIntensity * 0.1}'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay'
        };
      
      case 'blur':
        return {
          filter: `blur(${baseIntensity * 2}px)`,
          backdropFilter: `blur(${baseIntensity * 4}px)`
        };
      
      case 'distortion':
        return {
          transform: `
            perspective(1000px)
            rotateX(${animationOffset * baseIntensity * 5}deg)
            rotateY(${Math.sin(animationOffset * 0.1) * baseIntensity * 5}deg)
          `,
          filter: `hue-rotate(${animationOffset * baseIntensity * 10}deg)`
        };
      
      default:
        return {};
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={getFilterStyle()}
    >
      {children}
      
      <style jsx>{`
        @keyframes glitchEffect {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// Dynamic Gradient Component
interface DynamicGradientProps {
  colors?: string[];
  speed?: number;
  direction?: number;
  complexity?: number;
  className?: string;
}

export const DynamicGradient = ({
  colors = ['#ff0080', '#0080ff', '#80ff00'],
  speed = 1,
  direction = 45,
  complexity = 3,
  className = ''
}: DynamicGradientProps) => {
  const [gradientState, setGradientState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientState(prev => prev + speed);
    }, 50);

    return () => clearInterval(interval);
  }, [speed]);

  const generateGradient = () => {
    const time = gradientState * 0.01;
    const gradientStops = colors.map((color, index) => {
      const position = (Math.sin(time + index * 2) + 1) * 50;
      return `${color} ${position}%`;
    }).join(', ');

    const angle = direction + Math.sin(time * 0.5) * 30;
    
    return {
      backgroundImage: `
        linear-gradient(${angle}deg, ${gradientStops}),
        radial-gradient(circle at ${50 + Math.sin(time) * 20}% ${50 + Math.cos(time) * 20}%, 
          ${colors[0]}33, transparent 70%),
        conic-gradient(from ${time * 10}deg, ${colors.join('33, ')}33)
      `,
      backgroundBlendMode: 'screen, overlay, normal',
      backgroundSize: '400% 400%, 200% 200%, 100% 100%',
      backgroundPosition: `
        ${Math.sin(time * 0.3) * 50}% ${Math.cos(time * 0.3) * 50}%,
        ${Math.sin(time * 0.5) * 30}% ${Math.cos(time * 0.5) * 30}%,
        center
      `
    };
  };

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={generateGradient()}
    />
  );
};

// Atmospheric Lighting Component
interface AtmosphericLightingProps {
  intensity?: number;
  color?: string;
  animated?: boolean;
  type?: 'spotlight' | 'ambient' | 'directional';
  className?: string;
}

export const AtmosphericLighting = ({
  intensity = 0.5,
  color = '#4ade80',
  animated = true,
  type = 'ambient',
  className = ''
}: AtmosphericLightingProps) => {
  const [lightState, setLightState] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setLightState(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [animated]);

  const getLightingStyle = () => {
    const time = lightState * 0.02;
    const alpha = intensity * (0.5 + Math.sin(time) * 0.3);

    switch (type) {
      case 'spotlight':
        return {
          background: `radial-gradient(circle at ${50 + Math.sin(time) * 20}% ${50 + Math.cos(time) * 20}%, 
            ${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')} 0%, 
            transparent 50%)`,
          mixBlendMode: 'screen' as const
        };
      
      case 'directional':
        return {
          background: `linear-gradient(${time * 10}deg, 
            ${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')} 0%, 
            transparent 50%, 
            ${color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')} 100%)`,
          mixBlendMode: 'overlay' as const
        };
      
      default: // ambient
        return {
          backgroundColor: `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`,
          mixBlendMode: 'multiply' as const
        };
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={getLightingStyle()}
    />
  );
};

// Theme-aware Effects Container
export const ThemeVisualEffects = ({ children }: { children: React.ReactNode }) => {
  const { currentTheme } = useTheme();
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  // Detect if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEffectsEnabled(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setEffectsEnabled(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!effectsEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Particles */}
      <ParticleSystem
        count={30}
        speed={0.5}
        color={currentTheme.colors.primary}
        size={1}
        trail={true}
        interactive={false}
      />

      {/* Dynamic Gradient Background */}
      <DynamicGradient
        colors={[
          currentTheme.colors.primary + '10',
          currentTheme.colors.accent1 + '05',
          currentTheme.colors.accent2 + '08'
        ]}
        speed={0.3}
        complexity={2}
        className="opacity-20"
      />

      {/* Atmospheric Lighting */}
      <AtmosphericLighting
        color={currentTheme.colors.glow}
        intensity={0.1}
        type="ambient"
        animated={true}
      />

      {/* Content with shader effects */}
      <ShaderEffects
        effect="none"
        intensity={0.5}
        animated={false}
      >
        {children}
      </ShaderEffects>
    </div>
  );
};