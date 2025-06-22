/**
 * Simple fuzzy search implementation
 * Provides basic fuzzy matching without external dependencies
 */

export interface FuzzySearchOptions {
  threshold?: number // Minimum similarity score (0-1)
  caseSensitive?: boolean
  includeScore?: boolean
  shouldSort?: boolean
  minMatchCharLength?: number
  maxPatternLength?: number
}

export interface FuzzySearchResult<T> {
  item: T
  score: number
  matches?: Array<{
    indices: [number, number][]
    value: string
    key?: string
  }>
}

export class FuzzySearch<T> {
  private options: Required<FuzzySearchOptions>
  private keys: string[] = []

  constructor(
    private items: T[],
    keys: string | string[] = [],
    options: FuzzySearchOptions = {}
  ) {
    this.options = {
      threshold: options.threshold ?? 0.3,
      caseSensitive: options.caseSensitive ?? false,
      includeScore: options.includeScore ?? false,
      shouldSort: options.shouldSort ?? true,
      minMatchCharLength: options.minMatchCharLength ?? 1,
      maxPatternLength: options.maxPatternLength ?? 32
    }
    
    this.keys = Array.isArray(keys) ? keys : [keys]
  }

  /**
   * Calculate similarity score between two strings using Levenshtein distance
   */
  private calculateScore(pattern: string, text: string): number {
    if (!pattern || !text) return 0
    
    const patternLength = pattern.length
    const textLength = text.length
    
    if (patternLength === 0) return textLength === 0 ? 1 : 0
    if (textLength === 0) return 0
    
    // Use a simpler scoring algorithm for performance
    let score = 0
    let patternIndex = 0
    
    for (let i = 0; i < textLength && patternIndex < patternLength; i++) {
      if (text[i] === pattern[patternIndex]) {
        score++
        patternIndex++
      }
    }
    
    // Normalize score
    const normalizedScore = score / Math.max(patternLength, textLength)
    
    // Bonus for exact substring matches
    if (text.includes(pattern)) {
      return Math.min(1, normalizedScore + 0.3)
    }
    
    // Bonus for word boundary matches
    const words = text.split(/\s+/)
    const hasWordMatch = words.some(word => 
      word.toLowerCase().startsWith(pattern.toLowerCase())
    )
    
    if (hasWordMatch) {
      return Math.min(1, normalizedScore + 0.2)
    }
    
    return normalizedScore
  }

  /**
   * Find matches for a pattern in text
   */
  private findMatches(pattern: string, text: string): Array<[number, number]> {
    const matches: Array<[number, number]> = []
    
    if (!pattern || !text) return matches
    
    const searchPattern = this.options.caseSensitive ? pattern : pattern.toLowerCase()
    const searchText = this.options.caseSensitive ? text : text.toLowerCase()
    
    let index = 0
    while (index < searchText.length) {
      const foundIndex = searchText.indexOf(searchPattern, index)
      if (foundIndex === -1) break
      
      matches.push([foundIndex, foundIndex + searchPattern.length - 1])
      index = foundIndex + 1
    }
    
    return matches
  }

  /**
   * Get searchable text from an item
   */
  private getSearchableText(item: T, key?: string): string {
    if (key) {
      const value = (item as any)[key]
      return typeof value === 'string' ? value : String(value || '')
    }
    
    if (typeof item === 'string') {
      return item
    }
    
    // Try common text fields
    const textFields = ['title', 'content', 'description', 'name', 'text']
    for (const field of textFields) {
      if ((item as any)[field]) {
        return String((item as any)[field])
      }
    }
    
    return String(item)
  }

