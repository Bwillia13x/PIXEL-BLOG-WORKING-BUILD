import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enhanced Projects - It From Bit Portfolio',
  description: 'Interactive project showcase with 3D cards, filtering, timeline view, and comparison tools. Explore my development portfolio with advanced visualization features.',
  keywords: [
    'portfolio',
    'projects',
    'web development',
    'interactive',
    '3D effects',
    'project comparison',
    'timeline',
    'filtering'
  ]
}

export default function EnhancedProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}