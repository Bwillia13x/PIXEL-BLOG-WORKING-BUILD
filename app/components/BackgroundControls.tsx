"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBackgroundSettings } from '../hooks/useBackgroundSettings'

interface BackgroundControlsProps {
  className?: string
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    settings,
    isLoaded,
    toggleBackground,
    toggleLayer,
    setIntensity,
    setPerformance,
    toggleInteractivity,
    resetToDefaults,
    enablePerformanceMode
  } = useBackgroundSettings()

  if (!isLoaded) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-gray-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 min-w-[280px] shadow-lg"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-green-400 font-pixel text-sm">Background Controls</h3>
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-gray-400 hover:text-green-400 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Main Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-gray-300">
                  Enable Background
                </label>
                <button
                  onClick={toggleBackground}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    settings.enabled 
                      ? 'bg-green-600' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {settings.enabled && (
                <>
                  {/* Layer Controls */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-gray-300">Layers</label>
                    <div className="space-y-1">
                      {Object.entries(settings.layers).map(([layer, enabled]) => (
                        <div key={layer} className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 capitalize">
                            {layer === 'matrix' ? 'Matrix Rain' : layer}
                          </span>
                          <button
                            onClick={() => toggleLayer(layer as keyof typeof settings.layers)}
                            className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                              enabled ? 'bg-green-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                              enabled ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intensity */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-gray-300">Intensity</label>
                    <div className="flex gap-1">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setIntensity(level)}
                          className={`flex-1 py-1 px-2 text-xs font-mono rounded transition-colors ${
                            settings.intensity === level
                              ? 'bg-green-600 text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-gray-300">Performance</label>
                    <div className="flex gap-1">
                      {(['optimized', 'balanced', 'quality'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setPerformance(level)}
                          className={`flex-1 py-1 px-2 text-xs font-mono rounded transition-colors ${
                            settings.performance === level
                              ? 'bg-green-600 text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {level === 'optimized' ? 'Fast' : level === 'balanced' ? 'Balanced' : 'Quality'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactivity */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-mono text-gray-300">
                      Mouse Interaction
                    </label>
                    <button
                      onClick={toggleInteractivity}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        settings.interactive 
                          ? 'bg-green-600' 
                          : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        settings.interactive ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-gray-700">
                    <button
                      onClick={enablePerformanceMode}
                      className="w-full py-2 text-xs font-mono bg-yellow-600 text-black rounded hover:bg-yellow-500 transition-colors"
                    >
                      Enable Performance Mode
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 bg-gray-900/95 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
          isOpen ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-green-400'
        }`}
        aria-label="Background settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 8v6m11-7h-6m-8 0H1m15.5-6.5L19 4.5M5 19.5 2.5 17m17 0L17 14.5M7 9.5 4.5 7" />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  )
}

export default BackgroundControls