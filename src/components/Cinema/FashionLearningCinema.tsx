import React, { useState, useMemo } from 'react';
import {
  Play,
  CheckCircle,
  Clock,
  Lock,
  Download,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  Award,
  Film,
  RotateCcw,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Lesson, CourseModuleItem, VideoCategoryItem } from '../../types';
import { parseYouTubeVideoId } from '../../lib/mediaUtils';

interface FashionLearningCinemaProps {
  onOpenRegister?: () => void;
  onOpenDashboard?: () => void;
  className?: string;
  isStudentEmbedded?: boolean;
}

export const FashionLearningCinema: React.FC<FashionLearningCinemaProps> = ({
  onOpenRegister,
  onOpenDashboard,
  className = '',
  isStudentEmbedded = false,
}) => {
  const { studentUser } = useAuth();
  const { lessons, modules, videoCategories, lessonProgress, updateLessonProgressRecord, markLessonCompleted } = useData();

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('ALL');
  const [activeLessonPlayer, setActiveLessonPlayer] = useState<Lesson | null>(null);
  const [activeTabResource, setActiveTabResource] = useState<'notes' | 'pdf' | 'images'>('notes');

  // Filter published lessons
  const publishedLessons = useMemo(() => {
    return lessons.filter((l) => l.isPublished !== false).sort((a, b) => a.order - b.order);
  }, [lessons]);

  // Determine user completed lesson ids
  const completedLessonIds = useMemo(() => {
    if (studentUser?.completedLessonIds) return studentUser.completedLessonIds;
    return lessonProgress.filter((p) => p.lessonCompleted).map((p) => p.lessonId);
  }, [studentUser, lessonProgress]);

  // Find latest in-progress or next unfinished lesson
  const continueLearningLesson = useMemo(() => {
    if (!publishedLessons.length) return null;
    const unfinished = publishedLessons.find((l) => !completedLessonIds.includes(l.id));
    return unfinished || publishedLessons[0];
  }, [publishedLessons, completedLessonIds]);

  const continueProgressRecord = useMemo(() => {
    if (!continueLearningLesson) return null;
    return lessonProgress.find((p) => p.lessonId === continueLearningLesson.id);
  }, [continueLearningLesson, lessonProgress]);

  // Featured hero lesson (either the unfinished lesson or the first flagship lesson)
  const heroLesson = continueLearningLesson || publishedLessons[0];

  // Helper to extract or convert YouTube embed url
  const getEmbedUrl = (urlOrId: string, startSeconds: number = 0) => {
    const videoId = parseYouTubeVideoId(urlOrId) || 'fJ9rUzIMcZQ';
    const startParam = startSeconds > 0 ? `&start=${Math.floor(startSeconds)}` : '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3${startParam}`;
  };

  // Group lessons by categories for horizontal rails
  const lessonsByCategory = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    videoCategories.forEach((c) => {
      map[c.slug] = publishedLessons.filter((l) => {
        const text = `${l.title} ${l.moduleTitle || ''} ${l.description}`.toUpperCase();
        if (c.slug === 'PATTERN') return text.includes('PATTERN') || text.includes('BODICE') || text.includes('DART');
        if (c.slug === 'STYLE') return text.includes('STYLE') || text.includes('SILHOUETTE') || text.includes('DRAPE');
        if (c.slug === 'GARMENT') return text.includes('GARMENT') || text.includes('SEWING') || text.includes('TAILOR') || text.includes('SEAM');
        if (c.slug === 'AI') return text.includes('AI') || text.includes('TECH') || text.includes('PROMPT') || text.includes('NEURAL');
        if (c.slug === 'BRANDING') return text.includes('BRAND') || text.includes('LABEL') || text.includes('PACKAGING');
        if (c.slug === 'MARKETING') return text.includes('MARKETING') || text.includes('ADS') || text.includes('TIKTOK');
        if (c.slug === 'BUSINESS') return text.includes('BUSINESS') || text.includes('COST') || text.includes('EXPORT') || text.includes('CLIENT');
        return true;
      });
    });
    return map;
  }, [publishedLessons, videoCategories]);

  // Filtered list based on selected category pill
  const displayedLessons = useMemo(() => {
    if (activeCategorySlug === 'ALL') return publishedLessons;
    return lessonsByCategory[activeCategorySlug] || publishedLessons;
  }, [activeCategorySlug, publishedLessons, lessonsByCategory]);

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLessonPlayer(lesson);
    // Track video/lesson started event
    if (studentUser) {
      updateLessonProgressRecord({
        studentRegNo: studentUser.regNumber,
        lessonId: lesson.id,
        videoStarted: true,
      });
    }
  };

  const handleMarkComplete = (lessonId: string) => {
    if (studentUser) {
      markLessonCompleted(studentUser.id, lessonId);
      updateLessonProgressRecord({
        studentRegNo: studentUser.regNumber,
        lessonId,
        lessonCompleted: true,
        videoCompleted: true,
        videoProgress: 100,
      });
    }
  };

  const navigateLesson = (direction: 'prev' | 'next') => {
    if (!activeLessonPlayer) return;
    const currentIndex = publishedLessons.findIndex((l) => l.id === activeLessonPlayer.id);
    if (direction === 'prev' && currentIndex > 0) {
      handleOpenLesson(publishedLessons[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < publishedLessons.length - 1) {
      handleOpenLesson(publishedLessons[currentIndex + 1]);
    }
  };

  return (
    <div className={`space-y-12 ${className}`}>
      {/* =========================================================================
          01. CINEMA FEATURED HERO SPOTLIGHT (Streaming Headline)
          ========================================================================= */}
      {heroLesson && (
        <div className="relative rounded-sm overflow-hidden border border-[#dfb56c]/30 shadow-2xl bg-gradient-to-r from-[#140b0e] via-[#1a0f13] to-[#0c080a]">
          {/* Backdrop Image with Scrim */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src={
                heroLesson.imageUrls?.[0] ||
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85'
              }
              alt={heroLesson.title}
              className="w-full h-full object-cover filter brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c080a] via-[#140b0e]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c080a] via-[#0c080a]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#540d18] text-[#f7e2a9] text-[10px] font-mono uppercase tracking-widest border border-[#dfb56c]/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#dfb56c]" />
                Featured Masterclass • Cinema Spotlight
              </span>

              {heroLesson.moduleTitle && (
                <span className="text-xs text-[#a89f91] font-mono">• {heroLesson.moduleTitle}</span>
              )}

              <span className="text-xs text-[#dfb56c] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {heroLesson.duration || '24 Mins'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-editorial text-white leading-tight">
              {heroLesson.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#d5cfc4] line-clamp-3 leading-relaxed font-sinhala">
              {heroLesson.description ||
                'Mastering haute couture pattern drafting, dart manipulation, and modern luxury construction workflows.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenLesson(heroLesson)}
                className="btn-3d-gold px-6 py-3 text-xs uppercase tracking-widest flex items-center gap-2 font-bold cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>
                  {continueProgressRecord?.lastPosition
                    ? `Continue from ${Math.floor(continueProgressRecord.lastPosition / 60)}:${String(
                        Math.floor(continueProgressRecord.lastPosition % 60)
                      ).padStart(2, '0')}`
                    : 'Watch Masterclass'}
                </span>
              </button>

              {heroLesson.pdfUrl && (
                <a
                  href={heroLesson.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-secondary px-4 py-3 text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Download Notes</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          02. CATEGORY SELECTOR PILLS
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#dfb56c]" />
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#dfb56c] font-bold">
              Fashion Learning Cinema • Master Tracks
            </h4>
          </div>
          <span className="text-xs text-[#a89f91] font-mono">{publishedLessons.length} Recorded Lessons</span>
        </div>

        {/* Dynamic Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategorySlug('ALL')}
            className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategorySlug === 'ALL'
                ? 'btn-3d-burgundy text-[#f7e2a9] border-[#dfb56c]'
                : 'btn-3d-secondary text-[#a89f91]'
            }`}
          >
            All Tracks ({publishedLessons.length})
          </button>

          {videoCategories.map((cat) => {
            const count = (lessonsByCategory[cat.slug] || []).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategorySlug === cat.slug
                    ? 'btn-3d-burgundy text-[#f7e2a9] border-[#dfb56c]'
                    : 'btn-3d-secondary text-[#a89f91]'
                }`}
              >
                <span>{cat.name}</span>
                {count > 0 && <span className="ml-1.5 opacity-60 font-mono text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          03. CONTINUE LEARNING HORIZONTAL RAIL (For In-Progress)
          ========================================================================= */}
      {continueLearningLesson && (
        <div className="p-5 rounded-sm bg-[#181113] border border-[#dfb56c]/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f7e2a9] font-bold flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#dfb56c]" /> Continue Learning
            </span>
            <span className="text-[11px] font-mono text-[#dfb56c]">
              Lesson {continueLearningLesson.lessonNumber} • {continueLearningLesson.duration || '20 Mins'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 p-4 rounded border border-white/5">
            <div>
              <h4 className="text-base font-editorial font-bold text-white">{continueLearningLesson.title}</h4>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Module: {continueLearningLesson.moduleTitle || 'Haute Couture Foundation'}
              </p>
            </div>

            <button
              onClick={() => handleOpenLesson(continueLearningLesson)}
              className="btn-3d-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Resume Lesson</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          04. CINEMATIC 3D VIDEO CARDS GRID
          ========================================================================= */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase font-mono tracking-widest text-[#a89f91]">
          {activeCategorySlug === 'ALL' ? 'All Masterclasses' : `${activeCategorySlug} Lessons`}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const prog = lessonProgress.find((p) => p.lessonId === lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => handleOpenLesson(lesson)}
                className="group relative rounded-sm overflow-hidden bg-[#141011] border border-white/10 hover:border-[#dfb56c] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)]"
              >
                {/* Thumbnail Header with 3D Depth Hover */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={
                      lesson.imageUrls?.[0] ||
                      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={lesson.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Play Button Glow Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#540d18]/90 border border-[#dfb56c] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#f7e2a9] text-[#f7e2a9] ml-0.5" />
                    </div>
                  </div>

                  {/* Top Tags */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#dfb56c] border border-white/10">
                      Lesson {lesson.lessonNumber}
                    </span>

                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-950/80 text-green-300 border border-green-500/40 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3 stroke-[3]" /> Completed
                      </span>
                    ) : prog?.videoProgress ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                        {prog.videoProgress}% watched
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-[#a89f91]">
                        {lesson.duration || '20m'}
                      </span>
                    )}
                  </div>

                  {/* Progress bar line if watched */}
                  {prog?.videoProgress && !isCompleted && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
                      <div className="h-full bg-[#dfb56c]" style={{ width: `${prog.videoProgress}%` }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] block mb-1">
                      {lesson.moduleTitle || 'Haute Atelier'}
                    </span>
                    <h5 className="text-sm font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors line-clamp-2 leading-snug">
                      {lesson.title}
                    </h5>
                    <p className="text-xs text-[#a89f91] line-clamp-2 font-sinhala mt-1.5 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Bottom Indicators */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8e8579]">
                    <div className="flex items-center gap-2">
                      {lesson.pdfUrl && <span title="PDF included"><FileText className="w-3.5 h-3.5 text-[#dfb56c]" /></span>}
                      {lesson.notes && <span title="Study notes included"><BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" /></span>}
                    </div>
                    <span className="text-[#dfb56c] group-hover:underline flex items-center gap-1 font-medium">
                      <span>Watch</span> <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          05. ADVANCED UNIFIED LESSON PLAYER WORKSPACE MODAL
          ========================================================================= */}
      {activeLessonPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="bg-[#141011] border-b border-[#dfb56c]/30 px-6 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]">
                Lesson {activeLessonPlayer.lessonNumber}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-editorial font-bold text-white truncate max-w-lg">
                  {activeLessonPlayer.title}
                </h3>
                <span className="text-[11px] text-[#a89f91] font-mono">{activeLessonPlayer.moduleTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleMarkComplete(activeLessonPlayer.id)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  completedLessonIds.includes(activeLessonPlayer.id)
                    ? 'bg-green-950 text-green-300 border border-green-500'
                    : 'btn-3d-gold'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  {completedLessonIds.includes(activeLessonPlayer.id) ? 'Completed ✓' : 'Mark As Complete'}
                </span>
              </button>

              <button
                onClick={() => setActiveLessonPlayer(null)}
                className="p-1.5 text-[#a89f91] hover:text-white rounded hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Unified Body */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT / MAIN WORKSPACE AREA */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Video Player */}
              <div className="aspect-video bg-black relative border-b border-white/10">
                <iframe
                  src={getEmbedUrl(activeLessonPlayer.videoUrl || activeLessonPlayer.videoId || 'fJ9rUzIMcZQ')}
                  title={activeLessonPlayer.title}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Lesson Workspace Tabs & Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-editorial text-white">
                      {activeLessonPlayer.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#b8afa2] font-sinhala mt-1">
                      {activeLessonPlayer.description}
                    </p>
                  </div>

                  {/* Nav Previous / Next */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateLesson('prev')}
                      className="btn-3d-secondary px-3.5 py-2 text-xs uppercase font-mono tracking-wider flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#dfb56c]" /> Prev Lesson
                    </button>
                    <button
                      onClick={() => navigateLesson('next')}
                      className="btn-3d-secondary px-3.5 py-2 text-xs uppercase font-mono tracking-wider flex items-center gap-1"
                    >
                      Next Lesson <ChevronRight className="w-4 h-4 text-[#dfb56c]" />
                    </button>
                  </div>
                </div>

                {/* Workspace Material Tabs */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <button
                    onClick={() => setActiveTabResource('notes')}
                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                      activeTabResource === 'notes' ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]' : 'text-[#a89f91]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lesson Notes</span>
                  </button>

                  {activeLessonPlayer.pdfUrl && (
                    <button
                      onClick={() => setActiveTabResource('pdf')}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                        activeTabResource === 'pdf' ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]' : 'text-[#a89f91]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF Resources</span>
                    </button>
                  )}

                  {activeLessonPlayer.imageUrls && activeLessonPlayer.imageUrls.length > 0 && (
                    <button
                      onClick={() => setActiveTabResource('images')}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                        activeTabResource === 'images' ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]' : 'text-[#a89f91]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Blueprint Images ({activeLessonPlayer.imageUrls.length})</span>
                    </button>
                  )}
                </div>

                {/* Tab Contents */}
                {activeTabResource === 'notes' && (
                  <div className="p-6 rounded bg-[#141011] border border-white/10 space-y-4">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-[#dfb56c] font-bold">
                      Atelier Study Notes &amp; Technical Points
                    </h4>
                    <div className="text-sm text-[#d5cfc4] leading-relaxed whitespace-pre-line font-sinhala">
                      {activeLessonPlayer.notes ||
                        'පාඨමාලා සටහන්: නිවැරදිව ශරීර මිණුම් සටහන් කරගන්න. ඩාට් එක ඇඳීමේදී මැහුම් වාසි සඳහා අඟල් 1/2ක් තබා කැපීම සිදු කරන්න. අත් මෝස්තරය නිමවීමට පෙර Armhole වට ප්‍රමාණය මැන බැලීම අනිවාර්ය වේ.'}
                    </div>
                  </div>
                )}

                {activeTabResource === 'pdf' && activeLessonPlayer.pdfUrl && (
                  <div className="p-6 rounded bg-[#141011] border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeLessonPlayer.pdfTitle || 'Lesson Pattern Blueprint PDF'}</h4>
                      <p className="text-xs text-[#a89f91] mt-0.5">Downloadable PDF drafting reference sloper</p>
                    </div>
                    <a
                      href={activeLessonPlayer.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-gold px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </div>
                )}

                {activeTabResource === 'images' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {activeLessonPlayer.imageUrls?.filter((img) => Boolean(img && img.trim())).map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="rounded overflow-hidden border border-white/10 group">
                        <img src={img.trim()} alt="Resource" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Course Modules & Lessons List */}
            <div className="w-full lg:w-96 bg-[#0e0a0b] border-t lg:border-t-0 lg:border-l border-[#dfb56c]/25 flex flex-col shrink-0 overflow-y-auto">
              <div className="p-4 border-b border-white/10 bg-[#141011] sticky top-0 z-10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                  Curriculum Playlist ({publishedLessons.length})
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#a89f91]">
                  <span>{completedLessonIds.length} of {publishedLessons.length} Completed</span>
                  <span className="font-mono font-bold text-[#f7e2a9]">
                    {Math.round((completedLessonIds.length / publishedLessons.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-white/5">
                {publishedLessons.map((l, index) => {
                  const isCurrent = l.id === activeLessonPlayer.id;
                  const isDone = completedLessonIds.includes(l.id);

                  return (
                    <div
                      key={l.id}
                      onClick={() => handleOpenLesson(l)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#540d18]/40 border-l-4 border-[#dfb56c]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-green-950 border border-green-500 text-green-300 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-[#dfb56c] text-black flex items-center justify-center font-bold text-[10px]">
                            ▶
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/10 text-[#a89f91] flex items-center justify-center font-mono text-[10px]">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase text-[#a89f91] block">
                          Lesson {l.lessonNumber} • {l.duration || '20m'}
                        </span>
                        <h5 className={`text-xs font-bold line-clamp-2 mt-0.5 ${isCurrent ? 'text-[#f7e2a9]' : 'text-white'}`}>
                          {l.title}
                        </h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
