export interface ThemeColors {
  // Primary colors
  primary: string
  primaryHover: string
  primaryFocus: string
  
  // Background colors
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  backgroundOverlay: string
  
  // Surface colors
  surface: string
  surfaceHover: string
  surfaceActive: string
  
  // Text colors
  text: string
  textSecondary: string
  textTertiary: string
  textInverse: string
  
  // Border colors
  border: string
  borderSecondary: string
  borderAccent: string
  
  // Status colors
  success: string
  warning: string
  error: string
  info: string
  
  // Accent colors
  accent1: string
  accent2: string
  accent3: string
  
  // Special effects
  glow: string
  shadow: string
  gradient: string
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  colors: ThemeColors
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  effects: {
    scanlines: boolean
    glow: boolean
    pixelBorder: boolean
    crtEffect: boolean
  }
  accessibility: {
    contrastRatio: number
    reduceMotion: boolean
    highContrast: boolean
  }
  metadata: {
    author: string
    version: string
    created: string
    tags: string[]
  }
}

// Predefined retro color schemes
export const RETRO_THEMES: Record<string, ThemeConfig> = {
  matrix: {
    id: 'matrix',
    name: 'Matrix Green',
    description: 'Classic green-on-black terminal aesthetic from The Matrix',
    colors: {
      primary: '#00ff41',
      primaryHover: '#00cc33',
      primaryFocus: '#00ff41',
      
      background: '#000000',
      backgroundSecondary: '#0a0a0a',
      backgroundTertiary: '#111111',
      backgroundOverlay: 'rgba(0, 0, 0, 0.9)',
      
      surface: '#0f0f0f',
      surfaceHover: '#1a1a1a',
      surfaceActive: '#262626',
      
      text: '#00ff41',
      textSecondary: '#00cc33',
      textTertiary: '#008822',
      textInverse: '#000000',
      
      border: '#00ff41',
      borderSecondary: '#00cc33',
      borderAccent: '#00ff41',
      
      success: '#00ff41',
      warning: '#ffff00',
      error: '#ff0040',
      info: '#0080ff',
      
      accent1: '#00ffff',
      accent2: '#ff00ff',
      accent3: '#ffff00',
      
      glow: '#00ff41',
      shadow: 'rgba(0, 255, 65, 0.3)',
      gradient: 'linear-gradient(135deg, #000000 0%, #0a1a0a 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'VT323, monospace',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: true
    },
    accessibility: {
      contrastRatio: 14.3,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['retro', 'terminal', 'matrix', 'green']
    }
  },

  amber: {
    id: 'amber',
    name: 'Amber Terminal',
    description: 'Warm amber terminal reminiscent of 80s computer systems',
    colors: {
      primary: '#ffb000',
      primaryHover: '#ff9500',
      primaryFocus: '#ffb000',
      
      background: '#1a0f00',
      backgroundSecondary: '#2a1500',
      backgroundTertiary: '#3a1f00',
      backgroundOverlay: 'rgba(26, 15, 0, 0.9)',
      
      surface: '#2a1500',
      surfaceHover: '#3a1f00',
      surfaceActive: '#4a2900',
      
      text: '#ffb000',
      textSecondary: '#ff9500',
      textTertiary: '#cc7700',
      textInverse: '#1a0f00',
      
      border: '#ffb000',
      borderSecondary: '#ff9500',
      borderAccent: '#ffb000',
      
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff4444',
      info: '#00aaff',
      
      accent1: '#ff6600',
      accent2: '#ffff00',
      accent3: '#ff0066',
      
      glow: '#ffb000',
      shadow: 'rgba(255, 176, 0, 0.3)',
      gradient: 'linear-gradient(135deg, #1a0f00 0%, #2a1f0f 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'VT323, monospace',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: true
    },
    accessibility: {
      contrastRatio: 12.8,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['retro', 'terminal', 'amber', 'warm']
    }
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Blue',
    description: 'Neon blue cyberpunk aesthetic with pink accents',
    colors: {
      primary: '#00d4ff',
      primaryHover: '#00aacc',
      primaryFocus: '#00d4ff',
      
      background: '#0a0a1a',
      backgroundSecondary: '#0f0f2a',
      backgroundTertiary: '#1a1a3a',
      backgroundOverlay: 'rgba(10, 10, 26, 0.9)',
      
      surface: '#151530',
      surfaceHover: '#1f1f40',
      surfaceActive: '#2a2a50',
      
      text: '#00d4ff',
      textSecondary: '#0099cc',
      textTertiary: '#006699',
      textInverse: '#0a0a1a',
      
      border: '#00d4ff',
      borderSecondary: '#0099cc',
      borderAccent: '#ff0099',
      
      success: '#00ff99',
      warning: '#ffaa00',
      error: '#ff0066',
      info: '#00d4ff',
      
      accent1: '#ff0099',
      accent2: '#9900ff',
      accent3: '#ffff00',
      
      glow: '#00d4ff',
      shadow: 'rgba(0, 212, 255, 0.3)',
      gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'Orbitron, monospace',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 13.5,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['cyberpunk', 'neon', 'blue', 'futuristic']
    }
  },

  vintage: {
    id: 'vintage',
    name: 'Vintage Paper',
    description: 'Warm sepia tones reminiscent of old computer manuals',
    colors: {
      primary: '#8b4513',
      primaryHover: '#654321',
      primaryFocus: '#8b4513',
      
      background: '#f5f5dc',
      backgroundSecondary: '#f0f0d0',
      backgroundTertiary: '#eaeac0',
      backgroundOverlay: 'rgba(245, 245, 220, 0.9)',
      
      surface: '#f8f8e8',
      surfaceHover: '#f0f0e0',
      surfaceActive: '#e8e8d8',
      
      text: '#2f1b14',
      textSecondary: '#4a2c1a',
      textTertiary: '#654321',
      textInverse: '#f5f5dc',
      
      border: '#8b4513',
      borderSecondary: '#a0522d',
      borderAccent: '#d2691e',
      
      success: '#228b22',
      warning: '#ff8c00',
      error: '#b22222',
      info: '#4682b4',
      
      accent1: '#cd853f',
      accent2: '#d2691e',
      accent3: '#bc8f8f',
      
      glow: '#8b4513',
      shadow: 'rgba(139, 69, 19, 0.2)',
      gradient: 'linear-gradient(135deg, #f5f5dc 0%, #f0f0d0 100%)'
    },
    fonts: {
      primary: 'Georgia, serif',
      secondary: 'Times New Roman, serif',
      mono: 'Courier New, monospace'
    },
    effects: {
      scanlines: false,
      glow: false,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 15.2,
      reduceMotion: true,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['vintage', 'sepia', 'paper', 'classic']
    }
  },

  neon: {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Vibrant neon colors on dark background',
    colors: {
      primary: '#ff0080',
      primaryHover: '#e6006b',
      primaryFocus: '#ff0080',
      
      background: '#000010',
      backgroundSecondary: '#0a0a20',
      backgroundTertiary: '#101030',
      backgroundOverlay: 'rgba(0, 0, 16, 0.9)',
      
      surface: '#151540',
      surfaceHover: '#202050',
      surfaceActive: '#2a2a60',
      
      text: '#ff0080',
      textSecondary: '#ff3399',
      textTertiary: '#cc0066',
      textInverse: '#000010',
      
      border: '#ff0080',
      borderSecondary: '#ff3399',
      borderAccent: '#00ff80',
      
      success: '#00ff80',
      warning: '#ffff00',
      error: '#ff4040',
      info: '#0080ff',
      
      accent1: '#00ff80',
      accent2: '#8000ff',
      accent3: '#ffff00',
      
      glow: '#ff0080',
      shadow: 'rgba(255, 0, 128, 0.4)',
      gradient: 'linear-gradient(135deg, #000010 0%, #200020 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'Orbitron, monospace',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 11.9,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['neon', 'vibrant', 'night', 'electric']
    }
  },

  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro 80s synthwave with purple and teal gradients',
    colors: {
      primary: '#ff00ff',
      primaryHover: '#e600e6',
      primaryFocus: '#ff00ff',
      
      background: '#0f0f23',
      backgroundSecondary: '#1a1a3a',
      backgroundTertiary: '#252550',
      backgroundOverlay: 'rgba(15, 15, 35, 0.9)',
      
      surface: '#2a2a5a',
      surfaceHover: '#353570',
      surfaceActive: '#404080',
      
      text: '#ff00ff',
      textSecondary: '#00ffff',
      textTertiary: '#cc00cc',
      textInverse: '#0f0f23',
      
      border: '#ff00ff',
      borderSecondary: '#00ffff',
      borderAccent: '#ffff00',
      
      success: '#00ff80',
      warning: '#ffaa00',
      error: '#ff4080',
      info: '#00aaff',
      
      accent1: '#00ffff',
      accent2: '#ffff00',
      accent3: '#ff8000',
      
      glow: '#ff00ff',
      shadow: 'rgba(255, 0, 255, 0.3)',
      gradient: 'linear-gradient(135deg, #0f0f23 0%, #2a1a4a 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'Orbitron, monospace',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: true
    },
    accessibility: {
      contrastRatio: 12.1,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'Pixel Wisdom',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['synthwave', '80s', 'retro', 'gradient']
    }
  }
}

