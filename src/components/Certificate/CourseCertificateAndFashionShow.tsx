import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  Users,
  Trophy,
  Star,
  ExternalLink,
  Crown,
  ChevronRight,
  Maximize2,
  X,
  FileCheck2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';

export const CourseCertificateAndFashionShow: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const { siteSettings } = useData();

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isFashionModalOpen, setIsFashionModalOpen] = useState(false);

  // Dynamic Certificate Settings from Backend (with robust couture fallbacks)
  const certImageUrl =
    (siteSettings.courseCertificateImageUrl && siteSettings.courseCertificateImageUrl.trim()) ||
    'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=85';
  const certTitle = isSinhalaMode
    ? siteSettings.courseCertificateTitleSinhala || 'පාඨමාලාවෙන් පසු පිරිනැමෙන වටිනා නිල ඩිප්ලෝමා සහතිකය'
    : siteSettings.courseCertificateTitle || 'Accredited Professional Fashion & Branding Diploma';
  const certSubtitle = isSinhalaMode
    ? siteSettings.courseCertificateSubtitleSinhala || 'ශ්‍රී ලංකා රජයේ ලියාපදිංචි • ක්ෂේත්‍රයේ ඉහළම පිළිගැනීම • ජාත්‍යන්තර ප්‍රතීතනය'
    : siteSettings.courseCertificateSubtitle || 'Government Registered • Industry Recognized • Internationally Accredited';
  const certDescription = isSinhalaMode
    ? siteSettings.courseCertificateDescriptionSinhala ||
      'මාස 6ක පූර්ණ විලාසිතා නිර්මාණකරණ හා සන්නාමකරණ ඩිප්ලෝමා පාඨමාලාව සාර්ථකව අවසන් කරන සෑම සිසුවෙකුටම, රජයේ ලියාපදිංචි අංකය, QR සත්‍යාපන කේතය සහ අධ්‍යක්ෂ මණ්ඩල නිල මුද්‍රාව සහිත මෙම වටිනා වෘත්තීය ඩිප්ලෝමා සහතිකය පිරිනැමේ. මෙය දේශීය හා විදේශීය රැකියා, උසස් අධ්‍යාපන අවස්ථා සහ පුද්ගලික විලාසිතා ව්‍යාපාර සඳහා ඉහළින්ම පිළිගැනේ.'
    : siteSettings.courseCertificateDescription ||
      'Upon successful graduation from the 6-month master curriculum, each graduate is awarded an official accredited Professional Diploma from Ceylon Style Studio, complete with secure QR credential verification, government registered accreditation, and gold embossed seal.';
  const certBadges = siteSettings.courseCertificateBadges || [
    'Official Accredited Diploma',
    'Global QR Verification',
    'Government Registered',
    'Gold Wax Embossed Seal',
  ];

  // Dynamic Fashion Show Settings from Backend (with robust runway fallbacks)
  const fashionShowImageUrl =
    (siteSettings.fashionShowImageUrl && siteSettings.fashionShowImageUrl.trim()) ||
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';
  const fashionShowTitle = isSinhalaMode
    ? siteSettings.fashionShowTitleSinhala || 'පාඨමාලාව අවසානයේ පැවැත්වෙන දැවැන්ත විලාසිතා දැක්ම (Runway Fashion Show)'
    : siteSettings.fashionShowTitle || 'Grand Graduate Runway Gala & Fashion Show';
  const fashionShowSubtitle = isSinhalaMode
    ? siteSettings.fashionShowSubtitleSinhala || 'ඔබේම විලාසිතා එකතුව ප්‍රවීණ මෝස්තර නිරූපිකාවන් සමග නිල Runway එක මත එළිදැක්වීම'
    : siteSettings.fashionShowSubtitle || 'Launch Your Signature Collection On The Official Haute Couture Runway';
  const fashionShowDescription = isSinhalaMode
    ? siteSettings.fashionShowDescriptionSinhala ||
      'පාඨමාලාව සාර්ථකව නිම කරන සෑම සිසුවෙකුටම, තමන් විසින්ම සැලසුම් කර නිමවන ලද අංගසම්පූර්ණ විලාසිතා එකතුව (Signature Collection) ක්ෂේත්‍රයේ ප්‍රවීණ නිරූපණ ශිල්පීන් (Top Runway Models) සමගින්, ප්‍රධාන පෙළේ මාධ්‍ය නාලිකා, විලාසිතා ක්ෂේත්‍රයේ ප්‍රවීණයන් සහ ප්‍රමුඛ පෙළේ ගැනුම්කරුවන් ඉදිරියේ පැවැත්වෙන දැවැන්ත වාර්ෂික විලාසිතා දැක්මෙහි (Annual Runway Show) ප්‍රදර්ශනය කිරීමේ සුවිශේෂී වරප්‍රසාදය හිමිවේ.'
    : siteSettings.fashionShowDescription ||
      'The ultimate pinnacle of your fashion journey! Every graduating designer unveils their signature capsule collection on the grand runway with professional models, hair & makeup teams, high-profile media coverage, and live boutique buyers seeking fresh Sri Lankan fashion talent.';
  const fashionShowDateVenue = isSinhalaMode
    ? siteSettings.fashionShowDateVenueSinhala || 'වාර්ෂික විලාසිතා දැක්ම • ග්‍රෑන්ඩ් බෝල්රූම්, කොළඹ'
    : siteSettings.fashionShowDateVenue || 'Annual Runway Gala • Grand Ballroom, Colombo';
  const fashionShowPerks = siteSettings.fashionShowPerks || [
    'Professional Models & Runway Stage',
    'High-Definition Portfolio Media Shoots',
    'Direct Buyer & Boutique Networking',
    'Best Designer of the Year Award',
  ];

  return (
    <section id="certificate" data-bg="dark" className="relative py-14 sm:py-20 text-[#f7f3eb] overflow-hidden">
      {/* Background Lighting Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0708] via-[#100b0d] to-[#0a0708] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#dfb56c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* ================================================================= */}
        {/* PART 1: RECOGNIZED ACCREDITED CERTIFICATE SHOWCASE */}
        {/* ================================================================= */}
        <div>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-lg shadow-[#c99a45]/10">
              <Award className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{isSinhalaMode ? 'නිල ඩිප්ලෝමා සහතිකය' : 'OFFICIAL DIPLOMA CERTIFICATION'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold gold-gradient-text tracking-tight mb-4">
              {certTitle}
            </h2>

            <p className="text-xs sm:text-sm font-mono text-[#dfb56c] uppercase tracking-wider mb-3">
              {certSubtitle}
            </p>

            <p className="text-sm sm:text-base text-[#d5cfc4] font-sinhala leading-relaxed">
              {certDescription}
            </p>
          </div>

          {/* Certificate Showcase Card */}
          <div className="bg-[#120a0d] border-2 border-[#dfb56c]/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Column: Official Certificate High-Resolution Image Presentation */}
              <div className="lg:col-span-7 relative group">
                <div className="relative rounded-xl overflow-hidden border-2 border-[#dfb56c]/40 shadow-2xl bg-[#0c090a] group-hover:border-[#dfb56c] transition-all">
                  <img
                    src={certImageUrl}
                    alt={certTitle}
                    className="w-full h-auto max-h-[460px] object-contain sm:object-cover mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Gold Overlay Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Zoom Fullscreen Button */}
                  <button
                    onClick={() => setIsCertModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-black/80 hover:bg-[#dfb56c] text-white hover:text-black p-2.5 rounded-full border border-[#dfb56c]/40 transition-all shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isSinhalaMode ? 'සම්පූර්ණ පින්තූරය' : 'View Full Image'}
                    </span>
                  </button>

                  {/* Certified Stamp Badge */}
                  <div className="absolute top-4 left-4 bg-[#181113]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#dfb56c]/40 flex items-center gap-2 text-[11px] font-mono text-[#f7e2a9]">
                    <ShieldCheck className="w-4 h-4 text-[#dfb56c]" />
                    <span>VERIFIED ATELIER ACCREDITATION</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Prestigious Certificate Credentials & Trust Badges */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#38070e] text-[#f7e2a9] border border-[#dfb56c]/40 text-xs font-mono font-bold">
                    <Crown className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>{isSinhalaMode ? 'ප්‍රතීතන විශේෂාංග' : 'CREDENTIAL HIGHLIGHTS'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#f7f3eb]">
                    {isSinhalaMode
                      ? 'දේශීය හා විදේශීයව ඉහළින්ම පිළිගැනෙන වෘත්තීය ඩිප්ලෝමාව'
                      : 'Internationally Endorsed Career Qualification'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a89f91] font-sinhala leading-relaxed">
                    {isSinhalaMode
                      ? 'මෙම සහතිකය මගින් ඔබ උසස් මට්ටමේ ඇඳුම් පැටර්න් සැකසීම, මැහුම් නිර්මාණශීලීත්වය, AI තාක්ෂණය සහ සන්නාමකරණ විෂයයන් සාර්ථකව ප්‍රගුණ කළ බව නිල වශයෙන් තහවුරු කරයි.'
                      : 'Officially verifies technical mastery in pattern engineering, advanced couture construction, digital fashion design, and luxury fashion brand establishment.'}
                  </p>
                </div>

                {/* 4 Trust Badges List */}
                <div className="space-y-3">
                  {[
                    {
                      titleSi: 'රජයේ ලියාපදිංචි සහතිකය',
                      titleEn: 'Government Registered Certification',
                      descSi: 'ශ්‍රී ලංකා ප්‍රමිතීන්ට සහ කාර්මික සම්මතයන්ට අනුකූලව නිකුත් කෙරේ.',
                      descEn: 'Issued under strict professional fashion curriculum standards.',
                    },
                    {
                      titleSi: 'ඩිජිටල් QR සත්‍යාපන කේතය',
                      titleEn: 'Unique Digital QR Verification',
                      descSi: 'ලෝකයේ ඕනෑම රටක සිට සහතිකයේ සත්‍යතාව ක්ෂණිකව පරීක්ෂා කළ හැක.',
                      descEn: 'Instant global employer verification via secure credential QR code.',
                    },
                    {
                      titleSi: 'රැකියා සහ විදෙස් අවස්ථා සඳහා පිළිගැනීම',
                      titleEn: 'Global Career & Migration Readiness',
                      descSi: 'ඇඟලුම් ක්ෂේත්‍රයේ ඉහළ රැකියා සහ විදෙස් උසස් අධ්‍යාපනය සඳහා වලංගු වේ.',
                      descEn: 'Recognized by leading apparel brands, export ateliers, and design institutes.',
                    },
                    {
                      titleSi: 'නිල රන් මුද්‍රාව සහ අනුක්‍රමික අංකය',
                      titleEn: 'Official Gold Wax Seal & Serial ID',
                      descSi: 'සෑම සිසුවෙකුටම අනන්‍ය වූ අනුක්‍රමික අංකයක් සහිත මුද්‍රාව.',
                      descEn: 'Individualized registration serial matching official academy student registry.',
                    },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#181113] border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-[#dfb56c]/20 border border-[#dfb56c] flex items-center justify-center text-[#dfb56c] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-[#f7f3eb] font-sinhala block">
                          {isSinhalaMode ? feat.titleSi : feat.titleEn}
                        </strong>
                        <span className="text-[#a89f91] font-sinhala block mt-0.5">
                          {isSinhalaMode ? feat.descSi : feat.descEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Notice */}
                <div className="p-3.5 rounded-lg bg-[#0c090a] border border-[#dfb56c]/30 flex items-center gap-3">
                  <FileCheck2 className="w-5 h-5 text-[#dfb56c] shrink-0" />
                  <span className="text-[11px] font-mono text-[#f7e2a9]">
                    {isSinhalaMode
                      ? '★ පාඨමාලාව සාර්ථකව අවසන් කළ පසු උපාධි ප්‍රදානෝත්සවයේදී නිල වශයෙන් පිරිනැමේ.'
                      : '★ Awarded formally upon completion during the Grand Graduation Gala Ceremony.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PART 2: GRAND GRADUATE RUNWAY FASHION SHOW SHOWCASE */}
        {/* ================================================================= */}
        <div>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-lg shadow-[#c99a45]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse" />
              <span>{isSinhalaMode ? 'පාඨමාලාව අවසානයේ දැවැන්ත විලාසිතා දැක්ම' : 'GRAND GRADUATE RUNWAY FASHION SHOW'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold gold-gradient-text tracking-tight mb-4">
              {fashionShowTitle}
            </h2>

            <p className="text-xs sm:text-sm font-mono text-[#dfb56c] uppercase tracking-wider mb-3">
              {fashionShowSubtitle}
            </p>

            <p className="text-sm sm:text-base text-[#d5cfc4] font-sinhala leading-relaxed">
              {fashionShowDescription}
            </p>
          </div>

          {/* Runway Fashion Show Feature Banner */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#dfb56c]/40 shadow-2xl bg-[#0c090a]">
            {/* Background Image with Dark Vignette Overlay */}
            <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] w-full overflow-hidden">
              <img
                src={fashionShowImageUrl}
                alt={fashionShowTitle}
                className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
              />

              {/* Dark Luxury Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c090a] via-[#0c090a]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c090a]/90 via-[#0c090a]/40 to-transparent" />

              {/* Event Location & Date Badge */}
              <div className="absolute top-6 left-6 z-10 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#38070e]/90 text-[#f7e2a9] border border-[#dfb56c]/40 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>{fashionShowDateVenue}</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0c090a]/80 text-[#dfb56c] border border-white/10 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Official Graduation Runway</span>
                </span>
              </div>

              {/* Expand Fullscreen Button */}
              <button
                onClick={() => setIsFashionModalOpen(true)}
                className="absolute top-6 right-6 bg-black/70 hover:bg-[#dfb56c] text-white hover:text-black p-2.5 rounded-full border border-[#dfb56c]/40 transition-all cursor-pointer shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Runway Feature Content Floating Inside Banner */}
              <div className="absolute bottom-6 left-6 right-6 z-10 max-w-4xl space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-[#dfb56c] tracking-widest block font-bold">
                    {isSinhalaMode ? '★ සැබෑ ලෝකයේ විලාසිතා නිර්මාණකරුවෙකු වීමේ දොරටුව' : '★ THE ULTIMATE DESIGNER LAUNCHPAD'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-[#f7f3eb] leading-tight">
                    {isSinhalaMode
                      ? 'ඔබේම ඇඳුම් එකතුව රටම දකින Runway වේදිකාව මතට රැගෙන එන්න'
                      : 'Take Center Stage: Your Designs on the Official Haute Couture Runway'}
                  </h3>
                </div>

                {/* 4 Feature Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
                  {[
                    {
                      icon: Users,
                      titleSi: 'ප්‍රවීණ Top Models',
                      titleEn: 'Professional Models',
                      descSi: 'ඔබේ ඇඳුම් සඳහා වෘත්තීය නිරූපිකාවන්',
                      descEn: 'Draped on experienced runway models',
                    },
                    {
                      icon: Camera,
                      titleSi: 'මාධ්‍ය සහ TV ආවරණය',
                      titleEn: 'Media & TV Coverage',
                      descSi: 'රූපවාහිනී හා සමාජ මාධ්‍ය ප්‍රචාරය',
                      descEn: 'Mainstream press & social coverage',
                    },
                    {
                      icon: Trophy,
                      titleSi: 'විලාසිතා සම්මාන',
                      titleEn: 'Runway Awards',
                      descSi: 'වසරේ දක්ෂතම නිර්මාණකරු සම්මානය',
                      descEn: 'Best Designer of the Year Trophy',
                    },
                    {
                      icon: Crown,
                      titleSi: 'ගැනුම්කරුවන් සහ ආයෝජකයින්',
                      titleEn: 'Buyers & Investors',
                      descSi: 'සෘජු ඇණවුම් ලබාගැනීමේ අවස්ථාව',
                      descEn: 'Direct boutique buyer connections',
                    },
                  ].map((perk, pIdx) => {
                    const IconComp = perk.icon;
                    return (
                      <div
                        key={pIdx}
                        className="p-3 rounded-lg bg-[#141011]/90 backdrop-blur-md border border-white/10 space-y-1 hover:border-[#dfb56c]/40 transition-all"
                      >
                        <div className="flex items-center gap-1.5 text-[#dfb56c]">
                          <IconComp className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-bold text-[11px] font-sinhala truncate">
                            {isSinhalaMode ? perk.titleSi : perk.titleEn}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#a89f91] font-sinhala line-clamp-2">
                          {isSinhalaMode ? perk.descSi : perk.descEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* FULLSCREEN IMAGE MODAL FOR CERTIFICATE */}
      {/* ================================================================= */}
      {isCertModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsCertModalOpen(false)}
              className="absolute -top-12 right-0 bg-[#dfb56c] text-black p-2 rounded-full hover:bg-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-xl overflow-hidden border-2 border-[#dfb56c] shadow-2xl bg-[#0c090a]">
              <img src={certImageUrl} alt={certTitle} className="w-full max-h-[85vh] object-contain mx-auto" />
              <div className="p-4 bg-[#141011] border-t border-white/10 text-center">
                <span className="text-sm font-bold text-[#dfb56c] font-editorial block">
                  {certTitle}
                </span>
                <span className="text-xs text-[#a89f91] font-mono mt-0.5 block">
                  CEYLON STYLE STUDIO • OFFICIAL REGISTERED DIPLOMA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* FULLSCREEN IMAGE MODAL FOR FASHION SHOW */}
      {/* ================================================================= */}
      {isFashionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFashionModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsFashionModalOpen(false)}
              className="absolute -top-12 right-0 bg-[#dfb56c] text-black p-2 rounded-full hover:bg-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-xl overflow-hidden border-2 border-[#dfb56c] shadow-2xl bg-[#0c090a]">
              <img src={fashionShowImageUrl} alt={fashionShowTitle} className="w-full max-h-[85vh] object-contain mx-auto" />
              <div className="p-4 bg-[#141011] border-t border-white/10 text-center">
                <span className="text-sm font-bold text-[#dfb56c] font-editorial block">
                  {fashionShowTitle}
                </span>
                <span className="text-xs text-[#a89f91] font-mono mt-0.5 block">
                  CEYLON STYLE STUDIO • ANNUAL GRADUATE RUNWAY GALA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
