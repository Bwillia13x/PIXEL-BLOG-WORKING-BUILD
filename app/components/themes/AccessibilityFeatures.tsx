'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { PixelButton, PixelCard, PixelToggle } from '../design-system/PixelMicroInteractions';
import { PixelIconLibrary } from '../design-system/PixelIcons';

// Color blindness simulation filters
const COLOR_BLINDNESS_FILTERS = {
  normal: {
    name: 'Normal Vision',
    filter: 'none'
  },
  protanopia: {
    name: 'Protanopia (Red-blind)',
    filter: `
      <svg style="position: absolute; width: 0; height: 0">
        <filter id="protanopia">
          <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
        </filter>
      </svg>
    `,
    css: 'url(#protanopia)'
  },
  deuteranopia: {
    name: 'Deuteranopia (Green-blind)',
    filter: `
      <svg style="position: absolute; width: 0; height: 0">
        <filter id="deuteranopia">
          <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
        </filter>
      </svg>
    `,
    css: 'url(#deuteranopia)'
  },
  tritanopia: {
    name: 'Tritanopia (Blue-blind)',
    filter: `
      <svg style="position: absolute; width: 0; height: 0">
        <filter id="tritanopia">
          <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
        </filter>
      </svg>
    `,
    css: 'url(#tritanopia)'
  },
  achromatopsia: {
    name: 'Achromatopsia (Total color blindness)',
    filter: `
      <svg style="position: absolute; width: 0; height: 0">
        <filter id="achromatopsia">
          <feColorMatrix values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0"/>
        </filter>
      </svg>
    `,
    css: 'url(#achromatopsia)'
  }
};

// Contrast calculation utility
const calculateContrast = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const toLinear = (val: number) => 
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Color adjustment utilities
const adjustColor = (color: string, adjustment: { brightness?: number; contrast?: number; saturation?: number }) => {
  // This is a simplified version - in reality you'd want a more sophisticated color manipulation library
  const { brightness = 1, contrast = 1, saturation = 1 } = adjustment;
  
  // Convert to HSL, adjust, convert back
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Simple brightness adjustment
  const adjustedR = Math.min(255, Math.max(0, Math.round(r * 255 * brightness)));
  const adjustedG = Math.min(255, Math.max(0, Math.round(g * 255 * brightness)));
  const adjustedB = Math.min(255, Math.max(0, Math.round(b * 255 * brightness)));

  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
};

