"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PixelBootScreenProps {
  onComplete: () => void
  soundEnabled?: boolean
}

const asciiLogo = `
    ██████╗ ██╗██╗  ██╗███████╗██╗      
    ██╔══██╗██║╚██╗██╔╝██╔════╝██║      
    ██████╔╝██║ ╚███╔╝ █████╗  ██║      
    ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║      
    ██║     ██║██╔╝ ██╗███████╗███████╗ 
    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝ 
                                        
    ██╗    ██╗██╗███████╗██████╗  ██████╗ ███╗   ███╗
    ██║    ██║██║██╔════╝██╔══██╗██╔═══██╗████╗ ████║
    ██║ █╗ ██║██║███████╗██║  ██║██║   ██║██╔████╔██║
    ██║███╗██║██║╚════██║██║  ██║██║   ██║██║╚██╔╝██║
    ╚███╔███╔╝██║███████║██████╔╝╚██████╔╝██║ ╚═╝ ██║
     ╚══╝╚══╝ ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝     ╚═╝
`

const bootSequence = [
  { phase: "bios", text: "PIXEL WISDOM BIOS v2.1.0", delay: 200 },
  { phase: "memory", text: "Memory Test: 64MB OK", delay: 120 },
  { phase: "cpu", text: "CPU: Intel Wisdom 486DX @ 33MHz", delay: 80 },
  { phase: "drives", text: "Detecting drives... Found: C:\\WISDOM\\", delay: 160 },
  { phase: "os", text: "Loading PixelOS...", delay: 240 },
  { phase: "kernel", text: "Kernel loaded successfully", delay: 120 },
  { phase: "drivers", text: "Loading device drivers...", delay: 160 },
  { phase: "network", text: "Network interface: READY", delay: 80 },
  { phase: "services", text: "Starting system services...", delay: 200 },
  { phase: "wisdom", text: "Initializing Wisdom Engine...", delay: 240 },
  { phase: "ai", text: "AI Modules: ONLINE", delay: 120 },
  { phase: "blog", text: "Blog Framework: LOADED", delay: 160 },
  { phase: "ready", text: "System Ready - Welcome to Pixel Wisdom!", delay: 320 }
]

const glitchChars = ['▓', '▒', '░', '█', '▄', '▀', '■', '□', '▲', '►']

export function PixelBootScreen({ onComplete, soundEnabled = false }: PixelBootScreenProps) {
  const [phase, setPhase] = useState<'bios' | 'boot' | 'logo' | 'complete'>('bios')
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [bootIndex, setBootIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [logoVisible, setLogoVisible] = useState(false)
  const [glitchText, setGlitchText] = useState('')
  const audioContextRef = useRef<AudioContext | null>(null)
  const typewriterRef = useRef<HTMLPreElement>(null)

  // Sound effects
  const playBeep = (frequency: number = 800, duration: number = 100) => {
    if (!soundEnabled || !audioContextRef.current) return
    
    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    oscillator.start()
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000)
  }

  // Initialize audio context
  useEffect(() => {
    if (soundEnabled) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass()
      }
    }
    return () => {
      audioContextRef.current?.close()
    }
  }, [soundEnabled])

  // Boot sequence controller
  useEffect(() => {
    if (phase === 'bios') {
      // BIOS phase with typing effect (2.5x faster)
      const timer = setTimeout(() => {
        setPhase('boot')
        playBeep(1200, 50)
      }, 800)
      return () => clearTimeout(timer)
    }
    
    if (phase === 'boot') {
      if (bootIndex < bootSequence.length) {
        const currentBoot = bootSequence[bootIndex]
        setCurrentText('')
        
        // Typing effect
        let charIndex = 0
        const typeInterval = setInterval(() => {
          if (charIndex < currentBoot.text.length) {
            setCurrentText(prev => prev + currentBoot.text[charIndex])
            playBeep(400 + Math.random() * 200, 30)
            charIndex++
          } else {
            clearInterval(typeInterval)
            // Move to next boot message after delay
            setTimeout(() => {
              setBootIndex(prev => prev + 1)
              setProgress(prev => Math.min(100, prev + (100 / bootSequence.length)))
            }, currentBoot.delay)
          }
        }, 16 + Math.random() * 8) // Variable typing speed (2.5x faster)
        
        return () => clearInterval(typeInterval)
      } else {
        // Boot complete, show logo
        setTimeout(() => {
          setPhase('logo')
          setLogoVisible(true)
          playBeep(800, 200)
        }, 200)
      }
    }
    
    if (phase === 'logo') {
      const timer = setTimeout(() => {
        setPhase('complete')
        setTimeout(onComplete, 320)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [phase, bootIndex, onComplete, soundEnabled])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Glitch effect for logo reveal
  useEffect(() => {
    if (phase === 'logo' && logoVisible) {
      const glitchInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          const glitched = asciiLogo.split('').map(char => 
            Math.random() < 0.05 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
          ).join('')
          setGlitchText(glitched)
          
          setTimeout(() => setGlitchText(''), 100)
        }
      }, 200)
      
      return () => clearInterval(glitchInterval)
    }
  }, [phase, logoVisible])

  return (
    <div className="h-full w-full bg-black text-green-400 font-mono overflow-hidden">
      <AnimatePresence mode="wait">
        {/* BIOS Phase */}
        {phase === 'bios' && (
          <motion.div
            key="bios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col justify-start p-4"
          >
            <div className="text-xs space-y-1">
              <div>PIXEL WISDOM BIOS v2.1.0</div>
              <div>Copyright (C) 2025 Pixel Wisdom Technologies</div>
              <div className="mt-4">POST - Power On Self Test</div>
              <div className="mt-2">Testing RAM......... OK</div>
              <div>Testing CPU......... OK</div>
              <div>Testing Video....... OK</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-center"
              >
                Press any key to continue...
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Boot Sequence Phase */}
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col justify-start p-4"
          >
            <div className="mb-4 text-xs">
              <div>PIXEL WISDOM OS Loading...</div>
              <div className="border-b border-green-400 w-full my-2"></div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <pre ref={typewriterRef} className="text-xs leading-relaxed whitespace-pre-wrap">
                {bootSequence.slice(0, bootIndex).map((boot, i) => (
                  <div key={i} className="mb-1">
                    [OK] {boot.text}
                  </div>
                ))}
                {bootIndex < bootSequence.length && (
                  <div className="mb-1">
                    [..] {currentText}
                    {showCursor && <span className="bg-green-400 text-black px-1">_</span>}
                  </div>
                )}
              </pre>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Loading Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 border border-green-400">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-green-400"
                  transition={{ type: "tween", ease: "easeInOut" }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logo Reveal Phase */}
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-4"
          >
            <motion.pre
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: logoVisible ? 1 : 0.8, 
                opacity: logoVisible ? 1 : 0 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                duration: 1.5 
              }}
              className="text-green-400 text-xs leading-none text-center select-none"
              style={{
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
              }}
            >
              {glitchText || asciiLogo}
            </motion.pre>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="text-lg font-pixel tracking-wider mb-2">DEVELOPER BLOG</div>
              <div className="text-xs opacity-70">Version 2.1.0 - AI Enhanced</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 2, duration: 1, repeat: Infinity }}
                className="mt-4 text-sm"
              >
                Entering System...
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Completion Phase */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black"
          />
        )}
      </AnimatePresence>

      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div 
          className="w-full h-full opacity-20"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(74, 222, 128, 0.1) 2px,
              rgba(74, 222, 128, 0.1) 4px
            )`
          }}
        />
      </div>
    </div>
  )
} 