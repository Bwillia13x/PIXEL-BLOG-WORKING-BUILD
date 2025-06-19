import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/content/projects'
import { getStatusConfig, formatProjectYear } from '@/lib/project-utils'

interface ProjectCardProps {
  project: Project
  className?: string
}

const PROJECT_IMAGE_CONFIG = {
  width: 300,
  height: 200,
  className: "w-full h-48 object-cover rounded"
} as const

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const statusConfig = getStatusConfig(project.status)
  
  return (
    <article className={`bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors ${className}`}>
      {/* Project Image */}
      {project.image && (
        <div className="mb-4">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title} project`}
            width={PROJECT_IMAGE_CONFIG.width}
            height={PROJECT_IMAGE_CONFIG.height}
            className={PROJECT_IMAGE_CONFIG.className}
          />
        </div>
      )}

      {/* Project Header */}
      <header className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-pixel">{project.title}</h3>
          <span 
            className={`inline-block px-2 py-1 text-xs font-mono rounded ${statusConfig.className}`}
            aria-label={statusConfig.ariaLabel}
          >
            {statusConfig.label}
          </span>
        </div>
        <p className="font-mono text-sm text-gray-300 mb-3">{project.description}</p>
      </header>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="inline-block px-2 py-1 bg-gray-600 text-white text-xs font-mono rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Project Footer */}
      <footer className="flex justify-between items-center">
        <time className="font-mono text-xs text-gray-400" dateTime={project.year.toString()}>
          {formatProjectYear(project.year)}
        </time>
        
        <nav className="flex gap-2" aria-label="Project links">
          <Link 
            href={`/projects/${project.id}`}
            className="px-3 py-1 bg-blue-600 text-white font-mono text-xs rounded hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label={`View ${project.title} details and interactive demo`}
          >
            View Project
          </Link>
          {project.github && (
            <Link 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gray-700 text-green-400 font-mono text-xs rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              aria-label={`View ${project.title} source code on GitHub`}
            >
              GitHub
            </Link>
          )}
          {project.demo && (
            <Link 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-green-600 text-black font-mono text-xs rounded hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              aria-label={`View ${project.title} in full screen`}
            >
              Full Screen
            </Link>
          )}
        </nav>
      </footer>
    </article>
  )
}
