import { NextRequest } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/app/lib/rate-limiter'
import { validateRequest, InputSanitizer, createSecureResponse, SecurityMonitor } from '@/app/lib/security'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { calculateReadingTime } from '@/app/utils/readingTime'

interface SearchableItem {
  id: string
  title: string
  content: string
  type: 'post' | 'project'
  category?: string
  tags: string[]
  date?: string
  slug: string
  excerpt?: string
  readTime?: string
  published?: boolean
  status?: string
  demoUrl?: string
  repoUrl?: string
}

interface SearchResult extends SearchableItem {
  score: number
  highlights: {
    title?: string
    content?: string
    excerpt?: string
  }
}

interface SearchParams {
  query: string
  filters?: {
    type?: string[]
    category?: string[]
    tags?: string[]
    status?: string[]
    dateFrom?: string
    dateTo?: string
  }
  sort?: 'relevance' | 'date' | 'title'
  limit?: number
  offset?: number
}

class SearchEngine {
  private searchableItems: SearchableItem[] = []
  private indexed: boolean = false

  constructor() {
    this.buildIndex()
  }

  private async buildIndex(): Promise<void> {
    try {
      const posts = await this.loadPosts()
      const projects = await this.loadProjects()
      this.searchableItems = [...posts, ...projects]
      this.indexed = true
    } catch (error) {
      console.error('Failed to build search index:', error)
      this.searchableItems = []
      this.indexed = false
    }
  }

  private async loadPosts(): Promise<SearchableItem[]> {
    const postsDirectory = path.join(process.cwd(), 'content', 'blog')
    
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const files = fs.readdirSync(postsDirectory)
    const posts: SearchableItem[] = []

    for (const file of files) {
      if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
        continue
      }

      try {
        const fullPath = path.join(postsDirectory, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const slug = file.replace(/\.mdx?$/, '')

        if (data.published !== false) {
          posts.push({
            id: slug,
            slug,
            title: data.title || slug,
            content: content.substring(0, 2000), // Limit content for search performance
            type: 'post',
            category: data.category,
            tags: Array.isArray(data.tags) ? data.tags : [],
            date: data.date,
            excerpt: data.excerpt,
            readTime: data.readTime || calculateReadingTime(content).text,
            published: true
          })
        }
      } catch (error) {
        console.error(`Error processing post ${file}:`, error)
      }
    }

    return posts
  }

  private async loadProjects(): Promise<SearchableItem[]> {
    const projectsDirectory = path.join(process.cwd(), 'content', 'projects')
    
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }

    const files = fs.readdirSync(projectsDirectory)
    const projects: SearchableItem[] = []

    for (const file of files) {
      if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
        continue
      }

      try {
        const fullPath = path.join(projectsDirectory, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const slug = file.replace(/\.mdx?$/, '')

        projects.push({
          id: slug,
          slug,
          title: data.title || slug,
          content: content.substring(0, 2000),
          type: 'project',
          category: data.category,
          tags: Array.isArray(data.tags) ? data.tags : [],
          date: data.date,
          excerpt: data.description || data.excerpt,
          status: data.status,
          demoUrl: data.demo,
          repoUrl: data.repo,
          published: data.published !== false
        })
      } catch (error) {
        console.error(`Error processing project ${file}:`, error)
      }
    }

