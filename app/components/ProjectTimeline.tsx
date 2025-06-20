'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlayIcon,
  CodeBracketIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Project, CurrentProject } from '@/content/projects'
import TechBadges from './TechBadges'

interface ProjectTimelineProps {
  projects: (Project | CurrentProject)[]
  onProjectClick?: (project: Project | CurrentProject) => void
  onDemoClick?: (project: Project | CurrentProject) => void
  className?: string
  compact?: boolean
}

interface TimelineEvent {
  id: string
  project: Project | CurrentProject
  year: number
  month?: number
  date: Date
  type: 'start' | 'milestone' | 'completion'
  status: 'completed' | 'in-progress' | 'planned'
}

interface TimelineYearProps {
  year: number
  events: TimelineEvent[]
  isVisible: boolean
  onProjectClick?: (project: Project | CurrentProject) => void
  onDemoClick?: (project: Project | CurrentProject) => void
  compact: boolean
}

const STATUS_CONFIG = {
  completed: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    icon: CheckCircleIcon,
    dotColor: 'bg-green-400'
  },
  'in-progress': {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    icon: ClockIcon,
    dotColor: 'bg-yellow-400'
  },
  planned: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    icon: ExclamationTriangleIcon,
    dotColor: 'bg-blue-400'
  }
}

