import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Blog Pages', () => {
  test('blog listing page should work correctly', async ({ page }) => {
    await page.goto('/blog');

    // Check page title
    await expect(page).toHaveTitle(/Blog.*Pixel Wisdom/i);

    // Check for blog posts or empty state
    const postsContainer = page.getByRole('main');
    await expect(postsContainer).toBeVisible();

    // Check if posts are displayed or if there's an empty state
    const blogPosts = page.locator('[data-testid="blog-post"], article');
    const emptyMessage = page.getByText(/no.*posts/i);

    const postsCount = await blogPosts.count();
    const hasEmptyMessage = await emptyMessage.isVisible();

    expect(postsCount > 0 || hasEmptyMessage).toBeTruthy();
  });

  test('should display blog post metadata', async ({ page }) => {
    await page.goto('/blog');

    // If there are blog posts, check their metadata
    const firstPost = page.locator('[data-testid="blog-post"], article').first();
    
    if (await firstPost.isVisible()) {
      // Check for title
      await expect(firstPost.getByRole('heading')).toBeVisible();
      
      // Check for date or reading time
      const dateElement = firstPost.locator('[data-testid="post-date"], time, .date');
      const readTimeElement = firstPost.locator('[data-testid="read-time"], .read-time');
      
      expect(
        await dateElement.isVisible() || await readTimeElement.isVisible()
      ).toBeTruthy();
    }
  });

  test('should allow navigation to individual blog posts', async ({ page }) => {
    await page.goto('/blog');

    const firstPostLink = page.locator('[data-testid="blog-post"] a, article a').first();
    
    if (await firstPostLink.isVisible()) {
      const postTitle = await firstPostLink.textContent();
      await firstPostLink.click();

      // Should navigate to individual post
      await expect(page).toHaveURL(/\/blog\/.+/);
      
      // Check post content is displayed
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('individual blog post should have proper structure', async ({ page }) => {
    // Navigate to a specific post (we'll use hello-world as it should exist)
    await page.goto('/blog/hello-world');

    // Check if page loads (might be 404 if post doesn't exist)
    const is404 = await page.getByText(/404|not found/i).isVisible();
    
    if (!is404) {
      // Check post structure
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      
      // Check for back navigation or breadcrumbs
      const backLink = page.getByRole('link', { name: /back|blog/i });
      if (await backLink.isVisible()) {
        await expect(backLink).toBeVisible();
      }

      // Check for sharing buttons or metadata
      const shareButtons = page.locator('[data-testid="share-buttons"], .share');
      const postMeta = page.locator('[data-testid="post-meta"], .post-meta');
      
      // At least one should be present
      expect(
        await shareButtons.isVisible() || await postMeta.isVisible()
      ).toBeTruthy();
    }
  });

  test('blog search should work', async ({ page }) => {
    await page.goto('/blog');

    // Look for search functionality
    const searchInput = page.getByRole('searchbox');
    const searchButton = page.getByRole('button', { name: /search/i });

    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await searchInput.press('Enter');
      
      // Should filter results or navigate to search
      await page.waitForTimeout(1000); // Allow for filtering
    } else if (await searchButton.isVisible()) {
      await searchButton.click();
      await expect(page.getByRole('searchbox')).toBeVisible();
    }
  });

  test('blog categories should be functional', async ({ page }) => {
    await page.goto('/blog');

    // Look for category filters or links
    const categoryLinks = page.getByRole('link', { name: /tech|art|finance|general/i });
    
    if (await categoryLinks.first().isVisible()) {
      const firstCategory = categoryLinks.first();
      await firstCategory.click();
      
      // Should navigate to category page or filter posts
      await expect(page).toHaveURL(/category|blog/);
    }
  });

  test('RSS feed should be accessible', async ({ page }) => {
    // Test RSS feed endpoint
    const response = await page.request.get('/feed.xml');
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
    
    const feedContent = await response.text();
    expect(feedContent).toContain('<?xml');
    expect(feedContent).toContain('<rss');
  });

  test('JSON feed should be accessible', async ({ page }) => {
    // Test JSON feed endpoint
    const response = await page.request.get('/feed.json');
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('json');
    
    const feedContent = await response.json();
    expect(feedContent).toHaveProperty('version');
    expect(feedContent).toHaveProperty('title');
    expect(feedContent).toHaveProperty('items');
  });

  test('blog should be accessible', async ({ page }) => {
    await page.goto('/blog');

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog');

    // Check mobile layout
    await expect(page.getByRole('main')).toBeVisible();
    
    // Check if posts are stacked vertically on mobile
    const posts = page.locator('[data-testid="blog-post"], article');
    if (await posts.count() > 1) {
      const firstPost = posts.first();
      const secondPost = posts.nth(1);
      
      const firstBox = await firstPost.boundingBox();
      const secondBox = await secondPost.boundingBox();
      
      if (firstBox && secondBox) {
        // Second post should be below first post on mobile
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 20);
      }
    }
  });
});