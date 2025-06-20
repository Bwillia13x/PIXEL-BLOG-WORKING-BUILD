'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../Providers'
import RichTextEditor from './RichTextEditor'
import ImageUploader from './ImageUploader'
import TagManager from './TagManager'
import CategoryManager from './CategoryManager'
import PublishWorkflow from './PublishWorkflow'
import SeriesManager from './SeriesManager'
import SEOOptimizer from './SEOOptimizer'
import AnalyticsIntegration from './AnalyticsIntegration'
import RelatedPostsEngine from './RelatedPostsEngine'

interface CMSPost {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  series?: string
  collection?: string
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived'
  publishDate?: Date
  featuredImage?: string
  images: UploadedImage[]
  seoTitle?: string
  seoDescription?: string
  author: string
  readTime?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  type: string
  dimensions?: { width: number; height: number }
  optimized?: boolean
  thumbnail?: string
}

interface CMSProps {
  initialPost?: Partial<CMSPost>
  onSave: (post: CMSPost) => Promise<void>
  onPublish: (post: CMSPost) => Promise<void>
  onPreview: (post: CMSPost) => void
  allPosts?: CMSPost[]
  isLoading?: boolean
  className?: string
}

type CMSTab = 'content' | 'media' | 'seo' | 'publish' | 'analytics' | 'related'

