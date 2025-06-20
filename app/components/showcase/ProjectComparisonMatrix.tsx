'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTheme } from '../Providers'

interface ComparisonProject {
  id: string
  title: string
  category: string
  technologies: string[]
  metrics: ProjectMetrics
  features: ProjectFeature[]
  timeline: {
    startDate: Date
    endDate?: Date
    duration: number // in months
  }
  complexity: 1 | 2 | 3 | 4 | 5
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  budget?: number
  teamSize: number
  clientType: 'personal' | 'client' | 'open-source' | 'commercial'
}

interface ProjectMetrics {
  performance: number // 1-100
  scalability: number // 1-100
  maintainability: number // 1-100
  security: number // 1-100
  userExperience: number // 1-100
  codeQuality: number // 1-100
  testCoverage: number // 0-100
  documentation: number // 1-100
  accessibility: number // 1-100
  seoScore?: number // 1-100
}

interface ProjectFeature {
  name: string
  category: 'core' | 'advanced' | 'optional' | 'future'
  implemented: boolean
  priority: 'high' | 'medium' | 'low'
  effort: number // 1-5 scale
}

interface FilterCriteria {
  categories: string[]
  technologies: string[]
  complexity: number[]
  status: string[]
  clientType: string[]
  minPerformance: number
  minBudget: number
  maxBudget: number
  hasFeature: string[]
  timeframe: {
    start?: Date
    end?: Date
  }
}

interface SortOption {
  field: keyof ComparisonProject | keyof ProjectMetrics
  direction: 'asc' | 'desc'
  weight?: number
}

interface ProjectComparisonMatrixProps {
  projects: ComparisonProject[]
  selectedProjects: string[]
  onProjectToggle: (projectId: string) => void
  onProjectSelect: (project: ComparisonProject) => void
  maxComparisons?: number
  className?: string
}

type ViewMode = 'table' | 'grid' | 'chart' | 'radar'
type ComparisonMode = 'metrics' | 'features' | 'timeline' | 'technologies' | 'overview'