// Default theme (Matrix)
export const DEFAULT_THEME = RETRO_THEMES.matrix

// Utility functions for theme management
export function getThemeById(id: string): ThemeConfig | null {
  return RETRO_THEMES[id] || null
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(RETRO_THEMES)
}

export function validateTheme(theme: Partial<ThemeConfig>): boolean {
  // Basic validation - ensure required fields exist
  return !!(
    theme.id &&
    theme.name &&
    theme.colors &&
    theme.colors.primary &&
    theme.colors.background &&
    theme.colors.text
  )
}

// Accessibility helpers
export function calculateContrast(foreground: string, background: string): number {
  // Simplified contrast calculation (in real implementation, use proper color contrast algorithm)
  const getLuminance = (color: string) => {
    // Remove # if present
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const toLinear = (val: number) => val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }
  
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export function isAccessibilityCompliant(theme: ThemeConfig): boolean {
  const textContrast = calculateContrast(theme.colors.text, theme.colors.background)
  const primaryContrast = calculateContrast(theme.colors.primary, theme.colors.background)
  
  // WCAG AA standard requires 4.5:1 for normal text, 3:1 for large text
  return textContrast >= 4.5 && primaryContrast >= 3.0
}

// Theme export/import helpers
export function exportTheme(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2)
}

export function importTheme(jsonString: string): ThemeConfig | null {
  try {
    const theme = JSON.parse(jsonString)
    if (validateTheme(theme)) {
      return theme
    }
  } catch (error) {
    console.error('Failed to parse theme JSON:', error)
  }
  return null
}