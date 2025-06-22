'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import SearchBar from '@/app/components/SearchBar'
import SearchFilters from '@/app/components/SearchFilters'
import SearchResults from '@/app/components/SearchResults'
import { motion } from 'framer-motion'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PageHeader from '@/app/components/PageHeader'

interface SearchResult {
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
  score: number
  highlights: {
    title?: string
    content?: string
    excerpt?: string
  }
}

function SearchPageContent() {
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [filters, setFilters] = useState({
    type: [] as string[],
    category: [] as string[],
    tags: [] as string[],
    status: [] as string[]
  })
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
    statuses: [] as string[]
  })

  // Fetch search results
  const performSearch = async (searchQuery: string, searchFilters = filters) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('query', searchQuery.trim())
      if (searchFilters.type.length) params.set('type', searchFilters.type.join(','))
      if (searchFilters.category.length) params.set('category', searchFilters.category.join(','))
      if (searchFilters.tags.length) params.set('tags', searchFilters.tags.join(','))
      if (searchFilters.status.length) params.set('status', searchFilters.status.join(','))

      const response = await fetch(`/api/search?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      setResults(data.results || [])
      setTotalResults(data.total || 0)
      
      // Update available filters based on search results
      if (data.availableFilters) {
        setAvailableFilters(data.availableFilters)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Load initial data and search
  useEffect(() => {
    performSearch(query)
  }, [])

  // Search when query changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  // Search when filters change
  useEffect(() => {
    performSearch(query, filters)
  }, [filters])

  const quickSearchTerms = [
    'AI', 'Next.js', 'React', 'TypeScript', 'Value Investing',
    'Portfolio', 'Analysis', 'Development', 'Tools', 'Visualization'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="pixel-grid opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <PageHeader 
          title="Search"
          subtitle="Find posts, projects, and insights across my digital workspace"
          prefix=">"
          animationType="matrix"
          titleClassName="text-2xl md:text-3xl lg:text-4xl"
        />

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <SearchBar
            value={query}
            onChange={setQuery}
            isLoading={isLoading}
            placeholder="Search posts, projects, technologies..."
          />
        </motion.div>

        {/* Results Summary */}
        {(query || totalResults > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-sm font-mono text-gray-400">
              {isLoading ? (
                'Searching...'
              ) : (
                `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}`
              )}
            </p>
          </motion.div>
        )}

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="
              flex items-center space-x-2 px-4 py-2 pixel-border bg-gray-900/60 
              text-green-400 hover:bg-gray-800/60 transition-colors duration-200
            "
          >
            {showFilters ? (
              <>
                <XMarkIcon className="h-4 w-4" />
                <span className="font-mono text-sm">Hide Filters</span>
              </>
            ) : (
              <>
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span className="font-mono text-sm">Show Filters ({Object.values(filters).flat().length})</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className={`
            lg:w-80 lg:block
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            <div className="sticky top-8">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableFilters={availableFilters}
                totalResults={totalResults}
              />
            </div>
          </aside>

          {/* Main Content - Results */}
          <main className="flex-1">
            <SearchResults
              results={results}
              isLoading={isLoading}
              query={query}
            />
          </main>
        </div>

        {/* Quick Search Suggestions */}
        {!query && results.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-6">
              <h3 className="font-pixel text-lg text-green-400 mb-6 text-center">🔍 Quick Search Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-mono text-sm text-white mb-3">🚀 Technologies</h4>
                  <div className="space-y-2">
                    {['Next.js', 'React', 'AI', 'TypeScript', 'Python'].map(tech => (
                      <button
                        key={tech}
                        onClick={() => setQuery(tech)}
                        className="
                          block text-xs text-gray-400 hover:text-green-400 
                          transition-colors duration-200 font-mono pixel-hover
                          hover:translate-x-1 transform transition-transform
                        "
                      >
                        • {tech}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-sm text-white mb-3">📈 Finance & Investing</h4>
                  <div className="space-y-2">
                    {['Value Investing', 'Portfolio', 'Analysis', 'EPV', 'Graham'].map(topic => (
                      <button
                        key={topic}
                        onClick={() => setQuery(topic)}
                        className="
                          block text-xs text-gray-400 hover:text-green-400 
                          transition-colors duration-200 font-mono pixel-hover
                          hover:translate-x-1 transform transition-transform
                        "
                      >
                        • {topic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-sm text-white mb-3">🛠️ Tools & Projects</h4>
                  <div className="space-y-2">
                    {['Calculator', 'Dashboard', 'Engine', 'Screener', 'Platform'].map(tool => (
                      <button
                        key={tool}
                        onClick={() => setQuery(tool)}
                        className="
                          block text-xs text-gray-400 hover:text-green-400 
                          transition-colors duration-200 font-mono pixel-hover
                          hover:translate-x-1 transform transition-transform
                        "
                      >
                        • {tool}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent additions hint */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 font-mono text-center">
                  💡 Try searching for recent posts like "Deep Value Screener" or "Quality Score Engine"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state for failed search */}
        {query && results.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-pixel text-green-400 mb-4">No Results Found</h3>
            <p className="text-gray-400 font-mono mb-6">
              No content matches your search for "{query}".
            </p>
            <div className="space-y-2 text-sm text-gray-500 font-mono">
              <p>• Check your spelling</p>
              <p>• Try broader terms</p>
              <p>• Use the suggestions above</p>
            </div>
            <button
              onClick={() => setQuery('')}
              className="
                mt-6 px-4 py-2 bg-green-400/10 border border-green-400/30 
                text-green-400 rounded font-mono text-sm hover:bg-green-400/20 
                transition-colors duration-200
              "
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono text-sm">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}