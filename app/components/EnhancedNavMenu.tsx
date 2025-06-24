"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Monitor, Home, User, Briefcase, BookOpen, Mail, Search } from "lucide-react"
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

const EnhancedNavMenu = () => {
  const pathname = usePathname()
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
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                className={`group relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  active 
                    ? 'bg-green-600/20 text-green-400 border border-green-400/60' 
                    : 'bg-gray-900/60 border border-gray-600/40 hover:border-green-400/40 hover:bg-green-400/5'
                }`}
                title={`${item.description} (Alt+${item.shortcut})`}
                aria-label={`${item.label}: ${item.description}. Press Alt+${item.shortcut} for quick access.`}
                aria-current={active ? 'page' : undefined}
              >
                {/* Icon */}
                <Icon className={`w-6 h-6 mb-2 transition-colors duration-200 ${
                  active 
                    ? 'text-green-400' 
                    : 'text-gray-300 group-hover:text-green-400'
                }`} />

                {/* Label */}
                <span className={`font-pixel text-xs transition-colors duration-200 ${
                  active 
                    ? 'text-green-400' 
                    : 'text-gray-300 group-hover:text-green-400'
                }`}>
                  {item.label}
                </span>
                
                {/* Keyboard shortcut indicator on hover */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-600/90 text-black text-[10px] font-pixel rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {item.shortcut}
                </span>
              </Link>
            </div>
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