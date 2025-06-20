'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../Providers'

interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  count: number
  category?: string
  aliases?: string[]
  relatedTags?: string[]
  createdAt: Date
  updatedAt: Date
}

interface TagManagerProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  suggestions?: Tag[]
  maxTags?: number
  allowNewTags?: boolean
  className?: string
  placeholder?: string
}

interface TagSuggestion {
  tag: Tag
  score: number
  reason: 'exact' | 'partial' | 'alias' | 'related' | 'category' | 'popular'
}

// Predefined pixel-themed tag categories and colors
const TAG_CATEGORIES = {
  technology: { color: '#10b981', icon: '💻' },
  finance: { color: '#3b82f6', icon: '💰' },
  ai: { color: '#8b5cf6', icon: '🤖' },
  education: { color: '#f59e0b', icon: '📚' },
  policy: { color: '#ef4444', icon: '⚖️' },
  development: { color: '#06b6d4', icon: '🔧' },
  analysis: { color: '#ec4899', icon: '📊' },
  tutorial: { color: '#84cc16', icon: '🎓' }
}

// Default popular tags with categories
const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'JavaScript', slug: 'javascript', category: 'technology', count: 45, createdAt: new Date(), updatedAt: new Date(), aliases: ['js', 'node'], relatedTags: ['react', 'typescript'] },
  { id: '2', name: 'React', slug: 'react', category: 'technology', count: 38, createdAt: new Date(), updatedAt: new Date(), aliases: ['reactjs'], relatedTags: ['javascript', 'frontend'] },
  { id: '3', name: 'TypeScript', slug: 'typescript', category: 'technology', count: 32, createdAt: new Date(), updatedAt: new Date(), aliases: ['ts'], relatedTags: ['javascript'] },
  { id: '4', name: 'Investing', slug: 'investing', category: 'finance', count: 28, createdAt: new Date(), updatedAt: new Date(), aliases: ['investment'], relatedTags: ['finance', 'portfolio'] },
  { id: '5', name: 'Machine Learning', slug: 'machine-learning', category: 'ai', count: 25, createdAt: new Date(), updatedAt: new Date(), aliases: ['ml', 'ai'], relatedTags: ['python', 'data-science'] },
  { id: '6', name: 'Portfolio', slug: 'portfolio', category: 'finance', count: 22, createdAt: new Date(), updatedAt: new Date(), relatedTags: ['investing', 'analysis'] },
  { id: '7', name: 'Tutorial', slug: 'tutorial', category: 'education', count: 35, createdAt: new Date(), updatedAt: new Date(), aliases: ['guide', 'how-to'] },
  { id: '8', name: 'Analysis', slug: 'analysis', category: 'analysis', count: 30, createdAt: new Date(), updatedAt: new Date(), relatedTags: ['data', 'research'] },
  { id: '9', name: 'Frontend', slug: 'frontend', category: 'development', count: 20, createdAt: new Date(), updatedAt: new Date(), aliases: ['front-end'], relatedTags: ['react', 'css'] },
  { id: '10', name: 'API', slug: 'api', category: 'development', count: 18, createdAt: new Date(), updatedAt: new Date(), aliases: ['rest', 'graphql'], relatedTags: ['backend', 'development'] }
]

