'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTheme } from '../Providers'

interface ReadmeSection {
  id: string
  title: string
  content: string
  level: number // 1-6 for h1-h6
  type: 'text' | 'code' | 'image' | 'link' | 'list' | 'table' | 'quote'
  language?: string // for code blocks
  metadata?: {
    badges?: Badge[]
    toc?: TableOfContentsItem[]
    images?: ImageItem[]
    links?: LinkItem[]
  }
}

interface Badge {
  name: string
  url: string
  image: string
  category: 'build' | 'coverage' | 'version' | 'license' | 'downloads' | 'stars' | 'other'
}

interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children: TableOfContentsItem[]
}

interface ImageItem {
  src: string
  alt: string
  title?: string
  caption?: string
}

interface LinkItem {
  text: string
  url: string
  type: 'internal' | 'external' | 'anchor'
}

interface RepositoryInfo {
  owner: string
  repo: string
  branch?: string
  path?: string
  accessToken?: string
}

interface AutomatedReadmeParserProps {
  repository: RepositoryInfo
  onSectionSelect?: (section: ReadmeSection) => void
  onError?: (error: string) => void
  showTableOfContents?: boolean
  showBadges?: boolean
  showImages?: boolean
  enableSyntaxHighlighting?: boolean
  autoGenerateTOC?: boolean
  maxCacheAge?: number // in minutes
  className?: string
}

interface ParsedReadme {
  content: string
  sections: ReadmeSection[]
  metadata: {
    title?: string
    description?: string
    badges: Badge[]
    tableOfContents: TableOfContentsItem[]
    images: ImageItem[]
    links: LinkItem[]
    lastModified: Date
    size: number
    encoding: string
  }
}

