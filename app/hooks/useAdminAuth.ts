"use client"

import { useState, useEffect, useCallback } from 'react'

interface AdminUser {
  username: string
  lastLogin: string
  sessionExpiry: number
}

interface LoginCredentials {
  username: string
  password: string
}

// Demo credentials - In production, use proper authentication service
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'pixel-wisdom-2025' // This should be hashed and stored securely
}

const SESSION_DURATION = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
const STORAGE_KEY = 'pixel-admin-session'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const checkExistingSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEY)
      if (sessionData) {
        const session: AdminUser = JSON.parse(sessionData)
        
        // Check if session is still valid
        if (session.sessionExpiry > Date.now()) {
          setIsAuthenticated(true)
          setUser(session)
        } else {
          // Session expired, clean up
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
    setUser(null)
    setAuthError(null)
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  // Auto-logout when session expires
  useEffect(() => {
    if (isAuthenticated && user) {
      const timeUntilExpiry = user.sessionExpiry - Date.now()
      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          logout()
        }, timeUntilExpiry)
        
        return () => clearTimeout(timer)
      } else {
        logout()
      }
    }
  }, [isAuthenticated, user, logout])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate credentials
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        const sessionExpiry = Date.now() + SESSION_DURATION
        const adminUser: AdminUser = {
          username: credentials.username,
          lastLogin: new Date().toLocaleString(),
          sessionExpiry
        }

        // Store session
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser))
        
        setIsAuthenticated(true)
        setUser(adminUser)
        
        return true
      } else {
        setAuthError('Invalid username or password')
        return false
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.')
      return false
    }
  }, [])

  const extendSession = useCallback(() => {
    if (isAuthenticated && user) {
      const newExpiry = Date.now() + SESSION_DURATION
      const updatedUser = { ...user, sessionExpiry: newExpiry }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }, [isAuthenticated, user])

  const getTimeUntilExpiry = useCallback((): number => {
    if (user) {
      return Math.max(0, user.sessionExpiry - Date.now())
    }
    return 0
  }, [user])

  const isSessionExpiringSoon = useCallback((): boolean => {
    const timeLeft = getTimeUntilExpiry()
    return timeLeft > 0 && timeLeft < 15 * 60 * 1000 // Less than 15 minutes
  }, [getTimeUntilExpiry])

  return {
    isAuthenticated,
    user,
    authError,
    login,
    logout,
    extendSession,
    getTimeUntilExpiry,
    isSessionExpiringSoon,
    checkExistingSession
  }
}

export default useAdminAuth 