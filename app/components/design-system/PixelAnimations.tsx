'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';

interface PixelGlitchTextProps {
  text: string;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'auto' | 'manual';
  isActive?: boolean;
  className?: string;
}

export const PixelGlitchText = ({ 
  text, 
  duration = 0.5, 
  intensity = 'medium',
  trigger = 'hover',
  isActive = false,
  className = ''
}: PixelGlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchChars] = useState(['█', '▓', '▒', '░', '▄', '▀', '■', '□']);
  
  const intensitySettings = {
    low: { maxChars: 2, changeSpeed: 100 },
    medium: { maxChars: 4, changeSpeed: 50 },
    high: { maxChars: 8, changeSpeed: 25 }
  };

  const { maxChars, changeSpeed } = intensitySettings[intensity];

  useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), duration * 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [trigger, duration]);

  useEffect(() => {
    if (trigger === 'manual') {
      setIsGlitching(isActive);
    }
  }, [isActive, trigger]);

  const getGlitchedText = useCallback(() => {
    if (!isGlitching) return text;
    
    const chars = text.split('');
    const numGlitchChars = Math.min(maxChars, chars.length);
    const glitchPositions = Array.from({ length: numGlitchChars }, () => 
      Math.floor(Math.random() * chars.length)
    );
    
    glitchPositions.forEach(pos => {
      chars[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    });
    
    return chars.join('');
  }, [isGlitching, text, maxChars, glitchChars]);

  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (isGlitching) {
      const interval = setInterval(() => {
        setDisplayText(getGlitchedText());
      }, changeSpeed);
      
      setTimeout(() => {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }, duration * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isGlitching, getGlitchedText, changeSpeed, duration, text]);

  return (
    <motion.span
      className={`font-pixel inline-block ${className}`}
      onMouseEnter={() => trigger === 'hover' && setIsGlitching(true)}
      style={{
        imageRendering: 'pixelated',
        textShadow: isGlitching ? '2px 0 #ff0000, -2px 0 #00ff00' : 'none'
      }}
      animate={{
        x: isGlitching ? [0, -1, 1, 0] : 0,
        textShadow: isGlitching ? [
          '2px 0 #ff0000, -2px 0 #00ff00',
          '-2px 0 #ff0000, 2px 0 #00ff00',
          '2px 0 #ff0000, -2px 0 #00ff00'
        ] : 'none'
      }}
      transition={{
        duration: 0.1,
        repeat: isGlitching ? Infinity : 0
      }}
    >
      {displayText}
    </motion.span>
  );
};

// New Smooth Matrix Text Reveal Component
interface MatrixTextRevealProps {
  text: string;
  speed?: number;
  delay?: number;
  scrambleDuration?: number;
  className?: string;
  onComplete?: () => void;
}

