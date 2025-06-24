'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelIconLibrary } from '../design-system/PixelIcons';
import { PixelButton, PixelCard } from '../design-system/PixelMicroInteractions';
import { 
  RadialProgressChart, 
  PerformanceScatterPlot,
  PixelBarChart,
  TechTreemap,
  AnimatedChartContainer 
} from './AdvancedCharts';

// Enhanced project interface for comparison
export interface ComparisonProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  startDate: string;
  endDate?: string;
  technologies: string[];
  team: string[];
  budget?: number;
  
  // Detailed metrics for comparison
  metrics: {
    performance: number; // 0-100
    scalability: number;
    maintainability: number;
    security: number;
    userExperience: number;
    codeQuality: number;
    testCoverage: number;
    documentation: number;
    accessibility: number;
    seoScore: number;
  };
  
  // Business metrics
  business: {
    roi: number;
    userSatisfaction: number;
    marketImpact: number;
    learningValue: number;
    complexity: number;
    timeline: number; // adherence to timeline
    innovation: number;
  };
  
  // Technical details
  technical: {
    linesOfCode: number;
    commits: number;
    contributors: number;
    issues: number;
    stars?: number;
    forks?: number;
    downloads?: number;
  };
  
  // External links
  links: {
    github?: string;
    demo?: string;
    documentation?: string;
    blog?: string;
  };
  
  // Visual assets
  screenshots: string[];
  thumbnail?: string;
  color?: string;
}

// Mock project data for comparison
const SAMPLE_PROJECTS: ComparisonProject[] = [
  {
    id: 'pixel-blog',
    title: 'Pixel Wisdom Blog',
    description: 'Modern developer blog with pixel-art theme and advanced analytics',
    category: 'Web Application',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-03-15',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    team: ['Frontend Developer', 'Designer', 'Content Writer'],
    budget: 15000,
    metrics: {
      performance: 95,
      scalability: 88,
      maintainability: 92,
      security: 89,
      userExperience: 94,
      codeQuality: 91,
      testCoverage: 85,
      documentation: 88,
      accessibility: 93,
      seoScore: 96
    },
    business: {
      roi: 145,
      userSatisfaction: 92,
      marketImpact: 78,
      learningValue: 89,
      complexity: 75,
      timeline: 95,
      innovation: 87
    },
    technical: {
      linesOfCode: 12500,
      commits: 234,
      contributors: 3,
      issues: 12,
      stars: 89,
      forks: 23
    },
    links: {
      github: 'https://github.com/user/pixel-blog',
      demo: 'https://pixelwisdom.dev',
      documentation: 'https://docs.pixelwisdom.dev'
    },
    screenshots: [],
    color: '#00ff88'
  },
  {
    id: 'analytics-engine',
    title: 'Real-time Analytics Engine',
    description: 'High-performance analytics platform with real-time data processing',
    category: 'Backend System',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2024-01-20',
    technologies: ['Node.js', 'Redis', 'PostgreSQL', 'WebSocket', 'Docker'],
    team: ['Backend Developer', 'DevOps Engineer', 'Data Analyst'],
    budget: 25000,
    metrics: {
      performance: 98,
      scalability: 95,
      maintainability: 87,
      security: 94,
      userExperience: 82,
      codeQuality: 89,
      testCoverage: 92,
      documentation: 85,
      accessibility: 75,
      seoScore: 65
    },
    business: {
      roi: 189,
      userSatisfaction: 88,
      marketImpact: 85,
      learningValue: 94,
      complexity: 92,
      timeline: 88,
      innovation: 91
    },
    technical: {
      linesOfCode: 18400,
      commits: 156,
      contributors: 3,
      issues: 8,
      downloads: 2400
    },
    links: {
      github: 'https://github.com/user/analytics-engine',
      documentation: 'https://docs.analytics-engine.com'
    },
    screenshots: [],
    color: '#0088ff'
  },
  {
    id: 'mobile-finance',
    title: 'Personal Finance Mobile App',
    description: 'Cross-platform mobile app for personal financial management',
    category: 'Mobile Application',
    status: 'in-progress',
    startDate: '2024-02-01',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Redux', 'Stripe API'],
    team: ['Mobile Developer', 'UI/UX Designer', 'Backend Developer'],
    budget: 35000,
    metrics: {
      performance: 87,
      scalability: 82,
      maintainability: 85,
      security: 96,
      userExperience: 91,
      codeQuality: 88,
      testCoverage: 78,
      documentation: 82,
      accessibility: 89,
      seoScore: 70
    },
    business: {
      roi: 0, // Not completed yet
      userSatisfaction: 85,
      marketImpact: 82,
      learningValue: 88,
      complexity: 88,
      timeline: 75,
      innovation: 85
    },
    technical: {
      linesOfCode: 9800,
      commits: 89,
      contributors: 3,
      issues: 23
    },
    links: {
      github: 'https://github.com/user/finance-app'
    },
    screenshots: [],
    color: '#ff0088'
  }
];

