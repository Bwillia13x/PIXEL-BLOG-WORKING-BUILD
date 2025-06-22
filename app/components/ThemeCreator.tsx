'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  SwatchIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/app/contexts/ThemeContext'
import { ThemeConfig, ThemeColors, isAccessibleTheme, RETRO_THEMES } from '@/app/lib/themes'

interface ThemeCreatorProps {
  isOpen: boolean
  onClose: () => void
  baseTheme?: ThemeConfig
  className?: string
}

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
  required?: boolean
}

function ColorInput({ label, value, onChange, description, required = false }: ColorInputProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-sm text-gray-300 flex items-center space-x-1">
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>
        {description && (
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <InformationCircleIcon className="h-4 w-4 text-gray-500 cursor-help" />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-800 border border-gray-600 text-xs text-gray-300 z-10"
                >
                  {description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 pixel-border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 text-white font-mono text-xs focus:border-green-400 focus:outline-none"
        />
      </div>
    </div>
  )
}

export default function ThemeCreator({ 
  isOpen, 
  onClose, 
  baseTheme,
  className = '' 
}: ThemeCreatorProps) {
  const { createCustomTheme, previewTheme, cancelPreview } = useTheme()
  
  // Initialize with base theme or default values
  const [themeData, setThemeData] = useState<Partial<ThemeConfig>>(() => {
    if (baseTheme) {
      return {
        ...baseTheme,
        id: `${baseTheme.id}-custom-${Date.now()}`,
        name: `${baseTheme.name} Custom`,
        metadata: {
          ...baseTheme.metadata,
          author: 'Custom User',
          created: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    }
    
    return {
      id: `custom-theme-${Date.now()}`,
      name: 'My Custom Theme',
      description: 'A custom theme created with the theme builder',
      colors: {
        primary: '#00ff41',
        primaryHover: '#00cc33',
        primaryFocus: '#00ff41',
        background: '#000000',
        backgroundSecondary: '#0a0a0a',
        backgroundTertiary: '#111111',
        backgroundOverlay: 'rgba(0, 0, 0, 0.9)',
        surface: '#0f0f0f',
        surfaceHover: '#1a1a1a',
        surfaceActive: '#262626',
        text: '#00ff41',
        textSecondary: '#00cc33',
        textTertiary: '#008822',
        textInverse: '#000000',
        border: '#00ff41',
        borderSecondary: '#00cc33',
        borderAccent: '#00ff41',
        success: '#00ff41',
        warning: '#ffff00',
        error: '#ff0040',
        info: '#0080ff',
        accent1: '#00ffff',
        accent2: '#ff00ff',
        accent3: '#ffff00',
        glow: '#00ff41',
        shadow: 'rgba(0, 255, 65, 0.3)',
        gradient: 'linear-gradient(135deg, #000000 0%, #0a1a0a 100%)'
      },
      fonts: {
        primary: 'JetBrains Mono, Consolas, monospace',
        secondary: 'VT323, monospace',
        mono: 'JetBrains Mono, monospace'
      },
      effects: {
        scanlines: true,
        glow: true,
        pixelBorder: true,
        crtEffect: true
      },
      accessibility: {
        contrastRatio: 14.3,
        reduceMotion: false,
        highContrast: false
      },
      metadata: {
        author: 'Custom User',
        version: '1.0.0',
        created: new Date().toISOString(),
        tags: ['custom', 'user-created']
      }
    }
  })

  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'effects' | 'preview'>('colors')
  const [errors, setErrors] = useState<string[]>([])
  const [isPreviewing, setIsPreviewing] = useState(false)

  // Validate theme data
  const validation = useMemo(() => {
    const newErrors: string[] = []
    const warnings: string[] = []

    if (!themeData.name?.trim()) {
      newErrors.push('Theme name is required')
    }

    if (!themeData.id?.trim()) {
      newErrors.push('Theme ID is required')
    }

    if (themeData.colors) {
      // Check required colors
      const requiredColors = ['primary', 'background', 'text']
      requiredColors.forEach(color => {
        if (!themeData.colors![color as keyof ThemeColors]) {
          newErrors.push(`${color} color is required`)
        }
      })

      // Check accessibility
      if (themeData.colors.text && themeData.colors.background) {
        const contrast = calculateContrast(themeData.colors.text, themeData.colors.background)
        if (contrast < 4.5) {
          warnings.push(`Low contrast ratio: ${contrast.toFixed(1)}:1 (WCAG recommends 4.5:1+)`)
        }
      }
    }

    return { errors: newErrors, warnings, isValid: newErrors.length === 0 }
  }, [themeData])

  // Update theme data
  const updateThemeData = useCallback((updates: Partial<ThemeConfig>) => {
    setThemeData(prev => ({ ...prev, ...updates }))
  }, [])

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    setThemeData(prev => ({
      ...prev,
      colors: { ...prev.colors!, ...colors }
    }))
  }, [])

  // Preview handlers
  const handlePreview = useCallback(() => {
    if (validation.isValid && themeData as ThemeConfig) {
      previewTheme(themeData.id!)
      setIsPreviewing(true)
    }
  }, [validation.isValid, themeData, previewTheme])

  const handleStopPreview = useCallback(() => {
    cancelPreview()
    setIsPreviewing(false)
  }, [cancelPreview])

  // Save theme
  const handleSave = useCallback(() => {
    if (validation.isValid && themeData as ThemeConfig) {
      if (createCustomTheme(themeData as ThemeConfig)) {
        onClose()
        if (isPreviewing) {
          handleStopPreview()
        }
      }
    }
  }, [validation.isValid, themeData, createCustomTheme, onClose, isPreviewing, handleStopPreview])

  // Clone from existing theme
  const handleCloneTheme = useCallback((themeId: string) => {
    const sourceTheme = RETRO_THEMES[themeId]
    if (sourceTheme) {
      setThemeData({
        ...sourceTheme,
        id: `${themeId}-clone-${Date.now()}`,
        name: `${sourceTheme.name} Clone`,
        metadata: {
          ...sourceTheme.metadata,
          author: 'Custom User',
          created: new Date().toISOString(),
          version: '1.0.0'
        }
      })
    }
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-4xl max-h-[90vh] overflow-hidden pixel-border bg-gray-900/95 backdrop-blur-md ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-green-400" />
              <h2 className="font-mono text-lg text-white font-bold">Theme Creator</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {isPreviewing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-400 pixel-border border-blue-500/50 font-mono text-xs"
                >
                  <EyeIcon className="h-3 w-3" />
                  <span>Previewing</span>
                </motion.div>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-200px)]">
            {/* Left Panel - Configuration */}
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-700">
                {[
                  { id: 'colors', label: 'Colors', icon: SwatchIcon },
                  { id: 'fonts', label: 'Fonts', icon: DocumentDuplicateIcon },
                  { id: 'effects', label: 'Effects', icon: AdjustmentsHorizontalIcon },
                  { id: 'preview', label: 'Preview', icon: EyeIcon }
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
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Basic Info */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-sm text-gray-300 mb-2">
                        Theme Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={themeData.name || ''}
                        onChange={(e) => updateThemeData({ name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white font-mono text-sm focus:border-green-400 focus:outline-none"
                        placeholder="My Awesome Theme"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-mono text-sm text-gray-300 mb-2">
                        Theme ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={themeData.id || ''}
                        onChange={(e) => updateThemeData({ id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white font-mono text-sm focus:border-green-400 focus:outline-none"
                        placeholder="my-awesome-theme"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-mono text-sm text-gray-300 mb-2">Description</label>
                    <textarea
                      value={themeData.description || ''}
                      onChange={(e) => updateThemeData({ description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white font-mono text-sm focus:border-green-400 focus:outline-none resize-none"
                      rows={2}
                      placeholder="A custom theme that perfectly matches my style..."
                    />
                  </div>
                </div>

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-sm text-green-400 font-semibold">Color Palette</h3>
                      <div className="flex space-x-2">
                        {Object.keys(RETRO_THEMES).slice(0, 4).map(themeId => (
                          <button
                            key={themeId}
                            onClick={() => handleCloneTheme(themeId)}
                            className="flex items-center space-x-1 px-2 py-1 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 font-mono text-xs"
                            title={`Clone ${RETRO_THEMES[themeId].name}`}
                          >
                            <div 
                              className="w-3 h-3 pixel-border"
                              style={{ backgroundColor: RETRO_THEMES[themeId].colors.primary }}
                            />
                            <span>Clone</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Primary Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Primary</h4>
                        <ColorInput
                          label="Primary"
                          value={themeData.colors?.primary || '#00ff41'}
                          onChange={(value) => updateColors({ primary: value })}
                          description="Main brand color used for buttons, links, and highlights"
                          required
                        />
                        <ColorInput
                          label="Primary Hover"
                          value={themeData.colors?.primaryHover || '#00cc33'}
                          onChange={(value) => updateColors({ primaryHover: value })}
                          description="Darker variant for hover states"
                        />
                        <ColorInput
                          label="Primary Focus"
                          value={themeData.colors?.primaryFocus || '#00ff41'}
                          onChange={(value) => updateColors({ primaryFocus: value })}
                          description="Color for focus rings and active states"
                        />
                      </div>

                      {/* Background Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Background</h4>
                        <ColorInput
                          label="Background"
                          value={themeData.colors?.background || '#000000'}
                          onChange={(value) => updateColors({ background: value })}
                          description="Main background color"
                          required
                        />
                        <ColorInput
                          label="Secondary"
                          value={themeData.colors?.backgroundSecondary || '#0a0a0a'}
                          onChange={(value) => updateColors({ backgroundSecondary: value })}
                          description="Secondary background for cards and sections"
                        />
                        <ColorInput
                          label="Tertiary"
                          value={themeData.colors?.backgroundTertiary || '#111111'}
                          onChange={(value) => updateColors({ backgroundTertiary: value })}
                          description="Tertiary background for nested elements"
                        />
                      </div>

                      {/* Text Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Text</h4>
                        <ColorInput
                          label="Text"
                          value={themeData.colors?.text || '#00ff41'}
                          onChange={(value) => updateColors({ text: value })}
                          description="Primary text color"
                          required
                        />
                        <ColorInput
                          label="Secondary"
                          value={themeData.colors?.textSecondary || '#00cc33'}
                          onChange={(value) => updateColors({ textSecondary: value })}
                          description="Secondary text for descriptions and captions"
                        />
                        <ColorInput
                          label="Tertiary"
                          value={themeData.colors?.textTertiary || '#008822'}
                          onChange={(value) => updateColors({ textTertiary: value })}
                          description="Muted text for labels and metadata"
                        />
                      </div>

                      {/* Accent Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Accents</h4>
                        <ColorInput
                          label="Accent 1"
                          value={themeData.colors?.accent1 || '#00ffff'}
                          onChange={(value) => updateColors({ accent1: value })}
                          description="First accent color for variety"
                        />
                        <ColorInput
                          label="Accent 2"
                          value={themeData.colors?.accent2 || '#ff00ff'}
                          onChange={(value) => updateColors({ accent2: value })}
                          description="Second accent color"
                        />
                        <ColorInput
                          label="Accent 3"
                          value={themeData.colors?.accent3 || '#ffff00'}
                          onChange={(value) => updateColors({ accent3: value })}
                          description="Third accent color"
                        />
                      </div>

                      {/* Status Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Status</h4>
                        <ColorInput
                          label="Success"
                          value={themeData.colors?.success || '#00ff41'}
                          onChange={(value) => updateColors({ success: value })}
                          description="Color for success messages and states"
                        />
                        <ColorInput
                          label="Warning"
                          value={themeData.colors?.warning || '#ffff00'}
                          onChange={(value) => updateColors({ warning: value })}
                          description="Color for warnings and cautions"
                        />
                        <ColorInput
                          label="Error"
                          value={themeData.colors?.error || '#ff0040'}
                          onChange={(value) => updateColors({ error: value })}
                          description="Color for errors and destructive actions"
                        />
                      </div>

                      {/* Effects Colors */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-xs text-gray-400 font-semibold uppercase">Effects</h4>
                        <ColorInput
                          label="Glow"
                          value={themeData.colors?.glow || '#00ff41'}
                          onChange={(value) => updateColors({ glow: value })}
                          description="Color for glow effects and shadows"
                        />
                        <ColorInput
                          label="Border"
                          value={themeData.colors?.border || '#00ff41'}
                          onChange={(value) => updateColors({ border: value })}
                          description="Default border color"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Other tabs content would go here... */}
                {activeTab === 'fonts' && (
                  <div className="space-y-4">
                    <h3 className="font-mono text-sm text-green-400 font-semibold">Typography</h3>
                    <div className="text-gray-400 font-mono text-sm">
                      Font configuration coming soon...
                    </div>
                  </div>
                )}

                {activeTab === 'effects' && (
                  <div className="space-y-4">
                    <h3 className="font-mono text-sm text-green-400 font-semibold">Visual Effects</h3>
                    <div className="space-y-3">
                      {Object.entries(themeData.effects || {}).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="font-mono text-sm text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateThemeData({
                              effects: { ...themeData.effects!, [key]: e.target.checked }
                            })}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-4 pixel-border cursor-pointer transition-colors ${
                              value ? 'bg-green-400' : 'bg-gray-600'
                            }`}
                            onClick={() => updateThemeData({
                              effects: { ...themeData.effects!, [key]: !value }
                            })}
                          >
                            <div
                              className={`w-3 h-3 bg-white transition-transform ${
                                value ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-sm text-green-400 font-semibold">Live Preview</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handlePreview}
                          disabled={!validation.isValid}
                          className="flex items-center space-x-1 px-3 py-1 pixel-border bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs"
                        >
                          <EyeIcon className="h-3 w-3" />
                          <span>Preview</span>
                        </button>
                        {isPreviewing && (
                          <button
                            onClick={handleStopPreview}
                            className="flex items-center space-x-1 px-3 py-1 pixel-border bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 font-mono text-xs"
                          >
                            <XMarkIcon className="h-3 w-3" />
                            <span>Stop</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preview sample elements */}
                    <div className="space-y-4 p-4 pixel-border" style={{
                      backgroundColor: themeData.colors?.surface || '#0f0f0f',
                      borderColor: themeData.colors?.border || '#00ff41'
                    }}>
                      <div className="space-y-2">
                        <h4 
                          className="font-mono text-lg font-bold"
                          style={{ color: themeData.colors?.primary || '#00ff41' }}
                        >
                          Theme Preview
                        </h4>
                        <p 
                          className="font-mono text-sm"
                          style={{ color: themeData.colors?.text || '#00ff41' }}
                        >
                          This is how your theme will look in the application.
                        </p>
                        <p 
                          className="font-mono text-xs"
                          style={{ color: themeData.colors?.textSecondary || '#00cc33' }}
                        >
                          Secondary text appears in descriptions and metadata.
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          className="px-3 py-2 pixel-border font-mono text-xs"
                          style={{
                            backgroundColor: themeData.colors?.primary || '#00ff41',
                            color: themeData.colors?.textInverse || '#000000',
                            borderColor: themeData.colors?.primary || '#00ff41'
                          }}
                        >
                          Primary Button
                        </button>
                        <button 
                          className="px-3 py-2 pixel-border font-mono text-xs"
                          style={{
                            backgroundColor: themeData.colors?.surface || '#0f0f0f',
                            color: themeData.colors?.text || '#00ff41',
                            borderColor: themeData.colors?.border || '#00ff41'
                          }}
                        >
                          Secondary Button
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Success', color: themeData.colors?.success },
                          { label: 'Warning', color: themeData.colors?.warning },
                          { label: 'Error', color: themeData.colors?.error }
                        ].map(status => (
                          <div 
                            key={status.label}
                            className="p-2 pixel-border font-mono text-xs text-center"
                            style={{
                              backgroundColor: `${status.color}20`,
                              color: status.color,
                              borderColor: `${status.color}80`
                            }}
                          >
                            {status.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Validation & Actions */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-700 p-4 space-y-4">
              {/* Validation */}
              <div className="space-y-3">
                <h3 className="font-mono text-sm text-green-400 font-semibold">Validation</h3>
                
                {validation.errors.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-red-400 font-mono text-xs font-semibold">Errors:</div>
                    {validation.errors.map((error, index) => (
                      <div key={index} className="flex items-start space-x-1 text-red-400 font-mono text-xs">
                        <ExclamationTriangleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-yellow-400 font-mono text-xs font-semibold">Warnings:</div>
                    {validation.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-1 text-yellow-400 font-mono text-xs">
                        <ExclamationTriangleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.isValid && validation.warnings.length === 0 && (
                  <div className="flex items-center space-x-1 text-green-400 font-mono text-xs">
                    <CheckIcon className="h-3 w-3" />
                    <span>Theme is valid and ready to save</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  disabled={!validation.isValid}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 pixel-border bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Save Theme</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 font-mono text-sm"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>

              {/* Current Theme Info */}
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <h4 className="font-mono text-xs text-gray-400 font-semibold">Theme Info</h4>
                <div className="space-y-1 text-xs font-mono text-gray-300">
                  <div>Name: {themeData.name || 'Untitled'}</div>
                  <div>ID: {themeData.id || 'none'}</div>
                  <div>Colors: {Object.keys(themeData.colors || {}).length}/19</div>
                  <div className="flex items-center space-x-2">
                    <span>Accessible:</span>
                    {themeData as ThemeConfig && isAccessibleTheme(themeData as ThemeConfig) ? (
                      <CheckIcon className="h-3 w-3 text-green-400" />
                    ) : (
                      <ExclamationTriangleIcon className="h-3 w-3 text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}