export const MatrixTextReveal = ({
  text,
  speed = 80,
  delay = 0,
  scrambleDuration = 400,
  className = '',
  onComplete
}: MatrixTextRevealProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scrambleStates, setScrambleStates] = useState<boolean[]>([]);
  const [scrambleChars, setScrambleChars] = useState<string[]>([]);
  
  const matrixChars = useMemo(() => ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', '█', '▓', '▒', '░', 'サ', 'シ', 'ス', 'セ', 'ソ'], []);

  useEffect(() => {
    // Initialize scramble states and characters
    setScrambleStates(new Array(text.length).fill(false));
    setScrambleChars(new Array(text.length).fill(''));
  }, [text]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      const currentChar = text[currentIndex];
      
      // If current character is a space, just add it immediately without scrambling
      if (currentChar === ' ') {
        setDisplayText(prev => prev + ' ');
        setCurrentIndex(prev => prev + 1);
        return;
      }

      // Start scrambling the current character (only for non-space characters)
      setScrambleStates(prev => {
        const newStates = [...prev];
        newStates[currentIndex] = true;
        return newStates;
      });

      // Create scrambling animation for current character
      let scrambleCount = 0;
      const maxScrambles = Math.floor(scrambleDuration / 50); // Change character every 50ms
      
      const scrambleInterval = setInterval(() => {
        setScrambleChars(prev => {
          const newChars = [...prev];
          newChars[currentIndex] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          return newChars;
        });
        
        scrambleCount++;
        if (scrambleCount >= maxScrambles) {
          clearInterval(scrambleInterval);
          
          // Reveal the real character
          setDisplayText(prev => prev + text[currentIndex]);
          setScrambleStates(prev => {
            const newStates = [...prev];
            newStates[currentIndex] = false;
            return newStates;
          });
          setCurrentIndex(prev => prev + 1);
        }
      }, 50);

    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, scrambleDuration, onComplete, isComplete, matrixChars]);

  // Build the display text with proper character handling
  const buildDisplayText = () => {
    let result = '';
    
    // Add confirmed characters
    result += displayText;
    
    // Add scrambling character if currently scrambling (and it's not a space)
    if (currentIndex < text.length && scrambleStates[currentIndex] && text[currentIndex] !== ' ') {
      result += scrambleChars[currentIndex] || matrixChars[0];
    }
    
    return result;
  };

  const finalDisplayText = buildDisplayText();

  return (
    <motion.span 
      className={`font-pixel inline-block ${className}`}
      style={{ imageRendering: 'pixelated' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {finalDisplayText.split('').map((char, index) => {
        const isScrambling = index === currentIndex && scrambleStates[currentIndex] && char !== ' ';
        
        return (
          <motion.span
            key={`${index}-${char}`}
            className="inline-block"
            style={{
              color: isScrambling ? '#4ade80' : 'inherit',
              textShadow: isScrambling ? '0 0 8px rgba(74, 222, 128, 0.8)' : 'inherit',
              minWidth: char === ' ' ? '0.5em' : 'auto' // Ensure spaces have proper width
            }}
            animate={{
              opacity: isScrambling ? [0.4, 1, 0.4] : 1,
              scale: isScrambling ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: isScrambling ? 0.1 : 0,
              repeat: isScrambling ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {char === ' ' ? '\u00A0' : char} {/* Use non-breaking space for proper spacing */}
          </motion.span>
        );
      })}
      {!isComplete && (
        <motion.span
          className="inline-block ml-1 w-2 h-4 bg-green-400"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </motion.span>
  );
};

interface PixelTypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const PixelTypewriter = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  cursor = true,
  onComplete,
  className = ''
}: PixelTypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, onComplete, isComplete]);

  return (
    <span className={`font-mono ${className}`} style={{ imageRendering: 'pixelated' }}>
      {displayText}
      {cursor && (
        <motion.span
          className="inline-block ml-1 w-2 h-4 bg-retro-green"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </span>
  );
};

interface PixelParticleExplodeProps {
  children: React.ReactNode;
  trigger?: boolean;
  particleCount?: number;
  colors?: string[];
  duration?: number;
  onComplete?: () => void;
}

export const PixelParticleExplode = ({ 
  children, 
  trigger = false, 
  particleCount = 20,
  colors = ['#4ade80', '#22c55e', '#16a34a'],
  duration = 1,
  onComplete
}: PixelParticleExplodeProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    velocityX: number;
    velocityY: number;
  }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: (Math.random() - 0.5) * 200
      }));

      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration * 1000);
    }
  }, [trigger, particleCount, colors, duration, onComplete]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {children}
      
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              left: particle.x,
              top: particle.y,
              imageRendering: 'pixelated'
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: particle.velocityX,
              y: particle.velocityY,
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: duration,
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface PixelScanlineProps {
  height?: number;
  speed?: number;
  color?: string;
  opacity?: number;
  direction?: 'down' | 'up';
}

