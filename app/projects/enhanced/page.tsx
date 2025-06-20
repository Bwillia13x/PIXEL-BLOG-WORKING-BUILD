'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ViewColumnsIcon,
  Squares2X2Icon,
  ClockIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { projects, currentProjects, plannedProjects, Project, CurrentProject } from '@/content/projects'
import ProjectCard3D from '@/app/components/ProjectCard3D'
import DemoOverlay from '@/app/components/DemoOverlay'
import ProjectFilters, { ProjectFilters as FilterType } from '@/app/components/ProjectFilters'
import ProjectTimeline from '@/app/components/ProjectTimeline'
import ProjectComparison from '@/app/components/ProjectComparison'

type ViewMode = 'grid' | 'timeline' | 'comparison'
type ProjectType = Project | CurrentProject

interface EnhancedProjectsState {
  viewMode: ViewMode
  filters: FilterType
  selectedDemo: ProjectType | null
  comparisonProjects: ProjectType[]
  showFilters: boolean
  gridColumns: 2 | 3 | 4
}

export default function EnhancedProjectsPage() {
  const [state, setState] = useState<EnhancedProjectsState>({
    viewMode: 'grid',
    filters: {
      search: '',
      technologies: [],
      status: [],
      years: [],
      featured: null,
      categories: []
    },
    selectedDemo: null,
    comparisonProjects: [],
    showFilters: false,
    gridColumns: 3
  })

  // Combine all projects
  const allProjects = useMemo(() => {
    return [...projects, ...currentProjects, ...plannedProjects]
  }, [])

  // Apply filters to projects
  const filteredProjects = useMemo(() => {
    let filtered = allProjects

    // Search filter
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Technology filter
    if (state.filters.technologies.length > 0) {
      filtered = filtered.filter(project =>
        state.filters.technologies.some(tech =>
          project.tags.some(tag => tag.toLowerCase().includes(tech.toLowerCase()))
        )
      )
    }

    // Status filter
    if (state.filters.status.length > 0) {
      filtered = filtered.filter(project =>
        state.filters.status.includes(project.status)
      )
    }

    // Year filter
    if (state.filters.years.length > 0) {
      filtered = filtered.filter(project =>
        project.year && state.filters.years.includes(project.year)
      )
    }

    // Featured filter
    if (state.filters.featured !== null) {
      filtered = filtered.filter(project =>
        project.featured === state.filters.featured
      )
    }

    // Categories filter (using first tag as category)
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter(project =>
        state.filters.categories.includes(project.tags[0] || 'Other')
      )
    }

    return filtered
  }, [allProjects, state.filters])

  // Handle demo selection
  const handleDemoClick = useCallback((project: ProjectType) => {
    setState(prev => ({ ...prev, selectedDemo: project }))
  }, [])

  const handleCloseDemoOverlay = useCallback(() => {
    setState(prev => ({ ...prev, selectedDemo: null }))
  }, [])

  // Handle comparison
  const handleAddToComparison = useCallback((project: ProjectType) => {
    setState(prev => ({
      ...prev,
      comparisonProjects: prev.comparisonProjects.includes(project)
        ? prev.comparisonProjects
        : [...prev.comparisonProjects, project].slice(0, 4) // Max 4 projects
    }))
  }, [])

  const handleRemoveFromComparison = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      comparisonProjects: prev.comparisonProjects.filter(p => p.id !== projectId)
    }))
  }, [])

  const handleClearComparison = useCallback(() => {
    setState(prev => ({ ...prev, comparisonProjects: [] }))
  }, [])

  // Handle filters
  const handleFiltersChange = useCallback((filters: FilterType) => {
    setState(prev => ({ ...prev, filters }))
  }, [])

  const handleToggleFilters = useCallback(() => {
    setState(prev => ({ ...prev, showFilters: !prev.showFilters }))
  }, [])

  // View mode handlers
  const handleViewModeChange = useCallback((viewMode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode }))
  }, [])

  const handleGridColumnsChange = useCallback((columns: 2 | 3 | 4) => {
    setState(prev => ({ ...prev, gridColumns: columns }))
  }, [])

  const gridColumnClasses = {
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Title and Stats */}
            <div className="flex items-center space-x-4">
              <h1 className="font-mono text-2xl font-bold text-green-400">
                Enhanced Projects
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-mono pixel-border border-green-500/50">
                  {filteredProjects.length} projects
                </span>
                {state.comparisonProjects.length > 0 && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-mono pixel-border border-blue-500/50">
                    {state.comparisonProjects.length} in comparison
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center pixel-border bg-gray-800/50">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
                    state.viewMode === 'grid'
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('timeline')}
                  className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
                    state.viewMode === 'timeline'
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Timeline View"
                >
                  <ClockIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('comparison')}
                  className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
                    state.viewMode === 'comparison'
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Comparison View"
                >
                  <ArrowsRightLeftIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Grid Columns (only in grid mode) */}
              {state.viewMode === 'grid' && (
                <div className="flex items-center pixel-border bg-gray-800/50">
                  {[2, 3, 4].map(cols => (
                    <button
                      key={cols}
                      onClick={() => handleGridColumnsChange(cols as 2 | 3 | 4)}
                      className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
                        state.gridColumns === cols
                          ? 'bg-green-500/20 text-green-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={`${cols} Columns`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              )}

              {/* Filters Toggle */}
              <button
                onClick={handleToggleFilters}
                className={`flex items-center space-x-2 px-3 py-2 pixel-border font-mono text-sm transition-all duration-200 ${
                  state.showFilters
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${
                  state.showFilters ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Clear Comparison */}
              {state.comparisonProjects.length > 0 && (
                <button
                  onClick={handleClearComparison}
                  className="flex items-center space-x-2 px-3 py-2 pixel-border bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 font-mono text-sm transition-all duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear Comparison</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <AnimatePresence>
            {state.showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="lg:w-80 space-y-6"
              >
                <ProjectFilters
                  projects={allProjects}
                  filters={state.filters}
                  onFiltersChange={handleFiltersChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Grid View */}
            {state.viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-16">
                    <EyeIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-mono text-xl text-white mb-2">No Projects Found</h3>
                    <p className="text-gray-400 font-mono">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${gridColumnClasses[state.gridColumns]}`}>
                    {filteredProjects.map((project, index) => (
                      <ProjectCard3D
                        key={project.id}
                        project={project}
                        index={index}
                        onDemoClick={handleDemoClick}
                        onCompareClick={handleAddToComparison}
                        isInComparison={state.comparisonProjects.includes(project)}
                        canAddToComparison={state.comparisonProjects.length < 4}
                        showComparisonButton={true}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Timeline View */}
            {state.viewMode === 'timeline' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectTimeline
                  projects={filteredProjects}
                  onProjectClick={() => {}} // Could implement project detail modal
                  onDemoClick={handleDemoClick}
                />
              </motion.div>
            )}

            {/* Comparison View */}
            {state.viewMode === 'comparison' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {state.comparisonProjects.length === 0 ? (
                  <div className="text-center py-16">
                    <ArrowsRightLeftIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-mono text-xl text-white mb-2">No Projects Selected</h3>
                    <p className="text-gray-400 font-mono mb-6">
                      Switch to grid view and add projects to comparison
                    </p>
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className="flex items-center space-x-2 px-4 py-2 pixel-border bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 font-mono transition-all duration-200 mx-auto"
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                      <span>Go to Grid View</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Comparison Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-lg text-white flex items-center">
                        <ArrowsRightLeftIcon className="h-5 w-5 text-green-400 mr-2" />
                        Project Comparison
                      </h3>
                      <div className="text-sm text-gray-400 font-mono">
                        {state.comparisonProjects.length} / 4 projects
                      </div>
                    </div>

                    {/* Comparison Grid */}
                    <div className={`grid gap-6 ${
                      state.comparisonProjects.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                      state.comparisonProjects.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {state.comparisonProjects.map((project, index) => (
                        <div key={project.id} className="relative">
                          <ProjectCard3D
                            project={project}
                            index={index}
                            onDemoClick={handleDemoClick}
                            onCompareClick={() => handleRemoveFromComparison(project.id)}
                            isInComparison={true}
                            canAddToComparison={false}
                            showComparisonButton={true}
                            comparisonMode="remove"
                          />
                        </div>
                      ))}
                      
                      {/* Add More Slot */}
                      {state.comparisonProjects.length < 4 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pixel-border bg-gray-800/30 border-gray-600 border-dashed flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-gray-700/30 transition-all duration-200"
                          onClick={() => handleViewModeChange('grid')}
                        >
                          <div className="text-center">
                            <PlusIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                            <div className="font-mono text-gray-400 text-sm">
                              Add Project
                            </div>
                            <div className="font-mono text-gray-600 text-xs mt-1">
                              Switch to grid view
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Overlay */}
      <DemoOverlay
        project={state.selectedDemo}
        isOpen={!!state.selectedDemo}
        onClose={handleCloseDemoOverlay}
      />

      {/* Floating Comparison Button */}
      {state.comparisonProjects.length > 0 && state.viewMode !== 'comparison' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => handleViewModeChange('comparison')}
          className="fixed bottom-6 right-6 z-30 flex items-center space-x-2 px-4 py-3 pixel-border bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 font-mono transition-all duration-200 shadow-lg backdrop-blur-sm"
        >
          <ArrowsRightLeftIcon className="h-5 w-5" />
          <span>Compare ({state.comparisonProjects.length})</span>
        </motion.button>
      )}
    </div>
  )
}