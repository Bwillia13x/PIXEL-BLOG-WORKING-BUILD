import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post } from '@/app/types/Post'
import { generatePostSEO } from '@/app/utils/seo'
import BlogPostLayout from '@/app/components/BlogPostLayout'

// Function to get all posts from the file system
async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog')
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const files = fs.readdirSync(postsDirectory)
  const posts: Post[] = []

  for (const file of files) {
    if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
      continue
    }

    try {
      const fullPath = path.join(postsDirectory, file)
      const slug = file.replace(/\.mdx?$/, '')
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const post: Post = {
        id: slug,
        slug,
        title: data.title || slug,
        category: data.category || 'Blog',
        date: data.date,
        content,
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: data.excerpt,
        readTime: data.readTime || `${Math.ceil(content.split(' ').length / 200)} min read`,
        published: data.published !== false,
      }

      if (post.published) {
        posts.push(post)
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error)
    }
  }

  return posts
}

// Function to get a single post by slug
async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find(p => p.slug === slug) || null
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const seoData = generatePostSEO(post)
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
    robots: seoData.robots,
    alternates: {
      canonical: seoData.canonical
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <BlogPostLayout
        post={post}
        enableComments={true} // Comments system enabled with full API integration
        enableAnalytics={true}
        showRelatedPosts={true}
        showSocialShare={true}
      />
      
      {/* Back to Blog Link */}
      <div className="mt-12 pt-8 border-t border-gray-700 text-center">
        <Link 
          href="/blog" 
          className="
            inline-flex items-center space-x-2 px-4 py-2 
            pixel-border bg-gray-900/60 text-green-400 
            hover:bg-gray-800/60 transition-colors duration-200 font-mono text-sm
          "
        >
          <span>← Back to Blog</span>
        </Link>
      </div>
    </div>
  )
}
