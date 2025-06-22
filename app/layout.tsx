import "./globals.css"
import { Press_Start_2P, VT323, JetBrains_Mono } from "next/font/google"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { siteConfig } from "@/lib/site-config"
import { generateSEO } from "@/lib/seo"
import ResponsiveHeader from "./components/ResponsiveHeader"
import ClientAnimations from "./components/ClientAnimations"
import { AppWrapper } from "./components/AppWrapper"
import { PerformanceMetrics } from "./components/PerformanceOptimizer"
import AccessibilityTester from "./components/AccessibilityTester"
import SEOLayout from "./components/SEOLayout"
import { Providers } from "./components/Providers"
import { AccessibilityProvider } from "./components/AccessibilityProvider"
import WebVitalsMonitor from "./components/WebVitalsMonitor"

import ClientComponents from "./components/ClientComponents"
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration"
import { LoadingProvider } from "./components/LoadingProvider"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Courier New'],
  adjustFontFallback: false
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
  fallback: ['monospace', 'Courier New'],
  adjustFontFallback: false
})

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Menlo', 'Monaco', 'Courier New'],
  adjustFontFallback: false
})

// Enhanced SEO metadata with comprehensive configuration
export const metadata: Metadata = generateSEO({
  title: siteConfig.title,
  description: siteConfig.description,
  url: '/',
  type: 'website'
})

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#10b981' }
  ],
  colorScheme: 'dark light'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#10b981" />
        
        {/* MS Application Config */}
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Performance Hints */}
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/blog" />
      </head>
      
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${jetBrainsMono.variable} font-mono bg-black text-green-400 antialiased selection:bg-green-400 selection:text-gray-900 matrix-background`}
        suppressHydrationWarning
      >
        {/* Skip Link for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-green-400 focus:text-black focus:rounded focus:font-pixel focus:text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        {/* Providers for Theme and other contexts */}
        <LoadingProvider enableLoading={true} duration={2500}>
        <AccessibilityProvider>
        <Providers>
          {/* SEO and Performance Wrapper */}
          <SEOLayout>
            <AppWrapper>
              {/* Subtle Matrix Background Effect */}
              <div className="fixed inset-0 z-[-1] overflow-hidden">
                <ClientAnimations
                  intensity="low"
                  showTrails={false}
                  interactive={false}
                  performance="optimized"
                />
              </div>
              {/* Main Layout Container */}
              <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <ResponsiveHeader 
                  showBreadcrumbs={true}
                  collapsible={true}
                  className="header-sticky"
                />
                
                {/* Main Content */}
                <main 
                  id="main-content"
                  className="relative z-10 bg-black/80 backdrop-blur-sm rounded-lg space-p-responsive mt-8 sm:mt-12 lg:mt-16 mx-4 sm:mx-6 lg:mx-8 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-400/20"
                  role="main"
                  aria-label="Main content"
                  tabIndex={-1}
                  style={{ opacity: 1, transform: 'none' }}
                >
                  {children}
                </main>
                
                {/* Footer */}
                <footer 
                  className="relative mt-16 mb-8 text-center font-pixel mx-4 sm:mx-6 lg:mx-8"
                  role="contentinfo"
                  aria-label="Site footer"
                >
                  <div className="relative bg-gray-900/60 border border-gray-700/40 rounded-lg p-8 backdrop-blur-sm overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div 
                        className="w-full h-full"
                        style={{
                          background: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 20px,
                            rgba(74, 222, 128, 0.1) 20px,
                            rgba(74, 222, 128, 0.1) 40px
                          ), repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 20px,
                            rgba(74, 222, 128, 0.1) 20px,
                            rgba(74, 222, 128, 0.1) 40px
                          )`
                        }}
                      />
                    </div>

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-green-400/5 rounded-lg" />

                    <div className="relative z-10 space-y-6">
                      {/* Copyright */}
                      <div className="text-green-400 text-sm">
                        <span className="inline-flex items-center space-x-2">
                          <span>©</span>
                          <span className="font-mono">2025</span>
                          <span className="text-gray-400">•</span>
                          <span>{siteConfig.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">All rights pixelated</span>
                        </span>
                      </div>
                      
                      {/* Footer Links */}
                      <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6 text-sm">
                        <a 
                          href="/privacy" 
                          className="group inline-flex items-center px-3 py-1 text-gray-400 hover:text-green-400 transition-all duration-300 hover:bg-gray-800/40 rounded border border-transparent hover:border-green-400/30"
                          rel="noopener"
                        >
                          <span className="mr-1 text-xs">🔒</span>
                          Privacy
                        </a>
                        <a 
                          href="/terms" 
                          className="group inline-flex items-center px-3 py-1 text-gray-400 hover:text-green-400 transition-all duration-300 hover:bg-gray-800/40 rounded border border-transparent hover:border-green-400/30"
                          rel="noopener"
                        >
                          <span className="mr-1 text-xs">📋</span>
                          Terms
                        </a>
                        <a 
                          href="/sitemap.xml" 
                          className="group inline-flex items-center px-3 py-1 text-gray-400 hover:text-green-400 transition-all duration-300 hover:bg-gray-800/40 rounded border border-transparent hover:border-green-400/30"
                          rel="noopener"
                        >
                          <span className="mr-1 text-xs">🗺</span>
                          Sitemap
                        </a>
                        <a 
                          href="/feed.xml" 
                          className="group inline-flex items-center px-3 py-1 text-gray-400 hover:text-green-400 transition-all duration-300 hover:bg-gray-800/40 rounded border border-transparent hover:border-green-400/30"
                          rel="noopener"
                        >
                          <span className="mr-1 text-xs">📡</span>
                          RSS
                        </a>
                      </nav>
                      
                      {/* Performance Badge */}
                      <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800/40 border border-gray-600/30 rounded-full text-xs text-gray-500">
                        <span className="text-yellow-400">⚡</span>
                        <span>Built with performance in mind</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
              
              {/* Client-side Components - Load after hydration */}
              <ClientComponents />
              
              {/* Safe Service Worker Registration */}
              <ServiceWorkerRegistration enabled={true} />
            </AppWrapper>
            
            {/* Performance and Accessibility Components */}
            <PerformanceMetrics />
            
            {/* Development Tools - Only in development */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <AccessibilityTester />
                <WebVitalsMonitor />
              </>
            )}
          </SEOLayout>
        </Providers>
        </AccessibilityProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
// Deployment trigger: Thu Jun 19 19:14:33 MDT 2025
