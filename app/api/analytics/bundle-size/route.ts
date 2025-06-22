import { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import fs from 'fs'
import path from 'path'

interface BundleSizeData {
  timestamp: string
  summary: {
    totalJavaScriptKB: number
    totalCSSKB: number
    violationCount: number
    recommendationCount: number
    passesAllBudgets: boolean
  }
  violations: Array<{
    type: string
    severity: string
    current: string
    budget: string
  }>
}

// GET /api/analytics/bundle-size - Get bundle size history and current status
export async function GET(request: NextRequest) {
  return withRateLimit(request, apiRateLimiter, async () => {
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

      const url = new URL(request.url)
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '30'), 100)
      const includeDetails = url.searchParams.get('details') === 'true'

      // Read bundle history
      const historyPath = path.join(process.cwd(), 'bundle-history.json')
      let history: BundleSizeData[] = []

      if (fs.existsSync(historyPath)) {
        try {
          const rawHistory = fs.readFileSync(historyPath, 'utf8')
          history = JSON.parse(rawHistory)
        } catch (error) {
          console.error('Error reading bundle history:', error)
        }
      }

      // Get recent history
      const recentHistory = history.slice(-limit)
      const latest = history[history.length - 1]

      // Calculate trends
      const trends = calculateTrends(history)

      // Read current detailed analysis if requested
      let currentAnalysis = null
      if (includeDetails) {
        const analysisPath = path.join(process.cwd(), '.next', 'bundle-analysis.json')
        if (fs.existsSync(analysisPath)) {
          try {
            const rawAnalysis = fs.readFileSync(analysisPath, 'utf8')
            currentAnalysis = JSON.parse(rawAnalysis)
          } catch (error) {
            console.error('Error reading current analysis:', error)
          }
        }
      }

      return createSecureResponse({
        history: recentHistory,
        latest,
        trends,
        currentAnalysis: includeDetails ? currentAnalysis : undefined,
        totalEntries: history.length,
        generatedAt: new Date().toISOString()
      })

    } catch (error) {
      console.error('Bundle size API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Bundle size API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to fetch bundle size data' },
        500
      )
    }
  })
}

// POST /api/analytics/bundle-size - Record new bundle size data
export async function POST(request: NextRequest) {
  return withRateLimit(request, apiRateLimiter, async () => {
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

      // Check if this is an admin or CI request
      const isAdmin = request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN
      const isCI = request.headers.get('x-ci-token') === process.env.CI_TOKEN
      
      if (!isAdmin && !isCI) {
        SecurityMonitor.logSecurityEvent('auth_failure', {
          action: 'bundle_size_record_unauthorized'
        }, request)
        return createSecureResponse(
          { error: 'Unauthorized' },
          401
        )
      }

      // Parse request body
      const body = await request.json()
      
      if (!body || typeof body !== 'object') {
        return createSecureResponse(
          { error: 'Invalid request body' },
          400
        )
      }

      // Validate bundle size data structure
      const requiredFields = ['summary']
      const missingFields = requiredFields.filter(field => !body[field])
      
      if (missingFields.length > 0) {
        return createSecureResponse(
          { error: 'Missing required fields', fields: missingFields },
          400
        )
      }

      // Prepare bundle size entry
      const bundleSizeEntry: BundleSizeData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalJavaScriptKB: Number(body.summary.totalJavaScriptKB) || 0,
          totalCSSKB: Number(body.summary.totalCSSKB) || 0,
          violationCount: Number(body.summary.violationCount) || 0,
          recommendationCount: Number(body.summary.recommendationCount) || 0,
          passesAllBudgets: Boolean(body.summary.passesAllBudgets)
        },
        violations: Array.isArray(body.violations) ? body.violations : []
      }

      // Read existing history
      const historyPath = path.join(process.cwd(), 'bundle-history.json')
      let history: BundleSizeData[] = []

      if (fs.existsSync(historyPath)) {
        try {
          const rawHistory = fs.readFileSync(historyPath, 'utf8')
          history = JSON.parse(rawHistory)
        } catch (error) {
          console.error('Error reading bundle history:', error)
        }
      }

      // Add new entry
      history.push(bundleSizeEntry)

      // Keep only last 100 entries
      if (history.length > 100) {
        history = history.slice(-100)
      }

      // Save updated history
      try {
        fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
      } catch (error) {
        console.error('Error writing bundle history:', error)
        return createSecureResponse(
          { error: 'Failed to save bundle size data' },
          500
        )
      }

      // Log bundle size event
      SecurityMonitor.logSecurityEvent('rate_limit', {
        type: 'bundle_size_recorded',
        totalJavaScriptKB: bundleSizeEntry.summary.totalJavaScriptKB,
        totalCSSKB: bundleSizeEntry.summary.totalCSSKB,
        passesAllBudgets: bundleSizeEntry.summary.passesAllBudgets
      }, request)

      return createSecureResponse({
        success: true,
        entry: bundleSizeEntry,
        totalEntries: history.length
      }, 201)

    } catch (error) {
      console.error('Bundle size POST API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Bundle size recording error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to record bundle size data' },
        500
      )
    }
  })
}

