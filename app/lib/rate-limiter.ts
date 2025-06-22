import { NextRequest } from 'next/server'

interface RateLimitStore {
  count: number
  resetTime: number
  firstRequest: number
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
  message?: string
  headers?: boolean
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

class RateLimiter {
  private store = new Map<string, RateLimitStore>()
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      skipSuccessfulRequests: config.skipSuccessfulRequests ?? false,
      skipFailedRequests: config.skipFailedRequests ?? false,
      keyGenerator: config.keyGenerator ?? this.defaultKeyGenerator,
      message: config.message ?? 'Too many requests',
      headers: config.headers ?? true
    }

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  private defaultKeyGenerator(request: NextRequest): string {
    // Get IP from various headers (accounting for proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = request.headers.get('x-client-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIp || clientIp || 'unknown'
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, store] of this.store.entries()) {
      if (now > store.resetTime) {
        this.store.delete(key)
      }
    }
  }

  public async check(request: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request)
    const now = Date.now()
    
    let store = this.store.get(key)
    
    // If no store exists or window has expired, create new one
    if (!store || now > store.resetTime) {
      store = {
        count: 0,
        resetTime: now + this.config.windowMs,
        firstRequest: now
      }
      this.store.set(key, store)
    }

    // Increment counter
    store.count++

    const remaining = Math.max(0, this.config.maxRequests - store.count)
    const success = store.count <= this.config.maxRequests

    const result: RateLimitResult = {
      success,
      limit: this.config.maxRequests,
      remaining,
      reset: store.resetTime
    }

    if (!success) {
      result.retryAfter = Math.ceil((store.resetTime - now) / 1000)
    }

    return result
  }

  public createHeaders(result: RateLimitResult): Headers {
    const headers = new Headers()
    
    if (this.config.headers) {
      headers.set('X-RateLimit-Limit', result.limit.toString())
      headers.set('X-RateLimit-Remaining', result.remaining.toString())
      headers.set('X-RateLimit-Reset', result.reset.toString())
      
      if (result.retryAfter) {
        headers.set('Retry-After', result.retryAfter.toString())
      }
    }

    return headers
  }
}

// Pre-configured rate limiters for different use cases
export const createApiRateLimiter = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many API requests, please try again later'
})

export const createStrictRateLimiter = () => new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
  message: 'Rate limit exceeded, please slow down'
})

export const createAnalyticsRateLimiter = () => new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 analytics events per minute
  message: 'Analytics rate limit exceeded'
})

export const createContactRateLimiter = () => new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 contact form submissions per hour
  message: 'Contact form rate limit exceeded, please try again later'
})

// Global rate limiter instances
export const apiRateLimiter = createApiRateLimiter()
export const strictRateLimiter = createStrictRateLimiter()
export const analyticsRateLimiter = createAnalyticsRateLimiter()
export const contactRateLimiter = createContactRateLimiter()

// Utility function to handle rate limiting in API routes
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    const result = await rateLimiter.check(request)
    const headers = rateLimiter.createHeaders(result)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests, please try again later',
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers.entries())
          }
        }
      )
    }

    // Execute the handler
    const response = await handler()

    // Add rate limit headers to successful responses
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value)
    }

    return response
  } catch (error) {
    console.error('Rate limiter error:', error)
    
    // If rate limiter fails, allow the request but log the error
    return await handler()
  }
}

export { RateLimiter }
export type { RateLimitConfig, RateLimitResult }