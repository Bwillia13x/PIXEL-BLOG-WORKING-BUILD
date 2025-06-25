'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion'
import { Menu, X, Home, FileText, User, Mail, Search, ChevronRight, ArrowLeft, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { MobileOptimizedButton, MobileNavButton } from './MobileOptimizedButton'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: number
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, description: 'Return to homepage' },
  { href: '/blog', label: 'Blog', icon: FileText, description: 'Read latest posts' },
  { href: '/projects', label: 'Projects', icon: User, description: 'View portfolio' },
  { href: '/ui-demo', label: 'UI Demo', icon: Zap, description: 'Interactive demo' },
  { href: '/search', label: 'Search', icon: Search, description: 'Find content' },
  { href: '/contact', label: 'Contact', icon: Mail, description: 'Get in touch' },
]

interface EnhancedMobileNavProps {
  className?: string
}

export default function EnhancedMobileNavigation({ }: EnhancedMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [canSwipeClose, setCanSwipeClose] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    await controls.start('open')
  }, [controls])

  const handleClose = useCallback(async () => {
    await controls.start('close')
    setIsOpen(false)
    setSwipeProgress(0)
  }, [controls])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setSwipeProgress(0)
  }, [pathname])

  // Handle escape key and back button
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    const handlePopState = () => {
      if (isOpen) {
        handleClose()
        window.history.pushState(null, '', window.location.href)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('popstate', handlePopState)
      // Add a history entry to handle back button
      window.history.pushState(null, '', window.location.href)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isOpen, handleClose])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
  }, [isOpen])

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }, [isOpen, handleOpen, handleClose])

  // Enhanced pan gesture handling
  const handlePan = useCallback((_event: unknown, info: PanInfo) => {
    if (!isOpen) return

    const { offset } = info
    const progress = Math.max(0, Math.min(1, -offset.x / 280)) // 280px is menu width
    setSwipeProgress(progress)
    setCanSwipeClose(progress > 0.3)
  }, [isOpen])

  const handlePanEnd = useCallback((_event: unknown, info: PanInfo) => {
    if (!isOpen) return

    const { offset, velocity } = info
    const shouldClose = offset.x < -100 || velocity.x < -500

    if (shouldClose || canSwipeClose) {
      handleClose()
    } else {
      setSwipeProgress(0)
      setCanSwipeClose(false)
    }
  }, [isOpen, canSwipeClose, handleClose])

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 }
  }

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  return (
    <>
      {/* Enhanced Mobile Menu Trigger */}
      <motion.div 
        className="md:hidden fixed top-4 left-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <MobileOptimizedButton
          onClick={toggleMenu}
          variant="secondary"
          size="lg"
          hapticFeedback={true}
          className="relative shadow-lg backdrop-blur-sm"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </MobileOptimizedButton>

        {/* Status indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          animate={{
            scale: isOpen ? [1, 1.3, 1] : 1,
            opacity: isOpen ? [0.7, 1, 0.7] : 0.8
          }}
          transition={{
            duration: isOpen ? 1.5 : 0.3,
            repeat: isOpen ? Infinity : 0
          }}
        />
      </motion.div>

      {/* Enhanced Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with gesture support */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              style={{
                opacity: 1 - swipeProgress * 0.5
              }}
            />

            {/* Menu Panel with enhanced gestures */}
            <motion.div
              ref={menuRef}
              id="mobile-navigation"
              className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-r-2 border-green-400/30 z-40 overflow-y-auto"
                             variants={menuVariants}
               initial="hidden"
               animate="visible"
               exit="hidden"
               transition={{ 
                 duration: 0.4,
                 ease: "easeOut",
                 when: "beforeChildren",
                 staggerChildren: 0.05
               }}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              drag="x"
              dragConstraints={{ left: -280, right: 0 }}
              dragElastic={0.1}
              style={{
                x: -swipeProgress * 280
              }}
            >
              {/* Swipe indicator */}
              <motion.div
                className="absolute top-1/2 right-2 w-1 h-12 bg-green-400/50 rounded-full"
                animate={{
                  opacity: swipeProgress > 0.1 ? 1 : 0.3,
                  scaleY: 1 + swipeProgress
                }}
              />

              {/* Background pattern */}
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
                 transition={{ duration: 0.3, ease: "easeOut" }}
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
                <p className="font-mono text-xs text-gray-400">Touch & Swipe Navigation</p>
                
                {/* Quick stats */}
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-green-400 font-pixel text-sm">{navigationItems.length}</div>
                    <div className="text-gray-500 text-xs font-mono">Pages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-pixel text-sm">✓</div>
                    <div className="text-gray-500 text-xs font-mono">Touch</div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Items with enhanced touch targets */}
                             <motion.nav 
                 className="p-4"
                 variants={itemVariants}
                 transition={{ duration: 0.3, ease: "easeOut" }}
                 role="navigation"
                 aria-label="Main navigation"
               >
                <ul className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                                             <motion.li 
                         key={item.href}
                         variants={itemVariants}
                         transition={{ duration: 0.3, ease: "easeOut" }}
                       >
                        <MobileNavButton
                          onClick={() => {
                            router.push(item.href)
                            handleClose()
                          }}
                          isActive={isActive}
                          notificationCount={item.badge}
                          hapticFeedback={true}
                          className="w-full justify-start text-left"
                          aria-current={isActive ? 'page' : undefined}
                          aria-describedby={`nav-desc-${index}`}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <Icon className="w-6 h-6 flex-shrink-0" />
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-pixel text-sm truncate">
                                {item.label}
                              </div>
                              {item.description && (
                                <div 
                                  id={`nav-desc-${index}`}
                                  className="font-mono text-xs text-gray-500 mt-1 truncate"
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>

                            <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          </div>
                        </MobileNavButton>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.nav>

              {/* Enhanced footer with gestures hint */}
                             <motion.div 
                 className="p-4 border-t border-green-400/10 mt-auto"
                 variants={itemVariants}
                 transition={{ duration: 0.3, ease: "easeOut" }}
               >
                <div className="text-center mb-4">
                  <p className="font-mono text-xs text-gray-500 mb-2">
                    Swipe left to close menu
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    <ArrowLeft className="w-3 h-3 text-green-400" />
                    <motion.div 
                      className="w-6 h-0.5 bg-green-400 rounded-full"
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}