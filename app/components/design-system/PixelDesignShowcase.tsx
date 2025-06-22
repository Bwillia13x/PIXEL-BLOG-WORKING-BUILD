'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelSpinner,
  PixelProgressBar,
  PixelToggle,
  PixelTooltip
} from './PixelMicroInteractions';
import {
  PixelGlitchText,
  PixelTypewriter,
  PixelParticleExplode,
  PixelScanline,
  PixelMatrixRain,
  PixelPulse,
  PixelShake,
  PixelReveal,
  PixelCRTEffect
} from './PixelAnimations';
import {
  PixelDensityProvider,
  DensityControlPanel,
  ResponsivePixelBox,
  AdaptivePixelText,
  PixelGrid,
  PixelArtScaler,
  usePixelDensity
} from './PixelDensitySystem';
import {
  PixelIconLibrary,
  PixelIconSet
} from './PixelIcons';
import {
  PixelParallaxContainer,
  PixelSpaceScene,
  PixelLandscapeScene,
  PixelCyberScene
} from './PixelParallax';
import {
  PixelBlogCardSkeleton,
  PixelProjectCardSkeleton,
  PixelChartSkeleton,
  PixelLoadingState
} from './PixelSkeletons';

const ShowcaseSection = ({ 
  title, 
  children, 
  className = '' 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <motion.section
    className={`mb-12 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <AdaptivePixelText baseSize={24} className="text-retro-green mb-6 block">
      {title}
    </AdaptivePixelText>
    <div className="space-y-6">
      {children}
    </div>
  </motion.section>
);

const ComponentDemo = ({ 
  title, 
  description, 
  children, 
  code 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  code?: string; 
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <PixelCard className="p-6">
      <div className="mb-4">
        <h4 className="font-pixel text-retro-green text-sm mb-2">{title}</h4>
        <p className="font-mono text-xs text-gray-400 mb-4">{description}</p>
      </div>
      
      <div className="mb-4 p-4 bg-gray-800 border border-gray-600 rounded-none">
        {children}
      </div>
      
      {code && (
        <div>
          <PixelButton
            size="sm"
            variant="ghost"
            onClick={() => setShowCode(!showCode)}
            className="mb-2"
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </PixelButton>
          
          <AnimatePresence>
            {showCode && (
              <motion.pre
                className="bg-gray-950 border border-gray-600 p-3 text-xs font-mono text-gray-300 overflow-x-auto"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <code>{code}</code>
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      )}
    </PixelCard>
  );
};

export const PixelDesignShowcase = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [progress, setProgress] = useState(65);
  const [toggleState, setToggleState] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [explodeActive, setExplodeActive] = useState(false);
  const [shakeActive, setShakeActive] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleButtonDemo = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  const handleExplodeDemo = () => {
    setExplodeActive(true);
    setTimeout(() => setExplodeActive(false), 100);
  };

  const handleShakeDemo = () => {
    setShakeActive(true);
    setTimeout(() => setShakeActive(false), 100);
  };

  const handleLoadingDemo = () => {
    setLoadingDemo(true);
    setTimeout(() => setLoadingDemo(false), 3000);
  };

  return (
    <PixelDensityProvider>
      <div className="min-h-screen bg-gray-950 text-retro-green">
        {/* Density Control Panel */}
        <DensityControlPanel />
        
        {/* Background Effects */}
        <PixelGrid size={20} opacity={0.03} className="fixed inset-0 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <PixelGlitchText 
              text="PIXEL DESIGN SYSTEM" 
              intensity="medium"
              trigger="auto"
              className="text-4xl md:text-6xl mb-4 block"
            />
            <PixelTypewriter 
              text="// Cutting-edge pixel art components for modern web experiences"
              speed={30}
              className="text-gray-400"
            />
          </div>

          {/* Micro-Interactions Section */}
          <ShowcaseSection title="01. MICRO-INTERACTIONS">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <ComponentDemo
                title="Pixel Buttons"
                description="Interactive buttons with pixel-perfect styling and micro-animations"
                code={`<PixelButton variant="primary" loading={loading}>
  Primary Button
</PixelButton>`}
              >
                <div className="space-y-3">
                  <PixelButton 
                    variant="primary" 
                    onClick={handleButtonDemo}
                    loading={buttonLoading}
                  >
                    Primary Button
                  </PixelButton>
                  <PixelButton variant="secondary">Secondary</PixelButton>
                  <PixelButton variant="ghost">Ghost</PixelButton>
                  <PixelButton variant="danger" size="sm">Danger</PixelButton>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Pixel Input"
                description="Form inputs with animated placeholders and focus states"
                code={`<PixelInput 
  placeholder="Enter text..." 
  value={value}
  onChange={setValue}
/>`}
              >
                <PixelInput
                  placeholder="Enter your message..."
                  value={inputValue}
                  onChange={setInputValue}
                />
              </ComponentDemo>

              <ComponentDemo
                title="Progress & Controls"
                description="Progress bars, toggles, and loading indicators"
                code={`<PixelProgressBar progress={65} animated />
<PixelToggle checked={state} onChange={setState} />`}
              >
                <div className="space-y-4">
                  <PixelProgressBar 
                    progress={progress} 
                    animated 
                    showPercentage 
                  />
                  <div className="flex items-center gap-4">
                    <PixelToggle 
                      checked={toggleState}
                      onChange={setToggleState}
                      label="Enable Feature"
                    />
                    <PixelSpinner size={20} />
                  </div>
                </div>
              </ComponentDemo>

            </div>
          </ShowcaseSection>

          {/* Animations Section */}
          <ShowcaseSection title="02. ADVANCED ANIMATIONS">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <ComponentDemo
                title="Text Effects"
                description="Glitch effects, typewriter animations, and text transformations"
                code={`<PixelGlitchText text="GLITCH EFFECT" />
<PixelTypewriter text="Typing animation..." />`}
              >
                <div className="space-y-4">
                  <PixelGlitchText 
                    text="HOVER TO GLITCH" 
                    trigger="hover"
                    className="text-lg block cursor-pointer"
                  />
                  <PixelTypewriter 
                    text="Real-time typing simulation with cursor..."
                    speed={40}
                  />
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Particle Effects"
                description="Explosive particle animations and visual feedback"
                code={`<PixelParticleExplode trigger={active}>
  <button>Click me!</button>
</PixelParticleExplode>`}
              >
                <PixelParticleExplode 
                  trigger={explodeActive}
                  particleCount={15}
                  colors={['#4ade80', '#22c55e', '#16a34a']}
                >
                  <PixelButton onClick={handleExplodeDemo}>
                    Explode!
                  </PixelButton>
                </PixelParticleExplode>
              </ComponentDemo>

              <ComponentDemo
                title="Motion Effects"
                description="Pulse, shake, and reveal animations"
                code={`<PixelPulse color="#4ade80">
  <Component />
</PixelPulse>`}
              >
                <div className="space-y-4">
                  <PixelPulse color="#4ade80">
                    <div className="w-12 h-12 bg-retro-green"></div>
                  </PixelPulse>
                  <PixelShake 
                    trigger={shakeActive}
                    intensity="medium"
                  >
                    <PixelButton onClick={handleShakeDemo}>
                      Shake me!
                    </PixelButton>
                  </PixelShake>
                </div>
              </ComponentDemo>

            </div>
          </ShowcaseSection>

          {/* Icons Section */}
          <ShowcaseSection title="03. PIXEL ICON LIBRARY">
            <ComponentDemo
              title="Icon Collection"
              description="Hand-crafted pixel art icons with animation support"
              code={`<PixelIconLibrary.Heart animate color="#ff4757" />
<PixelIconSet icons={iconList} animate />`}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-6 md:grid-cols-10 gap-4">
                  {Object.entries(PixelIconLibrary).slice(0, 20).map(([name, Icon]) => (
                    <PixelTooltip key={name} content={name} position="top">
                      <div className="flex justify-center p-2 hover:bg-gray-800 transition-colors">
                        <Icon size={24} animate className="cursor-pointer" />
                      </div>
                    </PixelTooltip>
                  ))}
                </div>
                
                <PixelIconSet
                  icons={[
                    { name: 'heart', icon: PixelIconLibrary.Heart, props: { color: '#ff4757' } },
                    { name: 'star', icon: PixelIconLibrary.Star, props: { color: '#ffa502' } },
                    { name: 'github', icon: PixelIconLibrary.Github },
                    { name: 'mail', icon: PixelIconLibrary.Mail },
                    { name: 'settings', icon: PixelIconLibrary.Settings }
                  ]}
                  animate
                  spacing={16}
                />
              </div>
            </ComponentDemo>
          </ShowcaseSection>

          {/* Parallax Section */}
          <ShowcaseSection title="04. PARALLAX BACKGROUNDS">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <ComponentDemo
                title="Space Scene"
                description="Animated space scene with planets and stars"
                code={`<PixelSpaceScene />`}
              >
                <div className="h-48 relative overflow-hidden">
                  <PixelSpaceScene />
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Landscape Scene"
                description="Layered mountain landscape with parallax scrolling"
                code={`<PixelLandscapeScene />`}
              >
                <div className="h-48 relative overflow-hidden">
                  <PixelLandscapeScene />
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Cyber Scene"
                description="Matrix-style digital environment"
                code={`<PixelCyberScene />`}
              >
                <div className="h-48 relative overflow-hidden">
                  <PixelCyberScene />
                </div>
              </ComponentDemo>

            </div>
          </ShowcaseSection>

          {/* Loading States Section */}
          <ShowcaseSection title="05. LOADING SKELETONS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <ComponentDemo
                title="Content Skeletons"
                description="Animated placeholder states for loading content"
                code={`<PixelLoadingState isLoading={loading} skeleton={<Skeleton />}>
  <Content />
</PixelLoadingState>`}
              >
                <PixelLoadingState
                  isLoading={loadingDemo}
                  skeleton={<PixelBlogCardSkeleton />}
                >
                  <PixelCard className="p-4">
                    <h4 className="font-pixel text-retro-green mb-2">Loaded Content</h4>
                    <p className="font-mono text-sm text-gray-400 mb-4">
                      This content appears after the loading state completes.
                    </p>
                    <PixelButton size="sm">Read More</PixelButton>
                  </PixelCard>
                </PixelLoadingState>
                <div className="mt-4">
                  <PixelButton onClick={handleLoadingDemo} size="sm">
                    Toggle Loading
                  </PixelButton>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Chart Skeleton"
                description="Skeleton for analytics dashboards and charts"
                code={`<PixelChartSkeleton />`}
              >
                <PixelChartSkeleton />
              </ComponentDemo>

            </div>
          </ShowcaseSection>

          {/* Responsive System Section */}
          <ShowcaseSection title="06. ADAPTIVE PIXEL DENSITY">
            <ComponentDemo
              title="Responsive Pixel System"
              description="Dynamic pixel scaling based on screen size and device pixel ratio"
              code={`<ResponsivePixelBox 
  sizes={{ mobile: 4, desktop: 8 }} 
/>
<AdaptivePixelText baseSize={16} />`}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <ResponsivePixelBox 
                    sizes={{ mobile: 4, tablet: 6, desktop: 8, ultrawide: 10 }}
                    className="mx-auto mb-4"
                  />
                  <AdaptivePixelText baseSize={14} className="text-gray-400">
                    Responsive pixel box adapts to screen size
                  </AdaptivePixelText>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="text-center">
                    <AdaptivePixelText baseSize={12}>Mobile</AdaptivePixelText>
                    <AdaptivePixelText baseSize={10} className="text-gray-500">4px base</AdaptivePixelText>
                  </div>
                  <div className="text-center">
                    <AdaptivePixelText baseSize={12}>Tablet</AdaptivePixelText>
                    <AdaptivePixelText baseSize={10} className="text-gray-500">6px base</AdaptivePixelText>
                  </div>
                  <div className="text-center">
                    <AdaptivePixelText baseSize={12}>Desktop</AdaptivePixelText>
                    <AdaptivePixelText baseSize={10} className="text-gray-500">8px base</AdaptivePixelText>
                  </div>
                  <div className="text-center">
                    <AdaptivePixelText baseSize={12}>Ultrawide</AdaptivePixelText>
                    <AdaptivePixelText baseSize={10} className="text-gray-500">10px base</AdaptivePixelText>
                  </div>
                </div>
              </div>
            </ComponentDemo>
          </ShowcaseSection>

          {/* CRT Effect Section */}
          <ShowcaseSection title="07. RETRO EFFECTS">
            <ComponentDemo
              title="CRT Screen Effect"
              description="Classic CRT monitor simulation with scanlines and screen curvature"
              code={`<PixelCRTEffect>
  <YourContent />
</PixelCRTEffect>`}
            >
              <PixelCRTEffect>
                <div className="bg-gray-900 p-6 text-center">
                  <PixelTypewriter 
                    text="> RETRO_TERMINAL_ACTIVATED" 
                    speed={50}
                    className="text-retro-green mb-4 block"
                  />
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-gray-400">SYSTEM STATUS: ONLINE</div>
                    <div className="text-gray-400">PIXEL DENSITY: OPTIMAL</div>
                    <div className="text-retro-green">READY FOR INPUT_</div>
                  </div>
                </div>
              </PixelCRTEffect>
            </ComponentDemo>
          </ShowcaseSection>

          {/* Footer */}
          <div className="text-center mt-16 py-8 border-t border-gray-800">
            <PixelGlitchText 
              text="// END TRANSMISSION //" 
              trigger="auto"
              className="text-sm text-gray-500"
            />
            <div className="mt-4 font-mono text-xs text-gray-600">
              Pixel Design System v1.0 - Built with React, Framer Motion & TypeScript
            </div>
          </div>
        </div>
      </div>
    </PixelDensityProvider>
  );
};