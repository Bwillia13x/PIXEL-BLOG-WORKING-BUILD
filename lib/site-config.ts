/**
 * Site Configuration
 * Centralized configuration for the Pixel Blog
 */

export interface SiteConfig {
  name: string
  title: string
  description: string
  url: string
  ogImage: string
  creator: string
  keywords: string[]
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    email: string
  }
  navigation: {
    main: Array<{
      title: string
      href: string
      icon?: string
    }>
  }
}

export const siteConfig: SiteConfig = {
  name: "Drew Williams",
  title: "Drew Williams - Developer & Creative Technologist",
  description: "Full-stack developer passionate about AI-driven development, modern web technologies, and creating pixel-perfect digital experiences. Latest: Financial Data APIs Guide.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pixelwisdom.dev",
  ogImage: "/og-image.png",
  creator: "Drew Williams",
  keywords: ["full-stack", "developer", "AI", "Next.js", "TypeScript", "React", "web development", "creative technology"],
  social: {
    // Add your social links when ready
    // github: "https://github.com/benjaminwilliams",
    // linkedin: "https://linkedin.com/in/benjaminwilliams",
    // twitter: "https://twitter.com/benjaminwilliams",
    email: "hello@drewwilliams.dev"
  },
  navigation: {
    main: [
      {
        title: "Home",
        href: "/",
        icon: "Home"
      },
      {
        title: "About",
        href: "/about",
        icon: "User"
      },
      {
        title: "Projects",
        href: "/projects",
        icon: "Briefcase"
      },
      {
        title: "Blog",
        href: "/blog",
        icon: "BookOpen"
      },
      {
        title: "Contact",
        href: "/contact",
        icon: "Mail"
      }
    ]
  }
}

export default siteConfig
