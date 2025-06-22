import { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import { getCommentDatabase } from '@/app/lib/database'

// POST /api/comments/[commentId]/reject - Reject comment (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
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
          action: 'comment_reject_unauthorized',
          commentId: 'unknown'
        }, request)
        return createSecureResponse(
          { error: 'Unauthorized' },
          401
        )
      }

      const { commentId } = await params
      
      if (!commentId) {
        return createSecureResponse(
          { error: 'Comment ID is required' },
          400
        )
      }

      const db = getCommentDatabase()
      const result = db.rejectComment(commentId)

      if (!result.success) {
        return createSecureResponse(
          { error: 'Failed to reject comment', details: result.errors },
          400
        )
      }

      // Log successful comment rejection
      SecurityMonitor.logSecurityEvent('rate_limit', {
        type: 'comment_rejected',
        commentId
      }, request)

      return createSecureResponse({
        success: true,
        message: 'Comment rejected and deleted'
      })

    } catch (error) {
      console.error('Comment reject API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment rejection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to reject comment' },
        500
      )
    }
  })
}