// Slider component
const AccessibilitySlider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  unit = '',
  className = '' 
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-mono text-gray-400">{label}</label>
        <span className="text-xs font-mono text-white">{value}{unit}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider"
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #4ade80;
            cursor: pointer;
            border: 2px solid #000;
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #4ade80;
            cursor: pointer;
            border: 2px solid #000;
            border-radius: 0;
          }
        `}</style>
      </div>
    </div>
  );
};

// Contrast checker component
const ContrastChecker = ({ foreground, background }: { foreground: string; background: string }) => {
  const contrast = calculateContrast(foreground, background);
  const aaCompliant = contrast >= 4.5;
  const aaaCompliant = contrast >= 7;

  return (
    <div className="bg-gray-800 p-3 border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-400">Contrast Ratio</span>
        <span className="text-sm font-mono text-white">{contrast.toFixed(2)}:1</span>
      </div>
      
      <div className="flex gap-2 text-xs">
        <span className={`px-2 py-1 ${aaCompliant ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          AA {aaCompliant ? '✓' : '✗'}
        </span>
        <span className={`px-2 py-1 ${aaaCompliant ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          AAA {aaaCompliant ? '✓' : '✗'}
        </span>
      </div>
      
      <div 
        className="mt-3 p-2 border border-gray-600"
        style={{ backgroundColor: background, color: foreground }}
      >
        <div className="text-sm">Sample text</div>
        <div className="text-xs">Small text example</div>
      </div>
    </div>
  );
};

// Main accessibility panel component
export const AccessibilityPanel = () => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Accessibility settings
  const [colorBlindnessFilter, setColorBlindnessFilter] = useState<keyof typeof COLOR_BLINDNESS_FILTERS>('normal');
  const [textScale, setTextScale] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(true);
  
  const rootRef = useRef<HTMLElement | null>(null);

  // Initialize root reference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      rootRef.current = document.documentElement;
    }
  }, []);

  // Apply accessibility settings
  const applyAccessibilitySettings = useCallback(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;

    // Text scaling
    root.style.setProperty('--accessibility-text-scale', `${textScale / 100}`);

    // Visual adjustments
    const filterParts = [];
    
    if (brightness !== 100) {
      filterParts.push(`brightness(${brightness / 100})`);
    }
    if (contrast !== 100) {
      filterParts.push(`contrast(${contrast / 100})`);
    }
    if (saturation !== 100) {
      filterParts.push(`saturate(${saturation / 100})`);
    }

    // Color blindness filter
    if (colorBlindnessFilter !== 'normal') {
      filterParts.push(COLOR_BLINDNESS_FILTERS[colorBlindnessFilter].css);
    }

    const filterString = filterParts.join(' ');
    root.style.setProperty('--accessibility-filter', filterString);

    // High contrast mode
    if (highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus indicators
    if (focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, [textScale, brightness, contrast, saturation, colorBlindnessFilter, highContrast, reducedMotion, focusIndicators]);

  // Apply settings when they change
  useEffect(() => {
    applyAccessibilitySettings();
  }, [applyAccessibilitySettings]);

  // Load saved settings
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setTextScale(settings.textScale || 100);
        setBrightness(settings.brightness || 100);
        setContrast(settings.contrast || 100);
        setSaturation(settings.saturation || 100);
        setColorBlindnessFilter(settings.colorBlindnessFilter || 'normal');
        setHighContrast(settings.highContrast || false);
        setReducedMotion(settings.reducedMotion || false);
        setFocusIndicators(settings.focusIndicators !== false);
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }

    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion) setReducedMotion(true);
    if (prefersHighContrast) setHighContrast(true);
  }, []);

  // Save settings
  useEffect(() => {
    const settings = {
      textScale,
      brightness,
      contrast,
      saturation,
      colorBlindnessFilter,
      highContrast,
      reducedMotion,
      focusIndicators
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [textScale, brightness, contrast, saturation, colorBlindnessFilter, highContrast, reducedMotion, focusIndicators]);

  // Reset to defaults
  const resetToDefaults = () => {
    setTextScale(100);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setColorBlindnessFilter('normal');
    setHighContrast(false);
    setReducedMotion(false);
    setFocusIndicators(true);
  };

  return (
    <>
      {/* Accessibility Toggle */}
      <motion.button
        className="fixed top-4 right-28 z-50 bg-gray-900 border-2 border-gray-600 p-2 hover:border-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Accessibility Options"
      >
        <PixelIconLibrary.User size={20} animate />
      </motion.button>

      {/* Color blindness filter SVGs */}
      <div dangerouslySetInnerHTML={{ 
        __html: Object.values(COLOR_BLINDNESS_FILTERS)
          .filter(filter => filter.filter !== 'none')
          .map(filter => filter.filter)
          .join('')
      }} />

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-80 bg-gray-950 border-l-2 border-gray-600 z-40 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-pixel text-white">ACCESSIBILITY</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 transition-colors"
                >
                  <PixelIconLibrary.Close size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Customize visual and interaction preferences
              </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              
              {/* Vision Assistance */}
              <section>
                <h3 className="text-sm font-pixel text-white mb-3">VISION</h3>
                
                {/* Color Blindness Simulation */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs font-mono text-gray-400">Color Vision</label>
                  <select
                    value={colorBlindnessFilter}
                    onChange={(e) => setColorBlindnessFilter(e.target.value as keyof typeof COLOR_BLINDNESS_FILTERS)}
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-mono text-xs"
                  >
                    {Object.entries(COLOR_BLINDNESS_FILTERS).map(([key, filter]) => (
                      <option key={key} value={key}>{filter.name}</option>
                    ))}
                  </select>
                </div>

                {/* Text Scaling */}
                <AccessibilitySlider
                  label="Text Scale"
                  value={textScale}
                  onChange={setTextScale}
                  min={75}
                  max={200}
                  step={5}
                  unit="%"
                  className="mb-4"
                />

                {/* Visual Adjustments */}
                <AccessibilitySlider
                  label="Brightness"
                  value={brightness}
                  onChange={setBrightness}
                  min={50}
                  max={150}
                  step={5}
                  unit="%"
                  className="mb-4"
                />

                <AccessibilitySlider
                  label="Contrast"
                  value={contrast}
                  onChange={setContrast}
                  min={50}
                  max={200}
                  step={5}
                  unit="%"
                  className="mb-4"
                />

                <AccessibilitySlider
                  label="Saturation"
                  value={saturation}
                  onChange={setSaturation}
                  min={0}
                  max={200}
                  step={5}
                  unit="%"
                />
              </section>

              {/* Interaction Preferences */}
              <section>
                <h3 className="text-sm font-pixel text-white mb-3">INTERACTION</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">High Contrast</span>
                    <PixelToggle
                      checked={highContrast}
                      onChange={setHighContrast}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">Reduced Motion</span>
                    <PixelToggle
                      checked={reducedMotion}
                      onChange={setReducedMotion}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">Enhanced Focus</span>
                    <PixelToggle
                      checked={focusIndicators}
                      onChange={setFocusIndicators}
                      size="sm"
                    />
                  </div>
                </div>
              </section>

              {/* Contrast Checker */}
              <section>
                <h3 className="text-sm font-pixel text-white mb-3">CONTRAST CHECK</h3>
                <ContrastChecker
                  foreground={currentTheme.colors.text}
                  background={currentTheme.colors.background}
                />
              </section>

              {/* Actions */}
              <section className="pt-4 border-t border-gray-700">
                <PixelButton
                  variant="ghost"
                  size="sm"
                  onClick={resetToDefaults}
                  className="w-full"
                >
                  Reset to Defaults
                </PixelButton>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global accessibility styles */}
      <style jsx global>{`
        :root {
          --accessibility-text-scale: 1;
          --accessibility-filter: none;
        }

        body {
          filter: var(--accessibility-filter);
        }

        .high-contrast-mode {
          --theme-background: #000000 !important;
          --theme-text: #ffffff !important;
          --theme-primary: #ffff00 !important;
          --theme-border: #ffffff !important;
        }

        .enhanced-focus *:focus-visible {
          outline: 3px solid #ffff00 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 6px rgba(255, 255, 0, 0.3) !important;
        }

        /* Text scaling */
        body * {
          font-size: calc(1em * var(--accessibility-text-scale)) !important;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .reduce-motion,
          .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
};