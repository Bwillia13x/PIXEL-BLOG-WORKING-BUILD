'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { WebSiteStructuredData, PersonStructuredData } from './StructuredData'
import WebVitalsMonitor from './WebVitalsMonitor'

interface SEOLayoutProps {
  children: React.ReactNode
}

// Service Worker registration
function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              console.log('New content available! Please refresh.')
              
              // You could show a toast notification here
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Update Available', {
                  body: 'New content is available. Please refresh the page.',
                  icon: '/icons/icon-192x192.png',
                  tag: 'update-available'
                })
              }
            }
          })
        }
      })

      console.log('SW registered:', registration)
    } catch (error) {
      console.log('SW registration failed:', error)
    }
  })
}

// Performance monitoring
function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor navigation timing
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ssl: navigation.connectEnd - navigation.secureConnectionStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domParse: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalLoad: navigation.loadEventEnd - navigation.startTime
      }

      console.log('Performance Metrics:', metrics)
      
      // Send to analytics
      if ('gtag' in window) {
        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            ;(window as any).gtag('event', 'timing_complete', {
              name: key,
              value: Math.round(value)
            })
          }
        })
      }
    }
  })

  // Monitor resource loading
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming
        
        // Log slow resources
        if (resource.duration > 1000) {
          console.warn('Slow resource:', resource.name, `${Math.round(resource.duration)}ms`)
        }
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['resource'] })
  } catch (error) {
    console.warn('PerformanceObserver not supported')
  }
}

// Analytics initialization
function initializeAnalytics() {
  if (typeof window === 'undefined') return

  // Google Analytics 4 (if you have a GA4 ID)
  if (process.env.NEXT_PUBLIC_GA_ID) {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    script.async = true
    document.head.appendChild(script)

    ;(window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(args)
    }
    ;(window as any).gtag = gtag

    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_title: document.title,
      page_location: window.location.href
    })
  }

  // Custom analytics
  const sendAnalytics = (event: string, data: any) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(error => {
      console.warn('Analytics error:', error)
    })
  }

  // Track page views
  sendAnalytics('page_view', {
    title: document.title,
    referrer: document.referrer
  })

  // Track user engagement
  let engagementTime = 0
  let lastActiveTime = Date.now()

  const updateEngagement = () => {
    const now = Date.now()
    engagementTime += now - lastActiveTime
    lastActiveTime = now
  }

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  events.forEach(event => {
    document.addEventListener(event, updateEngagement, { passive: true })
  })

  // Send engagement on page unload
  window.addEventListener('beforeunload', () => {
    updateEngagement()
    if (engagementTime > 5000) { // Only track if user was engaged for 5+ seconds
      sendAnalytics('engagement', {
        time: engagementTime,
        page: window.location.pathname
      })
    }
  })
}

// Accessibility features
function initializeAccessibility() {
  if (typeof window === 'undefined') return

  // Skip link functionality
  const skipLink = document.querySelector('a[href="#main-content"]')
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById('main-content')
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }

  // High contrast mode detection
  const mediaQuery = window.matchMedia('(prefers-contrast: high)')
  const handleContrastChange = (e: MediaQueryListEvent) => {
    document.documentElement.classList.toggle('high-contrast', e.matches)
  }
  
  mediaQuery.addEventListener('change', handleContrastChange)
  handleContrastChange({ matches: mediaQuery.matches } as MediaQueryListEvent)

  // Reduced motion detection
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handleMotionChange = (e: MediaQueryListEvent) => {
    document.documentElement.classList.toggle('reduce-motion', e.matches)
  }
  
  motionQuery.addEventListener('change', handleMotionChange)
  handleMotionChange({ matches: motionQuery.matches } as MediaQueryListEvent)

  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    // Enable focus outlines when using keyboard
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation')
    }
  })

  document.addEventListener('mousedown', () => {
    // Disable focus outlines when using mouse
    document.body.classList.remove('keyboard-navigation')
  })
}

// Resource hints
function injectResourceHints() {
  if (typeof window === 'undefined') return

  const head = document.head

  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ]

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    head.appendChild(link)
  })

  // Preconnect to critical domains
  const preconnectDomains = [
    { href: 'https://fonts.gstatic.com', crossOrigin: true }
  ]

  preconnectDomains.forEach(({ href, crossOrigin }) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    if (crossOrigin) link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })

  // Preload critical assets
  const preloadAssets = [
    { href: '/fonts/JetBrainsMono-Regular.woff2', as: 'font', type: 'font/woff2' },
    { href: '/icons/icon-192x192.png', as: 'image' }
  ]

  preloadAssets.forEach(({ href, as, type }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    if (as === 'font') link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })
}

// Page view tracking
function usePageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pathname,
      })
    }

    // Update document title for SPA navigation
    const updateTitle = () => {
      if (pathname === '/') {
        document.title = siteConfig.title
      } else {
        const pageName = pathname.split('/').pop()?.replace('-', ' ') || 'Page'
        document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | ${siteConfig.name}`
      }
    }

    updateTitle()
  }, [pathname])
}

export default function SEOLayout({ children }: SEOLayoutProps) {
  usePageTracking()

  useEffect(() => {
    // Initialize all SEO and performance features
    registerServiceWorker()
    initializePerformanceMonitoring()
    initializeAnalytics()
    initializeAccessibility()
    injectResourceHints()

    // Preload critical pages
    const preloadPages = ['/about', '/projects', '/blog']
    preloadPages.forEach(page => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = page
      document.head.appendChild(link)
    })

    // Critical resource loading
    const loadCriticalResources = async () => {
      // Preload above-the-fold images
      const criticalImages = document.querySelectorAll('img[data-priority]')
      criticalImages.forEach(img => {
        if (img instanceof HTMLImageElement) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = img.src
          document.head.appendChild(link)
        }
      })
    }

    // Run after initial render
    setTimeout(loadCriticalResources, 100)

    // Cleanup function
    return () => {
      // Remove event listeners if needed
    }
  }, [])

  return (
    <>
      {/* Global structured data */}
      <WebSiteStructuredData
        name={siteConfig.name}
        description={siteConfig.description}
        url={siteConfig.url}
        searchUrl={`${siteConfig.url}/search?q={search_term_string}`}
      />
      
      <PersonStructuredData
        name={siteConfig.creator}
        jobTitle="Full-Stack Developer & Creative Technologist"
        description={siteConfig.description}
        url={siteConfig.url}
        image={`${siteConfig.url}/avatar.jpg`}
        sameAs={Object.values(siteConfig.social).filter(Boolean)}
        email={siteConfig.social.email}
        skills={siteConfig.keywords}
      />

      {/* Main content */}
      {children}

      {/* Web Vitals Monitor */}
      <WebVitalsMonitor 
        debug={process.env.NODE_ENV === 'development'}
        reportToAnalytics={true}
        showWidget={process.env.NODE_ENV === 'development'}
      />

      {/* Critical CSS for above-the-fold content */}
      <style jsx>{`
        body {
          font-display: swap;
        }
        
        .keyboard-navigation *:focus {
          outline: 2px solid #10b981 !important;
          outline-offset: 2px !important;
        }
        
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .high-contrast {
          filter: contrast(150%);
        }
        
        /* Pixel-perfect loading states */
        .loading-placeholder {
          background: linear-gradient(
            90deg,
            #1f2937 25%,
            #374151 50%,
            #1f2937 75%
          );
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Critical font loading */
        @font-face {
          font-family: 'JetBrains Mono';
          src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
    </>
  )
}