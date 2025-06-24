'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PixelDensityConfig {
  basePixelSize: number;
  scaleFactor: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    ultrawide: number;
  };
  densityLevels: {
    low: number;
    medium: number;
    high: number;
    ultra: number;
  };
}

interface PixelDensityState {
  currentDensity: keyof PixelDensityConfig['densityLevels'];
  pixelSize: number;
  screenSize: keyof PixelDensityConfig['breakpoints'];
  dpr: number;
  adaptiveEnabled: boolean;
}

interface PixelDensityContextType {
  state: PixelDensityState;
  setDensity: (density: keyof PixelDensityConfig['densityLevels']) => void;
  toggleAdaptive: () => void;
  getPixelScale: (baseSize: number) => number;
  getResponsivePixelSize: (sizes: Partial<Record<keyof PixelDensityConfig['breakpoints'], number>>) => number;
}

const defaultConfig: PixelDensityConfig = {
  basePixelSize: 4,
  scaleFactor: 1,
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    ultrawide: 1920
  },
  densityLevels: {
    low: 0.75,
    medium: 1,
    high: 1.25,
    ultra: 1.5
  }
};

const PixelDensityContext = createContext<PixelDensityContextType | null>(null);

export const usePixelDensity = () => {
  const context = useContext(PixelDensityContext);
  if (!context) {
    throw new Error('usePixelDensity must be used within a PixelDensityProvider');
  }
  return context;
};

interface PixelDensityProviderProps {
  children: React.ReactNode;
  config?: Partial<PixelDensityConfig>;
}

export const PixelDensityProvider = ({ children, config = {} }: PixelDensityProviderProps) => {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  
  const [state, setState] = useState<PixelDensityState>({
    currentDensity: 'medium',
    pixelSize: mergedConfig.basePixelSize,
    screenSize: 'desktop',
    dpr: 1,
    adaptiveEnabled: true
  });

  const calculateScreenSize = useCallback((width: number): keyof PixelDensityConfig['breakpoints'] => {
    if (width < mergedConfig.breakpoints.mobile) return 'mobile';
    if (width < mergedConfig.breakpoints.tablet) return 'tablet';
    if (width < mergedConfig.breakpoints.desktop) return 'desktop';
    return 'ultrawide';
  }, [mergedConfig.breakpoints]);

  const updatePixelDensity = useCallback(() => {
    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    const screenSize = calculateScreenSize(width);
    
    let densityMultiplier = mergedConfig.densityLevels[state.currentDensity];
    
    if (state.adaptiveEnabled) {
      // Adaptive scaling based on screen size and DPR
      const screenMultiplier = {
        mobile: 0.8,
        tablet: 0.9,
        desktop: 1,
        ultrawide: 1.1
      }[screenSize];
      
      const dprMultiplier = Math.max(0.5, Math.min(2, dpr));
      densityMultiplier *= screenMultiplier * dprMultiplier;
    }
    
    const pixelSize = mergedConfig.basePixelSize * densityMultiplier;
    
    setState(prev => ({
      ...prev,
      pixelSize,
      screenSize,
      dpr
    }));
  }, [state.currentDensity, state.adaptiveEnabled, mergedConfig, calculateScreenSize]);

  useEffect(() => {
    updatePixelDensity();
    
    const handleResize = () => updatePixelDensity();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePixelDensity]);

  const setDensity = useCallback((density: keyof PixelDensityConfig['densityLevels']) => {
    setState(prev => ({ ...prev, currentDensity: density }));
  }, []);

  const toggleAdaptive = useCallback(() => {
    setState(prev => ({ ...prev, adaptiveEnabled: !prev.adaptiveEnabled }));
  }, []);

  const getPixelScale = useCallback((baseSize: number) => {
    return baseSize * (state.pixelSize / mergedConfig.basePixelSize);
  }, [state.pixelSize, mergedConfig.basePixelSize]);

  const getResponsivePixelSize = useCallback((
    sizes: Partial<Record<keyof PixelDensityConfig['breakpoints'], number>>
  ) => {
    const baseSize = sizes[state.screenSize] || sizes.desktop || mergedConfig.basePixelSize;
    return getPixelScale(baseSize);
  }, [state.screenSize, getPixelScale, mergedConfig.basePixelSize]);

  const contextValue: PixelDensityContextType = {
    state,
    setDensity,
    toggleAdaptive,
    getPixelScale,
    getResponsivePixelSize
  };

  return (
    <PixelDensityContext.Provider value={contextValue}>
      <div
        style={{
          '--pixel-size': `${state.pixelSize}px`,
          '--pixel-scale': state.pixelSize / mergedConfig.basePixelSize,
          '--screen-size': state.screenSize,
          '--pixel-dpr': state.dpr
        } as React.CSSProperties}
      >
        {children}
      </div>
    </PixelDensityContext.Provider>
  );
};

// Responsive Pixel Components

