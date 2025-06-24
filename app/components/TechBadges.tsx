'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  SparklesIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline'

interface TechBadgesProps {
  technologies: string[]
  maxVisible?: number
  showCount?: boolean
  animated?: boolean
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical' | 'grid'
  onTechClick?: (tech: string) => void
  className?: string
}

interface TechConfig {
  color: string
  bgColor: string
  borderColor: string
  hoverBg: string
  icon?: string
  category: string
  popularity: number
}

// Comprehensive technology configuration
const TECH_CONFIG: Record<string, TechConfig> = {
  // Frontend Frameworks
  'React': { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: '⚛️', category: 'Frontend', popularity: 95 },
  'Next.js': { color: 'text-gray-200', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/50', hoverBg: 'hover:bg-gray-500/30', icon: '▲', category: 'Frontend', popularity: 90 },
  'Vue.js': { color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50', hoverBg: 'hover:bg-green-500/30', icon: '🟢', category: 'Frontend', popularity: 80 },
  'Angular': { color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', hoverBg: 'hover:bg-red-500/30', icon: '🅰️', category: 'Frontend', popularity: 75 },
  
  // Languages
  'TypeScript': { color: 'text-blue-300', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: 'TS', category: 'Language', popularity: 85 },
  'JavaScript': { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', hoverBg: 'hover:bg-yellow-500/30', icon: 'JS', category: 'Language', popularity: 95 },
  'Python': { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: '🐍', category: 'Language', popularity: 90 },
  'Rust': { color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50', hoverBg: 'hover:bg-orange-500/30', icon: '🦀', category: 'Language', popularity: 70 },
  
  // Styling
  'CSS3': { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: '🎨', category: 'Styling', popularity: 90 },
  'Tailwind CSS': { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/50', hoverBg: 'hover:bg-cyan-500/30', icon: '💨', category: 'Styling', popularity: 85 },
  'SCSS': { color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50', hoverBg: 'hover:bg-pink-500/30', icon: '💅', category: 'Styling', popularity: 70 },
  
  // 3D/Graphics
  'WebGL': { color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50', hoverBg: 'hover:bg-purple-500/30', icon: '🎮', category: '3D/Graphics', popularity: 60 },
  'Three.js': { color: 'text-purple-300', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50', hoverBg: 'hover:bg-purple-500/30', icon: '🔺', category: '3D/Graphics', popularity: 75 },
  'WebGPU': { color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500/50', hoverBg: 'hover:bg-indigo-500/30', icon: '⚡', category: '3D/Graphics', popularity: 50 },
  'GLSL': { color: 'text-teal-400', bgColor: 'bg-teal-500/20', borderColor: 'border-teal-500/50', hoverBg: 'hover:bg-teal-500/30', icon: '🔧', category: '3D/Graphics', popularity: 45 },
  
  // Data & Visualization
  'D3.js': { color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50', hoverBg: 'hover:bg-orange-500/30', icon: '📊', category: 'Data Viz', popularity: 70 },
  'Chart.js': { color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50', hoverBg: 'hover:bg-pink-500/30', icon: '📈', category: 'Data Viz', popularity: 75 },
  'Plotly.js': { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: '📉', category: 'Data Viz', popularity: 65 },
  
  // Finance/Investment
  'Value Investing': { color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/50', hoverBg: 'hover:bg-emerald-500/30', icon: '💎', category: 'Finance', popularity: 80 },
  'Financial Analysis': { color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50', hoverBg: 'hover:bg-green-500/30', icon: '💰', category: 'Finance', popularity: 85 },
  'Risk Management': { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', hoverBg: 'hover:bg-yellow-500/30', icon: '🛡️', category: 'Finance', popularity: 75 },
  'Portfolio Analysis': { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/50', hoverBg: 'hover:bg-cyan-500/30', icon: '📊', category: 'Finance', popularity: 80 },
  'Monte Carlo': { color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50', hoverBg: 'hover:bg-purple-500/30', icon: '🎲', category: 'Finance', popularity: 65 },
  
  // AI/ML
  'AI': { color: 'text-violet-400', bgColor: 'bg-violet-500/20', borderColor: 'border-violet-500/50', hoverBg: 'hover:bg-violet-500/30', icon: '🤖', category: 'AI/ML', popularity: 90 },
  'Machine Learning': { color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500/50', hoverBg: 'hover:bg-indigo-500/30', icon: '🧠', category: 'AI/ML', popularity: 85 },
  'Neural Networks': { color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50', hoverBg: 'hover:bg-pink-500/30', icon: '🕸️', category: 'AI/ML', popularity: 75 },
  
  // Other
  'WebSocket': { color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50', hoverBg: 'hover:bg-green-500/30', icon: '🔌', category: 'Network', popularity: 70 },
  'Node.js': { color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50', hoverBg: 'hover:bg-green-500/30', icon: '🟢', category: 'Backend', popularity: 85 },
  'PostgreSQL': { color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', hoverBg: 'hover:bg-blue-500/30', icon: '🐘', category: 'Database', popularity: 80 },
}

// Fallback configuration for unknown technologies
const DEFAULT_CONFIG: TechConfig = {
  color: 'text-gray-400',
  bgColor: 'bg-gray-500/20',
  borderColor: 'border-gray-500/50',
  hoverBg: 'hover:bg-gray-500/30',
  icon: '🔧',
  category: 'Other',
  popularity: 50
}

function getTechConfig(tech: string): TechConfig {
  // Direct match
  if (TECH_CONFIG[tech]) return TECH_CONFIG[tech]
  
  // Case-insensitive match
  const lowerTech = tech.toLowerCase()
  for (const [key, config] of Object.entries(TECH_CONFIG)) {
    if (key.toLowerCase() === lowerTech) return config
  }
  
  // Partial matches for common patterns
  if (lowerTech.includes('react')) return TECH_CONFIG['React']
  if (lowerTech.includes('next')) return TECH_CONFIG['Next.js']
  if (lowerTech.includes('typescript') || lowerTech.includes('ts')) return TECH_CONFIG['TypeScript']
  if (lowerTech.includes('javascript') || lowerTech.includes('js')) return TECH_CONFIG['JavaScript']
  if (lowerTech.includes('python')) return TECH_CONFIG['Python']
  if (lowerTech.includes('tailwind')) return TECH_CONFIG['Tailwind CSS']
  if (lowerTech.includes('webgl')) return TECH_CONFIG['WebGL']
  if (lowerTech.includes('three')) return TECH_CONFIG['Three.js']
  if (lowerTech.includes('d3')) return TECH_CONFIG['D3.js']
  if (lowerTech.includes('chart')) return TECH_CONFIG['Chart.js']
  if (lowerTech.includes('value') || lowerTech.includes('investing')) return TECH_CONFIG['Value Investing']
  if (lowerTech.includes('financial')) return TECH_CONFIG['Financial Analysis']
  if (lowerTech.includes('ai') || lowerTech.includes('artificial')) return TECH_CONFIG['AI']
  if (lowerTech.includes('ml') || lowerTech.includes('machine')) return TECH_CONFIG['Machine Learning']
  
  return DEFAULT_CONFIG
}

interface TechBadgeProps {
  tech: string
  config: TechConfig
  size: 'sm' | 'md' | 'lg'
  animated: boolean
  interactive: boolean
  delay: number
  onClick?: () => void
}

function TechBadge({ tech, config, size, animated, interactive, delay, onClick }: TechBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <motion.div
      className="relative"
      initial={animated ? { opacity: 0, scale: 0.8, y: 20 } : {}}
      animate={animated ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={animated ? { delay, duration: 0.4, type: "spring", stiffness: 300 } : {}}
      onMouseEnter={() => {
        setIsHovered(true)
        setTimeout(() => setShowTooltip(true), 300)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowTooltip(false)
      }}
    >
      <motion.button
        className={`
          inline-flex items-center space-x-1 font-mono pixel-border
          transition-all duration-200 cursor-default transform-gpu
          ${sizeClasses[size]} ${config.color} ${config.bgColor} ${config.borderColor}
          ${interactive ? `${config.hoverBg} cursor-pointer` : ''}
          ${isHovered && interactive ? 'scale-110 -translate-y-1' : ''}
          ${isHovered ? 'shadow-lg' : ''}
        `}
        whileHover={animated && interactive ? { 
          scale: 1.05, 
          y: -2,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={animated && interactive ? { 
          scale: 0.95,
          transition: { duration: 0.1 }
        } : {}}
        onClick={onClick}
        disabled={!interactive}
      >
        {config.icon && (
          <span className={iconSizes[size]} role="img" aria-hidden="true">
            {config.icon}
          </span>
        )}
        <span>{tech}</span>
        
        {isHovered && animated && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && interactive && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="
              absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
              px-3 py-2 pixel-border bg-gray-800 text-white text-xs font-mono
              whitespace-nowrap z-50 pointer-events-none
            "
          >
            <div className="text-center">
              <div className="font-semibold text-green-400">{tech}</div>
              <div className="text-gray-400 text-xs">{config.category}</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <div className="w-8 bg-gray-700 rounded-full h-1">
                  <div 
                    className="h-1 bg-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${config.popularity}%` }}
                  />
                </div>
                <span className="text-xs">{config.popularity}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TechBadges({
  technologies,
  maxVisible = 6,
  showCount = true,
  animated = true,
  interactive = true,
  size = 'md',
  layout = 'horizontal',
  onTechClick,
  className = ""
}: TechBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [, ] = useState<string | null>(null)

  const visibleTechs = isExpanded ? technologies : technologies.slice(0, maxVisible)
  const hasMore = technologies.length > maxVisible

  // Group technologies by category
  const techsByCategory = technologies.reduce((acc, tech) => {
    const config = getTechConfig(tech)
    if (!acc[config.category]) acc[config.category] = []
    acc[config.category].push(tech)
    return acc
  }, {} as Record<string, string[]>)

  const handleTechClick = (tech: string) => {
    onTechClick?.(tech)
  }

  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'
  }

  if (layout === 'grid' && Object.keys(techsByCategory).length > 1) {
    // Category-grouped layout
    return (
      <div className={`space-y-4 ${className}`}>
        {Object.entries(techsByCategory).map(([category, techs]) => (
          <motion.div
            key={category}
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={animated ? { duration: 0.4 } : {}}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <CodeBracketIcon className="h-4 w-4 text-green-400" />
              <h4 className="font-mono text-sm text-green-400 font-semibold">
                {category}
              </h4>
              {showCount && (
                <span className="text-xs text-gray-500 font-mono">
                  ({techs.length})
                </span>
              )}
            </div>
            
            <div className={layoutClasses[layout]}>
              {techs.map((tech, index) => (
                <TechBadge
                  key={tech}
                  tech={tech}
                  config={getTechConfig(tech)}
                  size={size}
                  animated={animated}
                  interactive={interactive}
                  delay={index * 0.1}
                  onClick={() => handleTechClick(tech)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Standard layout
  return (
    <div className={`space-y-3 ${className}`}>
      <div className={layoutClasses[layout]}>
        {visibleTechs.map((tech, index) => (
          <TechBadge
            key={tech}
            tech={tech}
            config={getTechConfig(tech)}
            size={size}
            animated={animated}
            interactive={interactive}
            delay={index * 0.1}
            onClick={() => handleTechClick(tech)}
          />
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {hasMore && (
        <motion.button
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={animated ? { delay: 0.5 } : {}}
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            flex items-center space-x-1 px-3 py-1 pixel-border 
            bg-gray-500/20 text-gray-400 border-gray-500/50 
            hover:bg-gray-500/30 hover:text-white transition-all duration-200 
            font-mono text-sm
          "
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="h-3 w-3" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <SparklesIcon className="h-3 w-3" />
              <span>Show All ({technologies.length - maxVisible} more)</span>
              <ChevronDownIcon className="h-3 w-3" />
            </>
          )}
        </motion.button>
      )}

      {/* Technology Count */}
      {showCount && !hasMore && (
        <div className="text-xs text-gray-500 font-mono">
          {technologies.length} technolog{technologies.length !== 1 ? 'ies' : 'y'}
        </div>
      )}
    </div>
  )
}