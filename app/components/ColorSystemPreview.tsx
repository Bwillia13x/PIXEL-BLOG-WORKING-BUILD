"use client"

import { motion } from 'framer-motion'
import { Zap, Sunset, Palette, Code, Terminal, Cpu } from 'lucide-react'

interface ColorSystemPreviewProps {
  className?: string
}

const COLOR_SYSTEMS = {
  neonGreen: {
    id: 'neon-green',
    name: 'Neon Green',
    description: 'Classic matrix-inspired terminal aesthetic',
    icon: Zap,
    colors: {
      primary: '#00ff41',
      secondary: '#00cc33',
      accent: '#008822',
      background: '#000000',
      surface: '#0f0f0f',
      text: '#00ff41'
    },
    features: ['Matrix vibes', 'High contrast', 'Terminal feel', 'Classic retro']
  },
  cyberSunset: {
    id: 'cyber-sunset',
    name: 'Cyber Sunset',
    description: 'Vibrant magenta and orange cyberpunk atmosphere',
    icon: Sunset,
    colors: {
      primary: '#ff0080',
      secondary: '#ff6600',
      accent: '#8000ff',
      background: '#000000',
      surface: '#1f0f15',
      text: '#ff0080'
    },
    features: ['Cyberpunk energy', 'Warm gradients', 'Dynamic feel', 'Modern edge']
  }
}

export default function ColorSystemPreview({ className = '' }: ColorSystemPreviewProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 ${className}`}>
      {Object.entries(COLOR_SYSTEMS).map(([key, system]) => (
        <motion.div
          key={system.id}
          className="relative overflow-hidden rounded-lg border-2 transition-all duration-300"
          style={{
            borderColor: `${system.colors.primary}40`,
            backgroundColor: `${system.colors.background}90`
          }}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: key === 'neonGreen' ? 0 : 0.2 }}
        >
          {/* Background gradient */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${system.colors.primary}20, ${system.colors.secondary}20, ${system.colors.accent}20)`
            }}
          />

          {/* Header */}
          <div className="relative z-10 p-6 border-b" style={{ borderColor: `${system.colors.primary}30` }}>
            <div className="flex items-center space-x-3 mb-3">
              <system.icon 
                className="w-8 h-8" 
                style={{ color: system.colors.primary }}
              />
              <div>
                <h3 
                  className="text-xl font-pixel font-bold"
                  style={{ color: system.colors.primary }}
                >
                  {system.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {system.description}
                </p>
              </div>
            </div>
          </div>

          {/* Color palette */}
          <div className="relative z-10 p-6">
            <h4 
              className="text-sm font-pixel font-semibold mb-3"
              style={{ color: system.colors.primary }}
            >
              Color Palette
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Object.entries(system.colors).slice(0, 6).map(([name, color]) => (
                <div key={name} className="text-center">
                  <motion.div
                    className="w-full h-12 rounded border-2 mb-2"
                    style={{ 
                      backgroundColor: color,
                      borderColor: system.colors.primary
                    }}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="text-xs font-mono text-gray-400 capitalize">
                    {name}
                  </div>
                  <div className="text-xs font-mono" style={{ color: system.colors.primary }}>
                    {color}
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <h4 
              className="text-sm font-pixel font-semibold mb-3"
              style={{ color: system.colors.primary }}
            >
              Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {system.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-2 text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: system.colors.primary }}
                  />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Mock interface elements */}
            <div className="mt-6">
              <h4 
                className="text-sm font-pixel font-semibold mb-3"
                style={{ color: system.colors.primary }}
              >
                UI Preview
              </h4>
              <div className="space-y-3">
                {/* Button */}
                <motion.button
                  className="w-full px-4 py-2 rounded border-2 font-pixel text-sm transition-all duration-200"
                  style={{
                    borderColor: system.colors.primary,
                    color: system.colors.primary,
                    backgroundColor: `${system.colors.surface}80`
                  }}
                  whileHover={{
                    backgroundColor: `${system.colors.primary}20`,
                    boxShadow: `0 0 20px ${system.colors.primary}40`
                  }}
                >
                  Sample Button
                </motion.button>

                {/* Terminal window */}
                <div 
                  className="p-3 rounded border font-mono text-xs"
                  style={{
                    borderColor: system.colors.primary,
                    backgroundColor: `${system.colors.surface}60`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Terminal className="w-3 h-3" style={{ color: system.colors.primary }} />
                    <span style={{ color: system.colors.primary }}>terminal</span>
                  </div>
                  <div style={{ color: system.colors.secondary }}>
                    $ echo "Hello {system.name}"
                  </div>
                  <div style={{ color: system.colors.text }}>
                    Hello {system.name}
                  </div>
                </div>

                {/* Code block */}
                <div 
                  className="p-3 rounded border font-mono text-xs"
                  style={{
                    borderColor: system.colors.primary,
                    backgroundColor: `${system.colors.surface}60`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-3 h-3" style={{ color: system.colors.primary }} />
                    <span style={{ color: system.colors.primary }}>code.js</span>
                  </div>
                  <div style={{ color: system.colors.accent }}>
                    function <span style={{ color: system.colors.primary }}>init</span>() {'{'}
                  </div>
                  <div style={{ color: system.colors.secondary }}>
                    &nbsp;&nbsp;console.log('<span style={{ color: system.colors.text }}>System ready</span>');
                  </div>
                  <div style={{ color: system.colors.accent }}>
                    {'}'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 100px ${system.colors.primary}10`
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}
    </div>
  )
} 