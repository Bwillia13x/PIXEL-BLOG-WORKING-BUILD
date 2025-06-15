import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  readTime: string
}

interface PostCardProps {
  post: BlogPost
  className?: string
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <article className={`bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors ${className}`}>
      {/* Post Header */}
      <div className="mb-4">
        <h3 className="text-xl font-pixel mb-2 hover:text-green-300 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="font-mono text-sm text-gray-300 mb-3">
          {post.excerpt}
        </p>
      </div>
      
      {/* Tags and Category */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block px-2 py-1 bg-green-600 text-black text-xs font-mono rounded">
          {post.category}
        </span>
        {post.tags.map((tag) => (
          <span key={tag} className="inline-block px-2 py-1 bg-gray-600 text-white text-xs font-mono rounded">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Post Footer */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="px-4 py-2 bg-green-600 text-black font-pixel text-sm rounded hover:bg-green-500 transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}