interface ResponsivePixelBoxProps {
  sizes?: Partial<Record<keyof PixelDensityConfig['breakpoints'], number>>;
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

export const ResponsivePixelBox = ({ 
  sizes = { mobile: 4, tablet: 6, desktop: 8, ultrawide: 10 },
  children,
  className = '',
  color = '#4ade80'
}: ResponsivePixelBoxProps) => {
  const { getResponsivePixelSize, state } = usePixelDensity();
  const pixelSize = getResponsivePixelSize(sizes);

  return (
    <motion.div
      className={`border-2 ${className}`}
      style={{
        width: pixelSize * 10,
        height: pixelSize * 10,
        borderColor: color,
        imageRendering: 'pixelated',
        borderWidth: Math.max(1, pixelSize / 4)
      }}
      animate={{ 
        borderWidth: Math.max(1, pixelSize / 4),
        width: pixelSize * 10,
        height: pixelSize * 10
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface AdaptivePixelTextProps {
  children: React.ReactNode;
  baseSize?: number;
  responsive?: boolean;
  className?: string;
}

export const AdaptivePixelText = ({ 
  children, 
  baseSize = 16, 
  responsive = true,
  className = ''
}: AdaptivePixelTextProps) => {
  const { getPixelScale, state } = usePixelDensity();
  
  const fontSize = responsive ? getPixelScale(baseSize) : baseSize;
  const responsiveMultiplier = {
    mobile: 0.85,
    tablet: 0.95,
    desktop: 1,
    ultrawide: 1.1
  }[state.screenSize];

  return (
    <motion.span
      className={`font-pixel ${className}`}
      style={{
        fontSize: fontSize * responsiveMultiplier,
        imageRendering: 'pixelated',
        lineHeight: 1.2
      }}
      animate={{ fontSize: fontSize * responsiveMultiplier }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
};

interface PixelGridProps {
  size?: number;
  color?: string;
  opacity?: number;
  adaptive?: boolean;
  className?: string;
}

export const PixelGrid = ({ 
  size = 20, 
  color = '#4ade80', 
  opacity = 0.1,
  adaptive = true,
  className = ''
}: PixelGridProps) => {
  const { getPixelScale, state } = usePixelDensity();
  const gridSize = adaptive ? getPixelScale(size) : size;

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        opacity: opacity,
        imageRendering: 'pixelated'
      }}
    />
  );
};

interface DensityControlPanelProps {
  className?: string;
  showGrid?: boolean;
}

export const DensityControlPanel = ({ className = '', showGrid = true }: DensityControlPanelProps) => {
  const { state, setDensity, toggleAdaptive } = usePixelDensity();

  const densityLabels = {
    low: 'Low (75%)',
    medium: 'Medium (100%)',
    high: 'High (125%)',
    ultra: 'Ultra (150%)'
  };

  return (
    <motion.div
      className={`
        fixed top-4 right-4 z-50 bg-gray-900 border-2 border-retro-green
        p-4 rounded-none font-mono text-sm ${className}
      `}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ imageRendering: 'pixelated' }}
    >
      <div className="text-retro-green mb-3 font-pixel text-xs">
        PIXEL DENSITY
      </div>
      
      <div className="space-y-2">
        {Object.entries(densityLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setDensity(key as keyof typeof densityLabels)}
            className={`
              block w-full text-left px-2 py-1 border transition-colors
              ${state.currentDensity === key 
                ? 'bg-retro-green text-black border-retro-green' 
                : 'bg-transparent text-retro-green border-gray-600 hover:border-retro-green'
              }
            `}
            style={{ imageRendering: 'pixelated' }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.adaptiveEnabled}
            onChange={toggleAdaptive}
            className="w-3 h-3"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-xs">Adaptive Scaling</span>
        </label>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">
        <div>Screen: {state.screenSize}</div>
        <div>DPR: {state.dpr.toFixed(1)}</div>
        <div>Pixel Size: {state.pixelSize.toFixed(1)}px</div>
      </div>

      {showGrid && <PixelGrid size={20} opacity={0.05} />}
    </motion.div>
  );
};

interface PixelArtScalerProps {
  src: string;
  alt: string;
  baseWidth: number;
  baseHeight: number;
  scalingMode?: 'nearest' | 'smooth';
  className?: string;
}

export const PixelArtScaler = ({ 
  src, 
  alt, 
  baseWidth, 
  baseHeight,
  scalingMode = 'nearest',
  className = ''
}: PixelArtScalerProps) => {
  const { getPixelScale, state } = usePixelDensity();
  const scale = getPixelScale(1);

  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        imageRendering: scalingMode === 'nearest' ? 'pixelated' : 'auto'
      } as React.CSSProperties}
      animate={{ 
        width: scaledWidth, 
        height: scaledHeight 
      }}
      transition={{ duration: 0.3 }}
    />
  );
};

// Utility Hooks

export const useResponsivePixelValue = (
  values: Partial<Record<keyof PixelDensityConfig['breakpoints'], number>>,
  defaultValue: number = 16
) => {
  const { state, getPixelScale } = usePixelDensity();
  const baseValue = values[state.screenSize] || defaultValue;
  return getPixelScale(baseValue);
};

export const usePixelBreakpoint = () => {
  const { state } = usePixelDensity();
  return {
    isMobile: state.screenSize === 'mobile',
    isTablet: state.screenSize === 'tablet',
    isDesktop: state.screenSize === 'desktop',
    isUltrawide: state.screenSize === 'ultrawide',
    screenSize: state.screenSize
  };
};

export const useAdaptivePixelSize = (baseSize: number) => {
  const { getPixelScale } = usePixelDensity();
  return getPixelScale(baseSize);
};