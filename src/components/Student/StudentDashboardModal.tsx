import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle,
  Clock,
  Lock,
  Upload,
  FileText,
  Download,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  Building,
  CreditCard,
  Copy,
  Check,
  LogOut,
  AlertCircle,
  HelpCircle,
  BookOpen,
  User,
  ShieldCheck,
  Eye,
  Crown,
  Layers,
  Award,
  ArrowRight,
  CheckSquare,
  Square,
  Bot,
  Video,
  ExternalLink,
  Calendar,
  Unlock,
  GraduationCap,
  RefreshCw,
  Menu,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Lesson, PaymentSlip, CourseItem, LiveZoomClass, StudentSubscription, LessonVideoItem, LessonMaterialItem } from '../../types';
import { ThreeDSlidingShowcase } from './ThreeDSlidingShowcase';
import { MobileActionDock } from './MobileActionDock';
import { CourseCommunityTab } from './CourseCommunityTab';
import { parseYouTubeVideoId } from '../../lib/mediaUtils';

// Lazy loading for heavy studio modules to optimize mobile startup and code-splitting
const BrandMakingModule = React.lazy(() =>
  import('./BrandMakingModule').then((m) => ({ default: m.BrandMakingModule }))
);
const FashionMentorChat = React.lazy(() =>
  import('./FashionMentorChat').then((m) => ({ default: m.FashionMentorChat }))
);

