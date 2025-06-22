import { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import { getCommentDatabase } from '@/app/lib/database'

// GET /api/comments/stats - Get comment statistics (admin only)
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

      // Check admin authentication
      const isAdmin = request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN
      if (!isAdmin) {
        SecurityMonitor.logSecurityEvent('auth_failure', {
          action: 'comment_stats_unauthorized'
        }, request)
        return createSecureResponse(
          { error: 'Unauthorized' },
          401
        )
      }

      const db = getCommentDatabase()
      const stats = db.getCommentStats()
      
      // Get recent comments for quick overview
      const recentComments = db.getAllComments(true)
        .slice(0, 10)
        .map(comment => ({
          id: comment.id,
          postId: comment.postId,
          authorName: comment.authorName,
          content: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
          timestamp: comment.timestamp,
          published: comment.published
        }))

      return createSecureResponse({
        stats,
        recentComments,
        generatedAt: new Date().toISOString()
      })

    } catch (error) {
      console.error('Comment stats API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment stats error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to fetch comment statistics' },
        500
      )
    }
  })
}