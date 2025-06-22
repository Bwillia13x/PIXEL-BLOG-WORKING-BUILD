"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PixelIntroAnimation } from "./PixelIntroAnimation"
import { PixelBootScreen } from "./PixelBootScreen"
import PixelLoading, { PixelProgressBar } from './PixelLoading'

interface LoadingExperienceProps {
  onComplete: () => void
  soundEnabled?: boolean
}

export function LoadingExperience({ onComplete, soundEnabled = false }: LoadingExperienceProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'boot' | 'transition' | 'complete'>('intro')
  const [soundToggle, setSoundToggle] = useState(soundEnabled)

  useEffect(() => {
    // Start with intro animation for 3 seconds
    const introTimer = setTimeout(() => {
      setCurrentPhase('boot')
    }, 3000)

    return () => clearTimeout(introTimer)
  }, [])

  const handleBootComplete = () => {
    setCurrentPhase('transition')
    
    // Enhanced transition with proper timing for header animation
    setTimeout(() => {
      setCurrentPhase('complete')
      setTimeout(() => {
        onComplete()
      }, 500) // Slightly longer delay for smoother transition
    }, 800)
  }

  const handleSkipToComplete = () => {
    setCurrentPhase('complete')
    setTimeout(() => {
      onComplete()
    }, 200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Skip button for development/testing */}
      <button
        onClick={handleSkipToComplete}
        className="absolute top-4 right-4 z-50 px-3 py-1 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors bg-gray-800/50 rounded border border-gray-600/30 hover:border-green-400/50"
        style={{ zIndex: 9999 }}
      >
        [ESC] Skip
      </button>

      {/* Sound toggle */}
      <button
        onClick={() => setSoundToggle(!soundToggle)}
        className="absolute top-4 left-4 z-50 px-3 py-1 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors bg-gray-800/50 rounded border border-gray-600/30 hover:border-green-400/50"
        style={{ zIndex: 9999 }}
      >
        [♪] {soundToggle ? 'ON' : 'OFF'}
      </button>

      {/* Accessibility announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentPhase === 'intro' && 'Loading: Initializing Pixel Wisdom...'}
        {currentPhase === 'boot' && 'Loading: Booting system...'}
        {currentPhase === 'transition' && 'Loading: Preparing interface...'}
        {currentPhase === 'complete' && 'Loading complete'}
      </div>

      <AnimatePresence>
        {/* Intro Phase */}
        {currentPhase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <PixelIntroAnimation />
          </motion.div>
        )}
        
        {/* Boot Phase */}
        {currentPhase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            className="absolute inset-0"
          >
            <PixelBootScreen onComplete={handleBootComplete} soundEnabled={soundToggle} />
          </motion.div>
        )}

        {/* Enhanced Transition Phase */}
        {currentPhase === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: [1, 0.9, 1, 0.8, 1, 0.6, 1, 0],
              scale: [1, 1.01, 0.99, 1.02, 0.98, 1.01, 1]
            }}
            transition={{ 
              duration: 1.8,
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 0.9, 1],
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [20, 0, 0, -10],
                  scale: [0.8, 1.1, 1, 0.9]
                }}
                transition={{ 
                  duration: 1.6,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut"
                }}
                className="text-green-400 font-pixel text-xl sm:text-2xl mb-6"
                style={{
                  textShadow: '0 0 20px rgba(74, 222, 128, 0.8), 2px 2px 0 #000'
                }}
              >
                INTERFACE READY
              </motion.div>
              
              {/* Enhanced progress bar */}
              <motion.div
                className="relative w-80 max-w-xs mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <PixelProgressBar 
                  progress={100} 
                  size="md" 
                  animated={true}
                  showPercentage={false}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 1.2,
                  times: [0, 0.3, 0.7, 1],
                  delay: 0.8
                }}
                className="text-green-400/70 font-mono text-xs sm:text-sm mt-6 tracking-wider"
              >
                Initializing Pixel Wisdom Interface...
              </motion.div>

              {/* Pixel particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Completion Phase */}
        {currentPhase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-green-400 font-pixel text-sm"
            >
              Welcome to Pixel Wisdom
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent loading indicator for early phases */}
      {(currentPhase === 'intro' || currentPhase === 'boot') && (
        <div className="absolute bottom-6 left-6 z-10">
          <PixelLoading 
            variant="typewriter" 
            message="LOADING PIXEL WISDOM" 
            className="text-green-400/60 text-xs"
          />
        </div>
      )}

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(74, 222, 128, 0.3) 2px,
              rgba(74, 222, 128, 0.3) 4px
            )`
          }}
        />
      </div>
    </div>
  )
} 