'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftIcon, 
  UserIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useComments } from '@/app/hooks/useComments'
import { Comment } from '@/app/lib/database'

interface CommentSystemProps {
  postId: string
  postTitle: string
  className?: string
  enabled?: boolean
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}

interface CommentFormData {
  authorName: string
  authorEmail: string
  content: string
  parentId?: string
}

function formatRelativeTime(date: string): string {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInMs = now.getTime() - commentDate.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return commentDate.toLocaleDateString()
}

function CommentForm({ 
  onSubmit, 
  isSubmitting, 
  parentId, 
  onCancel 
}: {
  onSubmit: (data: CommentFormData) => Promise<void>
  isSubmitting: boolean
  parentId?: string
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState<CommentFormData>({
    authorName: '',
    authorEmail: '',
    content: '',
    parentId
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Name is required'
    } else if (formData.authorName.length > 100) {
      newErrors.authorName = 'Name must be less than 100 characters'
    }

    if (formData.authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authorEmail)) {
      newErrors.authorEmail = 'Please enter a valid email address'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required'
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Comment must be less than 5000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      
      // Reset form on successful submission
      setFormData({
        authorName: '',
        authorEmail: '',
        content: '',
        parentId
      })
      setErrors({})
      
      if (onCancel) onCancel() // Close reply form
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-md text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.authorName && (
            <p className="text-red-400 text-sm mt-1">{errors.authorName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-2">
            Email (optional)
          </label>
          <input
            type="email"
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-md text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
          {errors.authorEmail && (
            <p className="text-red-400 text-sm mt-1">{errors.authorEmail}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">
          Comment *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-md text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors resize-vertical"
          placeholder="Share your thoughts..."
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-red-400 text-sm mt-1">{errors.content}</p>
        )}
        <p className="text-gray-400 text-sm mt-1">
          {formData.content.length}/5000 characters
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          {isSubmitting ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-4 h-4" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {parentId && (
        <p className="text-sm text-gray-400">
          Replying to comment...
        </p>
      )}
    </motion.form>
  )
}

function CommentItem({ 
  comment, 
  isReply = false, 
  onReply 
}: {
  comment: CommentWithReplies
  isReply?: boolean
  onReply: (parentId: string) => void
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isReply 
          ? 'ml-8 border-l-2 border-cyan-500/20 pl-4' 
          : 'border border-cyan-500/20 rounded-lg p-4'
      } space-y-3`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-white">
              {comment.authorName}
              {comment.isAdmin && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-600/20 text-cyan-400 rounded-full">
                  Admin
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>{formatRelativeTime(comment.timestamp)}</span>
              {comment.edited && (
                <span className="text-xs text-gray-500">(edited)</span>
              )}
              {!comment.published && (
                <div className="flex items-center gap-1 text-orange-400">
                  <EyeSlashIcon className="w-4 h-4" />
                  <span className="text-xs">Pending approval</span>
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {!isReply && comment.published && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {showReplyForm ? 'Cancel Reply' : 'Reply'}
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      <AnimatePresence>
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              onSubmit={async (data) => {
                await onReply(comment.id)
                setShowReplyForm(false)
              }}
              isSubmitting={false}
              parentId={comment.id}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function CommentSystemV2({ 
  postId, 
  postTitle, 
  className = '', 
  enabled = true 
}: CommentSystemProps) {
  const {
    comments,
    isLoading,
    error,
    totalCount,
    submitComment,
    refreshComments,
    canSubmit
  } = useComments({ postId, autoRefresh: true, refreshInterval: 60000 })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleSubmitComment = async (data: CommentFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await submitComment(data)
      
      if (result.success) {
        setSubmitMessage(result.message || 'Comment submitted successfully!')
        setTimeout(() => setSubmitMessage(null), 5000)
      } else {
        setSubmitMessage(result.error || 'Failed to submit comment')
      }
    } catch (error) {
      setSubmitMessage('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string) => {
    setReplyingTo(parentId)
  }

  if (!enabled) {
    return (
      <div className={`bg-gray-900/50 rounded-lg border border-cyan-500/20 p-8 text-center ${className}`}>
        <Cog6ToothIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Comments Coming Soon</h3>
        <p className="text-gray-400 mb-6">
          Comments are currently being configured for this blog.
        </p>
        <div className="text-sm text-gray-500 space-y-2">
          <p>💬 Real-time comment system with moderation</p>
          <p>🔒 Secure and privacy-focused</p>
          <p>🎨 Pixel-perfect design integration</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ChatBubbleLeftIcon className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">
            Comments ({totalCount})
          </h3>
        </div>
        
        <button
          onClick={refreshComments}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed"
          title="Refresh comments"
        >
          <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Submit Message */}
      <AnimatePresence>
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-md ${
              submitMessage.includes('success') || submitMessage.includes('submitted')
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-red-600/20 text-red-400 border border-red-600/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {submitMessage.includes('success') || submitMessage.includes('submitted') ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5" />
              )}
              {submitMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-600/20 text-red-400 rounded-md border border-red-600/30">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            {error}
          </div>
        </div>
      )}

      {/* Comment Form */}
      {canSubmit && (
        <div className="mb-8">
          <CommentForm
            onSubmit={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-8">
            <ArrowPathIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-400">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-500">
              Be the first to share your thoughts on "{postTitle}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}