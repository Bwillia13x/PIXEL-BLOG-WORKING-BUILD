// Service Worker for It From Bit Blog
// Version 1.0.0

const CACHE_NAME = 'pixel-wisdom-v1'
const STATIC_CACHE_NAME = 'pixel-wisdom-static-v1'
const DYNAMIC_CACHE_NAME = 'pixel-wisdom-dynamic-v1'
const IMAGE_CACHE_NAME = 'pixel-wisdom-images-v1'

// Cache durations
const CACHE_DURATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  DYNAMIC: 24 * 60 * 60 * 1000,    // 1 day
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 5 * 60 * 1000                // 5 minutes
}

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/contact',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  '/blog/',
  '/projects/',
  '/_next/static/'
]

// Cache-first resources (serve from cache, update in background)
const CACHE_FIRST = [
  '/icons/',
  '/images/',
  '/screenshots/',
  '/_next/static/',
  '.js',
  '.css',
  '.woff',
  '.woff2'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(handleFetch(request))
})

async function handleFetch(request) {
  const url = new URL(request.url)
  
  try {
    // Handle different resource types with appropriate strategies
    
    // API requests - network first with short cache
    if (isNetworkFirst(url.pathname)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE_NAME, CACHE_DURATION.API)
    }
    
    // Images - cache first with long expiry
    if (isImage(url.pathname)) {
      return await cacheFirstStrategy(request, IMAGE_CACHE_NAME, CACHE_DURATION.IMAGES)
    }
    
    // Static assets - cache first
    if (isCacheFirst(url.pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE_NAME, CACHE_DURATION.STATIC)
    }
    
    // HTML pages - stale while revalidate
    if (isHTMLPage(request)) {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE_NAME, CACHE_DURATION.DYNAMIC)
    }
    
    // Default - network first
    return await networkFirstStrategy(request, DYNAMIC_CACHE_NAME, CACHE_DURATION.DYNAMIC)
    
  } catch (error) {
    console.error('[SW] Fetch error:', error)
    return await getOfflineFallback(request)
  }
}

// Network first strategy
async function networkFirstStrategy(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      // Clone response before caching
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cachedResponse = await getCachedResponse(request, cacheName, maxAge)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Cache first strategy
async function cacheFirstStrategy(request, cacheName, maxAge) {
  const cachedResponse = await getCachedResponse(request, cacheName, maxAge)
  
  if (cachedResponse) {
    // Update cache in background
    updateCache(request, cacheName)
    return cachedResponse
  }
  
  // Fallback to network
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Both cache and network failed:', error)
    throw error
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidateStrategy(request, cacheName, maxAge) {
  const cachedResponse = await getCachedResponse(request, cacheName, maxAge)
  
  // Always try to update from network in background
  const networkPromise = updateCache(request, cacheName)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  // If no cache, wait for network
  try {
    return await networkPromise
  } catch (error) {
    console.error('[SW] Network failed and no cache available:', error)
    throw error
  }
}

// Get cached response with age check
async function getCachedResponse(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  const response = await cache.match(request)
  
  if (!response) {
    return null
  }
  
  // Check cache age
  const cachedDate = response.headers.get('sw-cached-date')
  if (cachedDate) {
    const age = Date.now() - parseInt(cachedDate)
    if (age > maxAge) {
      console.log('[SW] Cache expired for:', request.url)
      await cache.delete(request)
      return null
    }
  }
  
  return response
}

// Update cache in background
async function updateCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      
      // Add timestamp to response
      const responseWithTimestamp = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cached-date': Date.now().toString()
        }
      })
      
      await cache.put(request, responseWithTimestamp)
      return networkResponse
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Background update failed:', error)
    throw error
  }
}

// Get offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url)
  
  if (isHTMLPage(request)) {
    const cache = await caches.open(STATIC_CACHE_NAME)
    const offlinePage = await cache.match('/offline')
    
    if (offlinePage) {
      return offlinePage
    }
  }
  
  if (isImage(url.pathname)) {
    // Return a placeholder image for failed image requests
    const cache = await caches.open(STATIC_CACHE_NAME)
    const placeholder = await cache.match('/icons/icon-192x192.png')
    
    if (placeholder) {
      return placeholder
    }
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This request requires an internet connection.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

// Helper functions
function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some(pattern => pathname.startsWith(pattern))
}

function isCacheFirst(pathname) {
  return CACHE_FIRST.some(pattern => pathname.includes(pattern))
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname)
}

function isHTMLPage(request) {
  return request.headers.get('accept')?.includes('text/html')
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm())
  }
  
  if (event.tag === 'analytics') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncContactForm() {
  try {
    // Get pending contact form submissions from IndexedDB
    const pendingForms = await getPendingContactForms()
    
    for (const form of pendingForms) {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        })
        
        // Remove from pending queue
        await removePendingContactForm(form.id)
        
        // Notify client of success
        await notifyClient('contact-form-sent', form.id)
        
      } catch (error) {
        console.error('[SW] Failed to sync contact form:', error)
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error)
  }
}

async function syncAnalytics() {
  try {
    // Sync analytics events when back online
    const pendingEvents = await getPendingAnalytics()
    
    for (const event of pendingEvents) {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event.data)
        })
        
        await removePendingAnalytics(event.id)
        
      } catch (error) {
        console.error('[SW] Failed to sync analytics:', error)
      }
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  
  if (!event.data) {
    return
  }
  
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    timestamp: Date.now(),
    vibrate: data.vibrate || [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event)
  
  event.notification.close()
  
  const data = event.notification.data
  let url = '/'
  
  if (event.action) {
    url = data.actions?.[event.action]?.url || url
  } else {
    url = data.url || url
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing tab
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new tab if no existing tab found
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Message handling for client communication
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }
  
  if (event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateSpecificCache(event.data.url))
    return
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(getCacheSize().then(size => {
      event.ports[0].postMessage({ size })
    }))
    return
  }
})

async function updateSpecificCache(url) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      await cache.put(url, response)
    }
  } catch (error) {
    console.error('[SW] Failed to update specific cache:', error)
  }
}

async function getCacheSize() {
  try {
    const cacheNames = await caches.keys()
    let totalSize = 0
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      
      for (const key of keys) {
        const response = await cache.match(key)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }
    
    return totalSize
  } catch (error) {
    console.error('[SW] Failed to calculate cache size:', error)
    return 0
  }
}

// Utility functions for IndexedDB operations (placeholder implementations)
async function getPendingContactForms() {
  // Implementation would use IndexedDB to store/retrieve pending forms
  return []
}

async function removePendingContactForm(id) {
  // Implementation would remove form from IndexedDB
}

async function getPendingAnalytics() {
  // Implementation would use IndexedDB to store/retrieve pending analytics
  return []
}

async function removePendingAnalytics(id) {
  // Implementation would remove analytics from IndexedDB
}

async function notifyClient(type, data) {
  const clients = await self.clients.matchAll()
  clients.forEach(client => {
    client.postMessage({ type, data })
  })
}

console.log('[SW] Service worker loaded successfully')