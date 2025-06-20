"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RainingCharacters from './RainingCharacters'
import BlinkingCursor from './BlinkingCursor'
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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <motion.header
      className={`relative z-20 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-green-400/30' : ''
      } ${className}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Content */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Hero Section */}
              <div className="py-4 sm:py-6 lg:py-8 flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full"
                >
                  <RainingCharacters />
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-4 flex items-center justify-center"
                >
                  <p className="text-lg sm:text-xl text-center font-retro flex items-center">
                    <BlinkingCursor />
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Section */}
        <motion.div
          layout
          className={`${isCollapsed ? 'py-2' : 'py-4'} transition-all duration-300`}
        >
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <BreadcrumbNav className="justify-center" />
            </motion.div>
          )}

          {/* Main Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NavMenu />
          </motion.div>

          {/* Quick Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 flex justify-center"
          >
            <QuickSearch className="max-w-md w-full" />
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex justify-center"
          >
            <ThemeToggle />
          </motion.div>
        </motion.div>

        {/* Collapse Toggle Button */}
        {collapsible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pb-2"
          >
            <button
              onClick={toggleCollapse}
              className="group flex items-center px-3 py-1 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors rounded hover:bg-gray-800/50"
              aria-label={isCollapsed ? 'Expand header' : 'Collapse header'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronUp className="w-4 h-4 mr-1" />
                )}
              </motion.div>
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Subtle border animation */}
      {scrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent origin-center"
        />
      )}
    </motion.header>
  )
}

export default ResponsiveHeader