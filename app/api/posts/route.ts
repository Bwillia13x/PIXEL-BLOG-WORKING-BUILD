import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextRequest, NextResponse } from 'next/server'

export interface Post {
  id: string
  slug: string
  title: string
  category: string
  date?: string
  content: string
  tags?: string[]
  excerpt?: string
  readTime?: string
  published?: boolean
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

// Simple reading time calculation
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

function getPostData(fileName: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, fileName)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const slug = fileName.replace(/\.mdx?$/, '')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const readTime = data.readTime || calculateReadingTime(content)

    return {
      id: slug,
      slug,
      title: data.title || slug,
      category: data.category || 'Blog',
      date: data.date,
      content: content.substring(0, 500), // Limit content for performance
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt,
      readTime,
      published: data.published !== false,
    }
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if posts directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory not found:', postsDirectory)
      return NextResponse.json([], { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        }
      })
    }

    const files = fs.readdirSync(postsDirectory)
    const posts: Post[] = []

    for (const file of files) {
      // Only process markdown files
      if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
        continue
      }

      const post = getPostData(file)
      if (post && post.published) {
        posts.push(post)
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json(posts, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Error reading posts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load posts',
        message: 'Internal server error'
      }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 