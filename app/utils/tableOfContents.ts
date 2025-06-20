export interface TocItem {
  id: string
  title: string
  level: number
  children?: TocItem[]
}

export interface TocOptions {
  includeLevel?: number[]
  maxDepth?: number
  generateIds?: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function extractTableOfContents(
  markdown: string, 
  options: TocOptions = {}
): TocItem[] {
  const {
    includeLevel = [2, 3, 4],
    maxDepth = 3,
    generateIds = true
  } = options

  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: TocItem[] = []
  const usedIds = new Set<string>()
  
  let match
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    
    if (!includeLevel.includes(level) || level > maxDepth + 1) {
      continue
    }
    
    const title = match[2].trim()
    let id = generateIds ? slugify(title) : ''
    
    // Ensure unique IDs
    if (generateIds && usedIds.has(id)) {
      let counter = 1
      let uniqueId = `${id}-${counter}`
      while (usedIds.has(uniqueId)) {
        counter++
        uniqueId = `${id}-${counter}`
      }
      id = uniqueId
    }
    
    if (generateIds) {
      usedIds.add(id)
    }
    
    headings.push({
      id,
      title,
      level,
    })
  }
  
  return buildHierarchy(headings)
}

function buildHierarchy(headings: TocItem[]): TocItem[] {
  const result: TocItem[] = []
  const stack: TocItem[] = []
  
  for (const heading of headings) {
    // Remove items from stack that are at same or deeper level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // Top level item
      result.push(heading)
    } else {
      // Nested item
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(heading)
    }
    
    stack.push(heading)
  }
  
  return result
}

export function injectTableOfContentsIds(markdown: string): string {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const usedIds = new Set<string>()
  
  return markdown.replace(headingRegex, (match, hashes, title) => {
    const level = hashes.length
    
    // Only add IDs to H2-H4 headings
    if (level < 2 || level > 4) {
      return match
    }
    
    let id = slugify(title.trim())
    
    // Ensure unique IDs
    if (usedIds.has(id)) {
      let counter = 1
      let uniqueId = `${id}-${counter}`
      while (usedIds.has(uniqueId)) {
        counter++
        uniqueId = `${id}-${counter}`
      }
      id = uniqueId
    }
    
    usedIds.add(id)
    
    return `${hashes} ${title.trim()} {#${id}}`
  })
}

export function generateTocMarkdown(toc: TocItem[], currentDepth = 0): string {
  let markdown = ''
  
  for (const item of toc) {
    const indent = '  '.repeat(currentDepth)
    markdown += `${indent}- [${item.title}](#${item.id})\n`
    
    if (item.children && item.children.length > 0) {
      markdown += generateTocMarkdown(item.children, currentDepth + 1)
    }
  }
  
  return markdown
}

export function getHeadingElements(container?: HTMLElement): HTMLElement[] {
  const root = container || document
  return Array.from(root.querySelectorAll('h2, h3, h4')).filter(
    (heading): heading is HTMLElement => heading instanceof HTMLElement && Boolean(heading.id)
  )
}

export function getCurrentActiveHeading(headings: HTMLElement[]): string | null {
  const scrollPosition = window.scrollY + 100 // Offset for better UX
  
  let activeId: string | null = null
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect()
    const absoluteTop = rect.top + window.scrollY
    
    if (absoluteTop <= scrollPosition) {
      activeId = heading.id
    } else {
      break
    }
  }
  
  return activeId
}

export function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth'): void {
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -80 // Account for fixed header
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    
    window.scrollTo({ top: y, behavior })
  }
}