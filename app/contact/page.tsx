import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import ContactAnalytics from '../components/ContactAnalytics'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'
import { CircuitParallax } from '../components/ParallaxBackground'
import PageHeader from '@/app/components/PageHeader'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me for collaborations, questions, or just to say hello!',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto relative pb-8">
      {/* Parallax Background */}
      <CircuitParallax intensity="subtle" />
      
      <PageHeader 
        title="Get In Touch"
        subtitle="Whether you have a project idea, want to collaborate, or just want to chat about tech - I'd love to hear from you!"
        animationType="matrix"
        animationSpeed={75}
        subtitleClassName="font-readable text-lg text-gray-300"
      />

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <h2 className="text-xl font-pixel mb-6 text-green-400">Let&apos;s Connect</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-readable text-sm text-gray-400">Email</p>
                <p className="font-readable text-gray-300">hello@pixelwisdom.dev</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="font-readable text-xs text-green-400">Usually responds within 24 hours</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="font-pixel text-sm text-green-400">Find me elsewhere:</h3>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-gray-700 rounded border border-gray-600 hover:border-green-400/50 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm text-gray-300 group-hover:text-green-400">GitHub</span>
                </a>
                
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-gray-700 rounded border border-gray-600 hover:border-green-400/50 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm text-gray-300 group-hover:text-green-400">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-pixel text-sm mb-3 text-green-400">What I&apos;m Looking For</h3>
            <ul className="font-readable text-sm space-y-2 text-gray-300">
              <li>• Collaboration opportunities</li>
              <li>• Interesting project discussions</li>
              <li>• AI development partnerships</li>
              <li>• Tech meetups and events</li>
              <li>• Creative coding challenges</li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>

      {/* Contact Analytics */}
      <div className="mt-12">
        <ContactAnalytics />
      </div>

      {/* FAQ Section */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <h2 className="text-xl font-pixel mb-6 text-green-400">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-pixel text-sm mb-2 text-green-400">How quickly do you respond?</h3>
            <p className="font-readable text-sm text-gray-300">
              I typically respond within 24-48 hours. For urgent matters, please mention it in your subject line.
            </p>
          </div>
          
          <div>
            <h3 className="font-pixel text-sm mb-2 text-green-400">What types of projects are you interested in?</h3>
            <p className="font-readable text-sm text-gray-300">
              I&apos;m particularly interested in AI-driven applications, modern web development, and creative coding projects. Let&apos;s build something amazing together!
            </p>
          </div>
          
          <div>
            <h3 className="font-pixel text-sm mb-2 text-green-400">Do you offer consulting services?</h3>
            <p className="font-readable text-sm text-gray-300">
              Yes! I provide consulting for Next.js development, AI integration, and modern web architecture. Let&apos;s discuss your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
