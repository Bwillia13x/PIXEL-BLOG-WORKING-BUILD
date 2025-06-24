export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  license: {
    key: string
    name: string
  } | null
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
    url: string
  }
  html_url: string
}

export interface GitHubLanguage {
  [language: string]: number
}

export interface GitHubStats {
  repo: GitHubRepo
  commits: GitHubCommit[]
  languages: GitHubLanguage
  contributors: number
  lastCommit: string
  activity: {
    commits: number
    additions: number
    deletions: number
  }
}

export interface GitHubError {
  message: string
  status: number
  rateLimitRemaining?: number
  rateLimitReset?: number
}

class GitHubAPI {
  private baseUrl = 'https://api.github.com'
  private token?: string
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor(token?: string) {
    this.token = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  }

  private async request<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint
    const cached = this.cache.get(cacheKey)
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Pixel-Wisdom-Portfolio'
    }

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { headers })
      
      if (!response.ok) {
        const error: GitHubError = {
          message: `GitHub API error: ${response.statusText}`,
          status: response.status,
          rateLimitRemaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
          rateLimitReset: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
        }
        throw error
      }

      const data = await response.json()
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0
        } as GitHubError
      }
      throw error
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    return this.request<GitHubRepo>(`/repos/${owner}/${repo}`)
  }

  async getCommits(owner: string, repo: string, limit: number = 10): Promise<GitHubCommit[]> {
    return this.request<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=${limit}`)
  }

  async getLanguages(owner: string, repo: string): Promise<GitHubLanguage> {
    return this.request<GitHubLanguage>(`/repos/${owner}/${repo}/languages`)
  }

  async getContributors(owner: string, repo: string): Promise<any[]> {
    return this.request<any[]>(`/repos/${owner}/${repo}/contributors`)
  }

  async getRepoStats(owner: string, repo: string): Promise<GitHubStats> {
    try {
      const [repoData, commits, languages, contributors] = await Promise.all([
        this.getRepository(owner, repo),
        this.getCommits(owner, repo, 5),
        this.getLanguages(owner, repo),
        this.getContributors(owner, repo)
      ])

      return {
        repo: repoData,
        commits,
        languages,
        contributors: contributors.length,
        lastCommit: commits[0]?.commit.author.date || repoData.pushed_at,
        activity: {
          commits: commits.length,
          additions: 0, // Would need additional API calls for detailed stats
          deletions: 0
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Extract owner/repo from GitHub URL
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, '')
      }
    }
    return null
  }

  // Get multiple repositories stats
  async getMultipleRepoStats(urls: string[]): Promise<Map<string, GitHubStats | GitHubError>> {
    const results = new Map<string, GitHubStats | GitHubError>()
    
    const promises = urls.map(async (url) => {
      const parsed = this.parseGitHubUrl(url)
      if (!parsed) {
        results.set(url, {
          message: 'Invalid GitHub URL',
          status: 400
        })
        return
      }

      try {
        const stats = await this.getRepoStats(parsed.owner, parsed.repo)
        results.set(url, stats)
      } catch (error) {
        results.set(url, error as GitHubError)
      }
    })

    await Promise.allSettled(promises)
    return results
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache info
  getCacheInfo() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Utility functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'SCSS': '#c6538c',
    'Vue': '#4FC08D',
    'Shell': '#89e051',
    'Dockerfile': '#384d54',
    'YAML': '#cb171e',
    'JSON': '#292929',
    'Markdown': '#083fa1'
  }
  
  return colors[language] || '#666666'
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}y ago`
}

// Singleton instance
export const githubAPI = new GitHubAPI()

// Export the hook properly
import React, { useState, useEffect } from 'react'

// React hook for using GitHub data
export function useGitHubStats(githubUrl: string | undefined) {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [error, setError] = useState<GitHubError | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = React.useCallback(async () => {
    if (!githubUrl) return

    setLoading(true)
    setError(null)

    try {
      const parsed = githubAPI.parseGitHubUrl(githubUrl)
      if (!parsed) {
        throw new Error('Invalid GitHub URL')
      }

      const repoStats = await githubAPI.getRepoStats(parsed.owner, parsed.repo)
      setStats(repoStats)
    } catch (err) {
      setError(err as GitHubError)
    } finally {
      setLoading(false)
    }
  }, [githubUrl])

  // Fetch on mount and when URL changes
  React.useEffect(() => {
    fetchStats()
  }, [githubUrl, fetchStats])

  return { stats, error, loading, refetch: fetchStats }
}

export { GitHubAPI, githubAPI as default }