'use client'

import React from 'react'
import { Metadata } from 'next'
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ViewColumnsIcon,
  Squares2X2Icon,
  ClockIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { projects, currentProjects, plannedProjects, Project, CurrentProject } from '@/content/projects'
import ProjectCard3D from '@/app/components/ProjectCard3D'
import DemoOverlay from '@/app/components/DemoOverlay'
import ProjectTimeline from '@/app/components/ProjectTimeline'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'

type ViewMode = 'grid' | 'timeline' | 'comparison'
type ProjectType = Project | CurrentProject

interface EnhancedProjectsState {
  viewMode: ViewMode
  searchTerm: string
  selectedDemo: ProjectType | null
  comparisonProjects: ProjectType[]
  gridColumns: 2 | 3 | 4
}

export default function EnhancedProjectsPage() {
  const [state, setState] = useState<EnhancedProjectsState>({
    viewMode: 'grid',
    searchTerm: '',
    selectedDemo: null,
    comparisonProjects: [],
    gridColumns: 3
  })

  // Combine all projects
  const allProjects = useMemo(() => {
    return [...projects, ...currentProjects, ...plannedProjects]
  }, [])

  // Apply simple search filter
  const filteredProjects = useMemo(() => {
    if (!state.searchTerm) return allProjects

    const searchLower = state.searchTerm.toLowerCase()
    return allProjects.filter(project =>
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }, [allProjects, state.searchTerm])

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

  // Handle search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, searchTerm: e.target.value }))
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Title and Stats */}
            <div className="flex items-center space-x-4">
              <h1 className="font-mono text-xl md:text-2xl font-bold text-green-400">
                <MatrixTextReveal 
                  text="Enhanced Projects" 
                  speed={75}
                  delay={300}
                  scrambleDuration={250}
                  className="inline-block"
                />
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-mono border border-green-500/50 rounded">
                  {filteredProjects.length} projects
                </span>
                {state.comparisonProjects.length > 0 && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-mono border border-blue-500/50 rounded">
                    {state.comparisonProjects.length} in comparison
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={state.searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded font-mono text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-600 bg-gray-800/50 rounded">
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
                <div className="flex items-center border border-gray-600 bg-gray-800/50 rounded">
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

              {/* Clear Comparison */}
              {state.comparisonProjects.length > 0 && (
                <button
                  onClick={handleClearComparison}
                  className="flex items-center space-x-2 px-3 py-2 border border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-mono text-sm transition-all duration-200 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear Comparison</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Main Content */}
        <div className="space-y-8">
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
                    Try adjusting your search terms
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
                    className="flex items-center space-x-2 px-4 py-2 border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-mono transition-all duration-200 mx-auto rounded"
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
                        className="border border-gray-600 border-dashed bg-gray-800/30 flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-gray-700/30 transition-all duration-200 rounded"
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
          className="fixed bottom-6 right-6 z-30 flex items-center space-x-2 px-4 py-3 border border-blue-500/50 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-mono transition-all duration-200 shadow-lg backdrop-blur-sm rounded"
        >
          <ArrowsRightLeftIcon className="h-5 w-5" />
          <span>Compare ({state.comparisonProjects.length})</span>
        </motion.button>
      )}
    </div>
  )
}