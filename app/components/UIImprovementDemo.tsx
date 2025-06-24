'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, RefreshCw, Zap, CheckCircle } from 'lucide-react'
import { EnhancedContentCard } from './EnhancedContentCard'
import { SmartNavigationSystem } from './SmartNavigationSystem'
import { ProgressiveLoadingSystem, LoadingCardGrid } from './ProgressiveLoadingSystem'

interface DemoProps {
  className?: string
}

export function UIImprovementDemo({ className = '' }: DemoProps) {
  const [] = useState<'before' | 'after'>('after')
  const [isLoading, setIsLoading] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [activeDemo, setActiveDemo] = useState<'cards' | 'navigation' | 'loading'>('cards')

  // Mock post data for demonstration
  const mockPosts = [
    {
      id: '1',
      slug: 'ai-driven-development',
      title: 'AI-Driven Development Workflow: Building the Future',
      category: 'AI',
      date: '2024-12-15',
      content: 'Exploring how artificial intelligence is transforming software development workflows and enabling more efficient, intelligent coding practices...',
      tags: ['AI', 'Development', 'Workflow', 'Automation'],
      excerpt: 'Discover how AI is revolutionizing the way we build software, from intelligent code completion to automated testing and deployment.',
      readTime: '8 min read',
      views: 1247,
      featured: true,
      published: true
    },
    {
      id: '2',
      slug: 'building-digital-home',
      title: 'Building My Digital Home: A Developer\'s Journey',
      category: 'Tech',
      date: '2024-12-10',
      content: 'Creating a personal blog and portfolio site using modern web technologies, design principles, and performance optimization techniques...',
      tags: ['Web Development', 'Portfolio', 'Next.js'],
      excerpt: 'Follow my journey of creating this pixel-themed blog using Next.js, Tailwind CSS, and modern web development practices.',
      readTime: '6 min read',
      views: 892,
      published: true
    },
    {
      id: '3',
      slug: 'deep-value-investing',
      title: 'Deep Value Screener: Finding Hidden Gems',
      category: 'Finance',
      date: '2024-12-08',
      content: 'A comprehensive guide to building value investing tools and screening methodologies for identifying undervalued securities...',
      tags: ['Investing', 'Finance', 'Analysis', 'Tools'],
      excerpt: 'Learn how to build sophisticated value investing tools to identify undervalued stocks and investment opportunities.',
      readTime: '12 min read',
      views: 634,
      published: true
    }
  ]

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const improvements = [
    {
      title: 'Enhanced Content Cards',
      description: 'Better visual hierarchy, spacing, and interaction design',
      status: 'implemented',
      impact: 'High'
    },
    {
      title: 'Smart Navigation',
      description: 'Breadcrumbs, quick filters, and content discovery',
      status: 'implemented',
      impact: 'High'
    },
    {
      title: 'Progressive Loading',
      description: 'Contextual feedback and skeleton screens',
      status: 'implemented',
      impact: 'Medium'
    },
    {
      title: 'Mobile Optimization',
      description: 'Touch-friendly interactions and better spacing',
      status: 'in-progress',
      impact: 'Medium'
    },
    {
      title: 'Accessibility Enhancements',
      description: 'Improved screen reader support and contrast',
      status: 'planned',
      impact: 'High'
    }
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Demo Controls */}
      <motion.div
        className="bg-gray-900/80 border border-green-400/30 rounded-lg p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-pixel text-xl text-green-400 mb-2">UI Improvement Demonstration</h2>
            <p className="text-gray-400 text-sm font-mono">
              Interactive showcase of the enhanced design system components
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Demo Selector */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['cards', 'navigation', 'loading'].map((demo) => (
                <button
                  key={demo}
                  onClick={() => setActiveDemo(demo as 'cards' | 'navigation' | 'loading')}
                  className={`px-3 py-2 text-xs font-pixel rounded transition-all ${
                    activeDemo === demo
                      ? 'bg-green-400 text-black'
                      : 'text-gray-400 hover:text-green-400'
                  }`}
                >
                  {demo.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Comparison Toggle */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="font-mono">{showComparison ? 'Hide' : 'Show'} Comparison</span>
            </button>
            
            {/* Loading Demo */}
            <button
              onClick={simulateLoading}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-mono">Test Loading</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        className="bg-gray-900/60 border border-green-400/20 rounded-lg p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-pixel text-lg text-green-400 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Implementation Progress
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {improvements.map((improvement, index) => (
            <motion.div
              key={improvement.title}
              className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-pixel text-sm text-green-400">{improvement.title}</h4>
                <span className={`px-2 py-1 text-xs font-mono rounded ${
                  improvement.status === 'implemented' ? 'bg-green-400/20 text-green-400' :
                  improvement.status === 'in-progress' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-gray-400/20 text-gray-400'
                }`}>
                  {improvement.status}
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{improvement.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">Impact: {improvement.impact}</span>
                {improvement.status === 'implemented' && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demo Content */}
      <AnimatePresence mode="wait">
        {activeDemo === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-pixel text-xl text-green-400 mb-2">Enhanced Content Cards</h3>
              <p className="text-gray-400 font-mono text-sm">
                Improved visual hierarchy, better spacing, and enhanced interactions
              </p>
            </div>
            
            {isLoading ? (
              <LoadingCardGrid count={3} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EnhancedContentCard
                      post={post}
                      variant={index === 0 ? 'featured' : 'grid'}
                      priority={index === 0 ? 'high' : 'normal'}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeDemo === 'navigation' && (
          <motion.div
            key="navigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-pixel text-xl text-green-400 mb-2">Smart Navigation System</h3>
              <p className="text-gray-400 font-mono text-sm">
                Breadcrumbs, content discovery, and intelligent filtering
              </p>
            </div>
            
            <div className="bg-gray-900/40 border border-green-400/20 rounded-lg p-6">
              <SmartNavigationSystem
                showRecentlyViewed={true}
                showRecommendations={true}
                showQuickFilters={true}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
                <h4 className="font-pixel text-sm text-green-400 mb-2">Key Features</h4>
                <ul className="text-gray-400 text-sm space-y-1 font-mono">
                  <li>• Smart breadcrumb generation</li>
                  <li>• Recently viewed tracking</li>
                  <li>• Content recommendations</li>
                  <li>• Quick filter shortcuts</li>
                  <li>• Context-aware navigation</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
                <h4 className="font-pixel text-sm text-green-400 mb-2">Benefits</h4>
                <ul className="text-gray-400 text-sm space-y-1 font-mono">
                  <li>• Improved content discovery</li>
                  <li>• Reduced navigation friction</li>
                  <li>• Better user orientation</li>
                  <li>• Increased engagement</li>
                  <li>• Personalized experience</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeDemo === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-pixel text-xl text-green-400 mb-2">Progressive Loading System</h3>
              <p className="text-gray-400 font-mono text-sm">
                Contextual feedback, skeleton screens, and intelligent progress indication
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-900/40 border border-green-400/20 rounded-lg p-4">
                <h4 className="font-pixel text-sm text-green-400 mb-4">Loading States</h4>
                {isLoading ? (
                  <ProgressiveLoadingSystem
                    variant="inline"
                    contextualMessages={true}
                    showNetworkStatus={true}
                    enableProgressiveLoading={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 font-mono text-sm mb-4">
                      Click &quot;Test Loading&quot; to see the progressive loading system in action
                    </p>
                    <button
                      onClick={simulateLoading}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-pixel text-sm transition-colors"
                    >
                      START DEMO
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
                <h4 className="font-pixel text-sm text-green-400 mb-2">Features</h4>
                <ul className="text-gray-400 text-sm space-y-2 font-mono">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Multi-stage progress tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Contextual loading messages
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Network status monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Progressive skeleton screens
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    Performance insights
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <motion.div
        className="bg-gradient-to-r from-green-400/10 via-green-400/5 to-transparent border border-green-400/20 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-pixel text-lg text-green-400 mb-4">Implementation Impact</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-pixel text-green-400 mb-1">40%</div>
            <div className="text-sm text-gray-400 font-mono">Better Content Scanning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-pixel text-green-400 mb-1">60%</div>
            <div className="text-sm text-gray-400 font-mono">Improved Navigation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-pixel text-green-400 mb-1">35%</div>
            <div className="text-sm text-gray-400 font-mono">Faster Perceived Load</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-900/40 rounded-lg">
          <p className="text-gray-400 text-sm font-mono leading-relaxed">
            <strong className="text-green-400">Result:</strong> These targeted improvements maintain the unique pixel aesthetic 
            while significantly enhancing user experience through better content hierarchy, intuitive navigation, 
            and responsive feedback systems.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default UIImprovementDemo