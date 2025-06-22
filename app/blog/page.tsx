import Link from 'next/link'
import { Suspense } from 'react'

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

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
      next: { revalidate: 300 },
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      console.warn(`API returned ${res.status}: ${res.statusText}`)
      return []
    }
    
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Lightweight animated title component
function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="text-4xl md:text-6xl font-pixel mb-6 text-green-400 animate-pulse">
      {text}
    </h1>
  )
}

// Simple post card component
function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-gray-700 rounded-lg p-6 bg-gray-900/80 hover:bg-gray-800/80 transition-all duration-300 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-400/10">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-green-600 text-black text-xs font-retro rounded">
          {post.category}
        </span>
        {post.date && (
          <span className="text-gray-400 text-xs font-mono">
            {new Date(post.date).toLocaleDateString()}
          </span>
        )}
        {post.readTime && (
          <span className="text-green-400 text-xs font-mono">
            {post.readTime}
          </span>
        )}
      </div>
      
      <h2 className="text-xl font-pixel mb-3 text-green-400 hover:text-green-300 transition-colors">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      
      <p className="text-gray-300 font-readable mb-4 leading-relaxed text-sm line-clamp-3">
        {post.excerpt || post.content.substring(0, 150) + '...'}
      </p>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-800 text-green-400 text-xs font-mono rounded border border-green-400/20"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-500 text-xs font-mono">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <Link 
        href={`/blog/${post.slug}`}
        className="inline-flex items-center text-green-400 hover:text-green-300 font-retro text-sm transition-colors"
      >
        Read More
        <span className="ml-1 transition-transform hover:translate-x-1">→</span>
      </Link>
    </article>
  )
}

// Blog stats component
function BlogStats({ posts }: { posts: Post[] }) {
  const categories = [...new Set(posts.map(post => post.category))]
  
  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-pixel text-green-400 mb-4">Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-pixel text-green-400">{posts.length}</div>
          <div className="text-xs text-gray-400 font-mono">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-pixel text-green-400">{categories.length}</div>
          <div className="text-xs text-gray-400 font-mono">Categories</div>
        </div>
      </div>
    </div>
  )
}

// Loading component
function BlogLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-16 bg-gray-800 animate-pulse rounded mb-6"></div>
          <div className="h-6 bg-gray-800 animate-pulse rounded mx-auto max-w-md"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function BlogPage({ searchParams }: { searchParams?: { q?: string } }) {
  let posts = await getPosts()
  // Server-side search filtering via query param ?q=
  if (searchParams?.q) {
    const { searchPosts } = await import('@/app/data/posts')
    posts = searchPosts(posts, searchParams.q)
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <AnimatedTitle text="Blog" />
            <p className="text-lg text-gray-300 font-readable max-w-2xl mx-auto">
              Exploring AI, development, and creative coding through a pixel-perfect lens
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form method="get" className="max-w-md mx-auto px-4 mb-8">
        <input
          type="text"
          name="q"
          defaultValue={searchParams?.q || ''}
          placeholder="Search posts..."
          className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </form>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 rounded-lg border border-green-400/20">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-pixel text-green-400 mb-4">Content Loading...</h3>
                <p className="text-gray-400 font-readable">Posts are being compiled. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {posts[0] && (
                  <section className="mb-16">
                    <h2 className="text-2xl font-pixel text-green-400 mb-8">
                      ► Featured Post
                    </h2>
                    <article className="border border-gray-700 rounded-lg p-8 bg-gray-900/80 hover:bg-gray-800/80 transition-all duration-300 hover:border-green-400/60">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-green-600 text-black text-sm font-retro rounded">
                          {posts[0].category}
                        </span>
                        {posts[0].date && (
                          <span className="text-gray-400 text-sm font-mono">
                            {new Date(posts[0].date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                        {posts[0].readTime && (
                          <span className="text-green-400 text-sm font-mono">
                            {posts[0].readTime}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-3xl font-pixel mb-4 text-green-400">
                        <Link href={`/blog/${posts[0].slug}`}>
                          {posts[0].title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-300 font-readable mb-6 leading-relaxed text-lg">
                        {posts[0].excerpt || posts[0].content.substring(0, 300) + '...'}
                      </p>
                      
                      <Link 
                        href={`/blog/${posts[0].slug}`}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-black font-retro rounded hover:bg-green-500 transition-colors"
                      >
                        Read More
                        <span className="ml-2">→</span>
                      </Link>
                    </article>
                  </section>
                )}

                {/* Regular Posts Grid */}
                {posts.slice(1).length > 0 && (
                  <section>
                    <h2 className="text-2xl font-pixel text-green-400 mb-8">
                      ► All Posts
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {posts.slice(1).map((post) => (
                        <PostCard key={post.slug} post={post} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <BlogStats posts={posts} />
              
              {/* Quick Navigation */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-pixel text-green-400 mb-4">Quick Nav</h3>
                <div className="space-y-2">
                  <Link 
                    href="/projects" 
                    className="block text-sm text-gray-300 hover:text-green-400 transition-colors font-mono"
                  >
                    → View Projects
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block text-sm text-gray-300 hover:text-green-400 transition-colors font-mono"
                  >
                    → Get in Touch
                  </Link>
                  <Link 
                    href="/about" 
                    className="block text-sm text-gray-300 hover:text-green-400 transition-colors font-mono"
                  >
                    → About Me
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
