import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Sparkles,
  Film,
  ExternalLink,
  Video as VideoIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoveVertical,
  Hand,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Sliders,
  Layers,
  Smartphone,
  Monitor,
  Eye,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Parallax, Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/parallax';

import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { YouTubeVideoItem } from '../types';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../lib/mediaUtils';

// Responsive breakpoint thresholds
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

type ViewMode = 'auto' | 'carousel' | 'grid';

interface ParallaxCardProps {
  video: YouTubeVideoItem;
  isSinhalaMode: boolean;
  onSelectVideo: (url: string) => void;
  expandedCardId: string | null;
  onToggleExpandCard: (id: string) => void;
  getThumbnailUrl: (video: YouTubeVideoItem) => string;
}

// 3D Parallax Video Card with fluid mouse tilt & touch-friendly interactions
const ParallaxVideoCard: React.FC<ParallaxCardProps> = ({
  video,
  isSinhalaMode,
  onSelectVideo,
  expandedCardId,
  onToggleExpandCard,
  getThumbnailUrl
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isExpanded = expandedCardId === video.id;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (max ~8 degrees for elegant luxury feel)
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSheenPos({ x: 50, y: 50 });
  };

  const title = isSinhalaMode ? video.titleSinhala || video.title : video.title;
  const description = isSinhalaMode ? video.descriptionSinhala || video.description : video.description;
  const categoryLabel = isSinhalaMode ? video.categorySinhala || video.category : video.category;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="parallax-card-stage h-full select-none"
    >
      <div
        className="parallax-card-inner relative h-full flex flex-col justify-between p-4 sm:p-5 rounded-sm bg-gradient-to-b from-[#161012] to-[#100b0d] border border-white/10 hover:border-[#dfb56c]/70 shadow-2xl transition-all duration-300 group"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(223, 181, 108, 0.15)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Dynamic Light Sheen overlay moving with cursor */}
        <div
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(223, 181, 108, 0.12), transparent 65%)`
          }}
        />

        {/* Top Gold Horizon Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfb56c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Card Main Body */}
        <div>
          {/* Thumbnail Container with 3D Depth */}
          <div
            onClick={() => onSelectVideo(video.youtubeUrl)}
            className="parallax-layer-mid relative aspect-video rounded-sm overflow-hidden bg-black mb-4 cursor-pointer border border-white/10 group-hover:border-[#c99a45]/50 transition-all shadow-lg group/thumb"
          >
            <img
              src={getThumbnailUrl(video)}
              alt={title}
              className="w-full h-full object-cover filter brightness-90 group-hover/thumb:brightness-105 group-hover/thumb:scale-108 transition-all duration-700 pointer-events-none"
              loading="lazy"
              draggable={false}
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-center justify-center">
              {/* Floating Elevated 3D Play Trigger */}
              <div
                className="parallax-layer-front w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#540d18]/90 border border-[#dfb56c] flex items-center justify-center shadow-2xl group-hover/thumb:scale-115 group-hover/thumb:bg-[#6e1322] group-hover/thumb:border-[#f7e2a9] transition-all duration-300"
                style={{ transform: isHovered ? 'translateZ(36px)' : 'translateZ(0)' }}
              >
                <Play className="w-5 h-5 text-[#f7e2a9] fill-[#f7e2a9] ml-0.5" />
              </div>
            </div>

            {/* Video Duration (Clean Typography, Zero-Pill) */}
            {video.duration && (
              <div
                className="parallax-layer-front absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-[#f7e2a9] border border-white/10"
                style={{ transform: isHovered ? 'translateZ(24px)' : 'translateZ(0)' }}
              >
                {video.duration}
              </div>
            )}

            {/* Category Ribbon */}
            <div
              className="parallax-layer-front absolute top-2.5 left-2.5 bg-[#540d18]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider text-[#f7e2a9] border border-[#dfb56c]/30"
              style={{ transform: isHovered ? 'translateZ(24px)' : 'translateZ(0)' }}
            >
              {categoryLabel}
            </div>
          </div>

          {/* Video Metadata / Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#dfb56c]/80">
              <span>Atelier Masterclass</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#a89f91]">HD 1080p</span>
            </div>

            <h4
              onClick={() => onSelectVideo(video.youtubeUrl)}
              className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors line-clamp-2 leading-snug cursor-pointer"
            >
              {title}
            </h4>

            <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed font-sinhala">
              {description}
            </p>
          </div>

          {/* Smooth Expandable Lesson Syllabus & Key Takeaways Drawer */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onToggleExpandCard(video.id)}
              className="flex items-center gap-1.5 text-[11px] font-mono text-[#dfb56c] hover:text-[#f7e2a9] transition-colors cursor-pointer"
            >
              <Info className="w-3 h-3 text-[#dfb56c]" />
              <span>
                {isExpanded
                  ? isSinhalaMode
                    ? 'විස්තර සඟවන්න'
                    : 'Hide Lesson Syllabus'
                  : isSinhalaMode
                  ? 'පාඩම් විස්තර සහ ප්‍රධාන කරුණු'
                  : 'Lesson Breakdown & Key Skills'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-[#dfb56c]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#dfb56c]" />
              )}
            </button>

            {/* Smooth Animated Height Drawer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-64 opacity-100 mt-2.5' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-3 rounded bg-black/60 border border-white/10 text-xs space-y-2">
                <div className="text-[11px] font-mono text-[#dfb56c] font-bold">
                  {isSinhalaMode ? 'ප්‍රායෝගික පුහුණු කරුණු:' : 'Practical Modules Included:'}
                </div>
                <ul className="space-y-1 text-[11px] text-[#cfc7bc] font-sinhala leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#dfb56c] mt-0.5">•</span>
                    <span>
                      {isSinhalaMode
                        ? 'සම්මත මිණුම් මත පදනම් වූ නිරවද්‍ය මූලික පැටර්න් සැකසුම'
                        : 'Precision pattern drafting & garment balance control'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#dfb56c] mt-0.5">•</span>
                    <span>
                      {isSinhalaMode
                        ? 'මැහුම් නිමාව සහ සුඛෝපභෝගී Haute Couture විලාසිතා ශිල්පය'
                        : 'Luxury tailoring finishes & bespoke French seams'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#dfb56c] mt-0.5">•</span>
                    <span>
                      {isSinhalaMode
                        ? 'AI සහ ඩිජිටල් මෙවලම් මගින් විලාසිතා ආකෘති නිර්මාණය'
                        : 'Digital 3D rendering & automated brand blueprinting'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions with 3D Tactile Styling */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs gap-2">
          <button
            type="button"
            onClick={() => onSelectVideo(video.youtubeUrl)}
            className="text-[#dfb56c] hover:text-[#f7e2a9] flex items-center gap-1.5 font-bold tracking-wide cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-[#dfb56c]" />
            <span>{isSinhalaMode ? 'නරඹන්න' : 'Watch Masterclass'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectVideo(video.youtubeUrl)}
            className="btn-3d-burgundy text-xs px-3 py-1.5 rounded flex items-center gap-1.5 font-mono font-bold tracking-wider"
            title="Watch in Studio Cinema Player"
          >
            <Play className="w-3 h-3 fill-current text-[#dfb56c]" />
            <span>{isSinhalaMode ? 'වීඩියෝව' : 'Cinema'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const VideoGallery: React.FC = () => {
  const { videos } = useData();
  const { isSinhalaMode } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [isPlayingFeatured, setIsPlayingFeatured] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Responsive Breakpoint State
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [isExpandAll, setIsExpandAll] = useState<boolean>(false);

  // Vertical scroll viewport refs & states for Desktop Grid View
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [scrollTopPos, setScrollTopPos] = useState<number>(0);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [canScrollUp, setCanScrollUp] = useState<boolean>(false);
  const [canScrollDown, setCanScrollDown] = useState<boolean>(true);

  // Track window resize to reconfigure responsive behavior smoothly
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < BREAKPOINTS.md;
  const isTablet = windowWidth >= BREAKPOINTS.md && windowWidth < BREAKPOINTS.lg;
  const isDesktop = windowWidth >= BREAKPOINTS.lg;

  // Resolved active presentation mode based on responsive configuration or user override
  const activeLayout: 'carousel' | 'grid' = useMemo(() => {
    if (viewMode === 'carousel') return 'carousel';
    if (viewMode === 'grid') return 'grid';
    // Auto Mode: Mobile & Tablet get Swiper.js touch carousel; Desktop gets CSS Grid
    return windowWidth < BREAKPOINTS.lg ? 'carousel' : 'grid';
  }, [viewMode, windowWidth]);

  // Categories
  const categories = [
    { id: 'ALL', en: 'ALL SESSIONS', si: 'සියලුම වීඩියෝ' },
    { id: 'COURSE INTRODUCTION', en: 'COURSE OVERVIEW', si: 'පාඨමාලා හැඳින්වීම' },
    { id: 'PATTERN MAKING', en: 'PATTERN MAKING', si: 'පැටර්න් පුහුණුව' },
    { id: 'AI', en: 'AI FASHION TECH', si: 'AI තාක්ෂණය' },
    { id: 'BRANDING', en: 'LUXURY BRANDING', si: 'සන්නාමකරණය' },
    { id: 'STUDENT VIDEOS', en: 'STUDENT WORK & RUNWAY', si: 'සිසුන්ගේ නිර්මාණ' }
  ];

  const publishedVideos = useMemo(() => {
    return videos.filter((v) => v.isPublished !== false);
  }, [videos]);

  const featuredVideo = publishedVideos.find((v) => v.isFeatured) || publishedVideos[0];

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'ALL') return publishedVideos;
    return publishedVideos.filter((v) => {
      if (v.category === selectedCategory) return true;
      if (selectedCategory === 'AI' && (v.category.includes('AI') || v.category.includes('Tech'))) return true;
      return false;
    });
  }, [selectedCategory, publishedVideos]);

  // Mouse drag-to-scroll handlers for vertical viewport in Grid View
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, iframe')) return;
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollTopPos(scrollContainerRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const currentY = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (currentY - startY) * 1.35;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollTop = scrollTopPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 60);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    setCanScrollUp(scrollTop > 15);
    setCanScrollDown(scrollTop < maxScroll - 15);
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(100);
    }
  };

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  // Reset scroll to top on category change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const timer = setTimeout(() => {
      handleScroll();
    }, 120);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const toggleExpandCard = useCallback((id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  }, []);

  const getThumbnailUrl = useCallback((item: YouTubeVideoItem) => {
    if (item?.thumbnailUrl && item.thumbnailUrl.trim().length > 0 && !item.thumbnailUrl.includes('images.unsplash.com')) {
      return item.thumbnailUrl.trim();
    }
    return (
      getYouTubeThumbnailUrl(item?.youtubeUrl || item?.videoId) ||
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'
    );
  }, []);

  const getEmbedUrl = (urlOrId: string, autoPlay: boolean = false) => {
    return getYouTubeEmbedUrl(urlOrId, { autoplay: autoPlay });
  };

  return (
    <section id="videos" className="py-24 bg-[#0a0708] relative border-y border-[#c99a45]/20 overflow-hidden">
      {/* Cinematic subtle glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#540d18]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-[#c99a45]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#540d18]/40 border border-[#c99a45]/40 text-[#dfb56c] text-[11px] font-mono uppercase tracking-[0.2em] mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>
              {isSinhalaMode ? 'සජීවී පන්ති කාමර අත්දැකීම • වීඩියෝ පුස්තකාලය' : 'Watch & Learn • Cinematic Masterclasses'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'පාඨමාලා වීඩියෝ සහ වැඩමුළු' : 'COURSE VIDEOS & MASTERCLASSES'}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#b8afa2] max-w-2xl mx-auto font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'අපගේ සජීවී Atelier පන්ති කාමරයේ ප්‍රායෝගික පුහුණුව, පැටර්න් ඇඳීමේ නිවැරදි තාක්ෂණය, AI මෙවලම් භාවිතය සහ සාර්ථක ශිෂ්‍ය නිර්මාණ සෘජුවම නරඹන්න.'
              : 'Step inside our luxury ateliers. Experience real pattern drafting sessions, cutting-edge AI workflow demonstrations, and graduate brand success stories.'}
          </p>

          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Featured Video Spotlight Masterclass Player */}
        {featuredVideo && (
          <div className="mb-16 p-6 sm:p-8 rounded-sm bg-gradient-to-b from-[#181113] to-[#120d0e] border border-[#c99a45]/30 shadow-2xl relative overflow-hidden group">
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfb56c] to-transparent" />

            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfb56c] animate-pulse" />
                <span className="font-bold">
                  {isSinhalaMode ? 'විශේෂාංගගත සජීවී වැඩමුළුව (FEATURED ATELIER MASTERCLASS)' : 'FEATURED ATELIER SPOTLIGHT'}
                </span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                {isSinhalaMode ? (featuredVideo.categorySinhala || featuredVideo.category) : featuredVideo.category}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Embedded Player */}
              <div className="lg:col-span-8 rounded-sm overflow-hidden aspect-video bg-black border border-[#c99a45]/30 shadow-2xl relative group/player">
                {isPlayingFeatured ? (
                  <iframe
                    src={getEmbedUrl(featuredVideo.youtubeUrl || featuredVideo.videoId, true)}
                    title={featuredVideo.title}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setIsPlayingFeatured(true)}
                    className="relative w-full h-full cursor-pointer overflow-hidden group/thumb select-none"
                    role="button"
                    tabIndex={0}
                    aria-label="Play Masterclass Video"
                  >
                    <img
                      src={getThumbnailUrl(featuredVideo)}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover filter brightness-90 group-hover/thumb:brightness-105 group-hover/thumb:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#540d18]/90 border-2 border-[#dfb56c] flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 group-hover/thumb:bg-[#6e1322] transition-transform duration-300">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#f7e2a9] fill-[#f7e2a9] ml-1" />
                      </div>
                      <span className="mt-4 px-4 py-1.5 rounded-full bg-black/85 border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-mono uppercase tracking-wider font-bold shadow-lg">
                        {isSinhalaMode ? 'වීඩියෝව නැරඹීමට Click කරන්න (Play Video)' : 'Click to Play Masterclass'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info & Call To Action */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded bg-[#241317] text-[11px] font-mono text-[#f7e2a9] border border-[#c99a45]/40 flex items-center gap-1.5">
                      <VideoIcon className="w-3.5 h-3.5 text-[#dfb56c]" />
                      {featuredVideo.duration || '12:30 Mins'}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 4K Ultra HD
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] leading-snug group-hover:text-[#f7e2a9] transition-colors luxury-heading-anim">
                    {isSinhalaMode ? (featuredVideo.titleSinhala || featuredVideo.title) : featuredVideo.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#b8afa2] leading-relaxed font-sinhala">
                    {isSinhalaMode ? (featuredVideo.descriptionSinhala || featuredVideo.description) : featuredVideo.description}
                  </p>

                  <div className="mt-5 space-y-2 text-xs text-[#d5cfc4]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfb56c]" />
                      <span>{isSinhalaMode ? 'ප්‍රායෝගික ශරීර මිණුම් සහ කටවුට් ක්‍රම' : 'Step-by-step hands-on technique'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfb56c]" />
                      <span>{isSinhalaMode ? 'ස්වයංක්‍රීය සන්නාමකරණ ක්‍රියාවලිය' : 'Brand blueprint and live case study'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href="#register"
                    className="btn-3d-gold w-full py-3.5 px-6 text-black text-xs font-bold uppercase tracking-widest rounded-sm text-center flex items-center justify-center gap-2"
                  >
                    <span>{isSinhalaMode ? 'සියලුම පාඩම් සඳහා දැන්ම ලියාපදිංචි වන්න' : 'ENROLL TO ACCESS ALL MASTERCLASSES'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#540d18] to-[#38070e] text-[#f7e2a9] border border-[#dfb56c] shadow-lg shadow-[#dfb56c]/10 font-bold scale-105'
                  : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:border-[#c99a45]/50 hover:text-white'
              }`}
            >
              {isSinhalaMode ? cat.si : cat.en}
            </button>
          ))}
        </div>

        {/* Responsive Framework Wrapper with Swiper.js & CSS Grid Seamless Transitions */}
        <div className="relative rounded-sm border border-[#c99a45]/30 bg-gradient-to-b from-[#120d0f]/95 to-[#0e090b]/98 shadow-2xl p-3 sm:p-5 sm:px-6">
          {/* Gallery Header Bar: Responsive Breakpoints, Active Mode Toggle & Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10 text-xs font-mono">
            {/* Catalog Info & Active Device Indicator */}
            <div className="flex flex-wrap items-center gap-2.5 text-[#f7e2a9]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">
                {isSinhalaMode ? `වීඩියෝ ${filteredVideos.length}ක් සූදානම්` : `${filteredVideos.length} Masterclasses Available`}
              </span>
              <span className="hidden sm:inline-block text-[#dfb56c]/60">·</span>
              
              {/* Responsive Device State Indicator */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#b8afa2]">
                {activeLayout === 'carousel' ? (
                  <Smartphone className="w-3.5 h-3.5 text-[#dfb56c]" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-[#dfb56c]" />
                )}
                <span>
                  {activeLayout === 'carousel'
                    ? isSinhalaMode ? 'Swiper Touch Carousel සක්‍රියයි' : 'Swiper Touch Carousel Active'
                    : isSinhalaMode ? 'Desktop CSS Grid සක්‍රියයි' : 'CSS Grid Layout Active'}
                </span>
              </div>
            </div>

            {/* Layout Controls: Auto vs Swiper vs Grid + Expand Interaction */}
            <div className="flex items-center gap-2">
              {/* Mode Switcher Buttons */}
              <div className="flex items-center bg-black/60 p-0.5 rounded border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('auto')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'auto'
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="Auto-detects Mobile Carousel vs Desktop Grid"
                >
                  <Sliders className="w-3 h-3" />
                  <span className="hidden sm:inline">{isSinhalaMode ? 'ස්වයංක්‍රීය' : 'Auto'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('carousel')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'carousel'
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="Force Touch Carousel (Swiper.js)"
                >
                  <Smartphone className="w-3 h-3" />
                  <span className="hidden sm:inline">Swiper</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="Force Desktop CSS Grid Layout"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              {/* Grid View Controls (Up/Down & Full Expand) */}
              {activeLayout === 'grid' && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollByAmount(-340)}
                    disabled={!canScrollUp || isExpandAll}
                    className="p-1.5 rounded bg-black/60 hover:bg-[#540d18] text-[#f7e2a9] disabled:opacity-20 disabled:pointer-events-none border border-white/10 hover:border-[#dfb56c]/40 transition-colors cursor-pointer"
                    title="Scroll Up"
                    aria-label="Scroll Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByAmount(340)}
                    disabled={!canScrollDown || isExpandAll}
                    className="p-1.5 rounded bg-black/60 hover:bg-[#540d18] text-[#f7e2a9] disabled:opacity-20 disabled:pointer-events-none border border-white/10 hover:border-[#dfb56c]/40 transition-colors cursor-pointer"
                    title="Scroll Down"
                    aria-label="Scroll Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpandAll(!isExpandAll)}
                    className="px-2.5 py-1 rounded bg-[#241317] hover:bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    title={isExpandAll ? 'Switch to Compact Scroll View' : 'Expand Full Height'}
                  >
                    {isExpandAll ? (
                      <>
                        <Minimize2 className="w-3 h-3 text-[#dfb56c]" />
                        <span className="hidden md:inline">{isSinhalaMode ? 'සම්පීඩිත ආකාරය' : 'Compact View'}</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3 h-3 text-[#dfb56c]" />
                        <span className="hidden md:inline">{isSinhalaMode ? 'සියල්ල දිගහරින්න' : 'Expand All'}</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress Bar for Desktop Grid View */}
          {activeLayout === 'grid' && !isExpandAll && (
            <div className="w-full h-1 bg-black/60 rounded-full mb-4 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#dfb56c] transition-all duration-150"
                style={{ width: `${Math.max(8, scrollProgress)}%` }}
              />
            </div>
          )}

          {/* VIEWPORT PRESENTATION: Seamless Transition Between Swiper.js & CSS Grid */}
          {activeLayout === 'carousel' ? (
            /* ========================================================
               1. SWIPER.JS TOUCH-FRIENDLY HORIZONTAL CAROUSEL
               - Fluid 3D Parallax & Touch Drag Gestures on Mobile/Tablet
               - Responsive Breakpoints Configuration
               - Custom Gold Luxury Pagination & Navigation
               ======================================================== */
            <div className="relative pt-1 pb-4">
              <Swiper
                modules={[Navigation, Pagination, Parallax, Autoplay, FreeMode]}
                parallax={true}
                grabCursor={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={true}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1.15,
                    spaceBetween: 14,
                  },
                  480: {
                    slidesPerView: 1.35,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2.1,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 3.25,
                    spaceBetween: 28,
                  }
                }}
                className="swiper-luxury w-full"
              >
                {filteredVideos.map((video) => (
                  <SwiperSlide key={video.id} className="h-auto pb-2">
                    <div
                      data-swiper-parallax="-40"
                      data-swiper-parallax-opacity="0.8"
                      className="h-full"
                    >
                      <ParallaxVideoCard
                        video={video}
                        isSinhalaMode={isSinhalaMode}
                        onSelectVideo={(url) => setActiveVideoModal(url)}
                        expandedCardId={expandedCardId}
                        onToggleExpandCard={toggleExpandCard}
                        getThumbnailUrl={getThumbnailUrl}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Swipe / Gesture Guidance Hint for touch devices */}
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#a89f91] px-1">
                <div className="flex items-center gap-1.5 text-[#dfb56c]">
                  <Hand className="w-3.5 h-3.5" />
                  <span>{isSinhalaMode ? 'තිරස් අතට Swipe කරන්න (Swipe left/right)' : 'Swipe horizontally to browse masterclasses'}</span>
                </div>
                <span className="text-[#a89f91]">
                  {isSinhalaMode ? 'ස්පර්ශ හිතකාමී Carousel' : 'Touch-friendly Swiper.js'}
                </span>
              </div>
            </div>
          ) : (
            /* ========================================================
               2. DESKTOP CSS GRID WITH FLUID 3D PARALLAX & EXPAND
               - Seamless 3-column desktop grid with smooth scroll
               - Mouse drag gestures & viewport progress tracking
               ======================================================== */
            <div className="relative">
              {/* Subtle Top Gradient Shadow indicator when scrolled down */}
              {!isExpandAll && canScrollUp && (
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#120d0f] to-transparent z-20 opacity-80" />
              )}

              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`transition-all select-none focus:outline-none ${
                  isExpandAll
                    ? 'h-auto overflow-visible'
                    : 'max-h-[580px] sm:max-h-[680px] lg:max-h-[760px] overflow-y-auto overscroll-y-contain scroll-smooth'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} pr-1 sm:pr-2`}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
                }}
              >
                {/* Responsive CSS Grid Layout with 3D Parallax */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="h-full">
                      <ParallaxVideoCard
                        video={video}
                        isSinhalaMode={isSinhalaMode}
                        onSelectVideo={(url) => {
                          if (!hasDragged) setActiveVideoModal(url);
                        }}
                        expandedCardId={expandedCardId}
                        onToggleExpandCard={toggleExpandCard}
                        getThumbnailUrl={getThumbnailUrl}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle Bottom Gradient Shadow indicator when more content remains below */}
              {!isExpandAll && canScrollDown && (
                <div className="pointer-events-none absolute bottom-12 left-0 right-0 h-10 bg-gradient-to-t from-[#0e090b] to-transparent z-20 opacity-80" />
              )}

              {/* Footer Drag / Scroll Hint & Progress percentage */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a89f91]">
                <div className="flex items-center gap-2">
                  <MoveVertical className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>
                    {isSinhalaMode
                      ? 'Mouse Drag හෝ Touch Scroll මගින් සම්පූර්ණ ලැයිස්තුව ගවේෂණය කරන්න'
                      : 'Drag or scroll vertically to explore full catalog'}
                  </span>
                </div>
                <span className="text-[#dfb56c]">
                  {Math.round(scrollProgress)}% {isSinhalaMode ? 'නරඹා ඇත' : 'viewed'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video Player Lightbox Modal - Sandboxed strictly to prevent redirecting to YouTube */}
        {activeVideoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveVideoModal(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-[#141011] rounded-sm border border-[#c99a45]/60 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3 bg-[#1c1214] border-b border-white/10 text-xs text-[#f7e2a9] font-mono">
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>CEYLON STYLE STUDIO CINEMA PLAYER</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="px-2.5 py-1 rounded bg-black/60 hover:bg-[#540d18] text-white border border-white/20 transition-colors cursor-pointer font-bold"
                  aria-label="Close video"
                >
                  ✕ Close
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={getEmbedUrl(activeVideoModal)}
                  title="YouTube Player"
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
