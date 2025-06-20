// CMS Utility Functions

// Markdown parsing utilities
export const parseMarkdown = (content: string): string => {
  let html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-pixel text-green-400 mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-pixel text-green-400 mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-pixel text-green-400 mb-4 mt-8">$1</h1>')
    
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-green-300">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-green-200">$1</em>')
    
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="pixel-border bg-gray-800/80 p-4 rounded overflow-x-auto mb-4"><code class="font-mono text-green-300 text-sm">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="pixel-border bg-gray-800/60 px-2 py-1 rounded font-mono text-green-300 text-sm">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-400 hover:text-green-300 underline pixel-glow" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Lists
    .replace(/^\* (.+)$/gim, '<li class="text-gray-300 mb-1">$1</li>')
    .replace(/^\d+\. (.+)$/gim, '<li class="text-gray-300 mb-1">$1</li>')
    
    // Blockquotes
    .replace(/^> (.+)$/gim, '<blockquote class="pixel-border border-l-4 border-green-400 pl-4 py-2 bg-gray-800/40 italic text-gray-300 mb-4">$1</blockquote>')
    
    // Line breaks
    .replace(/\n/g, '<br>')

  // Wrap lists
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
    return `<ul class="list-disc list-inside space-y-1 mb-4 text-gray-300">${match}</ul>`
  })

  return html
}

// Reading time calculation
export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// URL slug generation
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Image optimization (basic implementation)
export const optimizeImage = async (file: File, maxWidth: number = 1920, quality: number = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(optimizedFile)
        } else {
          resolve(file)
        }
      }, 'image/jpeg', quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

// Keyword extraction
export const extractKeywords = (content: string, topN: number = 10): string[] => {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
    'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 
    'after', 'above', 'below', 'between', 'among'
  ])

  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))

  const wordCounts = new Map<string, number>()
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
  })

  return Array.from(wordCounts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word)
}

// SEO score calculation
export const calculateSEOScore = (
  title: string,
  description: string,
  content: string,
  slug: string,
  keyword?: string
): number => {
  let score = 100

  // Title checks
  if (!title || title.length < 30 || title.length > 60) score -= 15
  if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) score -= 10

  // Description checks
  if (!description || description.length < 120 || description.length > 160) score -= 15
  if (keyword && !description.toLowerCase().includes(keyword.toLowerCase())) score -= 5

  // Content checks
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 300) score -= 20

  if (keyword) {
    const keywordDensity = calculateKeywordDensity(content, keyword)
    if (keywordDensity === 0) score -= 20
    else if (keywordDensity > 3) score -= 10
  }

  // Slug checks
  if (!slug || slug.length > 60) score -= 5
  if (keyword && !slug.includes(keyword.toLowerCase().replace(/\s+/g, '-'))) score -= 5

  return Math.max(0, Math.min(100, score))
}

// Helper function for keyword density
const calculateKeywordDensity = (content: string, keyword: string): number => {
  const words = content.toLowerCase().split(/\s+/)
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length
  return (keywordCount / words.length) * 100
}

// Text analysis utilities
export const analyzeReadability = (content: string) => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0
  const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0

  // Flesch Reading Ease Score
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  
  let grade = 'Unknown'
  if (fleschScore >= 90) grade = 'Very Easy'
  else if (fleschScore >= 80) grade = 'Easy'
  else if (fleschScore >= 70) grade = 'Fairly Easy'
  else if (fleschScore >= 60) grade = 'Standard'
  else if (fleschScore >= 50) grade = 'Fairly Difficult'
  else if (fleschScore >= 30) grade = 'Difficult'
  else grade = 'Very Difficult'

  return {
    score: Math.max(0, Math.min(100, fleschScore)),
    grade,
    avgSentenceLength,
    avgSyllablesPerWord
  }
}

// Syllable counting helper
const countSyllables = (word: string): number => {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  const vowels = 'aeiouy'
  let count = 0
  let previousWasVowel = false

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !previousWasVowel) {
      count++
    }
    previousWasVowel = isVowel
  }

  if (word.endsWith('e')) count--
  return Math.max(1, count)
}

// Text formatting utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength - 3) + '...'
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100
}

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Local storage utilities
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return defaultValue
  }
}