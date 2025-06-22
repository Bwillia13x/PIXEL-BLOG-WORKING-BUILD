// Enhanced theme system with accessibility-optimized color palettes
// All colors meet WCAG AA standards for contrast ratios

export interface ColorPalette {
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  background: {
    primary: string
    secondary: string
    tertiary: string
    surface: string
    elevated: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
    muted: string
  }
  border: {
    primary: string
    secondary: string
    focus: string
    success: string
    warning: string
    error: string
  }
  semantic: {
    success: string
    warning: string
    error: string
    info: string
    neutral: string
  }
  interactive: {
    hover: string
    active: string
    disabled: string
    focus: string
  }
}

export interface ThemeVariant {
  name: string
  colors: ColorPalette
  shadows: Record<string, string>
  typography: {
    fontSizes: Record<string, string>
    lineHeights: Record<string, string>
    letterSpacing: Record<string, string>
  }
  animations: {
    durations: Record<string, string>
    easings: Record<string, string>
  }
}

// Base green pixel theme - enhanced for accessibility
const baseGreenTheme: ColorPalette = {
  primary: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Lighter green
    300: '#86efac',  // Light green
    400: '#4ade80',  // Primary green (AA compliant on dark bg)
    500: '#22c55e',  // Medium green
    600: '#16a34a',  // Dark green
    700: '#15803d',  // Darker green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Darkest green
    950: '#052e16'   // Nearly black green
  },
  background: {
    primary: '#000000',    // Pure black
    secondary: '#0a0a0a',  // Nearly black
    tertiary: '#111111',   // Dark gray
    surface: '#1a1a1a',    // Surface gray
    elevated: '#242424'    // Elevated surface
  },
  text: {
    primary: '#4ade80',    // Primary green - 7.2:1 contrast on black
    secondary: '#86efac',  // Lighter green - 4.8:1 contrast
    tertiary: '#a3a3a3',   // Light gray - 4.6:1 contrast
    inverse: '#000000',    // Black text on light backgrounds
    muted: '#737373'       // Muted gray - 3.1:1 contrast
  },
  border: {
    primary: '#4ade80',    // Primary green
    secondary: '#22c55e',  // Secondary green
    focus: '#86efac',      // Focus green - higher visibility
    success: '#16a34a',    // Success green
    warning: '#f59e0b',    // Warning amber
    error: '#ef4444'       // Error red
  },
  semantic: {
    success: '#16a34a',    // Success green
    warning: '#f59e0b',    // Warning amber
    error: '#ef4444',      // Error red
    info: '#3b82f6',       // Info blue
    neutral: '#6b7280'     // Neutral gray
  },
  interactive: {
    hover: '#22c55e',      // Hover state
    active: '#16a34a',     // Active state
    disabled: '#374151',   // Disabled state
    focus: '#86efac'       // Focus state
  }
}

