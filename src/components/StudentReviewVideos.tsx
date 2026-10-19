import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Star,
  Quote,
  Video as VideoIcon,
  CheckCircle2,
  ExternalLink,
  X,
  Award,
  Users,
  Hand,
  ChevronDown,
  ChevronUp,
  Info,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Parallax, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/parallax';

import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { YouTubeVideoItem } from '../types';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../lib/mediaUtils';

// Curated default student reviews if none added in Firestore yet
const DEFAULT_STUDENT_REVIEW_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'yt-student-01',
    title: 'How I Launched My Own Luxury Clothing Line After 6 Months',
    titleSinhala: 'මාස 6ක පුහුණුවෙන් මගේම Luxury Clothing Brand එක ආරම්භ කළ හැටි - දිල්හානි සේනානායක',
    description: 'Dilhani shares her journey from zero pattern knowledge to establishing an export-ready women’s bespoke boutique in Colombo.',
    descriptionSinhala: 'පැටර්න් මේකින් කිසිවක් නොදැන පැමිණ, අද වන විට සාර්ථක සන්ධ්‍යා ඇඳුම් සන්නාමයක් ගොඩනගා විදේශීය වෙළඳපොළට ඇඳුම් යැවීමේ සැබෑ අත්දැකීම.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    category: 'STUDENT REVIEWS',
    categorySinhala: 'සිසුන්ගේ ප්‍රතිචාර',
    duration: '06:45',
    isFeatured: true,
    isPublished: true,
    order: 1,
    createdAt: '2026-03-01',
  },
  {
    id: 'yt-student-02',
    title: 'From Kegalle Physical Atelier to Red-Carpet Gowns',
    titleSinhala: 'කෑගල්ල ශාඛාවේ ප්‍රායෝගික පුහුණුවෙන් Red Carpet Gowns නිර්මාණය කළ හැටි - කවිඳු දිල්ෂාන්',
    description: 'Kavindu explains the precision of French mannequin draping, dart manipulation, and industrial finishing taught in Module 01-10.',
    descriptionSinhala: 'ප්‍රංශ ඩ්‍රේපින් ක්‍රමය සහ ඩාර්ට් හැසිරවීම ප්‍රායෝගිකව අත්හදා බලමින් මංගල ඇඳුම් නිර්මාණකරුවෙකු බවට පත්වූ ආකාරය.',
    youtubeUrl: 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
    videoId: 'tgbNymZ7vqY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    category: 'STUDENT REVIEWS',
    categorySinhala: 'සිසුන්ගේ ප්‍රතිචාර',
    duration: '08:20',
    isFeatured: true,
    isPublished: true,
    order: 2,
    createdAt: '2026-03-10',
  },
  {
    id: 'yt-student-03',
    title: 'Tripled My Online Boutique Sales with AI Fashion & Meta Ads',
    titleSinhala: 'AI තාක්ෂණය සහ Meta Ads මගින් මගේ ඔන්ලයින් ඇඳුම් අලෙවිය 300% කින් වැඩි කරගත් හැටි - ෂෙනාලි',
    description: 'Shenali explains how AI Midjourney lookbooks and Meta targeting lessons generated over 150 monthly orders without photoshoot costs.',
    descriptionSinhala: 'මිල අධික ෆොටෝෂූට් නැතිව AI මගින් ලුක්බුක් සාදා Facebook සහ Instagram මගින් මසකට ඇණවුම් 150 කට වඩා ලබාගන්නා ක්‍රමය.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2eEB3rS4E48',
    videoId: '2eEB3rS4E48',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    category: 'STUDENT REVIEWS',
    categorySinhala: 'සිසුන්ගේ ප්‍රතිචාර',
    duration: '05:30',
    isFeatured: false,
    isPublished: true,
    order: 3,
    createdAt: '2026-03-15',
  },
];

