"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface DeviceData {
  desktop: number
  mobile: number
  tablet: number
  browsers: Array<{ name: string; percentage: number }>
  operatingSystems: Array<{ name: string; percentage: number }>
}

interface DeviceAnalyticsProps {
  data?: DeviceData
}

const DeviceAnalytics: React.FC<DeviceAnalyticsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-green-400/30">
        <h3 className="text-green-400 font-mono text-lg mb-4">Device Analytics</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">📱</div>
          <p className="text-gray-400 font-mono text-sm">
            No device data available
          </p>
        </div>
      </div>
    )
  }

  const deviceTypes = [
    { name: 'Desktop', value: data.desktop, icon: '🖥️', color: 'bg-green-400' },
    { name: 'Mobile', value: data.mobile, icon: '📱', color: 'bg-blue-400' },
    { name: 'Tablet', value: data.tablet, icon: '📱', color: 'bg-purple-400' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 font-mono text-lg">Device Analytics</h3>
        <div className="text-xs text-gray-400 font-mono">
          User Devices
        </div>
      </div>

      {/* Device Types */}
      <div className="mb-6">
        <h4 className="text-gray-400 text-sm font-mono mb-3">Device Types</h4>
        <div className="space-y-3">
          {deviceTypes.map((device, index) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <span className="text-lg">{device.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-mono text-green-400">
                    {device.name}
                  </span>
                  <span className="text-sm font-mono text-gray-400">
                    {device.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${device.value}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    className={`h-2 rounded-full ${device.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Browsers */}
      <div className="mb-6">
        <h4 className="text-gray-400 text-sm font-mono mb-3">Browsers</h4>
        <div className="space-y-2">
          {data.browsers.map((browser, index) => (
            <motion.div
              key={browser.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-mono text-gray-300">
                  {browser.name}
                </span>
              </div>
              <span className="text-sm font-mono text-green-400">
                {browser.percentage}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Operating Systems */}
      <div>
        <h4 className="text-gray-400 text-sm font-mono mb-3">Operating Systems</h4>
        <div className="space-y-2">
          {data.operatingSystems.map((os, index) => (
            <motion.div
              key={os.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-mono text-gray-300">
                  {os.name}
                </span>
              </div>
              <span className="text-sm font-mono text-blue-400">
                {os.percentage}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-mono text-green-400">
              {data.desktop + data.mobile + data.tablet}%
            </div>
            <div className="text-xs text-gray-400">Total Coverage</div>
          </div>
          <div>
            <div className="text-lg font-mono text-blue-400">
              {data.browsers.length}
            </div>
            <div className="text-xs text-gray-400">Browsers</div>
          </div>
          <div>
            <div className="text-lg font-mono text-purple-400">
              {data.operatingSystems.length}
            </div>
            <div className="text-xs text-gray-400">OS Types</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DeviceAnalytics 