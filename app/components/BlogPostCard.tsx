'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isReadMoreHovered, setIsReadMoreHovered] = useState(false)

  return (
    <motion.article 
      className="group relative h-full flex flex-col gpu-optimized"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
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
        className="relative h-full flex flex-col border border-gray-700 rounded-lg p-4 sm:p-5 lg:p-6 bg-gray-900/60 backdrop-blur-sm transition-all duration-500 overflow-hidden"
        animate={{
          backgroundColor: isHovered ? 'rgba(31, 41, 55, 0.8)' : 'rgba(17, 24, 39, 0.6)',
          borderColor: isHovered ? 'rgba(74, 222, 128, 0.4)' : 'rgba(75, 85, 99, 1)',
          boxShadow: isHovered ? '0 20px 40px rgba(74, 222, 128, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
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
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-black text-xs font-pixel rounded-md shadow-lg flex-shrink-0"
            style={{ textShadow: 'none' }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#059669',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
            }}
            transition={{ duration: 0.2 }}
          >
            {post.category}
          </motion.span>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 text-xs text-gray-400 min-w-0">
            {post.date && (
              <motion.span 
                className="font-mono tracking-wide truncate"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </motion.span>
            )}
            {post.readTime && (
              <motion.span 
                className="font-mono text-green-400 font-medium truncate"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {post.readTime}
              </motion.span>
            )}
          </div>
        </motion.div>
        
        {/* Enhanced title with strict two-line clipping */}
        <motion.h3 
          className="text-lg sm:text-xl font-pixel mb-3 sm:mb-4 text-green-400 leading-tight"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.3',
            minHeight: '2.6em', // Ensures consistent height for 2 lines
            maxHeight: '2.6em'
          }}
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
        
        {/* Enhanced content excerpt with responsive sizing */}
        <motion.p 
          className="text-gray-300 font-sans mb-4 leading-relaxed text-sm tracking-wide flex-grow"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.6'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </motion.p>
        
        {/* Enhanced tags with responsive layout */}
        {post.tags && post.tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-1.5 sm:gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {post.tags.slice(0, 2).map((tag, index) => (
              <motion.span 
                key={tag}
                className="px-2 py-1 bg-gray-800/80 text-green-400 text-xs font-mono rounded border border-green-400/20 backdrop-blur-sm truncate tag-hover cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(31, 41, 55, 1)',
                  borderColor: 'rgba(74, 222, 128, 0.4)',
                  scale: 1.05,
                  boxShadow: '0 2px 8px rgba(74, 222, 128, 0.2)'
                }}
              >
                #{tag}
              </motion.span>
            ))}
            {post.tags.length > 2 && (
              <motion.span 
                className="px-2 py-1 text-gray-500 text-xs font-mono"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                +{post.tags.length - 2}
              </motion.span>
            )}
          </motion.div>
        )}
        
        {/* Enhanced Read More button with sophisticated animations */}
        <div className="mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link 
              href={`/blog/${post.slug}`}
              className="group/link relative inline-flex items-center text-green-400 font-pixel text-sm transition-all duration-300 overflow-hidden button-press glow-on-focus icon-interactive"
              onMouseEnter={() => setIsReadMoreHovered(true)}
              onMouseLeave={() => setIsReadMoreHovered(false)}
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 rounded-md"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: isReadMoreHovered ? '0%' : '-100%',
                  opacity: isReadMoreHovered ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Text content */}
              <span className="relative z-10 flex items-center space-x-2">
                <span>READ MORE</span>
                <motion.span
                  className="icon-pulse-on-focus"
                  animate={{ x: isReadMoreHovered ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </span>
              
              {/* Underline animation */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-green-400"
                initial={{ width: '0%' }}
                animate={{ width: isReadMoreHovered ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  )
} 