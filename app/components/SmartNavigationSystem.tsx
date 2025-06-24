'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRight, Home, ArrowLeft, Clock, Star, TrendingUp, Bookmark, Search, Filter } from 'lucide-react'
import Link from 'next/link'

interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface RecentlyViewed {
  title: string
  href: string
  timestamp: number
  category?: string
}

interface SmartNavigationProps {
  className?: string
  showRecentlyViewed?: boolean
  showRecommendations?: boolean
  showQuickFilters?: boolean
}

export function SmartNavigationSystem({
  className = '',
  showRecentlyViewed = true,
  showRecommendations = true,
  showQuickFilters = true
}: SmartNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): NavigationItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: NavigationItem[] = [{ label: 'Home', href: '/', icon: Home }]
    
    let currentPath = ''
    segments.forEach((segment) => {
      currentPath += `/${segment}`
      
      // Format segment label
      let label = segment.replace(/-/g, ' ')
      label = label.charAt(0).toUpperCase() + label.slice(1)
      
      // Add contextual icons
      let icon: React.ComponentType<{ className?: string }> | undefined
      if (segment === 'blog') icon = undefined
      if (segment === 'about') icon = undefined
      if (segment === 'projects') icon = undefined
      
      breadcrumbs.push({ label, href: currentPath, icon })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Mock data for quick filters
  const quickFilters = [
    { label: 'Latest', value: 'latest', icon: Clock },
    { label: 'Popular', value: 'popular', icon: TrendingUp },
    { label: 'Bookmarked', value: 'bookmarked', icon: Bookmark },
    { label: 'Featured', value: 'featured', icon: Star }
  ]

  // Load recently viewed from localStorage (in real app)
  useEffect(() => {
    const mockRecentlyViewed: RecentlyViewed[] = [
      { title: 'Building My Digital Home', href: '/blog/building-my-digital-home', timestamp: Date.now() - 3600000, category: 'Tech' },
      { title: 'AI-Driven Development Workflow', href: '/blog/ai-driven-development-workflow', timestamp: Date.now() - 7200000, category: 'AI' },
      { title: 'Deep Value Screener Launch', href: '/blog/deep-value-screener-launch', timestamp: Date.now() - 10800000, category: 'Finance' }
    ]
    setRecentlyViewed(mockRecentlyViewed)
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Breadcrumb Navigation */}
      <motion.nav 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Breadcrumb navigation"
      >
        <div className="flex items-center space-x-2">
          {/* Back Button */}
          {breadcrumbs.length > 1 && (
            <motion.button
              onClick={handleGoBack}
              className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-gray-800/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}

          {/* Breadcrumb Trail */}
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              const Icon = item.icon
              
              return (
                <motion.li
                  key={item.href}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {index > 0 && (
                    <ChevronRight className="w-3 h-3 text-gray-500 mx-2" />
                  )}
                  
                  {isLast ? (
                    <span className="flex items-center space-x-1 text-green-400 font-pixel">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors font-mono"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </motion.li>
              )
            })}
          </ol>
        </div>

        {/* Expand/Collapse Toggle */}
        {(showRecentlyViewed || showRecommendations || showQuickFilters) && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-gray-800/50 font-pixel text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isExpanded ? "Hide navigation tools" : "Show navigation tools"}
          >
            {isExpanded ? 'HIDE' : 'TOOLS'}
          </motion.button>
        )}
      </motion.nav>

      {/* Expanded Navigation Tools */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-gray-900/40 border border-green-400/20 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Quick Filters */}
              {showQuickFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-pixel text-sm text-green-400 mb-3 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Quick Filters
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickFilters.map((filter) => {
                      const Icon = filter.icon
                      const isActive = activeFilter === filter.value
                      
                      return (
                        <motion.button
                          key={filter.value}
                          onClick={() => setActiveFilter(isActive ? null : filter.value)}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-mono transition-all ${
                            isActive
                              ? 'bg-green-400/20 text-green-400 border border-green-400/40'
                              : 'bg-gray-800/50 text-gray-400 hover:text-green-400 hover:bg-gray-800/80 border border-transparent'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{filter.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Recently Viewed */}
              {showRecentlyViewed && recentlyViewed.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-pixel text-sm text-green-400 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recently Viewed
                  </h3>
                  <div className="space-y-2">
                    {recentlyViewed.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="block p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors group"
                        >
                          <div className="text-sm text-gray-300 group-hover:text-green-400 transition-colors line-clamp-1">
                            {item.title}
                          </div>
                          {item.category && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {item.category} • {Math.floor((Date.now() - item.timestamp) / 3600000)}h ago
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Content Recommendations */}
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-pixel text-sm text-green-400 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending Now
                  </h3>
                  <div className="space-y-2">
                    {[
                      { title: 'NVIDIA Strategic Assessment', href: '/blog/nvidia-strategic-assessment', category: 'Finance' },
                      { title: 'Signal to the Underground', href: '/blog/signal-to-the-underground', category: 'Tech' },
                      { title: 'Summit AI Study Copilot', href: '/blog/summit-ai-study-copilot', category: 'AI' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="block p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors group"
                        >
                          <div className="text-sm text-gray-300 group-hover:text-green-400 transition-colors line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-mono flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {item.category} • Popular
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <motion.div
              className="mt-6 pt-4 border-t border-green-400/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg text-sm text-gray-400 hover:text-green-400 transition-colors font-mono"
                >
                  <Search className="w-4 h-4" />
                  <span>Advanced Search</span>
                </Link>
                
                <button
                  onClick={() => setActiveFilter('bookmarked')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg text-sm text-gray-400 hover:text-green-400 transition-colors font-mono"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>My Bookmarks</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Context Indicator */}
      {pathname !== '/' && (
        <motion.div
          className="text-xs text-gray-500 font-mono flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>You are here:</span>
          <span className="text-green-400">{breadcrumbs[breadcrumbs.length - 1]?.label}</span>
          {activeFilter && (
            <>
              <span>•</span>
              <span className="text-yellow-400">Filtered by {activeFilter}</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default SmartNavigationSystem