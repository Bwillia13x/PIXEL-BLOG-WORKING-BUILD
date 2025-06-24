'use client'

import { useState, useCallback } from 'react'
import { useTheme } from '../Providers'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  icon: string
  parentId?: string
  children?: Category[]
  postCount: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  featured: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

interface CategoryManagerProps {
  selectedCategory?: string
  onCategoryChange: (categoryId: string | undefined) => void
  allowHierarchy?: boolean
  showCounts?: boolean
  showIcons?: boolean
  className?: string
  maxDepth?: number
}

interface CategoryTreeProps {
  categories: Category[]
  selectedCategory?: string
  onSelect: (categoryId: string | undefined) => void
  level?: number
  maxDepth: number
  showCounts: boolean
  showIcons: boolean
}

// Default category hierarchy for pixel blog
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, development, and innovations',
    color: '#10b981',
    icon: '💻',
    postCount: 45,
    isActive: true,
    featured: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '1.1',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend, backend, and full-stack development',
        color: '#059669',
        icon: '🌐',
        parentId: '1',
        postCount: 28,
        isActive: true,
        featured: false,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '1.1.1',
            name: 'Frontend Frameworks',
            slug: 'frontend-frameworks',
            color: '#047857',
            icon: '⚛️',
            parentId: '1.1',
            postCount: 15,
            isActive: true,
            featured: false,
            sortOrder: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '1.1.2',
            name: 'Backend Development',
            slug: 'backend-development',
            color: '#047857',
            icon: '🔧',
            parentId: '1.1',
            postCount: 13,
            isActive: true,
            featured: false,
            sortOrder: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      },
      {
        id: '1.2',
        name: 'DevOps',
        slug: 'devops',
        description: 'Deployment, infrastructure, and automation',
        color: '#059669',
        icon: '🚀',
        parentId: '1',
        postCount: 12,
        isActive: true,
        featured: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '1.3',
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'iOS, Android, and cross-platform development',
        color: '#059669',
        icon: '📱',
        parentId: '1',
        postCount: 8,
        isActive: true,
        featured: false,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '2',
    name: 'Finance',
    slug: 'finance',
    description: 'Investment strategies, market analysis, and financial tools',
    color: '#3b82f6',
    icon: '💰',
    postCount: 32,
    isActive: true,
    featured: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '2.1',
        name: 'Investing',
        slug: 'investing',
        description: 'Stock market, value investing, and portfolio management',
        color: '#2563eb',
        icon: '📈',
        parentId: '2',
        postCount: 20,
        isActive: true,
        featured: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2.2',
        name: 'Portfolio Analysis',
        slug: 'portfolio-analysis',
        description: 'Risk assessment, performance tracking, and optimization',
        color: '#2563eb',
        icon: '📊',
        parentId: '2',
        postCount: 12,
        isActive: true,
        featured: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '3',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'AI, machine learning, and automation',
    color: '#8b5cf6',
    icon: '🤖',
    postCount: 18,
    isActive: true,
    featured: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '3.1',
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'ML algorithms, training, and implementation',
        color: '#7c3aed',
        icon: '🧠',
        parentId: '3',
        postCount: 12,
        isActive: true,
        featured: false,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3.2',
        name: 'Natural Language Processing',
        slug: 'nlp',
        description: 'Text processing, sentiment analysis, and language models',
        color: '#7c3aed',
        icon: '💬',
        parentId: '3',
        postCount: 6,
        isActive: true,
        featured: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '4',
    name: 'Education',
    slug: 'education',
    description: 'Tutorials, guides, and learning resources',
    color: '#f59e0b',
    icon: '📚',
    postCount: 25,
    isActive: true,
    featured: false,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '4.1',
        name: 'Tutorials',
        slug: 'tutorials',
        description: 'Step-by-step guides and how-tos',
        color: '#d97706',
        icon: '🎓',
        parentId: '4',
        postCount: 18,
        isActive: true,
        featured: false,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4.2',
        name: 'Course Reviews',
        slug: 'course-reviews',
        description: 'Reviews and recommendations for online courses',
        color: '#d97706',
        icon: '⭐',
        parentId: '4',
        postCount: 7,
        isActive: true,
        featured: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '5',
    name: 'Policy & Analysis',
    slug: 'policy-analysis',
    description: 'Policy analysis, regulations, and industry insights',
    color: '#ef4444',
    icon: '⚖️',
    postCount: 15,
    isActive: true,
    featured: false,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Utility functions
const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = []
  
  const flatten = (cats: Category[]) => {
    cats.forEach(cat => {
      result.push(cat)
      if (cat.children) {
        flatten(cat.children)
      }
    })
  }
  
  flatten(categories)
  return result
}

const findCategoryById = (categories: Category[], id: string): Category | undefined => {
  const flattened = flattenCategories(categories)
  return flattened.find(cat => cat.id === id)
}

const getCategoryPath = (categories: Category[], categoryId: string): Category[] => {
  const category = findCategoryById(categories, categoryId)
  if (!category) return []
  
  const path: Category[] = [category]
  let current = category
  
  while (current.parentId) {
    const parent = findCategoryById(categories, current.parentId)
    if (parent) {
      path.unshift(parent)
      current = parent
    } else {
      break
    }
  }
  
  return path
}

