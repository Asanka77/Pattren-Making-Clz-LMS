import React, { useState, useRef } from 'react';
import {
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Store,
  Sparkles,
  DollarSign,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../lib/soundFx';

export const TargetAudience: React.FC = () => {
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

  const personas = [
    {
      num: '01',
      title: 'JOB SEEKERS',
      titleSinhala: 'රැකියා අපේක්ෂකයින්',
      desc: 'Top garment factories, design studios, and export apparel brands require certified, skilled pattern makers and creative stylists.',
      descSinhala: 'ප්‍රමුඛ පෙළේ ඇඟලුම් කර්මාන්තශාලා, මෝස්තර නිර්මාණ මැදිරි සහ අපනයන සන්නාමයන්හි ඉහළ වැටුප් සහිත රැකියා සඳහා.',
      icon: <Briefcase className="w-5 h-5 text-[#dfb56c]" />,
    },
    {
      num: '02',
      title: 'BEGINNERS',
      titleSinhala: 'ආරම්භක නවකයින් (Zero Prior Skill)',
      desc: 'Zero fashion experience required. We start from holding the tape measure correctly to drawing professional sloper blocks.',
      descSinhala: 'මීට පෙර කිසිදු විලාසිතා හෝ මැහුම් අත්දැකීමක් නොමැති වුවද, ටේප් එක අල්ලන තැන සිට සියල්ල මුල සිට ඉගැන්වේ.',
      icon: <GraduationCap className="w-5 h-5 text-[#dfb56c]" />,
    },
    {
      num: '03',
      title: 'FASHION LOVERS',
      titleSinhala: 'විලාසිතාවලට ආදරය කරන ඔබ',
      desc: 'Channel your creative passion into structured technical craftsmanship, creating bespoke designer outfits for yourself and elite clients.',
      descSinhala: 'ඔබේ නිර්මාණශීලී ආශාව තාක්ෂණික නිපුණතාවයක් බවට පත්කර, තමන්ට සහ සුවිශේෂී පාරිභෝගිකයින්ට ඇඳුම් නිර්මාණය කිරීමට.',
      icon: <HeartHandshake className="w-5 h-5 text-[#dfb56c]" />,
    },
    {
      num: '04',
      title: 'EXISTING BUSINESS OWNERS',
      titleSinhala: 'දැනට ඇඟලුම් ව්‍යාපාර හිමිකරුවන්',
      desc: 'Upgrade your tailoring shop or tailoring business with high-accuracy CAD patterns, standard grading, and modern digital ad funnels.',
      descSinhala: 'දැනට පවත්වාගෙන යන මැහුම් ව්‍යාපාරය CAD ඩිජිටල් පැටර්න්, ප්‍රමිතිගත ග්‍රේඩින් සහ නවීන දැන්වීම් හරහා දියුණු කිරීමට.',
      icon: <Store className="w-5 h-5 text-[#dfb56c]" />,
    },
    {
      num: '05',
      title: 'FUTURE BRAND OWNERS',
      titleSinhala: 'තමන්ගේම Brand එකක් හදන ඔබ',
      desc: 'Dream of seeing your clothing brand label in high-end Colombo boutiques or global websites? We guide you from sketch to e-commerce store.',
      descSinhala: 'තමන්ගේම නමකින් ඇඟලුම් සන්නාමයක් (Clothing Label) ලංකාවේ හා ලෝකය පුරා ප්‍රචලිත කිරීමේ සිහිනය ඇති අයට.',
      icon: <Sparkles className="w-5 h-5 text-[#dfb56c]" />,
    },
    {
      num: '06',
      title: 'ADDITIONAL INCOME SEEKERS',
      titleSinhala: 'අමතර ආදායම් අපේක්ෂකයින්',
      desc: 'Earn lucrative income through bespoke custom tailoring, bridal dressmaking, made-to-measure orders, or freelance digital styling.',
      descSinhala: 'මංගල ඇඳුම් නිර්මාණය, Custom Bridal Wear හෝ නිවසේ සිට ඇඳුම් මැසීමෙන් ඉහළ අමතර ආදායමක් උපයාගැනීමට.',
      icon: <DollarSign className="w-5 h-5 text-[#dfb56c]" />,
    },
  ];

  const renderPersonaCard = (item: typeof personas[0], isHorizontal: boolean) => (
    <div
      key={item.num}
      className={`${
        isHorizontal ? 'w-[290px] sm:w-[340px] md:w-[360px] shrink-0 snap-start' : 'w-full'
      } p-6 sm:p-7 rounded-sm bg-[#141011] border border-white/5 hover:border-[#dfb56c]/50 hover:bg-[#1a1315] transition-all duration-300 group flex flex-col justify-between shadow-xl`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-[#c99a45]/60 group-hover:text-[#dfb56c]">
            PROFILE {item.num}
          </span>
          <div className="w-10 h-10 rounded-sm bg-[#241317] border border-[#c99a45]/30 flex items-center justify-center group-hover:bg-[#540d18] transition-colors">
            {item.icon}
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors font-sinhala luxury-heading-anim">
          {isSinhalaMode ? item.titleSinhala : item.title}
        </h3>
        <span className="text-xs text-[#dfb56c] font-mono block mb-3 uppercase">
          {item.title}
        </span>

        <p className="text-xs text-[#b8afa2] leading-relaxed font-sinhala">
          {isSinhalaMode ? item.descSinhala : item.desc}
        </p>
      </div>

      <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#f7e2a9]">
        <CheckCircle className="w-3.5 h-3.5 text-[#dfb56c]" />
        <span className="font-sinhala">{isSinhalaMode ? '100% ප්‍රායෝගික මගපෙන්වීම' : '100% Tailored Curriculum'}</span>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-[#0c090a] relative border-t border-[#c99a45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3 font-mono">
            {isSinhalaMode ? 'මෙම පාඨමාලාව ගැළපෙන්නේ කාටද?' : 'Who Is This Course For?'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'මෙම පාඨමාලාව වඩාත් සුදුසු වන්නේ' : 'WHO SHOULD ENROLL'}
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Scroll Controls Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="text-xs font-mono text-[#dfb56c] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSinhalaMode ? 'ගැළපෙන පැතිකඩ 06' : '6 Key Career Profiles'}</span>
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
            className="flex gap-5 overflow-x-auto luxury-scrollbar-horizontal scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 mb-12 [-webkit-overflow-scrolling:touch]"
          >
            {personas.map((item) => renderPersonaCard(item, true))}
          </div>
        ) : (
          /* Vertical Luxury Scroll Deck */
          <div
            ref={verticalScrollRef}
            className="max-h-[580px] overflow-y-auto luxury-scrollbar-vertical scroll-smooth p-3 rounded-sm border border-[#dfb56c]/20 bg-black/40 mb-12 [-webkit-overflow-scrolling:touch]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas.map((item) => renderPersonaCard(item, false))}
            </div>
          </div>
        )}

        {/* NO PRIOR KNOWLEDGE HERO BANNER */}
        <div className="p-8 sm:p-10 rounded-sm bg-gradient-to-r from-[#241317] via-[#38070e] to-[#241317] border border-[#c99a45]/40 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#dfb56c]/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#dfb56c] font-semibold block mb-2">
            ZERO PREREQUISITES
          </span>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-editorial text-[#f7f3eb] font-sinhala mb-2 luxury-heading-anim">
            "අත්දැකීම් නැතිවුණත් කමක් නැහැ."
          </h3>
          <p className="text-sm sm:text-base text-[#f7e2a9] font-sinhala mb-4">
            මුල සිට Step-by-Step ඉගෙනගන්න.
          </p>
          <p className="text-xs sm:text-sm text-[#d5cfc4] max-w-2xl mx-auto leading-relaxed mb-6 font-sinhala">
            ඔබ මීට පෙර කිසිදා මැහුම් හෝ Pattern Making නොදන්නා කෙනෙකු වුවද, අපගේ ප්‍රායෝගික පුහුණුව (Practical Training) හරහා පරිපූර්ණ දැනුමක් සහ විශ්වාසයක් ලබාදෙමු.
          </p>
          <a
            href="#register"
            className="btn-3d-gold hero-btn-float-gold inline-flex px-7 py-3 text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all font-sinhala"
          >
            {isSinhalaMode ? 'අදම මුල සිට ආරම්භ කරන්න' : 'Start From Scratch Today'}
          </a>
        </div>
      </div>
    </section>
  );
};
