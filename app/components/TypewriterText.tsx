"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
  cursor?: boolean
  cursorChar?: string
  once?: boolean
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  cursor = true,
  cursorChar = '|',
  once = true
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const hasCompletedRef = useRef(false)
  const textRef = useRef(text)

  useEffect(() => {
    if (once && hasCompletedRef.current && textRef.current === text) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }
    
    if (textRef.current !== text) {
      textRef.current = text
      hasCompletedRef.current = false
      setDisplayedText('')
      setIsComplete(false)
    }
  }, [text, once])

  const startTyping = useCallback(() => {
    if (once && hasCompletedRef.current && textRef.current === text) {
      return
    }

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        hasCompletedRef.current = true
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [once, text, speed, onComplete])

  useEffect(() => {
    if (cursor && !isComplete) {
      const cursorTimer = setInterval(() => {
        setShowCursor((prev: boolean) => !prev)
      }, 530)
      return () => clearInterval(cursorTimer)
    }
  }, [cursor, isComplete])

  useEffect(() => {
    if (once && hasCompletedRef.current && textRef.current === text) {
      return
    }

    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startTyping()
      }, delay)
      return () => clearTimeout(delayTimer)
    } else {
      startTyping()
    }
  }, [text, speed, delay, once, startTyping])

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && showCursor && (
        <span className="text-green-400 font-mono">
          {cursorChar}
        </span>
      )}
    </span>
  )
}

export default TypewriterText