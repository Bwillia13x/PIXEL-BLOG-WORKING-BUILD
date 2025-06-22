"use client"

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'pixelFadeIn' | 'scaleIn' | 'slideInUp'
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  triggerOnce?: boolean
}

const animationVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6
      }
    }
  },
  fadeInLeft: {
    hidden: { 
      opacity: 0, 
      x: -30,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6
      }
    }
  },
  fadeInRight: {
    hidden: { 
      opacity: 0, 
      x: 30,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },
  pixelFadeIn: {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px) brightness(0.5)",
      background: "radial-gradient(circle, rgba(74,222,128,0) 0%, rgba(74,222,128,0.1) 50%, rgba(74,222,128,0) 100%)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px) brightness(1)",
      background: "radial-gradient(circle, rgba(74,222,128,0) 0%, rgba(74,222,128,0) 50%, rgba(74,222,128,0) 100%)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        opacity: { duration: 0.4 },
        scale: { duration: 0.6, type: "spring", stiffness: 100 },
        filter: { duration: 0.5 }
      }
    }
  },
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  },
  slideInUp: {
    hidden: { 
      opacity: 0, 
      y: 50,
      clipPath: "inset(100% 0 0 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        clipPath: { duration: 0.6, ease: "easeInOut" }
      }
    }
  }
}

export default function ScrollReveal({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  triggerOnce = true
}: ScrollRevealProps) {
  const { ref, isInView } = useScrollReveal({ 
    threshold, 
    triggerOnce,
    delay: delay * 1000 // Convert to milliseconds
  })

  const baseVariant = animationVariants[animation].visible
  const hasTransition = typeof baseVariant === 'object' && baseVariant !== null && 'transition' in baseVariant
  
  const variants = {
    ...animationVariants[animation],
    visible: {
      ...baseVariant,
      transition: {
        ...(hasTransition ? (baseVariant as any).transition : {}),
        duration
      }
    }
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Higher-order component for easy wrapping
export function withScrollReveal<T extends object>(
  Component: React.ComponentType<T>,
  revealProps?: Partial<ScrollRevealProps>
) {
  return function WrappedComponent(props: T) {
    return (
      <ScrollReveal {...revealProps}>
        <Component {...props} />
      </ScrollReveal>
    )
  }
}

// Specialized components for common use cases
export function PixelReveal({ children, className = '', delay = 0 }: { 
  children: ReactNode
  className?: string
  delay?: number 
}) {
  return (
    <ScrollReveal 
      animation="pixelFadeIn" 
      delay={delay}
      className={className}
    >
      {children}
    </ScrollReveal>
  )
}

export function CardReveal({ children, className = '', delay = 0 }: { 
  children: ReactNode
  className?: string
  delay?: number 
}) {
  return (
    <ScrollReveal 
      animation="scaleIn" 
      delay={delay}
      duration={0.7}
      className={className}
    >
      {children}
    </ScrollReveal>
  )
}

export function TextReveal({ children, className = '', delay = 0 }: { 
  children: ReactNode
  className?: string
  delay?: number 
}) {
  return (
    <ScrollReveal 
      animation="slideInUp" 
      delay={delay}
      duration={0.8}
      className={className}
    >
      {children}
    </ScrollReveal>
  )
}