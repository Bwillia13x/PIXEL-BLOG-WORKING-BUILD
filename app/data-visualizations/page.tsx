import React from 'react';
import { Metadata } from 'next';
import { AnimatedChartContainer, ChartStyles } from '../components/visualizations/AdvancedCharts';
import { ProjectTimeline } from '../components/visualizations/ProjectTimeline';
import { RealTimeDashboard } from '../components/visualizations/RealTimeDashboard';
import { ProjectComparison } from '../components/visualizations/ProjectComparison';
import { DataExportSystem } from '../components/visualizations/DataExportSystem';
import { AnimatedInfographics } from '../components/visualizations/AnimatedInfographics';
import { PixelIconLibrary } from '../components/design-system/PixelIcons';
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations';

export const metadata: Metadata = {
  title: 'Data Visualizations - Interactive Analytics & Charts',
  description: 'Explore stunning interactive data visualizations with animated charts, real-time dashboards, project timelines, and comprehensive analytics tools.',
  keywords: 'data visualization, analytics, charts, dashboard, timeline, infographics',
};

// Sample timeline data
const timelineData = [
  {
    id: 'pixel-blog-start',
    title: 'Pixel Blog Project Launch',
    description: 'Initiated the development of a modern developer blog with pixel-art aesthetics and advanced analytics capabilities.',
    startDate: '2024-01-01',
    endDate: '2024-03-15',
    category: 'project' as const,
    status: 'completed' as const,
    tags: ['web-development', 'react', 'typescript', 'design'],
    icon: 'Home' as const,
    metadata: {
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      complexity: 4,
      impact: 5,
      github: 'https://github.com/user/pixel-blog',
      demo: 'https://pixelwisdom.dev'
    }
  },
  {
    id: 'analytics-integration',
    title: 'Analytics System Integration',
    description: 'Implemented comprehensive analytics tracking with real-time visitor monitoring and performance metrics.',
    startDate: '2024-02-01',
    endDate: '2024-02-20',
    category: 'milestone' as const,
    status: 'completed' as const,
    tags: ['analytics', 'tracking', 'performance'],
    icon: 'Star' as const,
    metadata: {
      technologies: ['Custom Analytics', 'Web Vitals', 'LocalStorage'],
      complexity: 3,
      impact: 4
    }
  },
  {
    id: 'visualization-system',
    title: 'Data Visualization System',
    description: 'Created advanced data visualization components with interactive charts, timelines, and real-time dashboards.',
    startDate: '2024-03-01',
    category: 'project' as const,
    status: 'in-progress' as const,
    tags: ['visualization', 'charts', 'dashboard', 'd3js'],
    icon: 'Search' as const,
    metadata: {
      technologies: ['Recharts', 'D3.js', 'Framer Motion', 'Canvas API'],
      complexity: 5,
      impact: 5
    }
  }
];

// Sample export data
const exportData = {
  title: 'Data Visualization Showcase',
  type: 'analytics' as const,
  data: {
    charts: 6,
    components: 12,
    features: 24,
    performance: 95
  },
  metadata: {
    generatedAt: new Date(),
    generatedBy: 'Pixel Wisdom System',
    version: '1.0.0',
    description: 'Comprehensive showcase of data visualization capabilities'
  }
};

