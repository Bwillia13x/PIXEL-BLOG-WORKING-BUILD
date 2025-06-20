"use client"

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export interface TerminalCommand {
  command: string
  output: string[]
  timestamp: string
}

export function useTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<TerminalCommand[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('~')
  
  const router = useRouter()
  const audioContextRef = useRef<AudioContext | null>(null)

  // Terminal sound effects
  const playSound = useCallback((frequency: number, duration: number = 0.1) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContextClass()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }, [])

  // Terminal state controls
  const openTerminal = useCallback(() => {
    setIsOpen(true)
    playSound(600, 0.1)
  }, [playSound])

  const closeTerminal = useCallback(() => {
    setIsOpen(false)
    playSound(300, 0.1)
  }, [playSound])

  const toggleTerminal = useCallback(() => {
    if (isOpen) {
      closeTerminal()
    } else {
      openTerminal()
    }
  }, [isOpen, openTerminal, closeTerminal])

  const clearTerminal = useCallback(() => {
    setHistory([])
    playSound(400, 0.05)
  }, [playSound])

  const addToHistory = useCallback((command: TerminalCommand) => {
    setHistory(prev => [...prev, command])
    if (command.command !== 'system') {
      setCommandHistory(prev => [...prev, command.command])
    }
  }, [])

  const navigate = useCallback((path: string) => {
    router.push(path)
    setCurrentPath(path === '/' ? '~' : `~${path}`)
  }, [router])

  return {
    // State
    input,
    setInput,
    history,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    isOpen,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    setSuggestions,
    currentPath,
    setCurrentPath,

    // Actions
    openTerminal,
    closeTerminal,
    toggleTerminal,
    clearTerminal,
    addToHistory,
    navigate,
    playSound,

    // Refs
    audioContextRef
  }
}

export default useTerminal 