# 🎮 PIXEL BLOG - WORKING BUILD

A retro pixel-themed developer blog built with **Next.js 15**, featuring modern web technologies with a nostalgic gaming aesthetic.

## 🌐 **LIVE DEPLOYMENT**

**🚀 PRODUCTION URL:** https://modernblog-codex.windsurf.build

*Fully deployed and accessible worldwide!*

## ✨ **Features**

### 🎨 **Design & UI**
- **Retro Pixel Aesthetic**: Gaming-inspired design with modern functionality
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Improved Typography**: Readable fonts for body text, pixel fonts for headers
- **Dark Theme**: Eye-friendly dark mode with green accent colors
- **Smooth Animations**: Hover effects and transitions

### 🔤 **Font System**
- **Headers**: Press Start 2P (pixel font)
- **Body Text**: JetBrains Mono (readable monospace)
- **Accent Text**: VT323 (retro terminal font)

### 📝 **Content Management**
- **Static Blog Posts**: Pre-generated blog content
- **Category System**: Organized posts by categories (Blog, FinTech, General)
- **Dynamic Routing**: Individual post and category pages
- **Markdown Support**: Rich text content with ReactMarkdown

### 🚀 **Performance & SEO**
- **Static Generation**: Lightning-fast page loads
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Optimized Images**: Next.js Image component with optimization
- **Fast Loading**: Minimal JavaScript bundle size

## 🛠️ **Tech Stack**

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Press Start 2P, JetBrains Mono, VT323)
- **Icons**: Lucide React
- **Deployment**: Netlify (Static Export)
- **Package Manager**: pnpm

## 📁 **Project Structure**

```
├── app/
│   ├── components/          # Reusable components
│   ├── data/               # Static data (posts, config)
│   ├── blog/               # Blog pages and dynamic routes
│   ├── category/           # Category pages
│   ├── contact/            # Contact page
│   ├── projects/           # Projects pages
│   ├── about/              # About page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.mjs         # Next.js configuration
└── package.json           # Dependencies
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bwillia13x/PIXEL-BLOG-WORKING-BUILD.git
   cd PIXEL-BLOG-WORKING-BUILD
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
pnpm build

# Start production server (for SSR)
pnpm start

# Or generate static export
pnpm build && npx serve out
```

## 📝 **Adding Content**

### Blog Posts
Edit `app/data/posts.ts` to add new blog posts:

```typescript
{
  slug: 'your-post-slug',
  title: 'Your Post Title',
  content: `Your markdown content here...`,
  category: 'Blog',
  date: '2025-01-15'
}
```

### Site Configuration
Update `app/data/siteConfig.ts` for site-wide settings:

```typescript
export const siteConfig = {
  name: 'Your Name',
  title: 'Your Site Title',
  description: 'Your site description',
  // ... other settings
}
```

## 🎨 **Customization**

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ... other colors
    }
  }
}
```

### Fonts
Modify `app/layout.tsx` to change fonts:

```javascript
import { Your_Font } from "next/font/google"

const yourFont = Your_Font({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-your-font",
})
```

## 🌍 **Deployment**

This project is configured for static export and can be deployed to:

- **Netlify** ✅ (Currently deployed)
- **Vercel** ✅ 
- **GitHub Pages** ✅
- **Any static hosting service** ✅

### Netlify Deployment (Current)
1. Build the project: `pnpm build`
2. Deploy the `out` folder to Netlify
3. Configure build settings in Netlify dashboard

## 📧 **Contact**

The contact form uses `mailto:` functionality for static deployment compatibility.

## 🔧 **Development Notes**

- Uses `output: 'export'` in Next.js config for static generation
- All dynamic routes include `generateStaticParams()` functions
- API routes removed for static export compatibility
- Optimized for SEO and performance

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🎯 **Contributing**

Feel free to submit issues and pull requests. This is a working build ready for customization and extension.

---

**Built with ❤️ and pixels** 🎮
