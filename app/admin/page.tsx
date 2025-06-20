"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminAuth from '../components/AdminAuth'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function AdminPage() {
  const { isAuthenticated, login, logout, user } = useAdminAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={login} />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-green-400/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center"
              >
                <span className="text-green-400 font-mono text-xl">📊</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-green-400">
                  Pixel Analytics
                </h1>
                <p className="text-gray-400 text-sm">
                  Admin Dashboard v2.1.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-green-400 font-mono text-sm">
                  Welcome, {user?.username}
                </p>
                <p className="text-gray-400 text-xs">
                  Last login: {user?.lastLogin}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-600/30 transition-colors font-mono text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnalyticsDashboard />
      </main>
    </div>
  )
} 