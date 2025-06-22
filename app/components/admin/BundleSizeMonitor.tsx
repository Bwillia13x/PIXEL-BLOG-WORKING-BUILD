'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CubeIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

interface BundleSizeData {
  timestamp: string
  summary: {
    totalJavaScriptKB: number
    totalCSSKB: number
    violationCount: number
    recommendationCount: number
    passesAllBudgets: boolean
  }
  violations: Array<{
    type: string
    severity: string
    current: string
    budget: string
  }>
}

interface BundleTrends {
  javascriptTrend: 'increasing' | 'decreasing' | 'stable'
  cssTrend: 'increasing' | 'decreasing' | 'stable'
  violationTrend: 'increasing' | 'decreasing' | 'stable'
  overallTrend: 'improving' | 'concerning' | 'stable'
  metrics: {
    recentJSAvg: number
    olderJSAvg: number
    recentCSSAvg: number
    olderCSSAvg: number
    recentViolationAvg: number
    olderViolationAvg: number
  }
}

interface BundleAnalysisResponse {
  history: BundleSizeData[]
  latest: BundleSizeData
  trends: BundleTrends
  currentAnalysis?: any
  totalEntries: number
  generatedAt: string
}

function TrendIcon({ trend }: { trend: string }) {
  switch (trend) {
    case 'increasing':
    case 'concerning':
      return <ArrowTrendingUpIcon className="w-5 h-5 text-red-400" />
    case 'decreasing':
    case 'improving':
      return <ArrowTrendingDownIcon className="w-5 h-5 text-green-400" />
    default:
      return <MinusIcon className="w-5 h-5 text-gray-400" />
  }
}