    return projects
  }

  public search(params: SearchParams): SearchResult[] {
    if (!this.indexed) {
      return []
    }

    let results = this.searchableItems.slice()

    // Apply filters
    if (params.filters) {
      results = this.applyFilters(results, params.filters)
    }

    // Apply search query and convert to SearchResult[]
    let searchResults: SearchResult[]
    if (params.query && params.query.trim()) {
      searchResults = this.performSearch(results, params.query.trim())
    } else {
      // No query, just return filtered results with score 0
      searchResults = results.map(item => ({
        ...item,
        score: 0,
        highlights: {}
      }))
    }

    // Sort results
    searchResults = this.sortResults(searchResults, params.sort || 'relevance')

    // Apply pagination
    const offset = params.offset || 0
    const limit = params.limit || 50
    const paginatedResults = searchResults.slice(offset, offset + limit)

    return paginatedResults
  }

  private applyFilters(items: SearchableItem[], filters: SearchParams['filters']): SearchableItem[] {
    let filtered = items

    if (filters?.type?.length) {
      filtered = filtered.filter(item => filters.type!.includes(item.type))
    }

    if (filters?.category?.length) {
      filtered = filtered.filter(item => 
        item.category && filters.category!.includes(item.category)
      )
    }

    if (filters?.tags?.length) {
      filtered = filtered.filter(item =>
        filters.tags!.some(tag => item.tags.includes(tag))
      )
    }

    if (filters?.status?.length && filters.status[0] !== 'all') {
      filtered = filtered.filter(item =>
        item.status && filters.status!.includes(item.status)
      )
    }

    if (filters?.dateFrom || filters?.dateTo) {
      filtered = filtered.filter(item => {
        if (!item.date) return false
        const itemDate = new Date(item.date)
        
        if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) {
          return false
        }
        
        if (filters.dateTo && itemDate > new Date(filters.dateTo)) {
          return false
        }
        
        return true
      })
    }

    return filtered
  }

  private performSearch(items: SearchableItem[], query: string): SearchResult[] {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0)
    
    return items.map(item => {
      const searchableText = this.getSearchableText(item).toLowerCase()
      const titleText = item.title.toLowerCase()
      const contentText = (item.content || '').toLowerCase()
      const excerptText = (item.excerpt || '').toLowerCase()

      let score = 0
      const highlights: SearchResult['highlights'] = {}

      // Enhanced scoring with fuzzy matching
      for (const term of searchTerms) {
        // Exact matches (highest priority)
        if (titleText.includes(term)) {
          score += 15
          highlights.title = this.highlightText(item.title, term)
        }

        // Fuzzy title matching (for typos)
        const titleFuzzyScore = this.calculateFuzzyScore(term, titleText)
        if (titleFuzzyScore > 0.7) {
          score += Math.round(titleFuzzyScore * 10)
          if (!highlights.title) {
            highlights.title = this.highlightText(item.title, term)
          }
        }

        // Exact phrase match in title (bonus)
        if (titleText.includes(query.toLowerCase())) {
          score += 25
        }

        // Content matches with proximity bonus
        const contentMatches = this.countMatches(contentText, term)
        if (contentMatches > 0) {
          score += Math.min(contentMatches * 2, 10) // Cap at 10 points
          if (!highlights.content) {
            highlights.content = this.highlightText(
              this.extractRelevantSnippet(item.content, term, 200), 
              term
            )
          }
        }

        // Excerpt matches
        if (excerptText.includes(term)) {
          score += 8
          highlights.excerpt = this.highlightText(item.excerpt || '', term)
        }

        // Tag matches (exact and fuzzy)
        for (const tag of item.tags) {
          if (tag.toLowerCase().includes(term)) {
            score += 12
          } else if (this.calculateFuzzyScore(term, tag.toLowerCase()) > 0.8) {
            score += 8
          }
        }

        // Category matches
        if (item.category && item.category.toLowerCase().includes(term)) {
          score += 10
        }

        // Word boundary bonus (whole word matches)
        const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i')
        if (wordBoundaryRegex.test(searchableText)) {
          score += 5
        }
      }

      // Multi-term proximity bonus
      if (searchTerms.length > 1) {
        const proximityScore = this.calculateProximityScore(searchableText, searchTerms)
        score += proximityScore
      }

      // Boost recent content
      if (item.date) {
        const daysSincePublished = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSincePublished < 30) {
          score += 3
        } else if (daysSincePublished < 90) {
          score += 1
        }
      }

      // Boost by content type
      if (item.type === 'post') {
        score += 1 // Slight boost for posts
      }

      return {
        ...item,
        score,
        highlights
      }
    }).filter(result => result.score > 0)
  }

  private calculateFuzzyScore(pattern: string, text: string): number {
    if (!pattern || !text) return 0
    
    const patternLength = pattern.length
    const textLength = text.length
    
    if (patternLength === 0) return textLength === 0 ? 1 : 0
    if (textLength === 0) return 0
    
    let score = 0
    let patternIndex = 0
    
    for (let i = 0; i < textLength && patternIndex < patternLength; i++) {
      if (text[i] === pattern[patternIndex]) {
        score++
        patternIndex++
      }
    }
    
    return score / Math.max(patternLength, textLength)
  }

  private countMatches(text: string, term: string): number {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = text.match(regex)
    return matches ? matches.length : 0
  }

  private extractRelevantSnippet(content: string, term: string, maxLength: number): string {
    const lowerContent = content.toLowerCase()
    const lowerTerm = term.toLowerCase()
    const index = lowerContent.indexOf(lowerTerm)
    
    if (index === -1) {
      return content.substring(0, maxLength)
    }
    
    const start = Math.max(0, index - maxLength / 2)
    const end = Math.min(content.length, start + maxLength)
    
    let snippet = content.substring(start, end)
    
    // Try to start and end on word boundaries
    if (start > 0) {
      const spaceIndex = snippet.indexOf(' ')
      if (spaceIndex > 0 && spaceIndex < 20) {
        snippet = snippet.substring(spaceIndex + 1)
      }
    }
    
    if (end < content.length) {
      const lastSpaceIndex = snippet.lastIndexOf(' ')
      if (lastSpaceIndex > snippet.length - 20) {
        snippet = snippet.substring(0, lastSpaceIndex)
      }
    }
    
    return snippet.trim()
  }

  private calculateProximityScore(text: string, terms: string[]): number {
    if (terms.length < 2) return 0
    
    let proximityScore = 0
    const words = text.split(/\s+/)
    
    for (let i = 0; i < terms.length - 1; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        const term1Index = words.findIndex(word => word.includes(terms[i]))
        const term2Index = words.findIndex(word => word.includes(terms[j]))
        
        if (term1Index !== -1 && term2Index !== -1) {
          const distance = Math.abs(term1Index - term2Index)
          if (distance <= 5) {
            proximityScore += Math.max(0, 5 - distance)
          }
        }
      }
    }
    
    return proximityScore
  }

  private getSearchableText(item: SearchableItem): string {
    return [
      item.title,
      item.content,
      item.excerpt || '',
      item.category || '',
      ...item.tags
    ].join(' ')
  }

  private highlightText(text: string, term: string): string {
    const regex = new RegExp(`(${term})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  private sortResults(results: SearchResult[], sort: string): SearchResult[] {
    switch (sort) {
      case 'date':
        return results.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
      
      case 'title':
        return results.sort((a, b) => a.title.localeCompare(b.title))
      
      case 'relevance':
      default:
        return results.sort((a, b) => b.score - a.score)
    }
  }

  public getStats() {
    return {
      totalItems: this.searchableItems.length,
      posts: this.searchableItems.filter(item => item.type === 'post').length,
      projects: this.searchableItems.filter(item => item.type === 'project').length,
      categories: [...new Set(this.searchableItems.map(item => item.category).filter(Boolean))],
      tags: [...new Set(this.searchableItems.flatMap(item => item.tags))],
      indexed: this.indexed
    }
  }
}

// Global search engine instance
let searchEngine: SearchEngine | null = null

function getSearchEngine(): SearchEngine {
  if (!searchEngine) {
    searchEngine = new SearchEngine()
  }
  return searchEngine
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, apiRateLimiter, async () => {
    try {
      // Validate request
      const validation = validateRequest(request)
      if (!validation.isValid) {
        SecurityMonitor.logSecurityEvent('validation_error', {
          errors: validation.errors
        }, request)
        return createSecureResponse(
          { error: 'Invalid request', details: validation.errors },
          400
        )
      }

      const url = new URL(request.url)
      const query = InputSanitizer.sanitizeString(url.searchParams.get('query') || url.searchParams.get('q') || '')
      const type = url.searchParams.get('type')?.split(',').filter(Boolean) || []
      const category = url.searchParams.get('category')?.split(',').filter(Boolean) || []
      const tags = url.searchParams.get('tags')?.split(',').filter(Boolean) || []
      const status = url.searchParams.get('status')?.split(',').filter(Boolean) || []
      const dateFrom = url.searchParams.get('dateFrom')
      const dateTo = url.searchParams.get('dateTo')
      const sort = url.searchParams.get('sort') as SearchParams['sort'] || 'relevance'
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)
      const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0)

      // Validate sort parameter
      if (!['relevance', 'date', 'title'].includes(sort)) {
        return createSecureResponse(
          { error: 'Invalid sort parameter' },
          400
        )
      }

      const searchParams: SearchParams = {
        query,
        filters: {
          type: type.length ? type : undefined,
          category: category.length ? category : undefined,
          tags: tags.length ? tags : undefined,
          status: status.length ? status : undefined,
          dateFrom: dateFrom ? InputSanitizer.sanitizeString(dateFrom) : undefined,
          dateTo: dateTo ? InputSanitizer.sanitizeString(dateTo) : undefined,
        },
        sort,
        limit,
        offset
      }

      const engine = getSearchEngine()
      const searchResults = engine.search(searchParams)
      const stats = engine.getStats()

      // Log search query for analytics
      if (query) {
        SecurityMonitor.logSecurityEvent('rate_limit', {
          type: 'search_query',
          query: query.substring(0, 100), // Limit logged query length
          resultsCount: searchResults.length
        }, request)
      }

      // Get available filters from all items for the frontend
      const availableFilters = {
        categories: stats.categories || [],
        tags: stats.tags || [],
        statuses: ['completed', 'in-progress', 'planned']
      }

      return createSecureResponse({
        results: searchResults,
        total: searchResults.length,
        query: searchParams.query,
        filters: searchParams.filters,
        sort: searchParams.sort,
        availableFilters,
        pagination: {
          limit: searchParams.limit,
          offset: searchParams.offset,
          hasMore: searchResults.length === limit
        },
        stats: {
          totalItems: stats.totalItems,
          indexed: stats.indexed
        }
      })

    } catch (error) {
      console.error('Search API error:', error)
      SecurityMonitor.logSecurityEvent('validation_error', {
        error: 'Search API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, request)
      return createSecureResponse(
        { error: 'Search service temporarily unavailable' },
        500
      )
    }
  })
}