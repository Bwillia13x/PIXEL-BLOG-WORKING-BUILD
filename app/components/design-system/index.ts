// Pixel Design System - Main Export File

// Micro-Interactions
export {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelSpinner,
  PixelProgressBar,
  PixelToggle,
  PixelTooltip
} from './PixelMicroInteractions';

// Advanced Animations
export {
  PixelGlitchText,
  MatrixTextReveal,
  PixelTypewriter,
  PixelParticleExplode,
  PixelScanline,
  PixelMatrixRain,
  PixelPulse,
  PixelShake,
  PixelReveal,
  PixelCRTEffect
} from './PixelAnimations';

// Density System
export {
  PixelDensityProvider,
  DensityControlPanel,
  ResponsivePixelBox,
  AdaptivePixelText,
  PixelGrid,
  PixelArtScaler,
  usePixelDensity,
  useResponsivePixelValue,
  usePixelBreakpoint,
  useAdaptivePixelSize
} from './PixelDensitySystem';

// Icon Library
export {
  PixelIconLibrary,
  PixelIconSet,
  // Individual Icons
  PixelArrowRight,
  PixelArrowLeft,
  PixelArrowUp,
  PixelArrowDown,
  PixelHeart,
  PixelStar,
  PixelPlus,
  PixelMinus,
  PixelClose,
  PixelCheck,
  PixelHome,
  PixelUser,
  PixelSearch,
  PixelMenu,
  PixelSettings,
  PixelMail,
  PixelPhone,
  PixelGithub,
  PixelLink,
  PixelDownload,
  PixelUpload,
  PixelPlay,
  PixelPause,
  PixelStop
} from './PixelIcons';

// Parallax Effects
export {
  PixelParallaxLayer,
  PixelClouds,
  PixelMountains,
  PixelStars,
  PixelPlanet,
  FloatingPixelDebris,
  PixelParallaxContainer,
  PixelSpaceScene,
  PixelLandscapeScene,
  PixelCyberScene
} from './PixelParallax';

// Loading Skeletons
export {
  PixelSkeleton,
  PixelBlogCardSkeleton,
  PixelProjectCardSkeleton,
  PixelNavSkeleton,
  PixelUserProfileSkeleton,
  PixelCommentSkeleton,
  PixelChartSkeleton,
  PixelTableSkeleton,
  PixelFormSkeleton,
  PixelSearchResultsSkeleton,
  PixelPageSkeleton,
  PixelLoadingState,
  // PixelSkeletonCard,
  // PixelSkeletonText,
  // PixelSkeletonAvatar
} from './PixelSkeletons';

// Showcase Component
export { PixelDesignShowcase } from './PixelDesignShowcase';

// Design System Constants
export const PIXEL_COLORS = {
  primary: '#4ade80',
  secondary: '#22c55e',
  accent: '#16a34a',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  gray: {
    900: '#111827',
    800: '#1f2937',
    700: '#374151',
    600: '#4b5563',
    500: '#6b7280',
    400: '#9ca3af'
  }
} as const;

export const PIXEL_SIZES = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20
} as const;

export const PIXEL_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  ultrawide: 1920
} as const;

// Design System Types
export interface PixelTheme {
  colors: typeof PIXEL_COLORS;
  sizes: typeof PIXEL_SIZES;
  breakpoints: typeof PIXEL_BREAKPOINTS;
  fonts: {
    pixel: string;
    mono: string;
    retro: string;
  };
}

export interface PixelComponentProps {
  size?: keyof typeof PIXEL_SIZES;
  color?: string;
  animate?: boolean;
  className?: string;
}