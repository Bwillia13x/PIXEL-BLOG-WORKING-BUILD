'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, Reorder } from 'framer-motion';
import { useAnalyticsData } from '@/app/hooks/useAnalyticsData';
import { PixelIconLibrary } from '../design-system/PixelIcons';
import { 
  AnimatedLineChart, 
  PixelBarChart, 
  RadialProgressChart,
  MetricsComposedChart,
  AnimatedChartContainer 
} from './AdvancedCharts';

// Widget types and configurations
export interface WidgetSettings {
  metric?: string;
  unit?: string;
  showTrend?: boolean;
  icon?: keyof typeof PixelIconLibrary;
  color?: string;
  threshold?: number;
  format?: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress' | 'realtime' | 'status';
  size: 'small' | 'medium' | 'large' | 'wide';
  position: { x: number; y: number };
  refreshInterval?: number;
  settings?: WidgetSettings;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  columns: number;
  theme: 'retro' | 'neon' | 'dark';
}

export interface ActivityItem {
  id: string | number;
  description: string;
  timestamp: string;
  type?: string;
  user?: string;
}

export interface LiveDataMetrics {
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSession: number;
  conversion: number;
  serverLoad: number;
  errorRate: number;
  responseTime: number;
  [key: string]: number;
}

// Live data generator for demo
const generateLiveData = (): LiveDataMetrics => ({
  visitors: Math.floor(Math.random() * 50) + 100,
  pageViews: Math.floor(Math.random() * 200) + 300,
  bounceRate: Math.floor(Math.random() * 30) + 20,
  avgSession: Math.floor(Math.random() * 180) + 120,
  conversion: Math.floor(Math.random() * 5) + 2,
  serverLoad: Math.floor(Math.random() * 40) + 30,
  errorRate: Math.floor(Math.random() * 2) + 0.5,
  responseTime: Math.floor(Math.random() * 100) + 200
});

