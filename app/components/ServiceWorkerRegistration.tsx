"use client"

import { useEffect } from 'react'

interface ServiceWorkerRegistrationProps {
  enabled?: boolean
}

export default function ServiceWorkerRegistration({ enabled = true }: ServiceWorkerRegistrationProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        })

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, but old content is still served
                // Show update notification to user
                    }
            })
          }
        })

        // Listen for service worker controller changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Page is now controlled by the new service worker
          })

      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    // Register on load
    if (document.readyState === 'loading') {
      window.addEventListener('load', registerServiceWorker)
    } else {
      registerServiceWorker()
    }

    return () => {
      window.removeEventListener('load', registerServiceWorker)
    }
  }, [enabled])

  return null
}