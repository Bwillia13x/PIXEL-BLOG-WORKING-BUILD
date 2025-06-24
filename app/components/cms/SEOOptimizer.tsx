'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from '../Providers'
import { generateSEO } from '@/lib/seo'

interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: SEOSuggestion[]
  keywords: KeywordAnalysis[]
  readability: ReadabilityScore
  metadata: MetadataAnalysis
  structure: StructureAnalysis
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  category: 'title' | 'description' | 'keywords' | 'content' | 'structure' | 'images' | 'links'
  message: string
  fix?: string
  impact: 'high' | 'medium' | 'low'
}

interface SEOSuggestion {
  type: 'improvement' | 'optimization' | 'best-practice'
  message: string
  action?: string
  priority: number
}

interface KeywordAnalysis {
  keyword: string
  density: number
  frequency: number
  positions: number[]
  inTitle: boolean
  inDescription: boolean
  inHeadings: boolean
  inUrl: boolean
  competition: 'low' | 'medium' | 'high'
  difficulty: number
}

interface ReadabilityScore {
  score: number
  grade: string
  avgSentenceLength: number
  avgWordsPerSentence: number
  passiveVoice: number
  longSentences: number
}

interface MetadataAnalysis {
  title: {
    length: number
    optimal: boolean
    hasKeyword: boolean
    clickworthy: boolean
  }
  description: {
    length: number
    optimal: boolean
    hasKeyword: boolean
    compelling: boolean
  }
  url: {
    length: number
    hasKeyword: boolean
    readable: boolean
  }
}

interface StructureAnalysis {
  headings: {
    h1Count: number
    h2Count: number
    h3Count: number
    hierarchy: boolean
    hasKeywords: boolean
  }
  images: {
    total: number
    withAlt: number
    optimized: number
    missingAlt: string[]
  }
  links: {
    internal: number
    external: number
    broken: number
    nofollow: number
  }
  wordCount: number
  paragraphs: number
  avgParagraphLength: number
}

interface SEOOptimizerProps {
  title: string
  description: string
  content: string
  slug: string
  tags: string[]
  category: string
  onSuggestionApply: (type: string, value: string) => void
  onMetaGenerate: (meta: { title: string; description: string }) => void
  className?: string
}

