"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import RetroTerminal from './RetroTerminal'
import useTerminal from '../hooks/useTerminal'

interface TerminalContextType {
  openTerminal: () => void
  closeTerminal: () => void
  toggleTerminal: () => void
  isOpen: boolean
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined)

export function useTerminalContext() {
  const context = useContext(TerminalContext)
  if (context === undefined) {
    throw new Error('useTerminalContext must be used within a TerminalProvider')
  }
  return context
}

interface TerminalProviderProps {
  children: ReactNode
}

export function TerminalProvider({ children }: TerminalProviderProps) {
  const { openTerminal, closeTerminal, toggleTerminal, isOpen } = useTerminal()

  return (
    <TerminalContext.Provider 
      value={{ 
        openTerminal, 
        closeTerminal, 
        toggleTerminal, 
        isOpen 
      }}
    >
      {children}
      <RetroTerminal />
    </TerminalContext.Provider>
  )
}

export default TerminalProvider 