export default function AutomatedReadmeParser({
  repository,
  onSectionSelect,
  onError,
  showTableOfContents = true,
  showBadges = true,
  showImages = true,
  enableSyntaxHighlighting = true,
  autoGenerateTOC = true,
  maxCacheAge = 30,
  className = ''
}: AutomatedReadmeParserProps) {
  const { theme } = useTheme()
  
  const [parsedReadme, setParsedReadme] = useState<ParsedReadme | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'formatted' | 'raw' | 'split'>('formatted')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Cache key for storing parsed README
  const cacheKey = useMemo(() => {
    return `readme_${repository.owner}_${repository.repo}_${repository.branch || 'main'}_${repository.path || ''}`
  }, [repository])

  // Fetch README from GitHub API
  const fetchReadme = useCallback(async (): Promise<string> => {
    const { owner, repo, branch = 'main', path = '', accessToken } = repository
    
    let apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`
    if (path) {
      apiUrl += `${path}/`
    }
    apiUrl += `README.md?ref=${branch}`

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AutomatedReadmeParser/1.0'
    }

    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`
    }

    const response = await fetch(apiUrl, { headers })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('README.md not found in repository')
      }
      if (response.status === 403) {
        throw new Error('API rate limit exceeded or repository is private')
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''))
    }
    
    return data.content
  }, [repository])

  // Parse markdown content into structured sections
  const parseMarkdown = useCallback((content: string): ParsedReadme => {
    const lines = content.split('\n')
    const sections: ReadmeSection[] = []
    const badges: Badge[] = []
    const images: ImageItem[] = []
    const links: LinkItem[] = []
    let currentSection: Partial<ReadmeSection> | null = null
    let sectionContent: string[] = []
    let title: string | undefined
    let description: string | undefined

    // Badge patterns
    const badgeRegex = /!\[(.*?)\]\((https?:\/\/.*?\.svg.*?)\)/g
    const shieldsBadgeRegex = /!\[(.*?)\]\((https?:\/\/shields\.io\/.*?)\)/g
    const linkBadgeRegex = /\[(.*?)\]\((https?:\/\/.*?)\)/g

    // Process each line
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Extract title (first h1)
      if (!title && trimmedLine.startsWith('# ')) {
        title = trimmedLine.substring(2).trim()
        return
      }

      // Extract description (first paragraph after title)
      if (!description && title && trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('!')) {
        description = trimmedLine
      }

      // Extract badges
      let badgeMatch
      while ((badgeMatch = badgeRegex.exec(line)) !== null) {
        badges.push({
          name: badgeMatch[1],
          url: badgeMatch[2],
          image: badgeMatch[2],
          category: categorizeBadge(badgeMatch[1], badgeMatch[2])
        })
      }

      // Header detection
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: sectionContent.join('\n').trim()
          } as ReadmeSection)
        }

        // Start new section
        const level = headerMatch[1].length
        const headerTitle = headerMatch[2].trim()
        currentSection = {
          id: generateSectionId(headerTitle),
          title: headerTitle,
          level,
          type: 'text',
          content: ''
        }
        sectionContent = []
        return
      }

      // Code block detection
      if (trimmedLine.startsWith('```')) {
        const language = trimmedLine.substring(3).trim()
        if (currentSection) {
          currentSection.type = 'code'
          currentSection.language = language || 'text'
        }
        return
      }

      // Image detection
      const imageMatch = trimmedLine.match(/!\[(.*?)\]\((.*?)\)/)
      if (imageMatch) {
        images.push({
          src: imageMatch[2],
          alt: imageMatch[1],
          title: imageMatch[1]
        })
        if (currentSection) {
          currentSection.type = 'image'
        }
      }

      // Link detection
      const linkMatch = trimmedLine.match(/\[(.*?)\]\((.*?)\)/)
      if (linkMatch && !imageMatch) {
        links.push({
          text: linkMatch[1],
          url: linkMatch[2],
          type: linkMatch[2].startsWith('#') ? 'anchor' : 
                linkMatch[2].startsWith('http') ? 'external' : 'internal'
        })
      }

      // List detection
      if (trimmedLine.match(/^[-*+]\s/) || trimmedLine.match(/^\d+\.\s/)) {
        if (currentSection) {
          currentSection.type = 'list'
        }
      }

      // Quote detection
      if (trimmedLine.startsWith('>')) {
        if (currentSection) {
          currentSection.type = 'quote'
        }
      }

      // Table detection
      if (trimmedLine.includes('|')) {
        if (currentSection) {
          currentSection.type = 'table'
        }
      }

      // Add content to current section
      sectionContent.push(line)
    })

    // Save final section
    if (currentSection) {
      const finalSection: ReadmeSection = {
        ...(currentSection as ReadmeSection),
        content: sectionContent.join('\n').trim()
      }
      sections.push(finalSection)
    }

    // Generate table of contents
    const tableOfContents = autoGenerateTOC ? generateTableOfContents(sections) : []

    return {
      content,
      sections,
      metadata: {
        title,
        description,
        badges,
        tableOfContents,
        images,
        links,
        lastModified: new Date(),
        size: content.length,
        encoding: 'utf-8'
      }
    }
  }, [autoGenerateTOC])

  // Helper function to categorize badges
  const categorizeBadge = (name: string, url: string): Badge['category'] => {
    const lowerName = name.toLowerCase()
    const lowerUrl = url.toLowerCase()
    
    if (lowerName.includes('build') || lowerUrl.includes('travis') || lowerUrl.includes('github/workflow')) return 'build'
    if (lowerName.includes('coverage') || lowerUrl.includes('codecov')) return 'coverage'
    if (lowerName.includes('version') || lowerUrl.includes('npm/v/') || lowerUrl.includes('pypi/v/')) return 'version'
    if (lowerName.includes('license') || lowerUrl.includes('license')) return 'license'
    if (lowerName.includes('download') || lowerUrl.includes('downloads')) return 'downloads'
    if (lowerName.includes('star') || lowerUrl.includes('stars')) return 'stars'
    
    return 'other'
  }

  // Generate section ID from title
  const generateSectionId = (title: string): string => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Generate table of contents from sections
  const generateTableOfContents = (sections: ReadmeSection[]): TableOfContentsItem[] => {
    const toc: TableOfContentsItem[] = []
    const stack: TableOfContentsItem[] = []

    sections.forEach(section => {
      if (section.title && section.level) {
        const item: TableOfContentsItem = {
          id: section.id,
          title: section.title,
          level: section.level,
          children: []
        }

        // Find correct parent level
        while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
          stack.pop()
        }

        if (stack.length === 0) {
          toc.push(item)
        } else {
          stack[stack.length - 1].children.push(item)
        }

        stack.push(item)
      }
    })

    return toc
  }

  // Get cached README or fetch new one
  const loadReadme = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const cachedData = JSON.parse(cached)
        const cacheAge = (Date.now() - new Date(cachedData.timestamp).getTime()) / (1000 * 60)
        
        if (cacheAge < maxCacheAge) {
          setParsedReadme(cachedData.data)
          setLoading(false)
          return
        }
      }

      // Fetch fresh content
      const content = await fetchReadme()
      const parsed = parseMarkdown(content)
      
      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify({
        data: parsed,
        timestamp: new Date().toISOString()
      }))

      setParsedReadme(parsed)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load README'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [cacheKey, maxCacheAge, fetchReadme, parseMarkdown, onError])

  // Load README on mount or repository change
  useEffect(() => {
    loadReadme()
  }, [loadReadme])

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!parsedReadme || !searchQuery) return parsedReadme?.sections || []
    
    const query = searchQuery.toLowerCase()
    return parsedReadme.sections.filter(section =>
      section.title.toLowerCase().includes(query) ||
      section.content.toLowerCase().includes(query)
    )
  }, [parsedReadme, searchQuery])

  // Handle section selection
  const handleSectionSelect = (section: ReadmeSection) => {
    setSelectedSection(section.id)
    onSectionSelect?.(section)
  }

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  // Syntax highlighting for code blocks
  const highlightCode = (code: string, language: string): string => {
    if (!enableSyntaxHighlighting) return code
    
    // Simple syntax highlighting (in production, use Prism.js or similar)
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return'],
      python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return'],
      typescript: ['interface', 'type', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position'],
      html: ['div', 'span', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'body', 'head']
    }

    let highlighted = code
    const langKeywords = keywords[language as keyof typeof keywords] || []
    
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span class="text-blue-400">${keyword}</span>`)
    })

    // Highlight strings
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-400">\'$1\'</span>')
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>')
    highlighted = highlighted.replace(/#.*$/gm, '<span class="text-gray-500">$&</span>')

    return highlighted
  }

  // Render table of contents
  const renderTableOfContents = (items: TableOfContentsItem[], level = 0) => (
    <ul className={`space-y-1 ${level > 0 ? 'ml-4 border-l border-green-400/20 pl-2' : ''}`}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => {
              const element = document.getElementById(`section-${item.id}`)
              element?.scrollIntoView({ behavior: 'smooth' })
              setSelectedSection(item.id)
            }}
            className={`text-left w-full p-1 rounded text-sm font-mono transition-colors hover:bg-gray-700/40 ${
              selectedSection === item.id ? 'bg-green-600/20 text-green-400' : 'text-gray-300'
            }`}
          >
            {'·'.repeat(item.level)} {item.title}
          </button>
          {item.children.length > 0 && renderTableOfContents(item.children, level + 1)}
        </li>
      ))}
    </ul>
  )

  // Render section content based on type
  const renderSectionContent = (section: ReadmeSection) => {
    const isExpanded = expandedSections.has(section.id)
    
    switch (section.type) {
      case 'code':
        return (
          <div className="pixel-border bg-gray-900/60 rounded p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-400">
                {section.language || 'plaintext'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(section.content)}
                className="px-2 py-1 bg-gray-700/60 hover:bg-gray-600/60 text-green-400 text-xs rounded transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre
              className="text-sm font-mono text-gray-200 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightCode(section.content, section.language || 'text')
              }}
            />
          </div>
        )
      
      case 'image':
        if (!showImages) return null
        return (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.content.match(/!\[.*?\]\((.*?)\)/)?.[1] || ''}
              alt={section.content.match(/!\[(.*?)\]/)?.[1] || ''}
              className="max-w-full h-auto rounded pixel-border"
            />
          </div>
        )
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-green-400 bg-gray-800/40 px-4 py-2 italic text-gray-300">
            {section.content.replace(/^>\s?/gm, '')}
          </blockquote>
        )
      
      case 'list':
        return (
          <div
            className="prose prose-invert prose-green max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )
      
      case 'table':
        return (
          <div className="overflow-x-auto">
            <div
              className="prose prose-invert prose-green max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        )
      
      default:
        return (
          <div className="prose prose-invert prose-green max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: section.content.replace(/\n/g, '<br/>')
              }}
            />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex items-center space-x-3 text-green-400">
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="font-mono">Parsing README...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-4xl mb-4">📄</div>
        <div className="font-mono text-red-400 mb-2">Failed to Load README</div>
        <div className="text-sm text-gray-400 mb-4 max-w-md mx-auto">{error}</div>
        <button
          onClick={loadReadme}
          className="px-4 py-2 bg-red-600/60 hover:bg-red-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
        >
          🔄 Retry
        </button>
      </div>
    )
  }

  if (!parsedReadme) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-4xl mb-4">📄</div>
        <div className="font-mono text-gray-400">No README found</div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="font-pixel text-xl text-green-400 flex items-center space-x-2">
            <span>📄</span>
            <span>{parsedReadme.metadata.title || 'README'}</span>
          </h2>
          <div className="text-sm text-gray-400 mt-1">
            {repository.owner}/{repository.repo} • {parsedReadme.sections.length} sections • {Math.round(parsedReadme.metadata.size / 1024)}KB
          </div>
          {parsedReadme.metadata.description && (
            <p className="text-sm text-gray-300 mt-2">{parsedReadme.metadata.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="formatted">📖 Formatted</option>
            <option value="raw">📝 Raw</option>
            <option value="split">📑 Split</option>
          </select>

          <button
            onClick={loadReadme}
            className="px-3 py-2 bg-blue-600/60 hover:bg-blue-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Badges */}
      {showBadges && parsedReadme.metadata.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {parsedReadme.metadata.badges.map((badge, index) => (
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={index}
              src={badge.image}
              alt={badge.name}
              className="h-5 pixel-border rounded"
              title={badge.name}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table of Contents */}
        {showTableOfContents && parsedReadme.metadata.tableOfContents.length > 0 && (
          <div className="lg:w-64 flex-shrink-0">
            <div className="pixel-border bg-gray-800/40 rounded-lg p-4 sticky top-4">
              <h3 className="font-mono text-green-400 font-semibold mb-3 flex items-center space-x-2">
                <span>📑</span>
                <span>Table of Contents</span>
              </h3>
              {renderTableOfContents(parsedReadme.metadata.tableOfContents)}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 space-y-4">
          {viewMode === 'raw' ? (
            <div className="pixel-border bg-gray-900/60 rounded p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-200 whitespace-pre-wrap">
                {parsedReadme.content}
              </pre>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className={`pixel-border bg-gray-800/40 rounded-lg transition-all duration-200 ${
                  selectedSection === section.id ? 'ring-2 ring-green-400/50' : ''
                }`}
              >
                {/* Section Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/40 transition-colors"
                  onClick={() => handleSectionSelect(section)}
                >
                  <div className="flex items-center space-x-3">
                    <h3
                      className="font-mono text-green-400 font-semibold"
                      style={{ fontSize: `${1.5 - (section.level - 1) * 0.1}rem` }}
                    >
                      {'#'.repeat(section.level)} {section.title}
                    </h3>
                    <span
                      className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded text-xs font-mono"
                    >
                      {section.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400 font-mono">
                      {section.content.length} chars
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSectionExpansion(section.id)
                      }}
                      className="p-1 hover:bg-gray-600/60 rounded transition-colors"
                    >
                      <span className="text-green-400">
                        {expandedSections.has(section.id) ? '🔽' : '▶️'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                {(expandedSections.has(section.id) || selectedSection === section.id) && (
                  <div className="px-4 pb-4 border-t border-gray-700/30 pt-4">
                    {renderSectionContent(section)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-green-400">{parsedReadme.sections.length}</div>
          <div className="text-sm text-gray-400 font-mono">Sections</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-blue-400">{parsedReadme.metadata.badges.length}</div>
          <div className="text-sm text-gray-400 font-mono">Badges</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-purple-400">{parsedReadme.metadata.images.length}</div>
          <div className="text-sm text-gray-400 font-mono">Images</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-yellow-400">{Math.round(parsedReadme.metadata.size / 1024)}KB</div>
          <div className="text-sm text-gray-400 font-mono">File Size</div>
        </div>
      </div>
    </div>
  )
}