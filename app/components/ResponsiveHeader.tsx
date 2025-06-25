"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import EnhancedNavMenu from './EnhancedNavMenu'
import BreadcrumbNav from './BreadcrumbNav'
import CommandPalette from './CommandPalette'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useScrollDirection } from '@/app/hooks/useScrollDirection'
import LogoPW from './LogoPW'

interface ResponsiveHeaderProps {
  showBreadcrumbs?: boolean
  collapsible?: boolean
  className?: string
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  showBreadcrumbs = true,
  collapsible = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Use custom hook for smart scroll behavior
  const { scrollDirection, isScrolled, isAtTop } = useScrollDirection(50)

  // Add ref and effect after state declarations
  const headerRef = useRef<HTMLElement | null>(null)

  // Update CSS variable with current header height for layout spacing
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
    }

    // Update on mount and whenever layout changes
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [isCollapsed, isMobile, showBreadcrumbs])

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Determine if header should be visible
  const shouldHideHeader = !isAtTop && scrollDirection === 'down' && !isHovered && !isCollapsed

  // Simple header animation variants
  const headerVariants: Variants = {
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hidden: { 
      y: -120, 
      opacity: 0.7,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  // Simple backdrop blur and background styles
  const getHeaderStyles = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    
    if (isAtTop) {
      return `${baseClasses} bg-black/80 backdrop-blur-md border-b border-green-400/20`
    } else {
      return `${baseClasses} bg-black/80 backdrop-blur-md border-b border-green-400/20`
    }
  }

  return (
    <motion.header
      ref={headerRef}
      className={getHeaderStyles()}
      variants={headerVariants}
      initial="visible"
      animate={shouldHideHeader ? "hidden" : "visible"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
              className="overflow-hidden"
            >
              {/* Top row - Logo and main actions */}
              <div className="flex items-center justify-between py-4 sm:py-6">
                {/* Logo/Brand Area */}
                <div className="flex items-center space-x-3">
                  <LogoPW size={48} className="gyro-spin" />
                  
                  <h1 className="text-lg sm:text-xl font-pixel text-green-400">
                    IT FROM BIT
                  </h1>
                </div>

                {/* Right side actions */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <CommandPalette triggerOnly />
                  
                  {/* Collapse toggle for collapsible mode */}
                  {collapsible && (
                    <button
                      onClick={toggleCollapse}
                      className="p-3 sm:p-2 border border-green-400/30 rounded hover:border-green-400 hover:bg-green-400/10 transition-all duration-200 font-pixel text-xs tap-target"
                      aria-label={isCollapsed ? "Expand header" : "Collapse header"}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="pb-4">
                <EnhancedNavMenu />
              </div>

              {/* Breadcrumbs */}
              {showBreadcrumbs && (
                <div className="pb-4 border-t border-green-400/20 pt-4">
                  <BreadcrumbNav />
                </div>
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
              transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
              className="py-3 flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center space-x-2">
                <LogoPW size={28} />
                <span className="text-sm font-pixel text-green-400">PW</span>
              </div>

              <div className="flex items-center space-x-2">
                <CommandPalette triggerOnly className="w-32" />
                
                <button
                  onClick={toggleCollapse}
                  className="p-3 sm:p-1.5 border border-green-400/30 rounded hover:border-green-400 hover:bg-green-400/10 transition-all duration-200 tap-target"
                  aria-label="Expand header"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default ResponsiveHeader