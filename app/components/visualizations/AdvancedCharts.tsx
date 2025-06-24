'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Treemap,
  ComposedChart,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';

// Enhanced chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
  color?: string;
  metadata?: Record<string, string | number | boolean>;
  x?: number;
  y?: number;
  label?: string;
  animatedValue?: number;
  prediction?: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  category?: string;
  trend?: 'up' | 'down' | 'stable';
  prediction?: number;
}

export interface MultiSeriesDataPoint {
  name: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string;
}

export interface PieSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

export interface ChartConfig {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: string[];
}

export interface TooltipPayload {
  color?: string;
  name?: string;
  value?: string | number;
  dataKey?: string;
  payload?: ChartDataPoint;
}

export interface PixelTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  theme?: 'retro' | 'neon' | 'dark' | 'light';
}

export interface TreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  name?: string;
  value?: number;
}

// Advanced chart props
interface AdvancedChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  theme?: 'retro' | 'neon' | 'dark' | 'light';
  animated?: boolean;
  interactive?: boolean;
  className?: string;
  onHover?: (data: ChartDataPoint) => void;
  onClick?: (data: ChartDataPoint) => void;
  onSelect?: (series: ChartSeries) => void;
}

// Retro pixel color palette
const RETRO_COLORS = [
  '#00ff88', // Retro green
  '#ff0088', // Hot pink
  '#0088ff', // Electric blue
  '#ffaa00', // Orange
  '#ff4444', // Red
  '#44ff44', // Bright green
  '#8844ff', // Purple
  '#ffff44', // Yellow
  '#ff8844', // Orange-red
  '#44ffff'  // Cyan
];

const NEON_COLORS = [
  '#00d4ff', // Neon blue
  '#ff0099', // Neon pink
  '#39ff14', // Neon green
  '#ff6600', // Neon orange
  '#bf00ff', // Neon purple
  '#ffff00', // Neon yellow
  '#ff073a', // Neon red
  '#00ffff', // Neon cyan
  '#ff69b4', // Hot pink
  '#7fff00'  // Chartreuse
];

// Custom tooltip component
const PixelTooltip = ({ active, payload, label, theme = 'retro' }: PixelTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const bgColor = theme === 'retro' ? '#0a0a0a' : '#1a1a2e';
  const borderColor = theme === 'retro' ? '#00ff88' : '#00d4ff';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-950 border-2 p-3 shadow-lg"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        fontFamily: 'monospace'
      }}
    >
      <p className="text-white font-pixel text-sm mb-2">{label}</p>
      {payload.map((entry: TooltipPayload, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="text-white font-bold">{entry.value}</span>
        </div>
      ))}
    </motion.div>
  );
};

