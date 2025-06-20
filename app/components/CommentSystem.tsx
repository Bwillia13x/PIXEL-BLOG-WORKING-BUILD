'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftIcon, 
  UserIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface CommentSystemProps {
  postId: string
  postTitle: string
  className?: string
  enabled?: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  replies?: Comment[]
}

// Placeholder data for demo
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Alice Developer',
    content: 'Great insights on value investing! The EPV approach really resonates with my own analysis methodology.',
    timestamp: new Date('2025-01-15'),
    replies: [
      {
        id: '1-1',
        author: 'Benjamin Williams',
        content: 'Thanks Alice! The EPV methodology has been a game changer for my investment process.',
        timestamp: new Date('2025-01-15')
      }
    ]
  },
  {
    id: '2',
    author: 'Bob Investor',
    content: 'Could you elaborate on the Monte Carlo simulation parameters? How do you handle tail risk scenarios?',
    timestamp: new Date('2025-01-16')
  }
]

interface CommentProps {
  comment: Comment
  isReply?: boolean
}

function CommentComponent({ comment, isReply = false }: CommentProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${isReply ? 'ml-8 border-l-2 border-green-400/30 pl-4' : ''}
      `}
    >
      <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-4">
        {/* Comment Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 pixel-border bg-gray-800 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-white font-semibold">
                {comment.author}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <div className="flex items-center space-x-1 text-xs text-gray-400 font-mono">
                <ClockIcon className="h-3 w-3" />
                <span>{formatTimeAgo(comment.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <div className="text-sm text-gray-300 leading-relaxed mb-3">
          {comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
          <button className="hover:text-green-400 transition-colors duration-200">
            Reply
          </button>
          <button className="hover:text-green-400 transition-colors duration-200">
            Like
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentComponent key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function CommentForm({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSubmit(content.trim())
    setContent('')
    setIsSubmitting(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="pixel-border bg-gray-900/40 backdrop-blur-sm p-4"
    >
      <div className="space-y-4">
        {/* Form Header */}
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftIcon className="h-4 w-4 text-green-400" />
          <h4 className="font-mono text-sm text-green-400">Add a comment</h4>
        </div>

        {/* Textarea */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="
              w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white 
              placeholder-gray-400 font-mono text-sm focus:border-green-400 
              focus:outline-none transition-colors duration-200 resize-none
            "
            disabled={isSubmitting}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono">
            Markdown supported • Be respectful
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setContent('')}
              className="
                px-3 py-1 text-xs font-mono text-gray-400 
                hover:text-white transition-colors duration-200
              "
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="
                px-4 py-1 pixel-border bg-green-500/20 text-green-400 
                border-green-500/50 hover:bg-green-500/30 transition-colors 
                duration-200 font-mono text-xs disabled:opacity-50 
                disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  )
}

function DisabledState() {
  return (
    <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-6 text-center">
      <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
      <h3 className="font-mono text-sm text-white mb-2">Comments Coming Soon</h3>
      <p className="text-xs text-gray-400 font-mono mb-4">
        We're working on implementing a secure comment system. In the meantime, 
        feel free to share your thoughts via email or social media.
      </p>
      <div className="flex items-center justify-center space-x-4 text-xs">
        <a 
          href="mailto:contact@example.com" 
          className="text-green-400 hover:text-green-300 transition-colors duration-200 font-mono"
        >
          Email feedback
        </a>
        <span className="text-gray-600">•</span>
        <a 
          href="https://twitter.com/yourhandle" 
          className="text-green-400 hover:text-green-300 transition-colors duration-200 font-mono"
        >
          Tweet at us
        </a>
      </div>
    </div>
  )
}

function ConfigurationPrompt() {
  return (
    <div className="pixel-border bg-blue-500/10 border-blue-500/50 p-4">
      <div className="flex items-start space-x-3">
        <Cog6ToothIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-mono text-sm text-blue-400 mb-2">
            Comment System Configuration
          </h4>
          <div className="text-xs text-gray-300 space-y-2 font-mono">
            <p>Ready to integrate with popular comment providers:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400">
              <li>Disqus - Easy integration, full-featured</li>
              <li>Giscus - GitHub Discussions powered</li>
              <li>Utterances - GitHub Issues based</li>
              <li>Custom API - Full control and customization</li>
            </ul>
            <p className="text-blue-300 mt-3">
              Update the `enabled` prop to activate comments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentSystem({ 
  postId, 
  postTitle, 
  className = "",
  enabled = false 
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(enabled ? MOCK_COMMENTS : [])
  const [showConfig, setShowConfig] = useState(!enabled)

  const handleNewComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'You', // In real implementation, get from auth
      content,
      timestamp: new Date()
    }
    setComments(prev => [newComment, ...prev])
  }

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xl font-bold text-white flex items-center">
          <ChatBubbleLeftIcon className="h-5 w-5 text-green-400 mr-2" />
          Comments
          {enabled && (
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({comments.length})
            </span>
          )}
        </h2>

        {!enabled && (
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="
              text-xs font-mono text-gray-400 hover:text-green-400 
              transition-colors duration-200 flex items-center space-x-1
            "
          >
            <Cog6ToothIcon className="h-3 w-3" />
            <span>Setup</span>
          </button>
        )}
      </div>

      {/* Configuration Prompt */}
      <AnimatePresence>
        {showConfig && !enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConfigurationPrompt />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {enabled ? (
        <div className="space-y-6">
          {/* Comment Form */}
          <CommentForm onSubmit={handleNewComment} />

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map(comment => (
                <CommentComponent key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h3 className="font-mono text-sm text-gray-400 mb-2">
                Be the first to comment
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                Start the conversation about "{postTitle}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <DisabledState />
      )}
    </section>
  )
}