import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts } from '@/app/data/posts'
import { generatePostSEO } from '@/app/utils/seo'
import BlogPostLayout from '@/app/components/BlogPostLayout'

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
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BlogPostLayout
        post={post}
        enableComments={false} // Set to true when ready to enable comments
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
