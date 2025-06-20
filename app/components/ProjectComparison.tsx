'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  PlayIcon,
  CodeBracketIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Project, CurrentProject } from '@/content/projects'
import TechBadges from './TechBadges'
import GitHubStats from './GitHubStats'

interface ProjectComparisonProps {
  projects: (Project | CurrentProject)[]
  isOpen: boolean
  onClose: () => void
  onRemoveProject: (projectId: string) => void
  onDemoClick?: (project: Project | CurrentProject) => void
  className?: string
}

interface ComparisonMetric {
  label: string
  key: string
  type: 'text' | 'number' | 'date' | 'tags' | 'status' | 'boolean' | 'progress'
  icon: React.ComponentType<{ className?: string }>
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  { label: 'Title', key: 'title', type: 'text', icon: TagIcon },
  { label: 'Status', key: 'status', type: 'status', icon: CheckCircleIcon },
  { label: 'Year', key: 'year', type: 'number', icon: CalendarIcon },
  { label: 'Technologies', key: 'tags', type: 'tags', icon: TagIcon },
  { label: 'Featured', key: 'featured', type: 'boolean', icon: StarIcon },
  { label: 'Demo', key: 'demo', type: 'boolean', icon: PlayIcon },
  { label: 'Source Code', key: 'github', type: 'boolean', icon: CodeBracketIcon },
]

const STATUS_CONFIG = {
  completed: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  'in-progress': {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    icon: ClockIcon,
    label: 'In Progress'
  },
  planned: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    icon: ExclamationTriangleIcon,
    label: 'Planned'
  }
}

interface ProjectColumnProps {
  project: Project | CurrentProject
  index: number
  onRemove: () => void
  onDemoClick?: () => void
}

