'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  StarIcon, 
  EyeIcon, 
  CodeBracketIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { 
  GitHubStats as GitHubStatsType, 
  GitHubError, 
  useGitHubStats, 
  formatNumber, 
  formatBytes, 
  getLanguageColor, 
  formatRelativeTime 
} from '@/app/utils/github'

interface GitHubStatsProps {
  githubUrl?: string
  compact?: boolean
  showLanguages?: boolean
  showCommits?: boolean
  className?: string
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color?: string
  delay?: number
}

function StatItem({ icon: Icon, label, value, color = 'text-gray-400', delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center space-x-2"
    >
      <Icon className={`h-4 w-4 ${color}`} />
      <div className="text-xs font-mono">
        <div className="text-white font-semibold">{value}</div>
        <div className="text-gray-400">{label}</div>
      </div>
    </motion.div>
  )
}

interface LanguageBarProps {
  languages: Record<string, number>
  total: number
}

function LanguageBar({ languages, total }: LanguageBarProps) {
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Show top 5 languages

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">Languages</span>
        <span className="text-xs font-mono text-gray-500">{formatBytes(total)}</span>
      </div>
      
      {/* Language Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className="flex h-full">
          {sortedLanguages.map(([language, bytes], index) => {
            const percentage = (bytes / total) * 100
            return (
              <motion.div
                key={language}
                className="h-full"
                style={{ 
                  backgroundColor: getLanguageColor(language),
                  width: `${percentage}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            )
          })}
        </div>
      </div>

      {/* Language List */}
      <div className="space-y-1">
        {sortedLanguages.map(([language, bytes], index) => {
          const percentage = ((bytes / total) * 100).toFixed(1)
          return (
            <motion.div
              key={language}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(language) }}
                />
                <span className="font-mono text-gray-300">{language}</span>
              </div>
              <span className="font-mono text-gray-500">{percentage}%</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface CommitListProps {
  commits: GitHubStatsType['commits']
}

function CommitList({ commits }: CommitListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <ClockIcon className="h-4 w-4 text-gray-400" />
        <span className="text-xs font-mono text-gray-400">Recent Commits</span>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {commits.slice(0, 3).map((commit, index) => (
          <motion.a
            key={commit.sha}
            href={commit.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="block p-2 pixel-border bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div className="text-xs">
              <div className="text-white font-mono truncate mb-1">
                {commit.commit.message.split('\n')[0]}
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{commit.commit.author.name}</span>
                <span>{formatRelativeTime(commit.commit.author.date)}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

function LoadingState({ compact }: { compact: boolean }) {
  return (
    <div className={`pixel-border bg-gray-900/60 backdrop-blur-sm ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-400">Loading GitHub stats...</span>
      </div>
      
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-3 bg-gray-700 rounded w-full mb-1" />
            <div className="h-2 bg-gray-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ 
  error, 
  onRetry, 
  compact 
}: { 
  error: GitHubError
  onRetry: () => void
  compact: boolean 
}) {
  return (
    <div className={`pixel-border bg-red-500/10 border-red-500/50 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center space-x-2 mb-2">
        <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
        <span className="text-xs font-mono text-red-400">GitHub Stats Error</span>
      </div>
      
      <p className="text-xs text-gray-400 font-mono mb-3">
        {error.message}
      </p>
      
      {error.rateLimitRemaining !== undefined && error.rateLimitRemaining === 0 && (
        <p className="text-xs text-yellow-400 font-mono mb-3">
          Rate limit exceeded. Try again later.
        </p>
      )}
      
      <button
        onClick={onRetry}
        className="
          flex items-center space-x-1 px-2 py-1 pixel-border 
          bg-red-500/20 text-red-400 border-red-500/50 
          hover:bg-red-500/30 transition-all duration-200 font-mono text-xs
        "
      >
        <ArrowPathIcon className="h-3 w-3" />
        <span>Retry</span>
      </button>
    </div>
  )
}

export default function GitHubStats({
  githubUrl,
  compact = false,
  showLanguages = true,
  showCommits = true,
  className = ""
}: GitHubStatsProps) {
  const { stats, error, loading, refetch } = useGitHubStats(githubUrl)

  if (!githubUrl) {
    return null
  }

  if (loading) {
    return <LoadingState compact={compact} />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} compact={compact} />
  }

  if (!stats) {
    return null
  }

  const totalLanguageBytes = Object.values(stats.languages).reduce((sum, bytes) => sum + bytes, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`pixel-border bg-gray-900/60 backdrop-blur-sm ${compact ? 'p-3' : 'p-4'} space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CodeBracketIcon className="h-4 w-4 text-green-400" />
          <a
            href={stats.repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-green-400 hover:text-green-300 transition-colors duration-200"
          >
            {stats.repo.name}
          </a>
        </div>
        
        <div className="text-xs text-gray-500 font-mono">
          Updated {formatRelativeTime(stats.repo.updated_at)}
        </div>
      </div>

      {/* Description */}
      {!compact && stats.repo.description && (
        <p className="text-xs text-gray-300 leading-relaxed">
          {stats.repo.description}
        </p>
      )}

      {/* Main Stats */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        <StatItem
          icon={StarIcon}
          label="Stars"
          value={formatNumber(stats.repo.stargazers_count)}
          color="text-yellow-400"
          delay={0.1}
        />
        
        <StatItem
          icon={CodeBracketIcon}
          label="Forks"
          value={formatNumber(stats.repo.forks_count)}
          color="text-blue-400"
          delay={0.2}
        />
        
        {!compact && (
          <>
            <StatItem
              icon={EyeIcon}
              label="Watchers"
              value={formatNumber(stats.repo.watchers_count)}
              color="text-green-400"
              delay={0.3}
            />
            
            <StatItem
              icon={ExclamationTriangleIcon}
              label="Issues"
              value={formatNumber(stats.repo.open_issues_count)}
              color="text-red-400"
              delay={0.4}
            />
          </>
        )}
      </div>

      {/* Secondary Stats */}
      {!compact && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
          <StatItem
            icon={ChartBarIcon}
            label="Size"
            value={formatBytes(stats.repo.size * 1024)}
            color="text-purple-400"
            delay={0.5}
          />
          
          <StatItem
            icon={UsersIcon}
            label="Contributors"
            value={formatNumber(stats.contributors)}
            color="text-cyan-400"
            delay={0.6}
          />
        </div>
      )}

      {/* Languages */}
      {showLanguages && totalLanguageBytes > 0 && !compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="pt-2 border-t border-gray-700"
        >
          <LanguageBar languages={stats.languages} total={totalLanguageBytes} />
        </motion.div>
      )}

      {/* Recent Commits */}
      {showCommits && stats.commits.length > 0 && !compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="pt-2 border-t border-gray-700"
        >
          <CommitList commits={stats.commits} />
        </motion.div>
      )}

      {/* Topics/Tags */}
      {stats.repo.topics && stats.repo.topics.length > 0 && !compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="pt-2 border-t border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-mono text-gray-400">Topics</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {stats.repo.topics.slice(0, 5).map((topic, index) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 pixel-border border-blue-500/50 text-xs font-mono"
              >
                {topic}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={refetch}
          className="
            flex items-center space-x-1 px-2 py-1 pixel-border 
            bg-gray-500/20 text-gray-400 border-gray-500/50 
            hover:bg-gray-500/30 hover:text-white transition-all duration-200 font-mono text-xs
          "
          title="Refresh GitHub stats"
        >
          <ArrowPathIcon className="h-3 w-3" />
          <span>Refresh</span>
        </button>
      </div>
    </motion.div>
  )
}