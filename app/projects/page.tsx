import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore my portfolio of completed projects, with emphasis on AI-driven development.',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-pixel mb-8 text-center">Projects Showcase</h1>
      
      <div className="mb-8 text-center">
        <p className="font-mono text-lg mb-4">
          Explore my portfolio of completed projects, with emphasis on AI-driven development.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link 
            href="/projects/interactive" 
            className="inline-block px-4 py-2 bg-blue-600 text-white font-pixel rounded hover:bg-blue-500 transition-colors"
          >
            🎮 Interactive Demos
          </Link>
          <Link 
            href="/projects/current" 
            className="inline-block px-4 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors"
          >
            View Current Projects →
          </Link>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-pixel mb-4">Projects Coming Soon</h3>
          <p className="font-mono mb-4">
            I&apos;m currently working on some exciting projects that will be showcased here.
          </p>
          <p className="font-mono text-sm text-gray-400">
            Check back soon or visit the current projects page to see what I&apos;m working on now!
          </p>
        </div>
      )}

      {/* TODO: Add filter/search functionality when there are more projects */}
    </div>
  )
}
