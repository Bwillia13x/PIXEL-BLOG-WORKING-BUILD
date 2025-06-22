'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PixelSkeletonProps {
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  variant?: 'line' | 'rect' | 'circle' | 'text';
  className?: string;
}

export const PixelSkeleton = ({ 
  width = '100%', 
  height = 16, 
  animate = true,
  variant = 'rect',
  className = ''
}: PixelSkeletonProps) => {
  const baseClasses = `bg-gray-700 border border-gray-600 pixel-perfect-border`;
  
  const variantClasses = {
    line: 'h-2',
    rect: '',
    circle: 'rounded-none', // Pixel art doesn't use real circles
    text: 'h-4'
  };

  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 0.8, 0.6],
      backgroundColor: ['#374151', '#4b5563', '#374151']
    }
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ 
        width, 
        height: typeof height === 'number' ? `${height}px` : height,
        imageRendering: 'pixelated'
      }}
      variants={pulseVariants}
      initial="initial"
      animate={animate ? "animate" : "initial"}
      transition={{
        duration: 1.5,
        repeat: animate ? Infinity : 0,
        ease: 'easeInOut'
      }}
    />
  );
};

// Blog Post Card Skeleton
export const PixelBlogCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-2 border-gray-700 p-4 space-y-4 pixel-perfect-border ${className}`}>
    {/* Featured image */}
    <PixelSkeleton width="100%" height={120} />
    
    {/* Title */}
    <div className="space-y-2">
      <PixelSkeleton width="85%" height={20} />
      <PixelSkeleton width="60%" height={20} />
    </div>
    
    {/* Meta info */}
    <div className="flex gap-4">
      <PixelSkeleton width={80} height={16} />
      <PixelSkeleton width={60} height={16} />
    </div>
    
    {/* Excerpt */}
    <div className="space-y-2">
      <PixelSkeleton width="100%" height={14} />
      <PixelSkeleton width="90%" height={14} />
      <PixelSkeleton width="75%" height={14} />
    </div>
    
    {/* Tags */}
    <div className="flex gap-2">
      <PixelSkeleton width={50} height={20} />
      <PixelSkeleton width={60} height={20} />
      <PixelSkeleton width={45} height={20} />
    </div>
    
    {/* Read more button */}
    <PixelSkeleton width={100} height={32} />
  </div>
);

// Project Card Skeleton
export const PixelProjectCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-2 border-gray-700 pixel-perfect-border ${className}`}>
    {/* Project preview */}
    <PixelSkeleton width="100%" height={200} className="border-b-2 border-gray-700" />
    
    <div className="p-4 space-y-4">
      {/* Title */}
      <PixelSkeleton width="80%" height={24} />
      
      {/* Description */}
      <div className="space-y-2">
        <PixelSkeleton width="100%" height={14} />
        <PixelSkeleton width="85%" height={14} />
      </div>
      
      {/* Tech stack */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <PixelSkeleton key={i} width={40 + Math.random() * 20} height={18} />
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <PixelSkeleton width={80} height={32} />
        <PixelSkeleton width={60} height={32} />
      </div>
    </div>
  </div>
);

// Navigation Skeleton
export const PixelNavSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-b-2 border-gray-700 p-4 ${className}`}>
    <div className="flex items-center justify-between">
      {/* Logo */}
      <PixelSkeleton width={120} height={32} />
      
      {/* Navigation items */}
      <div className="hidden md:flex gap-6">
        {[...Array(4)].map((_, i) => (
          <PixelSkeleton key={i} width={60 + Math.random() * 20} height={20} />
        ))}
      </div>
      
      {/* Theme toggle */}
      <PixelSkeleton width={40} height={32} />
    </div>
  </div>
);

// User Profile Skeleton
export const PixelUserProfileSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-2 border-gray-700 p-6 pixel-perfect-border ${className}`}>
    {/* Avatar and basic info */}
    <div className="flex gap-4 mb-6">
      <PixelSkeleton width={64} height={64} variant="circle" />
      <div className="flex-1 space-y-2">
        <PixelSkeleton width="60%" height={24} />
        <PixelSkeleton width="40%" height={16} />
        <PixelSkeleton width="80%" height={14} />
      </div>
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <PixelSkeleton width="100%" height={20} />
          <PixelSkeleton width="60%" height={14} className="mx-auto" />
        </div>
      ))}
    </div>
    
    {/* Bio */}
    <div className="space-y-2">
      <PixelSkeleton width="100%" height={14} />
      <PixelSkeleton width="90%" height={14} />
      <PixelSkeleton width="70%" height={14} />
    </div>
  </div>
);

