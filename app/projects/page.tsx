'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ProjectCard'
import PageHeader from '@/app/components/PageHeader'
import HeaderSpacer from '@/app/components/HeaderSpacer'

// Static metadata for SSR
const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore my portfolio of completed projects, with emphasis on AI-driven development.',
}

export default function ProjectsPage() {
  // Project statistics
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    featured: projects.filter(p => p.featured).length,
  }

  // Sort projects by year (newest first) and then by featured status
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.year - a.year
  })

  return (
    <div className="max-w-6xl mx-auto pb-8">
      {/* Header Spacer to push content below navigation */}
      <HeaderSpacer />
      
      {/* Header Section */}
      <PageHeader 
        title="Projects Showcase"
        subtitle="Explore my portfolio of completed projects, with emphasis on AI-driven development."
        animationType="matrix"
        animationSpeed={70}
      />

      {/* Project Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="pw-card p-4 border-green-400/20">
          <div className="text-2xl font-pixel text-green-400">{stats.total}</div>
          <div className="text-xs font-mono text-gray-400">Total Projects</div>
        </div>
        <div className="pw-card p-4 border-blue-400/20">
          <div className="text-2xl font-pixel text-blue-400">{stats.completed}</div>
          <div className="text-xs font-mono text-gray-400">Completed</div>
        </div>
        <div className="pw-card p-4 border-yellow-400/20">
          <div className="text-2xl font-pixel text-yellow-400">{stats.inProgress}</div>
          <div className="text-xs font-mono text-gray-400">In Progress</div>
        </div>
        <div className="pw-card p-4 border-purple-400/20">
          <div className="text-2xl font-pixel text-purple-400">{stats.featured}</div>
          <div className="text-xs font-mono text-gray-400">Featured</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-12">
        <Link 
          href="/projects/interactive" 
          className="inline-block px-6 py-3 bg-blue-600 text-white font-mono rounded-lg hover:bg-blue-500 transition-colors border border-blue-400/30 hover:border-blue-400"
        >
          🎮 Interactive Demos
        </Link>
        <Link 
          href="/projects/current" 
          className="inline-block px-6 py-3 bg-green-600 text-black font-mono rounded-lg hover:bg-green-500 transition-colors border border-green-400/30 hover:border-green-400"
        >
          View Current Projects →
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {sortedProjects.map((project) => (
          <div key={project.id} className="transform transition-all duration-300 hover:scale-102">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Future Enhancement Placeholder */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-400/20">
          <h3 className="text-xl font-pixel text-blue-400 mb-2">Coming Soon</h3>
          <p className="font-mono text-sm text-gray-400">
            Advanced project comparison tool, project timeline visualization, and interactive demos.
          </p>
        </div>
      </div>
    </div>
  )
}
