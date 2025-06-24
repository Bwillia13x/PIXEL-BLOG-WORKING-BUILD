import Link from 'next/link'
import { CardImage } from '@/app/components/OptimizedImage'
import type { Project } from '@/content/projects'
import { getStatusConfig, formatProjectYear } from '@/lib/project-utils'

interface ProjectCardProps {
  project: Project
  className?: string
}

const PROJECT_IMAGE_CONFIG = {
  width: 400,
  height: 250,
  className: "w-full h-48 object-cover rounded-t-lg"
} as const

const STATUS_ICONS = {
  'completed': '✅',
  'in-progress': '🚧',
  'planned': '📋'
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const statusConfig = getStatusConfig(project.status)
  
  return (
    <article className={`
      pw-card group overflow-hidden
      card-hover-lift gpu-optimized
      ${project.featured ? 'ring-2 ring-blue-400/30' : ''}
      ${className}
    `} tabIndex={0}>
      {/* Project Image */}
      <div className="relative overflow-hidden image-container-optimized">
        {project.image ? (
          <CardImage
            src={project.image}
            alt={`Screenshot of ${project.title} project`}
            width={PROJECT_IMAGE_CONFIG.width}
            height={PROJECT_IMAGE_CONFIG.height}
            className={`${PROJECT_IMAGE_CONFIG.className} group-hover:scale-105 optimized-image-transition`}
            compression="medium"
            quality={85}
            responsive={true}
            fadeIn={true}
            priority={project.featured}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded-t-lg group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300">
            <div className="text-4xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 icon-pulse">💻</div>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-mono rounded-full border border-blue-400/50 hover:bg-blue-500 transition-colors duration-200 glow-on-hover">
              ⭐ Featured
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span 
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-full transition-all duration-200 glow-on-hover ${statusConfig.className}`}
            aria-label={statusConfig.ariaLabel}
          >
            <span className="icon-pulse">{STATUS_ICONS[project.status]}</span>
            {statusConfig.label}
          </span>
        </div>
        
        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="p-6 relative">
        {/* Project Header */}
        <header className="mb-4">
          <h3 className="text-xl font-pixel text-white group-hover:text-green-400 transition-all duration-300 mb-2 hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
            {project.title}
          </h3>
          <p className="font-mono text-sm text-gray-300 leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
            {project.description}
          </p>
        </header>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span 
              key={tag} 
              className="inline-block px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono rounded transition-all duration-200 tag-hover cursor-default"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="inline-block px-2 py-1 bg-gray-600 text-gray-400 text-xs font-mono rounded hover:text-gray-300 transition-colors duration-200">
              +{project.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Project Footer */}
        <footer className="flex justify-between items-center pt-4 border-t border-gray-700 group-hover:border-gray-600 transition-colors duration-300">
          <time className="font-mono text-xs text-gray-400 group-hover:text-green-400/80 transition-colors duration-300" dateTime={project.year.toString()}>
            {formatProjectYear(project.year)}
          </time>
          
          <nav className="flex gap-2" aria-label="Project links">
            <Link 
              href={`/projects/${project.id}`}
              className="
                px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs rounded 
                transition-all duration-200 hover:shadow-md hover:shadow-blue-400/20
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                button-press glow-on-focus icon-interactive
              "
              aria-label={`View ${project.title} details and interactive demo`}
            >
              View Project
            </Link>
            
            {project.demo && (
              <Link 
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-3 py-1.5 bg-green-600 hover:bg-green-500 text-black font-mono text-xs rounded 
                  transition-all duration-200 hover:shadow-md hover:shadow-green-400/20
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
                  button-press glow-on-focus icon-interactive
                "
                aria-label={`View ${project.title} in full screen`}
              >
                Live Demo
              </Link>
            )}
            
            {project.github && (
              <Link 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-xs rounded 
                  transition-all duration-200 hover:shadow-md hover:shadow-gray-400/20
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
                  button-press glow-on-focus icon-interactive
                "
                aria-label={`View ${project.title} source code on GitHub`}
              >
                GitHub
              </Link>
            )}
          </nav>
        </footer>
      </div>
    </article>
  )
}

// CSS for line clamping (add to globals.css if not present)
const styles = `
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`
