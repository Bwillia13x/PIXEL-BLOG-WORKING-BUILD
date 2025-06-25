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
  name: "It From Bit",
  title: "It From Bit - Where Information Becomes Reality",
  description: "Exploring the intersection of information theory, AI development, and financial markets. From quantum foundations to practical value investing tools - where Wheeler's 'It From Bit' philosophy meets modern technology.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://itfrombit.ca",
  ogImage: "/og-image.png",
  creator: "It From Bit",
  keywords: ["information theory", "AI development", "financial technology", "value investing", "quantum computing", "Next.js", "TypeScript", "React", "data visualization", "John Wheeler", "It From Bit"],
  social: {
    // TODO: Add your actual social links
    // github: "https://github.com/yourusername",
    // linkedin: "https://linkedin.com/in/yourusername", 
    // twitter: "https://twitter.com/yourusername",
    email: "hello@itfrombit.io"
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
