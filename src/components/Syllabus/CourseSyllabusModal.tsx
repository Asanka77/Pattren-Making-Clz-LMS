import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  BookOpen,
  FileText,
  CheckCircle2,
  Search,
  Sparkles,
  Printer,
  Send,
  Phone,
  User,
  Building,
  Video,
  Award,
  ChevronRight,
  ChevronLeft,
  Scissors,
  Crown,
  Cpu,
  Clock,
  Check,
  GraduationCap,
  MessageCircle,
  Wrench,
  Compass,
  LayoutGrid,
  Menu,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CourseType } from '../../types';

export type SyllabusNavTab =
  | 'modules'
  | 'form'
  | 'highlights'
  | 'tools'
  | 'cert';

interface CourseSyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  onOpenRegister?: () => void;
}

export const CourseSyllabusModal: React.FC<CourseSyllabusModalProps> = ({
  isOpen,
  onClose,
  initialCourseId,
  onOpenRegister,
}) => {
  const { courses, modules, siteSettings, locations, submitRegistration } = useData();
  const { isSinhalaMode } = useLanguage();

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.isPublished !== false),
    [courses]
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || publishedCourses[0]?.id || 'course-01'
  );

  // Navigation Bar Active Tab
  const [activeTab, setActiveTab] = useState<SyllabusNavTab>('modules');

  // Topic View Mode: 'explorer' (Side Topic List + Viewer) or 'grid' (Card Matrix)
  const [topicViewMode, setTopicViewMode] = useState<'explorer' | 'grid'>('explorer');

  // Mobile topic drawer toggle
  const [mobileTopicMenuOpen, setMobileTopicMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Form State for Syllabus Inquiry / Fast Enrollment
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    courseType: 'PHYSICAL CLASS' as CourseType,
    location: 'KEGALLE',
    inquiryMessage: '',
    sendPdfToWhatsApp: true,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Update selected course if initialCourseId changes
  useEffect(() => {
    if (initialCourseId && publishedCourses.some((c) => c.id === initialCourseId)) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId, publishedCourses]);

  // Set initial selected module
  useEffect(() => {
    if (!selectedModuleId && modules.length > 0) {
      setSelectedModuleId(modules[0].id);
    }
  }, [modules, selectedModuleId]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeCourse = useMemo(
    () =>
      publishedCourses.find((c) => c.id === selectedCourseId) ||
      publishedCourses[0],
    [publishedCourses, selectedCourseId]
  );

  // Filter modules based on search query and category
  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mod.titleSinhala && mod.titleSinhala.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mod.description && mod.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mod.descriptionSinhala && mod.descriptionSinhala.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mod.category && mod.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        mod.number.includes(searchQuery);

      const matchesCategory =
        selectedCategory === 'all' ||
        (mod.category && mod.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [modules, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    modules.forEach((m) => {
      if (m.category) cats.add(m.category);
    });
    return Array.from(cats);
  }, [modules]);

  // Selected topic / module for side-by-side reading
  const activeModule = useMemo(() => {
    if (selectedModuleId) {
      const found = modules.find((m) => m.id === selectedModuleId);
      if (found) return found;
    }
    return filteredModules[0] || modules[0];
  }, [modules, selectedModuleId, filteredModules]);

  const currentModuleIndex = useMemo(() => {
    return modules.findIndex((m) => m.id === activeModule?.id);
  }, [modules, activeModule]);

  const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
  const nextModule =
    currentModuleIndex >= 0 && currentModuleIndex < modules.length - 1
      ? modules[currentModuleIndex + 1]
      : null;

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId);
    setMobileTopicMenuOpen(false);
  };

  const handleInquireAboutModule = (mod: typeof activeModule) => {
    if (!mod) return;
    const msg = isSinhalaMode
      ? `මම Module ${mod.number}: "${mod.titleSinhala || mod.title}" පිළිබඳව වැඩිදුර විස්තර සහ ප්‍රායෝගික පුහුණුව ගැන විමසීමට කැමැත්තෙමි.`
      : `I would like to inquire about Module ${mod.number}: "${mod.title}" and practical training details.`;
    setFormData((prev) => ({
      ...prev,
      inquiryMessage: msg,
    }));
    setActiveTab('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError(
        isSinhalaMode
          ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න (Please enter your name).'
          : 'Please enter your full name.'
      );
      return;
    }

    const cleanPhone = formData.whatsappNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setFormError(
        isSinhalaMode
          ? 'වලංගු WhatsApp දුරකථන අංකයක් ඇතුළත් කරන්න (Valid WhatsApp phone required).'
          : 'Please enter a valid WhatsApp contact number.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await submitRegistration({
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        district: formData.location || 'Kegalle',
        city: formData.location,
        educationalQualification: 'Syllabus Inquiry',
        courseId: activeCourse?.id || 'course-01',
        courseTitle: activeCourse?.title || '6-Month Professional Fashion & Branding Diploma',
        courseType: formData.courseType,
        location: formData.location,
        previousPatternCourse: 'NO',
        whyJoin: `Syllabus Form Inquiry: ${formData.inquiryMessage || 'Requested full course syllabus and admission details'}`,
      });

      setFormSubmitted(true);

      const phoneClean = (siteSettings.whatsappContactNumber || '94771234567').replace(/[^0-9]/g, '');
      const courseName = activeCourse?.title || '6-Month Fashion & Branding Diploma';
      const msg = encodeURIComponent(
        `*පාඨමාලා විෂය නිර්දේශය (Course Syllabus) විමසීම*\n\n` +
          `👤 නම: ${formData.fullName}\n` +
          `📱 WhatsApp: ${formData.whatsappNumber}\n` +
          `🎓 පාඨමාලාව: ${courseName}\n` +
          `🏛️ පන්ති ක්‍රමය: ${formData.courseType} (${formData.location})\n` +
          `${formData.inquiryMessage ? `💬 පණිවිඩය: ${formData.inquiryMessage}\n` : ''}` +
          `\nකරුණාකර සම්පූර්ණ විෂය නිර්දේශය (Syllabus PDF) සහ නව කණ්ඩායමේ ලියාපදිංචි විස්තර ලබා දෙන්න.`
      );
      window.open(`https://wa.me/${phoneClean}?text=${msg}`, '_blank');
    } catch (err: any) {
      setFormError(err?.message || 'Error submitting syllabus inquiry form.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintSyllabus = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const courseTitle = activeCourse?.title || 'Fashion & Branding Program';
    const courseTitleSi = activeCourse?.titleSinhala || '';
    const moduleListHtml = modules
      .map(
        (m) => `
        <div style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; gap: 16px;">
          <div style="font-family: monospace; font-weight: bold; color: #9e7225; min-width: 80px;">MODULE ${m.number}</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 15px; color: #111;">${m.title} ${m.titleSinhala ? `<span style="font-size: 13px; color: #666;">(${m.titleSinhala})</span>` : ''}</div>
            <div style="font-size: 12px; color: #444; margin-top: 4px;">${m.description || ''}</div>
            ${m.descriptionSinhala ? `<div style="font-size: 12px; color: #666; margin-top: 2px;">${m.descriptionSinhala}</div>` : ''}
          </div>
          <div style="font-size: 11px; background: #f3f3f3; padding: 4px 8px; border-radius: 4px; height: fit-content;">${m.category || 'Atelier'}</div>
        </div>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${courseTitle} - Course Syllabus</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111; max-width: 900px; margin: 0 auto; line-height: 1.5; }
            .header { border-bottom: 3px double #9e7225; padding-bottom: 20px; margin-bottom: 25px; text-align: center; }
            .brand { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #540d18; }
            .sub { font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #9e7225; font-weight: 600; margin-top: 4px; }
            .title { font-size: 20px; font-weight: 700; margin-top: 15px; }
            .badge-row { display: flex; justify-content: center; gap: 15px; margin-top: 12px; font-size: 12px; color: #555; }
            .print-btn { margin: 20px 0; padding: 8px 16px; background: #9e7225; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">${siteSettings.brandName || 'CEYLON STYLE STUDIO'}</div>
            <div class="sub">HAUTE COUTURE & FASHION BRANDING ACADEMY</div>
            <div class="title">${courseTitle}</div>
            ${courseTitleSi ? `<div style="font-size: 15px; color: #555; margin-top: 4px;">${courseTitleSi}</div>` : ''}
            <div class="badge-row">
              <span>Duration: <strong>${activeCourse?.duration || '6 Months'}</strong></span>
              <span>•</span>
              <span>Format: <strong>Physical Studio & Zoom Live</strong></span>
              <span>•</span>
              <span>Modules: <strong>${modules.length} Master Modules</strong></span>
            </div>
            <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
          </div>
          <div>
            <h3 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #9e7225; border-bottom: 1px solid #ccc; padding-bottom: 6px;">Curriculum & Practical Modules (විෂය නිර්දේශය)</h3>
            ${moduleListHtml}
          </div>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #777;">
            ${siteSettings.brandName || 'Ceylon Style Studio'} • All Rights Reserved. Official Course Syllabus Document.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenWhatsAppHotline = () => {
    const phoneClean = (siteSettings.whatsappContactNumber || '94771234567').replace(/[^0-9]/g, '');
    const courseName = activeCourse?.title || 'Course Syllabus';
    const msg = encodeURIComponent(
      `හෙලෝ, මට Ceylon Style Studio හි "${courseName}" පාඨමාලා විෂය නිර්දේශය (Course Syllabus) සහ ඇතුළත් වීමේ විස්තර ලබාගැනීමට අවශ්‍යයි.`
    );
    window.open(`https://wa.me/${phoneClean}?text=${msg}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-6xl bg-[#0f0b0c] border border-[#dfb56c]/40 rounded-sm shadow-2xl flex flex-col h-[94vh] max-h-[94vh] overflow-hidden"
        style={{
          boxShadow: '0 0 60px rgba(84, 13, 24, 0.4), 0 0 25px rgba(223, 181, 108, 0.25)',
        }}
      >
        {/* =========================================================================
            TOP LUXURY BRAND & TITLE BAR
           ========================================================================= */}
        <div className="relative px-4 py-3 sm:px-7 sm:py-3.5 border-b border-[#dfb56c]/25 bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#141011] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1px] shadow-lg shadow-[#dfb56c]/20 shrink-0">
              <div className="w-full h-full bg-[#141011] rounded-sm flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#dfb56c]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#dfb56c] font-bold">
                  {isSinhalaMode ? 'නිල විෂය නිර්දේශ පෝරමය' : 'Official Syllabus & Curriculum'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-mono font-bold hidden sm:inline-block">
                  {modules.length} Modules
                </span>
              </div>
              <h2
                id="syllabus-modal-title"
                className="text-sm sm:text-lg md:text-xl font-bold font-editorial text-[#f7f3eb] tracking-wide luxury-heading-anim leading-tight"
              >
                {isSinhalaMode
                  ? 'පාඨමාලා විෂය නිර්දේශය (COURSE SYLLABUS)'
                  : 'COURSE SYLLABUS & CURRICULUM'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp Hotline */}
            <button
              onClick={handleOpenWhatsAppHotline}
              className="btn-3d-secondary px-2.5 sm:px-3 py-1.5 text-xs rounded hidden md:flex items-center gap-1.5 text-green-400 border-green-500/40"
              title="Chat on WhatsApp about this Syllabus"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="font-mono text-[11px] font-bold text-white">WhatsApp</span>
            </button>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrintSyllabus}
              className="btn-3d-secondary px-2.5 sm:px-3 py-1.5 text-xs rounded hidden sm:flex items-center gap-1.5"
              title="Print or Save Syllabus as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span className="font-mono text-[11px] font-bold">Print / PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Course Syllabus"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-black/60 hover:bg-[#540d18] border border-white/15 hover:border-[#dfb56c] text-[#d5cfc4] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            DEDICATED FORM NAVIGATION BAR (පාඨමාලා විෂය නිර්දේශ පෝරමයේ Navigation Bar එක)
           ========================================================================= */}
        <nav
          aria-label="Course Syllabus Navigation Bar"
          className="relative px-3 sm:px-6 py-2 bg-[#140e10] border-b border-[#dfb56c]/30 shadow-md shrink-0"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            {/* Course Selector Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#a89f91] hidden sm:inline">
                {isSinhalaMode ? 'පාඨමාලාව:' : 'Course:'}
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {publishedCourses.map((c) => {
                  const isSelected = activeCourse?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCourseId(c.id)}
                      className={`px-2.5 py-1 rounded text-xs font-editorial font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] shadow-sm ring-1 ring-[#dfb56c]/40'
                          : 'bg-black/60 hover:bg-[#1f1518] text-[#c2b9aa] border border-white/10'
                      }`}
                      title={c.title}
                    >
                      <Award className={`w-3.5 h-3.5 ${isSelected ? 'text-[#dfb56c]' : 'text-[#7a7268]'}`} />
                      <span className="text-[11px] sm:text-xs">
                        {isSinhalaMode && c.titleSinhala ? c.titleSinhala : c.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Bar Primary Links */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 border-t lg:border-t-0 border-white/10 lg:pl-3">
              {/* Tab 1: Topics Explorer (Corner Topic List + Reader) */}
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'modules'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black shadow-md shadow-[#c99a45]/20 font-bold'
                    : 'bg-black/50 hover:bg-[#201518] text-[#d5cfc4] border border-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'විෂය මාතෘකා (Topics)' : 'Syllabus Topics'}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    activeTab === 'modules'
                      ? 'bg-black text-[#dfb56c]'
                      : 'bg-[#540d18] text-[#f7e2a9]'
                  }`}
                >
                  {modules.length}
                </span>
              </button>

              {/* Tab 2: Inquiry & Fast Admission Form */}
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'form'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black shadow-md shadow-[#c99a45]/20 font-bold'
                    : 'bg-[#2b1016] hover:bg-[#3d1620] text-[#f7e2a9] border border-[#dfb56c]/40'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>{isSinhalaMode ? 'විමසීම් පෝරමය (Inquiry Form)' : 'Inquiry / Admission Form'}</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                  Open
                </span>
              </button>

              {/* Tab 3: Roadmap & Highlights */}
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'highlights'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black shadow-md shadow-[#c99a45]/20 font-bold'
                    : 'bg-black/50 hover:bg-[#201518] text-[#d5cfc4] border border-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'මාර්ග සිතියම (Roadmap)' : 'Roadmap & Highlights'}</span>
              </button>

              {/* Tab 4: Tools & Equipment */}
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'tools'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black shadow-md shadow-[#c99a45]/20 font-bold'
                    : 'bg-black/50 hover:bg-[#201518] text-[#d5cfc4] border border-white/10'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'මෙවලම් (Tools)' : 'Tools & Equipment'}</span>
              </button>

              {/* Tab 5: Accreditation & Diploma */}
              <button
                onClick={() => setActiveTab('cert')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'cert'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black shadow-md shadow-[#c99a45]/20 font-bold'
                    : 'bg-black/50 hover:bg-[#201518] text-[#d5cfc4] border border-white/10'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'සහතිකය (Diploma)' : 'Accreditation'}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* =========================================================================
            ACTIVE COURSE SUMMARY STRIP
           ========================================================================= */}
        {activeCourse && (
          <div className="px-4 py-2 sm:px-7 bg-black/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[#d5cfc4]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span className="text-white font-bold">{activeCourse.duration}</span>
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>
                  Physical:{' '}
                  <strong className="text-[#f7e2a9]">
                    {siteSettings.currency} {activeCourse.physicalFee.toLocaleString()}
                  </strong>
                  /mo
                </span>
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>
                  Zoom Live:{' '}
                  <strong className="text-[#f7e2a9]">
                    {siteSettings.currency} {activeCourse.zoomFee.toLocaleString()}
                  </strong>
                  /mo
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Topic Mode Switcher for Modules View */}
              {activeTab === 'modules' && (
                <div className="flex items-center gap-1 p-0.5 bg-black/80 rounded border border-white/10 text-[11px]">
                  <button
                    onClick={() => setTopicViewMode('explorer')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                      topicViewMode === 'explorer'
                        ? 'bg-[#dfb56c] text-black font-bold'
                        : 'text-[#a89f91] hover:text-white'
                    }`}
                    title="Corner Topic Navigator + Detail View"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Explorer</span>
                  </button>
                  <button
                    onClick={() => setTopicViewMode('grid')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                      topicViewMode === 'grid'
                        ? 'bg-[#dfb56c] text-black font-bold'
                        : 'text-[#a89f91] hover:text-white'
                    }`}
                    title="Grid Matrix of All Modules"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>Grid</span>
                  </button>
                </div>
              )}

              <span className="text-[11px] text-[#dfb56c] font-bold hidden md:inline">
                {activeCourse.intakeText || '🔥 2026 Batch Admissions Open'}
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            MAIN BODY / TAB CONTENT AREA
           ========================================================================= */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* =====================================================================
              NAV TAB 1: SYLLABUS TOPICS (WITH DEDICATED CORNER TOPIC NAVIGATOR)
             ===================================================================== */}
          {activeTab === 'modules' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
              {/* Mobile Drawer Floating Toggle Button */}
              <div className="md:hidden p-2.5 bg-[#170f12] border-b border-white/10 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setMobileTopicMenuOpen(!mobileTopicMenuOpen)}
                  className="btn-3d-secondary px-3 py-1.5 text-xs rounded flex items-center gap-2 text-[#f7e2a9]"
                >
                  <Menu className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>
                    {isSinhalaMode ? 'මාතෘකා ලැයිස්තුව (Topics Menu)' : 'Topic Navigator'} (
                    {filteredModules.length})
                  </span>
                </button>
                <span className="text-xs font-mono text-[#dfb56c]">
                  MOD {activeModule?.number || '01'}
                </span>
              </div>

              {/* -----------------------------------------------------------------
                  DEDICATED CORNER TOPIC NAVIGATION BAR (Sidebar / Edge Panel)
                  "topic patatath awa wena wenama kelaware tiyen awa balana piuliwna wena a"
                 ----------------------------------------------------------------- */}
              {(topicViewMode === 'explorer' || mobileTopicMenuOpen) && (
                <aside
                  aria-label="Topic Navigator"
                  className={`w-full md:w-80 lg:w-96 border-r border-[#dfb56c]/25 bg-[#120d0f] flex flex-col shrink-0 overflow-hidden ${
                    mobileTopicMenuOpen
                      ? 'fixed inset-x-0 top-32 bottom-12 z-30 p-2 bg-[#120d0f]/98 backdrop-blur-md'
                      : 'hidden md:flex'
                  }`}
                >
                  {/* Topic Sidebar Header & Search */}
                  <div className="p-3 border-b border-white/10 bg-black/40 space-y-2 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f7f3eb]">
                          {isSinhalaMode ? 'විෂය මාතෘකා (Topics Index)' : 'Module Topic Index'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30 font-bold">
                        {filteredModules.length} Topics
                      </span>
                    </div>

                    {/* Quick Search inside Topic Bar */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          isSinhalaMode
                            ? 'මාතෘකාව හෝ අංකය සොයන්න...'
                            : 'Filter topic, pattern, AI, number...'
                        }
                        className="w-full pl-8 pr-7 py-1.5 bg-black/70 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] placeholder-[#7a7268] outline-none"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#a89f91] hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 text-[10px]">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer font-mono ${
                          selectedCategory === 'all'
                            ? 'bg-[#dfb56c] text-black font-bold'
                            : 'bg-black/60 text-[#a89f91] hover:text-white border border-white/5'
                        }`}
                      >
                        All ({modules.length})
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer font-mono ${
                            selectedCategory === cat
                              ? 'bg-[#dfb56c] text-black font-bold'
                              : 'bg-black/60 text-[#a89f91] hover:text-white border border-white/5'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Topic List (වෙන වෙනම කෙළවරේ ඇති මාතෘකා ලැයිස්තුව) */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                    {filteredModules.map((mod) => {
                      const isSelected = activeModule?.id === mod.id;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleSelectModule(mod.id)}
                          className={`w-full text-left p-2.5 rounded-sm transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 group border ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#540d18] to-[#2c0e14] border-[#dfb56c] shadow-md ring-1 ring-[#dfb56c]/30 text-white'
                              : 'bg-black/40 hover:bg-[#1f1519] border-white/5 hover:border-white/20 text-[#d5cfc4]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            {/* Module Number Stamp */}
                            <span
                              className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                isSelected
                                  ? 'bg-black text-[#dfb56c] border border-[#dfb56c]'
                                  : 'bg-black/70 text-[#a89f91] border border-white/10 group-hover:text-[#dfb56c]'
                              }`}
                            >
                              MOD {mod.number}
                            </span>

                            <div className="min-w-0">
                              <p
                                className={`text-xs font-editorial font-bold truncate leading-tight ${
                                  isSelected ? 'text-[#f7e2a9]' : 'text-[#f7f3eb] group-hover:text-white'
                                }`}
                              >
                                {isSinhalaMode && mod.titleSinhala ? mod.titleSinhala : mod.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {mod.category && (
                                  <span className="text-[9px] font-mono text-[#a89f91] uppercase">
                                    {mod.category}
                                  </span>
                                )}
                                {isSinhalaMode && mod.titleSinhala && (
                                  <span className="text-[9px] text-[#7a7268] truncate hidden sm:inline">
                                    • {mod.title}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                              isSelected
                                ? 'text-[#dfb56c] translate-x-0.5'
                                : 'text-white/20 group-hover:text-white/60'
                            }`}
                          />
                        </button>
                      );
                    })}

                    {filteredModules.length === 0 && (
                      <div className="py-8 text-center text-[#a89f91]">
                        <p className="text-xs font-mono">No matching topics found.</p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                          className="mt-2 text-xs text-[#dfb56c] underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Corner Topic Bar Footer */}
                  <div className="p-2.5 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] font-mono text-[#a89f91] shrink-0">
                    <span>
                      {currentModuleIndex + 1} of {modules.length} selected
                    </span>
                    <button
                      onClick={() => handleInquireAboutModule(activeModule)}
                      className="text-[#dfb56c] hover:underline flex items-center gap-1"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Inquire</span>
                    </button>
                  </div>
                </aside>
              )}

              {/* -----------------------------------------------------------------
                  TOPIC DETAIL VIEWER CANVAS (Right Side Reader)
                  Allows in-depth viewing of each topic selected from the corner navigator
                 ----------------------------------------------------------------- */}
              {topicViewMode === 'explorer' && (
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#140e10] to-[#0f0b0c] space-y-6">
                  {activeModule ? (
                    <div className="space-y-6 max-w-4xl">
                      {/* Topic Header Card */}
                      <div className="p-5 sm:p-6 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#161012] border border-[#dfb56c]/30 shadow-xl space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase font-bold px-2.5 py-1 rounded bg-black/80 border border-[#dfb56c]/50 text-[#dfb56c]">
                              MODULE {activeModule.number}
                            </span>
                            {activeModule.category && (
                              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-[#540d18] text-[#f7e2a9] border border-white/10">
                                {activeModule.category}
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-mono text-[#a89f91]">
                            Topic {currentModuleIndex + 1} / {modules.length}
                          </span>
                        </div>

                        {/* Large Title */}
                        <h3 className="text-lg sm:text-2xl font-bold font-editorial text-[#f7f3eb] leading-snug">
                          {isSinhalaMode && activeModule.titleSinhala
                            ? activeModule.titleSinhala
                            : activeModule.title}
                        </h3>

                        {/* Bilingual English / Secondary Title */}
                        {isSinhalaMode && activeModule.titleSinhala && (
                          <p className="text-xs font-mono text-[#dfb56c]">
                            {activeModule.title}
                          </p>
                        )}

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#d5cfc4] leading-relaxed pt-2 border-t border-white/10 font-sinhala">
                          {isSinhalaMode && activeModule.descriptionSinhala
                            ? activeModule.descriptionSinhala
                            : activeModule.description}
                        </p>
                      </div>

                      {/* Practical Deliverables & Skills Card */}
                      <div className="p-5 rounded-sm bg-[#141011] border border-white/10 space-y-3 shadow-lg">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#dfb56c] font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#dfb56c]" />
                          <span>
                            {isSinhalaMode
                              ? 'ප්‍රායෝගික පුහුණුව සහ නිපුණතා (Key Practical Deliverables)'
                              : 'Practical Skills & Deliverables for this Module'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded bg-black/60 border border-white/5 space-y-2 text-xs text-[#d5cfc4]">
                          <p className="font-sinhala leading-relaxed">
                            {activeModule.description ||
                              'Hands-on practical pattern drafting and atelier garment construction guided by master instructors.'}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-[#a89f91]">
                            <div className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Industry-standard sloper execution</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Personalized pattern fit correction</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Physical studio machine practice</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Full portfolio project documentation</span>
                            </div>
                          </div>
                        </div>

                        {/* Optional Module Image if available */}
                        {activeModule.imageUrl && (
                          <div className="mt-3 rounded overflow-hidden border border-white/10 max-h-64">
                            <img
                              src={activeModule.imageUrl}
                              alt={activeModule.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      {/* Quick Inquiry CTA for this specific Topic */}
                      <div className="p-4 rounded-sm bg-[#181114] border border-[#dfb56c]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold font-editorial text-[#f7e2a9]">
                            {isSinhalaMode
                              ? `මෙම මාතෘකාව (${activeModule.title}) පිළිබඳ විමසන්න`
                              : `Have questions about Module ${activeModule.number}?`}
                          </h4>
                          <p className="text-[11px] text-[#a89f91] mt-0.5">
                            {isSinhalaMode
                              ? 'විෂය නිර්දේශයේ සම්පූර්ණ PDF පිටපත ඔබගේ WhatsApp වෙත ලබාගැනීමට පෝරමය යොමු කරන්න.'
                              : 'Request official curriculum syllabus PDF and intake schedules.'}
                          </p>
                        </div>

                        <button
                          onClick={() => handleInquireAboutModule(activeModule)}
                          className="btn-3d-gold px-4 py-2 text-xs uppercase tracking-wider font-bold text-black rounded flex items-center gap-1.5 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSinhalaMode ? 'පෝරමයට යන්න' : 'Inquire on Form'}</span>
                        </button>
                      </div>

                      {/* Step Navigation Controls (Prev / Next Topic Buttons) */}
                      <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                        {prevModule ? (
                          <button
                            onClick={() => handleSelectModule(prevModule.id)}
                            className="btn-3d-secondary px-3 sm:px-4 py-2 text-xs rounded flex items-center gap-2 text-[#d5cfc4]"
                          >
                            <ChevronLeft className="w-4 h-4 text-[#dfb56c]" />
                            <div className="text-left hidden sm:block">
                              <span className="text-[9px] font-mono text-[#a89f91] block">
                                Previous
                              </span>
                              <span className="font-bold truncate max-w-[150px] block">
                                MOD {prevModule.number}
                              </span>
                            </div>
                            <span className="sm:hidden">Prev (MOD {prevModule.number})</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        {nextModule ? (
                          <button
                            onClick={() => handleSelectModule(nextModule.id)}
                            className="btn-3d-gold px-3 sm:px-4 py-2 text-xs uppercase tracking-wider rounded font-bold text-black flex items-center gap-2"
                          >
                            <div className="text-right hidden sm:block">
                              <span className="text-[9px] font-mono text-black/70 block">
                                Next Topic
                              </span>
                              <span className="font-bold truncate max-w-[150px] block">
                                MOD {nextModule.number}
                              </span>
                            </div>
                            <span className="sm:hidden">Next (MOD {nextModule.number})</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-[#a89f91]">
                      <p className="text-sm font-mono">Select a topic from the side list to view details.</p>
                    </div>
                  )}
                </main>
              )}

              {/* -----------------------------------------------------------------
                  OPTIONAL FULL GRID MATRIX VIEW
                 ----------------------------------------------------------------- */}
              {topicViewMode === 'grid' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-[#0f0b0c]">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-base font-bold font-editorial text-[#f7e2a9]">
                        All {modules.length} Modules Matrix
                      </h3>
                      <p className="text-xs text-[#a89f91]">
                        Click any module to read full topic specifications.
                      </p>
                    </div>
                    <button
                      onClick={() => setTopicViewMode('explorer')}
                      className="btn-3d-secondary px-3 py-1.5 text-xs rounded flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Back to Topic Navigator</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModules.map((mod) => (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setTopicViewMode('explorer');
                        }}
                        className="rounded-sm p-4 bg-[#141011] border border-white/10 hover:border-[#dfb56c] transition-all cursor-pointer group flex flex-col justify-between shadow-md hover:shadow-xl"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/80 border border-[#dfb56c]/30 text-[#dfb56c]">
                              MODULE {mod.number}
                            </span>
                            {mod.category && (
                              <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded bg-[#540d18]/70 text-[#f7e2a9]">
                                {mod.category}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors">
                            {isSinhalaMode && mod.titleSinhala ? mod.titleSinhala : mod.title}
                          </h4>
                          <p className="text-xs text-[#a89f91] mt-2 line-clamp-2 font-sinhala">
                            {isSinhalaMode && mod.descriptionSinhala
                              ? mod.descriptionSinhala
                              : mod.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#dfb56c]">
                          <span>Read Topic</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              NAV TAB 2: INQUIRY & ADMISSION FORM
             ===================================================================== */}
          {activeTab === 'form' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-5 sm:p-6 rounded-sm bg-gradient-to-br from-[#1c1214] via-[#241317] to-[#141011] border border-[#dfb56c]/30 shadow-2xl">
                  <div className="text-center max-w-lg mx-auto mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#540d18] border border-[#dfb56c]/40 mx-auto mb-3 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#dfb56c]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#f7e2a9]">
                      {isSinhalaMode
                        ? 'විෂය නිර්දේශය විමසීම සහ කඩිනම් ලියාපදිංචි පෝරමය'
                        : 'Course Syllabus Inquiry & Fast Admission Form'}
                    </h3>
                    <p className="text-xs text-[#d5cfc4] mt-1 font-sinhala">
                      {isSinhalaMode
                        ? 'ඔබට අවශ්‍ය පාඨමාලාව තෝරා මෙම පෝරමය සම්පූර්ණ කරන්න. සම්පූර්ණ විෂය නිර්දේශය PDF ආකාරයෙන් ඔබගේ WhatsApp අංකයට ක්ෂණිකව ලබාගත හැක.'
                        : 'Complete this form to receive the official full syllabus PDF directly on WhatsApp and reserve your intake seat.'}
                    </p>
                  </div>

                  {formSubmitted ? (
                    <div className="p-6 rounded bg-black/60 border border-green-500/40 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-green-900/50 border border-green-400 mx-auto flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-300" />
                      </div>
                      <h4 className="text-base font-bold font-editorial text-green-300">
                        {isSinhalaMode
                          ? 'ඔබගේ විමසීම සාර්ථකව යොමු විය!'
                          : 'Syllabus Inquiry Submitted Successfully!'}
                      </h4>
                      <p className="text-xs text-[#d5cfc4] font-sinhala max-w-md mx-auto">
                        {isSinhalaMode
                          ? 'අපගේ අධ්‍යයන අංශය ඔබගේ WhatsApp අංකය ඔස්සේ සම්පූර්ණ විෂය නිර්දේශය සහ ලියාපදිංචි විස්තර සමගින් ඉක්මනින්ම ඔබව සම්බන්ධ කරගනු ඇත.'
                          : 'Our academic admissions team will contact you shortly with the syllabus documents and batch enrollment details.'}
                      </p>
                      <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormSubmitted(false)}
                          className="btn-3d-secondary px-4 py-2 text-xs rounded"
                        >
                          {isSinhalaMode ? 'තවත් විමසීමක් කරන්න' : 'Submit Another Inquiry'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="btn-3d-gold px-5 py-2 text-xs uppercase tracking-wider font-bold rounded text-black"
                        >
                          {isSinhalaMode ? 'වසන්න (Done)' : 'Close'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {formError && (
                        <div className="p-3 rounded bg-red-900/40 border border-red-500/50 text-xs text-red-200">
                          {formError}
                        </div>
                      )}

                      {/* Selected Course Display */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#dfb56c] font-bold mb-1">
                          Selected Course Program (තෝරාගත් පාඨමාලාව)
                        </label>
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full p-2.5 bg-black/80 border border-white/20 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] outline-none"
                        >
                          {publishedCourses.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#141011]">
                              {c.title} ({c.duration})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#a89f91] mb-1">
                          Full Name (ඔබගේ සම්පූර්ණ නම) *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#a89f91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Kasuni Perera"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/80 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] outline-none"
                          />
                        </div>
                      </div>

                      {/* WhatsApp Phone Number */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#a89f91] mb-1">
                          WhatsApp Contact Number (WhatsApp දුරකථන අංකය) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#dfb56c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            placeholder="e.g. 077 123 4567"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/80 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] font-mono outline-none"
                          />
                        </div>
                        <span className="text-[10px] text-[#a89f91] block mt-1">
                          විෂය නිර්දේශයේ PDF පිටපත මෙම WhatsApp අංකයට එවනු ලැබේ.
                        </span>
                      </div>

                      {/* Class Mode & Studio Branch */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#a89f91] mb-1">
                            Learning Mode (පන්ති ක්‍රමය)
                          </label>
                          <select
                            value={formData.courseType}
                            onChange={(e) =>
                              setFormData({ ...formData, courseType: e.target.value as CourseType })
                            }
                            className="w-full p-2.5 bg-black/80 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] outline-none"
                          >
                            <option value="PHYSICAL CLASS" className="bg-[#141011]">
                              භෞතික පන්ති (Physical Studio)
                            </option>
                            <option value="ZOOM CLASS" className="bg-[#141011]">
                              Zoom Live HD (Online)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-[#a89f91] mb-1">
                            Studio Branch (ශාඛාව)
                          </label>
                          <select
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2.5 bg-black/80 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] outline-none"
                          >
                            {locations
                              .filter((l) => l.isActive !== false)
                              .map((loc) => (
                                <option key={loc.id} value={loc.name} className="bg-[#141011]">
                                  {loc.name} Studio
                                </option>
                              ))}
                            <option value="ZOOM ONLINE" className="bg-[#141011]">
                              Island-wide / Overseas (Zoom)
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Inquiry Message / Questions */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#a89f91] mb-1">
                          Any Questions about the Syllabus? (විමසීම් හෝ ප්‍රශ්න)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.inquiryMessage}
                          onChange={(e) => setFormData({ ...formData, inquiryMessage: e.target.value })}
                          placeholder={
                            isSinhalaMode
                              ? 'විෂය නිර්දේශය, පන්ති වේලාවන් හෝ ගාස්තු පිළිබඳව ඔබගේ ප්‍රශ්න ඇතුළත් කරන්න...'
                              : 'Ask any questions regarding modules, class schedules, or machine access...'
                          }
                          className="w-full p-2.5 bg-black/80 border border-white/15 focus:border-[#dfb56c] rounded text-xs text-[#f7f3eb] outline-none font-sinhala"
                        />
                      </div>

                      {/* PDF Request Checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#d5cfc4]">
                        <input
                          type="checkbox"
                          checked={formData.sendPdfToWhatsApp}
                          onChange={(e) =>
                            setFormData({ ...formData, sendPdfToWhatsApp: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#dfb56c]"
                        />
                        <span>
                          {isSinhalaMode
                            ? 'සම්පූර්ණ පාඨමාලා විෂය නිර්දේශය PDF මාර්ගගතව මගේ WhatsApp වෙත එවන්න.'
                            : 'Send official Syllabus PDF directly to my WhatsApp number.'}
                        </span>
                      </label>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-3d-gold w-full py-3 text-xs uppercase tracking-widest font-bold text-black rounded flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {submitting ? (
                            <span>සකසමින් පවතී...</span>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>
                                {isSinhalaMode
                                  ? 'විෂය නිර්දේශය විමසන්න සහ ලියාපදිංචි වන්න'
                                  : 'Submit Syllabus Inquiry & Connect on WhatsApp'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              NAV TAB 3: CURRICULUM ROADMAP & HIGHLIGHTS
             ===================================================================== */}
          {activeTab === 'highlights' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              <div className="p-5 rounded-sm bg-[#141011] border border-[#dfb56c]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[#540d18] border border-[#dfb56c]/40 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-[#dfb56c]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-editorial text-[#f7e2a9]">
                      {isSinhalaMode
                        ? 'මාස 6 ක අධ්‍යයන මාර්ග සිතියම (Academic Progression Roadmap)'
                        : 'Structured 6-Month Couture Progression Roadmap'}
                    </h3>
                    <p className="text-xs text-[#d5cfc4] font-sinhala">
                      {isSinhalaMode
                        ? 'ආරම්භක අදියරේ සිට අන්තර්ජාතික මට්ටමේ සන්නාම හිමිකරුවෙකු දක්වා ඔබව රැගෙන යන පියවරෙන් පියවර මාර්ග සිතියම.'
                        : 'From foundational anatomy slopers to runway-ready garments, AI brand lookbooks, and global export packaging.'}
                    </p>
                  </div>
                </div>

                {/* 6-Month Progression Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {[
                    {
                      phase: 'Month 01',
                      titleEn: 'Foundational Slopers & Anthropometry',
                      titleSi: 'ශරීර මිණුම් සහ මූලික පැටර්න් බ්ලොක්ස්',
                      descEn:
                        'Individual anatomical measurements, ease allowances, master bodice, skirt, and sleeve master slopers.',
                      color: 'from-amber-900/30 to-amber-950/20',
                    },
                    {
                      phase: 'Month 02',
                      titleEn: 'Dart Manipulation & Architectural Contouring',
                      titleSi: 'ඩාර්ට් හැසිරවීම සහ උසස් හැඩතල නිර්මාණය',
                      descEn:
                        'Slash and spread, pivotal dart rotation, princess seams, necklines, collars, and tailored fit geometry.',
                      color: 'from-rose-900/30 to-rose-950/20',
                    },
                    {
                      phase: 'Month 03',
                      titleEn: 'French Draping & Haute Couture Eveningwear',
                      titleSi: 'ප්‍රංශ ඩ්‍රේපින් සහ උසස් විලාසිතා නිර්මාණ',
                      descEn:
                        '3D fabric manipulation directly on padded dress forms, bias cut drapes, corsetry boning, and bridal structures.',
                      color: 'from-purple-900/30 to-purple-950/20',
                    },
                    {
                      phase: 'Month 04',
                      titleEn: 'Industrial Garment Assembly & Finishing',
                      titleSi: 'කාර්මික මැහුම් සහ ඇඟලුම් නිමාව',
                      descEn:
                        'Lockstitch & 4-thread overlock machinery operations, tailored jackets, invisible zips, tailored linings.',
                      color: 'from-blue-900/30 to-blue-950/20',
                    },
                    {
                      phase: 'Month 05',
                      titleEn: 'AI Generative Fashion & 3D Lookbooks',
                      titleSi: 'AI විලාසිතා තාක්ෂණය සහ ඩිජිටල් Lookbooks',
                      descEn:
                        'Generative AI prompts, hyper-realistic runway avatar lookbooks, tech pack generation, digital fabric rendering.',
                      color: 'from-emerald-900/30 to-emerald-950/20',
                    },
                    {
                      phase: 'Month 06',
                      titleEn: 'Brand Launch, Runway Showcase & Global Sales',
                      titleSi: 'සන්නාම ආරම්භය, රන්වේ ෂෝ සහ අලෙවිකරණය',
                      descEn:
                        'High-ticket luxury pricing, luxury swing tags & packaging, runway graduation collection, international export.',
                      color: 'from-yellow-900/30 to-yellow-950/20',
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-sm border border-white/10 bg-gradient-to-b ${step.color} flex flex-col justify-between`}
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#dfb56c] px-2 py-0.5 rounded bg-black/60 border border-[#dfb56c]/30">
                          {step.phase}
                        </span>
                        <h4 className="text-sm font-bold font-editorial text-white mt-2">
                          {isSinhalaMode ? step.titleSi : step.titleEn}
                        </h4>
                        <p className="text-xs text-[#d5cfc4] mt-1.5 leading-relaxed font-sinhala">
                          {step.descEn}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-[#dfb56c]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Practical Portfolio Deliverable</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course-Specific Syllabus Highlights */}
              {activeCourse?.syllabusOverview && activeCourse.syllabusOverview.length > 0 && (
                <div className="p-5 rounded-sm bg-[#141011] border border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold mb-3">
                    {isSinhalaMode ? 'පාඨමාලාවේ ප්‍රධාන විශේෂාංග' : 'Curriculum Milestones Checklist'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {activeCourse.syllabusOverview.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded bg-black/50 border border-white/5 text-xs text-[#d5cfc4]"
                      >
                        <Check className="w-4 h-4 text-[#dfb56c] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              NAV TAB 4: TOOLS & EQUIPMENT
             ===================================================================== */}
          {activeTab === 'tools' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              <div className="p-5 rounded-sm bg-[#141011] border border-[#dfb56c]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[#540d18] border border-[#dfb56c]/40 flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-[#dfb56c]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-editorial text-[#f7e2a9]">
                      {isSinhalaMode
                        ? 'අධ්‍යයන මෙවලම් සහ කාර්මික යන්ත්‍රෝපකරණ'
                        : 'Atelier Equipment, Pattern Tools & Studio Machinery'}
                    </h3>
                    <p className="text-xs text-[#d5cfc4] font-sinhala">
                      {isSinhalaMode
                        ? 'ප්‍රායෝගික පාඨමාලාව සඳහා අපගේ Studio පරිශ්‍රයේ ඇති උපකරණ සහ ඔබ සතුව තිබිය යුතු මෙවලම් කට්ටලය.'
                        : 'Everything provided at our physical studios and recommended for home studio setup.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="p-4 rounded-sm bg-black/50 border border-white/10 space-y-3">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-2">
                      <Scissors className="w-4 h-4" />
                      1. Pattern Drafting & Cutting Kit
                    </span>
                    <ul className="text-xs text-[#d5cfc4] space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>French Curve & Vary Form Curve Rulers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>L-Square Rulers (Metric & Imperial)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Heavy-duty Pattern Notcher & Tracing Wheel</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Tailor's Chalk, Carbon Paper, and Awl Punch</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-sm bg-black/50 border border-white/10 space-y-3">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      2. Machinery Provided at Atelier Studios
                    </span>
                    <ul className="text-xs text-[#d5cfc4] space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Industrial High-Speed Single Needle Lockstitch Machines</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>4-Thread Industrial Overlock / Serger Machines</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Industrial Vacuum Ironing Table & Gravity Feed Steam Irons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Professional Padded Dress Mannequins (UK 8 - 16)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-sm bg-black/50 border border-white/10 space-y-3">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      3. AI Fashion & Digital Software Stack
                    </span>
                    <ul className="text-xs text-[#d5cfc4] space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Generative AI Fashion Prompt Architecture</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Digital Tech Pack Templates in Excel & PDF</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>High-Resolution 3D Fashion Runway Lookbook Generator</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-sm bg-black/50 border border-white/10 space-y-3">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      4. Atelier Materials & Swatches Provided
                    </span>
                    <ul className="text-xs text-[#d5cfc4] space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Pattern Drafting Paper Rolls & Muslin Fabric for Slopers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Comprehensive Sri Lanka Fabric Wholesaler Directory</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Haberdashery Starter Kit (Boning, Interlining, Zippers)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              NAV TAB 5: ACCREDITATION & GRADUATE RUNWAY
             ===================================================================== */}
          {activeTab === 'cert' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              <div className="p-5 sm:p-6 rounded-sm bg-[#141011] border border-[#dfb56c]/30 text-center max-w-3xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#540d18] border border-[#dfb56c] mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-7 h-7 text-[#dfb56c]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#f7e2a9]">
                  {isSinhalaMode
                    ? 'වෘත්තීය ඩිප්ලෝමා සහතිකය සහ විලාසිතා සංදර්ශන අවස්ථාව'
                    : 'Accredited Fashion Diploma & Runway Showcase'}
                </h3>
                <p className="text-xs text-[#d5cfc4] mt-2 leading-relaxed font-sinhala">
                  {isSinhalaMode
                    ? 'Ceylon Style Studio වෙතින් පිරිනමන පිළිගත් වෘත්තීය ඩිප්ලෝමා සහතිකය සහ වාර්ෂික විලාසිතා දැක්මේදී ඔබගේම නිර්මාණ ප්‍රදර්ශනය කිරීමේ සුවිශේෂී අවස්ථාව.'
                    : 'Graduates receive the recognized Professional Diploma in Haute Couture & Fashion Branding, plus entry to showcase garments on the annual runway stage.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-left">
                  <div className="p-3.5 rounded bg-black/60 border border-white/10">
                    <div className="flex items-center gap-2 text-[#dfb56c] font-mono text-xs font-bold mb-1">
                      <GraduationCap className="w-4 h-4" />
                      Diploma Certificate
                    </div>
                    <p className="text-[11px] text-[#c2b9aa]">
                      Official engraved Diploma with verification QR code & student ID.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-black/60 border border-white/10">
                    <div className="flex items-center gap-2 text-[#dfb56c] font-mono text-xs font-bold mb-1">
                      <Crown className="w-4 h-4" />
                      Runway Fashion Week
                    </div>
                    <p className="text-[11px] text-[#c2b9aa]">
                      Model showcase of your couture collection before media & buyers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-black/60 border border-white/10">
                    <div className="flex items-center gap-2 text-[#dfb56c] font-mono text-xs font-bold mb-1">
                      <Award className="w-4 h-4" />
                      Lifetime Alumni Network
                    </div>
                    <p className="text-[11px] text-[#c2b9aa]">
                      Access to fabric sourcing discounts, masterclass updates & job leads.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="btn-3d-gold px-6 py-2.5 text-xs uppercase tracking-widest font-bold text-black rounded"
                  >
                    {isSinhalaMode ? 'විෂය නිර්දේශ විමසීම් පෝරමයට යන්න' : 'Proceed to Inquiry Form'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            MODAL FOOTER WITH INSTANT ACTIONS
           ========================================================================= */}
        <div className="px-4 py-2.5 sm:px-7 bg-[#140e10] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#a89f91]">
            <Award className="w-4 h-4 text-[#dfb56c]" />
            <span className="font-sinhala text-[11px] sm:text-xs">
              {isSinhalaMode
                ? 'පිළිගත් වෘත්තීය ඩිප්ලෝමා සහතිකය සහ විලාසිතා සංදර්ශන අවස්ථාව'
                : 'Recognized Professional Diploma & Graduate Runway Showcase'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'modules' ? 'form' : 'modules')}
              className="text-xs font-mono text-[#dfb56c] hover:underline cursor-pointer"
            >
              {activeTab === 'modules'
                ? '→ Switch to Inquiry Form'
                : '← Back to Topics Explorer'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-sm bg-black/60 hover:bg-black/90 border border-white/15 text-[#d5cfc4] text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
