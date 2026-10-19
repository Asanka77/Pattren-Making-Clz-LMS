import React, { useState } from 'react';
import {
  CampaignPage,
  CampaignLead,
  CampaignVideoEmbed,
  CampaignReviewEmbed,
  CampaignPdfResource,
  CourseItem,
} from '../../types';
import { useData } from '../../context/DataContext';
import {
  Flame,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  Video,
  FileText,
  Star,
  Users,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Sparkles,
  ChevronRight,
  Eye,
  MessageSquare,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Helper to parse YouTube video IDs
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

interface FBCampaignAdminManagerProps {
  onPreviewCampaign?: (slug: string) => void;
}

export function FBCampaignAdminManager({ onPreviewCampaign }: FBCampaignAdminManagerProps) {
  const {
    campaigns,
    saveCampaign,
    deleteCampaign,
    campaignLeads,
    updateCampaignLeadStatus,
    deleteCampaignLead,
    courses,
  } = useData();

  // Tab state within Campaign Admin
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads'>('campaigns');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [selectedCampaignForLeads, setSelectedCampaignForLeads] = useState<string>('ALL');

  // Edit Campaign State
  const [editingCampaign, setEditingCampaign] = useState<CampaignPage | null>(null);
  const [campaignEditorTab, setCampaignEditorTab] = useState<'basics' | 'about' | 'videos' | 'pdf' | 'reviews' | 'pricing' | 'form'>('basics');

  // Selected Lead Details
  const [selectedLead, setSelectedLead] = useState<CampaignLead | null>(null);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Copy URL Helper
  const copyCampaignUrl = (slug: string, campaignTitle: string) => {
    const origin = window.location.origin;
    // Supports #promo/:slug which works universally on client-side routing & iframe preview
    const url = `${origin}/#promo/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    showToast(`FB Ad Link for "${campaignTitle}" copied! Ready to paste into Facebook Ads Manager.`);
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.titleSinhala && c.titleSinhala.includes(searchTerm)) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && c.isPublished) ||
      (statusFilter === 'DRAFT' && !c.isPublished);

    return matchesSearch && matchesStatus;
  });

  // Filtered leads
  const filteredLeads = campaignLeads.filter((l) => {
    if (selectedCampaignForLeads !== 'ALL' && l.campaignSlug !== selectedCampaignForLeads && l.campaignId !== selectedCampaignForLeads) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = l.fullName.toLowerCase().includes(q);
      const matchPhone = l.whatsappNumber.includes(q);
      const matchCity = (l.city || '').toLowerCase().includes(q);
      const matchDistrict = (l.district || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCity && !matchDistrict) return false;
    }
    return true;
  });

  // Export Leads to Excel
  const exportLeadsToExcel = () => {
    try {
      const rows = filteredLeads.map((l, idx) => ({
        '#': idx + 1,
        'Lead ID': l.id,
        'Campaign Title': l.campaignTitle,
        'Campaign Slug': l.campaignSlug,
        'Full Name': l.fullName,
        'WhatsApp Phone': l.whatsappNumber,
        'District': l.district || '',
        'City': l.city || '',
        'Study Mode': l.studyMode,
        'Preferred Location': l.preferredLocation || '',
        'Sewing Experience': l.experienceLevel || '',
        'Special Notes': l.notes || '',
        'Status': l.status,
        'Admin Notes': l.adminNotes || '',
        'Submission Date': new Date(l.createdAt).toLocaleString(),
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'FB Campaign Leads');
      XLSX.writeFile(wb, `CSS_FB_Campaign_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Leads exported successfully to Excel!');
    } catch (e) {
      console.error(e);
      showToast('Failed to export leads. Please try again.');
    }
  };

  // Helper to open new campaign creator
  const handleCreateNewCampaign = () => {
    const newId = `camp-${Date.now()}`;
    const newCampaign: CampaignPage = {
      id: newId,
      slug: `fb-masterclass-${Date.now().toString().slice(-4)}`,
      title: 'Fashion Design & Pattern Making Masterclass',
      titleSinhala: 'විලාසිතා හා ඇඳුම් පැටර්න් නිර්මාණ මාස්ටර්ක්ලාස්',
      badge: '🔥 Facebook Boost Special Offer - 50% Off',
      badgeSinhala: '🔥 Facebook විශේෂ දීමනාව - 50% වට්ටමක්',
      associatedCourseId: courses[0]?.id || 'course-01',
      associatedCourseTitle: courses[0]?.title || '6-Month Professional Fashion & Branding Diploma',
      aboutHeading: 'About This Course (Sri Lanka Top Atelier)',
      aboutHeadingSinhala: 'පාඨමාලාව පිළිබඳ සම්පූර්ණ විස්තරය',
      aboutDescription: 'Join Sri Lanka’s premier fashion atelier. Master industrial pattern drafting, dart manipulation, haute couture styling, and launch your own high-profit boutique brand.',
      aboutDescriptionSinhala: 'ශ්‍රී ලංකාවේ ප්‍රමුඛතම ප්‍රායෝගික විලාසිතා ඇකඩමිය හා අත්වැල් බැඳගන්න. නිවැරදි සිරුරු මිණුම්, ප්‍රංශ ඩාර්ට්ස්, මංගල ඇඳුම්, AI මෝස්තර නිර්මාණය සහ ඔබේම ඇඳුම් සන්නාමයක් ආරම්භ කිරීමට අවශ්‍ය සියලු තාක්ෂණය මුලසිට සරලව ප්‍රායෝගිකව උගන්වනු ලැබේ.',
      highlights: [
        '100% Practical Training on Real Industrial Mannequins & Juki Machinery',
        'Learn European Master Pattern Grading & Precision Cutting Systems',
        'AI Fashion Design: Generate Lookbooks & Digital Fashion without Studio Costs',
        'Official Gold Diploma & Industry Recognized Portfolio'
      ],
      highlightsSinhala: [
        '100% සැබෑ කාර්මික මැහුම් යන්ත්‍ර සහ මැනික්වින් ඩමි මත කෙරෙන ප්‍රායෝගික පුහුණුව',
        'යුරෝපීය ප්‍රමිතියේ නිවැරදි පැටර්න් ඇඳීම සහ ග්‍රේඩින් ක්‍රමවේද',
        'AI මෝස්තර නිර්මාණය: මොඩලයන් නැතිවම ඔබේ සන්නාමයේ Lookbooks සැකසීම',
        'ජාත්‍යන්තර පිළිගැනීමක් සහිත රන් ඩිප්ලෝමා සහතිකය සහ පෝට්ෆෝලියෝව'
      ],
      videos: [
        {
          id: `vid-1-${Date.now()}`,
          heading: '01. Course Overview & Studio Workshop Experience',
          headingSinhala: '01. පාඨමාලාව සහ ප්‍රායෝගික වැඩමුළු අත්දැකීම',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Take a virtual tour inside our luxury ateliers in Kegalle, Kurunegala and Piliyandala.',
        },
        {
          id: `vid-2-${Date.now()}`,
          heading: '02. Bodice Drafting & Dart Manipulation Masterclass',
          headingSinhala: '02. සජීවී පැටර්න් ඇඳීම සහ ඩාර්ට් තාක්ෂණය',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Exclusive demo showing how complex French darts and bust fitting are perfected.',
        }
      ],
      pdfResource: {
        id: `pdf-1-${Date.now()}`,
        title: 'Official Course Curriculum & 34-Module Prospectus (PDF)',
        titleSinhala: 'සම්පූර්ණ පාඨමාලා විෂය නිර්දේශය සහ තොරතුරු අත්පොත (PDF)',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '4.8 MB',
        description: 'Includes full weekly lesson schedules, tool requirements, fees and location maps.'
      },
      studentReviews: [
        {
          id: `rev-1-${Date.now()}`,
          heading: 'Launched My Own Haute Couture Label "SÉVON"',
          studentName: 'Sanduni Perera',
          studentBatch: 'Batch 2025 • Kurunegala Atelier',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          rating: 5,
          feedback: 'Before joining, I only knew basic straight stitching. Today I design custom bridal wear and evening dresses for clients across Sri Lanka.'
        }
      ],
      regularPrice: 15000,
      discountPrice: 7500,
      currency: 'LKR',
      intakeText: '2026 Academic Intake • Physical & Zoom Batches',
      intakeTextSinhala: '2026 නව බඳවා ගැනීම් • ප්‍රායෝගික වැඩමුළු සහ Zoom පන්ති',
      countdownEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      spotsLeft: 7,
      whatsappNumber: '+94703755312',
      whatsappPrefillText: 'Hello Ceylon Style Studio, I saw your Facebook ad and would like to register for the 50% Special Offer for the Fashion & Pattern Making Diploma!',
      formHeading: 'Step 2: Student Details & Batch Reservation',
      formHeadingSinhala: 'පියවර 02: ශිෂ්‍ය තොරතුරු සහ ආසනය වෙන්කරවා ගැනීම',
      formSubheading: 'Fill out the form below to lock in your promotional discount.',
      formSubheadingSinhala: '50% විශේෂ වට්ටම සහිතව ඔබගේ ආසනය වෙන්කරවා ගැනීමට පහත තොරතුරු සම්පූර්ණ කරන්න.',
      requireExperience: false,
      requireLocation: true,
      allowedLocations: ['KEGALLE ATELIER', 'KURUNEGALA ATELIER', 'PILIYANDALA ATELIER', 'ONLINE ZOOM INTERACTIVE'],
      successTitle: 'Registration Received Successfully!',
      successTitleSinhala: 'ඔබගේ ලියාපදිංචිය සාර්ථකව ලැබිණි!',
      successMessage: 'Your seat has been tentatively reserved with the 50% Facebook Boost promotional discount.',
      successMessageSinhala: '50% Facebook විශේෂ වට්ටම යටතේ ඔබේ ආසනය වෙන්කෙරිණි. දැන්ම අපගේ WhatsApp අංකය වෙත පණිවිඩයක් යොමුකර පාඨමාලා ආරම්භක දිනය තහවුරු කරගන්න!',
      isPublished: true,
      viewsCount: 0,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setEditingCampaign(newCampaign);
    setCampaignEditorTab('basics');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & Mode Switcher */}
      <div className="p-5 rounded-lg bg-gradient-to-r from-[#1c1013] via-[#241317] to-[#120a0d] border border-[#dfb56c]/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c] text-black">
              FB AD CAMPAIGN BUILDER
            </span>
            <span className="text-xs font-mono text-[#a89f91]">
              Independent High-Converting Landing Pages &amp; 2-Step Lead Forms
            </span>
          </div>
          <h2 className="text-xl font-editorial font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#dfb56c]" />
            <span>Facebook Boost Campaign Pages &amp; Lead Funnel</span>
          </h2>
          <p className="text-xs text-[#d5cfc4] mt-1 font-sinhala max-w-2xl leading-relaxed">
            Facebook Boost සහ Instagram ඇඩ්ස් සඳහා විශේෂිත වූ ආකර්ෂණීය Landing Pages සාදන්න. වීඩියෝ කිහිපයක් (Multiple Videos), විෂය නිර්දේශ PDF බාගැනීම්, ශිෂ්‍ය ප්‍රතිචාර (Student Reviews) සහ පියවර 2ක ලියාපදිංචි පෝරමය මගින් ශිෂ්‍ය තොරතුරු පහසුවෙන් ලබාගන්න.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {/* Sub Tab buttons */}
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-[#dfb56c] text-black font-bold shadow'
                : 'bg-[#0c090a] border border-white/10 text-[#a89f91] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Campaign Pages ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#dfb56c] text-black font-bold shadow'
                : 'bg-[#0c090a] border border-white/10 text-[#a89f91] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Leads ({campaignLeads.length})</span>
          </button>

          {activeTab === 'campaigns' && (
            <button
              onClick={handleCreateNewCampaign}
              className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase rounded hover:bg-[#6e1322] flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign Page</span>
            </button>
          )}

          {activeTab === 'leads' && (
            <button
              onClick={exportLeadsToExcel}
              className="px-4 py-2 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold uppercase rounded hover:bg-emerald-900 flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Leads (Excel)</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CAMPAIGN PAGES LIST                                */}
      {/* ========================================================= */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded bg-[#0c090a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns by title or slug..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#141011] border border-white/10 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
              <span className="text-[#a89f91]">Status:</span>
              {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#dfb56c] text-black font-bold'
                      : 'bg-black/40 text-[#a89f91] hover:text-white border border-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => {
              const leadCount = campaignLeads.filter(
                (l) => l.campaignSlug === camp.slug || l.campaignId === camp.id
              ).length;

              return (
                <div
                  key={camp.id}
                  className="p-5 rounded-lg bg-[#0c090a] border border-[#c99a45]/30 hover:border-[#dfb56c] transition-all space-y-4 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Badge & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38070e] border border-[#dfb56c]/40 text-[#dfb56c] line-clamp-1">
                        {camp.badge || 'FB BOOST OFFER'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                          camp.isPublished
                            ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {camp.isPublished ? '● Live Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Campaign Title */}
                    <h3 className="text-base font-editorial font-bold text-white group-hover:text-[#dfb56c] transition-colors leading-snug">
                      {camp.title}
                    </h3>
                    {camp.titleSinhala && (
                      <h4 className="text-xs text-[#b8afa2] font-sinhala line-clamp-1 mt-0.5">
                        {camp.titleSinhala}
                      </h4>
                    )}

                    {/* Meta Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-center font-mono text-xs">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase">Leads Captured</span>
                        <strong className="text-emerald-400 text-sm font-bold">{leadCount}</strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase">Fee Offer</span>
                        <strong className="text-[#dfb56c] text-xs font-bold">
                          {camp.currency || 'LKR'} {(camp.discountPrice ?? 7500).toLocaleString()}
                        </strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase">Videos Embed</span>
                        <strong className="text-white text-sm font-bold">{camp.videos?.length || 0}</strong>
                      </div>
                    </div>

                    {/* Slug & Direct URL display */}
                    <div className="mt-3 p-2 rounded bg-[#140b0e] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-[#a89f91] truncate text-[11px]">
                        URL: <strong className="text-[#dfb56c]">/#promo/{camp.slug}</strong>
                      </span>
                      <button
                        onClick={() => copyCampaignUrl(camp.slug, camp.title)}
                        className="px-2 py-1 rounded bg-[#38070e] hover:bg-[#540d18] border border-[#dfb56c]/40 text-[#dfb56c] text-[10px] flex items-center gap-1 shrink-0 cursor-pointer font-bold"
                        title="Copy direct FB Ad Link"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Ad Link</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (onPreviewCampaign) {
                            onPreviewCampaign(camp.slug);
                          } else {
                            window.open(`/#promo/${camp.slug}`, '_blank');
                          }
                        }}
                        className="px-3 py-1.5 rounded bg-[#1b1013] hover:bg-[#281318] border border-white/15 text-[#dfb56c] flex items-center gap-1 cursor-pointer font-bold"
                        title="Preview landing page in new tab"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Page</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCampaignForLeads(camp.slug);
                          setActiveTab('leads');
                        }}
                        className="px-3 py-1.5 rounded bg-[#1b1013] hover:bg-[#281318] border border-white/15 text-[#a89f91] hover:text-white flex items-center gap-1 cursor-pointer"
                        title="View leads for this campaign"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Leads ({leadCount})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCampaign({ ...camp });
                          setCampaignEditorTab('basics');
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-[#dfb56c] cursor-pointer"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete campaign "${camp.title}"?`)) {
                            deleteCampaign(camp.id);
                            showToast(`Campaign "${camp.title}" deleted.`);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-950/60 text-red-400 cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDENT LEADS LIST                                 */}
      {/* ========================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Leads Filter Bar */}
          <div className="p-3.5 rounded bg-[#0c090a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-[#a89f91]">Campaign:</span>
              <select
                value={selectedCampaignForLeads}
                onChange={(e) => setSelectedCampaignForLeads(e.target.value)}
                className="px-3 py-1.5 bg-[#141011] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
              >
                <option value="ALL">All Campaigns ({campaignLeads.length} Total Leads)</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or phone..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#141011] border border-white/10 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
              />
            </div>
          </div>

          {/* Leads Table */}
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center rounded bg-[#0c090a] border border-dashed border-white/10 space-y-3">
              <Users className="w-10 h-10 text-[#a89f91] mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-white">No Leads Found</h4>
              <p className="text-xs text-[#a89f91] max-w-sm mx-auto font-sinhala">
                මෙම ප්‍රචාරක පෝරමය හරහා මෙතෙක් ශිෂ්‍ය ලියාපදිංචිවීම් වාර්තා වී නොමැත. Facebook Boost Ad එකෙහි Link එක Share කර අලුත් Leads ලබාගන්න.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0c090a] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140b0e] text-[#dfb56c] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">WhatsApp Phone</th>
                      <th className="p-3">Location / District</th>
                      <th className="p-3">Study Mode</th>
                      <th className="p-3">Campaign Source</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-white">
                          <div className="flex flex-col">
                            <span>{lead.fullName}</span>
                            {lead.experienceLevel && (
                              <span className="text-[10px] text-[#a89f91] font-normal truncate max-w-[180px]">
                                {lead.experienceLevel}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 font-mono text-emerald-400">
                          <div className="flex items-center gap-1.5">
                            <span>{lead.whatsappNumber}</span>
                            <a
                              href={`https://wa.me/${lead.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${lead.fullName}, thank you for registering with Ceylon Style Studio via our Facebook special offer for ${lead.campaignTitle}!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="p-3 text-[#d5cfc4]">
                          {lead.preferredLocation || lead.city || lead.district || 'Kurunegala'}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              lead.studyMode === 'PHYSICAL'
                                ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                                : 'bg-blue-950/80 border border-blue-500/40 text-blue-300'
                            }`}
                          >
                            {lead.studyMode}
                          </span>
                        </td>

                        <td className="p-3 text-[#a89f91] text-[11px] font-mono truncate max-w-[150px]">
                          {lead.campaignSlug}
                        </td>

                        <td className="p-3 text-[#a89f91] text-[10px] font-mono whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateCampaignLeadStatus(lead.id, e.target.value as any)
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-black outline-none ${
                              lead.status === 'NEW'
                                ? 'border-amber-400 text-amber-400'
                                : lead.status === 'CONTACTED'
                                ? 'border-blue-400 text-blue-400'
                                : lead.status === 'ENROLLED'
                                ? 'border-emerald-400 text-emerald-400'
                                : 'border-zinc-500 text-zinc-400'
                            }`}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="ENROLLED">ENROLLED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete lead "${lead.fullName}"?`)) {
                                deleteCampaignLead(lead.id);
                              }
                            }}
                            className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* CAMPAIGN BUILDER MODAL EDITOR                             */}
      {/* ========================================================= */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0f0a0c] border-2 border-[#dfb56c] rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1c1013] to-[#120a0d] border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                  Campaign Page &amp; Form Customizer
                </span>
                <h3 className="text-lg font-editorial font-bold text-white">
                  {editingCampaign.title || 'Untitled Campaign'}
                </h3>
              </div>
              <button
                onClick={() => setEditingCampaign(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 bg-black border-b border-white/10 overflow-x-auto text-xs font-mono">
              {[
                { id: 'basics', label: '1. Basics & Slug' },
                { id: 'about', label: '2. About & Highlights' },
                { id: 'videos', label: `3. Videos (${editingCampaign.videos?.length || 0})` },
                { id: 'pdf', label: '4. PDF Brochure' },
                { id: 'reviews', label: `5. Student Reviews (${editingCampaign.studentReviews?.length || 0})` },
                { id: 'pricing', label: '6. Pricing & Urgency' },
                { id: 'form', label: '7. Step 2 Form Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCampaignEditorTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded whitespace-nowrap transition-all cursor-pointer ${
                    campaignEditorTab === tab.id
                      ? 'bg-[#dfb56c] text-black font-bold'
                      : 'text-[#a89f91] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* TAB 1: BASICS */}
              {campaignEditorTab === 'basics' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Campaign Title (English) *
                    </label>
                    <input
                      type="text"
                      value={editingCampaign.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const autoSlug = newTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        setEditingCampaign({
                          ...editingCampaign,
                          title: newTitle,
                          slug: editingCampaign.slug.startsWith('camp-') || editingCampaign.slug.startsWith('fb-masterclass') ? autoSlug : editingCampaign.slug,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Campaign Title (Sinhala)
                    </label>
                    <input
                      type="text"
                      value={editingCampaign.titleSinhala || ''}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, titleSinhala: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Unique URL Slug (/#promo/:slug) *
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.slug}
                        onChange={(e) =>
                          setEditingCampaign({
                            ...editingCampaign,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-[#dfb56c] focus:border-[#dfb56c] outline-none font-mono"
                      />
                      <span className="text-[10px] text-[#a89f91] block mt-1 font-mono">
                        Direct public URL will be: /#promo/{editingCampaign.slug}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Urgency Badge / Promotional Offer Tag
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.badge || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, badge: e.target.value })
                        }
                        placeholder="e.g. 🔥 Facebook Boost Special Offer - 50% Off"
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Associated Course Program
                    </label>
                    <select
                      value={editingCampaign.associatedCourseId || ''}
                      onChange={(e) => {
                        const c = courses.find((crs) => crs.id === e.target.value);
                        setEditingCampaign({
                          ...editingCampaign,
                          associatedCourseId: e.target.value,
                          associatedCourseTitle: c?.title || '',
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    >
                      {courses.map((crs) => (
                        <option key={crs.id} value={crs.id}>
                          {crs.title} ({crs.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-mono text-[#f7e2a9] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingCampaign.isPublished}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#dfb56c]"
                      />
                      <span>Make this campaign Live &amp; Accessible via its promotional link</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT & HIGHLIGHTS */}
              {campaignEditorTab === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      About Course Section Heading
                    </label>
                    <input
                      type="text"
                      value={editingCampaign.aboutHeading || ''}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, aboutHeading: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      About Course Description (English)
                    </label>
                    <textarea
                      rows={4}
                      value={editingCampaign.aboutDescription}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, aboutDescription: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      About Course Description (Sinhala)
                    </label>
                    <textarea
                      rows={4}
                      value={editingCampaign.aboutDescriptionSinhala || ''}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, aboutDescriptionSinhala: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none leading-relaxed font-sinhala"
                    />
                  </div>

                  {/* Highlights Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                        Key Feature Highlights (Bullet Points)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingCampaign.highlights || [];
                          setEditingCampaign({
                            ...editingCampaign,
                            highlights: [...current, 'New practical atelier feature'],
                          });
                        }}
                        className="px-2.5 py-1 bg-[#38070e] border border-[#dfb56c]/40 text-[#dfb56c] text-[10px] font-mono rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    {(editingCampaign.highlights || []).map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#dfb56c] w-6 shrink-0">#{idx + 1}</span>
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const updated = [...(editingCampaign.highlights || [])];
                            updated[idx] = e.target.value;
                            setEditingCampaign({ ...editingCampaign, highlights: updated });
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingCampaign.highlights || []).filter((_, i) => i !== idx);
                            setEditingCampaign({ ...editingCampaign, highlights: updated });
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: VIDEOS */}
              {campaignEditorTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial">
                        Multiple YouTube Masterclass Video Embeds
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala">
                        එක් එක් වීඩියෝව සඳහා Heading එකක් සහ YouTube URL ඇතුළත් කරන්න.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCampaign.videos || [];
                        const newVid: CampaignVideoEmbed = {
                          id: `vid-${Date.now()}-${current.length + 1}`,
                          heading: `0${current.length + 1}. Masterclass Demonstration`,
                          headingSinhala: `0${current.length + 1}. ප්‍රායෝගික පාඩම`,
                          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                          description: 'Demonstration inside the atelier studio.',
                        };
                        setEditingCampaign({
                          ...editingCampaign,
                          videos: [...current, newVid],
                        });
                      }}
                      className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Video Embed
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingCampaign.videos || []).map((vid, idx) => (
                      <div
                        key={vid.id || idx}
                        className="p-4 rounded-lg bg-[#140b0e] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#dfb56c]">
                            Video #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingCampaign.videos || []).filter((_, i) => i !== idx);
                              setEditingCampaign({ ...editingCampaign, videos: updated });
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Custom Heading (English) *
                            </label>
                            <input
                              type="text"
                              value={vid.heading}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.videos || [])];
                                updated[idx] = { ...vid, heading: e.target.value };
                                setEditingCampaign({ ...editingCampaign, videos: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Custom Heading (Sinhala)
                            </label>
                            <input
                              type="text"
                              value={vid.headingSinhala || ''}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.videos || [])];
                                updated[idx] = { ...vid, headingSinhala: e.target.value };
                                setEditingCampaign({ ...editingCampaign, videos: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white font-sinhala"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                            YouTube Video URL *
                          </label>
                          <input
                            type="url"
                            value={vid.youtubeUrl}
                            placeholder="https://www.youtube.com/watch?v=..."
                            onChange={(e) => {
                              const updated = [...(editingCampaign.videos || [])];
                              updated[idx] = { ...vid, youtubeUrl: e.target.value };
                              setEditingCampaign({ ...editingCampaign, videos: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-[#dfb56c] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                            Short Video Description
                          </label>
                          <input
                            type="text"
                            value={vid.description || ''}
                            onChange={(e) => {
                              const updated = [...(editingCampaign.videos || [])];
                              updated[idx] = { ...vid, description: e.target.value };
                              setEditingCampaign({ ...editingCampaign, videos: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PDF BROCHURE */}
              {campaignEditorTab === 'pdf' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white font-editorial mb-1">
                      Downloadable Syllabus &amp; Prospectus PDF
                    </h4>
                    <p className="text-xs text-[#a89f91] font-sinhala">
                      සිසුන්ට බාගත කරගත හැකි පරිදි පාඨමාලා විස්තර අත්පොත හෝ විෂය නිර්දේශ PDF ලින්ක් එක මෙතැනින් යොදන්න.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      PDF Document Title (English)
                    </label>
                    <input
                      type="text"
                      value={editingCampaign.pdfResource?.title || ''}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          pdfResource: {
                            id: editingCampaign.pdfResource?.id || `pdf-${Date.now()}`,
                            title: e.target.value,
                            pdfUrl: editingCampaign.pdfResource?.pdfUrl || '',
                            fileSize: editingCampaign.pdfResource?.fileSize || '4.8 MB',
                            description: editingCampaign.pdfResource?.description || '',
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      PDF Direct Download URL (https://...)
                    </label>
                    <input
                      type="url"
                      value={editingCampaign.pdfResource?.pdfUrl || ''}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          pdfResource: {
                            id: editingCampaign.pdfResource?.id || `pdf-${Date.now()}`,
                            title: editingCampaign.pdfResource?.title || 'Course Syllabus.pdf',
                            pdfUrl: e.target.value,
                            fileSize: editingCampaign.pdfResource?.fileSize || '4.8 MB',
                            description: editingCampaign.pdfResource?.description || '',
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-[#dfb56c] focus:border-[#dfb56c] outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        File Size Badge
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.pdfResource?.fileSize || '4.8 MB'}
                        onChange={(e) =>
                          setEditingCampaign({
                            ...editingCampaign,
                            pdfResource: {
                              id: editingCampaign.pdfResource?.id || `pdf-${Date.now()}`,
                              title: editingCampaign.pdfResource?.title || 'Course Syllabus.pdf',
                              pdfUrl: editingCampaign.pdfResource?.pdfUrl || '',
                              fileSize: e.target.value,
                              description: editingCampaign.pdfResource?.description || '',
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        PDF Description Note
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.pdfResource?.description || ''}
                        onChange={(e) =>
                          setEditingCampaign({
                            ...editingCampaign,
                            pdfResource: {
                              id: editingCampaign.pdfResource?.id || `pdf-${Date.now()}`,
                              title: editingCampaign.pdfResource?.title || 'Course Syllabus.pdf',
                              pdfUrl: editingCampaign.pdfResource?.pdfUrl || '',
                              fileSize: editingCampaign.pdfResource?.fileSize || '4.8 MB',
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: STUDENT REVIEWS */}
              {campaignEditorTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial">
                        Student Reviews with Running YouTube Videos
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala">
                        සිසුන්ගේ සාර්ථකත්වයේ කතා සහ වීඩියෝ මෙතැනින් එකතු කරන්න.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCampaign.studentReviews || [];
                        const newRev: CampaignReviewEmbed = {
                          id: `rev-${Date.now()}-${current.length + 1}`,
                          studentName: 'New Student',
                          studentBatch: 'Batch 2025 • Kurunegala',
                          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                          rating: 5,
                          heading: 'Excellent Practical Pattern Course',
                          feedback: 'Highly recommended for anyone launching their boutique!',
                        };
                        setEditingCampaign({
                          ...editingCampaign,
                          studentReviews: [...current, newRev],
                        });
                      }}
                      className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Student Review
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingCampaign.studentReviews || []).map((rev, idx) => (
                      <div
                        key={rev.id || idx}
                        className="p-4 rounded-lg bg-[#140b0e] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#dfb56c]">
                            Review #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingCampaign.studentReviews || []).filter((_, i) => i !== idx);
                              setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Student Full Name *
                            </label>
                            <input
                              type="text"
                              value={rev.studentName}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.studentReviews || [])];
                                updated[idx] = { ...rev, studentName: e.target.value };
                                setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Student Batch / Branch Location
                            </label>
                            <input
                              type="text"
                              value={rev.studentBatch || ''}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.studentReviews || [])];
                                updated[idx] = { ...rev, studentBatch: e.target.value };
                                setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                            YouTube Review Video URL *
                          </label>
                          <input
                            type="url"
                            value={rev.youtubeUrl}
                            placeholder="https://www.youtube.com/watch?v=..."
                            onChange={(e) => {
                              const updated = [...(editingCampaign.studentReviews || [])];
                              updated[idx] = { ...rev, youtubeUrl: e.target.value };
                              setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-[#dfb56c] font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Headline Quote
                            </label>
                            <input
                              type="text"
                              value={rev.heading || ''}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.studentReviews || [])];
                                updated[idx] = { ...rev, heading: e.target.value };
                                setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                              Star Rating (1 - 5)
                            </label>
                            <select
                              value={rev.rating ?? 5}
                              onChange={(e) => {
                                const updated = [...(editingCampaign.studentReviews || [])];
                                updated[idx] = { ...rev, rating: Number(e.target.value) };
                                setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white font-mono"
                            >
                              <option value={5}>★★★★★ 5 Stars</option>
                              <option value={4}>★★★★☆ 4 Stars</option>
                              <option value={3}>★★★☆☆ 3 Stars</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                            Student Feedback Statement
                          </label>
                          <textarea
                            rows={2}
                            value={rev.feedback || ''}
                            onChange={(e) => {
                              const updated = [...(editingCampaign.studentReviews || [])];
                              updated[idx] = { ...rev, feedback: e.target.value };
                              setEditingCampaign({ ...editingCampaign, studentReviews: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PRICING & URGENCY */}
              {campaignEditorTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Regular Price (LKR)
                      </label>
                      <input
                        type="number"
                        value={editingCampaign.regularPrice ?? 15000}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, regularPrice: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Discounted Ad Offer (LKR) *
                      </label>
                      <input
                        type="number"
                        value={editingCampaign.discountPrice ?? 7500}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, discountPrice: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-[#dfb56c] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Spots Remaining Badge
                      </label>
                      <input
                        type="number"
                        value={editingCampaign.spotsLeft ?? 6}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, spotsLeft: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Countdown Timer End Date &amp; Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          editingCampaign.countdownEndDate
                            ? editingCampaign.countdownEndDate.slice(0, 16)
                            : ''
                        }
                        onChange={(e) =>
                          setEditingCampaign({
                            ...editingCampaign,
                            countdownEndDate: new Date(e.target.value).toISOString(),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Intake Subtitle
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.intakeText || '2026 Academic Intake'}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, intakeText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: STEP 2 FORM SETTINGS */}
              {campaignEditorTab === 'form' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Step 2 Form Heading
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.formHeading || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, formHeading: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        WhatsApp Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editingCampaign.whatsappNumber || '+94703755312'}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Default WhatsApp Pre-Fill Message
                    </label>
                    <textarea
                      rows={2}
                      value={editingCampaign.whatsappPrefillText || ''}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, whatsappPrefillText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setEditingCampaign(null)}
                className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onPreviewCampaign) {
                      onPreviewCampaign(editingCampaign.slug);
                    } else {
                      window.open(`/#promo/${editingCampaign.slug}`, '_blank');
                    }
                  }}
                  className="px-4 py-2 bg-[#1b1013] border border-white/15 text-[#dfb56c] hover:border-[#dfb56c] text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Page</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await saveCampaign(editingCampaign);
                    showToast(`Campaign "${editingCampaign.title}" saved successfully!`);
                    setEditingCampaign(null);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase rounded cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
