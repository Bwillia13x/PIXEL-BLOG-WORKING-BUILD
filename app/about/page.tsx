import type { Metadata } from 'next'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn about my background, skills, and passion for AI-driven development.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-pixel mb-8 text-center text-green-400">
        <MatrixTextReveal 
          text="About Me" 
          speed={80}
          delay={300}
          scrambleDuration={250}
          className="inline-block"
        />
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
            <h2 className="text-xl font-pixel mb-4 text-green-400">Who I Am</h2>
            <p className="font-mono mb-4 text-gray-300">
              Welcome to my digital realm! I&apos;m a passionate developer exploring the intersection of 
              AI, web development, and creative technology.
            </p>
            <p className="font-mono text-gray-300">
              I specialize in building modern applications with Next.js, React, and TypeScript, 
              with a growing focus on AI-driven development tools and workflows.
            </p>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
            <h2 className="text-xl font-pixel mb-4 text-green-400">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-2">
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">Next.js</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">React</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">TypeScript</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">Tailwind</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">Node.js</span>
              <span className="inline-block px-2 py-1 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors">AI/LLM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <h2 className="text-xl font-pixel mb-4 text-green-400">My Journey</h2>
        <p className="font-mono mb-4 text-gray-300">
          My development journey has been driven by curiosity and a love for problem-solving. 
          I&apos;m particularly fascinated by how AI tools like Cursor and Windsurf are transforming 
          the development experience.
        </p>
        <p className="font-mono text-gray-300">
          When I&apos;m not coding, you&apos;ll find me experimenting with pixel art, exploring new 
          frameworks, or writing about the latest developments in tech.
        </p>
      </div>

      {/* TODO: Add profile image, resume download link, social links */}
    </div>
  )
}
