"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Home, User, Briefcase, BookOpen, Mail, X, ChevronRight, Search } from "lucide-react"
import MobileNavigation from './MobileNavigation'

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
      <nav 
        className="hidden md:flex justify-center flex-wrap gap-2 my-4"
        role="navigation"
        aria-label="Main navigation"
        id="main-navigation"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { type: "spring", stiffness: 300, damping: 25 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                opacity: 1,
                transform: 'none',
                willChange: 'transform'
              }}
            >
              <Link
                href={item.href}
                className={`group relative flex flex-col items-center p-4 rounded-lg transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  active 
                    ? 'bg-green-600/15 text-green-400 border-2 border-green-400/50 shadow-lg shadow-green-400/20' 
                    : 'bg-gray-900/80 border-2 border-gray-600/40 backdrop-blur-sm hover:bg-gray-800/90 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-400/20'
                }`}
                title={`${item.description} (Alt+${item.shortcut})`}
                aria-label={`${item.label}: ${item.description}. Press Alt+${item.shortcut} for quick access.`}
                aria-current={active ? 'page' : undefined}
              >
                {/* Subtle background pattern */}
                {!active && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 4px,
                          rgba(74, 222, 128, 0.1) 4px,
                          rgba(74, 222, 128, 0.1) 8px
                        )`
                      }}
                    />
                  </div>
                )}
                
                <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ease-out relative z-10 ${
                  active ? 'text-green-400 drop-shadow-lg' : 'text-gray-300 group-hover:text-green-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]'
                }`} />
                <span className={`font-pixel text-xs relative z-10 transition-all duration-300 ease-out ${
                  active ? 'text-green-400' : 'text-gray-300 group-hover:text-green-400 group-hover:drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]'
                }`}>{item.label}</span>
                
                {/* Keyboard shortcut indicator */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-600/90 text-black text-[10px] font-pixel rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-out shadow-lg pointer-events-none">
                  {item.shortcut}
                </span>
                
                {/* Enhanced hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-green-400/5 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out rounded-lg" />
                <div className="absolute inset-0 bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out rounded-lg blur-sm" />
                
                {/* Active indicator with animation */}
                {active && (
                  <>
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-green-400/5 rounded-lg"
                      style={{ zIndex: 0 }}
                    />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 border border-green-400/30 rounded-lg"
                      style={{ zIndex: 1 }}
                    />
                  </>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </>
  )
}

export default NavMenu