export default function TagManager({
  selectedTags,
  onTagsChange,
  suggestions = DEFAULT_TAGS,
  maxTags = 10,
  allowNewTags = true,
  className = '',
  placeholder = 'Add tags...'
}: TagManagerProps) {
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<TagSuggestion[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [tags, setTags] = useState<Tag[]>(suggestions)

  // Search and filter logic
  const searchTags = useCallback((query: string): TagSuggestion[] => {
    if (!query.trim()) {
      return tags
        .filter(tag => !selectedTags.includes(tag.slug))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(tag => ({ tag, score: tag.count, reason: 'popular' as const }))
    }

    const queryLower = query.toLowerCase()
    const results: TagSuggestion[] = []

    tags.forEach(tag => {
      if (selectedTags.includes(tag.slug)) return

      let score = 0
      let reason: TagSuggestion['reason'] = 'partial'

      // Exact match
      if (tag.name.toLowerCase() === queryLower) {
        score = 1000 + tag.count
        reason = 'exact'
      }
      // Starts with query
      else if (tag.name.toLowerCase().startsWith(queryLower)) {
        score = 800 + tag.count
        reason = 'partial'
      }
      // Contains query
      else if (tag.name.toLowerCase().includes(queryLower)) {
        score = 600 + tag.count
        reason = 'partial'
      }
      // Alias match
      else if (tag.aliases?.some(alias => alias.toLowerCase().includes(queryLower))) {
        score = 700 + tag.count
        reason = 'alias'
      }
      // Related tags match
      else if (tag.relatedTags?.some(relatedTag => relatedTag.toLowerCase().includes(queryLower))) {
        score = 400 + tag.count
        reason = 'related'
      }
      // Category match
      else if (tag.category?.toLowerCase().includes(queryLower)) {
        score = 300 + tag.count
        reason = 'category'
      }

      if (score > 0) {
        results.push({ tag, score, reason })
      }
    })

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score)

    // Add option to create new tag if allowed
    if (allowNewTags && queryLower.length >= 2) {
      const exactMatch = results.find(r => r.tag.name.toLowerCase() === queryLower)
      if (!exactMatch) {
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          name: query.trim(),
          slug: query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          count: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        results.unshift({ tag: newTag, score: 999, reason: 'exact' })
      }
    }

    return results.slice(0, 8)
  }, [tags, selectedTags, allowNewTags])

  // Update suggestions when input changes
  useEffect(() => {
    const suggestions = searchTags(inputValue)
    setFilteredSuggestions(suggestions)
    setHighlightedIndex(-1)
  }, [inputValue, searchTags])

  // Handle tag selection
  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.length >= maxTags) return
    if (selectedTags.includes(tag.slug)) return

    // Add to existing tags if it's a new tag
    if (tag.id.startsWith('new-')) {
      const newTag = { ...tag, id: Date.now().toString() }
      setTags(prev => [...prev, newTag])
    }

    const newSelectedTags = [...selectedTags, tag.slug]
    onTagsChange(newSelectedTags)
    setInputValue('')
    setIsOpen(false)
  }

  // Handle tag removal
  const handleTagRemove = (tagSlug: string) => {
    const newSelectedTags = selectedTags.filter(slug => slug !== tagSlug)
    onTagsChange(newSelectedTags)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
        return
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          handleTagSelect(filteredSuggestions[highlightedIndex].tag)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'Backspace':
        if (!inputValue && selectedTags.length > 0) {
          handleTagRemove(selectedTags[selectedTags.length - 1])
        }
        break
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getTagBySlug = (slug: string) => tags.find(tag => tag.slug === slug)
  const getTagColor = (tag: Tag) => {
    if (tag.color) return tag.color
    if (tag.category && TAG_CATEGORIES[tag.category as keyof typeof TAG_CATEGORIES]) {
      return TAG_CATEGORIES[tag.category as keyof typeof TAG_CATEGORIES].color
    }
    return '#10b981'
  }

  const getReasonIcon = (reason: TagSuggestion['reason']) => {
    switch (reason) {
      case 'exact': return '🎯'
      case 'partial': return '🔍'
      case 'alias': return '🏷️'
      case 'related': return '🔗'
      case 'category': return '📁'
      case 'popular': return '⭐'
      default: return '🏷️'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map(tagSlug => {
          const tag = getTagBySlug(tagSlug)
          if (!tag) return null

          return (
            <div
              key={tagSlug}
              className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-mono pixel-border"
              style={{ 
                backgroundColor: `${getTagColor(tag)}20`,
                borderColor: `${getTagColor(tag)}60`,
                color: getTagColor(tag)
              }}
            >
              {tag.category && TAG_CATEGORIES[tag.category as keyof typeof TAG_CATEGORIES] && (
                <span className="text-xs">
                  {TAG_CATEGORIES[tag.category as keyof typeof TAG_CATEGORIES].icon}
                </span>
              )}
              <span>{tag.name}</span>
              <button
                onClick={() => handleTagRemove(tagSlug)}
                className="ml-1 text-current hover:text-red-400 text-xs font-bold"
                title="Remove tag"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedTags.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder}
          disabled={selectedTags.length >= maxTags}
          className={`
            w-full px-4 py-2 bg-gray-800/60 border rounded-lg font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400
            ${selectedTags.length >= maxTags 
              ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
              : 'border-green-400/30 text-green-400 placeholder-gray-500'
            }
          `}
        />

        {/* Dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.tag.id}
                className={`
                  px-4 py-2 cursor-pointer flex items-center justify-between
                  ${index === highlightedIndex 
                    ? 'bg-green-400/20 text-green-300' 
                    : 'text-gray-300 hover:bg-gray-800/60'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}
                `}
                onClick={() => handleTagSelect(suggestion.tag)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs">{getReasonIcon(suggestion.reason)}</span>
                  <div>
                    <div className="font-mono text-sm">{suggestion.tag.name}</div>
                    {suggestion.tag.count > 0 && (
                      <div className="text-xs text-gray-500">
                        {suggestion.tag.count} posts
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {suggestion.tag.category && TAG_CATEGORIES[suggestion.tag.category as keyof typeof TAG_CATEGORIES] && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-mono"
                      style={{ 
                        backgroundColor: `${TAG_CATEGORIES[suggestion.tag.category as keyof typeof TAG_CATEGORIES].color}20`,
                        color: TAG_CATEGORIES[suggestion.tag.category as keyof typeof TAG_CATEGORIES].color
                      }}
                    >
                      {suggestion.tag.category}
                    </span>
                  )}
                  {suggestion.tag.id.startsWith('new-') && (
                    <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded text-xs font-mono">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tag Suggestions Footer */}
      {isOpen && inputValue && (
        <div className="mt-2 text-xs font-mono text-gray-500 flex items-center space-x-4">
          <span>↑↓ navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
          {allowNewTags && (
            <span>Type to create new tags</span>
          )}
        </div>
      )}

      {/* Tag Stats */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-500">
        <span>{selectedTags.length}/{maxTags} tags</span>
        {selectedTags.length > 0 && (
          <button
            onClick={() => onTagsChange([])}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}