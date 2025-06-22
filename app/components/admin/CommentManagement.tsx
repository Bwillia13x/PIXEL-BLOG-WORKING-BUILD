'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  UserIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useAdminComments } from '@/app/hooks/useComments'
import { Comment } from '@/app/lib/database'

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
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

function CommentCard({ 
  comment, 
  onApprove, 
  onReject, 
  onDelete,
  isLoading 
}: {
  comment: CommentWithReplies
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLoading: boolean
}) {
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleAction = async (action: () => Promise<void>) => {
    setIsActionLoading(true)
    try {
      await action()
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
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
            </div>
            <div className="flex items-center gap-1">
              {comment.published ? (
                <div className="flex items-center gap-1 text-green-400">
                  <EyeIcon className="w-4 h-4" />
                  <span className="text-xs">Published</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-400">
                  <EyeSlashIcon className="w-4 h-4" />
                  <span className="text-xs">Pending</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-2">
            Post: <span className="text-cyan-400">{comment.postId}</span>
            {comment.authorEmail && (
              <>
                {' • '}Email: <span className="text-cyan-400">{comment.authorEmail}</span>
              </>
            )}
            {comment.parentId && (
              <>
                {' • '}Reply to: <span className="text-cyan-400">{comment.parentId}</span>
              </>
            )}
          </div>

          <div className="prose prose-sm prose-invert max-w-none mb-4">
            <p className="text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!comment.published && (
              <button
                onClick={() => handleAction(() => onApprove(comment.id))}
                disabled={isActionLoading || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Approve
              </button>
            )}

            {!comment.published && (
              <button
                onClick={() => handleAction(() => onReject(comment.id))}
                disabled={isActionLoading || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
              >
                <XCircleIcon className="w-4 h-4" />
                Reject
              </button>
            )}

            <button
              onClick={() => handleAction(() => onDelete(comment.id))}
              disabled={isActionLoading || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>

            {isActionLoading && (
              <ArrowPathIcon className="w-4 h-4 text-cyan-400 animate-spin" />
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 border-l-2 border-cyan-500/20 pl-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CommentManagement() {
  const {
    comments,
    isLoading,
    error,
    totalCount,
    stats,
    approveComment,
    rejectComment,
    deleteComment,
    refreshComments,
    searchComments
  } = useAdminComments({ includeUnpublished: true })

  const [searchQuery, setSearchQuery] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchComments(searchQuery.trim())
    } else {
      await refreshComments()
    }
  }

  const handleApprove = async (commentId: string) => {
    const result = await approveComment(commentId)
    if (result.success) {
      setActionMessage('Comment approved successfully')
    } else {
      setActionMessage(result.error || 'Failed to approve comment')
    }
    setTimeout(() => setActionMessage(null), 3000)
  }

  const handleReject = async (commentId: string) => {
    const result = await rejectComment(commentId)
    if (result.success) {
      setActionMessage('Comment rejected and deleted')
    } else {
      setActionMessage(result.error || 'Failed to reject comment')
    }
    setTimeout(() => setActionMessage(null), 3000)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }
    
    const result = await deleteComment(commentId)
    if (result.success) {
      setActionMessage('Comment deleted successfully')
    } else {
      setActionMessage(result.error || 'Failed to delete comment')
    }
    setTimeout(() => setActionMessage(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChatBubbleLeftIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Comment Management</h1>
            <p className="text-gray-400">Manage and moderate blog comments</p>
          </div>
        </div>
        <button
          onClick={refreshComments}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400">Total Comments</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-green-500/20 p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
                <p className="text-gray-400">Published</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-orange-500/20 p-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-gray-400">Pending Approval</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments by content, author, or post ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-md text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              refreshComments()
            }}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Action Message */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-md ${
              actionMessage.includes('success') || actionMessage.includes('approved') || actionMessage.includes('deleted')
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-red-600/20 text-red-400 border border-red-600/30'
            }`}
          >
            {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-600/20 text-red-400 rounded-md border border-red-600/30">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Comments ({totalCount})
          </h2>
        </div>

        {isLoading && comments.length === 0 ? (
          <div className="text-center py-8">
            <ArrowPathIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-400">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-cyan-500/20">
            <ChatBubbleLeftIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No comments found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search query' : 'Comments will appear here when submitted'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}