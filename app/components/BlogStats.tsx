'use client'

interface Post {
  id: string
  slug: string
  title: string
  category: string
  date?: string
  content: string
  tags?: string[]
  excerpt?: string
  readTime?: string
  published?: boolean
}

interface BlogStatsProps {
  posts: Post[]
  className?: string
}

export function BlogStats({ posts, className = "" }: BlogStatsProps) {
  // Calculate stats
  const totalPosts = posts.length
  const categories = [...new Set(posts.map(post => post.category))]
  const totalCategories = categories.length
  
  // Get category counts
  const categoryCounts = categories.map(category => ({
    name: category,
    count: posts.filter(post => post.category === category).length
  })).sort((a, b) => b.count - a.count)

  // Calculate total reading time (rough estimate)
  const totalReadingTime = posts.reduce((total, post) => {
    if (post.readTime) {
      const minutes = parseInt(post.readTime.match(/\d+/)?.[0] || '0')
      return total + minutes
    }
    return total + 5 // Default 5 minutes per post
  }, 0)

  return (
    <div className={`bg-gray-900/60 border border-gray-700 rounded-lg p-6 backdrop-blur-sm ${className}`}>
      <h3 className="text-lg font-pixel text-green-400 mb-6 flex items-center">
        <span className="text-green-500 mr-2">▢</span>
        Blog Analytics
      </h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-800/50 rounded border border-green-400/20">
          <div className="text-2xl font-pixel text-green-400">{totalPosts}</div>
          <div className="text-xs text-gray-400 font-mono">Total Posts</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800/50 rounded border border-green-400/20">
          <div className="text-2xl font-pixel text-green-400">{totalCategories}</div>
          <div className="text-xs text-gray-400 font-mono">Categories</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800/50 rounded border border-green-400/20">
          <div className="text-2xl font-pixel text-green-400">{totalReadingTime}m</div>
          <div className="text-xs text-gray-400 font-mono">Total Reading</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-sm font-retro text-green-400 mb-3">Categories</h4>
        <div className="space-y-2">
          {categoryCounts.map(({ name, count }) => (
            <div key={name} className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-mono">{name}</span>
              <div className="flex items-center">
                <div className="w-12 h-1 bg-gray-700 rounded-full mr-2 overflow-hidden">
                  <div 
                    className="h-full bg-green-400 transition-all duration-300"
                    style={{ width: `${(count / totalPosts) * 100}%` }}
                  />
                </div>
                <span className="text-green-400 font-mono text-xs">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="font-mono">Live Blog Feed</span>
        </div>
      </div>
    </div>
  )
} 