function ProjectColumn({ project, index, onRemove, onDemoClick }: ProjectColumnProps) {
  const statusConfig = STATUS_CONFIG[project.status]
  const StatusIcon = statusConfig.icon
  const isCurrentProject = 'progress' in project

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-1 min-w-0 pixel-border bg-gray-900/60 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-bold text-white text-sm truncate mb-2">
              {project.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <div className={`
                flex items-center space-x-1 px-2 py-1 pixel-border text-xs font-mono
                ${statusConfig.color} ${statusConfig.bgColor} ${statusConfig.borderColor}
              `}>
                <StatusIcon className="h-3 w-3" />
                <span>{statusConfig.label}</span>
              </div>
              
              {project.featured && (
                <div className="flex items-center space-x-1 px-2 py-1 pixel-border text-xs font-mono text-yellow-400 bg-yellow-500/20 border-yellow-500/50">
                  <StarIcon className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onRemove}
            className="
              ml-2 p-1 text-gray-400 hover:text-red-400 
              transition-colors duration-200 pixel-hover
            "
            title="Remove from comparison"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <h4 className="text-xs font-mono text-gray-400 mb-2">Description</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progress (for current projects) */}
        {isCurrentProject && project.progress !== undefined && (
          <div>
            <h4 className="text-xs font-mono text-gray-400 mb-2">Progress</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Completion</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Technologies */}
        <div>
          <h4 className="text-xs font-mono text-gray-400 mb-2">Technologies</h4>
          <TechBadges
            technologies={project.tags}
            size="sm"
            maxVisible={6}
            showCount={false}
            layout="horizontal"
            animated={false}
            interactive={false}
          />
        </div>

        {/* Highlights (for current projects) */}
        {isCurrentProject && project.highlights && (
          <div>
            <h4 className="text-xs font-mono text-gray-400 mb-2">Key Features</h4>
            <ul className="space-y-1">
              {project.highlights.slice(0, 3).map((highlight, index) => (
                <li key={index} className="text-xs text-gray-300 font-mono flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Year */}
        <div>
          <h4 className="text-xs font-mono text-gray-400 mb-2">Year</h4>
          <div className="flex items-center space-x-1 text-sm text-gray-300 font-mono">
            <CalendarIcon className="h-4 w-4" />
            <span>{project.year || 'Not specified'}</span>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono text-gray-400">Links</h4>
          <div className="space-y-2">
            {project.demo && (
              <button
                onClick={onDemoClick}
                className="
                  w-full flex items-center justify-center space-x-2 px-3 py-2 pixel-border 
                  bg-green-500/20 text-green-400 border-green-500/50 
                  hover:bg-green-500/30 transition-all duration-200 font-mono text-xs
                "
              >
                <PlayIcon className="h-3 w-3" />
                <span>Live Demo</span>
              </button>
            )}
            
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full flex items-center justify-center space-x-2 px-3 py-2 pixel-border 
                  bg-gray-500/20 text-gray-400 border-gray-500/50 
                  hover:bg-gray-500/30 hover:text-white transition-all duration-200 font-mono text-xs
                "
              >
                <CodeBracketIcon className="h-3 w-3" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* GitHub Stats */}
        {project.github && (
          <div>
            <h4 className="text-xs font-mono text-gray-400 mb-2">GitHub Stats</h4>
            <GitHubStats
              githubUrl={project.github}
              compact={true}
              showLanguages={false}
              showCommits={false}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface ComparisonTableProps {
  projects: (Project | CurrentProject)[]
  onRemoveProject: (projectId: string) => void
}

function ComparisonTable({ projects, onRemoveProject }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-3 text-gray-400 font-semibold">Metric</th>
            {projects.map((project) => (
              <th key={project.id} className="text-left p-3 text-green-400 font-semibold min-w-48">
                <div className="flex items-center justify-between">
                  <span className="truncate">{project.title}</span>
                  <button
                    onClick={() => onRemoveProject(project.id)}
                    className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_METRICS.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.tr
                key={metric.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-800 hover:bg-gray-800/30"
              >
                <td className="p-3">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Icon className="h-4 w-4" />
                    <span>{metric.label}</span>
                  </div>
                </td>
                {projects.map((project) => (
                  <td key={project.id} className="p-3">
                    {metric.type === 'status' && (() => {
                      const StatusIcon = STATUS_CONFIG[project.status].icon
                      return (
                        <div className={`
                          flex items-center space-x-1 px-2 py-1 pixel-border text-xs
                          ${STATUS_CONFIG[project.status].color} 
                          ${STATUS_CONFIG[project.status].bgColor} 
                          ${STATUS_CONFIG[project.status].borderColor}
                        `}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{STATUS_CONFIG[project.status].label}</span>
                        </div>
                      )
                    })()}
                    
                    {metric.type === 'tags' && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-gray-500">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {metric.type === 'boolean' && (
                      <span className={
                        project[metric.key as keyof typeof project] 
                          ? 'text-green-400' 
                          : 'text-gray-500'
                      }>
                        {project[metric.key as keyof typeof project] ? '✓' : '✗'}
                      </span>
                    )}
                    
                    {metric.type === 'text' && (
                      <span className="text-gray-300">
                        {String(project[metric.key as keyof typeof project] || '—')}
                      </span>
                    )}
                    
                    {metric.type === 'number' && (
                      <span className="text-gray-300">
                        {project[metric.key as keyof typeof project] || '—'}
                      </span>
                    )}
                  </td>
                ))}
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ProjectComparison({
  projects,
  isOpen,
  onClose,
  onRemoveProject,
  onDemoClick,
  className = ""
}: ProjectComparisonProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  // Calculate comparison insights
  const insights = useMemo(() => {
    if (projects.length < 2) return null

    const completedCount = projects.filter(p => p.status === 'completed').length
    const inProgressCount = projects.filter(p => p.status === 'in-progress').length
    const featuredCount = projects.filter(p => p.featured).length
    
    // Most common technologies
    const techCount = new Map<string, number>()
    projects.forEach(project => {
      project.tags.forEach(tech => {
        techCount.set(tech, (techCount.get(tech) || 0) + 1)
      })
    })
    
    const commonTechs = Array.from(techCount.entries())
      .filter(([, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    // Year range
    const years = projects.map(p => p.year).filter(Boolean) as number[]
    const yearRange = years.length > 0 ? {
      min: Math.min(...years),
      max: Math.max(...years)
    } : null

    return {
      completedCount,
      inProgressCount,
      featuredCount,
      commonTechs,
      yearRange,
      totalProjects: projects.length
    }
  }, [projects])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Comparison Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed inset-4 md:inset-8 z-50 flex flex-col
              pixel-border bg-gray-900/95 backdrop-blur-md overflow-hidden
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ArrowsRightLeftIcon className="h-5 w-5 text-green-400" />
                  <h2 className="font-mono text-lg font-bold text-white">
                    Project Comparison
                  </h2>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono pixel-border border-green-500/50">
                    {projects.length} projects
                  </span>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 pixel-border bg-gray-800/50">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`
                      px-3 py-1 font-mono text-xs transition-all duration-200
                      ${viewMode === 'cards' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`
                      px-3 py-1 font-mono text-xs transition-all duration-200
                      ${viewMode === 'table' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    Table
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="
                  p-2 text-gray-400 hover:text-white pixel-border bg-gray-800/50
                  hover:bg-gray-700/50 transition-all duration-200
                "
                title="Close comparison"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Insights */}
            {insights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-4 border-b border-gray-700 bg-blue-500/5"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <ChartBarIcon className="h-4 w-4 text-blue-400" />
                  <h3 className="font-mono text-sm text-blue-400 font-semibold">Insights</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="text-center">
                    <div className="text-lg text-green-400 font-bold">{insights.completedCount}</div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-yellow-400 font-bold">{insights.inProgressCount}</div>
                    <div className="text-gray-400">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-purple-400 font-bold">{insights.featuredCount}</div>
                    <div className="text-gray-400">Featured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-cyan-400 font-bold">
                      {insights.yearRange ? `${insights.yearRange.min}-${insights.yearRange.max}` : '—'}
                    </div>
                    <div className="text-gray-400">Year Range</div>
                  </div>
                </div>
                
                {insights.commonTechs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Common Technologies:</div>
                    <div className="flex flex-wrap gap-1">
                      {insights.commonTechs.map(([tech, count]) => (
                        <span key={tech} className="px-2 py-1 bg-green-500/20 text-green-400 pixel-border border-green-500/50 text-xs">
                          {tech} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {projects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <ArrowsRightLeftIcon className="h-16 w-16 text-gray-600 mx-auto" />
                    <div>
                      <h3 className="font-mono text-lg text-white mb-2">No Projects to Compare</h3>
                      <p className="text-gray-400 font-mono text-sm">
                        Add projects to comparison to see detailed side-by-side analysis
                      </p>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(projects.length, 3)}, 1fr)` }}>
                  {projects.map((project, index) => (
                    <ProjectColumn
                      key={project.id}
                      project={project}
                      index={index}
                      onRemove={() => onRemoveProject(project.id)}
                      onDemoClick={() => onDemoClick?.(project)}
                    />
                  ))}
                </div>
              ) : (
                <ComparisonTable
                  projects={projects}
                  onRemoveProject={onRemoveProject}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}