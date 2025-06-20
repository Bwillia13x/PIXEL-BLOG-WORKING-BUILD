'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import SearchBar from '@/app/components/SearchBar'
import SearchFilters from '@/app/components/SearchFilters'
import SearchResults from '@/app/components/SearchResults'
import { useSearch } from '@/app/hooks/useSearch'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

function SearchPageContent() {
  const [showFilters, setShowFilters] = useState(false)
  const {
    filters,
    setFilters,
    results,
    availableFilters,
    isLoading,
    totalResults,
  } = useSearch({ enableUrlState: true })

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-white mb-2">
            <span className="text-green-400">&gt;</span> Search
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            Find posts, projects, and insights across my digital workspace
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={filters.query}
            onChange={(query) => setFilters({ ...filters, query })}
            isLoading={isLoading}
            placeholder="Search posts, projects, technologies..."
          />
        </div>

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
                <span className="font-mono text-sm">Show Filters</span>
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
              query={filters.query}
            />
          </main>
        </div>

        {/* Quick Search Suggestions */}
        {!filters.query && results.length === 0 && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-6">
              <h3 className="font-mono text-lg text-green-400 mb-4">Quick Search Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-mono text-sm text-white mb-2">Technologies</h4>
                  <div className="space-y-1">
                    {['Next.js', 'React', 'AI', 'TypeScript', 'Value Investing'].map(tech => (
                      <button
                        key={tech}
                        onClick={() => setFilters({ ...filters, query: tech })}
                        className="
                          block text-xs text-gray-400 hover:text-green-400 
                          transition-colors duration-200 font-mono pixel-hover
                        "
                      >
                        • {tech}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-sm text-white mb-2">Topics</h4>
                  <div className="space-y-1">
                    {['Portfolio', 'Analysis', 'Development', 'Tools', 'Visualization'].map(topic => (
                      <button
                        key={topic}
                        onClick={() => setFilters({ ...filters, query: topic })}
                        className="
                          block text-xs text-gray-400 hover:text-green-400 
                          transition-colors duration-200 font-mono pixel-hover
                        "
                      >
                        • {topic}
                      </button>
                    ))}
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