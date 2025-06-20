"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface GeographicData {
  country: string
  visitors: number
  percentage: number
}

interface GeographicDistributionProps {
  data?: GeographicData[]
}

const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ data = [] }) => {
  const maxVisitors = Math.max(...data.map(item => item.visitors))

  // Country flag emojis (simplified mapping)
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Others': '🌍'
    }
    return flags[country] || '🌍'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 font-mono text-lg">Geographic Distribution</h3>
        <div className="text-xs text-gray-400 font-mono">
          {data.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()} visitors
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">🌍</div>
          <p className="text-gray-400 font-mono text-sm">
            No geographic data available
          </p>
        </div>
      ) : (
        <>
          {/* World Map Visualization (Simplified) */}
          <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
            <div className="text-center text-4xl mb-2">🗺️</div>
            <div className="text-center text-xs text-gray-400 font-mono">
              Global visitor distribution
            </div>
          </div>

          {/* Country List */}
          <div className="space-y-3">
            {data.map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                {/* Country Info */}
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">{getCountryFlag(country.country)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-mono text-green-400">
                      {country.country}
                    </div>
                    <div className="text-xs text-gray-400">
                      {country.visitors.toLocaleString()} visitors
                    </div>
                  </div>
                </div>

                {/* Percentage and Bar */}
                <div className="text-right ml-4 min-w-0">
                  <div className="text-sm font-mono text-gray-300 mb-1">
                    {country.percentage}%
                  </div>
                  <div className="w-20 bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(country.visitors / maxVisitors) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className="bg-green-400 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-mono text-green-400">
                  {data.length}
                </div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-lg font-mono text-blue-400">
                  {Math.round(data.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0))}%
                </div>
                <div className="text-xs text-gray-400">Top 3</div>
              </div>
              <div>
                <div className="text-lg font-mono text-purple-400">
                  {data.find(item => item.country === 'Others')?.percentage || 0}%
                </div>
                <div className="text-xs text-gray-400">Others</div>
              </div>
            </div>
          </div>

          {/* Geographic Insights */}
          <div className="mt-4 p-3 bg-gray-700/20 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-400 mb-2">🌍 Insights:</div>
            <div className="space-y-1 text-xs text-gray-300">
              {data[0] && (
                <div>📍 {data[0].country} is your largest audience ({data[0].percentage}%)</div>
              )}
              {data.length > 5 && (
                <div>🌐 Global reach across {data.length} countries</div>
              )}
              {data.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0) > 70 && (
                <div>🎯 Traffic concentrated in top 3 regions</div>
              )}
              {data.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0) < 50 && (
                <div>🌍 Well-distributed global audience</div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default GeographicDistribution 