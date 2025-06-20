import "./globals.css"
import { Press_Start_2P, VT323, JetBrains_Mono } from "next/font/google"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { siteConfig } from "@/lib/site-config"
import { generateSEO } from "@/lib/seo"
import { RainingBackground } from "./components/RainingCharacters"
import ResponsiveHeader from "./components/ResponsiveHeader"
import { AppWrapper } from "./components/AppWrapper"
import { PerformanceMetrics } from "./components/PerformanceOptimizer"
import AccessibilityTester from "./components/AccessibilityTester"
import SEOLayout from "./components/SEOLayout"
import { Providers } from "./components/Providers"

import ClientComponents from "./components/ClientComponents"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
  preload: true
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap"
})

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true
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
        <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/blog" />
      </head>
      
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${jetBrainsMono.variable} font-mono bg-gray-900 text-green-400 antialiased selection:bg-green-400 selection:text-gray-900`}
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
        <Providers>
          {/* SEO and Performance Wrapper */}
          <SEOLayout>
            <AppWrapper>
              {/* Background Effects */}
              <RainingBackground aria-hidden="true" />
              
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
                  className="relative z-10 bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 mt-6 mx-4 sm:mx-6 lg:mx-8"
                  role="main"
                  aria-label="Main content"
                  tabIndex={-1}
                >
                  {children}
                </main>
                
                {/* Footer */}
                <footer 
                  className="py-8 text-center font-retro relative z-10 px-4 sm:px-6 lg:px-8"
                  role="contentinfo"
                  aria-label="Site footer"
                >
                  <div className="border-t border-green-400/30 pt-6 space-y-4">
                    <div>
                      © 2025 {siteConfig.name}. All rights pixelated.
                    </div>
                    
                    {/* Footer Links */}
                    <nav aria-label="Footer navigation" className="flex justify-center space-x-6 text-sm">
                      <a 
                        href="/privacy" 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        rel="noopener"
                      >
                        Privacy
                      </a>
                      <a 
                        href="/terms" 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        rel="noopener"
                      >
                        Terms
                      </a>
                      <a 
                        href="/sitemap.xml" 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        rel="noopener"
                      >
                        Sitemap
                      </a>
                      <a 
                        href="/feed.xml" 
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        rel="noopener"
                      >
                        RSS
                      </a>
                    </nav>
                    
                    {/* Performance Badge */}
                    <div className="text-xs text-gray-500">
                      Built with ⚡ performance in mind
                    </div>
                  </div>
                </footer>
              </div>
              
              {/* Client-side Components */}
              <ClientComponents />
              <PerformanceMetrics />
              <AccessibilityTester />
            </AppWrapper>
          </SEOLayout>
        </Providers>
        
        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
        

      </body>
    </html>
  )
}
// Deployment trigger: Thu Jun 19 19:14:33 MDT 2025
