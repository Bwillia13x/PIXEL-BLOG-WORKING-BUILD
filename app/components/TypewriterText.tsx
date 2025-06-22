"use client"

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
  cursor?: boolean
  cursorChar?: string
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  cursor = true,
  cursorChar = '|'
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startTyping()
      }, delay)
      return () => clearTimeout(delayTimer)
    } else {
      startTyping()
    }
  }, [text, speed, delay])

  const startTyping = () => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }

  useEffect(() => {
    if (cursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 530)
      return () => clearInterval(cursorTimer)
    }
  }, [cursor])

  return (
    <span className={className}>
      {displayedText}
      {cursor && (!isComplete || showCursor) && (
        <span className="animate-pulse text-green-400 font-mono">
          {cursorChar}
        </span>
      )}
    </span>
  )
}

export default TypewriterText