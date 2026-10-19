import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Compass,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../lib/soundFx';

// Interactive 3D Spatial Parallax Card Component
interface Spatial3DCardProps {
  item: {
    id: string;
    imageUrl?: string;
    title: string;
    category?: string;
    description?: string;
    isFeatured?: boolean;
    tags?: string[];
  };
  index: number;
  onOpenLightbox: () => void;
  isSinhalaMode: boolean;
}

const Spatial3DCard: React.FC<Spatial3DCardProps> = ({
  item,
  index,
  onOpenLightbox,
  isSinhalaMode,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized tilt (-15deg to +15deg)
    const rotateY = ((x - centerX) / centerX) * 14;
    const rotateX = -((y - centerY) / centerY) * 14;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseEnter = () => {
    soundFx.play('BUTTON_HOVER');
    setTilt((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenLightbox}
      className="group relative w-[290px] sm:w-[330px] md:w-[360px] aspect-[4/5] shrink-0 snap-start cursor-pointer select-none perspective-1200"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Multi-Layer Container */}
      <div
        className="relative w-full h-full rounded-sm transition-transform duration-200 ease-out preserve-3d shadow-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: tilt.isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        }}
      >
        {/* Layer 0: Obsidian Card Base with Luxury Metallic Edge */}
        <div
          className="absolute inset-0 rounded-sm bg-[#141011] border border-[#c99a45]/30 group-hover:border-[#dfb56c] transition-colors duration-300 overflow-hidden shadow-2xl"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* High-Resolution Fashion Imagery with Dynamic Shimmer */}
          <img
            src={
              item.imageUrl ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
            }
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-105 group-hover:scale-108 transition-all duration-700"
          />

          {/* Deep Cinematic Shadow Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Interactive Specular Glare Follower */}
          {tilt.isHovered && (
            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(223,181,108,0.25) 35%, transparent 70%)`,
              }}
            />
          )}
        </div>

        {/* Layer 1: Elevated Gold Foil Border Frame (Floating translateZ 28px) */}
        <div
          className="absolute inset-2.5 rounded-sm border border-[#dfb56c]/30 pointer-events-none group-hover:border-[#dfb56c]/70 transition-colors duration-300"
          style={{ transform: 'translateZ(26px)' }}
        />

        {/* Layer 2: Floating Badges (Floating translateZ 42px) */}
        <div
          className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none"
          style={{ transform: 'translateZ(42px)' }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] bg-black/85 px-2.5 py-1 rounded-sm border border-[#dfb56c]/40 backdrop-blur-md shadow-lg font-semibold">
            {item.category || 'COUTURE'}
          </span>

          {item.isFeatured && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#f7e2a9] bg-[#540d18]/90 px-2 py-0.5 rounded-sm border border-[#dfb56c]/60 backdrop-blur-md shadow-lg flex items-center gap-1 font-bold">
              <Sparkles className="w-2.5 h-2.5 text-[#dfb56c]" />
              <span>FEATURED</span>
            </span>
          )}
        </div>

        {/* Layer 3: Spatial Editorial Content Plate (Floating translateZ 56px) */}
        <div
          className="absolute inset-x-4 bottom-4 p-4 rounded-sm bg-black/75 backdrop-blur-md border border-[#c99a45]/30 group-hover:border-[#dfb56c]/70 transition-all duration-300 pointer-events-none"
          style={{ transform: 'translateZ(54px)' }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#dfb56c] uppercase tracking-wider mb-1">
            <Camera className="w-3 h-3 text-[#dfb56c]" />
            <span>ATELIER CREATION #{String(index + 1).padStart(2, '0')}</span>
          </div>

          <h4 className="text-sm sm:text-base font-editorial font-bold text-white group-hover:text-[#f7e2a9] transition-colors leading-snug line-clamp-1">
            {item.title}
          </h4>

          {item.description && (
            <p className="mt-1 text-xs text-[#b8afa2] line-clamp-2 font-sinhala leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#f7e2a9]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{isSinhalaMode ? 'විශාල කර බලන්න' : 'Expand View'}</span>
            </span>
            <span className="font-mono text-[10px] text-[#dfb56c]">3D DEPTH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageGallery: React.FC = () => {
  const { gallery } = useData();
  const { isSinhalaMode } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'3d-flow' | '3d-grid'>('3d-flow');
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const categories = [
    'ALL',
    'COURSE',
    'FASHION',
    'PATTERN',
    'STUDENT WORK',
    'AI',
    'BRANDING',
    'FASHION SHOW',
    'STUDIO',
  ];

  const publishedGallery = gallery.filter((g) => g.isPublished !== false);
  const filtered =
    selectedCat === 'ALL'
      ? publishedGallery
      : publishedGallery.filter((g) => g.category === selectedCat);

  // Smooth Horizontal Momentum Scroll handler
  const scroll = (direction: 'left' | 'right') => {
    soundFx.play('BUTTON_CLICK');
    if (scrollTrackRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1));
      }
    },
    [lightboxIndex, filtered.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section id="gallery" className="py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#540d18]/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c99a45]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1416] border border-[#dfb56c]/40 mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#f7e2a9] font-mono font-semibold">
              3D Spatial Atelier Showcase
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            IMAGE GALLERY
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#b8afa2] font-sinhala max-w-xl mx-auto leading-relaxed">
            {isSinhalaMode
              ? 'සජීවී මැහුම්, ඩිසයින් සාකච්ඡා, Runway ප්‍රදර්ශන සහ සිසුන්ගේ සුවිශේෂී නිර්මාණ එකතුව ත්‍රිමාණ Spatial අත්දැකීමක් ලෙසින් නරඹන්න.'
              : 'Interactive 3D depth gallery featuring graduate runway collections, technical pattern drafting, and haute couture student creations.'}
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Gallery Controls Header: Category Pills & 3D Spatial Layout Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills with Luxury Scrollbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full luxury-scrollbar">
            {categories.map((c) => {
              const count =
                c === 'ALL'
                  ? publishedGallery.length
                  : publishedGallery.filter((g) => g.category === c).length;
              if (c !== 'ALL' && count === 0) return null;
              return (
                <button
                  key={c}
                  onClick={() => {
                    soundFx.play('BUTTON_CLICK');
                    setSelectedCat(c);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedCat === c
                      ? 'btn-3d-burgundy text-[#f7e2a9] border-[#dfb56c]'
                      : 'btn-3d-secondary text-[#a89f91]'
                  }`}
                >
                  <span>{c}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Mode Switcher & 3D Navigation Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#141011] border border-[#dfb56c]/30 rounded p-0.5">
              <button
                onClick={() => {
                  soundFx.play('BUTTON_CLICK');
                  setViewMode('3d-flow');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-all ${
                  viewMode === '3d-flow'
                    ? 'bg-[#540d18] text-[#f7e2a9] font-bold shadow-md'
                    : 'text-[#a89f91] hover:text-[#f7e2a9]'
                }`}
                title="3D Spatial Flow"
              >
                <Compass className="w-3 h-3 text-[#dfb56c]" />
                <span className="hidden sm:inline">{isSinhalaMode ? '3D තිරස්' : '3D Spatial Rail'}</span>
              </button>
              <button
                onClick={() => {
                  soundFx.play('BUTTON_CLICK');
                  setViewMode('3d-grid');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-all ${
                  viewMode === '3d-grid'
                    ? 'bg-[#540d18] text-[#f7e2a9] font-bold shadow-md'
                    : 'text-[#a89f91] hover:text-[#f7e2a9]'
                }`}
                title="3D Scroll Deck"
              >
                <LayoutGrid className="w-3 h-3 text-[#dfb56c]" />
                <span className="hidden sm:inline">{isSinhalaMode ? '3D ඩෙක්' : '3D Scroll Deck'}</span>
              </button>
            </div>

            {/* Scroll Navigation Buttons */}
            {viewMode === '3d-flow' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Previous image"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Next image"
                  className="btn-3d-secondary w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[#f7e2a9] hover:bg-[#540d18] transition-colors border border-[#dfb56c]/40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3D Gallery Stage */}
        {viewMode === '3d-flow' ? (
          /* Smooth Horizontal 3D Momentum Scrolling Track */
          <div
            ref={scrollTrackRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto luxury-scrollbar-horizontal scroll-smooth snap-x snap-mandatory py-6 px-2 [-webkit-overflow-scrolling:touch]"
            style={{
              perspective: '1400px',
            }}
          >
            {filtered.map((item, idx) => (
              <Spatial3DCard
                key={item.id}
                item={item}
                index={idx}
                onOpenLightbox={() => {
                  soundFx.play('BUTTON_CLICK');
                  setLightboxIndex(idx);
                }}
                isSinhalaMode={isSinhalaMode}
              />
            ))}
          </div>
        ) : (
          /* 3D Scroll Deck (Responsive Vertical 3D Stage with Luxury Scrollbar) */
          <div
            className="max-h-[720px] overflow-y-auto luxury-scrollbar-vertical scroll-smooth p-4 rounded-sm border border-[#dfb56c]/20 bg-black/40 [-webkit-overflow-scrolling:touch]"
            style={{ perspective: '1400px' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((item, idx) => (
                <div key={item.id} className="flex justify-center">
                  <Spatial3DCard
                    item={item}
                    index={idx}
                    onOpenLightbox={() => {
                      soundFx.play('BUTTON_CLICK');
                      setLightboxIndex(idx);
                    }}
                    isSinhalaMode={isSinhalaMode}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immersive High-Fidelity Lightbox Modal */}
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => {
                soundFx.play('BUTTON_CLICK');
                setLightboxIndex(null);
              }}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#1c1214] text-white flex items-center justify-center border border-white/20 hover:bg-[#540d18] hover:border-[#dfb56c] transition-colors shadow-2xl cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Right Lightbox Arrows */}
            <button
              onClick={() => {
                soundFx.play('BUTTON_CLICK');
                setLightboxIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filtered.length - 1
                );
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 text-[#f7e2a9] border border-[#dfb56c]/40 hover:bg-[#540d18] flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                soundFx.play('BUTTON_CLICK');
                setLightboxIndex((prev) =>
                  prev !== null && prev < filtered.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 text-[#f7e2a9] border border-[#dfb56c]/40 hover:bg-[#540d18] flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Next item"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Body */}
            <div className="max-w-4xl w-full flex flex-col items-center">
              <div className="relative max-h-[72vh] rounded overflow-hidden border border-[#dfb56c]/50 shadow-2xl bg-black">
                <img
                  src={
                    filtered[lightboxIndex]?.imageUrl ||
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={filtered[lightboxIndex]?.title}
                  className="max-h-[72vh] w-auto object-contain mx-auto"
                />
              </div>

              {/* Caption & Metadata */}
              <div className="mt-4 text-center max-w-xl">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#dfb56c] tracking-widest bg-black/80 px-2 py-0.5 rounded border border-[#dfb56c]/30">
                    {filtered[lightboxIndex].category}
                  </span>
                  <span className="text-xs font-mono text-[#a89f91]">
                    {lightboxIndex + 1} / {filtered.length}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] mt-1">
                  {filtered[lightboxIndex].title}
                </h3>
                {filtered[lightboxIndex].description && (
                  <p className="text-xs sm:text-sm text-[#b8afa2] mt-1 font-sinhala leading-relaxed">
                    {filtered[lightboxIndex].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
