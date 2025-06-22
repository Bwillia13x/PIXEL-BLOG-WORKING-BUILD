// Input validation utilities for API routes and user inputs
import path from 'path'

/**
 * Sanitizes a filename to prevent path traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    throw new Error('Filename must be a string')
  }
  
  // Remove any path separators and dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '')
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .trim()
}

/**
 * Validates that a filename is safe for reading
 */
export function validateFileName(fileName: string): boolean {
  const sanitized = sanitizeFileName(fileName)
  
  // Check if filename matches expected pattern
  const validPattern = /^[a-zA-Z0-9.\-_]+\.(md|mdx)$/
  if (!validPattern.test(sanitized)) {
    return false
  }
  
  // Check length limits
  if (sanitized.length > 255 || sanitized.length < 1) {
    return false
  }
  
  return true
}

/**
 * Validates that a file path is within the allowed directory
 */
export function validateFilePath(filePath: string, allowedDirectory: string): boolean {
  try {
    const resolvedPath = path.resolve(filePath)
    const resolvedAllowedDir = path.resolve(allowedDirectory)
    
    return resolvedPath.startsWith(resolvedAllowedDir)
  } catch {
    return false
  }
}

/**
 * Sanitizes content to prevent XSS attacks
 */
export function sanitizeContent(content: string): string {
  if (typeof content !== 'string') {
    throw new Error('Content must be a string')
  }
  
  // Basic sanitization - remove dangerous HTML tags and attributes
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Validates API request parameters
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateApiParams(params: Record<string, unknown>, rules: Record<string, ValidationRule>): ValidationResult {
  const errors: string[] = []
  
  for (const [key, rule] of Object.entries(rules)) {
    const value = params[key]
    
    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`)
      continue
    }
    
    // Skip validation if field is optional and empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue
    }
    
    // Type validation
    if (rule.type && typeof value !== rule.type) {
      errors.push(`${key} must be of type ${rule.type}`)
      continue
    }
    
    // String length validation
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${key} must be at least ${rule.minLength} characters`)
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${key} must be no more than ${rule.maxLength} characters`)
      }
    }
    
    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(`${key} has invalid format`)
    }
    
    // Custom validation
    if (rule.validate && !rule.validate(value)) {
      errors.push(`${key} is invalid`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export interface ValidationRule {
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'object'
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validate?: (value: unknown) => boolean
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || []
    
    // Filter out old requests
    const recentRequests = requests.filter(time => time > windowStart)
    
    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return true
    }
    
    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    
    return false
  }
  
  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const requests = this.requests.get(identifier) || []
    const recentRequests = requests.filter(time => time > windowStart)
    
    return Math.max(0, this.maxRequests - recentRequests.length)
  }
}