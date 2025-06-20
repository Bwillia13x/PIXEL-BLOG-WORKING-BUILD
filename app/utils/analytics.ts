interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: Date
}

interface PostAnalytics {
  postId: string
  title: string
  views: number
  timeOnPage: number
  scrollDepth: number
  readingProgress: number
  shares: Record<string, number>
  referrers: Record<string, number>
  lastViewed: Date
}

interface ReadingSession {
  startTime: Date
  currentScrollDepth: number
  maxScrollDepth: number
  timeSpent: number
  isActive: boolean
}

class BlogAnalytics {
  private session: ReadingSession | null = null
  private events: AnalyticsEvent[] = []
  private postAnalytics: Map<string, PostAnalytics> = new Map()
  private isEnabled: boolean
  private debugMode: boolean

  constructor(enabled: boolean = true, debug: boolean = false) {
    this.isEnabled = enabled
    this.debugMode = debug
    
    if (typeof window !== 'undefined') {
      this.loadStoredData()
      this.setupEventListeners()
    }
  }

  private log(message: string, data?: any) {
    if (this.debugMode) {
      console.log(`[BlogAnalytics] ${message}`, data)
    }
  }

  private loadStoredData() {
    try {
      const stored = localStorage.getItem('blog-analytics')
      if (stored) {
        const data = JSON.parse(stored)
        this.postAnalytics = new Map(data.posts || [])
        this.log('Loaded stored analytics data', { posts: this.postAnalytics.size })
      }
    } catch (error) {
      this.log('Error loading stored data', error)
    }
  }