function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  budget, 
  isViolation = false 
}: {
  title: string
  value: number
  unit: string
  trend: string
  budget?: number
  isViolation?: boolean
}) {
  const percentage = budget ? Math.round((value / budget) * 100) : 0
  const isOverBudget = budget && value > budget

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        isOverBudget 
          ? 'bg-red-900/20 border-red-500/30' 
          : 'bg-gray-800/50 border-cyan-500/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <TrendIcon trend={trend} />
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
          {value}
        </span>
        <span className="text-gray-400 text-sm">{unit}</span>
      </div>

      {budget && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Budget: {budget}{unit}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

function ViolationAlert({ violations }: { violations: BundleSizeData['violations'] }) {
  if (violations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 p-3 bg-green-600/20 text-green-400 rounded-md border border-green-600/30"
      >
        <CheckCircleIcon className="w-5 h-5" />
        <span>All performance budgets are within limits</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      {violations.map((violation, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-3 rounded-md border ${
            violation.severity === 'high'
              ? 'bg-red-600/20 text-red-400 border-red-600/30'
              : violation.severity === 'medium'
              ? 'bg-orange-600/20 text-orange-400 border-orange-600/30'
              : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
          }`}
        >
          <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium">{violation.type}</h4>
            <p className="text-sm opacity-80">
              Current: {violation.current} • Budget: {violation.budget}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function BundleChart({ history }: { history: BundleSizeData[] }) {
  if (history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No bundle size history available
      </div>
    )
  }

  const maxJS = Math.max(...history.map(h => h.summary.totalJavaScriptKB))
  const maxCSS = Math.max(...history.map(h => h.summary.totalCSSKB))
  const maxTotal = Math.max(maxJS, maxCSS)

  return (
    <div className="h-64 p-4">
      <div className="flex items-end space-x-1 h-full">
        {history.slice(-20).map((entry, index) => {
          const jsHeight = (entry.summary.totalJavaScriptKB / maxTotal) * 100
          const cssHeight = (entry.summary.totalCSSKB / maxTotal) * 100
          const date = new Date(entry.timestamp).toLocaleDateString()

          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="flex flex-col items-center space-y-1 w-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${jsHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full bg-cyan-500 rounded-t-sm opacity-80"
                  title={`JavaScript: ${entry.summary.totalJavaScriptKB}KB`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${cssHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full bg-blue-500 rounded-t-sm opacity-60"
                  title={`CSS: ${entry.summary.totalCSSKB}KB`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {date}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded" />
          <span className="text-gray-400">JavaScript</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-400">CSS</span>
        </div>
      </div>
    </div>
  )
}

export default function BundleSizeMonitor() {
  const [data, setData] = useState<BundleAnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchBundleData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/analytics/bundle-size?details=true')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bundle data: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching bundle data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bundle data')
    } finally {
      setIsLoading(false)
    }
  }

  const runBundleAnalysis = async () => {
    try {
      setIsLoading(true)
      // This would typically trigger a build analysis
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate analysis
      await fetchBundleData()
    } catch (err) {
      setError('Failed to run bundle analysis')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBundleData()
  }, [])

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <ArrowPathIcon className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="text-gray-400">Loading bundle analysis...</span>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-6 bg-red-600/20 text-red-400 rounded-lg border border-red-600/30">
        <div className="flex items-center gap-2 mb-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span className="font-medium">Bundle Analysis Error</span>
        </div>
        <p className="text-sm opacity-80">{error}</p>
        <button
          onClick={fetchBundleData}
          className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data?.latest) {
    return (
      <div className="text-center py-8">
        <CubeIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-400 mb-2">No Bundle Data</h3>
        <p className="text-gray-500 mb-4">
          Run a build analysis to see bundle size information
        </p>
        <button
          onClick={runBundleAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          {isLoading ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <BeakerIcon className="w-4 h-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>
    )
  }

  const { latest, trends, history } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Bundle Size Monitor</h1>
            <p className="text-gray-400">Track and optimize your bundle performance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <DocumentTextIcon className="w-5 h-5" />
          </button>
          <button
            onClick={fetchBundleData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="JavaScript"
          value={latest.summary.totalJavaScriptKB}
          unit="KB"
          trend={trends.javascriptTrend}
          budget={250}
        />
        <MetricCard
          title="CSS"
          value={latest.summary.totalCSSKB}
          unit="KB"
          trend={trends.cssTrend}
          budget={50}
        />
        <MetricCard
          title="Violations"
          value={latest.summary.violationCount}
          unit=""
          trend={trends.violationTrend}
          isViolation={latest.summary.violationCount > 0}
        />
        <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Overall Trend</h3>
            <TrendIcon trend={trends.overallTrend} />
          </div>
          <div className={`text-lg font-semibold ${
            trends.overallTrend === 'improving' ? 'text-green-400' :
            trends.overallTrend === 'concerning' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {trends.overallTrend.charAt(0).toUpperCase() + trends.overallTrend.slice(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on last 20 builds
          </div>
        </div>
      </div>

      {/* Bundle Violations */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Performance Budget Status</h2>
        <ViolationAlert violations={latest.violations} />
      </div>

      {/* Bundle Size Chart */}
      <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20">
        <div className="p-4 border-b border-cyan-500/20">
          <h2 className="text-lg font-semibold text-white">Bundle Size History</h2>
          <p className="text-gray-400 text-sm">Last 20 builds</p>
        </div>
        <BundleChart history={history} />
      </div>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showDetails && data.currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h2>
            
            {/* Recommendations */}
            {data.currentAnalysis.recommendations && (
              <div className="space-y-3">
                <h3 className="font-medium text-cyan-400">Optimization Recommendations:</h3>
                {data.currentAnalysis.recommendations.slice(0, 5).map((rec: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-900/50 rounded border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-400' :
                        rec.priority === 'medium' ? 'bg-orange-400' :
                        'bg-green-400'
                      }`} />
                      <span className="font-medium text-white">{rec.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{rec.description}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        Last updated: {new Date(latest.timestamp).toLocaleString()} • 
        Total entries: {data.totalEntries}
      </div>
    </div>
  )
}