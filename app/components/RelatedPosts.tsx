'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ChevronRightIcon, 
  TagIcon, 
  FolderIcon, 
  ClockIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'
import { Post } from '@/app/types/Post'
import { RelatedPost, getSimilarityExplanation } from '@/app/utils/relatedPosts'

interface RelatedPostsProps {
  relatedPosts: RelatedPost[]
  currentPost: Post
  className?: string
  showSimilarityScore?: boolean
  showReasons?: boolean
}

interface RelatedPostCardProps {
  post: RelatedPost
  index: number
  showSimilarityScore: boolean
  showReasons: boolean
}

function RelatedPostCard({ post, index, showSimilarityScore, showReasons }: RelatedPostCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const similarityLabel = getSimilarityExplanation(post.similarity)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block pixel-border bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-200"
      >
        <div className="p-4 space-y-3">
          {/* Header with similarity badge */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-mono text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </div>
            
            {showSimilarityScore && (
              <div className={`
                ml-3 px-2 py-1 text-xs font-mono pixel-border flex-shrink-0
                ${post.similarity >= 0.7 ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                  post.similarity >= 0.5 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/50'}
              `}>
                {similarityLabel}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
            {post.date && (
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>{formatDate(post.date)}</span>
              </div>
            )}
            
            {post.category && (
              <div className="flex items-center space-x-1">
                <FolderIcon className="h-3 w-3" />
                <span>{post.category}</span>
              </div>
            )}
            
            {post.readTime && (
              <span>{post.readTime}</span>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <TagIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 text-xs font-mono bg-gray-800/50 text-gray-400 pixel-border border-gray-600 hover:text-white transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500 font-mono">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Similarity reasons */}
          {showReasons && post.reasons.length > 0 && (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-start space-x-2">
                <SparklesIcon className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-400 font-mono">
                  {post.reasons.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          )}

          {/* Hover arrow */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500 font-mono">
              Read more
            </span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRightIcon className="h-4 w-4 text-green-400" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-6">
        <SparklesIcon className="h-8 w-8 text-gray-600 mx-auto mb-3" />
        <h3 className="font-mono text-sm text-gray-400 mb-2">No related posts found</h3>
        <p className="text-xs text-gray-500 font-mono">
          Check back later as more content is published
        </p>
      </div>
    </div>
  )
}

export default function RelatedPosts({ 
  relatedPosts, 
  className = "",
  showSimilarityScore = false,
  showReasons = true
}: RelatedPostsProps) {
  if (!relatedPosts || relatedPosts.length === 0) {
    return (
      <section className={`${className}`}>
        <h2 className="font-mono text-xl font-bold text-white mb-6 flex items-center">
          <SparklesIcon className="h-5 w-5 text-green-400 mr-2" />
          Related Posts
        </h2>
        <EmptyState />
      </section>
    )
  }

  return (
    <section className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-mono text-xl font-bold text-white mb-6 flex items-center">
          <SparklesIcon className="h-5 w-5 text-green-400 mr-2" />
          Related Posts
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({relatedPosts.length})
          </span>
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post, index) => (
            <RelatedPostCard
              key={post.id}
              post={post}
              index={index}
              showSimilarityScore={showSimilarityScore}
              showReasons={showReasons}
            />
          ))}
        </div>

        {/* Additional suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/blog"
            className="
              inline-flex items-center space-x-2 px-4 py-2 
              pixel-border bg-gray-900/60 text-green-400 
              hover:bg-gray-800/60 transition-colors duration-200 font-mono text-sm
            "
          >
            <span>Browse all posts</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}