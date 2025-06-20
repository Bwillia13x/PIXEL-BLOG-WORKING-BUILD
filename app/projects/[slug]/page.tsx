import { notFound } from 'next/navigation'
import { projects, getProjectById } from '@/content/projects'
import type { Metadata } from 'next'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Project Showcase`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-pixel mb-4">{project.title}</h1>
        <p className="text-lg font-mono text-gray-300 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="inline-block px-3 py-1 bg-green-600 text-black font-mono text-sm rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 text-green-400 font-mono rounded hover:bg-gray-600 transition-colors"
            >
              View Code
            </a>
          )}
          {project.demo && (
            <a 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-black font-mono rounded hover:bg-green-500 transition-colors"
            >
              Open Full Screen
            </a>
          )}
        </div>
      </div>

      {/* Interactive Project Embed */}
      {project.demo && (
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-pixel">Interactive Demo</h2>
            <span className="text-sm font-mono text-gray-400">
              Click "Open Full Screen" for best experience
            </span>
          </div>
          
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              src={project.demo}
              className="absolute top-0 left-0 w-full h-full rounded border-2 border-green-600"
              title={`${project.title} Interactive Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Project Details */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-pixel mb-4">Project Details</h3>
          <ul className="space-y-2 font-mono text-sm">
            <li><span className="text-green-400">Year:</span> {project.year}</li>
            <li><span className="text-green-400">Status:</span> {project.status}</li>
            <li><span className="text-green-400">Technologies:</span> {project.tags.join(', ')}</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-pixel mb-4">Features</h3>
          <div className="font-mono text-sm space-y-2">
            <p>• Interactive visualization</p>
            <p>• Real-time calculations</p>
            <p>• Responsive design</p>
            <p>• Browser-based execution</p>
          </div>
        </div>
      </div>
    </div>
  )
} 