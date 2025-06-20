'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SwatchIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/app/contexts/ThemeContext'
import { ThemeConfig, isAccessibilityCompliant } from '@/app/lib/themes'

interface ThemeSelectorProps {
  compact?: boolean
  showPreview?: boolean
  className?: string
}

interface ThemePreviewProps {
  theme: ThemeConfig
  isActive: boolean
  isCustom?: boolean
  onSelect: () => void
  onPreview: () => void
  onDelete?: () => void
  className?: string
}

function ThemePreview({ 
  theme, 
  isActive, 
  isCustom = false, 
  onSelect, 
  onPreview, 
  onDelete,
  className = '' 
}: ThemePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handlePreviewStart = () => {
    setIsPreviewMode(true)
    onPreview()
  }

  const handlePreviewEnd = () => {
    setIsPreviewMode(false)
  }

  const isAccessible = isAccessibilityCompliant(theme)

  return (
    <motion.div
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Theme Preview Card */}
      <div
        className={`
          relative overflow-hidden pixel-border transition-all duration-200
          ${isActive ? 'ring-2 ring-current' : ''}
          ${isPreviewMode ? 'ring-2 ring-yellow-400' : ''}
        `}
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        {/* Color Palette Display */}
        <div className="p-3 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 
                className="font-mono text-sm font-bold truncate"
                style={{ color: theme.colors.primary }}
              >
                {theme.name}
              </h3>
              <p 
                className="text-xs opacity-75 line-clamp-2"
                style={{ color: theme.colors.textSecondary }}
              >
                {theme.description}
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex flex-col items-end space-y-1">
              {isActive && (
                <CheckIcon 
                  className="h-4 w-4"
                  style={{ color: theme.colors.success }}
                />
              )}
              {!isAccessible && (
                <ExclamationTriangleIcon 
                  className="h-3 w-3"
                  style={{ color: theme.colors.warning }}
                  title="Accessibility warning: Low contrast ratio"
                />
              )}
              {isCustom && (
                <SparklesIcon 
                  className="h-3 w-3"
                  style={{ color: theme.colors.accent1 }}
                  title="Custom theme"
                />
              )}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="grid grid-cols-6 gap-1">
            {[
              theme.colors.primary,
              theme.colors.background,
              theme.colors.surface,
              theme.colors.accent1,
              theme.colors.accent2,
              theme.colors.accent3
            ].map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 pixel-border"
                style={{ backgroundColor: color }}
                title={`Color ${index + 1}: ${color}`}
              />
            ))}
          </div>

          {/* Effects Preview */}
          <div className="flex items-center space-x-2 text-xs">
            {theme.effects.scanlines && (
              <span 
                className="px-1 py-0.5 pixel-border font-mono"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textTertiary,
                  borderColor: theme.colors.borderSecondary
                }}
              >
                Scan
              </span>
            )}
            {theme.effects.glow && (
              <span 
                className="px-1 py-0.5 pixel-border font-mono"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textTertiary,
                  borderColor: theme.colors.borderSecondary
                }}
              >
                Glow
              </span>
            )}
            {theme.effects.crtEffect && (
              <span 
                className="px-1 py-0.5 pixel-border font-mono"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textTertiary,
                  borderColor: theme.colors.borderSecondary
                }}
              >
                CRT
              </span>
            )}
          </div>
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-2 space-y-2"
              style={{ backgroundColor: theme.colors.backgroundOverlay }}
            >
              <div className="flex items-center space-x-1">
                <button
                  onClick={onSelect}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 pixel-border font-mono text-xs transition-all duration-200"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.textInverse,
                    borderColor: theme.colors.primary
                  }}
                >
                  <CheckIcon className="h-3 w-3" />
                  <span>Select</span>
                </button>
                
                <button
                  onMouseEnter={handlePreviewStart}
                  onMouseLeave={handlePreviewEnd}
                  className="px-2 py-1 pixel-border font-mono text-xs transition-all duration-200"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }}
                  title="Hover to preview"
                >
                  <EyeIcon className="h-3 w-3" />
                </button>

                {isCustom && onDelete && (
                  <button
                    onClick={onDelete}
                    className="px-2 py-1 pixel-border font-mono text-xs transition-all duration-200"
                    style={{ 
                      backgroundColor: theme.colors.error,
                      color: theme.colors.textInverse,
                      borderColor: theme.colors.error
                    }}
                    title="Delete custom theme"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function ThemeSelector({ 
  compact = false, 
  showPreview = true,
  className = '' 
}: ThemeSelectorProps) {
  const {
    currentTheme,
    availableThemes,
    customThemes,
    setTheme,
    previewTheme,
    cancelPreview,
    exportCurrentTheme,
    importTheme,
    deleteCustomTheme,
    preferences,
    updatePreferences,
    accessibilityMode,
    setAccessibilityMode
  } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'built-in' | 'custom' | 'settings'>('built-in')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')
  const [importError, setImportError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const allThemes = [...availableThemes, ...customThemes]

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId)
    cancelPreview()
  }

  const handleThemePreview = (themeId: string) => {
    if (showPreview) {
      previewTheme(themeId)
    }
  }

  const handleExport = () => {
    const exported = exportCurrentTheme()
    const blob = new Blob([exported], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTheme.id}-theme.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportFromFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (importTheme(content)) {
        setImportError('')
        setShowImportDialog(false)
      } else {
        setImportError('Invalid theme file format')
      }
    }
    reader.readAsText(file)
  }

  const handleImportFromText = () => {
    if (importTheme(importData)) {
      setImportError('')
      setImportData('')
      setShowImportDialog(false)
    } else {
      setImportError('Invalid JSON format or missing required fields')
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 pixel-border 
          bg-gray-800 text-green-400 border-green-400 
          hover:bg-gray-700 transition-all duration-200 font-mono text-sm
          ${compact ? 'px-2 py-1' : ''}
        `}
        title="Open theme selector"
      >
        <SwatchIcon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
        {!compact && <span>Themes</span>}
      </button>

      {/* Theme Selector Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`
                absolute ${compact ? 'right-0 top-12' : 'right-0 top-16'} 
                w-96 max-h-[80vh] overflow-hidden
                pixel-border bg-gray-900/95 backdrop-blur-md z-50
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <PaintBrushIcon className="h-5 w-5 text-green-400" />
                  <h3 className="font-mono text-lg text-white font-bold">Theme Selector</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-700">
                {[
                  { id: 'built-in', label: 'Built-in', count: availableThemes.length },
                  { id: 'custom', label: 'Custom', count: customThemes.length },
                  { id: 'settings', label: 'Settings', count: 0 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 font-mono text-sm transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="px-1 py-0.5 bg-gray-700 text-xs rounded">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {/* Built-in Themes */}
                {activeTab === 'built-in' && (
                  <div className="p-4 space-y-3">
                    {availableThemes.map(theme => (
                      <ThemePreview
                        key={theme.id}
                        theme={theme}
                        isActive={currentTheme.id === theme.id}
                        onSelect={() => handleThemeSelect(theme.id)}
                        onPreview={() => handleThemePreview(theme.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Custom Themes */}
                {activeTab === 'custom' && (
                  <div className="p-4 space-y-3">
                    {customThemes.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <PaintBrushIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-mono text-sm">No custom themes yet</p>
                        <p className="font-mono text-xs mt-1">Import or create your own themes</p>
                      </div>
                    ) : (
                      customThemes.map(theme => (
                        <ThemePreview
                          key={theme.id}
                          theme={theme}
                          isActive={currentTheme.id === theme.id}
                          isCustom={true}
                          onSelect={() => handleThemeSelect(theme.id)}
                          onPreview={() => handleThemePreview(theme.id)}
                          onDelete={() => deleteCustomTheme(theme.id)}
                        />
                      ))
                    )}

                    {/* Import/Export Actions */}
                    <div className="pt-4 border-t border-gray-700 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleExport}
                          className="flex items-center justify-center space-x-1 px-3 py-2 pixel-border bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 font-mono text-xs"
                        >
                          <DocumentArrowDownIcon className="h-3 w-3" />
                          <span>Export</span>
                        </button>
                        <button
                          onClick={() => setShowImportDialog(true)}
                          className="flex items-center justify-center space-x-1 px-3 py-2 pixel-border bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 font-mono text-xs"
                        >
                          <DocumentArrowUpIcon className="h-3 w-3" />
                          <span>Import</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                  <div className="p-4 space-y-4">
                    {/* Preferences */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-sm text-green-400 font-semibold flex items-center">
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                        Preferences
                      </h4>
                      
                      <div className="space-y-2">
                        <label className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-300">Enable Transitions</span>
                          <input
                            type="checkbox"
                            checked={preferences.enableTransitions}
                            onChange={(e) => updatePreferences({ enableTransitions: e.target.checked })}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-4 pixel-border cursor-pointer transition-colors ${
                              preferences.enableTransitions ? 'bg-green-400' : 'bg-gray-600'
                            }`}
                            onClick={() => updatePreferences({ enableTransitions: !preferences.enableTransitions })}
                          >
                            <div
                              className={`w-3 h-3 bg-white transition-transform ${
                                preferences.enableTransitions ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-300">Enable Effects</span>
                          <input
                            type="checkbox"
                            checked={preferences.enableEffects}
                            onChange={(e) => updatePreferences({ enableEffects: e.target.checked })}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-4 pixel-border cursor-pointer transition-colors ${
                              preferences.enableEffects ? 'bg-green-400' : 'bg-gray-600'
                            }`}
                            onClick={() => updatePreferences({ enableEffects: !preferences.enableEffects })}
                          >
                            <div
                              className={`w-3 h-3 bg-white transition-transform ${
                                preferences.enableEffects ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-300">Auto Save</span>
                          <input
                            type="checkbox"
                            checked={preferences.autoSave}
                            onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-4 pixel-border cursor-pointer transition-colors ${
                              preferences.autoSave ? 'bg-green-400' : 'bg-gray-600'
                            }`}
                            onClick={() => updatePreferences({ autoSave: !preferences.autoSave })}
                          >
                            <div
                              className={`w-3 h-3 bg-white transition-transform ${
                                preferences.autoSave ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-300">Accessibility Mode</span>
                          <input
                            type="checkbox"
                            checked={accessibilityMode}
                            onChange={(e) => setAccessibilityMode(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-4 pixel-border cursor-pointer transition-colors ${
                              accessibilityMode ? 'bg-green-400' : 'bg-gray-600'
                            }`}
                            onClick={() => setAccessibilityMode(!accessibilityMode)}
                          >
                            <div
                              className={`w-3 h-3 bg-white transition-transform ${
                                accessibilityMode ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Current Theme Info */}
                    <div className="pt-4 border-t border-gray-700 space-y-2">
                      <h4 className="font-mono text-sm text-green-400 font-semibold">Current Theme</h4>
                      <div className="space-y-1 text-xs font-mono text-gray-300">
                        <div>Name: {currentTheme.name}</div>
                        <div>ID: {currentTheme.id}</div>
                        <div>Version: {currentTheme.metadata.version}</div>
                        <div>Author: {currentTheme.metadata.author}</div>
                        <div className="flex items-center space-x-2">
                          <span>Accessible:</span>
                          {isAccessibilityCompliant(currentTheme) ? (
                            <CheckIcon className="h-3 w-3 text-green-400" />
                          ) : (
                            <ExclamationTriangleIcon className="h-3 w-3 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Import Dialog */}
      <AnimatePresence>
        {showImportDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowImportDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 pixel-border bg-gray-900/95 backdrop-blur-md z-50"
            >
              <div className="p-4 space-y-4">
                <h3 className="font-mono text-lg text-white font-bold">Import Theme</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleImportFromFile}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 pixel-border bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 font-mono text-sm"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4" />
                    <span>Import from File</span>
                  </button>
                  
                  <div className="text-center text-gray-400 font-mono text-xs">or</div>
                  
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste theme JSON here..."
                    className="w-full h-32 p-2 bg-gray-800 border border-gray-600 text-white font-mono text-xs resize-none focus:border-green-400 focus:outline-none"
                  />
                  
                  {importError && (
                    <div className="text-red-400 font-mono text-xs">{importError}</div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleImportFromText}
                      disabled={!importData.trim()}
                      className="flex-1 px-4 py-2 pixel-border bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => {
                        setShowImportDialog(false)
                        setImportData('')
                        setImportError('')
                      }}
                      className="px-4 py-2 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 font-mono text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  )
}