// Comparison metrics component
const MetricsComparison = ({ 
  projects, 
  selectedMetrics 
}: {
  projects: ComparisonProject[];
  selectedMetrics: string[];
}) => {
  const chartData = selectedMetrics.map(metric => {
    const metricName = metric.replace(/([A-Z])/g, ' $1').trim();
    const totalValue = projects.reduce((sum, project) => {
      const value = project.metrics[metric as keyof typeof project.metrics] || 
                   project.business[metric as keyof typeof project.business] ||
                   0;
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
    
    return {
      name: metricName,
      value: totalValue
    };
  });

  return (
    <AnimatedChartContainer title="METRICS COMPARISON">
      <PixelBarChart
        data={chartData}
        height={300}
        theme="retro"
        animated={true}
      />
    </AnimatedChartContainer>
  );
};

// Radar chart for project overview
const ProjectRadarChart = ({ project }: { project: ComparisonProject }) => {
  const radarData = Object.entries(project.metrics).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    value,
    fullMark: 100
  }));

  return (
    <AnimatedChartContainer title={project.title.toUpperCase()}>
      <RadialProgressChart
        data={radarData}
        height={300}
        theme="retro"
        animated={true}
      />
    </AnimatedChartContainer>
  );
};

// Technology stack comparison
const TechStackComparison = ({ projects }: { projects: ComparisonProject[] }) => {
  const allTechnologies = Array.from(
    new Set(projects.flatMap(p => p.technologies))
  );

  const techData = allTechnologies.map(tech => {
    const usage = projects.filter(p => p.technologies.includes(tech)).length;
    return {
      name: tech,
      value: usage,
      size: usage * 20
    };
  });

  return (
    <AnimatedChartContainer title="TECHNOLOGY USAGE">
      <TechTreemap
        data={techData}
        height={400}
        theme="retro"
      />
    </AnimatedChartContainer>
  );
};

// Performance vs Complexity scatter plot
const PerformanceComplexityChart = ({ projects }: { projects: ComparisonProject[] }) => {
  const scatterData = projects.map(project => ({
    name: project.title,
    value: project.metrics.performance * project.business.complexity,
    x: project.metrics.performance,
    y: project.business.complexity,
    color: project.color
  }));

  return (
    <AnimatedChartContainer title="PERFORMANCE VS COMPLEXITY">
      <PerformanceScatterPlot
        data={scatterData}
        height={400}
        theme="retro"
        animated={true}
      />
    </AnimatedChartContainer>
  );
};

