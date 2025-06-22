'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SwatchIcon,
  PaintBrushIcon,
  EyeIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  CodeBracketIcon,
  DocumentArrowDownIcon,
  CpuChipIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { useTheme, useThemeProperties } from '@/app/contexts/ThemeContext'
import ThemeSelector from '@/app/components/ThemeSelector'
import ThemeToggle from '@/app/components/ThemeToggle'
import ThemeCreator from '@/app/components/ThemeCreator'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'

export default function ThemeDemoPage() {
  const { currentTheme, availableThemes, customThemes, exportCurrentTheme, isTransitioning } = useTheme()
  const { cssVar, getColor, hasEffect } = useThemeProperties()
  const [showCreator, setShowCreator] = useState(false)

  const demoComponents = [
    {
      title: 'Buttons & Controls',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button className="theme-button px-4 py-2">Primary Button</button>
            <button className="px-4 py-2 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30">
              Secondary
            </button>
            <button className="px-4 py-2 pixel-border" style={{
              backgroundColor: getColor('success') + '20',
              color: getColor('success'),
              borderColor: getColor('success') + '80'
            }}>
              Success
            </button>
            <button className="px-4 py-2 pixel-border" style={{
              backgroundColor: getColor('warning') + '20',
              color: getColor('warning'),
              borderColor: getColor('warning') + '80'
            }}>
              Warning
            </button>
            <button className="px-4 py-2 pixel-border" style={{
              backgroundColor: getColor('error') + '20',
              color: getColor('error'),
              borderColor: getColor('error') + '80'
            }}>
              Error
            </button>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Theme-aware input field..."
              className="theme-input w-full px-3 py-2"
            />
            <textarea 
              placeholder="Multi-line theme-aware textarea..."
              className="theme-input w-full px-3 py-2 resize-none"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Cards & Surfaces',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="theme-card p-4 space-y-3">
            <h3 className="font-mono font-bold theme-primary">Default Card</h3>
            <p className="theme-text-secondary text-sm">
              This card demonstrates the default surface styling with theme-aware colors.
            </p>
            <div className="flex space-x-2">
              <div className="w-4 h-4 pixel-border" style={{ backgroundColor: getColor('accent1') }} />
              <div className="w-4 h-4 pixel-border" style={{ backgroundColor: getColor('accent2') }} />
              <div className="w-4 h-4 pixel-border" style={{ backgroundColor: getColor('accent3') }} />
            </div>
          </div>
          
          <div 
            className="p-4 pixel-border space-y-3 theme-glow-box"
            style={{
              backgroundColor: getColor('backgroundSecondary'),
              borderColor: getColor('primary')
            }}
          >
            <h3 className="font-mono font-bold theme-glow-text">Enhanced Card</h3>
            <p className="theme-text-secondary text-sm">
              This card shows enhanced styling with glow effects when supported by the theme.
            </p>
            <div className="text-xs theme-text-tertiary font-mono">
              Effects: {hasEffect('glow') ? 'Glow enabled' : 'Glow disabled'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Typography & Text',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-mono font-bold theme-primary">Heading 1</h1>
            <h2 className="text-2xl font-mono font-bold theme-text">Heading 2</h2>
            <h3 className="text-xl font-mono font-bold theme-text-secondary">Heading 3</h3>
            <h4 className="text-lg font-mono font-bold theme-text-tertiary">Heading 4</h4>
          </div>
          
          <div className="space-y-2">
            <p className="theme-text">
              This is primary text content that uses the main text color from the theme.
            </p>
            <p className="theme-text-secondary">
              Secondary text is used for descriptions, captions, and less important content.
            </p>
            <p className="theme-text-tertiary text-sm">
              Tertiary text appears muted and is used for metadata, timestamps, and labels.
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-mono theme-success">Success message styling</div>
            <div className="text-xs font-mono theme-warning">Warning message styling</div>
            <div className="text-xs font-mono theme-error">Error message styling</div>
            <div className="text-xs font-mono theme-info">Info message styling</div>
          </div>
        </div>
      )
    },
    {
      title: 'Effects & Animations',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 pixel-border relative ${hasEffect('scanlines') ? 'theme-scanlines' : ''}`}
              style={{
                backgroundColor: getColor('backgroundTertiary'),
                borderColor: getColor('borderSecondary')
              }}
            >
              <h4 className="font-mono font-bold mb-2">Scanlines Effect</h4>
              <p className="text-sm theme-text-secondary">
                {hasEffect('scanlines') ? 'Scanlines are active' : 'Scanlines are disabled'}
              </p>
            </div>
            
            <div 
              className={`p-4 pixel-border ${hasEffect('crtEffect') ? 'theme-crt' : ''}`}
              style={{
                backgroundColor: getColor('backgroundTertiary'),
                borderColor: getColor('borderSecondary')
              }}
            >
              <h4 className="font-mono font-bold mb-2">CRT Effect</h4>
              <p className="text-sm theme-text-secondary">
                {hasEffect('crtEffect') ? 'CRT effect is active' : 'CRT effect is disabled'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <motion.div 
              className="p-3 pixel-border text-center cursor-pointer"
              style={{
                backgroundColor: getColor('surface'),
                borderColor: getColor('border')
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              tabIndex={0}
              aria-label="Interactive hover demo element"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Add any click behavior here if needed
                }
              }}
            >
              <div className="text-xs font-mono">Hover me</div>
            </motion.div>
            
            <motion.div 
              className="p-3 pixel-border text-center theme-glow cursor-pointer"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              tabIndex={0}
              aria-label="Interactive 3D hover demo element"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Add any click behavior here if needed
                }
              }}
            >
              <div className="text-xs font-mono">3D Hover</div>
            </motion.div>
            
            <motion.div 
              className="p-3 pixel-border text-center cursor-pointer"
              style={{
                backgroundColor: getColor('primary') + '20',
                borderColor: getColor('primary')
              }}
              animate={{ 
                boxShadow: [
                  `0 0 0 ${getColor('primary')}00`,
                  `0 0 20px ${getColor('primary')}80`,
                  `0 0 0 ${getColor('primary')}00`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              role="button"
              tabIndex={0}
              aria-label="Interactive pulse animation demo element"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Add any click behavior here if needed
                }
              }}
            >
              <div className="text-xs font-mono">Pulse</div>
            </motion.div>
          </div>
        </div>
      )
    }
  ]

  const handleExportDemo = () => {
    const exported = exportCurrentTheme()
    const blob = new Blob([exported], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTheme.id}-demo-export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen theme-background">
      {/* Header */}
      <div className="sticky top-0 z-40 theme-background-secondary border-b theme-border-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <PaintBrushIcon className="h-8 w-8 theme-primary" />
              <div>
                <h1 className="font-mono text-xl md:text-2xl font-bold theme-primary">
                  <MatrixTextReveal 
                    text="Advanced Theming System" 
                    speed={70}
                    delay={300}
                    scrambleDuration={250}
                    className="inline-block"
                  />
                </h1>
                <p className="font-mono text-sm theme-text-secondary">
                  Interactive demonstration of the pixel blog theme engine
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle variant="advanced" showLabel />
              <button
                onClick={() => setShowCreator(true)}
                className="flex items-center space-x-2 px-3 py-2 pixel-border theme-surface hover:theme-surface-hover transition-all duration-200 font-mono text-sm"
              >
                <SparklesIcon className="h-4 w-4" />
                <span>Create Theme</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Theme Info */}
        <motion.div
          key={currentTheme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 theme-card p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="font-mono text-xl font-bold theme-primary">
                  {currentTheme.name}
                </h2>
                {isTransitioning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full theme-primary"
                  />
                )}
              </div>
              <p className="theme-text-secondary">{currentTheme.description}</p>
              <div className="flex items-center space-x-4 text-xs font-mono theme-text-tertiary">
                <span>ID: {currentTheme.id}</span>
                <span>Author: {currentTheme.metadata.author}</span>
                <span>Version: {currentTheme.metadata.version}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentTheme.metadata.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 pixel-border text-xs font-mono"
                    style={{
                      backgroundColor: getColor('surface'),
                      color: getColor('textTertiary'),
                      borderColor: getColor('borderSecondary')
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeSelector />
              <button
                onClick={handleExportDemo}
                className="flex items-center space-x-2 px-3 py-2 pixel-border theme-info theme-surface hover:theme-surface-hover font-mono text-sm"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Theme Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-card p-4 text-center">
            <SwatchIcon className="h-8 w-8 theme-primary mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold theme-text">
              {availableThemes.length}
            </div>
            <div className="font-mono text-xs theme-text-secondary">Built-in Themes</div>
          </div>
          
          <div className="theme-card p-4 text-center">
            <SparklesIcon className="h-8 w-8 theme-accent1 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold theme-text">
              {customThemes.length}
            </div>
            <div className="font-mono text-xs theme-text-secondary">Custom Themes</div>
          </div>
          
          <div className="theme-card p-4 text-center">
            <CpuChipIcon className="h-8 w-8 theme-accent2 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold theme-text">
              {Object.keys(currentTheme.effects).filter(key => currentTheme.effects[key as keyof typeof currentTheme.effects]).length}
            </div>
            <div className="font-mono text-xs theme-text-secondary">Active Effects</div>
          </div>
          
          <div className="theme-card p-4 text-center">
            <BeakerIcon className="h-8 w-8 theme-accent3 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold theme-text">
              {Object.keys(currentTheme.colors).length}
            </div>
            <div className="font-mono text-xs theme-text-secondary">Color Variables</div>
          </div>
        </div>

        {/* Demo Components */}
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <EyeIcon className="h-6 w-6 theme-primary" />
            <h2 className="font-mono text-xl font-bold theme-text">Component Showcase</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {demoComponents.map((demo, index) => (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="theme-card p-6 space-y-4"
              >
                <h3 className="font-mono text-lg font-bold theme-primary flex items-center space-x-2">
                  <CodeBracketIcon className="h-5 w-5" />
                  <span>{demo.title}</span>
                </h3>
                {demo.content}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CSS Variables Display */}
        <div className="mt-12 theme-card p-6">
          <h3 className="font-mono text-lg font-bold theme-primary mb-4 flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>CSS Variables</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            {Object.entries(currentTheme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 pixel-border flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1 min-w-0">
                  <div className="theme-text-secondary truncate">--theme-{key}</div>
                  <div className="theme-text-tertiary truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Creator Modal */}
      <ThemeCreator 
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        baseTheme={currentTheme}
      />
    </div>
  )
}