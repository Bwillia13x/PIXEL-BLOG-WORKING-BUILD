import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Theming System Demo - It From Bit',
  description: 'Interactive demonstration of the advanced theming system with retro color schemes, live preview, and custom theme creation.',
  keywords: [
    'theming',
    'CSS variables',
    'retro themes',
    'accessibility',
    'custom themes',
    'live preview',
    'pixel blog'
  ]
}

export default function ThemeDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}