function TimelineNode({ 
  event, 
  index, 
  onProjectClick, 
  onDemoClick, 
  compact 
}: { 
  event: TimelineEvent
  index: number
  onProjectClick?: (project: Project | CurrentProject) => void
  onDemoClick?: (project: Project | CurrentProject) => void
  compact: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" })
  
  const config = STATUS_CONFIG[event.status]
  const StatusIcon = config.icon
  const isCurrentProject = 'progress' in event.project

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline Dot */}
      <div className={`
        absolute ${index % 2 === 0 ? 'right-0' : 'left-0'} top-4 w-4 h-4 rounded-full
        ${config.dotColor} border-2 border-gray-900 z-10
        transform ${index % 2 === 0 ? 'translate-x-2' : '-translate-x-2'}
        transition-all duration-300
        ${isHovered ? 'scale-125 shadow-lg' : 'scale-100'}
      `}>
        <motion.div
          className="absolute inset-0 rounded-full bg-current opacity-30"
          animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
      </div>

      {/* Project Card */}
      <motion.div
        className={`
          pixel-border bg-gray-900/80 backdrop-blur-sm p-4 max-w-md
          transition-all duration-300 cursor-pointer
          ${isHovered ? 'shadow-lg shadow-green-500/20 scale-105' : ''}
          ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}
        `}
        onClick={() => onProjectClick?.(event.project)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`
              font-mono font-bold text-white mb-1 text-sm
              ${compact ? 'text-xs' : 'text-sm'}
              group-hover:text-green-400 transition-colors duration-200
            `}>
              {event.project.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-xs">
              <div className={`
                flex items-center space-x-1 px-2 py-1 pixel-border font-mono
                ${config.color} ${config.bgColor} ${config.borderColor}
              `}>
                <StatusIcon className="h-3 w-3" />
                <span>{event.status.replace('-', ' ')}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-400 font-mono">
                <CalendarIcon className="h-3 w-3" />
                <span>{event.year}</span>
              </div>
            </div>
          </div>

          {event.project.featured && (
            <SparklesIcon className="h-4 w-4 text-yellow-400 ml-2" />
          )}
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-2">
            {event.project.description}
          </p>
        )}

        {/* Progress for Current Projects */}
        {isCurrentProject && event.project.progress !== undefined && (
          <div className="mb-3 space-y-1">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>Progress</span>
              <span>{event.project.progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <motion.div
                className="h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${event.project.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {!compact && (
          <div className="mb-3">
            <TechBadges
              technologies={event.project.tags.slice(0, 3)}
              size="sm"
              maxVisible={3}
              showCount={false}
              layout="horizontal"
              animated={false}
              interactive={false}
            />
            {event.project.tags.length > 3 && (
              <span className="text-xs text-gray-500 font-mono ml-1">
                +{event.project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {event.project.demo && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDemoClick?.(event.project)
              }}
              className="
                flex items-center space-x-1 px-2 py-1 pixel-border 
                bg-green-500/20 text-green-400 border-green-500/50 
                hover:bg-green-500/30 transition-all duration-200 font-mono text-xs
              "
            >
              <PlayIcon className="h-3 w-3" />
              <span>Demo</span>
            </button>
          )}
          
          {event.project.github && (
            <a
              href={event.project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                flex items-center space-x-1 px-2 py-1 pixel-border 
                bg-gray-500/20 text-gray-400 border-gray-500/50 
                hover:bg-gray-500/30 hover:text-white transition-all duration-200 font-mono text-xs
              "
            >
              <CodeBracketIcon className="h-3 w-3" />
              <span>Code</span>
            </a>
          )}
        </div>

        {/* Hover Arrow */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`
                absolute top-1/2 transform -translate-y-1/2
                ${index % 2 === 0 ? '-right-2' : '-left-2'}
              `}
            >
              <ArrowRightIcon className={`
                h-4 w-4 text-green-400
                ${index % 2 === 0 ? '' : 'rotate-180'}
              `} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function TimelineYear({ 
  year, 
  events, 
  isVisible, 
  onProjectClick, 
  onDemoClick, 
  compact 
}: TimelineYearProps) {
  const yearRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(yearRef, { once: true, margin: "-50px" })

  return (
    <div ref={yearRef} className="relative">
      {/* Year Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-8"
      >
        <div className="pixel-border bg-gray-900/90 backdrop-blur-sm px-6 py-3">
          <h2 className="font-mono text-2xl font-bold text-green-400 text-center">
            {year}
          </h2>
          <div className="text-xs text-gray-400 font-mono text-center mt-1">
            {events.length} project{events.length !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.div>

      {/* Events */}
      <div className="space-y-8">
        {events.map((event, index) => (
          <TimelineNode
            key={event.id}
            event={event}
            index={index}
            onProjectClick={onProjectClick}
            onDemoClick={onDemoClick}
            compact={compact}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProjectTimeline({
  projects,
  onProjectClick,
  onDemoClick,
  className = "",
  compact = false
}: ProjectTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'year'>('all')

  // Convert projects to timeline events
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = []

    projects.forEach(project => {
      if (!project.year) return

      // Main project event
      events.push({
        id: project.id,
        project,
        year: project.year,
        date: new Date(project.year, 0, 1),
        type: project.status === 'completed' ? 'completion' : 'start',
        status: project.status
      })

      // Current project milestones
      if ('startDate' in project && project.startDate) {
        const startDate = new Date(project.startDate)
        if (startDate.getFullYear() !== project.year) {
          events.push({
            id: `${project.id}-start`,
            project,
            year: startDate.getFullYear(),
            month: startDate.getMonth(),
            date: startDate,
            type: 'start',
            status: project.status
          })
        }
      }
    })

    return events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [projects])

  // Group events by year
  const eventsByYear = useMemo(() => {
    const grouped = new Map<number, TimelineEvent[]>()
    
    timelineEvents.forEach(event => {
      const year = event.year
      if (!grouped.has(year)) {
        grouped.set(year, [])
      }
      grouped.get(year)!.push(event)
    })

    // Sort each year's events
    grouped.forEach(events => {
      events.sort((a, b) => {
        // Sort by status priority: completed, in-progress, planned
        const statusPriority = { completed: 0, 'in-progress': 1, planned: 2 }
        return statusPriority[a.status] - statusPriority[b.status]
      })
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => b - a) // Most recent first
  }, [timelineEvents])

  const years = eventsByYear.map(([year]) => year)
  const currentYearIndex = selectedYear ? years.indexOf(selectedYear) : -1

  const navigateYear = (direction: 'prev' | 'next') => {
    if (currentYearIndex === -1) return
    
    if (direction === 'prev' && currentYearIndex > 0) {
      setSelectedYear(years[currentYearIndex - 1])
    } else if (direction === 'next' && currentYearIndex < years.length - 1) {
      setSelectedYear(years[currentYearIndex + 1])
    }
  }

  const displayEvents = viewMode === 'year' && selectedYear 
    ? eventsByYear.filter(([year]) => year === selectedYear)
    : eventsByYear

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="font-mono text-xl font-bold text-white flex items-center">
            <ClockIcon className="h-5 w-5 text-green-400 mr-2" />
            Project Timeline
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('all')}
              className={`
                px-3 py-1 pixel-border font-mono text-xs transition-all duration-200
                ${viewMode === 'all' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30'
                }
              `}
            >
              All Years
            </button>
            <button
              onClick={() => {
                setViewMode('year')
                if (!selectedYear) setSelectedYear(years[0])
              }}
              className={`
                px-3 py-1 pixel-border font-mono text-xs transition-all duration-200
                ${viewMode === 'year' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30'
                }
              `}
            >
              By Year
            </button>
          </div>
        </div>

        {/* Year Navigation */}
        {viewMode === 'year' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateYear('prev')}
              disabled={currentYearIndex <= 0}
              className="
                p-2 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 
                hover:bg-gray-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="
                px-3 py-2 bg-gray-800 border border-gray-600 text-white 
                font-mono text-sm focus:border-green-400 focus:outline-none
              "
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button
              onClick={() => navigateYear('next')}
              disabled={currentYearIndex >= years.length - 1}
              className="
                p-2 pixel-border bg-gray-500/20 text-gray-400 border-gray-500/50 
                hover:bg-gray-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-green-400 via-cyan-400 to-blue-400 opacity-30" 
             style={{ height: '100%' }} />

        {/* Timeline Content */}
        <div className="space-y-16">
          {displayEvents.map(([year, events]) => (
            <TimelineYear
              key={year}
              year={year}
              events={events}
              isVisible={true}
              onProjectClick={onProjectClick}
              onDemoClick={onDemoClick}
              compact={compact}
            />
          ))}
        </div>

        {/* End Cap */}
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pixel-border bg-gray-900/80 backdrop-blur-sm px-4 py-2"
          >
            <div className="text-xs text-gray-400 font-mono text-center">
              {timelineEvents.length} projects • {years.length} years of development
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}