import { useState, useEffect } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const { threshold, root, rootMargin, freezeOnceVisible } = options

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(([entry]) => setEntry(entry), observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return entry
}

export default useIntersectionObserver