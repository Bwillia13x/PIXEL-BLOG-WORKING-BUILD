"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Home, User, Briefcase, BookOpen, Mail, Search } from "lucide-react"
import MobileNavigation from './MobileNavigation'
import NavigationTooltip from './NavigationTooltip'

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

const EnhancedNavMenu = () => {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className="hidden md:flex justify-center flex-wrap gap-3 my-4"
        role="navigation"
        aria-label="Main navigation"
        id="main-navigation"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isHovered = hoveredIndex === index
          
          return (
            <NavigationTooltip
              key={item.href}
              content={item.description || ''}
              shortcut={item.shortcut}
              isVisible={showTooltip === index}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => {
                  setHoveredIndex(index)
                  setTimeout(() => setShowTooltip(index), 800)
                }}
                onHoverEnd={() => {
                  setHoveredIndex(null)
                  setShowTooltip(null)
                }}
                className="relative"
              >
                {/* Background glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-green-400/20 blur-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 0.8
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Main card */}
                <motion.div
                  className="relative z-10"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isHovered ? 1.05 : 1,
                    y: isHovered ? -4 : 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.2
                  }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 ease-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      active 
                        ? 'bg-green-600/15 text-green-400 border-2 border-green-400/50 shadow-lg shadow-green-400/20' 
                        : 'bg-gray-900/80 border-2 border-gray-600/40 backdrop-blur-sm'
                    }`}
                    style={{
                      transform: 'translateZ(0)', // Force hardware acceleration
                      willChange: 'transform, opacity'
                    }}
                    title={`${item.description} (Alt+${item.shortcut})`}
                    aria-label={`${item.label}: ${item.description}. Press Alt+${item.shortcut} for quick access.`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Hover border enhancement */}
                    {isHovered && !active && (
                      <motion.div
                        className="absolute inset-0 border-2 border-green-400/60 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

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
                    
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: isHovered ? 1.1 : 1
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Icon className={`w-6 h-6 mb-2 transition-all duration-200 ease-out relative z-10 ${
                        active 
                          ? 'text-green-400 drop-shadow-lg' 
                          : isHovered 
                            ? 'text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]'
                            : 'text-gray-300'
                      }`} />
                    </motion.div>

                    {/* Label */}
                    <span className={`font-pixel text-xs relative z-10 transition-all duration-200 ease-out ${
                      active 
                        ? 'text-green-400' 
                        : isHovered 
                          ? 'text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]'
                          : 'text-gray-300'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Keyboard shortcut indicator */}
                    <motion.span 
                      className="absolute -top-2 -right-2 w-5 h-5 bg-green-600/90 text-black text-[10px] font-pixel rounded-full flex items-center justify-center shadow-lg pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.8
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.shortcut}
                    </motion.span>
                    
                    {/* Hover glow effect */}
                    {isHovered && !active && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-green-400/5 to-green-400/10 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    {/* Active indicator */}
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
              </motion.div>
            </NavigationTooltip>
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

export default EnhancedNavMenu 