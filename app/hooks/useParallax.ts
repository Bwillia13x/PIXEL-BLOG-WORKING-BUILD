"use client"

import { useEffect, useState, useRef, useCallback } from 'react'

interface ParallaxOptions {
  speed?: number
  direction?: 'vertical' | 'horizontal' | 'both'
  offset?: number
  disabled?: boolean
  throttle?: number
}

export function useParallax(options: ParallaxOptions = {}) {
  const {
    speed = 0.5,
    direction = 'vertical',
    offset = 0,
    disabled = false,
    throttle = 16 // ~60fps
  } = options

  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const lastScrollTime = useRef(0)
  const rafId = useRef<number>()

  const handleScroll = useCallback(() => {
    const now = Date.now()
    if (now - lastScrollTime.current < throttle) return

    lastScrollTime.current = now
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }
    
    rafId.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY)
      setScrollX(window.scrollX)
    })
  }, [throttle])

  useEffect(() => {
    if (disabled) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [handleScroll, disabled])

  const getTransform = useCallback(() => {
    const baseY = (scrollY + offset) * speed
    const baseX = (scrollX + offset) * speed

    switch (direction) {
      case 'horizontal':
        return `translateX(${baseX}px)`
      case 'both':
        return `translate(${baseX}px, ${baseY}px)`
      case 'vertical':
      default:
        return `translateY(${baseY}px)`
    }
  }, [scrollY, scrollX, speed, direction, offset])

  const getStyle = useCallback(() => ({
    transform: getTransform(),
    willChange: 'transform'
  }), [getTransform])

  return {
    scrollY,
    scrollX,
    transform: getTransform(),
    style: getStyle()
  }
}

export default useParallax