interface ParallaxStudentCardProps {
  item: YouTubeVideoItem;
  isSinhalaMode: boolean;
  onOpenVideo: (item: YouTubeVideoItem) => void;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

const ParallaxStudentCard: React.FC<ParallaxStudentCardProps> = ({
  item,
  isSinhalaMode,
  onOpenVideo,
  expandedId,
  onToggleExpand,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isExpanded = expandedId === item.id;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSheenPos({ x: 50, y: 50 });
  };

  const thumbUrl =
    item.thumbnailUrl && item.thumbnailUrl.trim().length > 0 && !item.thumbnailUrl.includes('unsplash.com')
      ? item.thumbnailUrl
      : getYouTubeThumbnailUrl(item.youtubeUrl || item.videoId);

  const title = isSinhalaMode ? item.titleSinhala || item.title : item.title;
  const description = isSinhalaMode ? item.descriptionSinhala || item.description : item.description;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="parallax-card-stage h-full select-none"
    >
      <div
        className="parallax-card-inner relative h-full flex flex-col justify-between bg-[#141011] rounded-sm border border-[#c99a45]/30 hover:border-[#dfb56c] transition-all duration-300 shadow-2xl overflow-hidden group"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(223, 181, 108, 0.15)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Dynamic Light Sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(223, 181, 108, 0.14), transparent 65%)`,
          }}
        />

        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfb56c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        <div>
          {/* Video Thumbnail with Interactive Play Button */}
          <div
            onClick={() => onOpenVideo(item)}
            className="parallax-layer-mid relative aspect-video bg-black overflow-hidden cursor-pointer select-none border-b border-white/5"
          >
            <img
              src={thumbUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'}
              alt={title}
              className="w-full h-full object-cover filter brightness-90 group-hover:scale-108 transition-transform duration-700 pointer-events-none"
              draggable={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-center justify-center">
              <div
                className="parallax-layer-front w-14 h-14 rounded-full bg-[#540d18]/90 border-2 border-[#dfb56c] flex items-center justify-center shadow-[0_0_20px_rgba(223,181,108,0.6)] group-hover:scale-115 group-hover:bg-[#6e1322] transition-transform duration-300"
                style={{ transform: isHovered ? 'translateZ(34px)' : 'translateZ(0)' }}
              >
                <Play className="w-6 h-6 text-[#f7e2a9] fill-[#f7e2a9] ml-1" />
              </div>
            </div>

            <div
              className="parallax-layer-front absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-[#dfb56c]/40 text-[#dfb56c] text-[10px] font-mono font-bold flex items-center gap-1"
              style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)' }}
            >
              <Award className="w-3 h-3 text-[#dfb56c]" />
              <span>CSS GRADUATE REVIEW</span>
            </div>

            {item.duration && (
              <span
                className="parallax-layer-front absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white border border-white/10"
                style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)' }}
              >
                {item.duration}
              </span>
            )}
          </div>

          {/* Review Card Content */}
          <div className="p-5 space-y-3">
            {/* Star Rating & Verified Alumnus */}
            <div className="flex items-center justify-between text-[#dfb56c]">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#dfb56c]" />
                ))}
                <span className="text-[11px] font-mono text-[#a89f91] ml-1">5.0 / 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Alumnus</span>
              </div>
            </div>

            <h4
              onClick={() => onOpenVideo(item)}
              className="font-editorial font-bold text-sm sm:text-base text-[#f7f3eb] leading-snug line-clamp-2 group-hover:text-[#f7e2a9] transition-colors cursor-pointer"
            >
              {title}
            </h4>

            <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed line-clamp-3">
              {description}
            </p>

            {/* Expandable Story Takeaway */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onToggleExpand(item.id)}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#dfb56c] hover:text-[#f7e2a9] transition-colors cursor-pointer"
              >
                <Info className="w-3 h-3 text-[#dfb56c]" />
                <span>
                  {isExpanded
                    ? isSinhalaMode
                      ? 'කතාව සඟවන්න'
                      : 'Hide Case Details'
                    : isSinhalaMode
                    ? 'සාර්ථකත්වයේ කතාව සහ කුසලතා'
                    : 'Graduate Journey & Skills'}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-[#dfb56c]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#dfb56c]" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-3 rounded bg-black/60 border border-white/10 text-xs space-y-1.5 text-[#cfc7bc] font-sinhala leading-relaxed">
                  <div className="text-[11px] font-mono text-[#dfb56c] font-bold">
                    {isSinhalaMode ? 'ප්‍රධාන සාධනීය කරුණු:' : 'Course Highlights & Impact:'}
                  </div>
                  <div className="text-[11px]">
                    {isSinhalaMode
                      ? '• සජීවී මැහුම් වැඩමුළු සහ ප්‍රායෝගික අත්දැකීම් සම්පූර්ණ කිරීම'
                      : '• Completed hands-on live atelier physical garment construction'}
                  </div>
                  <div className="text-[11px]">
                    {isSinhalaMode
                      ? '• AI මෙවලම් මගින් ඇඳුම් මෝස්තර ප්‍රචාරණය සහ අලෙවිය ඉහළ නැංවීම'
                      : '• Scaled direct-to-consumer e-commerce boutique with digital branding'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-[11px] text-[#dfb56c] font-mono">
            Atelier Graduate
          </div>

          <button
            type="button"
            onClick={() => onOpenVideo(item)}
            className="btn-3d-burgundy text-xs px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer font-sinhala font-bold tracking-wider"
          >
            <span>{isSinhalaMode ? 'වීඩියෝව නරඹන්න' : 'Watch Review'}</span>
            <Play className="w-3 h-3 fill-current text-[#dfb56c]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const StudentReviewVideos: React.FC = () => {
  const { videos } = useData();
  const { isSinhalaMode } = useLanguage();
  const [activeModalVideo, setActiveModalVideo] = useState<YouTubeVideoItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Responsive Breakpoint State
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileOrTablet = windowWidth < 1024;

  // Filter student review / work videos from the centralized database
  const studentVideosFromDb = videos.filter(
    (v) =>
      v.isPublished !== false &&
      (v.category === 'STUDENT REVIEWS' ||
        v.category === 'STUDENT VIDEOS' ||
        v.category === 'සිසුන්ගේ නිර්මාණ' ||
        v.category.includes('STUDENT') ||
        v.title.toLowerCase().includes('student') ||
        v.titleSinhala?.includes('ශිෂ්‍ය') ||
        v.titleSinhala?.includes('සිසු'))
  );

  const displayVideos =
    studentVideosFromDb.length > 0 ? studentVideosFromDb : DEFAULT_STUDENT_REVIEW_VIDEOS;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="student-reviews" className="py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Background radial luxury lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#540d18]/20 via-[#c99a45]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#540d18]/40 border border-[#dfb56c]/30 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>
              {isSinhalaMode
                ? 'ශිෂ්‍ය ප්‍රතිචාර සහ සාර්ථකත්වයේ කතාන්දර'
                : 'Student Video Testimonials & Success Stories'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold tracking-tight text-[#f7f3eb] mb-4">
            {isSinhalaMode ? (
              <>
                අපගේ සාර්ථක <span className="gold-gradient-text">ශිෂ්‍යයින්ගේ වීඩියෝ ප්‍රතිචාර</span>
              </>
            ) : (
              <>
                Graduate Brand Success &amp;{' '}
                <span className="gold-gradient-text">Student Video Reviews</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'Ceylon Style Studio වෙතින් හැදෑරූ සිසුන් තම සාර්ථක ඇඟලුම් සන්නාම ගොඩනැගූ ආකාරය සහ ඔවුන්ගේ සැබෑ අත්දැකීම් ඔවුන්ගේම හඬින් නරඹන්න.'
              : 'Listen directly to our graduates as they share how mastering precision pattern making, AI design workflows, and luxury branding transformed their careers into thriving fashion businesses.'}
          </p>
        </div>

        {/* Responsive Framework: Swiper.js on Mobile & Tablet, Seamless CSS Grid on Desktop */}
        {isMobileOrTablet ? (
          <div className="relative pb-6">
            <Swiper
              modules={[Navigation, Pagination, Parallax, Autoplay]}
              parallax={true}
              grabCursor={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
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
              }}
              className="swiper-luxury w-full"
            >
              {displayVideos.map((item, idx) => (
                <SwiperSlide key={item.id || idx} className="h-auto pb-2">
                  <div data-swiper-parallax="-30" className="h-full">
                    <ParallaxStudentCard
                      item={item}
                      isSinhalaMode={isSinhalaMode}
                      onOpenVideo={(v) => setActiveModalVideo(v)}
                      expandedId={expandedId}
                      onToggleExpand={toggleExpand}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#a89f91] px-1">
              <div className="flex items-center gap-1.5 text-[#dfb56c]">
                <Hand className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'තිරස් අතට Swipe කරන්න' : 'Swipe horizontally to view all graduate reviews'}</span>
              </div>
              <span className="text-[#dfb56c] flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Swiper Mobile Touch
              </span>
            </div>
          </div>
        ) : (
          /* Desktop CSS Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.map((item, idx) => (
              <div key={item.id || idx} className="h-full">
                <ParallaxStudentCard
                  item={item}
                  isSinhalaMode={isSinhalaMode}
                  onOpenVideo={(v) => setActiveModalVideo(v)}
                  expandedId={expandedId}
                  onToggleExpand={toggleExpand}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player (Sandboxed Against External Redirects) */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 bg-[#1f1517] border-b border-white/10 text-xs font-mono text-[#f7e2a9]">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#dfb56c]" />
                <span className="font-bold">STUDENT SUCCESS STORY PLAYER</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="px-2.5 py-1 rounded bg-black/60 hover:bg-[#540d18] text-white border border-white/20 transition-colors cursor-pointer font-bold"
                aria-label="Close modal"
              >
                ✕ Close
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeModalVideo.youtubeUrl || activeModalVideo.videoId, { autoplay: true })}
                title={activeModalVideo.title}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
