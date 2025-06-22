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
      className="group relative"
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
      
      {/* Enhanced main card */}
      <motion.div 
        className="relative h-full border border-gray-700 rounded-lg p-6 bg-gray-900/60 backdrop-blur-sm transition-all duration-500 overflow-hidden"
        animate={{
          backgroundColor: isHovered ? 'rgba(31, 41, 55, 0.8)' : 'rgba(17, 24, 39, 0.6)',
          borderColor: isHovered ? 'rgba(74, 222, 128, 0.4)' : 'rgba(75, 85, 99, 1)',
          boxShadow: isHovered ? '0 20px 40px rgba(74, 222, 128, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        
        {/* Enhanced header with category and metadata */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-3 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.span 
            className="px-3 py-1.5 bg-green-600 text-black text-xs font-pixel rounded-md shadow-lg"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#059669',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
            }}
            transition={{ duration: 0.2 }}
          >
            {post.category}
          </motion.span>
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {post.date && (
              <motion.span 
                className="font-mono tracking-wide"
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
              <>
                <span className="text-gray-600">•</span>
                <motion.span 
                  className="font-mono text-green-400 font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  {post.readTime}
                </motion.span>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Enhanced title with better typography */}
        <motion.h3 
          className="text-xl font-pixel mb-4 text-green-400 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ 
            color: '#6ee7b7',
            textShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
          }}
        >
          <Link href={`/blog/${post.slug}`} className="transition-all duration-300 hover:drop-shadow-lg">
            {post.title}
          </Link>
        </motion.h3>
        
        {/* Enhanced content excerpt with better readability */}
        <motion.p 
          className="text-gray-300 font-sans mb-5 leading-loose line-clamp-3 text-sm tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ 
            lineHeight: '1.7',
            letterSpacing: '0.025em'
          }}
        >
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </motion.p>
        
        {/* Enhanced tags with staggered animations */}
        {post.tags && post.tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {post.tags.slice(0, 3).map((tag, index) => (
              <motion.span 
                key={tag}
                className="px-3 py-1.5 bg-gray-800/80 text-green-400 text-xs font-mono rounded-md border border-green-400/20 backdrop-blur-sm"
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
            {post.tags.length > 3 && (
              <motion.span 
                className="px-3 py-1.5 text-gray-500 text-xs font-mono"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                +{post.tags.length - 3} more
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
              className="group/link relative inline-flex items-center text-green-400 font-pixel text-sm transition-all duration-300 overflow-hidden"
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
              
              {/* Text with glow effect */}
              <motion.span
                className="relative z-10 pr-2"
                animate={{
                  color: isReadMoreHovered ? '#6ee7b7' : '#4ade80',
                  textShadow: isReadMoreHovered ? '0 0 8px rgba(74, 222, 128, 0.6)' : '0 0 0px rgba(74, 222, 128, 0)'
                }}
                transition={{ duration: 0.3 }}
              >
                Read More
              </motion.span>
              
              {/* Animated arrow with multiple effects */}
              <motion.span 
                className="relative z-10 flex items-center"
                animate={{
                  x: isReadMoreHovered ? 4 : 0
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <motion.span
                  animate={{
                    rotate: isReadMoreHovered ? 0 : 0,
                    scale: isReadMoreHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
                
                {/* Pixel trail effect */}
                <AnimatePresence>
                  {isReadMoreHovered && (
                    <motion.div className="absolute left-0 flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 h-0.5 bg-green-400 rounded-full"
                          initial={{ opacity: 0, x: -4, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            x: [0, 8, 16],
                            scale: [0, 1, 0]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.1,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span>
            </Link>
          </motion.div>
        </div>
        
        {/* Enhanced pixel corner decorations */}
        <motion.div 
          className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-sm"
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{ 
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.2 : 1,
            boxShadow: isHovered ? '0 0 6px rgba(74, 222, 128, 0.8)' : '0 0 0px rgba(74, 222, 128, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="absolute bottom-3 left-3 w-2 h-2 bg-green-400 rounded-sm"
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{ 
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.2 : 1,
            boxShadow: isHovered ? '0 0 6px rgba(74, 222, 128, 0.8)' : '0 0 0px rgba(74, 222, 128, 0)'
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        
        {/* Subtle scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-green-400/0 via-green-400/5 to-green-400/0 pointer-events-none"
          initial={{ y: '-100%', opacity: 0 }}
          animate={isHovered ? { 
            y: '100%', 
            opacity: [0, 0.3, 0]
          } : {
            y: '-100%',
            opacity: 0
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 2
          }}
        />
      </motion.div>
    </motion.article>
  )
} 