export default function ProjectComparisonMatrix({
  projects,
  selectedProjects,
  onProjectToggle,
  onProjectSelect,
  maxComparisons = 5,
  className = ''
}: ProjectComparisonMatrixProps) {
  const { theme } = useTheme()
  
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('overview')
  const [filters, setFilters] = useState<FilterCriteria>({
    categories: [],
    technologies: [],
    complexity: [],
    status: [],
    clientType: [],
    minPerformance: 0,
    minBudget: 0,
    maxBudget: 1000000,
    hasFeature: [],
    timeframe: {}
  })
  const [sortOptions, setSortOptions] = useState<SortOption[]>([
    { field: 'performance', direction: 'desc', weight: 1 }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(projects.map(p => p.category))].sort()
    const technologies = [...new Set(projects.flatMap(p => p.technologies))].sort()
    const features = [...new Set(projects.flatMap(p => p.features.map(f => f.name)))].sort()
    
    return { categories, technologies, features }
  }, [projects])

  // Apply filters and search
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${project.title} ${project.category} ${project.technologies.join(' ')}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(project.category)) {
        return false
      }

      // Technology filter
      if (filters.technologies.length > 0) {
        const hasRequiredTech = filters.technologies.some(tech => 
          project.technologies.includes(tech)
        )
        if (!hasRequiredTech) return false
      }

      // Complexity filter
      if (filters.complexity.length > 0 && !filters.complexity.includes(project.complexity)) {
        return false
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false
      }

      // Client type filter
      if (filters.clientType.length > 0 && !filters.clientType.includes(project.clientType)) {
        return false
      }

      // Performance filter
      if (project.metrics.performance < filters.minPerformance) {
        return false
      }

      // Budget filter
      if (project.budget) {
        if (project.budget < filters.minBudget || project.budget > filters.maxBudget) {
          return false
        }
      }

      // Feature filter
      if (filters.hasFeature.length > 0) {
        const projectFeatures = project.features.filter(f => f.implemented).map(f => f.name)
        const hasRequiredFeatures = filters.hasFeature.every(feature => 
          projectFeatures.includes(feature)
        )
        if (!hasRequiredFeatures) return false
      }

      // Timeframe filter
      if (filters.timeframe.start || filters.timeframe.end) {
        const projectStart = project.timeline.startDate
        const projectEnd = project.timeline.endDate || new Date()
        
        if (filters.timeframe.start && projectEnd < filters.timeframe.start) return false
        if (filters.timeframe.end && projectStart > filters.timeframe.end) return false
      }

      return true
    })
  }, [projects, filters, searchQuery])

  // Apply sorting
  const sortedProjects = useMemo(() => {
    if (sortOptions.length === 0) return filteredProjects

    return [...filteredProjects].sort((a, b) => {
      let totalScore = 0
      
      for (const sort of sortOptions) {
        let aValue: number
        let bValue: number
        
        if (sort.field in a.metrics) {
          aValue = a.metrics[sort.field as keyof ProjectMetrics] as number
          bValue = b.metrics[sort.field as keyof ProjectMetrics] as number
        } else {
          aValue = a[sort.field as keyof ComparisonProject] as number
          bValue = b[sort.field as keyof ComparisonProject] as number
        }
        
        const comparison = sort.direction === 'desc' ? bValue - aValue : aValue - bValue
        totalScore += comparison * (sort.weight || 1)
      }
      
      return totalScore
    })
  }, [filteredProjects, sortOptions])

  const selectedProjectsData = useMemo(() => {
    return projects.filter(p => selectedProjects.includes(p.id))
  }, [projects, selectedProjects])

  const updateFilter = useCallback((key: keyof FilterCriteria, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayFilter = useCallback((key: keyof FilterCriteria, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }, [])

  const clearFilters = () => {
    setFilters({
      categories: [],
      technologies: [],
      complexity: [],
      status: [],
      clientType: [],
      minPerformance: 0,
      minBudget: 0,
      maxBudget: 1000000,
      hasFeature: [],
      timeframe: {}
    })
    setSearchQuery('')
  }

  const getMetricColor = (value: number): string => {
    if (value >= 80) return '#10b981'
    if (value >= 60) return '#f59e0b'
    if (value >= 40) return '#ef4444'
    return '#6b7280'
  }

  const getComplexityLabel = (complexity: number): string => {
    const labels = ['', 'Simple', 'Basic', 'Moderate', 'Complex', 'Advanced']
    return labels[complexity] || 'Unknown'
  }

  const calculateOverallScore = (metrics: ProjectMetrics): number => {
    const weights = {
      performance: 0.2,
      scalability: 0.15,
      maintainability: 0.15,
      security: 0.15,
      userExperience: 0.15,
      codeQuality: 0.1,
      accessibility: 0.1
    }

    return Math.round(
      Object.entries(weights).reduce((sum, [key, weight]) => {
        return sum + (metrics[key as keyof ProjectMetrics] as number) * weight
      }, 0)
    )
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-green-400/30">
            <th className="text-left p-3 font-mono text-green-400">
              <input
                type="checkbox"
                className="mr-2"
                onChange={() => {
                  // Toggle all visible projects
                  const allSelected = sortedProjects.every(p => selectedProjects.includes(p.id))
                  sortedProjects.forEach(p => {
                    if (allSelected && selectedProjects.includes(p.id)) {
                      onProjectToggle(p.id)
                    } else if (!allSelected && !selectedProjects.includes(p.id)) {
                      onProjectToggle(p.id)
                    }
                  })
                }}
              />
              Project
            </th>
            <th className="text-left p-3 font-mono text-green-400">Category</th>
            <th className="text-left p-3 font-mono text-green-400">Status</th>
            <th className="text-left p-3 font-mono text-green-400">Complexity</th>
            <th className="text-left p-3 font-mono text-green-400">Score</th>
            <th className="text-left p-3 font-mono text-green-400">Performance</th>
            <th className="text-left p-3 font-mono text-green-400">Technologies</th>
            <th className="text-left p-3 font-mono text-green-400">Duration</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((project) => (
            <tr
              key={project.id}
              className={`border-b border-gray-700/30 hover:bg-gray-800/40 cursor-pointer transition-colors ${
                selectedProjects.includes(project.id) ? 'bg-green-400/10' : ''
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <td className="p-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      onProjectToggle(project.id)
                    }}
                    disabled={!selectedProjects.includes(project.id) && selectedProjects.length >= maxComparisons}
                    className="pixel-checkbox"
                  />
                  <span className="font-mono text-green-400">{project.title}</span>
                </div>
              </td>
              <td className="p-3 text-gray-300">{project.category}</td>
              <td className="p-3">
                <span
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${getMetricColor(project.status === 'completed' ? 100 : 50)}20`,
                    color: getMetricColor(project.status === 'completed' ? 100 : 50)
                  }}
                >
                  {project.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">{getComplexityLabel(project.complexity)}</span>
                  <span className="text-yellow-400">
                    {'⭐'.repeat(project.complexity)}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <span
                    className="font-mono font-bold"
                    style={{ color: getMetricColor(calculateOverallScore(project.metrics)) }}
                  >
                    {calculateOverallScore(project.metrics)}
                  </span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${calculateOverallScore(project.metrics)}%`,
                        backgroundColor: getMetricColor(calculateOverallScore(project.metrics))
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-3">
                <span
                  className="font-mono"
                  style={{ color: getMetricColor(project.metrics.performance) }}
                >
                  {project.metrics.performance}%
                </span>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-gray-400">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </td>
              <td className="p-3 text-gray-300 font-mono">
                {project.timeline.duration}mo
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderComparisonView = () => {
    if (selectedProjectsData.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <div className="font-mono text-gray-400 mb-2">No projects selected for comparison</div>
          <div className="text-sm text-gray-500">Select up to {maxComparisons} projects to compare</div>
        </div>
      )
    }

    if (comparisonMode === 'metrics') {
      const metricKeys = Object.keys(selectedProjectsData[0].metrics) as (keyof ProjectMetrics)[]
      
      return (
        <div className="space-y-6">
          {metricKeys.map((metric) => (
            <div key={metric} className="pixel-border bg-gray-800/40 rounded-lg p-4">
              <h4 className="font-mono text-green-400 mb-3 capitalize">
                {metric.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="space-y-3">
                {selectedProjectsData.map((project) => {
                  const value = project.metrics[metric] as number
                  return (
                    <div key={project.id} className="flex items-center space-x-3">
                      <div className="w-32 font-mono text-sm text-gray-300 truncate">
                        {project.title}
                      </div>
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${value}%`,
                              backgroundColor: getMetricColor(value)
                            }}
                          />
                        </div>
                        <span
                          className="font-mono text-sm font-bold w-12 text-right"
                          style={{ color: getMetricColor(value) }}
                        >
                          {value}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (comparisonMode === 'features') {
      const allFeatures = [...new Set(selectedProjectsData.flatMap(p => p.features.map(f => f.name)))]
      
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-green-400/30">
                <th className="text-left p-3 font-mono text-green-400">Feature</th>
                {selectedProjectsData.map((project) => (
                  <th key={project.id} className="text-center p-3 font-mono text-green-400">
                    {project.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((featureName) => (
                <tr key={featureName} className="border-b border-gray-700/30">
                  <td className="p-3 font-mono text-gray-300">{featureName}</td>
                  {selectedProjectsData.map((project) => {
                    const feature = project.features.find(f => f.name === featureName)
                    return (
                      <td key={project.id} className="p-3 text-center">
                        {feature?.implemented ? (
                          <span className="text-green-400 text-lg">✅</span>
                        ) : feature ? (
                          <span className="text-yellow-400 text-lg">🚧</span>
                        ) : (
                          <span className="text-gray-500 text-lg">❌</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {selectedProjectsData.map((project) => (
          <div key={project.id} className="pixel-border bg-gray-800/40 rounded-lg p-4">
            <h4 className="font-pixel text-green-400 mb-3">{project.title}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Overall Score:</span>
                <span
                  className="font-mono font-bold"
                  style={{ color: getMetricColor(calculateOverallScore(project.metrics)) }}
                >
                  {calculateOverallScore(project.metrics)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">{project.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Complexity:</span>
                <span className="text-yellow-400">
                  {getComplexityLabel(project.complexity)} {'⭐'.repeat(project.complexity)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-blue-400">{project.timeline.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Team Size:</span>
                <span className="text-purple-400">{project.teamSize} members</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-2">Technologies:</span>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-pixel text-xl text-green-400">Project Comparison Matrix</h2>
          <div className="text-sm text-gray-400 mt-1">
            {filteredProjects.length} of {projects.length} projects • {selectedProjects.length}/{maxComparisons} selected
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2 font-mono text-sm rounded transition-colors pixel-border-sm ${
              showAdvancedFilters
                ? 'bg-green-600/60 text-white'
                : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
            }`}
          >
            🔍 Filters
          </button>
          
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="table">📋 Table</option>
            <option value="grid">🔲 Grid</option>
            <option value="chart">📊 Chart</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showAdvancedFilters && (
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-3 py-2 bg-gray-900/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">Categories</label>
              <div className="space-y-1">
                {filterOptions.categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleArrayFilter('categories', category)}
                      className="pixel-checkbox"
                    />
                    <span className="text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">Technologies</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {filterOptions.technologies.slice(0, 8).map((tech) => (
                  <label key={tech} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.technologies.includes(tech)}
                      onChange={() => toggleArrayFilter('technologies', tech)}
                      className="pixel-checkbox"
                    />
                    <span className="text-gray-300">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">Status</label>
              <div className="space-y-1">
                {['completed', 'in-progress', 'planning', 'archived'].map((status) => (
                  <label key={status} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleArrayFilter('status', status)}
                      className="pixel-checkbox"
                    />
                    <span className="text-gray-300 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Performance Range */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Min Performance: {filters.minPerformance}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minPerformance}
                onChange={(e) => updateFilter('minPerformance', parseInt(e.target.value))}
                className="w-full pixel-slider"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600/60 hover:bg-red-500/60 text-white font-mono text-sm rounded transition-colors"
            >
              Clear Filters
            </button>
            <span className="text-sm text-gray-400 self-center">
              {filteredProjects.length} projects match criteria
            </span>
          </div>
        </div>
      )}

      {/* Comparison Mode Tabs */}
      {selectedProjects.length > 0 && (
        <div className="flex space-x-2 border-b border-gray-700">
          {[
            { id: 'overview', name: 'Overview', icon: '📋' },
            { id: 'metrics', name: 'Metrics', icon: '📊' },
            { id: 'features', name: 'Features', icon: '🔧' },
            { id: 'timeline', name: 'Timeline', icon: '📅' },
            { id: 'technologies', name: 'Tech Stack', icon: '💻' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setComparisonMode(mode.id as ComparisonMode)}
              className={`flex items-center space-x-2 px-4 py-2 font-mono text-sm transition-colors ${
                comparisonMode === mode.id
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {selectedProjects.length > 0 ? renderComparisonView() : renderTableView()}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-green-400">{filteredProjects.length}</div>
          <div className="text-sm text-gray-400 font-mono">Total Projects</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-blue-400">{filterOptions.categories.length}</div>
          <div className="text-sm text-gray-400 font-mono">Categories</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-purple-400">{filterOptions.technologies.length}</div>
          <div className="text-sm text-gray-400 font-mono">Technologies</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
          <div className="text-2xl text-yellow-400">{selectedProjects.length}</div>
          <div className="text-sm text-gray-400 font-mono">Selected</div>
        </div>
      </div>
    </div>
  )
}