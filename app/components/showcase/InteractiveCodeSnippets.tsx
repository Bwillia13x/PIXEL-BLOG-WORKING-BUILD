'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useTheme } from '../Providers'

interface CodeSnippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  category: 'component' | 'hook' | 'utility' | 'config' | 'example' | 'documentation'
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  dependencies: string[]
  features: string[]
  author: string
  created: Date
  updated: Date
  usage: {
    imports: string[]
    examples: CodeExample[]
    props?: PropDefinition[]
    methods?: MethodDefinition[]
  }
  metadata: {
    lines: number
    characters: number
    complexity: number // 1-10
    performance: 'low' | 'medium' | 'high'
    compatibility: string[]
    license: string
  }
}

interface CodeExample {
  title: string
  description: string
  code: string
  output?: string
}

interface PropDefinition {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

interface MethodDefinition {
  name: string
  parameters: Parameter[]
  returns: string
  description: string
  example: string
}

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface InteractiveCodeSnippetsProps {
  snippets: CodeSnippet[]
  onSnippetSelect: (snippet: CodeSnippet) => void
  onSnippetRun?: (snippet: CodeSnippet) => void
  onSnippetShare?: (snippet: CodeSnippet) => void
  showLineNumbers?: boolean
  showMinimap?: boolean
  enableLiveEdit?: boolean
  enableExecution?: boolean
  theme?: 'dark' | 'light' | 'pixel'
  fontSize?: number
  className?: string
}

type ViewMode = 'grid' | 'list' | 'categories' | 'documentation'
type SortMode = 'newest' | 'oldest' | 'alphabetical' | 'complexity' | 'popularity'

export default function InteractiveCodeSnippets({
  snippets,
  onSnippetSelect,
  onSnippetRun,
  onSnippetShare,
  showLineNumbers = true,
  showMinimap = false,
  enableLiveEdit = true,
  enableExecution = false,
  theme: codeTheme = 'pixel',
  fontSize = 14,
  className = ''
}: InteractiveCodeSnippetsProps) {
  const { theme } = useTheme()
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [editedCode, setEditedCode] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [executionOutput, setExecutionOutput] = useState<string>('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Filter and sort snippets
  const filteredAndSortedSnippets = useMemo(() => {
    let filtered = snippets

    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query)) ||
        snippet.code.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(snippet => snippet.category === selectedCategory)
    }

    if (selectedLanguage) {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage)
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortMode) {
        case 'newest':
          return b.updated.getTime() - a.updated.getTime()
        case 'oldest':
          return a.created.getTime() - b.created.getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'complexity':
          return b.metadata.complexity - a.metadata.complexity
        case 'popularity':
          return b.usage.examples.length - a.usage.examples.length
        default:
          return 0
      }
    })

    return sorted
  }, [snippets, searchQuery, selectedCategory, selectedLanguage, sortMode])

  // Get unique categories and languages
  const categories = useMemo(() => 
    [...new Set(snippets.map(s => s.category))].sort()
  , [snippets])

  const languages = useMemo(() => 
    [...new Set(snippets.map(s => s.language))].sort()
  , [snippets])

  // Enhanced syntax highlighting
  const highlightCode = useCallback((code: string, language: string): string => {
    const syntaxRules = {
      javascript: {
        keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally'],
        types: ['string', 'number', 'boolean', 'object', 'array', 'null', 'undefined'],
        operators: ['===', '!==', '==', '!=', '&&', '||', '!', '+', '-', '*', '/', '%'],
        brackets: ['(', ')', '[', ']', '{', '}']
      },
      typescript: {
        keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'interface', 'type', 'enum', 'implements'],
        types: ['string', 'number', 'boolean', 'object', 'array', 'null', 'undefined', 'any', 'void', 'never'],
        operators: ['===', '!==', '==', '!=', '&&', '||', '!', '+', '-', '*', '/', '%', '=>'],
        brackets: ['(', ')', '[', ']', '{', '}', '<', '>']
      },
      python: {
        keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return', 'try', 'except', 'finally', 'with', 'as', 'pass', 'break', 'continue'],
        types: ['str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set', 'None'],
        operators: ['==', '!=', 'and', 'or', 'not', 'in', 'is', '+', '-', '*', '/', '%'],
        brackets: ['(', ')', '[', ']', '{', '}']
      },
      css: {
        keywords: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height'],
        types: ['px', 'rem', 'em', '%', 'vh', 'vw', 'auto', 'none', 'inherit'],
        operators: [':', ';', '{', '}'],
        brackets: ['(', ')', '{', '}']
      }
    }

    let highlighted = code
    const rules = syntaxRules[language as keyof typeof syntaxRules]

    if (rules) {
      // Highlight keywords
      rules.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g')
        highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-semibold">${keyword}</span>`)
      })

      // Highlight types
      rules.types.forEach(type => {
        const regex = new RegExp(`\\b${type}\\b`, 'g')
        highlighted = highlighted.replace(regex, `<span class="text-purple-400">${type}</span>`)
      })
    }

    // Highlight strings
    highlighted = highlighted.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="text-green-400">"$1"</span>')
    highlighted = highlighted.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="text-green-400">\'$1\'</span>')
    highlighted = highlighted.replace(/`([^`\\]*(\\.[^`\\]*)*)`/g, '<span class="text-green-400">`$1`</span>')

    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-yellow-400">$&</span>')

    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
    highlighted = highlighted.replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')

    // Highlight JSX/HTML tags
    if (language === 'javascript' || language === 'typescript' || language === 'jsx' || language === 'tsx') {
      highlighted = highlighted.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g, '<span class="text-cyan-400">$&</span>')
    }

    return highlighted
  }, [])

  // Handle snippet selection
  const handleSnippetSelect = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet)
    setEditedCode(snippet.code)
    onSnippetSelect(snippet)
  }

  // Handle code execution (mock implementation)
  const handleCodeExecution = async (code: string, language: string) => {
    if (!enableExecution) return

    setIsExecuting(true)
    setExecutionOutput('')

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (language === 'javascript' || language === 'typescript') {
        // Mock JavaScript execution
        setExecutionOutput('// Code executed successfully\nconsole.log("Hello, World!");')
      } else if (language === 'python') {
        // Mock Python execution
        setExecutionOutput('Code executed successfully\nHello, World!')
      } else {
        setExecutionOutput('Code execution not supported for this language')
      }

      onSnippetRun?.(selectedSnippet!)
    } catch (error) {
      setExecutionOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }

  // Handle copy to clipboard
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      case 'expert': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  // Get performance color
  const getPerformanceColor = (performance: string): string => {
    switch (performance) {
      case 'high': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Render snippet card
  const renderSnippetCard = (snippet: CodeSnippet) => (
    <div
      key={snippet.id}
      className="pixel-border bg-gray-800/40 hover:bg-gray-700/60 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
      onClick={() => handleSnippetSelect(snippet)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-pixel text-green-400 text-sm mb-1 truncate">{snippet.title}</h3>
          <p className="text-xs text-gray-300 line-clamp-2">{snippet.description}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <span
            className="px-2 py-1 rounded text-xs font-mono"
            style={{
              backgroundColor: `${getDifficultyColor(snippet.difficulty)}20`,
              color: getDifficultyColor(snippet.difficulty)
            }}
          >
            {snippet.difficulty}
          </span>
        </div>
      </div>

      {/* Code Preview */}
      <div className="pixel-border bg-gray-900/60 rounded p-3 mb-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-400">{snippet.language}</span>
          <span className="text-xs text-gray-400">{snippet.metadata.lines} lines</span>
        </div>
        <pre className="text-xs font-mono text-gray-200 whitespace-pre-wrap line-clamp-3">
          {snippet.code.substring(0, 150)}...
        </pre>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {snippet.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded text-xs font-mono"
          >
            {tag}
          </span>
        ))}
        {snippet.tags.length > 3 && (
          <span className="text-xs text-gray-400">+{snippet.tags.length - 3}</span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-3">
          <span>⭐ {snippet.metadata.complexity}/10</span>
          <span
            style={{ color: getPerformanceColor(snippet.metadata.performance) }}
          >
            🚀 {snippet.metadata.performance}
          </span>
        </div>
        <span>{snippet.usage.examples.length} examples</span>
      </div>
    </div>
  )

  // Render list view
  const renderListView = () => (
    <div className="space-y-3">
      {filteredAndSortedSnippets.map((snippet) => (
        <div
          key={snippet.id}
          className="flex items-center space-x-4 p-4 pixel-border bg-gray-800/40 hover:bg-gray-700/60 rounded-lg cursor-pointer transition-colors"
          onClick={() => handleSnippetSelect(snippet)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-pixel text-green-400 text-sm">{snippet.title}</h3>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{snippet.language}</span>
            </div>
            <p className="text-xs text-gray-300 truncate">{snippet.description}</p>
          </div>
          
          <div className="flex items-center space-x-3 text-xs font-mono text-gray-400">
            <span>{snippet.metadata.lines} lines</span>
            <span
              style={{ color: getDifficultyColor(snippet.difficulty) }}
            >
              {snippet.difficulty}
            </span>
            <span>{snippet.usage.examples.length} examples</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopy(snippet.code, snippet.id)
              }}
              className="p-1 hover:bg-gray-600/60 rounded transition-colors"
            >
              <span className="text-green-400">
                {copied === snippet.id ? '✅' : '📋'}
              </span>
            </button>
            {onSnippetShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSnippetShare(snippet)
                }}
                className="p-1 hover:bg-gray-600/60 rounded transition-colors"
              >
                <span className="text-blue-400">📤</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="font-pixel text-xl text-green-400 flex items-center space-x-2">
            <span>💻</span>
            <span>Interactive Code Snippets</span>
          </h2>
          <div className="text-sm text-gray-400 mt-1">
            {filteredAndSortedSnippets.length} of {snippets.length} snippets
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets..."
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="complexity">By Complexity</option>
            <option value="popularity">By Popularity</option>
          </select>

          {/* View Mode */}
          <div className="flex space-x-1 pixel-border rounded overflow-hidden">
            {(['grid', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 font-mono text-xs transition-colors ${
                  viewMode === mode
                    ? 'bg-green-600/60 text-white'
                    : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
                }`}
              >
                {mode === 'grid' ? '🔲' : '📋'} {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Snippets List */}
        <div className="lg:w-1/3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredAndSortedSnippets.map(renderSnippetCard)}
            </div>
          ) : (
            renderListView()
          )}
        </div>

        {/* Code Editor/Viewer */}
        <div className="lg:w-2/3">
          {selectedSnippet ? (
            <div className="space-y-4">
              {/* Snippet Header */}
              <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-pixel text-lg text-green-400 mb-2">{selectedSnippet.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{selectedSnippet.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSnippet.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopy(selectedSnippet.code, 'editor')}
                      className="px-3 py-1 bg-green-600/60 hover:bg-green-500/60 text-white font-mono text-xs rounded transition-colors"
                    >
                      {copied === 'editor' ? '✅ Copied' : '📋 Copy'}
                    </button>
                    {enableExecution && (
                      <button
                        onClick={() => handleCodeExecution(editedCode, selectedSnippet.language)}
                        disabled={isExecuting}
                        className="px-3 py-1 bg-blue-600/60 hover:bg-blue-500/60 disabled:bg-gray-600/60 text-white font-mono text-xs rounded transition-colors"
                      >
                        {isExecuting ? '⏳ Running' : '▶️ Run'}
                      </button>
                    )}
                    {onSnippetShare && (
                      <button
                        onClick={() => onSnippetShare(selectedSnippet)}
                        className="px-3 py-1 bg-purple-600/60 hover:bg-purple-500/60 text-white font-mono text-xs rounded transition-colors"
                      >
                        📤 Share
                      </button>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-400">Difficulty:</span>
                    <span
                      className="ml-2"
                      style={{ color: getDifficultyColor(selectedSnippet.difficulty) }}
                    >
                      {selectedSnippet.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Performance:</span>
                    <span
                      className="ml-2"
                      style={{ color: getPerformanceColor(selectedSnippet.metadata.performance) }}
                    >
                      {selectedSnippet.metadata.performance}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Lines:</span>
                    <span className="ml-2 text-blue-400">{selectedSnippet.metadata.lines}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Complexity:</span>
                    <span className="ml-2 text-yellow-400">{selectedSnippet.metadata.complexity}/10</span>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="pixel-border bg-gray-900/80 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-800/60 border-b border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-green-400">{selectedSnippet.language}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{selectedSnippet.metadata.lines} lines</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers?.(e.target.checked)}
                        className="pixel-checkbox"
                      />
                      <span className="text-gray-400">Line Numbers</span>
                    </label>
                    {enableLiveEdit && (
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showPreview}
                          onChange={(e) => setShowPreview(e.target.checked)}
                          className="pixel-checkbox"
                        />
                        <span className="text-gray-400">Live Preview</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {enableLiveEdit ? (
                    <textarea
                      value={editedCode}
                      onChange={(e) => setEditedCode(e.target.value)}
                      className="w-full h-64 p-4 bg-transparent text-sm font-mono text-gray-200 resize-none focus:outline-none"
                      style={{ fontSize: `${fontSize}px` }}
                      spellCheck={false}
                    />
                  ) : (
                    <div className="p-4 overflow-x-auto">
                      <pre
                        className="text-sm font-mono text-gray-200 whitespace-pre-wrap"
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(selectedSnippet.code, selectedSnippet.language)
                        }}
                      />
                    </div>
                  )}

                  {showLineNumbers && (
                    <div className="absolute left-0 top-0 p-4 pointer-events-none">
                      <div className="flex flex-col text-xs font-mono text-gray-500 select-none">
                        {(enableLiveEdit ? editedCode : selectedSnippet.code).split('\n').map((_, index) => (
                          <span key={index} className="leading-5">
                            {index + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Output */}
              {executionOutput && (
                <div className="pixel-border bg-gray-900/80 rounded-lg p-4">
                  <h4 className="font-mono text-green-400 text-sm mb-2">Output:</h4>
                  <pre className="text-sm font-mono text-gray-200 whitespace-pre-wrap">
                    {executionOutput}
                  </pre>
                </div>
              )}

              {/* Usage Examples */}
              {selectedSnippet.usage.examples.length > 0 && (
                <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
                  <h4 className="font-mono text-green-400 text-sm mb-3">Usage Examples:</h4>
                  <div className="space-y-3">
                    {selectedSnippet.usage.examples.map((example, index) => (
                      <div key={index} className="pixel-border bg-gray-900/60 rounded p-3">
                        <h5 className="font-mono text-blue-400 text-xs mb-1">{example.title}</h5>
                        <p className="text-xs text-gray-300 mb-2">{example.description}</p>
                        <pre
                          className="text-xs font-mono text-gray-200 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(example.code, selectedSnippet.language)
                          }}
                        />
                        {example.output && (
                          <div className="mt-2 pt-2 border-t border-gray-700/50">
                            <span className="text-xs text-gray-400">Output:</span>
                            <pre className="text-xs font-mono text-green-400 mt-1">{example.output}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 pixel-border bg-gray-800/40 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">💻</div>
                <div className="font-mono text-gray-400 mb-2">Select a code snippet to view</div>
                <div className="text-sm text-gray-500">Choose from {filteredAndSortedSnippets.length} available snippets</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-green-400">{snippets.length}</div>
          <div className="text-sm text-gray-400 font-mono">Total Snippets</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-blue-400">{languages.length}</div>
          <div className="text-sm text-gray-400 font-mono">Languages</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-purple-400">{categories.length}</div>
          <div className="text-sm text-gray-400 font-mono">Categories</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-yellow-400">
            {Math.round(snippets.reduce((sum, s) => sum + s.usage.examples.length, 0) / snippets.length)}
          </div>
          <div className="text-sm text-gray-400 font-mono">Avg Examples</div>
        </div>
      </div>
    </div>
  )
}