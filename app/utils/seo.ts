import { Post } from '@/app/data/posts'
import { calculateReadingTime } from './readingTime'

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    type: string
    url: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
    siteName: string
    locale: string
  }
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
    creator?: string
    site?: string
  }
  structuredData: any
  canonical: string
  robots: string
}

export interface SEOValidation {
  isValid: boolean
  warnings: string[]
  errors: string[]
  suggestions: string[]
  score: number
}

const SITE_CONFIG = {
  name: 'Pixel Wisdom',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pixel-wisdom.vercel.app',
  description: 'Modern portfolio and blog with retro pixel aesthetics',
  creator: 'Benjamin Williams',
  twitter: '@pixel_wisdom',
  defaultImage: '/og-image.png'
}

export function generatePostSEO(
  post: Post, 
  baseUrl: string = SITE_CONFIG.url
): SEOData {
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const readingTime = calculateReadingTime(post.content)
  
  // Extract first paragraph for description if no excerpt
  const description = post.excerpt || extractExcerpt(post.content, 160)
  
  // Generate keywords from tags and category
  const keywords = [
    ...(post.tags || []),
    post.category,
    'blog',
    'pixel wisdom',
    readingTime.text
  ].filter(Boolean)
  
  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: description,
    image: `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
    datePublished: post.date,
    dateModified: post.date, // In a real app, track modified dates
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.creator,
      url: `${baseUrl}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    articleSection: post.category,
    keywords: keywords.join(', '),
    wordCount: readingTime.words,
    timeRequired: `PT${readingTime.minutes}M`,
    inLanguage: 'en-US'
  }
  
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`
  
  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description,
    keywords,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: postUrl,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: post.title
      }],
      siteName: SITE_CONFIG.name,
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitter,
      site: SITE_CONFIG.twitter
    },
    structuredData,
    canonical: postUrl,
    robots: 'index,follow'
  }
}

export function validateSEO(post: Post): SEOValidation {
  const warnings: string[] = []
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 100

  // Title validation
  if (!post.title) {
    errors.push('Title is required')
    score -= 20
  } else {
    if (post.title.length < 30) {
      warnings.push('Title is quite short (recommended: 30-60 characters)')
      score -= 5
    }
    if (post.title.length > 60) {
      warnings.push('Title is too long (recommended: 30-60 characters)')
      score -= 10
    }
  }

  // Description/excerpt validation
  const description = post.excerpt || extractExcerpt(post.content, 160)
  if (!description) {
    errors.push('Description/excerpt is required')
    score -= 15
  } else {
    if (description.length < 120) {
      warnings.push('Description is short (recommended: 120-160 characters)')
      score -= 5
    }
    if (description.length > 160) {
      warnings.push('Description is too long (recommended: 120-160 characters)')
      score -= 10
    }
  }

  // Content validation
  if (!post.content) {
    errors.push('Content is required')
    score -= 30
  } else {
    const readingTime = calculateReadingTime(post.content)
    if (readingTime.words < 300) {
      warnings.push('Content is quite short (recommended: 300+ words)')
      score -= 10
    }
    
    // Check for headings
    const headingCount = (post.content.match(/^#{1,6}\s/gm) || []).length
    if (headingCount === 0) {
      suggestions.push('Consider adding headings to improve readability')
      score -= 5
    }
    
    // Check for images
    const imageCount = (post.content.match(/!\[.*?\]\(.*?\)/g) || []).length
    if (imageCount === 0) {
      suggestions.push('Consider adding images to make content more engaging')
      score -= 3
    }
  }

  // Category validation
  if (!post.category) {
    warnings.push('Category is missing')
    score -= 8
  }

  // Tags validation
  if (!post.tags || post.tags.length === 0) {
    warnings.push('Tags are missing')
    score -= 8
  } else {
    if (post.tags.length > 10) {
      warnings.push('Too many tags (recommended: 3-8 tags)')
      score -= 5
    }
  }

  // Date validation
  if (!post.date) {
    warnings.push('Publication date is missing')
    score -= 5
  }

  // Reading time validation
  if (!post.readTime) {
    suggestions.push('Consider adding reading time estimate')
    score -= 2
  }

  // Generate additional suggestions
  if (score > 80) {
    suggestions.push('SEO looks good! Consider adding internal links to related posts')
  }
  
  if (post.tags && post.tags.length > 0 && post.content) {
    const contentLower = post.content.toLowerCase()
    const unusedTags = post.tags.filter(tag => 
      !contentLower.includes(tag.toLowerCase())
    )
    
    if (unusedTags.length > 0) {
      suggestions.push(`Consider mentioning these tags in content: ${unusedTags.join(', ')}`)
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    suggestions,
    score: Math.max(0, score)
  }
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code formatting
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/\n\s*\n/g, ' ') // Replace double newlines
    .replace(/\n/g, ' ') // Replace single newlines
    .trim()

  // Get first meaningful sentence
  const sentences = cleanContent.split(/[.!?]+/)
  let excerpt = ''
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (trimmed.length > 20) { // Skip very short sentences
      if (excerpt.length + trimmed.length <= maxLength) {
        excerpt += (excerpt ? '. ' : '') + trimmed
      } else {
        break
      }
    }
  }

  // If no good sentences found, just truncate
  if (!excerpt) {
    excerpt = cleanContent.substring(0, maxLength).trim()
    
    // Try to end at a word boundary
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace)
    }
  }

  return excerpt + (excerpt.length >= maxLength ? '...' : '')
}

export function generateSitemap(posts: Post[], baseUrl: string = SITE_CONFIG.url): string {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/projects', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/search', priority: '0.7', changefreq: 'weekly' }
  ]

  const staticUrls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')

  const postUrls = posts
    .filter(post => post.published !== false)
    .map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${post.date ? new Date(post.date).toISOString() : new Date().toISOString()}</lastmod>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`
}

export function generateRobotsTxt(baseUrl: string = SITE_CONFIG.url): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin/private areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /.*

# Allow specific important pages
Allow: /blog
Allow: /projects
Allow: /about
Allow: /search`
}

export function optimizeImages(content: string): string {
  // Add loading="lazy" to images and optimize alt text
  return content.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, alt, src) => {
      const optimizedAlt = alt || 'Blog post image'
      return `![${optimizedAlt}](${src})`
    }
  )
}

export function addInternalLinks(content: string, allPosts: Post[]): string {
  // Simple internal linking - look for mentions of other post titles
  let optimizedContent = content
  
  allPosts.forEach(post => {
    const titleRegex = new RegExp(`\\b${post.title}\\b`, 'gi')
    const link = `[${post.title}](/blog/${post.slug})`
    
    // Only replace if not already a link
    if (!optimizedContent.includes(link)) {
      optimizedContent = optimizedContent.replace(titleRegex, link)
    }
  })
  
  return optimizedContent
}

export { SITE_CONFIG }