'use client'

import { motion, Variants } from 'framer-motion'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'

interface PageHeaderProps {
  title: string
  subtitle?: string
  prefix?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  showAnimation?: boolean
  animationType?: 'matrix' | 'typing' | 'fade'
  animationSpeed?: number
  animationDelay?: number
}

export default function PageHeader({
  title,
  subtitle,
  prefix = '>',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  showAnimation = true,
  animationType = 'matrix',
  animationSpeed = 75,
  animationDelay = 300
}: PageHeaderProps) {
  
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const renderTitle = () => {
    const baseClasses = `text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-pixel text-green-400 whitespace-nowrap ${titleClassName}`
    
    if (!showAnimation) {
      return (
        <h1 className={`${baseClasses} pixel-head leading-tight`}>
          {prefix && <span className="text-white">{prefix} </span>}
          {title}
        </h1>
      )
    }

    switch (animationType) {
      case 'matrix':
        return (
          <h1 className={`${baseClasses} pixel-head leading-tight`}>
            {prefix && <span className="text-white">{prefix} </span>}
            <MatrixTextReveal 
              text={title}
              speed={animationSpeed}
              delay={animationDelay}
              scrambleDuration={250}
              className="inline-block whitespace-nowrap"
            />
          </h1>
        )
      
      case 'typing':
        return (
          <motion.h1 
            className={`${baseClasses} leading-tight`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay / 1000 }}
          >
            {prefix && <span className="text-white">{prefix} </span>}
            <TypewriterText text={title} />
          </motion.h1>
        )
      
      case 'fade':
      default:
        return (
          <motion.h1 
            className={`${baseClasses} leading-tight`}
            variants={itemVariants}
          >
            {prefix && <span className="text-white">{prefix} </span>}
            {title}
          </motion.h1>
        )
    }
  }

  return (
    <motion.div
      className={`text-center mt-2 sm:mt-3 mb-12 sm:mb-16 lg:mb-20 overflow-hidden px-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {renderTitle()}
      
      {subtitle && (
        <motion.p 
          className={`text-gray-400 font-mono text-sm sm:text-base md:text-lg mt-6 sm:mt-8 max-w-4xl mx-auto leading-relaxed px-4 ${subtitleClassName}`}
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

// Simple TypewriterText component for typing animation
function TypewriterText({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: 'auto' }}
      transition={{ duration: text.length * 0.1 }}
      className="inline-block overflow-hidden"
    >
      {text}
      <motion.span
        className="inline-block w-1 h-8 bg-green-400 ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.span>
  )
} 