// Category Tree Component
function CategoryTree({
  categories,
  selectedCategory,
  onSelect,
  level = 0,
  maxDepth,
  showCounts,
  showIcons
}: CategoryTreeProps) {
  return (
    <div className={level > 0 ? 'ml-6 mt-2' : ''}>
      {categories.map((category) => (
        <div key={category.id} className="mb-2">
          {/* Category Item */}
          <div
            className={`
              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 pixel-border
              ${selectedCategory === category.id
                ? 'bg-green-400/20 border-green-400 text-green-300'
                : 'bg-gray-800/40 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-gray-200'
              }
            `}
            onClick={() => onSelect(selectedCategory === category.id ? undefined : category.id)}
            style={{
              borderLeftColor: category.color,
              borderLeftWidth: '4px'
            }}
          >
            <div className="flex items-center space-x-3">
              {/* Hierarchy Indicator */}
              {level > 0 && (
                <div className="flex items-center text-gray-500">
                  {'└' + '─'.repeat(level - 1)}
                </div>
              )}
              
              {/* Icon */}
              {showIcons && (
                <span className="text-lg">{category.icon}</span>
              )}
              
              {/* Category Info */}
              <div>
                <div className="font-mono text-sm font-semibold">
                  {category.name}
                </div>
                {category.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {category.description}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Post Count */}
              {showCounts && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-mono"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}
                >
                  {category.postCount}
                </span>
              )}
              
              {/* Featured Badge */}
              {category.featured && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">
                  FEATURED
                </span>
              )}
              
              {/* Expand Indicator */}
              {category.children && category.children.length > 0 && level < maxDepth && (
                <span className="text-gray-400 text-xs">
                  {selectedCategory === category.id ? '▼' : '▶'}
                </span>
              )}
            </div>
          </div>

          {/* Children */}
          {category.children && 
           category.children.length > 0 && 
           level < maxDepth && 
           selectedCategory === category.id && (
            <CategoryTree
              categories={category.children}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              level={level + 1}
              maxDepth={maxDepth}
              showCounts={showCounts}
              showIcons={showIcons}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CategoryManager({
  selectedCategory,
  onCategoryChange,
  allowHierarchy = true,
  showCounts = true,
  showIcons = true,
  className = '',
  maxDepth = 3
}: CategoryManagerProps) {
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('tree')

  // Filter categories based on search
  const filteredCategories = useCallback(() => {
    if (!searchQuery.trim()) return categories

    const query = searchQuery.toLowerCase()
    const flattened = flattenCategories(categories)
    
    return flattened.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query)
    )
  }, [categories, searchQuery])

  // Get category breadcrumb
  const selectedCategoryPath = selectedCategory 
    ? getCategoryPath(categories, selectedCategory)
    : []

  // Stats
  const totalCategories = flattenCategories(categories).length
  const totalPosts = flattenCategories(categories).reduce((sum, cat) => sum + cat.postCount, 0)
  const featuredCategories = flattenCategories(categories).filter(cat => cat.featured).length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-pixel text-green-400">Categories</h3>
          <div className="text-xs font-mono text-gray-500 mt-1">
            {totalCategories} categories • {totalPosts} posts • {featuredCategories} featured
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'tree' ? 'flat' : 'tree')}
            className={`
              px-3 py-1 text-xs font-mono rounded transition-colors pixel-border-sm
              ${viewMode === 'tree'
                ? 'bg-green-600/60 text-white'
                : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
              }
            `}
          >
            {viewMode === 'tree' ? '🌳 Tree' : '📋 Flat'}
          </button>
          
          {/* Clear Selection */}
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange(undefined)}
              className="px-3 py-1 text-xs font-mono bg-red-600/60 hover:bg-red-500/60 text-white rounded transition-colors pixel-border-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories..."
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

      {/* Selected Category Breadcrumb */}
      {selectedCategoryPath.length > 0 && (
        <div className="pixel-border bg-gray-800/40 p-3 rounded-lg">
          <div className="text-xs font-mono text-gray-400 mb-1">Selected Category:</div>
          <div className="flex items-center space-x-2 flex-wrap">
            {selectedCategoryPath.map((cat, index) => (
              <div key={cat.id} className="flex items-center space-x-2">
                {index > 0 && (
                  <span className="text-gray-500">→</span>
                )}
                <div
                  className="flex items-center space-x-2 px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    color: cat.color
                  }}
                >
                  {showIcons && <span className="text-sm">{cat.icon}</span>}
                  <span className="font-mono text-sm">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="pixel-border bg-gray-900/40 rounded-lg p-4 max-h-96 overflow-y-auto">
        {searchQuery || viewMode === 'flat' ? (
          // Flat View / Search Results
          <div className="space-y-2">
            {filteredCategories().map((category) => (
              <div
                key={category.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 pixel-border
                  ${selectedCategory === category.id
                    ? 'bg-green-400/20 border-green-400 text-green-300'
                    : 'bg-gray-800/40 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-gray-200'
                  }
                `}
                onClick={() => onCategoryChange(selectedCategory === category.id ? undefined : category.id)}
                style={{
                  borderLeftColor: category.color,
                  borderLeftWidth: '4px'
                }}
              >
                <div className="flex items-center space-x-3">
                  {showIcons && (
                    <span className="text-lg">{category.icon}</span>
                  )}
                  <div>
                    <div className="font-mono text-sm font-semibold">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {category.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {showCounts && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-mono"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      {category.postCount}
                    </span>
                  )}
                  {category.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">
                      FEATURED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tree View
          <CategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={onCategoryChange}
            maxDepth={maxDepth}
            showCounts={showCounts}
            showIcons={showIcons}
          />
        )}

        {/* No Results */}
        {searchQuery && filteredCategories().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-mono text-sm">No categories found for &quot;{searchQuery}&quot;</div>
          </div>
        )}
      </div>

      {/* Category Management Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Depth: {maxDepth} levels</span>
          {allowHierarchy && <span>Hierarchical view enabled</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  )
}