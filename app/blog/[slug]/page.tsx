import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts } from '@/app/data/posts'
import ReactMarkdown from 'react-markdown'

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160) + '...',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160) + '...',
      type: 'article',
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-pixel mb-4 text-green-400">
            {post.title}
          </h1>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-green-600 text-black text-sm font-retro rounded">
              {post.category}
            </span>
          </div>
        </header>
        
        <div className="prose prose-invert prose-green max-w-none font-readable">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-700">
          <Link 
            href="/blog" 
            className="text-green-400 hover:text-green-300 font-readable underline transition-colors"
          >
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </div>
  )
}
