import { NextRequest } from 'next/server'
import { withRateLimit, contactRateLimiter, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import { getCommentDatabase, Comment } from '@/app/lib/database'

// GET /api/comments - Fetch comments for a post or all comments (admin)
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
      const postId = url.searchParams.get('postId')
      const search = url.searchParams.get('search')
      const includeUnpublished = url.searchParams.get('includeUnpublished') === 'true'

      const db = getCommentDatabase()

      // Check if user is admin (for includeUnpublished access)
      const isAdmin = request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN

      let comments: Comment[]

      if (search) {
        // Search comments
        comments = db.searchComments(search, isAdmin && includeUnpublished)
      } else if (postId) {
        // Get comments for specific post
        comments = db.getCommentsByPostId(postId, isAdmin && includeUnpublished)
      } else if (isAdmin) {
        // Get all comments (admin only)
        comments = db.getAllComments(includeUnpublished)
      } else {
        return createSecureResponse(
          { error: 'Post ID is required for public access' },
          400
        )
      }

      // Transform comments into threaded structure
      const threadedComments = buildCommentTree(comments)

      return createSecureResponse({
        comments: threadedComments,
        totalCount: comments.length,
        postId,
        includeUnpublished: isAdmin && includeUnpublished
      })

    } catch (error) {
      console.error('Comments GET API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comments API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to fetch comments' },
        500
      )
    }
  })
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  return withRateLimit(request, contactRateLimiter, async () => {
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

      // Parse request body
      const body = await request.json()
      
      if (!body || typeof body !== 'object') {
        return createSecureResponse(
          { error: 'Invalid request body' },
          400
        )
      }

      // Extract client information
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      // Check if user is admin
      const isAdmin = request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN

      // Prepare comment data
      const commentData = {
        postId: body.postId,
        authorName: body.authorName,
        authorEmail: body.authorEmail,
        content: body.content,
        parentId: body.parentId,
        ipAddress,
        userAgent,
        isAdmin
      }

      const db = getCommentDatabase()
      const result = db.createComment(commentData)

      if (!result.success) {
        SecurityMonitor.logSecurityEvent('validation_error', {
          error: 'Comment creation failed',
          details: result.errors
        }, request)
        return createSecureResponse(
          { error: 'Failed to create comment', details: result.errors },
          400
        )
      }

      // Auto-publish all comments (remove moderation)
      if (result.success && result.comment && !result.comment.published) {
        db.approveComment(result.comment.id)
        result.comment.published = true
      }

      // OPTIONAL: email notification
      if (result.success && process.env.SMTP_HOST) {
        try {
          const nodemailer = (await import('nodemailer')).default
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          })

          await transporter.sendMail({
            from: `Pixel Wisdom Blog <no-reply@pixelwisdom.dev>`,
            to: 'benjiwilli13x@gmail.com',
            subject: `New comment on post ${commentData.postId}`,
            text: `Author: ${commentData.authorName}\nEmail: ${commentData.authorEmail}\nContent:\n${commentData.content}`
          })
        } catch (mailErr) {
          console.warn('Email notification failed:', mailErr)
        }
      }

      // Log successful comment creation
      SecurityMonitor.logSecurityEvent('rate_limit', {
        type: 'comment_created',
        postId: commentData.postId,
        authorName: commentData.authorName,
        isAdmin: commentData.isAdmin
      }, request)

      return createSecureResponse({
        success: true,
        comment: result.comment,
        message: 'Comment published'
      }, 201)

    } catch (error) {
      console.error('Comments POST API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Comment creation error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Failed to create comment' },
        500
      )
    }
  })
}

// Helper function to build comment tree structure
function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>()
  const rootComments: CommentWithReplies[] = []

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, {
      ...comment,
      replies: []
    })
  })

  // Second pass: build tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!
    
    if (comment.parentId) {
      // This is a reply
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies.push(commentWithReplies)
      }
    } else {
      // This is a root comment
      rootComments.push(commentWithReplies)
    }
  })

  return rootComments
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}