import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import { MatrixTextReveal } from '@/app/components/design-system/PixelAnimations'
import { CircuitParallax } from '../components/ParallaxBackground'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me for collaborations, questions, or just to say hello!',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Parallax Background */}
      <CircuitParallax intensity="subtle" />
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-pixel mb-8 text-center text-green-400">
        <MatrixTextReveal 
          text="Get In Touch" 
          speed={75}
          delay={300}
          scrambleDuration={250}
          className="inline-block"
        />
      </h1>
      
      <div className="mb-8 text-center">
        <p className="font-readable text-lg text-gray-300">
          Whether you have a project idea, want to collaborate, or just want to chat about tech - I&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <h2 className="text-xl font-pixel mb-6 text-green-400">Let&apos;s Connect</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-readable text-sm text-gray-400">Email</p>
                <p className="font-readable text-gray-300">hello@pixelwisdom.dev</p>
              </div>
            </div>
            
            {/* Social Links - Configure in site config */}
            <div className="text-center p-4 bg-gray-700 rounded border border-gray-600">
              <p className="font-readable text-sm text-gray-300 mb-2">Connect with me:</p>
              <p className="font-readable text-xs text-gray-400">
                Social links will be added here once configured in the site settings.
              </p>
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

      {/* FAQ Section */}
      <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
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
