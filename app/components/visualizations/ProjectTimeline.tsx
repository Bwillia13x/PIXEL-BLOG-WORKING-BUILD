'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInDays, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { PixelIconLibrary } from '../design-system/PixelIcons';

// Timeline data types
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  category: 'project' | 'milestone' | 'release' | 'learning' | 'achievement';
  status: 'completed' | 'in-progress' | 'planned' | 'cancelled';
  tags: string[];
  color?: string;
  icon?: keyof typeof PixelIconLibrary;
  metadata?: {
    version?: string;
    technologies?: string[];
    team?: string[];
    impact?: number;
    complexity?: number;
    budget?: number;
    github?: string;
    demo?: string;
  };
}

export interface TimelineRange {
  start: Date;
  end: Date;
  zoom: number; // 1 = year view, 2 = quarter view, 3 = month view, 4 = week view
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
  initialRange?: TimelineRange;
  height?: number;
  className?: string;
  onEventClick?: (event: TimelineEvent) => void;
  onRangeChange?: (range: TimelineRange) => void;
}

// Color scheme for different categories
const CATEGORY_COLORS = {
  project: '#00ff88',
  milestone: '#ff0088',
  release: '#0088ff',
  learning: '#ffaa00',
  achievement: '#ff4444'
};

const STATUS_COLORS = {
  completed: '#00ff88',
  'in-progress': '#ffaa00',
  planned: '#0088ff',
  cancelled: '#ff4444'
};

