// Enhanced typography system for pixel-perfect retro aesthetic with improved readability

export interface TypographyScale {
  fontSize: string
  lineHeight: string
  letterSpacing: string
  fontWeight?: string
  textTransform?: string
}

export interface TypographyConfig {
  // Pixel fonts for headers and UI
  pixel: {
    xs: TypographyScale
    sm: TypographyScale
    base: TypographyScale
    lg: TypographyScale
    xl: TypographyScale
    '2xl': TypographyScale
    '3xl': TypographyScale
    '4xl': TypographyScale
    '5xl': TypographyScale
  }
  // Monospace for code and technical content
  mono: {
    xs: TypographyScale
    sm: TypographyScale
    base: TypographyScale
    lg: TypographyScale
    xl: TypographyScale
  }
  // Readable font for body text
  readable: {
    xs: TypographyScale
    sm: TypographyScale
    base: TypographyScale
    lg: TypographyScale
    xl: TypographyScale
    '2xl': TypographyScale
  }
}

// Optimized typography scales for pixel aesthetic
export const typographyConfig: TypographyConfig = {
  // Pixel font family (Press Start 2P) - for headers and UI elements
  pixel: {
    xs: {
      fontSize: '0.625rem',    // 10px - very small UI elements
      lineHeight: '1.2',       // Tight line height for pixel fonts
      letterSpacing: '0.025em', // Slight spacing for readability
    },
    sm: {
      fontSize: '0.75rem',     // 12px - small UI elements, buttons
      lineHeight: '1.3',
      letterSpacing: '0.025em',
    },
    base: {
      fontSize: '0.875rem',    // 14px - default UI text, navigation
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    lg: {
      fontSize: '1rem',        // 16px - prominent UI elements
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    xl: {
      fontSize: '1.125rem',    // 18px - small headers
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    '2xl': {
      fontSize: '1.25rem',     // 20px - medium headers
      lineHeight: '1.3',
      letterSpacing: '0.025em',
    },
    '3xl': {
      fontSize: '1.5rem',      // 24px - large headers
      lineHeight: '1.3',
      letterSpacing: '0.025em',
    },
    '4xl': {
      fontSize: '2rem',        // 32px - very large headers
      lineHeight: '1.2',
      letterSpacing: '0.025em',
    },
    '5xl': {
      fontSize: '2.5rem',      // 40px - hero headers
      lineHeight: '1.1',
      letterSpacing: '0.025em',
    }
  },

  // Monospace font family (JetBrains Mono) - for code and technical content
  mono: {
    xs: {
      fontSize: '0.75rem',     // 12px - inline code
      lineHeight: '1.4',
      letterSpacing: '0',
    },
    sm: {
      fontSize: '0.875rem',    // 14px - small code blocks
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    base: {
      fontSize: '1rem',        // 16px - default code blocks
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    lg: {
      fontSize: '1.125rem',    // 18px - large code blocks
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    xl: {
      fontSize: '1.25rem',     // 20px - featured code
      lineHeight: '1.6',
      letterSpacing: '0',
    }
  },

  // Readable font family (VT323) - for body text and content
  readable: {
    xs: {
      fontSize: '0.875rem',    // 14px - small text, captions
      lineHeight: '1.5',
      letterSpacing: '0.01em',
    },
    sm: {
      fontSize: '1rem',        // 16px - small body text
      lineHeight: '1.6',
      letterSpacing: '0.01em',
    },
    base: {
      fontSize: '1.125rem',    // 18px - default body text
      lineHeight: '1.7',
      letterSpacing: '0.01em',
    },
    lg: {
      fontSize: '1.25rem',     // 20px - large body text
      lineHeight: '1.7',
      letterSpacing: '0.01em',
    },
    xl: {
      fontSize: '1.375rem',    // 22px - very large body text
      lineHeight: '1.7',
      letterSpacing: '0.01em',
    },
    '2xl': {
      fontSize: '1.5rem',      // 24px - featured text
      lineHeight: '1.6',
      letterSpacing: '0.01em',
    }
  }
}

// Semantic typography roles
export const typographyRoles = {
  // Hero section
  hero: {
    title: typographyConfig.pixel['5xl'],
    subtitle: typographyConfig.readable['2xl']
  },
  
  // Page headings
  heading: {
    h1: typographyConfig.pixel['4xl'],
    h2: typographyConfig.pixel['3xl'],
    h3: typographyConfig.pixel['2xl'],
    h4: typographyConfig.pixel.xl,
    h5: typographyConfig.pixel.lg,
    h6: typographyConfig.pixel.base
  },
  
  // Body content
  body: {
    large: typographyConfig.readable.lg,
    base: typographyConfig.readable.base,
    small: typographyConfig.readable.sm
  },
  
  // UI elements
  ui: {
    button: typographyConfig.pixel.sm,
    label: typographyConfig.pixel.xs,
    input: typographyConfig.mono.sm,
    navigation: typographyConfig.pixel.base
  },
  
  // Code content
  code: {
    inline: typographyConfig.mono.sm,
    block: typographyConfig.mono.base,
    featured: typographyConfig.mono.lg
  },
  
  // Utility text
  utility: {
    caption: typographyConfig.readable.xs,
    helper: typographyConfig.mono.xs,
    metadata: typographyConfig.mono.xs
  }
}

// Responsive typography utilities
export const responsiveTypography = {
  // Mobile-first scaling
  mobile: {
    scaleDown: (scale: TypographyScale): TypographyScale => ({
      ...scale,
      fontSize: `calc(${scale.fontSize} * 0.875)`, // 87.5% on mobile
      lineHeight: scale.lineHeight
    }),
    
    scaleUp: (scale: TypographyScale): TypographyScale => ({
      ...scale,
      fontSize: `calc(${scale.fontSize} * 1.125)`, // 112.5% for large mobile
      lineHeight: scale.lineHeight
    })
  },
  
  // Desktop scaling
  desktop: {
    scaleUp: (scale: TypographyScale): TypographyScale => ({
      ...scale,
      fontSize: `calc(${scale.fontSize} * 1.25)`, // 125% on desktop
      lineHeight: scale.lineHeight
    })
  }
}

// Generate CSS classes for typography system
export function generateTypographyCSS(): string {
  const css: string[] = []
  
  // Base font family declarations
  css.push(`
    .font-pixel {
      font-family: var(--font-press-start-2p), 'Courier New', monospace;
      font-weight: 400;
      font-feature-settings: 'kern' 0;
      -webkit-font-smoothing: none;
      -moz-osx-font-smoothing: auto;
      text-rendering: optimizeSpeed;
    }
    
    .font-mono {
      font-family: var(--font-jetbrains-mono), 'Monaco', 'Menlo', monospace;
      font-weight: 400;
      font-variant-ligatures: none;
      font-feature-settings: 'calt' 0;
    }
    
    .font-readable {
      font-family: var(--font-vt323), 'Courier New', monospace;
      font-weight: 400;
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
    }
  `)
  
  // Generate classes for each typography scale
  Object.entries(typographyConfig).forEach(([family, scales]) => {
    Object.entries(scales).forEach(([size, scale]) => {
      css.push(`
        .${family}-${size} {
          font-size: ${scale.fontSize};
          line-height: ${scale.lineHeight};
          letter-spacing: ${scale.letterSpacing};
          ${scale.fontWeight ? `font-weight: ${scale.fontWeight};` : ''}
          ${scale.textTransform ? `text-transform: ${scale.textTransform};` : ''}
        }
      `)
    })
  })
  
  // Responsive typography
  css.push(`
    /* Mobile optimizations */
    @media (max-width: 640px) {
      .pixel-5xl { font-size: calc(2.5rem * 0.75); } /* Scale down hero text */
      .pixel-4xl { font-size: calc(2rem * 0.875); }
      .pixel-3xl { font-size: calc(1.5rem * 0.875); }
      .readable-2xl { font-size: calc(1.5rem * 0.875); }
      .readable-xl { font-size: calc(1.375rem * 0.875); }
    }
    
    /* Large desktop optimizations */
    @media (min-width: 1280px) {
      .pixel-5xl { font-size: calc(2.5rem * 1.125); } /* Scale up hero text */
      .pixel-4xl { font-size: calc(2rem * 1.125); }
      .readable-2xl { font-size: calc(1.5rem * 1.125); }
    }
  `)
  
  // Accessibility enhancements
  css.push(`
    /* High contrast mode typography adjustments */
    .high-contrast .font-pixel,
    .high-contrast .font-mono,
    .high-contrast .font-readable {
      font-weight: 500; /* Slightly bolder for better visibility */
      text-shadow: 0 0 1px currentColor; /* Subtle glow for definition */
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .font-pixel,
      .font-mono,
      .font-readable {
        animation: none !important;
        transition: none !important;
      }
    }
    
    /* Focus improvements for typography */
    .font-pixel:focus,
    .font-mono:focus,
    .font-readable:focus {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 2px;
    }
  `)
  
  return css.join('\n')
}

// Typography utility functions
export const typographyUtils = {
  // Get typography scale by semantic role
  getScale: (role: keyof typeof typographyRoles, variant?: string): TypographyScale => {
    const roleConfig = typographyRoles[role] as any
    if (variant && roleConfig[variant]) {
      return roleConfig[variant]
    }
    return roleConfig
  },
  
  // Convert scale to CSS string
  scaleToCSS: (scale: TypographyScale): string => {
    return `
      font-size: ${scale.fontSize};
      line-height: ${scale.lineHeight};
      letter-spacing: ${scale.letterSpacing};
      ${scale.fontWeight ? `font-weight: ${scale.fontWeight};` : ''}
      ${scale.textTransform ? `text-transform: ${scale.textTransform};` : ''}
    `.trim()
  },
  
  // Create responsive scaling
  createResponsive: (base: TypographyScale, mobileScale = 0.875, desktopScale = 1.125): {
    mobile: TypographyScale
    base: TypographyScale
    desktop: TypographyScale
  } => ({
    mobile: {
      ...base,
      fontSize: `calc(${base.fontSize} * ${mobileScale})`
    },
    base,
    desktop: {
      ...base,
      fontSize: `calc(${base.fontSize} * ${desktopScale})`
    }
  })
}

export default typographyConfig