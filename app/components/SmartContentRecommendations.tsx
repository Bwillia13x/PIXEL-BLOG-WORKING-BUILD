'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Clock, Star, Eye, ArrowRight, Sparkles, Brain, Target, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

interface ContentItem {
  id: string
  title: string
  type: 'post' | 'project' | 'page'
  url: string
  excerpt: string
  category?: string
  tags?: string[]
  date: string
  views?: number
  engagement?: number
  readingTime?: number
  featured?: boolean
}

interface UserBehavior {
  viewedContent: string[]
  preferredCategories: string[]
  timeSpentOnTopics: Record<string, number>
  searchHistory: string[]
  bookmarkedContent: string[]
}

interface RecommendationReason {
  type: 'trending' | 'personalized' | 'similar' | 'recent' | 'popular'
  confidence: number
  explanation: string
}

interface Recommendation extends ContentItem {
  reason: RecommendationReason
  relevanceScore: number
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'AI-Driven Development Workflow',
    type: 'post',
    url: '/blog/ai-driven-development-workflow',
    excerpt: 'Exploring how AI is transforming software development workflows and productivity.',
    category: 'Tech',
    tags: ['AI', 'Development', 'Automation', 'Workflow'],
    date: '2024-12-15',
    views: 1250,
    engagement: 0.85,
    readingTime: 8,
    featured: true
  },
  {
    id: '2',
    title: 'Building Value Investing Tools',
    type: 'post',
    url: '/blog/building-value-investing-tools',
    excerpt: 'Creating comprehensive tools for value investing analysis and decision making.',
    category: 'Finance',
    tags: ['Finance', 'Investing', 'Tools', 'Analysis'],
    date: '2024-12-12',
    views: 980,
    engagement: 0.78,
    readingTime: 12
  },
  {
    id: '3',
    title: 'Deep Value Screener',
    type: 'project',
    url: '/projects/deep-value-screener',
    excerpt: 'A sophisticated stock screening tool for value investors using advanced metrics.',
    category: 'Finance',
    tags: ['Finance', 'Screening', 'React', 'Data'],
    date: '2024-12-10',
    views: 750,
    engagement: 0.92,
    readingTime: 15
  },
  {
    id: '4',
    title: 'Building My Digital Home',
    type: 'post',
    url: '/blog/building-my-digital-home',
    excerpt: 'The journey of creating this personal blog and portfolio site.',
    category: 'Tech',
    tags: ['Web Development', 'Portfolio', 'Next.js'],
    date: '2024-12-08',
    views: 1100,
    engagement: 0.72,
    readingTime: 6
  },
  {
    id: '5',
    title: 'Financial Data APIs Guide',
    type: 'post',
    url: '/blog/financial-data-apis-comprehensive-guide',
    excerpt: 'Complete guide to financial data APIs for developers and analysts.',
    category: 'Finance',
    tags: ['APIs', 'Finance', 'Data', 'Development'],
    date: '2024-12-05',
    views: 890,
    engagement: 0.81,
    readingTime: 10
  }
]

// Simulate user behavior
const simulatedUserBehavior: UserBehavior = {
  viewedContent: ['1', '4'],
  preferredCategories: ['Tech', 'Finance'],
  timeSpentOnTopics: {
    'AI': 300,
    'Development': 250,
    'Finance': 180,
    'Investing': 150
  },
  searchHistory: ['AI development', 'value investing', 'portfolio tools'],
  bookmarkedContent: ['1', '3']
}

interface SmartContentRecommendationsProps {
  currentContentId?: string
  maxRecommendations?: number
  variant?: 'sidebar' | 'inline' | 'carousel'
  className?: string
}

