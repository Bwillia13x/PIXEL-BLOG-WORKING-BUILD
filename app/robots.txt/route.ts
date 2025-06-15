import { siteConfig } from '@/lib/site-config'

export async function GET() {
  const robots = `User-agent: *
Allow: /

User-agent: *
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: ${siteConfig.url}/sitemap.xml`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
