import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: [
      '**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      '**/tests/**/*.{test,spec}.{js,ts,tsx}',
      '**/test/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: ['**/tests/e2e/**', '**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
        '**/.next/**',
        '**/public/**',
        '**/__tests__/**',
        '**/test/**',
        'playwright.config.ts',
        'next.config.mjs',
        'tailwind.config.js',
        'postcss.config.mjs'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    testTimeout: 30000,
    hookTimeout: 30000
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './app/components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './app/hooks'),
      '@/utils': path.resolve(__dirname, './app/utils'),
      '@/app': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app')
    }
  }
}) 