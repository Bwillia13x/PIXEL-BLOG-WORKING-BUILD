"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PixelIntroAnimation } from "./PixelIntroAnimation"
import { PixelBootScreen } from "./PixelBootScreen"

interface LoadingExperienceProps {
  onComplete: () => void
  soundEnabled?: boolean
}

export function LoadingExperience({ onComplete, soundEnabled = false }: LoadingExperienceProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'boot' | 'complete'>('intro')
  const [soundToggle, setSoundToggle] = useState(soundEnabled)

  useEffect(() => {
    // Start with intro animation for 3 seconds
    const introTimer = setTimeout(() => {
      setCurrentPhase('boot')
    }, 3000)

    return () => clearTimeout(introTimer)
  }, [])

  const handleBootComplete = () => {
    setCurrentPhase('complete')
    // Small delay before calling onComplete for smooth transition
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gray-900 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Loading screen"
    >
      {/* Skip loading button for accessibility */}
      <button
        onClick={handleBootComplete}
        className="absolute top-4 left-4 z-10 px-3 py-2 bg-gray-800 text-green-400 text-xs font-mono border border-green-400 hover:bg-green-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Skip loading animation"
      >
        Skip Loading
      </button>

      {/* Sound Toggle Button */}
      <button
        onClick={() => setSoundToggle(!soundToggle)}
        className="absolute top-4 right-4 z-10 px-3 py-2 bg-gray-800 text-green-400 text-xs font-mono border border-green-400 hover:bg-green-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label={`${soundToggle ? 'Disable' : 'Enable'} sound effects`}
        aria-pressed={soundToggle}
      >
        <span aria-hidden="true">{soundToggle ? '🔊' : '🔇'}</span>
        <span className="ml-1">SOUND: {soundToggle ? 'ON' : 'OFF'}</span>
      </button>

      {/* Loading status for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentPhase === 'intro' && 'Loading: Initializing...'}
        {currentPhase === 'boot' && 'Loading: Booting system...'}
        {currentPhase === 'complete' && 'Loading complete'}
      </div>
      <AnimatePresence mode="wait">
        {currentPhase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PixelIntroAnimation />
          </motion.div>
        )}
        
        {currentPhase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PixelBootScreen onComplete={handleBootComplete} soundEnabled={soundToggle} />
          </motion.div>
        )}
        
        {currentPhase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gray-900"
          />
        )}
      </AnimatePresence>
    </div>
  )
} 