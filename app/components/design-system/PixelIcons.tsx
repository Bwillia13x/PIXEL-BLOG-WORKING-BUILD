'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PixelIconProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

export const PixelArrowRight = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { x: [0, 2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M2 2h4v2H2V2zm4 2h2v2H6V4zm2 2h2v2H8V6zm2 2h2v2h-2V8zm0 2h2v2h-2v-2zm-2 2h2v2H8v-2zm-2 2h2v2H6v-2zm-4 0h4v2H2v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelArrowLeft = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { x: [0, -2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M14 2h-4v2h4V2zm-4 2h-2v2h2V4zm-2 2h-2v2h2V6zm-2 2h-2v2h2V8zm0 2h-2v2h2v-2zm2 2h-2v2h2v-2zm2 2h-2v2h2v-2zm4 0h-4v2h4v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelArrowUp = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, -2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M8 0h2v2H8V0zm-2 2h2v2H6V2zm-2 2h2v2H4V4zm-2 2h2v2H2V6zm12 0h-2v2h2V6zm-2 2h-2v2h2V8zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelArrowDown = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, 2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M6 14h2v-2H6v2zm2-2h2v-2H8v2zm2-2h2v-2h-2v2zm2-2h2V6h-2v2zm-12 0h2V6H2v2zm2-2h2V4H4v2zm2-2h2V2H6v2zm2-2h2V0H8v2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelHeart = ({ size = 16, color = '#ff4757', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.2, 1] } : {}}
    transition={animate ? { duration: 0.8, repeat: Infinity } : {}}
  >
    <path
      d="M2 4h2V2h2v2h2V2h2v2h2v2h-2v2h-2v2H6V8H4V6H2V4zm2 6h2v2H4v-2zm6 0h2v2h-2v-2zm-2 2h2v2H8v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelStar = ({ size = 16, color = '#ffa502', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { rotate: [0, 360] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
  >
    <path
      d="M8 0h2v2H8V0zm-2 2h2v2H6V2zm6 0h2v2h-2V2zm-8 2h2v2H4V4zm8 0h2v2h-2V4zm-10 2h2v2H2V6zm12 0h2v2h-2V6zm-12 2h2v2H2V8zm12 0h2v2h-2V8zm-10 2h2v2H4v-2zm8 0h2v2h-2v-2zm-6 2h2v2H6v-2zm4 0h2v2h-2v-2zm-2 2h2v2H8v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelPlus = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.1, 1] } : {}}
    transition={animate ? { duration: 0.5, repeat: Infinity } : {}}
  >
    <path
      d="M6 0h4v6h6v4h-6v6H6v-6H0V6h6V0z"
      fill={color}
    />
  </motion.svg>
);

export const PixelMinus = ({ size = 16, color = '#ff3838', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 0.9, 1] } : {}}
    transition={animate ? { duration: 0.5, repeat: Infinity } : {}}
  >
    <path
      d="M0 6h16v4H0V6z"
      fill={color}
    />
  </motion.svg>
);

export const PixelClose = ({ size = 16, color = '#ff3838', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { rotate: [0, 90, 0] } : {}}
    transition={animate ? { duration: 0.6, repeat: Infinity } : {}}
  >
    <path
      d="M0 0h4v4h4V0h4v4h4v4h-4v4h4v4h-4v-4H8v4H4v-4H0v-4h4V4H0V0zm4 4v4h4V4H4z"
      fill={color}
    />
  </motion.svg>
);

export const PixelCheck = ({ size = 16, color = '#2ed573', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [0, 1] } : {}}
    transition={animate ? { duration: 0.3 } : {}}
  >
    <path
      d="M0 8h2v2H0V8zm2 2h2v2H2v-2zm2 2h2v2H4v-2zm2-2h2v2H6V8zm2-2h2v2H8V6zm2-2h2v2h-2V4zm2-2h2v2h-2V2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelHome = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, -1, 0] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity } : {}}
  >
    <path
      d="M6 0h4v2H6V0zM4 2h8v2H4V2zM2 4h12v2H2V4zM0 6h16v10H0V6zm2 2v6h12V8h-2v4H4V8H2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelUser = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.05, 1] } : {}}
    transition={animate ? { duration: 1.5, repeat: Infinity } : {}}
  >
    <path
      d="M4 0h8v2H4V0zM2 2h12v2H2V2zM2 4h2v2H2V4zm10 0h2v2h-2V4zM2 6h2v2H2V6zm10 0h2v2h-2V6zM4 8h8v2H4V8zM0 10h16v2H0v-2zM0 12h4v2H0v-2zm12 0h4v2h-4v-2zM0 14h6v2H0v-2zm10 0h6v2h-6v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelSearch = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { rotate: [0, 5, -5, 0] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity } : {}}
  >
    <path
      d="M2 0h6v2H2V0zM0 2h2v6h2V2h4v6h-2v2h2v2h2v2h2v2h-2v-2h-2v-2H4V8H2V2H0z"
      fill={color}
    />
  </motion.svg>
);

