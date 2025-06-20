"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelChart from './PixelChart'
import RealTimeVisitors from './RealTimeVisitors'
import PopularContent from './PopularContent'
import EngagementMetrics from './EngagementMetrics'
import GeographicDistribution from './GeographicDistribution'
import DeviceAnalytics from './DeviceAnalytics'
import SearchAnalytics from './SearchAnalytics'
import PerformanceMetrics from './PerformanceMetrics'
import { useAnalyticsData } from '../hooks/useAnalyticsData'

type DashboardTab = 'overview' | 'content' | 'audience' | 'performance' | 'search'

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [autoRefresh, setAutoRefresh] = useState(true)
  
  const { 
    isLoading, 
    error, 
    data, 
    refreshData,
    lastUpdated 
  } = useAnalyticsData(dateRange, autoRefresh)

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'content', label: '📝 Content', icon: '📝' },
    { id: 'audience', label: '👥 Audience', icon: '👥' },
    { id: 'performance', label: '⚡ Performance', icon: '⚡' },
    { id: 'search', label: '🔍 Search', icon: '🔍' }
  ]

  const dateRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Analytics</div>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-red-600/20 border border-red-400 text-red-400 rounded hover:bg-red-600/30 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Status */}
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
              className="text-2xl"
            >
              📈
            </motion.div>
            <div>
              <h1 className="text-2xl font-mono font-bold text-green-400">
                Analytics Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                {lastUpdated && (
                  <>Last updated: {new Date(lastUpdated).toLocaleString()}</>
                )}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm font-mono"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded text-sm font-mono border transition-colors ${
                autoRefresh
                  ? 'bg-green-600/20 border-green-400 text-green-400'
                  : 'bg-gray-700 border-gray-600 text-gray-400'
              }`}
            >
              {autoRefresh ? '🔄 Live' : '⏸️ Paused'}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-600/20 border border-blue-400 text-blue-400 rounded hover:bg-blue-600/30 transition-colors text-sm font-mono disabled:opacity-50"
            >
              {isLoading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg border border-green-400/30 overflow-x-auto"
      >
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`flex-1 min-w-max px-6 py-4 font-mono text-sm border-r border-gray-600 last:border-r-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-green-400/10 text-green-400 border-b-2 border-b-green-400'
                  : 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Key Metrics Cards */}
              <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Visitors"
                  value={data?.totalVisitors?.toLocaleString() || '0'}
                  change={data?.visitorChange || 0}
                  icon="👥"
                />
                <MetricCard
                  title="Page Views"
                  value={data?.totalPageViews?.toLocaleString() || '0'}
                  change={data?.pageViewChange || 0}
                  icon="📄"
                />
                <MetricCard
                  title="Avg. Session Duration"
                  value={data?.avgSessionDuration || '0m'}
                  change={data?.sessionDurationChange || 0}
                  icon="⏱️"
                />
                <MetricCard
                  title="Bounce Rate"
                  value={`${data?.bounceRate || 0}%`}
                  change={data?.bounceRateChange || 0}
                  icon="📊"
                  reverseColor
                />
              </div>

              {/* Real-time Visitors */}
              <div className="lg:col-span-1">
                <RealTimeVisitors data={data?.realTimeVisitors} />
              </div>

              {/* Traffic Chart */}
              <div className="lg:col-span-1">
                <PixelChart
                  title="Traffic Overview"
                  data={data?.trafficData || []}
                  type="line"
                  height={300}
                />
              </div>

              {/* Popular Content */}
              <div className="lg:col-span-1">
                <PopularContent data={data?.popularPosts} />
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PopularContent data={data?.popularPosts} showDetailed />
              <PixelChart
                title="Content Performance"
                data={data?.contentPerformance || []}
                type="bar"
                height={400}
              />
              <EngagementMetrics data={data?.engagement} />
              <PixelChart
                title="Reading Time Distribution"
                data={data?.readingTimeData || []}
                type="pie"
                height={300}
              />
            </div>
          )}

          {/* Audience Tab */}
          {activeTab === 'audience' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeographicDistribution data={data?.geographic} />
              <DeviceAnalytics data={data?.devices} />
              <PixelChart
                title="New vs Returning Visitors"
                data={data?.visitorTypes || []}
                type="pie"
                height={300}
              />
              <PixelChart
                title="Traffic Sources"
                data={data?.trafficSources || []}
                type="bar"
                height={300}
              />
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceMetrics data={data?.performance} />
              <PixelChart
                title="Page Load Times"
                data={data?.loadTimes || []}
                type="line"
                height={300}
              />
              <PixelChart
                title="Core Web Vitals"
                data={data?.webVitals || []}
                type="bar"
                height={300}
              />
              <div className="bg-gray-800 rounded-lg p-6 border border-green-400/30">
                <h3 className="text-green-400 font-mono mb-4">Performance Score</h3>
                <div className="text-center">
                  <div className="text-4xl font-mono text-green-400 mb-2">
                    {data?.performanceScore || 0}/100
                  </div>
                  <p className="text-gray-400 text-sm">Overall Performance</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SearchAnalytics data={data?.search} />
              <PixelChart
                title="Search Trends"
                data={data?.searchTrends || []}
                type="line"
                height={300}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-green-400">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-green-400 font-mono">Loading analytics data...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: string
  reverseColor?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  reverseColor = false 
}) => {
  const isPositive = change > 0
  const changeColor = reverseColor 
    ? (isPositive ? 'text-red-400' : 'text-green-400')
    : (isPositive ? 'text-green-400' : 'text-red-400')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 border border-green-400/30"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-mono">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-mono text-green-400 mb-1">{value}</div>
      <div className="flex items-center space-x-1">
        <span className={`text-xs font-mono ${changeColor}`}>
          {isPositive ? '↗' : '↘'} {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-xs">vs last period</span>
      </div>
    </motion.div>
  )
}

export default AnalyticsDashboard 