'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useRealTimePerformance } from '@/app/hooks/useRealTimePerformance'

interface PerformanceMetricCard {
  title: string
  value: string | number
  unit?: string
  status: 'good' | 'needs-improvement' | 'poor'
  description: string
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ 
  metric, 
  showDetails = false 
}: { 
  metric: PerformanceMetricCard
  showDetails?: boolean 
}) {
  const statusColors = {
    good: 'text-green-400 border-green-500/30 bg-green-600/20',
    'needs-improvement': 'text-orange-400 border-orange-500/30 bg-orange-600/20',
    poor: 'text-red-400 border-red-500/30 bg-red-600/20'
  }

  const statusIcons = {
    good: CheckCircleIcon,
    'needs-improvement': ExclamationTriangleIcon,
    poor: ExclamationTriangleIcon
  }

  const StatusIcon = statusIcons[metric.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${statusColors[metric.status]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <metric.icon className="w-5 h-5" />
          <h3 className="font-medium">{metric.title}</h3>
        </div>
        <StatusIcon className="w-4 h-4" />
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold">
          {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
        </span>
        {metric.unit && (
          <span className="text-sm opacity-70">{metric.unit}</span>
        )}
      </div>

      {showDetails && (
        <p className="text-sm opacity-80">{metric.description}</p>
      )}
    </motion.div>
  )
}

function PerformanceInsights({ insights }: { insights: any[] }) {
  if (insights.length === 0) {
    return (
      <div className="p-4 bg-green-600/20 text-green-400 rounded-lg border border-green-600/30">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="font-medium">All metrics are performing well!</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border ${
            insight.type === 'error' 
              ? 'bg-red-600/20 text-red-400 border-red-600/30'
              : 'bg-orange-600/20 text-orange-400 border-orange-600/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium mb-1">{insight.metric} Issue</h4>
              <p className="text-sm opacity-90 mb-2">{insight.message}</p>
              <p className="text-xs opacity-70">
                💡 {insight.recommendation}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ScoreBreakdown({ 
  breakdown 
}: { 
  breakdown: { loading: number, interactivity: number, visualStability: number } 
}) {
  const categories = [
    { name: 'Loading', value: breakdown.loading, color: 'bg-cyan-500' },
    { name: 'Interactivity', value: breakdown.interactivity, color: 'bg-blue-500' },
    { name: 'Visual Stability', value: breakdown.visualStability, color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{category.name}</span>
            <span className="text-white font-medium">{category.value}/100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${category.value}%` }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`h-2 rounded-full ${category.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PerformanceDashboard() {
  const { 
    metrics, 
    isMonitoring, 
    getInsights, 
    getPerformanceRating 
  } = useRealTimePerformance({
    enableFPSMonitoring: true,
    enableMemoryMonitoring: true,
    enableScrollTracking: true,
    reportingInterval: 3000
  })

  const [showDetails, setShowDetails] = useState(false)
  const [insights, setInsights] = useState<any[]>([])

  useEffect(() => {
    setInsights(getInsights())
  }, [metrics, getInsights])

  const performanceMetrics: PerformanceMetricCard[] = [
    {
      title: 'Overall Score',
      value: metrics.overallScore,
      unit: '/100',
      status: metrics.overallScore >= 80 ? 'good' : metrics.overallScore >= 50 ? 'needs-improvement' : 'poor',
      description: 'Composite performance score based on Core Web Vitals',
      icon: SparklesIcon
    },
    {
      title: 'Largest Contentful Paint',
      value: metrics.lcp ? (metrics.lcp / 1000).toFixed(2) : 'N/A',
      unit: 's',
      status: metrics.lcp ? getPerformanceRating('lcp', metrics.lcp) : 'good',
      description: 'Time until the largest content element is rendered',
      icon: EyeIcon
    },
    {
      title: 'First Contentful Paint',
      value: metrics.fcp ? (metrics.fcp / 1000).toFixed(2) : 'N/A',
      unit: 's',
      status: metrics.fcp ? getPerformanceRating('fcp', metrics.fcp) : 'good',
      description: 'Time until first content is painted',
      icon: BoltIcon
    },
    {
      title: 'Cumulative Layout Shift',
      value: metrics.cls !== null ? metrics.cls.toFixed(3) : 'N/A',
      unit: '',
      status: metrics.cls !== null ? getPerformanceRating('cls', metrics.cls) : 'good',
      description: 'Visual stability of the page',
      icon: ChartBarIcon
    },
    {
      title: 'Time to First Byte',
      value: metrics.ttfb ? (metrics.ttfb / 1000).toFixed(2) : 'N/A',
      unit: 's',
      status: metrics.ttfb ? getPerformanceRating('ttfb', metrics.ttfb) : 'good',
      description: 'Server response time',
      icon: ClockIcon
    },
    {
      title: 'Frame Rate',
      value: metrics.fps,
      unit: 'FPS',
      status: metrics.fps >= 50 ? 'good' : metrics.fps >= 30 ? 'needs-improvement' : 'poor',
      description: 'Current animation frame rate',
      icon: CpuChipIcon
    },
    {
      title: 'Memory Usage',
      value: metrics.memoryUsage,
      unit: 'MB',
      status: metrics.memoryUsage <= 50 ? 'good' : metrics.memoryUsage <= 100 ? 'needs-improvement' : 'poor',
      description: 'JavaScript heap memory consumption',
      icon: CpuChipIcon
    },
    {
      title: 'Connection Type',
      value: metrics.connectionType,
      unit: '',
      status: 'good',
      description: 'Network connection quality',
      icon: GlobeAltIcon
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
            <p className="text-gray-400">Real-time performance monitoring and insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-400">
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Details
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Core Web Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {performanceMetrics.slice(0, 4).map((metric, index) => (
                <MetricCard 
                  key={metric.title} 
                  metric={metric} 
                  showDetails={showDetails} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Performance Score</h2>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold mb-2 ${
              metrics.overallScore >= 80 ? 'text-green-400' :
              metrics.overallScore >= 50 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {metrics.overallScore}
            </div>
            <div className="text-gray-400 text-sm">Overall Score</div>
          </div>
          <ScoreBreakdown breakdown={metrics.scoreBreakdown} />
        </div>
      </div>

      {/* Runtime Metrics */}
      <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Runtime Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {performanceMetrics.slice(4).map((metric, index) => (
            <MetricCard 
              key={metric.title} 
              metric={metric} 
              showDetails={showDetails} 
            />
          ))}
        </div>
      </div>

      {/* Session Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
          <h3 className="font-medium text-white mb-2">Time on Page</h3>
          <div className="text-2xl font-bold text-cyan-400">
            {Math.floor(metrics.timeOnPage / 60)}:{(metrics.timeOnPage % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-400">minutes:seconds</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
          <h3 className="font-medium text-white mb-2">Scroll Depth</h3>
          <div className="text-2xl font-bold text-cyan-400">{metrics.scrollDepth}%</div>
          <div className="text-sm text-gray-400">of page viewed</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
          <h3 className="font-medium text-white mb-2">Resources Loaded</h3>
          <div className="text-2xl font-bold text-cyan-400">{metrics.resourceCount}</div>
          <div className="text-sm text-gray-400">
            {(metrics.transferSize / 1024).toFixed(1)} MB transferred
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Performance Insights</h2>
        <PerformanceInsights insights={insights} />
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        Performance data updates every 3 seconds • Monitoring: {isMonitoring ? 'Active' : 'Inactive'}
      </div>
    </div>
  )
}