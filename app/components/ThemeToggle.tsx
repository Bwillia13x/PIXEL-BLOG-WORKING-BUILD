"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  SwatchIcon, 
  SunIcon, 
  MoonIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline"
import { useTheme } from "@/app/contexts/ThemeContext"
import { RETRO_THEMES } from "@/app/lib/themes"
import ThemeSelector from "./ThemeSelector"

interface ThemeToggleProps {
  variant?: 'simple' | 'advanced' | 'compact'
  showLabel?: boolean
  className?: string
}

const ThemeToggle = ({ 
  variant = 'simple', 
  showLabel = false,
  className = "" 
}: ThemeToggleProps) => {
  const { currentTheme, setTheme, availableThemes, isTransitioning } = useTheme()
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)

  // Simple theme toggle between light and dark variants
  const handleSimpleToggle = () => {
    // For simple variant, toggle between vintage (light) and matrix (dark)
    const isCurrentlyLight = currentTheme.id === 'vintage'
    setTheme(isCurrentlyLight ? 'matrix' : 'vintage')
  }

  // Quick theme cycle through popular themes
  const handleQuickCycle = () => {
    const popularThemes = ['matrix', 'cyberpunk', 'amber', 'synthwave']
    const currentIndex = popularThemes.indexOf(currentTheme.id)
    const nextIndex = (currentIndex + 1) % popularThemes.length
    setTheme(popularThemes[nextIndex])
  }

  // Simple variant - classic light/dark toggle
  if (variant === 'simple') {
    const isLight = currentTheme.id === 'vintage'
    
    return (
      <motion.button
        onClick={handleSimpleToggle}
        disabled={isTransitioning}
        className={`
          group relative flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-600/40 
          bg-gray-900/80 hover:bg-gray-800/90 hover:border-green-400/40 transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm overflow-hidden
          ${className}
        `}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
        aria-pressed={!isLight}
        title={`Current theme: ${currentTheme.name}. Click to switch to ${isLight ? 'dark' : 'light'} theme.`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background pattern */}
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

        {/* Enhanced icon with improved animation */}
        <div className="relative">
          <motion.div
            key={currentTheme.id}
            initial={{ rotateY: -180, scale: 0.5, opacity: 0, filter: "blur(4px)" }}
            animate={{ rotateY: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ rotateY: 180, scale: 0.5, opacity: 0, filter: "blur(4px)" }}
            transition={{ 
              duration: 0.6, 
              ease: "easeInOut",
              opacity: { duration: 0.4 },
              filter: { duration: 0.3 }
            }}
            className="relative z-10"
            whileHover={{ 
              scale: 1.1, 
              rotate: isLight ? 0 : 0,
              transition: { duration: 0.2 }
            }}
          >
            {isLight ? (
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <SunIcon className="w-6 h-6 text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all duration-300" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <MoonIcon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] transition-all duration-300" aria-hidden="true" />
              </motion.div>
            )}
          </motion.div>
          
          {/* Theme particles effect */}
          <AnimatePresence>
            {isTransitioning && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${isLight ? 'bg-amber-400' : 'bg-blue-400'}`}
                    initial={{ 
                      scale: 0,
                      x: 12,
                      y: 12,
                      opacity: 1
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: 12 + (Math.cos(i * 60 * Math.PI / 180) * 20),
                      y: 12 + (Math.sin(i * 60 * Math.PI / 180) * 20),
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {showLabel && (
          <span className="relative z-10 font-pixel text-sm text-gray-300 group-hover:text-green-400 transition-colors duration-300">
            {isLight ? 'Light' : 'Dark'}
          </span>
        )}

        {/* Enhanced transition indicator */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 z-20"
            >
              <motion.div
                className="w-4 h-4 bg-green-400 rounded-full relative"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-green-400 rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeOut" 
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Enhanced hover glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 rounded-lg" 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Pixel border animation on hover */}
        <motion.div
          className="absolute inset-0 border-2 border-green-400/0 rounded-lg"
          whileHover={{ 
            borderColor: "rgba(74, 222, 128, 0.5)",
            boxShadow: "0 0 20px rgba(74, 222, 128, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        />
        
        <span className="sr-only">
          {isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        </span>
      </motion.button>
    )
  }

  // Compact variant - cycle through themes with theme indicator
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          onClick={handleQuickCycle}
          disabled={isTransitioning}
          className="
            flex items-center space-x-2 p-2 pixel-border 
            bg-gray-800 hover:bg-gray-700 transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={`Current theme: ${currentTheme.name}. Click to cycle themes.`}
          title={`Current: ${currentTheme.name}. Click to cycle through themes.`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            key={currentTheme.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-4 h-4 pixel-border"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <SwatchIcon className="w-4 h-4 text-green-400" />
          </motion.div>
          
          {showLabel && (
            <span className="font-mono text-xs text-gray-300 truncate max-w-20">
              {currentTheme.name}
            </span>
          )}
        </motion.button>

        {/* Quick theme preview */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-1 px-2 py-1 bg-black/90 text-white text-xs font-mono rounded z-10"
          >
            Switching to {currentTheme.name}...
          </motion.div>
        )}
      </div>
    )
  }

  // Advanced variant - full theme selector with quick access
  return (
    <div className={`relative flex items-center space-x-2 ${className}`}>
      {/* Quick Theme Indicator */}
      <motion.div
        className="flex items-center space-x-2 px-3 py-2 pixel-border bg-gray-800"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          key={currentTheme.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2"
        >
          <div 
            className="w-3 h-3 pixel-border"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
          <div 
            className="w-3 h-3 pixel-border"
            style={{ backgroundColor: currentTheme.colors.accent1 }}
          />
          <div 
            className="w-3 h-3 pixel-border"
            style={{ backgroundColor: currentTheme.colors.accent2 }}
          />
        </motion.div>
        
        {showLabel && (
          <span className="font-mono text-sm text-gray-300">
            {currentTheme.name}
          </span>
        )}
      </motion.div>

      {/* Quick Menu Toggle */}
      <div className="relative">
        <button
          onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
          className="
            flex items-center space-x-1 px-2 py-2 pixel-border 
            bg-gray-800 hover:bg-gray-700 transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-green-400
          "
          aria-label="Quick theme menu"
        >
          <PaintBrushIcon className="w-4 h-4 text-green-400" />
          <ChevronDownIcon 
            className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
              isQuickMenuOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Quick Theme Menu */}
        <AnimatePresence>
          {isQuickMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute right-0 top-full mt-2 w-48 pixel-border bg-gray-900/95 backdrop-blur-md z-20"
            >
              <div className="p-2 space-y-1">
                {['matrix', 'cyberpunk', 'amber', 'synthwave'].map(themeId => {
                  const theme = RETRO_THEMES[themeId]
                  if (!theme) return null
                  
                  return (
                    <button
                      key={themeId}
                      onClick={() => {
                        setTheme(themeId)
                        setIsQuickMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center space-x-2 px-2 py-1 text-left 
                        hover:bg-gray-800/50 transition-colors duration-200 font-mono text-xs
                        ${currentTheme.id === themeId ? 'bg-green-500/20 text-green-400' : 'text-gray-300'}
                      `}
                    >
                      <div 
                        className="w-3 h-3 pixel-border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span>{theme.name}</span>
                    </button>
                  )
                })}
                
                <div className="border-t border-gray-700 my-1" />
                
                <ThemeSelector compact={true} showPreview={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transition indicator */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-400 pixel-border border-blue-500/50 font-mono text-xs"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-current border-t-transparent rounded-full"
          />
          <span>Applying...</span>
        </motion.div>
      )}
    </div>
  )
}

export default ThemeToggle
