"use client"

import { motion, MotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface PixelButtonProps extends Omit<MotionProps, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  pixelEffect?: boolean
  glowEffect?: boolean
  pressEffect?: boolean
  className?: string
  onClick?: () => void
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

const PixelButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, PixelButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    fullWidth = false,
    pixelEffect = true,
    glowEffect = true,
    pressEffect = true,
    className = '',
    onClick,
    href,
    target,
    type = 'button',
    ...motionProps
  }, ref) => {
    
    const sizeConfig = {
      sm: {
        padding: 'px-3 py-2',
        text: 'text-xs',
        icon: 'w-3 h-3',
        gap: 'space-x-1',
        shadow: '2px 2px 0'
      },
      md: {
        padding: 'px-4 py-3',
        text: 'text-sm',
        icon: 'w-4 h-4',
        gap: 'space-x-2',
        shadow: '3px 3px 0'
      },
      lg: {
        padding: 'px-6 py-4',
        text: 'text-base',
        icon: 'w-5 h-5',
        gap: 'space-x-3',
        shadow: '4px 4px 0'
      },
      xl: {
        padding: 'px-8 py-5',
        text: 'text-lg',
        icon: 'w-6 h-6',
        gap: 'space-x-4',
        shadow: '5px 5px 0'
      }
    }

    const variantConfig = {
      primary: {
        base: 'bg-green-600 text-black border-green-400',
        hover: 'hover:bg-green-500',
        shadow: 'shadow-green-800',
        glow: 'rgba(74, 222, 128, 0.4)',
        focus: 'focus:ring-green-400/50'
      },
      secondary: {
        base: 'bg-gray-700 text-green-400 border-gray-600',
        hover: 'hover:bg-gray-600 hover:border-green-400/50',
        shadow: 'shadow-gray-900',
        glow: 'rgba(74, 222, 128, 0.2)',
        focus: 'focus:ring-gray-400/50'
      },
      ghost: {
        base: 'bg-transparent text-green-400 border-green-400/30',
        hover: 'hover:bg-green-400/10 hover:border-green-400',
        shadow: 'shadow-green-800/30',
        glow: 'rgba(74, 222, 128, 0.15)',
        focus: 'focus:ring-green-400/30'
      },
      danger: {
        base: 'bg-red-600 text-white border-red-400',
        hover: 'hover:bg-red-500',
        shadow: 'shadow-red-800',
        glow: 'rgba(239, 68, 68, 0.4)',
        focus: 'focus:ring-red-400/50'
      },
      success: {
        base: 'bg-emerald-600 text-white border-emerald-400',
        hover: 'hover:bg-emerald-500',
        shadow: 'shadow-emerald-800',
        glow: 'rgba(16, 185, 129, 0.4)',
        focus: 'focus:ring-emerald-400/50'
      }
    }

    const config = sizeConfig[size]
    const colors = variantConfig[variant]

    const baseClasses = [
      'font-pixel',
      'border-2',
      'rounded-none',
      'relative',
      'overflow-hidden',
      'transition-all',
      'duration-200',
      'ease-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-green-400',
      'focus:ring-offset-2',
      'focus:ring-offset-gray-900',
      'touch-manipulation',
      'select-none',
      'active:outline-none',
      config.padding,
      config.text,
      colors.base,
      colors.hover,
      colors.focus,
      fullWidth ? 'w-full' : 'inline-flex',
      'items-center',
      'justify-center',
      config.gap,
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      className
    ].filter(Boolean).join(' ')

    const shadowStyle = {
      boxShadow: disabled ? 'none' : `${config.shadow} ${colors.shadow}`
    }

    const buttonContent = (
      <>
        {/* Background effects */}
        {pixelEffect && !disabled && (
          <motion.div
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%)
              `,
              backgroundSize: '4px 4px',
              backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
            }}
            animate={{
              opacity: [0, 0.3, 0],
              backgroundPosition: [
                '0 0, 0 2px, 2px -2px, -2px 0px',
                '4px 4px, 4px 6px, 6px 2px, 2px 4px'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear" as const
            }}
          />
        )}

        {/* Glow effect */}
        {glowEffect && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-none"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`
            }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {Icon && iconPosition === 'left' && !loading && (
            <Icon className={config.icon} />
          )}
          
          {loading ? (
            <motion.div
              className={`border-2 border-current border-t-transparent rounded-full ${
                size === 'sm' ? 'w-3 h-3' : 
                size === 'md' ? 'w-4 h-4' :
                size === 'lg' ? 'w-5 h-5' : 'w-6 h-6'
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
            />
          ) : (
            children
          )}
          
          {Icon && iconPosition === 'right' && !loading && (
            <Icon className={config.icon} />
          )}
        </span>

        {/* Press effect dots */}
        {pressEffect && !disabled && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-current rounded-full opacity-0"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                whileTap={{
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  x: [0, (i - 1) * 15],
                  y: [0, Math.sin(i * 2) * 10]
                }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              />
            ))}
          </div>
        )}
      </>
    )

    const motionConfig = {
      initial: { scale: 1 },
      whileHover: disabled ? {} : { 
        scale: 1.02,
        y: -1,
        ...(typeof motionProps.whileHover === 'object' && motionProps.whileHover !== null ? motionProps.whileHover : {})
      },
      whileTap: disabled ? {} : pressEffect ? { 
        scale: 0.98,
        y: 1,
        boxShadow: `1px 1px 0 ${colors.shadow}`,
        ...(typeof motionProps.whileTap === 'object' && motionProps.whileTap !== null ? motionProps.whileTap : {})
      } : motionProps.whileTap,
      transition: { duration: 0.1 },
      ...motionProps
    }

    if (href && !disabled) {
      return (
        <motion.a
          ref={ref as any}
          href={href}
          target={target}
          className={baseClasses}
          style={shadowStyle}
          {...motionConfig}
        >
          {buttonContent}
        </motion.a>
      )
    }

    return (
      <motion.button
        ref={ref as any}
        type={type}
        disabled={disabled || loading}
        onClick={disabled || loading ? undefined : onClick}
        className={baseClasses}
        style={shadowStyle}
        {...motionConfig}
      >
        {buttonContent}
      </motion.button>
    )
  }
)

PixelButton.displayName = 'PixelButton'

export default PixelButton

// Specialized button variants for common use cases
export function PrimaryButton(props: Omit<PixelButtonProps, 'variant'>) {
  return <PixelButton variant="primary" {...props} />
}

export function SecondaryButton(props: Omit<PixelButtonProps, 'variant'>) {
  return <PixelButton variant="secondary" {...props} />
}

export function GhostButton(props: Omit<PixelButtonProps, 'variant'>) {
  return <PixelButton variant="ghost" {...props} />
}

export function DangerButton(props: Omit<PixelButtonProps, 'variant'>) {
  return <PixelButton variant="danger" {...props} />
}

export function SuccessButton(props: Omit<PixelButtonProps, 'variant'>) {
  return <PixelButton variant="success" {...props} />
}

// Icon button variant
export function IconButton({ 
  icon: Icon, 
  'aria-label': ariaLabel,
  size = 'md',
  ...props 
}: Omit<PixelButtonProps, 'children'> & { 
  icon: LucideIcon
  'aria-label': string
}) {
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  
  return (
    <PixelButton
      size={size}
      aria-label={ariaLabel}
      className="aspect-square !p-2"
      {...props}
    >
      <Icon className={iconSize[size]} />
    </PixelButton>
  )
}