import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Interactive Projects',
  description: 'Experience live, interactive demonstrations of my projects directly in your browser.',
}

export default function InteractiveProjectsPage() {
  const interactiveProjects = projects.filter(project => project.demo)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-pixel mb-4">Interactive Project Showcase</h1>
        <p className="text-xl font-mono text-gray-300 mb-6">
          Experience live demonstrations of my projects directly in your browser
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/projects" 
            className="px-4 py-2 bg-gray-700 text-green-400 font-mono rounded hover:bg-gray-600 transition-colors"
          >
            ← All Projects
          </Link>
          <Link 
            href="/projects/current" 
            className="px-4 py-2 bg-blue-600 text-white font-mono rounded hover:bg-blue-500 transition-colors"
          >
            Current Projects
          </Link>
        </div>
      </div>

      {interactiveProjects.length > 0 ? (
        <div className="space-y-12">
          {interactiveProjects.map((project, index) => (
            <div key={project.id} className="bg-gray-800 rounded-2xl p-6">
              {/* Project Header */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-pixel mb-2">{project.title}</h2>
                  <p className="font-mono text-gray-300 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-block px-2 py-1 bg-green-600 text-black font-mono text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="px-3 py-1 bg-blue-600 text-white font-mono text-sm rounded hover:bg-blue-500 transition-colors"
                  >
                    View Details
                  </Link>
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600 text-black font-mono text-sm rounded hover:bg-green-500 transition-colors"
                    >
                      Full Screen
                    </a>
                  )}
                </div>
              </div>

              {/* Interactive Preview */}
              <div className="relative bg-black rounded-lg overflow-hidden border-2 border-green-600">
                <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-mono text-green-400">
                  Interactive Demo #{index + 1}
                </div>
                <div className="relative w-full" style={{ paddingBottom: '60%' }}>
                  <iframe
                    src={project.demo}
                    className="absolute top-0 left-0 w-full h-full"
                    title={`${project.title} Interactive Demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 bg-gray-900 text-center">
                  <p className="text-xs font-mono text-gray-400">
                    Click and interact with the demo above, or 
                    <a 
                      href={project.demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 ml-1"
                    >
                      open in full screen
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-pixel mb-4">No Interactive Projects Yet</h3>
          <p className="font-mono text-gray-300">
            Interactive demonstrations will appear here as they become available.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-gradient-to-r from-green-900 to-blue-900 rounded-2xl p-8">
        <h3 className="text-2xl font-pixel mb-4">Want to Explore More?</h3>
        <p className="font-mono text-gray-300 mb-6">
          Each project has its own dedicated page with detailed information and full-screen interactive experiences.
        </p>
        <Link 
          href="/projects" 
          className="inline-block px-6 py-3 bg-green-600 text-black font-pixel rounded-lg hover:bg-green-500 transition-colors"
        >
          Browse All Projects
        </Link>
      </div>
    </div>
  )
} 