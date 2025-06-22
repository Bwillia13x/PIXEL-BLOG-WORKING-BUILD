'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock, Users, CheckCircle } from 'lucide-react'

interface ContactStats {
  totalMessages: number
  averageResponseTime: string
  satisfactionRate: number
  activeConversations: number
}

export default function ContactAnalytics() {
  const [stats, setStats] = useState<ContactStats>({
    totalMessages: 0,
    averageResponseTime: '0h',
    satisfactionRate: 0,
    activeConversations: 0
  })

  useEffect(() => {
    // Simulate loading contact stats
    const loadStats = async () => {
      // In a real app, this would fetch from your analytics API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalMessages: 247,
        averageResponseTime: '18h',
        satisfactionRate: 98,
        activeConversations: 3
      })
    }

    loadStats()
  }, [])

  const statItems = [
    {
      icon: MessageSquare,
      label: 'Messages Received',
      value: stats.totalMessages.toLocaleString(),
      color: 'text-blue-400'
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: stats.averageResponseTime,
      color: 'text-green-400'
    },
    {
      icon: CheckCircle,
      label: 'Satisfaction Rate',
      value: `${stats.satisfactionRate}%`,
      color: 'text-purple-400'
    },
    {
      icon: Users,
      label: 'Active Chats',
      value: stats.activeConversations.toString(),
      color: 'text-orange-400'
    }
  ]

  return (
    <motion.div
      className="bg-gray-800/40 border border-green-400/20 rounded-lg p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.h3
        className="text-lg font-pixel mb-4 text-green-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Contact Stats
      </motion.h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-green-400/30 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gray-600 ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-mono text-xs text-gray-400">{item.label}</p>
                <p className={`font-pixel text-lg ${item.color}`}>{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="mt-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="font-mono text-xs text-green-400 text-center">
          🚀 Currently online and ready to chat!
        </p>
      </motion.div>
    </motion.div>
  )
} 