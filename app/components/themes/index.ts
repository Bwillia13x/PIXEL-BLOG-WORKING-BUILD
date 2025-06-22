// Advanced Theme System - Main Export File

// Core theme studio with live editing
export { ThemeStudio } from './ThemeStudio';

// Advanced visual effects system
export {
  ParticleSystem,
  ShaderEffects,
  DynamicGradient,
  AtmosphericLighting,
  ThemeVisualEffects
} from './AdvancedVisualEffects';

// Seasonal theme variations
export {
  SeasonalThemeManager,
  useSeasonalThemes
} from './SeasonalThemes';

// Theme marketplace
export { ThemeMarketplace } from './ThemeMarketplace';

// Accessibility features
export { AccessibilityPanel } from './AccessibilityFeatures';

// Cinematic transitions
export {
  CinematicTransitionManager,
  TransitionSettings,
  useThemeTransition
} from './CinematicTransitions';

// Enhanced theme system constants
export const ADVANCED_THEME_FEATURES = {
  visualEffects: [
    'particles',
    'dynamic_gradients',
    'atmospheric_lighting',
    'shader_effects'
  ],
  transitions: [
    'morph',
    'shatter',
    'liquid',
    'portal',
    'matrix',
    'pixel_explosion',
    'wave',
    'glitch'
  ],
  accessibility: [
    'color_blindness_simulation',
    'contrast_checking',
    'text_scaling',
    'motion_reduction',
    'high_contrast',
    'focus_enhancement'
  ],
  seasonal: [
    'spring_bloom',
    'summer_heat',
    'autumn_leaves',
    'winter_frost'
  ]
} as const;

// Theme system configuration
export interface AdvancedThemeConfig {
  enableVisualEffects: boolean;
  enableCinematicTransitions: boolean;
  enableSeasonalThemes: boolean;
  enableAccessibilityFeatures: boolean;
  enableMarketplace: boolean;
  transitionDuration: number;
  particleCount: number;
  effectsIntensity: number;
}

export const DEFAULT_ADVANCED_CONFIG: AdvancedThemeConfig = {
  enableVisualEffects: true,
  enableCinematicTransitions: true,
  enableSeasonalThemes: false,
  enableAccessibilityFeatures: true,
  enableMarketplace: true,
  transitionDuration: 1500,
  particleCount: 50,
  effectsIntensity: 0.5
};