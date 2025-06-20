"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface SearchQuery {
  query: string
  count: number
  ctr: number
}

interface NoResultQuery {
  query: string
  count: number
}

interface SearchData {
  totalSearches: number
  topQueries: SearchQuery[]
  noResultsQueries: NoResultQuery[]
  searchSuccessRate: number
}

interface SearchAnalyticsProps {
  data?: SearchData
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-green-400/30">
        <h3 className="text-green-400 font-mono text-lg mb-4">Search Analytics</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">🔍</div>
          <p className="text-gray-400 font-mono text-sm">
            No search data available
          </p>
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...data.topQueries.map(q => q.count))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 font-mono text-lg">Search Analytics</h3>
        <div className="text-xs text-gray-400 font-mono">
          {data.totalSearches.toLocaleString()} searches
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-green-400 mb-1">
            {data.totalSearches.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Searches</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-blue-400 mb-1">
            {data.searchSuccessRate}%
          </div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </div>
      </div>

      {/* Top Search Queries */}
      <div className="mb-6">
        <h4 className="text-gray-400 text-sm font-mono mb-3 flex items-center">
          <span className="mr-2">🔥</span>
          Top Search Queries
        </h4>
        <div className="space-y-3">
          {data.topQueries.map((query, index) => (
            <motion.div
              key={query.query}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-green-400 truncate">
                    "{query.query}"
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-mono text-gray-300">
                    {query.count} searches
                  </div>
                  <div className="text-xs text-gray-400">
                    {query.ctr}% CTR
                  </div>
                </div>
              </div>
              
              {/* Search Volume Bar */}
              <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(query.count / maxCount) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className="bg-green-400 h-2 rounded-full"
                />
              </div>
              
              {/* CTR Bar */}
              <div className="w-full bg-gray-600 rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${query.ctr}%` }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                  className={`h-1 rounded-full ${
                    query.ctr > 80 ? 'bg-green-400' : 
                    query.ctr > 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* No Results Queries */}
      {data.noResultsQueries.length > 0 && (
        <div className="mb-6">
          <h4 className="text-gray-400 text-sm font-mono mb-3 flex items-center">
            <span className="mr-2">❌</span>
            No Results Queries
          </h4>
          <div className="space-y-2">
            {data.noResultsQueries.map((query, index) => (
              <motion.div
                key={query.query}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 bg-red-900/20 border border-red-500/30 rounded"
              >
                <div className="text-sm font-mono text-red-400">
                  "{query.query}"
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {query.count} searches
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono">
            💡 Consider creating content for these topics
          </div>
        </div>
      )}

      {/* Search Performance */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-gray-400 text-sm font-mono mb-3">Performance</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Success Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-600 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.searchSuccessRate}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${
                    data.searchSuccessRate > 85 ? 'bg-green-400' : 
                    data.searchSuccessRate > 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
              <span className="text-sm font-mono text-green-400">
                {data.searchSuccessRate}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Failed Searches</span>
            <span className="text-sm font-mono text-red-400">
              {100 - data.searchSuccessRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Search Insights */}
      <div className="mt-4 p-3 bg-gray-700/20 rounded border border-gray-600">
        <div className="text-xs font-mono text-gray-400 mb-2">🔍 Insights:</div>
        <div className="space-y-1 text-xs text-gray-300">
          {data.searchSuccessRate > 85 && (
            <div>✓ Excellent search experience</div>
          )}
          {data.searchSuccessRate < 70 && (
            <div>⚠️ Search functionality needs improvement</div>
          )}
          {data.topQueries[0] && (
            <div>📈 "{data.topQueries[0].query}" is your most searched term</div>
          )}
          {data.noResultsQueries.length > 0 && (
            <div>📝 {data.noResultsQueries.length} content opportunities identified</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SearchAnalytics 