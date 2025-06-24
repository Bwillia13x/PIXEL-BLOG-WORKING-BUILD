'use client'

import ScrollReveal, { PixelReveal, CardReveal, TextReveal } from '@/app/components/ScrollReveal'
import PixelButton from '@/app/components/PixelButton'
import TypewriterText from '@/app/components/TypewriterText'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import PageHeader from '@/app/components/PageHeader'
import HeaderSpacer from '@/app/components/HeaderSpacer'

interface TechBadgeProps {
  name: string
  icon?: string
  level?: number
  delay?: number
}

function TechBadge({ name, icon, level = 5, delay = 0 }: TechBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span 
        className="inline-block px-3 py-2 bg-green-600 text-black text-sm font-mono rounded hover:bg-green-500 transition-colors cursor-pointer"
        style={{ textShadow: 'none' }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {name}
      </motion.span>
      
      {/* Skill level indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-green-400/50 rounded px-2 py-1 text-xs font-mono"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < level ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-green-400/50 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface StatsCounterProps {
  label: string
  value: string | number
  suffix?: string
  delay?: number
}

function StatsCounter({ label, value, suffix = '', delay = 0 }: StatsCounterProps) {
  return (
    <ScrollReveal animation="fadeInUp" delay={delay}>
      <div className="text-center p-4 bg-gray-900/60 border border-gray-700/50 rounded-lg hover:border-green-400/30 transition-all duration-300">
        <motion.div 
          className="text-2xl font-pixel text-green-400 mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.2, type: "spring" }}
        >
          <TypewriterText 
            text={`${value}${suffix}`} 
            speed={100}
            delay={delay * 1000 + 500}
            cursor={false}
          />
        </motion.div>
        <div className="text-sm font-mono text-gray-400">{label}</div>
      </div>
    </ScrollReveal>
  )
}

export default function AboutPage() {
  // Remove unused state variable
  // const [activeSection, setActiveSection] = useState('intro')

  const techStack = [
    { name: 'Next.js', icon: '⚡', level: 5 },
    { name: 'React', icon: '⚛️', level: 5 },
    { name: 'TypeScript', icon: '📘', level: 4 },
    { name: 'Tailwind', icon: '🎨', level: 5 },
    { name: 'Node.js', icon: '🟢', level: 4 },
    { name: 'AI/LLM', icon: '🤖', level: 4 },
    { name: 'PostgreSQL', icon: '🐘', level: 3 },
    { name: 'Docker', icon: '🐳', level: 3 },
  ]

  const stats = [
    { label: 'Years Coding', value: 5, suffix: '+' },
    { label: 'Projects Built', value: 50, suffix: '+' },
    { label: 'Coffee Consumed', value: 9999, suffix: '' },
    { label: 'Lines of Code', value: 100, suffix: 'K+' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-8">
      {/* Header Spacer to push content below navigation */}
      <HeaderSpacer />
      
      {/* Hero Section */}
      <PixelReveal>
        <div className="text-center space-y-8">
          <PageHeader 
            title="About Me"
            subtitle="Full-stack developer passionate about AI-driven development, modern web technologies, and creating pixel-perfect digital experiences."
            animationType="matrix"
            animationSpeed={80}
            titleClassName="text-2xl md:text-3xl lg:text-4xl"
            subtitleClassName="text-lg sm:text-xl font-mono text-gray-300 max-w-3xl mx-auto leading-relaxed"
          />

          <ScrollReveal animation="fadeInUp" delay={0.6}>
            <div className="flex flex-wrap justify-center gap-4">
              <PixelButton href="/contact" size="lg" variant="primary" pixelEffect={true}>
                Let&apos;s Connect
              </PixelButton>
              <PixelButton href="/projects" size="lg" variant="ghost" pixelEffect={true}>
                View Work
              </PixelButton>
            </div>
          </ScrollReveal>
        </div>
      </PixelReveal>

      {/* Stats Section */}
      <CardReveal delay={0.2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCounter
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </CardReveal>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Who I Am - Larger section */}
        <CardReveal delay={0.1} className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 h-full">
            <h2 className="text-2xl pixel-head mb-6 text-green-400 flex items-center">
              <span className="mr-3">👋</span>
              Who I Am
            </h2>
            <div className="space-y-4 font-mono text-gray-300 leading-relaxed">
              <p>
                Welcome to my digital realm! I&apos;m <span className="text-green-400 font-semibold">Benjamin Williams</span>, 
                a developer who loves building things that matter. My journey in tech has been driven by curiosity, 
                continuous learning, and a desire to build experiences that make a difference.
              </p>
              <p>
                I specialize in modern web development with a focus on <span className="text-green-400">AI integration</span>, 
                creating intelligent applications and leveraging AI tools for enhanced productivity. When I&apos;m not coding, 
                you&apos;ll find me exploring new technologies or diving deep into the latest developments in AI and machine learning.
              </p>
              <div className="pt-4">
                <h3 className="text-lg font-pixel text-green-400 mb-3">Current Focus</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Exploring AI-driven development workflows
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Building open-source developer tools
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Creating educational content about modern web dev
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardReveal>

        {/* Profile Image/Avatar Section */}
        <CardReveal delay={0.2}>
          <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 h-full">
            <div className="text-center">
              {/* Pixel Art Style Avatar */}
              <motion.div 
                className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-black font-pixel">BW</span>
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
              </motion.div>
              
              <h3 className="font-pixel text-green-400 text-lg mb-2">Benjamin Williams</h3>
              <p className="font-mono text-gray-400 text-sm mb-4">Developer & Creative Technologist</p>
              
              <div className="space-y-2 text-xs font-mono text-gray-400">
                <div className="flex justify-center items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Available for projects
                </div>
                <div>📍 Remote / Global</div>
                <div>🕐 GMT-7 Timezone</div>
              </div>
            </div>
          </div>
        </CardReveal>
      </div>

      {/* Tech Stack */}
      <CardReveal delay={0.3}>
        <div className="bg-gray-800 rounded-lg p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <h2 className="text-2xl pixel-head mb-6 text-green-400 flex items-center">
            <span className="mr-3">🛠️</span>
            Tech Stack & Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map((tech, index) => (
              <TechBadge
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                level={tech.level}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
            <h3 className="font-pixel text-green-400 text-sm mb-3">AI Development Tools</h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-400">
              <span className="px-2 py-1 bg-gray-800 rounded">Cursor IDE</span>
              <span className="px-2 py-1 bg-gray-800 rounded">GitHub Copilot</span>
              <span className="px-2 py-1 bg-gray-800 rounded">Claude API</span>
              <span className="px-2 py-1 bg-gray-800 rounded">OpenAI API</span>
              <span className="px-2 py-1 bg-gray-800 rounded">Windsurf</span>
            </div>
          </div>
        </div>
      </CardReveal>

      {/* My Approach */}
      <CardReveal delay={0.4}>
        <div className="bg-gray-800 rounded-lg p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <h2 className="text-2xl pixel-head mb-6 text-green-400 flex items-center">
            <span className="mr-3">💡</span>
            My Approach
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
                <h3 className="font-pixel text-green-400 text-sm mb-2">🌐 Learning in Public</h3>
                <p className="text-sm font-mono text-gray-300">
                  Sharing knowledge, documenting discoveries, and building community through open source and content creation.
                </p>
              </div>
              <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
                <h3 className="font-pixel text-green-400 text-sm mb-2">🤖 AI-Augmented Development</h3>
                <p className="text-sm font-mono text-gray-300">
                  Leveraging tools like Cursor and Windsurf to enhance productivity while maintaining code quality.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
                <h3 className="font-pixel text-green-400 text-sm mb-2">🎨 Pixel Perfect Design</h3>
                <p className="text-sm font-mono text-gray-300">
                  Attention to detail matters, whether it&apos;s in code architecture or visual design aesthetics.
                </p>
              </div>
              <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
                <h3 className="font-pixel text-green-400 text-sm mb-2">🚀 Open Source</h3>
                <p className="text-sm font-mono text-gray-300">
                  Contributing to and benefiting from the amazing developer community ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardReveal>

      {/* Quote */}
      <TextReveal delay={0.5}>
        <div className="text-center p-8 bg-gradient-to-r from-gray-900/60 via-gray-800/60 to-gray-900/60 rounded-lg border border-green-400/20">
          <blockquote className="text-xl font-mono text-gray-300 italic mb-4">
            &quot;In a world of infinite possibilities, every pixel counts.&quot;
          </blockquote>
          <div className="text-sm font-pixel text-green-400">— Benjamin Williams</div>
        </div>
      </TextReveal>

      {/* CTA Section */}
      <CardReveal delay={0.6}>
        <div className="bg-gradient-to-br from-green-400/10 via-transparent to-green-400/5 rounded-lg p-8 border border-green-400/30 text-center">
          <h2 className="text-2xl pixel-head mb-4 text-green-400">Let&apos;s Build Something Amazing</h2>
          <p className="font-mono text-gray-300 mb-6 max-w-2xl mx-auto">
            I&apos;m always interested in connecting with fellow developers, sharing ideas, and collaborating on interesting projects. 
            Whether you want to discuss the latest in AI development or just chat about tech, I&apos;d love to hear from you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PixelButton href="/contact" size="lg" variant="primary" pixelEffect={true}>
              Get In Touch
            </PixelButton>
            <PixelButton href="/blog" size="lg" variant="ghost" pixelEffect={true}>
              Read My Blog
            </PixelButton>
          </div>
        </div>
      </CardReveal>
    </div>
  )
}
