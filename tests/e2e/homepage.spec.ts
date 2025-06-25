import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage', () => {
  test('should load and display key elements', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/It From Bit/);

    // Check main heading
    await expect(page.getByRole('heading', { name: /Welcome to It From Bit/i })).toBeVisible();

    // Check navigation is present
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check main content area
    await expect(page.getByRole('main')).toBeVisible();

    // Check footer
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Test navigation links
    const navLinks = [
      { text: /projects/i, expectedUrl: '/projects' },
      { text: /blog/i, expectedUrl: '/blog' },
      { text: /about/i, expectedUrl: '/about' },
      { text: /contact/i, expectedUrl: '/contact' }
    ];

    for (const link of navLinks) {
      const navLink = page.getByRole('link', { name: link.text });
      await expect(navLink).toBeVisible();
      
      // Click and verify navigation
      await navLink.click();
      await expect(page).toHaveURL(new RegExp(link.expectedUrl));
      
      // Go back to homepage for next test
      await page.goto('/');
    }
  });

  test('should display CTA buttons', async ({ page }) => {
    await page.goto('/');

    // Check for main CTA buttons
    await expect(page.getByRole('link', { name: /view projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /read blog/i })).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile navigation (hamburger menu)
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check if mobile menu opens
      await expect(page.getByRole('navigation')).toBeVisible();
    }

    // Ensure main content is still visible
    await expect(page.getByRole('heading', { name: /Welcome to It From Bit/i })).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');

    // Look for search input or button
    const searchInput = page.getByRole('searchbox');
    const searchButton = page.getByRole('button', { name: /search/i });

    if (await searchInput.isVisible()) {
      await searchInput.fill('test query');
      await searchInput.press('Enter');
      
      // Should navigate to search results or show results
      await expect(page).toHaveURL(/search/);
    } else if (await searchButton.isVisible()) {
      await searchButton.click();
      // Should open search interface
      await expect(page.getByRole('searchbox')).toBeVisible();
    }
  });

  test('should handle background animations', async ({ page }) => {
    await page.goto('/');

    // Check if canvas elements for animations are present
    const canvasElements = page.locator('canvas');
    
    if (await canvasElements.count() > 0) {
      // Ensure canvas is rendered
      await expect(canvasElements.first()).toBeVisible();
      
      // Test reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      
      // Canvas should still be present but animations should be reduced
      // This is handled by CSS media queries
    }
  });

  test('should load performance optimally', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check response status
    expect(response?.status()).toBe(200);

    // Check page load time (should be under 3 seconds)
    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: perfData.responseEnd - perfData.requestStart
      };
    });

    expect(navigationTiming.loadTime).toBeLessThan(3000);
  });
});