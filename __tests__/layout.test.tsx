import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as React from 'react'

// Using relative path to avoid path alias issues in test environment
import RootLayout from '../app/layout'

// Helper wrapper to satisfy children prop
const Wrapper: React.FC<{ text?: string }> = ({ text = 'Test content' }) => {
  return (
    <RootLayout>
      <h1>{text}</h1>
    </RootLayout>
  )
}

describe.skip('Base layout spacing', () => {
  it('renders HeaderSpacer directly after the header', () => {
    const { container } = render(<Wrapper />)
    const header = container.querySelector('header')
    if (!header) throw new Error('Header not found in layout')
    // The spacer should be the next sibling
    const spacer = header.nextElementSibling as HTMLElement | null
    expect(spacer).not.toBeNull()
    expect(spacer?.getAttribute('data-testid')).toBe('header-spacer')
  })
})