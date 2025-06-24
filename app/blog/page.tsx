'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import HeaderSpacer from '@/app/components/HeaderSpacer'

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
  featured?: boolean
  views?: number
}

// interface BlogPageProps {
//   searchParams?: Promise<{ q?: string; category?: string; tag?: string }>
// }

// Lazy-load PageHeader to reduce initial bundle size and defer heavy Matrix animations
const PageHeader = dynamic(() => import('@/app/components/PageHeader'), { ssr: false })

// Enhanced search and filter component
function BlogFilters({ 
  posts, 
  onFilter,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy
}: {
  posts: Post[]
  onFilter: (filtered: Post[]) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedTag: string
  setSelectedTag: (tag: string) => void
  sortBy: 'date' | 'title' | 'views'
  setSortBy: (sort: 'date' | 'title' | 'views') => void
}) {
  const categories = ['All', ...new Set(posts.map(post => post.category))]
  const allTags = ['All', ...new Set(posts.flatMap(post => post.tags || []))]

  useEffect(() => {
    let filtered = posts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Apply tag filter
    if (selectedTag && selectedTag !== 'All') {
      filtered = filtered.filter(post => (post.tags || []).includes(selectedTag))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'views':
          return (b.views || 0) - (a.views || 0)
        case 'date':
        default:
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
      }
    })

    onFilter(filtered)
  }, [posts, searchTerm, selectedCategory, selectedTag, sortBy, onFilter])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700 mb-8"
    >
      <h3 className="text-lg font-pixel text-green-400 mb-4">🔍 Filters & Search</h3>
      
      {/* Enhanced Search Bar */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts, tags, content..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 font-mono text-sm transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 text-sm font-mono"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 text-sm font-mono"
          >
            {allTags.slice(0, 20).map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'views')}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 text-sm font-mono"
          >
            <option value="date">Date (Newest)</option>
            <option value="title">Title (A-Z)</option>
            <option value="views">Views (Most)</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded border border-green-600/30">
            Search: &quot;{searchTerm}&quot;
          </span>
        )}
        {selectedCategory && selectedCategory !== 'All' && (
          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-600/30">
            Category: {selectedCategory}
          </span>
        )}
        {selectedTag && selectedTag !== 'All' && (
          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded border border-purple-600/30">
            Tag: {selectedTag}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// Enhanced post card with hover effects and animations
function PostCard({ post, index }: { post: Post; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full flex flex-col border border-gray-700 rounded-lg p-4 sm:p-5 lg:p-6 bg-gray-900/80 hover:bg-gray-800/80 transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/10 overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Featured badge */}
      {post.featured && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-600 text-black text-xs font-pixel rounded">
          ⭐ Featured
        </div>
      )}

      <div className="relative z-10">
        {/* Post metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-green-600 text-black text-xs font-mono rounded">
            {post.category}
          </span>
          {post.date && (
            <span className="text-gray-400 text-xs font-mono">
              {new Date(post.date).toLocaleDateString()}
            </span>
          )}
          {post.readTime && (
            <span className="text-green-400 text-xs font-mono">
              📖 {post.readTime}
            </span>
          )}
          {post.views && (
            <span className="text-blue-400 text-xs font-mono">
              👁️ {post.views}
            </span>
          )}
        </div>
        
        {/* Post title with strict two-line clipping */}
        <h2 
          className="text-lg sm:text-xl pixel-head mb-3 text-green-400 group-hover:text-green-300 transition-colors leading-tight line-clamp-2"
        >
          <Link href={`/blog/${post.slug}`} className="hover:underline block">
            {post.title}
          </Link>
        </h2>
        
        {/* Post excerpt */}
        <p 
          className="text-gray-200 font-mono mb-4 leading-relaxed text-sm flex-grow line-clamp-3"
        >
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-800 text-green-400 text-xs font-mono rounded border border-green-400/20 hover:bg-green-400/10 transition-colors cursor-pointer truncate"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-gray-500 text-xs font-mono">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Read more link */}
        <div className="mt-auto">
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-green-400 hover:text-green-300 font-mono text-sm transition-all duration-300 group-hover:translate-x-1"
          >
            Read More
            <motion.span 
              className="ml-1"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// Enhanced blog stats with animations
function BlogStats({ posts }: { posts: Post[] }) {
  const categories = [...new Set(posts.map(post => post.category))]
  const totalReadTime = posts.reduce((sum, post) => {
    const minutes = post.readTime ? parseInt(post.readTime) : 5
    return sum + minutes
  }, 0)
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)

  const stats = [
    { label: 'Posts', value: posts.length, icon: '📝', color: 'text-green-400' },
    { label: 'Categories', value: categories.length, icon: '📂', color: 'text-blue-400' },
    { label: 'Read Time', value: `${totalReadTime}m`, icon: '⏱️', color: 'text-purple-400' },
    { label: 'Total Views', value: totalViews, icon: '👁️', color: 'text-yellow-400' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/60 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
    >
      <h3 className="text-lg font-pixel text-green-400 mb-4">📊 Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center group hover:scale-105 transition-transform duration-200"
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className={`text-xl font-pixel ${stat.color} group-hover:animate-pulse`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Reading progress component
function ReadingProgress({ posts }: { posts: Post[] }) {
  const totalWords = posts.reduce((sum, post) => {
    const wordCount = post.content.trim().split(/\s+/).length
    return sum + wordCount
  }, 0)
  
  const estimatedReadTime = Math.ceil(totalWords / 200)
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-900/60 border border-gray-700 rounded-lg p-6"
    >
      <h3 className="text-lg font-pixel text-green-400 mb-4">📖 Reading Journey</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-gray-400">Total Content</span>
          <span className="text-green-400 font-pixel">{totalWords.toLocaleString()} words</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-gray-400">Reading Time</span>
          <span className="text-blue-400 font-pixel">{estimatedReadTime}m</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 1 }}
          />
        </div>
        <p className="text-xs font-mono text-gray-500">Knowledge awaits! 🧠</p>
      </div>
    </motion.div>
  )
}

// Trending topics component
function TrendingTopics({ posts }: { posts: Post[] }) {
  const tagCounts = posts.reduce((acc, post) => {
    (post.tags || []).forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gray-900/60 border border-gray-700 rounded-lg p-6"
    >
      <h3 className="text-lg font-pixel text-green-400 mb-4">🔥 Trending Topics</h3>
      <div className="space-y-2">
        {sortedTags.map(([tag, count], index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono text-gray-300">#{tag}</span>
            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
              {count}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Featured post component with enhanced design
function FeaturedPost({ post }: { post: Post }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
                    <h2 className="text-2xl pixel-head text-green-400 mb-8 flex items-center">
        ⭐ Featured Post
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="ml-2 text-yellow-400"
        >
          ✨
        </motion.div>
      </h2>
      
      <motion.article 
        whileHover={{ scale: 1.02 }}
        className="relative border border-gray-700 rounded-lg p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 hover:border-green-400/60 transition-all duration-300 overflow-hidden group"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-green-600 text-black text-sm font-mono rounded">
              {post.category}
            </span>
            {post.date && (
              <span className="text-gray-400 text-sm font-mono">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {post.readTime && (
              <span className="text-green-400 text-sm font-mono">
                📖 {post.readTime}
              </span>
            )}
          </div>
          
          <h3 className="text-3xl font-pixel mb-4 text-green-400 group-hover:text-green-300 transition-colors">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          
          <p className="text-gray-300 font-mono mb-6 leading-relaxed text-lg">
            {post.excerpt || post.content.substring(0, 300) + '...'}
          </p>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-black font-mono rounded hover:bg-green-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
          >
            Read More
            <motion.span 
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </motion.article>
    </motion.section>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date')

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const fetchedPosts = await response.json()
        setPosts(fetchedPosts)
        setFilteredPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
        // Fallback to empty array on error
        setPosts([])
        setFilteredPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ⚡
        </motion.div>
      </div>
    )
  }

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0]
  const regularPosts = filteredPosts.filter(post => post !== featuredPost)

  return (
    <div className="min-h-screen bg-black">
      {/* Header Spacer to push content below navigation */}
      <HeaderSpacer />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          <PageHeader 
            title="Blog"
            subtitle="Exploring AI, development, and creative coding through a pixel-perfect lens"
            animationType="matrix"
            titleClassName="text-2xl md:text-3xl lg:text-4xl"
            className="mb-12"
            subtitleClassName="text-lg text-gray-300 font-mono max-w-2xl mx-auto"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <BlogFilters
              posts={posts}
              onFilter={setFilteredPosts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gray-900/50 rounded-lg border border-green-400/20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-pixel text-green-400 mb-4">No Posts Found</h3>
                <p className="text-gray-400 font-mono">Try adjusting your filters or search terms.</p>
              </motion.div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && <FeaturedPost post={featuredPost} />}

                {/* Regular Posts Grid */}
                {regularPosts.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl pixel-head text-green-400 mb-8 flex items-center">
                      📝 All Posts
                      <span className="ml-3 text-sm font-mono text-gray-400">
                        ({regularPosts.length} {regularPosts.length === 1 ? 'post' : 'posts'})
                      </span>
                    </h2>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {regularPosts.map((post, index) => (
                        <PostCard key={post.slug} post={post} index={index} />
                      ))}
                    </div>
                  </motion.section>
                )}
              </>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <BlogStats posts={filteredPosts} />
              
              <ReadingProgress posts={posts} />
              <TrendingTopics posts={posts} />
              
              {/* Quick Navigation */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/60 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-pixel text-green-400 mb-4">🧭 Quick Nav</h3>
                <div className="space-y-3">
                  {[
                    { href: '/projects', label: 'View Projects', icon: '🚀' },
                    { href: '/projects/current', label: 'Current Work', icon: '⚡' },
                    { href: '/contact', label: 'Get in Touch', icon: '💬' },
                    { href: '/about', label: 'About Me', icon: '👋' }
                  ].map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Link 
                        href={link.href} 
                        className="flex items-center text-sm text-gray-300 hover:text-green-400 transition-colors font-mono group"
                      >
                        <span className="mr-2 group-hover:scale-110 transition-transform">
                          {link.icon}
                        </span>
                        {link.label}
                        <motion.span 
                          className="ml-auto opacity-0 group-hover:opacity-100"
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Categories */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-900/60 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-pixel text-green-400 mb-4">📂 Categories</h3>
                <div className="space-y-2">
                  {[...new Set(posts.map(post => post.category))].map((category, index) => {
                    const count = posts.filter(post => post.category === category).length
                    return (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center justify-between w-full text-sm font-mono transition-colors p-2 rounded ${
                          selectedCategory === category 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                        }`}
                      >
                        <span>{category}</span>
                        <span className="text-xs">({count})</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              <ReadingProgress posts={posts} />
              <TrendingTopics posts={posts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
