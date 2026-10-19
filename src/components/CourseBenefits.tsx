import React, { useState, useRef } from 'react';
import {
  Award,
  Sparkles,
  Building2,
  Cpu,
  TrendingUp,
  Crown,
  Scissors,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../lib/soundFx';

export const CourseBenefits: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const [scrollMode, setScrollMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);

  const scrollHorizontal = (direction: 'left' | 'right') => {
    soundFx.play('BUTTON_CLICK');
    if (horizontalScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      horizontalScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollVertical = (direction: 'up' | 'down') => {
    soundFx.play('BUTTON_CLICK');
    if (verticalScrollRef.current) {
      const scrollAmount = direction === 'up' ? -280 : 280;
      verticalScrollRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      title: 'ACCREDITED DIPLOMA CERTIFICATE',
      titleSinhala: 'පිළිගත් වෘත්තීය ඩිප්ලෝමා සහතිකය',
      desc: 'Receive the official Ceylon Style Studio professional certification, accredited for industry design and garment export.',
      descSinhala: 'ඇඟලුම් ක්ෂේත්‍රයේ රැකියා සහ ජාත්‍යන්තර අපනයන වෙළඳපොළ සඳහා පිළිගත් Ceylon Style Studio වෘත්තීය ඩිප්ලෝමා සහතිකය.',
      icon: <Award className="w-6 h-6 text-[#dfb56c]" />,
    },
    {
      title: 'FASHION SHOW OPPORTUNITY',
      titleSinhala: 'FASHION SHOW ප්‍රදර්ශන අවස්ථාව',
      desc: 'Showcase your graduate capsule collection on our exclusive runway before local fashion editors, stylists, and buyers.',
      descSinhala: 'පාඨමාලාව අවසානයේ ඔබේම නිර්මාණ එකතුව (Capsule Collection) වෘත්තීය Fashion Runway එකක ප්‍රදර්ශනය කිරීමේ සුවිශේෂී අවස්ථාව.',
      icon: <Sparkles className="w-6 h-6 text-[#dfb56c]" />,
    },
    {
      title: 'INDUSTRY EXPOSURE',
      titleSinhala: 'CEYLON STYLE STUDIO කණ්ඩායම සමඟ වැඩකිරීමේ අවස්ථාව',
      desc: 'Top-performing / successfully completing students may receive opportunities to work with the CEYLON STYLE STUDIO creative team.',
      descSinhala: 'විශිෂ්ට ලෙස පාඨමාලාව හදාරන දක්ෂ සිසුන් සඳහා Ceylon Style Studio ප්‍රධාන නිර්මාණ කණ්ඩායම සමඟ වෘත්තීයමය වශයෙන් සම්බන්ධ වීමේ අවස්ථාව.',
      icon: <Building2 className="w-6 h-6 text-[#dfb56c]" />,
      highlight: true,
    },
    {
      title: 'AI TECHNOLOGY PROFICIENCY',
      titleSinhala: 'AI විලාසිතා තාක්ෂණ නිපුණතාව',
      desc: 'Master future-proof Generative AI tools (Midjourney, neural lookbooks, prompt engineering) giving you a 10x speed advantage.',
      descSinhala: 'අනාගතයට ගැළපෙන Generative AI මෙවලම් සහ Prompt Engineering හරහා සාමාන්‍ය නිර්මාණකරුවෙකුට වඩා 10 ගුණයක වේගවත් නිපුණතාවයක්.',
      icon: <Cpu className="w-6 h-6 text-[#dfb56c]" />,
    },
    {
      title: 'PROVEN DIGITAL MARKETING',
      titleSinhala: 'ප්‍රායෝගික ඩිජිටල් අලෙවිකරණය',
      desc: 'Learn real social media ad boosting, high-ticket customer targeting, TikTok viral trends, and e-commerce store execution.',
      descSinhala: 'Facebook & Instagram Ads, මිලදී ගැනීමට හැකියාව ඇති ධනවත් පාරිභෝගිකයින් ඉලක්ක කිරීම සහ ඔන්ලයින් වෙළඳසැල් මෙහෙයවීම.',
      icon: <TrendingUp className="w-6 h-6 text-[#dfb56c]" />,
    },
    {
      title: 'BRANDING & PACKAGING KNOWLEDGE',
      titleSinhala: 'සුඛෝපභෝගී සන්නාමකරණය හා PACKAGING',
      desc: 'Transform raw tailoring into a high-end luxury brand with custom woven tags, unboxing aesthetics, and brand DNA.',
      descSinhala: 'සාමාන්‍ය මැහුම්කරුවෙකු නොවී, රන්වන් ලේබල්, සුඛෝපභෝගී පෙට්ටි සහ උසස් Brand DNA එකක් සහිත සැබෑ Brand Owner කෙනෙකු බවට පත්වීම.',
      icon: <Crown className="w-6 h-6 text-[#dfb56c]" />,
    },
    {
      title: 'PRACTICAL ATELIER LEARNING',
      titleSinhala: '100% ප්‍රායෝගික පන්ති කාමර පුහුණුව',
      desc: '100% practical orientation with live fabric cuts, sewing techniques, dart manipulations, and pattern grading.',
      descSinhala: 'රෙදි කැපීම, කරවල් මැසීම, ඩර්ට් හැසිරවීම, ප්‍රමාණ ග්‍රේඩින් කිරීම සහ උසස් නිමාව සජීවීව ප්‍රායෝගිකවම අත්හදා බැලීම.',
      icon: <Scissors className="w-6 h-6 text-[#dfb56c]" />,
    },
  ];

  const renderBenefitCard = (b: typeof benefits[0], isHorizontal: boolean) => (
    <div
      key={b.title}
      className={`${
        isHorizontal ? 'w-[290px] sm:w-[340px] md:w-[360px] shrink-0 snap-start' : 'w-full'
      } p-6 sm:p-7 rounded-sm transition-all duration-300 flex flex-col justify-between shadow-xl ${
        b.highlight
          ? 'bg-gradient-to-br from-[#241317] to-[#141011] border-2 border-[#dfb56c] shadow-2xl scale-[1.01]'
          : 'bg-[#141011] border border-white/5 hover:border-[#c99a45]/40 hover:bg-[#1a1315]'
      }`}
    >
      <div>
        <div className="w-12 h-12 rounded-sm bg-[#1c1214] border border-[#c99a45]/30 flex items-center justify-center mb-5">
          {b.icon}
        </div>
        <h3 className="text-base font-editorial font-bold text-[#f7f3eb] tracking-wider mb-2 font-sinhala luxury-heading-anim">
          {isSinhalaMode ? b.titleSinhala : b.title}
        </h3>
        <p className="text-xs text-[#b8afa2] leading-relaxed font-sinhala">
          {isSinhalaMode ? b.descSinhala : b.desc}
        </p>
      </div>

      {b.highlight && (
        <span className="mt-4 text-[10px] uppercase font-mono text-[#dfb56c] tracking-widest block font-bold font-sinhala">
          ★ {isSinhalaMode ? 'සුවිශේෂී කුසලතා අවස්ථාව' : 'Exclusive Merit Pathway'}
        </span>
      )}
    </div>
  );

  return (
    <section className="py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3 font-mono">
            {isSinhalaMode ? 'ඔබට හිමිවන වෘත්තීය වරප්‍රසාද' : 'Career Advantages'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'පාඨමාලා ප්‍රතිලාභ' : 'COURSE BENEFITS'}
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Scroll Controls Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="text-xs font-mono text-[#dfb56c] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSinhalaMode ? 'ප්‍රතිලාභ 07' : '7 Core Benefits'}</span>
          </span>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
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
                title="Horizontal Rail"
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
                title="Vertical Deck"
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
          /* Horizontal Momentum Rail */
          <div
            ref={horizontalScrollRef}
            className="flex gap-5 overflow-x-auto luxury-scrollbar-horizontal scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 [-webkit-overflow-scrolling:touch]"
          >
            {benefits.map((b) => renderBenefitCard(b, true))}
          </div>
        ) : (
          /* Vertical Luxury Scroll Deck */
          <div
            ref={verticalScrollRef}
            className="max-h-[580px] overflow-y-auto luxury-scrollbar-vertical scroll-smooth p-3 rounded-sm border border-[#dfb56c]/20 bg-black/40 [-webkit-overflow-scrolling:touch]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((b) => renderBenefitCard(b, false))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
