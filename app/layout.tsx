import "./globals.css"
import { Press_Start_2P, VT323, JetBrains_Mono } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import RainingCharacters, { RainingBackground } from "./components/RainingCharacters"
import BlinkingCursor from "./components/BlinkingCursor"
import NavMenu from "./components/NavMenu"
import ThemeToggle from "./components/ThemeToggle"
import { AppWrapper } from "./components/AppWrapper"

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
        <AppWrapper>
          <RainingBackground />
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <header className="py-4 flex flex-col items-center relative z-10">
              <RainingCharacters />
              <p className="text-xl text-center font-retro flex items-center mt-4">
                <BlinkingCursor />
              </p>
              <NavMenu />
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </header>
            <main className="relative z-10 bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 mt-6">{children}</main>
            <footer className="py-8 text-center font-retro relative z-10">© 2025 {siteConfig.name}. All rights pixelated.</footer>
          </div>
          <ClientComponents />
        </AppWrapper>
      </body>
    </html>
  )
}
// Deployment trigger: Thu Jun 19 19:14:33 MDT 2025
