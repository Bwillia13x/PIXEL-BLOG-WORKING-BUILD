import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { projects, currentProjects } from '@/content/projects'

// Blog post types (you'll need to adapt this to your content structure)
interface BlogPost {
  slug: string
  title: string
  publishedAt: string
  updatedAt?: string
}

// Function to get blog posts (adapt to your content source)
async function getBlogPosts(): Promise<BlogPost[]> {
  // This would typically come from your CMS, filesystem, or database
  // For now, return empty array - you can implement based on your blog structure
  try {
    // Example implementation - adapt to your needs:
    // const fs = require('fs')
    // const path = require('path')
    // const matter = require('gray-matter')
    
    // const postsDirectory = path.join(process.cwd(), 'content/blog')
    // const filenames = fs.readdirSync(postsDirectory)
    // 
    // return filenames.map(filename => {
    //   const filePath = path.join(postsDirectory, filename)
    //   const fileContents = fs.readFileSync(filePath, 'utf8')
    //   const { data } = matter(fileContents)
    //   
    //   return {
    //     slug: filename.replace('.md', ''),
    //     title: data.title,
    //     publishedAt: data.publishedAt,
    //     updatedAt: data.updatedAt
    //   }
    // })
    
    return []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/enhanced`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/themes/demo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ]

  // Project pages
  const allProjects = [...projects, ...currentProjects]
  const projectPages: MetadataRoute.Sitemap = allProjects.map(project => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.8 : 0.6,
  }))

  // Blog post pages
  const blogPosts = await getBlogPosts()
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Tag pages (if you have a tagging system)
  const allTags = new Set<string>()
  allProjects.forEach(project => {
    project.tags.forEach(tag => allTags.add(tag))
  })

  const tagPages: MetadataRoute.Sitemap = Array.from(allTags).map(tag => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Category pages
  const categories = ['web-development', 'ai-projects', 'tools', 'experiments']
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Archive pages (by year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i) // Last 3 years
  const archivePages: MetadataRoute.Sitemap = years.map(year => ({
    url: `${baseUrl}/archive/${year}`,
    lastModified: currentDate,
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  // RSS and other feeds
  const feedPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/feed.json`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.3,
    }
  ]

  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...tagPages,
    ...categoryPages,
    ...archivePages,
    ...feedPages
  ]
}

// Additional sitemap for images
export async function generateImageSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  // Project images
  const allProjects = [...projects, ...currentProjects]
  const projectImages: MetadataRoute.Sitemap = allProjects
    .filter(project => project.image)
    .map(project => ({
      url: `${baseUrl}${project.image}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }))

  // Static images
  const staticImages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/og-image.png`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/icons/icon-512x512.png`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ]

  return [...projectImages, ...staticImages]
}

// Video sitemap (if you have videos)
export async function generateVideoSitemap(): Promise<any[]> {
  // Return video sitemap data structure
  // This would include project demo videos, tutorial videos, etc.
  return []
}

// News sitemap (for blog posts)
export async function generateNewsSitemap(): Promise<any[]> {
  const blogPosts = await getBlogPosts()
  
  return blogPosts
    .filter(post => {
      // Only include posts from the last 2 days for news sitemap
      const postDate = new Date(post.publishedAt)
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      return postDate > twoDaysAgo
    })
    .map(post => ({
      loc: `${siteConfig.url}/blog/${post.slug}`,
      lastmod: post.updatedAt || post.publishedAt,
      news: {
        publication: {
          name: siteConfig.name,
          language: 'en'
        },
        publication_date: post.publishedAt,
        title: post.title
      }
    }))
}