import { Post } from '@/app/types/Post'
export type { Post } from '@/app/types/Post'

// Client-side function to fetch posts from API
export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch('/api/posts')
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// For compatibility with existing code that expects posts to be available immediately
// This should be replaced with fetchPosts() in components that need posts data
export const posts: Post[] = []

// Helper functions for common operations
export function getPostBySlug(posts: Post[], slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}

export function getPostsByCategory(posts: Post[], category: string): Post[] {
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase())
}

export function getPublishedPosts(posts: Post[]): Post[] {
  return posts.filter(post => post.published !== false)
}

export function searchPosts(posts: Post[], query: string): Post[] {
  const lowercaseQuery = query.toLowerCase()
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.excerpt?.toLowerCase().includes(lowercaseQuery)
  )
}
