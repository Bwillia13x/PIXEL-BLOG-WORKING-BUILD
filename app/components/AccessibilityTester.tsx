"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  CommandLineIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  category: 'color-contrast' | 'keyboard-nav' | 'aria-labels' | 'structure' | 'focus-management'
  message: string
  element?: string
  suggestion?: string
  wcagLevel?: 'A' | 'AA' | 'AAA'
}

interface ContrastResult {
  ratio: number
  passes: {
    normalAA: boolean
    normalAAA: boolean
    largeAA: boolean
    largeAAA: boolean
  }
}

export default function AccessibilityTester() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'contrast' | 'keyboard' | 'structure'>('overview')
  const [contrastResults, setContrastResults] = useState<Array<{
    element: string
    foreground: string
    background: string
    result: ContrastResult
  }>>([])

  // Accessibility scanning functions
  const checkColorContrast = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []
    const contrastChecks: Array<{
      element: string
      foreground: string
      background: string
      result: ContrastResult
    }> = []

    // Helper to get computed color
    const getComputedColor = (element: Element, property: string): string => {
      return window.getComputedStyle(element).getPropertyValue(property)
    }

    // Helper to calculate contrast ratio
    const calculateContrast = (color1: string, color2: string): number => {
      const getLuminance = (color: string): number => {
        const rgb = color.match(/\d+/g)
        if (!rgb) return 0

        const [r, g, b] = rgb.map(val => {
          const normalized = parseInt(val) / 255
          return normalized <= 0.03928 
            ? normalized / 12.92 
            : Math.pow((normalized + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }

      const lum1 = getLuminance(color1)
      const lum2 = getLuminance(color2)
      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)

      return (brightest + 0.05) / (darkest + 0.05)
    }

    // Check text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, textarea')
    
    textElements.forEach((element) => {
      const style = window.getComputedStyle(element)
      const foreground = style.color
      const background = style.backgroundColor || style.getPropertyValue('background-color')
      
      if (foreground && background && background !== 'rgba(0, 0, 0, 0)') {
        const ratio = calculateContrast(foreground, background)
        const fontSize = parseFloat(style.fontSize)
        const fontWeight = style.fontWeight
        
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700))
        
        const result: ContrastResult = {
          ratio,
          passes: {
            normalAA: ratio >= 4.5,
            normalAAA: ratio >= 7,
            largeAA: ratio >= 3,
            largeAAA: ratio >= 4.5
          }
        }

        contrastChecks.push({
          element: element.tagName.toLowerCase() + (element.className ? `.${element.className.split(' ')[0]}` : ''),
          foreground,
          background,
          result
        })

        // Check if it passes WCAG standards
        const passesRequired = isLargeText ? result.passes.largeAA : result.passes.normalAA
        
        if (!passesRequired) {
          issues.push({
            type: 'error',
            category: 'color-contrast',
            message: `Insufficient color contrast ratio: ${ratio.toFixed(2)}:1`,
            element: element.tagName.toLowerCase(),
            suggestion: `Increase contrast to at least ${isLargeText ? '3:1' : '4.5:1'} for WCAG AA compliance`,
            wcagLevel: 'AA'
          })
        }
      }
    })

    setContrastResults(contrastChecks)
    return issues
  }

  const checkKeyboardNavigation = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []
    
    // Check for focusable elements without proper focus indicators
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element) => {
      const style = window.getComputedStyle(element)
      const outlineStyle = style.outline
      const focusRing = style.getPropertyValue('--focus-ring-color') || 
                       style.boxShadow?.includes('focus') ||
                       outlineStyle !== 'none'

      if (!focusRing) {
        issues.push({
          type: 'warning',
          category: 'keyboard-nav',
          message: 'Element lacks visible focus indicator',
          element: element.tagName.toLowerCase(),
          suggestion: 'Add focus ring or outline styles for keyboard navigation',
          wcagLevel: 'AA'
        })
      }
    })

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]:first-child, .skip-link')
    if (skipLinks.length === 0) {
      issues.push({
        type: 'error',
        category: 'keyboard-nav',
        message: 'No skip link found',
        suggestion: 'Add a skip-to-content link for keyboard users',
        wcagLevel: 'A'
      })
    }

    return issues
  }

  const checkAriaLabels = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    // Check buttons without labels
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      const hasLabel = button.getAttribute('aria-label') ||
                      button.getAttribute('aria-labelledby') ||
                      button.textContent?.trim() ||
                      button.querySelector('img')?.getAttribute('alt')

      if (!hasLabel) {
        issues.push({
          type: 'error',
          category: 'aria-labels',
          message: 'Button lacks accessible label',
          element: 'button',
          suggestion: 'Add aria-label, aria-labelledby, or descriptive text content',
          wcagLevel: 'A'
        })
      }
    })

    // Check inputs without labels
    const inputs = document.querySelectorAll('input:not([type="hidden"])')
    inputs.forEach((input) => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`)

      if (!hasLabel) {
        issues.push({
          type: 'error',
          category: 'aria-labels',
          message: 'Input lacks accessible label',
          element: 'input',
          suggestion: 'Add aria-label, aria-labelledby, or associate with a label element',
          wcagLevel: 'A'
        })
      }
    })

    // Check images without alt text
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        issues.push({
          type: 'error',
          category: 'aria-labels',
          message: 'Image lacks alternative text',
          element: 'img',
          suggestion: 'Add descriptive alt text or aria-label',
          wcagLevel: 'A'
        })
      }
    })

    return issues
  }

  const checkStructure = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.substring(1))
      
      if (currentLevel > previousLevel + 1) {
        issues.push({
          type: 'warning',
          category: 'structure',
          message: `Heading level skipped (h${previousLevel} to h${currentLevel})`,
          element: heading.tagName.toLowerCase(),
          suggestion: 'Use sequential heading levels for proper document structure',
          wcagLevel: 'AA'
        })
      }
      
      previousLevel = currentLevel
    })

    // Check for main landmark
    const main = document.querySelector('main, [role="main"]')
    if (!main) {
      issues.push({
        type: 'error',
        category: 'structure',
        message: 'No main landmark found',
        suggestion: 'Add a <main> element or role="main" to identify the main content area',
        wcagLevel: 'A'
      })
    }

    // Check for proper list structure
    const listItems = document.querySelectorAll('li')
    listItems.forEach((li) => {
      const parent = li.parentElement
      if (parent && !['UL', 'OL', 'MENU'].includes(parent.tagName)) {
        issues.push({
          type: 'error',
          category: 'structure',
          message: 'List item not contained in proper list element',
          element: 'li',
          suggestion: 'Ensure <li> elements are only used within <ul>, <ol>, or <menu>',
          wcagLevel: 'A'
        })
      }
    })

    return issues
  }

  const runAccessibilityScan = async () => {
    setIsScanning(true)
    
    // Wait a bit for animations
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const allIssues = [
      ...checkColorContrast(),
      ...checkKeyboardNavigation(),
      ...checkAriaLabels(),
      ...checkStructure()
    ]

    setIssues(allIssues)
    setIsScanning(false)
  }

  useEffect(() => {
    if (isOpen) {
      runAccessibilityScan()
    }
  }, [isOpen])

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-400" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
      case 'info':
        return <InformationCircleIcon className="w-4 h-4 text-blue-400" />
    }
  }

  const getIssuesByCategory = (category: AccessibilityIssue['category']) => {
    return issues.filter(issue => issue.category === category)
  }

  const getOverallScore = () => {
    const totalChecks = issues.length + 10 // Assume 10 passing checks for base score
    const passingChecks = totalChecks - issues.filter(issue => issue.type === 'error').length
    return Math.max(0, Math.round((passingChecks / totalChecks) * 100))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open accessibility checker"
      >
        <AdjustmentsHorizontalIcon className="w-5 h-5" />
      </button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-3">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-pixel text-white">Accessibility Checker</h2>
              <div className={`px-2 py-1 rounded text-xs font-mono ${
                getOverallScore() >= 90 ? 'bg-green-600 text-white' :
                getOverallScore() >= 70 ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                Score: {getOverallScore()}%
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close accessibility checker"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-gray-800">
            {[
              { id: 'overview', label: 'Overview', icon: EyeIcon },
              { id: 'contrast', label: 'Contrast', icon: EyeIcon },
              { id: 'keyboard', label: 'Keyboard', icon: CommandLineIcon },
              { id: 'structure', label: 'Structure', icon: DocumentTextIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400 bg-gray-700'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-mono">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 max-h-96">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-400 font-mono text-sm">Scanning accessibility...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800 p-4 rounded border border-gray-600">
                        <div className="text-2xl font-bold text-red-400">{issues.filter(i => i.type === 'error').length}</div>
                        <div className="text-sm text-gray-400">Errors</div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded border border-gray-600">
                        <div className="text-2xl font-bold text-yellow-400">{issues.filter(i => i.type === 'warning').length}</div>
                        <div className="text-sm text-gray-400">Warnings</div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded border border-gray-600">
                        <div className="text-2xl font-bold text-blue-400">{issues.filter(i => i.type === 'info').length}</div>
                        <div className="text-sm text-gray-400">Info</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {issues.slice(0, 10).map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded border border-gray-600">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <p className="text-white text-sm">{issue.message}</p>
                            {issue.element && (
                              <p className="text-gray-400 text-xs mt-1">Element: {issue.element}</p>
                            )}
                            {issue.suggestion && (
                              <p className="text-blue-400 text-xs mt-1">{issue.suggestion}</p>
                            )}
                          </div>
                          {issue.wcagLevel && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                              WCAG {issue.wcagLevel}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'contrast' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      WCAG requires contrast ratios of 4.5:1 for normal text and 3:1 for large text (AA level)
                    </div>
                    {contrastResults.map((result, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono text-sm">{result.element}</span>
                          <span className={`text-sm font-bold ${
                            result.result.ratio >= 4.5 ? 'text-green-400' : 
                            result.result.ratio >= 3 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {result.result.ratio.toFixed(2)}:1
                          </span>
                        </div>
                        <div className="flex space-x-4 text-xs">
                          <span className="flex items-center space-x-1">
                            <span className="w-3 h-3 rounded border border-gray-500" style={{backgroundColor: result.foreground}}></span>
                            <span className="text-gray-400">Text</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="w-3 h-3 rounded border border-gray-500" style={{backgroundColor: result.background}}></span>
                            <span className="text-gray-400">Background</span>
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                          <span className={`${result.result.passes.normalAA ? 'text-green-400' : 'text-red-400'}`}>
                            Normal AA: {result.result.passes.normalAA ? '✓' : '✗'}
                          </span>
                          <span className={`${result.result.passes.normalAAA ? 'text-green-400' : 'text-red-400'}`}>
                            Normal AAA: {result.result.passes.normalAAA ? '✓' : '✗'}
                          </span>
                          <span className={`${result.result.passes.largeAA ? 'text-green-400' : 'text-red-400'}`}>
                            Large AA: {result.result.passes.largeAA ? '✓' : '✗'}
                          </span>
                          <span className={`${result.result.passes.largeAAA ? 'text-green-400' : 'text-red-400'}`}>
                            Large AAA: {result.result.passes.largeAAA ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'keyboard' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      All interactive elements should be keyboard accessible with visible focus indicators
                    </div>
                    {getIssuesByCategory('keyboard-nav').map((issue, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded border border-gray-600">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <p className="text-white text-sm">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-blue-400 text-xs mt-1">{issue.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'structure' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Proper semantic structure helps screen readers navigate content
                    </div>
                    {getIssuesByCategory('structure').concat(getIssuesByCategory('aria-labels')).map((issue, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded border border-gray-600">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <p className="text-white text-sm">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-blue-400 text-xs mt-1">{issue.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Following WCAG 2.1 Guidelines • Last scan: {new Date().toLocaleTimeString()}
              </p>
              <button
                onClick={runAccessibilityScan}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Re-scan
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}