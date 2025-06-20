'use client'

import { ThemeProvider } from '@/app/contexts/ThemeContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}