import { NextRequest, NextResponse } from 'next/server'

// Security configuration
interface SecurityConfig {
  contentSecurityPolicy?: boolean
  strictTransportSecurity?: boolean
  xFrameOptions?: boolean
  xContentTypeOptions?: boolean
  referrerPolicy?: boolean
  permissionsPolicy?: boolean
  crossOriginEmbedderPolicy?: boolean
  crossOriginOpenerPolicy?: boolean
  crossOriginResourcePolicy?: boolean
}

// Content Security Policy configuration
interface CSPConfig {
  directives: Record<string, string[]>
  reportOnly?: boolean
  reportUri?: string
}

// Default CSP configuration for the blog
const defaultCSP: CSPConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "'unsafe-eval'", // Required for Next.js development
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components and CSS-in-JS
      'https://fonts.googleapis.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:'
    ],
    'media-src': [
      "'self'",
      'data:',
      'https:'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'connect-src': [
      "'self'",
      'https://vitals.vercel-analytics.com',
      'https://vercel.live',
      'wss://ws.vercel.live'
    ],
    'worker-src': [
      "'self'",
      'blob:'
    ],
    'child-src': [
      "'self'"
    ],
    'manifest-src': [
      "'self'"
    ]
  },
  reportOnly: process.env.NODE_ENV === 'development'
}

// Generate CSP header value
function generateCSPHeader(config: CSPConfig): string {
  const directives = Object.entries(config.directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')

  if (config.reportUri) {
    return `${directives}; report-uri ${config.reportUri}`
  }

  return directives
}

// Security headers configuration
const securityHeaders = {
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()'
  ].join(', '),
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'unsafe-none',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  
  // Remove server information
  'Server': 'Pixel-Wisdom-Blog',
  'X-Powered-By': 'Next.js & It From Bit'
}

// Input sanitization utilities
export class InputSanitizer {
  // Remove potentially dangerous characters from strings
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .trim()
      .replace(/[<>'"&]/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        }
        return entities[char] || char
      })
      .substring(0, 1000) // Limit length
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Sanitize and validate URL
  static sanitizeUrl(url: string): string | null {
    try {
      const parsed = new URL(url)
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null
      }
      
      return parsed.toString()
    } catch {
      return null
    }
  }

  // Remove SQL injection patterns (basic protection)
  static sanitizeForDatabase(input: string): string {
    if (typeof input !== 'string') return ''
    
    const sqlInjectionPatterns = [
      /['";|*%<>{}]/gi,
      /(\%3C|<)(\%2F|\/)*[a-z0-9\%]+(\%3E|>)/gi,
      /(\%3C|<)(\%69|i|\%49)(\%6D|m|\%4D)(\%67|g|\%47)[^\n]+(\%3E|>)/gi
    ]
    
    let sanitized = input
    sqlInjectionPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
    
    return InputSanitizer.sanitizeString(sanitized)
  }

  // Validate and sanitize JSON input
  static sanitizeJson(input: string): any {
    try {
      const parsed = JSON.parse(input)
      
      // Recursively sanitize string values
      function sanitizeObject(obj: any): any {
        if (typeof obj === 'string') {
          return InputSanitizer.sanitizeString(obj)
        } else if (Array.isArray(obj)) {
          return obj.map(sanitizeObject)
        } else if (obj && typeof obj === 'object') {
          const sanitized: any = {}
          for (const [key, value] of Object.entries(obj)) {
            const sanitizedKey = InputSanitizer.sanitizeString(key)
            sanitized[sanitizedKey] = sanitizeObject(value)
          }
          return sanitized
        }
        return obj
      }
      
      return sanitizeObject(parsed)
    } catch {
      return null
    }
  }
}

// Request validation middleware
export function validateRequest(request: NextRequest): { isValid: boolean, errors: string[] } {
  const errors: string[] = []
  
  // Check request size (prevent large payloads)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    errors.push('Request payload too large')
  }
  
  // Check for suspicious user agents (more lenient in development)
  const userAgent = request.headers.get('user-agent')
  if (process.env.NODE_ENV === 'production') {
    if (!userAgent || userAgent.length < 10) {
      errors.push('Invalid or missing user agent')
    }
  } else {
    // In development, only require user agent to exist
    if (!userAgent) {
      errors.push('Missing user agent')
    }
  }
  
  // Check for common bot patterns (if we want to block them)
  const suspiciousBots = [
    'curl', 'wget', 'python-requests', 'postman', 
    'insomnia', 'scanner', 'bot', 'crawler'
  ]
  
  if (userAgent && process.env.NODE_ENV === 'production') {
    const isBot = suspiciousBots.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    )
    if (isBot) {
      // Log but don't block (some legitimate tools use these agents)
      console.warn('Suspicious user agent detected:', userAgent)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Apply security headers to response
export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityConfig = {}
): NextResponse {
  // Apply default security headers
  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.headers.set(header, value)
  })
  
  // Apply Content Security Policy
  if (config.contentSecurityPolicy !== false) {
    const cspValue = generateCSPHeader(defaultCSP)
    const cspHeader = defaultCSP.reportOnly 
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy'
    
    response.headers.set(cspHeader, cspValue)
  }
  
  return response
}

// Security monitoring and logging
export class SecurityMonitor {
  static logSecurityEvent(
    type: 'rate_limit' | 'validation_error' | 'suspicious_request' | 'auth_failure',
    details: Record<string, any>,
    request: NextRequest
  ): void {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      type,
      details,
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      method: request.method
    }
    
    // In production, this should be sent to a security monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.warn('Security Event:', JSON.stringify(securityEvent))
      
      // TODO: Send to security monitoring service (e.g., Sentry, DataDog)
      // await sendToSecurityService(securityEvent)
    } else {
      console.log('Security Event (Dev):', securityEvent)
    }
  }
  
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIp || 'unknown'
  }
}

// Utility function to create secure API responses
export function createSecureResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): NextResponse {
  const response = NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })
  
  return applySecurityHeaders(response)
}

export { securityHeaders, defaultCSP }
export type { SecurityConfig, CSPConfig }