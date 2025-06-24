'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../Providers'

interface Series {
  id: string
  title: string
  slug: string
  description: string
  coverImage?: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  posts: SeriesPost[]
  totalPosts: number
  completedPosts: number
  estimatedDuration: string // e.g., "2 weeks", "1 month"
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  category: string
  author: string
  createdAt: Date
  updatedAt: Date
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}

interface SeriesPost {
  id: string
  title: string
  slug: string
  description?: string
  order: number
  status: 'draft' | 'published' | 'scheduled'
  publishDate?: Date
  estimatedReadTime: number
  isRequired: boolean
  dependencies?: string[] // IDs of posts that should be read first
}

interface Collection {
  id: string
  name: string
  description: string
  type: 'curated' | 'automatic' | 'smart'
  criteria?: CollectionCriteria
  posts: string[] // Post IDs
  featured: boolean
  public: boolean
  createdAt: Date
  updatedAt: Date
}

interface CollectionCriteria {
  tags?: string[]
  categories?: string[]
  dateRange?: { start: Date; end: Date }
  author?: string
  minReadTime?: number
  maxReadTime?: number
  featured?: boolean
  status?: string[]
}

interface SeriesManagerProps {
  currentSeries?: string
  onSeriesChange: (seriesId: string | undefined) => void
  onSeriesCreate: (series: Partial<Series>) => void
  onCollectionCreate: (collection: Partial<Collection>) => void
  postId?: string
  className?: string
}

// Default series for demonstration
const DEFAULT_SERIES: Series[] = [
  {
    id: 'value-investing-fundamentals',
    title: 'Value Investing Fundamentals',
    slug: 'value-investing-fundamentals',
    description: 'A comprehensive guide to value investing principles and strategies',
    status: 'active',
    posts: [
      {
        id: '1',
        title: 'Introduction to Value Investing',
        slug: 'intro-value-investing',
        description: 'Understanding the core principles of value investing',
        order: 1,
        status: 'published',
        estimatedReadTime: 8,
        isRequired: true
      },
      {
        id: '2',
        title: 'Financial Statement Analysis',
        slug: 'financial-statement-analysis',
        description: 'How to read and analyze financial statements',
        order: 2,
        status: 'published',
        estimatedReadTime: 12,
        isRequired: true,
        dependencies: ['1']
      },
      {
        id: '3',
        title: 'Valuation Techniques',
        slug: 'valuation-techniques',
        description: 'Different methods for valuing stocks',
        order: 3,
        status: 'draft',
        estimatedReadTime: 15,
        isRequired: true,
        dependencies: ['1', '2']
      }
    ],
    totalPosts: 6,
    completedPosts: 2,
    estimatedDuration: '3 weeks',
    difficulty: 'intermediate',
    tags: ['investing', 'finance', 'value-investing', 'analysis'],
    category: 'finance',
    author: 'Ben Williams',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    featured: true,
    seoTitle: 'Complete Value Investing Guide - Learn Warren Buffett\'s Strategy',
    seoDescription: 'Master value investing with our comprehensive 6-part series covering fundamentals, analysis, and real-world applications.'
  },
  {
    id: 'react-performance-optimization',
    title: 'React Performance Optimization',
    slug: 'react-performance-optimization',
    description: 'Advanced techniques for optimizing React applications',
    status: 'active',
    posts: [
      {
        id: '4',
        title: 'React Rendering Optimization',
        slug: 'react-rendering-optimization',
        order: 1,
        status: 'published',
        estimatedReadTime: 10,
        isRequired: true
      },
      {
        id: '5',
        title: 'Memory Management in React',
        slug: 'react-memory-management',
        order: 2,
        status: 'scheduled',
        publishDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedReadTime: 12,
        isRequired: true,
        dependencies: ['4']
      }
    ],
    totalPosts: 4,
    completedPosts: 1,
    estimatedDuration: '2 weeks',
    difficulty: 'advanced',
    tags: ['react', 'performance', 'optimization', 'javascript'],
    category: 'technology',
    author: 'Ben Williams',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    featured: false
  }
]

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'beginner-guides',
    name: 'Beginner Guides',
    description: 'Essential posts for beginners getting started',
    type: 'curated',
    posts: ['1', '4'],
    featured: true,
    public: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'finance-essentials',
    name: 'Finance Essentials',
    description: 'Core financial concepts and tools',
    type: 'automatic',
    criteria: {
      categories: ['finance'],
      tags: ['investing', 'analysis'],
      featured: true
    },
    posts: ['1', '2'],
    featured: true,
    public: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  }
]

