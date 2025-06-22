import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import React from 'react'
import Home from '../app/page'

describe('Home page', () => {
  it('renders welcome text', async () => {
    // Since Home is an async component, we need to resolve it first
    const HomeComponent = await Home()
    render(HomeComponent)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Welcome to Pixel Wisdom/i })).toBeInTheDocument()
    })
  })
}) 