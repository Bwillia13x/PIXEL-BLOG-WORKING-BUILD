'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { PixelIconLibrary } from '../design-system/PixelIcons';

// Core infographic data types
export interface InfographicMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

export interface TechnologyUsageData {
  name: string;
  usage: number;
}

export interface ProjectStats {
  totalProjects: number;
  linesOfCode: number;
  githubStars: number;
  completionRate: number;
}

export interface PerformanceMetricData {
  score: number;
  description: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  metrics?: Record<string, string>;
}

export interface SkillData {
  name: string;
  level: number;
}

export interface InfographicData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'counter' | 'progress' | 'comparison' | 'timeline' | 'chart' | 'icon-stat';
  data: TechnologyUsageData[] | ProjectStats | Record<string, PerformanceMetricData> | TimelineEvent[] | SkillData[];
  color?: string;
  icon?: keyof typeof PixelIconLibrary;
}

// Animated counter component
const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  decimals = 0 
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const startValue = 0;
      const endValue = value;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="font-pixel text-retro-green">
      {prefix}{displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}
    </div>
  );
};

// Technology usage infographic
const TechnologyUsageInfographic = ({ data }: { data: TechnologyUsageData[] }) => {
  const maxUsage = Math.max(...data.map(item => item.usage));

  return (
    <div className="bg-gray-950 border-2 border-gray-700 p-6">
      <h3 className="text-xl font-pixel text-white mb-6 text-center">
        TECHNOLOGY STACK USAGE
      </h3>
      
      <div className="space-y-4">
        {data.map((tech, index) => {
          const percentage = (tech.usage / maxUsage) * 100;
          
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-24 text-sm font-mono text-gray-300 truncate">
                {tech.name}
              </div>
              
              <div className="flex-1 bg-gray-800 h-6 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-retro-green to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono text-white">
                    {tech.usage} projects
                  </span>
                </div>
              </div>
              
              <div className="w-12 text-sm font-mono text-gray-400 text-right">
                {Math.round(percentage)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Project statistics dashboard
const ProjectStatsDashboard = ({ stats }: { stats: ProjectStats }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: 'Github' as const,
      color: '#00ff88',
      suffix: ''
    },
    {
      label: 'Lines of Code',
      value: stats.linesOfCode,
      icon: 'Settings' as const,
      color: '#0088ff',
      suffix: ''
    },
    {
      label: 'GitHub Stars',
      value: stats.githubStars,
      icon: 'Star' as const,
      color: '#ffaa00',
      suffix: ''
    },
    {
      label: 'Completion Rate',
      value: stats.completionRate,
      icon: 'Check' as const,
      color: '#ff0088',
      suffix: '%'
    }
  ];

  return (
    <div ref={ref} className="bg-gray-950 border-2 border-gray-700 p-6">
      <h3 className="text-xl font-pixel text-white mb-6 text-center">
        PROJECT STATISTICS
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = PixelIconLibrary[stat.icon];
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                className="mb-4"
              >
                <Icon size={48} color={stat.color} className="mx-auto" />
              </motion.div>
              
              <div className="text-3xl font-pixel mb-2" style={{ color: stat.color }}>
                {isInView && (
                  <AnimatedCounter
                    value={stat.value}
                    duration={2000}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              
              <div className="text-sm font-mono text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Performance metrics visualization
const PerformanceMetrics = ({ metrics }: { metrics: Record<string, PerformanceMetricData> }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="bg-gray-950 border-2 border-gray-700 p-6">
      <h3 className="text-xl font-pixel text-white mb-6 text-center">
        PERFORMANCE METRICS
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(metrics).map(([key, value]: [string, PerformanceMetricData], index) => {
          const percentage = Math.min(value.score, 100);
          const color = percentage >= 90 ? '#00ff88' : percentage >= 70 ? '#ffaa00' : '#ff4444';
          
          return (
            <div key={key} className="text-center">
              <h4 className="text-sm font-mono text-gray-400 mb-4 uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                  />
                  
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={isInView ? { 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) 
                    } : {}}
                    transition={{ delay: index * 0.3, duration: 1.5 }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-pixel" style={{ color }}>
                      {isInView && (
                        <AnimatedCounter
                          value={percentage}
                          duration={1500}
                          suffix="%"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs font-mono text-gray-400">
                {value.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Timeline visualization
const TimelineVisualization = ({ events }: { events: TimelineEvent[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="bg-gray-950 border-2 border-gray-700 p-6">
      <h3 className="text-xl font-pixel text-white mb-6 text-center">
        DEVELOPMENT TIMELINE
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-600" />
        
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.3 }}
              className="relative flex items-start gap-6"
            >
              {/* Timeline dot */}
              <motion.div
                className="relative z-10 w-4 h-4 bg-retro-green border-2 border-gray-950"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.3 + 0.2 }}
              />
              
              {/* Event content */}
              <div className="flex-1">
                <div className="bg-gray-900 border border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-pixel text-white">{event.title}</h4>
                    <span className="text-xs font-mono text-gray-400">{event.date}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{event.description}</p>
                  
                  {event.metrics && (
                    <div className="flex gap-4 text-xs">
                      {Object.entries(event.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-retro-green font-mono">{value as string}</div>
                          <div className="text-gray-400">{key}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skill proficiency radar
const SkillProficiencyRadar = ({ skills }: { skills: SkillData[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const numSkills = skills.length;

  const getPointPosition = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  const getLabelPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
    const distance = radius + 30;
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  return (
    <div ref={ref} className="bg-gray-950 border-2 border-gray-700 p-6">
      <h3 className="text-xl font-pixel text-white mb-6 text-center">
        SKILL PROFICIENCY
      </h3>
      
      <div className="flex justify-center">
        <svg width="300" height="300" className="overflow-visible">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((percent) => (
            <circle
              key={percent}
              cx={centerX}
              cy={centerY}
              r={(percent / 100) * radius}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Grid lines */}
          {skills.map((_, index) => {
            const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
            const endX = centerX + Math.cos(angle) * radius;
            const endY = centerY + Math.sin(angle) * radius;
            
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#374151"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Skill polygon */}
          <motion.polygon
            points={skills.map((skill, index) => {
              const point = getPointPosition(index, skill.level);
              return `${point.x},${point.y}`;
            }).join(' ')}
            fill="rgba(0, 255, 136, 0.2)"
            stroke="#00ff88"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2 }}
          />
          
          {/* Skill points */}
          {skills.map((skill, index) => {
            const point = getPointPosition(index, skill.level);
            return (
              <motion.circle
                key={skill.name}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#00ff88"
                stroke="#000"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              />
            );
          })}
          
          {/* Skill labels */}
          {skills.map((skill, index) => {
            const labelPos = getLabelPosition(index);
            return (
              <motion.text
                key={`label-${skill.name}`}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {skill.name}
              </motion.text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Main infographics component
export const AnimatedInfographics = ({ 
  className = '' 
}: {
  className?: string;
}) => {
  // Sample data for demonstrations
  const projectStats = {
    totalProjects: 42,
    linesOfCode: 156789,
    githubStars: 1234,
    completionRate: 94
  };

  const performanceMetrics = {
    performance: { score: 95, description: 'Page Load Speed' },
    security: { score: 89, description: 'Security Rating' },
    accessibility: { score: 92, description: 'A11y Compliance' },
    seo: { score: 88, description: 'SEO Optimization' }
  };

  const technologyUsage = [
    { name: 'React', usage: 15 },
    { name: 'TypeScript', usage: 12 },
    { name: 'Next.js', usage: 8 },
    { name: 'Node.js', usage: 10 },
    { name: 'Python', usage: 6 },
    { name: 'PostgreSQL', usage: 7 },
    { name: 'Docker', usage: 9 },
    { name: 'AWS', usage: 5 }
  ];

  const timelineEvents = [
    {
      id: '1',
      title: 'Project Genesis',
      description: 'Started the It From Bit blog project with initial MVP design',
      date: 'Jan 2024',
      metrics: { commits: '45', features: '8', performance: '-', users: '-', satisfaction: '-' }
    },
    {
      id: '2',
      title: 'Analytics Integration',
      description: 'Implemented comprehensive analytics system with real-time tracking',
      date: 'Feb 2024',
      metrics: { commits: '-', features: '-', performance: '+25%', users: '1.2K', satisfaction: '-' }
    },
    {
      id: '3',
      title: 'Advanced Features',
      description: 'Added theme system, visualizations, and interactive components',
      date: 'Mar 2024',
      metrics: { commits: '-', features: '24', performance: '-', users: '-', satisfaction: '94%' }
    }
  ];

  const skillProficiency = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Docker', level: 75 },
    { name: 'AWS', level: 70 },
    { name: 'Design', level: 85 },
    { name: 'Testing', level: 80 }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-pixel text-white mb-4">
          ANIMATED INFOGRAPHICS
        </h2>
        <p className="text-gray-400 font-mono max-w-2xl mx-auto">
          Interactive data visualizations that bring statistics to life with 
          smooth animations and pixel-perfect design aesthetics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        <ProjectStatsDashboard stats={projectStats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceMetrics metrics={performanceMetrics} />
          <SkillProficiencyRadar skills={skillProficiency} />
        </div>
        
        <TechnologyUsageInfographic data={technologyUsage} />
        
        <TimelineVisualization events={timelineEvents} />
      </div>
    </div>
  );
};