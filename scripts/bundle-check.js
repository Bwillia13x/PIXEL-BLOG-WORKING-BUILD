#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 * Analyzes bundle sizes and provides performance recommendations
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

// Performance budgets (in KB)
const PERFORMANCE_BUDGETS = {
  // Total bundle budgets
  totalJavaScript: 250, // 250KB total JS
  totalCSS: 50,         // 50KB total CSS
  totalAssets: 1000,    // 1MB total assets
  
  // Individual page budgets
  pageJavaScript: 50,   // 50KB per page
  pageCSS: 20,          // 20KB per page CSS
  
  // Specific asset budgets
  images: 500,          // 500KB images
  fonts: 100,           // 100KB fonts
  
  // Performance thresholds
  firstLoadJS: 130,     // Next.js recommendation: 130KB
  sharedJS: 80,         // Shared chunks: 80KB
}

// Asset type configurations
const ASSET_TYPES = {
  javascript: ['.js', '.jsx', '.ts', '.tsx'],
  css: ['.css', '.scss', '.sass'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'],
  fonts: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  other: []
}

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next')
    this.staticDir = path.join(this.buildDir, 'static')
    this.results = {
      timestamp: new Date().toISOString(),
      budgets: PERFORMANCE_BUDGETS,
      analysis: {},
      violations: [],
      recommendations: [],
      summary: {}
    }
  }

  async analyze() {
    console.log('🔍 Analyzing bundle sizes...\n')

    try {
      // Check if build exists
      if (!fs.existsSync(this.buildDir)) {
        throw new Error('Build directory not found. Please run "npm run build" first.')
      }

      // Analyze different aspects
      await this.analyzeStaticAssets()
      await this.analyzeNextBuildOutput()
      await this.generateRecommendations()
      await this.checkPerformanceBudgets()
      
      // Generate report
      this.generateReport()
      await this.saveResults()

    } catch (error) {
      console.error('❌ Analysis failed:', error.message)
      process.exit(1)
    }
  }

  async analyzeStaticAssets() {
    console.log('📦 Analyzing static assets...')
    
    const staticChunksDir = path.join(this.staticDir, 'chunks')
    const staticCssDir = path.join(this.staticDir, 'css')
    
    this.results.analysis.staticAssets = {
      javascript: await this.analyzeDirectory(staticChunksDir, 'javascript'),
      css: await this.analyzeDirectory(staticCssDir, 'css'),
      totalSize: 0,
      chunkCount: 0
    }

    // Calculate totals
    const jsTotal = this.results.analysis.staticAssets.javascript.totalSize
    const cssTotal = this.results.analysis.staticAssets.css.totalSize
    
    this.results.analysis.staticAssets.totalSize = jsTotal + cssTotal
    this.results.analysis.staticAssets.chunkCount = 
      this.results.analysis.staticAssets.javascript.files.length +
      this.results.analysis.staticAssets.css.files.length
  }

  async analyzeDirectory(dirPath, assetType) {
    const result = {
      files: [],
      totalSize: 0,
      largestFile: null,
      smallestFile: null
    }

    if (!fs.existsSync(dirPath)) {
      return result
    }

    const files = fs.readdirSync(dirPath)
    const extensions = ASSET_TYPES[assetType] || []

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const ext = path.extname(file).toLowerCase()
      
      if (extensions.includes(ext)) {
        try {
          const stats = fs.statSync(filePath)
          const fileInfo = {
            name: file,
            path: filePath,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024 * 100) / 100,
            type: assetType,
            isLarge: stats.size > (PERFORMANCE_BUDGETS.pageJavaScript * 1024)
          }

          result.files.push(fileInfo)
          result.totalSize += stats.size

          // Track largest and smallest files
          if (!result.largestFile || stats.size > result.largestFile.size) {
            result.largestFile = fileInfo
          }
          if (!result.smallestFile || stats.size < result.smallestFile.size) {
            result.smallestFile = fileInfo
          }
        } catch (error) {
          console.warn(`⚠️ Could not analyze file: ${file}`)
        }
      }
    }

    // Sort files by size (largest first)
    result.files.sort((a, b) => b.size - a.size)

    return result
  }

  async analyzeNextBuildOutput() {
    console.log('⚡ Analyzing Next.js build output...')

    try {
      // Read Next.js build manifest if available
      const manifestPath = path.join(this.buildDir, 'build-manifest.json')
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        this.results.analysis.buildManifest = {
          pages: Object.keys(manifest.pages || {}),
          rootMainFiles: manifest.rootMainFiles || [],
          polyfillFiles: manifest.polyfillFiles || []
        }
      }

      // Try to get Next.js build output
      const { stdout } = await execAsync('npm run build 2>&1 | tail -30')
      this.parseBuildOutput(stdout)

    } catch (error) {
      console.warn('⚠️ Could not parse Next.js build output:', error.message)
    }
  }

  parseBuildOutput(output) {
    const lines = output.split('\n')
    const routeInfo = []

    for (const line of lines) {
      // Parse Next.js route table
      const routeMatch = line.match(/([○●ƒ])\s+([^\s]+)\s+([0-9.]+\s*[A-Z]*B)?\s+([0-9.]+\s*[A-Z]*B)/i)
      if (routeMatch) {
        const [, type, route, size, firstLoadJS] = routeMatch
        routeInfo.push({
          type: type === '○' ? 'Static' : type === '●' ? 'SSG' : 'Dynamic',
          route: route.trim(),
          size: this.parseSize(size),
          firstLoadJS: this.parseSize(firstLoadJS)
        })
      }
    }

    this.results.analysis.routes = routeInfo
  }

  parseSize(sizeStr) {
    if (!sizeStr) return 0
    const match = sizeStr.match(/([0-9.]+)\s*([A-Z]*B)/i)
    if (match) {
      const [, number, unit] = match
      const multiplier = unit.toUpperCase() === 'MB' ? 1024 : 1
      return Math.round(parseFloat(number) * multiplier * 100) / 100
    }
    return 0
  }

  checkPerformanceBudgets() {
    console.log('📊 Checking performance budgets...')

    const violations = []
    const jsTotal = (this.results.analysis.staticAssets?.javascript?.totalSize || 0) / 1024
    const cssTotal = (this.results.analysis.staticAssets?.css?.totalSize || 0) / 1024

    // Check total JavaScript budget
    if (jsTotal > PERFORMANCE_BUDGETS.totalJavaScript) {
      violations.push({
        type: 'JavaScript Budget Exceeded',
        current: `${Math.round(jsTotal)}KB`,
        budget: `${PERFORMANCE_BUDGETS.totalJavaScript}KB`,
        severity: 'high',
        recommendation: 'Consider code splitting, tree shaking, or removing unused dependencies'
      })
    }

    // Check total CSS budget
    if (cssTotal > PERFORMANCE_BUDGETS.totalCSS) {
      violations.push({
        type: 'CSS Budget Exceeded',
        current: `${Math.round(cssTotal)}KB`,
        budget: `${PERFORMANCE_BUDGETS.totalCSS}KB`,
        severity: 'medium',
        recommendation: 'Optimize CSS, remove unused styles, or use CSS-in-JS tree shaking'
      })
    }

    // Check individual large files
    const jsFiles = this.results.analysis.staticAssets?.javascript?.files || []
    for (const file of jsFiles) {
      if (file.sizeKB > PERFORMANCE_BUDGETS.pageJavaScript) {
        violations.push({
          type: 'Large JavaScript File',
          file: file.name,
          current: `${file.sizeKB}KB`,
          budget: `${PERFORMANCE_BUDGETS.pageJavaScript}KB`,
          severity: 'medium',
          recommendation: 'Consider splitting this chunk or analyzing its dependencies'
        })
      }
    }

    // Check route-specific budgets
    const routes = this.results.analysis.routes || []
    for (const route of routes) {
      if (route.firstLoadJS > PERFORMANCE_BUDGETS.firstLoadJS) {
        violations.push({
          type: 'Route First Load JS Exceeded',
          route: route.route,
          current: `${route.firstLoadJS}KB`,
          budget: `${PERFORMANCE_BUDGETS.firstLoadJS}KB`,
          severity: 'high',
          recommendation: 'Optimize this route by reducing bundle size or implementing code splitting'
        })
      }
    }

    this.results.violations = violations
  }

  generateRecommendations() {
    console.log('💡 Generating optimization recommendations...')

    const recommendations = []
    const jsFiles = this.results.analysis.staticAssets?.javascript?.files || []
    const largestFiles = jsFiles.slice(0, 3)

    // General recommendations
    recommendations.push({
      category: 'Bundle Optimization',
      priority: 'high',
      title: 'Implement Dynamic Imports',
      description: 'Use dynamic imports for non-critical components to reduce initial bundle size',
      implementation: 'const Component = dynamic(() => import("./Component"))'
    })

    recommendations.push({
      category: 'Dependencies',
      priority: 'medium',
      title: 'Analyze Large Dependencies',
      description: 'Review and potentially replace large dependencies with lighter alternatives',
      implementation: 'Use webpack-bundle-analyzer to identify heavy dependencies'
    })

    if (largestFiles.length > 0) {
      recommendations.push({
        category: 'Code Splitting',
        priority: 'high',
        title: 'Split Large Chunks',
        description: `Your largest chunk is ${largestFiles[0].sizeKB}KB. Consider splitting it.`,
        implementation: 'Configure webpack splitChunks or use Next.js dynamic imports'
      })
    }

    recommendations.push({
      category: 'Tree Shaking',
      priority: 'medium',
      title: 'Optimize Imports',
      description: 'Use named imports instead of default imports for better tree shaking',
      implementation: 'import { specific } from "library" instead of import library from "library"'
    })

    recommendations.push({
      category: 'Compression',
      priority: 'low',
      title: 'Enable Brotli Compression',
      description: 'Configure your hosting provider to serve assets with Brotli compression',
      implementation: 'Configure compression at CDN/server level'
    })

    this.results.recommendations = recommendations
  }

  generateReport() {
    console.log('\n📋 Bundle Analysis Report')
    console.log('========================\n')

    // Summary
    const jsTotal = (this.results.analysis.staticAssets?.javascript?.totalSize || 0) / 1024
    const cssTotal = (this.results.analysis.staticAssets?.css?.totalSize || 0) / 1024
    const totalChunks = this.results.analysis.staticAssets?.chunkCount || 0

    console.log('📊 Summary:')
    console.log(`   Total JavaScript: ${Math.round(jsTotal)}KB`)
    console.log(`   Total CSS: ${Math.round(cssTotal)}KB`)
    console.log(`   Total Chunks: ${totalChunks}`)
    console.log()

    // Budget Status
    const violationCount = this.results.violations.length
    if (violationCount === 0) {
      console.log('✅ All performance budgets are within limits!')
    } else {
      console.log(`⚠️ ${violationCount} performance budget violation(s):`)
      this.results.violations.forEach((violation, index) => {
        const icon = violation.severity === 'high' ? '🔴' : violation.severity === 'medium' ? '🟡' : '🟢'
        console.log(`   ${icon} ${violation.type}: ${violation.current} (budget: ${violation.budget})`)
      })
    }
    console.log()

    // Top Recommendations
    console.log('💡 Top Recommendations:')
    this.results.recommendations.slice(0, 3).forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'
      console.log(`   ${priority} ${rec.title}`)
      console.log(`      ${rec.description}`)
    })
    console.log()

    // Largest Files
    const jsFiles = this.results.analysis.staticAssets?.javascript?.files || []
    if (jsFiles.length > 0) {
      console.log('📦 Largest JavaScript Files:')
      jsFiles.slice(0, 5).forEach((file, index) => {
        const icon = file.isLarge ? '🔴' : '🟢'
        console.log(`   ${icon} ${file.name}: ${file.sizeKB}KB`)
      })
    }

    console.log('\n📝 Detailed report saved to: .next/bundle-analysis.json\n')
  }

  async saveResults() {
    const outputPath = path.join(this.buildDir, 'bundle-analysis.json')
    
    this.results.summary = {
      totalJavaScriptKB: Math.round((this.results.analysis.staticAssets?.javascript?.totalSize || 0) / 1024),
      totalCSSKB: Math.round((this.results.analysis.staticAssets?.css?.totalSize || 0) / 1024),
      violationCount: this.results.violations.length,
      recommendationCount: this.results.recommendations.length,
      passesAllBudgets: this.results.violations.length === 0
    }

    fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2))
    
    // Also save a simplified version for monitoring
    const simplifiedResults = {
      timestamp: this.results.timestamp,
      summary: this.results.summary,
      violations: this.results.violations.map(v => ({
        type: v.type,
        severity: v.severity,
        current: v.current,
        budget: v.budget
      }))
    }
    
    const historyPath = path.join(process.cwd(), 'bundle-history.json')
    let history = []
    
    if (fs.existsSync(historyPath)) {
      try {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'))
      } catch (error) {
        console.warn('Could not read bundle history')
      }
    }
    
    history.push(simplifiedResults)
    
    // Keep only last 50 entries
    if (history.length > 50) {
      history = history.slice(-50)
    }
    
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
  }
}

// CLI Interface
async function main() {
  const analyzer = new BundleAnalyzer()
  
  console.log('🚀 It From Bit - Bundle Size Analyzer')
  console.log('==========================================\n')
  
  try {
    await analyzer.analyze()
    
    // Exit with error code if budgets are violated
    if (analyzer.results.violations.length > 0) {
      const highSeverityViolations = analyzer.results.violations.filter(v => v.severity === 'high')
      if (highSeverityViolations.length > 0) {
        console.log('❌ Build failed due to high-severity performance budget violations.')
        process.exit(1)
      } else {
        console.log('⚠️ Build completed with warnings.')
        process.exit(0)
      }
    } else {
      console.log('✅ Build completed successfully - all performance budgets met!')
      process.exit(0)
    }
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { BundleAnalyzer, PERFORMANCE_BUDGETS }