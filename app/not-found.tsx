'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, RefreshCw, Search } from 'lucide-react'
import TypewriterText from './components/TypewriterText'
import ScrollReveal from './components/ScrollReveal'
import PixelButton, { GhostButton, SecondaryButton } from './components/PixelButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated pixel background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-400/20 rounded-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center z-10">
        {/* Pixel Art 404 */}
        <ScrollReveal animation="scaleIn">
          <div className="mb-8">
            <div className="inline-block bg-gray-800 border-2 border-red-400 p-8 rounded-lg relative">
              {/* Glitch effect overlay */}
              <motion.div
                className="absolute inset-0 bg-red-400/10 rounded-lg"
                animate={{
                  opacity: [0, 0.3, 0, 0.2, 0],
                  x: [0, 2, -1, 1, 0],
                  y: [0, -1, 2, -1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  times: [0, 0.1, 0.2, 0.3, 1]
                }}
              />
              
              {/* ASCII Art 404 */}
              <div className="font-mono text-red-400 text-2xl md:text-3xl leading-tight relative z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {'┌─┐ ┌─┐ ┌─┐'}<br/>
                  {'│ │ │ │ │ │'}<br/>
                  {'└─┘ └─┘ └─┘'}<br/>
                  <div className="text-sm mt-2 text-red-300/80">
                    SYSTEM ERROR 404
                  </div>
                </motion.div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-none"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-none"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400 rounded-none"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-400 rounded-none"></div>
            </div>
          </div>
        </ScrollReveal>

        {/* Error Messages */}
        <ScrollReveal animation="fadeInUp" delay={0.3}>
          <h1 className="text-3xl md:text-4xl pixel-head mb-4 text-red-400">
            <TypewriterText 
              text="PAGE NOT FOUND" 
              speed={100}
              delay={800}
              cursor={true}
              cursorChar="█"
            />
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fadeInUp" delay={0.6}>
          <p className="text-gray-300 text-lg mb-2">
            The requested resource could not be located in the system database.
          </p>
          <p className="text-gray-500 text-sm font-mono mb-8">
            Error Code: PIXEL_WISDOM_404_MODULE_NOT_FOUND
          </p>
        </ScrollReveal>

        {/* Pixel Art Illustration */}
        <ScrollReveal animation="scaleIn" delay={0.9}>
          <div className="mb-8 flex justify-center">
            <div className="grid grid-cols-8 gap-1 w-32 h-32">
              {/* Simple pixel robot illustration */}
              {[
                0,0,1,1,1,1,0,0,
                0,1,1,2,2,1,1,0,  
                1,1,2,1,1,2,1,1,
                1,1,1,1,1,1,1,1,
                0,1,1,0,0,1,1,0,
                0,0,1,1,1,1,0,0,
                0,0,1,0,0,1,0,0,
                0,1,1,0,0,1,1,0
              ].map((pixel, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-none ${
                    pixel === 0 ? 'bg-transparent' :
                    pixel === 1 ? 'bg-gray-400' :
                    'bg-red-400'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.2 + (i * 0.02),
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fadeInUp" delay={1.2}>
          <p className="text-gray-400 text-sm mb-8 font-mono">
            [ROBOT.EXE] "I searched everywhere, but this page seems to have been deleted by a rogue semicolon."
          </p>
        </ScrollReveal>

        {/* Action Buttons */}
        <ScrollReveal animation="fadeInUp" delay={1.5}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PixelButton
              href="/"
              variant="primary"
              size="lg"
              icon={Home}
              iconPosition="left"
              pixelEffect={true}
              glowEffect={true}
              pressEffect={true}
            >
              Return Home
            </PixelButton>

            <GhostButton
              href="/blog"
              size="lg"
              icon={Search}
              iconPosition="left"
              pixelEffect={true}
              glowEffect={true}
              pressEffect={true}
            >
              Browse Blog
            </GhostButton>

            <SecondaryButton
              onClick={() => window.location.reload()}
              size="lg"
              icon={RefreshCw}
              iconPosition="left"
              pixelEffect={true}
              glowEffect={false}
              pressEffect={true}
              whileHover={{ 
                scale: 1.05,
                rotate: 180
              }}
            >
              Reload
            </SecondaryButton>
          </div>
        </ScrollReveal>

        {/* Debug Info */}
        <ScrollReveal animation="fadeInUp" delay={1.8}>
          <div className="mt-12 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
            <details className="font-mono text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-green-400 transition-colors">
                [DEBUG] System Information
              </summary>
              <div className="mt-2 space-y-1 text-left">
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>Route: {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}</div>
                <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) + '...' : 'Unknown'}</div>
                <div>Status: RESOURCE_NOT_FOUND</div>
                <div>Suggestions: Check URL spelling, navigate using menu</div>
              </div>
            </details>
          </div>
        </ScrollReveal>
      </div>

      {/* Animated scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <motion.div 
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(239, 68, 68, 0.1) 2px,
              rgba(239, 68, 68, 0.1) 4px
            )`
          }}
          animate={{
            backgroundPosition: ['0px 0px', '0px 20px']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  )
}