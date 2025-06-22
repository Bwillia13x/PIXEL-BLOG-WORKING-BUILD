import Link from "next/link"
import { ClientErrorDisplay } from "./components/ErrorBoundary"
import TypewriterText from "./components/TypewriterText"
import ScrollReveal, { PixelReveal, CardReveal, TextReveal } from "./components/ScrollReveal"
import ContentGrid from "./components/ContentGrid"
import PixelButton, { GhostButton } from "./components/PixelButton"
import { GridParallax } from "./components/ParallaxBackground"

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
    <div className="min-h-screen p-8 relative">
      {/* Parallax Background */}
      <GridParallax intensity="subtle" />
      {/* Enhanced Hero Section with scroll reveals */}
      <section className="text-center mb-12">
        <PixelReveal>
                      <h1 className="text-4xl pixel-head mb-4 text-green-400">
            <TypewriterText 
              text="Welcome to Pixel Wisdom" 
              speed={80}
              delay={300}
              cursor={true}
              cursorChar="█"
            />
          </h1>
        </PixelReveal>
        
        <TextReveal delay={0.3}>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            A developer's journey through AI, finance, and digital innovation.
          </p>
        </TextReveal>

        {/* Quick Navigation with staggered reveals */}
        <ScrollReveal animation="fadeInUp" delay={0.6}>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category, index) => (
              <ScrollReveal 
                key={category} 
                animation="scaleIn" 
                delay={0.8 + index * 0.1}
              >
                <GhostButton
                  href={`/category/${category.toLowerCase()}`}
                  size="md"
                  pixelEffect={true}
                  glowEffect={true}
                  pressEffect={true}
                >
                  {category}
                </GhostButton>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Error Message */}
      {error && (
        <PixelReveal>
          <section className="mb-12">
            <ClientErrorDisplay message={error} />
          </section>
        </PixelReveal>
      )}

      {/* Enhanced Content Section */}
      <section className="mb-12">
        <TextReveal>
          <h2 className="text-2xl pixel-head mb-8 text-green-400 text-center">
            <TypewriterText 
              text="Latest Content" 
              speed={60}
              delay={1500}
              cursor={false}
            />
          </h2>
        </TextReveal>
        
        <PixelReveal delay={0.3}>
          <ContentGrid 
            posts={posts} 
            loading={false} 
            error={error}
          />
        </PixelReveal>
      </section>

      {/* Enhanced footer with reveal */}
      <TextReveal delay={0.2}>
        <footer className="text-center text-gray-500 text-sm">
          <p>© 2024 Pixel Wisdom. Built with Next.js and Tailwind CSS.</p>
        </footer>
      </TextReveal>
    </div>
  )
}
