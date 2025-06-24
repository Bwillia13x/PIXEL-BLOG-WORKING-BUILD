import { test, expect } from '@playwright/test'

// Simple visual regression check to ensure the primary page heading is not
// rendered underneath the fixed nav-bar.

test('primary heading is positioned below the nav-bar', async ({ page }) => {
  await page.goto('/')

  const nav = page.locator('header')
  const heading = page.locator('h1').first()

  const navBox = await nav.boundingBox()
  const headingBox = await heading.boundingBox()

  expect(navBox).not.toBeNull()
  expect(headingBox).not.toBeNull()

  if (navBox && headingBox) {
    // The Y-coordinate of the heading should start _after_ the nav bottom
    expect(headingBox.y).toBeGreaterThan(navBox.y + navBox.height - 1)
  }
})