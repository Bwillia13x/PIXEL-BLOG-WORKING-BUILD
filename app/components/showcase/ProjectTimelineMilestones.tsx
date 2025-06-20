'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useTheme } from '../Providers'

interface Milestone {
  id: string
  title: string
  description: string
  type: 'planning' | 'development' | 'testing' | 'deployment' | 'maintenance' | 'feature' | 'bugfix' | 'release'
  status: 'completed' | 'in-progress' | 'pending' | 'blocked' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: Date
  endDate?: Date
  estimatedDuration: number // in days
  actualDuration?: number // in days
  progress: number // 0-100
  assignees: string[]
  dependencies: string[] // milestone IDs that must be completed first
  deliverables: Deliverable[]
  tags: string[]
  category: string
  effort: number // story points or hours
  blockers?: Blocker[]
  metadata: {
    complexity: number // 1-10
    riskLevel: 'low' | 'medium' | 'high'
    businessValue: number // 1-10
    technicalDebt: number // 1-10
  }
}

interface Deliverable {
  id: string
  title: string
  type: 'documentation' | 'code' | 'design' | 'test' | 'deployment' | 'other'
  status: 'pending' | 'in-progress' | 'completed' | 'rejected'
  url?: string
  description?: string
}

interface Blocker {
  id: string
  title: string
  description: string
  type: 'technical' | 'resource' | 'external' | 'decision' | 'approval'
  severity: 'low' | 'medium' | 'high' | 'critical'
  reportedDate: Date
  resolvedDate?: Date
  resolution?: string
}

interface ProjectTimelineData {
  id: string
  title: string
  description: string
  startDate: Date
  targetEndDate: Date
  actualEndDate?: Date
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'
  milestones: Milestone[]
  phases: Phase[]
  team: TeamMember[]
  budget?: number
  spentBudget?: number
}

interface Phase {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  color: string
  milestones: string[] // milestone IDs in this phase
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  skills: string[]
}

interface ProjectTimelineMilestonesProps {
  project: ProjectTimelineData
  onMilestoneSelect: (milestone: Milestone) => void
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => void
  viewMode: 'timeline' | 'gantt' | 'kanban' | 'calendar'
  showDependencies?: boolean
  showProgress?: boolean
  showTeam?: boolean
  showBudget?: boolean
  interactive?: boolean
  className?: string
}

type FilterMode = 'all' | 'completed' | 'in-progress' | 'pending' | 'blocked'
type SortMode = 'date' | 'priority' | 'status' | 'progress'

