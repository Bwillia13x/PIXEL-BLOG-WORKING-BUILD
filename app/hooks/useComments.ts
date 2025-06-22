import { useState, useEffect, useCallback } from 'react'
import { Comment } from '@/app/lib/database'

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}

interface CommentFormData {
  authorName: string
  authorEmail?: string
  content: string
  parentId?: string
}

interface UseCommentsOptions {
  postId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseCommentsReturn {
  comments: CommentWithReplies[]
  isLoading: boolean
  error: string | null
  totalCount: number
  submitComment: (data: CommentFormData) => Promise<{ success: boolean; message?: string; error?: string }>
  refreshComments: () => Promise<void>
  canSubmit: boolean
}

export function useComments({ 
  postId, 
  autoRefresh = false, 
  refreshInterval = 30000 
}: UseCommentsOptions): UseCommentsReturn {
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Fetch comments for the post
  const fetchComments = useCallback(async () => {
    if (!postId) return

    try {
      setError(null)
      const response = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`)
      }

      const data = await response.json()
      setComments(data.comments || [])
      setTotalCount(data.totalCount || 0)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load comments')
      setComments([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  // Submit a new comment
  const submitComment = useCallback(async (data: CommentFormData): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!postId) {
      return { success: false, error: 'Post ID is required' }
    }

    try {
      setError(null)
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          postId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || `Failed to submit comment: ${response.status}` 
        }
      }

      // Refresh comments after successful submission
      await fetchComments()

      return {
        success: true,
        message: result.message || 'Comment submitted successfully'
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to submit comment'
      }
    }
  }, [postId, fetchComments])

  // Refresh comments
  const refreshComments = useCallback(async () => {
    setIsLoading(true)
    await fetchComments()
  }, [fetchComments])

  // Initial load
  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return

    const interval = setInterval(fetchComments, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchComments])

  // Check if user can submit comments (basic validation)
  const canSubmit = Boolean(postId && !isLoading)

  return {
    comments,
    isLoading,
    error,
    totalCount,
    submitComment,
    refreshComments,
    canSubmit
  }
}

// Hook for admin comment management
interface UseAdminCommentsOptions {
  includeUnpublished?: boolean
  postId?: string
}

interface UseAdminCommentsReturn {
  comments: CommentWithReplies[]
  isLoading: boolean
  error: string | null
  totalCount: number
  stats: {
    total: number
    published: number
    pending: number
    byPost: Record<string, number>
  } | null
  approveComment: (commentId: string) => Promise<{ success: boolean; error?: string }>
  rejectComment: (commentId: string) => Promise<{ success: boolean; error?: string }>
  deleteComment: (commentId: string) => Promise<{ success: boolean; error?: string }>
  updateComment: (commentId: string, updates: Partial<Comment>) => Promise<{ success: boolean; error?: string }>
  refreshComments: () => Promise<void>
  searchComments: (query: string) => Promise<void>
}

export function useAdminComments({ 
  includeUnpublished = true,
  postId 
}: UseAdminCommentsOptions = {}): UseAdminCommentsReturn {
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState<UseAdminCommentsReturn['stats']>(null)

  // Get admin token from localStorage (assuming admin is logged in)
  const getAdminToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken')
    }
    return null
  }, [])

  // Create headers with admin token
  const createHeaders = useCallback(() => {
    const token = getAdminToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'x-admin-token': token })
    }
  }, [getAdminToken])

  // Fetch comments (admin version)
  const fetchComments = useCallback(async (searchQuery?: string) => {
    try {
      setError(null)
      setIsLoading(true)

      const params = new URLSearchParams()
      if (postId) params.set('postId', postId)
      if (includeUnpublished) params.set('includeUnpublished', 'true')
      if (searchQuery) params.set('search', searchQuery)

      const response = await fetch(`/api/comments?${params.toString()}`, {
        headers: createHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`)
      }

      const data = await response.json()
      setComments(data.comments || [])
      setTotalCount(data.totalCount || 0)
    } catch (err) {
      console.error('Error fetching admin comments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load comments')
      setComments([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [postId, includeUnpublished, createHeaders])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/comments/stats', {
        headers: createHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Error fetching comment stats:', err)
    }
  }, [createHeaders])

  // Approve comment
  const approveComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: 'POST',
        headers: createHeaders()
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Refresh comments after action
      await fetchComments()
      await fetchStats()

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to approve comment' 
      }
    }
  }, [createHeaders, fetchComments, fetchStats])

  // Reject comment
  const rejectComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/reject`, {
        method: 'POST',
        headers: createHeaders()
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Refresh comments after action
      await fetchComments()
      await fetchStats()

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to reject comment' 
      }
    }
  }, [createHeaders, fetchComments, fetchStats])

  // Delete comment
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: createHeaders()
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Refresh comments after action
      await fetchComments()
      await fetchStats()

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete comment' 
      }
    }
  }, [createHeaders, fetchComments, fetchStats])

  // Update comment
  const updateComment = useCallback(async (commentId: string, updates: Partial<Comment>) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updates)
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Refresh comments after action
      await fetchComments()

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update comment' 
      }
    }
  }, [createHeaders, fetchComments])

  // Search comments
  const searchComments = useCallback(async (query: string) => {
    await fetchComments(query)
  }, [fetchComments])

  // Refresh comments
  const refreshComments = useCallback(async () => {
    await fetchComments()
    await fetchStats()
  }, [fetchComments, fetchStats])

  // Initial load
  useEffect(() => {
    fetchComments()
    fetchStats()
  }, [fetchComments, fetchStats])

  return {
    comments,
    isLoading,
    error,
    totalCount,
    stats,
    approveComment,
    rejectComment,
    deleteComment,
    updateComment,
    refreshComments,
    searchComments
  }
}