'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'x' | 'y' | 'both';
  className?: string;
  depth?: number;
  style?: React.CSSProperties;
}

export const PixelParallaxLayer = ({ 
  children, 
  speed = 0.5, 
  direction = 'y',
  className = '',
  depth = 1,
  style = {}
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const scrollY = useMotionValue(0);
  
  const parallaxX = useTransform(
    direction === 'x' || direction === 'both' ? scrollY : mouseX,
    [0, clientHeight],
    [0, -speed * 100]
  );
  
  const parallaxY = useTransform(
    direction === 'y' || direction === 'both' ? scrollY : mouseY,
    [0, clientHeight],
    [0, -speed * 100]
  );
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const updateElementInfo = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setClientHeight(window.innerHeight);
    };
    
    updateElementInfo();
    window.addEventListener('resize', updateElementInfo);
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * speed;
      scrollY.set(rate);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set((e.clientX - centerX) * speed);
      mouseY.set((e.clientY - centerY) * speed);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', updateElementInfo);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speed, scrollY, mouseX, mouseY]);
  
  return (
    <motion.div
      ref={ref}
      className={`absolute ${className}`}
      style={{
        x: direction === 'x' || direction === 'both' ? parallaxX : 0,
        y: direction === 'y' || direction === 'both' ? parallaxY : 0,
        zIndex: Math.floor(depth * 10),
        imageRendering: 'pixelated',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

interface PixelCloudProps {
  count?: number;
  speed?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PixelClouds = ({ 
  count = 5, 
  speed = 0.3, 
  color = '#4ade80',
  size = 'md',
  className = ''
}: PixelCloudProps) => {
  const sizes = {
    sm: { width: 32, height: 16 },
    md: { width: 48, height: 24 },
    lg: { width: 64, height: 32 }
  };
  
  const cloudSize = sizes[size];
  
  const clouds = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 30 + 10,
    speed: speed + Math.random() * 0.2,
    opacity: 0.3 + Math.random() * 0.4
  }));
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {clouds.map((cloud) => (
        <PixelParallaxLayer
          key={cloud.id}
          speed={cloud.speed}
          direction="x"
          className="pointer-events-none"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            opacity: cloud.opacity
          }}
        >
          <PixelCloud 
            width={cloudSize.width} 
            height={cloudSize.height} 
            color={color} 
          />
        </PixelParallaxLayer>
      ))}
    </div>
  );
};

const PixelCloud = ({ 
  width, 
  height, 
  color 
}: { 
  width: number; 
  height: number; 
  color: string; 
}) => (
  <svg width={width} height={height} style={{ imageRendering: 'pixelated' }}>
    <path
      d={`M${width * 0.2} ${height * 0.6}h${width * 0.1}v${height * 0.2}h${width * 0.5}v-${height * 0.2}h${width * 0.1}v-${height * 0.2}h${width * 0.1}v-${height * 0.2}h-${width * 0.1}v-${height * 0.2}h-${width * 0.4}v${height * 0.2}h-${width * 0.1}v${height * 0.2}h-${width * 0.1}v${height * 0.2}z`}
      fill={color}
    />
  </svg>
);

interface PixelMountainsProps {
  layers?: number;
  colors?: string[];
  className?: string;
}

export const PixelMountains = ({ 
  layers = 3, 
  colors = ['#1f2937', '#374151', '#4b5563'],
  className = ''
}: PixelMountainsProps) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 ${className}`}>
      {Array.from({ length: layers }, (_, i) => (
        <PixelParallaxLayer
          key={i}
          speed={0.1 + i * 0.1}
          direction="x"
          depth={i}
          className="w-full"
          style={{ bottom: 0 }}
        >
          <PixelMountainLayer 
            color={colors[i] || colors[colors.length - 1]}
            height={100 + i * 50}
            peaks={5 + i * 2}
          />
        </PixelParallaxLayer>
      ))}
    </div>
  );
};

const PixelMountainLayer = ({ 
  color, 
  height, 
  peaks 
}: { 
  color: string; 
  height: number; 
  peaks: number; 
}) => {
  const points = Array.from({ length: peaks * 2 + 1 }, (_, i) => {
    const x = (i / (peaks * 2)) * 100;
    const y = i % 2 === 0 ? height : height - Math.random() * 50 - 20;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg 
      width="100%" 
      height={height} 
      className="w-full"
      style={{ imageRendering: 'pixelated' }}
      preserveAspectRatio="none"
    >
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={color}
      />
    </svg>
  );
};

interface PixelStarsProps {
  count?: number;
  colors?: string[];
  twinkle?: boolean;
  className?: string;
}

export const PixelStars = ({ 
  count = 50, 
  colors = ['#ffffff', '#4ade80', '#fbbf24'],
  twinkle = true,
  className = ''
}: PixelStarsProps) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 3 + 1,
    twinkleDelay: Math.random() * 2
  }));
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <PixelParallaxLayer
          key={star.id}
          speed={0.1}
          direction="both"
          className="pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`
          }}
        >
          <motion.div
            className="w-1 h-1"
            style={{
              backgroundColor: star.color,
              width: star.size,
              height: star.size,
              imageRendering: 'pixelated'
            }}
            animate={twinkle ? {
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            } : {}}
            transition={twinkle ? {
              duration: 2,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: 'easeInOut'
            } : {}}
          />
        </PixelParallaxLayer>
      ))}
    </div>
  );
};

