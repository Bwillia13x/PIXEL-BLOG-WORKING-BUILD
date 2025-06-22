'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeConfig } from '@/app/lib/themes';
import { PixelButton, PixelCard, PixelInput } from '../design-system/PixelMicroInteractions';
import { PixelIconLibrary } from '../design-system/PixelIcons';

interface MarketplaceTheme extends ThemeConfig {
  downloads: number;
  rating: number;
  reviews: number;
  featured: boolean;
  price: number; // 0 for free
  screenshots: string[];
  compatibility: string[];
  lastUpdated: string;
  size: string;
}

// Mock marketplace themes
const MARKETPLACE_THEMES: MarketplaceTheme[] = [
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Cyberpunk-inspired theme with animated neon effects and urban vibes',
    downloads: 15420,
    rating: 4.8,
    reviews: 324,
    featured: true,
    price: 0,
    screenshots: ['/themes/neon-city-1.jpg', '/themes/neon-city-2.jpg'],
    compatibility: ['desktop', 'mobile', 'tablet'],
    lastUpdated: '2024-01-15',
    size: '2.3 MB',
    colors: {
      primary: '#00d4ff',
      primaryHover: '#00aacc',
      primaryFocus: '#00d4ff',
      background: '#0a0a1a',
      backgroundSecondary: '#0f0f2a',
      backgroundTertiary: '#1a1a3a',
      backgroundOverlay: 'rgba(10, 10, 26, 0.9)',
      surface: '#151530',
      surfaceHover: '#1f1f40',
      surfaceActive: '#2a2a50',
      text: '#00d4ff',
      textSecondary: '#0099cc',
      textTertiary: '#006699',
      textInverse: '#0a0a1a',
      border: '#00d4ff',
      borderSecondary: '#0099cc',
      borderAccent: '#ff0099',
      success: '#00ff99',
      warning: '#ffaa00',
      error: '#ff0066',
      info: '#00d4ff',
      accent1: '#ff0099',
      accent2: '#9900ff',
      accent3: '#ffff00',
      glow: '#00d4ff',
      shadow: 'rgba(0, 212, 255, 0.3)',
      gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Exo 2, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: true,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 13.5,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'CyberDesigner',
      version: '2.1.0',
      created: '2024-01-15T00:00:00.000Z',
      tags: ['cyberpunk', 'neon', 'animated', 'dark']
    }
  },
  {
    id: 'forest-depths',
    name: 'Forest Depths',
    description: 'Deep green nature theme with organic textures and calming earth tones',
    downloads: 8932,
    rating: 4.6,
    reviews: 156,
    featured: false,
    price: 0,
    screenshots: ['/themes/forest-1.jpg'],
    compatibility: ['desktop', 'mobile'],
    lastUpdated: '2024-01-10',
    size: '1.8 MB',
    colors: {
      primary: '#2d5a3d',
      primaryHover: '#1e3e2a',
      primaryFocus: '#3d6a4d',
      background: '#0a1a0a',
      backgroundSecondary: '#0f2a0f',
      backgroundTertiary: '#1a3a1a',
      backgroundOverlay: 'rgba(10, 26, 10, 0.9)',
      surface: '#153015',
      surfaceHover: '#1f401f',
      surfaceActive: '#2a502a',
      text: '#7dbf7d',
      textSecondary: '#5d9f5d',
      textTertiary: '#3d7f3d',
      textInverse: '#0a1a0a',
      border: '#2d5a3d',
      borderSecondary: '#1e3e2a',
      borderAccent: '#8fbc8f',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      accent1: '#8fbc8f',
      accent2: '#9acd32',
      accent3: '#228b22',
      glow: '#2d5a3d',
      shadow: 'rgba(45, 90, 61, 0.3)',
      gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Lora, serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: false,
      glow: false,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 14.2,
      reduceMotion: true,
      highContrast: false
    },
    metadata: {
      author: 'NatureThemes',
      version: '1.5.2',
      created: '2024-01-10T00:00:00.000Z',
      tags: ['nature', 'green', 'organic', 'calm']
    }
  },
  {
    id: 'midnight-blues',
    name: 'Midnight Blues',
    description: 'Elegant blue gradient theme with jazz-inspired color palette',
    downloads: 12304,
    rating: 4.7,
    reviews: 289,
    featured: true,
    price: 2.99,
    screenshots: ['/themes/midnight-1.jpg', '/themes/midnight-2.jpg', '/themes/midnight-3.jpg'],
    compatibility: ['desktop', 'mobile', 'tablet'],
    lastUpdated: '2024-01-18',
    size: '3.1 MB',
    colors: {
      primary: '#1e3a8a',
      primaryHover: '#1e40af',
      primaryFocus: '#3b82f6',
      background: '#0f1419',
      backgroundSecondary: '#1e293b',
      backgroundTertiary: '#334155',
      backgroundOverlay: 'rgba(15, 20, 25, 0.9)',
      surface: '#1e293b',
      surfaceHover: '#334155',
      surfaceActive: '#475569',
      text: '#cbd5e1',
      textSecondary: '#94a3b8',
      textTertiary: '#64748b',
      textInverse: '#0f1419',
      border: '#1e3a8a',
      borderSecondary: '#1e40af',
      borderAccent: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      accent1: '#6366f1',
      accent2: '#8b5cf6',
      accent3: '#ec4899',
      glow: '#1e3a8a',
      shadow: 'rgba(30, 58, 138, 0.3)',
      gradient: 'linear-gradient(135deg, #0f1419 0%, #1e293b 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Playfair Display, serif',
      mono: 'JetBrains Mono, monospace'
    },
    effects: {
      scanlines: false,
      glow: true,
      pixelBorder: false,
      crtEffect: false
    },
    accessibility: {
      contrastRatio: 15.1,
      reduceMotion: false,
      highContrast: false
    },
    metadata: {
      author: 'EliteThemes',
      version: '3.0.1',
      created: '2024-01-18T00:00:00.000Z',
      tags: ['blue', 'elegant', 'premium', 'gradient']
    }
  }
];