function calculateTrends(history: BundleSizeData[]) {
  if (history.length < 2) {
    return {
      javascriptTrend: 'stable',
      cssTrend: 'stable',
      violationTrend: 'stable',
      overallTrend: 'stable'
    }
  }

  const recent = history.slice(-10) // Last 10 entries
  const older = history.slice(-20, -10) // Previous 10 entries

  if (recent.length === 0 || older.length === 0) {
    return {
      javascriptTrend: 'stable',
      cssTrend: 'stable', 
      violationTrend: 'stable',
      overallTrend: 'stable'
    }
  }

  // Calculate averages
  const recentJSAvg = recent.reduce((sum, entry) => sum + entry.summary.totalJavaScriptKB, 0) / recent.length
  const olderJSAvg = older.reduce((sum, entry) => sum + entry.summary.totalJavaScriptKB, 0) / older.length
  
  const recentCSSAvg = recent.reduce((sum, entry) => sum + entry.summary.totalCSSKB, 0) / recent.length
  const olderCSSAvg = older.reduce((sum, entry) => sum + entry.summary.totalCSSKB, 0) / older.length
  
  const recentViolationAvg = recent.reduce((sum, entry) => sum + entry.summary.violationCount, 0) / recent.length
  const olderViolationAvg = older.reduce((sum, entry) => sum + entry.summary.violationCount, 0) / older.length

  // Determine trends (5% threshold for significance)
  const jsTrend = Math.abs(recentJSAvg - olderJSAvg) < olderJSAvg * 0.05 ? 'stable' :
                  recentJSAvg > olderJSAvg ? 'increasing' : 'decreasing'
                  
  const cssTrend = Math.abs(recentCSSAvg - olderCSSAvg) < olderCSSAvg * 0.05 ? 'stable' :
                   recentCSSAvg > olderCSSAvg ? 'increasing' : 'decreasing'
                   
  const violationTrend = Math.abs(recentViolationAvg - olderViolationAvg) < 0.5 ? 'stable' :
                         recentViolationAvg > olderViolationAvg ? 'increasing' : 'decreasing'

  // Overall trend considers both size and violations
  let overallTrend = 'stable'
  if (jsTrend === 'increasing' || cssTrend === 'increasing' || violationTrend === 'increasing') {
    overallTrend = 'concerning'
  } else if (jsTrend === 'decreasing' && cssTrend === 'decreasing' && violationTrend === 'decreasing') {
    overallTrend = 'improving'
  }

  return {
    javascriptTrend: jsTrend,
    cssTrend: cssTrend,
    violationTrend: violationTrend,
    overallTrend: overallTrend,
    metrics: {
      recentJSAvg: Math.round(recentJSAvg),
      olderJSAvg: Math.round(olderJSAvg),
      recentCSSAvg: Math.round(recentCSSAvg),
      olderCSSAvg: Math.round(olderCSSAvg),
      recentViolationAvg: Math.round(recentViolationAvg * 10) / 10,
      olderViolationAvg: Math.round(olderViolationAvg * 10) / 10
    }
  }
}