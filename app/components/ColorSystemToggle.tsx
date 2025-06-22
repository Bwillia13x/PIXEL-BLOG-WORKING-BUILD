"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sunset, Palette } from 'lucide-react'
import { useTheme } from '@/app/contexts/ThemeContext'

interface ColorSystemToggleProps {
  variant?: 'simple' | 'detailed'
  showLabels?: boolean
  className?: string
}

const COLOR_SYSTEMS = [
  {
    id: 'neon-green',
    name: 'Neon Green',
    description: 'Classic matrix-inspired terminal aesthetic',
    icon: Zap,
    primaryColor: '#00ff41',
    accentColor: '#00cc33',
    gradientFrom: '#00ff41',
    gradientTo: '#008822'
  },
  {
    id: 'cyber-sunset',
    name: 'Cyber Sunset',
    description: 'Vibrant magenta and orange cyberpunk atmosphere',
    icon: Sunset,
    primaryColor: '#ff0080',
    accentColor: '#ff6600',
    gradientFrom: '#ff0080',
    gradientTo: '#ff6600'
  }
] as const

export default function ColorSystemToggle({
  variant = 'simple',
  showLabels = false,
  className = ''
}: ColorSystemToggleProps) {
  const { currentTheme, setTheme, isTransitioning } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Determine current color system
  const getCurrentSystem = () => {
    if (currentTheme.id === 'cyber-sunset') return COLOR_SYSTEMS[1]
    return COLOR_SYSTEMS[0] // Default to neon-green
  }

  const currentSystem = getCurrentSystem()
  const otherSystem = COLOR_SYSTEMS.find(system => system.id !== currentSystem.id)!

  const handleToggle = () => {
    const targetTheme = currentSystem.id === 'neon-green' ? 'cyber-sunset' : 'neon-green'
    setTheme(targetTheme)
  }

  const handleSystemSelect = (systemId: string) => {
    setTheme(systemId)
    setIsMenuOpen(false)
  }

  if (variant === 'simple') {
    return (
      <motion.button
        onClick={handleToggle}
        disabled={isTransitioning}
        className={`
          group relative flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-600/40 
          bg-gray-900/80 hover:bg-gray-800/90 transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm overflow-hidden
          ${className}
        `}
        style={{
          borderColor: `${currentSystem.primaryColor}40`,
          '--focus-ring-color': currentSystem.primaryColor
        } as React.CSSProperties}
        aria-label={`Switch to ${otherSystem.name} color system`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${currentSystem.gradientFrom}20, ${currentSystem.gradientTo}20)`
          }}
        />

        {/* Icon with transition */}
        <div className="relative z-10">
          <motion.div
            key={currentSystem.id}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <currentSystem.icon 
              className="w-6 h-6 transition-all duration-300"
              style={{ 
                color: currentSystem.primaryColor,
                filter: `drop-shadow(0 0 8px ${currentSystem.primaryColor}60)`
              }}
            />
          </motion.div>

          {/* Transition particles */}
          <AnimatePresence>
            {isTransitioning && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: currentSystem.primaryColor }}
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

        {showLabels && (
          <span 
            className="relative z-10 font-pixel text-sm font-medium transition-colors duration-300"
            style={{ color: currentSystem.primaryColor }}
          >
            {currentSystem.name}
          </span>
        )}

        {/* Transition indicator */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 z-20"
            >
              <motion.div
                className="w-4 h-4 rounded-full relative"
                style={{ backgroundColor: currentSystem.primaryColor }}
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
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: currentSystem.primaryColor }}
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
      </motion.button>
    )
  }

  // Detailed variant with dropdown menu
  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
        style={{
          backgroundColor: `${currentSystem.primaryColor}10`,
          borderColor: `${currentSystem.primaryColor}40`,
          '--focus-ring-color': currentSystem.primaryColor
        } as React.CSSProperties}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <currentSystem.icon 
          className="w-6 h-6"
          style={{ color: currentSystem.primaryColor }}
        />
        <div className="flex-1 text-left">
          <div 
            className="font-pixel text-sm font-semibold"
            style={{ color: currentSystem.primaryColor }}
          >
            {currentSystem.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {currentSystem.description}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Palette className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border border-gray-600/40 rounded-lg overflow-hidden z-50"
          >
            {COLOR_SYSTEMS.map((system) => (
              <motion.button
                key={system.id}
                onClick={() => handleSystemSelect(system.id)}
                className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-800/50 transition-all duration-200"
                style={{
                  backgroundColor: currentSystem.id === system.id ? `${system.primaryColor}15` : 'transparent'
                }}
                whileHover={{ x: 4 }}
                disabled={isTransitioning}
              >
                <system.icon 
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: system.primaryColor }}
                />
                <div className="flex-1">
                  <div 
                    className="font-pixel text-sm font-medium"
                    style={{ color: system.primaryColor }}
                  >
                    {system.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {system.description}
                  </div>
                </div>
                {currentSystem.id === system.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: system.primaryColor }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 