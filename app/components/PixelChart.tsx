"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface PixelChartProps {
  title: string
  data: ChartData[]
  type: 'line' | 'area' | 'bar' | 'pie'
  height?: number
  showLegend?: boolean
  color?: string
  gradient?: boolean
}

// Pixel color palette
const PIXEL_COLORS = [
  '#4ade80', // Primary green
  '#22d3ee', // Cyan
  '#a78bfa', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#06b6d4'  // Sky blue
]

const PixelChart: React.FC<PixelChartProps> = ({
  title,
  data,
  type,
  height = 300,
  showLegend = false,
  color = '#4ade80',
  gradient = true
}) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-green-400 rounded-lg p-3 shadow-lg">
          <p className="text-green-400 font-mono text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-300 font-mono text-xs">
              <span style={{ color: entry.color }}>●</span>
              {` ${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom grid component for pixel effect
  const PixelGrid = (props: any) => (
    <CartesianGrid
      {...props}
      stroke="#4ade80"
      strokeOpacity={0.2}
      strokeDasharray="2 2"
    />
  )

  // Custom axis tick
  const CustomTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#9ca3af"
        className="font-mono text-xs"
      >
        {payload.value}
      </text>
    </g>
  )

  const renderChart = (): React.ReactElement | null => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <defs>
              {gradient && (
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              )}
            </defs>
            <PixelGrid />
            <XAxis
              tick={<CustomTick />}
              axisLine={{ stroke: '#4ade80', strokeOpacity: 0.3 }}
              tickLine={{ stroke: '#4ade80', strokeOpacity: 0.3 }}
            />
            <YAxis
              tick={<CustomTick />}
              axisLine={{ stroke: '#4ade80', strokeOpacity: 0.3 }}
              tickLine={{ stroke: '#4ade80', strokeOpacity: 0.3 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ color: '#9ca3af' }} />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <PixelGrid />
            <XAxis tick={<CustomTick />} />
            <YAxis tick={<CustomTick />} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            <PixelGrid />
            <XAxis tick={<CustomTick />} />
            <YAxis tick={<CustomTick />} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              fill={color}
              opacity={0.8}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIXEL_COLORS[index % PIXEL_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-green-400/30"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-400 font-mono text-lg">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs font-mono">Live</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500 mb-2">📊</div>
              <p className="text-gray-400 font-mono text-sm">No data available</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {renderChart() || <div />}
          </ResponsiveContainer>
        )}

        {/* Pixel overlay effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="w-full h-full"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 4px,
                rgba(74, 222, 128, 0.1) 4px,
                rgba(74, 222, 128, 0.1) 5px
              )`
            }}
          />
        </div>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
        <span className="font-mono">
          {data.length} data points
        </span>
        <span className="font-mono">
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  )
}

export default PixelChart 