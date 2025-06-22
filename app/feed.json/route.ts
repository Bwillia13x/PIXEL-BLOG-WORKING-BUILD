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

// JSON Feed 1.1 specification interface
interface JSONFeedItem {
  id: string
  url: string
  title: string
  content_html: string
  content_text: string
  summary: string
  date_published: string
  date_modified?: string
  author: {
    name: string
    url?: string
    avatar?: string
  }
  tags: string[]
  attachments?: Array<{
    url: string
    mime_type: string
    title?: string
  }>
}

interface JSONFeed {
  version: string
  title: string
  home_page_url: string
  feed_url: string
  description: string
  user_comment?: string
  next_url?: string
  icon: string
  favicon: string
  author: {
    name: string
    url?: string
    avatar?: string
  }
  language: string
  items: JSONFeedItem[]
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

// Function to convert markdown content to plain text
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

// Function to convert markdown to basic HTML
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    // Wrap in paragraphs
    .replace(/^(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
}

export async function GET(request: NextRequest) {
  try {
    const posts = await getBlogPosts()
    const baseUrl = siteConfig.url

    // Convert posts to JSON Feed items
    const feedItems: JSONFeedItem[] = posts.map(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const contentHtml = markdownToHtml(post.content)
      const contentText = markdownToText(post.content)
      const summary = post.excerpt || contentText.substring(0, 300) + '...'

      return {
        id: postUrl,
        url: postUrl,
        title: post.title,
        content_html: `
          <h2>${post.title}</h2>
          <p><strong>Category:</strong> ${post.category}</p>
          <p><strong>Reading Time:</strong> ${post.readTime}</p>
          ${post.tags.length > 0 ? `<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>` : ''}
          <hr/>
          ${contentHtml}
          <hr/>
          <p><a href="${postUrl}">Read full article on Pixel Wisdom</a></p>
        `,
        content_text: contentText,
        summary,
        date_published: new Date(post.date).toISOString(),
        author: {
          name: siteConfig.creator || 'Pixel Wisdom',
          url: baseUrl,
          avatar: `${baseUrl}/icons/icon-192x192.png`
        },
        tags: [...post.tags, post.category]
      }
    })

    // Create JSON Feed
    const jsonFeed: JSONFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: siteConfig.title,
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/feed.json`,
      description: siteConfig.description,
      user_comment: 'This feed allows you to read the posts from this site in any feed reader that supports the JSON Feed format. To add this to your reader, copy the following URL — ' + `${baseUrl}/feed.json` + ' — and add it your reader.',
      icon: `${baseUrl}/icons/icon-512x512.png`,
      favicon: `${baseUrl}/icons/favicon-32x32.png`,
      author: {
        name: siteConfig.creator || 'Pixel Wisdom',
        url: baseUrl,
        avatar: `${baseUrl}/icons/icon-192x192.png`
      },
      language: 'en-US',
      items: feedItems
    }

    return new Response(JSON.stringify(jsonFeed, null, 2), {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error generating JSON feed:', error)
    return new Response(JSON.stringify({ 
      error: 'Error generating JSON feed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}