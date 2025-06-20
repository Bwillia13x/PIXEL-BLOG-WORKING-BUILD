'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../Providers'

interface PostStatus {
  id: string
  name: string
  color: string
  icon: string
  description: string
}

interface PublishSettings {
  status: string
  publishDate?: Date
  scheduleEnabled: boolean
  notifySubscribers: boolean
  socialMediaShare: boolean
  updateSitemap: boolean
  generateSummary: boolean
  seoOptimization: boolean
}

interface PublishWorkflowProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  onPublishSettingsChange: (settings: PublishSettings) => void
  onPublish: () => Promise<void>
  onSave: () => Promise<void>
  isLoading?: boolean
  canPublish?: boolean
  className?: string
}

interface WorkflowAction {
  id: string
  name: string
  icon: string
  description: string
  action: () => void
  disabled?: boolean
  loading?: boolean
}

const POST_STATUSES: PostStatus[] = [
  {
    id: 'draft',
    name: 'Draft',
    color: '#6b7280',
    icon: '📝',
    description: 'Work in progress, not visible to public'
  },
  {
    id: 'review',
    name: 'In Review',
    color: '#f59e0b',
    icon: '👀',
    description: 'Ready for review and feedback'
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    color: '#3b82f6',
    icon: '⏰',
    description: 'Scheduled for future publication'
  },
  {
    id: 'published',
    name: 'Published',
    color: '#10b981',
    icon: '✅',
    description: 'Live and visible to public'
  },
  {
    id: 'archived',
    name: 'Archived',
    color: '#ef4444',
    icon: '📦',
    description: 'Archived and hidden from public'
  }
]

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const getMinDateTime = (): string => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes from now
  return now.toISOString().slice(0, 16)
}

