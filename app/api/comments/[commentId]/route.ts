import { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import { getCommentDatabase } from '@/app/lib/database'

// GET /api/comments/[commentId] - Get specific comment
export async function GET(
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

      const { commentId } = await params
      
      if (!commentId) {
        return createSecureResponse(
          { error: 'Comment ID is required' },
          400
        )
      }

      const db = getCommentDatabase()
      const comment = db.getCommentById(commentId)

      if (!comment) {
        return createSecureResponse(
          { error: 'Comment not found' },
          404
        )
      }

      // Check if comment is published or user is admin
      const isAdmin = request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN
      
      if (!comment.published && !isAdmin) {
        return createSecureResponse(
          { error: 'Comment not found' },
          404
        )
      }

      return createSecureResponse({
        comment
      })

    } catch (error) {
      console.error('Comment GET API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment fetch error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to fetch comment' },
        500
      )
    }
  })
}

// PUT /api/comments/[commentId] - Update comment (admin only)
export async function PUT(
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
          action: 'comment_update_unauthorized',
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

      // Parse request body
      const body = await request.json()
      
      if (!body || typeof body !== 'object') {
        return createSecureResponse(
          { error: 'Invalid request body' },
          400
        )
      }

      const db = getCommentDatabase()
      const result = db.updateComment(commentId, body)

      if (!result.success) {
        return createSecureResponse(
          { error: 'Failed to update comment', details: result.errors },
          400
        )
      }

      // Log successful comment update
      SecurityMonitor.logSecurityEvent('rate_limit', {
        type: 'comment_updated',
        commentId,
        updates: Object.keys(body)
      }, request)

      return createSecureResponse({
        success: true,
        comment: result.comment
      })

    } catch (error) {
      console.error('Comment PUT API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment update error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to update comment' },
        500
      )
    }
  })
}

// DELETE /api/comments/[commentId] - Delete comment (admin only)
export async function DELETE(
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
          action: 'comment_delete_unauthorized',
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
      const result = db.deleteComment(commentId)

      if (!result.success) {
        return createSecureResponse(
          { error: 'Failed to delete comment', details: result.errors },
          400
        )
      }

      // Log successful comment deletion
      SecurityMonitor.logSecurityEvent('rate_limit', {
        type: 'comment_deleted',
        commentId
      }, request)

      return createSecureResponse({
        success: true,
        message: 'Comment deleted successfully'
      })

    } catch (error) {
      console.error('Comment DELETE API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment deletion error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to delete comment' },
        500
      )
    }
  })
}