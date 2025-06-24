import "./globals.css"
import { Press_Start_2P, JetBrains_Mono, Inter } from "next/font/google"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { siteConfig } from "@/lib/site-config"
import { generateSEO } from "@/lib/seo"
import ResponsiveHeader from "./components/ResponsiveHeader"
import { AppWrapper } from "./components/AppWrapper"
import { PerformanceMetrics } from "./components/PerformanceOptimizer"
import AccessibilityTester from "./components/AccessibilityTester"
import SEOLayout from "./components/SEOLayout"
import { Providers } from "./components/Providers"
import { AccessibilityProvider } from "./components/AccessibilityProvider"
import WebVitalsMonitor from "./components/WebVitalsMonitor"
import CommandPalette from "./components/CommandPalette"

import ClientComponents from "./components/ClientComponents"
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration"
import { LoadingProvider } from "./components/LoadingProvider"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Courier New', 'Monaco', 'Menlo'],
  adjustFontFallback: false
})

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Menlo', 'Monaco', 'Courier New', 'Consolas'],
  adjustFontFallback: false
})

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
        className={`${pressStart2P.variable} ${jetBrainsMono.variable} ${inter.variable} font-sans bg-black text-green-400 antialiased selection:bg-green-400 selection:text-gray-900`}
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
                  {/* Main Layout Container */}
                  <div className="relative z-10">
                    {/* Header */}
                    <ResponsiveHeader 
                      showBreadcrumbs={true}
                      collapsible={true}
                    />
                    
                    {/* Main Content with proper spacing for fixed header */}
                    <main 
                      id="main-content"
                      className="relative z-10 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto focus:outline-none focus:ring-2 focus:ring-green-400 min-h-screen"
                      style={{ marginTop: 'calc(var(--header-height) + 1rem)' }}
                      role="main"
                      aria-label="Main content"
                      tabIndex={-1}
                    >
                      {children}
                    </main>

                    {/* Global Command Palette */}
                    <CommandPalette />
                    
                    {/* Simplified Footer */}
                    <footer 
                      className="relative mt-16 mb-8 text-center font-mono mx-4 sm:mx-6 lg:mx-8"
                      role="contentinfo"
                      aria-label="Site footer"
                    >
                      <div className="relative bg-gray-900/40 border border-gray-700/30 rounded-lg p-6 backdrop-blur-sm">
                        <div className="relative z-10 space-y-4">
                          {/* Copyright */}
                          <div className="text-green-400 text-sm">
                            <span>© 2025 {siteConfig.name} • All rights reserved</span>
                          </div>
                          
                          {/* Simple Footer Links */}
                          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6 text-sm">
                            <a 
                              href="/privacy" 
                              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                              rel="noopener"
                            >
                              Privacy
                            </a>
                            <a 
                              href="/terms" 
                              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                              rel="noopener"
                            >
                              Terms
                            </a>
                            <a 
                              href="/sitemap.xml" 
                              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                              rel="noopener"
                            >
                              Sitemap
                            </a>
                            <a 
                              href="/feed.xml" 
                              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                              rel="noopener"
                            >
                              RSS
                            </a>
                          </nav>
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
