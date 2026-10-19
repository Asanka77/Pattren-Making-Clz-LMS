import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Play,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Video,
  FileText,
  RotateCcw,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { Lesson } from '../../types';

export interface GraphicPhotoItem {
  id: string;
  title: string;
  titleSinhala?: string;
  category: 'blueprint' | 'photo' | 'garment' | 'sketch';
  imageUrl: string;
  month: number;
  description: string;
  descriptionSinhala?: string;
  dimensions?: string;
  technique?: string;
}

interface ThreeDSlidingShowcaseProps {
  lessons: Lesson[];
  activePaidMonths: number[];
  currentLessonIndex: number;
  onSelectLesson: (index: number) => void;
  onOpenVideoModal?: (lesson: Lesson) => void;
  onUploadSlipClick?: () => void;
}

export const ThreeDSlidingShowcase: React.FC<ThreeDSlidingShowcaseProps> = ({
  lessons,
  activePaidMonths,
  currentLessonIndex,
  onSelectLesson,
  onOpenVideoModal,
  onUploadSlipClick,
}) => {
  const [activeMode, setActiveMode] = useState<'videos' | 'blueprints' | 'photos'>('videos');
  const [carouselIndex, setCarouselIndex] = useState<number>(() =>
    currentLessonIndex >= 0 ? currentLessonIndex : 0
  );
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [tiltEnabled, setTiltEnabled] = useState<boolean>(true);

  // 3D Tilt Motion Values for interactive graphic cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  // Pattern Blueprints & Graphic Illustrations
  const graphicItems: GraphicPhotoItem[] = [
    {
      id: 'bp-01',
      title: 'Master Bodice Block & Dart Apex Distribution',
      titleSinhala: 'මූලික උඩුකය බ්ලොක් එක සහ ඩාට් කේන්ද්‍රය',
      category: 'blueprint',
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85',
      month: 1,
      description: 'Standard French curve anatomical sloper draft with 0.5cm seam allowances & trueing marks.',
      descriptionSinhala: 'ශරීර මිණුම් වලට අනුකූලව නිවැරදි වක්‍ර රේඛා සහ ඩාට් විහිදීම.',
      dimensions: 'UK Size 8-14 Scaled Sloper',
      technique: 'Haute Couture Anatomical Draft',
    },
    {
      id: 'bp-02',
      title: 'Contour Armhole Pitch & Sleeve Cap Balance',
      titleSinhala: 'කිහිලි වටයේ සමතුලිතතාව සහ අතේ වක්‍රය',
      category: 'blueprint',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85',
      month: 2,
      description: 'Bicep ease formulas, front/back armhole notches & ease distribution over the crown.',
      descriptionSinhala: 'අත සවිකිරීමේදී රැලි නොවැටෙන ලෙස නිවැරදි මිණුම් සැකසුම.',
      dimensions: 'Ratio 1:1 Production Blueprint',
      technique: 'Sleeve Cap Pitch Calibration',
    },
    {
      id: 'bp-03',
      title: 'Haute Couture Draping on Professional Mannequin',
      titleSinhala: 'මැනිකින් එක මත සජීවී ඩ්‍රේපින් ක්‍රමවේදය',
      category: 'photo',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      month: 3,
      description: 'Direct bias-cut manipulation using 100% mulberry raw silk and precision tailor pins.',
      descriptionSinhala: 'රෙදිපිළි වල ස්වභාවික රැඳවුම මගින් නවීන ඇඳුම් මෝස්තර නිර්මාණය.',
      dimensions: 'Bias Cut 45° Grain Alignment',
      technique: 'Direct Atelier 3D Draping',
    },
    {
      id: 'bp-04',
      title: 'Corsetry Boning Channels & Structural Waist Stay',
      titleSinhala: 'කෝසට් සහ ඇතුළත බෝනින් සැකැස්ම',
      category: 'blueprint',
      imageUrl: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=1200&q=85',
      month: 4,
      description: 'Multi-panel spiraled steel boning insertion, waist reduction math & modesty placket.',
      descriptionSinhala: 'ඉණ හැඩගැන්වීම සහ ඇඳුම කඩා නොවැටෙන පරිදි ශක්තිමත් කිරීම.',
      dimensions: '12-Panel Reduction Matrix',
      technique: 'Structural Undergarment Architecture',
    },
    {
      id: 'bp-05',
      title: 'Student Runway Atelier Creation & Fine Finishing',
      titleSinhala: 'අවසාන විලාසිතා දැක්මේ සිසු නිර්මාණ',
      category: 'photo',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
      month: 5,
      description: 'Hand-rolled hem stitches, horsehair braid hems & invisible Japanese zip installation.',
      descriptionSinhala: 'ප්‍රමිතියෙන් ඉහළ අත් මැහුම් සහ නිමාවන් සහිත ගවුම් නිර්මාණය.',
      dimensions: 'Runway Gala Masterpiece',
      technique: 'Atelier French Seam & Hand Finishes',
    },
    {
      id: 'bp-06',
      title: 'Grading Blueprint: Multi-Size Expansion Matrix',
      titleSinhala: 'පැටර්න් සයිස් ග්‍රේඩින් (S, M, L, XL)',
      category: 'blueprint',
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85',
      month: 6,
      description: 'Standard X/Y coordinate shift values for scaling XS to 3XL while keeping apex balance.',
      descriptionSinhala: 'එකම පැටර්න් එක විවිධ සයිස් වලට නිරවද්‍යව වෙනස් කිරීමේ ගණනය කිරීම්.',
      dimensions: 'Sizes UK 6 through UK 22',
      technique: 'Precision Coordinate Cartesian Grading',
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const nextSlide = () => {
    if (activeMode === 'videos') {
      const nextIdx = (carouselIndex + 1) % lessons.length;
      setCarouselIndex(nextIdx);
      onSelectLesson(nextIdx);
    } else {
      setPhotoIndex((prev) => (prev + 1) % graphicItems.length);
    }
  };

  const prevSlide = () => {
    if (activeMode === 'videos') {
      const prevIdx = (carouselIndex - 1 + lessons.length) % lessons.length;
      setCarouselIndex(prevIdx);
      onSelectLesson(prevIdx);
    } else {
      setPhotoIndex((prev) => (prev - 1 + graphicItems.length) % graphicItems.length);
    }
  };

  const currentLesson = lessons[carouselIndex] || lessons[0];
  const isMonthPaid = currentLesson ? activePaidMonths.includes(currentLesson.month || 1) : false;
  const currentGraphic = graphicItems[photoIndex];
  const isGraphicMonthPaid = activePaidMonths.includes(currentGraphic.month);

  return (
    <div
      className="relative w-full rounded-sm bg-gradient-to-b from-[#141011] via-[#0d090a] to-[#080506] border border-[#c99a45]/30 p-4 sm:p-6 shadow-2xl overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background gold glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#dfb56c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#540d18]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar with 3D Mode Selector & Slide-in Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#540d18] border border-[#dfb56c]/60 flex items-center justify-center text-[#dfb56c] shadow-lg shadow-[#540d18]/40">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] tracking-wide">
                3D Interactive Media &amp; Graphic Carousel
              </h4>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#dfb56c]/10 text-[#f7e2a9] border border-[#dfb56c]/40 uppercase">
                Framer Motion 3D
              </span>
            </div>
            <p className="text-[11px] text-[#a89f91] font-sinhala">
              ත්‍රිමාන (3D) දෘශ්‍ය ප්‍රයෝග සහ අභිරුචි වීඩියෝ/පැටර්න් බ්ලූප්‍රින්ට් ගැලරිය
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-black/60 p-1 rounded-sm border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveMode('videos')}
            className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all ${
              activeMode === 'videos'
                ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 shadow-md font-bold'
                : 'text-[#a89f91] hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>3D Videos ({lessons.length})</span>
          </button>

          <button
            onClick={() => setActiveMode('blueprints')}
            className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all ${
              activeMode === 'blueprints'
                ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 shadow-md font-bold'
                : 'text-[#a89f91] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>Blueprints &amp; Drafts</span>
          </button>

          <button
            onClick={() => setActiveMode('photos')}
            className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all ${
              activeMode === 'photos'
                ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 shadow-md font-bold'
                : 'text-[#a89f91] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>Atelier Photos</span>
          </button>
        </div>
      </div>

      {/* Main 3D Stage Area */}
      <div
        className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center overflow-hidden py-4 perspective-1200"
        style={{ perspective: 1200 }}
      >
        {/* ================= MODE 1: 3D SLIDING VIDEOS CAROUSEL ================= */}
        {activeMode === 'videos' && (
          <div className="relative w-full max-w-4xl h-[330px] sm:h-[380px] flex items-center justify-center">
            {lessons.map((lesson, idx) => {
              const offset = idx - carouselIndex;
              const isCenter = offset === 0;
              const isPaid = activePaidMonths.includes(lesson.month || 1);

              // Only render visible neighboring cards for peak mobile performance
              if (Math.abs(offset) > 2) return null;

              return (
                <motion.div
                  key={lesson.id}
                  className={`absolute w-[290px] sm:w-[380px] md:w-[460px] h-[260px] sm:h-[320px] rounded-sm overflow-hidden border cursor-pointer ${
                    isCenter
                      ? 'border-[#dfb56c] shadow-2xl shadow-black/90 z-20'
                      : 'border-white/10 opacity-60 hover:opacity-80 z-10'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  initial={false}
                  animate={{
                    x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 190 : 250),
                    scale: isCenter ? 1 : 0.82,
                    rotateY: offset * -28,
                    z: -Math.abs(offset) * 120,
                    opacity: isCenter ? 1 : 0.45,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 24,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -40) nextSlide();
                    else if (info.offset.x > 40) prevSlide();
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      setCarouselIndex(idx);
                      onSelectLesson(idx);
                    }
                  }}
                >
                  {/* Card Background & Image / Thumbnail */}
                  <div className="relative w-full h-full bg-[#141011] flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                    {/* Lesson Thumbnail or Atelier Backdrop */}
                    <img
                      src={
                        lesson.thumbnailUrl ||
                        `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80`
                      }
                      alt={lesson.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Top Badges */}
                    <div className="relative z-20 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-black/80 border border-[#dfb56c]/50 text-[#f7e2a9] uppercase tracking-wider flex items-center gap-1.5">
                        <span>Month 0{lesson.month || 1}</span>
                        <span>•</span>
                        <span>Lesson {lesson.lessonNumber}</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${
                          isPaid
                            ? 'bg-green-950/80 text-green-300 border-green-500/60'
                            : 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/70'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <Unlock className="w-3 h-3 text-green-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-[#dfb56c]" />
                            <span>M0{lesson.month} Locked</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Center 3D Play Trigger (Appears/Pulsates on center card) */}
                    <div className="relative z-20 flex-1 flex items-center justify-center">
                      {isCenter && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center shadow-2xl backdrop-blur-md ${
                            isPaid
                              ? 'bg-[#dfb56c]/90 border-[#f7e2a9] text-black shadow-[#dfb56c]/40'
                              : 'bg-[#540d18]/90 border-[#dfb56c] text-[#f7e2a9] shadow-[#540d18]/60'
                          }`}
                        >
                          {isPaid ? (
                            <Play className="w-6 h-6 fill-black ml-1" />
                          ) : (
                            <Lock className="w-6 h-6 text-[#f7e2a9]" />
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Metadata & Slide-in Interactive Buttons */}
                    <div className="relative z-20 space-y-2">
                      <h4 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] line-clamp-2 leading-tight">
                        {lesson.title}
                      </h4>
                      {lesson.titleSinhala && (
                        <p className="text-[11px] text-[#dfb56c] font-sinhala line-clamp-1">
                          {lesson.titleSinhala}
                        </p>
                      )}

                      {/* Interactive slide-in buttons that remain hidden/minimized on inactive cards */}
                      <AnimatePresence>
                        {isCenter && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="pt-2 flex items-center gap-2"
                          >
                            {isPaid ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectLesson(idx);
                                }}
                                className="flex-1 py-2 px-3 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg flex items-center justify-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-black" />
                                <span>Play Lecture</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onUploadSlipClick) onUploadSlipClick();
                                }}
                                className="flex-1 py-2 px-3 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#6e1322] shadow-lg flex items-center justify-center gap-1.5"
                              >
                                <Lock className="w-3.5 h-3.5 text-[#dfb56c]" />
                                <span>Unlock M0{lesson.month}</span>
                              </button>
                            )}

                            {lesson.pdfUrl && (
                              <a
                                href={lesson.pdfUrl}
                                download
                                onClick={(e) => {
                                  if (!isPaid) {
                                    e.preventDefault();
                                    alert('Please unlock Month 0' + lesson.month + ' to download this PDF.');
                                  }
                                }}
                                className="p-2 bg-black/60 border border-white/20 rounded-sm text-[#dfb56c] hover:text-white"
                                title="Download Study PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ================= MODE 2 & 3: 3D BLUEPRINTS & ATELIER GRAPHICS WITH TILT ================= */}
        {(activeMode === 'blueprints' || activeMode === 'photos') && (
          <motion.div
            className="relative w-full max-w-2xl h-[330px] sm:h-[380px] rounded-sm border border-[#dfb56c]/70 bg-[#0c090a] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
            style={{
              transformStyle: 'preserve-3d',
              rotateX,
              rotateY,
            }}
            onMouseMove={handleMouseMove}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x < -40) nextSlide();
              else if (info.offset.x > 40) prevSlide();
            }}
          >
            {/* Dynamic Glare Specular Lighting Reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-30 opacity-30 mix-blend-overlay"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`,
              }}
            />

            {/* Graphic Image / Blueprint with 3D Depth */}
            <div className="relative w-full h-full">
              <img
                src={currentGraphic.imageUrl}
                alt={currentGraphic.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              {/* 3D Floating Depth Pin (Simulates 3D Blueprint Depth) */}
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                style={{ translateZ: 40 }}
              >
                <div className="px-3 py-1.5 rounded-full bg-black/85 border border-[#dfb56c] text-[#f7e2a9] text-[10px] font-mono shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
                  <Compass className="w-3.5 h-3.5 text-[#dfb56c] animate-spin" />
                  <span>{currentGraphic.technique || '3D Precision Alignment'}</span>
                </div>
              </motion.div>

              {/* Top Bar with Month & Category */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-black/80 border border-[#dfb56c]/50 text-[#f7e2a9] uppercase">
                  {currentGraphic.category.toUpperCase()} • MONTH 0{currentGraphic.month}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTiltEnabled((prev) => !prev)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      tiltEnabled
                        ? 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]'
                        : 'bg-black text-[#a89f91] border-white/20'
                    }`}
                    title="Toggle 3D Gyroscope / Mouse Tilt"
                  >
                    3D Tilt: {tiltEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Bottom Caption & Interactive Slide-in Details */}
              <div className="absolute bottom-4 inset-x-4 z-20 space-y-2">
                <div className="p-3.5 rounded-sm bg-black/80 border border-white/10 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-editorial font-bold text-[#f7f3eb]">
                      {currentGraphic.title}
                    </h4>
                    {currentGraphic.dimensions && (
                      <span className="text-[10px] font-mono text-[#dfb56c]">
                        {currentGraphic.dimensions}
                      </span>
                    )}
                  </div>
                  {currentGraphic.titleSinhala && (
                    <p className="text-xs text-[#dfb56c] font-sinhala font-medium">
                      {currentGraphic.titleSinhala}
                    </p>
                  )}
                  <p className="text-[11px] text-[#d5cfc4] leading-relaxed">
                    {currentGraphic.description}
                  </p>
                </div>

                {/* Smooth Slide-in Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <a
                    href={currentGraphic.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View High-Definition Blueprint</span>
                  </a>

                  <button
                    onClick={() => {
                      const next = (photoIndex + 1) % graphicItems.length;
                      setPhotoIndex(next);
                    }}
                    className="p-2 bg-black/70 border border-white/20 rounded-sm text-[#dfb56c] hover:text-white"
                    title="Next 3D Graphic"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Left & Right Smooth Sliding Buttons (remain minimized/hidden until hovered or touched) */}
        <AnimatePresence>
          {(isHovered || showControls) && (
            <>
              <motion.button
                initial={{ x: -25, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -25, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#141011]/90 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-90"
                aria-label="Previous 3D Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                initial={{ x: 25, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 25, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#141011]/90 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-90"
                aria-label="Next 3D Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Dots & Mobile Responsive Instruction */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a89f91]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#dfb56c]">
            {activeMode === 'videos' ? `Video ${carouselIndex + 1} of ${lessons.length}` : `Graphic ${photoIndex + 1} of ${graphicItems.length}`}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[10px] text-[#a89f91] hidden sm:inline">
            Swipe left/right or use arrow buttons to slide in 3D
          </span>
        </div>

        {/* Quick slide dots */}
        <div className="flex items-center gap-1.5">
          {(activeMode === 'videos' ? lessons.slice(0, 8) : graphicItems).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (activeMode === 'videos') {
                  setCarouselIndex(i);
                  onSelectLesson(i);
                } else {
                  setPhotoIndex(i);
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                (activeMode === 'videos' ? carouselIndex : photoIndex) === i
                  ? 'w-6 bg-[#dfb56c]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
