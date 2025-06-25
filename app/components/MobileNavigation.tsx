"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Menu, X, Home, FileText, User, Mail, Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import QuickSearch from './QuickSearch'


interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  external?: boolean
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, description: 'Return to homepage' },
  { href: '/blog', label: 'Blog', icon: FileText, description: 'Read latest posts' },
  { href: '/about', label: 'About', icon: User, description: 'Learn more about me' },
  { href: '/contact', label: 'Contact', icon: Mail, description: 'Get in touch' },
]

export default function MobileNavigation(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const controls = useAnimation()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setSearchOpen(false)
    setFocusedIndex(-1)
  }, [pathname])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false)
        } else if (isOpen) {
          setIsOpen(false)
          triggerRef.current?.focus()
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev + 1) % navigationItems.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => prev <= 0 ? navigationItems.length - 1 : prev - 1)
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            e.preventDefault()
            // Navigate to focused item
            const item = navigationItems[focusedIndex]
            if (item) {
              window.location.href = item.href
            }
          }
          break
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, searchOpen, focusedIndex])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Focus first focusable element in menu
      const firstFocusable = menuRef.current.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isOpen])

  const toggleMenu = async () => {
    if (isOpen) {
      await controls.start('exit')
      setIsOpen(false)
    } else {
      setIsOpen(true)
      await controls.start('enter')
    }
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const menuVariants = {
    hidden: { 
      x: '-100%',
      scale: 0.9,
      rotateY: -15
    },
    visible: { 
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
    exit: { 
      x: '-100%',
      scale: 0.9,
      rotateY: -15,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      x: -50,
      opacity: 0,
      rotateX: -15
    },
    visible: { 
      x: 0,
      opacity: 1,
      rotateX: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      x: -30,
      opacity: 0,
      rotateX: -10,
      transition: { duration: 0.15 }
    }
  }

  return (
    <>
      {/* Mobile Menu Trigger */}
      <motion.button
        ref={triggerRef}
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800/90 backdrop-blur-sm border border-green-400/30 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)'
        }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pixel decoration */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-none"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1]
          }}
        />
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              id="mobile-navigation"
              className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-r-2 border-green-400/30 z-40 overflow-y-auto"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ perspective: '1000px' }}
            >
              {/* Pixel grid background */}
              <div 
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px),
                    linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Header */}
              <motion.div 
                className="p-6 border-b border-green-400/20 relative"
                variants={itemVariants}
              >
                <motion.h2 
                  className="font-pixel text-xl text-green-400 mb-2"
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(74, 222, 128, 0.5)',
                      '0 0 10px rgba(74, 222, 128, 0.8)',
                      '0 0 5px rgba(74, 222, 128, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  IT FROM BIT
                </motion.h2>
                <p className="font-mono text-xs text-gray-400">Navigation Menu</p>
                
                {/* Pixel decoration */}
                <div className="absolute top-4 right-4 grid grid-cols-2 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-green-400/40 rounded-none"
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: [0.42, 0, 0.58, 1]
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Search Section */}
              <motion.div 
                className="p-4 border-b border-green-400/10"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-green-400/20 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Toggle search"
                  aria-expanded={searchOpen}
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4" />
                    <span className="font-mono text-sm">Search</span>
                  </div>
                  <motion.div
                    animate={{ rotate: searchOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-3"
                    >
                      <QuickSearch className="w-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Navigation Items */}
              <motion.nav 
                className="p-4"
                variants={itemVariants}
                role="navigation"
                aria-label="Main navigation"
              >
                <ul className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const isFocused = focusedIndex === index

                    return (
                      <motion.li 
                        key={item.href}
                        variants={itemVariants}
                      >
                        <Link
                          href={item.href}
                          className={`group relative flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                            isActive 
                              ? 'bg-green-400/10 border-green-400/40 text-green-400' 
                              : 'bg-gray-800/30 border-gray-700/30 text-gray-300 hover:bg-green-400/5 hover:border-green-400/20 hover:text-green-400'
                          } ${
                            isFocused ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setIsOpen(false)}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(-1)}
                          aria-current={isActive ? 'page' : undefined}
                          aria-describedby={item.description ? `nav-desc-${index}` : undefined}
                        >
                          {/* Background glow effect */}
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
                          />

                          <Icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive ? 'text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]' : 'group-hover:text-green-400'
                          }`} />
                          
                          <div className="flex-1 relative z-10">
                            <div className={`font-pixel text-sm transition-colors duration-300 ${
                              isActive ? 'text-green-400' : 'group-hover:text-green-400'
                            }`}>
                              {item.label}
                            </div>
                            {item.description && (
                              <div 
                                id={`nav-desc-${index}`}
                                className="font-mono text-xs text-gray-500 mt-1"
                              >
                                {item.description}
                              </div>
                            )}
                          </div>

                          {isActive && (
                            <motion.div
                              className="w-2 h-2 bg-green-400 rounded-none"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: [0.42, 0, 0.58, 1]
                              }}
                            />
                          )}

                          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                            isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-green-400 group-hover:translate-x-1'
                          }`} />
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.nav>

              {/* Footer */}
              <motion.div 
                className="p-4 border-t border-green-400/10 mt-auto"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-gray-400">Theme</span>
                  <ThemeToggle />
                </div>
                
                <div className="text-center">
                  <p className="font-mono text-xs text-gray-500 mb-2">
                    © 2024 It From Bit
                  </p>
                  <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-green-400/30 rounded-none"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: [0.42, 0, 0.58, 1]
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Animated border */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-green-400 to-transparent"
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1]
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}