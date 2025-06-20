'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../Providers'
import { Post } from '@/app/data/posts'
import { findRelatedPosts, RelatedPost, RelatedPostsOptions } from '@/app/utils/relatedPosts'

interface ContentVector {
  id: string
  tfidf: Map<string, number>
  topics: string[]
  readingLevel: number
  sentiment: number
  keyPhrases: string[]
}

interface UserInteraction {
  postId: string
  action: 'view' | 'like' | 'share' | 'comment' | 'bookmark'
  timestamp: Date
  duration?: number
  scrollDepth?: number
}

interface RelatedPostsEngineProps {
  currentPost: Post
  allPosts: Post[]
  userInteractions?: UserInteraction[]
  enableMachineLearning?: boolean
  enableContentAnalysis?: boolean
  enableUserPersonalization?: boolean
  maxResults?: number
  className?: string
}

interface AdvancedRelatedPost extends RelatedPost {
  contentSimilarity: number
  userAffinityScore: number
  trendingScore: number
  diversityScore: number
  confidenceScore: number
}

interface MLWeights {
  contentSimilarity: number
  userAffinity: number
  trending: number
  diversity: number
  recency: number
  engagement: number
}

// Advanced content analysis utilities
class ContentAnalyzer {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'between'
  ])

  extractKeyPhrases(content: string, topN: number = 10): string[] {
    // Simple n-gram extraction for key phrases
    const words = this.tokenize(content)
    const phrases: Map<string, number> = new Map()

    // Extract 2-grams and 3-grams
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`
      if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1])) {
        phrases.set(bigram, (phrases.get(bigram) || 0) + 1)
      }

      if (i < words.length - 2) {
        const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
        if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1]) && !this.stopWords.has(words[i + 2])) {
          phrases.set(trigram, (phrases.get(trigram) || 0) + 1)
        }
      }
    }

    return Array.from(phrases.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([phrase]) => phrase)
  }

  calculateTFIDF(content: string, allDocuments: string[]): Map<string, number> {
    const words = this.tokenize(content)
    const wordCounts = new Map<string, number>()
    const tfidf = new Map<string, number>()

    // Calculate term frequency
    words.forEach(word => {
      if (!this.stopWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
      }
    })

    // Calculate TF-IDF
    wordCounts.forEach((count, word) => {
      const tf = count / words.length
      const documentsWithWord = allDocuments.filter(doc => 
        this.tokenize(doc).includes(word)
      ).length
      const idf = Math.log(allDocuments.length / (documentsWithWord + 1))
      tfidf.set(word, tf * idf)
    })

    return tfidf
  }

  calculateReadingLevel(content: string): number {
    const words = this.tokenize(content)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0)

    if (sentences.length === 0 || words.length === 0) return 1

    // Flesch-Kincaid Grade Level
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    return Math.max(1, Math.min(12, 
      0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
    ))
  }

  analyzeSentiment(content: string): number {
    // Simple sentiment analysis using word lists
    const positiveWords = new Set(['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'beneficial', 'effective', 'successful', 'profitable', 'valuable', 'important', 'useful', 'helpful'])
    const negativeWords = new Set(['bad', 'terrible', 'awful', 'horrible', 'negative', 'harmful', 'ineffective', 'unsuccessful', 'loss', 'risk', 'difficult', 'challenging', 'problematic'])

    const words = this.tokenize(content)
    let score = 0

    words.forEach(word => {
      if (positiveWords.has(word)) score += 1
      if (negativeWords.has(word)) score -= 1
    })

    // Normalize to -1 to 1 range
    return Math.max(-1, Math.min(1, score / Math.max(1, words.length / 100)))
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i])
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }

    // Handle silent e
    if (word.endsWith('e')) count--
    
    return Math.max(1, count)
  }
}

export default function RelatedPostsEngine({
  currentPost,
  allPosts,
  userInteractions = [],
  enableMachineLearning = true,
  enableContentAnalysis = true,
  enableUserPersonalization = true,
  maxResults = 5,
  className = ''
}: RelatedPostsEngineProps) {
  const { theme } = useTheme()
  const [contentVectors, setContentVectors] = useState<Map<string, ContentVector>>(new Map())
  const [mlWeights, setMlWeights] = useState<MLWeights>({
    contentSimilarity: 0.3,
    userAffinity: 0.25,
    trending: 0.15,
    diversity: 0.1,
    recency: 0.1,
    engagement: 0.1
  })
  const [relatedPosts, setRelatedPosts] = useState<AdvancedRelatedPost[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [algorithm, setAlgorithm] = useState<'basic' | 'content' | 'ml' | 'hybrid'>('hybrid')

  const analyzer = new ContentAnalyzer()

  // Initialize content analysis
  useEffect(() => {
    if (!enableContentAnalysis) return

    setIsAnalyzing(true)
    
    const analyzeContent = async () => {
      const vectors = new Map<string, ContentVector>()
      const allContents = allPosts.map(post => `${post.title} ${post.content || post.excerpt || ''}`)

      allPosts.forEach((post, index) => {
        const content = `${post.title} ${post.content || post.excerpt || ''}`
        
        const vector: ContentVector = {
          id: post.id,
          tfidf: analyzer.calculateTFIDF(content, allContents),
          topics: analyzer.extractKeyPhrases(content, 5),
          readingLevel: analyzer.calculateReadingLevel(content),
          sentiment: analyzer.analyzeSentiment(content),
          keyPhrases: analyzer.extractKeyPhrases(content, 10)
        }
        
        vectors.set(post.id, vector)
      })

      setContentVectors(vectors)
      setIsAnalyzing(false)
    }

    analyzeContent()
  }, [allPosts, enableContentAnalysis])

  // Calculate content similarity using TF-IDF vectors
  const calculateContentSimilarity = useCallback((post1: Post, post2: Post): number => {
    const vector1 = contentVectors.get(post1.id)
    const vector2 = contentVectors.get(post2.id)

    if (!vector1 || !vector2) return 0

    // Cosine similarity between TF-IDF vectors
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    const allTerms = new Set([...vector1.tfidf.keys(), ...vector2.tfidf.keys()])

    allTerms.forEach(term => {
      const tfidf1 = vector1.tfidf.get(term) || 0
      const tfidf2 = vector2.tfidf.get(term) || 0
      
      dotProduct += tfidf1 * tfidf2
      norm1 += tfidf1 * tfidf1
      norm2 += tfidf2 * tfidf2
    })

    if (norm1 === 0 || norm2 === 0) return 0
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }, [contentVectors])

  // Calculate user affinity score based on interactions
  const calculateUserAffinity = useCallback((post: Post): number => {
    if (!enableUserPersonalization || userInteractions.length === 0) return 0

    const postInteractions = userInteractions.filter(interaction => interaction.postId === post.id)
    if (postInteractions.length === 0) return 0

    let score = 0
    const weights = { view: 1, like: 3, share: 4, comment: 5, bookmark: 6 }

    postInteractions.forEach(interaction => {
      score += weights[interaction.action] || 0
      
      // Bonus for longer engagement
      if (interaction.duration && interaction.duration > 60000) { // 1 minute
        score *= 1.2
      }
      
      // Bonus for high scroll depth
      if (interaction.scrollDepth && interaction.scrollDepth > 0.7) {
        score *= 1.1
      }
    })

    // Time decay - recent interactions matter more
    const avgAge = postInteractions.reduce((sum, interaction) => {
      const age = Date.now() - interaction.timestamp.getTime()
      return sum + age
    }, 0) / postInteractions.length

    const decayFactor = Math.exp(-avgAge / (30 * 24 * 60 * 60 * 1000)) // 30 days
    
    return Math.min(1, score * decayFactor / 10)
  }, [userInteractions, enableUserPersonalization])

  // Calculate trending score based on recent engagement
  const calculateTrendingScore = useCallback((post: Post): number => {
    const recentInteractions = userInteractions.filter(interaction => {
      const age = Date.now() - interaction.timestamp.getTime()
      return age < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    })

    const postRecentInteractions = recentInteractions.filter(interaction => interaction.postId === post.id)
    const totalRecentInteractions = recentInteractions.length

    if (totalRecentInteractions === 0) return 0
    
    return postRecentInteractions.length / totalRecentInteractions
  }, [userInteractions])

  // Calculate diversity score to avoid echo chambers
  const calculateDiversityScore = useCallback((post: Post, selectedPosts: Post[]): number => {
    if (selectedPosts.length === 0) return 1

    let diversityScore = 1
    
    selectedPosts.forEach(selectedPost => {
      // Penalize same category
      if (post.category === selectedPost.category) {
        diversityScore *= 0.8
      }
      
      // Penalize overlapping tags
      const postTags = new Set(post.tags || [])
      const selectedTags = new Set(selectedPost.tags || [])
      const overlap = new Set([...postTags].filter(tag => selectedTags.has(tag)))
      
      if (overlap.size > 0) {
        diversityScore *= (1 - (overlap.size / Math.max(postTags.size, selectedTags.size)) * 0.3)
      }
    })

    return diversityScore
  }, [])

  // Main recommendation algorithm
  const generateRecommendations = useCallback(() => {
    const basicRelated = findRelatedPosts(currentPost, allPosts, { maxResults: maxResults * 2 })
    
    const advanced: AdvancedRelatedPost[] = basicRelated.map(post => {
      const contentSimilarity = enableContentAnalysis ? calculateContentSimilarity(currentPost, post) : 0
      const userAffinityScore = calculateUserAffinity(post)
      const trendingScore = calculateTrendingScore(post)
      
      // Calculate confidence based on multiple signals
      const confidenceScore = Math.min(1, (
        post.similarity * 0.4 +
        contentSimilarity * 0.3 +
        userAffinityScore * 0.2 +
        trendingScore * 0.1
      ))

      return {
        ...post,
        contentSimilarity,
        userAffinityScore,
        trendingScore,
        diversityScore: 1, // Will be calculated during selection
        confidenceScore
      }
    })

    // Apply diversity-aware selection
    const selectedPosts: AdvancedRelatedPost[] = []
    const candidates = [...advanced].sort((a, b) => b.confidenceScore - a.confidenceScore)

    while (selectedPosts.length < maxResults && candidates.length > 0) {
      // Calculate diversity scores for remaining candidates
      candidates.forEach(candidate => {
        candidate.diversityScore = calculateDiversityScore(candidate, selectedPosts)
      })

      // Score combination with diversity
      const scored = candidates.map(candidate => ({
        ...candidate,
        finalScore: 
          candidate.similarity * mlWeights.contentSimilarity +
          candidate.contentSimilarity * mlWeights.contentSimilarity +
          candidate.userAffinityScore * mlWeights.userAffinity +
          candidate.trendingScore * mlWeights.trending +
          candidate.diversityScore * mlWeights.diversity
      }))

      // Select best candidate
      scored.sort((a, b) => b.finalScore - a.finalScore)
      const selected = scored[0]
      
      if (selected) {
        selectedPosts.push(selected)
        const index = candidates.findIndex(c => c.id === selected.id)
        if (index > -1) candidates.splice(index, 1)
      } else {
        break
      }
    }

    setRelatedPosts(selectedPosts)
  }, [currentPost, allPosts, maxResults, enableContentAnalysis, calculateContentSimilarity, calculateUserAffinity, calculateTrendingScore, calculateDiversityScore, mlWeights])

  // Update recommendations when dependencies change
  useEffect(() => {
    if (algorithm === 'basic') {
      const basic = findRelatedPosts(currentPost, allPosts, { maxResults })
      setRelatedPosts(basic.map(post => ({
        ...post,
        contentSimilarity: 0,
        userAffinityScore: 0,
        trendingScore: 0,
        diversityScore: 1,
        confidenceScore: post.similarity
      })))
    } else {
      generateRecommendations()
    }
  }, [currentPost, allPosts, algorithm, generateRecommendations])

  const formatScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%'
  }

  const getScoreColor = (score: number): string => {
    if (score >= 0.7) return '#10b981'
    if (score >= 0.5) return '#f59e0b'
    if (score >= 0.3) return '#3b82f6'
    return '#6b7280'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Algorithm Controls */}
      <div className="pixel-border bg-gray-900/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-lg text-green-400">Recommendation Engine</h3>
          
          <div className="flex items-center space-x-2">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="px-3 py-1 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
            >
              <option value="basic">Basic Similarity</option>
              <option value="content">Content Analysis</option>
              <option value="ml">Machine Learning</option>
              <option value="hybrid">Hybrid (Recommended)</option>
            </select>
            
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-sm font-mono text-yellow-400">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Weights (for ML/Hybrid modes) */}
        {(algorithm === 'ml' || algorithm === 'hybrid') && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(mlWeights).map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-400 font-mono mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={value}
                    onChange={(e) => setMlWeights(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value)
                    }))}
                    className="flex-1 pixel-slider"
                  />
                  <span className="text-green-400 font-mono w-12 text-right">
                    {formatScore(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-pixel text-green-400">
            Related Posts ({relatedPosts.length})
          </h4>
          <div className="text-xs font-mono text-gray-500">
            Algorithm: {algorithm}
          </div>
        </div>

        {relatedPosts.map((post, index) => (
          <div key={post.id} className="pixel-border bg-gray-800/40 rounded-lg p-4 hover:bg-gray-700/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h5 className="font-mono text-green-400 font-semibold mb-2">
                  {post.title}
                </h5>
                {post.excerpt && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Reasons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.reasons.map((reason, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded text-xs font-mono">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right ml-4">
                <div
                  className="px-3 py-1 rounded-full text-xs font-mono mb-2"
                  style={{
                    backgroundColor: `${getScoreColor(post.confidenceScore)}20`,
                    color: getScoreColor(post.confidenceScore)
                  }}
                >
                  {formatScore(post.confidenceScore)}
                </div>
                <div className="text-xs text-gray-500">#{index + 1}</div>
              </div>
            </div>

            {/* Advanced Metrics */}
            {algorithm !== 'basic' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Content:</span>
                  <span className="text-green-400">{formatScore(post.contentSimilarity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User:</span>
                  <span className="text-blue-400">{formatScore(post.userAffinityScore)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trending:</span>
                  <span className="text-yellow-400">{formatScore(post.trendingScore)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diversity:</span>
                  <span className="text-purple-400">{formatScore(post.diversityScore)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {relatedPosts.length === 0 && !isAnalyzing && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <div className="font-mono">No related posts found</div>
            <div className="text-sm mt-2">Try adjusting the algorithm or weights</div>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
        <h4 className="font-pixel text-green-400 mb-3">Recommendation Analytics</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
          <div className="text-center">
            <div className="text-2xl text-green-400">{allPosts.length}</div>
            <div className="text-gray-400">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-blue-400">{contentVectors.size}</div>
            <div className="text-gray-400">Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-yellow-400">{userInteractions.length}</div>
            <div className="text-gray-400">Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-purple-400">
              {relatedPosts.length > 0 ? formatScore(relatedPosts[0]?.confidenceScore || 0) : '0%'}
            </div>
            <div className="text-gray-400">Top Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}