interface PixelPlanetProps {
  size?: number;
  color?: string;
  ringColor?: string;
  hasRing?: boolean;
  rotation?: boolean;
  className?: string;
}

export const PixelPlanet = ({ 
  size = 64, 
  color = '#4ade80', 
  ringColor = '#fbbf24',
  hasRing = false,
  rotation = true,
  className = ''
}: PixelPlanetProps) => {
  return (
    <PixelParallaxLayer speed={0.05} direction="both" className={className}>
      <motion.div
        className="relative"
        animate={rotation ? { rotate: 360 } : {}}
        transition={rotation ? {
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        } : {}}
      >
        <svg width={size} height={size} style={{ imageRendering: 'pixelated' }}>
          {/* Planet body */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 4}
            fill={color}
          />
          
          {/* Planet details */}
          <rect
            x={size / 2 - size / 8}
            y={size / 2 - size / 12}
            width={size / 16}
            height={size / 16}
            fill="rgba(0,0,0,0.3)"
          />
          <rect
            x={size / 2 + size / 16}
            y={size / 2 - size / 8}
            width={size / 20}
            height={size / 20}
            fill="rgba(0,0,0,0.2)"
          />
          
          {/* Ring */}
          {hasRing && (
            <ellipse
              cx={size / 2}
              cy={size / 2}
              rx={size / 3}
              ry={size / 12}
              fill="none"
              stroke={ringColor}
              strokeWidth="2"
            />
          )}
        </svg>
      </motion.div>
    </PixelParallaxLayer>
  );
};

interface FloatingPixelDebrisProps {
  count?: number;
  colors?: string[];
  speed?: number;
  className?: string;
}

export const FloatingPixelDebris = ({ 
  count = 20, 
  colors = ['#4ade80', '#22c55e', '#16a34a'],
  speed = 0.2,
  className = ''
}: FloatingPixelDebrisProps) => {
  const debris = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 4 + 2,
    floatOffset: Math.random() * Math.PI * 2
  }));
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {debris.map((piece) => (
        <PixelParallaxLayer
          key={piece.id}
          speed={speed}
          direction="both"
          className="pointer-events-none"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`
          }}
        >
          <motion.div
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              imageRendering: 'pixelated'
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: piece.floatOffset,
              ease: 'easeInOut'
            }}
          />
        </PixelParallaxLayer>
      ))}
    </div>
  );
};

interface PixelParallaxContainerProps {
  children: React.ReactNode;
  height?: string;
  className?: string;
  mouseParallax?: boolean;
}

export const PixelParallaxContainer = ({ 
  children, 
  height = '100vh',
  className = '',
  mouseParallax = true
}: PixelParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseParallax || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  }, [mouseParallax, mouseX, mouseY]);
  
  useEffect(() => {
    if (!mouseParallax) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, mouseParallax]);
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height, imageRendering: 'pixelated' }}
    >
      {children}
    </div>
  );
};

// Preset Parallax Scenes

export const PixelSpaceScene = ({ className = '' }: { className?: string }) => (
  <PixelParallaxContainer className={className}>
    <PixelStars count={100} twinkle />
    <PixelPlanet 
      size={80} 
      color="#8b5cf6" 
      hasRing 
      className="absolute top-10 right-10" 
    />
    <PixelPlanet 
      size={40} 
      color="#ef4444" 
      className="absolute bottom-20 left-20" 
    />
    <FloatingPixelDebris count={15} colors={['#ffffff', '#a855f7', '#ec4899']} />
  </PixelParallaxContainer>
);

export const PixelLandscapeScene = ({ className = '' }: { className?: string }) => (
  <PixelParallaxContainer className={className}>
    <PixelStars count={30} colors={['#ffffff']} />
    <PixelClouds count={3} speed={0.1} />
    <PixelMountains 
      layers={4} 
      colors={['#1f2937', '#374151', '#4b5563', '#6b7280']} 
    />
  </PixelParallaxContainer>
);

export const PixelCyberScene = ({ className = '' }: { className?: string }) => (
  <PixelParallaxContainer className={className}>
    <FloatingPixelDebris 
      count={25} 
      colors={['#4ade80', '#22c55e', '#16a34a', '#0d9488']} 
      speed={0.3}
    />
    <PixelStars 
      count={40} 
      colors={['#4ade80', '#22c55e']} 
      twinkle 
    />
  </PixelParallaxContainer>
);