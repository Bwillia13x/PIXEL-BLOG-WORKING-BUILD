// Content Management Types

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  count: number
  category?: string
  aliases?: string[]
  relatedTags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
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

export interface Series {
  id: string
  title: string
  slug: string
  description: string
  coverImage?: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  posts: SeriesPost[]
  totalPosts: number
  completedPosts: number
  estimatedDuration: string
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

export interface SeriesPost {
  id: string
  title: string
  slug: string
  description?: string
  order: number
  status: 'draft' | 'published' | 'scheduled'
  publishDate?: Date
  estimatedReadTime: number
  isRequired: boolean
  dependencies?: string[]
}

export interface Collection {
  id: string
  name: string
  description: string
  type: 'curated' | 'automatic' | 'smart'
  criteria?: CollectionCriteria
  posts: string[]
  featured: boolean
  public: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CollectionCriteria {
  tags?: string[]
  categories?: string[]
  dateRange?: { start: Date; end: Date }
  author?: string
  minReadTime?: number
  maxReadTime?: number
  featured?: boolean
  status?: string[]
}

// SEO Types
export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: SEOSuggestion[]
  keywords: KeywordAnalysis[]
  readability: ReadabilityScore
  metadata: MetadataAnalysis
  structure: StructureAnalysis
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  category: 'title' | 'description' | 'keywords' | 'content' | 'structure' | 'images' | 'links'
  message: string
  fix?: string
  impact: 'high' | 'medium' | 'low'
}

export interface SEOSuggestion {
  type: 'improvement' | 'optimization' | 'best-practice'
  message: string
  action?: string
  priority: number
}

export interface KeywordAnalysis {
  keyword: string
  density: number
  frequency: number
  positions: number[]
  inTitle: boolean
  inDescription: boolean
  inHeadings: boolean
  inUrl: boolean
  competition: 'low' | 'medium' | 'high'
  difficulty: number
}

export interface ReadabilityScore {
  score: number
  grade: string
  avgSentenceLength: number
  avgWordsPerSentence: number
  passiveVoice: number
  longSentences: number
}

export interface MetadataAnalysis {
  title: {
    length: number
    optimal: boolean
    hasKeyword: boolean
    clickworthy: boolean
  }
  description: {
    length: number
    optimal: boolean
    hasKeyword: boolean
    compelling: boolean
  }
  url: {
    length: number
    hasKeyword: boolean
    readable: boolean
  }
}

export interface StructureAnalysis {
  headings: {
    h1Count: number
    h2Count: number
    h3Count: number
    hierarchy: boolean
    hasKeywords: boolean
  }
  images: {
    total: number
    withAlt: number
    optimized: number
    missingAlt: string[]
  }
  links: {
    internal: number
    external: number
    broken: number
    nofollow: number
  }
  wordCount: number
  paragraphs: number
  avgParagraphLength: number
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'user_action' | 'performance' | 'engagement' | 'conversion' | 'error'
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId: string
  timestamp: Date
  metadata: Record<string, unknown>
  processed: boolean
}

export interface ContentMetrics {
  postId: string
  views: number
  uniqueViews: number
  timeOnPage: number
  scrollDepth: number
  bounceRate: number
  shareCount: number
  commentCount: number
  likeCount: number
  conversionRate: number
  exitRate: number
  engagementScore: number
}

export interface UserBehavior {
  userId: string
  sessionId: string
  entryPage: string
  exitPage: string
  pageViews: number
  sessionDuration: number
  actions: UserAction[]
  device: DeviceInfo
  location: LocationInfo
  referrer: string
  isReturning: boolean
}

export interface UserAction {
  type: 'click' | 'scroll' | 'hover' | 'search' | 'download' | 'share' | 'like' | 'comment'
  element: string
  timestamp: Date
  coordinates?: { x: number; y: number }
  value?: string
}

export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile'
  os: string
  browser: string
  screenResolution: string
  viewportSize: string
}

export interface LocationInfo {
  country?: string
  region?: string
  city?: string
  timezone: string
}

// Related Posts Types
export interface AdvancedRelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  tags?: string[]
  date?: string
  similarity: number
  reasons: string[]
  contentSimilarity: number
  userAffinityScore: number
  trendingScore: number
  diversityScore: number
  confidenceScore: number
}

export interface ContentVector {
  id: string
  tfidf: Map<string, number>
  topics: string[]
  readingLevel: number
  sentiment: number
  keyPhrases: string[]
}

// Upload Types
export interface UploadedImage {
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

// Publishing Types
export interface PublishSettings {
  status: string
  publishDate?: Date
  scheduleEnabled: boolean
  notifySubscribers: boolean
  socialMediaShare: boolean
  updateSitemap: boolean
  generateSummary: boolean
  seoOptimization: boolean
}

export interface PostStatus {
  id: string
  name: string
  color: string
  icon: string
  description: string
}