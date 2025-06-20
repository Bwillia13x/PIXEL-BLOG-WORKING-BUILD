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
    id: "quality-score-engine",
    title: "Quality Score Engine",
    description: "Advanced value investing analysis tool that combines Benjamin Graham's defensive criteria with AI-powered pattern recognition to evaluate companies across 12 key quality dimensions.",
    tags: ["Value Investing", "Financial Analysis", "AI", "Chart.js"],
    year: 2025,
    status: "completed",
    demo: "/projects/quality-score-engine/index.html",
    featured: true
  },
  {
    id: "margin-of-safety-calculator",
    title: "Margin of Safety Calculator",
    description: "Advanced valuation tool using multiple methods with Monte Carlo simulation to determine investment safety margins across EPV, Graham Number, DCF, P/B, and Asset-based approaches.",
    tags: ["Value Investing", "Valuation", "Risk Analysis", "Monte Carlo"],
    year: 2025,
    status: "completed",
    demo: "/projects/margin-of-safety-calculator/index.html",
    featured: true
  },
  {
    id: "deep-value-screener",
    title: "Deep Value Screener",
    description: "Sophisticated stock screening tool implementing Benjamin Graham's net-net criteria and statistical cheapness metrics to systematically identify deeply undervalued opportunities.",
    tags: ["Benjamin Graham", "Net-Net Stocks", "Stock Screening", "Value Investing"],
    year: 2025,
    status: "completed",
    demo: "/projects/deep-value-screener/index.html",
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
  },
  {
    id: "epv-visualizations",
    title: "EPV Visualizations",
    description: "Interactive visualizations for Earnings Power Value (EPV) analysis following Bruce Greenwald's methodology. Features normalized earnings charts, WACC sensitivity analysis, and DCF comparison tools.",
    image: "/placeholder.jpg",
    tags: ["Python", "Data Visualization", "Financial Analysis", "D3.js"],
    year: 2025,
    status: "completed",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/epv-visualizations",
    demo: "/projects/epv-visualizations/epv_visualizations.html",
    featured: true
  },
  {
    id: "flight-simulator",
    title: "Flight Simulator",
    description: "A browser-based flight simulator leveraging WebGL to demonstrate aerodynamics and real-time physics rendering with interactive controls.",
    image: "/placeholder.jpg",
    tags: ["WebGL", "JavaScript", "Physics", "3D Graphics"],
    year: 2025,
    status: "completed",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/flight-simulator",
    demo: "/projects/flight-simulator/enhanced_flight_simulator.html"
  },
  {
    id: "gpu-simulation",
    title: "GPU Particle Simulation",
    description: "High-performance particle simulation harnessing GPU compute shaders to showcase massive-scale physical systems in the browser with real-time visualization.",
    image: "/placeholder.jpg",
    tags: ["WebGPU", "JavaScript", "Simulation", "GLSL"],
    year: 2025,
    status: "completed",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/gpu-simulation",
    demo: "/projects/gpu-simulation/index.html"
  },
  {
    id: "neural-network",
    title: "Neural Network Playground",
    description: "Interactive visualization of neural network training with forward and backward propagation animation, built from scratch to demonstrate machine learning fundamentals.",
    image: "/placeholder.jpg",
    tags: ["JavaScript", "Machine Learning", "Data Visualization", "Education"],
    year: 2024,
    status: "completed",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/neural-network",
    demo: "/projects/neural-network/neural_network_simulation.html"
  },
  {
    id: "renewable-energy-explorer",
    title: "Global Renewable Energy Explorer",
    description: "Interactive choropleth world map visualizing renewable electricity output by country from 1990-present, featuring trend charts, rankings, and responsive design.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "D3.js", "Data Analysis", "TypeScript"],
    year: 2024,
    status: "in-progress",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/renewable-energy-explorer",
    featured: true
  },
  {
    id: "static-visualizations",
    title: "Computational Fluid Dynamics Visualizations",
    description: "Curated collection of high-quality CFD visualizations including shock wave analysis, Mach field comparisons, and multi-field computational fluid dynamics studies.",
    image: "/projects/static-visualizations/shock_wave_visualizations/mach_comparison_grid.png",
    tags: ["CFD", "Scientific Computing", "Visualization", "Python"],
    year: 2023,
    status: "completed",
    github: "https://github.com/Bwillia13x/PixelProjects_v1/tree/main/static-visualizations",
    demo: "/projects/static-visualizations/LLM Simultion (06:13:2025).html"
  },
  {
    id: "trading-dashboard",
    title: "Real-Time Trading Dashboard",
    description: "Advanced financial trading dashboard with real-time market data simulation, portfolio management, and technical analysis indicators.",
    longDescription: "A comprehensive trading platform featuring real-time price updates, portfolio tracking with P&L calculations, interactive candlestick charts, technical indicators (RSI, MACD, Moving Averages, Bollinger Bands), and a professional financial UI. Built with vanilla JavaScript and Chart.js for optimal performance.",
    tags: ["Financial Technology", "Real-time Data", "Technical Analysis", "JavaScript"],
    image: "/placeholder.jpg",
    demoUrl: "/projects/trading-dashboard/index.html",
    githubUrl: "https://github.com/Bwillia13x/PixelProjects_v1",
    status: "completed",
    featured: true,
    year: 2025,
    technologies: ["JavaScript", "Chart.js", "HTML5", "CSS3", "WebGL"],
    category: "web-app"
  },
  {
    id: "3d-data-engine",
    title: "3D Data Visualization Engine",
    description: "Interactive 3D data visualization platform with WebGL rendering, supporting multiple visualization types and large dataset exploration.",
    longDescription: "A powerful 3D visualization engine built with Three.js and WebGL, featuring point clouds, network graphs, mathematical surfaces, and data clusters. Includes real-time controls, performance monitoring, instanced rendering for thousands of data points, and multiple visualization modes with 60 FPS performance.",
    tags: ["Data Visualization", "WebGL", "3D Graphics", "Three.js"],
    image: "/placeholder.jpg", 
    demoUrl: "/projects/3d-data-engine/index.html",
    githubUrl: "https://github.com/Bwillia13x/PixelProjects_v1",
    status: "completed",
    featured: true,
    year: 2025,
    technologies: ["Three.js", "WebGL", "JavaScript", "BufferGeometry", "Instanced Rendering"],
    category: "visualization"
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