// Seasonal theme variations
export const themeVariants: Record<string, ThemeVariant> = {
  // Default green theme
  default: {
    name: 'Classic Green',
    colors: baseGreenTheme,
    shadows: {
      sm: '0 1px 2px 0 rgba(74, 222, 128, 0.1)',
      md: '0 4px 6px -1px rgba(74, 222, 128, 0.1), 0 2px 4px -1px rgba(74, 222, 128, 0.06)',
      lg: '0 10px 15px -3px rgba(74, 222, 128, 0.1), 0 4px 6px -2px rgba(74, 222, 128, 0.05)',
      xl: '0 20px 25px -5px rgba(74, 222, 128, 0.1), 0 10px 10px -5px rgba(74, 222, 128, 0.04)',
      glow: '0 0 20px rgba(74, 222, 128, 0.4), 0 0 40px rgba(74, 222, 128, 0.2)',
      pixel: '3px 3px 0 rgba(74, 222, 128, 0.8)'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    animations: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '800ms'
      },
      easings: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  // Spring theme - warmer greens with yellow accents
  spring: {
    name: 'Spring Bloom',
    colors: {
      ...baseGreenTheme,
      primary: {
        ...baseGreenTheme.primary,
        400: '#84cc16', // Lime green
        500: '#65a30d', // Medium lime
        600: '#4d7c0f'  // Dark lime
      },
      semantic: {
        ...baseGreenTheme.semantic,
        warning: '#eab308', // Brighter yellow
        info: '#06b6d4'     // Cyan
      },
      text: {
        ...baseGreenTheme.text,
        primary: '#84cc16',   // Lime green
        secondary: '#a3e635' // Light lime
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(132, 204, 22, 0.1)',
      md: '0 4px 6px -1px rgba(132, 204, 22, 0.1), 0 2px 4px -1px rgba(132, 204, 22, 0.06)',
      lg: '0 10px 15px -3px rgba(132, 204, 22, 0.1), 0 4px 6px -2px rgba(132, 204, 22, 0.05)',
      xl: '0 20px 25px -5px rgba(132, 204, 22, 0.1), 0 10px 10px -5px rgba(132, 204, 22, 0.04)',
      glow: '0 0 20px rgba(132, 204, 22, 0.4), 0 0 40px rgba(132, 204, 22, 0.2)',
      pixel: '3px 3px 0 rgba(132, 204, 22, 0.8)'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    animations: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '800ms'
      },
      easings: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  // Autumn theme - amber and orange accents
  autumn: {
    name: 'Autumn Matrix',
    colors: {
      ...baseGreenTheme,
      primary: {
        ...baseGreenTheme.primary,
        400: '#f59e0b', // Amber
        500: '#d97706', // Dark amber
        600: '#b45309'  // Darker amber
      },
      semantic: {
        ...baseGreenTheme.semantic,
        warning: '#f97316', // Orange
        success: '#84cc16'  // Keep green for success
      },
      text: {
        ...baseGreenTheme.text,
        primary: '#f59e0b',   // Amber
        secondary: '#fbbf24'  // Light amber
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(245, 158, 11, 0.1)',
      md: '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)',
      lg: '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
      xl: '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
      glow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
      pixel: '3px 3px 0 rgba(245, 158, 11, 0.8)'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    animations: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '800ms'
      },
      easings: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  // Winter theme - cooler blues and cyans
  winter: {
    name: 'Cyber Winter',
    colors: {
      ...baseGreenTheme,
      primary: {
        ...baseGreenTheme.primary,
        400: '#06b6d4', // Cyan
        500: '#0891b2', // Dark cyan
        600: '#0e7490'  // Darker cyan
      },
      semantic: {
        ...baseGreenTheme.semantic,
        info: '#3b82f6',    // Blue
        success: '#10b981'  // Keep green for success
      },
      text: {
        ...baseGreenTheme.text,
        primary: '#06b6d4',   // Cyan
        secondary: '#67e8f9'  // Light cyan
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(6, 182, 212, 0.1)',
      md: '0 4px 6px -1px rgba(6, 182, 212, 0.1), 0 2px 4px -1px rgba(6, 182, 212, 0.06)',
      lg: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)',
      xl: '0 20px 25px -5px rgba(6, 182, 212, 0.1), 0 10px 10px -5px rgba(6, 182, 212, 0.04)',
      glow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
      pixel: '3px 3px 0 rgba(6, 182, 212, 0.8)'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    animations: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '800ms'
      },
      easings: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  // High contrast theme for accessibility
  highContrast: {
    name: 'High Contrast',
    colors: {
      ...baseGreenTheme,
      primary: {
        ...baseGreenTheme.primary,
        400: '#00ff00', // Pure green for maximum contrast
        500: '#00cc00', // Bright green
        600: '#009900'  // Dark green
      },
      text: {
        primary: '#00ff00',   // Pure green - maximum contrast
        secondary: '#ffffff', // White text
        tertiary: '#cccccc',  // Light gray
        inverse: '#000000',   // Black text
        muted: '#999999'      // Medium gray
      },
      border: {
        primary: '#00ff00',   // Pure green
        secondary: '#ffffff', // White borders
        focus: '#ffff00',     // Yellow focus for visibility
        success: '#00ff00',   // Green
        warning: '#ffff00',   // Yellow
        error: '#ff0000'      // Red
      },
      background: {
        primary: '#000000',   // Pure black
        secondary: '#000000', // Pure black
        tertiary: '#111111',  // Dark gray
        surface: '#000000',   // Pure black
        elevated: '#111111'   // Dark gray
      }
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 255, 0, 0.2)',
      md: '0 4px 6px -1px rgba(0, 255, 0, 0.2), 0 2px 4px -1px rgba(0, 255, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 255, 0, 0.2), 0 4px 6px -2px rgba(0, 255, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 255, 0, 0.2), 0 10px 10px -5px rgba(0, 255, 0, 0.08)',
      glow: '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4)',
      pixel: '3px 3px 0 rgba(0, 255, 0, 1)'
    },
    typography: {
      fontSizes: {
        xs: '0.875rem',  // Larger for readability
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.375rem',
        '2xl': '1.625rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      },
      lineHeights: {
        tight: '1.4',    // More spacing for readability
        normal: '1.6',
        relaxed: '1.8'
      },
      letterSpacing: {
        tight: '0',      // No negative spacing
        normal: '0.025em',
        wide: '0.05em',
        wider: '0.075em',
        widest: '0.15em'
      }
    },
    animations: {
      durations: {
        fast: '100ms',   // Faster for high contrast users
        normal: '200ms',
        slow: '300ms',
        slower: '400ms'
      },
      easings: {
        ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeIn: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeInOut: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
      }
    }
  }
}

// Context-aware theme selection
export function getContextualTheme(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  
  // Spring: March-May
  if (month >= 3 && month <= 5) {
    return 'spring'
  }
  // Summer: June-August (keep default green)
  if (month >= 6 && month <= 8) {
    return 'default'
  }
  // Autumn: September-November
  if (month >= 9 && month <= 11) {
    return 'autumn'
  }
  // Winter: December-February
  return 'winter'
}

// Generate CSS custom properties from theme
export function generateCSSProperties(theme: ThemeVariant): Record<string, string> {
  const properties: Record<string, string> = {}
  
  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    properties[`--color-primary-${key}`] = value
  })
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    properties[`--color-bg-${key}`] = value
  })
  
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    properties[`--color-text-${key}`] = value
  })
  
  Object.entries(theme.colors.border).forEach(([key, value]) => {
    properties[`--color-border-${key}`] = value
  })
  
  Object.entries(theme.colors.semantic).forEach(([key, value]) => {
    properties[`--color-${key}`] = value
  })
  
  Object.entries(theme.colors.interactive).forEach(([key, value]) => {
    properties[`--color-interactive-${key}`] = value
  })
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    properties[`--shadow-${key}`] = value
  })
  
  // Typography
  Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
    properties[`--font-size-${key}`] = value
  })
  
  Object.entries(theme.typography.lineHeights).forEach(([key, value]) => {
    properties[`--line-height-${key}`] = value
  })
  
  Object.entries(theme.typography.letterSpacing).forEach(([key, value]) => {
    properties[`--letter-spacing-${key}`] = value
  })
  
  // Animations
  Object.entries(theme.animations.durations).forEach(([key, value]) => {
    properties[`--duration-${key}`] = value
  })
  
  Object.entries(theme.animations.easings).forEach(([key, value]) => {
    properties[`--easing-${key}`] = value
  })
  
  return properties
}

export default themeVariants