// Animated line chart with trend analysis
export const AnimatedLineChart = ({ 
  data, 
  height = 300, 
  theme = 'retro',
  animated = true,
  interactive = true,
  className = ''
}: AdvancedChartProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      animatedValue: animated ? item.value * animationProgress : item.value
    }));
  }, [data, animationProgress, animated]);

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={processedData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'retro' ? '#333' : '#444'}
            strokeWidth={1}
          />
          <XAxis 
            dataKey="name" 
            stroke={colors[0]}
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke={colors[0]}
            fontSize={12}
            fontFamily="monospace"
          />
          {interactive && (
            <Tooltip 
              content={<PixelTooltip theme={theme} />}
              cursor={{ stroke: colors[0], strokeWidth: 2 }}
            />
          )}
          <Line
            type="monotone"
            dataKey={animated ? "animatedValue" : "value"}
            stroke={colors[0]}
            strokeWidth={3}
            dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: '#fff' }}
            animationDuration={2000}
            animationEasing="ease-out"
          />
          {data.some(d => d.prediction) && (
            <Line
              type="monotone"
              dataKey="prediction"
              stroke={colors[1]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={2000}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi-layer area chart with glow effects
export const GlowAreaChart = ({ 
  data, 
  height = 300, 
  theme = 'retro',
  animated = true,
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            {colors.map((color, index) => (
              <React.Fragment key={index}>
                <linearGradient id={`glowGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
                <filter id={`glow${index}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </React.Fragment>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          <YAxis stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          <Tooltip content={<PixelTooltip theme={theme} />} />
          {Object.keys(data[0] || {}).filter(key => key !== 'name').map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={colors[index % colors.length]}
              fill={`url(#glowGradient${index % colors.length})`}
              strokeWidth={2}
              filter={`url(#glow${index % colors.length})`}
              animationDuration={animated ? 2000 : 0}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Animated bar chart with pixel styling
export const PixelBarChart = ({ 
  data, 
  height = 300, 
  theme = 'retro',
  animated = true,
  interactive = true,
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          <YAxis stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          {interactive && (
            <Tooltip 
              content={<PixelTooltip theme={theme} />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
          )}
          <Bar 
            dataKey="value" 
            fill={colors[0]}
            stroke={colors[0]}
            strokeWidth={2}
            animationDuration={animated ? 1500 : 0}
            animationBegin={100}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Radial progress chart
export const RadialProgressChart = ({ 
  data, 
  height = 300, 
  theme = 'retro',
  animated = true,
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="10%" 
          outerRadius="80%" 
          barSize={10} 
          data={data}
        >
          <RadialBar 
            dataKey="value" 
            cornerRadius={2} 
            fill={colors[0]}
            animationDuration={animated ? 2000 : 0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </RadialBar>
          <Tooltip content={<PixelTooltip theme={theme} />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Technology treemap visualization
export const TechTreemap = ({ 
  data, 
  height = 400, 
  theme = 'retro',
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  const CustomizedContent = (props: TreemapContentProps) => {
    const { x, y, width, height, index, name, value } = props;
    
    // Guard against undefined values
    if (x == null || y == null || width == null || height == null || index == null) {
      return null;
    }
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: '#000',
            strokeWidth: 2,
            fillOpacity: 0.8
          }}
        />
        {width > 60 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="#000"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="#000"
              fontSize="10"
              fontFamily="monospace"
            >
              {value}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={data}
          dataKey="value"
          aspectRatio={4/3}
          stroke="#000"
          content={<CustomizedContent />}
        />
      </ResponsiveContainer>
    </div>
  );
};

// Performance metrics scatter plot
export const PerformanceScatterPlot = ({ 
  data, 
  height = 400, 
  theme = 'retro',
  animated = true,
  interactive = true,
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Performance" 
            stroke={colors[0]}
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Complexity" 
            stroke={colors[0]}
            fontSize={12}
            fontFamily="monospace"
          />
          {interactive && (
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={<PixelTooltip theme={theme} />}
            />
          )}
          <Scatter 
            name="Projects" 
            dataKey="y" 
            fill={colors[0]}
            animationDuration={animated ? 1500 : 0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Scatter>
          <ReferenceLine x={50} stroke="#666" strokeDasharray="5 5" />
          <ReferenceLine y={50} stroke="#666" strokeDasharray="5 5" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi-metric composed chart
export const MetricsComposedChart = ({ 
  data, 
  height = 400, 
  theme = 'retro',
  animated = true,
  interactive = true,
  className = ''
}: AdvancedChartProps) => {
  const colors = theme === 'retro' ? RETRO_COLORS : NEON_COLORS;

  return (
    <div className={`pixel-chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          <YAxis stroke={colors[0]} fontSize={12} fontFamily="monospace" />
          {interactive && (
            <Tooltip content={<PixelTooltip theme={theme} />} />
          )}
          <Legend />
          <Bar dataKey="visitors" barSize={20} fill={colors[0]} animationDuration={animated ? 1500 : 0} />
          <Line type="monotone" dataKey="pageViews" stroke={colors[1]} strokeWidth={3} animationDuration={animated ? 2000 : 0} />
          <Area type="monotone" dataKey="engagement" fill={colors[2]} stroke={colors[2]} fillOpacity={0.3} animationDuration={animated ? 2500 : 0} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Chart container with animation wrapper
export const AnimatedChartContainer = ({ 
  children, 
  title, 
  delay = 0,
  className = '' 
}: {
  children: React.ReactNode;
  title?: string;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={`bg-gray-950 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors ${className}`}
    >
      {title && (
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-lg font-pixel text-white mb-4"
        >
          {title}
        </motion.h3>
      )}
      {children}
    </motion.div>
  );
};

// Global chart styles
export const ChartStyles = () => (
  <style jsx global>{`
    .pixel-chart-container {
      font-family: 'monospace', monospace;
    }
    
    .pixel-chart-container .recharts-cartesian-axis-tick-value {
      font-family: monospace;
      font-size: 12px;
    }
    
    .pixel-chart-container .recharts-tooltip-wrapper {
      z-index: 1000;
    }
    
    .pixel-chart-container .recharts-legend-item-text {
      font-family: monospace !important;
      font-size: 12px !important;
    }
    
    /* Custom animations */
    @keyframes pixelGlow {
      0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
      50% { filter: brightness(1.2) drop-shadow(0 0 10px currentColor); }
    }
    
    .pixel-chart-container:hover {
      animation: pixelGlow 2s ease-in-out infinite;
    }
    
    /* Pixel-perfect rendering */
    .pixel-chart-container svg {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
      image-rendering: pixelated;
    }
  `}</style>
);