'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface PixelButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PixelButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  className = ''
}: PixelButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variants = {
    primary: 'bg-retro-green text-black border-retro-green hover:bg-green-300',
    secondary: 'bg-gray-700 text-retro-green border-gray-600 hover:bg-gray-600',
    ghost: 'bg-transparent text-retro-green border-retro-green hover:bg-retro-green hover:text-black',
    danger: 'bg-red-600 text-white border-red-500 hover:bg-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-8',
    md: 'px-4 py-2 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
    }, 600);
    
    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden font-pixel text-center
        border-2 transition-all duration-150 ease-out
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        pixel-perfect-border
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? 'none' : '2px 2px 0 currentColor'
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        x: disabled ? 0 : 1,
        y: disabled ? 0 : 1
      }}
      style={{
        imageRendering: 'pixelated'
      } as React.CSSProperties}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 2,
              top: ripple.y - 2,
              width: 4,
              height: 4
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PixelSpinner size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
        </motion.div>
      )}

      {/* Button content */}
      <motion.span
        className={loading ? 'opacity-0' : 'opacity-100'}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

interface PixelCardProps {
  children: React.ReactNode;
  hover3D?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export const PixelCard = ({ children, hover3D = true, glowEffect = false, className = '' }: PixelCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative bg-gray-900 border-2 border-retro-green p-4
        pixel-perfect-border ${glowEffect ? 'pixel-glow-hover' : ''}
        ${className}
      `}
      style={{
        rotateX: hover3D ? rotateX : 0,
        rotateY: hover3D ? rotateY : 0,
        transformStyle: 'preserve-3d',
        imageRendering: 'pixelated'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

interface PixelInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const PixelInput = ({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  disabled = false,
  error = false,
  className = ''
}: PixelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setHasContent(!!value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-gray-900 border-2 text-retro-green font-mono
          placeholder-gray-500 transition-all duration-200
          ${error ? 'border-red-500' : isFocused ? 'border-retro-green' : 'border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          pixel-perfect-border
        `}
        style={{
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Animated placeholder */}
      <AnimatePresence>
        {placeholder && !hasContent && (
          <motion.label
            className={`
              absolute left-3 pointer-events-none font-mono text-sm
              ${isFocused ? 'text-retro-green' : 'text-gray-500'}
            `}
            initial={{ y: 8, opacity: 0.7 }}
            animate={{ 
              y: isFocused ? -20 : 8, 
              opacity: isFocused ? 1 : 0.7,
              scale: isFocused ? 0.85 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {placeholder}
          </motion.label>
        )}
      </AnimatePresence>

      {/* Focus indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-retro-green"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

interface PixelSpinnerProps {
  size?: number;
  color?: string;
}

export const PixelSpinner = ({ size = 16, color = 'currentColor' }: PixelSpinnerProps) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1"
          style={{
            backgroundColor: color,
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transform: `rotate(${i * 45}deg) translate(${size / 3}px, -0.5px)`,
            imageRendering: 'pixelated'
          }}
          animate={{
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </motion.div>
  );
};

interface PixelProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

export const PixelProgressBar = ({ 
  progress, 
  showPercentage = true, 
  height = 8,
  color = '#4ade80',
  backgroundColor = '#374151',
  animated = true
}: PixelProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="relative w-full">
      <div 
        className="w-full border border-gray-600 pixel-perfect-border"
        style={{ 
          height: height,
          backgroundColor,
          imageRendering: 'pixelated'
        }}
      >
        <motion.div
          className="h-full"
          style={{ 
            backgroundColor: color,
            imageRendering: 'pixelated'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
      
      {showPercentage && (
        <motion.div 
          className="absolute -top-6 right-0 text-xs font-mono text-retro-green"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(clampedProgress)}%
        </motion.div>
      )}
    </div>
  );
};

interface PixelToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
}

export const PixelToggle = ({ 
  checked, 
  onChange, 
  size = 'md', 
  disabled = false,
  label 
}: PixelToggleProps) => {
  const sizes = {
    sm: { width: 32, height: 16, knob: 12 },
    md: { width: 44, height: 20, knob: 16 },
    lg: { width: 56, height: 24, knob: 20 }
  };

  const { width, height, knob } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <motion.button
        className={`
          relative border-2 transition-all duration-200
          ${checked ? 'bg-retro-green border-retro-green' : 'bg-gray-700 border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          pixel-perfect-border
        `}
        style={{ 
          width, 
          height,
          imageRendering: 'pixelated'
        }}
        onClick={() => !disabled && onChange(!checked)}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <motion.div
          className={`
            absolute top-0.5 w-3 h-3 border
            ${checked ? 'bg-black border-black' : 'bg-retro-green border-retro-green'}
          `}
          style={{
            width: knob - 4,
            height: knob - 4,
            imageRendering: 'pixelated'
          }}
          animate={{
            x: checked ? width - knob : 2
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      
      {label && (
        <span className="font-mono text-sm text-retro-green">
          {label}
        </span>
      )}
    </div>
  );
};

export const PixelTooltip = ({ 
  children, 
  content, 
  position = 'top' 
}: { 
  children: React.ReactNode; 
  content: string; 
  position?: 'top' | 'bottom' | 'left' | 'right';
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-50 px-2 py-1 text-xs font-mono
              bg-gray-900 text-retro-green border border-retro-green
              pixel-perfect-border whitespace-nowrap
              ${positions[position]}
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{ imageRendering: 'pixelated' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};