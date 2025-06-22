"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedNavMenu from './EnhancedNavMenu'
import BreadcrumbNav from './BreadcrumbNav'
import CommandPalette from './CommandPalette'
import ColorSystemToggle from './ColorSystemToggle'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useScrollDirection } from '@/app/hooks/useScrollDirection'

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
  const [isMobile, setIsMobile] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Use custom hook for smart scroll behavior
  const { scrollDirection, isScrolled, isAtTop } = useScrollDirection(50)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-collapse on mobile when scrolling down
  useEffect(() => {
    if (isMobile && collapsible && scrollDirection === 'down' && isScrolled && !isCollapsed) {
      setIsCollapsed(true)
    }
  }, [isMobile, collapsible, scrollDirection, isScrolled, isCollapsed])

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

  // Determine if header should be visible
  const shouldHideHeader = !isAtTop && scrollDirection === 'down' && !isHovered && !isCollapsed

  // Enhanced header animation variants
  const headerVariants = {
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    hidden: { 
      y: -120, 
      opacity: 0.7,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
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
        type: "spring",
        stiffness: 150,
        damping: 12
      }
    }
  }

  // Enhanced backdrop blur and background styles
  const getHeaderStyles = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    
    if (isAtTop) {
      return `${baseClasses} bg-transparent backdrop-blur-none border-transparent`
    } else {
      return `${baseClasses} bg-black/30 backdrop-blur-xl border-b border-green-400/20 shadow-lg shadow-black/20`
    }
  }

  // Pixel scanning line effect
  const PixelScanline = () => (
    <motion.div
      className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"
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
        boxShadow: '0 0 20px rgba(74, 222, 128, 0.8)',
        transformOrigin: 'left'
      }}
    />
  )

  return (
    <motion.header
      className={getHeaderStyles()}
      variants={headerVariants}
      initial="visible"
      animate={shouldHideHeader ? "hidden" : "visible"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Enhanced glow effect for scrolled state */}
      {isScrolled && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-green-400/5 via-transparent to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Pixel scanning line */}
      <PixelScanline />
      
      {/* Subtle grid overlay when scrolled */}
      {isScrolled && (
        <motion.div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(74, 222, 128, 0.3) 20px,
                rgba(74, 222, 128, 0.3) 21px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                rgba(74, 222, 128, 0.3) 20px,
                rgba(74, 222, 128, 0.3) 21px
              )
            `
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Main Header Content with smooth animations */}
        <AnimatePresence>
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
                duration: 0.4, 
                ease: 'easeInOut',
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="overflow-hidden"
            >
              {/* Top row - Logo and main actions */}
              <motion.div 
                className="flex items-center justify-between py-4 sm:py-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Logo/Brand Area with enhanced pixel effect */}
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="relative"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: hasAnimated ? [0, 360, 0] : 0 }}
                    transition={{ duration: 3, delay: 2, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-green-400 pixel-border relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <div className="absolute inset-1 bg-black pixel-border" />
                      <div className="absolute inset-2 bg-green-400" />
                    </div>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-lg sm:text-xl font-pixel text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    PIXEL WISDOM
                  </motion.h1>
                </motion.div>

                {/* Right side actions */}
                <motion.div 
                  className="flex items-center space-x-3 sm:space-x-4"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CommandPalette triggerOnly />
                  <ColorSystemToggle />
                  
                  {/* Collapse toggle for collapsible mode */}
                  {collapsible && (
                    <motion.button
                      onClick={toggleCollapse}
                      className="p-2 border border-green-400/30 rounded hover:border-green-400 hover:bg-green-400/10 transition-all duration-200 font-pixel text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isCollapsed ? "Expand header" : "Collapse header"}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>

              {/* Navigation Menu */}
              <motion.div 
                className="pb-4"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <EnhancedNavMenu />
              </motion.div>

              {/* Breadcrumbs */}
              {showBreadcrumbs && (
                <motion.div 
                  className="pb-4 border-t border-green-400/20 pt-4"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <BreadcrumbNav />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State */}
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              key="collapsed"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="py-3 flex items-center justify-between overflow-hidden"
            >
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-6 h-6 bg-green-400 pixel-border">
                  <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500" />
                </div>
                <span className="text-sm font-pixel text-green-400">PW</span>
              </motion.div>

                             <motion.div 
                 className="flex items-center space-x-2"
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.1 }}
               >
                 <CommandPalette triggerOnly className="w-32" />
                 <ColorSystemToggle compact />
                 
                 <motion.button
                   onClick={toggleCollapse}
                   className="p-1.5 border border-green-400/30 rounded hover:border-green-400 hover:bg-green-400/10 transition-all duration-200"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   aria-label="Expand header"
                 >
                   <ChevronDown className="w-3 h-3" />
                 </motion.button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom border glow effect */}
      {isScrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      )}
    </motion.header>
  )
}

export default ResponsiveHeader