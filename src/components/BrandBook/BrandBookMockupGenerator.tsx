import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Palette,
  Layers,
  Check,
  Printer,
  Sliders,
  Type
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface CoverTheme {
  name: string;
  nameSinhala: string;
  bgHex: string;
  goldHex: string;
  borderHex: string;
}

const COVER_THEMES: CoverTheme[] = [
  {
    name: 'Imperial Burgundy',
    nameSinhala: 'රාජකීය බර්ගන්ඩි',
    bgHex: '#3b0a11',
    goldHex: '#f7e2a9',
    borderHex: '#c99a45',
  },
  {
    name: 'Midnight Noir',
    nameSinhala: 'මිඩ්නයිට් කළු',
    bgHex: '#121011',
    goldHex: '#dfb56c',
    borderHex: '#dfb56c',
  },
  {
    name: 'Emerald Royale',
    nameSinhala: 'රාජකීය එමරල්ඩ්',
    bgHex: '#092419',
    goldHex: '#f2dc9b',
    borderHex: '#88a87b',
  },
  {
    name: 'Sapphire Velvet',
    nameSinhala: 'සැෆයර් නිල්',
    bgHex: '#0d1829',
    goldHex: '#f4ede1',
    borderHex: '#718ebf',
  },
];

export const BrandBookMockupGenerator: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const { studentUser } = useAuth();
  const { getStudentBrandModuleData } = useData();

  // Try to prefill from student's saved brand data if logged in
  const existingBrand = studentUser ? getStudentBrandModuleData(studentUser.regNumber) : null;

  const [brandName, setBrandName] = useState<string>(
    existingBrand?.brandName || 'CEYLON COUTURE'
  );
  const [tagline, setTagline] = useState<string>(
    existingBrand?.brandTagline || 'ARTISANAL APPAREL & TIMELESS SILHOUETTES'
  );
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0 = Cover, 1 = Essence, 2 = Palette, 3 = Typography, 4 = Collection
  const [perspectiveTilt, setPerspectiveTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentTheme = COVER_THEMES[selectedThemeIndex] || COVER_THEMES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setPerspectiveTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setPerspectiveTilt({ x: 0, y: 0 });
  };

  const totalPages = 5;

  return (
    <section id="brand-mockup" className="py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Radial background ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#540d18]/20 via-[#c99a45]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#540d18]/40 border border-[#dfb56c]/30 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {isSinhalaMode
                ? 'මොඩියුල 02 • ත්‍රිමාණ බ්‍රෑන්ඩ් බුක් මොකප්'
                : 'Module 02 • 3D Brand Book Mockup'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold tracking-tight text-[#f7f3eb] mb-4">
            {isSinhalaMode ? (
              <>
                ත්‍රිමාණ සුඛෝපභෝගී <span className="gold-gradient-text">බ්‍රෑන්ඩ් බුක් මොකප් ජෙනරේටර්</span>
              </>
            ) : (
              <>
                Haute Couture <span className="gold-gradient-text">3D Brand Book Mockup Generator</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'ඔබේම විලාසිතා සන්නාමයේ Brand Identity Guide එක Hardcover සුඛෝපභෝගී පොතක් ලෙස ත්‍රිමාණව පෙරදසුන් කරන්න. පිටු පෙරළා බලන්න (Turn pages to inspect your brand identity).'
              : 'Bring your luxury fashion label to life. Experience your complete Brand Identity Guide as a photorealistic 3D hardcover monograph with page-flip animations and gold-leaf typography.'}
          </p>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Book Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* 3D Book Stage */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[520px] aspect-[4/3] sm:aspect-[1.35/1] flex items-center justify-center p-4 select-none cursor-pointer perspective-[1200px]"
            >
              {/* Hardcover Book 3D Container with Perspective Transform */}
              <div
                className="relative w-[340px] sm:w-[400px] h-[440px] sm:h-[480px] rounded-r-md rounded-l-sm shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/10 transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${perspectiveTilt.x}deg) rotateX(${perspectiveTilt.y}deg)`,
                  backgroundColor: currentTheme.bgHex,
                  boxShadow: `
                    -12px 10px 30px rgba(0, 0, 0, 0.8),
                    0 25px 50px rgba(0, 0, 0, 0.9),
                    inset -4px 0 10px rgba(0, 0, 0, 0.6)
                  `,
                }}
              >
                {/* Book Spine Texture on Left */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 border-r border-black/40 flex flex-col items-center justify-between py-6 z-20"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(255,255,255,0.06), rgba(0,0,0,0.5))',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dfb56c]" />
                  <span
                    className="text-[8px] font-mono tracking-widest uppercase text-[#dfb56c]/70 transform -rotate-90 whitespace-nowrap"
                  >
                    {brandName} • ATELIER
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dfb56c]" />
                </div>

                {/* Page Content Rendering */}
                <div className="ml-8 h-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle silk/leatherette texture overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />

                  {currentPage === 0 && (
                    /* PAGE 0: HARDCOVER FRONT */
                    <div className="h-full flex flex-col justify-between text-center py-4 relative z-10 animate-in fade-in duration-300">
                      {/* Top Brand Seal */}
                      <div>
                        <div className="w-12 h-12 rounded-full border border-[#dfb56c] mx-auto flex items-center justify-center mb-2 shadow-inner">
                          <Sparkles className="w-5 h-5 text-[#dfb56c]" />
                        </div>
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#a89f91] block">
                          Official Atelier Monograph
                        </span>
                      </div>

                      {/* Center Embossed Gold Foil Brand Name */}
                      <div className="py-6 border-y border-[#dfb56c]/40 my-auto">
                        <h3
                          className="text-2xl sm:text-3xl font-editorial font-bold tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(223,181,108,0.5)]"
                          style={{ color: currentTheme.goldHex }}
                        >
                          {brandName}
                        </h3>
                        <p className="text-[10px] sm:text-xs font-mono tracking-widest text-[#d5cfc4] mt-2 uppercase">
                          {tagline}
                        </p>
                      </div>

                      {/* Bottom Footer Details */}
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#dfb56c] tracking-widest block">
                          Haute Couture Brand Identity
                        </span>
                        <span className="text-[8px] font-mono text-[#a89f91] block mt-0.5">
                          Ceylon Style Studio • 6-Month Master Diploma
                        </span>
                      </div>
                    </div>
                  )}

                  {currentPage === 1 && (
                    /* PAGE 1: BRAND ESSENCE & ARCHETYPE */
                    <div className="h-full bg-[#fbf9f5] text-[#1c181a] p-6 rounded-sm shadow-inner flex flex-col justify-between animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#c99a45] tracking-widest block font-bold">
                          CHAPTER 01 • ESSENCE
                        </span>
                        <h4 className="text-xl font-editorial font-bold text-[#141011] mt-1 mb-3">
                          The Brand Manifesto
                        </h4>
                        <p className="text-xs text-[#52494c] leading-relaxed italic border-l-2 border-[#c99a45] pl-3 mb-4">
                          "{brandName} exists to blend Sri Lanka's artisanal handloom heritage with cutting-edge Parisian haute couture drape architecture."
                        </p>
                        <div className="space-y-2 text-[11px] text-[#423c3e]">
                          <div className="flex justify-between border-b border-black/10 pb-1">
                            <span className="font-bold">Archetype:</span>
                            <span>The Ruler & The Creator</span>
                          </div>
                          <div className="flex justify-between border-b border-black/10 pb-1">
                            <span className="font-bold">Tone of Voice:</span>
                            <span>Poised, Architectural, Exclusive</span>
                          </div>
                          <div className="flex justify-between border-b border-black/10 pb-1">
                            <span className="font-bold">Target Market:</span>
                            <span>High-Net-Worth Luxury Connoisseurs</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-[9px] font-mono text-zinc-400">
                        Page 01 / 04
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    /* PAGE 2: COLOR PALETTE */
                    <div className="h-full bg-[#fbf9f5] text-[#1c181a] p-6 rounded-sm shadow-inner flex flex-col justify-between animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#c99a45] tracking-widest block font-bold">
                          CHAPTER 02 • CHROMATICS
                        </span>
                        <h4 className="text-xl font-editorial font-bold text-[#141011] mt-1 mb-3">
                          Atelier Color Harmony
                        </h4>
                        <div className="grid grid-cols-2 gap-2 my-2">
                          <div className="p-2 rounded bg-[#540d18] text-white text-[10px] font-mono">
                            <span className="block font-bold">Imperial Burgundy</span>
                            <span className="opacity-80">HEX: #540D18</span>
                          </div>
                          <div className="p-2 rounded bg-[#dfb56c] text-black text-[10px] font-mono">
                            <span className="block font-bold">Champagne Gold</span>
                            <span className="opacity-80">HEX: #DFB56C</span>
                          </div>
                          <div className="p-2 rounded bg-[#0c090a] text-white text-[10px] font-mono">
                            <span className="block font-bold">Noir Velvet</span>
                            <span className="opacity-80">HEX: #0C090A</span>
                          </div>
                          <div className="p-2 rounded bg-[#f4efe6] text-black text-[10px] font-mono border border-black/10">
                            <span className="block font-bold">Pearl Ivory</span>
                            <span className="opacity-80">HEX: #F4EFE6</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-[9px] font-mono text-zinc-400">
                        Page 02 / 04
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    /* PAGE 3: TYPOGRAPHY HIERARCHY */
                    <div className="h-full bg-[#fbf9f5] text-[#1c181a] p-6 rounded-sm shadow-inner flex flex-col justify-between animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#c99a45] tracking-widest block font-bold">
                          CHAPTER 03 • TYPOGRAPHY
                        </span>
                        <h4 className="text-xl font-editorial font-bold text-[#141011] mt-1 mb-3">
                          Letterform Architecture
                        </h4>
                        <div className="space-y-3">
                          <div className="p-2.5 bg-black/5 rounded">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Primary Display Serif</span>
                            <span className="text-xl font-editorial font-bold text-[#141011]">Cinzel & Cormorant</span>
                          </div>
                          <div className="p-2.5 bg-black/5 rounded">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Secondary Body Geometric</span>
                            <span className="text-xs font-sans text-zinc-800">Plus Jakarta Sans / Clean Clean Line</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-[9px] font-mono text-zinc-400">
                        Page 03 / 04
                      </div>
                    </div>
                  )}

                  {currentPage === 4 && (
                    /* PAGE 4: COLLECTION CONCEPT */
                    <div className="h-full bg-[#fbf9f5] text-[#1c181a] p-6 rounded-sm shadow-inner flex flex-col justify-between animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#c99a45] tracking-widest block font-bold">
                          CHAPTER 04 • SILHOUETTES
                        </span>
                        <h4 className="text-xl font-editorial font-bold text-[#141011] mt-1 mb-3">
                          Debut Collection Direction
                        </h4>
                        <p className="text-xs text-[#52494c] leading-relaxed mb-3">
                          Six signature silhouettes crafted with bias-cut mulberry silk charmeuse and structured Italian metallic brocade trims.
                        </p>
                        <div className="p-3 bg-[#540d18]/10 rounded border border-[#540d18]/20 text-[11px] text-[#540d18]">
                          <span className="font-bold block">Production Target:</span>
                          <span>Launch via Meta Ads & Private Runway Pop-up Atelier</span>
                        </div>
                      </div>
                      <div className="text-right text-[9px] font-mono text-zinc-400">
                        Page 04 / 04
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Book Pagination Toolbar */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded bg-[#141011] border border-white/10 text-white hover:border-[#dfb56c] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-[#dfb56c]">
                {currentPage === 0 ? 'Hardcover Front' : `Page ${currentPage} of ${totalPages - 1}`}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded bg-[#141011] border border-white/10 text-white hover:border-[#dfb56c] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Customizer Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 bg-[#141011] p-6 rounded-sm border border-[#c99a45]/30 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Sliders className="w-4 h-4 text-[#dfb56c]" />
              <h4 className="text-sm font-editorial font-bold text-[#f7f3eb] uppercase tracking-wider">
                {isSinhalaMode ? 'මොකප් සැකසුම් පුවරුව' : 'Book Customizer Controls'}
              </h4>
            </div>

            {/* Brand Name Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1.5 font-semibold">
                {isSinhalaMode ? 'විලාසිතා සන්නාමයේ නම (Brand Name)' : 'Fashion Brand Name'}
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. CEYLON COUTURE"
                className="w-full px-3.5 py-2.5 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
              />
            </div>

            {/* Tagline Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1.5 font-semibold">
                {isSinhalaMode ? 'සන්නාමයේ ආදර්ශ පාඨය (Brand Tagline)' : 'Brand Manifesto / Tagline'}
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. ARTISANAL APPAREL & TIMELESS SILHOUETTES"
                className="w-full px-3.5 py-2.5 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
              />
            </div>

            {/* Leatherette Cover Material Theme Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-2 font-semibold">
                {isSinhalaMode ? 'කවරයේ සම්පූර්ණ තේමාව (Hardcover Finish)' : 'Hardcover Leatherette Finish'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COVER_THEMES.map((theme, idx) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedThemeIndex(idx)}
                    className={`p-2.5 rounded-sm border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      selectedThemeIndex === idx
                        ? 'bg-[#1e1316] border-[#dfb56c] shadow-md'
                        : 'bg-[#0c090a] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: theme.bgHex }}
                    />
                    <span className="text-[11px] text-[#f7f3eb] font-mono truncate">
                      {isSinhalaMode ? theme.nameSinhala : theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Curriculum Highlight */}
            <div className="p-3.5 rounded bg-black/40 border border-white/10 text-xs text-[#b8afa2] font-sinhala leading-relaxed">
              <span className="text-[#dfb56c] font-bold block mb-1">
                {isSinhalaMode ? 'මොඩියුල 02 පුහුණුව:' : 'Module 02 Deliverable:'}
              </span>
              {isSinhalaMode
                ? 'මෙම සම්පූර්ණ Brand Book එක ශිෂ්‍යයා විසින් Module 02 හිදී නිර්මාණය කරනු ලබන අතර, ආයෝජකයින්ට සහ නිෂ්පාදකයින්ට ඉදිරිපත් කිරීමට මෙය A4 PDF ආකෘතියෙන් බාගත කළ හැක.'
                : 'Every graduate produces this comprehensive Brand Book during Module 02. Ready to present to apparel manufacturers, luxury stockists, and private runway investors.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
