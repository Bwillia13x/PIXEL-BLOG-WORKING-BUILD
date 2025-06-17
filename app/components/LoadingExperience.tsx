"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PixelIntroAnimation } from "./PixelIntroAnimation"
import { PixelBootScreen } from "./PixelBootScreen"

interface LoadingExperienceProps {
  onComplete: () => void
}

export function LoadingExperience({ onComplete }: LoadingExperienceProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'boot' | 'complete'>('intro')

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
    <div className="fixed inset-0 z-[9999] bg-gray-900 overflow-hidden">
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
            <PixelBootScreen onComplete={handleBootComplete} />
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