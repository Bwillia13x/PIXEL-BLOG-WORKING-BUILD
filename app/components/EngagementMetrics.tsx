"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface EngagementData {
  averageTimeOnPage: string
  scrollDepth: number
  clickThroughRate: number
  shareRate: number
  commentRate: number
}

interface EngagementMetricsProps {
  data?: EngagementData
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-green-400/30">
        <h3 className="text-green-400 font-mono text-lg mb-4">Engagement Metrics</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">📊</div>
          <p className="text-gray-400 font-mono text-sm">
            No engagement data available
          </p>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Avg. Time on Page',
      value: data.averageTimeOnPage,
      icon: '⏱️',
      color: 'text-green-400',
      type: 'time'
    },
    {
      label: 'Scroll Depth',
      value: `${data.scrollDepth}%`,
      icon: '📜',
      color: 'text-blue-400',
      type: 'percentage',
      percentage: data.scrollDepth
    },
    {
      label: 'Click-through Rate',
      value: `${data.clickThroughRate}%`,
      icon: '👆',
      color: 'text-purple-400',
      type: 'percentage',
      percentage: data.clickThroughRate
    },
    {
      label: 'Share Rate',
      value: `${data.shareRate}%`,
      icon: '📤',
      color: 'text-cyan-400',
      type: 'percentage',
      percentage: data.shareRate
    },
    {
      label: 'Comment Rate',
      value: `${data.commentRate}%`,
      icon: '💬',
      color: 'text-yellow-400',
      type: 'percentage',
      percentage: data.commentRate
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 font-mono text-lg">Engagement Metrics</h3>
        <div className="text-xs text-gray-400 font-mono">
          User Interaction
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{metric.icon}</span>
                <div>
                  <div className="text-sm font-mono text-gray-300">
                    {metric.label}
                  </div>
                  <div className={`text-lg font-mono ${metric.color}`}>
                    {metric.value}
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="text-right">
                {metric.type === 'percentage' && metric.percentage && (
                  <div className={`text-xs font-mono ${
                    metric.percentage > 50 ? 'text-green-400' : 
                    metric.percentage > 25 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metric.percentage > 50 ? '🟢 Good' : 
                     metric.percentage > 25 ? '🟡 Fair' : '🔴 Poor'}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for percentages */}
            {metric.type === 'percentage' && metric.percentage && (
              <div className="w-full bg-gray-600 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className={`h-2 rounded-full ${
                    metric.percentage > 50 ? 'bg-green-400' : 
                    metric.percentage > 25 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-sm font-mono text-gray-400 mb-2">
            Overall Engagement Score
          </div>
          <div className="text-2xl font-mono text-green-400">
            {Math.round(
              (data.scrollDepth + data.clickThroughRate + data.shareRate + data.commentRate) / 4
            )}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on user interaction metrics
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="mt-4 p-3 bg-gray-700/20 rounded border border-gray-600">
        <div className="text-xs font-mono text-gray-400 mb-2">💡 Insights:</div>
        <div className="space-y-1 text-xs text-gray-300">
          {data.scrollDepth > 70 && (
            <div>✓ High scroll depth indicates engaging content</div>
          )}
          {data.clickThroughRate > 5 && (
            <div>✓ Good click-through rate shows effective CTAs</div>
          )}
          {data.shareRate > 3 && (
            <div>✓ Content is being shared frequently</div>
          )}
          {data.commentRate > 1 && (
            <div>✓ Active community engagement</div>
          )}
          {data.scrollDepth < 50 && (
            <div>⚠️ Consider improving content layout</div>
          )}
          {data.clickThroughRate < 3 && (
            <div>⚠️ CTAs may need optimization</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default EngagementMetrics 