# 🚨 IMMEDIATE ACTIONS - PIXEL BLOG

*Fix critical issues and get the project building successfully*

## ⚡ **CRITICAL FIXES (Next 2 Hours)**

### 1. Fix Dependencies & Build
```bash
# Install dependencies (already started)
pnpm install

# Fix Google Fonts offline issue
# Option A: Use local fonts fallback
# Option B: Use next/font with local fallbacks
```

### 2. Font Loading Fix
The build failure is due to Google Fonts being unavailable offline. Here's the fix:

**File: `app/layout.tsx`** (Lines 24-58)
```typescript
// Add fallback strategy for fonts
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],  
  variable: "--font-press-start-2p",
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Courier New'],
  adjustFontFallback: false
})

// Add font loading error handling
const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono", 
  display: "swap",
  preload: true,
  fallback: ['monospace', 'Menlo', 'Monaco', 'Courier New'],
  adjustFontFallback: false
})
```

### 3. Environment Setup
```bash
# Create .env.local if needed
touch .env.local

# Add to .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Test Build
```bash
# Try building again
pnpm build

# If build fails, try dev mode first
pnpm dev
```

## 📝 **CONTENT UPDATES (Next 30 Minutes)**

### 1. Update Site Config
**File: `lib/site-config.ts`**
```typescript
export const siteConfig: SiteConfig = {
  name: "Your Actual Name",
  title: "Your Actual Name - Developer & Entrepreneur", 
  description: "Your actual description highlighting your expertise in AI, finance, and web development",
  url: "https://your-actual-domain.com",
  // ... update other fields
}
```

### 2. Update About Page
**File: `content/about.md`** (create if doesn't exist)
```markdown
# About Me

I'm a full-stack developer passionate about...

## Skills
- AI/ML Development
- Financial Technology
- Web Development
- (add your actual skills)

## Experience
(Add your actual experience)
```

### 3. Quick Content Audit
- [ ] Replace "Drew Williams" with your actual name
- [ ] Update email addresses
- [ ] Replace placeholder project descriptions
- [ ] Add your actual GitHub/LinkedIn links

## 🔧 **DEVELOPMENT WORKFLOW**

### Using Codex CLI (As Per Your Documentation)
```bash
# Install Codex CLI if not installed
npm install -g @openai/codex

# Authenticate (choose one)
export OPENAI_API_KEY=your-key
# OR
codex --login

# Start development session
codex --auto-edit "fix font loading issues and build problems"
```

### Alternative: Manual Development
```bash
# Start development server
pnpm dev

# In another terminal, run tests
pnpm test

# Check linting
pnpm lint
```

## 📊 **VERIFICATION CHECKLIST**

### Build Success
- [ ] `pnpm install` completes successfully
- [ ] `pnpm build` completes without errors
- [ ] `pnpm dev` starts development server
- [ ] Site loads at `http://localhost:3000`

### Basic Functionality
- [ ] Homepage loads with content
- [ ] Navigation works (About, Projects, Blog, Contact)
- [ ] Blog posts display properly  
- [ ] Projects showcase loads
- [ ] Contact form displays (even if not functional yet)

### Performance Check
- [ ] Lighthouse score > 80 (initially)
- [ ] No console errors
- [ ] Images load properly
- [ ] Mobile responsive

## 🚀 **NEXT STEPS AFTER IMMEDIATE FIXES**

1. **Week 1**: Complete content replacement
2. **Week 2**: Implement working contact form
3. **Week 3**: SEO optimization
4. **Week 4**: Performance optimization

## 📞 **NEED HELP?**

If you encounter issues:

1. **Check build logs** for specific error messages
2. **Use Codex CLI** for AI-assisted debugging:
   ```bash
   codex "help debug Next.js build error with Google Fonts"
   ```
3. **Manual debugging**: Check network connectivity, dependency versions
4. **Fallback**: Use local fonts instead of Google Fonts

---

**Time estimate**: 2-4 hours to complete immediate fixes and have a working site.

**Goal**: Get from "build failure" to "working portfolio site" as quickly as possible, then iterate on improvements.