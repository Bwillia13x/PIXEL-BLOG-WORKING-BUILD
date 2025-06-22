'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  BugAntIcon,
  GlobeAltIcon,
  ServerIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { getErrorHandler, ErrorInfo, ErrorSeverity, ErrorType } from '@/app/lib/errorHandling'

interface ErrorStats {
  total: number
  recent: number
  bySeverity: Record<ErrorSeverity, number>
  byType: Record<ErrorType, number>
  sessionId: string
}

function SeverityIcon({ severity }: { severity: ErrorSeverity }) {
  switch (severity) {
    case 'critical':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    case 'high':
      return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
    case 'medium':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
    case 'low':
      return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />
    default:
      return <BugAntIcon className="w-5 h-5 text-gray-500" />
  }
}

function TypeIcon({ type }: { type: ErrorType }) {
  switch (type) {
    case 'network':
      return <GlobeAltIcon className="w-4 h-4" />
    case 'api':
      return <ServerIcon className="w-4 h-4" />
    case 'javascript':
      return <BugAntIcon className="w-4 h-4" />
    default:
      return <ExclamationTriangleIcon className="w-4 h-4" />
  }
}

function ErrorCard({ error, onToggleDetails }: { 
  error: ErrorInfo 
  onToggleDetails: (errorId: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  const severityColors = {
    critical: 'border-red-500/50 bg-red-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${severityColors[error.severity]} transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <SeverityIcon severity={error.severity} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon type={error.type} />
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              {error.type}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">
              {formatTime(error.timestamp)}
            </span>
            {!error.handled && (
              <span className="px-2 py-0.5 text-xs bg-red-600/20 text-red-400 rounded-full">
                Unhandled
              </span>
            )}
          </div>
          
          <h3 className="text-white font-medium mb-2 line-clamp-2">
            {error.message}
          </h3>
          
          {error.url && (
            <p className="text-sm text-gray-400 mb-2 truncate">
              URL: {error.url}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>ID: {error.id.slice(-8)}</span>
            <span>Session: {error.sessionId?.slice(-8)}</span>
            {error.source && <span>Source: {error.source}</span>}
          </div>
        </div>
        
        <button
          onClick={() => {
            setShowDetails(!showDetails)
            onToggleDetails(error.id)
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-600"
          >
            {error.stack && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Stack Trace:</h4>
                <pre className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded overflow-x-auto">
                  {error.stack}
                </pre>
              </div>
            )}
            
            {error.context && Object.keys(error.context).length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Context:</h4>
                <pre className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(error.context, null, 2)}
                </pre>
              </div>
            )}
            
            {error.userAgent && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">User Agent:</h4>
                <p className="text-xs text-gray-400 break-all">
                  {error.userAgent}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'text-cyan-400' 
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-400 text-sm">{title}</p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorMonitoring() {
  const [errors, setErrors] = useState<ErrorInfo[]>([])
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<{
    severity?: ErrorSeverity
    type?: ErrorType
    handled?: boolean
  }>({})

  const errorHandler = getErrorHandler()

  const refreshData = () => {
    setIsLoading(true)
    try {
      const recentErrors = errorHandler.getRecentErrors(50)
      const errorStats = errorHandler.getErrorStats()
      
      setErrors(recentErrors)
      setStats(errorStats)
    } catch (error) {
      console.error('Failed to refresh error data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllErrors = () => {
    if (confirm('Are you sure you want to clear all error data? This action cannot be undone.')) {
      errorHandler.clearErrors()
      refreshData()
    }
  }

  // Auto-refresh data
  useEffect(() => {
    refreshData()
    
    const interval = setInterval(refreshData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Filter errors
  const filteredErrors = errors.filter(error => {
    if (filter.severity && error.severity !== filter.severity) return false
    if (filter.type && error.type !== filter.type) return false
    if (filter.handled !== undefined && error.handled !== filter.handled) return false
    return true
  })

  const handleToggleDetails = (errorId: string) => {
    // This could be used to mark errors as viewed or update their status
    console.log('Toggled details for error:', errorId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BugAntIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Error Monitoring</h1>
            <p className="text-gray-400">Real-time error tracking and analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={clearAllErrors}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Errors"
            value={stats.total}
            icon={BugAntIcon}
            color="text-red-400"
          />
          <StatCard
            title="Recent Errors"
            value={stats.recent}
            icon={ClockIcon}
            color="text-orange-400"
          />
          <StatCard
            title="Critical Issues"
            value={stats.bySeverity.critical + stats.bySeverity.high}
            icon={ExclamationTriangleIcon}
            color="text-red-500"
          />
          <StatCard
            title="Network Errors"
            value={stats.byType.network + stats.byType.api}
            icon={GlobeAltIcon}
            color="text-blue-400"
          />
        </div>
      )}

      {/* Error Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Errors by Severity</h2>
            <div className="space-y-3">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SeverityIcon severity={severity as ErrorSeverity} />
                    <span className="text-gray-300 capitalize">{severity}</span>
                  </div>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Errors by Type</h2>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TypeIcon type={type as ErrorType} />
                    <span className="text-gray-300 capitalize">{type}</span>
                  </div>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-4">
        <div className="flex items-center gap-4">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300 font-medium">Filters:</span>
          
          <select
            value={filter.severity || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              severity: e.target.value as ErrorSeverity || undefined 
            }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filter.type || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              type: e.target.value as ErrorType || undefined 
            }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            <option value="">All Types</option>
            <option value="javascript">JavaScript</option>
            <option value="network">Network</option>
            <option value="api">API</option>
            <option value="performance">Performance</option>
            <option value="memory">Memory</option>
          </select>

          <select
            value={filter.handled !== undefined ? String(filter.handled) : ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              handled: e.target.value === '' ? undefined : e.target.value === 'true'
            }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            <option value="">All Errors</option>
            <option value="true">Handled</option>
            <option value="false">Unhandled</option>
          </select>

          {(filter.severity || filter.type || filter.handled !== undefined) && (
            <button
              onClick={() => setFilter({})}
              className="px-3 py-1 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Errors ({filteredErrors.length})
          </h2>
        </div>

        {isLoading && filteredErrors.length === 0 ? (
          <div className="text-center py-8">
            <ArrowPathIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-400">Loading errors...</p>
          </div>
        ) : filteredErrors.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredErrors.map((error) => (
                <ErrorCard
                  key={error.id}
                  error={error}
                  onToggleDetails={handleToggleDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-cyan-500/20">
            <BugAntIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No errors found
            </h3>
            <p className="text-gray-500">
              {Object.keys(filter).length > 0 
                ? 'Try adjusting your filters' 
                : 'Everything is running smoothly!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Session Info */}
      {stats && (
        <div className="text-center text-gray-500 text-sm">
          Session ID: {stats.sessionId} • Auto-refresh: 10s
        </div>
      )}
    </div>
  )
}