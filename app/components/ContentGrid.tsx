"use client"

import { useState, useEffect } from 'react'
import { BlogPostCard } from './BlogPostCard'

interface Post {
  id: string
  slug: string
  title: string
  category: string
  date?: string
  content: string
  tags?: string[]
  excerpt?: string
  readTime?: string
  published?: boolean
}

interface ContentGridProps {
  posts: Post[]
  loading?: boolean
  error?: string | null
  filter?: string
  sortBy?: 'date' | 'title' | 'category'
  className?: string
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="pw-card p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 w-20 bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
    </div>
    <div className="h-6 w-3/4 bg-gray-700 rounded mb-3"></div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-full bg-gray-700 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-gray-700 rounded"></div>
      <div className="h-6 w-20 bg-gray-700 rounded"></div>
    </div>
    <div className="h-4 w-24 bg-gray-700 rounded"></div>
  </div>
)

// Empty state component
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
    <div className="text-6xl mb-4 grayscale">🌐</div>
    <h3 className="text-xl font-pixel mb-3 text-gray-400">
      System Initializing...
    </h3>
    <p className="font-mono text-sm text-gray-500">
      No content modules loaded
    </p>
    
    {/* Simple animated dots */}
    <div className="flex space-x-1 mt-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </div>
)

export default function ContentGrid({ 
  posts, 
  loading = false, 
  error = null,
  filter = '',
  sortBy = 'date',
  className = '' 
}: ContentGridProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)

  // Filter and sort posts
  useEffect(() => {
    const filtered = posts.filter(post => 
      filter === '' || 
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.category.toLowerCase().includes(filter.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    )

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          if (!a.date && !b.date) return 0
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    setFilteredPosts(filtered)
  }, [posts, filter, sortBy])

  if (error) {
    return (
      <div className="pw-card p-6 text-center bg-red-900/20 border-red-500/40">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-pixel mb-2 text-red-400">System Error</h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredPosts.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          // Actual content
          filteredPosts.slice(0, 6).map((post) => (
            <div key={post.slug} className="h-full">
              <BlogPostCard post={post} />
            </div>
          ))
        )}
      </div>

      {/* Show more button if there are more posts */}
      {filteredPosts.length > 6 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-gray-800 border border-green-400/30 text-green-400 font-mono text-sm rounded-lg hover:bg-green-400/10 hover:border-green-400 transition-all duration-300">
            Load More ({filteredPosts.length - 6} remaining)
          </button>
        </div>
      )}
    </div>
  )
}