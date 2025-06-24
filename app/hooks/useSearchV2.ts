import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Enhanced search types
export interface SearchResult {
  id: string
  slug: string
  title: string
  content: string
  type: 'post' | 'project'
  category?: string
  tags: string[]
  date?: string
  excerpt?: string
  readTime?: string
  published?: boolean
  status?: string
  demoUrl?: string
  repoUrl?: string
  score?: number
  highlights?: {
    title?: string
    content?: string
    excerpt?: string
  }
}

export interface SearchFilters {
  query: string
  categories: string[]
  tags: string[]
  types: ('post' | 'project')[]
  dateRange: {
    start?: string
    end?: string
  }
  status?: ('completed' | 'in-progress' | 'planned')[]
}

export interface SearchResponse {
  results: SearchResult[]
  totalResults: number
  query: string
  filters: any
  sort: string
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
  stats: {
    totalItems: number
    indexed: boolean
  }
}

export interface UseSearchV2Options {
  debounceMs?: number
  enableUrlState?: boolean
  useServerSearch?: boolean
  limit?: number
}

export function useSearchV2(options: UseSearchV2Options = {}) {
  const { 
    debounceMs = 300, 
    enableUrlState = true, 
    useServerSearch = true,
    limit = 50 
  } = options
  
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Initialize filters from URL or defaults
  const initialFilters: SearchFilters = {
    query: enableUrlState ? (searchParams.get('q') || '') : '',
    categories: enableUrlState ? (searchParams.get('categories')?.split(',').filter(Boolean) || []) : [],
    tags: enableUrlState ? (searchParams.get('tags')?.split(',').filter(Boolean) || []) : [],
    types: enableUrlState ? ((searchParams.get('types')?.split(',').filter(Boolean) as ('post' | 'project')[]) || ['post', 'project']) : ['post', 'project'],
    dateRange: {
      start: enableUrlState ? (searchParams.get('dateStart') || undefined) : undefined,
      end: enableUrlState ? (searchParams.get('dateEnd') || undefined) : undefined,
    },
    status: enableUrlState ? ((searchParams.get('status')?.split(',').filter(Boolean) as ('completed' | 'in-progress' | 'planned')[]) || undefined) : undefined,
  }
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
    statuses: [] as string[]
  })
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.query)
      setOffset(0) // Reset pagination when query changes
    }, debounceMs)
    
    return () => clearTimeout(timer)
  }, [filters.query, debounceMs])
  
  // Update URL when filters change
  useEffect(() => {
    if (!enableUrlState) return
    
    const params = new URLSearchParams()
    
    if (filters.query) params.set('q', filters.query)
    if (filters.categories.length) params.set('categories', filters.categories.join(','))
    if (filters.tags.length) params.set('tags', filters.tags.join(','))
    if (filters.types.length < 2) params.set('types', filters.types.join(','))
    if (filters.dateRange.start) params.set('dateStart', filters.dateRange.start)
    if (filters.dateRange.end) params.set('dateEnd', filters.dateRange.end)
    if (filters.status?.length) params.set('status', filters.status.join(','))
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(newUrl, { scroll: false })
  }, [filters, router, enableUrlState])
  
  // Server-side search function
  const performServerSearch = useCallback(async (searchOffset = 0, append = false) => {
    if (!useServerSearch) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      if (filters.types.length) params.set('type', filters.types.join(','))
      if (filters.categories.length) params.set('category', filters.categories.join(','))
      if (filters.tags.length) params.set('tags', filters.tags.join(','))
      if (filters.status?.length) params.set('status', filters.status.join(','))
      if (filters.dateRange.start) params.set('dateFrom', filters.dateRange.start)
      if (filters.dateRange.end) params.set('dateTo', filters.dateRange.end)
      params.set('sort', 'relevance')
      params.set('limit', limit.toString())
      params.set('offset', searchOffset.toString())
      
      const response = await fetch(`/api/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }
      
      const data: SearchResponse = await response.json()
      
      if (append) {
        setResults(prev => [...prev, ...data.results])
      } else {
        setResults(data.results)
      }
      
      setTotalResults(data.totalResults)
      setHasMore(data.pagination.hasMore)
      
      // Update available filters if this is the first search
      if (!append && data.stats) {
        // Extract available filters from results
        const categories = new Set<string>()
        const tags = new Set<string>()
        const statuses = new Set<string>()
        
        data.results.forEach(item => {
          if (item.category) categories.add(item.category)
          item.tags.forEach(tag => tags.add(tag))
          if (item.status) statuses.add(item.status)
        })
        
        setAvailableFilters({
          categories: Array.from(categories).sort(),
          tags: Array.from(tags).sort(),
          statuses: Array.from(statuses).sort()
        })
      }
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
      setTotalResults(0)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, filters, limit, useServerSearch])
  
  // Trigger search when debounced query or filters change
  useEffect(() => {
    if (useServerSearch) {
      performServerSearch(0, false)
    }
  }, [performServerSearch, useServerSearch])
  
  // Load more results
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return
    
    const newOffset = offset + limit
    setOffset(newOffset)
    await performServerSearch(newOffset, true)
  }, [hasMore, isLoading, offset, limit, performServerSearch])
  
  // Clear search and filters
  const clearSearch = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      categories: [],
      tags: [],
      types: ['post', 'project'],
      dateRange: {},
      status: undefined
    }
    setFilters(clearedFilters)
    setResults([])
    setTotalResults(0)
    setOffset(0)
    setHasMore(false)
    setError(null)
  }, [])
  
  // Update individual filter
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setOffset(0) // Reset pagination when filters change
  }, [])
  
  // Toggle filter value (for arrays)
  const toggleCategory = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter(item => item !== value)
        : [...prev.categories, value]
    }))
    setOffset(0)
  }, [])

  const toggleTag = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(value)
        ? prev.tags.filter(item => item !== value)
        : [...prev.tags, value]
    }))
    setOffset(0)
  }, [])

  const toggleType = useCallback((value: 'post' | 'project') => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(value)
        ? prev.types.filter(item => item !== value)
        : [...prev.types, value]
    }))
    setOffset(0)
  }, [])

  const toggleStatus = useCallback((value: 'completed' | 'in-progress' | 'planned') => {
    setFilters(prev => ({
      ...prev,
      status: prev.status?.includes(value)
        ? prev.status.filter(item => item !== value)
        : [...(prev.status || []), value]
    }))
    setOffset(0)
  }, [])
  
  // Get search suggestions
  const getSearchSuggestions = useCallback(() => {
    const suggestions = []
    
    if (availableFilters.categories.length) {
      suggestions.push(...availableFilters.categories.slice(0, 3).map(cat => `category:${cat}`))
    }
    
    if (availableFilters.tags.length) {
      suggestions.push(...availableFilters.tags.slice(0, 3).map(tag => `tag:${tag}`))
    }
    
    return suggestions
  }, [availableFilters])
  
  return {
    // State
    filters,
    results,
    isLoading,
    error,
    totalResults,
    availableFilters,
    hasMore,
    
    // Actions
    setFilters,
    updateFilter,
    toggleCategory,
    toggleTag,
    toggleType,
    toggleStatus,
    clearSearch,
    loadMore,
    
    // Computed
    isEmpty: results.length === 0 && !isLoading,
    hasQuery: filters.query.trim().length > 0,
    hasFilters: filters.categories.length > 0 || 
                filters.tags.length > 0 || 
                filters.types.length < 2 || 
                filters.status?.length || 
                filters.dateRange.start || 
                filters.dateRange.end,
    suggestions: getSearchSuggestions(),
    
    // Debug info
    debug: {
      debouncedQuery,
      offset,
      useServerSearch
    }
  }
}