export default function ContentManagementSystem({
  initialPost,
  onSave,
  onPublish,
  onPreview,
  allPosts = [],
  isLoading = false,
  className = ''
}: CMSProps) {
  const { theme } = useTheme()
  
  const [activeTab, setActiveTab] = useState<CMSTab>('content')
  const [post, setPost] = useState<CMSPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    images: [],
    author: 'Current User',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...initialPost
  })
  
  const [autoSave, setAutoSave] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (post.title && (!post.slug || post.slug === generateSlug(post.title))) {
      updatePost({ slug: generateSlug(post.title) })
    }
  }, [post.title])

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && autoSave) {
      const timer = setTimeout(async () => {
        try {
          await handleSave()
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [post, hasUnsavedChanges, autoSave])

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const updatePost = useCallback((updates: Partial<CMSPost>) => {
    setPost(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
      readTime: updates.content ? calculateReadTime(updates.content) : prev.readTime
    }))
    setHasUnsavedChanges(true)
  }, [])

  const handleContentChange = (content: string) => {
    updatePost({ content })
  }

  const handleImageUpload = (images: UploadedImage[]) => {
    updatePost({ images })
  }

  const handleTagsChange = (tags: string[]) => {
    updatePost({ tags })
  }

  const handleCategoryChange = (category: string | undefined) => {
    updatePost({ category: category || '' })
  }

  const handleSeriesChange = (seriesId: string | undefined) => {
    updatePost({ series: seriesId })
  }

  const handleSEOSuggestionApply = (type: string, value: string) => {
    switch (type) {
      case 'title':
        updatePost({ seoTitle: value })
        break
      case 'description':
        updatePost({ seoDescription: value })
        break
      case 'slug':
        updatePost({ slug: value })
        break
    }
  }

  const handleMetaGenerate = (meta: { title: string; description: string }) => {
    updatePost({
      seoTitle: meta.title,
      seoDescription: meta.description
    })
  }

  const handleSave = async () => {
    try {
      await onSave(post)
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Save failed:', error)
      throw error
    }
  }

  const handlePublish = async () => {
    try {
      const publishedPost = {
        ...post,
        status: 'published' as const,
        publishDate: new Date()
      }
      setPost(publishedPost)
      await onPublish(publishedPost)
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Publish failed:', error)
      throw error
    }
  }

  const handlePreview = () => {
    onPreview(post)
  }

  const handleStatusChange = (status: string) => {
    updatePost({ status: status as CMSPost['status'] })
  }

  const handlePublishSettingsChange = (settings: any) => {
    updatePost({
      publishDate: settings.publishDate,
      status: settings.status as CMSPost['status']
    })
  }

  const tabs = [
    { id: 'content', name: 'Content', icon: '📝', description: 'Write and edit your post' },
    { id: 'media', name: 'Media', icon: '🖼️', description: 'Manage images and files' },
    { id: 'seo', name: 'SEO', icon: '🔍', description: 'Optimize for search engines' },
    { id: 'publish', name: 'Publish', icon: '🚀', description: 'Publishing workflow' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'Performance tracking' },
    { id: 'related', name: 'Related', icon: '🔗', description: 'Related posts and recommendations' }
  ]

  const getCompletionScore = (): number => {
    let score = 0
    const checks = [
      post.title.length > 0,
      post.content.length > 300,
      post.excerpt.length > 0,
      post.category.length > 0,
      post.tags.length > 0,
      post.seoTitle && post.seoTitle.length > 0,
      post.seoDescription && post.seoDescription.length > 0,
      post.slug.length > 0
    ]
    
    score = (checks.filter(Boolean).length / checks.length) * 100
    return Math.round(score)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'review': return '#f59e0b'
      case 'scheduled': return '#3b82f6'
      case 'published': return '#10b981'
      case 'archived': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="pixel-border bg-gray-800/60 backdrop-blur-sm sticky top-0 z-30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-pixel text-xl text-green-400">Content Management System</h1>
            <div 
              className="px-3 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${getStatusColor(post.status)}20`,
                color: getStatusColor(post.status)
              }}
            >
              {post.status.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Completion Score */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-gray-400">Complete:</span>
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-300"
                  style={{ width: `${getCompletionScore()}%` }}
                />
              </div>
              <span className="text-xs font-mono text-green-400">{getCompletionScore()}%</span>
            </div>

            {/* Save Status */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              {hasUnsavedChanges ? (
                <span className="text-yellow-400">● Unsaved</span>
              ) : lastSaved ? (
                <span className="text-green-400">✓ Saved {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span className="text-gray-400">Ready</span>
              )}
            </div>

            {/* Auto-save Toggle */}
            <label className="flex items-center space-x-2 text-sm font-mono text-gray-300">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="pixel-checkbox"
              />
              <span>Auto-save</span>
            </label>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isLoading || !hasUnsavedChanges}
                className="px-4 py-2 bg-blue-600/60 hover:bg-blue-500/60 text-white font-mono text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save
              </button>
              
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-purple-600/60 hover:bg-purple-500/60 text-white font-mono text-sm rounded transition-colors"
              >
                👁️ Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 pixel-border border-r bg-gray-800/40 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CMSTab)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left
                  ${activeTab === tab.id
                    ? 'bg-green-600/60 text-white pixel-border'
                    : 'text-gray-300 hover:bg-gray-700/40 hover:text-green-400'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <div>
                  <div className="font-mono text-sm font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Post Info */}
          <div className="mt-8 p-4 pixel-border bg-gray-900/40 rounded-lg">
            <h3 className="font-mono text-sm text-green-400 mb-3">Post Info</h3>
            <div className="space-y-2 text-xs font-mono text-gray-400">
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="text-green-400">{post.content.split(/\s+/).filter(w => w.length > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Read Time:</span>
                <span className="text-blue-400">{post.readTime || calculateReadTime(post.content)}</span>
              </div>
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="text-purple-400">{post.images.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tags:</span>
                <span className="text-yellow-400">{post.tags.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Basic Post Info - Always Visible */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => updatePost({ title: e.target.value })}
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 bg-gray-800/60 border border-green-400/30 rounded-lg font-mono text-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => updatePost({ slug: e.target.value })}
                placeholder="url-friendly-slug"
                className="w-full px-4 py-3 bg-gray-800/60 border border-green-400/30 rounded-lg font-mono text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              />
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) => updatePost({ excerpt: e.target.value })}
                  placeholder="Brief description of your post..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-green-400/30 rounded-lg font-mono text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <CategoryManager
                  selectedCategory={post.category}
                  onCategoryChange={handleCategoryChange}
                />

                <TagManager
                  selectedTags={post.tags}
                  onTagsChange={handleTagsChange}
                />
              </div>

              <SeriesManager
                currentSeries={post.series}
                onSeriesChange={handleSeriesChange}
                onSeriesCreate={() => {}}
                onCollectionCreate={() => {}}
                postId={post.id}
              />

              <RichTextEditor
                initialValue={post.content}
                onChange={handleContentChange}
                autoSave={autoSave}
                onSave={autoSave ? undefined : handleSave}
                showPreview={true}
              />
            </div>
          )}

          {activeTab === 'media' && (
            <ImageUploader
              onUpload={handleImageUpload}
              maxFiles={20}
              autoOptimize={true}
              showThumbnails={true}
            />
          )}

          {activeTab === 'seo' && (
            <SEOOptimizer
              title={post.seoTitle || post.title}
              description={post.seoDescription || post.excerpt}
              content={post.content}
              slug={post.slug}
              tags={post.tags}
              category={post.category}
              onSuggestionApply={handleSEOSuggestionApply}
              onMetaGenerate={handleMetaGenerate}
            />
          )}

          {activeTab === 'publish' && (
            <PublishWorkflow
              currentStatus={post.status}
              onStatusChange={handleStatusChange}
              onPublishSettingsChange={handlePublishSettingsChange}
              onPublish={handlePublish}
              onSave={handleSave}
              isLoading={isLoading}
              canPublish={getCompletionScore() >= 70}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsIntegration
              postId={post.id}
              config={{
                enableRealtime: true,
                enableEngagementTracking: true,
                enablePerformanceTracking: true
              }}
            />
          )}

          {activeTab === 'related' && post.id && (
            <RelatedPostsEngine
              currentPost={post as any}
              allPosts={allPosts as any}
              enableMachineLearning={true}
              enableContentAnalysis={true}
              enableUserPersonalization={true}
              maxResults={5}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Export types at the end
export type { CMSPost, UploadedImage }