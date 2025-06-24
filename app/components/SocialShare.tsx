'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShareIcon, 
  LinkIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SocialShareProps {
  title: string
  url: string
  description?: string
  hashtags?: string[]
  className?: string
  showLabel?: boolean
  vertical?: boolean
  sticky?: boolean
}

interface SharePlatform {
  name: string
  icon: string
  shareUrl: (title: string, url: string, description?: string, hashtags?: string[]) => string
  color: string
  hoverColor: string
}

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    name: 'Twitter',
    icon: '𝕏',
    shareUrl: (title, url, description, hashtags) => {
      const text = description || title
      const tags = hashtags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(tags)}`
    },
    color: 'text-gray-300',
    hoverColor: 'hover:text-blue-400'
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    shareUrl: (title, url, description) => {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || title)}`
    },
    color: 'text-gray-300',
    hoverColor: 'hover:text-blue-600'
  },
  {
    name: 'Reddit',
    icon: '🤖',
    shareUrl: (title, url) => {
      return `https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    color: 'text-gray-300',
    hoverColor: 'hover:text-orange-500'
  },
  {
    name: 'Hacker News',
    icon: '⚡',
    shareUrl: (title, url) => {
      return `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`
    },
    color: 'text-gray-300',
    hoverColor: 'hover:text-orange-400'
  },
  {
    name: 'Email',
    icon: '📧',
    shareUrl: (title, url, description) => {
      const subject = `Check out: ${title}`
      const body = `I thought you might find this interesting:\n\n${title}\n${description || ''}\n\n${url}`
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },
    color: 'text-gray-300',
    hoverColor: 'hover:text-green-400'
  }
]

interface ShareButtonProps {
  platform: SharePlatform
  shareUrl: string
  vertical: boolean
  delay: number
}

function ShareButton({ platform, shareUrl, vertical, delay }: ShareButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleShare = () => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      onClick={handleShare}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative flex items-center p-2 pixel-border bg-gray-900/60 backdrop-blur-sm
        transition-all duration-200 ${platform.color} ${platform.hoverColor}
        hover:bg-gray-800/60 pixel-hover
        ${vertical ? 'justify-center w-10 h-10' : 'justify-start px-3 py-2 space-x-2'}
      `}
      title={`Share on ${platform.name}`}
      aria-label={`Share on ${platform.name}`}
    >
      <span className="text-lg font-mono">{platform.icon}</span>
      
      {!vertical && (
        <span className="font-mono text-xs">{platform.name}</span>
      )}
      
      {vertical && isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="
            absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white 
            font-mono text-xs pixel-border whitespace-nowrap z-10
          "
        >
          {platform.name}
        </motion.div>
      )}
    </motion.button>
  )
}

function CopyLinkButton({ url, vertical }: { url: string, vertical: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      onClick={handleCopy}
      className={`
        group relative flex items-center p-2 pixel-border bg-gray-900/60 backdrop-blur-sm
        transition-all duration-200 text-gray-300 hover:text-green-400
        hover:bg-gray-800/60 pixel-hover
        ${vertical ? 'justify-center w-10 h-10' : 'justify-start px-3 py-2 space-x-2'}
        ${copied ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
      `}
      title="Copy link"
      aria-label="Copy link to clipboard"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
      
      {!vertical && (
        <span className="font-mono text-xs">
          {copied ? 'Copied!' : 'Copy Link'}
        </span>
      )}
    </motion.button>
  )
}

export default function SocialShare({
  title,
  url,
  description,
  hashtags,
  className = "",
  showLabel = true,
  vertical = false,
  sticky = false
}: SocialShareProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide on scroll when sticky
  useEffect(() => {
    if (!sticky) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollDirection = currentScrollY > (handleScroll as typeof handleScroll & {lastScrollY: number}).lastScrollY ? 'down' : 'up'
          
          if (scrollDirection === 'down' && currentScrollY > 200) {
            setIsVisible(false)
            setIsExpanded(false)
          } else if (scrollDirection === 'up') {
            setIsVisible(true)
          }
          
          (handleScroll as typeof handleScroll & {lastScrollY: number}).lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  // Ensure we have a complete URL
  const fullUrl = typeof window !== 'undefined' && url.startsWith('http') ? url : typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  return (
    <motion.div
      initial={{ opacity: 0, x: vertical ? 20 : 0, y: vertical ? 0 : 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.7, 
        x: vertical ? (isVisible ? 0 : 10) : 0,
        y: vertical ? 0 : (isVisible ? 0 : 10)
      }}
      transition={{ duration: 0.3 }}
      className={`
        ${sticky ? 'sticky top-1/2 transform -translate-y-1/2' : ''}
        ${vertical ? 'flex flex-col space-y-2' : 'flex flex-wrap gap-2'}
        ${className}
      `}
    >
      {showLabel && !vertical && (
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="font-mono text-sm text-green-400 flex items-center">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share this post
          </h3>
        </div>
      )}

      {vertical && sticky ? (
        <>
          {/* Collapsed state - just share icon */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsExpanded(true)}
                className="
                  flex items-center justify-center w-10 h-10 pixel-border 
                  bg-gray-900/80 backdrop-blur-sm text-green-400 
                  hover:bg-gray-800/80 transition-all duration-200 pixel-hover
                "
                title="Share options"
                aria-label="Open share options"
              >
                <ShareIcon className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Expanded state */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {/* Collapse button */}
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  className="
                    flex items-center justify-center w-10 h-10 pixel-border 
                    bg-gray-900/80 backdrop-blur-sm text-gray-400 
                    hover:text-green-400 hover:bg-gray-800/80 transition-all duration-200
                  "
                  title="Close share options"
                  aria-label="Close share options"
                >
                  <XMarkIcon className="h-4 w-4" />
                </motion.button>

                {/* Share buttons */}
                {SHARE_PLATFORMS.map((platform, index) => (
                  <ShareButton
                    key={platform.name}
                    platform={platform}
                    shareUrl={platform.shareUrl(title, fullUrl, description, hashtags)}
                    vertical={true}
                    delay={index * 0.1}
                  />
                ))}

                <CopyLinkButton url={fullUrl} vertical={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Horizontal or always-expanded vertical layout */
        <>
          {SHARE_PLATFORMS.map((platform, index) => (
            <ShareButton
              key={platform.name}
              platform={platform}
              shareUrl={platform.shareUrl(title, fullUrl, description, hashtags)}
              vertical={vertical}
              delay={index * 0.1}
            />
          ))}
          
          <CopyLinkButton url={fullUrl} vertical={vertical} />
        </>
      )}
    </motion.div>
  )
}