'use client'

import { useState } from 'react'
import SearchBar from '@/app/components/SearchBar'

interface BlogSearchWrapperProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function BlogSearchWrapper({ 
  placeholder = "Search posts...", 
  className = "",
  onSearch 
}: BlogSearchWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <SearchBar
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder={placeholder}
      className={className}
    />
  )
} 