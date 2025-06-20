'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTheme } from '../Providers'

interface TechStack {
  id: string
  name: string
  category: TechCategory
  icon: string
  color: string
  description: string
  proficiency: number // 1-100
  usage: number // Number of projects using this tech
  popularity: number // Industry popularity score 1-100
  learningCurve: 'easy' | 'medium' | 'hard' | 'expert'
  documentation: number // 1-100
  community: number // 1-100
  performance: number // 1-100
  ecosystem: string[] // Related technologies
  versions: TechVersion[]
  alternatives: string[]
  projects: string[] // Project IDs using this tech
  firstUsed: Date
  lastUsed: Date
  certifications?: string[]
  links: {
    official?: string
    documentation?: string
    github?: string
    tutorial?: string
  }
}

interface TechVersion {
  version: string
  releaseDate: Date
  features: string[]
  breaking: boolean
  used: boolean
}

type TechCategory = 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'devops' 
  | 'mobile' 
  | 'desktop' 
  | 'ai-ml' 
  | 'blockchain' 
  | 'game-dev' 
  | 'design' 
  | 'testing' 
  | 'analytics'

interface TechnologyStackVisualizationProps {
  technologies: TechStack[]
  projects: { id: string; title: string; technologies: string[] }[]
  viewMode: 'grid' | 'network' | 'timeline' | 'categories' | 'proficiency'
  filterCategory?: TechCategory
  onTechSelect: (tech: TechStack) => void
  onTechHover?: (tech: TechStack | null) => void
  showConnections?: boolean
  showStats?: boolean
  interactive?: boolean
  className?: string
}

interface NetworkNode {
  id: string
  name: string
  category: TechCategory
  x: number
  y: number
  radius: number
  color: string
  connections: string[]
  proficiency: number
}

interface Connection {
  from: string
  to: string
  strength: number
  projects: string[]
}

