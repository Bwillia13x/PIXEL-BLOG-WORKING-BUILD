"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { BlogPostCard } from './BlogPostCard'
import PixelLoading from './PixelLoading'

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

const loadingVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

// Loading skeleton component
const LoadingSkeleton = ({ index }: { index: number }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.1 }}
    className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-6 animate-pulse"
  >
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
  </motion.div>
)

// Empty state component
const EmptyState = () => (
  <motion.div
    variants={loadingVariants}
    initial="hidden"
    animate="visible"
    className="col-span-full flex flex-col items-center justify-center py-12 text-center"
  >
    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-6xl mb-4 grayscale"
    >
      🌐
    </motion.div>
    <motion.h3 
      className="text-xl font-pixel mb-3 text-gray-400"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      System Initializing...
    </motion.h3>
    <motion.p 
      className="font-mono text-sm text-gray-500"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      No content modules loaded
    </motion.p>
    
    {/* Animated dots */}
    <div className="flex space-x-1 mt-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  </motion.div>
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
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter and sort posts
  useEffect(() => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      let filtered = posts.filter(post => 
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
      setIsTransitioning(false)
    }, 300)
  }, [posts, filter, sortBy])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/20 border border-red-500/40 rounded-lg p-6 text-center"
      >
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-pixel mb-2 text-red-400">System Error</h3>
        <p className="text-red-300 text-sm">{error}</p>
      </motion.div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Grid container with enhanced animations */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={`skeleton-${index}`} index={index} />
            ))
          ) : filteredPosts.length === 0 ? (
            // Empty state
            <EmptyState key="empty-state" />
          ) : (
            // Actual content with staggered animations
            filteredPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={post.slug}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{
                  delay: index * 0.1,
                  layout: { duration: 0.4, ease: "easeInOut" }
                }}
                className="h-full"
              >
                <BlogPostCard post={post} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PixelLoading variant="spinner" size="md" message="Updating..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show more button if there are more posts */}
      {filteredPosts.length > 6 && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="px-6 py-3 bg-gray-800 border border-green-400/30 text-green-400 font-pixel text-sm rounded-lg hover:bg-green-400/10 hover:border-green-400 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Load More ({filteredPosts.length - 6} remaining)
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}