"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

interface BreadcrumbNavProps {
  className?: string
  showHome?: boolean
  maxItems?: number
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'about': 'About',
  'projects': 'Projects',
  'current': 'Current Projects',
  'blog': 'Blog',
  'contact': 'Contact',
  'portfolio-stress-testing': 'Portfolio Stress Testing',
  'interactive': 'Interactive Projects'
}

const getRouteLabel = (segment: string): string => {
  return routeLabels[segment] || segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ 
  className = '',
  showHome = true,
  maxItems = 4
}) => {
  const pathname = usePathname()
  
  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Add home if requested
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        isCurrentPage: pathname === '/'
      })
    }
    
    // Add each path segment
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label: getRouteLabel(segment),
        href: currentPath,
        isCurrentPage: isLast
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  
  // Don't show breadcrumbs for home page only
  if (breadcrumbs.length <= 1 && pathname === '/') {
    return null
  }

  // Truncate breadcrumbs if too many
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0], // Always show home
        { label: '...', href: '', isCurrentPage: false },
        ...breadcrumbs.slice(-2) // Show last 2 items
      ]
    : breadcrumbs

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={`flex items-center space-x-1 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-1 list-none">
        {displayBreadcrumbs.map((item, index) => (
          <motion.li
            key={`${item.href}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            {/* Separator */}
            {index > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="mx-2"
              >
                <ChevronRight className="w-3 h-3 text-green-400/60" />
              </motion.div>
            )}
            
            {/* Breadcrumb Item */}
            {item.label === '...' ? (
              <span className="text-gray-500 font-mono">...</span>
            ) : item.isCurrentPage ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 font-pixel text-xs px-2 py-1 bg-green-400/10 rounded border border-green-400/30"
                aria-current="page"
              >
                {item.label}
              </motion.span>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center px-2 py-1 rounded transition-all duration-200 hover:bg-gray-800/50 focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                >
                  {/* Home icon for first item */}
                  {index === 0 && showHome && (
                    <Home className="w-3 h-3 mr-1 text-gray-400 group-hover:text-green-400 transition-colors" />
                  )}
                  
                  <span className="font-pixel text-xs text-gray-400 group-hover:text-green-400 transition-colors">
                    {item.label}
                  </span>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-green-400/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId={`breadcrumb-hover-${index}`}
                  />
                </Link>
              </motion.div>
            )}
          </motion.li>
        ))}
      </ol>
      
      {/* Mobile compact view */}
      <div className="md:hidden ml-4">
        {breadcrumbs.length > 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-xs text-gray-400 hover:text-green-400 transition-colors"
            onClick={() => window.history.back()}
          >
            <ChevronRight className="w-3 h-3 rotate-180 mr-1" />
            <span className="font-mono">Back</span>
          </motion.button>
        )}
      </div>
    </nav>
  )
}

export default BreadcrumbNav