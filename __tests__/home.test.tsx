import { render, screen } from '@testing-library/react'
import React from 'react'
import Home from '../app/page'

describe('Home page', () => {
  it('renders welcome text', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to Pixel Wisdom')).toBeInTheDocument()
  })
}) 