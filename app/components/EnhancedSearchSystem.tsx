'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ArrowRight, Calendar, Tag, User, FileText, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MobileOptimizedButton } from './MobileOptimizedButton'

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'project' | 'page'
  url: string
  excerpt: string
  category?: string
  tags?: string[]
  date?: string
  relevance: number
}

interface SearchFilters {
  type: string[]
  category: string[]
  dateRange: 'all' | 'week' | 'month' | 'year'
  sortBy: 'relevance' | 'date' | 'title'
}

interface EnhancedSearchProps {
  className?: string
  variant?: 'inline' | 'modal' | 'page'
  placeholder?: string
  onSearchSubmit?: (query: string, filters: SearchFilters) => void
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'AI-Driven Development Workflow',
    type: 'post',
    url: '/blog/ai-driven-development-workflow',
    excerpt: 'Exploring how artificial intelligence is transforming software development workflows...',
    category: 'Tech',
    tags: ['AI', 'Development', 'Automation'],
    date: '2024-12-15',
    relevance: 0.95
  },
  {
    id: '2',
    title: 'Building My Digital Home',
    type: 'post',
    url: '/blog/building-my-digital-home',
    excerpt: 'Creating a personal blog and portfolio site using modern web technologies...',
    category: 'Tech',
    tags: ['Web Development', 'Portfolio'],
    date: '2024-12-10',
    relevance: 0.89
  },
  {
    id: '3',
    title: 'Deep Value Screener',
    type: 'project',
    url: '/projects/deep-value-screener',
    excerpt: 'A comprehensive tool for value investing analysis and stock screening...',
    category: 'Finance',
    tags: ['Finance', 'Analysis', 'Tools'],
    date: '2024-12-08',
    relevance: 0.82
  }
]

export default function EnhancedSearchSystem({
  className = '',
  placeholder = 'Search content...',
  onSearchSubmit
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(['AI development', 'portfolio', 'value investing'])
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: [],
    dateRange: 'all',
    sortBy: 'relevance'
  })

  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(newRecent)
      
      if (onSearchSubmit) {
        onSearchSubmit(query, filters)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
      setIsOpen(false)
    }
  }, [query, recentSearches, onSearchSubmit, filters, router])

  const handleResultClick = useCallback((result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
    
    // Add to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(newRecent)
  }, [query, recentSearches, router])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          } else if (query.trim()) {
            handleSearch()
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results, query, handleResultClick, handleSearch])

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Filter and sort mock results
    const filteredResults = mockSearchResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesType = filters.type.length === 0 || filters.type.includes(result.type)
      const matchesCategory = filters.category.length === 0 || 
                            (result.category && filters.category.includes(result.category))
      
      return matchesQuery && matchesType && matchesCategory
    })

    // Sort results
    filteredResults.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return b.relevance - a.relevance
      }
    })

    setResults(filteredResults)
    setIsLoading(false)
  }, [filters])

  // Debounced search
  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null)
  
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current)
    }
    
    debouncedSearchRef.current = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery)
      } else {
        setResults([])
      }
    }, 300)
  }, [performSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    setSelectedIndex(-1)
    
    if (value.trim()) {
      debouncedSearch(value)
    } else {
      setResults([])
    }
  }

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
    setIsOpen(true)
    performSearch(searchTerm)
  }

  const clearQuery = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    searchRef.current?.focus()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="w-4 h-4" />
      case 'project': return <User className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono text-sm transition-all duration-200"
            style={{ minHeight: '48px' }} // Touch-friendly
          />
          
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <MobileOptimizedButton
                onClick={clearQuery}
                variant="ghost"
                size="sm"
                className="p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </MobileOptimizedButton>
            )}
            
            <MobileOptimizedButton
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="sm"
              className={`p-1 ${showFilters ? 'text-green-400' : ''}`}
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
            </MobileOptimizedButton>
          </div>
        </div>

        {/* Search keyboard shortcut hint */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden md:block">
          <span className="text-xs text-gray-500 font-mono">⌘K</span>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 p-4 bg-gray-800/90 border border-gray-600/50 rounded-lg backdrop-blur-sm"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-pixel text-green-400 mb-2">Type</label>
                <div className="space-y-1">
                  {['post', 'project', 'page'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(f => ({ ...f, type: [...f.type, type] }))
                          } else {
                            setFilters(f => ({ ...f, type: f.type.filter(t => t !== type) }))
                          }
                        }}
                        className="rounded border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400"
                      />
                      <span className="text-sm font-mono text-gray-300 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-pixel text-green-400 mb-2">Category</label>
                <div className="space-y-1">
                  {['Tech', 'Finance', 'AI'].map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(f => ({ ...f, category: [...f.category, category] }))
                          } else {
                            setFilters(f => ({ ...f, category: f.category.filter(c => c !== category) }))
                          }
                        }}
                        className="rounded border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400"
                      />
                      <span className="text-sm font-mono text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-pixel text-green-400 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white font-mono text-sm focus:outline-none focus:border-green-400"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && (query.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 border border-green-400/30 rounded-lg shadow-2xl backdrop-blur-md z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-flex items-center space-x-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-sm font-mono text-gray-400">Searching...</span>
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-pixel text-gray-400">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full text-left px-3 py-2 rounded text-sm font-mono text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedIndex === index 
                        ? 'bg-green-400/10 border border-green-400/30' 
                        : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 text-gray-400">
                        {getTypeIcon(result.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-pixel text-sm text-green-400 truncate">
                            {result.title}
                          </h3>
                          {result.category && (
                            <span className="px-2 py-0.5 bg-gray-700 text-xs font-mono text-gray-300 rounded">
                              {result.category}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {result.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {result.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span className="font-mono">{formatDate(result.date)}</span>
                            </div>
                          )}
                          
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span className="font-mono">
                                {result.tags.slice(0, 2).join(', ')}
                                {result.tags.length > 2 && ` +${result.tags.length - 2}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.length > 2 && results.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-sm font-pixel text-gray-400 mb-2">No results found</p>
                <p className="text-xs text-gray-500 font-mono">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

