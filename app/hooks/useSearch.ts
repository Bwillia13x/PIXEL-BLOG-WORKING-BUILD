import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Define types without importing server-side modules
export interface Post {
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

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  status: 'completed' | 'in-progress' | 'planned'
  year?: number
}

export type SearchableItem = (Post & { type: 'post' }) | (Project & { type: 'project' })

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

export interface UseSearchOptions {
  debounceMs?: number
  enableUrlState?: boolean
  initialPosts?: Post[]
  initialProjects?: Project[]
}

function normalizeSearchableItem(item: Post | Project, type: 'post' | 'project'): SearchableItem {
  if (type === 'post') {
    const post = item as Post
    return {
      ...post,
      type: 'post',
      tags: post.tags || [],
    }
  } else {
    const project = item as Project
    return {
      ...project,
      type: 'project',
      content: project.description,
    } as SearchableItem
  }
}

function extractSearchTerms(item: SearchableItem): string {
  const terms = [
    item.title,
    item.type === 'post' ? item.content || '' : item.description || '',
    'category' in item ? item.category || '' : '',
    ...(item.tags || []),
  ]
  
  return terms.join(' ').toLowerCase()
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, enableUrlState = false, initialPosts = [], initialProjects = [] } = options
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
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.query)
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
  
  // Prepare searchable data
  const searchableData = useMemo(() => {
    const items: SearchableItem[] = []
    
    // Add posts
    initialPosts.forEach(post => {
      items.push(normalizeSearchableItem(post, 'post'))
    })
    
    // Add projects
    initialProjects.forEach(project => {
      items.push(normalizeSearchableItem(project, 'project'))
    })
    
    return items
  }, [initialPosts, initialProjects])
  
  // Get unique categories and tags
  const availableFilters = useMemo(() => {
    const categories = new Set<string>()
    const tags = new Set<string>()
    const statuses = new Set<string>()
    
    searchableData.forEach(item => {
      if ('category' in item && item.category) categories.add(item.category)
      if (item.tags) item.tags.forEach(tag => tags.add(tag))
      if (item.type === 'project' && 'status' in item) statuses.add(item.status)
    })
    
    return {
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
      statuses: Array.from(statuses).sort() as ('completed' | 'in-progress' | 'planned')[],
    }
  }, [searchableData])
  
  // Perform search and filtering
  const results = useMemo(() => {
    let filtered = searchableData
    
    // Filter by type
    if (filters.types.length < 2) {
      filtered = filtered.filter(item => filters.types.includes(item.type))
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        'category' in item && item.category && filters.categories.includes(item.category))
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags?.some(tag => filters.tags.includes(tag)))
    }
    
    // Filter by status (projects only)
    if (filters.status?.length) {
      filtered = filtered.filter(item => 
        item.type === 'project' && 'status' in item && filters.status!.includes(item.status))
    }
    
    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = item.type === 'post' ? item.date : 
          (item.type === 'project' && 'year' in item) ? `${item.year}-01-01` : null
        
        if (!itemDate) return false
        
        const date = new Date(itemDate)
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null
        
        if (start && date < start) return false
        if (end && date > end) return false
        
        return true
      })
    }
    
    // Full-text search
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase()
      filtered = filtered.filter(item => {
        const searchText = extractSearchTerms(item)
        return searchText.includes(query)
      })
    }
    
    // Sort results by relevance/date
    return filtered.sort((a, b) => {
      // If there's a search query, prioritize title matches
      if (debouncedQuery.trim()) {
        const queryLower = debouncedQuery.toLowerCase()
        const aTitle = a.title.toLowerCase().includes(queryLower)
        const bTitle = b.title.toLowerCase().includes(queryLower)
        
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
      }
      
      // Sort by date (newest first)
      const aDate = a.type === 'post' ? a.date : 
        (a.type === 'project' && 'year' in a) ? `${a.year}-01-01` : '1970-01-01'
      const bDate = b.type === 'post' ? b.date : 
        (b.type === 'project' && 'year' in b) ? `${b.year}-01-01` : '1970-01-01'
      
      return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime()
    })
  }, [searchableData, filters, debouncedQuery])
  
  // Helper function to highlight search results
  const highlightResult = (item: SearchableItem): SearchableItem => {
    if (!debouncedQuery.trim()) return item
    
    if (item.type === 'post') {
      return {
        ...item,
        title: highlightText(item.title, debouncedQuery),
        content: highlightText(item.content || '', debouncedQuery),
        category: highlightText(item.category || '', debouncedQuery),
      }
    } else {
      return {
        ...item,
        title: highlightText(item.title, debouncedQuery),
        description: highlightText(item.description || '', debouncedQuery),
      }
    }
  }
  
  return {
    filters,
    setFilters,
    results: results.map(highlightResult),
    availableFilters,
    isLoading: filters.query !== debouncedQuery,
    totalResults: results.length,
  }
}