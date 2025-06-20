'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  isLoading?: boolean
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search posts and projects...", 
  className = "",
  isLoading = false 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <div className={`
        pixel-border bg-gray-900/80 backdrop-blur-sm transition-all duration-200
        ${isFocused ? 'shadow-lg shadow-green-500/20 border-green-400' : 'border-gray-600'}
        ${isLoading ? 'animate-pulse' : ''}
      `}>
        <div className="flex items-center px-4 py-3">
          <MagnifyingGlassIcon className={`
            h-5 w-5 mr-3 transition-colors duration-200
            ${isFocused ? 'text-green-400' : 'text-gray-400'}
          `} />
          
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="
              flex-1 bg-transparent text-white placeholder-gray-400 
              focus:outline-none font-mono text-sm
            "
          />
          
          {value && (
            <button
              onClick={() => onChange('')}
              className="
                ml-2 p-1 text-gray-400 hover:text-white 
                transition-colors duration-200 pixel-hover
              "
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse" />
        )}
      </div>
      
      {isFocused && (
        <div className="absolute inset-0 -z-10 bg-green-400/5 pixel-border animate-pulse" />
      )}
    </div>
  )
}