import React, { useState } from 'react';
import {
  Sparkles,
  RotateCw,
  Maximize2,
  Minimize2,
  Palette,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { RunwayCanvas } from './RunwayCanvas';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { soundFx } from '../../lib/soundFx';

export const FashionShowcase3D: React.FC = () => {
  const data = useData() as any;
  const outfits: any[] = data.outfits || [];
  const { isSinhalaMode } = useLanguage();

  const publishedOutfits = outfits.filter((o: any) => o.isPublished !== false);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(
    publishedOutfits[0]?.id || 'outfit-01'
  );

  const currentOutfit =
    publishedOutfits.find((o: any) => o.id === selectedOutfitId) || publishedOutfits[0];

  // Customizable colors and material states
  const [customColor, setCustomColor] = useState<string>(currentOutfit?.color || '#6e1322');
  const [customMetallic, setCustomMetallic] = useState<number>(currentOutfit?.metallic ?? 0.35);
  const [customRoughness, setCustomRoughness] = useState<number>(currentOutfit?.roughness ?? 0.25);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Synchronize when switching outfit
  const handleSelectOutfit = (outfit: typeof currentOutfit) => {
    if (!outfit) return;
    soundFx.playClickSound();
    setSelectedOutfitId(outfit.id);
    setCustomColor(outfit.color);
    setCustomMetallic(outfit.metallic);
    setCustomRoughness(outfit.roughness);
  };

  const colorPresets = [
    { name: 'Royal Crimson', hex: '#6e1322', labelSi: 'රාජකීය ක්‍රිම්සන්' },
    { name: 'Pure Gold', hex: '#c99a45', labelSi: 'රන්වන් පැහැය' },
    { name: 'Emerald Green', hex: '#0d4d38', labelSi: 'මරකත කොළ' },
    { name: 'Obsidian Black', hex: '#120f11', labelSi: 'කළු වෙල්වට්' },
    { name: 'Ivory Pearl', hex: '#f5f0e6', labelSi: 'අයිවරි මුතු' },
    { name: 'Midnight Navy', hex: '#0e1f3d', labelSi: 'නාවික නිල්' },
  ];

  return (
    <section id="3d-showcase" className="py-20 sm:py-24 bg-[#0a0708] relative overflow-hidden border-t border-[#c99a45]/25">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#540d18]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#c99a45]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1214] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-semibold mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse" />
            <span className="font-mono uppercase tracking-wider">
              {isSinhalaMode ? 'අන්තර්ක්‍රියාකාරී 3D විලාසිතා මැදිරිය' : 'Interactive 3D Digital Runway Studio'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-[#f7f3eb] tracking-tight">
            {isSinhalaMode ? '3D විලාසිතා හා රන්වේ ප්‍රදර්ශනය' : '3D FASHION SHOWCASE'}
          </h2>
          <p className="mt-4 text-xs sm:text-base text-[#b8afa2] font-sinhala max-w-2xl mx-auto leading-relaxed">
            {isSinhalaMode
              ? 'අපගේ පාඨමාලාව තුළදී ඔබ නිර්මාණය කරන ඇඳුම්, සාම්ප්‍රදායික පැටර්න් අඳින ආකාරයෙන් ඔබ්බට ගොස් නවීන ත්‍රිමාණ (3D Digital Fashion) තාක්ෂණයෙන් පෙරදසුන් කරන ආකාරය අත්විඳින්න.'
              : 'Experience digital haute couture. Rotate the 3D model, customize luxury fabrics, inspect stitch lines, and see how precision pattern drafting comes to life on the global runway.'}
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* 3D Showcase Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left/Center: 3D Interactive Runway Viewport (7 cols) */}
          <div className={`lg:col-span-7 relative rounded-sm bg-[#120c0e] border border-[#c99a45]/40 shadow-2xl overflow-hidden flex flex-col ${
            isFullscreen ? 'fixed inset-4 z-50 rounded-none' : 'h-[460px] sm:h-[560px]'
          }`}>
            {/* Top Toolbar */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded bg-black/75 backdrop-blur-md text-[11px] font-mono text-[#f7e2a9] border border-[#c99a45]/30 flex items-center gap-2 shadow">
                <Compass className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>Drag to Rotate • Scroll to Zoom</span>
              </span>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => {
                    soundFx.playClickSound();
                    setIsFullscreen(!isFullscreen);
                  }}
                  className="p-2 rounded bg-black/75 hover:bg-[#540d18] text-[#dfb56c] hover:text-white border border-[#c99a45]/30 transition-all cursor-pointer"
                  title="Toggle Fullscreen View"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Three.js Canvas */}
            <div className="w-full flex-1 relative">
              <RunwayCanvas
                mode="showcase"
                dressColor={customColor}
                accentColor={currentOutfit?.secondaryColor || '#dfb56c'}
                fabricType={currentOutfit?.fabricType}
                metallic={customMetallic}
                roughness={customRoughness}
                interactive={true}
                className="w-full h-full"
              />
            </div>

            {/* Bottom Floating Tag */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between bg-black/80 backdrop-blur-md px-3.5 py-2 rounded border border-white/10 pointer-events-none">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#dfb56c] block">
                  Active Haute Silhouette
                </span>
                <span className="text-xs font-bold text-[#f7f3eb] font-editorial">
                  {isSinhalaMode ? currentOutfit?.nameSinhala || currentOutfit?.name : currentOutfit?.name}
                </span>
              </div>

              <span className="text-[10px] font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-500/30">
                PBR Shaded 60FPS
              </span>
            </div>
          </div>

          {/* Right: Outfit Selector, Fabric Controls & Course Connection (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Outfit Selection Pill List */}
            <div className="p-5 rounded-sm bg-[#141011] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Select Garment Silhouette ({publishedOutfits.length})</span>
                </span>
                <span className="text-[10px] text-[#a89f91] font-mono">Haute Couture</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {publishedOutfits.map((outfit: any) => (
                  <button
                    key={outfit.id}
                    onClick={() => handleSelectOutfit(outfit)}
                    className={`p-2.5 rounded-sm text-left transition-all flex items-center gap-3 border cursor-pointer ${
                      selectedOutfitId === outfit.id
                        ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] shadow-md'
                        : 'bg-black/40 border-white/10 text-[#d5cfc4] hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 border border-white/40 shadow-sm"
                      style={{ backgroundColor: outfit.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold font-editorial block truncate">
                        {isSinhalaMode ? outfit.nameSinhala || outfit.name : outfit.name}
                      </span>
                      <span className="text-[10px] text-[#a89f91] block truncate font-mono">
                        {outfit.fabricType}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fabric Color Switcher */}
            <div className="p-5 rounded-sm bg-[#141011] border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>Fabric Dye &amp; Color Preset</span>
              </span>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => {
                      soundFx.playClickSound();
                      setCustomColor(preset.hex);
                    }}
                    className={`p-2 rounded border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      customColor === preset.hex
                        ? 'border-[#dfb56c] bg-[#241317] scale-105 shadow-md shadow-[#dfb56c]/20'
                        : 'border-white/10 bg-black/40 hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-white/30 shadow-inner"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-[9px] text-[#a89f91] truncate w-full text-center font-mono">
                      {isSinhalaMode ? preset.labelSi : preset.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Course Connection Callout & 3D CTAs */}
            <div className="p-5 rounded-sm bg-gradient-to-br from-[#1c1214] to-[#141011] border border-[#c99a45]/30 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#dfb56c] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-editorial text-[#f7e2a9]">
                    {isSinhalaMode ? 'මෙවැනි විලාසිතා ඔබම නිර්මාණය කරන්න' : 'Learn To Craft These Garments From Scratch'}
                  </h4>
                  <p className="text-xs text-[#b8afa2] font-sinhala mt-1 leading-relaxed">
                    {isSinhalaMode
                      ? 'මූලික ශරීර මිණුම් ලබාගැනීම, Basic Pattern, Style Development, Size Grading සහ මැහුම් ක්‍රමවේද සම්පූර්ණයෙන්ම ප්‍රායෝගිකව උගන්වනු ලැබේ.'
                      : 'From anatomical proportion measuring, drafting the base sloper, style expansion, to digital lookbooks.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="#register"
                  onClick={() => soundFx.playClickSound()}
                  className="btn-3d-gold w-full sm:flex-1 py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
                >
                  <span>{isSinhalaMode ? 'දැන්ම ලියාපදිංචි වන්න' : 'Enroll Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#journey"
                  onClick={() => soundFx.playClickSound()}
                  className="btn-3d-secondary w-full sm:flex-1 py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <span>{isSinhalaMode ? 'පාඨමාලා ගමන් මග' : 'View Curriculum'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
