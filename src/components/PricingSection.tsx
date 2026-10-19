import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Building,
  Video,
  ArrowRight,
  ShieldCheck,
  Play,
  X,
  Award,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { parseYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../lib/mediaUtils';

interface PricingSectionProps {
  onOpenSyllabus?: (courseId?: string) => void;
  onOpenCoursePage?: (courseSlug: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenSyllabus, onOpenCoursePage }) => {
  const { siteSettings, courses } = useData();
  const { isSinhalaMode } = useLanguage();

  const publishedCourses = courses.filter((c) => c.isPublished !== false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    publishedCourses[0]?.id || 'course-01'
  );
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const activeCourse =
    publishedCourses.find((c) => c.id === selectedCourseId) || publishedCourses[0];

  const currentPhysicalFee = activeCourse?.physicalFee ?? siteSettings.physicalFee;
  const currentZoomFee = activeCourse?.zoomFee ?? siteSettings.zoomFee;
  const currentRegistrationFee =
    activeCourse?.registrationFee ?? siteSettings.registrationFee ?? 1000;
  const currentDuration =
    activeCourse?.duration || siteSettings.courseDuration || '6-MONTH PROFESSIONAL PROGRAM';

  const physicalFeatures = [
    { en: 'Direct in-person atelier practical sessions', si: 'සජීවී පන්ති කාමරයේ ප්‍රායෝගික පුහුණුව' },
    { en: 'Hands-on French mannequin draping & cutting tables', si: 'මැනකින් (Mannequin) සහ කටින් මේස මත ප්‍රායෝගික පුහුණුව' },
    { en: 'Studio equipment & sewing machine access', si: 'මැහුම් උපකරණ සහ මැෂින් භාවිත කිරීමේ පහසුකම්' },
    { en: 'Personal 1-on-1 instructor corrections & pattern grading', si: 'ගුරුවරුන්ගෙන් පෞද්ගලිකවම ලැබෙන මගපෙන්වීම' },
    { en: 'Kegalle, Kurunegala or Piliyandala studio locations', si: 'කෑගල්ල, කුරුණෑගල හෝ පිළියන්දල ශාඛාවන්හි පැවැත්වේ' },
    { en: 'AI fashion tech & Midjourney masterclasses included', si: 'AI තාක්ෂණය සහ Midjourney පුහුණුව සම්පූර්ණයෙන්ම ඇතුළත් වේ' },
    { en: 'Full Digital Marketing & Brand Building curriculum', si: 'ඩිජිටල් අලෙවිකරණය සහ Branding විෂය මාලාව' },
    { en: 'Official Accredited Physical Diploma Certificate', si: 'පිළිගත් වෘත්තීය ඩිප්ලෝමා සහතිකය' },
    { en: 'Fashion Show & studio capsule showcase opportunity', si: 'Fashion Show සහ Capsule Collection ප්‍රදර්ශන අවස්ථා' },
  ];

  const zoomFeatures = [
    { en: 'Live interactive high-definition Zoom masterclasses', si: 'සජීවී HD Zoom පන්ති සහ සාකච්ඡා' },
    { en: 'Full recorded video access for lifetime revision', si: 'ඕනෑම වේලාවක නැවත නැරඹිය හැකි පටිගත කළ වීඩියෝ (Recordings)' },
    { en: 'Digital step-by-step PDF measurement & pattern guides', si: 'පැහැදිලි PDF සටහන් සහ පැටර්න් රූපසටහන්' },
    { en: 'Weekly live Q&A & individual design assignment feedback', si: 'සතිපතා පැවරුම් පරීක්ෂා කර අඩුපාඩු නිවැරදි කිරීම' },
    { en: 'Learn from anywhere in Sri Lanka or overseas', si: 'ලංකාවේ හෝ විදේශයක සිට වුවද පහසුවෙන්ම සම්බන්ධ විය හැක' },
    { en: 'Complete AI fashion prompt engineering & render lessons', si: 'AI Fashion & Lookbook සැකසීමේ සියලුම රහස්' },
    { en: 'Full Social Media & Digital ad boosting training', si: 'සමාජ මාධ්‍ය දැන්වීම් හා ඔන්ලයින් විකුණුම් පුහුණුව' },
    { en: 'Official Accredited Digital Diploma Certificate', si: 'පිළිගත් ඩිජිටල් ඩිප්ලෝමා සහතිකය' },
    { en: 'Dedicated WhatsApp student community support group', si: 'සුවිශේෂී WhatsApp ශිෂ්‍ය සහය කණ්ඩායම' },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#540d18]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#c99a45]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#540d18]/50 border border-[#dfb56c]/40 text-[#dfb56c] text-[11px] font-mono uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSinhalaMode ? 'පාඨමාලා පැකේජ සහ ආයෝජනය' : 'Investment & Course Packages'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'පාඨමාලා පැකේජ සහ ගාස්තු' : 'COURSE PACKAGES & TUITION FEES'}
          </h2>

          <p className="mt-3 text-sm text-[#b8afa2] font-sinhala font-bold">
            {isSinhalaMode
              ? (activeCourse?.titleSinhala || activeCourse?.title || 'මාස 6ක වෘත්තීය පාඨමාලාව')
              : (activeCourse?.title || currentDuration)}
          </p>

          <p className="mt-1 text-xs text-[#dfb56c] font-sinhala">
            {isSinhalaMode
              ? 'මාසිකව පහසු වාරික වශයෙන් ගෙවිය හැක. එකවර විශාල මුදලක් අවශ්‍ය නොවේ.'
              : (siteSettings.discountNote || 'Easy monthly installment plan. No bulk upfront payment required.')}
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* =========================================================================
            FEATURED ATTRACTIVE COURSE PACKAGES GRID (Managed from Backend)
            Displays background images, custom text color, accent borders, and promos!
           ========================================================================= */}
        {publishedCourses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                  {isSinhalaMode ? 'විශේෂ පාඨමාලා වැඩසටහන්' : 'Available Programs & Packages'}
                </span>
                <span className="text-[11px] text-[#a89f91]">
                  {isSinhalaMode
                    ? 'ඔබට ගැලපෙන පැකේජය තෝරා පහසුවෙන්ම ලියාපදිංචි වන්න'
                    : 'Choose your desired diploma curriculum with flexible Physical or Zoom options.'}
                </span>
              </div>
              <span className="text-xs font-mono text-[#a89f91]">
                {publishedCourses.length} {publishedCourses.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCourses.map((c) => {
                const isSelected = activeCourse?.id === c.id;
                const cardAccent = c.accentColor || '#dfb56c';
                const cardTextColor = c.textColor || '#f7f3eb';
                const hasCustomBg = !!c.cardBgImageUrl;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`relative rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500 cursor-pointer group shadow-2xl ${
                      isSelected
                        ? 'ring-2 scale-[1.02] -translate-y-1'
                        : 'border border-white/10 hover:border-white/30 hover:scale-[1.01]'
                    }`}
                    style={{
                      borderColor: isSelected ? cardAccent : undefined,
                      boxShadow: isSelected ? `0 0 25px ${cardAccent}40` : undefined,
                      backgroundColor: '#141011',
                    }}
                  >
                    {/* Background Image Layer with custom opacity */}
                    {hasCustomBg && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${c.cardBgImageUrl})` }}
                        />
                        <div
                          className="absolute inset-0 bg-black pointer-events-none"
                          style={{ opacity: (c.cardOverlayOpacity ?? 80) / 100 }}
                        />
                      </>
                    )}

                    {/* Gradient overlay for text protection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                    {/* Card Content */}
                    <div className="relative z-10 p-6 flex flex-col h-full justify-between space-y-4">
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold tracking-wider"
                            style={{
                              backgroundColor: `${cardAccent}25`,
                              color: cardAccent,
                              border: `1px solid ${cardAccent}50`,
                            }}
                          >
                            {c.category || 'Diploma Master Program'}
                          </span>

                          {c.badge && (
                            <span
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm"
                              style={{ color: cardAccent, border: `1px solid ${cardAccent}40` }}
                            >
                              ★ {c.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className="text-lg font-editorial font-bold drop-shadow-md tracking-wide"
                          style={{ color: cardTextColor }}
                        >
                          {isSinhalaMode && c.titleSinhala ? c.titleSinhala : c.title}
                        </h3>

                        {/* Sinhala Subtitle if bilingual */}
                        {isSinhalaMode && c.titleSinhala && c.titleSinhala !== c.title && (
                          <span className="text-[11px] font-mono text-[#a89f91] block mt-0.5">
                            {c.title}
                          </span>
                        )}

                        {/* Description */}
                        <p className="text-xs mt-2 line-clamp-2 opacity-85 leading-relaxed" style={{ color: cardTextColor }}>
                          {isSinhalaMode && c.descriptionSinhala ? c.descriptionSinhala : c.description}
                        </p>

                        {/* Intake & Schedule pills */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                          <span className="flex items-center gap-1 opacity-80" style={{ color: cardTextColor }}>
                            <Clock className="w-3 h-3 text-[#dfb56c]" />
                            {c.duration}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="opacity-80" style={{ color: cardTextColor }}>
                            {c.schedule || 'Physical & Zoom'}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Tier Box & Actions */}
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                          <div>
                            <span className="text-[9px] uppercase font-mono text-[#a89f91] block">
                              Physical Studio
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] text-[#dfb56c] font-mono">Rs.</span>
                              <strong className="text-base font-editorial font-bold text-[#f7e2a9]">
                                {c.physicalFee.toLocaleString()}
                              </strong>
                              <span className="text-[9px] text-[#a89f91]">/mo</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase font-mono text-[#a89f91] block">
                              Online Zoom HD
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] text-[#dfb56c] font-mono">Rs.</span>
                              <strong className="text-base font-editorial font-bold text-[#f7e2a9]">
                                {c.zoomFee.toLocaleString()}
                              </strong>
                              <span className="text-[9px] text-[#a89f91]">/mo</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Watch Promo & Select */}
                        <div className="flex items-center gap-2">
                          {c.promoVideoUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoModal(c.promoVideoUrl || null);
                              }}
                              className="px-3 py-2 rounded-sm bg-black/60 hover:bg-[#540d18] border border-[#dfb56c]/40 text-[#f7e2a9] text-xs flex items-center gap-1.5 transition-colors font-mono"
                              title="Watch Program Trailer"
                            >
                              <Play className="w-3.5 h-3.5 text-[#dfb56c] fill-[#dfb56c]" />
                              <span>Trailer</span>
                            </button>
                          )}

                          {onOpenSyllabus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenSyllabus(c.id);
                              }}
                              className="px-2.5 py-2 rounded-sm bg-black/60 hover:bg-[#540d18] border border-[#dfb56c]/40 text-[#f7e2a9] text-xs flex items-center gap-1 transition-colors font-mono cursor-pointer"
                              title={isSinhalaMode ? 'පාඨමාලා විෂය නිර්දේශය (Syllabus)' : 'View Course Syllabus'}
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Syllabus</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenCoursePage) {
                                onOpenCoursePage(c.slug);
                              } else {
                                window.location.hash = `course/${c.slug}`;
                              }
                            }}
                            className="px-2.5 py-2 rounded-sm bg-black/60 hover:bg-[#540d18] border border-[#dfb56c]/40 text-[#dfb56c] hover:text-[#f7e2a9] text-xs flex items-center gap-1 transition-colors font-mono cursor-pointer"
                            title={isSinhalaMode ? 'පාඨමාලා සවිස්තර පිටුව' : 'View Full Course Page'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Course Page</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourseId(c.id);
                              const el = document.getElementById('enroll-tiers');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all shadow-md ${
                              isSelected
                                ? 'btn-3d-gold text-black'
                                : 'btn-3d-secondary text-[#f7e2a9]'
                            }`}
                          >
                            <span>{isSelected ? '✓ Active Package' : 'Select Package'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Anchor for Smooth Jump */}
        <div id="enroll-tiers" className="pt-4 mb-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dfb56c]">
            {isSinhalaMode ? 'තෝරාගත් පාඨමාලාවේ පන්ති ක්‍රමවේද' : 'Selected Curriculum Class Options'}
          </span>
          <h3 className="text-lg font-editorial font-bold text-[#f7f3eb] mt-1">
            {activeCourse?.title}
          </h3>
          {onOpenSyllabus && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => onOpenSyllabus(activeCourse?.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1c1214] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs hover:bg-[#540d18] transition-all cursor-pointer shadow-md"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span className="font-sinhala font-bold">
                  {isSinhalaMode ? 'පාඨමාලා විෂය නිර්දේශය (Course Syllabus)' : 'View Full Course Syllabus'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Two Tier Cards: Physical vs Zoom for Selected Package */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* PHYSICAL CLASS (Featured Luxury Card) */}
          <div
            className="relative p-8 sm:p-10 rounded-sm border-2 shadow-2xl flex flex-col justify-between group overflow-hidden"
            style={{
              borderColor: activeCourse?.accentColor || '#dfb56c',
              backgroundColor: '#1c1316',
            }}
          >
            {/* Background texture if active course has background */}
            {activeCourse?.cardBgImageUrl && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20"
                  style={{ backgroundImage: `url(${activeCourse.cardBgImageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1316]/90 via-[#1c1316]/95 to-[#120d0f] pointer-events-none" />
              </>
            )}

            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-black text-[10px] font-bold uppercase tracking-widest shadow-md z-10">
              {isSinhalaMode ? 'වඩාත් ජනප්‍රිය • සජීවී පන්ති කාමර පුහුණුව' : (activeCourse?.badge || 'Most Popular • In-Studio Practical')}
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-sm bg-[#540d18] border border-[#dfb56c]/40 flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#dfb56c]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#f7f3eb] luxury-heading-anim">
                    {isSinhalaMode ? 'භෞතික පන්ති (PHYSICAL CLASS)' : 'PHYSICAL CLASS'}
                  </h3>
                  <span className="text-[11px] text-[#dfb56c] uppercase font-mono tracking-wider">
                    {isSinhalaMode ? 'කෑගල්ල • කුරුණෑගල • පිළියන්දල' : (activeCourse?.schedule || 'Studio Atelier • Hands-On')}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="my-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-[#dfb56c] font-semibold">{siteSettings.currency || 'Rs.'}</span>
                  <span className="text-4xl sm:text-5xl font-bold font-editorial text-[#f7e2a9]">
                    {currentPhysicalFee.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#a89f91] uppercase tracking-wider font-mono">
                    {isSinhalaMode ? '/ මසකට' : '/ Month'}
                  </span>
                </div>
                <span className="text-[11px] text-[#a89f91] block mt-1 font-sinhala">
                  {isSinhalaMode
                    ? `ලියාපදිංචි ගාස්තුව: රු. ${currentRegistrationFee.toLocaleString()} | කාලසීමාව: ${currentDuration}`
                    : `Registration: Rs. ${currentRegistrationFee.toLocaleString()} • Duration: ${currentDuration}`}
                </span>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8">
                {physicalFeatures.map((f) => (
                  <div key={f.en} className="flex items-start gap-2.5 text-xs text-[#d5cfc4]">
                    <Check className="w-4 h-4 text-[#dfb56c] shrink-0 mt-0.5" />
                    <span className="font-sinhala">{isSinhalaMode ? f.si : f.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#register"
              className="btn-3d-gold w-full py-3.5 text-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 relative z-10"
            >
              <span>{isSinhalaMode ? 'භෞතික පන්තියට ලියාපදිංචි වන්න' : 'Enroll Physical Class'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ZOOM CLASS */}
          <div className="relative p-8 sm:p-10 rounded-sm bg-[#141011] border border-[#c99a45]/30 hover:border-[#dfb56c]/70 transition-all shadow-xl flex flex-col justify-between group overflow-hidden">
            {activeCourse?.cardBgImageUrl && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-15"
                  style={{ backgroundImage: `url(${activeCourse.cardBgImageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#141011]/90 via-[#141011]/95 to-[#0e0a0b] pointer-events-none" />
              </>
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-sm bg-[#241317] border border-[#c99a45]/30 flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#dfb56c]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#f7f3eb] luxury-heading-anim">
                    {isSinhalaMode ? 'ඔන්ලයින් පන්ති (ZOOM CLASS)' : 'ZOOM CLASS'}
                  </h3>
                  <span className="text-[11px] text-[#a89f91] uppercase font-mono tracking-wider">
                    {isSinhalaMode ? 'සජීවී සහ පටිගත කළ වීඩියෝ' : 'Online Live & Recorded'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="my-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-[#dfb56c] font-semibold">{siteSettings.currency || 'Rs.'}</span>
                  <span className="text-4xl sm:text-5xl font-bold font-editorial text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors">
                    {currentZoomFee.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#a89f91] uppercase tracking-wider font-mono">
                    {isSinhalaMode ? '/ මසකට' : '/ Month'}
                  </span>
                </div>
                <span className="text-[11px] text-[#a89f91] block mt-1 font-sinhala">
                  {isSinhalaMode
                    ? `ලියාපදිංචි ගාස්තුව: රු. ${currentRegistrationFee.toLocaleString()} | සජීවී සහ පටිගත කළ වීඩියෝ`
                    : `Registration: Rs. ${currentRegistrationFee.toLocaleString()} • Island-wide & Overseas Online Access`}
                </span>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8">
                {zoomFeatures.map((f) => (
                  <div key={f.en} className="flex items-start gap-2.5 text-xs text-[#d5cfc4]">
                    <Check className="w-4 h-4 text-[#dfb56c] shrink-0 mt-0.5" />
                    <span className="font-sinhala">{isSinhalaMode ? f.si : f.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#register"
              className="btn-3d-burgundy w-full py-3.5 text-[#f7e2a9] text-xs uppercase tracking-widest flex items-center justify-center gap-2 relative z-10"
            >
              <span>{isSinhalaMode ? 'Zoom පන්තියට ලියාපදිංචි වන්න' : 'Enroll Online Zoom Class'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Security & Guarantee note */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-[#a89f91] font-sinhala">
          <ShieldCheck className="w-4 h-4 text-[#dfb56c]" />
          <span>
            {isSinhalaMode
              ? 'මාසිකව වාරික වශයෙන් ගෙවීමේ හැකියාව • විනිවිදභාවය සහිත විෂය මාලාව • විශ්වාසනීය පුහුණුව'
              : 'Pay monthly as you progress • Flexible payments • Transparent academy curriculum'}
          </span>
        </div>
      </div>

      {/* Interactive YouTube Promo Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-sm border-2 border-[#dfb56c] overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#540d18] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={getYouTubeEmbedUrl(activeVideoModal, { autoplay: true })}
                title="Course Trailer"
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
