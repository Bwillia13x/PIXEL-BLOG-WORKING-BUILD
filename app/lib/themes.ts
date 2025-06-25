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
    tags: ReadonlyArray<string>
  }
}

// Organized Color System - Main Themes
export const COLOR_SYSTEMS = {
  // Default Neon Green Theme (Matrix-inspired)
  neonGreen: {
    id: 'neon-green',
    name: 'Neon Green',
    description: 'The classic matrix-inspired green terminal aesthetic with optimal contrast',
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
      secondary: 'Inter, system-ui, sans-serif',
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
      author: 'It From Bit',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['default', 'matrix', 'green', 'neon', 'terminal']
    }
  },

  // New Cyber-Sunset Theme (Magenta-Orange)
  cyberSunset: {
    id: 'cyber-sunset',
    name: 'Cyber Sunset',
    description: 'Vibrant magenta and orange tones creating a cyberpunk sunset atmosphere',
    colors: {
      primary: '#ff0080',
      primaryHover: '#e6006b',
      primaryFocus: '#ff3399',
      
      background: '#000000',
      backgroundSecondary: '#1a0a0f',
      backgroundTertiary: '#2a1520',
      backgroundOverlay: 'rgba(0, 0, 0, 0.9)',
      
      surface: '#1f0f15',
      surfaceHover: '#2f1f25',
      surfaceActive: '#3f2f35',
      
      text: '#ff0080',
      textSecondary: '#ff3399',
      textTertiary: '#cc0066',
      textInverse: '#000000',
      
      border: '#ff0080',
      borderSecondary: '#ff3399',
      borderAccent: '#ff6600',
      
      success: '#00ff80',
      warning: '#ff6600',
      error: '#ff4040',
      info: '#8000ff',
      
      accent1: '#ff6600', // Sunset orange
      accent2: '#8000ff', // Deep purple
      accent3: '#ffff00', // Electric yellow
      
      glow: '#ff0080',
      shadow: 'rgba(255, 0, 128, 0.4)',
      gradient: 'linear-gradient(135deg, #000000 0%, #2a0a15 50%, #1a0a0f 100%)'
    },
    fonts: {
      primary: 'JetBrains Mono, Consolas, monospace',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: true,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 12.8,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'It From Bit',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['cyberpunk', 'sunset', 'magenta', 'orange', 'vibrant']
    }
  }
} as const

// Legacy theme compatibility - keeping existing themes
export const RETRO_THEMES: Record<string, ThemeConfig> = {
  // Default theme points to our organized neon green
  matrix: COLOR_SYSTEMS.neonGreen,
  
  // New cyber sunset theme
  cyberSunset: COLOR_SYSTEMS.cyberSunset,

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
      secondary: 'Inter, system-ui, sans-serif',
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
      author: 'It From Bit',
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
      secondary: 'Inter, system-ui, sans-serif',
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
      author: 'It From Bit',
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
      author: 'It From Bit',
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
      secondary: 'Inter, system-ui, sans-serif',
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
      author: 'It From Bit',
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
      secondary: 'Inter, system-ui, sans-serif',
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
      author: 'It From Bit',
      version: '1.0.0',
      created: new Date().toISOString(),
      tags: ['synthwave', '80s', 'retro', 'gradient']
    }
  }
}

// Default theme configuration
export const DEFAULT_THEME = COLOR_SYSTEMS.neonGreen

// Theme utilities
export function getThemeById(id: string): ThemeConfig | undefined {
  return RETRO_THEMES[id] || Object.values(COLOR_SYSTEMS).find(theme => theme.id === id)
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(RETRO_THEMES)
}

export function getMainThemes(): ThemeConfig[] {
  return Object.values(COLOR_SYSTEMS)
}

export function validateTheme(theme: any): theme is ThemeConfig {
  return (
    typeof theme === 'object' &&
    theme !== null &&
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.colors === 'object' &&
    typeof theme.fonts === 'object' &&
    typeof theme.effects === 'object' &&
    typeof theme.accessibility === 'object'
  )
}

export function exportTheme(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2)
}

export function importTheme(jsonString: string): ThemeConfig | null {
  try {
    const theme = JSON.parse(jsonString)
    return validateTheme(theme) ? theme : null
  } catch {
    return null
  }
}

// Theme comparison utilities
export function getThemeContrastRatio(theme: ThemeConfig): number {
  return theme.accessibility.contrastRatio
}

export function isAccessibleTheme(theme: ThemeConfig): boolean {
  return theme.accessibility.contrastRatio >= 7.0 // WCAG AA Large Text standard
}

// New function for accessibility compliance checking
export function isAccessibilityCompliant(theme: ThemeConfig): boolean {
  const {
    contrastRatio,
    highContrast,
  } = theme.accessibility

  // Check WCAG contrast requirements
  const hasGoodContrast = contrastRatio >= 4.5 // AA level
  const hasExcellentContrast = contrastRatio >= 7.0 // AAA level
  
  // Additional checks for specific color combinations
  const hasReadableText = checkColorContrast(theme.colors.text, theme.colors.background) >= 4.5
  const hasReadableSecondaryText = checkColorContrast(theme.colors.textSecondary, theme.colors.background) >= 3.0
  const hasReadableBorders = checkColorContrast(theme.colors.border, theme.colors.background) >= 3.0
  
  return hasGoodContrast && hasReadableText && hasReadableSecondaryText && hasReadableBorders
}

// Helper function to calculate color contrast ratio
function checkColorContrast(foreground: string, background: string): number {
  // Convert hex to RGB
  const getRGB = (color: string) => {
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    }
  }

  // Calculate relative luminance
  const getLuminance = (color: { r: number; g: number; b: number }) => {
    const { r, g, b } = color
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  try {
    const fg = getRGB(foreground)
    const bg = getRGB(background)
    
    const fgLuminance = getLuminance(fg)
    const bgLuminance = getLuminance(bg)
    
    const contrast = fgLuminance > bgLuminance 
      ? (fgLuminance + 0.05) / (bgLuminance + 0.05)
      : (bgLuminance + 0.05) / (fgLuminance + 0.05)
    
    return contrast
  } catch (error) {
    console.warn('Error calculating contrast ratio:', error)
    return 1 // Fallback to poor contrast
  }
}

export function getThemeByTags(tags: string[]): ThemeConfig[] {
  return getAllThemes().filter(theme =>
    tags.some(tag => theme.metadata.tags.includes(tag))
  )
}

// Color system utilities
export function getColorSystemVariants(): { id: string; name: string; description: string }[] {
  return Object.values(COLOR_SYSTEMS).map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description
  }))
}

export function isMainColorSystem(themeId: string): boolean {
  return Object.keys(COLOR_SYSTEMS).some(key => COLOR_SYSTEMS[key as keyof typeof COLOR_SYSTEMS].id === themeId)
}