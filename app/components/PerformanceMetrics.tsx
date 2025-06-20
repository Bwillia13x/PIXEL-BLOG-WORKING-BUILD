"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface PerformanceData {
  averageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

interface PerformanceMetricsProps {
  data?: PerformanceData
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-green-400/30">
        <h3 className="text-green-400 font-mono text-lg mb-4">Performance Metrics</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">⚡</div>
          <p className="text-gray-400 font-mono text-sm">
            No performance data available
          </p>
        </div>
      </div>
    )
  }

  // Web Vitals thresholds
  const getVitalStatus = (metric: string, value: number) => {
    const thresholds: { [key: string]: { good: number; needs: number } } = {
      fcp: { good: 1.8, needs: 3.0 },
      lcp: { good: 2.5, needs: 4.0 },
      fid: { good: 100, needs: 300 },
      cls: { good: 0.1, needs: 0.25 },
      loadTime: { good: 2.0, needs: 4.0 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.needs) return 'needs-improvement'
    return 'poor'
  }

  const vitals = [
    {
      name: 'Average Load Time',
      value: data.averageLoadTime,
      unit: 's',
      icon: '🚀',
      status: getVitalStatus('loadTime', data.averageLoadTime),
      description: 'Time to fully load the page'
    },
    {
      name: 'First Contentful Paint',
      value: data.firstContentfulPaint,
      unit: 's',
      icon: '🎨',
      status: getVitalStatus('fcp', data.firstContentfulPaint),
      description: 'Time to first content render'
    },
    {
      name: 'Largest Contentful Paint',
      value: data.largestContentfulPaint,
      unit: 's',
      icon: '📏',
      status: getVitalStatus('lcp', data.largestContentfulPaint),
      description: 'Time to largest content render'
    },
    {
      name: 'First Input Delay',
      value: data.firstInputDelay,
      unit: 'ms',
      icon: '👆',
      status: getVitalStatus('fid', data.firstInputDelay),
      description: 'Time to first user interaction'
    },
    {
      name: 'Cumulative Layout Shift',
      value: data.cumulativeLayoutShift,
      unit: '',
      icon: '📐',
      status: getVitalStatus('cls', data.cumulativeLayoutShift),
      description: 'Visual stability score'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'needs-improvement': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '🟢'
      case 'needs-improvement': return '🟡'
      case 'poor': return '🔴'
      default: return '⚪'
    }
  }

  const overallScore = vitals.filter(v => v.status === 'good').length / vitals.length * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 font-mono text-lg">Performance Metrics</h3>
        <div className="text-xs text-gray-400 font-mono">
          Core Web Vitals
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 text-center">
        <div className="text-3xl font-mono text-green-400 mb-2">
          {Math.round(overallScore)}%
        </div>
        <div className="text-sm text-gray-400">Overall Performance Score</div>
        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1 }}
            className={`h-2 rounded-full ${
              overallScore > 80 ? 'bg-green-400' : 
              overallScore > 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        {vitals.map((vital, index) => (
          <motion.div
            key={vital.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{vital.icon}</span>
                <div>
                  <div className="text-sm font-mono text-gray-300">
                    {vital.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {vital.description}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-mono ${getStatusColor(vital.status)}`}>
                  {vital.value}{vital.unit}
                </div>
                <div className="text-xs text-gray-400">
                  {getStatusIcon(vital.status)} {vital.status.replace('-', ' ')}
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: vital.status === 'good' ? '100%' : 
                           vital.status === 'needs-improvement' ? '60%' : '30%'
                  }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className={`h-1.5 rounded-full ${
                    vital.status === 'good' ? 'bg-green-400' : 
                    vital.status === 'needs-improvement' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="mt-6 p-3 bg-gray-700/20 rounded border border-gray-600">
        <div className="text-xs font-mono text-gray-400 mb-2">⚡ Insights:</div>
        <div className="space-y-1 text-xs text-gray-300">
          {overallScore > 80 && (
            <div>✓ Excellent performance across all metrics</div>
          )}
          {data.averageLoadTime < 2 && (
            <div>🚀 Lightning fast load times</div>
          )}
          {data.firstContentfulPaint > 3 && (
            <div>⚠️ First paint could be optimized</div>
          )}
          {data.largestContentfulPaint > 4 && (
            <div>⚠️ Largest content paint needs attention</div>
          )}
          {data.cumulativeLayoutShift > 0.1 && (
            <div>⚠️ Layout shifts affecting user experience</div>
          )}
          {data.firstInputDelay > 100 && (
            <div>⚠️ Input responsiveness could be improved</div>
          )}
          {overallScore === 100 && (
            <div>🏆 Perfect performance score!</div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-500/30">
        <div className="text-xs font-mono text-blue-400 mb-2">💡 Recommendations:</div>
        <div className="space-y-1 text-xs text-gray-300">
          {data.averageLoadTime > 3 && (
            <div>• Optimize images and implement lazy loading</div>
          )}
          {data.firstContentfulPaint > 2 && (
            <div>• Reduce render-blocking resources</div>
          )}
          {data.cumulativeLayoutShift > 0.1 && (
            <div>• Set size attributes for images and ads</div>
          )}
          {data.firstInputDelay > 100 && (
            <div>• Optimize JavaScript execution</div>
          )}
          {overallScore > 90 && (
            <div>• Keep up the excellent performance!</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PerformanceMetrics 