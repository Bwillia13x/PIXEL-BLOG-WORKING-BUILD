"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PopularPost {
  title: string
  path: string
  views: number
  timeOnPage: number
  bounceRate: number
  readingProgress: number
}

interface PopularContentProps {
  data?: PopularPost[]
  showDetailed?: boolean
}

const PopularContent: React.FC<PopularContentProps> = ({ 
  data = [], 
  showDetailed = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-400 font-mono text-lg">
          {showDetailed ? 'Content Performance' : 'Popular Content'}
        </h3>
        <div className="text-xs text-gray-400 font-mono">
          Top {data.length}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {data.map((post, index) => (
          <motion.div
            key={post.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-700 rounded-lg p-4 hover:border-green-400/50 transition-colors"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Link 
                  href={post.path}
                  className="text-green-400 font-mono text-sm hover:text-green-300 transition-colors block truncate"
                >
                  {post.title}
                </Link>
                <p className="text-gray-500 text-xs mt-1 font-mono">
                  {post.path}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-green-400 font-mono text-lg">
                  {post.views.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">views</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="text-center">
                <div className="text-sm font-mono text-green-400">
                  {post.timeOnPage.toFixed(1)}m
                </div>
                <div className="text-xs text-gray-400">Time</div>
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-mono ${
                  post.bounceRate < 30 ? 'text-green-400' : 
                  post.bounceRate < 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {post.bounceRate}%
                </div>
                <div className="text-xs text-gray-400">Bounce</div>
              </div>

              <div className="text-center">
                <div className={`text-sm font-mono ${
                  post.readingProgress > 70 ? 'text-green-400' : 
                  post.readingProgress > 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {post.readingProgress}%
                </div>
                <div className="text-xs text-gray-400">Read</div>
              </div>

              <div className="text-center">
                <div className="text-sm font-mono text-blue-400">
                  #{index + 1}
                </div>
                <div className="text-xs text-gray-400">Rank</div>
              </div>
            </div>

            {/* Progress Bars (Detailed View) */}
            {showDetailed && (
              <div className="mt-4 space-y-2">
                {/* Reading Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Reading Progress</span>
                    <span>{post.readingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${post.readingProgress}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="bg-green-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                {/* Engagement Score */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Engagement Score</span>
                    <span>{Math.round(100 - post.bounceRate)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - post.bounceRate}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className="bg-blue-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">📄</div>
          <p className="text-gray-400 font-mono text-sm">
            No content data available
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-xs font-mono">
          Ranked by total views
        </p>
      </div>
    </motion.div>
  )
}

export default PopularContent 