export default function SeriesManager({
  currentSeries,
  onSeriesChange,
  onSeriesCreate,
  onCollectionCreate,
  postId,
  className = ''
}: SeriesManagerProps) {
  const { theme } = useTheme()
  
  const [series, setSeries] = useState<Series[]>(DEFAULT_SERIES)
  const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS)
  const [activeTab, setActiveTab] = useState<'series' | 'collections'>('series')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // New series form state
  const [newSeries, setNewSeries] = useState<Partial<Series>>({
    title: '',
    description: '',
    difficulty: 'beginner',
    status: 'draft',
    tags: [],
    estimatedDuration: '',
    featured: false
  })

  // New collection form state
  const [newCollection, setNewCollection] = useState<Partial<Collection>>({
    name: '',
    description: '',
    type: 'curated',
    featured: false,
    public: true
  })

  const currentSeriesData = series.find(s => s.id === currentSeries)

  // Filter series and collections based on search
  const filteredSeries = series.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredCollections = collections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSeries = () => {
    if (!newSeries.title || !newSeries.description) return

    const series: Series = {
      id: Date.now().toString(),
      title: newSeries.title,
      slug: newSeries.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newSeries.description,
      status: newSeries.status || 'draft',
      posts: [],
      totalPosts: 0,
      completedPosts: 0,
      estimatedDuration: newSeries.estimatedDuration || 'TBD',
      difficulty: newSeries.difficulty || 'beginner',
      tags: newSeries.tags || [],
      category: newSeries.category || '',
      author: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: newSeries.featured || false
    }

    setSeries(prev => [...prev, series])
    onSeriesCreate(series)
    setNewSeries({
      title: '',
      description: '',
      difficulty: 'beginner',
      status: 'draft',
      tags: [],
      estimatedDuration: '',
      featured: false
    })
    setShowCreateForm(false)
  }

  const handleCreateCollection = () => {
    if (!newCollection.name || !newCollection.description) return

    const collection: Collection = {
      id: Date.now().toString(),
      name: newCollection.name,
      description: newCollection.description,
      type: newCollection.type || 'curated',
      posts: [],
      featured: newCollection.featured || false,
      public: newCollection.public !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCollections(prev => [...prev, collection])
    onCollectionCreate(collection)
    setNewCollection({
      name: '',
      description: '',
      type: 'curated',
      featured: false,
      public: true
    })
    setShowCreateForm(false)
  }

  const getSeriesProgress = (series: Series) => {
    return series.totalPosts > 0 ? (series.completedPosts / series.totalPosts) * 100 : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'active': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'archived': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('series')}
            className={`px-4 py-2 font-mono text-sm rounded transition-colors pixel-border-sm ${
              activeTab === 'series'
                ? 'bg-green-600/60 text-white'
                : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
            }`}
          >
            📚 Series ({series.length})
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 font-mono text-sm rounded transition-colors pixel-border-sm ${
              activeTab === 'collections'
                ? 'bg-green-600/60 text-white'
                : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
            }`}
          >
            📂 Collections ({collections.length})
          </button>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-green-600/60 hover:bg-green-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
        >
          + Create {activeTab === 'series' ? 'Series' : 'Collection'}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full px-4 py-2 bg-gray-800/60 border border-green-400/30 rounded-lg font-mono text-sm text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Current Selection */}
      {currentSeriesData && (
        <div className="pixel-border bg-green-400/10 border-green-400/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-pixel">Current Series:</span>
              <span className="font-mono text-green-300">{currentSeriesData.title}</span>
            </div>
            <button
              onClick={() => onSeriesChange(undefined)}
              className="text-red-400 hover:text-red-300 text-xs font-mono"
            >
              Remove from series
            </button>
          </div>
          <div className="text-sm text-gray-400 font-mono">
            Post will be part of &quot;{currentSeriesData.title}&quot; series
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'series' ? (
        // Series Tab
        <div className="space-y-4">
          {filteredSeries.map((seriesItem) => (
            <div
              key={seriesItem.id}
              className={`
                pixel-border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${currentSeries === seriesItem.id
                  ? 'bg-green-400/20 border-green-400'
                  : 'bg-gray-800/40 border-gray-600 hover:border-gray-500'
                }
              `}
              onClick={() => onSeriesChange(currentSeries === seriesItem.id ? undefined : seriesItem.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-pixel text-lg text-green-400">{seriesItem.title}</h3>
                    {seriesItem.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 font-mono mb-3">
                    {seriesItem.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-mono mb-2"
                    style={{
                      backgroundColor: `${getStatusColor(seriesItem.status)}20`,
                      color: getStatusColor(seriesItem.status)
                    }}
                  >
                    {seriesItem.status.toUpperCase()}
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${getDifficultyColor(seriesItem.difficulty)}20`,
                      color: getDifficultyColor(seriesItem.difficulty)
                    }}
                  >
                    {seriesItem.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{seriesItem.completedPosts}/{seriesItem.totalPosts} posts</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getSeriesProgress(seriesItem)}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>⏱️ {seriesItem.estimatedDuration}</span>
                  <span>📝 {seriesItem.posts.length} posts ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  {seriesItem.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {seriesItem.tags.length > 3 && (
                    <span className="text-gray-500">+{seriesItem.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredSeries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📚</div>
              <div className="font-mono">
                {searchQuery ? `No series found for &quot;${searchQuery}&quot;` : 'No series created yet'}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Collections Tab
        <div className="space-y-4">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="pixel-border bg-gray-800/40 border-gray-600 hover:border-gray-500 rounded-lg p-4 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-pixel text-lg text-green-400">{collection.name}</h3>
                    {collection.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">
                        FEATURED
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      collection.public 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {collection.public ? 'PUBLIC' : 'PRIVATE'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 font-mono mb-3">
                    {collection.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-mono ${
                    collection.type === 'curated' ? 'bg-blue-500/20 text-blue-400' :
                    collection.type === 'automatic' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {collection.type.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-gray-400">
                📄 {collection.posts.length} posts • Updated {collection.updatedAt.toLocaleDateString()}
              </div>
            </div>
          ))}

          {filteredCollections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📂</div>
              <div className="font-mono">
                {searchQuery ? `No collections found for &quot;${searchQuery}&quot;` : 'No collections created yet'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="pixel-border bg-gray-900/95 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{activeTab === 'series' ? '📚' : '📂'}</div>
                <h3 className="font-pixel text-lg text-green-400">
                  Create New {activeTab === 'series' ? 'Series' : 'Collection'}
                </h3>
              </div>

              {activeTab === 'series' ? (
                // Series Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Series Title *
                    </label>
                    <input
                      type="text"
                      value={newSeries.title || ''}
                      onChange={(e) => setNewSeries(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newSeries.description || ''}
                      onChange={(e) => setNewSeries(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={newSeries.difficulty || 'beginner'}
                        onChange={(e) => setNewSeries(prev => ({ ...prev, difficulty: e.target.value as Series['difficulty'] }))}
                        className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newSeries.estimatedDuration || ''}
                        onChange={(e) => setNewSeries(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                        placeholder="e.g., 2 weeks"
                        className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newSeries.featured || false}
                      onChange={(e) => setNewSeries(prev => ({ ...prev, featured: e.target.checked }))}
                      className="pixel-checkbox"
                    />
                    <span className="text-sm font-mono text-gray-300">Featured series</span>
                  </label>
                </div>
              ) : (
                // Collection Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      value={newCollection.name || ''}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newCollection.description || ''}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Type
                    </label>
                    <select
                      value={newCollection.type || 'curated'}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, type: e.target.value as Collection['type'] }))}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
                    >
                      <option value="curated">Curated (Manual)</option>
                      <option value="automatic">Automatic (Rules-based)</option>
                      <option value="smart">Smart (AI-powered)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={newCollection.featured || false}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, featured: e.target.checked }))}
                        className="pixel-checkbox"
                      />
                      <span className="text-sm font-mono text-gray-300">Featured collection</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={newCollection.public !== false}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, public: e.target.checked }))}
                        className="pixel-checkbox"
                      />
                      <span className="text-sm font-mono text-gray-300">Public collection</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors font-mono text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={activeTab === 'series' ? handleCreateSeries : handleCreateCollection}
                  disabled={activeTab === 'series' 
                    ? !newSeries.title || !newSeries.description 
                    : !newCollection.name || !newCollection.description
                  }
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors font-mono text-sm disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}