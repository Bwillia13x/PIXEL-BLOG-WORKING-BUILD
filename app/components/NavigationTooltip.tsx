'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface NavigationTooltipProps {
  content: string
  shortcut?: string
  isVisible: boolean
  children: ReactNode
}

export default function NavigationTooltip({ 
  content, 
  shortcut, 
  isVisible, 
  children 
}: NavigationTooltipProps) {
  return (
    <div className="relative">
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: -8 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-green-400">{content}</span>
              {shortcut && (
                <span className="px-1.5 py-0.5 bg-green-600/20 border border-green-400/40 rounded text-[10px] font-pixel text-green-300">
                  Alt+{shortcut}
                </span>
              )}
            </div>
            
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-400/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 