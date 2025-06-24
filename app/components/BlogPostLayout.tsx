'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  CalendarIcon, 
  ClockIcon, 
  TagIcon, 
  FolderIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

import { posts } from '@/app/data/posts'
import { Post } from '@/app/types/Post'
import { extractTableOfContents, injectTableOfContentsIds } from '@/app/utils/tableOfContents'
import { calculateReadingTime } from '@/app/utils/readingTime'
import { findRelatedPosts } from '@/app/utils/relatedPosts'
import { generatePostSEO, validateSEO } from '@/app/utils/seo'
import { initializeAnalytics, trackPageView, endSession } from '@/app/utils/analytics'

import TableOfContents from './TableOfContents'
import RelatedPosts from './RelatedPosts'
import SocialShare from './SocialShare'
import CommentSystemV2 from './CommentSystemV2'

interface BlogPostLayoutProps {
  post: Post
  enableComments?: boolean
  enableAnalytics?: boolean
  showRelatedPosts?: boolean
  showSocialShare?: boolean
  className?: string
}

interface PostMetaProps {
  post: Post
  readingTime: { text: string; minutes: number; words: number }
  views?: number
}

function PostMeta({ post, readingTime, views }: PostMetaProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="pixel-border bg-gray-900/40 backdrop-blur-sm p-4 mb-8"
    >
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 font-mono">
        {post.date && (
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(post.date)}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-4 w-4" />
          <span>{readingTime.text}</span>
        </div>
        
        {post.category && (
          <div className="flex items-center space-x-1">
            <FolderIcon className="h-4 w-4" />
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 pixel-border border-blue-500/50">
              {post.category}
            </span>
          </div>
        )}
        
        {views !== undefined && (
          <div className="flex items-center space-x-1">
            <EyeIcon className="h-4 w-4" />
            <span>{views} views</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <DocumentTextIcon className="h-4 w-4" />
          <span>{readingTime.words} words</span>
        </div>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-700">
          <TagIcon className="h-4 w-4 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs bg-gray-800/50 text-gray-300 pixel-border border-gray-600 hover:text-green-400 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function ReadingProgress({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      if (!targetRef.current) return

      const element = targetRef.current
      const rect = element.getBoundingClientRect()
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight
      
      const start = rect.top + window.scrollY
      const end = start + elementHeight - windowHeight
      const current = window.scrollY
      
      if (current < start) {
        setProgress(0)
      } else if (current > end) {
        setProgress(100)
      } else {
        setProgress(((current - start) / (end - start)) * 100)
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [targetRef])

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
              className="fixed top-0 left-0 right-0 z-20 h-1 bg-gray-800"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}

export default function BlogPostLayout({
  post,
  enableComments = false,
  enableAnalytics = true,
  showRelatedPosts = true,
  showSocialShare = true,
  className = ""
}: BlogPostLayoutProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [views, setViews] = useState<number | undefined>(undefined)

  // Initialize analytics
  useEffect(() => {
    if (enableAnalytics) {
      const analyticsInstance = initializeAnalytics(true, process.env.NODE_ENV === 'development')
      
      if (analyticsInstance) {
        trackPageView(post.id, post.title)
        
        // Get current views
        const postAnalytics = analyticsInstance.getPostAnalytics(post.id)
        setViews(postAnalytics?.views)
      }
    }

    return () => {
      if (enableAnalytics) {
        endSession()
      }
    }
  }, [post.id, post.title, enableAnalytics])

  // Calculate reading time and extract TOC
  const readingTime = calculateReadingTime(post.content)
  const toc = extractTableOfContents(post.content)
  const contentWithIds = injectTableOfContentsIds(post.content)

  // Find related posts
  const relatedPosts = showRelatedPosts ? findRelatedPosts(post, posts, { maxResults: 3 }) : []

  // Generate SEO data
  const seoData = generatePostSEO(post)
  const seoValidation = validateSEO(post)


  const postUrl = `/blog/${post.slug}`
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + postUrl : postUrl

  return (
    <article className={`max-w-none ${className}`}>
      {/* SEO Meta Tags */}
      {typeof window !== 'undefined' && (
        <>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
          <meta name="keywords" content={seoData.keywords.join(', ')} />
          <link rel="canonical" href={seoData.canonical} />
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.structuredData) }}
          />
        </>
      )}

      {/* Reading Progress Bar */}
      <ReadingProgress targetRef={contentRef} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Post Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-mono font-bold text-white leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {post.excerpt}
              </p>
            )}
          </motion.header>

          {/* Post Meta */}
          <PostMeta post={post} readingTime={readingTime} views={views} />

          {/* Social Share - Top */}
          {showSocialShare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center"
            >
              <SocialShare
                title={post.title}
                url={currentUrl}
                description={post.excerpt || ''}
                className="justify-center"
              />
            </motion.div>
          )}

          {/* Post Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert prose-green max-w-none"
          >
            <div className="pixel-border bg-gray-900/20 backdrop-blur-sm p-6 lg:p-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children, ...props }) => (
                    <h2 className="text-2xl font-mono font-bold text-green-400 mt-8 mb-4 first:mt-0" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-xl font-mono font-bold text-green-300 mt-6 mb-3" {...props}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4 className="text-lg font-mono font-bold text-green-200 mt-4 mb-2" {...props}>
                      {children}
                    </h4>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-gray-300 leading-relaxed mb-4 font-readable" {...props}>
                      {children}
                    </p>
                  ),
                  code: ({ children, className, ...props }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto" {...props}>
                        {children}
                      </code>
                    )
                  },
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-400 my-4" {...props}>
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-4" {...props}>
                      {children}
                    </ol>
                  ),
                  a: ({ children, href, ...props }) => (
                    <a 
                      href={href} 
                      className="text-green-400 hover:text-green-300 underline transition-colors duration-200" 
                      {...props}
                    >
                      {children}
                    </a>
                  )
                }}
              >
                {contentWithIds}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Social Share - Bottom */}
          {showSocialShare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex justify-center"
            >
              <SocialShare
                title={post.title}
                url={currentUrl}
                description={post.excerpt || ''}
                className="justify-center"
              />
            </motion.div>
          )}

          {/* Related Posts */}
          {showRelatedPosts && relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <RelatedPosts
                relatedPosts={relatedPosts}
                currentPost={post}
                showReasons={true}
              />
            </motion.div>
          )}

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CommentSystemV2
              postId={post.id}
              postTitle={post.title}
              enabled={enableComments}
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <aside className="block lg:col-span-1 space-y-6">
          {/* Table of Contents */}
          {toc.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <TableOfContents
                toc={toc}
                sticky={true}
                collapsible={true}
              />
            </motion.div>
          )}

          {/* Sticky Social Share */}
          {showSocialShare && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <SocialShare
                title={post.title}
                url={currentUrl}
                description={post.excerpt || ''}
              />
            </motion.div>
          )}
        </aside>
      </div>

      {/* SEO Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/50 pixel-border"
        >
          <h3 className="font-mono text-yellow-400 text-sm mb-2">SEO Debug Info</h3>
          <div className="text-xs font-mono text-gray-400 space-y-1">
            <p>Score: {seoValidation.score}/100</p>
            <p>Errors: {seoValidation.errors.length}</p>
            <p>Warnings: {seoValidation.warnings.length}</p>
            {seoValidation.errors.length > 0 && (
              <details>
                <summary className="text-red-400 cursor-pointer">Errors</summary>
                <ul className="list-disc list-inside mt-1 text-red-300">
                  {seoValidation.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </motion.div>
      )}
    </article>
  )
}