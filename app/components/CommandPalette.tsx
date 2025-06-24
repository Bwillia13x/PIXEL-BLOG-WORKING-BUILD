'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  FolderIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { fetchPosts } from '@/app/data/posts'
import { Post } from '@/app/types/Post'
import { FuzzySearch } from '@/app/utils/fuzzySearch'

interface SearchResult {
  type: 'post' | 'project' | 'page'
  id: string
  title: string
  description: string
  url: string
  category?: string
  tags?: string[]
  date?: string
  readTime?: string
  icon: React.ComponentType<{ className?: string }>
}

interface CommandPaletteProps {
  className?: string
  triggerOnly?: boolean
}

export default function CommandPalette({ className = '', triggerOnly = false }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [mounted, setMounted] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const fuzzySearchRef = useRef<FuzzySearch<SearchResult> | null>(null)

  // Static pages for search
  const staticPages: SearchResult[] = useMemo(() => [
    {
      type: 'page',
      id: 'home',
      title: 'Home',
      description: 'Welcome to Pixel Wisdom - Digital portfolio and blog',
      url: '/',
      icon: FolderIcon
    },
    {
      type: 'page',
      id: 'about',
      title: 'About',
      description: 'Learn more about my background and expertise',
      url: '/about',
      icon: DocumentTextIcon
    },
    {
      type: 'page',
      id: 'projects',
      title: 'Projects',
      description: 'Browse my portfolio of projects and work',
      url: '/projects',
      icon: FolderIcon
    },
    {
      type: 'page',
      id: 'blog',
      title: 'Blog',
      description: 'Read my latest thoughts and technical articles',
      url: '/blog',
      icon: DocumentTextIcon
    },
    {
      type: 'page',
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch for collaborations and opportunities',
      url: '/contact',
      icon: DocumentTextIcon
    }
  ], [])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load posts on component mount
  useEffect(() => {
    if (!mounted) return

    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts()
        setPosts(fetchedPosts)
        
        // Convert posts to search results
        const postResults: SearchResult[] = fetchedPosts.map(post => ({
          type: 'post' as const,
          id: post.id,
          title: post.title,
          description: post.excerpt || post.content.substring(0, 150) + '...',
          url: `/blog/${post.slug}`,
          category: post.category,
          tags: post.tags,
          date: post.date,
          readTime: post.readTime,
          icon: DocumentTextIcon
        }))

        // Initialize fuzzy search with all searchable content
        const allResults = [...staticPages, ...postResults]
        fuzzySearchRef.current = new FuzzySearch(
          allResults,
          ['title', 'description', 'category'],
          {
            threshold: 0.1,
            includeScore: true,
            shouldSort: true
          }
        )
        
        // Show default results when no query
        if (!query.trim()) {
          setResults(allResults.slice(0, 8))
        }
      } catch (error) {
        console.error('Error loading posts:', error)
        // Fallback to static pages only
        setResults(staticPages)
        fuzzySearchRef.current = new FuzzySearch(
          staticPages,
          ['title', 'description'],
          {
            threshold: 0.1,
            includeScore: true,
            shouldSort: true
          }
        )
      }
    }

    loadPosts()
  }, [mounted, staticPages, query])

  // Handle search
  const performSearch = useCallback((searchQuery: string) => {
    if (!fuzzySearchRef.current) return

    setIsLoading(true)
    
    // Use requestAnimationFrame to avoid blocking UI
    requestAnimationFrame(() => {
      try {
        if (!searchQuery.trim()) {
          // Show default results when no query
          const allResults = [...staticPages, ...posts.map(post => ({
            type: 'post' as const,
            id: post.id,
            title: post.title,
            description: post.excerpt || post.content.substring(0, 150) + '...',
            url: `/blog/${post.slug}`,
            category: post.category,
            tags: post.tags,
            date: post.date,
            readTime: post.readTime,
            icon: DocumentTextIcon
          }))]
          setResults(allResults.slice(0, 8))
        } else {
          const fuzzyResults = fuzzySearchRef.current!.search(searchQuery)
          setResults(fuzzyResults.map(r => r.item).slice(0, 8))
        }
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    })
  }, [posts, staticPages])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 150)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
        return
      }

      // Only handle other keys when palette is open
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          break
          
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
          
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
          
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultSelect()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, mounted])

  // Handle result selection
  const handleResultSelect = () => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
    // Navigation will be handled by the Link component
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(0)
    }
  }

  // Loading indicator
  const LoadingDots = () => (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 bg-green-400 rounded-full"
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

  // Keyboard shortcut display
  const KeyboardShortcut = ({ keys }: { keys: string[] }) => (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-gray-500 text-xs">+</span>}
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-800 border border-gray-600 rounded text-gray-300">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  )

  // If we only want the trigger (for header), don't render the modal globally
  if (triggerOnly) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`group relative flex items-center space-x-3 px-4 py-2.5 
          border border-gray-600/40 hover:border-green-400/50 rounded-lg
          bg-gray-900/60 backdrop-blur-sm text-gray-400 hover:text-white
          transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open command palette (Ctrl+K or Cmd+K)"
        aria-keyshortcuts="Control+KeyK Meta+KeyK"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <MagnifyingGlassIcon className="h-4 w-4 relative z-10" />
        <span className="font-mono text-sm relative z-10">Search...</span>
        <div className="hidden md:block relative z-10">
          <KeyboardShortcut keys={['⌘', 'K']} />
        </div>
      </motion.button>
    )
  }

  // Don't render anything on server-side
  if (!mounted) return null

  return (
    <>
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4"
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Command Palette */}
            <motion.div
              ref={resultsRef}
              id="command-palette-results"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl border border-green-400/30 rounded-xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(74, 222, 128, 0.1)'
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              aria-describedby="command-palette-description"
            >
              {/* Header */}
              <div className="relative border-b border-gray-700/50 bg-gradient-to-r from-gray-900 to-gray-800">
                <h2 id="command-palette-title" className="sr-only">Search Command Palette</h2>
                <p id="command-palette-description" className="sr-only">
                  Search through posts, projects, and pages. Use arrow keys to navigate results, Enter to select, and Escape to close.
                </p>
                <div className="flex items-center px-4 py-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-green-400 mr-3" />
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts, projects, and pages..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none font-mono text-sm"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Search posts, projects, and pages"
                    aria-describedby="command-palette-description"
                    aria-expanded={results.length > 0}
                    aria-activedescendant={results.length > 0 ? `result-${selectedIndex}` : undefined}
                    aria-controls="command-palette-results"
                    role="combobox"
                  />

                  {isLoading && (
                    <div className="mr-3">
                      <LoadingDots />
                    </div>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 focus:ring-offset-gray-900"
                    aria-label="Close command palette"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Pixel line animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto" role="listbox" aria-labelledby="command-palette-title">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => {
                      const Icon = result.icon
                      const isSelected = index === selectedIndex
                      
                      return (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={() => handleResultSelect()}
                          className="block"
                        >
                          <motion.div
                            id={`result-${index}`}
                            className={`flex items-center px-4 py-3 transition-all duration-200 ${
                              isSelected 
                                ? 'bg-green-400/10 border-r-2 border-green-400' 
                                : 'hover:bg-gray-800/50'
                            }`}
                            whileHover={{ x: 4 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <Icon className={`h-5 w-5 mr-3 ${
                              isSelected ? 'text-green-400' : 'text-gray-400'
                            }`} />
                            
                            <div className="flex-1 min-w-0">
                              <div className={`font-mono text-sm truncate ${
                                isSelected ? 'text-white' : 'text-gray-200'
                              }`}>
                                {result.title}
                              </div>
                              <div className="text-xs text-gray-400 truncate mt-1">
                                {result.description}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-3">
                              {result.category && (
                                <span className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-300">
                                  {result.category}
                                </span>
                              )}
                              {result.readTime && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {result.readTime}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </Link>
                      )
                    })}
                  </div>
                ) : query.trim() ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-4xl mb-4 grayscale"
                    >
                      🔍
                    </motion.div>
                    <p className="text-gray-400 font-mono text-sm">
                      No results found for &quot;{query}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-4xl mb-4"
                    >
                      ⚡
                    </motion.div>
                    <p className="text-gray-400 font-mono text-sm">
                      Start typing to search...
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-700/50 bg-gray-800/50 px-4 py-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <KeyboardShortcut keys={['↑', '↓']} />
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <KeyboardShortcut keys={['↵']} />
                      <span>Select</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <KeyboardShortcut keys={['ESC']} />
                      <span>Close</span>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-green-400 font-mono"
                  >
                    PIXEL SEARCH
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  )
} 