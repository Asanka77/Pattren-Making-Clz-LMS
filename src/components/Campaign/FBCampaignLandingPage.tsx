import React, { useState, useEffect, useRef } from 'react';
import { CampaignPage, CampaignLead, CourseItem, CampaignCoursePoint, CampaignGalleryImage } from '../../types';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  Play,
  Download,
  CheckCircle,
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  Send,
  MessageSquare,
  Star,
  Users,
  MapPin,
  ChevronRight,
  Award,
  Video,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
  Phone,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Share2,
  Image as ImageIcon,
  Maximize2,
  X,
} from 'lucide-react';

// YouTube URL parser
function parseYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : '';
}

function getYouTubeThumbnail(videoId: string): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

interface FBCampaignLandingPageProps {
  campaignSlug: string;
  onBackToMain?: () => void;
}

export function FBCampaignLandingPage({
  campaignSlug,
  onBackToMain,
}: FBCampaignLandingPageProps) {
  const { language, setLanguage } = useLanguage();
  const { campaigns, submitCampaignLead, courses, siteSettings } = useData();

  // Find target campaign by slug or id, fallback to first campaign or default
  const campaign: CampaignPage | undefined =
    campaigns.find((c) => c.slug === campaignSlug || c.id === campaignSlug) ||
    campaigns[0];

  const formRef = useRef<HTMLDivElement>(null);
  const isSinhala = language === 'si';

  // Active playing video state
  const [activeVideoEmbedId, setActiveVideoEmbedId] = useState<string | null>(null);
  const [activeReviewVideoId, setActiveReviewVideoId] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<CampaignGalleryImage | null>(null);

  // Step 2 Student Form state
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Kurunegala');
  const [city, setCity] = useState('');
  const [studyMode, setStudyMode] = useState<'PHYSICAL' | 'ZOOM'>('PHYSICAL');
  const [preferredLocation, setPreferredLocation] = useState(
    campaign?.allowedLocations?.[0] || 'KURUNEGALA ATELIER'
  );
  const [experienceLevel, setExperienceLevel] = useState('Beginner (Zero prior experience)');
  const [notes, setNotes] = useState('');
  const [customResponses, setCustomResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<CampaignLead | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 45,
    seconds: 12,
  });

  // Calculate Countdown Timer
  useEffect(() => {
    if (!campaign?.countdownEndDate) return;
    const updateCountdown = () => {
      const target = new Date(campaign.countdownEndDate!).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [campaign?.countdownEndDate]);

  // Set page title for FB Ads
  useEffect(() => {
    if (!campaign) return;
    const oldTitle = document.title;
    document.title = `${campaign.title} | Ceylon Style Studio`;
    return () => {
      document.title = oldTitle;
    };
  }, [campaign]);

  // Scroll to Step 2 Form
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Submission
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(isSinhala ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.' : 'Please enter your full name.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, '').length < 9) {
      setFormError(
        isSinhala
          ? 'කරුණාකර වලංගු WhatsApp දුරකථන අංකයක් ඇතුළත් කරන්න.'
          : 'Please enter a valid WhatsApp phone number.'
      );
      return;
    }

    const formConfig = campaign?.formConfig;
    if (formConfig?.requireEmail && !email.trim()) {
      setFormError(isSinhala ? 'කරුණාකර ඔබගේ විද්‍යුත් තැපෑල (Email) ඇතුළත් කරන්න.' : 'Please enter your email address.');
      return;
    }
    if (formConfig?.requireDistrict && !district.trim()) {
      setFormError(isSinhala ? 'කරුණාකර ඔබගේ දිස්ත්‍රික්කය ඇතුළත් කරන්න.' : 'Please enter your district.');
      return;
    }
    if (formConfig?.requireCity && !city.trim()) {
      setFormError(isSinhala ? 'කරුණාකර ඔබගේ නගරය ඇතුළත් කරන්න.' : 'Please enter your nearest city.');
      return;
    }

    // Validate any required custom fields
    if (formConfig?.customFields) {
      for (const cf of formConfig.customFields) {
        if (cf.required && !customResponses[cf.id]?.trim() && !customResponses[cf.label]?.trim()) {
          setFormError(
            isSinhala
              ? `කරුණාකර '${cf.labelSinhala || cf.label}' පුරවන්න.`
              : `Please fill in '${cf.label}'.`
          );
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      const leadData: Omit<CampaignLead, 'id' | 'createdAt' | 'status'> = {
        campaignId: campaign.id,
        campaignSlug: campaign.slug,
        campaignTitle: campaign.title,
        fullName: fullName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        email: email.trim() || undefined,
        district: district.trim() || undefined,
        city: city.trim() || undefined,
        studyMode,
        preferredLocation,
        experienceLevel,
        notes: notes.trim() || undefined,
        customFieldResponses: Object.keys(customResponses).length > 0 ? customResponses : undefined,
      };

      const newLead = await submitCampaignLead(campaign.slug || campaign.id, leadData);
      setSubmittedLead(newLead);

      // Trigger Facebook Pixel Lead Event if FB Pixel is integrated
      try {
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'Lead', {
            content_name: campaign.title,
            content_category: 'Fashion Design Course',
            value: campaign.discountPrice || 7500,
            currency: campaign.currency || 'LKR',
          });
        }
      } catch (err) {
        console.warn('FB Pixel Lead event trigger skipped', err);
      }
    } catch (err: any) {
      console.error('Lead submission failed', err);
      setFormError(
        isSinhala
          ? 'ලියාපදිංචිය සුරැකීමේදී දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Registration failed. Please try again or contact us directly on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0c0709] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-[#dfb56c] mx-auto animate-pulse" />
          <h1 className="text-xl font-editorial font-bold">Campaign Not Found</h1>
          <p className="text-xs text-[#a89f91]">
            The requested course promotion campaign could not be loaded. Please return to the home
            page.
          </p>
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="px-6 py-2 bg-[#dfb56c] text-black font-bold text-xs uppercase rounded tracking-wider"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // Localized texts
  const displayTitle = isSinhala && campaign.titleSinhala ? campaign.titleSinhala : campaign.title;
  const displayBadge = isSinhala && campaign.badgeSinhala ? campaign.badgeSinhala : campaign.badge;
  const displayAboutHeading =
    isSinhala && campaign.aboutHeadingSinhala ? campaign.aboutHeadingSinhala : campaign.aboutHeading;
  const displayAboutDesc =
    isSinhala && campaign.aboutDescriptionSinhala
      ? campaign.aboutDescriptionSinhala
      : campaign.aboutDescription;
  const displayHighlights =
    isSinhala && campaign.highlightsSinhala && campaign.highlightsSinhala.length > 0
      ? campaign.highlightsSinhala
      : campaign.highlights || [];
  const displayIntake =
    isSinhala && campaign.intakeTextSinhala ? campaign.intakeTextSinhala : campaign.intakeText;
  const displayFormHeading =
    isSinhala && campaign.formHeadingSinhala ? campaign.formHeadingSinhala : campaign.formHeading;
  const displayFormSubheading =
    isSinhala && campaign.formSubheadingSinhala
      ? campaign.formSubheadingSinhala
      : campaign.formSubheading;
  const displayCoverCaption =
    isSinhala && campaign.coverImageCaptionSinhala
      ? campaign.coverImageCaptionSinhala
      : campaign.coverImageCaption;
  const displayCertHeading =
    isSinhala && campaign.certificateHeadingSinhala
      ? campaign.certificateHeadingSinhala
      : campaign.certificateHeading || 'Accredited Fashion Design & Pattern Making Diploma Certificate';
  const displayCertIssuer =
    isSinhala && campaign.certificateIssuerSinhala
      ? campaign.certificateIssuerSinhala
      : campaign.certificateIssuer || 'Ceylon Style Studio & TVEC Sri Lanka Aligned';
  const displayCertDesc =
    isSinhala && campaign.certificateDescriptionSinhala
      ? campaign.certificateDescriptionSinhala
      : campaign.certificateDescription || 'Upon successful completion of the course and practical atelier projects, graduates receive our official sealed and verified diploma credential recognized for professional boutique startup and apparel industry careers.';

  return (
    <div className="min-h-screen bg-[#090708] text-[#f7f3eb] font-sans selection:bg-[#dfb56c] selection:text-black pb-28 relative">
      {/* Top Floating Mini Header */}
      <header className="sticky top-0 z-40 bg-[#0f0a0c]/95 backdrop-blur-md border-b border-[#dfb56c]/30 px-4 py-2.5 transition-all shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#dfb56c] to-[#99732b] flex items-center justify-center font-bold text-black text-xs shadow">
              CSS
            </div>
            <div>
              <span className="text-xs font-editorial font-bold text-white tracking-wider block">
                CEYLON STYLE STUDIO
              </span>
              <span className="text-[9px] font-mono text-[#dfb56c] uppercase tracking-widest block -mt-0.5">
                Official FB Ad Partner Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-black/60 rounded border border-white/10 p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-all ${
                  language === 'en'
                    ? 'bg-[#dfb56c] text-black font-bold'
                    : 'text-[#a89f91] hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('si')}
                className={`px-2 py-0.5 rounded transition-all font-sinhala ${
                  language === 'si'
                    ? 'bg-[#dfb56c] text-black font-bold'
                    : 'text-[#a89f91] hover:text-white'
                }`}
              >
                සිං
              </button>
            </div>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${(campaign.whatsappNumber || '+94703755312').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                campaign.whatsappPrefillText || `Hello Ceylon Style Studio, I am interested in ${campaign.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] text-black text-xs font-bold rounded-full shadow hover:brightness-110 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Campaign Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* ========================================================= */}
        {/* HERO BANNER & URGENCY SECTION                             */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#1c1013] via-[#140b0e] to-[#0d0709] border border-[#dfb56c]/50 p-5 sm:p-8 shadow-2xl text-center space-y-4">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#dfb56c]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#540d18] border border-[#dfb56c] shadow-lg animate-pulse">
            <Flame className="w-4 h-4 text-[#dfb56c]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#f7e2a9]">
              {displayBadge}
            </span>
          </div>

          {/* Main Campaign Headline */}
          <h1 className="text-2xl sm:text-4xl font-editorial font-bold text-white tracking-wide leading-tight max-w-2xl mx-auto">
            {displayTitle}
          </h1>

          {/* Intake & Spots Counter */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
            <span className="px-3 py-1 rounded bg-black/60 border border-white/10 text-[#d8d0c5] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{displayIntake}</span>
            </span>
            <span className="px-3 py-1 rounded bg-[#38070e] border border-red-500/50 text-red-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>ONLY {campaign.spotsLeft ?? 6} SEATS REMAINING</span>
            </span>
          </div>

          {/* Countdown Urgency Timer */}
          <div className="py-2.5 px-4 rounded-lg bg-black/70 border border-[#dfb56c]/30 inline-block max-w-sm mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#dfb56c] block mb-1.5 font-bold">
              ⏰ Special Facebook Boost Discount Expires In:
            </span>
            <div className="flex items-center justify-center gap-3 font-mono text-center">
              <div className="bg-[#1b1013] border border-white/10 px-3 py-1.5 rounded">
                <span className="text-lg font-bold text-white block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-[#a89f91] block uppercase">Hours</span>
              </div>
              <span className="text-lg font-bold text-[#dfb56c]">:</span>
              <div className="bg-[#1b1013] border border-white/10 px-3 py-1.5 rounded">
                <span className="text-lg font-bold text-white block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-[#a89f91] block uppercase">Mins</span>
              </div>
              <span className="text-lg font-bold text-[#dfb56c]">:</span>
              <div className="bg-[#1b1013] border border-white/10 px-3 py-1.5 rounded">
                <span className="text-lg font-bold text-white block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-[#a89f91] block uppercase">Secs</span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xs text-[#a89f91] line-through font-mono">
                {campaign.currency || 'LKR'} {(campaign.regularPrice ?? 15000).toLocaleString()}
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-[#dfb56c]">
                {campaign.currency || 'LKR'} {(campaign.discountPrice ?? 7500).toLocaleString()}
              </span>
              <span className="text-xs text-white/70 font-mono">/ Month (50% Off)</span>
            </div>

            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#dfb56c] text-black font-bold text-xs uppercase tracking-wider rounded-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{isSinhala ? 'දැන්ම ආසනය වෙන්කරගන්න (Step 2)' : 'Reserve Your Seat (Step 2)'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Important Milestones & Date Lines Strip */}
          {(campaign.registrationDeadline || campaign.batchStartDate || (campaign.dateLines && campaign.dateLines.length > 0)) && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              {campaign.registrationDeadline && (
                <div className="px-3 py-1.5 rounded bg-[#38070e] border border-red-500/60 text-red-200 flex items-center gap-1.5 shadow">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>
                    {isSinhala ? 'ලියාපදිංචිය අවසන් දිනය: ' : 'Registration Deadline: '}
                    <strong className="text-white font-bold">{campaign.registrationDeadline}</strong>
                  </span>
                </div>
              )}
              {campaign.batchStartDate && (
                <div className="px-3 py-1.5 rounded bg-black/70 border border-[#dfb56c]/40 text-[#f7e2a9] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>
                    {isSinhala ? 'පන්ති ආරම්භය: ' : 'Batch Starts: '}
                    <strong className="text-white font-bold">{campaign.batchStartDate}</strong>
                  </span>
                </div>
              )}
              {campaign.dateLines && campaign.dateLines.map((dl) => (
                <div
                  key={dl.id}
                  className={`px-3 py-1.5 rounded border flex items-center gap-1.5 ${
                    dl.highlight
                      ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold shadow'
                      : 'bg-black/60 border-white/10 text-[#d5cfc4]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#dfb56c]" />
                  <span>
                    {isSinhala && dl.labelSinhala ? dl.labelSinhala : dl.label}:{' '}
                    <strong className="text-white font-bold">{dl.date}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* COVER PAGE HERO IMAGE SHOWCASE                             */}
        {/* ========================================================= */}
        {campaign.coverImageUrl && (
          <section className="relative rounded-2xl overflow-hidden border-2 border-[#dfb56c]/40 shadow-2xl group">
            <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full bg-black overflow-hidden">
              <img
                src={campaign.coverImageUrl}
                alt={displayTitle}
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0709] via-black/30 to-black/20" />

              {/* Badge & Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#540d18]/90 backdrop-blur-md border border-[#dfb56c] text-[#f7e2a9] text-[10px] font-mono uppercase tracking-wider font-bold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>Official Atelier & Academy Visuals</span>
                  </span>
                  {displayCoverCaption && (
                    <p className="text-xs sm:text-sm text-white/95 font-editorial font-semibold drop-shadow-md">
                      {displayCoverCaption}
                    </p>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#dfb56c]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Ceylon Style Studio Masterclass</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* STEP 2: STUDENT DETAILS REGISTRATION FORM (MOVED TO TOP)  */}
        {/* ========================================================= */}
        <section
          ref={formRef}
          id="campaign-step-2-form"
          className="p-6 sm:p-10 rounded-xl bg-gradient-to-b from-[#190e11] via-[#140b0e] to-[#0c0709] border-2 border-[#dfb56c] shadow-2xl space-y-6 relative"
        >
          {/* Top Form Header */}
          <div className="text-center space-y-2 border-b border-white/10 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38070e] border border-[#dfb56c] text-[#dfb56c] text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Step 2 of 2: Reserve Your Seat</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-editorial font-bold text-white">
              {displayFormHeading}
            </h2>

            <p className="text-xs sm:text-sm text-[#b8afa2] max-w-xl mx-auto font-sinhala leading-relaxed">
              {displayFormSubheading}
            </p>
          </div>

          {/* Submitted Lead Confirmation Card */}
          {submittedLead ? (
            <div className="p-8 rounded-lg bg-black/80 border-2 border-emerald-500/80 text-center space-y-5 animate-in fade-in duration-500 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                  {campaign.successTitleSinhala && isSinhala ? campaign.successTitleSinhala : campaign.successTitle || 'Registration Confirmed!'}
                </span>
                <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white">
                  Thank You, {submittedLead.fullName}!
                </h3>
                <p className="text-xs text-[#c5beb3] mt-2 max-w-lg mx-auto font-sinhala leading-relaxed">
                  {campaign.successMessageSinhala && isSinhala ? campaign.successMessageSinhala : campaign.successMessage}
                </p>
              </div>

              {/* Reference ID Pill */}
              <div className="inline-block px-4 py-2 rounded bg-[#1c1214] border border-[#dfb56c] font-mono text-xs text-[#f7e2a9]">
                <span className="text-[#a89f91]">Registration Reference: </span>
                <strong className="text-[#dfb56c]">{submittedLead.id}</strong>
              </div>

              {/* Instant WhatsApp Confirmation Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${(campaign.whatsappNumber || '+94703755312').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Ceylon Style Studio, I just registered via your Facebook Ad for ${campaign.title}!\n\nMy Details:\n• Name: ${submittedLead.fullName}\n• Phone: ${submittedLead.whatsappNumber}\n• Location: ${submittedLead.preferredLocation || submittedLead.district}\n• Ref ID: ${submittedLead.id}\n\nPlease send me the batch starting date and admission packet.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider rounded-sm shadow-xl hover:brightness-110 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isSinhala ? 'WhatsApp මගින් ලියාපදිංචිය තහවුරු කරන්න' : 'Confirm via WhatsApp Now'}</span>
                </a>
                <span className="text-[10px] text-[#a89f91] block mt-2 font-mono">
                  Direct connection with Academic Faculty • Average reply within 15 mins
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Key Date Lines & Registration Deadlines Notice above Form */}
              {(campaign.registrationDeadline || campaign.batchStartDate || (campaign.dateLines && campaign.dateLines.length > 0)) && (
                <div className="p-4 rounded-lg bg-[#251216] border border-[#dfb56c]/70 shadow-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-[#dfb56c] font-mono text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-[#dfb56c]" />
                    <span>{isSinhala ? 'වැදගත් දින වකවානු සහ කාලසීමාවන් (Key Deadlines):' : 'Key Deadlines & Schedule Milestones:'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {campaign.registrationDeadline && (
                      <div className="p-2.5 rounded bg-black/70 border border-red-500/50 flex items-center justify-between text-red-200 shadow">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          <span>{isSinhala ? 'ලියාපදිංචිය අවසන් දිනය:' : 'Registration Closes:'}</span>
                        </span>
                        <strong className="text-white bg-red-950 px-2 py-0.5 rounded border border-red-500 font-bold">
                          {campaign.registrationDeadline}
                        </strong>
                      </div>
                    )}

                    {campaign.batchStartDate && (
                      <div className="p-2.5 rounded bg-black/70 border border-[#dfb56c]/40 flex items-center justify-between text-[#f7e2a9] shadow">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>{isSinhala ? 'පන්ති ආරම්භක දිනය:' : 'Batch Commencement:'}</span>
                        </span>
                        <strong className="text-white bg-[#38070e] px-2 py-0.5 rounded border border-[#dfb56c] font-bold">
                          {campaign.batchStartDate}
                        </strong>
                      </div>
                    )}

                    {campaign.dateLines &&
                      campaign.dateLines.map((dl) => (
                        <div
                          key={dl.id}
                          className={`p-2.5 rounded border flex items-center justify-between shadow ${
                            dl.highlight
                              ? 'bg-[#38070e] border-[#dfb56c] text-[#f7e2a9] font-bold'
                              : 'bg-black/70 border-white/10 text-[#d5cfc4]'
                          }`}
                        >
                          <span className="truncate pr-2">
                            {isSinhala && dl.labelSinhala ? dl.labelSinhala : dl.label}
                          </span>
                          <strong className="text-white shrink-0 font-mono bg-black/50 px-2 py-0.5 rounded">
                            {dl.date}
                          </strong>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitLead} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded bg-red-950/80 border border-red-500/80 text-red-200 text-xs flex items-center gap-2 font-sinhala">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Always Mandatory: Full Name & WhatsApp Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                      {isSinhala ? 'සම්පූර්ණ නම (Full Name) *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Nimasha Perera"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                      {isSinhala ? 'WhatsApp දුරකථන අංකය *' : 'WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 0771234567"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Email (If configured to show) */}
                {campaign.formConfig?.showEmail !== false && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                      {isSinhala ? 'විද්‍යුත් තැපෑල (Email Address)' : 'Email Address'}
                      {campaign.formConfig?.requireEmail && ' *'}
                    </label>
                    <input
                      type="email"
                      required={campaign.formConfig?.requireEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. nimasha@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                    />
                  </div>
                )}

                {/* District, City, and Study Mode Row */}
                {(campaign.formConfig?.showDistrict !== false ||
                  campaign.formConfig?.showCity !== false ||
                  campaign.formConfig?.showStudyMode !== false) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* District */}
                    {campaign.formConfig?.showDistrict !== false && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                          {isSinhala ? 'දිස්ත්‍රික්කය (District)' : 'District'}
                          {campaign.formConfig?.requireDistrict && ' *'}
                        </label>
                        <input
                          type="text"
                          required={campaign.formConfig?.requireDistrict}
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Kurunegala / Colombo"
                          className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    )}

                    {/* City / Nearest Town */}
                    {campaign.formConfig?.showCity !== false && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                          {isSinhala ? 'නගරය (Nearest City)' : 'City / Town'}
                          {campaign.formConfig?.requireCity && ' *'}
                        </label>
                        <input
                          type="text"
                          required={campaign.formConfig?.requireCity}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Kegalle / Kandy"
                          className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    )}

                    {/* Study Mode */}
                    {campaign.formConfig?.showStudyMode !== false && (
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                          {isSinhala ? 'ඉගෙනුම් ක්‍රමය (Study Mode)' : 'Study Mode'}
                          {campaign.formConfig?.requireStudyMode && ' *'}
                        </label>
                        <select
                          value={studyMode}
                          onChange={(e) => setStudyMode(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                        >
                          <option value="PHYSICAL">Physical Atelier Workshops (ප්‍රායෝගික වැඩමුළු)</option>
                          <option value="ZOOM">Live Zoom Interactive (සජීවී ඔන්ලයින් පන්ති)</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Preferred Location Selection */}
                {campaign.formConfig?.showLocation !== false &&
                  campaign.allowedLocations &&
                  campaign.allowedLocations.length > 0 && (
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                        {isSinhala ? 'කැමති ශාඛාව හෝ කණ්ඩායම (Preferred Branch) *' : 'Preferred Campus Branch *'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {campaign.allowedLocations.map((loc) => (
                          <label
                            key={loc}
                            className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              preferredLocation === loc
                                ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold shadow'
                                : 'bg-[#0c0709] border-white/10 text-[#a89f91] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>{loc}</span>
                            </div>
                            <input
                              type="radio"
                              name="campaignLocation"
                              value={loc}
                              checked={preferredLocation === loc}
                              onChange={() => setPreferredLocation(loc)}
                              className="accent-[#dfb56c]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Prior Experience */}
                {campaign.formConfig?.showExperience !== false && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                      {isSinhala ? 'මැහුම් හෝ විලාසිතා පිළිබඳ පූර්ව දැනුම' : 'Prior Sewing Experience'}
                      {campaign.formConfig?.requireExperience && ' *'}
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                    >
                      <option value="Beginner (Zero prior experience)">Beginner (කිසිදු පූර්ව දැනුමක් නැත - මුලසිටම ඉගෙනුමට)</option>
                      <option value="Basic Machine knowledge">Basic (සාමාන්‍ය මැහුම් යන්ත්‍රය භාවිතා කළ හැක)</option>
                      <option value="Intermediate tailor / dressmaker">Intermediate (ගෙදර දොරේ ඇඳුම් මැසීමේ පළපුරුද්ද ඇත)</option>
                      <option value="Running a small sewing business">Advanced (දැනටමත් ඇඳුම් ව්‍යාපාරයක් කරගෙන යයි)</option>
                    </select>
                  </div>
                )}

                {/* Dynamic Custom Fields Added by Admin */}
                {campaign.formConfig?.customFields && campaign.formConfig.customFields.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {campaign.formConfig.customFields.map((cf) => {
                      const fieldLabel = isSinhala && cf.labelSinhala ? cf.labelSinhala : cf.label;
                      const fieldPlaceholder = isSinhala && cf.placeholderSinhala ? cf.placeholderSinhala : cf.placeholder;
                      const val = customResponses[cf.id] || customResponses[cf.label] || '';

                      return (
                        <div key={cf.id}>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                            {fieldLabel}
                            {cf.required && ' *'}
                          </label>

                          {cf.fieldType === 'textarea' ? (
                            <textarea
                              rows={2}
                              value={val}
                              onChange={(e) =>
                                setCustomResponses((prev) => ({ ...prev, [cf.id]: e.target.value, [cf.label]: e.target.value }))
                              }
                              placeholder={fieldPlaceholder || ''}
                              className="w-full px-3.5 py-2 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          ) : cf.fieldType === 'select' ? (
                            <select
                              value={val}
                              onChange={(e) =>
                                setCustomResponses((prev) => ({ ...prev, [cf.id]: e.target.value, [cf.label]: e.target.value }))
                              }
                              className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                            >
                              <option value="">{isSinhala ? '-- කරුණාකර තෝරන්න --' : '-- Please Select --'}</option>
                              {(cf.options || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={cf.fieldType === 'number' ? 'number' : cf.fieldType === 'date' ? 'date' : 'text'}
                              value={val}
                              onChange={(e) =>
                                setCustomResponses((prev) => ({ ...prev, [cf.id]: e.target.value, [cf.label]: e.target.value }))
                              }
                              placeholder={fieldPlaceholder || ''}
                              className="w-full px-3.5 py-2.5 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none font-sans"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Notes */}
                {campaign.formConfig?.showNotes !== false && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#dfb56c] mb-1.5 font-bold">
                      {isSinhala ? 'විශේෂ සටහන් හෝ ප්‍රශ්න (Optional Notes)' : 'Questions or Special Notes (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isSinhala ? 'ඔබට දැනගැනීමට අවශ්‍ය වෙනත් යමක් ඇත්නම් මෙහි සටහන් කරන්න...' : 'Any questions regarding weekend dates, installments, or travel arrangements...'}
                      className="w-full px-3.5 py-2 rounded-sm bg-[#0c0709] border border-white/20 text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>
                )}

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#dfb56c] text-black font-bold text-sm uppercase tracking-wider rounded-sm shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>{isSinhala ? 'ලියාපදිංචිය තහවුරු කරන්න (50% Off Discount Lock)' : 'Submit & Lock In 50% FB Discount'}</span>
                        <ChevronRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-[#a89f91] font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Secure • Official Ceylon Style Studio Admissions Desk</span>
                  </div>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* ABOUT THIS COURSE & ATTRACTIVE POINTS WITH SYMBOLS         */}
        {/* ========================================================= */}
        <section className="p-6 sm:p-8 rounded-xl bg-[#110b0e] border border-white/10 space-y-6 shadow-xl">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#dfb56c]" />
              <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white">
                {displayAboutHeading}
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#38070e] text-[#dfb56c] border border-[#dfb56c]/30 self-start sm:self-auto">
              Couture Academy Curriculum
            </span>
          </div>

          {displayAboutDesc && (
            <p className="text-xs sm:text-sm text-[#d5cfc4] leading-relaxed font-sinhala">
              {displayAboutDesc}
            </p>
          )}

          {/* Attractive Course Points with Symbols Grid */}
          {campaign.aboutPoints && campaign.aboutPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {campaign.aboutPoints.map((pt) => {
                const ptText = isSinhala && pt.textSinhala ? pt.textSinhala : pt.text;
                const ptBadge = isSinhala && pt.badgeSinhala ? pt.badgeSinhala : pt.badge;

                return (
                  <div
                    key={pt.id}
                    className="p-4 rounded-xl bg-gradient-to-br from-[#1b1013] to-[#120a0d] border border-[#dfb56c]/30 hover:border-[#dfb56c] transition-all shadow-lg flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#540d18] to-[#2e070c] border border-[#dfb56c]/70 flex items-center justify-center shrink-0 text-xl shadow-md group-hover:scale-110 transition-transform">
                      {pt.symbol || '✨'}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      {ptBadge && (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#38070e] text-[#dfb56c] border border-[#dfb56c]/30 uppercase tracking-wider mb-0.5">
                          {ptBadge}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm text-[#eae4d9] font-sinhala leading-relaxed font-medium">
                        {ptText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* All Additional Bullet Points (Optional) displayed on user interface */}
          {displayHighlights.length > 0 && (
            <div className={`space-y-3 ${campaign.aboutPoints && campaign.aboutPoints.length > 0 ? 'pt-4 border-t border-white/10' : 'pt-1'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#dfb56c]" />
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                  {isSinhala ? 'පාඨමාලාවේ අමතර විශේෂත්වයන් (Key Highlights)' : 'Additional Key Course Highlights'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#180f12] border border-white/10 hover:border-[#dfb56c]/40 transition-all flex items-start gap-3 shadow-sm group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#38070e] border border-[#dfb56c]/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <Check className="w-3.5 h-3.5 text-[#dfb56c]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#eae4d9] font-sinhala leading-snug">
                      {hl}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* ATELIER & STUDENT CREATIONS IMAGE GALLERY                 */}
        {/* ========================================================= */}
        {campaign.galleryImages && campaign.galleryImages.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#dfb56c] uppercase tracking-widest block font-bold">
                  Behind The Scenes & Atelier Craft
                </span>
                <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#dfb56c]" />
                  <span>{isSinhala ? 'ශිෂ්‍ය නිර්මාණ හා ප්‍රායෝගික වැඩමුළු ගැලරිය' : 'Atelier & Student Creations Gallery'}</span>
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#38070e] text-[#dfb56c] border border-[#dfb56c]/30 self-start sm:self-auto">
                {campaign.galleryImages.length} High-Res Atelier Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {campaign.galleryImages.map((img) => {
                const caption = isSinhala && img.captionSinhala ? img.captionSinhala : img.caption;
                return (
                  <div
                    key={img.id}
                    onClick={() => setSelectedGalleryImage(img)}
                    className="group relative rounded-xl overflow-hidden bg-black border border-white/10 hover:border-[#dfb56c] transition-all cursor-pointer aspect-square shadow-lg"
                  >
                    <img
                      src={img.imageUrl}
                      alt={caption || 'Atelier creation'}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-108 group-hover:brightness-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Tag */}
                    {img.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#540d18]/90 text-[#f7e2a9] border border-[#dfb56c]/50">
                        {img.tag}
                      </span>
                    )}

                    {/* Caption & Zoom Icon */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-1">
                      {caption && (
                        <p className="text-[11px] text-white/95 font-sinhala line-clamp-2 leading-tight">
                          {caption}
                        </p>
                      )}
                      <div className="w-6 h-6 rounded-full bg-black/70 border border-[#dfb56c] text-[#dfb56c] flex items-center justify-center shrink-0">
                        <Maximize2 className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* RECOGNIZED DIPLOMA CERTIFICATE SHOWCASE                    */}
        {/* ========================================================= */}
        {campaign.certificateImageUrl && (
          <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1c1014] via-[#140b0e] to-[#0c0709] border-2 border-[#dfb56c]/60 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Certificate Image Frame */}
              <div
                onClick={() =>
                  setSelectedGalleryImage({
                    id: 'cert-preview',
                    imageUrl: campaign.certificateImageUrl!,
                    caption: displayCertHeading,
                    tag: 'Official Certificate',
                  })
                }
                className="relative w-full sm:w-72 shrink-0 rounded-xl overflow-hidden border-2 border-[#dfb56c] shadow-2xl group cursor-pointer bg-black"
              >
                <img
                  src={campaign.certificateImageUrl}
                  alt={displayCertHeading}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]">
                    Official Seal
                  </span>
                  <span className="text-[10px] font-mono text-[#dfb56c] flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Tap to Enlarge
                  </span>
                </div>
              </div>

              {/* Certificate Authority & Description */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38070e] border border-[#dfb56c] text-[#dfb56c] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>{displayCertIssuer}</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-editorial font-bold text-white leading-snug">
                  {displayCertHeading}
                </h3>

                <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala leading-relaxed">
                  {displayCertDesc}
                </p>

                {/* Trust Milestones */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#f7e2a9]">
                  <div className="p-2 rounded bg-black/60 border border-white/10 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Internationally Recognized Diploma</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/10 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Unique Serial ID Verification</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/10 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Boutique & Brand Launch Certified</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/10 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Embassy & Visa Portfolio Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* MULTIPLE YOUTUBE VIDEOS WITH CUSTOM HEADINGS              */}
        {/* ========================================================= */}
        {campaign.videos && campaign.videos.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-[#dfb56c] uppercase tracking-widest block font-bold">
                Live Studio Demonstrations & Masterclasses
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white">
                {isSinhala ? 'ප්‍රායෝගික පුහුණු වීඩියෝ පෙළ' : 'Featured Video Masterclasses'}
              </h2>
              <p className="text-xs text-[#a89f91] max-w-md mx-auto font-sinhala">
                {isSinhala
                  ? 'අපගේ ප්‍රායෝගික වැඩමුළු සහ පැටර්න් නිර්මාණය සිදුවන ආකාරය සජීවීව නරඹන්න.'
                  : 'Watch our master instructors and students at work inside the atelier.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaign.videos.map((vid, idx) => {
                const vidId = parseYouTubeId(vid.youtubeUrl);
                const isPlaying = activeVideoEmbedId === vid.id;
                const vidHeading = isSinhala && vid.headingSinhala ? vid.headingSinhala : vid.heading;
                const vidDesc = isSinhala && vid.descriptionSinhala ? vid.descriptionSinhala : vid.description;

                return (
                  <div
                    key={vid.id || idx}
                    className="rounded-xl overflow-hidden bg-[#110b0e] border border-[#dfb56c]/30 shadow-xl flex flex-col justify-between group hover:border-[#dfb56c] transition-all"
                  >
                    <div>
                      {/* Video Player Box */}
                      <div className="relative aspect-video w-full bg-black">
                        {isPlaying && vidId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${vidId}?autoplay=1&rel=0&modestbranding=1`}
                            title={vidHeading}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div
                            onClick={() => setActiveVideoEmbedId(vid.id)}
                            className="relative w-full h-full cursor-pointer group/thumb"
                          >
                            <img
                              src={getYouTubeThumbnail(vidId) || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'}
                              alt={vidHeading}
                              className="w-full h-full object-cover filter brightness-85 group-hover/thumb:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Centered Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#540d18]/90 border-2 border-[#dfb56c] flex items-center justify-center text-[#dfb56c] shadow-2xl group-hover/thumb:scale-110 group-hover/thumb:bg-[#6e1322] transition-all">
                                <Play className="w-6 h-6 fill-[#dfb56c] ml-1" />
                              </div>
                            </div>

                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#dfb56c] border border-white/10 flex items-center gap-1">
                              <Play className="w-3 h-3" /> Tap to Play
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Details */}
                      <div className="p-4 space-y-1.5">
                        <h3 className="text-sm sm:text-base font-editorial font-bold text-white group-hover:text-[#dfb56c] transition-colors leading-snug">
                          {vidHeading}
                        </h3>
                        {vidDesc && (
                          <p className="text-xs text-[#a89f91] line-clamp-2 font-sinhala leading-relaxed">
                            {vidDesc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => {
                          if (!isPlaying) setActiveVideoEmbedId(vid.id);
                        }}
                        className="w-full py-2 bg-[#1b1013] hover:bg-[#281318] border border-white/10 hover:border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>{isPlaying ? 'Now Playing' : 'Watch Masterclass Video'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* DOWNLOAD COURSE SYLLABUS & PROSPECTUS PDF                 */}
        {/* ========================================================= */}
        {campaign.pdfResource && (
          <section className="p-6 rounded-xl bg-gradient-to-r from-[#1f1215] via-[#241317] to-[#170e10] border-2 border-[#dfb56c]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shrink-0 shadow-lg text-[#dfb56c]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c] text-black">
                    OFFICIAL PROSPECTUS
                  </span>
                  {campaign.pdfResource.fileSize && (
                    <span className="text-[10px] font-mono text-[#a89f91]">
                      {campaign.pdfResource.fileSize}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-editorial font-bold text-white">
                  {isSinhala && campaign.pdfResource.titleSinhala
                    ? campaign.pdfResource.titleSinhala
                    : campaign.pdfResource.title}
                </h3>
                {campaign.pdfResource.description && (
                  <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed max-w-lg">
                    {campaign.pdfResource.description}
                  </p>
                )}
              </div>
            </div>

            <a
              href={campaign.pdfResource.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isSinhala ? 'විෂය නිර්දේශය PDF බාගත කරන්න' : 'Download Syllabus PDF'}</span>
            </a>
          </section>
        )}

        {/* ========================================================= */}
        {/* STUDENT REVIEWS WITH RUNNING YOUTUBE VIDEOS               */}
        {/* ========================================================= */}
        {campaign.studentReviews && campaign.studentReviews.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-[#dfb56c] uppercase tracking-widest block font-bold">
                Real Student Stories & Success
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white">
                {isSinhala ? 'ශිෂ්‍ය ප්‍රතිචාර හා සාර්ථකත්වයේ කතා' : 'Student Video Reviews & Testimonials'}
              </h2>
              <p className="text-xs text-[#a89f91] max-w-md mx-auto font-sinhala">
                {isSinhala
                  ? 'අපෙන් උගත් සිසුන් තම සාර්ථක ඇඳුම් සන්නාම ගොඩනැගූ ආකාරය ඔවුන්ගේම වචනවලින් අසන්න.'
                  : 'Watch video reviews from graduates who launched profitable fashion brands.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {campaign.studentReviews.map((rev, idx) => {
                const vidId = parseYouTubeId(rev.youtubeUrl);
                const isPlaying = activeReviewVideoId === rev.id;

                return (
                  <div
                    key={rev.id || idx}
                    className="p-4 rounded-xl bg-[#110b0e] border border-white/10 hover:border-[#dfb56c]/60 shadow-xl flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div>
                      {/* Video Player Box */}
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-3 border border-white/10">
                        {isPlaying && vidId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${vidId}?autoplay=1&rel=0&modestbranding=1`}
                            title={rev.studentName}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div
                            onClick={() => setActiveReviewVideoId(rev.id)}
                            className="relative w-full h-full cursor-pointer group"
                          >
                            <img
                              src={getYouTubeThumbnail(vidId) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                              alt={rev.studentName}
                              className="w-full h-full object-cover filter brightness-85 group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-[#540d18]/90 border border-[#dfb56c] flex items-center justify-center text-[#dfb56c] shadow-lg group-hover:scale-110 transition-all">
                                <Play className="w-4 h-4 fill-[#dfb56c] ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-[#dfb56c]">
                              Video Review
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-1.5">
                        {[...Array(rev.rating ?? 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#dfb56c] text-[#dfb56c]" />
                        ))}
                      </div>

                      {/* Headline / Feedback */}
                      {rev.heading && (
                        <h4 className="text-xs font-bold text-[#f7e2a9] font-editorial mb-1">
                          "{rev.heading}"
                        </h4>
                      )}

                      {rev.feedback && (
                        <p className="text-xs text-[#a89f91] font-sinhala leading-relaxed italic line-clamp-3">
                          "{rev.feedback}"
                        </p>
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {rev.studentName}
                        </span>
                        <span className="text-[10px] text-[#dfb56c] font-mono block">
                          {rev.studentBatch || 'Academy Graduate'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#38070e] text-[9px] font-mono text-[#dfb56c] border border-[#dfb56c]/30">
                        Verified
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================= */}
      {/* FULL RESOLUTION GALLERY / CERTIFICATE LIGHTBOX MODAL       */}
      {/* ========================================================= */}
      {selectedGalleryImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#140b0e] border-2 border-[#dfb56c] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-[#1e1014] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedGalleryImage.tag && (
                  <span className="px-2.5 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] text-[10px] font-mono border border-[#dfb56c]">
                    {selectedGalleryImage.tag}
                  </span>
                )}
                <span className="text-xs font-mono text-[#a89f91]">
                  Ceylon Style Studio Visual Showcase
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryImage(null)}
                className="w-8 h-8 rounded-full bg-black/60 text-white/80 hover:text-white flex items-center justify-center border border-white/10 hover:border-red-500 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-auto flex-1 flex items-center justify-center bg-black p-2">
              <img
                src={selectedGalleryImage.imageUrl}
                alt={selectedGalleryImage.caption || 'Enlarged photo'}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded"
              />
            </div>

            {(selectedGalleryImage.caption || selectedGalleryImage.captionSinhala) && (
              <div className="p-4 bg-[#140b0e] border-t border-white/10">
                <p className="text-xs sm:text-sm text-[#f7f3eb] font-sinhala leading-relaxed text-center">
                  {isSinhala && selectedGalleryImage.captionSinhala
                    ? selectedGalleryImage.captionSinhala
                    : selectedGalleryImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE STICKY BOTTOM ACTION BAR (FB/INSTA TRAFFIC OPTIMIZED) */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0709]/95 backdrop-blur-lg border-t border-[#dfb56c]/40 px-4 py-2.5 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#a89f91] line-through font-mono">
                {campaign.currency || 'LKR'}{' '}
                {(campaign.regularPrice ?? 15000).toLocaleString()}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-600 text-white">
                50% OFF
              </span>
            </div>
            <span className="text-base sm:text-lg font-mono font-bold text-[#dfb56c]">
              {campaign.currency || 'LKR'}{' '}
              {(campaign.discountPrice ?? 7500).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${(campaign.whatsappNumber || '+94703755312').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                campaign.whatsappPrefillText || `Hello Ceylon Style Studio, I am interested in ${campaign.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#25D366] text-black shadow-lg hover:brightness-110 shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-5 h-5 fill-black" />
            </a>

            <button
              onClick={scrollToForm}
              className="px-5 sm:px-7 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider rounded-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>{isSinhala ? 'ලියාපදිංචි වන්න' : 'Register Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
