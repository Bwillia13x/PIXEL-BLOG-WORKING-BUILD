'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { Project, CurrentProject } from '@/content/projects'

export interface ProjectFilters {
  search: string
  technologies: string[]
  status: ('completed' | 'in-progress' | 'planned')[]
  years: number[]
  featured: boolean | null
  categories: string[]
}

interface ProjectFiltersProps {
  projects: (Project | CurrentProject)[]
  filters: ProjectFilters
  onFiltersChange: (filters: ProjectFilters) => void
  className?: string
}

interface FilterSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}

function FilterSection({ title, icon: Icon, isOpen, onToggle, children, count }: FilterSectionProps) {
  return (
    <div className="pixel-border bg-gray-900/60 backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between p-3 text-left
          hover:bg-gray-800/50 transition-colors duration-200
        "
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-green-400" />
          <span className="font-mono text-sm text-green-400">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-gray-500 font-mono">({count})</span>
          )}
        </div>
        <ChevronDownIcon className={`
          h-4 w-4 text-gray-400 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-700"
          >
            <div className="p-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MultiSelectProps {
  options: { value: string; label: string; count: number }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchable?: boolean
}

function MultiSelect({ options, selected, onChange, placeholder, searchable = false }: MultiSelectProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, searchable])

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="
              w-full pl-7 pr-3 py-1 text-xs bg-gray-800 border border-gray-600 
              text-white placeholder-gray-500 focus:border-green-400 focus:outline-none 
              transition-colors duration-200 font-mono
            "
          />
        </div>
      )}

      <div className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {filteredOptions.length === 0 ? (
          <p className="text-gray-500 text-xs font-mono text-center py-2">
            {placeholder || 'No options available'}
          </p>
        ) : (
          filteredOptions.map(option => (
            <motion.label
              key={option.value}
              className="flex items-center justify-between cursor-pointer group p-1 hover:bg-gray-800/50 rounded transition-colors duration-200"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 pixel-border transition-all duration-200 flex items-center justify-center
                    ${selected.includes(option.value) 
                      ? 'bg-green-400 border-green-400' 
                      : 'bg-transparent border-gray-500 group-hover:border-gray-400'
                    }
                  `}>
                    {selected.includes(option.value) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-gray-900"
                      />
                    )}
                  </div>
                </div>
                <span className={`
                  text-xs font-mono transition-colors duration-200 truncate
                  ${selected.includes(option.value) ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}
                `}>
                  {option.label}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono ml-2">
                {option.count}
              </span>
            </motion.label>
          ))
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-400 font-mono">
            {selected.length} selected
          </span>
          <button
            onClick={() => onChange([])}
            className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 font-mono"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default function ProjectFilters({
  projects,
  filters,
  onFiltersChange,
  className = ""
}: ProjectFiltersProps) {
  const [openSections, setOpenSections] = useState({
    search: true,
    status: false,
    technologies: false,
    years: false,
    categories: false,
    featured: false
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Extract available filter options from projects
  const filterOptions = useMemo(() => {
    const technologies = new Map<string, number>()
    const years = new Map<number, number>()
    const categories = new Map<string, number>()
    const statuses = new Map<string, number>()

    projects.forEach(project => {
      // Technologies
      project.tags.forEach(tech => {
        technologies.set(tech, (technologies.get(tech) || 0) + 1)
      })

      // Years
      if (project.year) {
        years.set(project.year, (years.get(project.year) || 0) + 1)
      }

      // Categories (derived from first tag)
      const category = project.tags[0] || 'Other'
      categories.set(category, (categories.get(category) || 0) + 1)

      // Status
      statuses.set(project.status, (statuses.get(project.status) || 0) + 1)
    })

    return {
      technologies: Array.from(technologies.entries())
        .map(([tech, count]) => ({ value: tech, label: tech, count }))
        .sort((a, b) => b.count - a.count),
      
      years: Array.from(years.entries())
        .map(([year, count]) => ({ value: year.toString(), label: year.toString(), count }))
        .sort((a, b) => parseInt(b.value) - parseInt(a.value)),
      
      categories: Array.from(categories.entries())
        .map(([category, count]) => ({ value: category, label: category, count }))
        .sort((a, b) => b.count - a.count),
      
      statuses: Array.from(statuses.entries())
        .map(([status, count]) => ({ 
          value: status, 
          label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '), 
          count 
        }))
        .sort((a, b) => {
          const order = { 'Completed': 0, 'In progress': 1, 'Planned': 2 }
          return (order[a.label as keyof typeof order] ?? 3) - (order[b.label as keyof typeof order] ?? 3)
        })
    }
  }, [projects])

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      technologies: [],
      status: [],
      years: [],
      featured: null,
      categories: []
    })
  }

  const hasActiveFilters = 
    filters.search ||
    filters.technologies.length > 0 ||
    filters.status.length > 0 ||
    filters.years.length > 0 ||
    filters.featured !== null ||
    filters.categories.length > 0

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.technologies.length,
    filters.status.length,
    filters.years.length,
    filters.featured !== null ? 1 : 0,
    filters.categories.length
  ].reduce((sum, count) => sum + count, 0)

  const statusIcons = {
    'Completed': CheckCircleIcon,
    'In progress': ClockIcon,
    'Planned': ExclamationTriangleIcon
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-green-400" />
          <h3 className="font-mono text-sm text-green-400 font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-mono pixel-border border-green-500/50">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="
              flex items-center space-x-1 text-xs text-gray-400 
              hover:text-white transition-colors duration-200 pixel-hover font-mono
            "
          >
            <XMarkIcon className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search */}
      <FilterSection
        title="Search"
        icon={MagnifyingGlassIcon}
        isOpen={openSections.search}
        onToggle={() => toggleSection('search')}
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search projects..."
            className="
              w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 
              text-white placeholder-gray-500 focus:border-green-400 focus:outline-none 
              transition-colors duration-200 font-mono text-sm
            "
          />
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection
        title="Status"
        icon={AdjustmentsHorizontalIcon}
        isOpen={openSections.status}
        onToggle={() => toggleSection('status')}
        count={filterOptions.statuses.length}
      >
        <div className="space-y-2">
          {filterOptions.statuses.map(status => {
            const IconComponent = statusIcons[status.label as keyof typeof statusIcons]
            return (
              <motion.label
                key={status.value}
                className="flex items-center justify-between cursor-pointer group p-1 hover:bg-gray-800/50 rounded transition-colors duration-200"
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status.value as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onFiltersChange({
                          ...filters,
                          status: [...filters.status, status.value as any]
                        })
                      } else {
                        onFiltersChange({
                          ...filters,
                          status: filters.status.filter(s => s !== status.value)
                        })
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 pixel-border transition-all duration-200 flex items-center justify-center
                    ${filters.status.includes(status.value as any)
                      ? 'bg-green-400 border-green-400' 
                      : 'bg-transparent border-gray-500 group-hover:border-gray-400'
                    }
                  `}>
                    {filters.status.includes(status.value as any) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-gray-900"
                      />
                    )}
                  </div>
                  {IconComponent && <IconComponent className="h-3 w-3 text-gray-400" />}
                  <span className={`
                    text-xs font-mono transition-colors duration-200
                    ${filters.status.includes(status.value as any) ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {status.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {status.count}
                </span>
              </motion.label>
            )
          })}
        </div>
      </FilterSection>

      {/* Technologies */}
      <FilterSection
        title="Technologies"
        icon={TagIcon}
        isOpen={openSections.technologies}
        onToggle={() => toggleSection('technologies')}
        count={filterOptions.technologies.length}
      >
        <MultiSelect
          options={filterOptions.technologies}
          selected={filters.technologies}
          onChange={(technologies) => onFiltersChange({ ...filters, technologies })}
          placeholder="No technologies found"
          searchable={true}
        />
      </FilterSection>

      {/* Years */}
      <FilterSection
        title="Year"
        icon={CalendarIcon}
        isOpen={openSections.years}
        onToggle={() => toggleSection('years')}
        count={filterOptions.years.length}
      >
        <MultiSelect
          options={filterOptions.years}
          selected={filters.years.map(String)}
          onChange={(years) => onFiltersChange({ ...filters, years: years.map(Number) })}
          placeholder="No years found"
        />
      </FilterSection>

      {/* Categories */}
      <FilterSection
        title="Categories"
        icon={TagIcon}
        isOpen={openSections.categories}
        onToggle={() => toggleSection('categories')}
        count={filterOptions.categories.length}
      >
        <MultiSelect
          options={filterOptions.categories}
          selected={filters.categories}
          onChange={(categories) => onFiltersChange({ ...filters, categories })}
          placeholder="No categories found"
        />
      </FilterSection>

      {/* Featured */}
      <FilterSection
        title="Featured"
        icon={SparklesIcon}
        isOpen={openSections.featured}
        onToggle={() => toggleSection('featured')}
      >
        <div className="space-y-2">
          {[
            { value: null, label: 'All Projects' },
            { value: true, label: 'Featured Only' },
            { value: false, label: 'Non-Featured' }
          ].map(option => (
            <motion.label
              key={String(option.value)}
              className="flex items-center space-x-2 cursor-pointer group"
              whileHover={{ x: 2 }}
            >
              <input
                type="radio"
                name="featured"
                checked={filters.featured === option.value}
                onChange={() => onFiltersChange({ ...filters, featured: option.value })}
                className="sr-only"
              />
              <div className={`
                w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                ${filters.featured === option.value
                  ? 'border-green-400 bg-green-400' 
                  : 'border-gray-500 group-hover:border-gray-400'
                }
              `}>
                {filters.featured === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-gray-900 rounded-full"
                  />
                )}
              </div>
              <span className={`
                text-xs font-mono transition-colors duration-200
                ${filters.featured === option.value ? 'text-green-400' : 'text-gray-300 group-hover:text-white'}
              `}>
                {option.label}
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pixel-border bg-blue-500/10 border-blue-500/50 p-3"
        >
          <div className="text-xs font-mono text-blue-400 space-y-1">
            <div className="font-semibold">Active Filters:</div>
            {filters.search && <div>• Search: "{filters.search}"</div>}
            {filters.technologies.length > 0 && <div>• Tech: {filters.technologies.length} selected</div>}
            {filters.status.length > 0 && <div>• Status: {filters.status.length} selected</div>}
            {filters.years.length > 0 && <div>• Years: {filters.years.length} selected</div>}
            {filters.categories.length > 0 && <div>• Categories: {filters.categories.length} selected</div>}
            {filters.featured !== null && <div>• Featured: {filters.featured ? 'Yes' : 'No'}</div>}
          </div>
        </motion.div>
      )}
    </div>
  )
}