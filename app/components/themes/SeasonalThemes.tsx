'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeConfig, ThemeColors } from '@/app/lib/themes';

interface SeasonalTheme extends ThemeConfig {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  timeVariations?: {
    dawn?: Partial<ThemeColors>;
    day?: Partial<ThemeColors>;
    dusk?: Partial<ThemeColors>;
    night?: Partial<ThemeColors>;
  };
}

// Seasonal theme definitions
const SEASONAL_THEMES: SeasonalTheme[] = [
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    description: 'Fresh green tones with blooming cherry blossom accents',
    season: 'spring',
    dateRange: {
      start: { month: 3, day: 20 }, // March 20
      end: { month: 6, day: 20 }    // June 20
    },
    colors: {
      primary: '#66bb6a',
      primaryHover: '#4caf50',
      primaryFocus: '#81c784',
      
      background: '#0d1f0d',
      backgroundSecondary: '#1a2e1a',
      backgroundTertiary: '#263f26',
      backgroundOverlay: 'rgba(13, 31, 13, 0.9)',
      
      surface: '#1e3f1e',
      surfaceHover: '#2e5f2e',
      surfaceActive: '#3e6f3e',
      
      text: '#a5d6a7',
      textSecondary: '#81c784',
      textTertiary: '#66bb6a',
      textInverse: '#0d1f0d',
      
      border: '#66bb6a',
      borderSecondary: '#4caf50',
      borderAccent: '#ffb3ba',
      
      success: '#4caf50',
      warning: '#ffeb3b',
      error: '#e57373',
      info: '#64b5f6',
      
      accent1: '#ffb3ba', // cherry blossom
      accent2: '#ff9999',
      accent3: '#98fb98',
      
      glow: '#66bb6a',
      shadow: 'rgba(102, 187, 106, 0.3)',
      gradient: 'linear-gradient(135deg, #0d1f0d 0%, #1a3f1a 100%)'
    },
    timeVariations: {
      dawn: {
        primary: '#ffb3ba',
        accent1: '#ffd1dc',
        glow: '#ffb3ba'
      },
      day: {
        primary: '#66bb6a',
        background: '#0f1f0f'
      },
      dusk: {
        primary: '#ff9999',
        background: '#1f0f1f',
        accent1: '#ff6b6b'
      },
      night: {
        primary: '#4a5d4a',
        background: '#0a1a0a'
      }
    },
    fonts: {
      primary: 'JetBrains Mono, monospace',
      secondary: 'Nunito Sans, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: false,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 12.5,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Seasonal System',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['seasonal', 'spring', 'nature', 'bloom']
    }
  },
  
  {
    id: 'summer-heat',
    name: 'Summer Heat',
    description: 'Warm orange and yellow tones with vibrant sunset colors',
    season: 'summer',
    dateRange: {
      start: { month: 6, day: 21 },
      end: { month: 9, day: 22 }
    },
    colors: {
      primary: '#ff9800',
      primaryHover: '#f57c00',
      primaryFocus: '#ffb74d',
      
      background: '#1f1008',
      backgroundSecondary: '#2f1f10',
      backgroundTertiary: '#3f2f18',
      backgroundOverlay: 'rgba(31, 16, 8, 0.9)',
      
      surface: '#4f3f20',
      surfaceHover: '#5f4f30',
      surfaceActive: '#6f5f40',
      
      text: '#ffcc80',
      textSecondary: '#ffb74d',
      textTertiary: '#ff9800',
      textInverse: '#1f1008',
      
      border: '#ff9800',
      borderSecondary: '#f57c00',
      borderAccent: '#ff5722',
      
      success: '#4caf50',
      warning: '#ffc107',
      error: '#f44336',
      info: '#2196f3',
      
      accent1: '#ff5722',
      accent2: '#ffeb3b',
      accent3: '#ff6f00',
      
      glow: '#ff9800',
      shadow: 'rgba(255, 152, 0, 0.4)',
      gradient: 'linear-gradient(135deg, #1f1008 0%, #3f2008 100%)'
    },
    timeVariations: {
      dawn: {
        primary: '#ffeb3b',
        accent1: '#ffc107'
      },
      day: {
        primary: '#ff9800',
        background: '#2f1008'
      },
      dusk: {
        primary: '#ff5722',
        background: '#2f0808',
        accent1: '#d32f2f'
      },
      night: {
        primary: '#bf360c',
        background: '#1a0a0a'
      }
    },
    fonts: {
      primary: 'JetBrains Mono, monospace',
      secondary: 'Roboto, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: false,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 11.8,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Seasonal System',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['seasonal', 'summer', 'warm', 'sunset']
    }
  },
  
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    description: 'Rich amber and red tones with golden accents',
    season: 'autumn',
    dateRange: {
      start: { month: 9, day: 23 },
      end: { month: 12, day: 20 }
    },
    colors: {
      primary: '#d84315',
      primaryHover: '#bf360c',
      primaryFocus: '#ff5722',
      
      background: '#1a0f08',
      backgroundSecondary: '#2a1a10',
      backgroundTertiary: '#3a2a18',
      backgroundOverlay: 'rgba(26, 15, 8, 0.9)',
      
      surface: '#4a3a20',
      surfaceHover: '#5a4a30',
      surfaceActive: '#6a5a40',
      
      text: '#ffab91',
      textSecondary: '#ff8a65',
      textTertiary: '#ff7043',
      textInverse: '#1a0f08',
      
      border: '#d84315',
      borderSecondary: '#bf360c',
      borderAccent: '#ff9800',
      
      success: '#689f38',
      warning: '#f57c00',
      error: '#d32f2f',
      info: '#1976d2',
      
      accent1: '#ff9800',
      accent2: '#ffc107',
      accent3: '#8d6e63',
      
      glow: '#d84315',
      shadow: 'rgba(216, 67, 21, 0.3)',
      gradient: 'linear-gradient(135deg, #1a0f08 0%, #3a1a08 100%)'
    },
    timeVariations: {
      dawn: {
        primary: '#ffc107',
        accent1: '#ffeb3b'
      },
      day: {
        primary: '#d84315',
        background: '#2a0f08'
      },
      dusk: {
        primary: '#bf360c',
        background: '#2a0808'
      },
      night: {
        primary: '#8d4004',
        background: '#1a0808'
      }
    },
    fonts: {
      primary: 'JetBrains Mono, monospace',
      secondary: 'Merriweather, serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: false,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 13.2,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Seasonal System',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['seasonal', 'autumn', 'warm', 'harvest']
    }
  },
  
  {
    id: 'winter-frost',
    name: 'Winter Frost',
    description: 'Cool blue and white tones with icy crystalline effects',
    season: 'winter',
    dateRange: {
      start: { month: 12, day: 21 },
      end: { month: 3, day: 19 }
    },
    colors: {
      primary: '#42a5f5',
      primaryHover: '#1e88e5',
      primaryFocus: '#64b5f6',
      
      background: '#0a0f1a',
      backgroundSecondary: '#0f1525',
      backgroundTertiary: '#152030',
      backgroundOverlay: 'rgba(10, 15, 26, 0.9)',
      
      surface: '#1a2530',
      surfaceHover: '#253040',
      surfaceActive: '#303a50',
      
      text: '#b3e5fc',
      textSecondary: '#81d4fa',
      textTertiary: '#4fc3f7',
      textInverse: '#0a0f1a',
      
      border: '#42a5f5',
      borderSecondary: '#1e88e5',
      borderAccent: '#e1f5fe',
      
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      
      accent1: '#e1f5fe',
      accent2: '#b3e5fc',
      accent3: '#81d4fa',
      
      glow: '#42a5f5',
      shadow: 'rgba(66, 165, 245, 0.3)',
      gradient: 'linear-gradient(135deg, #0a0f1a 0%, #0f1a2a 100%)'
    },
    timeVariations: {
      dawn: {
        primary: '#b3e5fc',
        accent1: '#e1f5fe'
      },
      day: {
        primary: '#42a5f5',
        background: '#0f1a2a'
      },
      dusk: {
        primary: '#1e88e5',
        background: '#0a0f2a'
      },
      night: {
        primary: '#0d47a1',
        background: '#050a1a'
      }
    },
    fonts: {
      primary: 'JetBrains Mono, monospace',
      secondary: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 14.8,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Seasonal System',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['seasonal', 'winter', 'cool', 'frost']
    }
  }
];

