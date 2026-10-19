import React, { useState } from 'react';
import { ArrowDown, Sparkles, ChevronRight, Award, Play, Volume2, VolumeX, Eye, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { parseYouTubeVideoId, getYouTubeEmbedUrl } from '../lib/mediaUtils';

interface HeroProps {
  onOpenSyllabus?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSyllabus }) => {
  const { siteSettings } = useData();
  const { isSinhalaMode } = useLanguage();
  const { isLightMode } = useTheme();

  // Helper to extract clean embed URL without color filters or YouTube branding
  const getCleanYoutubeEmbed = (url: string) => {
    return getYouTubeEmbedUrl(url, {
      autoplay: true,
      loop: true,
      mute: true,
      controls: false,
    });
  };

  const sectionHeroBg = siteSettings.sectionBgImages?.hero;
  // Background video / image controlled via Backend CMS
  const videoUrl = siteSettings.heroVideoUrl || 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ';
  const showVideoCover = siteSettings.heroMediaType !== 'IMAGE' && !sectionHeroBg;

  return (
    <section className={`relative min-h-[94vh] flex items-center justify-center overflow-hidden ${siteSettings.pageBgImageUrl ? 'bg-transparent' : 'bg-[#0c090a]'}`}>
      {/* Background Media: 100% Original Color, Zero Filters, Zero Clicks to YouTube */}
      {showVideoCover ? (
        <div className="absolute inset-0 z-0 overflow-hidden select-none">
          {/* YouTube Video: Pure original color, filter: none, full vibrant brilliance */}
          <iframe
            src={getCleanYoutubeEmbed(videoUrl)}
            title="Ceylon Style Studio Haute Couture Cover Video"
            className="w-full h-full object-cover scale-135 pointer-events-none"
            style={{
              filter: 'none',
              WebkitFilter: 'none',
              opacity: 1,
            }}
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* 
            CRITICAL SAFETY SHIELD:
            Transparent barrier covering the entire video background.
            Prevents ANY mouse or touch interaction from touching YouTube or navigating to youtube.com.
          */}
          <div 
            className="absolute inset-0 z-1 pointer-events-auto cursor-default bg-transparent"
            onClick={(e) => {
              // Intercept and swallow any click so it never leaks
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-hidden="true"
          />

          {/* Subtle perimeter vignette purely for framing boundary without masking original video colors */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c090a] to-transparent pointer-events-none z-2" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0c090a]/70 to-transparent pointer-events-none z-2" />
        </div>
      ) : (
        /* Image fallback or Section Hero Background from Backend */
        <div className="absolute inset-0 z-0">
          <img
            src={(sectionHeroBg && sectionHeroBg.trim()) || (siteSettings.heroImageUrl && siteSettings.heroImageUrl.trim()) || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85'}
            alt="Ceylon Style Studio Haute Couture"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: (siteSettings.sectionBgOverlayOpacity ?? 55) / 100 }}
          />
        </div>
      )}

      {/* Hero Content Container: High Contrast, Luxury Editorial Styling */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        
        {/* Floating Atelier Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1416]/95 border border-[#dfb56c]/50 backdrop-blur-md mb-6 shadow-2xl shadow-black/80"
          data-bg="dark"
        >
          <Award className="w-3.5 h-3.5 text-[#dfb56c]" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#f7e2a9]">
            {siteSettings.heroCourseTitle || '6-MONTH PROFESSIONAL FASHION & BRANDING PROGRAM'}
          </span>
        </div>

        {/* Style Collection Quick Trigger Ribbon */}
        <a
          href="#collections"
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#540d18]/90 hover:bg-[#6e1322] border border-[#dfb56c] text-[#f7e2a9] text-[11px] font-mono uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl group"
          data-bg="dark"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] group-hover:rotate-45 transition-transform" />
          <span className="font-bold">
            {isSinhalaMode ? '✨ විලාසිතා එකතුව නරඹන්න (STYLE COLLECTION)' : '✨ EXPLORE EXCLUSIVE STYLE COLLECTION'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#dfb56c]" />
        </a>

        {/* Main Editorial Headline with White Letters, Black Shadow and Floating Animation */}
        <div className="p-5 sm:p-7 rounded-sm bg-black/60 backdrop-blur-md border border-[#dfb56c]/25 shadow-2xl shadow-black/90 max-w-3xl" data-bg="dark">
          <h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-editorial text-white luxury-heading-anim leading-snug sm:leading-snug tracking-wider whitespace-pre-line text-balance"
          >
            {siteSettings.heroTitle || 'ඔබේ හැකියාවෙන්\nඔබේ අනාගතය\nනිර්මාණය කරන්න.'}
          </h1>

          {/* Luxury Gold Subtitle */}
          <div className="mt-4">
            <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase gold-gradient-text drop-shadow-md">
              {siteSettings.heroSubtitle || 'DESIGN YOUR SKILL. BUILD YOUR BRAND. CREATE YOUR FUTURE.'}
            </p>
          </div>

          {/* Journey Flow Indicator */}
          <div 
            className="mt-6 py-2.5 px-4 rounded bg-black/75 border border-[#dfb56c]/30 text-[11px] sm:text-xs text-[#d5cfc4] flex flex-wrap items-center justify-center gap-2 font-mono uppercase tracking-wider"
            data-bg="dark"
          >
            <span className="text-[#f7e2a9]">Pattern</span>
            <span className="text-[#dfb56c]">→</span>
            <span className="text-[#f7e2a9]">Style</span>
            <span className="text-[#dfb56c]">→</span>
            <span className="text-[#f7e2a9]">Garment</span>
            <span className="text-[#dfb56c]">→</span>
            <span className="text-[#f7e2a9]">Brand</span>
            <span className="text-[#dfb56c]">→</span>
            <span className="text-[#f7e2a9]">AI & 3D</span>
            <span className="text-[#dfb56c]">→</span>
            <span className="text-[#f7e2a9]">Global Market</span>
          </div>

          {/* Call to Actions - Compact Luxury 3D Floating & Pulsing Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Primary Enroll Button */}
            <a
              href={siteSettings.heroCtaLink || '#register'}
              className="btn-3d-gold hero-btn-float-gold px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span className="font-bold">{isSinhalaMode ? 'දැන්ම ලියාපදිංචි වන්න' : (siteSettings.heroCtaText || 'REGISTER NOW')}</span>
              <ChevronRight className="w-3.5 h-3.5 text-black" />
            </a>

            {/* Course Syllabus Modal Trigger */}
            {onOpenSyllabus && (
              <button
                type="button"
                onClick={onOpenSyllabus}
                className="btn-3d-secondary hero-btn-float-secondary px-3.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] transition-all cursor-pointer shadow-lg"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>{isSinhalaMode ? 'විෂය නිර්දේශය (SYLLABUS)' : 'COURSE SYLLABUS'}</span>
              </button>
            )}

            {/* Launch Style Collection Button */}
            <a
              href="#collections"
              className="btn-3d-burgundy hero-btn-float-burgundy px-3.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
              data-bg="dark"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f7e2a9]" />
              <span>{isSinhalaMode ? 'විලාසිතා එකතුව (COLLECTION)' : 'STYLE COLLECTION'}</span>
            </a>

            {/* On-site Video Gallery Button */}
            <a
              href="#videos"
              className="btn-3d-secondary hero-btn-float-secondary px-3.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{isSinhalaMode ? 'වීඩියෝ (VIDEOS)' : 'MASTERCLASSES'}</span>
            </a>
          </div>

          {/* Fees Quick Preview */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#d5cfc4]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#dfb56c]" />
              <span>
                {isSinhalaMode ? 'භෞතික පන්ති:' : 'Physical:'}{' '}
                <strong className="text-white font-sans">{siteSettings.currency} {siteSettings.physicalFee.toLocaleString()}</strong>
                {isSinhalaMode ? '/මසකට' : '/mo'}
              </span>
            </div>
            <div className="w-[1px] h-3 bg-white/25 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#dfb56c]" />
              <span>
                Zoom:{' '}
                <strong className="text-white font-sans">{siteSettings.currency} {siteSettings.zoomFee.toLocaleString()}</strong>
                {isSinhalaMode ? '/මසකට' : '/mo'}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator to Videos right below Cover */}
        <a
          href="#videos"
          aria-label="Scroll down to masterclass videos"
          className="mt-10 inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#d5cfc4] hover:text-[#dfb56c] transition-colors group"
        >
          <span>{isSinhalaMode ? 'පහළට ගොස් වීඩියෝ නරඹන්න (VIDEOS)' : 'Scroll for Masterclass Videos'}</span>
          <div className="w-6 h-10 rounded-full border border-[#dfb56c]/50 flex items-start justify-center p-1 group-hover:border-[#dfb56c] bg-black/40 backdrop-blur-sm">
            <div className="w-1 h-2 bg-[#dfb56c] rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};
