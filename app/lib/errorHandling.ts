/**
 * Comprehensive Error Handling and Monitoring System
 * Provides centralized error tracking, logging, and recovery mechanisms
 */

import { SecurityMonitor } from './security'

export interface ErrorInfo {
  id: string
  timestamp: string
  message: string
  stack?: string
  type: ErrorType
  severity: ErrorSeverity
  source: ErrorSource
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
  context?: Record<string, any>
  handled: boolean
}

export type ErrorType = 
  | 'javascript' 
  | 'network' 
  | 'api' 
  | 'validation' 
  | 'authentication' 
  | 'authorization'
  | 'performance'
  | 'memory'
  | 'timeout'
  | 'unknown'

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export type ErrorSource = 
  | 'client' 
  | 'server' 
  | 'api' 
  | 'database' 
  | 'external' 
  | 'network'
  | 'user'

export interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'redirect' | 'refresh' | 'ignore'
  label: string
  action: () => void | Promise<void>
}

export interface ErrorHandlerOptions {
  enableAutoRecovery?: boolean
  enableUserNotification?: boolean
  enableTelemetry?: boolean
  retryAttempts?: number
  retryDelay?: number
  maxErrorsPerSession?: number
}

class ErrorHandlingSystem {
  private errors: ErrorInfo[] = []
  private errorCounts: Map<string, number> = new Map()
  private sessionId: string = this.generateSessionId()
  private options: Required<ErrorHandlerOptions>

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableAutoRecovery: options.enableAutoRecovery ?? true,
      enableUserNotification: options.enableUserNotification ?? true,
      enableTelemetry: options.enableTelemetry ?? true,
      retryAttempts: options.retryAttempts ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      maxErrorsPerSession: options.maxErrorsPerSession ?? 50
    }

    this.initialize()
  }

  private initialize() {
    if (typeof window === 'undefined') return

    // Global error handlers
    window.addEventListener('error', this.handleGlobalError.bind(this))
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))

    // Performance monitoring
    this.setupPerformanceMonitoring()

    // Memory leak detection
    this.setupMemoryMonitoring()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private handleGlobalError(event: ErrorEvent) {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: event.message,
      stack: event.error?.stack,
      type: 'javascript',
      severity: this.determineSeverity(event.error),
      source: 'client',
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      handled: false
    }

    this.logError(errorInfo)
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      type: 'javascript',
      severity: this.determineSeverity(event.reason),
      source: 'client',
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      context: {
        type: 'unhandled_promise_rejection',
        reason: event.reason
      },
      handled: false
    }

    this.logError(errorInfo)
  }

  private setupPerformanceMonitoring() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.duration > 50) { // Long task threshold
            this.logError({
              id: this.generateErrorId(),
              timestamp: new Date().toISOString(),
              message: `Long task detected: ${entry.duration.toFixed(2)}ms`,
              type: 'performance',
              severity: entry.duration > 100 ? 'high' : 'medium',
              source: 'client',
              sessionId: this.sessionId,
              context: {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              },
              handled: true
            })
          }
        })
      })

      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error)
    }
  }

  private setupMemoryMonitoring() {
    if (typeof window === 'undefined') return

    setInterval(() => {
      try {
        // @ts-ignore - performance.memory exists in Chrome
        if (performance.memory) {
          // @ts-ignore
          const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024 // MB
          
          if (memoryUsage > 100) { // 100MB threshold
            this.logError({
              id: this.generateErrorId(),
              timestamp: new Date().toISOString(),
              message: `High memory usage detected: ${memoryUsage.toFixed(2)}MB`,
              type: 'memory',
              severity: memoryUsage > 200 ? 'critical' : 'high',
              source: 'client',
              sessionId: this.sessionId,
              context: {
                // @ts-ignore
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                // @ts-ignore
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                // @ts-ignore
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
              },
              handled: true
            })
          }
        }
      } catch (error) {
        // Memory API not supported
      }
    }, 30000) // Check every 30 seconds
  }

  private determineSeverity(error: any): ErrorSeverity {
    if (!error) return 'low'

    const message = error.message?.toLowerCase() || ''
    const stack = error.stack?.toLowerCase() || ''

    // Critical errors
    if (message.includes('security') || 
        message.includes('csrf') || 
        message.includes('xss') ||
        message.includes('unauthorized')) {
      return 'critical'
    }

    // High severity errors
    if (message.includes('network') ||
        message.includes('timeout') ||
        message.includes('failed to fetch') ||
        message.includes('connection') ||
        stack.includes('chunk') ||
        stack.includes('loading')) {
      return 'high'
    }

    // Medium severity errors
    if (message.includes('validation') ||
        message.includes('parse') ||
        message.includes('format') ||
        message.includes('invalid')) {
      return 'medium'
    }

    return 'low'
  }

  public logError(errorInfo: ErrorInfo) {
    // Prevent error spam
    if (this.errors.length >= this.options.maxErrorsPerSession) {
      return
    }

    // Count error frequency
    const errorKey = `${errorInfo.type}:${errorInfo.message}`
    const count = this.errorCounts.get(errorKey) || 0
    this.errorCounts.set(errorKey, count + 1)

    // Skip if this error is happening too frequently
    if (count > 5) {
      return
    }

    this.errors.push(errorInfo)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${errorInfo.severity}] - ${errorInfo.type}`)
      console.error(errorInfo.message)
      if (errorInfo.stack) console.error(errorInfo.stack)
      if (errorInfo.context) console.table(errorInfo.context)
      console.groupEnd()
    }

    // Send to external monitoring service
    if (this.options.enableTelemetry) {
      this.sendToMonitoringService(errorInfo)
    }

    // Attempt auto-recovery
    if (this.options.enableAutoRecovery && !errorInfo.handled) {
      this.attemptAutoRecovery(errorInfo)
    }

    // Notify user if needed
    if (this.options.enableUserNotification && errorInfo.severity === 'high') {
      this.notifyUser(errorInfo)
    }
  }

  private async sendToMonitoringService(errorInfo: ErrorInfo) {
    try {
      // Send to internal analytics API
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'error',
          timestamp: errorInfo.timestamp,
          properties: {
            errorId: errorInfo.id,
            message: errorInfo.message.substring(0, 100), // Limit message length
            type: errorInfo.type,
            severity: errorInfo.severity,
            source: errorInfo.source,
            sessionId: this.sessionId,
            url: window.location.href
          }
        })
      })
    } catch (error) {
      // Silently fail telemetry to avoid error loops
      console.warn('Failed to send error telemetry:', error)
    }
  }

  private attemptAutoRecovery(errorInfo: ErrorInfo) {
    switch (errorInfo.type) {
      case 'network':
        this.scheduleRetry(() => {
          // Attempt to retry the last failed network request
          window.location.reload()
        })
        break

      case 'api':
        if (errorInfo.context?.endpoint) {
          this.scheduleRetry(async () => {
            // Retry API call with exponential backoff
            await this.retryApiCall(errorInfo.context!.endpoint, errorInfo.context!.options)
          })
        }
        break

      case 'memory':
        // Trigger garbage collection hint
        if ('gc' in window) {
          try {
            // @ts-ignore
            window.gc()
          } catch (e) {
            // GC not available
          }
        }
        break

      case 'performance':
        // Reduce animation quality or disable non-essential features
        this.reducePerformanceLoad()
        break
    }
  }

  private scheduleRetry(action: () => void | Promise<void>, attempt = 1) {
    if (attempt > this.options.retryAttempts) return

    const delay = this.options.retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
    
    setTimeout(async () => {
      try {
        await action()
      } catch (error) {
        this.scheduleRetry(action, attempt + 1)
      }
    }, delay)
  }

  private async retryApiCall(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(endpoint, options)
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }
      return response
    } catch (error) {
      throw error
    }
  }

  private reducePerformanceLoad() {
    // Dispatch event to notify components to reduce performance load
    window.dispatchEvent(new CustomEvent('reduce-performance-load', {
      detail: { reason: 'error-recovery' }
    }))
  }

  private notifyUser(errorInfo: ErrorInfo) {
    // Dispatch event for UI components to show error notification
    window.dispatchEvent(new CustomEvent('show-error-notification', {
      detail: {
        id: errorInfo.id,
        message: this.getUserFriendlyMessage(errorInfo),
        severity: errorInfo.severity,
        recoveryActions: this.getRecoveryActions(errorInfo)
      }
    }))
  }

  private getUserFriendlyMessage(errorInfo: ErrorInfo): string {
    switch (errorInfo.type) {
      case 'network':
        return 'Connection issue detected. Attempting to reconnect...'
      case 'api':
        return 'Service temporarily unavailable. Retrying...'
      case 'performance':
        return 'Performance optimization in progress...'
      case 'memory':
        return 'Optimizing memory usage...'
      case 'validation':
        return 'Please check your input and try again.'
      default:
        return 'Something went wrong. We\'re working to fix it.'
    }
  }

  private getRecoveryActions(errorInfo: ErrorInfo): ErrorRecoveryAction[] {
    const actions: ErrorRecoveryAction[] = []

    actions.push({
      type: 'refresh',
      label: 'Refresh Page',
      action: () => window.location.reload()
    })

    if (errorInfo.type === 'network') {
      actions.push({
        type: 'retry',
        label: 'Retry Connection',
        action: async () => {
          // Attempt to reconnect
          await this.checkConnectivity()
        }
      })
    }

    if (errorInfo.severity !== 'critical') {
      actions.push({
        type: 'ignore',
        label: 'Continue',
        action: () => {
          // Mark error as handled
          errorInfo.handled = true
        }
      })
    }

    return actions
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Public API methods
  public captureError(error: Error, context?: Record<string, any>) {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      type: 'javascript',
      severity: this.determineSeverity(error),
      source: 'client',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      sessionId: this.sessionId,
      context,
      handled: true
    }

    this.logError(errorInfo)
  }

  public captureApiError(endpoint: string, response: Response, context?: Record<string, any>) {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: `API Error: ${response.status} ${response.statusText}`,
      type: 'api',
      severity: response.status >= 500 ? 'high' : 'medium',
      source: 'api',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      sessionId: this.sessionId,
      context: {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        ...context
      },
      handled: true
    }

    this.logError(errorInfo)
  }

  public getErrorStats() {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    const recentErrors = this.errors.filter(e => new Date(e.timestamp).getTime() > oneHourAgo)

    return {
      total: this.errors.length,
      recent: recentErrors.length,
      bySeverity: {
        critical: recentErrors.filter(e => e.severity === 'critical').length,
        high: recentErrors.filter(e => e.severity === 'high').length,
        medium: recentErrors.filter(e => e.severity === 'medium').length,
        low: recentErrors.filter(e => e.severity === 'low').length
      },
      byType: {
        javascript: recentErrors.filter(e => e.type === 'javascript').length,
        network: recentErrors.filter(e => e.type === 'network').length,
        api: recentErrors.filter(e => e.type === 'api').length,
        validation: recentErrors.filter(e => e.type === 'validation').length,
        authentication: recentErrors.filter(e => e.type === 'authentication').length,
        authorization: recentErrors.filter(e => e.type === 'authorization').length,
        performance: recentErrors.filter(e => e.type === 'performance').length,
        memory: recentErrors.filter(e => e.type === 'memory').length,
        timeout: recentErrors.filter(e => e.type === 'timeout').length,
        unknown: recentErrors.filter(e => e.type === 'unknown').length
      },
      sessionId: this.sessionId
    }
  }

  public getRecentErrors(limit = 10): ErrorInfo[] {
    return this.errors.slice(-limit).reverse()
  }

  public clearErrors() {
    this.errors = []
    this.errorCounts.clear()
  }
}

// Global error handler instance
let globalErrorHandler: ErrorHandlingSystem | null = null

export function getErrorHandler(options?: ErrorHandlerOptions): ErrorHandlingSystem {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandlingSystem(options)
  }
  return globalErrorHandler
}

// Convenience functions
export function captureError(error: Error, context?: Record<string, any>) {
  const handler = getErrorHandler()
  handler.captureError(error, context)
}

export function captureApiError(endpoint: string, response: Response, context?: Record<string, any>) {
  const handler = getErrorHandler()
  handler.captureApiError(endpoint, response, context)
}

export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, any>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureError(error, { ...context, function: fn.name, args })
          throw error
        })
      }
      
      return result
    } catch (error) {
      captureError(error as Error, { ...context, function: fn.name, args })
      throw error
    }
  }) as T
}

export { ErrorHandlingSystem }