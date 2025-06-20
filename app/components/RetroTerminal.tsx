"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../contexts/ThemeContext'
import BlinkingCursor from './BlinkingCursor'

interface TerminalCommand {
  command: string
  output: string[]
  timestamp: string
}

interface Command {
  name: string
  description: string
  action: (args: string[]) => string[]
  autocomplete?: string[]
}

const RetroTerminal: React.FC = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<TerminalCommand[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('~')
  const [userName] = useState('visitor')

  const router = useRouter()
  const { currentTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Terminal sound effects
  const playSound = useCallback((frequency: number, duration: number = 0.1) => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContextClass()
    }

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.start()
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  // Available commands
  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'Show available commands',
      action: () => [
        'Available commands:',
        '',
        'Navigation:',
        '  home         - Go to homepage',
        '  about        - View about page',
        '  blog         - List blog posts',
        '  projects     - View projects',
        '  contact      - Contact information',
        '',
        'System:',
        '  clear        - Clear terminal',
        '  history      - Show command history',
        '  theme        - Change terminal theme',
        '  neofetch     - Display system info',
        '  exit         - Close terminal',
        '',
        'Fun:',
        '  matrix       - Enter the Matrix',
        '  coffee       - ☕ Get some coffee',
        '  konami       - Try the Konami code',
        '  easter       - Find hidden commands',
        '',
        'Type any command followed by --help for more info.'
      ]
    },

    clear: {
      name: 'clear',
      description: 'Clear the terminal screen',
      action: () => {
        setHistory([])
        return []
      }
    },

    home: {
      name: 'home',
      description: 'Navigate to homepage',
      action: () => {
        router.push('/')
        setCurrentPath('~')
        return ['Navigating to homepage...', '✓ Welcome home!']
      }
    },

    about: {
      name: 'about',
      description: 'View about page',
      action: () => {
        router.push('/about')
        setCurrentPath('~/about')
        return ['Loading about page...', '✓ Learn more about the developer']
      }
    },

    blog: {
      name: 'blog',
      description: 'List blog posts or navigate to specific post',
      action: (args) => {
        if (args.length === 0) {
          router.push('/blog')
          setCurrentPath('~/blog')
          return [
            'Available blog posts:',
            '',
            '📈 Portfolio Stress Testing Dashboard Launch',
            '🔍 Deep Value Screener Launch',
            '📊 Margin of Safety Calculator Launch',
            '⭐ Quality Score Engine Launch',
            '🧠 Summit AI Study Copilot',
            '🎯 Spinoff Radar Event Driven Alpha',
            '💡 Bruce Greenwald Investment Analysis Platform',
            '📡 Signal to the Underground',
            '⚡ Earnings Power Value Engine',
            '📚 FNCE 451 Cheatsheet',
            '🏛️ Calgary AI Hub Policy',
            '🚀 NVIDIA Strategic Assessment',
            '🏠 Building My Digital Home',
            '📊 Financial Data APIs Guide',
            '👋 Hello World',
            '',
            'Type "blog <post-name>" to read a specific post'
          ]
        } else {
          const postSlug = args.join('-').toLowerCase()
          router.push(`/blog/${postSlug}`)
          setCurrentPath(`~/blog/${postSlug}`)
          return [`Opening blog post: ${args.join(' ')}`, '✓ Loading content...']
        }
      },
      autocomplete: [
        'portfolio-stress-testing-dashboard-launch',
        'deep-value-screener-launch',
        'margin-of-safety-calculator-launch',
        'quality-score-engine-launch'
      ]
    },

    projects: {
      name: 'projects',
      description: 'View projects or navigate to specific project',
      action: (args) => {
        if (args.length === 0) {
          router.push('/projects')
          setCurrentPath('~/projects')
          return [
            'Featured Projects:',
            '',
            '🎯 Quality Score Engine - Value investing analysis',
            '📊 Margin of Safety Calculator - Investment safety margins',
            '🔍 Deep Value Screener - Benjamin Graham criteria',
            '📈 Portfolio Stress Testing - Risk analysis dashboard',
            '💹 Trading Dashboard - Real-time market data',
            '🎮 3D Data Engine - WebGL visualization platform',
            '',
            'Type "projects <project-name>" to view details'
          ]
        } else {
          const projectSlug = args.join('-').toLowerCase()
          router.push(`/projects/${projectSlug}`)
          setCurrentPath(`~/projects/${projectSlug}`)
          return [`Opening project: ${args.join(' ')}`, '✓ Loading project details...']
        }
      },
      autocomplete: [
        'quality-score-engine',
        'margin-of-safety-calculator',
        'deep-value-screener',
        'portfolio-stress-testing'
      ]
    },

    contact: {
      name: 'contact',
      description: 'Show contact information',
      action: () => {
        router.push('/contact')
        setCurrentPath('~/contact')
        return [
          'Contact Information:',
          '',
          '📧 Email: Available on contact page',
          '💼 LinkedIn: Available on contact page',
          '🐙 GitHub: Available on contact page',
          '',
          'Redirecting to contact page...'
        ]
      }
    },

    history: {
      name: 'history',
      description: 'Show command history',
      action: () => {
        if (commandHistory.length === 0) {
          return ['No commands in history']
        }
        return [
          'Command History:',
          '',
          ...commandHistory.map((cmd, index) => `${index + 1}: ${cmd}`)
        ]
      }
    },

    neofetch: {
      name: 'neofetch',
      description: 'Display system information',
      action: () => [
        '╭─────────────────────────────────╮',
        '│    PIXEL WISDOM TERMINAL v2.5  │',
        '╰─────────────────────────────────╯',
        '',
        '🖥️  System: Pixel Blog Portfolio',
        '⚡ Engine: Next.js 15 + TypeScript',
        '🎨 UI: Tailwind CSS + Custom Themes',
        '🚀 Host: Vercel Edge Network',
        '📱 Mobile: Touch-optimized interface',
        '🔊 Audio: Web Audio API',
        '🎮 Easter eggs: 12 hidden commands',
        '',
        `👤 User: ${userName}`,
        `📂 Location: ${currentPath}`,
        `🕒 Uptime: ${new Date().toLocaleTimeString()}`,
        '💚 Status: All systems operational'
      ]
    },

    // Easter eggs and fun commands
    matrix: {
      name: 'matrix',
      description: 'Enter the Matrix',
      action: () => {
        const matrixChars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ'
        const lines = []
        for (let i = 0; i < 10; i++) {
          let line = ''
          for (let j = 0; j < 50; j++) {
            line += matrixChars[Math.floor(Math.random() * matrixChars.length)]
          }
          lines.push(line)
        }
        return [
          'Entering the Matrix...',
          '',
          ...lines,
          '',
          'Wake up, Neo...',
          'The Matrix has you.',
          'Follow the white rabbit. 🐰'
        ]
      }
    },

    coffee: {
      name: 'coffee',
      description: 'Get some coffee',
      action: () => [
        '☕ Brewing coffee...',
        '',
        '      )  (',
        '     (   ) )',
        '      ) ( (',
        '    _______)_',
        ' .-\'         `-.',
        '(  Coffee break!  )',
        ' `-.___________.-\'',
        '',
        'Perfect fuel for coding! ⚡'
      ]
    },

    konami: {
      name: 'konami',
      description: 'The legendary cheat code',
      action: () => [
        '🎮 KONAMI CODE ACTIVATED! 🎮',
        '',
        '↑ ↑ ↓ ↓ ← → ← → B A',
        '',
        '🌟 You have unlocked:',
        '• 30 extra lives',
        '• Unlimited coffee ☕',
        '• Super developer powers 💪',
        '• Access to secret commands',
        '',
        'Welcome to the elite! 👑'
      ]
    },

    easter: {
      name: 'easter',
      description: 'Hunt for easter eggs',
      action: () => [
        '🥚 Easter Egg Hunt! 🐰',
        '',
        'Hidden commands to discover:',
        '• Try typing some common Unix commands',
        '• Look for pop culture references',
        '• Test some programming jokes',
        '• Check out retro gaming terms',
        '',
        'Hints: 🎮 🎵 🚀 👽 🦄 🎪',
        '',
        'Happy hunting! Some may surprise you... 😉'
      ]
    },

    // Hidden easter egg commands
    ls: {
      name: 'ls',
      description: 'List directory contents (Unix style)',
      action: () => [
        'total 42',
        'drwxr-xr-x  projects/',
        'drwxr-xr-x  blog/',
        '-rw-r--r--  about.md',
        '-rw-r--r--  contact.md',
        '-rw-r--r--  secret.txt',
        '',
        '💡 Tip: This is a web terminal, not Unix! Try "help" instead.'
      ]
    },

    cat: {
      name: 'cat',
      description: 'Display file contents',
      action: (args) => {
        if (args[0] === 'secret.txt') {
          return [
            '🔐 SECRET FILE ACCESSED',
            '',
            'Congratulations! You found a hidden easter egg! 🎉',
            '',
            'You are a true terminal explorer! 🕵️‍♂️',
            'This secret is just for curious minds like yours.',
            '',
            'Keep exploring for more surprises... 👀'
          ]
        }
        return [`cat: ${args[0] || 'filename'}: No such file or directory`]
      }
    },

    sudo: {
      name: 'sudo',
      description: 'Superuser do (with a twist)',
      action: (args) => [
        '🚫 sudo: command not found',
        '',
        'Nice try! But this is a web terminal. 😄',
        'You already have all the power you need here! 💪',
        '',
        'Pro tip: Try "help" to see what you can actually do.'
      ]
    },

    whoami: {
      name: 'whoami',
      description: 'Display current user',
      action: () => [
        `${userName}`,
        '',
        'You are a visitor exploring the Pixel Wisdom terminal! 🚀',
        'Welcome to this retro computing experience! 💾'
      ]
    },

    cowsay: {
      name: 'cowsay',
      description: 'Make a cow say something',
      action: (args) => {
        const message = args.join(' ') || 'Hello from the terminal!'
        const border = '-'.repeat(message.length + 2)
        return [
          ` ${border}`,
          `< ${message} >`,
          ` ${border}`,
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||'
        ]
      }
    },

    theme: {
      name: 'theme',
      description: 'Change terminal theme',
      action: (args) => {
        if (args.length === 0) {
          return [
            'Available themes:',
            '  matrix  - Classic green Matrix theme',
            '  amber   - Retro amber terminal',
            '  cyber   - Cyberpunk blue theme',
            '',
            'Usage: theme <theme-name>'
          ]
        }
        return [`Switching to ${args[0]} theme...`, '✓ Theme applied!']
      },
      autocomplete: ['matrix', 'amber', 'cyber']
    },

    exit: {
      name: 'exit',
      description: 'Close the terminal',
      action: () => {
        setIsOpen(false)
        return ['Terminal session ended. 👋']
      }
    }
  }

  // Auto-completion logic
  const getCommandSuggestions = useCallback((input: string) => {
    const [command, ...args] = input.split(' ')
    
    if (args.length === 0) {
      // Suggest commands
      return Object.keys(commands).filter(cmd => 
        cmd.toLowerCase().startsWith(command.toLowerCase())
      )
    } else {
      // Suggest subcommands/arguments
      const cmd = commands[command]
      if (cmd?.autocomplete) {
        const lastArg = args[args.length - 1].toLowerCase()
        return cmd.autocomplete.filter(item => 
          item.toLowerCase().startsWith(lastArg)
        ).map(item => `${command} ${args.slice(0, -1).join(' ')} ${item}`.trim())
      }
    }
    
    return []
  }, [])

  // Handle command execution
  const executeCommand = useCallback((commandInput: string) => {
    const [command, ...args] = commandInput.trim().split(' ')
    const cmd = commands[command.toLowerCase()]
    
    playSound(800, 0.05) // Command execution sound
    
    if (cmd) {
      const output = cmd.action(args)
      const newCommand: TerminalCommand = {
        command: commandInput,
        output,
        timestamp: new Date().toLocaleTimeString()
      }
      
      setHistory(prev => [...prev, newCommand])
      setCommandHistory(prev => [...prev, commandInput])
    } else {
      const errorOutput = [
        `Command not found: ${command}`,
        '',
        'Type "help" to see available commands.',
                  'Or try "easter" to find hidden commands! 🥚'
      ]
      
      const newCommand: TerminalCommand = {
        command: commandInput,
        output: errorOutput,
        timestamp: new Date().toLocaleTimeString()
      }
      
      setHistory(prev => [...prev, newCommand])
      setCommandHistory(prev => [...prev, commandInput])
    }
    
    setInput('')
    setHistoryIndex(-1)
    setShowSuggestions(false)
  }, [playSound])

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    playSound(400, 0.02) // Typing sound
    
    if (value.trim()) {
      const suggestions = getCommandSuggestions(value)
      setSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [getCommandSuggestions, playSound])

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (input.trim()) {
          executeCommand(input)
        }
        break
        
      case 'Tab':
        e.preventDefault()
        if (suggestions.length > 0) {
          setInput(suggestions[0])
          setShowSuggestions(false)
          playSound(600, 0.03)
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex])
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInput('')
        }
        break
        
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }, [input, suggestions, historyIndex, commandHistory, executeCommand, playSound])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard shortcut to open terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        playSound(isOpen ? 300 : 600, 0.1)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, playSound])

  // Mobile touch support
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = Math.abs(touch.clientY - touchStart.y)
    
    // Swipe gestures for mobile
    if (deltaY < 100) {
      if (deltaX > 50) {
        // Swipe right - show help
        executeCommand('help')
      } else if (deltaX < -50) {
        // Swipe left - clear terminal
        executeCommand('clear')
      }
    }
    
    setTouchStart(null)
  }, [touchStart, executeCommand])

  // Welcome message
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{
        command: 'system',
        output: [
          '╭─────────────────────────────────────╮',
          '│  Welcome to PIXEL WISDOM TERMINAL  │',
          '╰─────────────────────────────────────╯',
          '',
          '🚀 Retro terminal interface loaded!',
          '📖 Type "help" to see available commands',
          '🎮 Press Ctrl+` or Cmd+` to toggle terminal',
          '',
          'Happy exploring! 🌟'
        ],
        timestamp: new Date().toLocaleTimeString()
      }])
    }
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black/80 text-green-400 border border-green-400 px-4 py-2 rounded-lg font-mono text-sm hover:bg-green-400/10 transition-all duration-200 backdrop-blur-sm"
        title="Open Terminal (Ctrl+`)"
      >
        📟 Terminal
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl h-[80vh] bg-black border-2 border-green-400 rounded-lg overflow-hidden shadow-2xl"
        style={{
          boxShadow: `0 0 20px ${currentTheme.colors.primary}40`,
          fontFamily: currentTheme.fonts.mono
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Terminal Header */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b border-green-400 bg-black/50"
          style={{ borderColor: currentTheme.colors.primary }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span 
              className="text-sm font-mono"
              style={{ color: currentTheme.colors.text }}
            >
              terminal@pixelwisdom: {currentPath}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto bg-black text-green-400 relative"
          style={{ 
            color: currentTheme.colors.text,
            backgroundColor: currentTheme.colors.background
          }}
        >
          {/* Command History */}
          {history.map((entry, index) => (
            <div key={index} className="mb-4">
              {entry.command !== 'system' && (
                <div className="flex items-center space-x-2 mb-1">
                  <span style={{ color: currentTheme.colors.primary }}>
                    {userName}@pixelwisdom
                  </span>
                  <span style={{ color: currentTheme.colors.textSecondary }}>:</span>
                  <span style={{ color: currentTheme.colors.accent1 }}>
                    {currentPath}
                  </span>
                  <span style={{ color: currentTheme.colors.textSecondary }}>$</span>
                  <span>{entry.command}</span>
                </div>
              )}
              {entry.output.map((line, lineIndex) => (
                <div key={lineIndex} className="font-mono text-sm">
                  {line}
                </div>
              ))}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center space-x-2">
            <span style={{ color: currentTheme.colors.primary }}>
              {userName}@pixelwisdom
            </span>
            <span style={{ color: currentTheme.colors.textSecondary }}>:</span>
            <span style={{ color: currentTheme.colors.accent1 }}>
              {currentPath}
            </span>
            <span style={{ color: currentTheme.colors.textSecondary }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none font-mono text-sm"
              style={{ color: currentTheme.colors.text }}
              spellCheck={false}
              autoComplete="off"
            />
            <BlinkingCursor />
          </div>

          {/* Auto-complete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 p-2 border border-gray-600 rounded bg-gray-900/80 backdrop-blur-sm">
              <div className="text-xs text-gray-400 mb-1">Suggestions:</div>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <div
                  key={index}
                  className="text-sm cursor-pointer hover:bg-gray-700/50 px-2 py-1 rounded"
                  onClick={() => {
                    setInput(suggestion)
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </div>
              ))}
              {suggestions.length > 5 && (
                <div className="text-xs text-gray-500 mt-1">
                  ...and {suggestions.length - 5} more
                </div>
              )}
            </div>
          )}

          {/* CRT Effect Overlay */}
          {currentTheme.effects?.crtEffect && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  ${currentTheme.colors.primary}20 2px,
                  ${currentTheme.colors.primary}20 4px
                )`
              }}
            />
          )}
        </div>

        {/* Help Footer */}
        <div 
          className="px-4 py-2 border-t text-xs opacity-70"
          style={{ 
            borderColor: currentTheme.colors.border,
            color: currentTheme.colors.textSecondary
          }}
                  >
            💡 Tab: autocomplete | ↑↓: history | Ctrl+`: toggle | Type "help" for commands
          </div>
      </div>
    </div>
  )
}

export default RetroTerminal 