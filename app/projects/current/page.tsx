import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Current Projects',
  description: 'What I\'m working on right now - ongoing projects and future plans.',
}

// Current projects data - consider moving to separate data file for scalability
const currentProjects = [
  // Recently completed projects
  {
    id: "portfolio-stress-testing",
    title: "Portfolio Stress Testing Dashboard",
    description: "Advanced risk analysis tool that simulates portfolio performance during historical market crises with Monte Carlo simulation and comprehensive risk metrics.",
    status: "completed",
    progress: 100,
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
    demo: "/projects/portfolio-stress-testing/index.html"
  },
  // Sample current project structure
  {
    id: "pixel-blog-template",
    title: "Pixel Blog Template",
    description: "A modern, responsive blog template with pixel aesthetic. Built with Next.js, TypeScript, and Tailwind CSS.",
    status: "in-progress",
    progress: 75,
    tags: ["Next.js", "TypeScript", "Tailwind", "Blog"],
    startDate: "2025-06",
    expectedCompletion: "2025-07",
    highlights: [
      "Responsive pixel-themed design",
      "Modern Next.js App Router",
      "TypeScript for type safety",
      "MDX support for content"
    ]
  }
]

const futureProjects = [
  {
    id: "ai-dev-tools",
    title: "AI Development Tools Integration",
    description: "Exploring integration with AI-powered IDEs like Cursor and Windsurf for enhanced development workflows.",
    status: "planned",
    tags: ["AI", "Developer Tools", "Automation"],
    plannedStart: "2025-07"
  }
]

export default function CurrentProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-pixel mb-8 text-center">Current Projects</h1>
      
      <div className="mb-8 text-center">
        <p className="font-mono text-lg mb-4">
          Here&apos;s what I&apos;m working on right now and what&apos;s coming next.
        </p>
        <Link 
          href="/projects" 
          className="inline-block px-4 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors"
        >
          ← View Completed Projects
        </Link>
      </div>

      {/* Recently Completed Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-pixel mb-6">Recently Completed</h2>
        {currentProjects.filter(p => p.status === 'completed').length > 0 ? (
          <div className="grid gap-6">
            {currentProjects.filter(p => p.status === 'completed').map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-pixel">{project.title}</h3>
                    <span className="inline-block px-2 py-1 bg-green-600 text-black text-xs font-mono rounded">
                      {project.status}
                    </span>
                  </div>
                  <p className="font-mono text-sm mb-3">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-block px-2 py-1 bg-green-600 text-black text-xs font-mono rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-mono text-gray-400 mb-3">
                    Started: {project.startDate} • {project.completedDate ? `Completed: ${project.completedDate}` : `Expected: ${project.expectedCompletion}`}
                  </div>

                  {project.highlights && (
                    <div className="mb-4">
                      <h4 className="font-pixel text-sm mb-2">Key Features:</h4>
                      <ul className="text-sm font-mono space-y-1">
                        {project.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-400 mr-2">▶</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.demo && (
                    <div className="mt-auto">
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white font-pixel rounded hover:bg-blue-500 transition-colors"
                      >
                        🚀 Live Demo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="font-mono">No recently completed projects.</p>
          </div>
        )}
      </section>

      {/* Current/Active Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-pixel mb-6">In Progress</h2>
        {currentProjects.filter(p => p.status === 'in-progress').length > 0 ? (
          <div className="grid gap-6">
            {currentProjects.filter(p => p.status === 'in-progress').map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-pixel">{project.title}</h3>
                    <span className={`inline-block px-2 py-1 text-black text-xs font-mono rounded ${
                      project.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="font-mono text-sm mb-3">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-block px-2 py-1 bg-green-600 text-black text-xs font-mono rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-mono text-gray-400 mb-3">
                    Started: {project.startDate} • {project.completedDate ? `Completed: ${project.completedDate}` : `Expected: ${project.expectedCompletion}`}
                  </div>

                  {project.highlights && (
                    <div className="mb-4">
                      <h4 className="font-pixel text-sm mb-2">Key Features:</h4>
                      <ul className="text-sm font-mono space-y-1">
                        {project.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-400 mr-2">▶</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.demo && (
                    <div className="mt-auto">
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white font-pixel rounded hover:bg-blue-500 transition-colors"
                      >
                        🚀 Live Demo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="font-mono">No projects currently in progress.</p>
          </div>
        )}
      </section>

      {/* Future/Planned Projects */}
      <section>
        <h2 className="text-2xl font-pixel mb-6">Coming Soon</h2>
        {futureProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {futureProjects.map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-pixel">{project.title}</h3>
                  <span className="inline-block px-2 py-1 bg-blue-600 text-black text-xs font-mono rounded">
                    {project.status}
                  </span>
                </div>
                <p className="font-mono text-sm mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-gray-600 text-white text-xs font-mono rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-mono text-gray-400">
                  Planned start: {project.plannedStart}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="font-mono">Future projects will be announced here.</p>
          </div>
        )}
      </section>

      {/* Future enhancements: project timeline visualization and GitHub integration */}
    </div>
  )
}