interface StudentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { studentUser, logoutStudent } = useAuth();
  const {
    siteSettings,
    courses,
    lessons,
    modules,
    paymentSlips,
    zoomClasses,
    subscriptions,
    uploadPaymentSlip,
    markLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessedLesson,
    toggleStudentPaidMonth,
    getStudentPaidMonths,
    approvePaymentSlip,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'subscriptions'
    | 'lessons'
    | 'zoom'
    | 'community'
    | 'tracker'
    | 'mentor'
    | 'brand'
    | 'brand_module'
    | 'upload_payment'
    | 'payments'
    | 'profile'
    | 'support'
  >('overview');

  // Selected Course for LMS Content & Zoom
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return studentUser?.courseId || 'course-01';
  });

  // Month filter for Course Lessons & Materials (0 = all months, 1..6 = specific month)
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number>(1);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [activeLessonVideoIndex, setActiveLessonVideoIndex] = useState<number>(0);
  const [copiedBank, setCopiedBank] = useState<boolean>(false);
  const [copiedZoomId, setCopiedZoomId] = useState<string | null>(null);
  const [copiedZoomPass, setCopiedZoomPass] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showThreeDShowcase, setShowThreeDShowcase] = useState<boolean>(true);

  // Payment Slip Upload Form State
  const [slipForm, setSlipForm] = useState({
    courseId: studentUser?.courseId || 'course-01',
    month: 1,
    amount: siteSettings.physicalFee || 2500,
    paymentType: 'Monthly Fee',
    paymentDate: new Date().toISOString().split('T')[0],
    bankName: siteSettings.bankName,
    transactionReference: '',
    slipUrl: '',
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  if (!isOpen || !studentUser) return null;

  // STRICT STUDENT-SIDE DATA ISOLATION:
  // Student can ONLY access courses they are enrolled in
  const enrolledCourses = React.useMemo(() => {
    const ids = new Set<string>();
    if (studentUser.courseId) ids.add(studentUser.courseId);
    if (Array.isArray(studentUser.enrolledCourseIds)) {
      studentUser.enrolledCourseIds.forEach((id) => ids.add(id));
    }
    const filtered = courses.filter((c) => ids.has(c.id));
    return filtered.length > 0 ? filtered : courses.filter((c) => c.id === studentUser.courseId);
  }, [courses, studentUser]);

  // Active course item strictly constrained to enrolled courses
  const currentCourse: CourseItem | undefined =
    enrolledCourses.find((c) => c.id === selectedCourseId) || enrolledCourses[0] || courses[0];

  // Active paid months for this student and selected course
  const activePaidMonths = getStudentPaidMonths(studentUser.id, currentCourse?.id || selectedCourseId);

  // Student specific slips from Firestore
  const studentSlips = paymentSlips.filter(
    (s) => s.regNumber === studentUser.regNumber || (s.studentId && s.studentId === studentUser.id)
  );

  // Student subscriptions from Firestore
  const studentSubscriptions = subscriptions.filter(
    (s) => s.regNumber === studentUser.regNumber || s.studentId === studentUser.id
  );

  const completedLessonIds = studentUser.completedLessonIds || [];

  // Filter lessons STRICTLY for this enrolled course & month
  const publishedLessons = lessons.filter((l) => l.isPublished !== false);
  const courseLessons = publishedLessons.filter(
    (l) => l.courseId === currentCourse?.id
  );

  const displayedLessons =
    selectedMonthFilter === 0
      ? courseLessons
      : courseLessons.filter((l) => (l.month ?? 1) === selectedMonthFilter);

  const currentLesson: Lesson | undefined =
    displayedLessons[selectedLessonIndex] || displayedLessons[0] || courseLessons[0];

  // Dynamic Content Access Restriction calculation
  const isCourseUnlocked = studentUser.courseAccess === 'ACTIVE';
  const currentLessonMonth = currentLesson?.month || selectedMonthFilter || 1;
  const isCurrentMonthPaid = activePaidMonths.includes(currentLessonMonth);
  // Both general course access and the specific paid month must be active
  const isLessonAccessible = isCourseUnlocked && isCurrentMonthPaid;

  // Multi-Video support for current lesson
  const currentLessonVideos: LessonVideoItem[] = React.useMemo(() => {
    if (!currentLesson) return [];
    if (Array.isArray(currentLesson.videoUrls) && currentLesson.videoUrls.length > 0) {
      return currentLesson.videoUrls.filter((v) => Boolean(v && (v.videoUrl || v.videoId)));
    }
    if (currentLesson.videoUrl || currentLesson.videoId) {
      return [
        {
          id: `vid-${currentLesson.id}-0`,
          title: currentLesson.title,
          videoUrl: currentLesson.videoUrl,
          videoId: currentLesson.videoId,
          duration: currentLesson.duration,
        },
      ];
    }
    return [];
  }, [currentLesson]);

  const activeLessonVideo: LessonVideoItem | undefined =
    currentLessonVideos[activeLessonVideoIndex] || currentLessonVideos[0];

  // Multi-PDF materials support for current lesson
  const currentLessonPdfs: LessonMaterialItem[] = React.useMemo(() => {
    if (!currentLesson) return [];
    if (Array.isArray(currentLesson.pdfMaterials) && currentLesson.pdfMaterials.length > 0) {
      return currentLesson.pdfMaterials.filter((p) => Boolean(p && p.url));
    }
    if (currentLesson.pdfUrl) {
      return [
        {
          id: `pdf-${currentLesson.id}-0`,
          title: currentLesson.pdfTitle || `Lesson_${currentLesson.lessonNumber}_Handout.pdf`,
          url: currentLesson.pdfUrl,
        },
      ];
    }
    return [];
  }, [currentLesson]);

  const progressPercent = courseLessons.length
    ? Math.round((completedLessonIds.filter((id) => courseLessons.some((l) => l.id === id)).length / courseLessons.length) * 100)
    : 0;

  // Zoom classes STRICTLY isolated for this enrolled course
  const courseZoomClasses = zoomClasses.filter(
    (z) => z.courseId === currentCourse?.id
  );

  // File download helper
  const handleDownloadFile = async (url: string, filename: string) => {
    if (!isLessonAccessible) {
      alert(`Access Restricted: Month ${currentLessonMonth} payment verification is required to download this PDF.`);
      return;
    }

    try {
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (_) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size must be under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadPreview(result);
        setSlipForm((prev) => ({ ...prev, slipUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipForm.slipUrl) {
      alert('කරුණාකර බැංකු රිසිට්පතේ ඡායාරූපය හෝ PDF ගොනුව Upload කරන්න.');
      return;
    }

    setUploading(true);
    try {
      await uploadPaymentSlip({
        studentId: studentUser.id,
        regNumber: studentUser.regNumber,
        studentName: studentUser.fullName,
        whatsappNumber: studentUser.whatsappNumber,
        courseId: slipForm.courseId,
        courseTitle: courses.find((c) => c.id === slipForm.courseId)?.title || currentCourse?.title,
        month: Number(slipForm.month),
        paymentType: slipForm.paymentType,
        amount: Number(slipForm.amount),
        paymentDate: slipForm.paymentDate,
        bankName: slipForm.bankName,
        transactionReference: slipForm.transactionReference,
        slipUrl: slipForm.slipUrl,
      });
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setActiveTab('payments');
      }, 2000);
    } catch (err) {
      alert('Error uploading payment slip. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(siteSettings.bankAccountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const copyText = (txt: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(txt);
    if (type === 'id') {
      setCopiedZoomId(txt);
      setTimeout(() => setCopiedZoomId(null), 2000);
    } else {
      setCopiedZoomPass(txt);
      setTimeout(() => setCopiedZoomPass(null), 2000);
    }
  };

  const getEmbedUrl = (urlOrId: string) => {
    const videoId = parseYouTubeVideoId(urlOrId) || 'dQw4w9WgXcQ';
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;
  };

  const monthLabels = [
    { month: 1, title: 'Month 01: Foundations & Anatomy', titleSi: 'ශරීර මිණුම් සහ මූලික පදනම' },
    { month: 2, title: 'Month 02: Pattern Drafting & Slopers', titleSi: 'මූලික පැටර්න් බ්ලොක්' },
    { month: 3, title: 'Month 03: Haute Couture & Darts', titleSi: 'ඩර්ට් හැසිරවීම සහ විලාසිතා' },
    { month: 4, title: 'Month 04: Draping & Grading', titleSi: 'ඩ්‍රේපින් සහ සයිස් ග්‍රේඩින්' },
    { month: 5, title: 'Month 05: Brand Identity & AI Tech', titleSi: 'සන්නාමකරණය සහ AI තාක්ෂණය' },
    { month: 6, title: 'Month 06: Grand Runway & Diploma', titleSi: 'අවසාන විලාසිතා දැක්ම සහ සහතිකය' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col font-sans">
      {/* Top Header Bar */}
      <div className="bg-[#141011] border-b border-[#c99a45]/30 px-3 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Navigation Drawer Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#dfb56c] hover:text-[#f7e2a9] hover:bg-white/5 rounded-sm border border-[#c99a45]/30"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1px] shadow-md shadow-[#c99a45]/20">
            <div className="w-full h-full bg-[#141011] rounded-sm flex items-center justify-center">
              <span className="font-editorial text-sm font-bold text-[#f7e2a9]">CSS</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] truncate max-w-[140px] sm:max-w-none">
                {studentUser.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 shrink-0">
                {studentUser.regNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10.5px] sm:text-[11px] text-[#a89f91] hidden md:inline">
                {studentUser.courseType} • {studentUser.location || 'Online Atelier'} •
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#dfb56c] font-bold hidden xs:inline">Course:</span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedLessonIndex(0);
                    setSlipForm((prev) => ({ ...prev, courseId: e.target.value }));
                  }}
                  className="px-2 py-0.5 bg-[#0e0a0b] border border-[#dfb56c]/50 text-[#f7e2a9] text-[10.5px] rounded outline-none font-medium max-w-[150px] xs:max-w-[190px] sm:max-w-[260px] truncate cursor-pointer hover:border-[#dfb56c]"
                  title="Switch Active Course (පාඨමාලාව තෝරන්න)"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators & Direct Subscription Button */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Direct Mobile Quick Subscription Button (Answers: meke monthly subcription kaa koheda tiyenea) */}
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="px-2.5 py-1.5 rounded-sm text-[11px] font-mono font-bold bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] hover:bg-[#6e1322] flex items-center gap-1.5 shadow-md shadow-[#540d18]/40"
            title="Open Monthly Subscriptions & Active Months"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span className="hidden xs:inline">Monthly Sub:</span>
            <span className="text-green-300">M0{activePaidMonths.join(',') || 'None'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold border ${
                studentUser.paymentStatus === 'VERIFIED'
                  ? 'bg-green-950/60 text-green-300 border-green-500'
                  : studentUser.paymentStatus === 'REJECTED'
                  ? 'bg-red-950/60 text-red-300 border-red-500'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500 animate-pulse'
              }`}
            >
              Slip: {studentUser.paymentStatus}
            </span>

            <span
              className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold border ${
                isCourseUnlocked
                  ? 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
            >
              Access: {studentUser.courseAccess}
            </span>
          </div>

          <button
            onClick={() => {
              logoutStudent();
              onClose();
            }}
            className="px-2.5 sm:px-3 py-1.5 text-xs text-[#a89f91] hover:text-white border border-white/10 rounded hover:bg-white/5 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-[#a89f91] hover:text-white rounded hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Slide-in Drawer with Framer Motion Spring Animations */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="fixed top-0 bottom-0 left-0 w-72 bg-[#0e0a0b] border-r border-[#c99a45]/40 p-4 z-50 lg:hidden flex flex-col justify-between overflow-y-auto shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <span className="text-xs font-mono font-bold text-[#dfb56c] uppercase tracking-widest">
                      Portal Navigation
                    </span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 text-[#a89f91] hover:text-white rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {[
                      { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
                      {
                        id: 'subscriptions',
                        label: 'Monthly Subscriptions & Months',
                        icon: <CreditCard className="w-4 h-4" />,
                        badge: `M${activePaidMonths.join(',') || 'None'}`,
                        badgeColor: 'bg-green-950/70 text-green-300 border-green-500/50',
                        isHighlighted: true,
                      },
                      {
                        id: 'lessons',
                        label: 'Course Lessons & PDFs',
                        icon: <BookOpen className="w-4 h-4" />,
                        badge: `${courseLessons.length}`,
                        badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/50',
                      },
                      {
                        id: 'zoom',
                        label: 'Live Zoom Classes',
                        icon: <Video className="w-4 h-4" />,
                        badge: courseZoomClasses.some((z) => z.status === 'LIVE') ? 'LIVE NOW' : 'Schedule',
                        badgeColor: courseZoomClasses.some((z) => z.status === 'LIVE')
                          ? 'bg-red-600 text-white font-bold animate-pulse'
                          : 'bg-zinc-800 text-[#dfb56c] border border-[#dfb56c]/30',
                      },
                      {
                        id: 'community',
                        label: 'Atelier Community & Q&A',
                        icon: <MessageSquare className="w-4 h-4" />,
                        badge: 'Forum',
                        badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/60',
                      },
                      {
                        id: 'tracker',
                        label: '6-Month Progress',
                        icon: <Layers className="w-4 h-4" />,
                        badge: `${progressPercent}%`,
                        badgeColor:
                          progressPercent >= 80
                            ? 'bg-green-950/70 text-green-300 border-green-500'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500',
                      },
                      {
                        id: 'mentor',
                        label: 'AI Fashion Mentor',
                        icon: <Bot className="w-4 h-4" />,
                        badge: 'Live AI',
                        badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]',
                      },
                      {
                        id: 'brand',
                        label: 'Brand Purpose (Mod 02)',
                        icon: <Crown className="w-4 h-4" />,
                        badge: studentUser.brandModuleApproved ? 'Approved' : 'Locked',
                        badgeColor: studentUser.brandModuleApproved
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700',
                      },
                      { id: 'upload_payment', label: 'Upload Payment Slip', icon: <Upload className="w-4 h-4" /> },
                      { id: 'payments', label: `Slip History (${studentSlips.length})`, icon: <CreditCard className="w-4 h-4" /> },
                      { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> },
                      { id: 'support', label: 'Academy Support', icon: <HelpCircle className="w-4 h-4" /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all ${
                          activeTab === tab.id || (tab.id === 'brand' && activeTab === 'brand_module')
                            ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 shadow-md'
                            : tab.isHighlighted
                            ? 'bg-gradient-to-r from-[#241317] to-black text-[#f7e2a9] border border-[#dfb56c]/40'
                            : 'text-[#a89f91] hover:text-[#f7f3eb] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={activeTab === tab.id ? 'text-[#dfb56c]' : 'text-[#a89f91]'}>
                            {tab.icon}
                          </span>
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-bold shrink-0 ml-1 flex items-center gap-0.5 ${tab.badgeColor}`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/10 p-3 rounded bg-black/40 border border-[#c99a45]/15 mt-4">
                  <span className="text-[10px] font-mono text-[#a89f91] uppercase block mb-1">
                    Active Course
                  </span>
                  <span className="text-xs font-editorial font-bold text-[#f7e2a9] line-clamp-1 block">
                    {currentCourse?.title || 'Fashion Diploma'}
                  </span>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#a89f91]">Paid Months:</span>
                    <span className="text-[#dfb56c] font-bold">
                      {activePaidMonths.length > 0 ? `Month ${activePaidMonths.join(', ')}` : 'None Active'}
                    </span>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Navigation Sidebar */}
        <aside className="hidden lg:flex w-56 sm:w-64 bg-[#0e0a0b] border-r border-[#c99a45]/20 p-3 sm:p-4 shrink-0 flex-col justify-between overflow-y-auto">
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
              {
                id: 'subscriptions',
                label: 'Monthly Subscriptions & Months',
                icon: <CreditCard className="w-4 h-4" />,
                badge: `M${activePaidMonths.join(',') || 'None'}`,
                badgeColor: 'bg-green-950/70 text-green-300 border-green-500/50',
                isHighlighted: true,
              },
              {
                id: 'lessons',
                label: 'Course Lessons & PDFs',
                icon: <BookOpen className="w-4 h-4" />,
                badge: `${courseLessons.length}`,
                badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/50',
              },
              {
                id: 'zoom',
                label: 'Live Zoom Classes',
                icon: <Video className="w-4 h-4" />,
                badge: courseZoomClasses.some((z) => z.status === 'LIVE') ? 'LIVE NOW' : 'Schedule',
                badgeColor: courseZoomClasses.some((z) => z.status === 'LIVE')
                  ? 'bg-red-600 text-white font-bold animate-pulse'
                  : 'bg-zinc-800 text-[#dfb56c] border border-[#dfb56c]/30',
              },
              {
                id: 'community',
                label: 'Atelier Community & Q&A',
                icon: <MessageSquare className="w-4 h-4" />,
                badge: 'Forum',
                badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/60',
              },
              {
                id: 'tracker',
                label: '6-Month Progress',
                icon: <Layers className="w-4 h-4" />,
                badge: `${progressPercent}%`,
                badgeColor:
                  progressPercent >= 80
                    ? 'bg-green-950/70 text-green-300 border-green-500'
                    : 'bg-amber-950/60 text-amber-300 border-amber-500',
              },
              {
                id: 'mentor',
                label: 'AI Fashion Mentor',
                icon: <Bot className="w-4 h-4" />,
                badge: 'Live AI',
                badgeColor: 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]',
              },
              {
                id: 'brand',
                label: 'Brand Purpose (Mod 02)',
                icon: <Crown className="w-4 h-4" />,
                badge: studentUser.brandModuleApproved ? 'Approved' : 'Locked',
                badgeColor: studentUser.brandModuleApproved
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700',
              },
              { id: 'upload_payment', label: 'Upload Payment Slip', icon: <Upload className="w-4 h-4" /> },
              { id: 'payments', label: `Slip History (${studentSlips.length})`, icon: <CreditCard className="w-4 h-4" /> },
              { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> },
              { id: 'support', label: 'Academy Support', icon: <HelpCircle className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all ${
                  activeTab === tab.id || (tab.id === 'brand' && activeTab === 'brand_module')
                    ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 shadow-md'
                    : tab.isHighlighted
                    ? 'bg-gradient-to-r from-[#1c1214] to-black text-[#f7e2a9] border border-[#dfb56c]/40 hover:bg-[#540d18]/40'
                    : 'text-[#a89f91] hover:text-[#f7f3eb] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={
                      activeTab === tab.id || (tab.id === 'brand' && activeTab === 'brand_module')
                        ? 'text-[#dfb56c]'
                        : 'text-[#a89f91]'
                    }
                  >
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-bold shrink-0 ml-1 flex items-center gap-0.5 ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom active course info box */}
          <div className="pt-4 border-t border-white/10 p-3 rounded bg-black/40 border border-[#c99a45]/15 mt-4">
            <span className="text-[10px] font-mono text-[#a89f91] uppercase block mb-1">
              Active Course
            </span>
            <span className="text-xs font-editorial font-bold text-[#f7e2a9] line-clamp-1 block">
              {currentCourse?.title || 'Fashion Diploma'}
            </span>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#a89f91]">Paid Months:</span>
              <span className="text-[#dfb56c] font-bold">
                {activePaidMonths.length > 0 ? `Month ${activePaidMonths.join(', ')}` : 'None Active'}
              </span>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#141011] to-[#0c090a]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl">
              {/* Welcome Banner */}
              <div className="p-6 rounded-sm bg-gradient-to-r from-[#241317] via-[#38070e] to-[#141011] border border-[#dfb56c]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dfb56c] block">
                    CEYLON STYLE STUDIO • STUDENT LMS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#f7f3eb] mt-1 luxury-heading-anim">
                    Welcome back, {studentUser.fullName}!
                  </h3>
                  <p className="text-xs text-[#d5cfc4] font-sinhala mt-1">
                    ඔබගේ පාඨමාලා වීඩියෝ දේශන, බාගත කළ හැකි PDF සටහන් සහ සජීවී Zoom පන්ති මෙතැනින් ලබාගන්න.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 fill-black" />
                    <span>Watch Lessons</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('zoom')}
                    className="px-4 py-2.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#6e1322] flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>Live Zoom</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('upload_payment')}
                    className="px-3.5 py-2.5 border border-white/20 text-[#d5cfc4] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white/5"
                  >
                    Upload Slip
                  </button>
                </div>
              </div>

              {/* Status Alert if Monthly Payment Pending or Access Locked */}
              {!isCourseUnlocked && (
                <div className="p-5 rounded-sm bg-[#38070e]/90 border-2 border-[#dfb56c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-[#f7e2a9]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#f7e2a9]">
                        Course Access Pending Payment Slip Verification
                      </h4>
                      <p className="text-xs text-[#d5cfc4] font-sinhala mt-0.5">
                        ඔබගේ බැංකු ගෙවීම් රිසිට්පත Upload කිරීමෙන් පසු පරිපාලන අනුමැතියෙන් Private Recorded Lessons ස්වයංක්‍රීයව Unlock වේ.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload_payment')}
                    className="px-5 py-2.5 bg-[#dfb56c] text-black text-xs font-bold uppercase tracking-wider rounded-sm shrink-0 hover:brightness-110 shadow-md"
                  >
                    Upload Payment Slip Now
                  </button>
                </div>
              )}

              {/* DEDICATED MONTHLY SUBSCRIPTION & ACTIVE PAID MONTHS HUB (Answers: meke monthly subcription kaa koheda tiyenea) */}
              <div className="p-6 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#141011] border-2 border-[#dfb56c] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#dfb56c] text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-bl-sm flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>MONTHLY SUBSCRIPTION HUB • මාසික දායකත්වය</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dfb56c] font-bold block">
                      FIRESTORE SUBSCRIPTION &amp; ENROLLMENT REGISTRY
                    </span>
                    <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] mt-0.5">
                      මාසික දායකත්වය සහ ක්‍රියාකාරී මාස (Monthly Subscriptions &amp; Active Months)
                    </h3>
                    <p className="text-xs text-[#d5cfc4] font-sinhala mt-1 max-w-2xl leading-relaxed">
                      ඔබගේ පාඨමාලාවේ මාස 01 සිට මාස 06 දක්වා සියලුම මාසික දායකත්ව (Monthly Subscriptions), ගෙවීම් තහවුරු වූ මාස (Active Paid Months) සහ බැංකු රිසිට්පත් මෙතැනින් එකවර බලාගත හැක.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 fill-black" />
                      <span>View Subscriptions Tab</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('upload_payment')}
                      className="px-4 py-2.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#6e1322] flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-[#dfb56c]" />
                      <span>Upload Slip</span>
                    </button>
                  </div>
                </div>

                {/* 6-Month Visual Subscription Grid */}
                <div className="mt-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#a89f91] flex items-center gap-1.5 shrink-0">
                        <CreditCard className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Active Course:</span>
                      </span>
                      {courses.length > 1 ? (
                        <select
                          value={selectedCourseId}
                          onChange={(e) => {
                            setSelectedCourseId(e.target.value);
                            setSelectedLessonIndex(0);
                            setSlipForm((prev) => ({
                              ...prev,
                              courseId: e.target.value,
                            }));
                          }}
                          className="px-2.5 py-1 bg-[#141011] border border-[#dfb56c]/50 rounded text-xs text-[#f7e2a9] font-bold focus:border-[#dfb56c] outline-none"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <strong className="text-[#f7f3eb]">{currentCourse?.title}</strong>
                      )}
                    </div>
                    <span className="font-mono text-green-300 font-bold text-[11px]">
                      {activePaidMonths.length} of 6 Months Active ({Math.round((activePaidMonths.length / 6) * 100)}% Paid)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((m) => {
                      const isPaid = activePaidMonths.includes(m);
                      return (
                        <div
                          key={m}
                          onClick={() => {
                            if (!isPaid) {
                              setSlipForm((prev) => ({
                                ...prev,
                                courseId: selectedCourseId,
                                month: m,
                              }));
                              setActiveTab('upload_payment');
                            } else {
                              setSelectedMonthFilter(m);
                              setActiveTab('lessons');
                            }
                          }}
                          className={`p-3 rounded-sm border cursor-pointer transition-all hover:scale-[1.02] ${
                            isPaid
                              ? 'bg-green-950/40 border-green-500/70 text-green-200 shadow-md shadow-green-950/30'
                              : 'bg-black/50 border-white/10 hover:border-[#dfb56c]/60 text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase text-[#dfb56c]">
                              Month 0{m}
                            </span>
                            {isPaid ? (
                              <Unlock className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>
                          <strong className="text-xs block text-[#f7f3eb]">
                            {isPaid ? 'Active (සක්‍රීයයි)' : 'Due (ගෙවීමට ඇත)'}
                          </strong>
                          <span className="text-[10px] font-mono text-[#a89f91] block mt-0.5">
                            Rs. {currentCourse?.zoomFee?.toLocaleString() || '2,500'}
                          </span>
                          <span className="text-[9px] font-mono mt-1 text-[#dfb56c] block underline">
                            {isPaid ? 'Open Lessons →' : 'Pay / Upload →'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3 Quick Highlight Cards: Lessons, Live Zoom, and Active Subscription */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Recorded Lessons summary */}
                <div
                  onClick={() => setActiveTab('lessons')}
                  className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 hover:border-[#dfb56c] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                      RECORDED LESSONS &amp; PDFS
                    </span>
                    <BookOpen className="w-4 h-4 text-[#dfb56c] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-[#f7f3eb]">
                      {courseLessons.length}
                    </span>
                    <span className="text-xs text-[#a89f91]">Lectures Available</span>
                  </div>
                  <p className="text-xs text-[#a89f91] mt-2 font-sinhala">
                    මාස 6ට අදාළ සියලුම වීඩියෝ සහ බාගත කළ හැකි PDF Handouts.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-[#dfb56c] font-bold">
                    <span>Open Curriculum</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Live Zoom Session card */}
                <div
                  onClick={() => setActiveTab('zoom')}
                  className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 hover:border-[#dfb56c] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                      LIVE ZOOM WORKSHOPS
                    </span>
                    <Video className="w-4 h-4 text-[#dfb56c] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-[#f7f3eb]">
                      {courseZoomClasses.length}
                    </span>
                    <span className="text-xs text-[#a89f91]">Scheduled Sessions</span>
                  </div>
                  <p className="text-xs text-[#a89f91] mt-2 font-sinhala">
                    සජීවී Zoom පන්ති සබැඳි (Links), Meeting IDs සහ Passcodes.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-[#dfb56c] font-bold">
                    <span>View Zoom Links</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 3. Subscription Status */}
                <div
                  onClick={() => setActiveTab('subscriptions')}
                  className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 hover:border-[#dfb56c] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                      ACTIVE PAID MONTHS
                    </span>
                    <CreditCard className="w-4 h-4 text-[#dfb56c] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-[#dfb56c]">
                      {activePaidMonths.length}
                    </span>
                    <span className="text-xs text-[#a89f91]">Months Active in Firestore</span>
                  </div>
                  <p className="text-xs text-[#a89f91] mt-2 font-sinhala">
                    ගෙවීම් තහවුරු වූ මාස: {activePaidMonths.length > 0 ? `Month ${activePaidMonths.join(', ')}` : 'None'}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-[#dfb56c] font-bold">
                    <span>Manage Subscriptions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Official Bank Account for fee transfer */}
              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/30">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] flex items-center gap-2 font-bold">
                    <Building className="w-4 h-4" /> Official Bank Account For Monthly Tuition Transfers
                  </span>
                  <span className="text-xs text-[#a89f91]">Bank Transfer / Online Deposit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#a89f91] block">Bank Name</span>
                    <strong className="text-[#f7f3eb] text-sm">{siteSettings.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-[#a89f91] block">Account Name</span>
                    <strong className="text-[#f7f3eb] text-sm">{siteSettings.bankAccountName}</strong>
                  </div>
                  <div>
                    <span className="text-[#a89f91] block">Account Number</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#dfb56c] font-mono text-sm">
                        {siteSettings.bankAccountNumber}
                      </strong>
                      <button
                        onClick={copyAccountNumber}
                        className="p-1 hover:text-white text-[#dfb56c]"
                        title="Copy Account Number"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#a89f91] block">Branch</span>
                    <strong className="text-[#f7f3eb] text-sm">{siteSettings.bankBranch}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE RECORDED LESSONS & DOWNLOADABLE PDFS (Organized by Month) */}
          {activeTab === 'lessons' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl">
              {/* Course & Month Filter Header */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-[#dfb56c]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                      CURRICULUM &amp; DOWNLOADABLE MATERIALS
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb]">
                    {currentCourse?.title || 'Course Curriculum'}
                  </h3>
                  <p className="text-xs text-[#a89f91] font-sinhala mt-0.5">
                    පාඨමාලා වීඩියෝ සහ අධ්‍යයන PDF Handouts මාස අනුව සංවිධානය කර ඇත.
                  </p>
                </div>

                {/* Course Switcher Dropdown (Strictly isolated to enrolled courses) */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs font-mono uppercase text-[#a89f91] hidden sm:inline">
                    Enrolled Course:
                  </label>
                  {enrolledCourses.length > 1 ? (
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setSelectedLessonIndex(0);
                      }}
                      className="px-3.5 py-2 bg-[#141011] border border-[#dfb56c]/50 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c] focus:outline-none"
                    >
                      {enrolledCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3.5 py-1.5 bg-[#540d18] border border-[#dfb56c]/60 rounded-sm text-xs text-[#f7e2a9] font-mono font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      <span>{currentCourse?.title || studentUser.courseType}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Month Tabs Bar with Active/Locked Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMonthFilter(0);
                    setSelectedLessonIndex(0);
                  }}
                  className={`px-3.5 py-2 rounded-sm text-xs font-mono uppercase tracking-wider shrink-0 transition-all ${
                    selectedMonthFilter === 0
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-md'
                      : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white'
                  }`}
                >
                  All Months ({courseLessons.length})
                </button>

                {monthLabels.map((m) => {
                  const isMonthActive = activePaidMonths.includes(m.month);
                  const isSelected = selectedMonthFilter === m.month;
                  return (
                    <button
                      key={m.month}
                      type="button"
                      onClick={() => {
                        setSelectedMonthFilter(m.month);
                        setSelectedLessonIndex(0);
                      }}
                      className={`px-3.5 py-2 rounded-sm text-xs font-mono uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-md'
                          : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white'
                      }`}
                    >
                      <span>Month 0{m.month}</span>
                      {isMonthActive ? (
                        <span className="w-2 h-2 rounded-full bg-green-400" title="Active Paid Month" />
                      ) : (
                        <span title="Locked (Payment Required)">
                          <Lock className="w-3 h-3 text-amber-400" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Framer Motion 3D Interactive Media, Graphics & Video Carousel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                      Framer Motion 3D Sliding Display (Videos, Blueprints &amp; Photos)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowThreeDShowcase((prev) => !prev)}
                    className="px-3 py-1 bg-[#141011] border border-[#dfb56c]/50 hover:border-[#dfb56c] text-[#f7e2a9] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>{showThreeDShowcase ? 'Minimize 3D Carousel ▲' : 'Expand 3D Carousel ▼'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showThreeDShowcase && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ThreeDSlidingShowcase
                        lessons={displayedLessons.length > 0 ? displayedLessons : courseLessons}
                        activePaidMonths={activePaidMonths}
                        currentLessonIndex={selectedLessonIndex}
                        onSelectLesson={(idx) => {
                          setSelectedLessonIndex(idx);
                          const target = displayedLessons[idx] || courseLessons[idx];
                          if (target) {
                            recordLastAccessedLesson(studentUser.id, target.id);
                          }
                        }}
                        onUploadSlipClick={() => {
                          setSlipForm((prev) => ({
                            ...prev,
                            courseId: selectedCourseId,
                            month: currentLesson?.month || 1,
                          }));
                          setActiveTab('upload_payment');
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Player & Lesson Navigation Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Lesson Playlist for Selected Month (4 Cols) */}
                <div className="lg:col-span-4 bg-[#0c090a] border border-[#c99a45]/20 rounded-sm p-4 h-[75vh] flex flex-col">
                  <div className="pb-3 mb-3 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold block">
                        {selectedMonthFilter === 0 ? 'All Course Lessons' : `Month 0${selectedMonthFilter} Lessons`}
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        {displayedLessons.length} Videos &amp; Study PDFs
                      </span>
                    </div>
                    {selectedMonthFilter > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          activePaidMonths.includes(selectedMonthFilter)
                            ? 'bg-green-950/70 text-green-300 border-green-500/50'
                            : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                        }`}
                      >
                        {activePaidMonths.includes(selectedMonthFilter) ? '✓ Paid Month' : '🔒 Unpaid'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {displayedLessons.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#a89f91]">
                        No lessons published for this month yet.
                      </div>
                    ) : (
                      displayedLessons.map((l, index) => {
                        const isSelected = (currentLesson?.id === l.id) || (selectedLessonIndex === index);
                        const isCompleted = completedLessonIds.includes(l.id);
                        const isMonthPaid = activePaidMonths.includes(l.month ?? 1);
                        const vidCount = (l.videoUrls && l.videoUrls.length > 0) ? l.videoUrls.length : (l.videoUrl ? 1 : 0);
                        const pdfCount = (l.pdfMaterials && l.pdfMaterials.length > 0) ? l.pdfMaterials.length : (l.pdfUrl ? 1 : 0);
                        const imgCount = (l.imageUrls && l.imageUrls.length > 0) ? l.imageUrls.length : 0;

                        return (
                          <div
                            key={l.id}
                            onClick={() => {
                              setSelectedLessonIndex(index);
                              setActiveLessonVideoIndex(0);
                              recordLastAccessedLesson(studentUser.id, l.id);
                            }}
                            className={`p-3 rounded-sm border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] shadow-md'
                                : 'bg-[#141011] border-white/5 hover:border-white/20 text-[#d5cfc4]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-[#dfb56c] flex items-center gap-1 font-bold">
                                {isMonthPaid ? <Unlock className="w-3 h-3 text-green-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                                LESSON {l.lessonNumber} • M0{l.month || 1}
                              </span>
                              {isCompleted && (
                                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Done
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-semibold line-clamp-2 leading-tight">
                              {l.title}
                            </h5>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-[#a89f91] font-mono">
                              <span>⏱ {l.duration || '25:00'}</span>
                              {vidCount > 1 && (
                                <span className="px-1.5 py-0.2 rounded bg-red-950/60 border border-red-500/30 text-red-300">
                                  🎥 {vidCount} Videos
                                </span>
                              )}
                              {pdfCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/30 text-[#f7e2a9]">
                                  📄 {pdfCount} {pdfCount === 1 ? 'PDF' : 'PDFs'}
                                </span>
                              )}
                              {imgCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300">
                                  🖼️ {imgCount} Diagrams
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Active Video Player & Downloadable PDF (8 Cols) */}
                {currentLesson ? (
                  <div className="lg:col-span-8 space-y-6">
                    {/* Multi-Video Playlist Switcher (if lesson has multiple videos) */}
                    {isLessonAccessible && currentLessonVideos.length > 1 && (
                      <div className="p-3 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#dfb56c] font-bold flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
                            Multi-Video Lesson Playlist ({currentLessonVideos.length} Videos Available):
                          </span>
                          <span className="text-[10px] font-mono text-[#a89f91]">
                            Playing: Video {activeLessonVideoIndex + 1} of {currentLessonVideos.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                          {currentLessonVideos.map((vid, vIdx) => {
                            const isCur = activeLessonVideoIndex === vIdx;
                            return (
                              <button
                                key={vid.id || vIdx}
                                type="button"
                                onClick={() => setActiveLessonVideoIndex(vIdx)}
                                className={`px-3 py-1.5 rounded-sm text-xs font-mono shrink-0 flex items-center gap-1.5 transition-all ${
                                  isCur
                                    ? 'bg-[#dfb56c] text-black font-bold shadow-md'
                                    : 'bg-[#1c1214] border border-white/10 text-[#d5cfc4] hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <Play className={`w-3 h-3 ${isCur ? 'fill-black' : 'text-[#dfb56c]'}`} />
                                <span className="max-w-[180px] truncate">
                                  Part 0{vIdx + 1}: {vid.title || `Video ${vIdx + 1}`}
                                </span>
                                {vid.duration && (
                                  <span className={`text-[10px] ${isCur ? 'text-black/80' : 'text-[#a89f91]'}`}>
                                    ({vid.duration})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC ACCESS RESTRICTION: Video Player or Locked Banner */}
                    {!isLessonAccessible ? (
                      /* LOCKED BANNER: Video playback is completely restricted */
                      <div className="relative aspect-video w-full bg-gradient-to-br from-[#1c1214] via-[#241317] to-[#0d090a] rounded-sm overflow-hidden border-2 border-[#dfb56c]/70 flex flex-col items-center justify-center p-6 sm:p-10 text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-[#540d18] border-2 border-[#dfb56c] flex items-center justify-center mb-3 shadow-xl">
                          <Lock className="w-8 h-8 text-[#dfb56c]" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#dfb56c] font-bold">
                          MONTH 0{currentLessonMonth} CONTENT ACCESS RESTRICTED
                        </span>
                        <h4 className="text-lg sm:text-2xl font-editorial font-bold text-[#f7f3eb] mt-1">
                          Video Playback &amp; PDF Downloads Locked
                        </h4>
                        <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala mt-2 max-w-lg leading-relaxed">
                          මෙම පාඩම නැරඹීමට සහ අදාළ PDF Handouts බාගත කරගැනීමට {currentLessonMonth} වන මාසය සඳහා ගාස්තු තහවුරු විය යුතුය. ඔබගේ බැංකු රිසිට්පත Upload කිරීමෙන් පසු ප්‍රවේශය ක්‍රියාත්මක වේ.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSlipForm((prev) => ({
                                ...prev,
                                courseId: selectedCourseId,
                                month: currentLessonMonth,
                              }));
                              setActiveTab('upload_payment');
                            }}
                            className="px-5 py-3 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload Month 0{currentLessonMonth} Payment Slip</span>
                          </button>

                          {/* Quick Sandbox / Test Unlock for this Month */}
                          <button
                            onClick={() => {
                              toggleStudentPaidMonth(studentUser.id, selectedCourseId, currentLessonMonth, true);
                            }}
                            className="px-4 py-3 bg-[#540d18] border border-[#dfb56c]/80 text-[#f7e2a9] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#6e1322] flex items-center gap-2 transition-colors"
                            title="Instant Sandbox / Test Unlock for Month"
                          >
                            <Unlock className="w-4 h-4 text-[#dfb56c]" />
                            <span>Activate Month 0{currentLessonMonth} (Quick Access)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* UNLOCKED: High-Definition Video Player */
                      <div
                        className="relative aspect-video w-full bg-black rounded-sm overflow-hidden border border-[#c99a45]/40 shadow-2xl select-none"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      >
                        <iframe
                          src={getEmbedUrl(
                            activeLessonVideo?.videoUrl ||
                            activeLessonVideo?.videoId ||
                            currentLesson.videoUrl ||
                            currentLesson.videoId ||
                            'dQw4w9WgXcQ'
                          )}
                          title={activeLessonVideo?.title || currentLesson.title}
                          className="w-full h-full pointer-events-auto"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />

                        {/* Protected stream title bar blocker */}
                        <div
                          className="absolute top-0 inset-x-0 h-14 z-20 pointer-events-auto cursor-default bg-transparent"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          title="Ceylon Style Studio Protected Stream"
                        />
                      </div>
                    )}

                    {/* Lesson Details & Actions Bar */}
                    <div className="p-5 sm:p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase text-[#dfb56c] font-bold">
                            Month 0{currentLesson.month || 1} • Lesson {currentLesson.lessonNumber}
                          </span>
                          {(activeLessonVideo?.duration || currentLesson.duration) && (
                            <span className="text-[10px] text-[#a89f91] font-mono">
                              ⏱ {activeLessonVideo?.duration || currentLesson.duration}
                            </span>
                          )}
                          {isLessonAccessible && (
                            <span className="px-2 py-0.2 rounded text-[9px] font-mono bg-green-950/60 text-green-300 border border-green-500/40">
                              ✓ Access Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7f3eb]">
                          {activeLessonVideo && currentLessonVideos.length > 1
                            ? `${currentLesson.title} — ${activeLessonVideo.title}`
                            : currentLesson.title}
                        </h3>
                        {currentLesson.titleSinhala && currentLesson.titleSinhala !== currentLesson.title && (
                          <p className="text-xs text-[#d5cfc4] font-sinhala mt-0.5">
                            {currentLesson.titleSinhala}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleLessonCompleted(studentUser.id, currentLesson.id)}
                          className={`px-4 py-2 text-xs font-bold uppercase rounded-sm border flex items-center gap-1.5 transition-all ${
                            completedLessonIds.includes(currentLesson.id)
                              ? 'bg-green-950/60 border-green-500 text-green-300'
                              : 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] hover:bg-[#6e1322]'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {completedLessonIds.includes(currentLesson.id) ? 'Completed ✓' : 'Mark Completed'}
                          </span>
                        </button>

                        {selectedLessonIndex < displayedLessons.length - 1 && (
                          <button
                            onClick={() => {
                              const nextIdx = selectedLessonIndex + 1;
                              setSelectedLessonIndex(nextIdx);
                              setActiveLessonVideoIndex(0);
                              if (displayedLessons[nextIdx]) {
                                recordLastAccessedLesson(studentUser.id, displayedLessons[nextIdx].id);
                              }
                            }}
                            className="px-3 py-2 bg-[#141011] border border-white/20 text-[#d5cfc4] text-xs font-semibold rounded-sm hover:text-white flex items-center gap-1"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Downloadable PDF Document Handouts (Multi-PDF Support) */}
                    {currentLessonPdfs.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-amber-400" />
                            Official Study Notes &amp; PDF Handouts ({currentLessonPdfs.length})
                          </span>
                          <span className="text-[10px] text-[#a89f91] font-sinhala">
                            නිල අධ්‍යයන සටහන්, මිණුම් සටහන් සහ සූත්‍ර
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLessonPdfs.map((pdf, pIdx) => (
                            <div
                              key={pdf.id || pIdx}
                              className="p-4 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#141011] border border-[#dfb56c]/30 flex items-center justify-between gap-3 shadow-md"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-sm bg-[#540d18] border border-[#dfb56c]/50 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-[#f7e2a9]" />
                                </div>
                                <div className="min-w-0 truncate">
                                  <span className="text-xs font-bold text-[#f7f3eb] block truncate" title={pdf.title}>
                                    {pdf.title || `Lesson_${currentLesson.lessonNumber}_Handout_${pIdx + 1}.pdf`}
                                  </span>
                                  <span className="text-[10px] text-[#dfb56c] font-mono block">
                                    {pdf.size || `PDF Handout #${pIdx + 1}`}
                                  </span>
                                </div>
                              </div>

                              {isLessonAccessible ? (
                                <button
                                  onClick={() =>
                                    handleDownloadFile(
                                      pdf.url,
                                      pdf.title || `Lesson_${currentLesson.lessonNumber}_Handout_${pIdx + 1}.pdf`
                                    )
                                  }
                                  className="px-3 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-md shrink-0 transition-transform hover:scale-105"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-not-allowed shrink-0"
                                  title={`Requires Month ${currentLessonMonth} active paid subscription`}
                                >
                                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Locked</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lesson Diagrams Gallery */}
                    {currentLesson.imageUrls && currentLesson.imageUrls.length > 0 && (
                      <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/25 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] flex items-center gap-1.5 font-bold">
                            <ImageIcon className="w-4 h-4" /> Technical Diagrams &amp; Pattern Sketches ({currentLesson.imageUrls.length})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {currentLesson.imageUrls
                            ?.filter((u) => Boolean(u && u.trim()))
                            .map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="group relative rounded-sm bg-black border border-white/10 hover:border-[#dfb56c]/60 overflow-hidden flex flex-col justify-between transition-all"
                              >
                                <div
                                  onClick={() => {
                                    if (isLessonAccessible) {
                                      setPreviewImage({
                                        url: imgUrl,
                                        title: `Lesson ${currentLesson.lessonNumber} Diagram #${imgIdx + 1}`,
                                      });
                                    }
                                  }}
                                  className="aspect-square w-full overflow-hidden bg-black/60 cursor-pointer relative"
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Lesson diagram ${imgIdx + 1}`}
                                    className={`w-full h-full object-cover transition-transform duration-300 ${
                                      isLessonAccessible ? 'group-hover:scale-105' : 'blur-sm grayscale'
                                    }`}
                                  />
                                  {!isLessonAccessible && (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2 text-center">
                                      <Lock className="w-5 h-5 text-amber-400 mb-1" />
                                      <span className="text-[10px] text-amber-300 font-mono font-bold">
                                        Month Locked
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Lecture Notes */}
                    {currentLesson.notes && (
                      <div className="p-6 rounded-sm bg-[#0c090a] border border-white/5 space-y-3">
                        <h4 className="text-xs uppercase font-mono tracking-widest text-[#dfb56c] font-bold">
                          Lesson Lecture Notes &amp; Formulas
                        </h4>
                        <div className="text-xs sm:text-sm text-[#d5cfc4] leading-relaxed whitespace-pre-line font-sinhala">
                          {currentLesson.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="lg:col-span-8 p-12 text-center text-xs text-[#a89f91]">
                    Select a lesson from the playlist to start learning.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DEDICATED SECTION FOR ZOOM LINKS & LIVE CLASS ATTENDANCE */}
          {activeTab === 'zoom' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
              {/* Header Box */}
              <div className="p-6 rounded-sm bg-gradient-to-r from-[#241317] via-[#38070e] to-[#141011] border-2 border-[#dfb56c]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dfb56c] font-bold">
                      LIVE CLASS ATTENDANCE &amp; WORKSHOPS
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#f7f3eb]">
                    Live Zoom Classes &amp; Interactive Studio Sessions
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala mt-1">
                    ප්‍රවීණ විලාසිතා නිර්මාණකරුවන් සමඟ සජීවීව සම්බන්ධ වී ප්‍රශ්න ගැටළු විමසන්න.
                  </p>
                </div>

                {/* Course Filter */}
                <div className="shrink-0 flex items-center gap-2">
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#141011] border border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                  >
                    <option value="ALL">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Zoom Classes List */}
              <div className="space-y-4">
                {courseZoomClasses.length === 0 ? (
                  <div className="p-12 rounded-sm bg-[#0c090a] border border-white/10 text-center space-y-3">
                    <Video className="w-12 h-12 text-[#a89f91] mx-auto opacity-40" />
                    <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                      No Live Zoom Sessions Scheduled Currently
                    </h4>
                    <p className="text-xs text-[#a89f91] font-sinhala max-w-md mx-auto">
                      ඉදිරි සජීවී Zoom වැඩමුළු කාලසටහන ඉක්මනින් මෙහි දිස්වනු ඇත. WhatsApp සමූහය ඔස්සේද දැනුම් දෙනු ලැබේ.
                    </p>
                  </div>
                ) : (
                  courseZoomClasses.map((cls) => {
                    const isLive = cls.status === 'LIVE';
                    return (
                      <div
                        key={cls.id}
                        className={`p-6 rounded-sm border transition-all ${
                          isLive
                            ? 'bg-gradient-to-r from-[#2f0810] via-[#3d0b15] to-[#1a1012] border-2 border-red-500 shadow-2xl'
                            : 'bg-[#0c090a] border-[#c99a45]/30 hover:border-[#dfb56c]/60'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Class Info */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {isLive ? (
                                <span className="px-2.5 py-1 bg-red-600 text-white font-mono text-[10px] font-bold rounded flex items-center gap-1.5 shadow-md">
                                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                  🔴 LIVE NOW • IN SESSION
                                </span>
                              ) : cls.status === 'COMPLETED' ? (
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 font-mono text-[10px] rounded">
                                  ✓ COMPLETED
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 font-mono text-[10px] font-bold rounded">
                                  UPCOMING LIVE WORKSHOP
                                </span>
                              )}

                              <span className="px-2 py-0.5 bg-[#dfb56c]/15 text-[#dfb56c] border border-[#dfb56c]/30 font-mono text-[10px] rounded font-bold">
                                Month 0{cls.month}
                              </span>

                              <span className="text-xs font-mono text-[#a89f91]">
                                {cls.courseTitle}
                              </span>
                            </div>

                            <h4 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] leading-snug">
                              {cls.title}
                            </h4>
                            {cls.titleSinhala && cls.titleSinhala !== cls.title && (
                              <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala">
                                {cls.titleSinhala}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#a89f91] pt-1">
                              <span className="flex items-center gap-1 text-[#f7e2a9]">
                                <Calendar className="w-3.5 h-3.5 text-[#dfb56c]" /> {cls.date}
                              </span>
                              <span className="flex items-center gap-1 text-[#f7e2a9]">
                                <Clock className="w-3.5 h-3.5 text-[#dfb56c]" /> {cls.time}
                              </span>
                              <span>Mentor: <strong className="text-white">{cls.mentorName}</strong></span>
                            </div>

                            {cls.notes && (
                              <p className="text-xs text-[#a89f91] font-sinhala italic pt-1">
                                Note: {cls.notes}
                              </p>
                            )}
                          </div>

                          {/* Meeting Credentials & Join Button */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                            <div className="p-3 bg-black/60 rounded border border-white/10 text-xs font-mono space-y-1 w-full sm:w-auto">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[#a89f91]">Meeting ID:</span>
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-[#f7e2a9]">{cls.meetingId}</strong>
                                  <button
                                    onClick={() => copyText(cls.meetingId, 'id')}
                                    className="p-1 hover:text-white text-[#dfb56c]"
                                    title="Copy Meeting ID"
                                  >
                                    {copiedZoomId === cls.meetingId ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[#a89f91]">Passcode:</span>
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-[#dfb56c]">{cls.passcode}</strong>
                                  <button
                                    onClick={() => copyText(cls.passcode, 'pass')}
                                    className="p-1 hover:text-white text-[#dfb56c]"
                                    title="Copy Passcode"
                                  >
                                    {copiedZoomPass === cls.passcode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <a
                              href={cls.zoomUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full sm:w-auto px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                                isLive
                                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                  : 'bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black hover:brightness-110'
                              }`}
                            >
                              <Video className="w-4 h-4" />
                              <span>{isLive ? 'Join Live Zoom Session Now' : 'Join Zoom Meeting'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Zoom Guidelines Card */}
              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                  Live Class Attendance &amp; Etiquette Guidelines
                </span>
                <ul className="text-xs text-[#d5cfc4] space-y-2 list-disc list-inside font-sinhala leading-relaxed">
                  <li>
                    Zoom Display Name එක සඳහා ඔබගේ නම සහ ලියාපදිංචි අංකය ඇතුළත් කරන්න (උදා: {studentUser.fullName} - {studentUser.regNumber}).
                  </li>
                  <li>
                    පන්තිය ආරම්භ වීමට විනාඩි 5කට පෙර Zoom සබැඳිය ඔස්සේ සම්බන්ධ වන්න.
                  </li>
                  <li>
                    දේශනය අතරතුර මයික්‍රෆෝනය Mute කර තබාගන්න. ප්‍රශ්න විමසීමේ අවස්ථාවේදී හෝ Chat Box එක මගින් ප්‍රශ්න යොමු කරන්න.
                  </li>
                  <li>
                    පැටර්න් ඇඳීමේ ප්‍රායෝගික සැසි සඳහා මිනුම් පටිය, පැටර්න් කොළ සහ පැන්සල සූදානම් කර තබාගන්න.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB: COURSE ATELIER COMMUNITY & PEER DISCUSSIONS (Strict Course Isolation) */}
          {activeTab === 'community' && (
            <CourseCommunityTab
              courseId={currentCourse?.id || selectedCourseId}
              courseTitle={currentCourse?.title || 'Course Program'}
            />
          )}

          {/* TAB 4: SUBSCRIPTION, PAYMENT & COURSE ENROLLMENT DATA (Stored in Firestore) */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/30">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                      FIRESTORE SUBSCRIPTION &amp; ENROLLMENT REGISTRY
                    </span>
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb] mt-0.5">
                      Course Subscriptions &amp; Active Paid Months
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload_payment')}
                    className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Fee Slip</span>
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {courses.map((course) => {
                    const isEnrolled =
                      studentUser.courseId === course.id ||
                      (studentUser.enrolledCourseIds && studentUser.enrolledCourseIds.includes(course.id)) ||
                      course.id === 'course-01';

                    const coursePaidMonths = getStudentPaidMonths(studentUser.id, course.id);

                    return (
                      <div
                        key={course.id}
                        className="p-5 rounded-sm bg-[#141011] border border-white/10 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                                {course.title}
                              </h4>
                              {isEnrolled && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-950 text-green-300 border border-green-500/50 font-bold">
                                  ENROLLED
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#a89f91] font-mono">
                              Duration: {course.duration} • Monthly Fee: Rs. {course.zoomFee?.toLocaleString() || '2,500'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedCourseId(course.id);
                                setActiveTab('lessons');
                              }}
                              className="px-3.5 py-1.5 bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/60 text-xs font-bold rounded-sm"
                            >
                              Go to Lessons
                            </button>
                          </div>
                        </div>

                        {/* Month by month access chips */}
                        <div>
                          <span className="text-[11px] font-mono text-[#a89f91] block mb-2">
                            Monthly Subscription Access Grid:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((m) => {
                              const isPaid = coursePaidMonths.includes(m);
                              return (
                                <div
                                  key={m}
                                  className={`p-2.5 rounded-sm border text-center transition-all ${
                                    isPaid
                                      ? 'bg-green-950/40 border-green-500/60 text-green-200'
                                      : 'bg-black/40 border-white/10 text-zinc-400'
                                  }`}
                                >
                                  <span className="text-[10px] font-mono block">Month 0{m}</span>
                                  <strong className="text-xs block mt-0.5">
                                    {isPaid ? '✓ Active' : 'Locked'}
                                  </strong>
                                  {!isPaid && (
                                    <button
                                      onClick={() => toggleStudentPaidMonth(studentUser.id, course.id, m, true)}
                                      className="mt-1 text-[9px] font-mono text-[#dfb56c] hover:underline block mx-auto"
                                    >
                                      Test Activate
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 6-MONTH PROGRESS TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                      6-MONTH DIPLOMA PROGRESSION TRACKER
                    </span>
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                      Curriculum Milestone Completion ({progressPercent}%)
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-[#dfb56c]">
                      {completedLessonIds.length} / {publishedLessons.length}
                    </span>
                    <span className="text-xs text-[#a89f91] block">Lessons Finished</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full h-3 bg-zinc-900 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#540d18] via-[#a83244] to-[#dfb56c]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {modules.map((mod) => {
                    const modLessons = publishedLessons.filter(
                      (l) => l.moduleId === mod.id || l.moduleNumber === mod.number
                    );
                    const completedInMod = modLessons.filter((l) =>
                      completedLessonIds.includes(l.id)
                    ).length;

                    return (
                      <div
                        key={mod.id}
                        className="p-3.5 rounded-sm bg-[#141011] border border-white/5 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded bg-[#540d18] border border-[#dfb56c]/40 font-mono text-[#f7e2a9] font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {mod.number}
                          </span>
                          <div>
                            <strong className="text-[#f7f3eb] block">{mod.title}</strong>
                            {mod.titleSinhala && (
                              <span className="text-[#a89f91] font-sinhala">{mod.titleSinhala}</span>
                            )}
                          </div>
                        </div>

                        <span className="font-mono text-[#dfb56c] shrink-0">
                          {modLessons.length > 0 ? `${completedInMod}/${modLessons.length} Done` : 'Theory'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI FASHION MENTOR */}
          {activeTab === 'mentor' && (
            <div className="h-[76vh] flex flex-col animate-in fade-in duration-300 max-w-4xl mx-auto">
              <React.Suspense
                fallback={
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-[#dfb56c] font-mono">
                    <Sparkles className="w-6 h-6 animate-spin mb-2" />
                    <span>Loading AI Fashion Mentor Studio...</span>
                  </div>
                }
              >
                <FashionMentorChat studentName={studentUser.fullName} className="h-full flex-1" />
              </React.Suspense>
            </div>
          )}

          {/* TAB 7: BRAND MODULE (MODULE 02) */}
          {(activeTab === 'brand' || activeTab === 'brand_module') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {studentUser.brandModuleApproved ? (
                <React.Suspense
                  fallback={
                    <div className="p-12 text-center text-xs text-[#dfb56c] font-mono">
                      <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <span>Loading Brand Purpose & Identity Studio...</span>
                    </div>
                  }
                >
                  <BrandMakingModule studentId={studentUser.id} studentName={studentUser.fullName} />
                </React.Suspense>
              ) : (
                <div className="max-w-2xl mx-auto p-10 rounded-sm bg-[#1c1316] border-2 border-[#dfb56c] text-center shadow-2xl space-y-4">
                  <Crown className="w-12 h-12 text-[#dfb56c] mx-auto" />
                  <h3 className="text-2xl font-editorial font-bold text-[#f7f3eb]">
                    Brand Purpose &amp; Identity Mastery Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala leading-relaxed">
                    මෙම මොඩියුලය (Module 02) සඳහා ඇකඩමි පරිපාලක අනුමැතිය අවශ්‍ය වේ. අනුමැතිය ලැබුණු පසු සම්පූර්ණ Studio පත්‍රිකාව Unlock වේ.
                  </p>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello Ceylon Style Studio, I am registered student ${studentUser.fullName} (${studentUser.regNumber}). Please approve my access to the Brand Module in the LMS.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Request Approval via WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: UPLOAD PAYMENT SLIP */}
          {activeTab === 'upload_payment' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                  Upload Bank Deposit Slip / Transfer Screenshot
                </h3>
                <p className="text-xs text-[#a89f91] mt-0.5">
                  Attach your bank receipt to verify payment and dynamically unlock your private recorded lessons and PDFs.
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-4 rounded bg-green-950/80 border border-green-500 text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>
                    ✓ Payment slip uploaded successfully to Firestore! Administrator will verify and activate your month access shortly.
                  </span>
                </div>
              )}

              <form onSubmit={handleSlipSubmit} className="space-y-4 p-6 rounded-sm bg-[#0c090a] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Course Selector */}
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Paying For Course
                    </label>
                    <select
                      value={slipForm.courseId}
                      onChange={(e) => setSlipForm({ ...slipForm, courseId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Selector */}
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Specific Month
                    </label>
                    <select
                      value={slipForm.month}
                      onChange={(e) => setSlipForm({ ...slipForm, month: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                    >
                      <option value={1}>Month 01 (Foundation &amp; Measurements)</option>
                      <option value={2}>Month 02 (Pattern Drafting &amp; Slopers)</option>
                      <option value={3}>Month 03 (Haute Couture &amp; Darts)</option>
                      <option value={4}>Month 04 (Draping &amp; Grading)</option>
                      <option value={5}>Month 05 (Brand Identity &amp; AI Tech)</option>
                      <option value={6}>Month 06 (Grand Runway &amp; Diploma)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Payment Type
                    </label>
                    <select
                      value={slipForm.paymentType}
                      onChange={(e) => setSlipForm({ ...slipForm, paymentType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                    >
                      <option value="Monthly Fee">Monthly Tuition Fee</option>
                      <option value="Registration Fee">Registration Fee</option>
                      <option value="Full Course Fee">Full Course Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Paid Amount (LKR)
                    </label>
                    <input
                      type="number"
                      value={slipForm.amount}
                      onChange={(e) => setSlipForm({ ...slipForm, amount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={slipForm.paymentDate}
                      onChange={(e) => setSlipForm({ ...slipForm, paymentDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                      Deposit Ref / Slip Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TXN-984210"
                      value={slipForm.transactionReference}
                      onChange={(e) => setSlipForm({ ...slipForm, transactionReference: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c]"
                      required
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1">
                    Select Payment Slip Image / PDF
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-[#a89f91] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#540d18] file:text-[#f7e2a9] hover:file:bg-[#6e1322] cursor-pointer"
                    required
                  />
                </div>

                {uploadPreview && (
                  <div className="mt-3 p-3 bg-black/50 rounded border border-white/10 text-center">
                    <span className="text-[10px] text-[#a89f91] block mb-2 font-mono">Slip Image Preview</span>
                    <img
                      src={uploadPreview}
                      alt="Payment Slip Preview"
                      className="max-h-56 mx-auto rounded object-contain border border-[#c99a45]/30"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading Slip to Firestore...' : 'Submit Payment Slip For Verification'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    My Payment Submissions
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Track the verification status of your uploaded payment slips in Firestore.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload_payment')}
                  className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New Slip</span>
                </button>
              </div>

              {studentSlips.length === 0 ? (
                <div className="p-8 rounded-sm bg-[#0c090a] border border-white/10 text-center">
                  <CreditCard className="w-8 h-8 text-[#a89f91] mx-auto mb-2" />
                  <p className="text-xs text-[#a89f91]">No payment slips uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentSlips.map((slip) => (
                    <div
                      key={slip.id}
                      className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-sm text-[#f7f3eb]">{slip.paymentType}</strong>
                          {slip.month && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dfb56c]/20 text-[#dfb56c] border border-[#dfb56c]/30 font-bold">
                              Month 0{slip.month}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              slip.status === 'VERIFIED'
                                ? 'bg-green-950/60 text-green-300 border-green-500'
                                : slip.status === 'REJECTED'
                                ? 'bg-red-950/60 text-red-300 border-red-500'
                                : 'bg-amber-950/60 text-amber-300 border-amber-500 animate-pulse'
                            }`}
                          >
                            {slip.status}
                          </span>
                        </div>
                        <span className="text-xs text-[#a89f91] block">
                          Amount: <strong className="text-[#dfb56c]">Rs. {slip.amount.toLocaleString()}</strong> • Date: {slip.paymentDate} • Ref: {slip.transactionReference}
                        </span>
                        {slip.courseTitle && (
                          <span className="text-[11px] text-[#dfb56c] font-mono block mt-0.5">
                            Course: {slip.courseTitle}
                          </span>
                        )}
                        {slip.adminNotes && (
                          <p className="text-xs text-[#f7e2a9] font-sinhala mt-2 bg-[#1c1214] p-2 rounded border border-white/5">
                            Note from admin: {slip.adminNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Instant Verify for testing */}
                        {slip.status === 'PENDING' && (
                          <button
                            onClick={() => approvePaymentSlip(slip.id, studentUser.regNumber)}
                            className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c]/60 text-[#f7e2a9] text-xs font-bold rounded flex items-center gap-1"
                            title="Quick Test Verify"
                          >
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span>Quick Verify</span>
                          </button>
                        )}

                        <a
                          href={slip.slipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 border border-white/20 hover:border-[#dfb56c] text-xs text-[#d5cfc4] rounded flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Slip</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                Student Profile Information
              </h3>

              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 space-y-4 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#a89f91]">Registration Number:</span>
                  <strong className="text-[#dfb56c] font-mono text-sm">{studentUser.regNumber}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#a89f91]">Full Name:</span>
                  <strong className="text-[#f7f3eb]">{studentUser.fullName}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#a89f91]">WhatsApp Contact:</span>
                  <span className="text-[#f7f3eb] font-mono">{studentUser.whatsappNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#a89f91]">Email Address:</span>
                  <span className="text-[#f7f3eb]">{studentUser.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#a89f91]">Enrolled Course:</span>
                  <strong className="text-[#f7e2a9]">{currentCourse?.title || studentUser.courseType}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#a89f91]">Enrollment Date:</span>
                  <span className="text-[#f7f3eb] font-mono">
                    {studentUser.createdAt ? new Date(studentUser.createdAt).toLocaleDateString('en-GB') : '-'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl mx-auto space-y-6 text-center p-8 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 animate-in fade-in duration-300">
              <HelpCircle className="w-12 h-12 text-[#dfb56c] mx-auto mb-2" />
              <h3 className="text-2xl font-editorial font-bold text-[#f7f3eb]">
                Academy Student Support
              </h3>
              <p className="text-xs sm:text-sm text-[#b8afa2] font-sinhala max-w-md mx-auto leading-relaxed">
                පාඨමාලා පාඩම්, ගෙවීම් ගැටළු හෝ Zoom පන්ති විමසීම් සඳහා අපගේ උපදේශක කණ්ඩායම සමඟ සෘජුවම WhatsApp හරහා සම්බන්ධ වන්න.
              </p>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello CEYLON STYLE STUDIO, I need student support regarding my course.\nStudent Name: ${studentUser.fullName}\nReg Number: ${studentUser.regNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 shadow-lg transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat With Academy Advisor on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Framer Motion Responsive Mobile Action Dock & Slide-in Interactive Buttons */}
      <MobileActionDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePaidMonths={activePaidMonths}
        isCourseUnlocked={isCourseUnlocked}
      />

      {/* Diagram / Image Full-Screen Inspection Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
        >
          <div className="w-full max-w-4xl bg-[#141011] border border-[#c99a45]/40 rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1c1214] border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-editorial font-bold text-[#f7e2a9]">
                  {previewImage.title}
                </h4>
                <span className="text-[10px] text-[#a89f91] font-mono">
                  High-Resolution Pattern / Diagram Inspection
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleDownloadFile(previewImage.url, `${previewImage.title.replace(/\s+/g, '_')}.jpg`)
                  }
                  className="px-3.5 py-1.5 bg-[#540d18] hover:bg-[#6e1322] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Diagram</span>
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/80">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto object-contain rounded shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
