"use client"

import { useEffect, useState } from 'react'

interface AccessibilityIssue {
  type: 'warning' | 'error'
  message: string
  element?: string
  rule: string
}

export const AccessibilityTester: React.FC = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const runAccessibilityChecks = () => {
      const issues: AccessibilityIssue[] = []

      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.hasAttribute('aria-hidden')) {
          issues.push({
            type: 'error',
            message: `Image missing alt text`,
            element: `img[src="${img.src}"]`,
            rule: 'WCAG 1.1.1'
          })
        }
      })

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input) => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                        input.closest('label') ||
                        input.hasAttribute('aria-label') ||
                        input.hasAttribute('aria-labelledby')
        
        if (!hasLabel) {
          issues.push({
            type: 'error',
            message: `Form control missing accessible name`,
            element: input.tagName.toLowerCase(),
            rule: 'WCAG 3.3.2'
          })
        }
      })

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let lastLevel = 0
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > lastLevel + 1) {
          issues.push({
            type: 'warning',
            message: `Heading level skipped (h${lastLevel} to h${level})`,
            element: heading.tagName.toLowerCase(),
            rule: 'WCAG 1.3.1'
          })
        }
        lastLevel = level
      })

      // Check for interactive elements without proper roles
      const clickableElements = document.querySelectorAll('[onclick], [tabindex]:not(input):not(button):not(a)')
      clickableElements.forEach((element) => {
        if (!element.hasAttribute('role') || !element.hasAttribute('tabindex')) {
          issues.push({
            type: 'warning',
            message: `Interactive element missing proper role or tabindex`,
            element: element.tagName.toLowerCase(),
            rule: 'WCAG 4.1.2'
          })
        }
      })

      // Check color contrast (basic check)
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button')
      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element)
        const color = computedStyle.color
        const backgroundColor = computedStyle.backgroundColor
        
        // Basic contrast check (this is simplified - real contrast checking is more complex)
        if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
          issues.push({
            type: 'warning',
            message: `Potential low color contrast`,
            element: element.tagName.toLowerCase(),
            rule: 'WCAG 1.4.3'
          })
        }
      })

      setIssues(issues)
    }

    // Run checks after a delay to ensure DOM is fully rendered
    const timer = setTimeout(runAccessibilityChecks, 2000)
    
    // Re-run checks when DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(timer)
      setTimeout(runAccessibilityChecks, 500)
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  // Keyboard shortcut to toggle visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <div className="fixed top-4 right-4 z-[9999]">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono hover:bg-blue-700 transition-colors"
          title="Show accessibility checker (Ctrl+Shift+A)"
        >
          A11Y ({issues.length})
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-[9999]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">Accessibility Issues</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          aria-label="Close accessibility checker"
        >
          ×
        </button>
      </div>
      
      {issues.length === 0 ? (
        <div className="text-green-600 text-sm">
          ✅ No accessibility issues found!
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm border-l-4 ${
                issue.type === 'error'
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : 'bg-yellow-50 border-yellow-400 text-yellow-800'
              }`}
            >
              <div className="font-medium">
                {issue.type === 'error' ? '❌' : '⚠️'} {issue.message}
              </div>
              {issue.element && (
                <div className="text-xs mt-1 font-mono text-gray-600">
                  Element: {issue.element}
                </div>
              )}
              <div className="text-xs mt-1 text-gray-600">
                Rule: {issue.rule}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Press Ctrl+Shift+A to toggle this panel
      </div>
    </div>
  )
}

export default AccessibilityTester