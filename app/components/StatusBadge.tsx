"use client"

import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        icon: '✅',
        label: 'Completed',
        glowColor: 'rgba(16, 185, 129, 0.6)'
      }
    case 'in-progress':
      return {
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        icon: '🚧',
        label: 'In Progress',
        glowColor: 'rgba(245, 158, 11, 0.6)'
      }
    case 'planning':
      return {
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        icon: '📋',
        label: 'Planning',
        glowColor: 'rgba(59, 130, 246, 0.6)'
      }
    case 'archived':
      return {
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgba(107, 114, 128, 0.4)',
        icon: '📦',
        label: 'Archived',
        glowColor: 'rgba(107, 114, 128, 0.6)'
      }
    default:
      return {
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgba(107, 114, 128, 0.4)',
        icon: '❓',
        label: 'Unknown',
        glowColor: 'rgba(107, 114, 128, 0.6)'
      }
  }
}

const getSizeConfig = (size: string) => {
  switch (size) {
    case 'sm':
      return {
        padding: 'px-2 py-1',
        fontSize: 'text-xs',
        iconSize: 'text-xs',
        spacing: 'space-x-1'
      }
    case 'lg':
      return {
        padding: 'px-4 py-2',
        fontSize: 'text-sm',
        iconSize: 'text-sm',
        spacing: 'space-x-2'
      }
    default: // md
      return {
        padding: 'px-3 py-1.5',
        fontSize: 'text-xs',
        iconSize: 'text-xs',
        spacing: 'space-x-1.5'
      }
  }
}

export default function StatusBadge({ 
  status, 
  size = 'md', 
  animated = true, 
  className = '' 
}: StatusBadgeProps) {
  const statusConfig = getStatusConfig(status)
  const sizeConfig = getSizeConfig(size)

  const pulseAnimation = status === 'in-progress' ? {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    boxShadow: [
      `0 0 0 rgba(245, 158, 11, 0)`,
      `0 0 8px ${statusConfig.glowColor}`,
      `0 0 0 rgba(245, 158, 11, 0)`
    ]
  } : status === 'completed' ? {
    scale: [1, 1.02, 1],
    boxShadow: [
      `0 0 0 ${statusConfig.glowColor}`,
      `0 0 4px ${statusConfig.glowColor}`,
      `0 0 0 ${statusConfig.glowColor}`
    ]
  } : {}

  const iconAnimation = status === 'in-progress' ? {
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1]
  } : status === 'completed' ? {
    scale: [1, 1.2, 1],
    rotate: [0, 10, 0]
  } : status === 'planning' ? {
    y: [0, -1, 0]
  } : {}

  return (
    <motion.div
      className={`
        flex items-center ${sizeConfig.spacing} ${sizeConfig.padding} 
        rounded-full backdrop-blur-sm font-mono ${sizeConfig.fontSize} 
        border transition-all duration-300 relative overflow-hidden
        ${className}
      `}
      style={{
        backgroundColor: statusConfig.bgColor,
        color: statusConfig.color,
        borderColor: statusConfig.borderColor
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={animated ? { 
        opacity: 1, 
        scale: 1,
        ...pulseAnimation
      } : { opacity: 1, scale: 1 }}
      transition={animated ? {
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        ...(status === 'in-progress' && {
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }),
        ...(status === 'completed' && {
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        })
      } : { duration: 0.3 }}
      whileHover={animated ? {
        scale: 1.05,
        boxShadow: `0 0 12px ${statusConfig.glowColor}`,
        transition: { duration: 0.2 }
      } : undefined}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${statusConfig.glowColor} 0%, transparent 70%)`
        }}
        initial={{ opacity: 0 }}
        animate={animated && status === 'in-progress' ? {
          opacity: [0, 0.3, 0]
        } : { opacity: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated icon */}
      <motion.span 
        className={`${sizeConfig.iconSize} relative z-10`}
        animate={animated ? iconAnimation : {}}
        transition={animated ? {
          duration: status === 'in-progress' ? 1.5 : status === 'completed' ? 2 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {statusConfig.icon}
      </motion.span>
      
      {/* Status text */}
      <motion.span 
        className="relative z-10 font-pixel"
        initial={animated ? { opacity: 0, x: -5 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={animated ? { duration: 0.3, delay: 0.1 } : {}}
      >
        {statusConfig.label}
      </motion.span>
      
      {/* Shimmer effect for completed status */}
      {status === 'completed' && animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Pixel dots for in-progress */}
      {status === 'in-progress' && animated && (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 h-0.5 bg-current rounded-full inline-block ml-0.5"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Specialized variants for common use cases
export function CompletedBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return <StatusBadge status="completed" size={size} className={className} />
}

export function InProgressBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return <StatusBadge status="in-progress" size={size} className={className} />
}

export function PlanningBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return <StatusBadge status="planning" size={size} className={className} />
}

export function ArchivedBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return <StatusBadge status="archived" size={size} className={className} />
}