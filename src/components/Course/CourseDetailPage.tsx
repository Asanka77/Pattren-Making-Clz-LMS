import React, { useState, useEffect } from 'react';
import { CourseItem, CourseVideoItem, CustomForm } from '../../types';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CourseCustomFormModal } from './CourseCustomFormModal';
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  MessageSquare,
  Play,
  Share2,
  Sparkles,
  Star,
  Users,
  Video,
  CheckCircle,
  ShieldCheck,
  Check,
  BookOpen,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

// YouTube URL parser
function parseYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : '';
}

interface CourseDetailPageProps {
  courseSlug: string;
  onBack: () => void;
  onOpenRegisterWithCourse?: (courseSlug: string) => void;
}

export function CourseDetailPage({
  courseSlug,
  onBack,
  onOpenRegisterWithCourse,
}: CourseDetailPageProps) {
  const { language } = useLanguage();
  const { courses, customForms, studentReviews } = useData();

  // Find course by slug or id
  const course = courses.find((c) => c.slug === courseSlug || c.id === courseSlug) || courses[0];

  // Active video in masterclass player
  const [selectedVideo, setSelectedVideo] = useState<CourseVideoItem | null>(null);

  // Custom Form modal state
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [attachedForm, setAttachedForm] = useState<CustomForm | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isSinhala = language === 'si';

  // Attach custom form if specified
  useEffect(() => {
    if (course && course.customFormId) {
      const found = customForms.find((f) => f.id === course.customFormId || f.slug === course.customFormId);
      setAttachedForm(found || null);
    } else {
      setAttachedForm(null);
    }
  }, [course, customForms]);

  // Set default active video
  useEffect(() => {
    if (course && course.videos && course.videos.length > 0) {
      setSelectedVideo(course.videos[0]);
    } else {
      setSelectedVideo(null);
    }
  }, [course]);

  // Sync SEO Title & Meta tags dynamically
  useEffect(() => {
    if (!course) return;
    const originalTitle = document.title;
    const pageTitle = `${course.title} | Ceylon Style Studio`;
    document.title = pageTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const oldDesc = metaDesc.getAttribute('content');
    metaDesc.setAttribute(
      'content',
      course.description ||
        `Enroll in ${course.title} at Ceylon Style Studio. Professional pattern making, style development and haute couture.`
    );

    return () => {
      document.title = originalTitle;
      if (oldDesc) metaDesc?.setAttribute('content', oldDesc);
    };
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0c090a] text-[#f7f3eb] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-editorial font-bold text-[#dfb56c] mb-2">
          Course Not Found
        </h2>
        <p className="text-sm text-[#a89f91] mb-6">
          The requested course catalog entry could not be located.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Academy Home</span>
        </button>
      </div>
    );
  }

  // Display texts based on language
  const title = (isSinhala && course.titleSinhala) ? course.titleSinhala : course.title;
  const subtitle = (isSinhala && course.subtitleSinhala) ? course.subtitleSinhala : course.subtitle;
  const badge = (isSinhala && course.badgeSinhala) ? course.badgeSinhala : course.badge;
  const intake = (isSinhala && course.intakeTextSinhala) ? course.intakeTextSinhala : course.intakeText;
  const aboutText = (isSinhala && course.aboutCourseSinhala) ? course.aboutCourseSinhala : (course.aboutCourse || course.description);

  // Active video embed ID
  const activeVideoId = selectedVideo
    ? (selectedVideo.videoId || parseYouTubeId(selectedVideo.youtubeUrl))
    : (course.promoVideoUrl ? parseYouTubeId(course.promoVideoUrl) : '');

  // Filter approved reviews for this course
  const courseReviews = (studentReviews || []).filter(
    (r) => r.isApproved && (r.courseId === course.id || r.courseTitle === course.title)
  );

  const handleRegisterClick = () => {
    if (attachedForm) {
      setCustomFormOpen(true);
    } else if (onOpenRegisterWithCourse) {
      onOpenRegisterWithCourse(course.slug);
    } else {
      window.location.hash = 'register';
    }
  };

  const handleShareCourse = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(isSinhala ? 'පාඨමාලා සබැඳිය පිටපත් විය!' : 'Course link copied to clipboard!');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0c090a] text-[#f7f3eb] font-sans relative selection:bg-[#c99a45] selection:text-black"
      style={{ color: course.textColor || '#f7f3eb' }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1316] text-[#f7e2a9] border-2 border-[#dfb56c] px-4 py-2.5 rounded shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Floating Atelier Nav Header */}
      <header className="sticky top-0 z-40 bg-[#0e0a0b]/95 backdrop-blur-md border-b border-[#dfb56c]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded bg-[#1c1214] border border-[#dfb56c]/40 text-[#dfb56c] hover:text-[#f7e2a9] hover:bg-[#251518] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Return to Academy"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Academy</span>
          </button>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="hidden md:block">
            <span className="text-xs font-editorial font-bold text-[#f7f3eb] tracking-wide block truncate max-w-xs lg:max-w-md">
              {title}
            </span>
            <span className="text-[10px] font-mono text-[#dfb56c]">
              CEYLON STYLE STUDIO • {course.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShareCourse}
            className="p-2 rounded bg-black/50 border border-white/10 hover:border-[#dfb56c] text-[#a89f91] hover:text-[#dfb56c] transition-colors cursor-pointer"
            title="Share Course Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <a
            href={`https://wa.me/94777595560?text=Hello%20Ceylon%20Style%20Studio!%20I%20am%20interested%20in%20enrolling%20in:%20${encodeURIComponent(course.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded bg-[#25D366]/20 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={handleRegisterClick}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSinhala ? 'ලියාපදිංචි වන්න' : 'Register Now'}</span>
          </button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-8 border-b border-[#dfb56c]/20">
        {/* Banner image background with luxury gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-40 pointer-events-none transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url(${course.bannerImageUrl || course.imageUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c090a] via-[#0c090a]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/50 shadow-lg">
              {course.category}
            </span>

            <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-black/70 border border-white/20 text-[#a89f91]">
              {course.courseMode || 'HYBRID'} MODE
            </span>

            {badge && (
              <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#dfb56c] text-black shadow-md flex items-center gap-1">
                ★ {badge}
              </span>
            )}

            {intake && (
              <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50">
                {intake}
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#f7f3eb] leading-tight tracking-tight drop-shadow-md">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg sm:text-xl font-editorial text-[#dfb56c] drop-shadow">
                {subtitle}
              </p>
            )}

            <p className="text-sm sm:text-base text-[#d5cfc4] max-w-3xl leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="p-3.5 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                Duration
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfb56c]" />
                <strong className="text-sm sm:text-base font-bold text-[#f7f3eb]">
                  {course.duration || '6 Months'}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                Physical Fee
              </span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#dfb56c]" />
                <strong className="text-sm sm:text-base font-mono font-bold text-[#f7e2a9]">
                  Rs. {Number(course.physicalFee || 3500).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                Zoom Monthly
              </span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#dfb56c]" />
                <strong className="text-sm sm:text-base font-mono font-bold text-[#f7e2a9]">
                  Rs. {Number(course.zoomFee || 2000).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-mono uppercase text-[#a89f91] block mb-1">
                Studio Locations
              </span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#dfb56c]" />
                <strong className="text-xs sm:text-sm font-bold text-[#f7f3eb] truncate">
                  {(course.locations || ['Kegalle', 'Kurunegala', 'Piliyandala']).join(', ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRegisterClick}
              className="px-6 py-3 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSinhala ? 'පාඨමාලාවට ලියාපදිංචි වන්න' : 'Enroll in this Program'}</span>
            </button>

            <a
              href={`https://wa.me/94777595560?text=Hello%20Ceylon%20Style%20Studio!%20I%20would%20like%20course%20inquiry%20for%20${encodeURIComponent(course.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#1e1316] hover:bg-[#2b1b1f] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-semibold rounded flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>{isSinhala ? 'වට්ස්ඇප් උපදේශනය' : 'WhatsApp Consultation'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Sections Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        {/* 1. ABOUT THIS COURSE SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
              {isSinhala ? 'පාඨමාලාව පිළිබඳ හැඳින්වීම' : 'ABOUT THIS COURSE'}
            </h2>
          </div>

          <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#f7f3eb]">
            {isSinhala ? 'වෘත්තීය ප්‍රමිතියෙන් යුතු හැදෑරීම' : 'Couture Engineering & Pattern Innovation'}
          </h3>

          <div className="p-6 rounded-sm bg-[#120d0f] border border-[#c99a45]/30 space-y-4 shadow-xl">
            <div className="text-sm leading-relaxed text-[#d5cfc4] whitespace-pre-line space-y-3">
              {aboutText}
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC ADMIN CONFIGURABLE SECTIONS */}
        {course.sections && course.sections.filter((s) => s.isVisible !== false).length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                {isSinhala ? 'විෂය මාලා විස්තරාත්මක අංශ' : 'CURRICULUM HIGHLIGHTS & ATELIER METHODOLOGY'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.sections
                .filter((s) => s.isVisible !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    className="p-5 rounded-sm bg-[#141011] border border-white/10 space-y-2.5 hover:border-[#dfb56c]/50 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-[10px] font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                        {(isSinhala && sec.titleSinhala) ? sec.titleSinhala : sec.title}
                      </h4>
                    </div>

                    <p className="text-xs text-[#a89f91] leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* 3. YOUTUBE VIDEO SHOWCASE & LESSON PLAYER */}
        {course.videos && course.videos.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
                  <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                    {isSinhala ? 'වීඩියෝ පාඩම් හා මාස්ටර්ක්ලාස්' : 'YOUTUBE MASTERCLASSES & LESSON PLAYLIST'}
                  </h2>
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#f7f3eb] mt-1">
                  {selectedVideo ? selectedVideo.title : 'Course Video Showcase'}
                </h3>
              </div>

              <span className="text-xs font-mono text-[#a89f91]">
                {course.videos.length} Video Lessons
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Responsive Video Player (16:9, Privacy-enhanced embed, no autoplay audio) */}
              <div className="lg:col-span-8 bg-[#0c090a] border border-[#dfb56c]/40 rounded overflow-hidden shadow-2xl">
                <div className="relative aspect-video w-full bg-black">
                  {activeVideoId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                      title={selectedVideo?.title || 'Course Masterclass'}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#a89f91]">
                      <Video className="w-12 h-12 text-[#dfb56c] mb-2 opacity-60" />
                      <span className="text-xs font-mono">Select a masterclass video from the playlist</span>
                    </div>
                  )}
                </div>

                {selectedVideo?.description && (
                  <div className="p-4 bg-[#141011] border-t border-white/10 text-xs text-[#d5cfc4] leading-relaxed">
                    {selectedVideo.description}
                  </div>
                )}
              </div>

              {/* Playlist List */}
              <div className="lg:col-span-4 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {course.videos.map((vid, vIdx) => {
                  const isCur = selectedVideo?.id === vid.id || (!selectedVideo && vIdx === 0);
                  const vidId = vid.videoId || parseYouTubeId(vid.youtubeUrl);
                  return (
                    <button
                      key={vid.id || vIdx}
                      onClick={() => setSelectedVideo(vid)}
                      className={`w-full text-left p-3 rounded border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                        isCur
                          ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] shadow-lg'
                          : 'bg-[#141011] border-white/10 text-[#a89f91] hover:text-[#f7f3eb] hover:bg-[#1c1214]'
                      }`}
                    >
                      <div className="w-16 h-10 rounded bg-black shrink-0 overflow-hidden relative border border-white/10 flex items-center justify-center">
                        {vidId ? (
                          <img
                            src={`https://img.youtube.com/vi/${vidId}/mqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Play className="w-4 h-4 text-[#dfb56c]" />
                        )}
                        <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-[#dfb56c] block">
                          Part {vIdx + 1}
                        </span>
                        <h5 className="font-bold truncate text-[#f7f3eb]">
                          {vid.title}
                        </h5>
                        {vid.description && (
                          <p className="text-[11px] opacity-70 truncate mt-0.5">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 4. PDF STUDY GUIDES & DOWNLOADABLE RESOURCES */}
        {course.pdfResources && course.pdfResources.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                {isSinhala ? 'බාගත හැකි PDF අධ්‍යයන සටහන්' : 'DOWNLOADABLE PDF BLUEPRINTS & HANDOUTS'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {course.pdfResources.map((pdf, pIdx) => (
                <div
                  key={pdf.id || pIdx}
                  className="p-4 rounded-sm bg-[#120d0f] border border-white/10 space-y-3 flex flex-col justify-between hover:border-[#dfb56c] transition-all shadow-md group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded bg-[#540d18] border border-[#dfb56c]/40 flex items-center justify-center text-[#dfb56c]">
                        <FileText className="w-4 h-4" />
                      </div>
                      {pdf.fileSize && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#a89f91]">
                          {pdf.fileSize}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[#f7f3eb] group-hover:text-[#dfb56c] transition-colors line-clamp-2">
                      {pdf.title}
                    </h4>

                    {pdf.description && (
                      <p className="text-xs text-[#a89f91] line-clamp-2">
                        {pdf.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={pdf.fileUrl || '#'}
                    download={pdf.title || 'course-guide.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!pdf.fileUrl) {
                        e.preventDefault();
                        showToast('Document file is being prepared by the atelier registrar.');
                      }
                    }}
                    className="w-full py-2 bg-[#1c1214] hover:bg-[#251518] border border-[#dfb56c]/40 text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>Download Handout</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. MEASURABLE LEARNING OUTCOMES */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                {isSinhala ? 'පාඨමාලාවෙන් ඔබ ලබන ප්‍රවීණතාව' : 'MEASURABLE LEARNING OUTCOMES'}
              </h2>
            </div>

            <div className="p-6 rounded-sm bg-[#120d0f] border border-[#dfb56c]/30 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#f7f3eb] leading-relaxed">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. STUDENT VIDEO REVIEWS & TESTIMONIALS */}
        {(courseReviews.length > 0 || (course.testimonials && course.testimonials.length > 0)) && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                {isSinhala ? 'ශිෂ්‍ය ප්‍රතිචාර හා අත්දැකීම්' : 'STUDENT REVIEWS & GRADUATE SUCCESS'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Show from studentReviews collection or course testimonials */}
              {courseReviews.map((rev) => {
                const vidId = rev.videoId || parseYouTubeId(rev.youtubeUrl);
                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-sm bg-[#141011] border border-white/10 space-y-3 flex flex-col justify-between shadow-md"
                  >
                    <div>
                      {vidId && (
                        <div className="relative aspect-video rounded overflow-hidden bg-black border border-white/10 mb-3">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${vidId}?rel=0`}
                            title={rev.studentName}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.avatarUrl}
                            alt={rev.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-[#dfb56c]"
                          />
                          <div>
                            <strong className="text-xs text-[#f7e2a9] block">
                              {rev.studentName}
                            </strong>
                            <span className="text-[10px] text-[#a89f91] font-mono block">
                              {rev.studentBatch}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#d5cfc4] italic line-clamp-3">
                        "{rev.writtenFeedback}"
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Course-level testimonials if any */}
              {course.testimonials?.map((t, tIdx) => (
                <div
                  key={t.id || tIdx}
                  className="p-4 rounded-sm bg-[#141011] border border-white/10 space-y-3 flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-xs text-[#f7e2a9]">
                        {t.studentName}
                      </strong>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#d5cfc4] italic">
                      "{t.feedback}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. LEAD INSTRUCTOR ATELIER PROFILE */}
        <section className="p-6 sm:p-8 rounded-sm bg-[#120d0f] border border-[#dfb56c]/30 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#dfb56c] shrink-0 shadow-xl bg-black">
            <img
              src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={course.instructorName || 'Master Faculty'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
              Lead Atelier Master Instructor
            </span>
            <h4 className="text-xl font-editorial font-bold text-[#f7f3eb]">
              {course.instructorName || 'Madame Celine & Master Atelier Team'}
            </h4>
            <span className="text-xs font-mono text-[#a89f91] block">
              {course.instructorTitle || 'Head of Haute Couture Pattern Engineering'}
            </span>
            <p className="text-xs text-[#d5cfc4] leading-relaxed max-w-2xl">
              {course.instructorBio ||
                'Pioneered Sri Lanka’s first European-calibrated sloper drafting pedagogy, guiding over 1,200 designers from foundational dart manipulation to commercial luxury runway collections.'}
            </p>
          </div>
        </section>

        {/* 8. FINAL ENROLLMENT CTA BAR */}
        <section className="p-8 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#540d18] to-[#1c1214] border-2 border-[#dfb56c] text-center space-y-4 shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
            Admissions Open • 2026 Batch Intake
          </span>

          <h3 className="text-2xl sm:text-4xl font-editorial font-bold text-[#f7f3eb]">
            {isSinhala ? 'අදම ඔබගේ ආසනය වෙන්කරවා ගන්න' : `Begin Your Mastery with ${course.title}`}
          </h3>

          <p className="text-xs sm:text-sm text-[#f7e2a9]/90 max-w-xl mx-auto leading-relaxed">
            {isSinhala
              ? 'මාසික ගාස්තු ගෙවීමේ පහසුකම් සහිතව භෞතික හෝ සජීවී Zoom පන්ති සඳහා දැන් ලියාපදිංචි විය හැක.'
              : 'Flexible monthly installments, free technical spec sheets, and full access to our private recorded masterclasses.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSinhala ? 'දැන් ලියාපදිංචි වන්න' : 'Register Now for this Course'}</span>
            </button>

            <a
              href={`https://wa.me/94777595560?text=Hello%20Ceylon%20Style%20Studio!%20I%20am%20ready%20to%20register%20for:%20${encodeURIComponent(course.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0c090a] border border-[#dfb56c]/60 text-[#f7e2a9] text-xs font-semibold rounded flex items-center justify-center gap-2 hover:bg-[#1a0f12] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>{isSinhala ? 'වට්ස්ඇප් උපදේශක සහාය' : 'WhatsApp Counselor Support'}</span>
            </a>
          </div>
        </section>
      </div>

      {/* Custom Form Modal if visitor registers and a custom form is attached */}
      {attachedForm && (
        <CourseCustomFormModal
          isOpen={customFormOpen}
          onClose={() => setCustomFormOpen(false)}
          form={attachedForm}
          course={course}
          onOpenStandardRegistration={() => {
            if (onOpenRegisterWithCourse) onOpenRegisterWithCourse(course.slug);
          }}
        />
      )}
    </div>
  );
}
