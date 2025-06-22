"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Sun, 
  Moon, 
  Contrast, 
  Calendar,
  Leaf,
  Snowflake,
  Flower,
  TreePine,
  Check,
  ChevronDown,
  Accessibility,
  Sunset,
  Zap
} from 'lucide-react'
import { useEnhancedTheme } from '../contexts/EnhancedThemeContext'
import { useAccessibilityContext } from './AccessibilityProvider'

interface ThemeOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  seasonal?: boolean
  isNew?: boolean
}

const themeOptions: ThemeOption[] = [
  {
    id: 'neon-green',
    name: 'Neon Green',
    description: 'The classic matrix-inspired green terminal',
    icon: Zap,
    color: '#00ff41'
  },
  {
    id: 'cyber-sunset',
    name: 'Cyber Sunset',
    description: 'Vibrant magenta and orange cyberpunk vibes',
    icon: Sunset,
    color: '#ff0080',
    isNew: true
  },
  {
    id: 'default',
    name: 'Classic Green',
    description: 'The original matrix-inspired green',
    icon: Palette,
    color: '#4ade80'
  },
  {
    id: 'spring',
    name: 'Spring Bloom',
    description: 'Fresh lime greens for spring',
    icon: Flower,
    color: '#84cc16',
    seasonal: true
  },
  {
    id: 'autumn',
    name: 'Autumn Matrix',
    description: 'Warm amber tones for fall',
    icon: Leaf,
    color: '#f59e0b',
    seasonal: true
  },
  {
    id: 'winter',
    name: 'Cyber Winter',
    description: 'Cool cyan blues for winter',
    icon: Snowflake,
    color: '#06b6d4',
    seasonal: true
  }
]

