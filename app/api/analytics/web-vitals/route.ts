import { NextRequest } from 'next/server'
import { withRateLimit, analyticsRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, InputSanitizer, createSecureResponse, SecurityMonitor } from '@/app/lib/security'

export async function POST(request: NextRequest) {
  return withRateLimit(request, analyticsRateLimiter, async () => {
    try {
      // Validate request
      const validation = validateRequest(request)
      if (!validation.isValid) {
        SecurityMonitor.logSecurityEvent('validation_error', {
          errors: validation.errors
        }, request)
        return createSecureResponse(
          { error: 'Invalid request', details: validation.errors },
          400
        )
      }

      // Parse and sanitize data
      const rawData = await request.json()
      const sanitizedData = InputSanitizer.sanitizeJson(JSON.stringify(rawData))
      
      if (!sanitizedData) {
        SecurityMonitor.logSecurityEvent('validation_error', {
          error: 'Invalid JSON data'
        }, request)
        return createSecureResponse(
          { error: 'Invalid JSON data' },
          400
        )
      }

      // Validate Web Vitals data structure
      const validMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP']
      if (sanitizedData.name && !validMetrics.includes(sanitizedData.name)) {
        return createSecureResponse(
          { error: 'Invalid metric name', validMetrics },
          400
        )
      }

      // Validate numeric values
      if (sanitizedData.value && (typeof sanitizedData.value !== 'number' || sanitizedData.value < 0)) {
        return createSecureResponse(
          { error: 'Invalid metric value' },
          400
        )
      }

      // Process Web Vitals data (placeholder for actual analytics logic)
      console.log('Web Vitals metric received:', {
        name: sanitizedData.name,
        value: sanitizedData.value,
        rating: sanitizedData.rating,
        timestamp: Date.now(),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })

      return createSecureResponse({ success: true })
    } catch (error) {
      console.error('Error in /api/analytics/web-vitals:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Internal server error' },
        500
      )
    }
  })
}