  /**
   * Search for items matching the pattern
   */
  search(pattern: string): FuzzySearchResult<T>[] {
    if (!pattern || pattern.length < this.options.minMatchCharLength) {
      return this.items.map(item => ({ item, score: 0 }))
    }
    
    if (pattern.length > this.options.maxPatternLength) {
      pattern = pattern.substring(0, this.options.maxPatternLength)
    }
    
    const results: FuzzySearchResult<T>[] = []
    
    for (const item of this.items) {
      let bestScore = 0
      let bestMatches: Array<{ indices: [number, number][], value: string, key?: string }> = []
      
      if (this.keys.length === 0) {
        // Search in the item directly
        const text = this.getSearchableText(item)
        const score = this.calculateScore(pattern, text)
        
        if (score >= this.options.threshold) {
          bestScore = score
          if (this.options.includeScore) {
            bestMatches = [{
              indices: this.findMatches(pattern, text),
              value: text
            }]
          }
        }
      } else {
        // Search in specified keys
        for (const key of this.keys) {
          const text = this.getSearchableText(item, key)
          const score = this.calculateScore(pattern, text)
          
          if (score > bestScore) {
            bestScore = score
            if (this.options.includeScore) {
              bestMatches = [{
                indices: this.findMatches(pattern, text),
                value: text,
                key
              }]
            }
          }
        }
      }
      
      if (bestScore >= this.options.threshold) {
        const result: FuzzySearchResult<T> = {
          item,
          score: bestScore
        }
        
        if (this.options.includeScore && bestMatches.length > 0) {
          result.matches = bestMatches
        }
        
        results.push(result)
      }
    }
    
    // Sort by score if requested
    if (this.options.shouldSort) {
      results.sort((a, b) => b.score - a.score)
    }
    
    return results
  }

  /**
   * Update the search index with new items
   */
  setCollection(items: T[]): void {
    this.items = items
  }

  /**
   * Add items to the search index
   */
  add(item: T): void {
    this.items.push(item)
  }

  /**
   * Remove items from the search index
   */
  remove(predicate: (item: T) => boolean): void {
    this.items = this.items.filter(item => !predicate(item))
  }
}

/**
 * Simple fuzzy search function for one-time searches
 */
export function fuzzySearch<T>(
  items: T[],
  pattern: string,
  keys?: string | string[],
  options?: FuzzySearchOptions
): FuzzySearchResult<T>[] {
  const fuzzy = new FuzzySearch(items, keys || [], options)
  return fuzzy.search(pattern)
}

/**
 * Highlight matches in text
 */
export function highlightMatches(
  text: string,
  matches: Array<[number, number]>,
  highlightClass = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!matches || matches.length === 0) return text
  
  let result = ''
  let lastIndex = 0
  
  for (const [start, end] of matches) {
    // Add text before match
    result += text.slice(lastIndex, start)
    
    // Add highlighted match
    result += `<mark class="${highlightClass}">${text.slice(start, end + 1)}</mark>`
    
    lastIndex = end + 1
  }
  
  // Add remaining text
  result += text.slice(lastIndex)
  
  return result
}

/**
 * Extract search keywords from a query string
 */
export function extractKeywords(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(keyword => keyword.length > 0)
    .map(keyword => keyword.toLowerCase())
}

/**
 * Simple search suggestion generator
 */
export function generateSuggestions(
  query: string,
  items: any[],
  maxSuggestions = 5
): string[] {
  if (!query.trim()) return []
  
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()
  
  // Collect potential suggestions from common fields
  for (const item of items) {
    const fields = ['title', 'category', 'tags', 'description', 'content']
    
    for (const field of fields) {
      const value = item[field]
      
      if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
        // Add words that start with the query
        const words = value.split(/\s+/)
        for (const word of words) {
          if (word.toLowerCase().startsWith(queryLower) && word.length > query.length) {
            suggestions.add(word.toLowerCase())
          }
        }
      }
      
      if (Array.isArray(value)) {
        for (const tag of value) {
          if (typeof tag === 'string' && tag.toLowerCase().includes(queryLower)) {
            suggestions.add(tag.toLowerCase())
          }
        }
      }
    }
    
    if (suggestions.size >= maxSuggestions) break
  }
  
  return Array.from(suggestions).slice(0, maxSuggestions)
}