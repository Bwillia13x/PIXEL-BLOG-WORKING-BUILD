import { Post } from '@/app/data/posts'

export interface RelatedPostsOptions {
  maxResults?: number
  tagWeight?: number
  categoryWeight?: number
  dateWeight?: number
  titleWeight?: number
  excludeCurrentPost?: boolean
  minScore?: number
}

export interface RelatedPost extends Post {
  similarity: number
  reasons: string[]
}

const DEFAULT_OPTIONS: Required<RelatedPostsOptions> = {
  maxResults: 3,
  tagWeight: 0.4,
  categoryWeight: 0.3,
  titleWeight: 0.2,
  dateWeight: 0.1,
  excludeCurrentPost: true,
  minScore: 0.1
}

function calculateTagSimilarity(post1: Post, post2: Post): number {
  const tags1 = new Set(post1.tags || [])
  const tags2 = new Set(post2.tags || [])
  
  if (tags1.size === 0 && tags2.size === 0) return 0
  if (tags1.size === 0 || tags2.size === 0) return 0
  
  const intersection = new Set([...tags1].filter(tag => tags2.has(tag)))
  const union = new Set([...tags1, ...tags2])
  
  return intersection.size / union.size // Jaccard similarity
}

function calculateCategorySimilarity(post1: Post, post2: Post): number {
  if (!post1.category || !post2.category) return 0
  return post1.category.toLowerCase() === post2.category.toLowerCase() ? 1 : 0
}

function calculateTitleSimilarity(post1: Post, post2: Post): number {
  const words1 = new Set(
    post1.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3) // Ignore short words
  )
  
  const words2 = new Set(
    post2.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
  )
  
  if (words1.size === 0 && words2.size === 0) return 0
  if (words1.size === 0 || words2.size === 0) return 0
  
  const intersection = new Set([...words1].filter(word => words2.has(word)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

function calculateDateSimilarity(post1: Post, post2: Post): number {
  if (!post1.date || !post2.date) return 0
  
  const date1 = new Date(post1.date).getTime()
  const date2 = new Date(post2.date).getTime()
  
  const daysDifference = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
  
  // Higher similarity for posts published closer together
  // Decay factor: posts within 30 days = high similarity, beyond 365 days = low similarity
  return Math.exp(-daysDifference / 180) // Exponential decay
}

function getMatchReasons(post1: Post, post2: Post, scores: {
  tags: number
  category: number
  title: number
  date: number
}): string[] {
  const reasons: string[] = []
  
  if (scores.category > 0) {
    reasons.push(`Same category: ${post2.category}`)
  }
  
  if (scores.tags > 0.3) {
    const sharedTags = (post1.tags || []).filter(tag => 
      (post2.tags || []).includes(tag)
    )
    if (sharedTags.length > 0) {
      reasons.push(`Shared tags: ${sharedTags.slice(0, 2).join(', ')}${sharedTags.length > 2 ? '...' : ''}`)
    }
  }
  
  if (scores.title > 0.2) {
    reasons.push('Similar topics')
  }
  
  if (scores.date > 0.5) {
    reasons.push('Published around the same time')
  }
  
  return reasons
}

export function findRelatedPosts(
  currentPost: Post,
  allPosts: Post[],
  options: RelatedPostsOptions = {}
): RelatedPost[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const candidates = opts.excludeCurrentPost 
    ? allPosts.filter(post => post.id !== currentPost.id)
    : allPosts
  
  const scoredPosts: RelatedPost[] = candidates.map(post => {
    const scores = {
      tags: calculateTagSimilarity(currentPost, post),
      category: calculateCategorySimilarity(currentPost, post),
      title: calculateTitleSimilarity(currentPost, post),
      date: calculateDateSimilarity(currentPost, post)
    }
    
    const similarity = 
      scores.tags * opts.tagWeight +
      scores.category * opts.categoryWeight +
      scores.title * opts.titleWeight +
      scores.date * opts.dateWeight
    
    const reasons = getMatchReasons(currentPost, post, scores)
    
    return {
      ...post,
      similarity,
      reasons
    }
  })
  
  return scoredPosts
    .filter(post => post.similarity >= opts.minScore)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, opts.maxResults)
}

export function findPostsByTag(
  tag: string,
  allPosts: Post[],
  excludePostId?: string,
  maxResults: number = 5
): Post[] {
  return allPosts
    .filter(post => 
      post.id !== excludePostId &&
      (post.tags || []).some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    )
    .slice(0, maxResults)
}

export function findPostsByCategory(
  category: string,
  allPosts: Post[],
  excludePostId?: string,
  maxResults: number = 5
): Post[] {
  return allPosts
    .filter(post => 
      post.id !== excludePostId &&
      post.category?.toLowerCase() === category.toLowerCase()
    )
    .slice(0, maxResults)
}

export function getPopularTags(allPosts: Post[], minCount: number = 2): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>()
  
  allPosts.forEach(post => {
    (post.tags || []).forEach(tag => {
      const normalizedTag = tag.toLowerCase()
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .filter(([, count]) => count >= minCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getSimilarityExplanation(similarity: number): string {
  if (similarity >= 0.7) return 'Highly related'
  if (similarity >= 0.5) return 'Related'
  if (similarity >= 0.3) return 'Somewhat related'
  if (similarity >= 0.1) return 'Loosely related'
  return 'Not related'
}

export function groupPostsByCategory(posts: Post[]): Record<string, Post[]> {
  return posts.reduce((groups, post) => {
    const category = post.category || 'Uncategorized'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(post)
    return groups
  }, {} as Record<string, Post[]>)
}

export function getRecentPosts(
  allPosts: Post[],
  excludePostId?: string,
  maxResults: number = 5
): Post[] {
  return allPosts
    .filter(post => post.id !== excludePostId && post.date)
    .sort((a, b) => {
      const dateA = new Date(a.date!).getTime()
      const dateB = new Date(b.date!).getTime()
      return dateB - dateA
    })
    .slice(0, maxResults)
}