export default function SEOOptimizer({
  title,
  description,
  content,
  slug,
  tags,
  category,
  onSuggestionApply,
  onMetaGenerate,
  className = ''
}: SEOOptimizerProps) {
  const { theme } = useTheme()
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [targetKeyword, setTargetKeyword] = useState('')
  const [autoOptimize, setAutoOptimize] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const analysisTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Helper function definitions (hoisted before first use)
  const analyzeContent = useCallback((content: string, keyword: string) => {
    const issues: SEOIssue[] = []
    const suggestions: SEOSuggestion[] = []

    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Content is too short for good SEO',
        fix: 'Aim for at least 300 words',
        impact: 'medium'
      })
    }

    if (keyword) {
      const keywordDensity = calculateKeywordDensity(content, keyword)
      
      if (keywordDensity === 0) {
        issues.push({
          type: 'error',
          category: 'keywords',
          message: 'Target keyword not found in content',
          fix: `Include "${keyword}" naturally in the content`,
          impact: 'high'
        })
      } else if (keywordDensity < 0.5) {
        suggestions.push({
          type: 'optimization',
          message: 'Keyword density is low, consider using the target keyword more',
          priority: 3
        })
      } else if (keywordDensity > 3) {
        issues.push({
          type: 'warning',
          category: 'keywords',
          message: 'Keyword density is too high (keyword stuffing)',
          fix: 'Reduce keyword usage to 1-3% density',
          impact: 'medium'
        })
      }
    }

    return { issues, suggestions }
  }, [])

  const calculateReadability = useCallback((content: string): ReadabilityScore => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0
    const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0

    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    
    let grade = 'Unknown'
    if (fleschScore >= 90) grade = 'Very Easy'
    else if (fleschScore >= 80) grade = 'Easy'
    else if (fleschScore >= 70) grade = 'Fairly Easy'
    else if (fleschScore >= 60) grade = 'Standard'
    else if (fleschScore >= 50) grade = 'Fairly Difficult'
    else if (fleschScore >= 30) grade = 'Difficult'
    else grade = 'Very Difficult'

    const longSentences = sentences.filter(s => s.split(/\s+/).length > 20).length
    const passiveVoice = (content.match(/\b(was|were|been|being)\s+\w+ed\b/g) || []).length

    return {
      score: Math.max(0, Math.min(100, fleschScore)),
      grade,
      avgSentenceLength,
      avgWordsPerSentence: avgSentenceLength,
      passiveVoice,
      longSentences
    }
  }, [])

  const extractKeywords = useCallback((content: string, title: string, description: string): KeywordAnalysis[] => {
    const text = `${title} ${description} ${content}`.toLowerCase()
    const words = text.match(/\b\w{4,}\b/g) || []
    const wordCounts = new Map<string, number>()

    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    })

    const totalWords = words.length
    const keywords: KeywordAnalysis[] = []

    Array.from(wordCounts.entries())
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([word, count]) => {
        const density = (count / totalWords) * 100
        
        keywords.push({
          keyword: word,
          density,
          frequency: count,
          positions: findWordPositions(content, word),
          inTitle: title.toLowerCase().includes(word),
          inDescription: description.toLowerCase().includes(word),
          inHeadings: /^#{1,6}\s.*\b/.test(content) && content.includes(word),
          inUrl: false, // Would need slug analysis
          competition: density > 2 ? 'high' : density > 1 ? 'medium' : 'low',
          difficulty: Math.min(100, density * 10 + count)
        })
      })

    return keywords
  }, [])

  // Main SEO analysis function
  const analyzeSEO = useCallback(async (data: {
    title: string
    description: string
    content: string
    slug: string
    tags: string[]
    category: string
    targetKeyword: string
  }): Promise<SEOAnalysis> => {
    const issues: SEOIssue[] = []
    const suggestions: SEOSuggestion[] = []

    // Analyze title
    const titleAnalysis = analyzeTitle(data.title, data.targetKeyword)
    issues.push(...titleAnalysis.issues)
    suggestions.push(...titleAnalysis.suggestions)

    // Analyze description
    const descAnalysis = analyzeDescription(data.description, data.targetKeyword)
    issues.push(...descAnalysis.issues)
    suggestions.push(...descAnalysis.suggestions)

    // Analyze content
    const contentAnalysis = analyzeContent(data.content, data.targetKeyword)
    issues.push(...contentAnalysis.issues)
    suggestions.push(...contentAnalysis.suggestions)

    // Analyze URL/slug
    const urlAnalysis = analyzeUrl(data.slug, data.targetKeyword)
    issues.push(...urlAnalysis.issues)

    // Extract keywords
    const keywords = extractKeywords(data.content, data.title, data.description)

    // Calculate readability
    const readability = calculateReadability(data.content)

    // Analyze metadata
    const metadata = analyzeMetadata(data.title, data.description, data.slug, data.targetKeyword)

    // Analyze structure
    const structure = analyzeStructure(data.content)

    // Calculate overall score
    const score = calculateOverallScore(issues, suggestions, metadata, readability, structure)

    return {
      score,
      issues,
      suggestions,
      keywords,
      readability,
      metadata,
      structure
    }
  }, [analyzeContent, calculateReadability, extractKeywords])

  const performSEOAnalysis = useCallback(async () => {
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeSEO({
        title,
        description,
        content,
        slug,
        tags,
        category,
        targetKeyword
      })
      
      setAnalysis(analysis)
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [title, description, content, slug, tags, category, targetKeyword, analyzeSEO])

  // Debounced analysis trigger
  useEffect(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    analysisTimeoutRef.current = setTimeout(async () => {
      await performSEOAnalysis()
    }, 1000)

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [title, description, content, slug, targetKeyword, performSEOAnalysis])

  const analyzeTitle = (title: string, keyword: string) => {
    const issues: SEOIssue[] = []
    const suggestions: SEOSuggestion[] = []

    if (!title) {
      issues.push({
        type: 'error',
        category: 'title',
        message: 'Title is missing',
        fix: 'Add a descriptive title',
        impact: 'high'
      })
    } else {
      if (title.length < 30) {
        issues.push({
          type: 'warning',
          category: 'title',
          message: 'Title is too short',
          fix: 'Make title at least 30 characters',
          impact: 'medium'
        })
      } else if (title.length > 60) {
        issues.push({
          type: 'warning',
          category: 'title',
          message: 'Title is too long (may be truncated in search results)',
          fix: 'Keep title under 60 characters',
          impact: 'medium'
        })
      }

      if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) {
        issues.push({
          type: 'warning',
          category: 'title',
          message: 'Target keyword not found in title',
          fix: `Include "${keyword}" in the title`,
          impact: 'high'
        })
      }

      if (!/[?!:]/.test(title)) {
        suggestions.push({
          type: 'improvement',
          message: 'Consider adding emotional triggers (?, !, :) to make title more clickable',
          priority: 3
        })
      }
    }

    return { issues, suggestions }
  }

  const analyzeDescription = (description: string, keyword: string) => {
    const issues: SEOIssue[] = []
    const suggestions: SEOSuggestion[] = []

    if (!description) {
      issues.push({
        type: 'error',
        category: 'description',
        message: 'Meta description is missing',
        fix: 'Add a compelling meta description',
        impact: 'high'
      })
    } else {
      if (description.length < 120) {
        issues.push({
          type: 'warning',
          category: 'description',
          message: 'Meta description is too short',
          fix: 'Make description at least 120 characters',
          impact: 'medium'
        })
      } else if (description.length > 160) {
        issues.push({
          type: 'warning',
          category: 'description',
          message: 'Meta description is too long (may be truncated)',
          fix: 'Keep description under 160 characters',
          impact: 'medium'
        })
      }

      if (keyword && !description.toLowerCase().includes(keyword.toLowerCase())) {
        issues.push({
          type: 'warning',
          category: 'description',
          message: 'Target keyword not found in meta description',
          fix: `Include "${keyword}" in the description`,
          impact: 'medium'
        })
      }

      if (!/call.to.action|learn|discover|find out|get|download|try|start/i.test(description)) {
        suggestions.push({
          type: 'improvement',
          message: 'Add a call-to-action to make description more compelling',
          priority: 4
        })
      }
    }

    return { issues, suggestions }
  }

  const analyzeUrl = useCallback((slug: string, keyword: string) => {
    const issues: SEOIssue[] = []

    if (!slug) {
      issues.push({
        type: 'error',
        category: 'structure',
        message: 'URL slug is missing',
        fix: 'Generate a SEO-friendly slug',
        impact: 'high'
      })
    } else {
      if (slug.length > 60) {
        issues.push({
          type: 'warning',
          category: 'structure',
          message: 'URL is too long',
          fix: 'Keep URL under 60 characters',
          impact: 'low'
        })
      }

      if (keyword && !slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'))) {
        issues.push({
          type: 'info',
          category: 'structure',
          message: 'URL doesn\'t contain target keyword',
          fix: 'Include keyword in URL slug',
          impact: 'low'
        })
      }

      if (!/^[a-z0-9-]+$/.test(slug)) {
        issues.push({
          type: 'warning',
          category: 'structure',
          message: 'URL contains special characters',
          fix: 'Use only lowercase letters, numbers, and hyphens',
          impact: 'low'
        })
      }
    }

    return { issues, suggestions: [] }
  }, [])

  const analyzeMetadata = (title: string, description: string, slug: string, keyword: string): MetadataAnalysis => {
    return {
      title: {
        length: title.length,
        optimal: title.length >= 30 && title.length <= 60,
        hasKeyword: keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : false,
        clickworthy: /[?!:]/.test(title)
      },
      description: {
        length: description.length,
        optimal: description.length >= 120 && description.length <= 160,
        hasKeyword: keyword ? description.toLowerCase().includes(keyword.toLowerCase()) : false,
        compelling: /call.to.action|learn|discover|find out|get|download|try|start/i.test(description)
      },
      url: {
        length: slug.length,
        hasKeyword: keyword ? slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-')) : false,
        readable: /^[a-z0-9-]+$/.test(slug)
      }
    }
  }

  const analyzeStructure = (content: string): StructureAnalysis => {
    const h1Count = (content.match(/^# /gm) || []).length
    const h2Count = (content.match(/^## /gm) || []).length
    const h3Count = (content.match(/^### /gm) || []).length
    
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    return {
      headings: {
        h1Count,
        h2Count,
        h3Count,
        hierarchy: h1Count === 1 && h2Count > 0,
        hasKeywords: false // Would need keyword analysis
      },
      images: {
        total: (content.match(/!\[.*?\]\(.*?\)/g) || []).length,
        withAlt: (content.match(/!\[.+?\]\(.*?\)/g) || []).length,
        optimized: 0, // Would need actual image analysis
        missingAlt: []
      },
      links: {
        internal: (content.match(/\[.*?\]\(\/.*?\)/g) || []).length,
        external: (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length,
        broken: 0, // Would need link validation
        nofollow: 0
      },
      wordCount: words.length,
      paragraphs: paragraphs.length,
      avgParagraphLength: paragraphs.length > 0 ? words.length / paragraphs.length : 0
    }
  }

  const calculateOverallScore = (
    issues: SEOIssue[],
    suggestions: SEOSuggestion[],
    metadata: MetadataAnalysis,
    readability: ReadabilityScore,
    structure: StructureAnalysis
  ): number => {
    let score = 100

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'high': score -= 15; break
        case 'medium': score -= 10; break
        case 'low': score -= 5; break
      }
    })

    // Deduct points for poor metadata
    if (!metadata.title.optimal) score -= 10
    if (!metadata.description.optimal) score -= 10
    if (!metadata.title.hasKeyword) score -= 5
    if (!metadata.description.hasKeyword) score -= 5

    // Deduct points for poor readability
    if (readability.score < 60) score -= 10

    // Deduct points for poor structure
    if (structure.headings.h1Count !== 1) score -= 5
    if (structure.headings.h2Count === 0) score -= 5
    if (structure.wordCount < 300) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  // Utility functions
  const calculateKeywordDensity = (content: string, keyword: string): number => {
    const words = content.toLowerCase().split(/\s+/)
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length
    return (keywordCount / words.length) * 100
  }

  const findWordPositions = (content: string, word: string): number[] => {
    const positions: number[] = []
    const words = content.toLowerCase().split(/\s+/)
    words.forEach((w, index) => {
      if (w.includes(word)) positions.push(index)
    })
    return positions
  }

  const countSyllables = (word: string): number => {
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

    if (word.endsWith('e')) count--
    return Math.max(1, count)
  }

  const generateOptimalMeta = async () => {
    try {
      // Use existing generateSEO function
      const seoData = generateSEO({
        title,
        description,
        url: `/${slug}`,
        type: 'article'
      })

      const optimizedTitle = targetKeyword 
        ? `${targetKeyword} | ${title}`.slice(0, 60)
        : title

      const optimizedDescription = targetKeyword && !description.includes(targetKeyword)
        ? `${description} Learn about ${targetKeyword} and more.`.slice(0, 160)
        : description

      onMetaGenerate({
        title: optimizedTitle,
        description: optimizedDescription
      })
    } catch (error) {
      console.error('Meta generation failed:', error)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#ef4444'
    return '#6b7280'
  }

  const getIssueIcon = (type: string): string => {
    switch (type) {
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📝'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-pixel text-lg text-green-400">SEO Optimizer</h3>
        
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm font-mono text-yellow-400">
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
          
          <button
            onClick={generateOptimalMeta}
            className="px-3 py-1 bg-green-600/60 hover:bg-green-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
          >
            🚀 Auto-optimize
          </button>
        </div>
      </div>

      {/* Target Keyword */}
      <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Target Keyword (Optional)
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g., value investing, react optimization"
              className="w-full px-3 py-2 bg-gray-900/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
          </div>
          
          <label className="flex items-center space-x-2 text-sm font-mono text-gray-300">
            <input
              type="checkbox"
              checked={autoOptimize}
              onChange={(e) => setAutoOptimize(e.target.checked)}
              className="pixel-checkbox"
            />
            <span>Auto-optimize</span>
          </label>
        </div>
      </div>

      {/* SEO Score */}
      {analysis && (
        <div className="pixel-border rounded-lg p-4" style={{ 
          backgroundColor: `${getScoreColor(analysis.score)}20`,
          borderColor: `${getScoreColor(analysis.score)}60`
        }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-pixel text-lg" style={{ color: getScoreColor(analysis.score) }}>
                SEO Score: {analysis.score}/100
              </h4>
              <div className="text-sm font-mono text-gray-400">
                {analysis.score >= 80 ? 'Excellent' : 
                 analysis.score >= 60 ? 'Good' : 
                 analysis.score >= 40 ? 'Needs Improvement' : 'Poor'}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl">{analysis.score >= 80 ? '🎯' : analysis.score >= 60 ? '👍' : '⚡'}</div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: getScoreColor(analysis.metadata.title.optimal ? 100 : 50) }}>
                {analysis.metadata.title.optimal ? '✓' : '✗'}
              </div>
              <div className="text-gray-400">Title</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: getScoreColor(analysis.metadata.description.optimal ? 100 : 50) }}>
                {analysis.metadata.description.optimal ? '✓' : '✗'}
              </div>
              <div className="text-gray-400">Description</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: getScoreColor(analysis.readability.score) }}>
                {Math.round(analysis.readability.score)}
              </div>
              <div className="text-gray-400">Readability</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: getScoreColor(analysis.structure.wordCount >= 300 ? 100 : 50) }}>
                {analysis.structure.wordCount}
              </div>
              <div className="text-gray-400">Words</div>
            </div>
          </div>
        </div>
      )}

      {/* Issues */}
      {analysis && analysis.issues.length > 0 && (
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
          <h4 className="font-pixel text-red-400 mb-3">Issues to Fix ({analysis.issues.length})</h4>
          
          <div className="space-y-3">
            {analysis.issues.map((issue, index) => (
              <div key={index} className={`
                flex items-start justify-between p-3 rounded border-l-4
                ${issue.impact === 'high' ? 'bg-red-500/10 border-red-500' :
                  issue.impact === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-blue-500/10 border-blue-500'}
              `}>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getIssueIcon(issue.type)}</span>
                  <div>
                    <div className="font-mono text-sm text-gray-200">{issue.message}</div>
                    {issue.fix && (
                      <div className="text-xs text-gray-400 mt-1">Fix: {issue.fix}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    issue.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                    issue.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {issue.impact.toUpperCase()}
                  </span>
                  
                  {issue.fix && (
                    <button
                      onClick={() => onSuggestionApply(issue.category, issue.fix!)}
                      className="px-2 py-1 bg-green-600/60 hover:bg-green-500/60 text-white rounded text-xs font-mono transition-colors"
                    >
                      Fix
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {analysis && analysis.keywords.length > 0 && (
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
          <h4 className="font-pixel text-green-400 mb-3">Keyword Analysis</h4>
          
          <div className="grid gap-3">
            {analysis.keywords.slice(0, 5).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900/40 rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-green-400">{keyword.keyword}</span>
                  <div className="flex space-x-2 text-xs">
                    {keyword.inTitle && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">TITLE</span>}
                    {keyword.inDescription && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">DESC</span>}
                    {keyword.inHeadings && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">H1-6</span>}
                  </div>
                </div>
                
                <div className="text-right text-sm font-mono">
                  <div className="text-gray-300">{keyword.density.toFixed(1)}% density</div>
                  <div className="text-gray-500">{keyword.frequency} times</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full font-pixel text-green-400 mb-3"
        >
          <span>Advanced Analysis</span>
          <span>{showAdvanced ? '▼' : '▶'}</span>
        </button>

        {showAdvanced && analysis && (
          <div className="space-y-4">
            {/* Readability */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-mono text-sm text-gray-400 mb-2">Readability</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>Reading Level:</span>
                    <span className="text-green-400">{analysis.readability.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Sentence Length:</span>
                    <span className="text-blue-400">{analysis.readability.avgSentenceLength.toFixed(1)} words</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Long Sentences:</span>
                    <span className="text-yellow-400">{analysis.readability.longSentences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passive Voice:</span>
                    <span className="text-red-400">{analysis.readability.passiveVoice}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-mono text-sm text-gray-400 mb-2">Structure</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>Headings (H1/H2/H3):</span>
                    <span className="text-green-400">
                      {analysis.structure.headings.h1Count}/{analysis.structure.headings.h2Count}/{analysis.structure.headings.h3Count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paragraphs:</span>
                    <span className="text-blue-400">{analysis.structure.paragraphs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Links:</span>
                    <span className="text-purple-400">{analysis.structure.links.internal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>External Links:</span>
                    <span className="text-yellow-400">{analysis.structure.links.external}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}