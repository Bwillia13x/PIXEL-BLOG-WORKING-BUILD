import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ProjectCard'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'

export const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore my portfolio of completed projects, with emphasis on AI-driven development.',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-pixel mb-8 text-center text-green-400">
        <MatrixTextReveal 
          text="Projects Showcase" 
          speed={70}
          delay={300}
          scrambleDuration={250}
          className="inline-block"
        />
      </h1>
      
      <div className="mb-8 text-center">
        <p className="font-mono text-lg mb-4 text-gray-300">
          Explore my portfolio of completed projects, with emphasis on AI-driven development.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link 
            href="/projects/interactive" 
            className="inline-block px-4 py-2 bg-blue-600 text-white font-pixel rounded hover:bg-blue-500 transition-colors border border-blue-400/30 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20"
          >
            🎮 Interactive Demos
          </Link>
          <Link 
            href="/projects/current" 
            className="inline-block px-4 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors border border-green-400/30 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20"
          >
            View Current Projects →
          </Link>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <h3 className="text-2xl font-pixel mb-4 text-green-400">Projects Coming Soon</h3>
          <p className="font-mono mb-4 text-gray-300">
            I&apos;m currently working on some exciting projects that will be showcased here.
          </p>
          <p className="font-mono text-sm text-gray-400">
            Check back soon or visit the current projects page to see what I&apos;m working on now!
          </p>
        </div>
      )}

      {/* Future enhancement: project filtering and search */}
    </div>
  )
}
