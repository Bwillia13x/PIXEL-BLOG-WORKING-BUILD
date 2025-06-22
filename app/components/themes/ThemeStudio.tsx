'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeConfig, ThemeColors } from '@/app/lib/themes';
import { PixelButton, PixelCard, PixelInput, PixelToggle } from '../design-system/PixelMicroInteractions';
import { PixelIconLibrary } from '../design-system/PixelIcons';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker = ({ label, value, onChange, className = '' }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSubmit = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-xs font-mono text-gray-400 flex-1">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 border-2 border-gray-600 hover:border-white transition-colors"
          style={{ backgroundColor: value }}
        />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-8 right-0 z-50 bg-gray-900 border-2 border-gray-600 p-3 min-w-64"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-3">
              <PixelInput
                value={tempValue}
                onChange={setTempValue}
                placeholder="#000000"
                className="font-mono text-xs"
              />
              
              <div className="grid grid-cols-6 gap-1">
                {[
                  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
                  '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#0080ff', '#80ff00',
                  '#333333', '#666666', '#999999', '#cccccc', '#ff3333', '#33ff33'
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 border border-gray-600 hover:border-white transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setTempValue(color)}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <PixelButton size="sm" onClick={handleSubmit}>Apply</PixelButton>
                <PixelButton size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </PixelButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ThemePreviewProps {
  theme: ThemeConfig;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

const ThemePreview = ({ theme, isActive = false, onSelect, onEdit }: ThemePreviewProps) => {
  return (
    <motion.div
      className={`relative cursor-pointer group ${isActive ? 'ring-2 ring-blue-400' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div
        className="w-full h-24 border-2 border-gray-600 relative overflow-hidden"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border
        }}
      >
        {/* Mini theme preview */}
        <div
          className="absolute top-1 left-1 right-1 h-2"
          style={{ backgroundColor: theme.colors.surface }}
        />
        <div
          className="absolute top-4 left-1 w-8 h-1"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="absolute top-6 left-1 w-12 h-1"
          style={{ backgroundColor: theme.colors.text }}
        />
        <div
          className="absolute top-8 left-1 w-6 h-1"
          style={{ backgroundColor: theme.colors.textSecondary }}
        />
        
        {/* Effects preview */}
        {theme.effects.glow && (
          <div
            className="absolute bottom-1 right-1 w-2 h-2"
            style={{
              backgroundColor: theme.colors.primary,
              boxShadow: `0 0 4px ${theme.colors.primary}`
            }}
          />
        )}
        
        {/* Action buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <PixelIconLibrary.Settings size={12} />
          </button>
        </div>
      </div>
      
      <div className="mt-1 text-xs font-mono text-gray-400 truncate">
        {theme.name}
      </div>
    </motion.div>
  );
};

export const ThemeStudio = () => {
  const {
    currentTheme,
    availableThemes,
    customThemes,
    setTheme,
    previewTheme,
    cancelPreview,
    applyPreview,
    createCustomTheme,
    deleteCustomTheme,
    isTransitioning
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'edit' | 'create'>('browse');
  const [editingTheme, setEditingTheme] = useState<ThemeConfig | null>(null);
  const [previewingTheme, setPreviewingTheme] = useState<string | null>(null);

  // Live editing state
  const [liveTheme, setLiveTheme] = useState<ThemeConfig>(currentTheme);
  const [isLivePreview, setIsLivePreview] = useState(false);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize live theme when editing starts
  useEffect(() => {
    if (editingTheme) {
      setLiveTheme({ ...editingTheme });
    }
  }, [editingTheme]);

  // Live preview with debouncing
  const applyLivePreview = useCallback((theme: ThemeConfig) => {
    if (!isLivePreview) return;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      previewTheme(theme.id);
    }, 150); // Debounce for smooth editing
  }, [isLivePreview, previewTheme]);

  // Update live preview when theme changes
  useEffect(() => {
    if (isLivePreview && liveTheme) {
      applyLivePreview(liveTheme);
    }
  }, [liveTheme, isLivePreview, applyLivePreview]);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setLiveTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setPreviewingTheme(null);
  };

  const handleThemePreview = (themeId: string) => {
    if (previewingTheme === themeId) {
      cancelPreview();
      setPreviewingTheme(null);
    } else {
      previewTheme(themeId);
      setPreviewingTheme(themeId);
    }
  };

  const handleStartEdit = (theme: ThemeConfig) => {
    setEditingTheme(theme);
    setActiveTab('edit');
    setIsLivePreview(true);
  };

  const handleSaveTheme = () => {
    if (!liveTheme) return;

    const newTheme = {
      ...liveTheme,
      id: `custom-${Date.now()}`,
      metadata: {
        ...liveTheme.metadata,
        created: new Date().toISOString(),
        author: 'Custom'
      }
    };

    if (createCustomTheme(newTheme)) {
      setTheme(newTheme.id);
      setIsLivePreview(false);
      setEditingTheme(null);
      setActiveTab('browse');
    }
  };

  const handleCancelEdit = () => {
    cancelPreview();
    setIsLivePreview(false);
    setEditingTheme(null);
    setActiveTab('browse');
  };

  const allThemes = [...availableThemes, ...customThemes];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 bg-gray-900 border-2 border-gray-600 p-2 hover:border-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PixelIconLibrary.Settings size={20} animate />
      </motion.button>

      {/* Theme Studio Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-96 bg-gray-950 border-l-2 border-gray-600 z-40 overflow-hidden flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-pixel text-white">THEME STUDIO</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 transition-colors"
                >
                  <PixelIconLibrary.Close size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1">
                {(['browse', 'edit', 'create'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs font-mono border transition-colors ${
                      activeTab === tab
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'browse' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-gray-400 mb-3">Built-in Themes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {availableThemes.map((theme) => (
                        <ThemePreview
                          key={theme.id}
                          theme={theme}
                          isActive={currentTheme.id === theme.id}
                          onSelect={() => handleThemeSelect(theme.id)}
                          onEdit={() => handleStartEdit(theme)}
                        />
                      ))}
                    </div>
                  </div>

                  {customThemes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-mono text-gray-400 mb-3">Custom Themes</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {customThemes.map((theme) => (
                          <ThemePreview
                            key={theme.id}
                            theme={theme}
                            isActive={currentTheme.id === theme.id}
                            onSelect={() => handleThemeSelect(theme.id)}
                            onEdit={() => handleStartEdit(theme)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'edit' && editingTheme && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PixelToggle
                      checked={isLivePreview}
                      onChange={setIsLivePreview}
                      size="sm"
                    />
                    <span className="text-xs font-mono text-gray-400">Live Preview</span>
                  </div>

                  {/* Color Editor */}
                  <div>
                    <h3 className="text-sm font-mono text-gray-400 mb-3">Colors</h3>
                    <div className="space-y-3">
                      {Object.entries(liveTheme.colors).map(([key, value]) => (
                        <ColorPicker
                          key={key}
                          label={key}
                          value={value}
                          onChange={(color) => handleColorChange(key as keyof ThemeColors, color)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <PixelButton onClick={handleSaveTheme}>Save as New</PixelButton>
                    <PixelButton variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </PixelButton>
                  </div>
                </div>
              )}

              {activeTab === 'create' && (
                <div className="space-y-4">
                  <div className="text-center text-gray-400 font-mono text-sm">
                    <PixelIconLibrary.Plus size={32} className="mx-auto mb-2" />
                    Create Theme Feature
                    <br />
                    Coming Soon
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              <div className="text-xs font-mono text-gray-500">
                Current: {currentTheme.name}
                {isTransitioning && (
                  <span className="block text-yellow-400">Transitioning...</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Overlay */}
      <AnimatePresence>
        {previewingTheme && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 bg-gray-900 border-2 border-gray-600 p-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <span className="text-sm font-mono text-gray-400">Previewing theme</span>
            <PixelButton size="sm" onClick={applyPreview}>
              Apply
            </PixelButton>
            <PixelButton
              size="sm"
              variant="ghost"
              onClick={() => {
                cancelPreview();
                setPreviewingTheme(null);
              }}
            >
              Cancel
            </PixelButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};