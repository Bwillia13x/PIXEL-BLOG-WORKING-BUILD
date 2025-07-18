import Link from "next/link"
import { posts } from "../../data/posts"
import { notFound } from "next/navigation"
import HeaderSpacer from "@/app/components/HeaderSpacer"

export async function generateStaticParams() {
  // Get unique categories from posts
  const categories = [...new Set(posts.map(post => post.category.toLowerCase()))]
  
  return categories.map((category) => ({
    slug: category,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = slug.charAt(0).toUpperCase() + slug.slice(1)
  const categoryPosts = posts.filter((post) => post.category.toLowerCase() === slug)

  if (categoryPosts.length === 0) {
    notFound()
  }

  return (
    <div className="pb-8">
      <HeaderSpacer />
      
      <h2 className="text-2xl font-pixel mb-6">{category} Posts</h2>
      <div className="grid gap-6">
        {categoryPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-xl font-pixel mb-2">{post.title}</h3>
            <p className="font-readable text-sm mb-2">{post.content.slice(0, 100)}...</p>
            <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-retro rounded">
              {post.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
