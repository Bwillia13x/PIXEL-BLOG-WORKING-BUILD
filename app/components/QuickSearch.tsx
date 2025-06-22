'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { MagnifyingGlassIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/app/hooks/useSearch'

interface QuickSearchProps {
  className?: string
}

// Fallback component while search is loading
function QuickSearchFallback() {
  return (
    <div className="relative">
      <div className="flex items-center space-x-2 px-3 py-2 pixel-border bg-gray-900/60 backdrop-blur-sm text-gray-400 w-full md:w-64">
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span className="font-mono text-sm flex-1 text-left">Loading search...</span>
        <div className="hidden md:flex items-center space-x-1 text-xs">
          <CommandLineIcon className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>
    </div>
  )
}

// Search content component that uses hooks
function QuickSearchContent({ className = "" }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [lastTyped, setLastTyped] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Typing indicator logic
  useEffect(() => {
    if (query.length > 0) {
      setIsTyping(true)
      setLastTyped(Date.now())
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    } else {
      setIsTyping(false)
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [query])
  
  const searchInstance = useSearch({ 
    debounceMs: 300,
    initialPosts: [], // Empty for now - will be populated when data is available
    initialProjects: [] // Empty for now - will be populated when data is available
  })
  
  // Update search when query changes
  const filteredResults = query.trim() ? 
    searchInstance.results
      .filter(item => {
        const searchText = `${item.title} ${'content' in item ? item.content || '' : ''} ${'description' in item ? item.description || '' : ''} ${'category' in item ? item.category || '' : ''} ${item.tags?.join(' ') || ''}`.toLowerCase()
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
    setIsFocused(false)
    setIsTyping(false)
  }

  // Pixel-style loading component
  const PixelLoader = () => (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 bg-green-400"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Enhanced Search Trigger */}
      <motion.button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => {
            inputRef.current?.focus()
            setIsFocused(true)
          }, 100)
        }}
        className="
          relative flex items-center space-x-2 px-4 py-3 pixel-border bg-gray-900/70 
          backdrop-blur-sm text-gray-400 hover:text-white hover:border-green-400/60
          transition-all duration-300 group w-full max-w-lg mx-auto overflow-hidden
          border-2 border-gray-600/40 hover:border-green-400/50 rounded-lg
        "
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 20px rgba(74, 222, 128, 0.2)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <motion.div
          animate={{ 
            scale: isOpen ? 1.1 : 1,
            color: isOpen ? "#22c55e" : undefined
          }}
          transition={{ duration: 0.2 }}
        >
          <MagnifyingGlassIcon className="h-4 w-4 relative z-10" />
        </motion.div>
        
        <span className="font-mono text-sm flex-1 text-center relative z-10">
          {isOpen ? "Searching..." : "Search posts and projects..."}
        </span>
        
        <div className="hidden md:flex items-center space-x-1 text-xs relative z-10">
          <motion.div
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommandLineIcon className="h-3 w-3" />
          </motion.div>
          <span>K</span>
        </div>
      </motion.button>

      {/* Enhanced Search Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <> 
            {/* Backdrop (portal) */}
            {createPortal(
              <motion.div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />,
              document.body
            )}
            
            {/* Search Panel */}
            <motion.div
              className="
                absolute top-full left-0 right-0 mt-2 z-50 max-h-[80vh] overflow-hidden
                pixel-border bg-gray-900/95 backdrop-blur-xl shadow-2xl
                md:w-96 md:max-w-none
              "
              initial={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                filter: "blur(10px)"
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                filter: "blur(10px)"
              }}
              transition={{ 
                duration: 0.3, 
                ease: [0.23, 1, 0.320, 1]
              }}
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(74, 222, 128, 0.2)"
              }}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="relative group">
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Type to search posts, projects..."
                    className="
                      w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-400
                      border border-gray-600/40 rounded font-mono text-sm
                      focus:outline-none focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20
                      transition-all duration-300
                    "
                    autoComplete="off"
                    spellCheck={false}
                  />
                  
                  {/* Search Icon & Status */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {isTyping ? (
                      <PixelLoader />
                    ) : (
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Focus ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded border-2 border-green-400/40 pointer-events-none"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ 
                      opacity: isFocused ? 1 : 0,
                      scale: isFocused ? 1 : 1.02
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {query.trim().length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 font-mono text-sm space-y-3">
                      <div className="flex justify-center mb-4">
                        <motion.div
                          className="flex space-x-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ staggerChildren: 0.1 }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-green-400/60 rounded-sm"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            />
                          ))}
                        </motion.div>
                      </div>
                      
                      <p>Start typing to search across all content</p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">↵</kbd> to search</p>
                        <p>• Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd> to close</p>
                        <p>• Use <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">⌘K</kbd> anywhere</p>
                      </div>
                    </div>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 font-mono text-sm">
                      <p className="mb-2">No results for "{query}"</p>
                      <p className="text-xs text-gray-500">Try different keywords or check spelling</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                                         {filteredResults.map((item, index) => (
                       <motion.div
                         key={`${item.type}-${item.type === 'post' ? item.slug : item.id}`}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.05 }}
                       >
                         <Link
                           href={item.type === 'post' ? `/blog/${item.slug}` : `/projects/${item.id}`}
                          onClick={handleResultClick}
                          className="
                            block px-4 py-3 hover:bg-gray-800/60 transition-colors duration-200
                            border-l-2 border-transparent hover:border-green-400/60
                            group
                          "
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`
                                  inline-flex items-center px-2 py-0.5 rounded text-xs font-mono
                                  ${item.type === 'post' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}
                                `}>
                                  {item.type === 'post' ? '📝' : '🚀'} {item.type}
                                </span>
                                {'category' in item && item.category && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="font-mono text-sm text-white group-hover:text-green-400 transition-colors truncate">
                                {item.title}
                              </h4>
                              
                                                             {(('content' in item && item.content) || ('description' in item && item.description)) && (
                                 <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                   {(('content' in item && item.content) || ('description' in item && item.description) || '').substring(0, 100)}...
                                 </p>
                               )}
                              
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-block px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded font-mono"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <span className="text-xs text-gray-500 font-mono">
                                      +{item.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    
                    {/* View All Results Link */}
                    <div className="border-t border-gray-700/50 p-3">
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        onClick={handleResultClick}
                        className="
                          w-full flex items-center justify-center space-x-2 px-4 py-2
                          bg-gray-800/40 hover:bg-gray-700/60 text-green-400 hover:text-green-300
                          font-mono text-sm rounded transition-all duration-200
                          border border-gray-600/40 hover:border-green-400/40
                        "
                      >
                        <span>View all results ({filteredResults.length})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QuickSearch({ className = "" }: QuickSearchProps) {
  return (
    <Suspense fallback={<QuickSearchFallback />}>
      <QuickSearchContent className={className} />
    </Suspense>
  )
}