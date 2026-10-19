import React, { useState } from 'react';
import {
  CourseItem,
  CourseSectionItem,
  CourseVideoItem,
  CourseResourceItem,
  CourseTestimonialItem,
  CustomForm,
  CustomFormField,
  FormSubmission,
  StudentReviewItem,
} from '../../types';
import { useData } from '../../context/DataContext';
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Archive,
  RefreshCw,
  Video,
  FileText,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Share2,
  Download,
  Upload,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Palette,
  Check,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  User,
  Star,
  Link as LinkIcon,
  HelpCircle,
  FileSpreadsheet,
  Flame,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { FBCampaignAdminManager } from './FBCampaignAdminManager';

// Helper to parse YouTube video IDs
function parseYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : '';
}

// Compress images for browser storage
async function compressImage(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

interface CourseCMSAdminManagerProps {
  onPreviewCourse?: (courseSlug: string) => void;
}

export function CourseCMSAdminManager({ onPreviewCourse }: CourseCMSAdminManagerProps) {
  const {
    courses,
    saveCourse,
    deleteCourse,
    archiveCourse,
    publishCourse,
    customForms,
    saveCustomForm,
    deleteCustomForm,
    formSubmissions,
    updateFormSubmissionStatus,
    deleteFormSubmission,
    studentReviews,
    saveStudentReview,
    deleteStudentReview,
    toggleReviewApproval,
    campaigns,
  } = useData();

  // Internal tab state within Course CMS
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'campaigns' | 'forms' | 'submissions' | 'reviews'>('courses');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');

  // Modal edit states
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [editingReview, setEditingReview] = useState<StudentReviewItem | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [courseEditActiveTab, setCourseEditActiveTab] = useState<'basics' | 'about' | 'sections' | 'videos' | 'pdfs' | 'reviews' | 'form'>('basics');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    } else {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast(`${label} copied to clipboard!`);
    }
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.titleSinhala && c.titleSinhala.includes(searchTerm)) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PUBLISHED' && c.isPublished && !c.isArchived) ||
      (filterStatus === 'DRAFT' && !c.isPublished && !c.isArchived) ||
      (filterStatus === 'ARCHIVED' && c.isArchived);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export submissions to Excel
  const exportSubmissionsToExcel = (submissionsToExport: FormSubmission[]) => {
    try {
      const rows = submissionsToExport.map((s, index) => {
        const row: Record<string, any> = {
          '#': index + 1,
          'Submission ID': s.id,
          'Date Submitted': new Date(s.createdAt).toLocaleString(),
          'Status': s.status,
          'Course Name': s.courseTitle || 'General',
          'Form Name': s.formSlug,
          'Admin Notes': s.notes || '',
        };
        // Flatten submitted data
        if (s.submittedData) {
          Object.entries(s.submittedData).forEach(([k, v]) => {
            row[k] = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
          });
        }
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
      XLSX.writeFile(workbook, `CSS_Course_Applications_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Form submissions exported to Excel successfully!');
    } catch (err) {
      console.error('Excel export error:', err);
      showToast('Export failed. Check console for details.');
    }
  };

  // Get categories for filtering
  const courseCategories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1316] text-[#f7e2a9] border-2 border-[#dfb56c] px-4 py-2.5 rounded-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#540d18] border border-[#dfb56c]/40 text-[#f7e2a9]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-editorial font-bold text-[#f7f3eb]">
                Course CMS &amp; Dynamic Registration Hub
              </h3>
              <p className="text-xs text-[#a89f91]">
                Manage all courses, dynamic sections, YouTube masterclasses, PDF study notes, custom forms, and student video reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'courses'
                ? 'bg-[#dfb56c] text-black shadow-lg'
                : 'bg-[#141011] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('campaigns')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'campaigns'
                ? 'bg-[#dfb56c] text-black shadow-lg'
                : 'bg-[#141011] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>FB Boost Campaigns ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'forms'
                ? 'bg-[#dfb56c] text-black shadow-lg'
                : 'bg-[#141011] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Custom Form Builder ({customForms.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'submissions'
                ? 'bg-[#dfb56c] text-black shadow-lg'
                : 'bg-[#141011] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Form Submissions ({formSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'reviews'
                ? 'bg-[#dfb56c] text-black shadow-lg'
                : 'bg-[#141011] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Student Video Reviews ({studentReviews.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FB BOOST CAMPAIGNS SUB-TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'campaigns' && (
        <div className="animate-in fade-in duration-300">
          <FBCampaignAdminManager
            onPreviewCampaign={(slug) => {
              window.open(`/#promo/${slug}`, '_blank');
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. COURSES TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          {/* Controls: Search, Filter, Add New */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#120d0f] p-3 rounded border border-white/10">
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#a89f91] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search courses by title, slug, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] placeholder-[#a89f91] focus:border-[#dfb56c] outline-none"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#dfb56c] outline-none"
              >
                <option value="ALL">All Categories</option>
                {courseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#dfb56c] outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published Only</option>
                <option value="DRAFT">Draft Only</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <button
              onClick={() => {
                const newId = `course-${Date.now()}`;
                setEditingCourse({
                  id: newId,
                  slug: `course-${Date.now().toString().slice(-4)}`,
                  title: '',
                  titleSinhala: '',
                  subtitle: '',
                  subtitleSinhala: '',
                  badge: 'New 2026 Masterclass',
                  badgeSinhala: 'නව 2026 මාස්ටර්ක්ලාස්',
                  description: '',
                  descriptionSinhala: '',
                  aboutCourse: '',
                  aboutCourseSinhala: '',
                  category: 'Diploma Master Program',
                  duration: '6 Months',
                  courseMode: 'HYBRID',
                  schedule: 'Physical (Weekend) & Zoom Live',
                  locations: ['KEGALLE', 'KURUNEGALA', 'PILIYANDALA'],
                  physicalFee: 3500,
                  zoomFee: 2000,
                  registrationFee: 1000,
                  intakeText: '🔥 2026 Batch Admissions Open',
                  intakeTextSinhala: '2026 නව කණ්ඩායම සඳහා ලියාපදිංචිය විවෘතයි',
                  imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                  bannerImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
                  cardBgImageUrl: '',
                  cardOverlayOpacity: 85,
                  accentColor: '#dfb56c',
                  textColor: '#f7f3eb',
                  promoVideoUrl: '',
                  features: ['In-Studio Hands-On & Zoom Live HD', 'Free Spec Sheets & Sloper Handouts'],
                  syllabusOverview: ['Module 01: Sloper Foundations', 'Module 02: Draping & Contouring'],
                  learningOutcomes: [
                    'Draft bespoke couture patterns from anatomical measurements with zero trial-and-error',
                    'Perform full circle skirt radii calculations, French dart conversions, and bias contouring',
                    'Launch your independent fashion label with digital tech pack spec sheets',
                  ],
                  instructorName: 'Madame Celine & Atelier Faculty',
                  instructorTitle: 'Master Couture Director & Pattern Engineer',
                  instructorBio: 'Over 18 years in European haute couture, bespoke pattern drafting, and luxury garment construction.',
                  sections: [
                    {
                      id: `sec-${Date.now()}-1`,
                      title: 'Atelier Philosophy & Hands-On Methodology',
                      titleSinhala: 'අපගේ ඉගැන්වීම් ක්‍රමවේදය',
                      content:
                        'At Ceylon Style Studio, pattern drafting is taught as both an engineering science and an artistic discipline. Students master anatomical measurement principles, balance lines, ease distribution, and seam ergonomics.',
                      order: 1,
                      isVisible: true,
                    },
                  ],
                  videos: [],
                  pdfResources: [],
                  testimonials: [],
                  isFeatured: false,
                  isPublished: true,
                  isArchived: false,
                  order: courses.length + 1,
                  createdAt: new Date().toISOString().split('T')[0],
                });
                setCourseEditActiveTab('basics');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New Course
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((c) => {
              const publicCourseUrl = `${window.location.origin}/?course=${c.slug}#course/${c.slug}`;
              const publicRegisterUrl = `${window.location.origin}/?registerCourse=${c.slug}#register`;

              return (
                <div
                  key={c.id}
                  className="relative p-5 rounded-sm bg-[#0c090a] border flex flex-col justify-between space-y-4 group overflow-hidden transition-all shadow-xl hover:shadow-2xl"
                  style={{
                    borderColor: c.accentColor ? `${c.accentColor}60` : '#c99a4540',
                    color: c.textColor || '#f7f3eb',
                  }}
                >
                  {/* Custom Card Background if present */}
                  {c.cardBgImageUrl && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${c.cardBgImageUrl})` }}
                      />
                      <div
                        className="absolute inset-0 bg-black pointer-events-none"
                        style={{ opacity: (c.cardOverlayOpacity ?? 85) / 100 }}
                      />
                    </>
                  )}

                  <div className="relative z-10 space-y-3">
                    {/* Top Row: Category, Badge & Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: c.accentColor ? `${c.accentColor}25` : '#540d18',
                            color: c.accentColor || '#f7e2a9',
                            border: `1px solid ${c.accentColor ? `${c.accentColor}50` : '#dfb56c40'}`,
                          }}
                        >
                          {c.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#a89f91]">
                          {c.courseMode || 'HYBRID'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {c.isArchived ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            Archived
                          </span>
                        ) : c.isPublished ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                            ✓ Published
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/50">
                            Draft
                          </span>
                        )}
                        {c.badge && (
                          <span className="text-[10px] font-mono font-bold text-[#dfb56c]">
                            ★ {c.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Title and Sinhala */}
                    <div>
                      <h4 className="text-base font-editorial font-bold drop-shadow leading-snug">
                        {c.title}
                      </h4>
                      {c.titleSinhala && (
                        <p className="text-xs font-sinhala mt-0.5 opacity-90 text-[#dfb56c]">
                          {c.titleSinhala}
                        </p>
                      )}
                      <p className="text-xs opacity-80 mt-2 line-clamp-2">
                        {c.description}
                      </p>
                    </div>

                    {/* Quick Specs Bar */}
                    <div className="pt-2.5 border-t border-white/10 grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="opacity-70 block text-[10px] uppercase font-mono">Physical</span>
                        <strong className="font-mono text-sm text-[#f7e2a9]">
                          Rs. {Number(c.physicalFee || 0).toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-70 block text-[10px] uppercase font-mono">Zoom</span>
                        <strong className="font-mono text-sm text-[#f7e2a9]">
                          Rs. {Number(c.zoomFee || 0).toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-70 block text-[10px] uppercase font-mono">Duration</span>
                        <strong>{c.duration || '6 Months'}</strong>
                      </div>
                    </div>

                    {/* Attached Resources counts */}
                    <div className="flex items-center gap-3 text-[10px] font-mono opacity-80 pt-1">
                      <span>• {c.sections?.length || 0} Sections</span>
                      <span>• {c.videos?.length || 0} Videos</span>
                      <span>• {c.pdfResources?.length || 0} PDFs</span>
                      <span>• {c.testimonials?.length || 0} Reviews</span>
                      {c.customFormId && (
                        <span className="text-emerald-400 font-bold">
                          • Custom Form Attached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    {/* Share & Preview actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (onPreviewCourse) {
                            onPreviewCourse(c.slug);
                          } else {
                            window.open(`/?course=${c.slug}#course/${c.slug}`, '_blank');
                          }
                        }}
                        className="px-2 py-1 bg-[#1c1214] hover:bg-[#251518] border border-[#dfb56c]/40 text-[#dfb56c] text-[11px] rounded flex items-center gap-1 font-mono cursor-pointer"
                        title="View Public Course Page"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Public Page</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(publicCourseUrl, 'Course Page URL')}
                        className="p-1.5 bg-black/60 hover:bg-black/90 border border-white/10 text-[#a89f91] hover:text-[#dfb56c] rounded cursor-pointer"
                        title="Copy Public Course URL"
                      >
                        <LinkIcon className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => copyToClipboard(publicRegisterUrl, 'Course Registration Link')}
                        className="p-1.5 bg-black/60 hover:bg-black/90 border border-white/10 text-[#a89f91] hover:text-[#dfb56c] rounded cursor-pointer"
                        title="Copy Course Direct Registration URL"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Admin CRUD actions */}
                    <div className="flex items-center gap-1.5">
                      {/* Archive toggle */}
                      <button
                        onClick={() => archiveCourse(c.id, !c.isArchived)}
                        className={`p-1.5 rounded border text-xs cursor-pointer ${
                          c.isArchived
                            ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                            : 'bg-black/40 border-white/10 text-[#a89f91] hover:text-white'
                        }`}
                        title={c.isArchived ? 'Unarchive Course' : 'Archive Course'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      {/* Publish toggle */}
                      <button
                        onClick={() => publishCourse(c.id, !c.isPublished)}
                        className={`p-1.5 rounded border text-xs cursor-pointer ${
                          c.isPublished
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                        }`}
                        title={c.isPublished ? 'Unpublish Course (Set Draft)' : 'Publish Course'}
                      >
                        {c.isPublished ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => {
                          const dup: CourseItem = {
                            ...c,
                            id: `course-${Date.now()}`,
                            slug: `${c.slug}-copy-${Date.now().toString().slice(-4)}`,
                            title: `${c.title} (Copy)`,
                            order: courses.length + 1,
                            createdAt: new Date().toISOString().split('T')[0],
                          };
                          saveCourse(dup);
                          showToast(`Duplicated ${c.title}!`);
                        }}
                        className="p-1.5 bg-black/40 hover:bg-black/90 border border-white/10 text-[#a89f91] hover:text-[#dfb56c] rounded cursor-pointer"
                        title="Duplicate Course Package"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Full Edit */}
                      <button
                        onClick={() => {
                          setEditingCourse({ ...c });
                          setCourseEditActiveTab('basics');
                        }}
                        className="px-2.5 py-1 bg-[#540d18] hover:bg-[#6e1322] border border-[#dfb56c]/60 text-[#f7e2a9] text-xs rounded font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Manage CMS</span>
                      </button>

                      {/* Delete with double confirmation */}
                      <button
                        onClick={() => {
                          if (
                            confirm(`Are you sure you want to delete course "${c.title}"?\nThis cannot be undone!`)
                          ) {
                            deleteCourse(c.id);
                            showToast(`Course deleted`);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-950/80 text-rose-400 rounded border border-rose-900/40 cursor-pointer"
                        title="Delete Course Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CUSTOM FORM BUILDER TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'forms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                Custom Course Application &amp; Survey Forms ({customForms.length})
              </h4>
              <p className="text-xs text-[#a89f91]">
                Design tailored multi-field application forms for specific courses without coding. Support text, phone, email, dropdowns, radio, checkboxes, and file uploads.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `form-${Date.now()}`;
                setEditingForm({
                  id: newId,
                  slug: `application-${Date.now().toString().slice(-4)}`,
                  title: 'New Course Application Form',
                  titleSinhala: 'නව පාඨමාලා අයදුම්පත',
                  instructions: 'Please fill in your details accurately to register for the atelier intake.',
                  instructionsSinhala: 'අයදුම්පත සම්පූර්ණ කර ඉදිරිපත් කරන්න.',
                  successMessage: 'Thank you! Your registration application has been submitted successfully.',
                  successMessageSinhala: 'ඔබගේ අයදුම්පත සාර්ථකව ලැබුණි.',
                  associatedCourseId: courses[0]?.id || '',
                  associatedCourseTitle: courses[0]?.title || '',
                  fields: [
                    { id: 'f_name', name: 'fullName', label: 'Full Name', labelSinhala: 'සම්පූර්ණ නම', type: 'text', required: true, placeholder: 'e.g. Kasun Perera' },
                    { id: 'f_phone', name: 'whatsappNumber', label: 'WhatsApp Number', labelSinhala: 'වට්ස්ඇප් අංකය', type: 'phone', required: true, placeholder: '07X XXXXXXX' },
                    { id: 'f_email', name: 'email', label: 'Email Address', labelSinhala: 'විද්‍යුත් තැපෑල', type: 'email', required: false, placeholder: 'you@domain.com' },
                    {
                      id: 'f_mode',
                      name: 'preferredMode',
                      label: 'Preferred Study Mode',
                      labelSinhala: 'හැදෑරීමට බලාපොරොත්තු වන ආකාරය',
                      type: 'radio',
                      required: true,
                      options: ['Physical Atelier Classes', 'Live Zoom Classes', 'Hybrid (Both)'],
                    },
                    {
                      id: 'f_loc',
                      name: 'preferredLocation',
                      label: 'Preferred Studio Location',
                      labelSinhala: 'කැමති ශාඛාව',
                      type: 'dropdown',
                      required: false,
                      options: ['Kegalle Main Atelier', 'Kurunegala Studio', 'Piliyandala Branch', 'Online Zoom Only'],
                    },
                    {
                      id: 'f_exp',
                      name: 'priorExperience',
                      label: 'Prior Sewing / Pattern Making Experience',
                      labelSinhala: 'පෙර මැහුම් පළපුරුද්ද',
                      type: 'dropdown',
                      required: false,
                      options: ['Complete Beginner', 'Basic Domestic Sewing', 'Intermediate Tailor', 'Garment Industry Professional'],
                    },
                    {
                      id: 'f_file',
                      name: 'paymentProof',
                      label: 'Upload Bank Payment Slip / Design Sample',
                      labelSinhala: 'ගෙවීම් රිසිට්පත හෝ නිර්මාණ ඡායාරූපය',
                      type: 'file',
                      required: false,
                    },
                  ],
                  isPublished: true,
                  version: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Custom Form
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customForms.map((form) => (
              <div
                key={form.id}
                className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4 flex flex-col justify-between hover:border-[#dfb56c] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/30">
                      Form v{form.version || 1} • {form.fields?.length || 0} Fields
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      form.isPublished ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {form.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                    {form.title}
                  </h4>
                  {form.titleSinhala && (
                    <p className="text-xs font-sinhala text-[#dfb56c] mt-0.5">
                      {form.titleSinhala}
                    </p>
                  )}

                  <div className="mt-2 text-xs text-[#a89f91] space-y-1">
                    <p className="line-clamp-2">{form.instructions}</p>
                    <div className="text-[11px] font-mono pt-1 text-[#dfb56c]">
                      Attached to: {form.associatedCourseTitle || 'Any Course'}
                    </div>
                  </div>

                  {/* Fields summary badges */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {form.fields?.map((fld) => (
                      <span
                        key={fld.id}
                        className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-[#f7f3eb]"
                      >
                        {fld.label} ({fld.type}){fld.required && ' *'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#a89f91]">
                    Slug: {form.slug}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingForm({ ...form })}
                      className="px-3 py-1 bg-[#141011] hover:bg-[#1f1618] border border-white/20 text-[#dfb56c] rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" /> Edit Fields
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete form "${form.title}"? Submissions will remain.`)) {
                          deleteCustomForm(form.id);
                          showToast('Form deleted');
                        }
                      }}
                      className="p-1 hover:bg-rose-950/80 text-rose-400 rounded border border-rose-900/40 cursor-pointer"
                      title="Delete Form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FORM SUBMISSIONS TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                Student Course Applications &amp; Inquiries ({formSubmissions.length})
              </h4>
              <p className="text-xs text-[#a89f91]">
                Real-time submissions from custom course forms. Review applicant responses, change application statuses, and export to Excel.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportSubmissionsToExcel(formSubmissions)}
                className="px-3 py-1.5 bg-[#141011] hover:bg-[#1e1316] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                title="Export all submissions to Excel spreadsheet"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#dfb56c]" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>

          {formSubmissions.length === 0 ? (
            <div className="p-8 text-center rounded bg-[#0c090a] border border-dashed border-white/10 text-xs text-[#a89f91]">
              No custom form submissions recorded yet. Once visitors submit an application on a course page, their answers appear here instantly.
            </div>
          ) : (
            <div className="space-y-3">
              {formSubmissions.map((sub) => {
                const subDate = new Date(sub.createdAt).toLocaleString();
                const applicantName = sub.submittedData?.fullName || sub.submittedData?.name || 'Applicant';
                const applicantPhone = sub.submittedData?.whatsappNumber || sub.submittedData?.phone || '';
                const applicantEmail = sub.submittedData?.email || '';

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3 hover:border-[#dfb56c]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#f7e2a9] font-mono">
                          {applicantName}
                        </span>
                        {applicantPhone && (
                          <span className="text-xs font-mono text-[#dfb56c]">
                            • {applicantPhone}
                          </span>
                        )}
                        {applicantEmail && (
                          <span className="text-xs text-[#a89f91]">
                            • {applicantEmail}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#a89f91]">
                          {subDate}
                        </span>

                        <select
                          value={sub.status || 'NEW'}
                          onChange={(e) => updateFormSubmissionStatus(sub.id, e.target.value as any)}
                          className="px-2 py-0.5 bg-[#141011] border border-[#dfb56c]/40 rounded text-[11px] font-mono font-bold text-[#f7e2a9] cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>

                        <button
                          onClick={() => {
                            if (confirm('Delete this submission?')) {
                              deleteFormSubmission(sub.id);
                              showToast('Submission deleted');
                            }
                          }}
                          className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                          title="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Course & Form Info */}
                    <div className="text-[11px] font-mono text-[#a89f91] flex items-center gap-3">
                      <span>Course: <strong className="text-[#f7f3eb]">{sub.courseTitle || 'General'}</strong></span>
                      <span>Form: <strong className="text-[#f7f3eb]">{sub.formSlug}</strong></span>
                    </div>

                    {/* Submitted Form Payload Grid */}
                    <div className="bg-[#141011] p-3 rounded border border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                      {sub.submittedData &&
                        Object.entries(sub.submittedData).map(([fieldKey, val]) => {
                          const isFile = typeof val === 'string' && (val.startsWith('data:image') || val.startsWith('data:application/pdf') || val.startsWith('http'));
                          return (
                            <div key={fieldKey} className="overflow-hidden">
                              <span className="text-[10px] font-mono uppercase text-[#a89f91] block truncate">
                                {fieldKey}
                              </span>
                              {isFile ? (
                                <a
                                  href={val}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#dfb56c] underline hover:text-[#f7e2a9] flex items-center gap-1 font-mono"
                                >
                                  <Download className="w-3 h-3" /> View Uploaded File
                                </a>
                              ) : (
                                <strong className="text-[#f7f3eb] break-words">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                                </strong>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Admin notes input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add internal counselor follow-up notes..."
                        defaultValue={sub.notes || ''}
                        onBlur={(e) => updateFormSubmissionStatus(sub.id, sub.status || 'NEW', e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                      />
                      {applicantPhone && (
                        <a
                          href={`https://wa.me/94${applicantPhone.replace(/\D/g, '').replace(/^0/, '')}?text=Dear%20${encodeURIComponent(applicantName)},%20Greetings%20from%20Ceylon%20Style%20Studio!%20We%20received%20your%20application%20for%20${encodeURIComponent(sub.courseTitle || 'our Fashion Course')}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/30 text-xs rounded font-bold flex items-center gap-1 font-mono"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. STUDENT VIDEO REVIEWS TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                Student Video Testimonials &amp; Reviews ({studentReviews.length})
              </h4>
              <p className="text-xs text-[#a89f91]">
                Manage approved student video reviews and written feedback. Only approved reviews appear on public course landing pages.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `rev-${Date.now()}`;
                setEditingReview({
                  id: newId,
                  studentName: '',
                  studentBatch: 'Atelier Graduate 2026',
                  courseId: courses[0]?.id || 'course-01',
                  courseTitle: courses[0]?.title || '6-Month Professional Fashion Diploma',
                  youtubeUrl: '',
                  videoId: '',
                  writtenFeedback: '',
                  rating: 5,
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  isApproved: true,
                  isFeatured: true,
                  order: studentReviews.length + 1,
                  createdAt: new Date().toISOString().split('T')[0],
                });
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Student Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentReviews.map((rev) => {
              const videoId = rev.videoId || parseYouTubeId(rev.youtubeUrl);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-sm bg-[#0c090a] border border-white/10 space-y-3 flex flex-col justify-between hover:border-[#dfb56c]/50 transition-all"
                >
                  <div>
                    {/* Video Embed Preview */}
                    <div className="relative aspect-video rounded overflow-hidden bg-black border border-white/10 mb-3">
                      {videoId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                          title={rev.studentName}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#a89f91] font-mono">
                          No Video URL Set
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.avatarUrl}
                          alt={rev.studentName}
                          className="w-7 h-7 rounded-full object-cover border border-[#dfb56c]"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#f7e2a9] block">
                            {rev.studentName}
                          </span>
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

                    <div className="text-[10px] font-mono text-[#dfb56c] mt-2 pt-2 border-t border-white/5">
                      Course: {rev.courseTitle}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => toggleReviewApproval(rev.id, !rev.isApproved)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer border ${
                        rev.isApproved
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {rev.isApproved ? '✓ Approved' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingReview({ ...rev })}
                        className="text-xs text-[#dfb56c] hover:underline font-bold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete review from ${rev.studentName}?`)) {
                            deleteStudentReview(rev.id);
                            showToast('Review deleted');
                          }
                        }}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: COMPREHENSIVE COURSE CMS EDITOR */}
      {/* ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                  Course Content Management System
                </span>
                <h3 className="text-xl font-editorial font-bold text-[#f7e2a9]">
                  {editingCourse.title ? `Manage: ${editingCourse.title}` : 'Create New Course Program'}
                </h3>
              </div>

              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 text-[#a89f91] hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Tabs Navigation */}
            <div className="flex items-center gap-1.5 py-3 border-b border-white/10 shrink-0 overflow-x-auto text-xs">
              {[
                { id: 'basics', label: '1. Basic Info & Fees', icon: <DollarSign className="w-3.5 h-3.5" /> },
                { id: 'about', label: '2. About & Outcomes', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'sections', label: `3. Dynamic Sections (${editingCourse.sections?.length || 0})`, icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'videos', label: `4. YouTube Videos (${editingCourse.videos?.length || 0})`, icon: <Video className="w-3.5 h-3.5" /> },
                { id: 'pdfs', label: `5. PDF Handouts (${editingCourse.pdfResources?.length || 0})`, icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'reviews', label: `6. Testimonials (${editingCourse.testimonials?.length || 0})`, icon: <Star className="w-3.5 h-3.5" /> },
                { id: 'form', label: '7. Custom Form Link', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCourseEditActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    courseEditActiveTab === tab.id
                      ? 'bg-[#dfb56c] text-black shadow'
                      : 'bg-[#0c090a] text-[#a89f91] hover:text-[#f7f3eb] border border-white/10'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              {/* TAB 1: BASICS & FEES */}
              {courseEditActiveTab === 'basics' && (
                <div className="space-y-4">
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Course Title (English) *</label>
                      <input
                        type="text"
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        placeholder="6-Month Professional Fashion & Branding Diploma"
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Title (සිංහල මාතෘකාව)</label>
                      <input
                        type="text"
                        value={editingCourse.titleSinhala || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, titleSinhala: e.target.value })}
                        placeholder="මාස 6ක වෘත්තීය විලාසිතා හා පැටන් නිර්මාණකරණ ඩිප්ලෝමාව"
                        className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                      />
                    </div>
                  </div>

                  {/* Slug & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">URL Slug (Unique)</label>
                      <input
                        type="text"
                        value={editingCourse.slug}
                        onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        placeholder="fashion-branding-diploma"
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Category &amp; Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editingCourse.category}
                          onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                          placeholder="Diploma Master Program"
                          className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                        />
                        <select
                          value={editingCourse.courseMode || 'HYBRID'}
                          onChange={(e) => setEditingCourse({ ...editingCourse, courseMode: e.target.value as any })}
                          className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#dfb56c] font-mono font-bold"
                        >
                          <option value="HYBRID">HYBRID (Physical & Zoom)</option>
                          <option value="PHYSICAL">PHYSICAL ONLY</option>
                          <option value="ZOOM">ZOOM ONLY</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tuition Fees */}
                  <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                    <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                      Course Tuition &amp; Registration Fees (LKR)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px]">Physical Monthly Fee (LKR)</label>
                        <input
                          type="number"
                          value={editingCourse.physicalFee}
                          onChange={(e) => setEditingCourse({ ...editingCourse, physicalFee: Number(e.target.value) })}
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px]">Zoom Monthly Fee (LKR)</label>
                        <input
                          type="number"
                          value={editingCourse.zoomFee}
                          onChange={(e) => setEditingCourse({ ...editingCourse, zoomFee: Number(e.target.value) })}
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px]">Registration Deposit (LKR)</label>
                        <input
                          type="number"
                          value={editingCourse.registrationFee}
                          onChange={(e) => setEditingCourse({ ...editingCourse, registrationFee: Number(e.target.value) })}
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration, Schedule, Badge & Intake */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#a89f91] mb-1 text-[10px] font-mono uppercase">Duration</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        placeholder="6 Months"
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a89f91] mb-1 text-[10px] font-mono uppercase">Badge Text</label>
                      <input
                        type="text"
                        value={editingCourse.badge || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                        placeholder="Official Flagship"
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a89f91] mb-1 text-[10px] font-mono uppercase">Intake Text</label>
                      <input
                        type="text"
                        value={editingCourse.intakeText || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, intakeText: e.target.value })}
                        placeholder="2026 Batch Admissions Open"
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Short Summary Description</label>
                    <textarea
                      rows={2}
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                    />
                  </div>

                  {/* Banner & Background Images */}
                  <div className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3">
                    <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                      Course Detail Page Banner &amp; Visual Styling
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">
                          Detail Page Hero Banner Image URL
                        </label>
                        <input
                          type="url"
                          value={editingCourse.bannerImageUrl || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, bannerImageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">
                          Card Background Image URL
                        </label>
                        <input
                          type="url"
                          value={editingCourse.cardBgImageUrl || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, cardBgImageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT & OUTCOMES */}
              {courseEditActiveTab === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#dfb56c] mb-1 font-mono uppercase text-[10px] font-bold">
                      About This Course (Full Narrative Description)
                    </label>
                    <textarea
                      rows={6}
                      value={editingCourse.aboutCourse || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, aboutCourse: e.target.value })}
                      placeholder="Write an in-depth description of what makes this course unique..."
                      className="w-full p-2.5 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">
                      පාඨමාලාව පිළිබඳ සම්පූර්ණ විස්තරය (Sinhala About Course)
                    </label>
                    <textarea
                      rows={5}
                      value={editingCourse.aboutCourseSinhala || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, aboutCourseSinhala: e.target.value })}
                      placeholder="පාඨමාලාව පිළිබඳ සවිස්තරාත්මක විස්තරය මෙහි ලියන්න..."
                      className="w-full p-2.5 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala leading-relaxed"
                    />
                  </div>

                  {/* Measurable Learning Outcomes */}
                  <div className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold">
                        Measurable Learning Outcomes ({editingCourse.learningOutcomes?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingCourse.learningOutcomes || [];
                          setEditingCourse({
                            ...editingCourse,
                            learningOutcomes: [...current, 'Master advanced contour drafting and spec sheet preparation'],
                          });
                        }}
                        className="px-2.5 py-1 bg-[#141011] hover:bg-[#1e1316] border border-[#dfb56c]/40 text-[#f7e2a9] rounded text-[11px] font-bold"
                      >
                        + Add Outcome
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingCourse.learningOutcomes || []).map((outcome, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <input
                            type="text"
                            value={outcome}
                            onChange={(e) => {
                              const updated = [...(editingCourse.learningOutcomes || [])];
                              updated[oIdx] = e.target.value;
                              setEditingCourse({ ...editingCourse, learningOutcomes: updated });
                            }}
                            className="flex-1 p-1.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingCourse.learningOutcomes || []).filter((_, i) => i !== oIdx);
                              setEditingCourse({ ...editingCourse, learningOutcomes: updated });
                            }}
                            className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor Bio */}
                  <div className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3">
                    <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                      Lead Instructor &amp; Atelier Faculty
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Instructor Name</label>
                        <input
                          type="text"
                          value={editingCourse.instructorName || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, instructorName: e.target.value })}
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Instructor Title / Role</label>
                        <input
                          type="text"
                          value={editingCourse.instructorTitle || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, instructorTitle: e.target.value })}
                          className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Instructor Bio</label>
                      <textarea
                        rows={2}
                        value={editingCourse.instructorBio || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, instructorBio: e.target.value })}
                        className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DYNAMIC SECTIONS MANAGER */}
              {courseEditActiveTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                        Course Detail Dynamic Content Sections ({editingCourse.sections?.length || 0})
                      </span>
                      <p className="text-[11px] text-[#a89f91]">
                        Add custom headings and multi-paragraph rich text blocks rendered dynamically on this course's public page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCourse.sections || [];
                        const newSec: CourseSectionItem = {
                          id: `sec-${Date.now()}-${current.length + 1}`,
                          title: `New Section ${current.length + 1}`,
                          titleSinhala: '',
                          content: 'Detailed description of curriculum, studio equipment, or schedule rules...',
                          order: current.length + 1,
                          isVisible: true,
                        };
                        setEditingCourse({ ...editingCourse, sections: [...current, newSec] });
                      }}
                      className="px-3 py-1.5 bg-[#dfb56c] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  {(!editingCourse.sections || editingCourse.sections.length === 0) ? (
                    <div className="p-6 text-center rounded bg-[#0c090a] border border-dashed border-white/10 text-xs text-[#a89f91]">
                      No custom sections added yet. Click "+ Add Section" above to create bespoke headings and narrative blocks.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingCourse.sections.map((sec, sIdx) => (
                        <div
                          key={sec.id || sIdx}
                          className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[#dfb56c] font-bold">
                              Section #{sIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Visibility toggle */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingCourse.sections!.map((item, i) =>
                                    i === sIdx ? { ...item, isVisible: !item.isVisible } : item
                                  );
                                  setEditingCourse({ ...editingCourse, sections: updated });
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer border ${
                                  sec.isVisible
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}
                              >
                                {sec.isVisible ? 'Visible' : 'Hidden'}
                              </button>

                              {/* Reorder Up */}
                              {sIdx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingCourse.sections!];
                                    const temp = updated[sIdx];
                                    updated[sIdx] = updated[sIdx - 1];
                                    updated[sIdx - 1] = temp;
                                    setEditingCourse({ ...editingCourse, sections: updated });
                                  }}
                                  className="p-1 bg-black/40 text-[#a89f91] hover:text-white rounded"
                                  title="Move Up"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Reorder Down */}
                              {sIdx < editingCourse.sections!.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingCourse.sections!];
                                    const temp = updated[sIdx];
                                    updated[sIdx] = updated[sIdx + 1];
                                    updated[sIdx + 1] = temp;
                                    setEditingCourse({ ...editingCourse, sections: updated });
                                  }}
                                  className="p-1 bg-black/40 text-[#a89f91] hover:text-white rounded"
                                  title="Move Down"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingCourse.sections!.filter((_, i) => i !== sIdx);
                                  setEditingCourse({ ...editingCourse, sections: updated });
                                }}
                                className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                                title="Remove section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Section Heading (English)</label>
                              <input
                                type="text"
                                value={sec.title}
                                onChange={(e) => {
                                  const updated = editingCourse.sections!.map((item, i) =>
                                    i === sIdx ? { ...item, title: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, sections: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#dfb56c] mb-1 text-[10px] font-sinhala font-bold">Sinhala Heading (සිංහල මාතෘකාව)</label>
                              <input
                                type="text"
                                value={sec.titleSinhala || ''}
                                onChange={(e) => {
                                  const updated = editingCourse.sections!.map((item, i) =>
                                    i === sIdx ? { ...item, titleSinhala: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, sections: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Section Narrative (Markdown / Rich Paragraphs)</label>
                            <textarea
                              rows={3}
                              value={sec.content}
                              onChange={(e) => {
                                const updated = editingCourse.sections!.map((item, i) =>
                                  i === sIdx ? { ...item, content: e.target.value } : item
                                );
                                setEditingCourse({ ...editingCourse, sections: updated });
                              }}
                              className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: YOUTUBE VIDEOS & PLAYLISTS */}
              {courseEditActiveTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                        Course Showcase &amp; YouTube Masterclass Lessons ({editingCourse.videos?.length || 0})
                      </span>
                      <p className="text-[11px] text-[#a89f91]">
                        Add multiple YouTube masterclass URLs and playlist embeds. Displays responsive 16:9 player on the course detail page without autoplaying sound.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCourse.videos || [];
                        const newVid: CourseVideoItem = {
                          id: `vid-${Date.now()}-${current.length + 1}`,
                          title: `Masterclass Video #${current.length + 1}`,
                          titleSinhala: '',
                          youtubeUrl: '',
                          videoId: '',
                          description: '',
                          order: current.length + 1,
                        };
                        setEditingCourse({ ...editingCourse, videos: [...current, newVid] });
                      }}
                      className="px-3 py-1.5 bg-[#dfb56c] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Video
                    </button>
                  </div>

                  {(!editingCourse.videos || editingCourse.videos.length === 0) ? (
                    <div className="p-6 text-center rounded bg-[#0c090a] border border-dashed border-white/10 text-xs text-[#a89f91]">
                      No video masterclasses attached yet. Click "+ Add Video" above to embed YouTube tutorials or student showcases.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingCourse.videos.map((vid, vIdx) => {
                        const parsedId = vid.videoId || parseYouTubeId(vid.youtubeUrl);
                        return (
                          <div
                            key={vid.id || vIdx}
                            className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-[#dfb56c] font-bold">
                                Video #{vIdx + 1} {parsedId && `(ID: ${parsedId})`}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingCourse.videos!.filter((_, i) => i !== vIdx);
                                  setEditingCourse({ ...editingCourse, videos: updated });
                                }}
                                className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Video Title</label>
                                <input
                                  type="text"
                                  value={vid.title}
                                  onChange={(e) => {
                                    const updated = editingCourse.videos!.map((item, i) =>
                                      i === vIdx ? { ...item, title: e.target.value } : item
                                    );
                                    setEditingCourse({ ...editingCourse, videos: updated });
                                  }}
                                  className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                                />
                              </div>
                              <div>
                                <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">YouTube URL (e.g. https://www.youtube.com/watch?v=...)</label>
                                <input
                                  type="url"
                                  value={vid.youtubeUrl}
                                  onChange={(e) => {
                                    const url = e.target.value;
                                    const extracted = parseYouTubeId(url);
                                    const updated = editingCourse.videos!.map((item, i) =>
                                      i === vIdx ? { ...item, youtubeUrl: url, videoId: extracted } : item
                                    );
                                    setEditingCourse({ ...editingCourse, videos: updated });
                                  }}
                                  className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Video Description / Lesson Key Points</label>
                              <input
                                type="text"
                                value={vid.description || ''}
                                onChange={(e) => {
                                  const updated = editingCourse.videos!.map((item, i) =>
                                    i === vIdx ? { ...item, description: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, videos: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PDF HANDOUTS & RESOURCES */}
              {courseEditActiveTab === 'pdfs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                        Downloadable PDF Study Notes &amp; Handouts ({editingCourse.pdfResources?.length || 0})
                      </span>
                      <p className="text-[11px] text-[#a89f91]">
                        Attach downloadable curriculum blueprints, measurement charts, and spec sheets with secure links.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCourse.pdfResources || [];
                        const newPdf: CourseResourceItem = {
                          id: `pdf-${Date.now()}-${current.length + 1}`,
                          title: `Course Study Guide #${current.length + 1}`,
                          titleSinhala: '',
                          fileUrl: '',
                          fileSize: '1.2 MB',
                          description: 'Technical measurement formulas, dart diagrams, and sloper guidelines.',
                          isRestricted: false,
                        };
                        setEditingCourse({ ...editingCourse, pdfResources: [...current, newPdf] });
                      }}
                      className="px-3 py-1.5 bg-[#dfb56c] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add PDF Document
                    </button>
                  </div>

                  {(!editingCourse.pdfResources || editingCourse.pdfResources.length === 0) ? (
                    <div className="p-6 text-center rounded bg-[#0c090a] border border-dashed border-white/10 text-xs text-[#a89f91]">
                      No PDF resources attached yet. Click "+ Add PDF Document" above to attach student handouts.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingCourse.pdfResources.map((pdf, pIdx) => (
                        <div
                          key={pdf.id || pIdx}
                          className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-amber-400" /> PDF Document #{pIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCourse.pdfResources!.filter((_, i) => i !== pIdx);
                                setEditingCourse({ ...editingCourse, pdfResources: updated });
                              }}
                              className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Document Title</label>
                              <input
                                type="text"
                                value={pdf.title}
                                onChange={(e) => {
                                  const updated = editingCourse.pdfResources!.map((item, i) =>
                                    i === pIdx ? { ...item, title: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, pdfResources: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">File Size (e.g. 1.8 MB)</label>
                              <input
                                type="text"
                                value={pdf.fileSize || ''}
                                onChange={(e) => {
                                  const updated = editingCourse.pdfResources!.map((item, i) =>
                                    i === pIdx ? { ...item, fileSize: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, pdfResources: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-8">
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">File URL or Uploaded Document</label>
                              <input
                                type="text"
                                value={pdf.fileUrl}
                                onChange={(e) => {
                                  const updated = editingCourse.pdfResources!.map((item, i) =>
                                    i === pIdx ? { ...item, fileUrl: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, pdfResources: updated });
                                }}
                                placeholder="https://... or upload with button"
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] font-mono"
                              />
                            </div>
                            <div className="sm:col-span-4 pt-3 sm:pt-4">
                              <label className="btn-3d-secondary w-full py-2 px-3 text-xs rounded cursor-pointer text-center block">
                                <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload PDF File
                                <input
                                  type="file"
                                  accept=".pdf,application/pdf"
                                  className="sr-only"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Validate type & size (max 10MB)
                                      if (file.size > 10 * 1024 * 1024) {
                                        alert('PDF size exceeds 10MB limit. Please compress first.');
                                        return;
                                      }
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const res = ev.target?.result as string;
                                        if (res) {
                                          const updated = editingCourse.pdfResources!.map((item, i) =>
                                            i === pIdx
                                              ? {
                                                  ...item,
                                                  title: file.name,
                                                  fileUrl: res,
                                                  fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                                                }
                                              : item
                                          );
                                          setEditingCourse({ ...editingCourse, pdfResources: updated });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: TESTIMONIALS */}
              {courseEditActiveTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                        Course-Specific Reviews &amp; Testimonials ({editingCourse.testimonials?.length || 0})
                      </span>
                      <p className="text-[11px] text-[#a89f91]">
                        Add student feedback, YouTube review video links, and star ratings specifically highlighted on this course page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCourse.testimonials || [];
                        const newTest: CourseTestimonialItem = {
                          id: `tst-${Date.now()}-${current.length + 1}`,
                          studentName: 'Graduate Designer',
                          feedback: 'The anatomical sloper drafting techniques transformed my fashion collection completely.',
                          youtubeUrl: '',
                          rating: 5,
                        };
                        setEditingCourse({ ...editingCourse, testimonials: [...current, newTest] });
                      }}
                      className="px-3 py-1.5 bg-[#dfb56c] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Review
                    </button>
                  </div>

                  {(!editingCourse.testimonials || editingCourse.testimonials.length === 0) ? (
                    <div className="p-6 text-center rounded bg-[#0c090a] border border-dashed border-white/10 text-xs text-[#a89f91]">
                      No reviews attached specifically to this course. General approved reviews will be displayed by default.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingCourse.testimonials.map((test, tIdx) => (
                        <div
                          key={test.id || tIdx}
                          className="p-4 rounded bg-[#0c090a] border border-white/10 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[#dfb56c] font-bold">
                              Student Review #{tIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCourse.testimonials!.filter((_, i) => i !== tIdx);
                                setEditingCourse({ ...editingCourse, testimonials: updated });
                              }}
                              className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Student Name</label>
                              <input
                                type="text"
                                value={test.studentName}
                                onChange={(e) => {
                                  const updated = editingCourse.testimonials!.map((item, i) =>
                                    i === tIdx ? { ...item, studentName: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, testimonials: updated });
                                }}
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">YouTube Review Video URL (Optional)</label>
                              <input
                                type="url"
                                value={test.youtubeUrl || ''}
                                onChange={(e) => {
                                  const updated = editingCourse.testimonials!.map((item, i) =>
                                    i === tIdx ? { ...item, youtubeUrl: e.target.value } : item
                                  );
                                  setEditingCourse({ ...editingCourse, testimonials: updated });
                                }}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Written Feedback</label>
                            <textarea
                              rows={2}
                              value={test.feedback}
                              onChange={(e) => {
                                const updated = editingCourse.testimonials!.map((item, i) =>
                                  i === tIdx ? { ...item, feedback: e.target.value } : item
                                );
                                setEditingCourse({ ...editingCourse, testimonials: updated });
                              }}
                              className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: CUSTOM FORM LINK */}
              {courseEditActiveTab === 'form' && (
                <div className="space-y-4">
                  <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                    <span className="text-[#dfb56c] font-mono uppercase text-xs font-bold block">
                      Attach Custom Application Form to this Course
                    </span>
                    <p className="text-xs text-[#a89f91]">
                      When visitors click "Register Now" on this course page, they can be presented with a bespoke application form built in the Custom Form Builder. If no custom form is attached, visitors are smoothly navigated to the official protected registration form with this course preselected.
                    </p>

                    <div className="pt-2">
                      <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                        Select Attached Custom Form:
                      </label>
                      <select
                        value={editingCourse.customFormId || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, customFormId: e.target.value })}
                        className="w-full p-2.5 bg-[#141011] border border-[#dfb56c]/40 rounded text-xs text-[#f7e2a9] font-mono font-bold"
                      >
                        <option value="">-- None (Use Protected Standard Registration Form) --</option>
                        {customForms.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title} ({f.fields?.length || 0} fields) - Slug: {f.slug}
                          </option>
                        ))}
                      </select>
                    </div>

                    {editingCourse.customFormId && (
                      <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
                        ✓ Connected: Applicants on this course page will submit through the selected custom form. Responses will be recorded in Form Submissions with full file attachments.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Save Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9] text-xs">
                  <input
                    type="checkbox"
                    checked={editingCourse.isPublished !== false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#dfb56c]"
                  />
                  <span className="font-bold">Published (Visible to Public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#a89f91] text-xs">
                  <input
                    type="checkbox"
                    checked={editingCourse.isArchived === true}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isArchived: e.target.checked })}
                    className="w-4 h-4 accent-[#dfb56c]"
                  />
                  <span>Archive</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-white/10 rounded text-[#a89f91] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!editingCourse.title.trim()) {
                      alert('Please provide a course title.');
                      return;
                    }
                    await saveCourse(editingCourse);
                    setEditingCourse(null);
                    showToast(`Course "${editingCourse.title}" saved successfully!`);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase tracking-wider rounded shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Course CMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CUSTOM FORM EDITOR & FIELD BUILDER */}
      {/* ======================================================== */}
      {editingForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                  Custom Form Schema Builder
                </span>
                <h3 className="text-xl font-editorial font-bold text-[#f7e2a9]">
                  {editingForm.title}
                </h3>
              </div>
              <button onClick={() => setEditingForm(null)} className="p-1.5 text-[#a89f91] hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Form Title *</label>
                  <input
                    type="text"
                    value={editingForm.title}
                    onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Title (සිංහල මාතෘකාව)</label>
                  <input
                    type="text"
                    value={editingForm.titleSinhala || ''}
                    onChange={(e) => setEditingForm({ ...editingForm, titleSinhala: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">URL Slug</label>
                  <input
                    type="text"
                    value={editingForm.slug}
                    onChange={(e) => setEditingForm({ ...editingForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Associated Course</label>
                  <select
                    value={editingForm.associatedCourseId || ''}
                    onChange={(e) => {
                      const sel = courses.find((c) => c.id === e.target.value);
                      setEditingForm({
                        ...editingForm,
                        associatedCourseId: e.target.value,
                        associatedCourseTitle: sel?.title || '',
                      });
                    }}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7e2a9]"
                  >
                    <option value="">General (All Courses)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instructions and Success Message */}
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Instructions for Applicant</label>
                <textarea
                  rows={2}
                  value={editingForm.instructions || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, instructions: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Custom Success Message on Submission</label>
                <input
                  type="text"
                  value={editingForm.successMessage || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, successMessage: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              {/* Field Builder */}
              <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                    Form Input Fields ({editingForm.fields?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = editingForm.fields || [];
                      const fNum = current.length + 1;
                      const newFld: CustomFormField = {
                        id: `f_${Date.now()}_${fNum}`,
                        name: `field_${fNum}`,
                        label: `New Field ${fNum}`,
                        type: 'text',
                        required: false,
                        placeholder: '',
                      };
                      setEditingForm({ ...editingForm, fields: [...current, newFld] });
                    }}
                    className="px-3 py-1 bg-[#dfb56c] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingForm.fields || []).map((fld, idx) => (
                    <div
                      key={fld.id || idx}
                      className="p-3 rounded bg-[#141011] border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#f7e2a9] font-bold">
                          #{idx + 1} • {fld.label || 'Unnamed Field'}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[11px] text-[#a89f91] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={fld.required}
                              onChange={(e) => {
                                const updated = editingForm.fields!.map((item, i) =>
                                  i === idx ? { ...item, required: e.target.checked } : item
                                );
                                setEditingForm({ ...editingForm, fields: updated });
                              }}
                              className="w-3.5 h-3.5 accent-[#dfb56c]"
                            />
                            <span>Required *</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingForm.fields!.filter((_, i) => i !== idx);
                              setEditingForm({ ...editingForm, fields: updated });
                            }}
                            className="p-1 text-rose-400 hover:bg-rose-950/60 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Field Label</label>
                          <input
                            type="text"
                            value={fld.label}
                            onChange={(e) => {
                              const updated = editingForm.fields!.map((item, i) =>
                                i === idx ? { ...item, label: e.target.value } : item
                              );
                              setEditingForm({ ...editingForm, fields: updated });
                            }}
                            className="w-full p-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Field Type</label>
                          <select
                            value={fld.type}
                            onChange={(e) => {
                              const updated = editingForm.fields!.map((item, i) =>
                                i === idx ? { ...item, type: e.target.value as any } : item
                              );
                              setEditingForm({ ...editingForm, fields: updated });
                            }}
                            className="w-full p-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#dfb56c] font-mono font-bold"
                          >
                            <option value="text">Single-line Text</option>
                            <option value="phone">WhatsApp / Phone</option>
                            <option value="email">Email Address</option>
                            <option value="dropdown">Dropdown Select</option>
                            <option value="radio">Radio Buttons</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="textarea">Multi-line Textarea</option>
                            <option value="file">File Upload (Slip/Portfolio)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#a89f91] mb-1 text-[10px] font-mono">Placeholder / Hint</label>
                          <input
                            type="text"
                            value={fld.placeholder || ''}
                            onChange={(e) => {
                              const updated = editingForm.fields!.map((item, i) =>
                                i === idx ? { ...item, placeholder: e.target.value } : item
                              );
                              setEditingForm({ ...editingForm, fields: updated });
                            }}
                            placeholder="e.g. Enter details..."
                            className="w-full p-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                          />
                        </div>
                      </div>

                      {/* Options input if dropdown or radio */}
                      {(fld.type === 'dropdown' || fld.type === 'radio' || fld.type === 'checkbox') && (
                        <div className="pt-1">
                          <label className="block text-[#dfb56c] mb-1 text-[10px] font-mono">
                            Options (comma separated):
                          </label>
                          <input
                            type="text"
                            value={fld.options ? fld.options.join(', ') : ''}
                            onChange={(e) => {
                              const opts = e.target.value.split(',').map((o) => o.trim()).filter(Boolean);
                              const updated = editingForm.fields!.map((item, i) =>
                                i === idx ? { ...item, options: opts } : item
                              );
                              setEditingForm({ ...editingForm, fields: updated });
                            }}
                            placeholder="Option 1, Option 2, Option 3"
                            className="w-full p-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9] font-mono"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setEditingForm(null)}
                className="px-4 py-2 border border-white/10 rounded text-[#a89f91] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!editingForm.title.trim()) {
                    alert('Please enter a form title.');
                    return;
                  }
                  await saveCustomForm(editingForm);
                  setEditingForm(null);
                  showToast(`Custom Form "${editingForm.title}" saved!`);
                }}
                className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase tracking-wider rounded shadow-lg hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Custom Form Schema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: STUDENT REVIEW EDITOR */}
      {/* ======================================================== */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-editorial font-bold text-[#f7e2a9]">
                {editingReview.studentName ? `Edit Review: ${editingReview.studentName}` : 'Add Student Video Review'}
              </h3>
              <button onClick={() => setEditingReview(null)} className="p-1.5 text-[#a89f91] hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Student Name *</label>
                <input
                  type="text"
                  value={editingReview.studentName}
                  onChange={(e) => setEditingReview({ ...editingReview, studentName: e.target.value })}
                  placeholder="e.g. Amanda Perera"
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Student Batch / Label</label>
                  <input
                    type="text"
                    value={editingReview.studentBatch || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, studentBatch: e.target.value })}
                    placeholder="2025/2026 Batch Graduate"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Star Rating</label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7e2a9]"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★</option>
                    <option value={3}>3 Stars ★★★</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Associated Course</label>
                <select
                  value={editingReview.courseId || ''}
                  onChange={(e) => {
                    const sel = courses.find((c) => c.id === e.target.value);
                    setEditingReview({
                      ...editingReview,
                      courseId: e.target.value,
                      courseTitle: sel?.title || '',
                    });
                  }}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">YouTube Video Review URL</label>
                <input
                  type="url"
                  value={editingReview.youtubeUrl}
                  onChange={(e) => setEditingReview({ ...editingReview, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Written Testimonial / Feedback</label>
                <textarea
                  rows={3}
                  value={editingReview.writtenFeedback || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, writtenFeedback: e.target.value })}
                  placeholder="Quote from student about their pattern making transformation..."
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9]">
                  <input
                    type="checkbox"
                    checked={editingReview.isApproved !== false}
                    onChange={(e) => setEditingReview({ ...editingReview, isApproved: e.target.checked })}
                    className="w-4 h-4 accent-[#dfb56c]"
                  />
                  <span className="font-bold">Approved for Public Display</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 border border-white/10 rounded text-[#a89f91] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingReview.studentName.trim()) {
                    alert('Please enter student name.');
                    return;
                  }
                  await saveStudentReview(editingReview);
                  setEditingReview(null);
                  showToast('Student review saved!');
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase rounded shadow-lg hover:brightness-110 cursor-pointer"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
