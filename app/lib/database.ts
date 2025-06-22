/**
 * Simple file-based database implementation for comments
 * Suitable for small to medium scale until ready for full database
 */

import fs from 'fs'
import path from 'path'
import { InputSanitizer } from './security'

export interface Comment {
  id: string
  postId: string
  authorName: string
  authorEmail?: string
  content: string
  timestamp: string
  published: boolean
  parentId?: string // for nested replies
  ipAddress?: string
  userAgent?: string
  isAdmin?: boolean
  edited?: boolean
  editedAt?: string
}

export interface CommentData {
  comments: Comment[]
  lastModified: string
  version: string
}

class CommentDatabase {
  private dataDir: string
  private dataFile: string

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data')
    this.dataFile = path.join(this.dataDir, 'comments.json')
    this.ensureDataDir()
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }

    if (!fs.existsSync(this.dataFile)) {
      const initialData: CommentData = {
        comments: [],
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      }
      fs.writeFileSync(this.dataFile, JSON.stringify(initialData, null, 2))
    }
  }

  private readData(): CommentData {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading comment data:', error)
      return {
        comments: [],
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      }
    }
  }

  private writeData(data: CommentData): boolean {
    try {
      data.lastModified = new Date().toISOString()
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error('Error writing comment data:', error)
      return false
    }
  }

  private generateId(): string {
    return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private sanitizeComment(comment: Partial<Comment>): Partial<Comment> {
    if (comment.authorName) {
      comment.authorName = InputSanitizer.sanitizeString(comment.authorName)
    }
    if (comment.authorEmail) {
      comment.authorEmail = InputSanitizer.sanitizeString(comment.authorEmail)
    }
    if (comment.content) {
      comment.content = InputSanitizer.sanitizeString(comment.content)
    }
    if (comment.postId) {
      comment.postId = InputSanitizer.sanitizeString(comment.postId)
    }
    if (comment.parentId) {
      comment.parentId = InputSanitizer.sanitizeString(comment.parentId)
    }
    return comment
  }

  private validateComment(comment: Partial<Comment>): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!comment.postId || comment.postId.trim().length === 0) {
      errors.push('Post ID is required')
    }

    if (!comment.authorName || comment.authorName.trim().length === 0) {
      errors.push('Author name is required')
    } else if (comment.authorName.length > 100) {
      errors.push('Author name must be less than 100 characters')
    }

    if (comment.authorEmail && !InputSanitizer.validateEmail(comment.authorEmail)) {
      errors.push('Invalid email format')
    }

    if (!comment.content || comment.content.trim().length === 0) {
      errors.push('Comment content is required')
    } else if (comment.content.length > 5000) {
      errors.push('Comment must be less than 5000 characters')
    }

    if (comment.parentId) {
      const data = this.readData()
      const parentExists = data.comments.some(c => c.id === comment.parentId)
      if (!parentExists) {
        errors.push('Parent comment not found')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  public createComment(commentData: Partial<Comment>): { success: boolean, comment?: Comment, errors?: string[] } {
    // Sanitize input
    const sanitized = this.sanitizeComment(commentData)
    
    // Validate comment
    const validation = this.validateComment(sanitized)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    // Create comment
    const comment: Comment = {
      id: this.generateId(),
      postId: sanitized.postId!,
      authorName: sanitized.authorName!,
      authorEmail: sanitized.authorEmail,
      content: sanitized.content!,
      timestamp: new Date().toISOString(),
      published: false, // Default to unpublished for moderation
      parentId: sanitized.parentId,
      ipAddress: sanitized.ipAddress,
      userAgent: sanitized.userAgent,
      isAdmin: sanitized.isAdmin || false,
      edited: false
    }

    // Auto-approve admin comments
    if (comment.isAdmin) {
      comment.published = true
    }

    // Read current data
    const data = this.readData()
    
    // Add comment
    data.comments.push(comment)
    
    // Write data
    const success = this.writeData(data)
    
    return success 
      ? { success: true, comment }
      : { success: false, errors: ['Failed to save comment'] }
  }

  public getCommentsByPostId(postId: string, includeUnpublished = false): Comment[] {
    const data = this.readData()
    const sanitizedPostId = InputSanitizer.sanitizeString(postId)
    
    return data.comments
      .filter(comment => 
        comment.postId === sanitizedPostId && 
        (includeUnpublished || comment.published)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  public getCommentById(commentId: string): Comment | null {
    const data = this.readData()
    const sanitizedId = InputSanitizer.sanitizeString(commentId)
    
    return data.comments.find(comment => comment.id === sanitizedId) || null
  }

  public updateComment(commentId: string, updates: Partial<Comment>): { success: boolean, comment?: Comment, errors?: string[] } {
    const data = this.readData()
    const sanitizedId = InputSanitizer.sanitizeString(commentId)
    const commentIndex = data.comments.findIndex(comment => comment.id === sanitizedId)
    
    if (commentIndex === -1) {
      return { success: false, errors: ['Comment not found'] }
    }

    // Sanitize updates
    const sanitizedUpdates = this.sanitizeComment(updates)
    
    // Update comment
    const existingComment = data.comments[commentIndex]
    const updatedComment: Comment = {
      ...existingComment,
      ...sanitizedUpdates,
      id: existingComment.id, // Prevent ID changes
      timestamp: existingComment.timestamp, // Preserve original timestamp
      edited: true,
      editedAt: new Date().toISOString()
    }

    // Validate updated comment
    const validation = this.validateComment(updatedComment)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    data.comments[commentIndex] = updatedComment
    
    const success = this.writeData(data)
    
    return success 
      ? { success: true, comment: updatedComment }
      : { success: false, errors: ['Failed to update comment'] }
  }

  public deleteComment(commentId: string): { success: boolean, errors?: string[] } {
    const data = this.readData()
    const sanitizedId = InputSanitizer.sanitizeString(commentId)
    const initialCount = data.comments.length
    
    // Remove comment and its replies
    data.comments = data.comments.filter(comment => 
      comment.id !== sanitizedId && comment.parentId !== sanitizedId
    )
    
    if (data.comments.length === initialCount) {
      return { success: false, errors: ['Comment not found'] }
    }
    
    const success = this.writeData(data)
    
    return success 
      ? { success: true }
      : { success: false, errors: ['Failed to delete comment'] }
  }

  public approveComment(commentId: string): { success: boolean, comment?: Comment, errors?: string[] } {
    return this.updateComment(commentId, { published: true })
  }

  public rejectComment(commentId: string): { success: boolean, errors?: string[] } {
    return this.deleteComment(commentId)
  }

  public getAllComments(includeUnpublished = false): Comment[] {
    const data = this.readData()
    
    return data.comments
      .filter(comment => includeUnpublished || comment.published)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  public getCommentStats(): {
    total: number
    published: number
    pending: number
    byPost: Record<string, number>
  } {
    const data = this.readData()
    const stats = {
      total: data.comments.length,
      published: data.comments.filter(c => c.published).length,
      pending: data.comments.filter(c => !c.published).length,
      byPost: {} as Record<string, number>
    }

    // Count comments by post
    data.comments.forEach(comment => {
      if (comment.published) {
        stats.byPost[comment.postId] = (stats.byPost[comment.postId] || 0) + 1
      }
    })

    return stats
  }

  public searchComments(query: string, includeUnpublished = false): Comment[] {
    const data = this.readData()
    const searchQuery = InputSanitizer.sanitizeString(query).toLowerCase()
    
    if (!searchQuery.trim()) {
      return []
    }

    return data.comments
      .filter(comment => {
        if (!includeUnpublished && !comment.published) return false
        
        const searchText = [
          comment.content,
          comment.authorName,
          comment.postId
        ].join(' ').toLowerCase()
        
        return searchText.includes(searchQuery)
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}

// Global database instance
let commentDB: CommentDatabase | null = null

export function getCommentDatabase(): CommentDatabase {
  if (!commentDB) {
    commentDB = new CommentDatabase()
  }
  return commentDB
}

export { CommentDatabase }