// Time of day detection - only run on client to prevent hydration issues
const getTimeOfDay = (): 'dawn' | 'day' | 'dusk' | 'night' => {
  if (typeof window === 'undefined') return 'day' // Default for SSR
  
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
};

// Season detection - only run on client to prevent hydration issues
const getCurrentSeason = (): 'spring' | 'summer' | 'autumn' | 'winter' => {
  if (typeof window === 'undefined') return 'spring' // Default for SSR
  
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const day = now.getDate();
  
  for (const theme of SEASONAL_THEMES) {
    const { start, end } = theme.dateRange;
    
    // Handle year-crossing seasons (like winter)
    if (start.month > end.month) {
      if ((month > start.month || month < end.month) ||
          (month === start.month && day >= start.day) ||
          (month === end.month && day <= end.day)) {
        return theme.season;
      }
    } else {
      if ((month > start.month && month < end.month) ||
          (month === start.month && day >= start.day) ||
          (month === end.month && day <= end.day)) {
        return theme.season;
      }
    }
  }
  
  return 'spring'; // fallback
};

// Seasonal Theme Manager Component
export const SeasonalThemeManager = () => {
  const { setTheme, createCustomTheme } = useTheme();
  const [currentSeason, setCurrentSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Apply seasonal theme with time variations
  const applySeasonalTheme = useCallback(() => {
    if (!isEnabled) return;

    const season = getCurrentSeason();
    const time = getTimeOfDay();
    
    const seasonalTheme = SEASONAL_THEMES.find(theme => theme.season === season);
    if (!seasonalTheme) return;

    // Create theme with time variations
    let finalTheme = { ...seasonalTheme };
    
    if (seasonalTheme.timeVariations?.[time]) {
      finalTheme = {
        ...seasonalTheme,
        colors: {
          ...seasonalTheme.colors,
          ...seasonalTheme.timeVariations[time]
        }
      };
    }

    // Update theme ID to include time variant
    finalTheme.id = `${seasonalTheme.id}-${time}`;
    finalTheme.name = `${seasonalTheme.name} (${time})`;

    // Create and apply the theme
    createCustomTheme(finalTheme);
    setTheme(finalTheme.id);
    
    setCurrentSeason(season);
    setTimeOfDay(time);
    setLastUpdate(new Date());
  }, [isEnabled, createCustomTheme, setTheme]);

  // Check for updates every minute
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      applySeasonalTheme();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [applySeasonalTheme, isEnabled]);

  // Initial application
  useEffect(() => {
    if (isEnabled) {
      applySeasonalTheme();
    }
  }, [isEnabled, applySeasonalTheme]);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('seasonal-themes-enabled');
    if (saved) {
      setIsEnabled(JSON.parse(saved));
    }
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('seasonal-themes-enabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-40 bg-gray-900 border-2 border-gray-600 p-4 max-w-xs"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-pixel text-white">SEASONAL</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-none border-2 border-gray-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="text-xs font-mono text-gray-400">
              <div>Season: <span className="text-white capitalize">{currentSeason}</span></div>
              <div>Time: <span className="text-white capitalize">{timeOfDay}</span></div>
              <div>Updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {SEASONAL_THEMES.map((theme) => (
                <div
                  key={theme.season}
                  className={`w-4 h-4 border border-gray-600 ${
                    currentSeason === theme.season ? 'ring-1 ring-white' : ''
                  }`}
                  style={{ backgroundColor: theme.colors.primary }}
                  title={theme.name}
                />
              ))}
            </div>

            <div className="text-xs text-gray-500">
              Themes automatically change based on date and time
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Hook for manual seasonal theme control
export const useSeasonalThemes = () => {
  return {
    getCurrentSeason,
    getTimeOfDay,
    seasonalThemes: SEASONAL_THEMES,
    applySeasonalTheme: (season: 'spring' | 'summer' | 'autumn' | 'winter', timeOverride?: 'dawn' | 'day' | 'dusk' | 'night') => {
      const seasonalTheme = SEASONAL_THEMES.find(theme => theme.season === season);
      if (!seasonalTheme) return null;

      const time = timeOverride || getTimeOfDay();
      let finalTheme = { ...seasonalTheme };
      
      if (seasonalTheme.timeVariations?.[time]) {
        finalTheme = {
          ...seasonalTheme,
          colors: {
            ...seasonalTheme.colors,
            ...seasonalTheme.timeVariations[time]
          }
        };
      }

      finalTheme.id = `${seasonalTheme.id}-${time}`;
      finalTheme.name = `${seasonalTheme.name} (${time})`;

      return finalTheme;
    }
  };
};