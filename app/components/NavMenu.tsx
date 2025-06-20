"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Home, User, Briefcase, BookOpen, Mail, X, ChevronRight, Search } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  description?: string
}

const navItems: NavItem[] = [
  { 
    href: "/", 
    label: "Home", 
    icon: Home, 
    shortcut: "H",
    description: "Return to homepage"
  },
  { 
    href: "/about", 
    label: "About", 
    icon: User, 
    shortcut: "A",
    description: "Learn about me"
  },
  { 
    href: "/projects", 
    label: "Projects", 
    icon: Briefcase, 
    shortcut: "P",
    description: "View my portfolio"
  },
  { 
    href: "/projects/current", 
    label: "Current", 
    icon: Monitor, 
    shortcut: "C",
    description: "Active projects"
  },
  { 
    href: "/blog", 
    label: "Blog", 
    icon: BookOpen, 
    shortcut: "B",
    description: "Read my thoughts"
  },
  { 
    href: "/search", 
    label: "Search", 
    icon: Search, 
    shortcut: "S",
    description: "Find content"
  },
  { 
    href: "/contact", 
    label: "Contact", 
    icon: Mail, 
    shortcut: "M",
    description: "Get in touch"
  }
]

const NavMenu = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        buttonRef.current?.focus()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobile && e.altKey) {
        const item = navItems.find(item => 
          item.shortcut?.toLowerCase() === e.key.toLowerCase()
        )
        if (item) {
          e.preventDefault()
          window.location.href = item.href
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobile])

  // Arrow key navigation in mobile menu
  const handleMobileMenuKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMobileMenuOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < navItems.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : navItems.length - 1
        )
        break
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          e.preventDefault()
          itemRefs.current[focusedIndex]?.click()
        }
        break
    }
  }, [isMobileMenuOpen, focusedIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleMobileMenuKeyDown)
    return () => document.removeEventListener('keydown', handleMobileMenuKeyDown)
  }, [handleMobileMenuKeyDown])

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setFocusedIndex(-1)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setFocusedIndex(-1)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center flex-wrap gap-2 my-4">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`group relative flex flex-col items-center p-3 rounded transition-all duration-200 ${
                  active 
                    ? 'bg-green-600/20 text-green-400 pixelated-border' 
                    : 'bg-gray-800 hover:bg-gray-700 pixelated-border'
                }`}
                title={`${item.description} (Alt+${item.shortcut})`}
              >
                <Icon className={`w-6 h-6 mb-1 transition-colors ${
                  active ? 'text-green-400' : 'text-gray-300 group-hover:text-green-400'
                }`} />
                <span className="font-pixel text-xs">{item.label}</span>
                
                {/* Keyboard shortcut indicator */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-black text-[10px] font-pixel rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.shortcut}
                </span>
                
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-400/10 border-2 border-green-400 rounded"
                    style={{ zIndex: -1 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden my-4" ref={menuRef}>
        {/* Hamburger Button */}
        <motion.button
          ref={buttonRef}
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors mx-auto relative overflow-hidden"
          whileTap={{ scale: 0.9 }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="relative w-6 h-6">
            <motion.span
              className="absolute left-0 top-1 w-6 h-0.5 bg-green-400 origin-center"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute left-0 top-3 w-6 h-0.5 bg-green-400"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
                x: isMobileMenuOpen ? 10 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-5 w-6 h-0.5 bg-green-400 origin-center"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>
          
          {/* Pixel burst effect */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 border-2 border-green-400 rounded"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={closeMobileMenu}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l-2 border-green-400 z-50 overflow-y-auto"
              >
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-green-400/30">
                  <h2 className="font-pixel text-green-400 text-sm">Navigation</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-green-400" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="p-4">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="mb-2"
                      >
                        <Link
                          ref={el => {
                            if (el) itemRefs.current[index] = el
                          }}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`group flex items-center p-4 rounded-lg transition-all duration-200 touch-manipulation ${
                            active 
                              ? 'bg-green-600/20 text-green-400 border-l-4 border-green-400' 
                              : 'hover:bg-gray-800 text-gray-300'
                          } ${
                            focusedIndex === index ? 'ring-2 ring-green-400 bg-gray-800' : ''
                          }`}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(-1)}
                        >
                          <Icon className={`w-6 h-6 mr-4 transition-colors ${
                            active ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                          }`} />
                          
                          <div className="flex-1">
                            <div className={`font-pixel text-sm ${
                              active ? 'text-green-400' : 'text-gray-300 group-hover:text-green-400'
                            }`}>
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-1">
                              {item.description}
                            </div>
                          </div>
                          
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            active ? 'text-green-400' : 'text-gray-500 group-hover:text-green-400'
                          } group-hover:translate-x-1`} />
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
                
                {/* Menu Footer */}
                <div className="p-4 border-t border-green-400/30 mt-auto">
                  <p className="text-xs text-gray-500 font-mono text-center">
                    Use arrow keys to navigate
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default NavMenu
