import React from 'react';
import { ThemeStudio } from '../components/themes/ThemeStudio';
import { ThemeMarketplace } from '../components/themes/ThemeMarketplace';
import { SeasonalThemeManager } from '../components/themes/SeasonalThemes';
import { AccessibilityPanel } from '../components/themes/AccessibilityFeatures';
import { CinematicTransitionManager } from '../components/themes/CinematicTransitions';
import { ThemeVisualEffects } from '../components/themes/AdvancedVisualEffects';
import PageHeader from '@/app/components/PageHeader';

export default function AdvancedThemesPage() {
  return (
    <ThemeVisualEffects>
      <div className="min-h-screen bg-gray-950 text-white p-8">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <PageHeader 
              title="ADVANCED THEMES"
              subtitle="Professional-grade theme system with real-time editing, visual effects, seasonal variations, accessibility features, and cinematic transitions."
              animationType="matrix"
              animationSpeed={60}
              animationDelay={400}
              titleClassName="text-2xl md:text-3xl lg:text-4xl"
              subtitleClassName="text-lg text-gray-400 font-mono max-w-2xl mx-auto"
              className="mb-12"
            />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              
              {/* Real-time Theme Editor */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-retro-green mb-3 flex items-center justify-center">
                    <span className="text-black font-pixel text-sm">EDIT</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Theme Studio</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Real-time theme editing with live preview, color picker, and instant application.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Live color editing</div>
                  <div>• Real-time preview</div>
                  <div>• Custom theme creation</div>
                  <div>• Export/import themes</div>
                </div>
              </div>

              {/* Visual Effects */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-500 mb-3 flex items-center justify-center">
                    <span className="text-white font-pixel text-sm">FX</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Visual Effects</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Advanced particle systems, dynamic gradients, and shader-like CSS effects.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Particle systems</div>
                  <div>• Dynamic gradients</div>
                  <div>• Atmospheric lighting</div>
                  <div>• Shader effects</div>
                </div>
              </div>

              {/* Seasonal Themes */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-orange-500 mb-3 flex items-center justify-center">
                    <span className="text-white font-pixel text-sm">SEAS</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Seasonal Auto</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Automatic theme changes based on seasons and time of day.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Spring bloom themes</div>
                  <div>• Summer heat palettes</div>
                  <div>• Autumn leaf colors</div>
                  <div>• Winter frost effects</div>
                </div>
              </div>

              {/* Theme Marketplace */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-500 mb-3 flex items-center justify-center">
                    <span className="text-white font-pixel text-sm">SHOP</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Marketplace</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Browse, preview, and install community-created themes.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Community themes</div>
                  <div>• Instant preview</div>
                  <div>• One-click install</div>
                  <div>• Rating system</div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-500 mb-3 flex items-center justify-center">
                    <span className="text-white font-pixel text-sm">A11Y</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Accessibility</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Color blindness simulation, contrast checking, and text scaling.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Color blindness filters</div>
                  <div>• Contrast checking</div>
                  <div>• Text scaling</div>
                  <div>• Motion reduction</div>
                </div>
              </div>

              {/* Cinematic Transitions */}
              <div className="bg-gray-900 border-2 border-gray-700 p-6 hover:border-retro-green transition-colors">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-500 mb-3 flex items-center justify-center">
                    <span className="text-white font-pixel text-sm">CINE</span>
                  </div>
                  <h3 className="text-xl font-pixel text-white mb-2">Transitions</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    Cinematic theme transitions with morphing animations.
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>• Morph transitions</div>
                  <div>• Shatter effects</div>
                  <div>• Portal animations</div>
                  <div>• Matrix style</div>
                </div>
              </div>

            </div>

            {/* Interactive Demo */}
            <div className="bg-gray-900 border-2 border-gray-700 p-8 text-center">
              <h2 className="text-2xl font-pixel text-white mb-4">INTERACTIVE DEMO</h2>
              <p className="text-gray-400 font-mono mb-6">
                Use the controls in the top navigation to experience the advanced theme system:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                <div className="text-center">
                  <div className="text-retro-green mb-1">⚙️ STUDIO</div>
                  <div className="text-gray-400">Top Left</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 mb-1">📁 MARKETPLACE</div>
                  <div className="text-gray-400">Top Right</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 mb-1">♿ ACCESSIBILITY</div>
                  <div className="text-gray-400">Top Right</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 mb-1">🍂 SEASONAL</div>
                  <div className="text-gray-400">Bottom Left</div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 border-2 border-gray-700 p-6">
                <h3 className="text-lg font-pixel text-white mb-4">TECHNICAL SPECS</h3>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <div>• React 19 + TypeScript</div>
                  <div>• Framer Motion animations</div>
                  <div>• CSS custom properties</div>
                  <div>• WebGL particle effects</div>
                  <div>• Real-time color interpolation</div>
                  <div>• Accessibility compliance</div>
                  <div>• Local storage persistence</div>
                  <div>• Performance optimized</div>
                </div>
              </div>

              <div className="bg-gray-900 border-2 border-gray-700 p-6">
                <h3 className="text-lg font-pixel text-white mb-4">FEATURES</h3>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <div>• 8 cinematic transition types</div>
                  <div>• 4 seasonal theme variations</div>
                  <div>• Color blindness simulation</div>
                  <div>• Dynamic particle systems</div>
                  <div>• Real-time theme editing</div>
                  <div>• Community marketplace</div>
                  <div>• Export/import functionality</div>
                  <div>• Mobile responsive design</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Theme System Components */}
        <ThemeStudio />
        <ThemeMarketplace />
        <SeasonalThemeManager />
        <AccessibilityPanel />
        <CinematicTransitionManager />
      </div>
    </ThemeVisualEffects>
  );
}

export const metadata = {
  title: 'Advanced Themes - Professional Theme System',
  description: 'Experience our cutting-edge theme system with real-time editing, visual effects, seasonal variations, accessibility features, and cinematic transitions.',
};