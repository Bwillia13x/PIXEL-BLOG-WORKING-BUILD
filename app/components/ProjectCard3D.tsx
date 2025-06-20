'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { 
  PlayIcon, 
  CodeBracketIcon, 
  EyeIcon, 
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { Project, CurrentProject } from '@/content/projects'

interface ProjectCard3DProps {
  project: Project | CurrentProject
  index?: number
  onDemoClick?: (project: Project | CurrentProject) => void
  onCompareClick?: (project: Project | CurrentProject) => void
  isInComparison?: boolean
  canAddToComparison?: boolean
  showComparisonButton?: boolean
  comparisonMode?: 'add' | 'remove'
  className?: string
}

interface StatusConfig {
  color: string
  bgColor: string
  borderColor: string
  icon: typeof CheckCircleIcon
  label: string
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
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

function TechBadge({ tech, delay = 0 }: { tech: string, delay?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Tech-specific colors
  const getTechColor = (tech: string) => {
    const techLower = tech.toLowerCase()
    if (techLower.includes('react') || techLower.includes('next')) return 'blue'
    if (techLower.includes('typescript') || techLower.includes('javascript')) return 'yellow'
    if (techLower.includes('python') || techLower.includes('ai')) return 'green'
    if (techLower.includes('webgl') || techLower.includes('three')) return 'purple'
    if (techLower.includes('value') || techLower.includes('financial')) return 'emerald'
    return 'gray'
  }

  const color = getTechColor(tech)
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30',
    green: 'text-green-400 bg-green-500/20 border-green-500/50 hover:bg-green-500/30',
    purple: 'text-purple-400 bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30',
    gray: 'text-gray-400 bg-gray-500/20 border-gray-500/50 hover:bg-gray-500/30'
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-block px-2 py-1 text-xs font-mono pixel-border 
        transition-all duration-200 cursor-default transform
        ${colorClasses[color]}
        ${isHovered ? 'scale-110 -translate-y-1' : ''}
      `}
    >
      {tech}
    </motion.span>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 pixel-border">
      <motion.div
        className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  )
}

export default function ProjectCard3D({
  project,
  index = 0,
  onDemoClick,
  onCompareClick,
  isInComparison = false,
  canAddToComparison = true,
  showComparisonButton = false,
  comparisonMode = 'add',
  className = ""
}: ProjectCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position tracking for 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]), {
    stiffness: 400,
    damping: 30
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), {
    stiffness: 400,
    damping: 30
  })

  // Depth layers
  const translateZ1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 5]), {
    stiffness: 400,
    damping: 30
  })
  const translateZ2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 10]), {
    stiffness: 400,
    damping: 30
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = event.clientX - rect.left
    const mouseYPos = event.clientY - rect.top

    // Normalize to -0.5 to 0.5
    const xPct = (mouseXPos / width) - 0.5
    const yPct = (mouseYPos / height) - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const statusConfig = STATUS_CONFIG[project.status]
  const StatusIcon = statusConfig.icon
  const isCurrentProject = 'progress' in project

  return (
    <motion.div
      ref={cardRef}
      className={`group relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* 3D Card Container */}
      <motion.div
        className="relative w-full preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Main Card */}
        <motion.div
          className={`
            relative pixel-border bg-gray-900/80 backdrop-blur-sm
            transition-all duration-300 overflow-hidden
            ${isHovered ? 'shadow-2xl shadow-green-500/20' : 'shadow-lg shadow-black/20'}
            ${isInComparison ? 'ring-2 ring-cyan-400' : ''}
          `}
          style={{
            translateZ: translateZ1,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Background Glow Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-green-400/5 to-cyan-400/5
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `} />

          {/* Content Container */}
          <div className="relative p-6 space-y-4">
            {/* Header */}
            <motion.div
              style={{ translateZ: translateZ2 }}
              className="flex items-start justify-between"
            >
              <div className="flex-1">
                <h3 className="text-xl font-mono font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-200">
                  {project.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
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
                  
                  {project.year && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400 font-mono">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{project.year}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              style={{ translateZ: translateZ1 }}
              className="text-sm text-gray-300 leading-relaxed line-clamp-3"
            >
              {project.description}
            </motion.p>

            {/* Progress Bar for Current Projects */}
            {isCurrentProject && project.progress !== undefined && (
              <motion.div
                style={{ translateZ: translateZ2 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs font-mono text-gray-400">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <ProgressBar progress={project.progress} />
              </motion.div>
            )}

            {/* Technology Stack */}
            <motion.div
              style={{ translateZ: translateZ1 }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-1 text-xs text-gray-500 font-mono">
                <CodeBracketIcon className="h-3 w-3" />
                <span>Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 4).map((tech, index) => (
                  <TechBadge 
                    key={tech} 
                    tech={tech} 
                    delay={index * 0.1} 
                  />
                ))}
                {project.tags.length > 4 && (
                  <span className="text-xs text-gray-500 font-mono px-2 py-1">
                    +{project.tags.length - 4} more
                  </span>
                )}
              </div>
            </motion.div>

            {/* Highlights for Current Projects */}
            {isCurrentProject && project.highlights && (
              <motion.div
                style={{ translateZ: translateZ2 }}
                className="space-y-2"
              >
                <div className="text-xs text-gray-500 font-mono">Key Features</div>
                <ul className="space-y-1">
                  {project.highlights.slice(0, 2).map((highlight, index) => (
                    <li key={index} className="text-xs text-gray-400 font-mono flex items-start">
                      <span className="text-green-400 mr-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              style={{ translateZ: translateZ2 }}
              className="flex items-center justify-between pt-4 border-t border-gray-700"
            >
              <div className="flex items-center space-x-2">
                {project.demo && (
                  <button
                    onClick={() => onDemoClick?.(project)}
                    className="
                      flex items-center space-x-1 px-3 py-1 pixel-border 
                      bg-green-500/20 text-green-400 border-green-500/50 
                      hover:bg-green-500/30 transition-all duration-200 font-mono text-xs
                      pixel-hover
                    "
                  >
                    <PlayIcon className="h-3 w-3" />
                    <span>Demo</span>
                  </button>
                )}
                
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center space-x-1 px-3 py-1 pixel-border 
                      bg-gray-500/20 text-gray-400 border-gray-500/50 
                      hover:bg-gray-500/30 hover:text-white transition-all duration-200 font-mono text-xs
                      pixel-hover
                    "
                  >
                    <CodeBracketIcon className="h-3 w-3" />
                    <span>Code</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="
                    flex items-center space-x-1 px-3 py-1 pixel-border 
                    bg-blue-500/20 text-blue-400 border-blue-500/50 
                    hover:bg-blue-500/30 transition-all duration-200 font-mono text-xs
                    pixel-hover
                  "
                >
                  <EyeIcon className="h-3 w-3" />
                  <span>Details</span>
                </Link>

                {showComparisonButton && onCompareClick && (
                  <button
                    onClick={() => onCompareClick(project)}
                    disabled={comparisonMode === 'add' && !canAddToComparison && !isInComparison}
                    className={`
                      flex items-center space-x-1 px-3 py-1 pixel-border 
                      transition-all duration-200 font-mono text-xs pixel-hover
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isInComparison 
                        ? comparisonMode === 'remove'
                          ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 hover:text-white'
                      }
                    `}
                    title={
                      comparisonMode === 'remove' 
                        ? 'Remove from comparison'
                        : isInComparison 
                          ? 'In comparison' 
                          : canAddToComparison
                            ? 'Add to comparison'
                            : 'Comparison full (max 4)'
                    }
                  >
                    {comparisonMode === 'remove' ? (
                      <>
                        <XMarkIcon className="h-3 w-3" />
                        <span>Remove</span>
                      </>
                    ) : isInComparison ? (
                      <>
                        <ArrowsRightLeftIcon className="h-3 w-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-3 w-3" />
                        <span>Compare</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Hover Glow Border */}
          <div className={`
            absolute inset-0 pixel-border border-green-400/0 pointer-events-none
            transition-all duration-300
            ${isHovered ? 'border-green-400/50 shadow-lg shadow-green-400/20' : ''}
          `} />
        </motion.div>

        {/* 3D Shadow Layer */}
        <motion.div
          className="absolute inset-0 pixel-border bg-black/20 -z-10"
          style={{
            translateZ: -10,
            translateX: 2,
            translateY: 2
          }}
        />
      </motion.div>
    </motion.div>
  )
}