// Theme card component
const ThemeCard = ({ 
  theme, 
  onPreview, 
  onInstall, 
  isInstalled = false,
  isInstalling = false 
}: {
  theme: MarketplaceTheme;
  onPreview: () => void;
  onInstall: () => void;
  isInstalled?: boolean;
  isInstalling?: boolean;
}) => {
  return (
    <PixelCard className="p-4 hover:scale-105 transition-transform">
      {/* Theme preview */}
      <div 
        className="w-full h-32 mb-3 border-2 border-gray-600 relative overflow-hidden cursor-pointer"
        style={{ backgroundColor: theme.colors.background }}
        onClick={onPreview}
      >
        {/* Mini preview */}
        <div
          className="absolute top-2 left-2 right-2 h-4"
          style={{ backgroundColor: theme.colors.surface }}
        />
        <div
          className="absolute top-7 left-2 w-16 h-2"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="absolute top-10 left-2 w-24 h-1"
          style={{ backgroundColor: theme.colors.text }}
        />
        <div
          className="absolute top-12 left-2 w-12 h-1"
          style={{ backgroundColor: theme.colors.textSecondary }}
        />
        
        {/* Featured badge */}
        {theme.featured && (
          <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 font-bold">
            FEATURED
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute bottom-1 right-1 bg-gray-900 text-white text-xs px-1">
          {theme.price === 0 ? 'FREE' : `$${theme.price}`}
        </div>
      </div>

      {/* Theme info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-pixel text-sm text-white truncate flex-1">{theme.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            <PixelIconLibrary.Star size={12} color="#ffc107" />
            <span className="text-xs text-gray-400">{theme.rating}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2">{theme.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{theme.downloads.toLocaleString()} downloads</span>
          <span>by {theme.metadata.author}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <PixelButton
            size="sm"
            variant="ghost"
            onClick={onPreview}
            className="flex-1"
          >
            Preview
          </PixelButton>
          <PixelButton
            size="sm"
            onClick={onInstall}
            disabled={isInstalled || isInstalling}
            loading={isInstalling}
            className="flex-1"
          >
            {isInstalled ? 'Installed' : 'Install'}
          </PixelButton>
        </div>
      </div>
    </PixelCard>
  );
};

// Main marketplace component
export const ThemeMarketplace = () => {
  const { createCustomTheme, setTheme, customThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [installingTheme, setInstallingTheme] = useState<string | null>(null);
  const [previewingTheme, setPreviewingTheme] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Themes' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'nature', name: 'Nature' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'retro', name: 'Retro' },
    { id: 'premium', name: 'Premium' }
  ];

  // Filter and sort themes
  const filteredThemes = MARKETPLACE_THEMES
    .filter(theme => {
      const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           theme.metadata.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                             theme.metadata.tags.includes(selectedCategory) ||
                             (selectedCategory === 'premium' && theme.price > 0);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  // Check if theme is already installed
  const isThemeInstalled = (themeId: string) => {
    return customThemes.some(theme => theme.id === themeId);
  };

  // Install theme
  const handleInstallTheme = async (theme: MarketplaceTheme) => {
    if (isThemeInstalled(theme.id)) return;

    setInstallingTheme(theme.id);

    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Install theme
    const success = createCustomTheme(theme);
    
    if (success) {
      // Auto-apply if it was being previewed
      if (previewingTheme === theme.id) {
        setTheme(theme.id);
        setPreviewingTheme(null);
      }
    }

    setInstallingTheme(null);
  };

  // Preview theme
  const handlePreviewTheme = (theme: MarketplaceTheme) => {
    if (previewingTheme === theme.id) {
      setPreviewingTheme(null);
    } else {
      setPreviewingTheme(theme.id);
      // In a real implementation, this would apply a preview
    }
  };

  return (
    <>
      {/* Marketplace Toggle */}
      <motion.button
        className="fixed top-4 right-16 z-50 bg-gray-900 border-2 border-gray-600 p-2 hover:border-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PixelIconLibrary.Download size={20} animate />
      </motion.button>

      {/* Marketplace Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-gray-950 border-2 border-gray-600 w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-pixel text-white">THEME MARKETPLACE</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 transition-colors"
                  >
                    <PixelIconLibrary.Close size={20} />
                  </button>
                </div>

                {/* Search and filters */}
                <div className="flex gap-4 items-center">
                  <PixelInput
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="flex-1"
                  />
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm"
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      onPreview={() => handlePreviewTheme(theme)}
                      onInstall={() => handleInstallTheme(theme)}
                      isInstalled={isThemeInstalled(theme.id)}
                      isInstalling={installingTheme === theme.id}
                    />
                  ))}
                </div>

                {filteredThemes.length === 0 && (
                  <div className="text-center py-12">
                    <PixelIconLibrary.Search size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 font-mono">No themes found matching your criteria</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500 font-mono">
                  {filteredThemes.length} themes available • More coming soon
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview notification */}
      <AnimatePresence>
        {previewingTheme && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 bg-gray-900 border-2 border-gray-600 p-3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <p className="text-sm font-mono text-gray-400 mb-2">
              Previewing: {MARKETPLACE_THEMES.find(t => t.id === previewingTheme)?.name}
            </p>
            <div className="flex gap-2">
              <PixelButton size="sm" onClick={() => setPreviewingTheme(null)}>
                Exit Preview
              </PixelButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};