  private saveData() {
    try {
      const data = {
        posts: Array.from(this.postAnalytics.entries()),
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('blog-analytics', JSON.stringify(data))
      this.log('Saved analytics data')
    } catch (error) {
      this.log('Error saving data', error)
    }
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession()
      } else {
        this.resumeSession()
      }
    })

    // Track scroll events
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      if (this.session && this.session.isActive) {
        const scrollDepth = this.calculateScrollDepth()
        this.session.currentScrollDepth = scrollDepth
        this.session.maxScrollDepth = Math.max(this.session.maxScrollDepth, scrollDepth)

        // Debounce scroll events
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          this.trackEvent('scroll_depth', {
            depth: scrollDepth,
            maxDepth: this.session?.maxScrollDepth
          })
        }, 500)
      }
    }, { passive: true })

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })

    // Track clicks on external links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        this.trackEvent('external_link_click', {
          url: link.href,
          text: link.textContent?.trim() || 'Unknown'
        })
      }
    })
  }

  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    return Math.min(100, Math.round(((scrollTop + windowHeight) / documentHeight) * 100))
  }

  startSession(postId: string, postTitle: string) {
    if (!this.isEnabled) return

    this.endSession() // End any existing session

    this.session = {
      startTime: new Date(),
      currentScrollDepth: 0,
      maxScrollDepth: 0,
      timeSpent: 0,
      isActive: true
    }

    // Initialize or update post analytics
    if (!this.postAnalytics.has(postId)) {
      this.postAnalytics.set(postId, {
        postId,
        title: postTitle,
        views: 0,
        timeOnPage: 0,
        scrollDepth: 0,
        readingProgress: 0,
        shares: {},
        referrers: {},
        lastViewed: new Date()
      })
    }

    // Increment view count
    const analytics = this.postAnalytics.get(postId)!
    analytics.views += 1
    analytics.lastViewed = new Date()

    // Track referrer
    const referrer = document.referrer || 'Direct'
    const referrerHost = referrer === 'Direct' ? 'Direct' : new URL(referrer).hostname
    analytics.referrers[referrerHost] = (analytics.referrers[referrerHost] || 0) + 1

    this.trackEvent('page_view', {
      postId,
      title: postTitle,
      referrer: referrerHost,
      timestamp: this.session.startTime
    })

    this.log('Started session', { postId, postTitle })
  }

  pauseSession() {
    if (this.session && this.session.isActive) {
      this.session.isActive = false
      this.updateTimeSpent()
      this.log('Paused session')
    }
  }

  resumeSession() {
    if (this.session && !this.session.isActive) {
      this.session.isActive = true
      this.session.startTime = new Date() // Reset start time
      this.log('Resumed session')
    }
  }

  endSession() {
    if (!this.session) return

    this.updateTimeSpent()
    this.session.isActive = false

    // Find the current post analytics
    const currentPost = Array.from(this.postAnalytics.values()).find(p => 
      p.lastViewed.getTime() === Math.max(...Array.from(this.postAnalytics.values()).map(p => p.lastViewed.getTime()))
    )

    if (currentPost) {
      currentPost.scrollDepth = Math.max(currentPost.scrollDepth, this.session.maxScrollDepth)
      currentPost.readingProgress = this.session.maxScrollDepth
    }

    this.trackEvent('session_end', {
      duration: this.session.timeSpent,
      maxScrollDepth: this.session.maxScrollDepth
    })

    this.saveData()
    this.session = null
    this.log('Ended session')
  }

  private updateTimeSpent() {
    if (!this.session || !this.session.isActive) return

    const now = new Date()
    const timeSpent = now.getTime() - this.session.startTime.getTime()
    this.session.timeSpent += timeSpent
    this.session.startTime = now

    // Update post analytics
    const currentPost = Array.from(this.postAnalytics.values()).find(p => 
      p.lastViewed.getTime() === Math.max(...Array.from(this.postAnalytics.values()).map(p => p.lastViewed.getTime()))
    )

    if (currentPost) {
      currentPost.timeOnPage = Math.max(currentPost.timeOnPage, this.session.timeSpent)
    }
  }

  trackShare(platform: string, postId?: string) {
    if (!this.isEnabled) return

    this.trackEvent('share', { platform, postId })

    // Update post analytics if we have a current post
    const currentPost = postId ? this.postAnalytics.get(postId) : 
      Array.from(this.postAnalytics.values()).find(p => 
        p.lastViewed.getTime() === Math.max(...Array.from(this.postAnalytics.values()).map(p => p.lastViewed.getTime()))
      )

    if (currentPost) {
      currentPost.shares[platform] = (currentPost.shares[platform] || 0) + 1
      this.saveData()
    }

    this.log('Tracked share', { platform, postId })
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date()
    }

    this.events.push(analyticsEvent)
    this.log('Tracked event', analyticsEvent)

    // Send to external analytics if configured
    this.sendToExternalAnalytics(analyticsEvent)
  }

  private sendToExternalAnalytics(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        custom_parameter: event.properties,
        timestamp: event.timestamp
      })
    }

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.event, { props: event.properties })
    }

    // Custom API endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(error => this.log('Error sending to analytics API', error))
    }
  }

  getPostAnalytics(postId: string): PostAnalytics | null {
    return this.postAnalytics.get(postId) || null
  }

  getAllPostAnalytics(): PostAnalytics[] {
    return Array.from(this.postAnalytics.values())
  }

  getTopPosts(limit: number = 10): PostAnalytics[] {
    return this.getAllPostAnalytics()
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  getTotalStats() {
    const posts = this.getAllPostAnalytics()
    
    return {
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      totalPosts: posts.length,
      averageTimeOnPage: posts.length > 0 ? 
        posts.reduce((sum, p) => sum + p.timeOnPage, 0) / posts.length : 0,
      averageScrollDepth: posts.length > 0 ? 
        posts.reduce((sum, p) => sum + p.scrollDepth, 0) / posts.length : 0,
      totalShares: posts.reduce((sum, p) => 
        sum + Object.values(p.shares).reduce((shareSum, count) => shareSum + count, 0), 0
      )
    }
  }

  exportData(): string {
    return JSON.stringify({
      posts: Array.from(this.postAnalytics.entries()),
      events: this.events,
      exported: new Date().toISOString()
    }, null, 2)
  }

  clearData() {
    this.postAnalytics.clear()
    this.events = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blog-analytics')
    }
    this.log('Cleared all analytics data')
  }
}

// Global analytics instance
let analytics: BlogAnalytics | null = null

export function initializeAnalytics(enabled: boolean = true, debug: boolean = false) {
  if (typeof window !== 'undefined' && !analytics) {
    analytics = new BlogAnalytics(enabled, debug)
  }
  return analytics
}

export function getAnalytics(): BlogAnalytics | null {
  return analytics
}

// Convenience functions
export function trackPageView(postId: string, postTitle: string) {
  analytics?.startSession(postId, postTitle)
}

export function trackShare(platform: string, postId?: string) {
  analytics?.trackShare(platform, postId)
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  analytics?.trackEvent(event, properties)
}

export function endSession() {
  analytics?.endSession()
}

export { BlogAnalytics }
export type { PostAnalytics, AnalyticsEvent }