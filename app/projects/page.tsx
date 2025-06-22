'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ProjectCard'
import ProjectFilters from '@/app/components/ProjectFilters'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'
import PageHeader from '@/app/components/PageHeader'

// Static metadata for SSR
const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore my portfolio of completed projects, with emphasis on AI-driven development.',
}

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(projects)

  // Project statistics
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    featured: projects.filter(p => p.featured).length,
    technologies: new Set(projects.flatMap(p => p.tags)).size
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <PageHeader 
        title="Projects Showcase"
        subtitle="Explore my portfolio of completed projects, with emphasis on AI-driven development."
        animationType="matrix"
        animationSpeed={70}
        titleClassName="text-2xl md:text-3xl lg:text-4xl"
        className="mb-8"
      />

      {/* Project Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-green-400/20">
          <div className="text-2xl font-pixel text-green-400">{stats.total}</div>
          <div className="text-xs font-mono text-gray-400">Total Projects</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-400/20">
          <div className="text-2xl font-pixel text-blue-400">{stats.completed}</div>
          <div className="text-xs font-mono text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-400/20">
          <div className="text-2xl font-pixel text-yellow-400">{stats.inProgress}</div>
          <div className="text-xs font-mono text-gray-400">In Progress</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-400/20">
          <div className="text-2xl font-pixel text-purple-400">{stats.featured}</div>
          <div className="text-xs font-mono text-gray-400">Featured</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-400/20">
          <div className="text-2xl font-pixel text-orange-400">{stats.technologies}</div>
          <div className="text-xs font-mono text-gray-400">Technologies</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-8">
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

      {/* Filtering System */}
      <ProjectFilters 
        projects={projects} 
        onFilterChange={setFilteredProjects}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-mono text-gray-300">
            Showing {filteredProjects.length} of {projects.length} projects
          </h2>
          {filteredProjects.length !== projects.length && (
            <button
              onClick={() => setFilteredProjects(projects)}
              className="text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors"
            >
              Show all projects
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="transform transition-all duration-300 hover:scale-105">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-pixel mb-4 text-green-400">No Projects Found</h3>
          <p className="font-mono mb-4 text-gray-300">
            No projects match your current filters. Try adjusting your search criteria.
          </p>
          <button
            onClick={() => setFilteredProjects(projects)}
            className="px-4 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Future Enhancement Placeholder */}
      <div className="mt-12 text-center">
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
