import React, { useState, useRef } from 'react';
import {
  Scissors,
  Sparkles,
  Monitor,
  Cpu,
  Layers,
  Crown,
  TrendingUp,
  Share2,
  Wand2,
  Video,
  PackageCheck,
  Globe2,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../lib/soundFx';

export const WhyCourse: React.FC = () => {
  const { whyFeatures } = useData();
  const { isSinhalaMode } = useLanguage();
  const [activeTabFilter, setActiveTabFilter] = useState<string>('ALL');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [scrollMode, setScrollMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);

  const scrollHorizontal = (direction: 'left' | 'right') => {
    soundFx.play('BUTTON_CLICK');
    if (horizontalScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      horizontalScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollVertical = (direction: 'up' | 'down') => {
    soundFx.play('BUTTON_CLICK');
    if (verticalScrollRef.current) {
      const scrollAmount = direction === 'up' ? -300 : 300;
      verticalScrollRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper to map icon names
  const renderIcon = (name?: string) => {
    const iconClass = "w-5 h-5 text-[#dfb56c]";
    switch (name) {
      case 'Scissors': return <Scissors className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Monitor': return <Monitor className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'Layers': return <Layers className={iconClass} />;
      case 'Crown': return <Crown className={iconClass} />;
      case 'TrendingUp': return <TrendingUp className={iconClass} />;
      case 'Share2': return <Share2 className={iconClass} />;
      case 'Wand2': return <Wand2 className={iconClass} />;
      case 'Video': return <Video className={iconClass} />;
      case 'PackageCheck': return <PackageCheck className={iconClass} />;
      case 'Globe2': return <Globe2 className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const publishedFeatures = whyFeatures.filter((f) => f.isPublished !== false);

  const filterTabs = [
    { id: 'ALL', labelSi: 'සියලු සුවිශේෂතා (12)', labelEn: 'All Pillars (12)' },
    { id: 'PATTERN', labelSi: 'පැටර්න් හා මැහුම්', labelEn: 'Pattern & Craft' },
    { id: 'TECH', labelSi: 'AI හා තාක්ෂණය', labelEn: 'AI & Digital Tech' },
    { id: 'BRAND', labelSi: 'Brand හා අපනයන', labelEn: 'Branding & Export' },
  ];

  const filteredFeatures = publishedFeatures.filter((item) => {
    if (activeTabFilter === 'ALL') return true;
    const cat = `${item.category || ''} ${item.title || ''} ${item.badge || ''}`.toUpperCase();
    if (activeTabFilter === 'PATTERN') return cat.includes('PATTERN') || cat.includes('TAILOR') || cat.includes('DRAP') || cat.includes('GRADING') || cat.includes('CORSET');
    if (activeTabFilter === 'TECH') return cat.includes('AI') || cat.includes('DIGITAL') || cat.includes('CAD') || cat.includes('3D');
    if (activeTabFilter === 'BRAND') return cat.includes('BRAND') || cat.includes('EXPORT') || cat.includes('MARKET') || cat.includes('COLLECTION') || cat.includes('PORTFOLIO');
    return true;
  });

  const renderFeatureCard = (item: typeof filteredFeatures[0], isHorizontal: boolean) => {
    const isExpanded = !!expandedCards[item.id];
    return (
      <div
        key={item.id}
        className={`${
          isHorizontal ? 'w-[285px] sm:w-[320px] md:w-[340px] shrink-0 snap-start' : 'w-full'
        } group relative rounded-sm bg-[#141011] border border-[#c99a45]/20 hover:border-[#dfb56c] hover:bg-[#191214] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#c99a45]/15`}
      >
        {/* Top luxury gold hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfb56c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

        <div>
          {/* Advanced High-Fashion Editorial Cover Graphic (Editable from Backend) */}
          <div className="relative h-44 w-full overflow-hidden bg-black/60 border-b border-white/5">
            <img
              src={item.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-100 group-hover:scale-108 transition-all duration-700"
              loading="lazy"
            />
            {/* Luxury dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141011] via-black/40 to-transparent" />

            {/* Top Badges: Number and Icon */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xl font-editorial font-bold text-[#f7e2a9] bg-black/75 px-2.5 py-0.5 rounded-sm border border-[#c99a45]/40 backdrop-blur-sm shadow-md">
                {item.number}
              </span>

              <div className="w-9 h-9 rounded-sm bg-[#540d18]/90 border border-[#dfb56c] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {renderIcon(item.iconName)}
              </div>
            </div>

            {/* Category / Pillar Badge */}
            <div className="absolute bottom-2.5 left-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#dfb56c] bg-black/80 px-2 py-0.5 rounded border border-[#dfb56c]/30 backdrop-blur-sm font-semibold">
                {isSinhalaMode ? (item.badgeSinhala || item.badge || 'සුවිශේෂී') : (item.badge || 'Mastery')}
              </span>
            </div>
          </div>

          {/* Card Content & Text */}
          <div className="p-4 sm:p-5">
            {/* English Main Title */}
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#a89f91] block mb-1 group-hover:text-[#dfb56c] transition-colors">
              {item.title}
            </span>

            {/* Primary Title (Sinhala or English depending on mode) */}
            <h3 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors mb-2 leading-snug luxury-heading-anim">
              {isSinhalaMode ? (item.titleSinhala || item.title) : item.title}
            </h3>

            {/* Sinhala & English Rich Description - Truncated on Mobile with Downward Expand */}
            <div className="relative">
              <p
                className={`text-xs text-[#b8afa2] leading-relaxed font-sinhala transition-all duration-300 ${
                  isExpanded ? 'block' : 'line-clamp-2 md:line-clamp-none'
                }`}
              >
                {isSinhalaMode ? (item.descriptionSinhala || item.description) : item.description}
              </p>

              {/* Mobile Detail Expand Downward Toggle Button */}
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className="md:hidden mt-2 text-[11px] font-mono text-[#dfb56c] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    <span>අඩු කරන්න (Show Less)</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>විස්තර බලන්න (Read Details)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Card Footer */}
        <div className="p-4 sm:p-5 pt-0">
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#dfb56c]">
            <span className="flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span>{isSinhalaMode ? '100% ප්‍රායෝගික' : '100% Practical'}</span>
            </span>
            <a
              href="#register"
              className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold hover:underline text-[#dfb56c]"
            >
              <span>{isSinhalaMode ? 'විස්තර' : 'Enroll'}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="why-course" className="py-20 sm:py-24 bg-[#0c090a] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#540d18]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#c99a45]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-2 font-mono">
            {isSinhalaMode ? 'වෘත්තීය විෂය මාලාව හා සුවිශේෂීතා 12' : '12 Core Pillars & Mastery'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'මෙම පාඨමාලාව ඔබට සුවිශේෂී වන්නේ ඇයි?' : 'WHY THIS COURSE'}
          </h2>
          <p className="mt-4 text-xs sm:text-base text-[#b8afa2] max-w-2xl mx-auto font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'සාම්ප්‍රදායික මැහුම් පන්තියකින් ඔබ්බට ගොස්, පැටර්න් නිර්මාණයේ සිට AI තාක්ෂණය, සන්නාමකරණය (Branding) සහ ජාත්‍යන්තර වෙළඳපොළ දක්වා ඔබව රැගෙන යන එකම සම්පූර්ණ වැඩසටහන.'
              : 'Beyond traditional pattern drafting. An end-to-end luxury journey uniting precision technical cutting, artificial intelligence, bespoke brand DNA, and global exports.'}
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-5" />
        </div>

        {/* Filter Tabs & Scroll Container Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full luxury-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.play('BUTTON_CLICK');
                  setActiveTabFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTabFilter === tab.id
                    ? 'btn-3d-burgundy text-[#f7e2a9] border-[#dfb56c]'
                    : 'btn-3d-secondary text-[#d5cfc4]'
                }`}
              >
                <span>{isSinhalaMode ? tab.labelSi : tab.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Luxury Scroll Layout Switcher & Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle: Horizontal Rail vs Vertical Deck */}
            <div className="flex items-center bg-[#141011] border border-[#dfb56c]/30 rounded p-0.5">
              <button
                onClick={() => {
                  soundFx.play('BUTTON_CLICK');
                  setScrollMode('horizontal');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-all ${
                  scrollMode === 'horizontal'
                    ? 'bg-[#540d18] text-[#f7e2a9] font-bold shadow-md'
                    : 'text-[#a89f91] hover:text-[#f7e2a9]'
                }`}
                title="Horizontal Momentum Scroll Rail"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#dfb56c]" />
                <span className="hidden sm:inline">{isSinhalaMode ? 'තිරස් ස්ක්‍රෝල්' : 'Horizontal Rail'}</span>
              </button>
              <button
                onClick={() => {
                  soundFx.play('BUTTON_CLICK');
                  setScrollMode('vertical');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-all ${
                  scrollMode === 'vertical'
                    ? 'bg-[#540d18] text-[#f7e2a9] font-bold shadow-md'
                    : 'text-[#a89f91] hover:text-[#f7e2a9]'
                }`}
                title="Vertical Luxury Scroll Deck"
              >
                <LayoutGrid className="w-3 h-3 text-[#dfb56c]" />
                <span className="hidden sm:inline">{isSinhalaMode ? 'සිරස් ඩෙක්' : 'Vertical Deck'}</span>
              </button>
            </div>

            {/* Scroll Navigation Arrows */}
            {scrollMode === 'horizontal' ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollHorizontal('left')}
                  aria-label="Scroll left"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollHorizontal('right')}
                  aria-label="Scroll right"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollVertical('up')}
                  aria-label="Scroll up"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollVertical('down')}
                  aria-label="Scroll down"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Touch-Friendly Scrollable Containers */}
        {scrollMode === 'horizontal' ? (
          /* Horizontal Momentum Rail Container */
          <div
            ref={horizontalScrollRef}
            className="flex gap-5 overflow-x-auto luxury-scrollbar-horizontal scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 [-webkit-overflow-scrolling:touch]"
          >
            {filteredFeatures.map((item) => renderFeatureCard(item, true))}
          </div>
        ) : (
          /* Vertical Luxury Scroll Deck Container */
          <div
            ref={verticalScrollRef}
            className="max-h-[660px] overflow-y-auto luxury-scrollbar-vertical scroll-smooth p-2.5 sm:p-4 rounded-sm border border-[#dfb56c]/20 bg-black/40 [-webkit-overflow-scrolling:touch]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeatures.map((item) => renderFeatureCard(item, false))}
            </div>
          </div>
        )}

        {/* Bottom Highlights Strip with 3D Button */}
        <div className="mt-14 p-6 rounded-sm bg-gradient-to-r from-[#181113] via-[#241317] to-[#181113] border border-[#c99a45]/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-left">
            <h4 className="text-base font-editorial font-bold text-[#f7e2a9]">
              {isSinhalaMode ? 'මේක Pattern Making Course එකක් විතරක් නෙමෙයි.' : 'Not Just A Pattern Making Course.'}
            </h4>
            <p className="text-xs text-[#b8afa2] font-sinhala mt-1">
              Pattern → Style → Garment → Brand → AI Technology → Global Market
            </p>
          </div>

          <a
            href="#register"
            className="btn-3d-gold hero-btn-float-gold px-6 py-2.5 text-xs uppercase tracking-wider shrink-0"
          >
            {isSinhalaMode ? 'දැන්ම ලියාපදිංචි වන්න' : 'Register Now'}
          </a>
        </div>
      </div>
    </section>
  );
};
