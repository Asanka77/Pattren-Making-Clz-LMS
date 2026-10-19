import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Tag, 
  Eye, 
  Plus, 
  Layers, 
  Check, 
  X,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { GalleryImageItem } from '../types';

interface StyleCollectionSliderProps {
  onOpenAdmin?: () => void;
}

export const StyleCollectionSlider: React.FC<StyleCollectionSliderProps> = ({ onOpenAdmin }) => {
  const { gallery, saveGalleryImage } = useData();
  const { isSinhalaMode } = useLanguage();
  const { isLightMode } = useTheme();
  const { isAdmin } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryImageItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // New item form state for backend creation
  const [newTitle, setNewTitle] = useState('');
  const [newTitleSinhala, setNewTitleSinhala] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategory, setNewCategory] = useState('HAUTE COUTURE');
  const [newTag, setNewTag] = useState('New Look');
  const [newDescription, setNewDescription] = useState('');
  const [newDescriptionSinhala, setNewDescriptionSinhala] = useState('');

  // Categories
  const categories = [
    { id: 'ALL', en: 'ALL LOOKS', si: 'සියලුම මෝස්තර' },
    { id: 'BRIDAL & COUTURE', en: 'BRIDAL & COUTURE', si: 'මංගල සහ කෝචර්' },
    { id: 'HAUTE COUTURE', en: 'HAUTE COUTURE', si: 'හොට් කෝචර්' },
    { id: 'RUNWAY EVENING', en: 'RUNWAY EVENING', si: 'සන්ධ්‍යා ඇඳුම්' },
    { id: 'AI FUSION', en: 'AI FASHION TECH', si: 'AI තාක්ෂණය' },
    { id: 'BATIK LUXURY', en: 'BATIK LUXURY', si: 'සුඛෝපභෝගී බතික්' },
    { id: 'BESPOKE TAILORING', en: 'BESPOKE TAILORING', si: 'විශේෂ මැහුම්' },
  ];

  // Filter items
  const publishedItems = gallery.filter((g) => g.isPublished !== false);
  const filteredItems = selectedCategory === 'ALL'
    ? publishedItems
    : publishedItems.filter((g) => g.category.toUpperCase().includes(selectedCategory.toUpperCase()) || selectedCategory.toUpperCase().includes(g.category.toUpperCase()));

  const items = filteredItems.length > 0 ? filteredItems : publishedItems;

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  // Ensure index stays in bounds
  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  // Touch Swipe for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      handleNext();
      setTouchStart(null);
    } else if (diff < -50) {
      handlePrev();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Backend add item handler
  const handleCreateNewStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    await saveGalleryImage({
      title: newTitle.trim(),
      titleSinhala: newTitleSinhala.trim() || newTitle.trim(),
      imageUrl: newImageUrl.trim(),
      category: newCategory,
      tag: newTag.trim() || 'Exclusive Look',
      description: newDescription.trim(),
      descriptionSinhala: newDescriptionSinhala.trim(),
      isFeatured: true,
      isPublished: true,
      order: gallery.length + 1,
    });

    // Reset & close
    setNewTitle('');
    setNewTitleSinhala('');
    setNewImageUrl('');
    setNewDescription('');
    setNewDescriptionSinhala('');
    setShowAddModal(false);
  };

  return (
    <section 
      id="collections" 
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${
        isLightMode ? 'bg-[#f7f5ef] text-[#1a1716]' : 'bg-[#0a0708] text-[#f4efe6]'
      }`}
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#540d18]/15 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#c99a45]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with 3D White Shaded Dimensional Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Top Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#540d18] border border-[#dfb56c]/50 text-[#f7e2a9] text-[11px] font-mono uppercase tracking-[0.22em] mb-4 shadow-xl shadow-[#540d18]/30"
            data-bg="dark"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse" />
            <span>
              {isSinhalaMode ? 'සුවිශේෂී විලාසිතා එකතුව • CEYLON STYLE COLLECTION' : 'HAUTE COUTURE LOOKBOOK • STYLE COLLECTION'}
            </span>
          </div>

          {/* Main Title: Replacing "සජීවී 3D විලාසිතා සහ පැටර්න් ආකෘතිය" */}
          <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold font-editorial tracking-wider text-balance ${
            isLightMode ? 'text-[#171413] shadow-text-white' : 'text-white letter-anim-white-black'
          } luxury-heading-anim`}>
            {isSinhalaMode ? 'සුවිශේෂී විලාසිතා එකතුව (STYLE COLLECTION)' : 'EXCLUSIVE CEYLON STYLE COLLECTION'}
          </h2>

          {/* Subtitle */}
          <p className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto font-sinhala leading-relaxed ${
            isLightMode ? 'text-[#594f47]' : 'text-[#d5cfc4]'
          }`}>
            {isSinhalaMode
              ? 'අපගේ ඇටලියර් නිර්මාණ ශිල්පීන් සහ සිසුන් විසින් උසස් පැටර්න් තාක්ෂණයෙන් නිමවූ නවීන විලාසිතා (Couture, Bridal, AI Fusion & Batik) සජීවී 3D ස්ලයිඩරය හරහා නරඹන්න.'
              : 'Immerse yourself in our signature capsule collections. Experience smooth 3D motion slides, master tailoring details, and generative AI luxury garments.'}
          </p>

          <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />

          {/* Admin Backend Add Shortcut */}
          {isAdmin && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-3d-gold px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Style Collection (Backend)</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#540d18] to-[#38070e] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-lg shadow-[#dfb56c]/15 scale-105'
                  : isLightMode
                  ? 'bg-white text-[#594f47] border border-[#dfd7c5] hover:border-[#c99a45] hover:text-black'
                  : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:border-[#c99a45]/50 hover:text-white'
              }`}
            >
              {isSinhalaMode ? cat.si : cat.en}
            </button>
          ))}
        </div>

        {/* ==========================================================================
            3D PERSPECTIVE COVERFLOW SLIDER (SMOOTH SLIDE MOVEMENT & DEPTH)
            ========================================================================== */}
        <div 
          className="relative py-8 select-none"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main 3D Card Stage */}
          <div className="relative h-[480px] sm:h-[560px] flex items-center justify-center overflow-hidden [perspective:1400px]">
            {items.map((item, index) => {
              // Calculate circular distance
              let diff = index - currentIndex;
              const len = items.length;
              if (diff > len / 2) diff -= len;
              if (diff < -len / 2) diff += len;

              const absDiff = Math.abs(diff);
              const isCenter = diff === 0;

              // Hide far away cards
              if (absDiff > 3) return null;

              // 3D Transform calculations
              const rotateY = diff * -25;
              const translateX = diff * 240;
              const translateZ = isCenter ? 60 : -absDiff * 110;
              const scale = isCenter ? 1.05 : Math.max(0.72, 1 - absDiff * 0.16);
              const zIndex = 30 - absDiff;
              const opacity = absDiff > 2 ? 0.25 : absDiff === 2 ? 0.55 : absDiff === 1 ? 0.85 : 1;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isCenter) {
                      setLightboxItem(item);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  className={`absolute w-[290px] sm:w-[360px] h-[440px] sm:h-[520px] rounded-sm overflow-hidden cursor-pointer group transform-gpu ${
                    isCenter
                      ? 'ring-2 ring-[#dfb56c] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,154,69,0.35)]'
                      : 'border border-white/10 shadow-2xl hover:border-[#dfb56c]/40'
                  }`}
                >
                  {/* Card Background Image */}
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />

                  {/* Gradient Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                  {/* Top Badge & Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span 
                      className="px-2.5 py-1 rounded bg-[#540d18]/90 backdrop-blur-md text-[10px] font-mono uppercase text-[#f7e2a9] border border-[#dfb56c]/40 shadow-lg"
                      data-bg="dark"
                    >
                      {item.tag || item.category}
                    </span>

                    {isCenter && (
                      <span className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-[#dfb56c] flex items-center justify-center text-[#dfb56c] shadow-lg group-hover:scale-110 transition-transform">
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Editorial Content */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-left z-10" data-bg="dark">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] block mb-1">
                      {item.category}
                    </span>

                    <h3 className="text-base sm:text-lg font-editorial font-bold text-white group-hover:text-[#f7e2a9] transition-colors line-clamp-2 leading-snug drop-shadow-md text-3d-white-subtle">
                      {isSinhalaMode ? (item.titleSinhala || item.title) : item.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#d5cfc4] line-clamp-2 font-sinhala leading-relaxed">
                      {isSinhalaMode ? (item.descriptionSinhala || item.description) : item.description}
                    </p>

                    {/* Active Lookbook Inspector Trigger */}
                    {isCenter && (
                      <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-[#dfb56c] font-mono">
                        <span className="flex items-center gap-1 font-bold">
                          <span>{isSinhalaMode ? 'විස්තර බලන්න' : 'Inspect Look'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] text-white/70">
                          {index + 1} / {items.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Bottom Controls & Progress Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto px-4">
            
            {/* Play/Pause Auto-slide Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                isAutoPlaying
                  ? 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/50'
                  : 'bg-black/50 text-[#a89f91] border-white/10 hover:text-white'
              }`}
              title="Toggle Auto Slide Motion"
              data-bg={isAutoPlaying ? "dark" : undefined}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-bold">{isAutoPlaying ? 'AUTO SLIDE ON' : 'PAUSED'}</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs py-1">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === i
                      ? 'w-6 bg-[#dfb56c] shadow-[0_0_8px_#dfb56c]'
                      : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next 3D Tactile Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="btn-3d-secondary p-2.5 rounded-sm flex items-center justify-center cursor-pointer"
                aria-label="Previous style"
              >
                <ChevronLeft className="w-4 h-4 text-[#dfb56c]" />
              </button>

              <button
                onClick={handleNext}
                className="btn-3d-secondary p-2.5 rounded-sm flex items-center justify-center cursor-pointer"
                aria-label="Next style"
              >
                <ChevronRight className="w-4 h-4 text-[#dfb56c]" />
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            LIGHTBOX LOOKBOOK DETAIL MODAL
            ========================================================================== */}
        {lightboxItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setLightboxItem(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-[#141011] rounded-sm border border-[#c99a45]/60 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-[#540d18] text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close lookbook"
              >
                ✕
              </button>

              {/* Left Image View */}
              <div className="md:col-span-7 bg-black flex items-center justify-center aspect-[4/5] sm:aspect-auto">
                <img
                  src={lightboxItem.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover max-h-[550px]"
                />
              </div>

              {/* Right Lookbook Details */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left" data-bg="dark">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded bg-[#540d18] text-[10px] font-mono uppercase text-[#f7e2a9] border border-[#dfb56c]/30">
                      {lightboxItem.tag || lightboxItem.category}
                    </span>
                    <span className="text-[10px] font-mono text-green-400">✦ CEYLON ATELIER</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white text-3d-white-subtle leading-snug">
                    {isSinhalaMode ? (lightboxItem.titleSinhala || lightboxItem.title) : lightboxItem.title}
                  </h3>

                  <p className="mt-4 text-xs sm:text-sm text-[#d5cfc4] leading-relaxed font-sinhala">
                    {isSinhalaMode ? (lightboxItem.descriptionSinhala || lightboxItem.description) : lightboxItem.description}
                  </p>

                  <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10 text-xs text-[#a89f91]">
                    <div className="flex items-center justify-between">
                      <span>Category:</span>
                      <strong className="text-[#f7e2a9] font-mono">{lightboxItem.category}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Atelier Craft:</span>
                      <strong className="text-white">Pattern Engineered</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Curriculum Link:</span>
                      <strong className="text-[#dfb56c]">Modules 01 - 34</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href="#register"
                    onClick={() => setLightboxItem(null)}
                    className="btn-3d-gold w-full py-3 text-xs uppercase tracking-widest text-center"
                  >
                    <span>{isSinhalaMode ? 'මෙවැනි නිර්මාණ කිරීමට ඉගෙන ගන්න' : 'LEARN TO CREATE THIS STYLE'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            BACKEND ADD NEW STYLE MODAL (ADMIN CREATION)
            ========================================================================== */}
        {showAddModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setShowAddModal(false)}
          >
            <div 
              className="relative w-full max-w-xl bg-[#141011] rounded-sm border border-[#dfb56c] p-6 sm:p-8 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                  <h3 className="text-lg font-editorial font-bold text-[#f7e2a9]">
                    Add New Style to Collection (Backend)
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-[#dfb56c] text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewStyle} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#a89f91] mb-1">
                    Style Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Royal Silk Brocade Evening Gown"
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a89f91] mb-1">
                    Style Title (Sinhala)
                  </label>
                  <input
                    type="text"
                    value={newTitleSinhala}
                    onChange={(e) => setNewTitleSinhala(e.target.value)}
                    placeholder="e.g. රාජකීය සිල්ක් බ්‍රෝකේඩ් සන්ධ්‍යා ගවුම"
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a89f91] mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    >
                      <option value="HAUTE COUTURE">HAUTE COUTURE</option>
                      <option value="BRIDAL & COUTURE">BRIDAL & COUTURE</option>
                      <option value="RUNWAY EVENING">RUNWAY EVENING</option>
                      <option value="AI FUSION">AI FUSION</option>
                      <option value="BATIK LUXURY">BATIK LUXURY</option>
                      <option value="BESPOKE TAILORING">BESPOKE TAILORING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a89f91] mb-1">
                      Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g. Runway 2026"
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a89f91] mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                  />
                  {Boolean(newImageUrl && newImageUrl.trim()) && (
                    <div className="mt-2 w-20 h-24 rounded border border-white/20 overflow-hidden">
                      <img src={newImageUrl.trim()} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a89f91] mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Technique, fabric, and styling breakdown..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a89f91] mb-1">
                    Description (Sinhala)
                  </label>
                  <textarea
                    rows={2}
                    value={newDescriptionSinhala}
                    onChange={(e) => setNewDescriptionSinhala(e.target.value)}
                    placeholder="මැහුම් හා පැටර්න් තාක්ෂණ විස්තරය..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                  />
                </div>

                <div className="pt-4 border-t border-white/15 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded bg-black/50 text-[#a89f91] hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-3d-gold px-6 py-2 text-xs uppercase tracking-wider font-bold"
                  >
                    Save to Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