// Project comparison table
const ComparisonTable = ({ 
  projects, 
  visibleColumns 
}: {
  projects: ComparisonProject[];
  visibleColumns: string[];
}) => {
  const getValueByPath = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((current: any, key: string) => current?.[key], obj);
  };

  const formatValue = (value: unknown, column: string): React.ReactNode => {
    if (typeof value === 'number') {
      if (column.includes('budget') || column.includes('roi')) {
        return `$${value.toLocaleString()}`;
      }
      if (column.includes('percentage') || column.includes('coverage') || column.includes('score')) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    if (Array.isArray(value)) {
      return value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '');
    }
    if (typeof value === 'string') {
      return value;
    }
    return 'N/A';
  };

  return (
    <div className="bg-gray-950 border-2 border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-pixel text-white">DETAILED COMPARISON</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-3 text-gray-400 border-r border-gray-700">METRIC</th>
              {projects.map(project => (
                <th key={project.id} className="text-left p-3 text-white border-r border-gray-700">
                  {project.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleColumns.map((column, index) => (
              <motion.tr
                key={column}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-800 hover:bg-gray-900/50"
              >
                <td className="p-3 text-gray-400 border-r border-gray-700 font-medium">
                  {column.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                </td>
                {projects.map(project => (
                  <td key={project.id} className="p-3 text-white border-r border-gray-700">
                    {formatValue(getValueByPath(project as unknown as Record<string, unknown>, column), column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Comparison controls
const ComparisonControls = ({ 
  allProjects,
  selectedProjects,
  onProjectToggle,
  selectedMetrics,
  onMetricToggle,
  viewMode,
  onViewModeChange 
}: {
  allProjects: ComparisonProject[];
  selectedProjects: string[];
  onProjectToggle: (projectId: string) => void;
  selectedMetrics: string[];
  onMetricToggle: (metric: string) => void;
  viewMode: 'overview' | 'detailed' | 'charts';
  onViewModeChange: (mode: 'overview' | 'detailed' | 'charts') => void;
}) => {
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  const [isMetricPanelOpen, setIsMetricPanelOpen] = useState(false);

  const availableMetrics = [
    'metrics.performance',
    'metrics.scalability',
    'metrics.security',
    'metrics.userExperience',
    'business.roi',
    'business.complexity',
    'business.innovation',
    'technical.linesOfCode',
    'technical.commits'
  ];

  return (
    <div className="bg-gray-950 border-b-2 border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-pixel text-white">PROJECT COMPARISON</h2>
          
          <div className="flex gap-1">
            {(['overview', 'detailed', 'charts'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1 text-xs font-mono border transition-colors ${
                  viewMode === mode
                    ? 'bg-retro-green text-black border-retro-green'
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsProjectPanelOpen(!isProjectPanelOpen)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white font-mono text-sm transition-colors"
            >
              PROJECTS ({selectedProjects.length})
            </button>
            
            <AnimatePresence>
              {isProjectPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-10 bg-gray-900 border border-gray-600 p-4 min-w-64 z-20"
                >
                  <h4 className="text-sm font-pixel text-white mb-3">SELECT PROJECTS</h4>
                  <div className="space-y-2">
                    {allProjects.map(project => (
                      <label key={project.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => onProjectToggle(project.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-white font-mono">{project.title}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMetricPanelOpen(!isMetricPanelOpen)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white font-mono text-sm transition-colors"
            >
              METRICS ({selectedMetrics.length})
            </button>
            
            <AnimatePresence>
              {isMetricPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-10 bg-gray-900 border border-gray-600 p-4 min-w-64 z-20"
                >
                  <h4 className="text-sm font-pixel text-white mb-3">SELECT METRICS</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableMetrics.map(metric => (
                      <label key={metric} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric)}
                          onChange={() => onMetricToggle(metric)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-white font-mono">
                          {metric.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project overview cards
const ProjectOverviewCards = ({ projects }: { projects: ComparisonProject[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PixelCard className="p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-pixel text-white mb-2">{project.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{project.category}</p>
                <span 
                  className="px-2 py-1 text-xs font-mono text-black"
                  style={{ backgroundColor: project.color }}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-gray-400">OVERALL SCORE</div>
                <div className="text-2xl font-pixel text-white">
                  {Math.round(
                    Object.values(project.metrics).reduce((a, b) => a + b, 0) / 
                    Object.values(project.metrics).length
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-mono text-gray-400 mb-1">TECHNOLOGIES</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Performance:</span>
                  <span className="text-white ml-2">{project.metrics.performance}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Security:</span>
                  <span className="text-white ml-2">{project.metrics.security}%</span>
                </div>
                <div>
                  <span className="text-gray-400">UX Score:</span>
                  <span className="text-white ml-2">{project.metrics.userExperience}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Code Quality:</span>
                  <span className="text-white ml-2">{project.metrics.codeQuality}%</span>
                </div>
              </div>

              {project.links.demo && (
                <div className="pt-3 border-t border-gray-700">
                  <PixelButton
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(project.links.demo, '_blank')}
                    className="w-full"
                  >
                    View Live Demo
                  </PixelButton>
                </div>
              )}
            </div>
          </PixelCard>
        </motion.div>
      ))}
    </div>
  );
};

// Main comparison component
export const ProjectComparison = ({ 
  projects = SAMPLE_PROJECTS,
  className = '' 
}: {
  projects?: ComparisonProject[];
  className?: string;
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    projects.slice(0, 3).map(p => p.id)
  );
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'metrics.performance',
    'metrics.security',
    'metrics.userExperience',
    'business.complexity'
  ]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'charts'>('overview');

  const filteredProjects = projects.filter(p => selectedProjects.includes(p.id));

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className={`bg-gray-950 border-2 border-gray-700 ${className}`}>
      <ComparisonControls
        allProjects={projects}
        selectedProjects={selectedProjects}
        onProjectToggle={handleProjectToggle}
        selectedMetrics={selectedMetrics}
        onMetricToggle={handleMetricToggle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="p-6">
        {viewMode === 'overview' && (
          <ProjectOverviewCards projects={filteredProjects} />
        )}

        {viewMode === 'detailed' && (
          <ComparisonTable
            projects={filteredProjects}
            visibleColumns={selectedMetrics}
          />
        )}

        {viewMode === 'charts' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MetricsComparison
                projects={filteredProjects}
                selectedMetrics={selectedMetrics}
              />
              <PerformanceComplexityChart projects={filteredProjects} />
            </div>
            
            <TechStackComparison projects={filteredProjects} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <ProjectRadarChart key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <PixelIconLibrary.Search size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 font-mono">No projects selected for comparison</p>
          </div>
        )}
      </div>
    </div>
  );
};