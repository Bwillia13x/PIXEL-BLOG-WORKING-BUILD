'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelButton from '@/app/components/PixelButton'
import PageHeader from '@/app/components/PageHeader'

// Enhanced project interface with more detailed tracking
interface CurrentProject {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned' | 'on-hold'
  progress: number
  tags: string[]
  startDate: string
  completedDate?: string
  expectedCompletion?: string
  plannedStart?: string
  highlights?: string[]
  demo?: string
  githubUrl?: string
  priority: 'high' | 'medium' | 'low'
  timeInvestment: string
  nextMilestones?: string[]
  challenges?: string[]
  learnings?: string[]
}

// Real project data - consider moving to separate data file for scalability
const currentProjects: CurrentProject[] = [
  {
    id: "portfolio-stress-testing",
    title: "Portfolio Stress Testing Dashboard",
    description: "Advanced risk analysis tool that simulates portfolio performance during historical market crises with Monte Carlo simulation and comprehensive risk metrics.",
    status: "completed",
    progress: 100,
    priority: "high",
    timeInvestment: "3 weeks",
    tags: ["Risk Management", "Portfolio Analysis", "Monte Carlo", "Chart.js"],
    startDate: "2025-01",
    completedDate: "2025-01-19",
    highlights: [
      "Historical crisis simulation (2008, COVID-19, Dot-com, 1970s)",
      "Monte Carlo simulation with 1,000+ iterations",
      "Beta-adjusted risk calculations and VaR analysis",
      "Interactive visualizations with Chart.js",
      "Real-time portfolio analysis under 3 seconds"
    ],
    demo: "/projects/portfolio-stress-testing/index.html",
    learnings: [
      "Advanced Monte Carlo simulation techniques",
      "Historical market data analysis",
      "Risk-adjusted return calculations"
    ]
  },
  {
    id: "pixel-blog-template",
    title: "Pixel Blog Template",
    description: "A modern, responsive blog template with pixel aesthetic. Built with Next.js, TypeScript, and Tailwind CSS.",
    status: "in-progress",
    progress: 75,
    priority: "high",
    timeInvestment: "4 weeks",
    tags: ["Next.js", "TypeScript", "Tailwind", "Blog"],
    startDate: "2025-06",
    expectedCompletion: "2025-07",
    highlights: [
      "Responsive pixel-themed design",
      "Modern Next.js App Router",
      "TypeScript for type safety",
      "MDX support for content"
    ],
    nextMilestones: [
      "Complete comment system integration",
      "Add search functionality",
      "Performance optimization",
      "SEO improvements"
    ],
    challenges: [
      "Optimizing pixel animations for performance",
      "Maintaining accessibility with custom theme"
    ]
  },
  {
    id: "ai-dev-tools",
    title: "AI Development Tools Integration",
    description: "Exploring integration with AI-powered IDEs like Cursor and Windsurf for enhanced development workflows.",
    status: "planned",
    progress: 0,
    priority: "medium",
    timeInvestment: "2 weeks",
    tags: ["AI", "Developer Tools", "Automation"],
    plannedStart: "2025-07",
    highlights: [
      "Cursor IDE workflow optimization",
      "Automated code review integration",
      "AI-assisted debugging"
    ]
  }
]

const statusConfig = {
  'completed': { color: 'bg-green-600', textColor: 'text-green-600', icon: '✅' },
  'in-progress': { color: 'bg-yellow-600', textColor: 'text-yellow-600', icon: '🚧' },
  'planned': { color: 'bg-blue-600', textColor: 'text-blue-600', icon: '📋' },
  'on-hold': { color: 'bg-gray-600', textColor: 'text-gray-600', icon: '⏸️' }
}

const priorityConfig = {
  'high': { color: 'border-red-500', icon: '🔥' },
  'medium': { color: 'border-yellow-500', icon: '⚡' },
  'low': { color: 'border-green-500', icon: '🌱' }
}

