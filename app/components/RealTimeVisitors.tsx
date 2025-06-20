"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface RealTimeData {
  time: string
  count: number
  pages: Array<{ path: string; visitors: number }>
}

interface RealTimeVisitorsProps {
  data?: RealTimeData[]
}

const RealTimeVisitors: React.FC<RealTimeVisitorsProps> = ({ data = [] }) => {
  const currentVisitors = data[data.length - 1]?.count || 0
  const previousVisitors = data[data.length - 2]?.count || 0
  const trend = currentVisitors - previousVisitors

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-400 font-mono text-lg">Live Visitors</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs font-mono">LIVE</span>
        </div>
      </div>

      {/* Current Visitors Count */}
      <div className="text-center mb-6">
        <motion.div
          key={currentVisitors}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-mono text-green-400 mb-2"
        >
          {currentVisitors}
        </motion.div>
        <p className="text-gray-400 text-sm">Visitors right now</p>
        
        {trend !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-xs font-mono ${
              trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)} from last update
          </motion.div>
        )}
      </div>

      {/* Visitor Activity Chart */}
      <div className="mb-6">
        <h4 className="text-gray-400 text-sm font-mono mb-3">Activity (Last Hour)</h4>
        <div className="flex items-end justify-between h-16 space-x-1">
          {data.slice(-12).map((point, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(point.count / Math.max(...data.map(d => d.count))) * 100}%` }}
              transition={{ delay: index * 0.1 }}
              className="bg-green-400/60 rounded-t-sm min-h-[2px] flex-1 relative group"
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {point.time}: {point.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Active Pages */}
      <div>
        <h4 className="text-gray-400 text-sm font-mono mb-3">Active Pages</h4>
        <div className="space-y-2">
          {currentVisitors > 0 && data[data.length - 1]?.pages.map((page, index) => (
            <motion.div
              key={page.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
            >
              <div className="flex-1 min-w-0">
                <p className="text-green-400 text-xs font-mono truncate">
                  {page.path}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: page.visitors }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-1.5 h-1.5 bg-green-400 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-xs font-mono">
                  {page.visitors}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-xs font-mono">
          Updates every 5 seconds
        </p>
      </div>
    </motion.div>
  )
}

export default RealTimeVisitors 