export default function ProjectTimelineMilestones({
  project,
  onMilestoneSelect,
  onMilestoneUpdate,
  viewMode = 'timeline',
  showDependencies = true,
  showProgress = true,
  showTeam = true,
  showBudget = false,
  interactive = true,
  className = ''
}: ProjectTimelineMilestonesProps) {
  const { theme } = useTheme()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [sortMode, setSortMode] = useState<SortMode>('date')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<string>('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [draggedMilestone, setDraggedMilestone] = useState<string | null>(null)
  const [localViewMode, setViewMode] = useState<'timeline' | 'kanban'>(viewMode as 'timeline' | 'kanban')
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null)

  // Filter and sort milestones
  const filteredMilestones = useMemo(() => {
    let filtered = project.milestones

    // Apply status filter
    if (filterMode !== 'all') {
      filtered = filtered.filter(milestone => milestone.status === filterMode)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(milestone =>
        milestone.title.toLowerCase().includes(query) ||
        milestone.description.toLowerCase().includes(query) ||
        milestone.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply phase filter
    if (selectedPhase) {
      const phase = project.phases.find(p => p.id === selectedPhase)
      if (phase) {
        filtered = filtered.filter(milestone => phase.milestones.includes(milestone.id))
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'date':
          return a.startDate.getTime() - b.startDate.getTime()
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'status':
          const statusOrder = { 'in-progress': 4, pending: 3, blocked: 2, completed: 1, cancelled: 0 }
          return statusOrder[b.status] - statusOrder[a.status]
        case 'progress':
          return b.progress - a.progress
        default:
          return 0
      }
    })

    return filtered
  }, [project.milestones, filterMode, searchQuery, selectedPhase, sortMode])

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const totalMilestones = project.milestones.length
    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length
    const inProgressMilestones = project.milestones.filter(m => m.status === 'in-progress').length
    const blockedMilestones = project.milestones.filter(m => m.status === 'blocked').length
    const overallProgress = Math.round(project.milestones.reduce((sum, m) => sum + m.progress, 0) / totalMilestones)
    
    const totalEstimatedDays = project.milestones.reduce((sum, m) => sum + m.estimatedDuration, 0)
    const totalActualDays = project.milestones
      .filter(m => m.actualDuration)
      .reduce((sum, m) => sum + (m.actualDuration || 0), 0)
    
    const budgetUsed = project.spentBudget && project.budget 
      ? Math.round((project.spentBudget / project.budget) * 100)
      : 0

    return {
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      blockedMilestones,
      overallProgress,
      totalEstimatedDays,
      totalActualDays,
      budgetUsed
    }
  }, [project])

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'blocked': return '#ef4444'
      case 'cancelled': return '#6b7280'
      default: return '#6b7280'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#ca8a04'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  // Get type icon
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'planning': return '📋'
      case 'development': return '💻'
      case 'testing': return '🧪'
      case 'deployment': return '🚀'
      case 'maintenance': return '🔧'
      case 'feature': return '✨'
      case 'bugfix': return '🐛'
      case 'release': return '📦'
      default: return '📌'
    }
  }

  // Handle milestone selection
  const handleMilestoneSelect = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    onMilestoneSelect(milestone)
  }

  // Calculate timeline layout
  const calculateTimelineLayout = () => {
    const startDate = new Date(Math.min(...project.milestones.map(m => m.startDate.getTime())))
    const endDate = project.actualEndDate || project.targetEndDate
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return { startDate, endDate, totalDays }
  }

  // Render timeline view
  const renderTimelineView = () => {
    const { startDate, totalDays } = calculateTimelineLayout()
    
    return (
      <div className="space-y-4">
        {/* Timeline Header */}
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-pixel text-green-400">Project Timeline</h3>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-400">Zoom:</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-16 pixel-slider"
              />
            </div>
          </div>
          
          {/* Time scale */}
          <div className="relative h-8 bg-gray-900/60 rounded mb-4 overflow-x-auto">
            <div 
              className="flex h-full"
              style={{ width: `${totalDays * zoomLevel * 2}px` }}
            >
              {Array.from({ length: Math.ceil(totalDays / 7) }, (_, weekIndex) => {
                const weekStart = new Date(startDate)
                weekStart.setDate(weekStart.getDate() + weekIndex * 7)
                
                return (
                  <div
                    key={weekIndex}
                    className="flex-shrink-0 border-r border-gray-700/50 px-2 py-1"
                    style={{ width: `${7 * zoomLevel * 2}px` }}
                  >
                    <div className="text-xs font-mono text-gray-400">
                      {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-2">
          {project.phases.map((phase) => (
            <div key={phase.id} className="pixel-border bg-gray-800/40 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: phase.color }}
                />
                <h4 className="font-mono text-sm text-green-400">{phase.title}</h4>
                <span className="text-xs text-gray-400">
                  ({phase.milestones.length} milestones)
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{phase.description}</p>
              
              {/* Phase Timeline */}
              <div className="relative h-6 bg-gray-900/60 rounded">
                <div
                  className="absolute h-full rounded opacity-30"
                  style={{
                    backgroundColor: phase.color,
                    left: `${((phase.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100}%`,
                    width: `${((phase.endDate.getTime() - phase.startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          {filteredMilestones.map((milestone) => {
            const dayOffset = Math.ceil((milestone.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            const duration = milestone.actualDuration || milestone.estimatedDuration
            
            return (
              <div
                key={milestone.id}
                className={`pixel-border bg-gray-800/40 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700/60 ${
                  selectedMilestone?.id === milestone.id ? 'ring-2 ring-green-400/50' : ''
                }`}
                onClick={() => handleMilestoneSelect(milestone)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getTypeIcon(milestone.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-mono text-green-400 text-sm">{milestone.title}</h4>
                      <span
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{
                          backgroundColor: `${getStatusColor(milestone.status)}20`,
                          color: getStatusColor(milestone.status)
                        }}
                      >
                        {milestone.status}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{
                          backgroundColor: `${getPriorityColor(milestone.priority)}20`,
                          color: getPriorityColor(milestone.priority)
                        }}
                      >
                        {milestone.priority}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-300 mb-2">{milestone.description}</p>
                    
                    {/* Progress Bar */}
                    {showProgress && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${milestone.progress}%`,
                              backgroundColor: getStatusColor(milestone.status)
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Timeline Bar */}
                    <div className="relative h-4 bg-gray-900/60 rounded mb-2">
                      <div
                        className="absolute h-full rounded transition-all duration-300"
                        style={{
                          backgroundColor: getStatusColor(milestone.status),
                          left: `${(dayOffset / totalDays) * 100}%`,
                          width: `${(duration / totalDays) * 100}%`,
                          opacity: milestone.status === 'completed' ? 1 : 0.7
                        }}
                      />
                      {milestone.status === 'in-progress' && (
                        <div
                          className="absolute h-full bg-blue-400/50 rounded"
                          style={{
                            left: `${(dayOffset / totalDays) * 100}%`,
                            width: `${((duration * milestone.progress / 100) / totalDays) * 100}%`
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span>📅 {milestone.startDate.toLocaleDateString()}</span>
                        <span>⏱️ {duration} days</span>
                        {milestone.assignees.length > 0 && (
                          <span>👥 {milestone.assignees.length}</span>
                        )}
                      </div>
                      {milestone.blockers && milestone.blockers.length > 0 && (
                        <span className="text-red-400">🚫 {milestone.blockers.length} blockers</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render Kanban view
  const renderKanbanView = () => {
    const statusColumns = [
      { status: 'pending', title: 'Pending', color: '#f59e0b' },
      { status: 'in-progress', title: 'In Progress', color: '#3b82f6' },
      { status: 'completed', title: 'Completed', color: '#10b981' },
      { status: 'blocked', title: 'Blocked', color: '#ef4444' }
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        {statusColumns.map((column) => {
          const columnMilestones = filteredMilestones.filter(m => m.status === column.status)
          
          return (
            <div key={column.status} className="flex flex-col">
              <div 
                className="pixel-border rounded-lg p-3 mb-4"
                style={{ backgroundColor: `${column.color}20` }}
              >
                <h3 
                  className="font-mono font-semibold text-sm"
                  style={{ color: column.color }}
                >
                  {column.title} ({columnMilestones.length})
                </h3>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="pixel-border bg-gray-800/40 rounded-lg p-3 cursor-pointer hover:bg-gray-700/60 transition-colors"
                    onClick={() => handleMilestoneSelect(milestone)}
                    draggable={interactive}
                    onDragStart={() => setDraggedMilestone(milestone.id)}
                    onDragEnd={() => setDraggedMilestone(null)}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(milestone.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-mono text-green-400 text-sm truncate">{milestone.title}</h4>
                        <p className="text-xs text-gray-300 line-clamp-2 mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className="px-2 py-1 rounded font-mono"
                        style={{
                          backgroundColor: `${getPriorityColor(milestone.priority)}20`,
                          color: getPriorityColor(milestone.priority)
                        }}
                      >
                        {milestone.priority}
                      </span>
                      <span className="text-gray-400">{milestone.progress}%</span>
                    </div>
                    
                    {milestone.assignees.length > 0 && (
                      <div className="flex -space-x-1 mt-2">
                        {milestone.assignees.slice(0, 3).map((assignee, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-mono text-white"
                            title={assignee}
                          >
                            {assignee.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {milestone.assignees.length > 3 && (
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-mono text-white">
                            +{milestone.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="font-pixel text-xl text-green-400 flex items-center space-x-2">
            <span>📅</span>
            <span>{project.title} Timeline</span>
          </h2>
          <div className="text-sm text-gray-400 mt-1">
            {filteredMilestones.length} of {project.milestones.length} milestones • {projectStats.overallProgress}% complete
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones..."
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
          />

          {/* Filter */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Phase Filter */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="">All Phases</option>
            {project.phases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.title}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
            <option value="progress">Sort by Progress</option>
          </select>

          {/* View Mode */}
          <div className="flex space-x-1 pixel-border rounded overflow-hidden">
            {(['timeline', 'kanban'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 font-mono text-xs transition-colors ${
                  localViewMode === mode
                    ? 'bg-green-600/60 text-white'
                    : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
                }`}
              >
                {mode === 'timeline' ? '📊' : '📋'} {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
          <div className="text-lg text-green-400">{projectStats.completedMilestones}</div>
          <div className="text-xs text-gray-400 font-mono">Completed</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
          <div className="text-lg text-blue-400">{projectStats.inProgressMilestones}</div>
          <div className="text-xs text-gray-400 font-mono">In Progress</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
          <div className="text-lg text-red-400">{projectStats.blockedMilestones}</div>
          <div className="text-xs text-gray-400 font-mono">Blocked</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
          <div className="text-lg text-purple-400">{projectStats.overallProgress}%</div>
          <div className="text-xs text-gray-400 font-mono">Progress</div>
        </div>
        <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
          <div className="text-lg text-yellow-400">{projectStats.totalEstimatedDays}</div>
          <div className="text-xs text-gray-400 font-mono">Est. Days</div>
        </div>
        {showBudget && (
          <div className="pixel-border bg-gray-800/40 rounded-lg p-3 text-center">
            <div className="text-lg text-orange-400">{projectStats.budgetUsed}%</div>
            <div className="text-xs text-gray-400 font-mono">Budget Used</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div ref={timelineRef} className="min-h-96">
        {localViewMode === 'timeline' && renderTimelineView()}
        {localViewMode === 'kanban' && renderKanbanView()}
      </div>

      {/* Milestone Details */}
      {selectedMilestone && showDetails && (
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-pixel text-lg text-green-400 mb-2">{selectedMilestone.title}</h3>
              <p className="text-sm text-gray-300">{selectedMilestone.description}</p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="p-2 hover:bg-gray-700/60 rounded transition-colors"
            >
              <span className="text-gray-400">✕</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <h4 className="font-mono text-sm text-gray-400 mb-2">Status & Priority</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Status:</span>
                  <span
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${getStatusColor(selectedMilestone.status)}20`,
                      color: getStatusColor(selectedMilestone.status)
                    }}
                  >
                    {selectedMilestone.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Priority:</span>
                  <span
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${getPriorityColor(selectedMilestone.priority)}20`,
                      color: getPriorityColor(selectedMilestone.priority)
                    }}
                  >
                    {selectedMilestone.priority}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-sm text-gray-400 mb-2">Timeline</h4>
              <div className="space-y-2 text-xs font-mono">
                <div>Start: {selectedMilestone.startDate.toLocaleDateString()}</div>
                {selectedMilestone.endDate && (
                  <div>End: {selectedMilestone.endDate.toLocaleDateString()}</div>
                )}
                <div>Duration: {selectedMilestone.estimatedDuration} days (est.)</div>
                {selectedMilestone.actualDuration && (
                  <div>Actual: {selectedMilestone.actualDuration} days</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-sm text-gray-400 mb-2">Team & Effort</h4>
              <div className="space-y-2 text-xs font-mono">
                <div>Assignees: {selectedMilestone.assignees.length}</div>
                <div>Effort: {selectedMilestone.effort} points</div>
                <div>Complexity: {selectedMilestone.metadata.complexity}/10</div>
                <div>Risk: {selectedMilestone.metadata.riskLevel}</div>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          {selectedMilestone.deliverables.length > 0 && (
            <div className="mb-4">
              <h4 className="font-mono text-sm text-gray-400 mb-2">Deliverables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedMilestone.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="flex items-center space-x-2 p-2 bg-gray-900/60 rounded text-xs"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: deliverable.status === 'completed' ? '#10b981' : 
                                        deliverable.status === 'in-progress' ? '#3b82f6' :
                                        deliverable.status === 'rejected' ? '#ef4444' : '#6b7280'
                      }}
                    />
                    <span className="font-mono text-gray-300">{deliverable.title}</span>
                    <span className="text-gray-400">({deliverable.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blockers */}
          {selectedMilestone.blockers && selectedMilestone.blockers.length > 0 && (
            <div>
              <h4 className="font-mono text-sm text-gray-400 mb-2">Active Blockers</h4>
              <div className="space-y-2">
                {selectedMilestone.blockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-red-400">{blocker.title}</span>
                      <span
                        className="px-2 py-1 rounded font-mono"
                        style={{
                          backgroundColor: blocker.severity === 'critical' ? '#dc262620' :
                                          blocker.severity === 'high' ? '#ea580c20' :
                                          blocker.severity === 'medium' ? '#ca8a0420' : '#16a34a20',
                          color: blocker.severity === 'critical' ? '#dc2626' :
                                 blocker.severity === 'high' ? '#ea580c' :
                                 blocker.severity === 'medium' ? '#ca8a04' : '#16a34a'
                        }}
                      >
                        {blocker.severity}
                      </span>
                    </div>
                    <div className="text-gray-300">{blocker.description}</div>
                    <div className="text-gray-400 mt-1">
                      Reported: {blocker.reportedDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}