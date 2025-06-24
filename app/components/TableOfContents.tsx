'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListBulletIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { TocItem, getHeadingElements, getCurrentActiveHeading, scrollToHeading } from '@/app/utils/tableOfContents'

interface TableOfContentsProps {
  toc: TocItem[]
  className?: string
  showToggle?: boolean
  collapsible?: boolean
  sticky?: boolean
}

interface TocItemComponentProps {
  item: TocItem
  activeId: string | null
  level: number
  onItemClick: (id: string) => void
}

function TocItemComponent({ item, activeId, level, onItemClick }: TocItemComponentProps) {
  const isActive = activeId === item.id
  const hasActiveChild = item.children?.some(child => 
    activeId === child.id || child.children?.some(grandchild => activeId === grandchild.id)
  )

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${level > 0 ? 'ml-4' : ''} 
        ${level > 1 ? 'ml-2' : ''}
      `}
    >
      <button
        onClick={() => onItemClick(item.id)}
        className={`
          group flex items-center w-full text-left py-1 px-2 rounded text-sm 
          transition-all duration-200 font-mono
          ${isActive 
            ? 'text-green-400 bg-green-400/10 border-l-2 border-green-400' 
            : hasActiveChild
            ? 'text-green-300 bg-green-400/5'
            : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
          }
        `}
      >
        <div className={`
          w-1 h-1 mr-2 transition-all duration-200
          ${isActive ? 'bg-green-400' : 'bg-gray-600 group-hover:bg-green-400'}
        `} />
        <span className="flex-1 truncate">{item.title}</span>
        {isActive && (
          <motion.div
            layoutId="activeTocIndicator"
            className="w-1 h-4 bg-green-400 rounded-full ml-2"
          />
        )}
      </button>
      
      {item.children && item.children.length > 0 && (
        <ul className="mt-1">
          {item.children.map((child, index) => (
            <TocItemComponent
              key={child.id || index}
              item={child}
              activeId={activeId}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </motion.li>
  )
}

export default function TableOfContents({ 
  toc, 
  className = "", 
  showToggle = true,
  collapsible = true,
  sticky = true 
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const headingsRef = useRef<HTMLElement[]>([])

  // Track scroll position for active heading
  useEffect(() => {
    const updateActiveHeading = () => {
      if (headingsRef.current.length === 0) {
        headingsRef.current = getHeadingElements()
      }
      
      const currentActive = getCurrentActiveHeading(headingsRef.current)
      setActiveId(currentActive)
    }

    const handleScroll = () => {
      updateActiveHeading()
      
      // Hide TOC when scrolling down, show when scrolling up
      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY > (handleScroll as typeof handleScroll & {lastScrollY: number}).lastScrollY ? 'down' : 'up'
      
      if (scrollDirection === 'down' && currentScrollY > 200) {
        setIsVisible(false)
      } else if (scrollDirection === 'up') {
        setIsVisible(true)
      }
      
      (handleScroll as typeof handleScroll & {lastScrollY: number}).lastScrollY = currentScrollY
    }
    
    // Initialize
    updateActiveHeading()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleItemClick = (id: string) => {
    scrollToHeading(id)
    setActiveId(id)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (!toc || toc.length === 0) {
    return null
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.7,
        x: isVisible ? 0 : 10
      }}
      transition={{ duration: 0.3 }}
      className={`
        ${sticky ? 'sticky top-8' : ''} 
        ${className}
      `}
    >
      <div className="pixel-border bg-gray-900/80 backdrop-blur-sm max-h-[calc(100vh-8rem)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <ListBulletIcon className="h-4 w-4 text-green-400" />
            <h3 className="font-mono text-sm text-green-400">Contents</h3>
          </div>
          
          {showToggle && collapsible && (
            <button
              onClick={toggleCollapse}
              className="
                p-1 text-gray-400 hover:text-green-400 
                transition-colors duration-200 pixel-hover
              "
              aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronUpIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <nav aria-label="Table of contents">
                  <ul className="space-y-1">
                    {toc.map((item, index) => (
                      <TocItemComponent
                        key={item.id || index}
                        item={item}
                        activeId={activeId}
                        level={0}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
            style={{
              scaleX: activeId ? (headingsRef.current.findIndex(h => h.id === activeId) + 1) / headingsRef.current.length : 0
            }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.aside>
  )
}