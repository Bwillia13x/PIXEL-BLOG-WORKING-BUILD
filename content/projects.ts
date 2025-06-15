// Projects data structure for the portfolio
export interface Project {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  year: number
  status: 'completed' | 'in-progress' | 'planned'
  github?: string
  demo?: string
  featured?: boolean
}

export interface CurrentProject extends Project {
  progress?: number
  startDate: string
  expectedCompletion?: string
  highlights?: string[]
}

// Sample completed projects - replace with your real projects
export const projects: Project[] = [
  {
    id: "pixel-blog-v1",
    title: "Pixel Blog Portfolio",
    description: "A modern portfolio and blog site with retro pixel aesthetics. Features responsive design, SEO optimization, and AI-assisted development workflow.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    year: 2025,
    status: "completed",
    demo: "https://v-o-pixel-blog-design.vercel.app",
    featured: true
  },
  {
    id: "ai-productivity-suite",
    title: "AI Developer Tools",
    description: "A collection of AI-powered productivity tools for developers including code review, documentation generation, and project planning utilities.",
    tags: ["React", "AI/ML", "Node.js", "TypeScript"],
    year: 2024,
    status: "in-progress",
    featured: true
  },
  {
    id: "fullstack-dashboard",
    title: "Analytics Dashboard",
    description: "Modern business intelligence dashboard with real-time data visualization, custom reports, and collaborative features.",
    tags: ["Next.js", "D3.js", "PostgreSQL", "WebSocket"],
    year: 2024,
    status: "completed"
  }
]

// Current/ongoing projects
export const currentProjects: CurrentProject[] = [
  {
    id: "ai-development-tools",
    title: "AI-Enhanced Development Workflow",
    description: "Building and documenting a comprehensive AI-assisted development workflow using modern tools like Cursor, GitHub Copilot, and custom integrations.",
    tags: ["AI", "Developer Experience", "Automation", "Documentation"],
    year: 2025,
    status: "in-progress",
    progress: 65,
    startDate: "2025-01",
    expectedCompletion: "2025-07",
    highlights: [
      "AI tool integration and comparison",
      "Custom development workflow automation",
      "Best practices documentation",
      "Community resource sharing"
    ]
  },
  {
    id: "open-source-contributions",
    title: "Open Source Contributions",
    description: "Contributing to various open source projects in the React and Next.js ecosystem, focusing on developer experience improvements.",
    tags: ["Open Source", "React", "Next.js", "Community"],
    year: 2025,
    status: "in-progress",
    progress: 30,
    startDate: "2025-03",
    highlights: [
      "TypeScript type definitions",
      "Documentation improvements",
      "Bug fixes and feature enhancements",
      "Community engagement"
    ]
  }
]

// Future/planned projects
export const plannedProjects: Project[] = [
  {
    id: "pixel-ui-library",
    title: "Pixel UI Component Library",
    description: "A collection of React components with pixel art aesthetics for modern web applications.",
    tags: ["React", "UI Library", "Design System", "Pixel Art"],
    year: 2025,
    status: "planned"
  }
  // TODO: Add more planned projects
]

// Helper functions
export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured)
}

export function getProjectsByStatus(status: Project['status']): Project[] {
  return projects.filter(project => project.status === status)
}

export function getProjectById(id: string): Project | CurrentProject | undefined {
  return [...projects, ...currentProjects, ...plannedProjects].find(project => project.id === id)
}
