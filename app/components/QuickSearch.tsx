'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { MagnifyingGlassIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/app/hooks/useSearch'

interface QuickSearchProps {
  className?: string
}

export default function QuickSearch({ className = "" }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [lastTyped, setLastTyped] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
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
          relative flex items-center space-x-2 px-3 py-2 pixel-border bg-gray-900/60 
          backdrop-blur-sm text-gray-400 hover:text-white hover:border-green-400/60
          transition-all duration-300 group w-full md:w-64 overflow-hidden
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
        
        <span className="font-mono text-sm flex-1 text-left relative z-10">
          {isOpen ? "Searching..." : "Search..."}
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
            {/* Enhanced Search Panel (portal) */}
            {createPortal(
              <motion.div 
                className="fixed top-16 left-4 right-4 z-50 md:static md:inset-auto md:mt-2 md:left-auto md:right-0 md:z-50 pixel-border bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-hidden"
                initial={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.95,
                  filter: "blur(4px)"
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
                  filter: "blur(4px)"
                }}
                transition={{ 
                  duration: 0.3, 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
              >
                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 border border-green-400/30"
                  initial={{ borderColor: "rgba(74, 222, 128, 0)" }}
                  animate={{ borderColor: "rgba(74, 222, 128, 0.3)" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                
                {/* Search Input with enhanced animations */}
                <div className="p-4 border-b border-gray-700 relative">
                  {/* Focus glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-green-400/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="flex items-center space-x-2 relative z-10">
                    <motion.div
                      animate={{ 
                        scale: isFocused ? 1.1 : 1,
                        color: isFocused ? "#22c55e" : "#4ade80"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </motion.div>
                    
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search posts and projects..."
                        className="
                          w-full bg-transparent text-white placeholder-gray-300 
                          focus:outline-none font-mono text-sm relative z-10
                        "
                        autoComplete="off"
                      />
                      
                      {/* Typing indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            className="absolute right-0 top-1/2 transform -translate-y-1/2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center space-x-1">
                              <div className="text-xs text-green-400 font-mono">typing</div>
                              <PixelLoader />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Enhanced loading state */}
                    <AnimatePresence>
                      {searchInstance.isLoading && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <PixelLoader />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Focus line animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? "100%" : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>

                {/* Enhanced Results with animations */}
                <div className="max-h-96 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {query.trim() && filteredResults.length > 0 ? (
                      <motion.div 
                        className="p-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {filteredResults.map((item, index) => {
                          const href = item.type === 'post' ? `/blog/${'slug' in item ? item.slug : ''}` : `/projects/${item.id}`
                          return (
                            <motion.div
                              key={`${item.type}-${item.id || ('slug' in item ? item.slug : '')}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.3, 
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                              }}
                              whileHover={{ 
                                x: 4,
                                transition: { duration: 0.2 }
                              }}
                            >
                              <Link
                                href={href}
                                onClick={handleResultClick}
                                className="
                                  block p-3 hover:bg-gray-800/50 transition-all duration-300
                                  border-l-2 border-transparent hover:border-green-400
                                  hover:shadow-lg hover:shadow-green-400/10 rounded-r-md
                                  group relative overflow-hidden
                                "
                              >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="flex items-start space-x-3 relative z-10">
                                  <motion.div 
                                    className={`
                                      flex-shrink-0 w-2 h-2 rounded-full mt-2
                                      ${item.type === 'post' ? 'bg-blue-400' : 'bg-purple-400'}
                                    `}
                                    whileHover={{ scale: 1.5 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-mono text-sm text-white truncate group-hover:text-green-300 transition-colors duration-200">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                                      {('content' in item ? item.content : 'description' in item ? item.description : '')?.slice(0, 100)}...
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className={`
                                        text-xs font-mono px-1 py-0.5 rounded
                                        ${item.type === 'post' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}
                                      `}>
                                        {item.type.toUpperCase()}
                                      </span>
                                      {'category' in item && item.category && (
                                        <span className="text-xs text-gray-500 font-mono">
                                          {item.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
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
                      </motion.div>
                    ) : query.trim() ? (
                      <motion.div 
                        className="p-4 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <div className="text-4xl mb-2">🔍</div>
                          <p className="text-gray-300 font-mono text-sm">
                            No results found for "{query}"
                          </p>
                          <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={handleResultClick}
                            className="
                              text-green-400 hover:text-green-300 transition-colors 
                              duration-200 font-mono text-xs mt-2 inline-block hover:underline
                            "
                          >
                            Try advanced search →
                          </Link>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center mb-4">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-2xl mb-2">⚡</div>
                            <p className="text-gray-300 font-mono text-xs mb-2">
                              Quick Actions
                            </p>
                          </motion.div>
                        </div>
                        
                        <div className="space-y-1">
                          {[
                            { href: "/search", label: "Advanced Search", icon: "🔍" },
                            { href: "/blog", label: "Browse Posts", icon: "📚" },
                            { href: "/projects", label: "View Projects", icon: "🛠️" }
                          ].map((item, index) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={handleResultClick}
                                className="
                                  flex items-center space-x-2 p-2 text-sm text-gray-300 hover:text-white 
                                  hover:bg-gray-800/50 transition-all duration-200 font-mono rounded
                                  hover:translate-x-1 group
                                "
                              >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                  {item.icon}
                                </span>
                                <span>{item.label}</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  →
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>,
              document.body
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}