export default function PublishWorkflow({
  currentStatus,
  onStatusChange,
  onPublishSettingsChange,
  onPublish,
  onSave,
  isLoading = false,
  canPublish = true,
  className = ''
}: PublishWorkflowProps) {
  const { theme } = useTheme()
  
  const [publishSettings, setPublishSettings] = useState<PublishSettings>({
    status: currentStatus,
    scheduleEnabled: false,
    notifySubscribers: true,
    socialMediaShare: true,
    updateSitemap: true,
    generateSummary: true,
    seoOptimization: true
  })
  
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const currentStatusData = POST_STATUSES.find(s => s.id === currentStatus)

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (saveStatus === 'saving') return
    
    setSaveStatus('saving')
    try {
      await onSave()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [onSave, saveStatus])

  // Update publish settings when they change
  useEffect(() => {
    onPublishSettingsChange(publishSettings)
  }, [publishSettings, onPublishSettingsChange])

  const updateSettings = (updates: Partial<PublishSettings>) => {
    setPublishSettings(prev => ({ ...prev, ...updates }))
  }

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'scheduled' && !publishSettings.scheduleEnabled) {
      updateSettings({ scheduleEnabled: true })
    }
    
    updateSettings({ status: newStatus })
    onStatusChange(newStatus)
  }

  const handlePublish = async () => {
    try {
      await onPublish()
      setConfirmAction(null)
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  const workflowActions: WorkflowAction[] = [
    {
      id: 'save-draft',
      name: 'Save Draft',
      icon: '💾',
      description: 'Save current changes as draft',
      action: handleAutoSave,
      disabled: isLoading || saveStatus === 'saving'
    },
    {
      id: 'preview',
      name: 'Preview',
      icon: '👁️',
      description: 'Preview how the post will look',
      action: () => {
        // Open preview in new tab
        window.open('/preview', '_blank')
      }
    },
    {
      id: 'submit-review',
      name: 'Submit for Review',
      icon: '📋',
      description: 'Submit post for editorial review',
      action: () => handleStatusChange('review'),
      disabled: currentStatus === 'review' || currentStatus === 'published'
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: '⏰',
      description: 'Schedule post for future publication',
      action: () => {
        updateSettings({ scheduleEnabled: true })
        handleStatusChange('scheduled')
      },
      disabled: currentStatus === 'published'
    },
    {
      id: 'publish-now',
      name: 'Publish Now',
      icon: '🚀',
      description: 'Publish post immediately',
      action: () => setConfirmAction('publish'),
      disabled: !canPublish || isLoading
    }
  ]

  const getStatusIcon = (status: string) => {
    return POST_STATUSES.find(s => s.id === status)?.icon || '📄'
  }

  const getStatusColor = (status: string) => {
    return POST_STATUSES.find(s => s.id === status)?.color || '#6b7280'
  }

  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return { icon: '⏳', text: 'Saving...', color: '#f59e0b' }
      case 'saved':
        return { icon: '✅', text: 'Saved', color: '#10b981' }
      case 'error':
        return { icon: '❌', text: 'Save failed', color: '#ef4444' }
      default:
        return { icon: '💾', text: 'Auto-save', color: '#6b7280' }
    }
  }

  const saveIndicator = getSaveStatusIndicator()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Status */}
      <div className="pixel-border bg-gray-900/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentStatusData?.icon}</span>
            <div>
              <div className="font-pixel text-lg" style={{ color: currentStatusData?.color }}>
                {currentStatusData?.name}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {currentStatusData?.description}
              </div>
            </div>
          </div>
          
          {/* Save Status */}
          <div className="flex items-center space-x-2 text-sm font-mono" style={{ color: saveIndicator.color }}>
            <span>{saveIndicator.icon}</span>
            <span>{saveIndicator.text}</span>
          </div>
        </div>

        {/* Status Options */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {POST_STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusChange(status.id)}
              className={`
                p-3 rounded-lg text-center transition-all duration-200 pixel-border-sm
                ${currentStatus === status.id
                  ? 'bg-opacity-30 border-2'
                  : 'bg-gray-800/40 hover:bg-gray-700/40 border border-gray-600'
                }
              `}
              style={{
                backgroundColor: currentStatus === status.id ? `${status.color}30` : undefined,
                borderColor: currentStatus === status.id ? status.color : undefined
              }}
            >
              <div className="text-lg mb-1">{status.icon}</div>
              <div className="text-xs font-mono" style={{ color: status.color }}>
                {status.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Settings */}
      {(publishSettings.scheduleEnabled || currentStatus === 'scheduled') && (
        <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl">⏰</span>
            <span className="font-pixel text-green-400">Schedule Publication</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                min={getMinDateTime()}
                value={publishSettings.publishDate?.toISOString().slice(0, 16) || ''}
                onChange={(e) => updateSettings({ 
                  publishDate: e.target.value ? new Date(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-green-400/30 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-green-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-mono text-gray-400">
                Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </label>
              {publishSettings.publishDate && (
                <div className="text-sm font-mono text-green-400">
                  Will publish: {formatDateTime(publishSettings.publishDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Publishing Options */}
      <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <span className="font-pixel text-green-400">Publishing Options</span>
          </div>
          
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm font-mono text-gray-400 hover:text-green-400 transition-colors"
          >
            {showAdvancedOptions ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Basic Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={publishSettings.notifySubscribers}
                onChange={(e) => updateSettings({ notifySubscribers: e.target.checked })}
                className="pixel-checkbox"
              />
              <span className="text-sm font-mono text-gray-300">Notify subscribers</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={publishSettings.socialMediaShare}
                onChange={(e) => updateSettings({ socialMediaShare: e.target.checked })}
                className="pixel-checkbox"
              />
              <span className="text-sm font-mono text-gray-300">Share on social media</span>
            </label>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={publishSettings.updateSitemap}
                  onChange={(e) => updateSettings({ updateSitemap: e.target.checked })}
                  className="pixel-checkbox"
                />
                <span className="text-sm font-mono text-gray-300">Update sitemap</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={publishSettings.generateSummary}
                  onChange={(e) => updateSettings({ generateSummary: e.target.checked })}
                  className="pixel-checkbox"
                />
                <span className="text-sm font-mono text-gray-300">Generate AI summary</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={publishSettings.seoOptimization}
                  onChange={(e) => updateSettings({ seoOptimization: e.target.checked })}
                  className="pixel-checkbox"
                />
                <span className="text-sm font-mono text-gray-300">SEO optimization</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {workflowActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            disabled={action.disabled || isLoading}
            className={`
              flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-200 pixel-border
              ${action.disabled || isLoading
                ? 'bg-gray-800/20 text-gray-600 cursor-not-allowed border-gray-700'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-green-400 border-gray-600 hover:border-green-400'
              }
            `}
            title={action.description}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-xs font-mono text-center">{action.name}</span>
          </button>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="pixel-border bg-gray-900/95 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="text-3xl">🚀</div>
              <div className="font-pixel text-lg text-green-400">
                Confirm Publication
              </div>
              <div className="text-sm text-gray-300 font-mono">
                Are you sure you want to publish this post? This action will make it live and visible to all readers.
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors font-mono text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors font-mono text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Timeline */}
      <div className="pixel-border bg-gray-800/40 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl">📈</span>
          <span className="font-pixel text-green-400">Workflow Progress</span>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto">
          {POST_STATUSES.slice(0, 4).map((status, index) => (
            <div key={status.id} className="flex items-center space-x-2 min-w-max">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200
                  ${POST_STATUSES.findIndex(s => s.id === currentStatus) >= index
                    ? 'text-white'
                    : 'text-gray-500'
                  }
                `}
                style={{
                  backgroundColor: POST_STATUSES.findIndex(s => s.id === currentStatus) >= index 
                    ? status.color 
                    : '#374151'
                }}
              >
                {status.icon}
              </div>
              <span 
                className={`text-xs font-mono min-w-max ${
                  POST_STATUSES.findIndex(s => s.id === currentStatus) >= index 
                    ? 'text-green-400' 
                    : 'text-gray-500'
                }`}
              >
                {status.name}
              </span>
              {index < 3 && (
                <div 
                  className={`w-8 h-0.5 ${
                    POST_STATUSES.findIndex(s => s.id === currentStatus) > index 
                      ? 'bg-green-400' 
                      : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}