export default function DataVisualizationsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ChartStyles />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-pixel text-retro-green mb-6">
              <MatrixTextReveal 
                text="DATA VISUALIZATIONS" 
                speed={50}
                delay={400}
                scrambleDuration={300}
                className="inline-block"
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-mono max-w-3xl mx-auto mb-8">
              Transform raw data into stunning interactive visualizations with animated charts, 
              real-time dashboards, project timelines, and comprehensive analytics tools.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { icon: 'BarChart', label: 'Interactive Charts', count: '12+' },
                { icon: 'TrendingUp', label: 'Real-time Widgets', count: '8+' },
                { icon: 'Calendar', label: 'Timeline Views', count: '4+' },
                { icon: 'Download', label: 'Export Formats', count: '6+' }
              ].map((feature, index) => {
                const Icon = PixelIconLibrary[feature.icon as keyof typeof PixelIconLibrary];
                return (
                  <div key={feature.label} className="text-center">
                    <Icon size={32} color="#00ff88" className="mx-auto mb-3" />
                    <div className="text-2xl font-pixel text-white mb-1">{feature.count}</div>
                    <div className="text-sm text-gray-400 font-mono">{feature.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-700 sticky top-0 bg-gray-950/95 backdrop-blur-sm z-30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8 py-4 overflow-x-auto">
            {[
              { id: 'infographics', label: 'Infographics' },
              { id: 'dashboard', label: 'Real-time Dashboard' },
              { id: 'timeline', label: 'Project Timeline' },
              { id: 'comparison', label: 'Project Comparison' },
              { id: 'export', label: 'Data Export' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-mono text-gray-400 hover:text-retro-green transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        
        {/* Animated Infographics Section */}
        <section id="infographics">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-pixel text-white mb-4">ANIMATED INFOGRAPHICS</h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              Engage users with dynamic statistics, progress animations, and interactive data stories 
              that bring numbers to life with smooth pixel-perfect animations.
            </p>
          </div>
          <AnimatedInfographics />
        </section>

        {/* Real-time Dashboard Section */}
        <section id="dashboard">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-pixel text-white mb-4">REAL-TIME DASHBOARD</h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              Monitor live metrics with customizable widgets, drag-and-drop layouts, 
              and real-time data updates that keep you informed of your system's performance.
            </p>
          </div>
          <RealTimeDashboard />
        </section>

        {/* Project Timeline Section */}
        <section id="timeline">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-pixel text-white mb-4">INTERACTIVE TIMELINE</h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              Visualize project evolution with zoomable timelines, filterable events, 
              and detailed project information in an intuitive chronological interface.
            </p>
            <div className="flex justify-center mt-6">
              <DataExportSystem data={exportData} />
            </div>
          </div>
          <ProjectTimeline 
            events={timelineData}
            height={600}
          />
        </section>

        {/* Project Comparison Section */}
        <section id="comparison">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-pixel text-white mb-4">PROJECT COMPARISON</h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              Compare projects side-by-side with detailed metrics, technology stacks, 
              and performance indicators to make data-driven decisions.
            </p>
          </div>
          <ProjectComparison />
        </section>

        {/* Data Export Section */}
        <section id="export">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-pixel text-white mb-4">DATA EXPORT SYSTEM</h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              Export your data in multiple formats with beautiful report templates, 
              custom branding options, and comprehensive data preservation capabilities.
            </p>
          </div>
          
          <div className="bg-gray-950 border-2 border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  format: 'PDF',
                  description: 'Formatted reports with charts and branding',
                  features: ['Multiple templates', 'Custom branding', 'Chart embedding']
                },
                {
                  format: 'CSV',
                  description: 'Spreadsheet-compatible data export',
                  features: ['Raw data', 'Easy import', 'Excel compatible']
                },
                {
                  format: 'JSON',
                  description: 'Structured data for developers',
                  features: ['Full metadata', 'API friendly', 'Version control']
                },
                {
                  format: 'PNG/SVG',
                  description: 'Visual snapshots and scalable graphics',
                  features: ['High resolution', 'Scalable vectors', 'Web ready']
                },
                {
                  format: 'Excel',
                  description: 'Advanced spreadsheet with formulas',
                  features: ['Multiple sheets', 'Formulas', 'Formatting']
                },
                {
                  format: 'Custom',
                  description: 'Tailored export formats for specific needs',
                  features: ['Custom templates', 'API integration', 'Automation']
                }
              ].map((exportType, index) => (
                <div key={exportType.format} className="bg-gray-900 border border-gray-700 p-6">
                  <h3 className="text-lg font-pixel text-retro-green mb-2">
                    {exportType.format}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {exportType.description}
                  </p>
                  <ul className="space-y-1">
                    {exportType.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1 h-1 bg-retro-green" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <DataExportSystem data={exportData} />
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="bg-gray-900 border-2 border-gray-700 p-8">
          <h2 className="text-2xl font-pixel text-white mb-6 text-center">
            TECHNICAL SPECIFICATIONS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-pixel text-retro-green mb-4">VISUALIZATION LIBRARIES</h3>
              <ul className="space-y-2 text-sm font-mono text-gray-300">
                <li>• Recharts for responsive chart components</li>
                <li>• Framer Motion for smooth animations</li>
                <li>• D3.js for custom data manipulations</li>
                <li>• Canvas API for high-performance rendering</li>
                <li>• SVG for scalable vector graphics</li>
                <li>• CSS3 for pixel-perfect styling</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-pixel text-retro-green mb-4">FEATURES & CAPABILITIES</h3>
              <ul className="space-y-2 text-sm font-mono text-gray-300">
                <li>• Real-time data updates every 5-30 seconds</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Accessibility-compliant visualizations</li>
                <li>• Custom pixel-art themed aesthetics</li>
                <li>• Interactive hover effects and animations</li>
                <li>• Drag-and-drop dashboard customization</li>
                <li>• Multiple export formats with templates</li>
                <li>• Advanced filtering and search capabilities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-pixel text-white mb-4">
            READY TO VISUALIZE YOUR DATA?
          </h2>
          <p className="text-gray-400 font-mono mb-8 max-w-2xl mx-auto">
            These visualization components are production-ready and can be easily 
            integrated into any React application. Explore the source code and 
            customize them for your specific needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/design-system"
              className="inline-flex items-center gap-2 px-6 py-3 bg-retro-green hover:bg-green-500 text-black font-mono text-sm transition-colors"
            >
              <PixelIconLibrary.Search size={16} />
              View Design System
            </a>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-retro-green text-white font-mono text-sm transition-colors"
            >
              <PixelIconLibrary.Link size={16} />
              Explore Projects
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}