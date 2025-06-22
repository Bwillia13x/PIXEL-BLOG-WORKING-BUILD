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
  try {
    // Try to fetch posts, but don't fail if it doesn't work
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/posts`, {
      next: { revalidate: 300 },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.warn(`Failed to fetch posts: ${res.status}`)
      return { posts: [] }
    }
    
    const data = await res.json()
    
    if (data.error) {
      return { posts: [], error: data.error }
    }
    
    if (!Array.isArray(data)) {
      return { posts: [] }
    }
    
    return { posts: data }
  } catch (error) {
    console.warn('Error fetching posts:', error)
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
          <h1 className="text-4xl font-pixel mb-4 text-green-400">
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
          <h2 className="text-2xl font-pixel mb-8 text-green-400 text-center">
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
