import { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/site-config'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Blog post interface
interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  readTime: string
  published: boolean
  content: string
}

// Function to get all blog posts
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const filenames = fs.readdirSync(postsDirectory)
    
    const posts = filenames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)
        
        return {
          slug: filename.replace('.md', ''),
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          date: data.date || new Date().toISOString().split('T')[0],
          category: data.category || 'General',
          tags: data.tags || [],
          readTime: data.readTime || '5 min read',
          published: data.published !== false, // Default to true
          content
        }
      })
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Function to convert markdown content to plain text for RSS
function markdownToText(markdown: string): string {
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    const posts = await getBlogPosts()
    const baseUrl = siteConfig.url
    const buildDate = new Date().toUTCString()

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icons/icon-512x512.png</url>
      <title>${escapeXml(siteConfig.title)}</title>
      <link>${baseUrl}</link>
      <width>512</width>
      <height>512</height>
    </image>
    <managingEditor>${siteConfig.social?.email || 'hello@pixelwisdom.dev'} (${escapeXml(siteConfig.creator || 'Pixel Wisdom')})</managingEditor>
    <webMaster>${siteConfig.social?.email || 'hello@pixelwisdom.dev'} (${escapeXml(siteConfig.creator || 'Pixel Wisdom')})</webMaster>
    <category>Technology</category>
    <category>Web Development</category>
    <category>AI</category>
    <generator>Next.js RSS Feed Generator</generator>
    ${posts.map(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const postDate = new Date(post.date).toUTCString()
      const contentText = markdownToText(post.content)
      const description = post.excerpt || contentText.substring(0, 300) + '...'

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${postDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('')}
      <content:encoded><![CDATA[
        <h2>${escapeXml(post.title)}</h2>
        <p><strong>Category:</strong> ${escapeXml(post.category)}</p>
        <p><strong>Reading Time:</strong> ${escapeXml(post.readTime)}</p>
        ${post.tags.length > 0 ? `<p><strong>Tags:</strong> ${post.tags.map(tag => escapeXml(tag)).join(', ')}</p>` : ''}
        <hr/>
        <div>${post.content}</div>
        <hr/>
        <p><a href="${postUrl}">Read full article on Pixel Wisdom</a></p>
      ]]></content:encoded>
      <author>${siteConfig.social?.email || 'hello@pixelwisdom.dev'} (${escapeXml(siteConfig.creator || 'Pixel Wisdom')})</author>
    </item>`
    }).join('')}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }
}