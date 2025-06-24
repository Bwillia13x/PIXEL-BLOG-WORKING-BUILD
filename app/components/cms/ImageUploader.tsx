'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '../Providers'

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  type: string
  dimensions?: { width: number; height: number }
  optimized?: boolean
  thumbnail?: string
}

interface ImageUploaderProps {
  onUpload: (images: UploadedImage[]) => void
  onError?: (error: string) => void
  maxFiles?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
  autoOptimize?: boolean
  showThumbnails?: boolean
  className?: string
}

interface DragState {
  isDragging: boolean
  isOver: boolean
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_FILE_SIZE = 10 // MB
const PIXEL_FILTERS = [
  { name: 'None', value: 'none' },
  { name: 'Pixelate', value: 'pixelate' },
  { name: 'Retro', value: 'retro' },
  { name: 'Grayscale', value: 'grayscale' },
  { name: 'Green Tint', value: 'green-tint' }
]

export default function ImageUploader({
  onUpload,
  onError,
  maxFiles = 10,
  maxSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_TYPES,
  autoOptimize = true,
  showThumbnails = true,
  className = ''
}: ImageUploaderProps) {
  const { theme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isOver: false
  })
  
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState('none')

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Supported types: ${allowedTypes.join(', ')}`
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${maxSize}MB`
    }
    
    return null
  }, [allowedTypes, maxSize])

  const getDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const optimizeImage = useCallback(async (file: File, filter = 'none'): Promise<{ optimized: File; thumbnail: string }> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) {
        resolve({ optimized: file, thumbnail: '' })
        return
      }

      const img = new Image()
      img.onload = () => {
        // Calculate optimized dimensions
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height

        // Draw and apply filter
        ctx.drawImage(img, 0, 0, width, height)

        // Apply pixel art filters
        switch (filter) {
          case 'pixelate':
            applyPixelateFilter(ctx, width, height, 8)
            break
          case 'retro':
            applyRetroFilter(ctx, width, height)
            break
          case 'grayscale':
            applyGrayscaleFilter(ctx, width, height)
            break
          case 'green-tint':
            applyGreenTintFilter(ctx, width, height)
            break
        }

        // Create optimized image
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })

            // Create thumbnail
            const thumbnailCanvas = document.createElement('canvas')
            const thumbnailCtx = thumbnailCanvas.getContext('2d')
            const thumbnailSize = 150
            
            thumbnailCanvas.width = thumbnailSize
            thumbnailCanvas.height = thumbnailSize
            
            if (thumbnailCtx) {
              const scale = Math.min(thumbnailSize / width, thumbnailSize / height)
              const scaledWidth = width * scale
              const scaledHeight = height * scale
              const x = (thumbnailSize - scaledWidth) / 2
              const y = (thumbnailSize - scaledHeight) / 2
              
              thumbnailCtx.drawImage(canvas, x, y, scaledWidth, scaledHeight)
              const thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.7)
              
              resolve({ optimized: optimizedFile, thumbnail })
            } else {
              resolve({ optimized: optimizedFile, thumbnail: '' })
            }
          } else {
            resolve({ optimized: file, thumbnail: '' })
          }
        }, 'image/jpeg', 0.85)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const applyPixelateFilter = (ctx: CanvasRenderingContext2D, width: number, height: number, pixelSize: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const pixelIndex = (y * width + x) * 4
        const r = data[pixelIndex]
        const g = data[pixelIndex + 1]
        const b = data[pixelIndex + 2]
        const a = data[pixelIndex + 3]

        for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4
            data[index] = r
            data[index + 1] = g
            data[index + 2] = b
            data[index + 3] = a
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyRetroFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Retro color palette
      data[i] = Math.min(255, r * 1.2 + 20)     // Red boost
      data[i + 1] = Math.min(255, g * 0.8)      // Green reduce
      data[i + 2] = Math.min(255, b * 0.6 + 40) // Blue reduce, yellow tint
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyGrayscaleFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyGreenTintFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 0.8)     // Reduce red
      data[i + 1] = Math.min(255, data[i + 1] * 1.2) // Boost green
      data[i + 2] = Math.min(255, data[i + 2] * 0.7) // Reduce blue
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    if (images.length + fileArray.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    setProgress(0)

    const processedImages: UploadedImage[] = []
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const error = validateFile(file)
      
      if (error) {
        onError?.(error)
        continue
      }

      try {
        const dimensions = await getDimensions(file)
        let optimizedFile = file
        let thumbnail = ''

        if (autoOptimize && file.type !== 'image/svg+xml') {
          const result = await optimizeImage(file, selectedFilter)
          optimizedFile = result.optimized
          thumbnail = result.thumbnail
        }

        const uploadedImage: UploadedImage = {
          id: generateId(),
          file: optimizedFile,
          url: URL.createObjectURL(optimizedFile),
          name: file.name,
          size: optimizedFile.size,
          type: optimizedFile.type,
          dimensions,
          optimized: autoOptimize,
          thumbnail
        }

        processedImages.push(uploadedImage)
        setProgress(((i + 1) / fileArray.length) * 100)
      } catch (error) {
        console.error('Error processing file:', error)
        onError?.(`Error processing ${file.name}`)
      }
    }

    const updatedImages = [...images, ...processedImages]
    setImages(updatedImages)
    onUpload(updatedImages)
    
    setUploading(false)
    setProgress(0)
  }, [images, maxFiles, onError, autoOptimize, selectedFilter, getDimensions, validateFile, optimizeImage, onUpload])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState({ isDragging: true, isOver: true })
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState({ isDragging: true, isOver: false })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragState({ isDragging: false, isOver: false })
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onUpload(updatedImages)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-mono text-gray-400">Filter:</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-1 bg-gray-800/60 border border-green-400/30 text-green-400 font-mono text-sm rounded focus:outline-none focus:border-green-400"
        >
          {PIXEL_FILTERS.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragState.isOver 
            ? 'border-green-400 bg-green-400/10' 
            : 'border-green-400/30 hover:border-green-400/60'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-4xl">📸</div>
          <div className="space-y-2">
            <div className="text-lg font-pixel text-green-400">
              {dragState.isOver ? 'Drop images here!' : 'Upload Images'}
            </div>
            <div className="text-sm font-mono text-gray-400">
              Drag & drop images or click to browse
            </div>
            <div className="text-xs font-mono text-gray-500">
              Max {maxFiles} files, {maxSize}MB each
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
            <div className="space-y-2 text-center">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-300 pixel-glow"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm font-mono text-green-400">
                Uploading... {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {showThumbnails && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group pixel-border bg-gray-800/60 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumbnail || image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600/80 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>

                {/* Optimization Badge */}
                {image.optimized && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-600/80 text-white text-xs font-mono rounded">
                    ✓
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-2 space-y-1">
                <div className="text-xs font-mono text-green-400 truncate">
                  {image.name}
                </div>
                <div className="text-xs font-mono text-gray-400 flex justify-between">
                  <span>{formatFileSize(image.size)}</span>
                  {image.dimensions && (
                    <span>{image.dimensions.width}×{image.dimensions.height}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}