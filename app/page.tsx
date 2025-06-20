import Link from "next/link"
import { posts } from "./data/posts"

export default function Home() {
  const categories = ["Tech", "Art", "Finance"]

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-pixel mb-4">Welcome to Pixel Wisdom</h2>
        <p className="font-readable text-lg mb-6 max-w-2xl mx-auto">
          Your gateway to modern development, AI-driven tools, and creative coding. 
          Explore projects, read insights, and join the journey through the digital frontier.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/projects"
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors text-center"
          >
            View Projects
          </Link>
          <Link 
            href="/blog"
            className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white font-pixel rounded hover:bg-gray-600 transition-colors text-center"
          >
            Read Blog
          </Link>
        </div>
      </section>

      {/* Latest Content Highlights */}
      <section className="mb-12">
        <h2 className="text-3xl font-pixel mb-6">Latest Pixelated Wisdom</h2>
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-pixel mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts
                .filter((post) => post.category === category)
                .slice(0, 3)
                .map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <h4 className="text-lg font-pixel mb-2">{post.title}</h4>
                    <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-retro rounded">
                      {post.category}
                    </span>
                  </Link>
                ))}
            </div>
            <Link href={`/category/${category.toLowerCase()}`} className="inline-block mt-4 font-pixel text-sm text-white underline hover:text-green-400 transition-colors">
              See all {category} posts
            </Link>
          </div>
        ))}
      </section>

      {/* Quick Navigation to New Sections */}
      <section className="grid md:grid-cols-3 gap-6">
        <Link href="/about" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors text-center">
          <h3 className="font-pixel text-lg mb-2">About Me</h3>
          <p className="font-readable text-sm text-gray-300">
            Learn about my background and passion for AI-driven development
          </p>
        </Link>
        <Link href="/projects/current" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors text-center">
          <h3 className="font-pixel text-lg mb-2">Current Work</h3>
          <p className="font-readable text-sm text-gray-300">
            See what I&apos;m building right now and what&apos;s coming next
          </p>
        </Link>
        <Link href="/contact" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors text-center">
          <h3 className="font-pixel text-lg mb-2">Get In Touch</h3>
          <p className="font-readable text-sm text-gray-300">
            Have a project idea or want to collaborate? Let&apos;s talk!
          </p>
        </Link>
      </section>
    </div>
  )
}
