'use client'

import { useState, forwardRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface MobileOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  onPress?: () => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  hapticFeedback?: boolean
  swipeEnabled?: boolean
  pressDepth?: number
  className?: string
}

export const MobileOptimizedButton = forwardRef<HTMLButtonElement, MobileOptimizedButtonProps>(({
  children,
  onClick,
  onPress,
  onSwipe,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  swipeEnabled = false,
  pressDepth = 4,
  className = ''
}, ref) => {
  const [isPressed, setIsPressed] = useState(false)
  const [touchStartTime, setTouchStartTime] = useState(0)
  
  // Motion values for smooth animations
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotateX = useTransform(y, [-20, 20], [5, -5])
  
  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || typeof window === 'undefined') return
    
    try {
      if ('vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30]
        }
        navigator.vibrate(patterns[type])
      }
    } catch {
      // Vibration not supported, ignore
    }
  }

  // Touch event handlers
  const handleTouchStart = () => {
    setIsPressed(true)
    setTouchStartTime(Date.now())
    triggerHaptic('light')
    
    scale.set(0.95)
    y.set(pressDepth)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    const touchDuration = Date.now() - touchStartTime
    
    scale.set(1)
    y.set(0)
    
    // Differentiate between tap and press
    if (touchDuration < 200 && onClick) {
      triggerHaptic('medium')
      onClick()
    } else if (touchDuration >= 200 && onPress) {
      triggerHaptic('heavy')
      onPress()
    }
  }

  // Swipe gesture handler
  const handlePanEnd = (_event: unknown, info: PanInfo) => {
    if (!swipeEnabled || !onSwipe) return
    
    const { offset, velocity } = info
    const threshold = 50
    const velocityThreshold = 500
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > velocityThreshold) {
      const direction = offset.x > 0 ? 'right' : 'left'
      triggerHaptic('medium')
      onSwipe(direction)
    } else if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > velocityThreshold) {
      const direction = offset.y > 0 ? 'down' : 'up'
      triggerHaptic('medium')
      onSwipe(direction)
    }
  }

  // Size configurations with proper touch targets (min 44px)
  const sizeClasses = {
    sm: 'min-h-[44px] min-w-[44px] px-4 py-2 text-sm',
    md: 'min-h-[48px] min-w-[48px] px-6 py-3 text-base',
    lg: 'min-h-[52px] min-w-[52px] px-8 py-4 text-lg'
  }

  // Variant styles
  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-black border-2 border-green-400 shadow-lg',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-green-400 border-2 border-gray-600',
    ghost: 'bg-transparent hover:bg-green-400/10 text-green-400 border-2 border-transparent hover:border-green-400/30',
    outline: 'bg-transparent hover:bg-green-400/5 text-green-400 border-2 border-green-400/50 hover:border-green-400'
  }

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer active:cursor-grabbing'

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`
        relative font-pixel rounded-lg transition-all duration-200 ease-out
        flex items-center justify-center gap-2
        select-none touch-manipulation
        focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:ring-offset-2 focus:ring-offset-gray-900
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${className}
      `}
      style={{ 
        y, 
        scale, 
        rotateX,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => {
        setIsPressed(false)
        scale.set(1)
        y.set(0)
      }}
      onPanEnd={swipeEnabled ? handlePanEnd : undefined}
      drag={swipeEnabled ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {/* Press depth shadow effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          variant === 'primary' ? 'bg-green-600' : 
          variant === 'secondary' ? 'bg-gray-900' :
          'bg-green-400/20'
        }`}
        style={{
          y: 2,
          zIndex: -1,
          opacity: isPressed ? 0.5 : 0.8
        }}
        animate={{
          y: isPressed ? 1 : 2,
          opacity: isPressed ? 0.3 : 0.6
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-white/20"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {Icon && iconPosition === 'left' && (
          <motion.div
            animate={{ rotate: loading ? 360 : 0 }}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </motion.div>
        )}
        
        {loading ? (
          <motion.div
            className={`rounded-full border-2 border-current border-t-transparent ${
              size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <span className="whitespace-nowrap">{children}</span>
        )}
        
        {Icon && iconPosition === 'right' && !loading && (
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`} />
        )}
      </div>

      {/* Touch feedback overlay */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPressed ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  )
})

MobileOptimizedButton.displayName = 'MobileOptimizedButton'

// Specialized mobile navigation button
export function MobileNavButton({
  children,
  isActive = false,
  notificationCount,
  ...props
}: Omit<MobileOptimizedButtonProps, 'variant'> & {
  isActive?: boolean
  notificationCount?: number
}) {
  return (
    <div className="relative">
      <MobileOptimizedButton
        variant={isActive ? 'primary' : 'ghost'}
        size="lg"
        className={`relative ${isActive ? 'shadow-lg shadow-green-400/30' : ''}`}
        {...props}
      >
        {children}
      </MobileOptimizedButton>
      
      {/* Notification badge */}
      {notificationCount && notificationCount > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center border-2 border-gray-900"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </motion.div>
      )}
    </div>
  )
}

// Floating action button for mobile
export function MobileFloatingButton({
  position = 'bottom-right',
  ...props
}: MobileOptimizedButtonProps & {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6'
  }

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <MobileOptimizedButton
        variant="primary"
        size="lg"
        className="rounded-full shadow-2xl shadow-green-400/30 min-w-[56px] min-h-[56px]"
        {...props}
      />
    </div>
  )
}

export default MobileOptimizedButton