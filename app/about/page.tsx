import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn about my background, skills, and passion for AI-driven development.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-pixel mb-8 text-center">About Me</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-pixel mb-4">Who I Am</h2>
            <p className="font-mono mb-4">
              Welcome to my digital realm! I&apos;m a passionate developer exploring the intersection of 
              AI, web development, and creative technology.
            </p>
            <p className="font-mono">
              I specialize in building modern applications with Next.js, React, and TypeScript, 
              with a growing focus on AI-driven development tools and workflows.
            </p>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-pixel mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-2">
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">Next.js</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">React</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">TypeScript</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">Tailwind</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">Node.js</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded">AI/LLM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-pixel mb-4">My Journey</h2>
        <p className="font-mono mb-4">
          My development journey has been driven by curiosity and a love for problem-solving. 
          I&apos;m particularly fascinated by how AI tools like Cursor and Windsurf are transforming 
          the development experience.
        </p>
        <p className="font-mono">
          When I&apos;m not coding, you&apos;ll find me experimenting with pixel art, exploring new 
          frameworks, or writing about the latest developments in tech.
        </p>
      </div>

      {/* TODO: Add profile image, resume download link, social links */}
    </div>
  )
}
