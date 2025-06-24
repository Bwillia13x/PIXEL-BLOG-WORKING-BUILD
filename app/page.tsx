import Link from "next/link"
import { ClientErrorDisplay } from "./components/ErrorBoundary"
import TypewriterText from "./components/TypewriterText"
import ContentGrid from "./components/ContentGrid"
import PixelButton, { GhostButton } from "./components/PixelButton"

interface Post {
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

interface PostsResponse {
  posts: Post[]
  error?: string
}

async function getPosts(): Promise<PostsResponse> {
  // Always use direct file system access to avoid fetch issues during static generation
  // This works in both development and build time
  try {
    const fs = await import('fs')
    const path = await import('path')
    const matter = await import('gray-matter')
    
    const postsDirectory = path.join(process.cwd(), 'content', 'blog')
    
    if (!fs.existsSync(postsDirectory)) {
      return { posts: [] }
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
        const { data, content } = matter.default(fileContents)
        
        const post: Post = {
          id: slug,
          slug,
          title: data.title || slug,
          category: data.category || 'Blog',
          date: data.date,
          content: content.substring(0, 500),
          tags: Array.isArray(data.tags) ? data.tags : [],
          excerpt: data.excerpt,
          readTime: `${Math.ceil(content.trim().split(/\s+/).length / 200)} min read`,
          published: data.published !== false,
        }
        
        if (post.published) {
          posts.push(post)
        }
      } catch (_error) {
        // Skip invalid files
        continue
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    
    return { posts }
  } catch (_error) {
    return { posts: [] }
  }
}

export default async function Home() {
  const { posts, error } = await getPosts()
  const categories = ["Tech", "Art", "Finance"]

  return (
    <div className="min-h-screen relative">
      {/* Clean Hero Section */}
      <section className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pixel-head mb-8 text-green-400">
          Welcome to Pixel Wisdom
        </h1>
        
        <p className="text-gray-300 max-w-3xl mx-auto mb-16 text-lg sm:text-xl leading-relaxed px-4">
          A developer's journey through AI, finance, and digital innovation.
        </p>

        {/* Simple Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="px-6 py-3 bg-gray-900/40 border border-green-400/30 text-green-400 font-mono text-sm rounded-lg hover:bg-green-400/10 hover:border-green-400 transition-all duration-200"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="mb-16 max-w-4xl mx-auto">
          <ClientErrorDisplay message={error} />
        </section>
      )}

      {/* Content Section */}
      <section className="mb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl pixel-head mb-12 text-green-400 text-center">
          Latest Content
        </h2>
        
        <ContentGrid 
          posts={posts} 
          loading={false} 
          error={error}
        />
      </section>

      {/* Simple footer */}
      <footer className="text-center text-gray-500 text-sm max-w-4xl mx-auto pt-12 border-t border-gray-700/30">
        <p>© 2024 Pixel Wisdom. Built with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  )
}
