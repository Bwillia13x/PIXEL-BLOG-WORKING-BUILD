import "./globals.css"
import { Press_Start_2P, VT323, JetBrains_Mono } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { RainingBackground } from "./components/RainingCharacters"
import ResponsiveHeader from "./components/ResponsiveHeader"
import { AppWrapper } from "./components/AppWrapper"
import { PerformanceMetrics } from "./components/PerformanceOptimizer"
import AccessibilityTester from "./components/AccessibilityTester"

import ClientComponents from "./components/ClientComponents"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
})

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter ? `@${siteConfig.social.twitter.split('/').pop()}` : undefined
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${jetBrainsMono.variable} font-mono bg-gray-900 text-green-400 dark:bg-gray-900 dark:text-green-400`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-green-400 focus:text-black focus:rounded focus:font-pixel focus:text-sm"
        >
          Skip to main content
        </a>
        <AppWrapper>
          <RainingBackground aria-hidden="true" />
          <div className="max-w-6xl mx-auto relative z-10">
            <ResponsiveHeader 
              showBreadcrumbs={true}
              collapsible={true}
              className="header-sticky"
            />
            <main 
              id="main-content"
              className="relative z-10 bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 mt-6 mx-4 sm:mx-6 lg:mx-8"
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
            <footer 
              className="py-8 text-center font-retro relative z-10 px-4 sm:px-6 lg:px-8"
              role="contentinfo"
              aria-label="Site footer"
            >
              <div className="border-t border-green-400/30 pt-6">
                © 2025 {siteConfig.name}. All rights pixelated.
              </div>
            </footer>
          </div>
          <ClientComponents />
          <PerformanceMetrics />
          <AccessibilityTester />
        </AppWrapper>
      </body>
    </html>
  )
}
// Deployment trigger: Thu Jun 19 19:14:33 MDT 2025