export const PixelScanline = ({ 
  height = 2, 
  speed = 2, 
  color = '#4ade80', 
  opacity = 0.6,
  direction = 'down'
}: PixelScanlineProps) => {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height: height,
        backgroundColor: color,
        opacity: opacity,
        boxShadow: `0 0 10px ${color}`,
        imageRendering: 'pixelated'
      }}
      animate={{
        y: direction === 'down' ? ['0%', '100vh'] : ['100vh', '0%']
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

interface PixelMatrixRainProps {
  characters?: string;
  columns?: number;
  speed?: number;
  color?: string;
  className?: string;
}

export const PixelMatrixRain = ({ 
  characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ',
  columns = 20,
  speed = 50,
  color = '#4ade80',
  className = ''
}: PixelMatrixRainProps) => {
  const [drops, setDrops] = useState<Array<{
    id: number;
    column: number;
    characters: string[];
    y: number;
    length: number;
  }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createDrop = () => {
      const length = Math.floor(Math.random() * 20) + 5;
      const chars = Array.from({ length }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      );
      
      return {
        id: Date.now() + Math.random(),
        column: Math.floor(Math.random() * columns),
        characters: chars,
        y: -length * 20,
        length
      };
    };

    const initialDrops = Array.from({ length: Math.floor(columns / 3) }, createDrop);
    setDrops(initialDrops);

    const interval = setInterval(() => {
      setDrops(prev => {
        const updated = prev.map(drop => ({
          ...drop,
          y: drop.y + 20
        })).filter(drop => drop.y < window.innerHeight);

        if (Math.random() < 0.3 && updated.length < columns) {
          updated.push(createDrop());
        }

        return updated;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [characters, columns, speed]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute font-mono text-sm"
          style={{
            left: `${(drop.column / columns) * 100}%`,
            color: color,
            imageRendering: 'pixelated'
          }}
          animate={{ y: drop.y }}
          transition={{ duration: 0 }}
        >
          {drop.characters.map((char, index) => (
            <motion.div
              key={index}
              style={{
                opacity: 1 - (index / drop.length) * 0.8
              }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

interface PixelPulseProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  speed?: number;
  className?: string;
}

export const PixelPulse = ({ 
  children, 
  color = '#4ade80', 
  size = 'md', 
  speed = 2,
  className = ''
}: PixelPulseProps) => {
  const sizes = {
    sm: 4,
    md: 8,
    lg: 12
  };

  const pulseSize = sizes[size];

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      
      {/* Pulse rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 rounded-full pointer-events-none"
          style={{
            borderColor: color,
            imageRendering: 'pixelated'
          }}
          animate={{
            scale: [1, 1.5 + i * 0.3],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};

interface PixelShakeProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: boolean;
  duration?: number;
  className?: string;
}

export const PixelShake = ({ 
  children, 
  intensity = 'medium', 
  trigger = false,
  duration = 0.5,
  className = ''
}: PixelShakeProps) => {
  const intensityValues = {
    low: 2,
    medium: 4,
    high: 8
  };

  const shakeAmount = intensityValues[intensity];

  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [0, -shakeAmount, shakeAmount, -shakeAmount, shakeAmount, 0],
        y: [0, shakeAmount, -shakeAmount, shakeAmount, -shakeAmount, 0]
      } : {}}
      transition={{
        duration: duration,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

interface PixelRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down' | 'center';
  duration?: number;
  delay?: number;
  className?: string;
}

export const PixelReveal = ({ 
  children, 
  direction = 'left', 
  duration = 0.6,
  delay = 0,
  className = ''
}: PixelRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    left: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 }
    },
    right: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 }
    },
    up: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    },
    down: {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    },
    center: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 }
    }
  };

  const variant = variants[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={variant.initial}
      animate={isInView ? variant.animate : variant.initial}
      transition={{
        duration: duration,
        delay: delay,
        ease: 'easeOut'
      }}
      style={{ imageRendering: 'pixelated' }}
    >
      {children}
    </motion.div>
  );
};

export const PixelCRTEffect = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* CRT scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74, 222, 128, 0.5) 2px, rgba(74, 222, 128, 0.5) 4px)',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* CRT screen curve */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '50px',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
          border: '2px solid rgba(74, 222, 128, 0.2)'
        }}
      />
    </div>
  );
};