'use client'

import Link from 'next/link'
import { CalendarIcon, TagIcon, FolderIcon, LinkIcon } from '@heroicons/react/24/outline'
import { SearchableItem } from '@/app/hooks/useSearch'

interface SearchResultsProps {
  results: SearchableItem[]
  isLoading: boolean
  query: string
}

interface SearchResultItemProps {
  item: SearchableItem
}

function SearchResultItem({ item }: SearchResultItemProps) {
  const isPost = item.type === 'post'
  const href = isPost ? `/blog/${item.slug}` : `/projects/${item.id}`
  
  // Format date
  const formatDate = (date: string | number | undefined) => {
    if (!date) return null
    const d = typeof date === 'number' ? new Date(`${date}-01-01`) : new Date(date)
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: isPost ? 'numeric' : undefined 
    })
  }

  const date = isPost ? item.date : ('year' in item ? item.year : undefined)
  const formattedDate = formatDate(date)

  return (
    <article className="
      pixel-border bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800/60 
      transition-all duration-200 group
    ">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link 
              href={href}
              className="block group-hover:text-green-400 transition-colors duration-200"
            >
              <h3 
                className="font-mono text-lg font-semibold text-white mb-1"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
            </Link>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
              <span className={`
                px-2 py-1 pixel-border text-xs
                ${isPost ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-purple-500/20 text-purple-400 border-purple-500/50'}
              `}>
                {isPost ? 'POST' : 'PROJECT'}
              </span>
              
              {formattedDate && (
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
              )}
              
              {item.category && (
                <div className="flex items-center space-x-1">
                  <FolderIcon className="h-3 w-3" />
                  <span dangerouslySetInnerHTML={{ __html: item.category }} />
                </div>
              )}
            </div>
          </div>
          
          {/* Project-specific info */}
          {!isPost && 'status' in item && (
            <div className={`
              px-2 py-1 text-xs font-mono pixel-border
              ${item.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                'bg-gray-500/20 text-gray-400 border-gray-500/50'}
            `}>
              {item.status.replace('-', ' ').toUpperCase()}
            </div>
          )}
        </div>

        {/* Content Preview */}
        {item.content && (
          <div className="text-sm text-gray-300 leading-relaxed">
            <p 
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ 
                __html: item.content.slice(0, 200) + (item.content.length > 200 ? '...' : '') 
              }} 
            />
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <TagIcon className="h-3 w-3 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 5).map(tag => (
                <span 
                  key={tag}
                  className="
                    px-2 py-0.5 text-xs font-mono bg-gray-800/50 text-gray-400 
                    pixel-border border-gray-600 hover:text-white transition-colors duration-200
                  "
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 5 && (
                <span className="text-xs text-gray-500 font-mono">
                  +{item.tags.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Project Links */}
        {!isPost && (
          <div className="flex items-center space-x-3 pt-2">
            <Link
              href={href}
              className="
                flex items-center space-x-1 text-xs text-green-400 
                hover:text-green-300 transition-colors duration-200 font-mono
              "
            >
              <LinkIcon className="h-3 w-3" />
              <span>View Details</span>
            </Link>
            
            {'demo' in item && item.demo && (
              <a
                href={item.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center space-x-1 text-xs text-cyan-400 
                  hover:text-cyan-300 transition-colors duration-200 font-mono
                "
              >
                <LinkIcon className="h-3 w-3" />
                <span>Live Demo</span>
              </a>
            )}
            
            {'github' in item && item.github && (
              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center space-x-1 text-xs text-gray-400 
                  hover:text-white transition-colors duration-200 font-mono
                "
              >
                <LinkIcon className="h-3 w-3" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="pixel-border bg-gray-900/40 backdrop-blur-sm p-8 max-w-md mx-auto">
        <div className="text-6xl mb-4 font-mono text-gray-600">404</div>
        <h3 className="text-lg font-mono text-white mb-2">No Results Found</h3>
        <p className="text-gray-400 text-sm font-mono mb-4">
          {query 
            ? `No content matches "${query}". Try adjusting your search terms or filters.`
            : 'No content matches your current filters. Try adjusting your selection.'
          }
        </p>
        <div className="text-xs text-gray-500 font-mono space-y-1">
          <p>• Check your spelling</p>
          <p>• Try broader search terms</p>
          <p>• Remove some filters</p>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="pixel-border bg-gray-900/40 backdrop-blur-sm animate-pulse">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-5 bg-gray-700 rounded w-12"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (results.length === 0) {
    return <NoResults query={query} />
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 font-mono">
        {results.length} result{results.length !== 1 ? 's' : ''} found
        {query && <span> for "{query}"</span>}
      </div>
      
      {results.map((item, index) => (
        <SearchResultItem key={`${item.type}-${item.id || item.slug}-${index}`} item={item} />
      ))}
    </div>
  )
}