export default function EnhancedThemeToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const {
    currentTheme,
    setTheme,
    isSeasonalMode,
    setSeasonalMode,
    isHighContrast,
    setHighContrast,
    availableThemes,
    themeTransition
  } = useEnhancedTheme()
  
  const { announce } = useAccessibilityContext()

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      const totalOptions = themeOptions.length + 2 // +2 for seasonal and high contrast
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev + 1) % totalOptions)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => prev <= 0 ? totalOptions - 1 : prev - 1)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          handleOptionSelect(focusedIndex)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex])

  const handleOptionSelect = (index: number) => {
    if (index < themeOptions.length) {
      const option = themeOptions[index]
      setTheme(option.id)
      announce(`Theme changed to ${option.name}`, 'polite')
    } else if (index === themeOptions.length) {
      setSeasonalMode(!isSeasonalMode)
      announce(`Seasonal mode ${!isSeasonalMode ? 'enabled' : 'disabled'}`, 'polite')
    } else if (index === themeOptions.length + 1) {
      setHighContrast(!isHighContrast)
      announce(`High contrast mode ${!isHighContrast ? 'enabled' : 'disabled'}`, 'polite')
    }
  }

  const currentThemeOption = themeOptions.find(option => option.id === currentTheme) || themeOptions[0]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    setFocusedIndex(-1)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Main Toggle Button */}
      <motion.button
        ref={buttonRef}
        onClick={toggleMenu}
        className="group flex items-center space-x-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-green-400/30 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Current theme: ${currentThemeOption.name}. Click to open theme selector.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Theme Icon with Transition */}
        <div className="relative w-5 h-5">
          <AnimatePresence>
            <motion.div
              key={currentTheme}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <currentThemeOption.icon 
                className="w-5 h-5 transition-colors duration-300"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Theme Name */}
        <span className="font-pixel text-xs hidden sm:inline">
          {currentThemeOption.name}
        </span>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>

        {/* Status Indicators */}
        <div className="flex space-x-1">
          {isSeasonalMode && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              aria-label="Seasonal mode active"
            />
          )}
          {isHighContrast && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-white rounded-full"
              aria-label="High contrast mode active"
            />
          )}
        </div>

        {/* Transition Indicator */}
        {themeTransition && (
          <motion.div
            className="absolute inset-0 border border-green-400 rounded-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-md border border-green-400/30 rounded-lg shadow-xl z-50 overflow-hidden"
            role="menu"
            aria-label="Theme selection menu"
          >
            {/* Menu Header */}
            <div className="p-3 border-b border-green-400/20">
              <h3 className="font-pixel text-sm text-green-400 mb-1">Theme Selection</h3>
              <p className="font-mono text-xs text-gray-400">
                Choose your visual experience
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {/* Theme Options */}
              <div className="p-2">
                <div className="text-xs font-mono text-gray-500 mb-2 px-2">THEMES</div>
                {themeOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => {
                      setTheme(option.id)
                      announce(`Theme changed to ${option.name}`, 'polite')
                      setIsOpen(false)
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                      currentTheme === option.id
                        ? 'bg-green-400/20 border border-green-400/40 text-green-400'
                        : 'hover:bg-gray-800/60 text-gray-300 hover:text-green-400'
                    } ${
                      focusedIndex === index ? 'ring-2 ring-green-400 bg-gray-800/60' : ''
                    }`}
                    role="menuitem"
                    aria-current={currentTheme === option.id ? 'true' : 'false'}
                  >
                    <div 
                      className="w-5 h-5 rounded-none border border-current/50 flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}20`, borderColor: option.color }}
                    >
                      <option.icon 
                        className="w-3 h-3" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-pixel text-xs">{option.name}</span>
                        {option.seasonal && (
                          <Calendar className="w-3 h-3 text-yellow-400" aria-label="Seasonal theme" />
                        )}
                      </div>
                      <p className="font-mono text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </p>
                    </div>
                    
                    {currentTheme === option.id && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-green-400/20 my-2" />

              {/* Mode Options */}
              <div className="p-2">
                <div className="text-xs font-mono text-gray-500 mb-2 px-2">OPTIONS</div>
                
                {/* Seasonal Mode Toggle */}
                <motion.button
                  onClick={() => {
                    setSeasonalMode(!isSeasonalMode)
                    announce(`Seasonal mode ${!isSeasonalMode ? 'enabled' : 'disabled'}`, 'polite')
                  }}
                  onMouseEnter={() => setFocusedIndex(themeOptions.length)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isSeasonalMode
                      ? 'bg-yellow-400/20 border border-yellow-400/40 text-yellow-400'
                      : 'hover:bg-gray-800/60 text-gray-300 hover:text-yellow-400'
                  } ${
                    focusedIndex === themeOptions.length ? 'ring-2 ring-green-400 bg-gray-800/60' : ''
                  }`}
                  role="menuitem"
                  aria-pressed={isSeasonalMode}
                >
                  <div className="w-5 h-5 rounded-none border border-yellow-400/50 bg-yellow-400/20 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-yellow-400" />
                  </div>
                  
                  <div className="flex-1">
                    <span className="font-pixel text-xs">Seasonal Mode</span>
                    <p className="font-mono text-xs text-gray-500 mt-0.5">
                      Auto-switch themes based on season
                    </p>
                  </div>
                  
                  {isSeasonalMode && (
                    <Check className="w-4 h-4 text-yellow-400" />
                  )}
                </motion.button>

                {/* High Contrast Toggle */}
                <motion.button
                  onClick={() => {
                    setHighContrast(!isHighContrast)
                    announce(`High contrast mode ${!isHighContrast ? 'enabled' : 'disabled'}`, 'polite')
                  }}
                  onMouseEnter={() => setFocusedIndex(themeOptions.length + 1)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isHighContrast
                      ? 'bg-white/20 border border-white/40 text-white'
                      : 'hover:bg-gray-800/60 text-gray-300 hover:text-white'
                  } ${
                    focusedIndex === themeOptions.length + 1 ? 'ring-2 ring-green-400 bg-gray-800/60' : ''
                  }`}
                  role="menuitem"
                  aria-pressed={isHighContrast}
                >
                  <div className="w-5 h-5 rounded-none border border-white/50 bg-white/20 flex items-center justify-center">
                    <Accessibility className="w-3 h-3 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <span className="font-pixel text-xs">High Contrast</span>
                    <p className="font-mono text-xs text-gray-500 mt-0.5">
                      Enhanced visibility for accessibility
                    </p>
                  </div>
                  
                  {isHighContrast && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-3 border-t border-green-400/20 bg-gray-900/50">
              <p className="font-mono text-xs text-gray-500 text-center">
                Use arrow keys to navigate • Enter to select
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}