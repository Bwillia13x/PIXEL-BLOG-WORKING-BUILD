'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useTheme } from '../Providers'

interface Project3D {
  id: string
  title: string
  description: string
  image: string
  demoUrl?: string
  githubUrl?: string
  technologies: string[]
  category: string
  featured: boolean
  color: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

interface ThreeDProjectGalleryProps {
  projects: Project3D[]
  onProjectSelect: (project: Project3D) => void
  onProjectHover: (project: Project3D | null) => void
  selectedCategory?: string
  viewMode: '3d' | 'grid' | 'carousel'
  className?: string
}

export default function ThreeDProjectGallery({
  projects,
  onProjectSelect,
  onProjectHover,
  selectedCategory,
  viewMode = '3d',
  className = ''
}: ThreeDProjectGalleryProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const projectMeshesRef = useRef<Map<string, any>>(new Map())
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const raycasterRef = useRef<any>(null)
  const hoveredProjectRef = useRef<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cameraControls, setCameraControls] = useState({
    autoRotate: true,
    rotationSpeed: 0.01,
    zoom: 1,
    position: { x: 0, y: 0, z: 15 }
  })

  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects
    return projects.filter(project => project.category === selectedCategory)
  }, [projects, selectedCategory])

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || viewMode !== '3d') return

    const initThreeJS = async () => {
      try {
        // Dynamically import Three.js to avoid SSR issues
        const THREE = await import('three')
        
        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x111827) // Match dark theme
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
          75,
          canvasRef.current!.clientWidth / canvasRef.current!.clientHeight,
          0.1,
          1000
        )
        camera.position.set(
          cameraControls.position.x,
          cameraControls.position.y,
          cameraControls.position.z
        )
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
          antialias: true,
          alpha: true
        })
        renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x10b981, 0.3)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0x10b981, 0.8)
        directionalLight.position.set(10, 10, 5)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 1024
        directionalLight.shadow.mapSize.height = 1024
        scene.add(directionalLight)
        
        // Point lights for accent
        const pointLight1 = new THREE.PointLight(0x10b981, 0.5, 20)
        pointLight1.position.set(-10, 5, 10)
        scene.add(pointLight1)
        
        const pointLight2 = new THREE.PointLight(0x3b82f6, 0.3, 15)
        pointLight2.position.set(10, -5, -10)
        scene.add(pointLight2)
        
        // Raycaster for mouse interaction
        const raycaster = new THREE.Raycaster()
        
        // Store references
        sceneRef.current = scene
        rendererRef.current = renderer
        cameraRef.current = camera
        raycasterRef.current = raycaster
        
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize Three.js:', error)
        setError('Failed to load 3D viewer')
        setIsLoading(false)
      }
    }

    initThreeJS()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [viewMode])

  // Create project meshes
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || viewMode !== '3d') return

    const createProjectMeshes = async () => {
      const THREE = await import('three')
      
      // Clear existing meshes
      projectMeshesRef.current.forEach(mesh => {
        sceneRef.current.remove(mesh)
      })
      projectMeshesRef.current.clear()

      // Create meshes for filtered projects
      filteredProjects.forEach((project, index) => {
        // Create project card geometry
        const geometry = new THREE.BoxGeometry(3, 4, 0.2)
        
        // Create material with project color
        const material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(project.color || '#10b981'),
          transparent: true,
          opacity: 0.8
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        
        // Position projects in 3D space
        const radius = 8
        const angle = (index / filteredProjects.length) * Math.PI * 2
        const height = Math.sin(index * 0.5) * 3
        
        mesh.position.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        )
        
        // Add rotation
        mesh.rotation.y = angle + Math.PI / 2
        
        // Store project data
        mesh.userData = { project, originalPosition: mesh.position.clone() }
        
        // Add wireframe outline for pixel effect
        const wireframeGeometry = new THREE.EdgesGeometry(geometry)
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x10b981,
          linewidth: 2
        })
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
        mesh.add(wireframe)
        
        // Add text (simplified - in real implementation you'd use TextGeometry)
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const textPlane = new THREE.PlaneGeometry(2.5, 0.5)
        const textMesh = new THREE.Mesh(textPlane, textMaterial)
        textMesh.position.set(0, 1.5, 0.11)
        mesh.add(textMesh)
        
        sceneRef.current.add(mesh)
        projectMeshesRef.current.set(project.id, mesh)
      })
    }

    createProjectMeshes()
  }, [filteredProjects, viewMode])

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || viewMode !== '3d') return

    const animate = () => {
      // Auto-rotate camera
      if (cameraControls.autoRotate) {
        cameraRef.current.position.x = Math.cos(Date.now() * cameraControls.rotationSpeed * 0.001) * cameraControls.position.z
        cameraRef.current.position.z = Math.sin(Date.now() * cameraControls.rotationSpeed * 0.001) * cameraControls.position.z
        cameraRef.current.lookAt(0, 0, 0)
      }

      // Animate project meshes
      projectMeshesRef.current.forEach((mesh, projectId) => {
        // Floating animation
        const time = Date.now() * 0.001
        const originalY = mesh.userData.originalPosition.y
        mesh.position.y = originalY + Math.sin(time + projectId.length) * 0.3
        
        // Rotate meshes slightly
        mesh.rotation.z = Math.sin(time * 0.5) * 0.1
        
        // Scale effect for hovered project
        if (hoveredProjectRef.current === projectId) {
          mesh.scale.setScalar(1.1)
          mesh.material.opacity = 1.0
        } else {
          mesh.scale.setScalar(1.0)
          mesh.material.opacity = 0.8
        }
      })

      rendererRef.current.render(sceneRef.current, cameraRef.current)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [cameraControls, viewMode])

  // Handle mouse interactions
  useEffect(() => {
    if (!canvasRef.current || viewMode !== '3d') return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Raycasting for hover detection
      if (raycasterRef.current && cameraRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
        
        const meshes = Array.from(projectMeshesRef.current.values())
        const intersects = raycasterRef.current.intersectObjects(meshes)
        
        if (intersects.length > 0) {
          const hoveredProject = intersects[0].object.userData.project
          if (hoveredProjectRef.current !== hoveredProject.id) {
            hoveredProjectRef.current = hoveredProject.id
            onProjectHover(hoveredProject)
            canvasRef.current!.style.cursor = 'pointer'
          }
        } else {
          if (hoveredProjectRef.current) {
            hoveredProjectRef.current = null
            onProjectHover(null)
            canvasRef.current!.style.cursor = 'default'
          }
        }
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (hoveredProjectRef.current) {
        const project = filteredProjects.find(p => p.id === hoveredProjectRef.current)
        if (project) {
          onProjectSelect(project)
        }
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const zoomSpeed = 0.1
      const newZoom = Math.max(0.5, Math.min(3, cameraControls.zoom + event.deltaY * zoomSpeed * 0.001))
      
      setCameraControls(prev => ({
        ...prev,
        zoom: newZoom,
        position: {
          ...prev.position,
          z: 15 / newZoom
        }
      }))
    }

    canvasRef.current.addEventListener('mousemove', handleMouseMove)
    canvasRef.current.addEventListener('click', handleClick)
    canvasRef.current.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove)
        canvasRef.current.removeEventListener('click', handleClick)
        canvasRef.current.removeEventListener('wheel', handleWheel)
      }
    }
  }, [filteredProjects, onProjectSelect, onProjectHover, viewMode])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current || viewMode !== '3d') return

      const width = canvasRef.current.clientWidth
      const height = canvasRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      
      rendererRef.current.setSize(width, height)
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  if (viewMode !== '3d') {
    return null
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3 text-green-400">
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-sm">Loading 3D Gallery...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <div className="font-mono text-red-400 mb-2">{error}</div>
            <div className="text-sm text-gray-400">Falling back to 2D view</div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pixel-border rounded-lg"
        style={{ background: 'linear-gradient(45deg, #111827 0%, #1f2937 100%)' }}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-20">
        <button
          onClick={() => setCameraControls(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
          className={`px-3 py-2 font-mono text-xs rounded transition-colors pixel-border-sm ${
            cameraControls.autoRotate
              ? 'bg-green-600/60 text-white'
              : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
          }`}
        >
          {cameraControls.autoRotate ? '⏸️ Stop' : '▶️ Auto-Rotate'}
        </button>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-mono text-gray-400">Speed</label>
          <input
            type="range"
            min="0.005"
            max="0.02"
            step="0.001"
            value={cameraControls.rotationSpeed}
            onChange={(e) => setCameraControls(prev => ({ 
              ...prev, 
              rotationSpeed: parseFloat(e.target.value) 
            }))}
            className="w-20 pixel-slider"
          />
        </div>

        <button
          onClick={() => setCameraControls({
            autoRotate: true,
            rotationSpeed: 0.01,
            zoom: 1,
            position: { x: 0, y: 0, z: 15 }
          })}
          className="px-3 py-2 bg-blue-600/60 hover:bg-blue-500/60 text-white font-mono text-xs rounded transition-colors pixel-border-sm"
        >
          🔄 Reset View
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 pixel-border bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 z-20">
        <div className="text-xs font-mono text-gray-400 space-y-1">
          <div>🖱️ Click to select • Hover to preview</div>
          <div>🔄 Scroll to zoom • Auto-rotation enabled</div>
          <div>📦 {filteredProjects.length} projects loaded</div>
        </div>
      </div>

      {/* Performance Monitor */}
      <div className="absolute top-4 left-4 pixel-border bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 z-20">
        <div className="text-xs font-mono text-green-400">
          3D • WebGL {rendererRef.current?.getContext()?.getParameter(rendererRef.current?.getContext()?.VERSION) || 'N/A'}
        </div>
      </div>
    </div>
  )
}