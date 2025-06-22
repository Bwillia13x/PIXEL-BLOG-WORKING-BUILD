"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PixelIntroAnimation } from "./PixelIntroAnimation"
import { PixelBootScreen } from "./PixelBootScreen"

interface EnhancedLoadingExperienceProps {
  onComplete: () => void
  soundEnabled?: boolean
  skipIntro?: boolean
}

export function EnhancedLoadingExperience({ 
  onComplete, 
  soundEnabled = false, 
  skipIntro = false 
}: EnhancedLoadingExperienceProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'boot' | 'transition' | 'complete'>(
    skipIntro ? 'boot' : 'intro'
  )
  const [soundToggle, setSoundToggle] = useState(soundEnabled)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    if (!skipIntro) {
      // Start with intro animation for 3.5 seconds
      const introTimer = setTimeout(() => {
        setCurrentPhase('boot')
      }, 3500)

      return () => clearTimeout(introTimer)
    }
  }, [skipIntro])

  // Enable audio after user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [userInteracted])

  const handleBootComplete = () => {
    setCurrentPhase('transition')
    
    // Enhanced transition effect
    setTimeout(() => {
      setCurrentPhase('complete')
      setTimeout(() => {
        onComplete()
      }, 800)
    }, 1000)
  }

  const handleSkipIntro = () => {
    if (currentPhase === 'intro') {
      setCurrentPhase('boot')
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden crt-screen">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {currentPhase === 'intro' && (
          <button
            onClick={handleSkipIntro}
            className="px-3 py-2 bg-gray-800 text-green-400 text-xs font-mono border border-green-400 hover:bg-green-400 hover:text-black transition-colors"
            aria-label="Skip intro animation"
          >
            SKIP INTRO
          </button>
        )}
        
        <button
          onClick={() => setSoundToggle(!soundToggle)}
          className="px-3 py-2 bg-gray-800 text-green-400 text-xs font-mono border border-green-400 hover:bg-green-400 hover:text-black transition-colors"
          aria-label="Toggle sound effects"
        >
          {soundToggle ? '🔊 SFX: ON' : '🔇 SFX: OFF'}
        </button>
      </div>

      <AnimatePresence>
        {/* Intro Phase */}
        {currentPhase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
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
            <PixelBootScreen 
              onComplete={handleBootComplete} 
              soundEnabled={soundToggle && userInteracted} 
            />
          </motion.div>
        )}

        {/* Transition Phase */}
        {currentPhase === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: [1, 0.8, 0.9, 0.5, 0.8, 0],
              scale: [1, 1.02, 0.98, 1.01, 1]
            }}
            transition={{ 
              duration: 1.5,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-green-400 font-pixel text-2xl mb-4"
                style={{
                  textShadow: '0 0 20px rgba(74, 222, 128, 0.8)'
                }}
              >
                SYSTEM READY
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-green-400 mx-auto max-w-xs"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.6,
                  repeat: 2
                }}
                className="text-green-400/70 font-mono text-sm mt-4"
              >
                Entering Pixel Wisdom...
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Completion Phase */}
        {currentPhase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>

      {/* Persistent Loading Indicator */}
      {(currentPhase === 'intro' || currentPhase === 'boot') && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex items-center gap-2 text-green-400/50 text-xs font-mono">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-green-400 border-t-transparent rounded-full"
            />
            <span>INITIALIZING PIXEL WISDOM</span>
          </div>
        </div>
      )}
    </div>
  )
}