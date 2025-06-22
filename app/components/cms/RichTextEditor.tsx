'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '../Providers'

interface RichTextEditorProps {
  initialValue?: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  showPreview?: boolean
  autoSave?: boolean
  onSave?: (content: string) => void
}

interface EditorCommand {
  name: string
  icon: string
  action: () => void
  shortcut?: string
  tooltip: string
}

interface EditorState {
  content: string
  selectedText: string
  selectionStart: number
  selectionEnd: number
  history: string[]
  historyIndex: number
  isPreviewMode: boolean
  wordCount: number
  characterCount: number
  readingTime: number
}

// Markdown parsing utilities
const parseMarkdown = (content: string): string => {
  let html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-pixel text-green-400 mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl pixel-head text-green-400 mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl pixel-head text-green-400 mb-4 mt-8">$1</h1>')
    
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

const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default function RichTextEditor({
  initialValue = '',
  onChange,
  placeholder = 'Start writing your pixel masterpiece...',
  className = '',
  showPreview = true,
  autoSave = false,
  onSave
}: RichTextEditorProps) {
  const { theme } = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const [state, setState] = useState<EditorState>({
    content: initialValue,
    selectedText: '',
    selectionStart: 0,
    selectionEnd: 0,
    history: [initialValue],
    historyIndex: 0,
    isPreviewMode: false,
    wordCount: initialValue.trim().split(/\s+/).filter(Boolean).length,
    characterCount: initialValue.length,
    readingTime: calculateReadingTime(initialValue)
  })

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onSave) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      
      autoSaveRef.current = setTimeout(() => {
        onSave(state.content)
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [state.content, autoSave, onSave])

  const updateContent = useCallback((newContent: string, addToHistory = true) => {
    const words = newContent.trim().split(/\s+/).filter(Boolean).length
    const characters = newContent.length
    const readingTime = calculateReadingTime(newContent)

    setState(prev => ({
      ...prev,
      content: newContent,
      wordCount: words,
      characterCount: characters,
      readingTime,
      ...(addToHistory && {
        history: [...prev.history.slice(0, prev.historyIndex + 1), newContent],
        historyIndex: prev.historyIndex + 1
      })
    }))

    onChange(newContent)
  }, [onChange])

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = state.content.substring(start, end)
    const textToInsert = selectedText || placeholder
    
    const newContent = 
      state.content.substring(0, start) + 
      before + textToInsert + after + 
      state.content.substring(end)

    updateContent(newContent)

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }, [state.content, updateContent])

  const commands: EditorCommand[] = [
    {
      name: 'bold',
      icon: 'B',
      action: () => insertText('**', '**', 'bold text'),
      shortcut: 'Ctrl+B',
      tooltip: 'Bold (Ctrl+B)'
    },
    {
      name: 'italic',
      icon: 'I',
      action: () => insertText('*', '*', 'italic text'),
      shortcut: 'Ctrl+I',
      tooltip: 'Italic (Ctrl+I)'
    },
    {
      name: 'code',
      icon: '</>',
      action: () => insertText('`', '`', 'code'),
      tooltip: 'Inline Code'
    },
    {
      name: 'heading',
      icon: 'H1',
      action: () => insertText('# ', '', 'Heading'),
      tooltip: 'Heading'
    },
    {
      name: 'link',
      icon: '🔗',
      action: () => insertText('[', '](url)', 'link text'),
      tooltip: 'Link'
    },
    {
      name: 'list',
      icon: '•',
      action: () => insertText('* ', '', 'list item'),
      tooltip: 'Bullet List'
    },
    {
      name: 'quote',
      icon: '"',
      action: () => insertText('> ', '', 'quote'),
      tooltip: 'Blockquote'
    },
    {
      name: 'codeblock',
      icon: '{ }',
      action: () => insertText('```\n', '\n```', 'code block'),
      tooltip: 'Code Block'
    }
  ]

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          commands[0].action()
          break
        case 'i':
          e.preventDefault()
          commands[1].action()
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            // Redo
            if (state.historyIndex < state.history.length - 1) {
              const newIndex = state.historyIndex + 1
              setState(prev => ({ ...prev, historyIndex: newIndex }))
              updateContent(state.history[newIndex], false)
            }
          } else {
            // Undo
            if (state.historyIndex > 0) {
              const newIndex = state.historyIndex - 1
              setState(prev => ({ ...prev, historyIndex: newIndex }))
              updateContent(state.history[newIndex], false)
            }
          }
          break
        case 's':
          e.preventDefault()
          if (onSave) {
            onSave(state.content)
          }
          break
      }
    }

    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      const newContent = 
        state.content.substring(0, start) + 
        '  ' + 
        state.content.substring(end)
      
      updateContent(newContent)
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2)
      }, 0)
    }
  }, [commands, state.history, state.historyIndex, updateContent, onSave])

  return (
    <div className={`pixel-border bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-green-400/30 bg-gray-800/60">
        <div className="flex items-center space-x-2">
          {commands.map((command) => (
            <button
              key={command.name}
              onClick={command.action}
              className="px-2 py-1 text-xs font-mono bg-gray-700/60 hover:bg-gray-600/60 text-green-400 hover:text-green-300 rounded transition-colors pixel-border-sm"
              title={command.tooltip}
            >
              {command.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Stats */}
          <div className="text-xs font-mono text-gray-400 space-x-4">
            <span>{state.wordCount} words</span>
            <span>{state.characterCount} chars</span>
            <span>{state.readingTime} min read</span>
          </div>

          {/* Preview Toggle */}
          {showPreview && (
            <button
              onClick={() => setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }))}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors pixel-border-sm ${
                state.isPreviewMode
                  ? 'bg-green-600/60 text-white'
                  : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
              }`}
            >
              {state.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
          )}

          {/* Save Button */}
          {onSave && (
            <button
              onClick={() => onSave(state.content)}
              className="px-3 py-1 text-xs font-mono bg-green-600/60 hover:bg-green-500/60 text-white rounded transition-colors pixel-border-sm"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative min-h-[400px]">
        {state.isPreviewMode ? (
          // Preview Mode
          <div className="p-4 prose prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(state.content) }}
            />
            {state.content.length === 0 && (
              <div className="text-gray-500 italic font-mono text-sm">
                Nothing to preview yet. Start writing to see the magic! ✨
              </div>
            )}
          </div>
        ) : (
          // Editor Mode
          <textarea
            ref={textareaRef}
            value={state.content}
            onChange={(e) => updateContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-4 bg-transparent text-gray-300 placeholder-gray-500 font-mono text-sm leading-relaxed resize-none focus:outline-none"
            style={{ 
              fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
              tabSize: 2
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-green-400/30 bg-gray-800/40 text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Line {state.content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length}</span>
          <span>Column {(textareaRef.current?.selectionStart || 0) - state.content.lastIndexOf('\n', (textareaRef.current?.selectionStart || 0) - 1)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {autoSave && (
            <span className="text-green-400">Auto-save enabled</span>
          )}
          <span>Markdown</span>
        </div>
      </div>
    </div>
  )
}