export default function SmartContentRecommendations({
  currentContentId,
  maxRecommendations = 4,
  variant = 'sidebar',
  className = ''
}: SmartContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userBehavior] = useState<UserBehavior>(simulatedUserBehavior)

  // Generate intelligent recommendations
  const generateRecommendations = useMemo(() => {
    const currentContent = mockContent.find(item => item.id === currentContentId)
    const allRecommendations: Recommendation[] = []

    mockContent.forEach(content => {
      if (content.id === currentContentId) return

      let relevanceScore = 0
      let reason: RecommendationReason

      // Check if it's trending (high recent engagement)
      if (content.engagement && content.engagement > 0.8 && content.views && content.views > 800) {
        relevanceScore += 0.3
        reason = {
          type: 'trending',
          confidence: 0.9,
          explanation: `Trending content with ${content.views} views and ${Math.round(content.engagement * 100)}% engagement`
        }
      }

      // Personalization based on user preferences
      if (content.category && userBehavior.preferredCategories.includes(content.category)) {
        relevanceScore += 0.25
      }

      // Tag similarity with viewed content
      if (currentContent && content.tags && currentContent.tags) {
        const commonTags = content.tags.filter(tag => currentContent.tags!.includes(tag))
        if (commonTags.length > 0) {
          relevanceScore += 0.2 * (commonTags.length / Math.max(content.tags.length, currentContent.tags.length))
          reason = {
            type: 'similar',
            confidence: 0.8,
            explanation: `Similar content with shared topics: ${commonTags.join(', ')}`
          }
        }
      }

      // Time spent on related topics
      if (content.tags) {
        content.tags.forEach(tag => {
          if (userBehavior.timeSpentOnTopics[tag]) {
            relevanceScore += 0.15 * (userBehavior.timeSpentOnTopics[tag] / 300) // Normalize to max 300s
          }
        })
      }

      // Recently viewed pattern matching
      if (userBehavior.viewedContent.length > 0) {
        const recentlyViewedContent = mockContent.filter(item => 
          userBehavior.viewedContent.includes(item.id)
        )
        
        recentlyViewedContent.forEach(viewedItem => {
          if (viewedItem.category === content.category) {
            relevanceScore += 0.15
          }
          if (viewedItem.tags && content.tags) {
            const sharedTags = viewedItem.tags.filter(tag => content.tags!.includes(tag))
            relevanceScore += 0.1 * sharedTags.length
          }
        })
      }

      // Boost for featured content
      if (content.featured) {
        relevanceScore += 0.1
      }

      // Popular content boost
      if (content.views && content.views > 1000) {
        relevanceScore += 0.1
        if (!reason!) {
          reason = {
            type: 'popular',
            confidence: 0.7,
            explanation: `Popular content with ${content.views} views`
          }
        }
      }

      // Recent content boost
      const daysDiff = Math.floor((Date.now() - new Date(content.date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff <= 7) {
        relevanceScore += 0.1
        if (!reason!) {
          reason = {
            type: 'recent',
            confidence: 0.6,
            explanation: 'Recently published content'
          }
        }
      }

      // Default personalized recommendation
      if (!reason!) {
        reason = {
          type: 'personalized',
          confidence: 0.5,
          explanation: 'Recommended based on your interests and activity'
        }
      }

      if (relevanceScore > 0.1) { // Minimum threshold
        allRecommendations.push({
          ...content,
          reason: reason!,
          relevanceScore
        })
      }
    })

    // Sort by relevance score and return top recommendations
    return allRecommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxRecommendations)
  }, [currentContentId, userBehavior, maxRecommendations])

  useEffect(() => {
    setIsLoading(true)
    
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [generateRecommendations])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'trending': return <TrendingUp className="w-3 h-3 text-orange-400" />
      case 'similar': return <Target className="w-3 h-3 text-blue-400" />
      case 'personalized': return <Brain className="w-3 h-3 text-purple-400" />
      case 'popular': return <Star className="w-3 h-3 text-yellow-400" />
      case 'recent': return <Clock className="w-3 h-3 text-green-400" />
      default: return <Sparkles className="w-3 h-3 text-gray-400" />
    }
  }

  if (variant === 'carousel') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-green-400" />
          <h3 className="font-pixel text-lg text-green-400">Smart Recommendations</h3>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {isLoading ? (
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(maxRecommendations)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-48 bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-400/30">
            <AnimatePresence>
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-80"
                >
                  <Link href={item.url} className="block">
                    <div className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-600/50 hover:border-green-400/50 rounded-lg p-4 transition-all duration-300 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getReasonIcon(item.reason.type)}
                          <span className="text-xs font-mono text-gray-400 capitalize">
                            {item.reason.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>

                      <h4 className="font-pixel text-sm text-green-400 mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      
                      <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                        {item.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono">{formatDate(item.date)}</span>
                        {item.readingTime && (
                          <span className="font-mono">{item.readingTime}min read</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-4 h-4 text-green-400" />
        <h3 className="font-pixel text-sm text-green-400">For You</h3>
        <motion.div
          className="w-1.5 h-1.5 bg-green-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(maxRecommendations)].map((_, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {recommendations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.url} className="block group">
                  <div className="bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-green-400/50 rounded-lg p-3 transition-all duration-300">
                    {/* Header with reason */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getReasonIcon(item.reason.type)}
                        <span className="text-xs font-mono text-gray-500 capitalize">
                          {item.reason.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <span className="font-mono">
                          {Math.round(item.reason.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="font-pixel text-sm text-green-400 mb-1 line-clamp-2 group-hover:text-green-300 transition-colors">
                      {item.title}
                    </h4>
                    
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                      {item.excerpt}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{formatDate(item.date)}</span>
                        {item.readingTime && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{item.readingTime}min</span>
                          </>
                        )}
                      </div>
                      
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* AI explanation */}
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <p className="text-xs text-gray-500 font-mono italic">
                        {item.reason.explanation}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Personalization feedback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <ThumbsUp className="w-3 h-3 text-green-400" />
              <span className="text-xs font-pixel text-green-400">Getting Better</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              Recommendations improve as you explore more content. 
              Current accuracy: {Math.round(recommendations.reduce((acc, rec) => acc + rec.reason.confidence, 0) / recommendations.length * 100)}%
            </p>
          </motion.div>
        </div>
      )}
    </div>
  )
}