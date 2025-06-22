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
      let rawData: any = {}
      try {
        // Only attempt to parse if content-type indicates JSON and body is present
        const contentType = request.headers.get('content-type') || ''
        const contentLength = Number(request.headers.get('content-length') || 0)
        if (contentType.includes('application/json') && contentLength > 0) {
          rawData = await request.json()
        }
      } catch (parseError) {
        console.warn('JSON parsing error in /api/analytics (ignored):', parseError)
        // Fallback to empty object so we still respond quickly
        rawData = {}
      }
      
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

      // Basic analytics data validation
      const requiredFields = ['event', 'timestamp']
      const missingFields = requiredFields.filter(field => !sanitizedData[field])
      
      // If payload is empty, treat as no-op and respond quickly
      if (Object.keys(rawData).length === 0 || missingFields.length === requiredFields.length) {
        return createSecureResponse({ success: true, noop: true })
      }

      if (missingFields.length > 0) {
        return createSecureResponse(
          { error: 'Missing required fields', fields: missingFields },
          400
        )
      }

      // Process analytics data (placeholder for actual analytics logic)
      console.log('Analytics event received:', {
        event: sanitizedData.event,
        timestamp: sanitizedData.timestamp,
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })

      return createSecureResponse({ success: true })
    } catch (error) {
      console.error('Error in /api/analytics:', error)
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