"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
      title={`Current theme: ${isDark ? 'Dark' : 'Light'}. Click to switch to ${isDark ? 'light' : 'dark'} theme.`}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-green-400" aria-hidden="true" />
      ) : (
        <Moon className="w-6 h-6 text-green-400" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </button>
  )
}

export default ThemeToggle
