'use client'

import { useState } from 'react'
import type { Project } from '@/content/projects'

interface ProjectFiltersProps {
  projects: Project[]
  onFilterChange: (filteredProjects: Project[]) => void
}

export default function ProjectFilters({ projects, onFilterChange }: ProjectFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'featured'>('year')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort()
  const statuses = ['all', 'completed', 'in-progress', 'planned']

  const applyFilters = (
    status: string,
    tags: string[],
    sort: 'year' | 'title' | 'featured',
    order: 'asc' | 'desc'
  ) => {
    let filtered = [...projects]

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status)
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(p => 
        tags.some(tag => p.tags.includes(tag))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sort) {
        case 'year':
          comparison = a.year - b.year
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
          break
      }
      
      return order === 'asc' ? comparison : -comparison
    })

    onFilterChange(filtered)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    applyFilters(status, selectedTags, sortBy, sortOrder)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    applyFilters(selectedStatus, newTags, sortBy, sortOrder)
  }

  const handleSortChange = (sort: 'year' | 'title' | 'featured', order: 'asc' | 'desc') => {
    setSortBy(sort)
    setSortOrder(order)
    applyFilters(selectedStatus, selectedTags, sort, order)
  }

  const clearFilters = () => {
    setSelectedStatus('all')
    setSelectedTags([])
    setSortBy('year')
    setSortOrder('desc')
    applyFilters('all', [], 'year', 'desc')
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-green-400/20">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-mono text-green-400 mb-2">Status</label>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedStatus === status
                    ? 'bg-green-600 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-mono text-green-400 mb-2">Sort by</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any, sortOrder)}
              className="bg-gray-700 text-white px-3 py-1 text-xs font-mono rounded border border-gray-600 focus:border-green-400"
            >
              <option value="year">Year</option>
              <option value="title">Title</option>
              <option value="featured">Featured</option>
            </select>
            <button
              onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 bg-gray-700 text-white text-xs font-mono rounded hover:bg-gray-600 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-red-600/80 text-white text-xs font-mono rounded hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-mono text-green-400 mb-2">
          Technologies ({selectedTags.length} selected)
        </label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedStatus !== 'all' || selectedTags.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs font-mono text-gray-400">
            Active filters: 
            {selectedStatus !== 'all' && (
              <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-400 rounded">
                {selectedStatus}
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="ml-2 px-2 py-1 bg-blue-600/20 text-blue-400 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}