// Metric widget component
const MetricWidget = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  icon, 
  color = '#00ff88',
  size = 'medium' 
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  icon?: keyof typeof PixelIconLibrary;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
}) => {
  const Icon = icon ? PixelIconLibrary[icon] : PixelIconLibrary.ArrowUp;
  const trendColor = trend && trend > 0 ? '#00ff88' : trend && trend < 0 ? '#ff4444' : '#ffaa00';
  
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    wide: 'p-6'
  };

  return (
    <motion.div 
      className={`bg-gray-900 border-2 border-gray-700 hover:border-retro-green transition-colors ${sizeClasses[size]}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-mono text-gray-400 uppercase">{title}</h3>
        <Icon size={20} color={color} />
      </div>
      
      <div className="flex items-baseline gap-2">
        <motion.span 
          className="text-2xl font-pixel text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={value}
        >
          {value}
        </motion.span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <motion.div
            animate={{ rotate: trend > 0 ? 0 : 180 }}
            className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
            style={{ borderBottomColor: trendColor }}
          />
          <span className="text-xs font-mono" style={{ color: trendColor }}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Real-time activity feed
const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-4 h-full">
      <h3 className="text-sm font-pixel text-white mb-4">LIVE ACTIVITY</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {activities.slice(0, 10).map((activity, index) => (
            <motion.div
              key={`${activity.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-3 p-2 bg-gray-800 border border-gray-600"
            >
              <div className="w-2 h-2 bg-retro-green mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-mono truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// System status widget
const SystemStatus = ({ 
  services 
}: {
  services: Array<{ name: string; status: 'up' | 'down' | 'warning'; latency?: number }>
}) => {
  const statusColors = {
    up: '#00ff88',
    warning: '#ffaa00',
    down: '#ff4444'
  };

  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-4">
      <h3 className="text-sm font-pixel text-white mb-4">SYSTEM STATUS</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3"
                style={{ backgroundColor: statusColors[service.status] }}
                animate={{ opacity: service.status === 'up' ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-mono text-white">{service.name}</span>
            </div>
            {service.latency && (
              <span className="text-xs text-gray-400">{service.latency}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress tracking widget
const ProgressWidget = ({ 
  projects 
}: {
  projects: Array<{ name: string; progress: number; status: string }>
}) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-4">
      <h3 className="text-sm font-pixel text-white mb-4">PROJECT PROGRESS</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-mono text-white truncate">
                {project.name}
              </span>
              <span className="text-xs text-gray-400">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2">
              <motion.div
                className="h-full bg-retro-green"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">{project.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Widget factory
const WidgetFactory = ({ 
  config, 
  liveData, 
  onRemove, 
  onEdit 
}: {
  config: WidgetConfig;
  liveData: LiveDataMetrics;
  onRemove: () => void;
  onEdit: () => void;
}) => {
  const dragControls = useDragControls();

  const renderWidget = () => {
    switch (config.type) {
      case 'metric':
        return (
          <MetricWidget
            title={config.title}
            value={liveData[config.settings?.metric || ''] || 0}
            unit={config.settings?.unit}
            trend={config.settings?.showTrend ? Math.random() * 10 - 5 : undefined}
            icon={config.settings?.icon}
            color={config.settings?.color}
            size={config.size}
          />
        );

      case 'chart':
        const chartData = Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.floor(Math.random() * 100) + 50
        }));
        
        return (
          <AnimatedChartContainer title={config.title}>
            <AnimatedLineChart
              data={chartData}
              height={200}
              theme="retro"
              animated={true}
            />
          </AnimatedChartContainer>
        );

      case 'progress':
        const progressData = [
          { name: 'Blog Platform', progress: 85, status: 'In Progress' },
          { name: 'Analytics', progress: 100, status: 'Complete' },
          { name: 'API Integration', progress: 45, status: 'Planning' }
        ];
        return <ProgressWidget projects={progressData} />;

      case 'status':
        const services = [
          { name: 'Web Server', status: 'up' as const, latency: 45 },
          { name: 'Database', status: 'up' as const, latency: 23 },
          { name: 'API Gateway', status: 'warning' as const, latency: 156 },
          { name: 'CDN', status: 'up' as const, latency: 12 }
        ];
        return <SystemStatus services={services} />;

      case 'realtime':
        const activities = Array.from({ length: 15 }, (_, i) => ({
          id: i,
          description: `User action ${i + 1}: Page view on /blog/post-${i + 1}`,
          timestamp: `${Math.floor(Math.random() * 60)} seconds ago`
        }));
        return <ActivityFeed activities={activities} />;

      default:
        return <div className="bg-gray-900 border-2 border-gray-700 p-4">Unknown widget type</div>;
    }
  };

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1'
  };

  return (
    <motion.div
      className={`relative group ${sizeClasses[config.size]}`}
      layout
      drag
      dragControls={dragControls}
      dragMomentum={false}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
    >
      {/* Widget controls */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <PixelIconLibrary.Settings size={12} />
          </button>
          <button
            onClick={onRemove}
            className="p-1 bg-gray-800 hover:bg-red-600 transition-colors"
          >
            <PixelIconLibrary.Close size={12} />
          </button>
        </div>
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <PixelIconLibrary.Plus size={12} />
      </div>

      {renderWidget()}
    </motion.div>
  );
};

// Dashboard controls
const DashboardControls = ({ 
  layout,
  onLayoutChange,
  onAddWidget,
  onSaveLayout,
  onLoadLayout,
  availableLayouts 
}: {
  layout: DashboardLayout;
  onLayoutChange: (layout: DashboardLayout) => void;
  onAddWidget: () => void;
  onSaveLayout: () => void;
  onLoadLayout: (layoutId: string) => void;
  availableLayouts: DashboardLayout[];
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-pixel text-white">REAL-TIME DASHBOARD</h1>
        <select
          value={layout.id}
          onChange={(e) => onLoadLayout(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white px-3 py-1 font-mono text-sm"
        >
          {availableLayouts.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 bg-retro-green"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm font-mono text-gray-400 mr-4">LIVE</span>

        <button
          onClick={onAddWidget}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white font-mono text-sm transition-colors"
        >
          + ADD WIDGET
        </button>
        
        <button
          onClick={onSaveLayout}
          className="px-3 py-1 bg-retro-green hover:bg-green-500 text-black font-mono text-sm transition-colors"
        >
          SAVE LAYOUT
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-800 transition-colors"
          >
            <PixelIconLibrary.Settings size={20} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 bg-gray-900 border border-gray-600 p-4 min-w-48 z-20"
              >
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-gray-400">REFRESH RATE</label>
                    <select className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-xs">
                      <option value="5000">5 seconds</option>
                      <option value="10000">10 seconds</option>
                      <option value="30000">30 seconds</option>
                      <option value="60000">1 minute</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-mono text-gray-400">THEME</label>
                    <select 
                      value={layout.theme}
                      onChange={(e) => onLayoutChange({
                        ...layout,
                        theme: e.target.value as 'retro' | 'neon' | 'dark'
                      })}
                      className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-xs"
                    >
                      <option value="retro">Retro</option>
                      <option value="neon">Neon</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-mono text-gray-400">GRID COLUMNS</label>
                    <input
                      type="range"
                      min="3"
                      max="6"
                      value={layout.columns}
                      onChange={(e) => onLayoutChange({
                        ...layout,
                        columns: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                    <span className="text-xs text-white">{layout.columns} columns</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Widget selector modal
const WidgetSelector = ({ 
  isOpen, 
  onClose, 
  onAddWidget 
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (config: Partial<WidgetConfig>) => void;
}) => {
  const widgetTypes = [
    { type: 'metric', name: 'Metric Card', description: 'Display key performance indicators' },
    { type: 'chart', name: 'Chart', description: 'Line, bar, or area charts' },
    { type: 'progress', name: 'Progress Tracker', description: 'Project progress bars' },
    { type: 'status', name: 'System Status', description: 'Service health monitoring' },
    { type: 'realtime', name: 'Activity Feed', description: 'Live user activity stream' },
    { type: 'list', name: 'Data List', description: 'Tabular data display' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-950 border-2 border-gray-600 w-full max-w-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-pixel text-white">ADD WIDGET</h2>
              <button onClick={onClose}>
                <PixelIconLibrary.Close size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgetTypes.map((widget) => (
                <button
                  key={widget.type}
                  onClick={() => {
                    onAddWidget({
                      type: widget.type as WidgetConfig['type'],
                      title: widget.name,
                      size: 'medium',
                      position: { x: 0, y: 0 }
                    });
                    onClose();
                  }}
                  className="text-left p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-retro-green transition-colors"
                >
                  <h3 className="font-pixel text-white mb-2">{widget.name}</h3>
                  <p className="text-sm text-gray-400 font-mono">{widget.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main dashboard component
export const RealTimeDashboard = ({ 
  className = '' 
}: {
  className?: string;
}) => {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>({
    id: 'default',
    name: 'Default Layout',
    columns: 4,
    theme: 'retro',
    widgets: [
      { id: '1', title: 'Visitors', type: 'metric', size: 'small', position: { x: 0, y: 0 }, settings: { metric: 'visitors', icon: 'User', unit: '' } },
      { id: '2', title: 'Page Views', type: 'metric', size: 'small', position: { x: 1, y: 0 }, settings: { metric: 'pageViews', icon: 'Search', unit: '' } },
      { id: '3', title: 'Bounce Rate', type: 'metric', size: 'small', position: { x: 2, y: 0 }, settings: { metric: 'bounceRate', icon: 'ArrowDown', unit: '%' } },
      { id: '4', title: 'Avg Session', type: 'metric', size: 'small', position: { x: 3, y: 0 }, settings: { metric: 'avgSession', icon: 'Settings', unit: 's' } },
      { id: '5', title: 'Analytics', type: 'chart', size: 'wide', position: { x: 0, y: 1 } },
      { id: '6', title: 'Projects', type: 'progress', size: 'medium', position: { x: 2, y: 1 } },
      { id: '7', title: 'System', type: 'status', size: 'medium', position: { x: 3, y: 1 } },
      { id: '8', title: 'Activity', type: 'realtime', size: 'wide', position: { x: 0, y: 3 } }
    ]
  });

  const [liveData, setLiveData] = useState(generateLiveData());
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(generateLiveData());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const availableLayouts = [
    currentLayout,
    {
      id: 'minimal',
      name: 'Minimal View',
      columns: 3,
      theme: 'dark' as const,
      widgets: currentLayout.widgets.slice(0, 4)
    }
  ];

  const handleAddWidget = (config: Partial<WidgetConfig>) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      title: config.title || 'New Widget',
      type: config.type || 'metric',
      size: config.size || 'medium',
      position: config.position || { x: 0, y: 0 },
      settings: config.settings || {}
    };

    setCurrentLayout({
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    });
  };

  const handleRemoveWidget = (widgetId: string) => {
    setCurrentLayout({
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
    });
  };

  const handleEditWidget = (widgetId: string) => {
    // Widget editing functionality - placeholder for future implementation
    console.info('Edit widget:', widgetId);
  };

  return (
    <div className={`bg-gray-950 border-2 border-gray-700 ${className}`}>
      <DashboardControls
        layout={currentLayout}
        onLayoutChange={setCurrentLayout}
        onAddWidget={() => setIsWidgetSelectorOpen(true)}
        onSaveLayout={() => {
          localStorage.setItem('dashboard-layout', JSON.stringify(currentLayout));
        }}
        onLoadLayout={(layoutId) => {
          const layout = availableLayouts.find(l => l.id === layoutId);
          if (layout) setCurrentLayout(layout);
        }}
        availableLayouts={availableLayouts}
      />

      <div 
        className="p-6 grid gap-6 auto-rows-min"
        style={{ 
          gridTemplateColumns: `repeat(${currentLayout.columns}, 1fr)`,
          minHeight: '80vh'
        }}
      >
        <Reorder.Group
          axis="y"
          values={currentLayout.widgets}
          onReorder={(widgets) => setCurrentLayout({ ...currentLayout, widgets })}
          className="contents"
        >
          {currentLayout.widgets.map((widget) => (
            <Reorder.Item key={widget.id} value={widget} className="contents">
              <WidgetFactory
                config={widget}
                liveData={liveData}
                onRemove={() => handleRemoveWidget(widget.id)}
                onEdit={() => handleEditWidget(widget.id)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <WidgetSelector
        isOpen={isWidgetSelectorOpen}
        onClose={() => setIsWidgetSelectorOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};