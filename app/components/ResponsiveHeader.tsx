"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavMenu from './NavMenu'
import BreadcrumbNav from './BreadcrumbNav'
import ThemeToggle from './ThemeToggle'
import QuickSearch from './QuickSearch'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ResponsiveHeaderProps {
  showBreadcrumbs?: boolean
  collapsible?: boolean
  className?: string
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  showBreadcrumbs = true,
  collapsible = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100
      setScrolled(isScrolled)
      
      // Auto-collapse on mobile when scrolling
      if (isMobile && collapsible && isScrolled && !isCollapsed) {
        setIsCollapsed(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, collapsible, isCollapsed])

  // Trigger header animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Enhanced header animation variants
  const headerVariants = {
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1,
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      y: -20, 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 12
      }
    }
  }

  // Pixel scanning line effect
  const PixelScanline = () => (
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 bg-green-400 opacity-80"
      initial={{ scaleX: 0, x: '-100%' }}
      animate={{ 
        scaleX: hasAnimated ? [0, 1, 1, 0] : 0,
        x: hasAnimated ? ['-100%', '-100%', '100%', '100%'] : '-100%'
      }}
      transition={{
        duration: 2,
        delay: 0.5,
        ease: "easeInOut"
      }}
      style={{
        boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
        transformOrigin: 'left'
      }}
    />
  )

  return (
    <motion.header
      className={`relative z-20 transition-all duration-300 overflow-hidden ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-green-400/30' : 'bg-gray-900/50'
      } ${className}`}
      variants={headerVariants}
      initial="visible"
      animate="visible"
      // Force visibility
      style={{ 
        opacity: 1,
        transform: 'none',
        display: 'block'
      }}
    >
      {/* Pixel scanning line */}
      <PixelScanline />
      
      {/* Pixel border animation */}
      <motion.div
        className="absolute inset-0 border border-green-400/20"
        initial={{ 
          borderColor: 'rgba(74, 222, 128, 0)',
          boxShadow: '0 0 0 rgba(74, 222, 128, 0)'
        }}
        animate={{ 
          borderColor: hasAnimated ? 'rgba(74, 222, 128, 0.2)' : 'rgba(74, 222, 128, 0)',
          boxShadow: hasAnimated ? '0 0 20px rgba(74, 222, 128, 0.1)' : '0 0 0 rgba(74, 222, 128, 0)'
        }}
        transition={{ duration: 1, delay: 1 }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Main Header Content with smooth animations */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded"
              initial={{ 
                height: 0, 
                opacity: 0, 
                y: -20,
                scale: 0.95
              }}
              animate={{ 
                height: 'auto', 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                height: 0, 
                opacity: 0, 
                y: -20,
                scale: 0.95
              }}
              transition={{ 
                duration: 0.5, 
                ease: 'easeInOut',
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 }
              }}
              className="overflow-hidden"
            >
              {/* Pixel grid background effect */}
              <motion.div
                className="absolute inset-0 opacity-5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hasAnimated ? 0.05 : 0 }}
                transition={{ duration: 2, delay: 1.5 }}
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 10px,
                      rgba(74, 222, 128, 0.3) 10px,
                      rgba(74, 222, 128, 0.3) 11px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 10px,
                      rgba(74, 222, 128, 0.3) 10px,
                      rgba(74, 222, 128, 0.3) 11px
                    )
                  `
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Section */}
        <motion.div
          layout
          className={`${isCollapsed ? 'py-2' : 'py-4'} transition-all duration-300 relative z-10`}
          variants={itemVariants}
        >
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <motion.div
              variants={itemVariants}
              className="mb-4"
            >
              <BreadcrumbNav className="justify-center" />
            </motion.div>
          )}

          {/* Main Navigation */}
          <motion.div
            variants={itemVariants}
          >
            <NavMenu />
          </motion.div>

          {/* Quick Search */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex justify-center"
          >
            <QuickSearch className="max-w-md w-full" />
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex justify-center"
          >
            <ThemeToggle />
          </motion.div>
        </motion.div>

        {/* Enhanced Collapse Toggle Button */}
        {collapsible && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center pb-2"
          >
            <motion.button
              onClick={toggleCollapse}
              className="group relative flex items-center px-4 py-2 text-xs font-mono text-gray-400 hover:text-green-400 transition-all duration-300 rounded-lg hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden"
              aria-label={isCollapsed ? 'Expand header' : 'Collapse header'}
              aria-expanded={!isCollapsed}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(74, 222, 128, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleCollapse()
                }
              }}
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {/* Enhanced icon animation */}
              <motion.div
                animate={{ 
                  rotate: isCollapsed ? 180 : 0,
                  scale: isCollapsed ? 1.1 : 1
                }}
                transition={{ 
                  duration: 0.4, 
                  type: "spring", 
                  stiffness: 300,
                  damping: 20
                }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 mr-2 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 mr-2 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]" />
                  )}
                </motion.div>
              </motion.div>
              
              <motion.span 
                className="font-pixel text-xs relative z-10"
                animate={{
                  color: isCollapsed ? "#22c55e" : "#9ca3af"
                }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? 'EXPAND' : 'COLLAPSE'}
              </motion.span>
              
              {/* Pixel decoration */}
              <motion.div
                className="absolute top-1 right-1 w-1 h-1 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Enhanced border animation */}
      {scrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent origin-center"
        />
      )}

      {/* Subtle pixel flicker effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light"
        animate={{
          opacity: hasAnimated ? [0, 0.02, 0, 0.01, 0] : 0
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          delay: 2
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.05) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(74, 222, 128, 0.08) 0%, transparent 50%)`
        }}
      />
    </motion.header>
  )
}

export default ResponsiveHeader