export const PixelMenu = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, 1, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M0 2h16v3H0V2zm0 5h16v2H0V7zm0 5h16v2H0v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelSettings = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { rotate: [0, 360] } : {}}
    transition={animate ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
  >
    <path
      d="M6 0h4v2h2v2h2v2h-2v2h2v2h-2v2h-2v2H6v-2H4v-2H2v-2h2V8H2V6h2V4h2V2h2V0zM6 6h4v4H6V6z"
      fill={color}
    />
  </motion.svg>
);

export const PixelMail = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.02, 1] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity } : {}}
  >
    <path
      d="M0 2h16v12H0V2zm2 2v8h12V4l-6 4-6-4zm2 0h8l-4 3-4-3z"
      fill={color}
    />
  </motion.svg>
);

export const PixelPhone = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { rotate: [0, 5, -5, 0] } : {}}
    transition={animate ? { duration: 3, repeat: Infinity } : {}}
  >
    <path
      d="M4 0h8v16H4V0zm2 2v12h4V2H6zm1 1h2v1H7V3zm0 11h2v1H7v-1z"
      fill={color}
    />
  </motion.svg>
);

export const PixelGithub = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.1, 1] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity } : {}}
  >
    <path
      d="M2 0h12v2H2V0zM0 2h2v12h2v2h4v-2h4v2h4v-2h2V2h-2v10h-2V8h-2v4H4V8H2v4H0V2zm6 6h4v2H6V8z"
      fill={color}
    />
  </motion.svg>
);

export const PixelLink = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { x: [0, 1, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M0 6h6v4H0V6zm10 0h6v4h-6V6zM6 4h4v8H6V4z"
      fill={color}
    />
  </motion.svg>
);

export const PixelDownload = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, 2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M6 0h4v8h2l-4 4-4-4h2V0zM0 14h16v2H0v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelUpload = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { y: [0, -2, 0] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M6 12h4V4h2L8 0 4 4h2v8zM0 14h16v2H0v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelPlay = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 1.1, 1] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M2 0h2v2H2V0zm2 2h2v2H4V2zm2 2h2v2H6V4zm2 2h2v2H8V6zm2 2h2v2h-2V8zm0 2h2v2h-2v-2zm-2 2h2v2H8v-2zm-2 2h2v2H6v-2zm-2 2h2v2H4v-2zm-2 0h2v2H2v-2z"
      fill={color}
    />
  </motion.svg>
);

export const PixelPause = ({ size = 16, color = '#4ade80', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { opacity: [1, 0.7, 1] } : {}}
    transition={animate ? { duration: 1, repeat: Infinity } : {}}
  >
    <path
      d="M2 0h4v16H2V0zm8 0h4v16h-4V0z"
      fill={color}
    />
  </motion.svg>
);

export const PixelStop = ({ size = 16, color = '#ff3838', animate = false, className = '' }: PixelIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    style={{ imageRendering: 'pixelated' }}
    animate={animate ? { scale: [1, 0.9, 1] } : {}}
    transition={animate ? { duration: 0.8, repeat: Infinity } : {}}
  >
    <path
      d="M0 0h16v16H0V0z"
      fill={color}
    />
  </motion.svg>
);

// Compound Icon Component
interface PixelIconSetProps {
  icons: Array<{
    name: string;
    icon: React.ComponentType<PixelIconProps>;
    props?: Partial<PixelIconProps>;
  }>;
  spacing?: number;
  direction?: 'horizontal' | 'vertical';
  animate?: boolean;
  className?: string;
}

export const PixelIconSet = ({ 
  icons, 
  spacing = 8, 
  direction = 'horizontal',
  animate = false,
  className = ''
}: PixelIconSetProps) => {
  return (
    <div 
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${className}`}
      style={{ gap: spacing }}
    >
      {icons.map(({ name, icon: Icon, props = {} }, index) => (
        <motion.div
          key={name}
          initial={animate ? { opacity: 0, scale: 0 } : {}}
          animate={animate ? { opacity: 1, scale: 1 } : {}}
          transition={animate ? { delay: index * 0.1, duration: 0.3 } : {}}
        >
          <Icon animate={animate} {...props} />
        </motion.div>
      ))}
    </div>
  );
};

// Icon Library Export
export const PixelIconLibrary = {
  ArrowRight: PixelArrowRight,
  ArrowLeft: PixelArrowLeft,
  ArrowUp: PixelArrowUp,
  ArrowDown: PixelArrowDown,
  Heart: PixelHeart,
  Star: PixelStar,
  Plus: PixelPlus,
  Minus: PixelMinus,
  Close: PixelClose,
  Check: PixelCheck,
  Home: PixelHome,
  User: PixelUser,
  Search: PixelSearch,
  Menu: PixelMenu,
  Settings: PixelSettings,
  Mail: PixelMail,
  Phone: PixelPhone,
  Github: PixelGithub,
  Link: PixelLink,
  Download: PixelDownload,
  Upload: PixelUpload,
  Play: PixelPlay,
  Pause: PixelPause,
  Stop: PixelStop
};