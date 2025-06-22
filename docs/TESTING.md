# Testing Guide

This document outlines the comprehensive testing strategy for the Pixel Wisdom blog platform.

## Overview

Our testing strategy includes:
- **Unit Tests**: Component and utility function testing with Vitest
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing with Playwright
- **Accessibility Tests**: Automated a11y testing with axe-core
- **Performance Tests**: Core Web Vitals and loading performance

## Test Structure

```
/
├── __tests__/                 # Unit and integration tests
│   ├── components/           # React component tests
│   ├── utils/               # Utility function tests
│   ├── api/                 # API route tests
│   └── home.test.tsx        # Page tests
├── tests/                   # E2E tests
│   └── e2e/                # Playwright tests
├── test/                   # Test configuration
│   └── setup.ts           # Global test setup
└── coverage/              # Test coverage reports
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Install browsers first (one-time setup)
npm run playwright:install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Categories

### 1. Component Tests

Located in `__tests__/components/`, these test React components in isolation:

- **ResponsiveHeader.test.tsx**: Navigation, mobile menu, accessibility
- **SearchBar.test.tsx**: Search functionality, keyboard navigation
- And more component tests as needed

Example:
```typescript
import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import MyComponent from '../MyComponent'

test('renders correctly', () => {
  render(<MyComponent />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

### 2. API Tests

Located in `__tests__/api/`, these test API endpoints:

- **posts.test.ts**: Blog post API functionality
- Validates response formats, error handling, and data integrity

### 3. Utility Tests

Located in `__tests__/utils/`, these test utility functions:

- **analytics.test.ts**: Analytics tracking functionality
- Tests privacy compliance, error handling, batching

### 4. E2E Tests

Located in `tests/e2e/`, these test complete user journeys:

- **homepage.spec.ts**: Homepage functionality, navigation, accessibility
- **blog.spec.ts**: Blog listing, individual posts, RSS feeds
- **api.spec.ts**: API endpoint validation

### 5. Accessibility Tests

Integrated into E2E tests using `@axe-core/playwright`:

```typescript
import AxeBuilder from '@axe-core/playwright'

test('should be accessible', async ({ page }) => {
  await page.goto('/')
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  expect(accessibilityScanResults.violations).toEqual([])
})
```

## Coverage Requirements

We maintain the following coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Coverage reports are generated in:
- `coverage/html/index.html` (HTML report)
- `coverage/lcov.info` (LCOV format for CI)

## Test Configuration

### Vitest Configuration

Key features in `vitest.config.ts`:
- JSDoc environment for React testing
- Path aliases for imports
- Coverage reporting with v8
- Global test setup

### Playwright Configuration

Key features in `playwright.config.ts`:
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic web server startup
- Video/screenshot capture on failure
- Accessibility testing integration

### Test Setup

`test/setup.ts` provides:
- Global mocks (IntersectionObserver, matchMedia, etc.)
- Next.js router mocking
- Theme provider mocking
- Browser API mocking

## Writing Tests

### Best Practices

1. **Test Behavior, Not Implementation**
   ```typescript
   // Good - tests user behavior
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
   
   // Avoid - tests implementation details
   expect(wrapper.find('.submit-button')).toHaveLength(1)
   ```

2. **Use Semantic Queries**
   ```typescript
   // Preferred order
   screen.getByRole('button')
   screen.getByLabelText('Search')
   screen.getByPlaceholderText('Enter search term')
   screen.getByText('Submit')
   screen.getByTestId('submit-button') // Last resort
   ```

3. **Test Accessibility**
   ```typescript
   // Check ARIA attributes
   expect(button).toHaveAttribute('aria-expanded', 'false')
   
   // Test keyboard navigation
   await user.keyboard('{Tab}')
   expect(nextElement).toHaveFocus()
   ```

4. **Mock External Dependencies**
   ```typescript
   vi.mock('./api', () => ({
     fetchPosts: vi.fn().mockResolvedValue([])
   }))
   ```

### Component Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi, describe, it, beforeEach } from 'vitest'
import MyComponent from '../MyComponent'

// Mock dependencies
vi.mock('../hooks/useMyHook', () => ({
  useMyHook: vi.fn(() => ({ data: null, loading: false }))
}))

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })

  it('is accessible', () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
  })
})
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/feature')
    
    // Test functionality
    await expect(page.getByRole('heading')).toBeVisible()
    
    // Test accessibility
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

## CI/CD Integration

Tests run automatically in GitHub Actions:

1. **Unit Tests**: Run on every push/PR
2. **E2E Tests**: Run after unit tests pass
3. **Coverage**: Uploaded to Codecov
4. **Security**: Dependency auditing
5. **Deploy**: Only after all tests pass

## Debugging Tests

### Unit Tests
```bash
# Debug specific test
npm run test:watch -- --reporter=verbose MyComponent

# Debug with browser tools
npm run test:ui
```

### E2E Tests
```bash
# Run with headed browser
npm run test:e2e:debug

# Run specific test
npx playwright test homepage.spec.ts --debug
```

## Performance Testing

E2E tests include performance checks:
- Page load times < 3 seconds
- Core Web Vitals monitoring
- Network request validation
- Bundle size tracking

## Future Enhancements

- [ ] Visual regression testing with Chromatic
- [ ] API contract testing with Pact
- [ ] Load testing with Artillery
- [ ] Mutation testing with Stryker
- [ ] Cross-browser testing with BrowserStack

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)