# Pixel Blog v1 - Developer Portfolio & Blog

A modern, pixel-themed developer portfolio and blog built with Next.js 15, featuring:

- 🎮 Retro pixel aesthetic with modern functionality
- 🚀 Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS
- 📱 Fully responsive design with accessible components
- ✨ Interactive elements and pixel-perfect animations
- 📝 Blog system with MDX support
- 🎨 Project showcase with current work tracking
- 📧 Contact form with multiple ways to connect

## Features

### Pages
- **Homepage**: Hero section with navigation to key areas
- **About**: Personal introduction and developer journey
- **Projects**: Portfolio showcase with project cards
- **Current Projects**: Real-time view of ongoing work
- **Blog**: Article listing with search and categories
- **Contact**: Multiple contact methods and FAQ section

### Components
- Pixel-themed navigation with hover effects
- Responsive project and blog post cards
- Interactive floating pixels background
- Sound effects and visual feedback
- Theme toggle for light/dark modes
- Accessible UI components with shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Content**: MDX for blog posts
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd vO-pixel-blog-design

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see your pixel blog in action!

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server  
pnpm lint         # Run ESLint
```

## Project Structure

```
app/
├── components/          # Shared UI components
├── (pages)/
│   ├── about/          # About page
│   ├── blog/           # Blog listing + [slug] dynamic routes
│   ├── contact/        # Contact page  
│   ├── projects/       # Project portfolio + /current
│   └── category/       # Blog category filtering
├── data/               # Static data and content
└── globals.css         # Global styles and Tailwind imports

components/             # Reusable UI components
├── ui/                 # shadcn/ui components
└── theme-provider.tsx  # Theme management

content/                # MDX content
├── blog/              # Blog posts
├── about.md           # About page content  
└── projects.ts        # Project data

lib/
└── utils.ts           # Utility functions
```

## Content Management

### Adding Blog Posts
Create MDX files in `content/blog/` with frontmatter:

```mdx
---
title: "Your Post Title"
date: "2025-01-01"
excerpt: "Brief description"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Adding Projects
Update `content/projects.ts` with your project data:

```typescript
export const projects = [
  {
    id: 1,
    name: "Project Name",
    description: "Project description",
    technologies: ["Next.js", "TypeScript"],
    github: "https://github.com/...",
    demo: "https://...",
    status: "completed"
  }
]
```

## Customization

### Theming
- Colors defined in `tailwind.config.js`
- CSS custom properties in `app/globals.css`
- Pixel fonts and retro styling throughout

### Components
- All components use TypeScript for type safety
- Tailwind classes for consistent styling
- Accessible patterns with proper ARIA attributes

## Deployment

The project is optimized for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push to main

## Next Steps

This scaffolding provides the foundation for your pixel blog. Consider adding:

- [ ] Real blog content and project data
- [ ] Contact form backend integration
- [ ] Search functionality for blog posts
- [ ] Comment system integration
- [ ] Analytics and SEO optimization
- [ ] Additional interactive animations
- [ ] RSS feed for blog posts
- [ ] Social media integrations

## Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## License

MIT License - see LICENSE file for details# Cache Refresh: Sat Jun 14 14:42:35 MDT 2025
