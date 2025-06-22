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
      let rawData
      try {
        rawData = await request.json()
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        SecurityMonitor.logSecurityEvent('validation_error', {
          error: 'Invalid JSON format'
        }, request)
        return createSecureResponse(
          { error: 'Invalid JSON format' },
          400
        )
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