// Comment Skeleton
export const PixelCommentSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-800 border border-gray-600 p-4 space-y-3 pixel-perfect-border ${className}`}>
    {/* User info */}
    <div className="flex gap-3">
      <PixelSkeleton width={32} height={32} variant="circle" />
      <div className="flex-1 space-y-1">
        <PixelSkeleton width={120} height={16} />
        <PixelSkeleton width={80} height={12} />
      </div>
    </div>
    
    {/* Comment content */}
    <div className="space-y-2">
      <PixelSkeleton width="100%" height={14} />
      <PixelSkeleton width="85%" height={14} />
      <PixelSkeleton width="60%" height={14} />
    </div>
    
    {/* Actions */}
    <div className="flex gap-4">
      <PixelSkeleton width={40} height={16} />
      <PixelSkeleton width={35} height={16} />
    </div>
  </div>
);

// Analytics Chart Skeleton
export const PixelChartSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-2 border-gray-700 p-4 pixel-perfect-border ${className}`}>
    {/* Chart title */}
    <div className="mb-4 space-y-2">
      <PixelSkeleton width="40%" height={20} />
      <PixelSkeleton width="25%" height={14} />
    </div>
    
    {/* Chart area */}
    <div className="relative h-48 border border-gray-600 pixel-perfect-border">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
        {[...Array(5)].map((_, i) => (
          <PixelSkeleton key={i} width={24} height={12} />
        ))}
      </div>
      
      {/* Chart bars/lines */}
      <div className="ml-8 h-full flex items-end justify-between px-4">
        {[...Array(7)].map((_, i) => (
          <PixelSkeleton 
            key={i} 
            width={20} 
            height={20 + Math.random() * 80} 
          />
        ))}
      </div>
    </div>
    
    {/* X-axis labels */}
    <div className="flex justify-between mt-2 px-8">
      {[...Array(7)].map((_, i) => (
        <PixelSkeleton key={i} width={30} height={12} />
      ))}
    </div>
    
    {/* Legend */}
    <div className="flex gap-4 mt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <PixelSkeleton width={12} height={12} />
          <PixelSkeleton width={50} height={12} />
        </div>
      ))}
    </div>
  </div>
);

// Table Skeleton
export const PixelTableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) => (
  <div className={`bg-gray-900 border-2 border-gray-700 pixel-perfect-border ${className}`}>
    {/* Table header */}
    <div className="border-b-2 border-gray-700 p-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <PixelSkeleton key={i} width="80%" height={16} />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-gray-700">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="p-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, colIndex) => (
              <PixelSkeleton 
                key={colIndex} 
                width={colIndex === 0 ? "60%" : "90%"} 
                height={14} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Form Skeleton
export const PixelFormSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-900 border-2 border-gray-700 p-6 space-y-6 pixel-perfect-border ${className}`}>
    {/* Form title */}
    <PixelSkeleton width="50%" height={28} />
    
    {/* Form fields */}
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <PixelSkeleton width={80 + Math.random() * 40} height={16} />
        <PixelSkeleton width="100%" height={40} />
      </div>
    ))}
    
    {/* Textarea */}
    <div className="space-y-2">
      <PixelSkeleton width={100} height={16} />
      <PixelSkeleton width="100%" height={80} />
    </div>
    
    {/* Buttons */}
    <div className="flex gap-4">
      <PixelSkeleton width={100} height={40} />
      <PixelSkeleton width={80} height={40} />
    </div>
  </div>
);

// Search Results Skeleton
export const PixelSearchResultsSkeleton = ({ 
  results = 5, 
  className = '' 
}: { 
  results?: number; 
  className?: string; 
}) => (
  <div className={`space-y-4 ${className}`}>
    {/* Search info */}
    <div className="flex justify-between items-center">
      <PixelSkeleton width={150} height={16} />
      <PixelSkeleton width={80} height={16} />
    </div>
    
    {/* Results */}
    {[...Array(results)].map((_, i) => (
      <div key={i} className="bg-gray-900 border border-gray-700 p-4 space-y-3 pixel-perfect-border">
        <PixelSkeleton width="80%" height={20} />
        <PixelSkeleton width="60%" height={14} />
        <div className="space-y-2">
          <PixelSkeleton width="100%" height={14} />
          <PixelSkeleton width="85%" height={14} />
        </div>
        <div className="flex gap-2">
          <PixelSkeleton width={40} height={18} />
          <PixelSkeleton width={50} height={18} />
        </div>
      </div>
    ))}
  </div>
);

// Page Layout Skeleton
export const PixelPageSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`min-h-screen bg-gray-950 ${className}`}>
    {/* Navigation */}
    <PixelNavSkeleton />
    
    {/* Hero section */}
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <PixelSkeleton width="60%" height={48} className="mx-auto" />
        <PixelSkeleton width="40%" height={20} className="mx-auto" />
        <PixelSkeleton width="80%" height={16} className="mx-auto" />
      </div>
    </div>
    
    {/* Main content grid */}
    <div className="container mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PixelBlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Loading States Manager
interface PixelLoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  delay?: number;
}

export const PixelLoadingState = ({ 
  isLoading, 
  children, 
  skeleton, 
  delay = 0 
}: PixelLoadingStateProps) => {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

  React.useEffect(() => {
    if (!isLoading && delay > 0) {
      const timer = setTimeout(() => setShowSkeleton(false), delay);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(isLoading);
    }
  }, [isLoading, delay]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showSkeleton ? skeleton : children}
    </motion.div>
  );
};

