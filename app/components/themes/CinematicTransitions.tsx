'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeConfig } from '@/app/lib/themes';

// Transition types
type TransitionType = 
  | 'morph' 
  | 'shatter' 
  | 'liquid' 
  | 'portal' 
  | 'matrix' 
  | 'pixel-explosion' 
  | 'wave' 
  | 'glitch';

interface TransitionState {
  isTransitioning: boolean;
  type: TransitionType;
  progress: number;
  fromTheme: ThemeConfig | null;
  toTheme: ThemeConfig | null;
}

// Color interpolation utility
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Morph transition effect
const MorphTransition = ({ progress, fromTheme, toTheme }: {
  progress: number;
  fromTheme: ThemeConfig;
  toTheme: ThemeConfig;
}) => {
  const morphedColors = Object.keys(fromTheme.colors).reduce((acc, key) => {
    const colorKey = key as keyof typeof fromTheme.colors;
    acc[colorKey] = interpolateColor(
      fromTheme.colors[colorKey],
      toTheme.colors[colorKey],
      progress
    );
    return acc;
  }, {} as any);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(morphedColors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value as string);
    });
  }, [morphedColors]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 0 ? 1 : 0 }}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${morphedColors.primary}20 0%, transparent 70%)`,
        mixBlendMode: 'overlay'
      }}
    />
  );
};

// Shatter transition effect
const ShatterTransition = ({ progress }: { progress: number }) => {
  const fragments = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5
  }));

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden">
      {fragments.map((fragment) => (
        <motion.div
          key={fragment.id}
          className="absolute w-20 h-20 bg-current opacity-80"
          style={{
            left: `${fragment.x}%`,
            top: `${fragment.y}%`,
            clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 80%)'
          }}
          animate={{
            x: progress > 0.5 ? (Math.random() - 0.5) * 200 : 0,
            y: progress > 0.5 ? (Math.random() - 0.5) * 200 : 0,
            rotate: fragment.rotation * progress,
            scale: fragment.scale * (1 - progress),
            opacity: 1 - progress
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );
};

// Liquid transition effect
const LiquidTransition = ({ progress, toTheme }: { progress: number; toTheme: ThemeConfig }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      style={{
        background: `radial-gradient(circle at ${50 + Math.sin(progress * Math.PI * 4) * 20}% ${50 + Math.cos(progress * Math.PI * 3) * 20}%, 
          ${toTheme.colors.primary} 0%, 
          ${toTheme.colors.primaryHover} 30%, 
          ${toTheme.colors.background} 70%)`
      }}
      animate={{
        scale: progress > 0 ? [0, 1.2, 1] : 0,
        opacity: progress > 0.8 ? 1 - (progress - 0.8) * 5 : 1
      }}
      transition={{
        duration: 1.2,
        ease: 'easeInOut'
      }}
    />
  );
};

// Portal transition effect
const PortalTransition = ({ progress, toTheme }: { progress: number; toTheme: ThemeConfig }) => {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{
          scale: progress * 50,
          rotate: progress * 720
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut'
        }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{
            background: `conic-gradient(${toTheme.colors.primary}, ${toTheme.colors.accent1}, ${toTheme.colors.accent2}, ${toTheme.colors.primary})`,
            boxShadow: `0 0 20px ${toTheme.colors.primary}, 0 0 40px ${toTheme.colors.primary}, 0 0 60px ${toTheme.colors.primary}`
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Matrix transition effect
const MatrixTransition = ({ progress }: { progress: number }) => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only generate random characters on client
    setCharacters(
      Array.from({ length: 50 }, () => String.fromCharCode(0x30A0 + Math.random() * 96))
    );
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-50 overflow-hidden bg-black" />
  }

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-green-400 whitespace-pre text-sm"
          style={{
            left: `${(i * 5) % 100}%`,
            top: -100
          }}
          animate={{
            y: progress * (typeof window !== 'undefined' ? window.innerHeight + 200 : 800),
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: 'linear'
          }}
        >
          {characters.slice(i * 2, i * 2 + 10).join('\n')}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Pixel explosion transition
const PixelExplosionTransition = ({ progress, fromTheme }: { progress: number; fromTheme: ThemeConfig }) => {
  const [pixels, setPixels] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    velocity: number;
  }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only generate random pixels on client
    if (typeof window !== 'undefined') {
      setPixels(
        Array.from({ length: 100 }, (_, i) => ({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 8 + 4,
          velocity: Math.random() * 200 + 100
        }))
      );
    }
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-50 overflow-hidden" />
  }

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden">
      {pixels.map((pixel) => (
        <motion.div
          key={pixel.id}
          className="absolute"
          style={{
            width: pixel.size,
            height: pixel.size,
            backgroundColor: fromTheme.colors.primary,
            left: pixel.x,
            top: pixel.y
          }}
          animate={{
            x: (Math.random() - 0.5) * pixel.velocity * progress,
            y: (Math.random() - 0.5) * pixel.velocity * progress,
            scale: 1 - progress,
            opacity: 1 - progress
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );
};

// Wave transition effect
const WaveTransition = ({ progress, toTheme }: { progress: number; toTheme: ThemeConfig }) => {
  return (
    <motion.div className="fixed inset-0 z-50">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={`M 0 50 Q 25 ${20 + Math.sin(progress * Math.PI) * 30} 50 50 T 100 50 V 100 H 0 V 50`}
          fill={toTheme.colors.primary}
          animate={{
            d: [
              "M 0 50 Q 25 50 50 50 T 100 50 V 100 H 0 V 50",
              "M 0 50 Q 25 20 50 50 T 100 50 V 100 H 0 V 50",
              "M 0 50 Q 25 80 50 50 T 100 50 V 100 H 0 V 50",
              "M 0 0 Q 25 0 50 0 T 100 0 V 100 H 0 V 0"
            ]
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut'
          }}
        />
      </svg>
    </motion.div>
  );
};

// Glitch transition effect
const GlitchTransition = ({ progress }: { progress: number }) => {
  const [glitchBars] = useState(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      height: Math.random() * 20 + 5,
      delay: Math.random() * 0.5
    }))
  );

  return (
    <motion.div className="fixed inset-0 z-50 bg-black">
      {glitchBars.map((bar, i) => (
        <motion.div
          key={bar.id}
          className="absolute w-full bg-white mix-blend-difference"
          style={{
            height: `${bar.height}%`,
            top: `${i * 10}%`
          }}
          animate={{
            x: progress > 0 ? [0, -100, 100, -50, 0] : 0,
            opacity: progress > 0 ? [1, 0, 1, 0, 1] : 0
          }}
          transition={{
            duration: 0.6,
            delay: bar.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  );
};

// Main transition manager
export const CinematicTransitionManager = () => {
  const { currentTheme, isTransitioning } = useTheme();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    type: 'morph',
    progress: 0,
    fromTheme: null,
    toTheme: null
  });

  const previousThemeRef = useRef<ThemeConfig>(currentTheme);
  const animationRef = useRef<number>(0);

  // Detect theme changes and trigger transitions
  useEffect(() => {
    if (currentTheme.id !== previousThemeRef.current.id) {
      // Start transition
      setTransitionState({
        isTransitioning: true,
        type: getRandomTransitionType(),
        progress: 0,
        fromTheme: previousThemeRef.current,
        toTheme: currentTheme
      });

      // Animate transition - use performance.now() instead of Date.now() for better precision
      const startTime = performance.now();
      const duration = 1500; // 1.5 seconds

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setTransitionState(prev => ({
          ...prev,
          progress
        }));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // End transition
          setTransitionState(prev => ({
            ...prev,
            isTransitioning: false,
            progress: 0
          }));
          previousThemeRef.current = currentTheme;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme]);

  // Get random transition type
  const getRandomTransitionType = (): TransitionType => {
    const types: TransitionType[] = [
      'morph',
      'shatter', 
      'liquid',
      'portal',
      'matrix',
      'pixel-explosion',
      'wave',
      'glitch'
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Render transition effect
  const renderTransition = () => {
    if (!transitionState.isTransitioning || !transitionState.fromTheme || !transitionState.toTheme) {
      return null;
    }

    const { type, progress, fromTheme, toTheme } = transitionState;

    switch (type) {
      case 'morph':
        return <MorphTransition progress={progress} fromTheme={fromTheme} toTheme={toTheme} />;
      case 'shatter':
        return <ShatterTransition progress={progress} />;
      case 'liquid':
        return <LiquidTransition progress={progress} toTheme={toTheme} />;
      case 'portal':
        return <PortalTransition progress={progress} toTheme={toTheme} />;
      case 'matrix':
        return <MatrixTransition progress={progress} />;
      case 'pixel-explosion':
        return <PixelExplosionTransition progress={progress} fromTheme={fromTheme} />;
      case 'wave':
        return <WaveTransition progress={progress} toTheme={toTheme} />;
      case 'glitch':
        return <GlitchTransition progress={progress} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {transitionState.isTransitioning && renderTransition()}
    </AnimatePresence>
  );
};

// Hook for manual transition control
export const useThemeTransition = () => {
  const [transitionType, setTransitionType] = useState<TransitionType>('morph');
  
  return {
    transitionType,
    setTransitionType,
    availableTransitions: [
      'morph',
      'shatter',
      'liquid',
      'portal',
      'matrix',
      'pixel-explosion',
      'wave',
      'glitch'
    ] as TransitionType[]
  };
};

// Transition settings component
export const TransitionSettings = () => {
  const { transitionType, setTransitionType, availableTransitions } = useThemeTransition();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.button
        className="bg-gray-900 border-2 border-gray-600 p-3 hover:border-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xs font-pixel text-white">FX</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 bg-gray-950 border-2 border-gray-600 p-4 min-w-48"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h3 className="text-sm font-pixel text-white mb-3">TRANSITIONS</h3>
            <div className="space-y-2">
              {availableTransitions.map((type) => (
                <button
                  key={type}
                  onClick={() => setTransitionType(type)}
                  className={`block w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                    transitionType === type
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};