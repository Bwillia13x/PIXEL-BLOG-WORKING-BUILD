export interface ReadingTimeResult {
  text: string
  minutes: number
  time: number
  words: number
}

export interface ReadingTimeOptions {
  wordsPerMinute?: number
  includeImages?: boolean
  imageReadingTime?: number // seconds per image
  includeTables?: boolean
  tableReadingTime?: number // seconds per table
  includeCodeBlocks?: boolean
  codeBlockMultiplier?: number // multiplier for code blocks
}

const DEFAULT_OPTIONS: Required<ReadingTimeOptions> = {
  wordsPerMinute: 200, // Average adult reading speed
  includeImages: true,
  imageReadingTime: 12, // 12 seconds per image
  includeTables: true,
  tableReadingTime: 30, // 30 seconds per table
  includeCodeBlocks: true,
  codeBlockMultiplier: 1.5, // Code takes longer to read
}

function stripMarkdown(markdown: string): string {
  return markdown
    // Remove code blocks first (to avoid processing their content)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove emphasis
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+/gm, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function countWords(text: string): number {
  if (!text || text.length === 0) {
    return 0
  }
  
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length
}

function countImages(markdown: string): number {
  const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g
  return (markdown.match(imageRegex) || []).length
}

function countTables(markdown: string): number {
  // Count table headers (lines with |)
  const tableLines = markdown.split('\n').filter(line => 
    line.trim().includes('|') && line.trim().length > 0
  )
  
  // Estimate number of tables (rough heuristic)
  let tableCount = 0
  let inTable = false
  
  for (const line of tableLines) {
    const isTableSeparator = /^\s*\|?\s*:?-+:?\s*\|/.test(line)
    const hasMultiplePipes = (line.match(/\|/g) || []).length >= 2
    
    if (hasMultiplePipes && !inTable) {
      tableCount++
      inTable = true
    } else if (!hasMultiplePipes && inTable) {
      inTable = false
    }
  }
  
  return tableCount
}

function countCodeBlocks(markdown: string): number {
  const codeBlockRegex = /```[\s\S]*?```/g
  const inlineCodeRegex = /`[^`]+`/g
  
  const codeBlocks = (markdown.match(codeBlockRegex) || []).length
  const inlineCode = (markdown.match(inlineCodeRegex) || []).length
  
  // Weight inline code less than code blocks
  return codeBlocks + (inlineCode * 0.1)
}

function getCodeBlockWords(markdown: string): number {
  const codeBlockRegex = /```[\s\S]*?```/g
  const codeBlocks = markdown.match(codeBlockRegex) || []
  
  let totalWords = 0
  for (const block of codeBlocks) {
    // Remove the ``` markers and language identifier
    const codeContent = block
      .replace(/^```\w*\n?/, '')
      .replace(/```$/, '')
      .trim()
    
    totalWords += countWords(codeContent)
  }
  
  return totalWords
}

export function calculateReadingTime(
  markdown: string, 
  options: ReadingTimeOptions = {}
): ReadingTimeResult {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  if (!markdown || markdown.length === 0) {
    return {
      text: '0 min read',
      minutes: 0,
      time: 0,
      words: 0
    }
  }
  
  // Get base word count from stripped markdown
  const strippedText = stripMarkdown(markdown)
  const baseWords = countWords(strippedText)
  
  // Calculate additional time for special elements
  let additionalSeconds = 0
  
  if (opts.includeImages) {
    const imageCount = countImages(markdown)
    additionalSeconds += imageCount * opts.imageReadingTime
  }
  
  if (opts.includeTables) {
    const tableCount = countTables(markdown)
    additionalSeconds += tableCount * opts.tableReadingTime
  }
  
  if (opts.includeCodeBlocks) {
    const codeBlockWords = getCodeBlockWords(markdown)
    const codeBlockTime = (codeBlockWords * opts.codeBlockMultiplier * 60) / opts.wordsPerMinute
    additionalSeconds += codeBlockTime
  }
  
  // Calculate base reading time
  const baseMinutes = baseWords / opts.wordsPerMinute
  const totalMinutes = baseMinutes + (additionalSeconds / 60)
  
  // Round to nearest minute, minimum 1 minute
  const roundedMinutes = Math.max(1, Math.round(totalMinutes))
  
  return {
    text: `${roundedMinutes} min read`,
    minutes: roundedMinutes,
    time: Math.round(totalMinutes * 60), // Total time in seconds
    words: baseWords
  }
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min read'
  } else if (minutes === 1) {
    return '1 min read'
  } else {
    return `${minutes} min read`
  }
}

export function getReadingProgress(
  scrollPosition: number,
  contentHeight: number,
  windowHeight: number
): number {
  const maxScroll = contentHeight - windowHeight
  if (maxScroll <= 0) return 100
  
  const progress = (scrollPosition / maxScroll) * 100
  return Math.min(100, Math.max(0, progress))
}

export function estimateTimeRemaining(
  totalMinutes: number,
  progressPercentage: number
): string {
  if (progressPercentage >= 100) {
    return 'Completed'
  }
  
  const remainingPercentage = 100 - progressPercentage
  const remainingMinutes = Math.ceil((totalMinutes * remainingPercentage) / 100)
  
  if (remainingMinutes < 1) {
    return '< 1 min left'
  } else if (remainingMinutes === 1) {
    return '1 min left'
  } else {
    return `${remainingMinutes} min left`
  }
}