// Timeline scale component
const TimelineScale = ({ 
  range, 
  onZoomChange,
  onRangeChange 
}: {
  range: TimelineRange;
  onZoomChange: (zoom: number) => void;
  onRangeChange: (range: TimelineRange) => void;
}) => {
  
  const zoomLevels = [
    { level: 1, label: 'YEAR', unit: 'year' },
    { level: 2, label: 'QUARTER', unit: 'quarter' },
    { level: 3, label: 'MONTH', unit: 'month' },
    { level: 4, label: 'WEEK', unit: 'week' }
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono text-gray-400">TIMELINE VIEW:</span>
        <div className="flex gap-1">
          {zoomLevels.map((level) => (
            <button
              key={level.level}
              onClick={() => onZoomChange(level.level)}
              className={`px-3 py-1 text-xs font-mono border transition-colors ${
                range.zoom === level.level
                  ? 'bg-retro-green text-black border-retro-green'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRangeChange({
            ...range,
            start: new Date(range.start.getFullYear() - 1, 0, 1),
            end: new Date(range.end.getFullYear() - 1, 11, 31)
          })}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <PixelIconLibrary.ArrowLeft size={16} />
        </button>
        
        <span className="text-sm font-mono text-white min-w-32 text-center">
          {format(range.start, 'yyyy')} - {format(range.end, 'yyyy')}
        </span>
        
        <button
          onClick={() => onRangeChange({
            ...range,
            start: new Date(range.start.getFullYear() + 1, 0, 1),
            end: new Date(range.end.getFullYear() + 1, 11, 31)
          })}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <PixelIconLibrary.ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Timeline event component
const TimelineEventCard = ({ 
  event, 
  position, 
  width,
  onClick 
}: {
  event: TimelineEvent;
  position: { x: number; y: number };
  width: number;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = event.icon ? PixelIconLibrary[event.icon] : PixelIconLibrary.Star;
  
  const statusColor = STATUS_COLORS[event.status];
  const categoryColor = event.color || CATEGORY_COLORS[event.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="absolute cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(width, 120)
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Timeline event: ${event.title} - ${event.status}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div
        className="bg-gray-900 border-2 p-3 h-20 relative overflow-hidden transition-all duration-200"
        style={{
          borderColor: isHovered ? categoryColor : '#374151',
          backgroundColor: isHovered ? `${categoryColor}20` : '#111827'
        }}
      >
        {/* Status indicator */}
        <div
          className="absolute top-1 right-1 w-3 h-3"
          style={{ backgroundColor: statusColor }}
        />
        
        {/* Content */}
        <div className="flex items-start gap-2">
          <Icon size={16} color={categoryColor} />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-pixel text-white truncate">
              {event.title}
            </h4>
            <p className="text-xs text-gray-400 truncate mt-1">
              {format(parseISO(event.startDate), 'MMM yyyy')}
            </p>
            <div className="flex gap-1 mt-1">
              {event.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1 bg-gray-800 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress bar for ongoing projects */}
        {event.status === 'in-progress' && (
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-700">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Detailed event modal
const EventDetailModal = ({ 
  event, 
  onClose 
}: {
  event: TimelineEvent | null;
  onClose: () => void;
}) => {
  if (!event) return null;

  const Icon = event.icon ? PixelIconLibrary[event.icon] : PixelIconLibrary.Star;
  const statusColor = STATUS_COLORS[event.status];
  const categoryColor = event.color || CATEGORY_COLORS[event.category];

  const duration = event.endDate 
    ? differenceInDays(parseISO(event.endDate), parseISO(event.startDate))
    : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-950 border-2 border-gray-600 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Icon size={24} color={categoryColor} />
                <div>
                  <h2 className="text-xl font-pixel text-white mb-2">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className="px-2 py-1 text-black font-mono text-xs"
                      style={{ backgroundColor: statusColor }}
                    >
                      {event.status.toUpperCase()}
                    </span>
                    <span
                      className="px-2 py-1 text-black font-mono text-xs"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {event.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-800 transition-colors"
              >
                <PixelIconLibrary.Close size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-pixel text-white mb-2">DESCRIPTION</h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-pixel text-white mb-3">TIMELINE</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start:</span>
                    <span className="text-white">{format(parseISO(event.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                  {event.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">End:</span>
                      <span className="text-white">{format(parseISO(event.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{duration} days</span>
                    </div>
                  )}
                </div>
              </div>

              {event.metadata && (
                <div>
                  <h3 className="text-sm font-pixel text-white mb-3">METADATA</h3>
                  <div className="space-y-2 text-sm font-mono">
                    {event.metadata.technologies && (
                      <div>
                        <span className="text-gray-400">Tech Stack:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.metadata.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.metadata.complexity && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Complexity:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                i < event.metadata!.complexity! ? 'bg-retro-green' : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {event.metadata.impact && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Impact:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                i < event.metadata!.impact! ? 'bg-yellow-500' : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {event.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-pixel text-white mb-2">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(event.metadata?.github || event.metadata?.demo) && (
              <div className="flex gap-4 pt-4 border-t border-gray-700">
                {event.metadata.github && (
                  <a
                    href={event.metadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white font-mono text-sm"
                  >
                    <PixelIconLibrary.Github size={16} />
                    View Code
                  </a>
                )}
                {event.metadata.demo && (
                  <a
                    href={event.metadata.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-retro-green hover:bg-green-500 transition-colors text-black font-mono text-sm"
                  >
                    <PixelIconLibrary.Link size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Filter panel
const FilterPanel = ({ 
  events,
  filters,
  onFiltersChange 
}: {
  events: TimelineEvent[];
  filters: {
    categories: string[];
    statuses: string[];
    tags: string[];
  };
  onFiltersChange: (filters: { categories: string[]; statuses: string[]; tags: string[] }) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const allCategories = Array.from(new Set(events.map(e => e.category)));
  const allStatuses = Array.from(new Set(events.map(e => e.status)));
  const allTags = Array.from(new Set(events.flatMap(e => e.tags)));

  const toggleFilter = (type: string, value: string) => {
    const currentFilters = filters[type as keyof typeof filters];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFiltersChange({
      ...filters,
      [type]: newFilters
    });
  };

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-900 transition-colors"
      >
        <span className="font-pixel text-white">FILTERS</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <PixelIconLibrary.ArrowDown size={16} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-pixel text-white mb-2">CATEGORIES</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleFilter('categories', category)}
                      className={`px-2 py-1 text-xs font-mono transition-colors ${
                        filters.categories.includes(category)
                          ? 'bg-retro-green text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-pixel text-white mb-2">STATUS</h4>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleFilter('statuses', status)}
                      className={`px-2 py-1 text-xs font-mono transition-colors ${
                        filters.statuses.includes(status)
                          ? 'bg-retro-green text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-pixel text-white mb-2">TAGS</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.slice(0, 20).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleFilter('tags', tag)}
                      className={`px-2 py-1 text-xs font-mono transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-retro-green text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main timeline component
export const ProjectTimeline = ({ 
  events, 
  initialRange,
  height = 600,
  className = '',
  onEventClick,
  onRangeChange
}: ProjectTimelineProps) => {
  const [range, setRange] = useState<TimelineRange>(
    initialRange || {
      start: startOfYear(new Date(2020, 0, 1)),
      end: endOfYear(new Date()),
      zoom: 1
    }
  );
  
  const [filters, setFilters] = useState({
    categories: [] as string[],
    statuses: [] as string[],
    tags: [] as string[]
  });
  
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      const inRange = isWithinInterval(eventDate, { start: range.start, end: range.end });
      
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(event.category);
      const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(event.status);
      const tagMatch = filters.tags.length === 0 || event.tags.some(tag => filters.tags.includes(tag));
      
      return inRange && categoryMatch && statusMatch && tagMatch;
    });
  }, [events, range, filters]);

  // Calculate event positions
  const eventPositions = useMemo(() => {
    const totalDays = differenceInDays(range.end, range.start);
    const timelineWidth = 800; // Base width
    
    return filteredEvents.map((event, index) => {
      const eventDate = parseISO(event.startDate);
      const daysFromStart = differenceInDays(eventDate, range.start);
      const x = (daysFromStart / totalDays) * timelineWidth;
      const y = 60 + (index % 4) * 90; // Stagger events vertically
      
      const endDate = event.endDate ? parseISO(event.endDate) : eventDate;
      const eventDuration = differenceInDays(endDate, eventDate);
      const width = Math.max((eventDuration / totalDays) * timelineWidth, 120);
      
      return {
        event,
        position: { x, y },
        width
      };
    });
  }, [filteredEvents, range]);

  const handleRangeChange = (newRange: TimelineRange) => {
    setRange(newRange);
    onRangeChange?.(newRange);
  };

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  return (
    <div className={`bg-gray-950 border-2 border-gray-700 ${className}`}>
      <TimelineScale
        range={range}
        onZoomChange={(zoom) => handleRangeChange({ ...range, zoom })}
        onRangeChange={handleRangeChange}
      />
      
      <FilterPanel
        events={events}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <div 
        ref={timelineRef}
        className="relative overflow-auto"
        style={{ height: height - 140 }}
      >
        {/* Timeline grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-600"
              style={{ left: `${(i / 12) * 100}%` }}
            />
          ))}
        </div>
        
        {/* Events */}
        <AnimatePresence>
          {eventPositions.map(({ event, position, width }) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              position={position}
              width={width}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </AnimatePresence>
        
        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <PixelIconLibrary.Search size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 font-mono">No events found in the selected range</p>
            </div>
          </div>
        )}
      </div>
      
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};