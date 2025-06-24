"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface AdminAuthProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<boolean>
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const success = await onLogin({ username, password })
      if (!success) {
        setError('Invalid credentials. Please try again.')
      }
    } catch {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoCredentials = () => {
    setUsername('admin')
    setPassword('pixel-wisdom-2025')
    setShowCredentials(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {Math.random() > 0.5 ? '0' : '1'}
          </motion.div>
        ))}
      </div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Terminal Window */}
        <div className="bg-gray-800 border-2 border-green-400 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-gray-700 px-4 py-3 border-b border-green-400/30">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-green-400 font-mono text-sm">
                admin@pixel-wisdom:~$
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 bg-black text-green-400 font-mono">
            {/* ASCII Art */}
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs leading-none mb-6 text-center"
            >
              {`    ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄   ▄▄ ▄▄▄ ▄▄▄▄▄▄▄ 
   █       █       █  █▄█  █   █       █
   █   ▄   █  ▄▄▄▄▄█       █   █   ▄   █
   █  █▄█  █ █▄▄▄▄▄█       █   █  █ █  █
   █       █▄▄▄▄▄  █       █   █  █▄█  █
   █   ▄   █▄▄▄▄▄█ █ ██▄██ █   █       █
   █▄▄█ █▄▄█▄▄▄▄▄▄▄█▄█   █▄█▄▄▄█▄▄▄▄▄▄▄█`}
            </motion.pre>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6"
            >
              <h1 className="text-xl font-bold mb-2">ADMIN ACCESS</h1>
              <p className="text-sm text-gray-400">
                Enter credentials to access analytics dashboard
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Username Field */}
              <div>
                <label className="block text-sm mb-1">Username:</label>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">&gt;</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent border-b border-green-400/50 focus:border-green-400 outline-none py-1 font-mono"
                    placeholder="Enter username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm mb-1">Password:</label>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">&gt;</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-b border-green-400/50 focus:border-green-400 outline-none py-1 font-mono"
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/30 border border-red-500/50 rounded p-3 text-red-400 text-sm"
                >
                  <span className="font-mono">ERROR:</span> {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-green-600/20 border border-green-400 text-green-400 py-3 rounded-lg hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  'LOGIN TO DASHBOARD'
                )}
              </motion.button>
            </motion.form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-4 border-t border-gray-700"
            >
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-xs text-gray-500 hover:text-gray-400 underline"
              >
                Demo Credentials
              </button>
              
              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-xs text-gray-400 bg-gray-900/50 p-3 rounded"
                >
                  <p className="mb-2">For demonstration purposes:</p>
                  <p>Username: <code className="text-green-400">admin</code></p>
                  <p>Password: <code className="text-green-400">pixel-wisdom-2025</code></p>
                  <button
                    onClick={handleDemoCredentials}
                    className="mt-2 text-green-400 hover:text-green-300 underline"
                  >
                    Fill demo credentials
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-4 text-center text-xs text-gray-500"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Analytics Dashboard Ready</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminAuth 