'use client'

import Link from 'next/link'
import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Tag, ArrowRight, Bookmark, Eye } from 'lucide-react'
import { Post } from '@/app/types/Post'

interface BlogPostCardProps {
  post: Post
  variant?: 'compact' | 'featured' | 'grid'
  priority?: 'high' | 'normal' | 'low'
}

function BlogPostCardComponent({ 
  post, 
  variant = 'grid',
  priority = 'normal'
}: BlogPostCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Enhanced date formatting for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Enhanced hover animations based on priority
  const getHoverEffect = () => {
    switch (priority) {
      case 'high':
        return { y: -6, scale: 1.02, boxShadow: '0 25px 50px rgba(74, 222, 128, 0.15)' }
      case 'low':
        return { y: -2, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }
      default:
        return { y: -4, scale: 1.01, boxShadow: '0 20px 40px rgba(74, 222, 128, 0.1)' }
    }
  }

  return (
    <motion.article 
      className="group relative h-full flex flex-col gpu-optimized"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={getHoverEffect()}
    >
      {/* Enhanced glow effect for featured posts */}
      {(post.featured || variant === 'featured') && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-green-400/5 to-transparent rounded-lg blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Priority indicator */}
      {priority === 'high' && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Enhanced glow effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-400/10 to-transparent rounded-lg blur-xl"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1.05 : 1 
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      
      {/* Enhanced main card with improved proportions */}
      <motion.div 
        className="pw-card relative h-full flex flex-col p-4 sm:p-5 lg:p-6 transition-all duration-500 focus:outline-none focus-visible:ring-2 ring-green-400"
        tabIndex={0}
        animate={{
          backgroundColor: isHovered ? 'rgba(31, 41, 55, 0.8)' : 'rgba(17, 24, 39, 0.6)'
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        
        {/* Enhanced header with category and metadata */}
        <motion.div 
          className="flex flex-wrap items-start justify-between gap-2 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.span 
            className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500 text-black text-xs font-pixel rounded-md shadow-lg flex-shrink-0"
            style={{ textShadow: 'none' }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#059669',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
            }}
            transition={{ duration: 0.2 }}
          >
            {post.category}
            {post.featured && <span className="ml-1">★</span>}
          </motion.span>
          
          {/* Bookmark button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              setIsBookmarked(!isBookmarked)
            }}
            className="p-3 sm:p-1.5 rounded-md hover:bg-gray-800/50 transition-colors tap-target"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark 
              className={`w-4 h-4 transition-colors ${
                isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-green-400'
              }`}
            />
          </motion.button>

        </motion.div>
        
        {/* Enhanced title with strict two-line clipping */}
        <motion.h3 
          className="text-lg sm:text-xl font-pixel mb-3 sm:mb-4 text-green-400 leading-tight line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ 
            color: '#6ee7b7',
            textShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
          }}
        >
          <Link href={`/blog/${post.slug}`} className="transition-all duration-300 hover:drop-shadow-lg block">
            {post.title}
          </Link>
        </motion.h3>

        {/* Enhanced meta information with better visual hierarchy */}
        <motion.div 
          className={`flex flex-wrap items-center gap-4 text-xs text-gray-400 ${variant === 'compact' ? 'mb-2' : 'mb-4'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {post.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-green-400/60" />
              <span className="font-mono">{formatDate(post.date)}</span>
            </div>
          )}
          {post.readTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-green-400/60" />
              <span className="font-mono text-green-400">{post.readTime}</span>
            </div>
          )}
          {post.views && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-green-400/60" />
              <span className="font-mono">{post.views}</span>
            </div>
          )}
        </motion.div>
        
        {/* Enhanced content excerpt with responsive sizing */}
        <motion.p 
          className="text-gray-300 font-sans mb-4 leading-relaxed text-sm tracking-wide flex-grow line-clamp-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </motion.p>
        
        {/* Enhanced tags with improved layout */}
        {post.tags && post.tags.length > 0 && (
          <motion.div 
            className={`flex flex-wrap gap-1.5 ${variant === 'compact' ? 'mb-2' : 'mb-4'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Tag className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
            {post.tags.slice(0, variant === 'compact' ? 2 : 3).map((tag, index) => (
              <motion.span 
                key={tag}
                className="px-2 py-1 bg-gray-800/60 text-green-400 text-xs font-mono rounded border border-green-400/20 backdrop-blur-sm cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(74, 222, 128, 0.4)',
                  scale: 1.05,
                  y: -1
                }}
              >
                {tag}
              </motion.span>
            ))}
            {post.tags.length > (variant === 'compact' ? 2 : 3) && (
              <span className="px-2 py-1 text-gray-500 text-xs font-mono">
                +{post.tags.length - (variant === 'compact' ? 2 : 3)}
              </span>
            )}
          </motion.div>
        )}
        
        {/* Enhanced call-to-action with better interaction design */}
        <div className="mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link 
              href={`/blog/${post.slug}`}
              className="group/cta relative inline-flex items-center text-green-400 font-pixel transition-all duration-300 overflow-hidden"
            >
              {/* Enhanced background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 rounded-md -z-10"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: isHovered ? '0%' : '-100%',
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              
              {/* Content with improved spacing */}
              <span className="flex items-center space-x-2 px-3 py-2">
                <span className={variant === 'compact' ? 'text-xs' : 'text-sm'}>
                  READ MORE
                </span>
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>
              
              {/* Enhanced underline animation */}
              <motion.div
                className="absolute bottom-1 left-3 right-3 h-0.5 bg-green-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: 'left' }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export const BlogPostCard = memo(BlogPostCardComponent) 