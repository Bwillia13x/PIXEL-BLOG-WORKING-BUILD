"use client"

import { useState, useEffect, useCallback } from 'react'
import { getAnalytics } from '../utils/analytics'

interface AnalyticsData {
  // Overview metrics
  totalVisitors: number
  totalPageViews: number
  avgSessionDuration: string
  bounceRate: number
  visitorChange: number
  pageViewChange: number
  sessionDurationChange: number
  bounceRateChange: number
  
  // Real-time data
  realTimeVisitors: Array<{
    time: string
    count: number
    pages: Array<{ path: string; visitors: number }>
  }>
  
  // Traffic data
  trafficData: Array<{
    name: string
    value: number
    date: string
  }>
  
  // Content metrics
  popularPosts: Array<{
    title: string
    path: string
    views: number
    timeOnPage: number
    bounceRate: number
    readingProgress: number
  }>
  
  contentPerformance: Array<{
    name: string
    value: number
    engagement: number
  }>
  
  readingTimeData: Array<{
    name: string
    value: number
  }>
  
  // Engagement metrics
  engagement: {
    averageTimeOnPage: string
    scrollDepth: number
    clickThroughRate: number
    shareRate: number
    commentRate: number
  }
  
  // Geographic data
  geographic: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  
  // Device analytics
  devices: {
    desktop: number
    mobile: number
    tablet: number
    browsers: Array<{ name: string; percentage: number }>
    operatingSystems: Array<{ name: string; percentage: number }>
  }
  
  // Visitor types
  visitorTypes: Array<{
    name: string
    value: number
  }>
  
  // Traffic sources
  trafficSources: Array<{
    name: string
    value: number
  }>
  
  // Performance metrics
  performance: {
    averageLoadTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
    firstInputDelay: number
  }
  
  loadTimes: Array<{
    name: string
    value: number
  }>
  
  webVitals: Array<{
    name: string
    value: number
    threshold: number
  }>
  
  performanceScore: number
  
  // Search analytics
  search: {
    totalSearches: number
    topQueries: Array<{ query: string; count: number; ctr: number }>
    noResultsQueries: Array<{ query: string; count: number }>
    searchSuccessRate: number
  }
  
  searchTrends: Array<{
    name: string
    value: number
  }>
}

