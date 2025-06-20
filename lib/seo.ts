import { Metadata } from 'next'
import { siteConfig } from './site-config'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  category?: string
  noIndex?: boolean
  canonicalUrl?: string
  alternateUrls?: { url: string; hreflang: string }[]
}

export interface StructuredDataProps {
  type: 'Article' | 'BlogPosting' | 'Person' | 'WebSite' | 'Organization' | 'WebPage' | 'Project' | 'SoftwareApplication'
  data: any
}

/**
 * Generate comprehensive metadata for SEO optimization
 */
export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  category,
  noIndex = false,
  canonicalUrl,
  alternateUrls
}: SEOProps): Metadata {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title

  const fullUrl = url 
    ? `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`
    : siteConfig.url

  const fullImageUrl = image.startsWith('http') 
    ? image 
    : `${siteConfig.url}${image.startsWith('/') ? image : `/${image}`}`

  // Generate keywords
  const keywords = [
    ...siteConfig.keywords,
    ...(tags || []),
    ...(category ? [category] : [])
  ]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: authors?.map(name => ({ name })) || [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl || fullUrl,
      ...(alternateUrls && {
        languages: Object.fromEntries(
          alternateUrls.map(({ url, hreflang }) => [hreflang, url])
        )
      })
    },

    // Open Graph
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
          type: 'image/png'
        }
      ],
      ...(publishedTime && type === 'article' && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: authors || [siteConfig.creator],
        section: category,
        tags
      })
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter ? `@${siteConfig.social.twitter.split('/').pop()}` : undefined,
      creator: siteConfig.social.twitter ? `@${siteConfig.social.twitter.split('/').pop()}` : undefined,
      title: fullTitle,
      description,
      images: [fullImageUrl]
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    // Additional metadata
    category,
    
    // App-specific metadata
    applicationName: siteConfig.name,
    generator: 'Next.js',
    
    // Verification (add your verification codes)
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION || '',
        'facebook-domain-verification': process.env.FACEBOOK_VERIFICATION || ''
      }
    },

    // Format detection
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    }
  }

  return metadata
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData({ type, data }: StructuredDataProps): string {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  // Add common properties based on type
  switch (type) {
    case 'Article':
    case 'BlogPosting':
      return JSON.stringify({
        ...baseStructuredData,
        author: {
          '@type': 'Person',
          name: data.author || siteConfig.creator,
          url: siteConfig.url
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url || siteConfig.url
        }
      })

    case 'Person':
      return JSON.stringify({
        ...baseStructuredData,
        url: siteConfig.url,
        sameAs: Object.values(siteConfig.social).filter(Boolean)
      })

    case 'WebSite':
      return JSON.stringify({
        ...baseStructuredData,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })

    case 'Organization':
      return JSON.stringify({
        ...baseStructuredData,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: Object.values(siteConfig.social).filter(Boolean),
        contactPoint: {
          '@type': 'ContactPoint',
          email: siteConfig.social.email,
          contactType: 'Customer Service'
        }
      })

    case 'WebPage':
      return JSON.stringify({
        ...baseStructuredData,
        url: data.url || siteConfig.url,
        isPartOf: {
          '@type': 'WebSite',
          name: siteConfig.name,
          url: siteConfig.url
        }
      })

    case 'Project':
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        ...baseStructuredData,
        creator: {
          '@type': 'Person',
          name: data.creator || siteConfig.creator,
          url: siteConfig.url
        }
      })

    case 'SoftwareApplication':
      return JSON.stringify({
        ...baseStructuredData,
        author: {
          '@type': 'Person',
          name: data.author || siteConfig.creator,
          url: siteConfig.url
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url
        }
      })

    default:
      return JSON.stringify(baseStructuredData)
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.url}`
    }))
  })
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  })
}

/**
 * Generate blog listing structured data
 */
export function generateBlogListingStructuredData(
  posts: Array<{
    title: string
    url: string
    description: string
    publishedTime: string
    modifiedTime?: string
    image?: string
    author?: string
  }>
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: `${siteConfig.url}/blog`,
    name: `${siteConfig.name} Blog`,
    description: 'Latest blog posts and articles',
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteConfig.url}${post.url}`,
      description: post.description,
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime || post.publishedTime,
      author: {
        '@type': 'Person',
        name: post.author || siteConfig.creator
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url
      },
      ...(post.image && {
        image: {
          '@type': 'ImageObject',
          url: post.image.startsWith('http') ? post.image : `${siteConfig.url}${post.image}`
        }
      })
    }))
  })
}

/**
 * Generate project listing structured data
 */
export function generateProjectListingStructuredData(
  projects: Array<{
    title: string
    url: string
    description: string
    image?: string
    technologies?: string[]
    demo?: string
    github?: string
  }>
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects Portfolio',
    description: 'Collection of development projects and creative works',
    url: `${siteConfig.url}/projects`,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        url: `${siteConfig.url}${project.url}`,
        description: project.description,
        creator: {
          '@type': 'Person',
          name: siteConfig.creator,
          url: siteConfig.url
        },
        ...(project.image && {
          image: {
            '@type': 'ImageObject',
            url: project.image.startsWith('http') ? project.image : `${siteConfig.url}${project.image}`
          }
        }),
        ...(project.technologies && {
          keywords: project.technologies.join(', ')
        }),
        ...(project.demo && {
          workExample: {
            '@type': 'WebSite',
            url: project.demo
          }
        }),
        ...(project.github && {
          codeRepository: project.github
        })
      }
    }))
  })
}

/**
 * Generate video structured data
 */
export function generateVideoStructuredData({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
  url
}: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  embedUrl?: string
  url: string
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    url,
    ...(duration && { duration }),
    ...(embedUrl && { embedUrl }),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    }
  })
}

/**
 * Get estimated reading time for content
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Generate meta tags for performance optimization
 */
export function generatePerformanceMetaTags(): Record<string, string> {
  return {
    // DNS prefetch for external domains
    'dns-prefetch': 'https://fonts.googleapis.com',
    
    // Preconnect to external domains
    'preconnect': 'https://fonts.gstatic.com',
    
    // Resource hints
    'resource-hints': JSON.stringify([
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/pixel-font.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
    ])
  }
}

/**
 * Validate structured data
 */
export function validateStructuredData(jsonLD: string): boolean {
  try {
    const parsed = JSON.parse(jsonLD)
    return parsed['@context'] && parsed['@type']
  } catch {
    return false
  }
}

/**
 * Generate sitemap URLs
 */
export interface SitemapUrl {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export function generateSitemapUrls(): SitemapUrl[] {
  const baseUrls: SitemapUrl[] = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    }
  ]

  return baseUrls
}