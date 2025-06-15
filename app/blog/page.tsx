import Link from 'next/link'
import { posts } from '@/app/data/posts'

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-pixel mb-8 text-green-400">
        Blog
      </h1>
      
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-gray-700 rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors">
            <h2 className="text-2xl font-pixel mb-3">
              <Link 
                href={`/blog/${post.slug}`}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-retro rounded">
                {post.category}
              </span>
            </div>
            
            <p className="text-gray-300 font-readable mb-4 leading-relaxed">
              {post.content.substring(0, 200)}...
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