export default function TechnologyStackVisualization({
  technologies,
  projects,
  viewMode,
  filterCategory,
  onTechSelect,
  onTechHover,
  showConnections = true,
  showStats = true,
  interactive = true,
  className = ''
}: TechnologyStackVisualizationProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'usage' | 'popularity'>('proficiency')
  const [groupBy, setGroupBy] = useState<'category' | 'proficiency' | 'usage'>('category')

  // Filter technologies based on category and search
  const filteredTechnologies = useMemo(() => {
    let filtered = technologies

    if (filterCategory) {
      filtered = filtered.filter(tech => tech.category === filterCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        tech.category.toLowerCase().includes(query)
      )
    }

    // Sort technologies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'proficiency':
          return b.proficiency - a.proficiency
        case 'usage':
          return b.usage - a.usage
        case 'popularity':
          return b.popularity - a.popularity
        default:
          return 0
      }
    })

    return filtered
  }, [technologies, filterCategory, searchQuery, sortBy])

  // Calculate technology connections based on project co-usage
  const techConnections = useMemo(() => {
    const connections: Connection[] = []
    const connectionMap = new Map<string, Map<string, Connection>>()

    projects.forEach(project => {
      const projectTechs = project.technologies
      
      // Create connections between technologies used in the same project
      for (let i = 0; i < projectTechs.length; i++) {
        for (let j = i + 1; j < projectTechs.length; j++) {
          const tech1 = projectTechs[i]
          const tech2 = projectTechs[j]
          const key = `${tech1}-${tech2}`
          
          if (!connectionMap.has(tech1)) {
            connectionMap.set(tech1, new Map())
          }
          
          if (!connectionMap.get(tech1)!.has(tech2)) {
            const connection: Connection = {
              from: tech1,
              to: tech2,
              strength: 1,
              projects: [project.id]
            }
            connectionMap.get(tech1)!.set(tech2, connection)
            connections.push(connection)
          } else {
            const connection = connectionMap.get(tech1)!.get(tech2)!
            connection.strength += 1
            connection.projects.push(project.id)
          }
        }
      }
    })

    return connections
  }, [projects])

  // Network layout calculation
  const networkNodes = useMemo(() => {
    if (viewMode !== 'network' || !containerRef.current) return []

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const centerX = width / 2
    const centerY = height / 2

    return filteredTechnologies.map((tech, index) => {
      // Position nodes in a circle based on category
      const categoryNodes = filteredTechnologies.filter(t => t.category === tech.category)
      const categoryIndex = categoryNodes.findIndex(t => t.id === tech.id)
      const categoryAngle = (categories.findIndex(c => c.id === tech.category) / categories.length) * 2 * Math.PI
      const nodeAngle = categoryAngle + (categoryIndex / categoryNodes.length) * 0.5

      const radius = 150 + (tech.proficiency / 100) * 100
      const x = centerX + Math.cos(nodeAngle) * radius
      const y = centerY + Math.sin(nodeAngle) * radius

      return {
        id: tech.id,
        name: tech.name,
        category: tech.category,
        x,
        y,
        radius: 8 + (tech.usage / 10) * 2,
        color: tech.color,
        connections: techConnections
          .filter(conn => conn.from === tech.id || conn.to === tech.id)
          .map(conn => conn.from === tech.id ? conn.to : conn.from),
        proficiency: tech.proficiency
      }
    })
  }, [filteredTechnologies, techConnections, viewMode])

  // Categories for organization
  const categories = [
    { id: 'frontend', name: 'Frontend', icon: '🎨', color: '#10b981' },
    { id: 'backend', name: 'Backend', icon: '⚙️', color: '#3b82f6' },
    { id: 'database', name: 'Database', icon: '🗄️', color: '#8b5cf6' },
    { id: 'devops', name: 'DevOps', icon: '🚀', color: '#f59e0b' },
    { id: 'mobile', name: 'Mobile', icon: '📱', color: '#ef4444' },
    { id: 'desktop', name: 'Desktop', icon: '💻', color: '#06b6d4' },
    { id: 'ai-ml', name: 'AI/ML', icon: '🤖', color: '#ec4899' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️', color: '#84cc16' },
    { id: 'game-dev', name: 'Game Dev', icon: '🎮', color: '#f97316' },
    { id: 'design', name: 'Design', icon: '🎭', color: '#14b8a6' },
    { id: 'testing', name: 'Testing', icon: '🧪', color: '#a855f7' },
    { id: 'analytics', name: 'Analytics', icon: '📊', color: '#22d3ee' }
  ] as const

  // Draw network visualization
  useEffect(() => {
    if (viewMode !== 'network' || !canvasRef.current || networkNodes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw connections
      if (showConnections) {
        techConnections.forEach(connection => {
          const fromNode = networkNodes.find(n => n.id === connection.from)
          const toNode = networkNodes.find(n => n.id === connection.to)
          
          if (fromNode && toNode) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${Math.min(connection.strength / 5, 0.8)})`
            ctx.lineWidth = Math.min(connection.strength / 2, 3)
            ctx.beginPath()
            ctx.moveTo(fromNode.x, fromNode.y)
            ctx.lineTo(toNode.x, toNode.y)
            ctx.stroke()
          }
        })
      }

      // Draw nodes
      networkNodes.forEach(node => {
        const isHovered = hoveredTech === node.id
        const isSelected = selectedTech === node.id
        
        // Node circle
        ctx.fillStyle = node.color
        ctx.globalAlpha = isHovered || isSelected ? 1 : 0.8
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + (isHovered ? 3 : 0), 0, 2 * Math.PI)
        ctx.fill()
        
        // Node border
        ctx.strokeStyle = isSelected ? '#ffffff' : node.color
        ctx.lineWidth = isSelected ? 3 : 1
        ctx.stroke()
        
        // Node label
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.globalAlpha = isHovered ? 1 : 0.7
        ctx.fillText(node.name, node.x, node.y + node.radius + 15)
        
        ctx.globalAlpha = 1
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [viewMode, networkNodes, techConnections, hoveredTech, selectedTech, showConnections])

  // Handle canvas interactions
  useEffect(() => {
    if (viewMode !== 'network' || !canvasRef.current || !interactive) return

    const canvas = canvasRef.current

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      let foundNode = null
      for (const node of networkNodes) {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        if (distance <= node.radius + 5) {
          foundNode = node
          break
        }
      }

      if (foundNode) {
        setHoveredTech(foundNode.id)
        canvas.style.cursor = 'pointer'
        const tech = technologies.find(t => t.id === foundNode.id)
        if (tech) onTechHover?.(tech)
      } else {
        setHoveredTech(null)
        canvas.style.cursor = 'default'
        onTechHover?.(null)
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (hoveredTech) {
        setSelectedTech(hoveredTech)
        const tech = technologies.find(t => t.id === hoveredTech)
        if (tech) onTechSelect(tech)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
    }
  }, [viewMode, networkNodes, hoveredTech, technologies, onTechSelect, onTechHover, interactive])

  const getProficiencyColor = (proficiency: number): string => {
    if (proficiency >= 80) return '#10b981'
    if (proficiency >= 60) return '#f59e0b'
    if (proficiency >= 40) return '#ef4444'
    return '#6b7280'
  }

  const getLearningCurveColor = (curve: string): string => {
    switch (curve) {
      case 'easy': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'hard': return '#ef4444'
      case 'expert': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredTechnologies.map((tech) => (
        <div
          key={tech.id}
          className={`pixel-border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
            selectedTech === tech.id ? 'ring-2 ring-green-400' : ''
          }`}
          style={{
            background: `linear-gradient(135deg, ${tech.color}15, transparent)`,
            borderColor: `${tech.color}40`
          }}
          onClick={() => {
            setSelectedTech(tech.id)
            onTechSelect(tech)
          }}
          onMouseEnter={() => onTechHover?.(tech)}
          onMouseLeave={() => onTechHover?.(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{tech.icon}</span>
              <h3 className="font-mono text-green-400 font-semibold">{tech.name}</h3>
            </div>
            <span
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                backgroundColor: `${getProficiencyColor(tech.proficiency)}20`,
                color: getProficiencyColor(tech.proficiency)
              }}
            >
              {tech.proficiency}%
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {tech.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Usage:</span>
              <span className="text-blue-400">{tech.usage} projects</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Popularity:</span>
              <span className="text-purple-400">{tech.popularity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Learning:</span>
              <span style={{ color: getLearningCurveColor(tech.learningCurve) }}>
                {tech.learningCurve}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Docs:</span>
              <span className="text-green-400">{tech.documentation}%</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Proficiency</span>
                <span>{tech.proficiency}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${tech.proficiency}%`,
                    backgroundColor: getProficiencyColor(tech.proficiency)
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Performance</span>
                <span>{tech.performance}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${tech.performance}%`,
                    backgroundColor: tech.color
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category Badge */}
          <div className="mt-3 flex justify-between items-center">
            <span
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                backgroundColor: `${categories.find(c => c.id === tech.category)?.color}20`,
                color: categories.find(c => c.id === tech.category)?.color
              }}
            >
              {categories.find(c => c.id === tech.category)?.icon} {tech.category}
            </span>
            
            {tech.certifications && tech.certifications.length > 0 && (
              <span className="text-xs text-yellow-400">🏆 Certified</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderCategoryView = () => {
    const groupedByCategory = categories.map(category => ({
      ...category,
      technologies: filteredTechnologies.filter(tech => tech.category === category.id)
    })).filter(group => group.technologies.length > 0)

    return (
      <div className="space-y-6">
        {groupedByCategory.map((group) => (
          <div key={group.id} className="pixel-border bg-gray-800/40 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{group.icon}</span>
              <h3 className="font-pixel text-lg" style={{ color: group.color }}>
                {group.name}
              </h3>
              <span className="text-sm text-gray-400">
                ({group.technologies.length} technologies)
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center space-x-3 p-3 bg-gray-900/40 rounded cursor-pointer hover:bg-gray-700/40 transition-colors"
                  onClick={() => {
                    setSelectedTech(tech.id)
                    onTechSelect(tech)
                  }}
                >
                  <span className="text-xl">{tech.icon}</span>
                  <div className="flex-1">
                    <div className="font-mono text-green-400 text-sm">{tech.name}</div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span
                        className="font-mono"
                        style={{ color: getProficiencyColor(tech.proficiency) }}
                      >
                        {tech.proficiency}%
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{tech.usage} projects</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderTimelineView = () => {
    const sortedByFirstUse = [...filteredTechnologies].sort((a, b) => 
      a.firstUsed.getTime() - b.firstUsed.getTime()
    )

    return (
      <div className="space-y-4">
        {sortedByFirstUse.map((tech, index) => (
          <div
            key={tech.id}
            className="flex items-center space-x-4 p-4 pixel-border bg-gray-800/40 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
            onClick={() => {
              setSelectedTech(tech.id)
              onTechSelect(tech)
            }}
          >
            <div className="flex-shrink-0 w-24 text-sm font-mono text-gray-400">
              {tech.firstUsed.getFullYear()}
            </div>
            
            <div className="flex-shrink-0">
              <span className="text-2xl">{tech.icon}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-mono text-green-400">{tech.name}</h3>
                <span
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${tech.color}20`,
                    color: tech.color
                  }}
                >
                  {tech.category}
                </span>
              </div>
              <p className="text-sm text-gray-300">{tech.description}</p>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-mono" style={{ color: getProficiencyColor(tech.proficiency) }}>
                {tech.proficiency}%
              </div>
              <div className="text-xs text-gray-400">{tech.usage} projects</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderNetworkView = () => (
    <div className="relative w-full h-96" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="w-full h-full pixel-border rounded-lg bg-gray-900/40"
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 pixel-border bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="font-mono text-sm text-green-400 mb-2">Legend</h4>
        <div className="space-y-1 text-xs font-mono text-gray-400">
          <div>• Node size = Usage</div>
          <div>• Distance from center = Proficiency</div>
          <div>• Line thickness = Co-usage</div>
          <div>• Click to select • Hover for details</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 space-x-2">
        <button
          onClick={() => setShowConnections(!showConnections)}
          className={`px-3 py-1 font-mono text-xs rounded transition-colors pixel-border-sm ${
            showConnections
              ? 'bg-green-600/60 text-white'
              : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
          }`}
        >
          {showConnections ? 'Hide' : 'Show'} Connections
        </button>
      </div>
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-pixel text-xl text-green-400">Technology Stack</h2>
          <div className="text-sm text-gray-400">
            {filteredTechnologies.length} technologies • {categories.length} categories
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies..."
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
          >
            <option value="proficiency">Sort by Proficiency</option>
            <option value="usage">Sort by Usage</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'categories' && renderCategoryView()}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'network' && renderNetworkView()}

      {/* Statistics */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
            <div className="text-2xl text-green-400">{technologies.length}</div>
            <div className="text-sm text-gray-400 font-mono">Total Technologies</div>
          </div>
          <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
            <div className="text-2xl text-blue-400">
              {Math.round(technologies.reduce((sum, tech) => sum + tech.proficiency, 0) / technologies.length)}%
            </div>
            <div className="text-sm text-gray-400 font-mono">Avg Proficiency</div>
          </div>
          <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
            <div className="text-2xl text-purple-400">
              {technologies.filter(tech => tech.proficiency >= 80).length}
            </div>
            <div className="text-sm text-gray-400 font-mono">Expert Level</div>
          </div>
          <div className="pixel-border bg-gray-800/40 rounded-lg p-4 text-center">
            <div className="text-2xl text-yellow-400">
              {technologies.filter(tech => tech.certifications && tech.certifications.length > 0).length}
            </div>
            <div className="text-sm text-gray-400 font-mono">Certifications</div>
          </div>
        </div>
      )}
    </div>
  )
}