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
  name: "Pixel Wisdom",
  title: "Pixel Wisdom - Developer Portfolio & AI Innovation Hub",
  description: "Full-stack developer specializing in AI-driven development, financial technology, and modern web applications. Featuring cutting-edge projects in value investing tools, data visualization, and agentic IDE workflows.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pixelwisdom.dev",
  ogImage: "/og-image.png",
  creator: "Pixel Wisdom Developer",
  keywords: ["full-stack developer", "AI development", "financial technology", "value investing", "Next.js", "TypeScript", "React", "data visualization", "web development", "portfolio"],
  social: {
    // TODO: Add your actual social links
    // github: "https://github.com/yourusername",
    // linkedin: "https://linkedin.com/in/yourusername", 
    // twitter: "https://twitter.com/yourusername",
    email: "hello@pixelwisdom.dev"
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
