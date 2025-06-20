'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../Providers'
import Image from 'next/image'

interface ProjectCardData {
  id: string
  title: string
  description: string
  shortDescription?: string
  image: string
  demoUrl?: string
  githubUrl?: string
  technologies: Technology[]
  category: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  stats: ProjectStats
  timeline: ProjectTimeline
  color: string
  gradient?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface Technology {
  name: string
  icon: string
  color: string
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'framework' | 'language'
  proficiency: number // 1-5
}

interface ProjectStats {
  stars?: number
  forks?: number
  issues?: number
  commits?: number
  contributors?: number
  downloads?: number
  views?: number
  likes?: number
  complexity: 1 | 2 | 3 | 4 | 5
  performance: number // 1-100
  completeness: number // 1-100
}

interface ProjectTimeline {
  startDate: Date
  endDate?: Date
  milestones: number
  completedMilestones: number
  estimatedHours: number
  actualHours?: number
}

interface InteractiveProjectCardProps {
  project: ProjectCardData
  viewMode: 'card' | 'list' | 'compact' | 'detailed'
  onSelect: (project: ProjectCardData) => void
  onHover?: (project: ProjectCardData | null) => void
  onAction: (action: 'demo' | 'github' | 'like' | 'share', project: ProjectCardData) => void
  showStats?: boolean
  showTechnologies?: boolean
  showTimeline?: boolean
  interactive?: boolean
  className?: string
}

export default function InteractiveProjectCard({
  project,
  viewMode = 'card',
  onSelect,
  onHover,
  onAction,
  showStats = true,
  showTechnologies = true,
  showTimeline = false,
  interactive = true,
  className = ''
}: InteractiveProjectCardProps) {
  const { theme } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [tiltStyle, setTiltStyle] = useState({})
  const [glowIntensity, setGlowIntensity] = useState(0)

  // Advanced hover effects with mouse tracking
  useEffect(() => {
    if (!cardRef.current || !interactive) return

    const card = cardRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY
      
      // Calculate tilt (max 15 degrees)
      const rotateX = (mouseY / rect.height) * -15
      const rotateY = (mouseX / rect.width) * 15
      
      // Calculate glow intensity based on distance from center
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
      const maxDistance = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2)
      const intensity = Math.max(0, 1 - distance / maxDistance)
      
      setMousePosition({ x: mouseX, y: mouseY })
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? 20 : 0}px)`,
        transition: isHovered ? 'none' : 'transform 0.3s ease-out'
      })
      setGlowIntensity(intensity)
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      onHover?.(project)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: 'transform 0.3s ease-out'
      })
      setGlowIntensity(0)
      onHover?.(null)
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovered, interactive, onHover, project])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'planning': return '#3b82f6'
      case 'archived': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🚧'
      case 'planning': return '📋'
      case 'archived': return '📦'
      default: return '❓'
    }
  }

  const getComplexityStars = (complexity: number): string => {
    return '⭐'.repeat(complexity) + '☆'.repeat(5 - complexity)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const calculateProgress = (): number => {
    return Math.round((project.timeline.completedMilestones / project.timeline.milestones) * 100)
  }

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        className={`group flex items-center space-x-4 p-4 pixel-border bg-gray-800/40 hover:bg-gray-700/60 rounded-lg transition-all duration-300 cursor-pointer ${className}`}
        style={tiltStyle}
        onClick={() => onSelect(project)}
      >
        {/* Image */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded pixel-border"
          />
          <div
            className="absolute inset-0 rounded"
            style={{
              background: `linear-gradient(45deg, ${project.color}20, transparent)`,
              opacity: isHovered ? 0.6 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-pixel text-green-400 truncate">{project.title}</h3>
            <span className="text-xs">{getStatusIcon(project.status)}</span>
            {project.featured && <span className="text-xs">⭐</span>}
          </div>
          <p className="text-sm text-gray-300 truncate mb-2">
            {project.shortDescription || project.description}
          </p>
          {showTechnologies && (
            <div className="flex space-x-1">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-mono rounded"
                  style={{
                    backgroundColor: `${tech.color}20`,
                    color: tech.color
                  }}
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-xs text-gray-400">+{project.technologies.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
            {project.stats.stars && (
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>{formatNumber(project.stats.stars)}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <span>📊</span>
              <span>{project.stats.completeness}%</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.demoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('demo', project)
              }}
              className="px-2 py-1 bg-green-600/60 hover:bg-green-500/60 text-white text-xs rounded transition-colors"
            >
              Demo
            </button>
          )}
          {project.githubUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('github', project)
              }}
              className="px-2 py-1 bg-gray-600/60 hover:bg-gray-500/60 text-white text-xs rounded transition-colors"
            >
              Code
            </button>
          )}
        </div>
      </div>
    )
  }

  if (viewMode === 'compact') {
    return (
      <div
        ref={cardRef}
        className={`group relative p-3 pixel-border bg-gray-800/40 hover:bg-gray-700/60 rounded-lg transition-all duration-300 cursor-pointer ${className}`}
        style={tiltStyle}
        onClick={() => onSelect(project)}
      >
        <div className="flex items-start space-x-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-pixel text-sm text-green-400 truncate mb-1">
              {project.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs">
              <span
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: `${getStatusColor(project.status)}20`,
                  color: getStatusColor(project.status)
                }}
              >
                {project.status}
              </span>
              <span className="text-gray-400">{calculateProgress()}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default card view
  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden pixel-border rounded-lg transition-all duration-500 cursor-pointer ${className}`}
      style={{
        ...tiltStyle,
        background: project.gradient || `linear-gradient(135deg, ${project.color}10, #1f293710)`,
        boxShadow: isHovered 
          ? `0 20px 40px rgba(16, 185, 129, ${glowIntensity * 0.3}), 0 0 20px rgba(16, 185, 129, ${glowIntensity * 0.2})`
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={() => onSelect(project)}
    >
      {/* Image Container */}
      <div
        ref={imageRef}
        className="relative h-48 overflow-hidden"
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
          style={{
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <div
            className="flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm font-mono text-xs"
            style={{
              backgroundColor: `${getStatusColor(project.status)}20`,
              color: getStatusColor(project.status),
              border: `1px solid ${getStatusColor(project.status)}40`
            }}
          >
            <span>{getStatusIcon(project.status)}</span>
            <span>{project.status}</span>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full backdrop-blur-sm font-mono text-xs border border-yellow-500/40">
              ⭐ Featured
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <div
          className="absolute inset-0 flex items-center justify-center space-x-3"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.3s ease'
          }}
        >
          {project.demoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('demo', project)
              }}
              className="px-4 py-2 bg-green-600/80 hover:bg-green-500/80 text-white font-mono text-sm rounded-lg backdrop-blur-sm transition-colors pixel-border-sm"
            >
              🚀 Demo
            </button>
          )}
          {project.githubUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('github', project)
              }}
              className="px-4 py-2 bg-gray-600/80 hover:bg-gray-500/80 text-white font-mono text-sm rounded-lg backdrop-blur-sm transition-colors pixel-border-sm"
            >
              📂 Code
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="flex items-start justify-between">
          <h3 className="font-pixel text-lg text-green-400 leading-tight">
            {project.title}
          </h3>
          <div className="flex space-x-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('like', project)
              }}
              className="p-1 hover:bg-gray-700/60 rounded transition-colors"
            >
              <span className="text-red-400">❤️</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('share', project)
              }}
              className="p-1 hover:bg-gray-700/60 rounded transition-colors"
            >
              <span className="text-blue-400">📤</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Technologies */}
        {showTechnologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-mono"
                style={{
                  backgroundColor: `${tech.color}15`,
                  color: tech.color,
                  border: `1px solid ${tech.color}30`
                }}
              >
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
            {project.technologies.length > 4 && (
              <div className="px-2 py-1 bg-gray-700/40 text-gray-400 rounded text-xs font-mono">
                +{project.technologies.length - 4} more
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Complexity:</span>
                <span>{getComplexityStars(project.stats.complexity)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Performance:</span>
                <span className="text-green-400">{project.stats.performance}%</span>
              </div>
            </div>
            <div className="space-y-1">
              {project.stats.stars && (
                <div className="flex justify-between text-gray-400">
                  <span>⭐ Stars:</span>
                  <span className="text-yellow-400">{formatNumber(project.stats.stars)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Progress:</span>
                <span className="text-blue-400">{project.stats.completeness}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {showTimeline && (
          <div className="pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-400">Timeline</span>
              <span className="text-xs font-mono text-green-400">
                {project.timeline.completedMilestones}/{project.timeline.milestones} milestones
              </span>
            </div>
            <div className="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animated Border Effect */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent, ${project.color}40, transparent)`,
          opacity: isHovered ? 0.3 : 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Press Effect */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/5 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}