// Advanced Data Visualization Components - Main Export File

// Core chart components with animations
export {
  AnimatedLineChart,
  GlowAreaChart,
  PixelBarChart,
  RadialProgressChart,
  TechTreemap,
  PerformanceScatterPlot,
  MetricsComposedChart,
  AnimatedChartContainer,
  ChartStyles
} from './AdvancedCharts';

// Interactive project timeline
export {
  ProjectTimeline,
  type TimelineEvent,
  type TimelineRange
} from './ProjectTimeline';

// Real-time dashboard system
export {
  RealTimeDashboard,
  type WidgetConfig,
  type DashboardLayout
} from './RealTimeDashboard';

// Project comparison tools
export {
  ProjectComparison,
  type ComparisonProject
} from './ProjectComparison';

// Data export system
export {
  DataExportSystem,
  type ExportConfig,
  type ExportableData
} from './DataExportSystem';

// Animated infographics
export {
  AnimatedInfographics,
  type InfographicData
} from './AnimatedInfographics';

// Visualization system constants and utilities
export const VISUALIZATION_FEATURES = {
  charts: [
    'animated_line_charts',
    'glow_area_charts',
    'pixel_bar_charts',
    'radial_progress',
    'technology_treemap',
    'performance_scatter',
    'composed_metrics'
  ],
  dashboard: [
    'real_time_updates',
    'drag_drop_widgets',
    'customizable_layouts',
    'live_activity_feed',
    'system_monitoring',
    'progress_tracking'
  ],
  timeline: [
    'zoomable_periods',
    'filterable_events',
    'detailed_modals',
    'category_filtering',
    'status_tracking',
    'metadata_display'
  ],
  comparison: [
    'side_by_side_metrics',
    'visual_diff_displays',
    'technology_analysis',
    'performance_charts',
    'radar_visualizations',
    'table_comparisons'
  ],
  export: [
    'pdf_generation',
    'multiple_templates',
    'custom_branding',
    'csv_data_export',
    'json_structured',
    'image_snapshots'
  ],
  infographics: [
    'animated_counters',
    'progress_animations',
    'skill_radar_charts',
    'timeline_visualization',
    'performance_circles',
    'technology_usage'
  ]
} as const;

// Theme configurations for visualizations
export const VISUALIZATION_THEMES = {
  retro: {
    primary: '#00ff88',
    secondary: '#ff0088',
    accent: '#0088ff',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    colors: [
      '#00ff88', '#ff0088', '#0088ff', '#ffaa00', 
      '#ff4444', '#44ff44', '#8844ff', '#ffff44'
    ]
  },
  neon: {
    primary: '#00d4ff',
    secondary: '#ff0099',
    accent: '#39ff14',
    background: '#0a0a1a',
    surface: '#1a1a2e',
    text: '#ffffff',
    colors: [
      '#00d4ff', '#ff0099', '#39ff14', '#ff6600',
      '#bf00ff', '#ffff00', '#ff073a', '#00ffff'
    ]
  },
  dark: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    colors: [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
      '#ef4444', '#10b981', '#3b82f6', '#f97316'
    ]
  }
} as const;

// Data processing utilities
export const DATA_UTILS = {
  formatNumber: (num: number, decimals = 0): string => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  calculatePercentage: (value: number, total: number): number => {
    return total === 0 ? 0 : (value / total) * 100;
  },
  
  generateTimeSeriesData: (days: number, baseValue = 100, variance = 20) => {
    return Array.from({ length: days }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: baseValue + Math.random() * variance - variance / 2,
      timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString()
    }));
  },
  
  aggregateData: <T extends Record<string, unknown>>(
    data: T[],
    groupBy: keyof T & string,
    valueKey: keyof T & string
  ) => {
    const groups = data.reduce<Record<string, number[]>>((acc, item) => {
      const key = String(item[groupBy]);
      const value = Number(item[valueKey]);
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
      return acc;
    }, {});
    
    return Object.entries(groups).map(([key, values]) => ({
      name: key,
      value: (values as number[]).reduce((sum, val) => sum + val, 0),
      count: (values as number[]).length,
      average: (values as number[]).reduce((sum, val) => sum + val, 0) / (values as number[]).length
    }));
  }
};

// Animation configurations
export const ANIMATION_CONFIGS = {
  fast: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  normal: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  slow: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  bounce: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] },
  smooth: { duration: 1.0, ease: [0.4, 0.0, 0.2, 1] }
} as const;

// Responsive breakpoints for visualizations
export const RESPONSIVE_BREAKPOINTS = {
  mobile: { width: 320, height: 200 },
  tablet: { width: 768, height: 300 },
  desktop: { width: 1024, height: 400 },
  large: { width: 1440, height: 500 }
} as const;

// Default chart configurations
export const DEFAULT_CHART_CONFIG = {
  theme: 'retro' as const,
  animated: true,
  interactive: true,
  responsive: true,
  height: 300,
  margin: { top: 20, right: 30, left: 20, bottom: 5 }
} as const;