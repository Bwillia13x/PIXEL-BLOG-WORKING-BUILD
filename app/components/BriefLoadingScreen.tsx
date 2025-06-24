"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BriefLoadingScreenProps {
  onComplete: () => void
  duration?: number
}

export function BriefLoadingScreen({ onComplete, duration = 2500 }: BriefLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'fadeout'>('loading')
  const [currentText, setCurrentText] = useState('')

  const loadingTexts = useMemo(() => [
    'INITIALIZING...',
    'LOADING PIXEL WISDOM...',
    'SYSTEM READY'
  ], [])

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    // Text cycling
    let textIndex = 0
    const textInterval = setInterval(() => {
      if (textIndex < loadingTexts.length) {
        setCurrentText(loadingTexts[textIndex])
        textIndex++
      }
    }, duration / 3)

    // Complete sequence
    const completeTimer = setTimeout(() => {
      setPhase('complete')
      setTimeout(() => {
        setPhase('fadeout')
        setTimeout(onComplete, 500)
      }, 300)
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete, loadingTexts])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        style={{ opacity: 1 }}
      >
        <div className="text-center space-y-6 sm:space-y-8 px-4">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-green-400 font-pixel text-xl sm:text-2xl md:text-3xl"
            style={{
              textShadow: '0 0 20px rgba(74, 222, 128, 0.8)',
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            PIXEL WISDOM
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-xs mx-auto"
          >
            <div className="relative h-3 bg-gray-800 border-2 border-green-400/50 overflow-hidden rounded-sm mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-300"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 15px rgba(74, 222, 128, 0.8)'
                }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
            <div className="flex justify-between text-xs sm:text-sm font-mono text-green-400/70">
              <span>LOADING</span>
              <span>{progress}%</span>
            </div>
          </motion.div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-green-400/80 font-mono text-xs sm:text-sm tracking-wider min-h-[20px]"
          >
            {currentText}
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-2 py-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-green-400 rounded-sm"
                style={{
                  boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>

          {/* Completion Message */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 font-mono text-xs sm:text-sm mt-4"
            >
              Welcome to the Matrix
            </motion.div>
          )}
        </div>

        {/* Scanlines Effect */}
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

        {/* Pixel particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 4px rgba(74, 222, 128, 0.8)'
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}