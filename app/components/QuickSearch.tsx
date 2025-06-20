'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { useSearch } from '@/app/hooks/useSearch'

interface QuickSearchProps {
  className?: string
}

export default function QuickSearch({ className = "" }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const searchInstance = useSearch({ 
    debounceMs: 300,
    initialPosts: [], // Empty for now - will be populated when data is available
    initialProjects: [] // Empty for now - will be populated when data is available
  })
  
  // Update search when query changes
  const filteredResults = query.trim() ? 
    searchInstance.results
      .filter(item => {
        const searchText = `${item.title} ${item.content || ''} ${item.category || ''} ${item.tags?.join(' ') || ''}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
      .slice(0, 5) : []
  
  // Update filters when query changes
  React.useEffect(() => {
    searchInstance.setFilters({ 
      ...searchInstance.filters, 
      query 
    })
  }, [query])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Trigger */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="
          flex items-center space-x-2 px-3 py-2 pixel-border bg-gray-900/60 
          backdrop-blur-sm text-gray-400 hover:text-white hover:border-green-400
          transition-all duration-200 group w-full md:w-64
        "
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span className="font-mono text-sm flex-1 text-left">Search...</span>
        <div className="hidden md:flex items-center space-x-1 text-xs">
          <CommandLineIcon className="h-3 w-3" />
          <span>K</span>
        </div>
      </button>

      {/* Search Modal/Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" />
          
          {/* Search Panel */}
          <div className="
            absolute top-full left-0 right-0 mt-2 z-50
            md:w-96 md:left-auto md:right-0
            pixel-border bg-gray-900/95 backdrop-blur-md shadow-2xl
          ">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-green-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts and projects..."
                  className="
                    flex-1 bg-transparent text-white placeholder-gray-400 
                    focus:outline-none font-mono text-sm
                  "
                  autoComplete="off"
                />
                {searchInstance.isLoading && (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim() && filteredResults.length > 0 ? (
                <div className="p-2">
                  {filteredResults.map((item, index) => {
                    const href = item.type === 'post' ? `/blog/${item.slug}` : `/projects/${item.id}`
                    return (
                      <Link
                        key={`${item.type}-${item.id || item.slug}-${index}`}
                        href={href}
                        onClick={handleResultClick}
                        className="
                          block p-3 hover:bg-gray-800/50 transition-colors duration-200
                          border-l-2 border-transparent hover:border-green-400
                        "
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`
                            flex-shrink-0 w-2 h-2 rounded-full mt-2
                            ${item.type === 'post' ? 'bg-blue-400' : 'bg-purple-400'}
                          `} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-mono text-sm text-white truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {item.content?.slice(0, 100)}...
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`
                                text-xs font-mono px-1 py-0.5 rounded
                                ${item.type === 'post' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}
                              `}>
                                {item.type.toUpperCase()}
                              </span>
                              {item.category && (
                                <span className="text-xs text-gray-500 font-mono">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  
                  {/* View All Results Link */}
                  <div className="p-3 border-t border-gray-700">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={handleResultClick}
                      className="
                        flex items-center justify-center space-x-2 text-sm text-green-400 
                        hover:text-green-300 transition-colors duration-200 font-mono
                      "
                    >
                      <span>View all results</span>
                      <span className="text-xs">({filteredResults.length > 5 ? '5+' : filteredResults.length})</span>
                    </Link>
                  </div>
                </div>
              ) : query.trim() ? (
                <div className="p-4 text-center">
                  <p className="text-gray-400 font-mono text-sm">
                    No results found for "{query}"
                  </p>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    className="
                      text-green-400 hover:text-green-300 transition-colors 
                      duration-200 font-mono text-xs mt-2 inline-block
                    "
                  >
                    Try advanced search
                  </Link>
                </div>
              ) : (
                <div className="p-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 font-mono text-xs mb-2">
                      Quick Actions
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      href="/search"
                      onClick={handleResultClick}
                      className="
                        block p-2 text-sm text-gray-300 hover:text-white 
                        hover:bg-gray-800/50 transition-colors duration-200 font-mono
                      "
                    >
                      → Advanced Search
                    </Link>
                    <Link
                      href="/blog"
                      onClick={handleResultClick}
                      className="
                        block p-2 text-sm text-gray-300 hover:text-white 
                        hover:bg-gray-800/50 transition-colors duration-200 font-mono
                      "
                    >
                      → Browse Posts
                    </Link>
                    <Link
                      href="/projects"
                      onClick={handleResultClick}
                      className="
                        block p-2 text-sm text-gray-300 hover:text-white 
                        hover:bg-gray-800/50 transition-colors duration-200 font-mono
                      "
                    >
                      → View Projects
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}