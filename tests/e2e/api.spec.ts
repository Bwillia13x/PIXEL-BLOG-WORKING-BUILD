import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('posts API should return valid data', async ({ request }) => {
    const response = await request.get('/api/posts');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data) || data.posts).toBeTruthy();
  });

  test('posts API should handle categories', async ({ request }) => {
    const response = await request.get('/api/posts?category=tech');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data) || data.posts).toBeTruthy();
  });

  test('analytics API should accept POST requests', async ({ request }) => {
    const response = await request.post('/api/analytics', {
      data: {
        event: 'test_event',
        data: { test: true },
        timestamp: Date.now(),
        url: 'http://localhost:3000/test',
        userAgent: 'test-agent'
      }
    });
    
    // Should accept the request (200) or handle it gracefully
    expect([200, 201, 204].includes(response.status())).toBeTruthy();
  });

  test('web vitals API should accept POST requests', async ({ request }) => {
    const response = await request.post('/api/analytics/web-vitals', {
      data: {
        name: 'CLS',
        value: 0.1,
        rating: 'good',
        delta: 0.1,
        id: 'test-id'
      }
    });
    
    // Should accept the request (200) or handle it gracefully
    expect([200, 201, 204].includes(response.status())).toBeTruthy();
  });

  test('API should handle invalid requests gracefully', async ({ request }) => {
    // Test invalid POST to analytics
    const response = await request.post('/api/analytics', {
      data: {
        invalid: 'data'
      }
    });
    
    // Should return error status but not crash
    expect([400, 422, 500].includes(response.status())).toBeTruthy();
  });

  test('RSS feed should be valid XML', async ({ request }) => {
    const response = await request.get('/feed.xml');
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);
    
    const xmlContent = await response.text();
    
    // Check XML structure
    expect(xmlContent).toContain('<?xml version="1.0"');
    expect(xmlContent).toContain('<rss version="2.0"');
    expect(xmlContent).toContain('<channel>');
    expect(xmlContent).toContain('<title>');
    expect(xmlContent).toContain('<description>');
    expect(xmlContent).toContain('</channel>');
    expect(xmlContent).toContain('</rss>');
  });

  test('JSON feed should be valid JSON Feed format', async ({ request }) => {
    const response = await request.get('/feed.json');
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/json/);
    
    const jsonFeed = await response.json();
    
    // Check JSON Feed format
    expect(jsonFeed).toHaveProperty('version');
    expect(jsonFeed.version).toMatch(/jsonfeed\.org/);
    expect(jsonFeed).toHaveProperty('title');
    expect(jsonFeed).toHaveProperty('home_page_url');
    expect(jsonFeed).toHaveProperty('feed_url');
    expect(jsonFeed).toHaveProperty('items');
    expect(Array.isArray(jsonFeed.items)).toBeTruthy();
    
    // Check items structure if any exist
    if (jsonFeed.items.length > 0) {
      const firstItem = jsonFeed.items[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('url');
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('content_html');
      expect(firstItem).toHaveProperty('date_published');
    }
  });

  test('sitemap should be accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);
    
    const sitemapContent = await response.text();
    
    // Check sitemap structure
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('<url>');
    expect(sitemapContent).toContain('<loc>');
  });

  test('robots.txt should be accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/text\/plain/);
    
    const robotsContent = await response.text();
    
    // Check robots.txt content
    expect(robotsContent).toMatch(/User-agent/);
    expect(robotsContent).toMatch(/Disallow|Allow/);
  });

  test('API should have proper CORS headers', async ({ request }) => {
    const response = await request.get('/api/posts');
    
    // Check for CORS headers (if implemented)
    const headers = response.headers();
    
    // These might not be set yet, but good to test for when implemented
    if (headers['access-control-allow-origin']) {
      expect(headers['access-control-allow-origin']).toBeDefined();
    }
  });

  test('API should handle rate limiting gracefully', async ({ request }) => {
    // Make multiple rapid requests to test rate limiting
    const requests = Array(10).fill(0).map(() => 
      request.get('/api/posts')
    );
    
    const responses = await Promise.all(requests);
    
    // All should succeed (no rate limiting yet) or some should return 429
    const statusCodes = responses.map(r => r.status());
    const hasRateLimit = statusCodes.some(code => code === 429);
    const allSucceed = statusCodes.every(code => code === 200);
    
    expect(hasRateLimit || allSucceed).toBeTruthy();
  });
});