export function useAnalyticsData(
  dateRange: '24h' | '7d' | '30d' | '90d' = '7d',
  autoRefresh: boolean = true
) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Generate realistic demo data
  const generateDemoData = useCallback((): AnalyticsData => {
    const now = new Date()
    const daysBack = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
    
    // Helper function to generate trending data
    const generateTrendingData = (baseValue: number, points: number) => {
      return Array.from({ length: points }, (_, i) => {
        const date = new Date(now.getTime() - (points - i - 1) * 24 * 60 * 60 * 1000)
        const trend = Math.sin(i / points * Math.PI * 2) * 0.3 + 1
        const randomVariation = 0.8 + Math.random() * 0.4
        return {
          name: date.toLocaleDateString(),
          value: Math.round(baseValue * trend * randomVariation),
          date: date.toISOString()
        }
      })
    }

    return {
      totalVisitors: 12847 + Math.floor(Math.random() * 1000),
      totalPageViews: 34521 + Math.floor(Math.random() * 2000),
      avgSessionDuration: '3m 42s',
      bounceRate: 23 + Math.floor(Math.random() * 10),
      visitorChange: 12.5 + Math.random() * 10,
      pageViewChange: 8.3 + Math.random() * 8,
      sessionDurationChange: 15.2 + Math.random() * 5,
      bounceRateChange: -4.1 + Math.random() * 3,

      realTimeVisitors: Array.from({ length: 12 }, (_, i) => ({
        time: new Date(now.getTime() - i * 5 * 60 * 1000).toLocaleTimeString(),
        count: 15 + Math.floor(Math.random() * 25),
        pages: [
          { path: '/blog/financial-data-apis-comprehensive-guide', visitors: 8 + Math.floor(Math.random() * 5) },
          { path: '/projects/deep-value-screener', visitors: 6 + Math.floor(Math.random() * 4) },
          { path: '/blog/earnings-power-value-engine', visitors: 4 + Math.floor(Math.random() * 3) },
          { path: '/', visitors: 3 + Math.floor(Math.random() * 2) }
        ]
      })).reverse(),

      trafficData: generateTrendingData(500, daysBack),

      popularPosts: [
        {
          title: 'Financial Data APIs: Comprehensive Guide',
          path: '/blog/financial-data-apis-comprehensive-guide',
          views: 2847,
          timeOnPage: 4.2,
          bounceRate: 18,
          readingProgress: 78
        },
        {
          title: 'Deep Value Screener Launch',
          path: '/blog/deep-value-screener-launch',
          views: 1932,
          timeOnPage: 3.8,
          bounceRate: 22,
          readingProgress: 65
        },
        {
          title: 'Earnings Power Value Engine',
          path: '/blog/earnings-power-value-engine',
          views: 1644,
          timeOnPage: 5.1,
          bounceRate: 15,
          readingProgress: 82
        },
        {
          title: 'Portfolio Stress Testing Dashboard',
          path: '/blog/portfolio-stress-testing-dashboard-launch',
          views: 1298,
          timeOnPage: 3.2,
          bounceRate: 28,
          readingProgress: 58
        },
        {
          title: 'NVIDIA Strategic Assessment',
          path: '/blog/nvidia-strategic-assessment',
          views: 987,
          timeOnPage: 6.4,
          bounceRate: 12,
          readingProgress: 89
        }
      ],

      contentPerformance: [
        { name: 'Blog Posts', value: 15420, engagement: 78 },
        { name: 'Project Pages', value: 8934, engagement: 65 },
        { name: 'About Page', value: 3421, engagement: 45 },
        { name: 'Contact Page', value: 1876, engagement: 38 }
      ],

      readingTimeData: [
        { name: '0-1 min', value: 23 },
        { name: '1-3 min', value: 45 },
        { name: '3-5 min', value: 32 },
        { name: '5+ min', value: 28 }
      ],

      engagement: {
        averageTimeOnPage: '4m 18s',
        scrollDepth: 72,
        clickThroughRate: 5.8,
        shareRate: 3.2,
        commentRate: 1.4
      },

      geographic: [
        { country: 'United States', visitors: 4523, percentage: 35.2 },
        { country: 'Canada', visitors: 2341, percentage: 18.2 },
        { country: 'United Kingdom', visitors: 1876, percentage: 14.6 },
        { country: 'Germany', visitors: 1234, percentage: 9.6 },
        { country: 'Australia', visitors: 987, percentage: 7.7 },
        { country: 'Others', visitors: 1886, percentage: 14.7 }
      ],

      devices: {
        desktop: 56,
        mobile: 38,
        tablet: 6,
        browsers: [
          { name: 'Chrome', percentage: 68 },
          { name: 'Safari', percentage: 18 },
          { name: 'Firefox', percentage: 8 },
          { name: 'Edge', percentage: 4 },
          { name: 'Other', percentage: 2 }
        ],
        operatingSystems: [
          { name: 'Windows', percentage: 45 },
          { name: 'macOS', percentage: 32 },
          { name: 'iOS', percentage: 12 },
          { name: 'Android', percentage: 8 },
          { name: 'Linux', percentage: 3 }
        ]
      },

      visitorTypes: [
        { name: 'Returning', value: 62 },
        { name: 'New', value: 38 }
      ],

      trafficSources: [
        { name: 'Organic Search', value: 4234 },
        { name: 'Direct', value: 3421 },
        { name: 'Social Media', value: 2156 },
        { name: 'Referral', value: 1876 },
        { name: 'Email', value: 1160 }
      ],

      performance: {
        averageLoadTime: 1.2,
        firstContentfulPaint: 0.8,
        largestContentfulPaint: 1.9,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 12
      },

      loadTimes: generateTrendingData(1200, Math.min(daysBack, 30)),

      webVitals: [
        { name: 'FCP', value: 0.8, threshold: 1.8 },
        { name: 'LCP', value: 1.9, threshold: 2.5 },
        { name: 'FID', value: 12, threshold: 100 },
        { name: 'CLS', value: 0.05, threshold: 0.1 }
      ],

      performanceScore: 94,

      search: {
        totalSearches: 3421,
        topQueries: [
          { query: 'financial data api', count: 234, ctr: 78 },
          { query: 'value investing', count: 189, ctr: 82 },
          { query: 'portfolio analysis', count: 156, ctr: 65 },
          { query: 'earnings power value', count: 134, ctr: 89 },
          { query: 'deep value screening', count: 98, ctr: 72 }
        ],
        noResultsQueries: [
          { query: 'crypto trading', count: 23 },
          { query: 'day trading tips', count: 18 },
          { query: 'forex analysis', count: 12 }
        ],
        searchSuccessRate: 87
      },

      searchTrends: generateTrendingData(150, Math.min(daysBack, 30))
    }
  }, [dateRange])

  // Fetch real analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to get real analytics data first
      const analyticsInstance = getAnalytics()
      let realData = null

      if (analyticsInstance) {
        // Get real data from the analytics system
        const allPosts = analyticsInstance.getAllPostAnalytics()
        const totalStats = analyticsInstance.getTotalStats()

        if (allPosts.length > 0) {
          realData = {
            ...generateDemoData(),
            totalVisitors: totalStats.totalViews, // Using totalViews as visitor count
            totalPageViews: totalStats.totalViews,
            popularPosts: allPosts.slice(0, 5).map(post => ({
              title: post.title,
              path: post.postId,
              views: post.views,
              timeOnPage: post.timeOnPage / 60, // Convert to minutes
              bounceRate: Math.round((1 - post.readingProgress / 100) * 100),
              readingProgress: post.readingProgress
            }))
          }
        }
      }

      // Use real data if available, otherwise use demo data
      const analyticsData = realData || generateDemoData()

      setData(analyticsData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError('Failed to load analytics data')
      // Fallback to demo data
      setData(generateDemoData())
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [generateDemoData])

  const refreshData = useCallback(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchAnalyticsData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, fetchAnalyticsData])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData
  }
} 