export default function CurrentProjectsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'completed' | 'planned'>('current')
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    completed: 0,
    inProgress: 0,
    planned: 0,
    averageProgress: 0
  })

  useEffect(() => {
    const stats = {
      totalProjects: currentProjects.length,
      completed: currentProjects.filter(p => p.status === 'completed').length,
      inProgress: currentProjects.filter(p => p.status === 'in-progress').length,
      planned: currentProjects.filter(p => p.status === 'planned').length,
      averageProgress: Math.round(
        currentProjects.reduce((sum, p) => sum + p.progress, 0) / currentProjects.length
      )
    }
    setProjectStats(stats)
  }, [])

  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'current':
        return currentProjects.filter(p => p.status === 'in-progress')
      case 'completed':
        return currentProjects.filter(p => p.status === 'completed')
      case 'planned':
        return currentProjects.filter(p => p.status === 'planned')
      default:
        return currentProjects
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section with Enhanced Stats */}
      <PageHeader 
        title="Current Projects"
        subtitle="Real-time view of active development work and future roadmap"
        animationType="matrix"
        titleClassName="text-2xl md:text-3xl lg:text-4xl"
        className="mb-8"
      />
      
      {/* Project Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-pixel text-green-400">{projectStats.totalProjects}</div>
          <div className="text-xs font-mono text-gray-400">Total Projects</div>
        </motion.div>
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-pixel text-blue-400">{projectStats.inProgress}</div>
          <div className="text-xs font-mono text-gray-400">In Progress</div>
        </motion.div>
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-pixel text-green-400">{projectStats.completed}</div>
          <div className="text-xs font-mono text-gray-400">Completed</div>
        </motion.div>
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-pixel text-purple-400">{projectStats.averageProgress}%</div>
          <div className="text-xs font-mono text-gray-400">Avg. Progress</div>
        </motion.div>
      </div>

      <Link href="/projects">
        <PixelButton variant="secondary" size="sm">
          ← View All Projects
        </PixelButton>
      </Link>

      {/* Enhanced Tab Navigation */}
      <div className="mb-8">
        <div className="flex justify-center space-x-2 bg-gray-800/30 rounded-lg p-2">
          {(['current', 'completed', 'planned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-pixel text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-green-600 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab === 'current' && '🚧 In Progress'}
              {tab === 'completed' && '✅ Completed'}
              {tab === 'planned' && '📋 Planned'}
              <span className="ml-2 text-xs">
                ({currentProjects.filter(p => 
                  tab === 'current' ? p.status === 'in-progress' :
                  tab === 'completed' ? p.status === 'completed' :
                  p.status === 'planned'
                ).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Project Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6"
        >
          {getFilteredProjects().length > 0 ? (
            getFilteredProjects().map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border-l-4 ${
                  priorityConfig[project.priority].color
                } hover:bg-gray-800 transition-all duration-300 group`}
              >
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{priorityConfig[project.priority].icon}</span>
                    <div>
                      <h3 className="text-xl font-pixel group-hover:text-green-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-mono text-sm text-gray-400">
                        {project.timeInvestment} • {project.priority} priority
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono ${
                      statusConfig[project.status].color
                    } text-black`}>
                      {statusConfig[project.status].icon} {project.status}
                    </span>
                  </div>
                </div>

                <p className="font-mono text-sm text-gray-300 mb-4">{project.description}</p>

                {/* Enhanced Progress Bar with Animation */}
                {project.status !== 'planned' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span>Progress</span>
                      <span className="text-green-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-green-600/20 text-green-400 text-xs font-mono rounded border border-green-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Timeline */}
                <div className="text-xs font-mono text-gray-400 mb-4 flex items-center space-x-4">
                  <span>📅 Started: {project.startDate}</span>
                  {project.completedDate && (
                    <span>🎉 Completed: {project.completedDate}</span>
                  )}
                  {project.expectedCompletion && (
                    <span>🎯 Expected: {project.expectedCompletion}</span>
                  )}
                  {project.plannedStart && (
                    <span>⏰ Planned: {project.plannedStart}</span>
                  )}
                </div>

                {/* Project Details Sections */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {project.highlights && (
                    <div className="space-y-2">
                      <h4 className="font-pixel text-sm text-green-400">✨ Key Features</h4>
                      <ul className="text-xs font-mono space-y-1">
                        {project.highlights.slice(0, 3).map((highlight, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-400 mr-2 mt-0.5">▶</span>
                            <span className="text-gray-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.nextMilestones && (
                    <div className="space-y-2">
                      <h4 className="font-pixel text-sm text-blue-400">🎯 Next Milestones</h4>
                      <ul className="text-xs font-mono space-y-1">
                        {project.nextMilestones.slice(0, 3).map((milestone, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-400 mr-2 mt-0.5">▶</span>
                            <span className="text-gray-300">{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.challenges && (
                    <div className="space-y-2">
                      <h4 className="font-pixel text-sm text-red-400">⚠️ Challenges</h4>
                      <ul className="text-xs font-mono space-y-1">
                        {project.challenges.slice(0, 2).map((challenge, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-400 mr-2 mt-0.5">▶</span>
                            <span className="text-gray-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                  {project.demo && (
                    <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                      <PixelButton variant="primary" size="sm">
                        🚀 Live Demo
                      </PixelButton>
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <PixelButton variant="secondary" size="sm">
                        📂 Source Code
                      </PixelButton>
                    </Link>
                  )}
                  <div className="text-xs font-mono text-gray-400 ml-auto">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 rounded-lg p-8 text-center"
            >
              <div className="text-4xl mb-4">
                {activeTab === 'current' && '🚧'}
                {activeTab === 'completed' && '🎉'}
                {activeTab === 'planned' && '📋'}
              </div>
              <p className="font-mono text-gray-400">
                {activeTab === 'current' && 'No projects currently in progress.'}
                {activeTab === 'completed' && 'No recently completed projects.'}
                {activeTab === 'planned' && 'No planned projects at the moment.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Future Enhancements Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 p-6 bg-gray-800/30 rounded-lg border border-gray-700"
      >
        <h3 className="font-pixel text-lg mb-3 text-center">🔮 Coming Enhancements</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm font-mono text-gray-400">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">▶</span>
            Real-time GitHub integration
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">▶</span>
            Project timeline visualization
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">▶</span>
            Automated progress tracking
          </div>
        </div>
      </motion.div>
    </div>
  )
}
