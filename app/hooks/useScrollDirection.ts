import { useState, useEffect } from 'react'

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

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollState = () => {
      const scrollY = window.scrollY
      const scrollDirection = scrollY > lastScrollY ? 'down' : 'up'
      const isScrolled = scrollY > threshold
      const isAtTop = scrollY < threshold

      // Only update if scroll direction has meaningfully changed
      if (Math.abs(scrollY - lastScrollY) > 5) {
        setScrollState({
          scrollY,
          scrollDirection,
          isScrolled,
          isAtTop
        })
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrollState
} 