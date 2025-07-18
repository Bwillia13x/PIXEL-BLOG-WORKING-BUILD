'use client'

import { useState } from 'react'
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
interface SearchFiltersType {
  type: string[]
  category: string[]
  tags: string[]
  status: string[]
}

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  availableFilters: {
    categories: string[]
    tags: string[]
    statuses: string[]
  }
  totalResults: number
}

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="pixel-border bg-gray-900/60 backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between p-3 text-left
          hover:bg-gray-800/50 transition-colors duration-200
        "
      >
        <span className="font-mono text-sm text-green-400">{title}</span>
        <ChevronDownIcon className={`
          h-4 w-4 text-gray-400 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>
      
      {isOpen && (
        <div className="border-t border-gray-700 p-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
}

function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-2">
      {options.length === 0 ? (
        <p className="text-gray-500 text-xs font-mono">{placeholder}</p>
      ) : (
        options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="sr-only"
            />
            <div className={`
              w-4 h-4 pixel-border transition-all duration-200
              ${selected.includes(option) 
                ? 'bg-green-400 border-green-400' 
                : 'bg-transparent border-gray-500 group-hover:border-gray-400'
              }
            `}>
              {selected.includes(option) && (
                <div className="w-2 h-2 bg-gray-900 m-0.5" />
              )}
            </div>
            <span className={`
              text-xs font-mono transition-colors duration-200
              ${selected.includes(option) ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}
            `}>
              {option}
            </span>
          </label>
        ))
      )}
    </div>
  )
}

export default function SearchFilters({ 
  filters, 
  onFiltersChange, 
  availableFilters, 
  totalResults 
}: SearchFiltersProps) {
  const [openSections, setOpenSections] = useState({
    types: true,
    categories: false,
    tags: false,
    status: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearAllFilters = () => {
    onFiltersChange({
      type: [],
      category: [],
      tags: [],
      status: []
    })
  }

  const hasActiveFilters = 
    filters.category.length > 0 || 
    filters.tags.length > 0 || 
    filters.type.length > 0 || 
    filters.status.length > 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-green-400" />
          <h3 className="font-mono text-sm text-green-400">Filters</h3>
          <span className="text-xs text-gray-400 font-mono">
            ({totalResults} results)
          </span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="
              flex items-center space-x-1 text-xs text-gray-400 
              hover:text-white transition-colors duration-200 pixel-hover
            "
          >
            <XMarkIcon className="h-3 w-3" />
            <span className="font-mono">Clear</span>
          </button>
        )}
      </div>

      {/* Content Types */}
      <FilterSection
        title="Content Type"
        isOpen={openSections.types}
        onToggle={() => toggleSection('types')}
      >
        <MultiSelect
          options={['post', 'project']}
          selected={filters.type}
          onChange={(type) => onFiltersChange({ ...filters, type })}
          placeholder="No content types available"
        />
      </FilterSection>

      {/* Categories */}
      <FilterSection
        title="Categories"
        isOpen={openSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <MultiSelect
          options={availableFilters.categories}
          selected={filters.category}
          onChange={(category) => onFiltersChange({ ...filters, category })}
          placeholder="No categories found"
        />
      </FilterSection>

      {/* Tags */}
      <FilterSection
        title="Tags"
        isOpen={openSections.tags}
        onToggle={() => toggleSection('tags')}
      >
        <MultiSelect
          options={availableFilters.tags}
          selected={filters.tags}
          onChange={(tags) => onFiltersChange({ ...filters, tags })}
          placeholder="No tags found"
        />
      </FilterSection>

      {/* Project Status */}
      {availableFilters.statuses.length > 0 && (
        <FilterSection
          title="Project Status"
          isOpen={openSections.status}
          onToggle={() => toggleSection('status')}
        >
          <MultiSelect
            options={availableFilters.statuses}
            selected={filters.status}
            onChange={(status) => onFiltersChange({ ...filters, status })}
            placeholder="No project statuses available"
          />
        </FilterSection>
      )}


    </div>
  )
}