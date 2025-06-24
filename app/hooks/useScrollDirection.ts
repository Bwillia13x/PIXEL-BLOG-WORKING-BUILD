import { useState, useEffect, useRef, useCallback } from 'react'

interface ScrollState {
  scrollY: number
  scrollDirection: 'up' | 'down' | null
  isScrolled: boolean
  isAtTop: boolean
}

export const useScrollDirection = (threshold: number = 10) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false,
    isAtTop: true
  })

  const lastScrollYRef = useRef(0)

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY
    const scrollDirection = scrollY > lastScrollYRef.current ? 'down' : 'up'
    const isScrolled = scrollY > threshold
    const isAtTop = scrollY < threshold

    if (Math.abs(scrollY - lastScrollYRef.current) > 5) {
      setScrollState({ scrollY, scrollDirection, isScrolled, isAtTop })
      lastScrollYRef.current = scrollY > 0 ? scrollY : 0
    }
  }, [threshold])

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [updateScrollState])

  return scrollState
} 