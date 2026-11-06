import React, { useState } from 'react';
import {
  CampaignPage,
  CampaignLead,
  CampaignVideoEmbed,
  CampaignReviewEmbed,
  CampaignPdfResource,
  CourseItem,
  CampaignCallOutcome,
  CampaignLeadCallLog,
  CampaignDateLine,
  CampaignFormFieldConfig,
  CampaignCustomField,
  CampaignCustomFieldType,
  CampaignLeadFollowUp,
  CampaignFollowUpStatus,
  CampaignFollowUpPriority,
  CampaignCoursePoint,
  CampaignGalleryImage,
  CampaignPostImage,
  CampaignSectionBanner,
  CampaignBannerPosition,
  WhatsAppMessageTemplate,
  BankAccount,
  CampaignCallOutcomeItem,
} from '../../types';
import { useData } from '../../context/DataContext';
import {
  Flame,
  Plus,
  Edit,
  Edit3,
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
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneForwarded,
  History,
  Send,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  ClipboardList,
  CheckCircle2,
  ListPlus,
  Tag,
  Award,
  Image as ImageIcon,
  Settings,
  CreditCard,
  Building,
  Layers,
  ArrowUp,
  ArrowDown,
  Sliders,
  Megaphone,
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

export const CALL_OUTCOME_CONFIGS: {
  id: CampaignCallOutcome;
  label: string;
  labelSinhala: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}[] = [
  {
    id: 'NEW',
    label: 'New Lead',
    labelSinhala: 'නව අයදුම්පත',
    badgeBg: 'bg-amber-950/70',
    badgeBorder: 'border-amber-500/50',
    badgeText: 'text-amber-300',
  },
  {
    id: 'CALL_ANSWERED',
    label: 'Call Answered',
    labelSinhala: 'ඇමතුමට පිළිතුරු දුන්නේය',
    badgeBg: 'bg-blue-950/70',
    badgeBorder: 'border-blue-500/50',
    badgeText: 'text-blue-300',
  },
  {
    id: 'CALL_NO_ANSWER',
    label: 'Call No Answer',
    labelSinhala: 'ඇමතුමට පිළිතුරු නැත',
    badgeBg: 'bg-red-950/80',
    badgeBorder: 'border-red-500/70',
    badgeText: 'text-red-300',
  },
  {
    id: 'BUSY_DISCONNECTED',
    label: 'Busy / Disconnected',
    labelSinhala: 'කාර්යබහුලයි / විසන්ධි විය',
    badgeBg: 'bg-zinc-900',
    badgeBorder: 'border-zinc-600',
    badgeText: 'text-zinc-300',
  },
  {
    id: 'CALLBACK_REQUESTED',
    label: 'Callback Requested',
    labelSinhala: 'නැවත ඇමතුමක් ඉල්ලා ඇත',
    badgeBg: 'bg-purple-950/70',
    badgeBorder: 'border-purple-500/50',
    badgeText: 'text-purple-300',
  },
  {
    id: 'INTERESTED',
    label: 'Interested',
    labelSinhala: 'කැමැත්ත පළ කළේය',
    badgeBg: 'bg-cyan-950/70',
    badgeBorder: 'border-cyan-500/50',
    badgeText: 'text-cyan-300',
  },
  {
    id: 'PAYMENT_PENDING',
    label: 'Payment Pending',
    labelSinhala: 'මුදල් ගෙවීමට එකඟ විය',
    badgeBg: 'bg-yellow-950/70',
    badgeBorder: 'border-yellow-500/60',
    badgeText: 'text-yellow-300',
  },
  {
    id: 'REGISTERED_PAID',
    label: 'Registered & Paid Complete',
    labelSinhala: 'ලියාපදිංචි වී ගෙවීම සම්පූර්ණයි',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/70',
    badgeText: 'text-emerald-300',
  },
  {
    id: 'NOT_INTERESTED',
    label: 'Not Interested',
    labelSinhala: 'අකමැති විය',
    badgeBg: 'bg-rose-950/70',
    badgeBorder: 'border-rose-500/50',
    badgeText: 'text-rose-400',
  },
];

export const OUTCOME_COLOR_PRESETS = [
  { name: 'Amber / Gold (New / Attention)', bg: 'bg-amber-950/70', border: 'border-amber-500/50', text: 'text-amber-300' },
  { name: 'Blue / Ocean (Call Answered / Active)', bg: 'bg-blue-950/70', border: 'border-blue-500/50', text: 'text-blue-300' },
  { name: 'Red / Ruby (No Answer / Alert)', bg: 'bg-red-950/80', border: 'border-red-500/70', text: 'text-red-300' },
  { name: 'Purple / Violet (Callback / Follow-up)', bg: 'bg-purple-950/70', border: 'border-purple-500/50', text: 'text-purple-300' },
  { name: 'Cyan / Aqua (Interested / Hot Lead)', bg: 'bg-cyan-950/70', border: 'border-cyan-500/50', text: 'text-cyan-300' },
  { name: 'Yellow / Sun (Payment Pending / Promised)', bg: 'bg-yellow-950/70', border: 'border-yellow-500/60', text: 'text-yellow-300' },
  { name: 'Emerald / Green (Registered / Paid Complete)', bg: 'bg-emerald-950/80', border: 'border-emerald-500/70', text: 'text-emerald-300' },
  { name: 'Rose / Pink (Not Interested / Dropped)', bg: 'bg-rose-950/70', border: 'border-rose-500/50', text: 'text-rose-400' },
  { name: 'Zinc / Slate (Busy / Disconnected)', bg: 'bg-zinc-900', border: 'border-zinc-600', text: 'text-zinc-300' },
  { name: 'Indigo / Sapphire (Special Atelier Batch)', bg: 'bg-indigo-950/70', border: 'border-indigo-500/50', text: 'text-indigo-300' },
];

export function FBCampaignAdminManager({ onPreviewCampaign }: FBCampaignAdminManagerProps) {
  const {
    campaigns,
    saveCampaign,
    deleteCampaign,
    campaignLeads,
    updateCampaignLeadStatus,
    updateCampaignLead,
    logCampaignLeadCall,
    addCampaignLeadFollowUp,
    updateCampaignLeadFollowUp,
    deleteCampaignLeadFollowUp,
    deleteCampaignLead,
    whatsappTemplates,
    saveWhatsAppTemplate,
    deleteWhatsAppTemplate,
    resetDefaultWhatsAppTemplates,
    bankAccounts,
    saveBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    resetDefaultBankAccounts,
    callOutcomes,
    saveCallOutcome,
    deleteCallOutcome,
    resetDefaultCallOutcomes,
    courses,
  } = useData();

  // Dynamically populated call outcomes list from backend database with fallback to default presets
  const activeCallOutcomes: CampaignCallOutcomeItem[] =
    callOutcomes && callOutcomes.length > 0 ? callOutcomes : CALL_OUTCOME_CONFIGS;

  // Tab state within Campaign Admin
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'outcomes' | 'templates' | 'banks'>('campaigns');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [selectedCampaignForLeads, setSelectedCampaignForLeads] = useState<string>('ALL');
  const [leadCallStatusFilter, setLeadCallStatusFilter] = useState<'ALL' | CampaignCallOutcome>('ALL');

  // Edit Campaign State
  const [editingCampaign, setEditingCampaign] = useState<CampaignPage | null>(null);
  const [campaignEditorTab, setCampaignEditorTab] = useState<
    'basics' | 'about' | 'posts' | 'banners' | 'videos' | 'gallery' | 'certificate' | 'pdf' | 'reviews' | 'pricing' | 'form'
  >('basics');

  // Course Points Builder State (Tab 2: About)
  const [pointSymbol, setPointSymbol] = useState('✨');
  const [pointText, setPointText] = useState('');
  const [pointTextSinhala, setPointTextSinhala] = useState('');
  const [pointBadge, setPointBadge] = useState('');
  const [editingAboutPointId, setEditingAboutPointId] = useState<string | null>(null);

  // Promotional Post Images Builder State (Tab: Promo Posts)
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTitleSinhala, setPostTitleSinhala] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postCaptionSinhala, setPostCaptionSinhala] = useState('');
  const [postBadge, setPostBadge] = useState('🔥 New Workshop');
  const [isUploadingPostImage, setIsUploadingPostImage] = useState(false);
  const [editingPostImageId, setEditingPostImageId] = useState<string | null>(null);

  // Inter-Section Web Banners Builder State (Tab: Web Banners)
  const [bannerPosition, setBannerPosition] = useState<CampaignBannerPosition>('after_hero');
  const [bannerType, setBannerType] = useState<'graphic' | 'image'>('graphic');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerTitle, setBannerTitle] = useState('Get Rs. 7,500 Off When You Enroll This Week!');
  const [bannerTitleSinhala, setBannerTitleSinhala] = useState('මෙම සතියේ ලියාපදිංචි වන සිසුන්ට රු. 7,500 ක සුවිශේෂී වට්ටමක්!');
  const [bannerSubtitle, setBannerSubtitle] = useState('Includes Free Pattern Drafting Kit & Lifetime Atelier Support');
  const [bannerSubtitleSinhala, setBannerSubtitleSinhala] = useState('නොමිලේ Pattern Drafting Kit එක සහ ජීවිත කාලයටම උපදෙස් සහය');
  const [bannerBadge, setBannerBadge] = useState('💎 EXCLUSIVE BONUS');
  const [bannerButtonText, setBannerButtonText] = useState('Claim Discount Now');
  const [bannerButtonTextSinhala, setBannerButtonTextSinhala] = useState('දැන්ම ලියාපදිංචි වන්න');
  const [bannerButtonLink, setBannerButtonLink] = useState('#register-form');
  const [bannerBgColor, setBannerBgColor] = useState('from-[#3a0910] via-[#1a080d] to-[#0d0507]');
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Gallery Images Builder State (Tab 4: Gallery)
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCaptionSinhala, setGalleryCaptionSinhala] = useState('');
  const [galleryTag, setGalleryTag] = useState('Atelier Studio');
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [editingGalleryImageId, setEditingGalleryImageId] = useState<string | null>(null);

  // Certificate Showcase Upload State
  const [isUploadingCertificateImage, setIsUploadingCertificateImage] = useState(false);

  // Selected Lead Details
  const [selectedLead, setSelectedLead] = useState<CampaignLead | null>(null);

  // CRM Call Logger Modal State
  const [callLoggingLead, setCallLoggingLead] = useState<CampaignLead | null>(null);
  const [callOutcomeInput, setCallOutcomeInput] = useState<CampaignCallOutcome>('CALL_ANSWERED');
  const [callDiscussionInput, setCallDiscussionInput] = useState<string>('');
  const [callbackDateInput, setCallbackDateInput] = useState<string>('');
  const [callerNameInput, setCallerNameInput] = useState<string>('Academic Admissions Desk');

  // Lead Follow-ups CRM Modal State (Add, Edit, View individual follow-ups per lead)
  const [followUpModalLead, setFollowUpModalLead] = useState<CampaignLead | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<CampaignLeadFollowUp | null>(null);
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);
  const [followUpTitle, setFollowUpTitle] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpDueDate, setFollowUpDueDate] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState<CampaignFollowUpStatus>('PENDING');
  const [followUpPriority, setFollowUpPriority] = useState<CampaignFollowUpPriority>('NORMAL');
  const [followUpAssignedTo, setFollowUpAssignedTo] = useState('Academic Admissions Desk');

  // Custom Form Fields Editor State (in Tab 7: Add & Edit custom questions/inputs)
  const [editingCustomField, setEditingCustomField] = useState<CampaignCustomField | null>(null);
  const [isAddingCustomField, setIsAddingCustomField] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldLabelSinhala, setCustomFieldLabelSinhala] = useState('');
  const [customFieldType, setCustomFieldType] = useState<CampaignCustomFieldType>('text');
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState('');
  const [customFieldRequired, setCustomFieldRequired] = useState(false);
  const [customFieldOptions, setCustomFieldOptions] = useState('');

  // Direct WhatsApp Modal State
  const [whatsappModalLead, setWhatsappModalLead] = useState<CampaignLead | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-no-answer');
  const [customWhatsappMessage, setCustomWhatsappMessage] = useState<string>('');

  // WhatsApp Backend Template Manager State
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppMessageTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateNameSinhala, setTemplateNameSinhala] = useState('');
  const [templateBadge, setTemplateBadge] = useState('');
  const [templateCategory, setTemplateCategory] = useState<'lead_crm' | 'general' | 'payment' | 'followup'>('lead_crm');
  const [templateMessage, setTemplateMessage] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Bank Accounts Manager State
  const [editingBankAccount, setEditingBankAccount] = useState<BankAccount | null>(null);
  const [isAddingBankAccount, setIsAddingBankAccount] = useState(false);
  const [bankNameInput, setBankNameInput] = useState('');
  const [accountNumberInput, setAccountNumberInput] = useState('');
  const [accountNameInput, setAccountNameInput] = useState('Ceylon Style Studio (Pvt) Ltd');
  const [branchInput, setBranchInput] = useState('');
  const [swiftCodeInput, setSwiftCodeInput] = useState('');
  const [currencyInput, setCurrencyInput] = useState('LKR');
  const [bankNotesInput, setBankNotesInput] = useState('');
  const [isDefaultBankInput, setIsDefaultBankInput] = useState(false);
  const [isActiveBankInput, setIsActiveBankInput] = useState(true);

  // Selected Bank Account in Direct WhatsApp Modal & In-Modal template quick editor
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');
  const [isEditingTemplateInModal, setIsEditingTemplateInModal] = useState(false);
  const [isAddingTemplateInModal, setIsAddingTemplateInModal] = useState(false);
  const [modalTemplateName, setModalTemplateName] = useState('');
  const [modalTemplateNameSinhala, setModalTemplateNameSinhala] = useState('');
  const [modalTemplateBadge, setModalTemplateBadge] = useState('Custom');
  const [modalTemplateCategory, setModalTemplateCategory] = useState<'lead_crm' | 'general' | 'payment' | 'followup'>('lead_crm');
  const [modalTemplateMessage, setModalTemplateMessage] = useState('');

  // Call Outcomes & Statuses Backend Manager State
  const [editingOutcome, setEditingOutcome] = useState<CampaignCallOutcomeItem | null>(null);
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [outcomeIdInput, setOutcomeIdInput] = useState('');
  const [outcomeLabelInput, setOutcomeLabelInput] = useState('');
  const [outcomeLabelSinhalaInput, setOutcomeLabelSinhalaInput] = useState('');
  const [outcomeDescriptionInput, setOutcomeDescriptionInput] = useState('');
  const [outcomeThemeIndex, setOutcomeThemeIndex] = useState(0);

  // Cover Image Upload State
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);

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

  // Filtered leads with status & call tracking filter
  const filteredLeads = campaignLeads.filter((l) => {
    if (selectedCampaignForLeads !== 'ALL' && l.campaignSlug !== selectedCampaignForLeads && l.campaignId !== selectedCampaignForLeads) {
      return false;
    }

    if (leadCallStatusFilter !== 'ALL') {
      const currentStatus = l.callStatus || l.status;
      if (currentStatus !== leadCallStatusFilter) {
        if (leadCallStatusFilter === 'CALL_ANSWERED' && l.status === 'CONTACTED') return true;
        if (leadCallStatusFilter === 'REGISTERED_PAID' && l.status === 'ENROLLED') return true;
        if (leadCallStatusFilter === 'NOT_INTERESTED' && l.status === 'CANCELLED') return true;
        return false;
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = l.fullName.toLowerCase().includes(q);
      const matchPhone = l.whatsappNumber.includes(q);
      const matchCity = (l.city || '').toLowerCase().includes(q);
      const matchDistrict = (l.district || '').toLowerCase().includes(q);
      const matchNotes = (l.lastCallNotes || l.adminNotes || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCity && !matchDistrict && !matchNotes) return false;
    }
    return true;
  });

  // Export Leads to Excel (Filtered by current selection & call outcome)
  const exportLeadsToExcel = () => {
    try {
      const rows = filteredLeads.map((l, idx) => {
        const baseRow: Record<string, any> = {
          '#': idx + 1,
          'Lead ID': l.id,
          'Campaign Title': l.campaignTitle,
          'Campaign Slug': l.campaignSlug,
          'Full Name': l.fullName,
          'WhatsApp Phone': l.whatsappNumber,
          'Email': l.email || '',
          'District': l.district || '',
          'City': l.city || '',
          'Study Mode': l.studyMode,
          'Preferred Location': l.preferredLocation || '',
          'Sewing Experience': l.experienceLevel || '',
          'Special Notes / Questions': l.notes || '',
          'Call Status / Outcome': l.callStatus || l.status,
          'Latest Discussion Notes (Monawada Kiwwe)': l.lastCallNotes || l.adminNotes || '',
          'Latest Call Date': l.lastCallDate ? new Date(l.lastCallDate).toLocaleString() : '',
          'Total Calls Logged': l.callLogs?.length || 0,
          'Complete Call History': (l.callLogs || [])
            .map((cl) => `[${new Date(cl.timestamp).toLocaleDateString()} - ${cl.outcome}]: ${cl.notes}`)
            .join(' | '),
          'Total Follow-ups': l.followUps?.length || 0,
          'Pending Follow-ups': (l.followUps || []).filter((f) => f.status === 'PENDING').length,
          'Follow-up Tasks & Notes': (l.followUps || [])
            .map((f) => `[${f.status} | Priority: ${f.priority} | Due: ${f.dueDate || 'N/A'}]: ${f.title} (${f.notes})`)
            .join(' || '),
          'Lead Submission Date': new Date(l.createdAt).toLocaleString(),
        };

        // Add any submitted custom field responses
        if (l.customFieldResponses && typeof l.customFieldResponses === 'object') {
          for (const [key, val] of Object.entries(l.customFieldResponses)) {
            baseRow[`Custom: ${key}`] = String(val);
          }
        }

        return baseRow;
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      const sheetName = leadCallStatusFilter === 'ALL' ? 'All Leads' : leadCallStatusFilter.slice(0, 25);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const filterTag = leadCallStatusFilter.toLowerCase().replace(/_/g, '-');
      XLSX.writeFile(wb, `CSS_Leads_${filterTag}_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast(`Exported ${filteredLeads.length} leads (${leadCallStatusFilter}) to Excel!`);
    } catch (e) {
      console.error(e);
      showToast('Failed to export leads. Please try again.');
    }
  };

  // Lead Follow-ups CRM Handlers
  const openFollowUpModal = (lead: CampaignLead) => {
    setFollowUpModalLead(lead);
    setIsAddingFollowUp(false);
    setEditingFollowUp(null);
    setFollowUpTitle('');
    setFollowUpNotes('');
    setFollowUpDueDate('');
    setFollowUpStatus('PENDING');
    setFollowUpPriority('NORMAL');
    setFollowUpAssignedTo('Academic Admissions Desk');
  };

  const handleStartEditFollowUp = (fu: CampaignLeadFollowUp) => {
    setEditingFollowUp(fu);
    setIsAddingFollowUp(false);
    setFollowUpTitle(fu.title);
    setFollowUpNotes(fu.notes);
    setFollowUpDueDate(fu.dueDate || '');
    setFollowUpStatus(fu.status);
    setFollowUpPriority(fu.priority);
    setFollowUpAssignedTo(fu.assignedTo || 'Academic Admissions Desk');
  };

  const handleSaveFollowUp = async () => {
    if (!followUpModalLead) return;
    if (!followUpTitle.trim()) {
      showToast('Please enter follow-up title / subject!');
      return;
    }
    if (!followUpNotes.trim()) {
      showToast('Please enter follow-up notes / details!');
      return;
    }

    if (editingFollowUp) {
      await updateCampaignLeadFollowUp(followUpModalLead.id, editingFollowUp.id, {
        title: followUpTitle.trim(),
        notes: followUpNotes.trim(),
        dueDate: followUpDueDate || undefined,
        status: followUpStatus,
        priority: followUpPriority,
        assignedTo: followUpAssignedTo.trim() || 'Academic Admissions Desk',
      });
      showToast('Follow-up updated successfully!');
      setEditingFollowUp(null);
    } else {
      await addCampaignLeadFollowUp(followUpModalLead.id, {
        title: followUpTitle.trim(),
        notes: followUpNotes.trim(),
        dueDate: followUpDueDate || undefined,
        status: followUpStatus,
        priority: followUpPriority,
        assignedTo: followUpAssignedTo.trim() || 'Academic Admissions Desk',
      });
      showToast('New follow-up task saved!');
      setIsAddingFollowUp(false);
    }

    // Refresh active modal lead
    const fresh = campaignLeads.find((l) => l.id === followUpModalLead.id);
    if (fresh) {
      setFollowUpModalLead(fresh);
    }
    setFollowUpTitle('');
    setFollowUpNotes('');
    setFollowUpDueDate('');
  };

  const handleToggleFollowUpStatus = async (fu: CampaignLeadFollowUp) => {
    if (!followUpModalLead) return;
    const nextStatus: CampaignFollowUpStatus = fu.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateCampaignLeadFollowUp(followUpModalLead.id, fu.id, {
      status: nextStatus,
      completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    });
    showToast(`Follow-up marked as ${nextStatus}!`);
  };

  const handleDeleteFollowUp = async (fuId: string) => {
    if (!followUpModalLead) return;
    if (confirm('Delete this follow-up record?')) {
      await deleteCampaignLeadFollowUp(followUpModalLead.id, fuId);
      showToast('Follow-up deleted.');
      if (editingFollowUp?.id === fuId) {
        setEditingFollowUp(null);
      }
    }
  };

  // Custom Form Fields Handlers (Tab 7)
  const handleOpenAddField = () => {
    setEditingCustomField(null);
    setIsAddingCustomField(true);
    setCustomFieldLabel('');
    setCustomFieldLabelSinhala('');
    setCustomFieldType('text');
    setCustomFieldPlaceholder('');
    setCustomFieldRequired(false);
    setCustomFieldOptions('');
  };

  const handleStartEditField = (field: CampaignCustomField) => {
    setEditingCustomField(field);
    setIsAddingCustomField(false);
    setCustomFieldLabel(field.label);
    setCustomFieldLabelSinhala(field.labelSinhala || '');
    setCustomFieldType(field.fieldType);
    setCustomFieldPlaceholder(field.placeholder || '');
    setCustomFieldRequired(field.required);
    setCustomFieldOptions((field.options || []).join(', '));
  };

  const handleSaveCustomField = () => {
    if (!editingCampaign) return;
    if (!customFieldLabel.trim()) {
      showToast('Please enter field label in English!');
      return;
    }

    const currentFields = editingCampaign.customFields || editingCampaign.formConfig?.customFields || [];
    const optionsArray = customFieldType === 'select'
      ? customFieldOptions.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    if (editingCustomField) {
      const updated = currentFields.map((f) =>
        f.id === editingCustomField.id
          ? {
              ...f,
              label: customFieldLabel.trim(),
              labelSinhala: customFieldLabelSinhala.trim() || undefined,
              fieldType: customFieldType,
              placeholder: customFieldPlaceholder.trim() || undefined,
              required: customFieldRequired,
              options: optionsArray,
            }
          : f
      );
      setEditingCampaign({
        ...editingCampaign,
        customFields: updated,
        formConfig: { ...(editingCampaign.formConfig || {}), customFields: updated },
      });
      showToast(`Field "${customFieldLabel}" updated!`);
      setEditingCustomField(null);
    } else {
      const newField: CampaignCustomField = {
        id: `field_${Date.now()}`,
        label: customFieldLabel.trim(),
        labelSinhala: customFieldLabelSinhala.trim() || undefined,
        fieldType: customFieldType,
        placeholder: customFieldPlaceholder.trim() || undefined,
        required: customFieldRequired,
        options: optionsArray,
        order: currentFields.length + 1,
      };
      const updated = [...currentFields, newField];
      setEditingCampaign({
        ...editingCampaign,
        customFields: updated,
        formConfig: { ...(editingCampaign.formConfig || {}), customFields: updated },
      });
      showToast(`New field "${newField.label}" added!`);
      setIsAddingCustomField(false);
    }
  };

  const handleDeleteCustomField = (fieldId: string) => {
    if (!editingCampaign) return;
    const currentFields = editingCampaign.customFields || editingCampaign.formConfig?.customFields || [];
    const updated = currentFields.filter((f) => f.id !== fieldId);
    setEditingCampaign({
      ...editingCampaign,
      customFields: updated,
      formConfig: { ...(editingCampaign.formConfig || {}), customFields: updated },
    });
    showToast('Custom field removed.');
  };

  // WhatsApp Backend Template Handlers
  const handleStartEditTemplate = (tpl: WhatsAppMessageTemplate) => {
    setEditingTemplate(tpl);
    setIsAddingTemplate(false);
    setTemplateName(tpl.name);
    setTemplateNameSinhala(tpl.nameSinhala || '');
    setTemplateBadge(tpl.badge || '');
    setTemplateCategory(tpl.category || 'lead_crm');
    setTemplateMessage(tpl.message);
    setTemplateDescription(tpl.description || '');
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      showToast('Please enter template name!');
      return;
    }
    if (!templateMessage.trim()) {
      showToast('Please enter message text!');
      return;
    }

    if (editingTemplate) {
      await saveWhatsAppTemplate({
        ...editingTemplate,
        name: templateName.trim(),
        nameSinhala: templateNameSinhala.trim() || undefined,
        badge: templateBadge.trim() || undefined,
        category: templateCategory,
        message: templateMessage.trim(),
        description: templateDescription.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Template "${templateName}" updated & saved to backend!`);
      setEditingTemplate(null);
    } else {
      const newTpl: WhatsAppMessageTemplate = {
        id: `tpl-${Date.now()}`,
        name: templateName.trim(),
        nameSinhala: templateNameSinhala.trim() || undefined,
        badge: templateBadge.trim() || undefined,
        category: templateCategory,
        message: templateMessage.trim(),
        description: templateDescription.trim() || undefined,
        isDefault: false,
        order: whatsappTemplates.length + 1,
        updatedAt: new Date().toISOString(),
      };
      await saveWhatsAppTemplate(newTpl);
      showToast(`New WhatsApp template "${templateName}" saved to backend!`);
      setIsAddingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (tplId: string, tplName: string) => {
    if (confirm(`Are you sure you want to delete template "${tplName}"?`)) {
      await deleteWhatsAppTemplate(tplId);
      showToast(`Template "${tplName}" deleted.`);
    }
  };

  const handleResetTemplates = async () => {
    if (confirm('Reset WhatsApp templates to default system templates? Custom changes will be restored to defaults.')) {
      await resetDefaultWhatsAppTemplates();
      showToast('WhatsApp templates reset to defaults.');
    }
  };

  const handleSaveTemplateFromModal = async () => {
    if (!modalTemplateName.trim()) {
      showToast('Please enter template name!');
      return;
    }
    if (!modalTemplateMessage.trim()) {
      showToast('Please enter message text!');
      return;
    }

    if (isEditingTemplateInModal) {
      const current = whatsappTemplates.find((t) => t.id === selectedTemplateId);
      if (current) {
        const updated: WhatsAppMessageTemplate = {
          ...current,
          name: modalTemplateName.trim(),
          nameSinhala: modalTemplateNameSinhala.trim() || undefined,
          badge: modalTemplateBadge.trim() || undefined,
          category: modalTemplateCategory,
          message: modalTemplateMessage.trim(),
          updatedAt: new Date().toISOString(),
        };
        await saveWhatsAppTemplate(updated);
        showToast(`Template "${modalTemplateName}" updated and saved to database!`);
        if (whatsappModalLead) {
          const targetBank = bankAccounts.find((b) => b.id === selectedBankAccountId);
          setCustomWhatsappMessage(formatTemplateForLead(updated.message, whatsappModalLead, targetBank));
        }
      }
    } else {
      const newTpl: WhatsAppMessageTemplate = {
        id: `tpl-${Date.now()}`,
        name: modalTemplateName.trim(),
        nameSinhala: modalTemplateNameSinhala.trim() || undefined,
        badge: modalTemplateBadge.trim() || 'Custom',
        category: modalTemplateCategory,
        message: modalTemplateMessage.trim(),
        isDefault: false,
        order: whatsappTemplates.length + 1,
        updatedAt: new Date().toISOString(),
      };
      await saveWhatsAppTemplate(newTpl);
      setSelectedTemplateId(newTpl.id);
      showToast(`New template "${modalTemplateName}" saved & selected!`);
      if (whatsappModalLead) {
        const targetBank = bankAccounts.find((b) => b.id === selectedBankAccountId);
        setCustomWhatsappMessage(formatTemplateForLead(newTpl.message, whatsappModalLead, targetBank));
      }
    }

    setIsAddingTemplateInModal(false);
    setIsEditingTemplateInModal(false);
  };

  // Bank Account Handlers
  const handleStartEditBankAccount = (acc: BankAccount) => {
    setEditingBankAccount(acc);
    setIsAddingBankAccount(false);
    setBankNameInput(acc.bankName);
    setAccountNumberInput(acc.accountNumber);
    setAccountNameInput(acc.accountName);
    setBranchInput(acc.branch);
    setSwiftCodeInput(acc.swiftCode || '');
    setCurrencyInput(acc.currency || 'LKR');
    setBankNotesInput(acc.notes || '');
    setIsDefaultBankInput(acc.isDefault || false);
    setIsActiveBankInput(acc.isActive !== undefined ? acc.isActive : true);
  };

  const handleSaveBankAccount = async () => {
    if (!bankNameInput.trim()) {
      showToast('Please enter bank name!');
      return;
    }
    if (!accountNumberInput.trim()) {
      showToast('Please enter account number!');
      return;
    }
    if (!accountNameInput.trim()) {
      showToast('Please enter account holder name!');
      return;
    }
    if (!branchInput.trim()) {
      showToast('Please enter bank branch!');
      return;
    }

    if (editingBankAccount) {
      await saveBankAccount({
        ...editingBankAccount,
        bankName: bankNameInput.trim(),
        accountNumber: accountNumberInput.trim(),
        accountName: accountNameInput.trim(),
        branch: branchInput.trim(),
        swiftCode: swiftCodeInput.trim() || undefined,
        currency: currencyInput.trim() || 'LKR',
        notes: bankNotesInput.trim() || undefined,
        isDefault: isDefaultBankInput,
        isActive: isActiveBankInput,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Bank account "${bankNameInput}" updated & saved!`);
      setEditingBankAccount(null);
    } else {
      const newAcc: BankAccount = {
        id: `bank-${Date.now()}`,
        bankName: bankNameInput.trim(),
        accountNumber: accountNumberInput.trim(),
        accountName: accountNameInput.trim(),
        branch: branchInput.trim(),
        swiftCode: swiftCodeInput.trim() || undefined,
        currency: currencyInput.trim() || 'LKR',
        notes: bankNotesInput.trim() || undefined,
        isDefault: isDefaultBankInput,
        isActive: isActiveBankInput,
        order: bankAccounts.length + 1,
        updatedAt: new Date().toISOString(),
      };
      await saveBankAccount(newAcc);
      showToast(`New bank account "${bankNameInput}" saved to database!`);
      setIsAddingBankAccount(false);
    }
  };

  const handleDeleteBankAccount = async (accId: string, accName: string) => {
    if (confirm(`Are you sure you want to delete bank account "${accName}"?`)) {
      await deleteBankAccount(accId);
      showToast(`Bank account "${accName}" deleted.`);
    }
  };

  const handleResetBankAccounts = async () => {
    if (confirm('Reset bank accounts to system defaults? Custom bank accounts will be restored.')) {
      await resetDefaultBankAccounts();
      showToast('Bank accounts restored to defaults.');
    }
  };

  // Call Outcomes & Statuses Handlers
  const handleStartEditCallOutcome = (outcome: CampaignCallOutcomeItem) => {
    setEditingOutcome(outcome);
    setIsAddingOutcome(false);
    setOutcomeIdInput(outcome.id);
    setOutcomeLabelInput(outcome.label);
    setOutcomeLabelSinhalaInput(outcome.labelSinhala);
    setOutcomeDescriptionInput(outcome.description || '');

    const foundIdx = OUTCOME_COLOR_PRESETS.findIndex(
      (p) => p.bg === outcome.badgeBg && p.border === outcome.badgeBorder
    );
    setOutcomeThemeIndex(foundIdx >= 0 ? foundIdx : 0);
  };

  const handleSaveCallOutcome = async () => {
    if (!outcomeLabelInput.trim()) {
      showToast('Please enter status name / word in English!');
      return;
    }

    const theme = OUTCOME_COLOR_PRESETS[outcomeThemeIndex] || OUTCOME_COLOR_PRESETS[0];

    if (editingOutcome) {
      await saveCallOutcome({
        ...editingOutcome,
        label: outcomeLabelInput.trim(),
        labelSinhala: outcomeLabelSinhalaInput.trim() || outcomeLabelInput.trim(),
        badgeBg: theme.bg,
        badgeBorder: theme.border,
        badgeText: theme.text,
        description: outcomeDescriptionInput.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Call Outcome "${outcomeLabelInput}" updated & saved!`);
      setEditingOutcome(null);
    } else {
      const generatedId =
        outcomeIdInput.trim() ||
        outcomeLabelInput
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

      await saveCallOutcome({
        id: generatedId,
        label: outcomeLabelInput.trim(),
        labelSinhala: outcomeLabelSinhalaInput.trim() || outcomeLabelInput.trim(),
        badgeBg: theme.bg,
        badgeBorder: theme.border,
        badgeText: theme.text,
        description: outcomeDescriptionInput.trim() || undefined,
        isSystem: false,
        order: activeCallOutcomes.length + 1,
        updatedAt: new Date().toISOString(),
      });
      showToast(`New Call Outcome "${outcomeLabelInput}" saved to database!`);
      setIsAddingOutcome(false);
    }

    setOutcomeIdInput('');
    setOutcomeLabelInput('');
    setOutcomeLabelSinhalaInput('');
    setOutcomeDescriptionInput('');
  };

  const handleDeleteCallOutcome = async (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete status outcome "${label}"?`)) {
      await deleteCallOutcome(id);
      showToast(`Status outcome "${label}" deleted.`);
    }
  };

  const handleResetCallOutcomes = async () => {
    if (confirm('Reset call outcomes to default standard statuses? Custom outcomes will be restored to defaults.')) {
      await resetDefaultCallOutcomes();
      showToast('Call outcomes restored to system defaults.');
    }
  };

  // Helper to replace dynamic placeholders in WhatsApp message
  const formatTemplateForLead = (
    templateText: string,
    lead: CampaignLead,
    customBank?: BankAccount
  ): string => {
    const campaign = campaigns.find((c) => c.slug === lead.campaignSlug || c.id === lead.campaignId);
    const campaignTitle = campaign?.title || lead.campaignTitle || 'Fashion Design & Pattern Making';
    const priceText = campaign ? `රු. ${(campaign.discountPrice ?? 7500).toLocaleString()}` : '50% විශේෂ වට්ටම';
    const locationText = lead.preferredLocation || lead.city || lead.district || 'Kurunegala Atelier';
    const studyModeText = lead.studyMode === 'PHYSICAL' ? 'ප්‍රායෝගික වැඩමුළු (Physical Atelier)' : 'සජීවී ඔන්ලයින් (Live Zoom)';

    // Find active bank (customBank passed, or by selectedBankAccountId, or default, or first active)
    const targetBank =
      customBank ||
      (selectedBankAccountId ? bankAccounts.find((b) => b.id === selectedBankAccountId) : undefined) ||
      bankAccounts.find((b) => b.isDefault && b.isActive) ||
      bankAccounts.find((b) => b.isActive) ||
      bankAccounts[0];

    const bankName = targetBank?.bankName || 'Commercial Bank of Ceylon';
    const accountNo = targetBank?.accountNumber || '1000548923';
    const accountName = targetBank?.accountName || 'Ceylon Style Studio (Pvt) Ltd';
    const branch = targetBank?.branch || 'Kurunegala';

    const bankDetailsFormatted = targetBank
      ? `• Bank: ${targetBank.bankName}\n• Account Name: ${targetBank.accountName}\n• Account Number: ${targetBank.accountNumber}\n• Branch: ${targetBank.branch}${
          targetBank.swiftCode ? `\n• SWIFT / Branch Code: ${targetBank.swiftCode}` : ''
        }${targetBank.notes ? `\n• උපදෙස්: ${targetBank.notes}` : ''}`
      : `• Bank: Commercial Bank\n• Account Name: Ceylon Style Studio (Pvt) Ltd\n• Account Number: 1000548923\n• Branch: Kurunegala`;

    return templateText
      .replace(/{student_name}|{name}/gi, lead.fullName)
      .replace(/{campaign_title}|{course}/gi, campaignTitle)
      .replace(/{ref_id}|{id}/gi, lead.id)
      .replace(/{fee}|{price}/gi, priceText)
      .replace(/{location}|{studio_branch}/gi, locationText)
      .replace(/{mode}|{study_mode}/gi, studyModeText)
      .replace(/{phone}|{number}/gi, lead.whatsappNumber)
      .replace(/{bank_details}/gi, bankDetailsFormatted)
      .replace(/{bank_name}/gi, bankName)
      .replace(/{account_no}|{account_number}/gi, accountNo)
      .replace(/{account_name}/gi, accountName)
      .replace(/{branch}/gi, branch);
  };

  // WhatsApp Message Generator using saved backend templates
  const getWhatsAppMessageText = (
    lead: CampaignLead,
    templateIdOrKey?: string,
    customBank?: BankAccount
  ): string => {
    if (!templateIdOrKey) {
      templateIdOrKey =
        lead.callStatus === 'CALL_NO_ANSWER'
          ? 'tpl-no-answer'
          : lead.callStatus === 'PAYMENT_PENDING'
          ? 'tpl-payment'
          : 'tpl-welcome';
    }

    // Try finding by exact id
    let found = whatsappTemplates.find((t) => t.id === templateIdOrKey);
    // Or by partial id / key
    if (!found) {
      if (templateIdOrKey === 'no_answer') {
        found = whatsappTemplates.find((t) => t.id === 'tpl-no-answer') || whatsappTemplates.find((t) => t.category === 'lead_crm');
      } else if (templateIdOrKey === 'payment') {
        found = whatsappTemplates.find((t) => t.id === 'tpl-payment') || whatsappTemplates.find((t) => t.category === 'payment');
      } else if (templateIdOrKey === 'welcome') {
        found = whatsappTemplates.find((t) => t.id === 'tpl-welcome') || whatsappTemplates[0];
      }
    }

    if (found) {
      return formatTemplateForLead(found.message, lead, customBank);
    }

    if (whatsappTemplates.length > 0) {
      return formatTemplateForLead(whatsappTemplates[0].message, lead, customBank);
    }
    return customWhatsappMessage || '';
  };

  // Helper to format clean Sri Lanka WhatsApp Phone number (e.g. 077... -> 9477...)
  const getCleanWhatsAppPhone = (rawPhone: string): string => {
    let cleaned = (rawPhone || '').replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '94' + cleaned.slice(1);
    } else if (cleaned.length === 9 && !cleaned.startsWith('94')) {
      cleaned = '94' + cleaned;
    }
    return cleaned;
  };

  // Helper to generate 1-click Direct WhatsApp chat URL targeted to student's phone with pre-filled message
  const getDirectWhatsAppUrl = (
    lead: CampaignLead,
    templateIdOrKey?: string,
    overrideText?: string,
    customBank?: BankAccount
  ): string => {
    const cleanPhone = getCleanWhatsAppPhone(lead.whatsappNumber);
    const text = overrideText || getWhatsAppMessageText(lead, templateIdOrKey, customBank);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // 1-Click Direct Chat Opener (wa.me/<number>?text=...)
  const launchDirectWhatsApp = (
    lead: CampaignLead,
    templateIdOrKey?: string,
    overrideText?: string,
    customBank?: BankAccount
  ) => {
    const url = getDirectWhatsAppUrl(lead, templateIdOrKey, overrideText, customBank);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`WhatsApp chat opened for ${lead.fullName} (${lead.whatsappNumber})!`);
  };

  // Helper to handle local Cover Page Hero Image file upload & canvas compression
  const handleCoverImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)!');
      return;
    }

    setIsUploadingCoverImage(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingCoverImage(false);
      showToast('Failed to read image file.');
    };
    reader.onload = (ev) => {
      const rawData = ev.target?.result as string;
      if (!rawData) {
        setIsUploadingCoverImage(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setIsUploadingCoverImage(false);
        showToast('Invalid image file format.');
      };
      img.onload = () => {
        try {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (editingCampaign) {
              setEditingCampaign({
                ...editingCampaign,
                coverImageUrl: compressedDataUrl,
              });
              showToast('Cover Hero Image uploaded & set! Click "Save Campaign" below to save.');
            }
          } else if (editingCampaign) {
            setEditingCampaign({
              ...editingCampaign,
              coverImageUrl: rawData,
            });
            showToast('Cover Hero Image set! Click "Save Campaign" below to save.');
          }
        } catch (err) {
          console.error(err);
          if (editingCampaign) {
            setEditingCampaign({
              ...editingCampaign,
              coverImageUrl: rawData,
            });
            showToast('Cover Hero Image loaded! Click "Save Campaign" below to save.');
          }
        } finally {
          setIsUploadingCoverImage(false);
          // reset input value so user can re-upload if needed
          e.target.value = '';
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle local Promo Post Image upload & canvas compression
  const handlePostImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)!');
      return;
    }

    setIsUploadingPostImage(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingPostImage(false);
      showToast('Failed to read image file.');
    };
    reader.onload = (ev) => {
      const rawData = ev.target?.result as string;
      if (!rawData) {
        setIsUploadingPostImage(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setIsUploadingPostImage(false);
        showToast('Invalid image format.');
      };
      img.onload = () => {
        try {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
            setPostImageUrl(compressedDataUrl);
            showToast('Post Image file loaded! Add details and click "Add Promotional Post".');
          } else {
            setPostImageUrl(rawData);
          }
        } catch (err) {
          console.error(err);
          setPostImageUrl(rawData);
        } finally {
          setIsUploadingPostImage(false);
          e.target.value = '';
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle local Inter-Section Banner image upload & canvas compression
  const handleBannerImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)!');
      return;
    }

    setIsUploadingBannerImage(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingBannerImage(false);
      showToast('Failed to read banner image file.');
    };
    reader.onload = (ev) => {
      const rawData = ev.target?.result as string;
      if (!rawData) {
        setIsUploadingBannerImage(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setIsUploadingBannerImage(false);
        showToast('Invalid banner image format.');
      };
      img.onload = () => {
        try {
          const maxDim = 1800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
            setBannerImageUrl(compressedDataUrl);
            showToast('Banner image loaded! Select position and click "Add Section Banner".');
          } else {
            setBannerImageUrl(rawData);
          }
        } catch (err) {
          console.error(err);
          setBannerImageUrl(rawData);
        } finally {
          setIsUploadingBannerImage(false);
          e.target.value = '';
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle local Atelier & Workshop Gallery image upload & canvas compression
  const handleGalleryImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)!');
      return;
    }

    setIsUploadingGalleryImage(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingGalleryImage(false);
      showToast('Failed to read gallery image file.');
    };
    reader.onload = (ev) => {
      const rawData = ev.target?.result as string;
      if (!rawData) {
        setIsUploadingGalleryImage(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setIsUploadingGalleryImage(false);
        showToast('Invalid gallery image format.');
      };
      img.onload = () => {
        try {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setGalleryImageUrl(compressedDataUrl);
            showToast('Gallery image loaded! Add captions and click "Add to Gallery".');
          } else {
            setGalleryImageUrl(rawData);
          }
        } catch (err) {
          console.error(err);
          setGalleryImageUrl(rawData);
        } finally {
          setIsUploadingGalleryImage(false);
          e.target.value = '';
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle local Course Certificate Showcase image upload & canvas compression
  const handleCertificateImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid certificate image file (PNG, JPG, WEBP)!');
      return;
    }

    setIsUploadingCertificateImage(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingCertificateImage(false);
      showToast('Failed to read certificate image file.');
    };
    reader.onload = (ev) => {
      const rawData = ev.target?.result as string;
      if (!rawData) {
        setIsUploadingCertificateImage(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setIsUploadingCertificateImage(false);
        showToast('Invalid certificate image format.');
      };
      img.onload = () => {
        try {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
            if (editingCampaign) {
              setEditingCampaign({
                ...editingCampaign,
                certificateImageUrl: compressedDataUrl,
              });
              showToast('Certificate image uploaded! Click "Save Campaign" below to save.');
            }
          } else if (editingCampaign) {
            setEditingCampaign({
              ...editingCampaign,
              certificateImageUrl: rawData,
            });
            showToast('Certificate image set! Click "Save Campaign" below to save.');
          }
        } catch (err) {
          console.error(err);
          if (editingCampaign) {
            setEditingCampaign({
              ...editingCampaign,
              certificateImageUrl: rawData,
            });
            showToast('Certificate image loaded! Click "Save Campaign" below to save.');
          }
        } finally {
          setIsUploadingCertificateImage(false);
          e.target.value = '';
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
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
      registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchStartDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dateLines: [
        {
          id: `dl-1-${Date.now()}`,
          label: '50% Discount Lock Deadline',
          labelSinhala: '50% විශේෂ වට්ටම අවසන් වන දිනය',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          highlight: true,
          description: 'Early Bird Special Offer Closes',
        },
        {
          id: `dl-2-${Date.now()}`,
          label: 'Official Batch Commencement',
          labelSinhala: 'නව කණ්ඩායමේ පන්ති ආරම්භක දිනය',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          highlight: false,
          description: 'Physical Atelier & Zoom Interactive',
        },
      ],
      formConfig: {
        showEmail: true,
        requireEmail: false,
        showDistrict: true,
        requireDistrict: false,
        showCity: true,
        requireCity: false,
        showStudyMode: true,
        requireStudyMode: true,
        showLocation: true,
        requireLocation: true,
        showExperience: true,
        requireExperience: false,
        showNotes: true,
      },
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

          <button
            onClick={() => setActiveTab('outcomes')}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'outcomes'
                ? 'bg-purple-500 text-black font-bold shadow'
                : 'bg-[#0c090a] border border-white/10 text-[#a89f91] hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Call Outcomes &amp; Statuses ({activeCallOutcomes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#25D366] text-black font-bold shadow'
                : 'bg-[#0c090a] border border-white/10 text-[#a89f91] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Templates ({whatsappTemplates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banks')}
            className={`px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'banks'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'bg-[#0c090a] border border-white/10 text-[#a89f91] hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Accounts ({bankAccounts.length})</span>
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

          {activeTab === 'outcomes' && (
            <button
              onClick={() => {
                setEditingOutcome(null);
                setIsAddingOutcome(true);
                setOutcomeIdInput('');
                setOutcomeLabelInput('');
                setOutcomeLabelSinhalaInput('');
                setOutcomeDescriptionInput('');
                setOutcomeThemeIndex(0);
              }}
              className="px-4 py-2 bg-purple-500 text-black text-xs font-bold uppercase rounded hover:bg-purple-400 flex items-center gap-1.5 cursor-pointer shadow-lg font-mono"
            >
              <Plus className="w-4 h-4 fill-black" />
              <span>Add Status Word</span>
            </button>
          )}

          {activeTab === 'templates' && (
            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsAddingTemplate(true);
                setTemplateName('');
                setTemplateNameSinhala('');
                setTemplateBadge('Custom');
                setTemplateCategory('lead_crm');
                setTemplateMessage('හෙලෝ {student_name}, Ceylon Style Studio වෙතින්.\n\nඔබ "{campaign_title}" පාඨමාලාව සඳහා සම්බන්ධ වීමට කැමැත්ත පළකර තිබුණි (Ref: {ref_id}). වැඩිදුර විස්තර සඳහා අප හා සම්බන්ධ වන්න.');
                setTemplateDescription('');
              }}
              className="px-4 py-2 bg-[#25D366] text-black text-xs font-bold uppercase rounded hover:bg-[#20ba59] flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4 fill-black" />
              <span>Add New Template</span>
            </button>
          )}

          {activeTab === 'banks' && (
            <button
              onClick={() => {
                setEditingBankAccount(null);
                setIsAddingBankAccount(true);
                setBankNameInput('');
                setAccountNumberInput('');
                setAccountNameInput('Ceylon Style Studio (Pvt) Ltd');
                setBranchInput('');
                setSwiftCodeInput('');
                setCurrencyInput('LKR');
                setBankNotesInput('Please transfer registration fee / deposit and WhatsApp the bank slip or screenshot.');
                setIsDefaultBankInput(bankAccounts.length === 0);
                setIsActiveBankInput(true);
              }}
              className="px-4 py-2 bg-amber-400 text-black text-xs font-bold uppercase rounded hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4 fill-black" />
              <span>Add Bank Account</span>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/5 text-center font-mono text-xs">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Traffic / Views</span>
                        </span>
                        <strong className="text-emerald-400 text-sm font-bold">
                          {(camp.viewsCount || 0).toLocaleString()}
                        </strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-[#dfb56c]" />
                          <span>Leads</span>
                        </span>
                        <strong className="text-[#dfb56c] text-sm font-bold">{leadCount}</strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase">Conv. Rate</span>
                        <strong className="text-white text-sm font-bold">
                          {(((leadCount) / Math.max(1, camp.viewsCount || 0)) * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-[10px] text-[#a89f91] block uppercase">Fee Offer</span>
                        <strong className="text-[#dfb56c] text-xs font-bold">
                          {camp.currency || 'LKR'} {(camp.discountPrice ?? 7500).toLocaleString()}
                        </strong>
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
      {/* TAB 2: STUDENT LEADS LIST & CRM CALL TRACKER              */}
      {/* ========================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Top Controls: Campaign Selector & Search & Excel Export */}
          <div className="p-4 rounded-lg bg-[#0c090a] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#a89f91] uppercase">Campaign:</span>
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

              {/* Status Indicator */}
              <div className="text-xs font-mono text-[#dfb56c] bg-[#211116] border border-[#dfb56c]/30 px-3 py-1 rounded">
                Showing: <strong>{filteredLeads.length}</strong> of {campaignLeads.length} Leads
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, phone, notes..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#141011] border border-white/10 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                />
              </div>

              {/* Filtered Data Export to Excel */}
              <button
                type="button"
                onClick={exportLeadsToExcel}
                className="px-3.5 py-1.5 bg-[#1a472a] hover:bg-[#205733] border border-emerald-500/60 text-emerald-200 text-xs font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer shadow transition-all shrink-0"
                title="Download Filtered Leads to Excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Filtered ({filteredLeads.length})</span>
              </button>
            </div>
          </div>

          {/* Call Status Filter Pills / Tabs */}
          <div className="p-3 rounded-lg bg-[#0f0a0c] border border-white/10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#a89f91] font-bold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>Filter Leads by Call Outcome / Status:</span>
              </span>
              <div className="flex items-center gap-2">
                {leadCallStatusFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setLeadCallStatusFilter('ALL')}
                    className="text-[11px] font-mono text-[#dfb56c] hover:underline cursor-pointer"
                  >
                    Show All Leads ({campaignLeads.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('outcomes')}
                  className="px-2.5 py-1 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all shadow"
                  title="Add, edit, or customize Call Outcome status words"
                >
                  <Edit3 className="w-3 h-3 text-purple-400" />
                  <span>Customize Status Words</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLeadCallStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  leadCallStatusFilter === 'ALL'
                    ? 'bg-[#dfb56c] text-black font-bold shadow'
                    : 'bg-[#181114] border border-white/10 text-[#c7beaf] hover:text-white'
                }`}
              >
                <span>All Leads</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
                  {campaignLeads.length}
                </span>
              </button>

              {activeCallOutcomes.map((out) => {
                const count = campaignLeads.filter((l) => {
                  const s = l.callStatus || l.status;
                  if (s === out.id) return true;
                  if (out.id === 'CALL_ANSWERED' && l.status === 'CONTACTED') return true;
                  if (out.id === 'REGISTERED_PAID' && l.status === 'ENROLLED') return true;
                  if (out.id === 'NOT_INTERESTED' && l.status === 'CANCELLED') return true;
                  return false;
                }).length;

                const isSelected = leadCallStatusFilter === out.id;

                return (
                  <button
                    key={out.id}
                    type="button"
                    onClick={() => setLeadCallStatusFilter(out.id)}
                    className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? `${out.badgeBg} ${out.badgeBorder} ${out.badgeText} font-bold ring-2 ring-[#dfb56c]`
                        : `${out.badgeBg} ${out.badgeBorder} ${out.badgeText} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <span>{out.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/50 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leads Table */}
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center rounded bg-[#0c090a] border border-dashed border-white/10 space-y-3">
              <Users className="w-10 h-10 text-[#a89f91] mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-white">No Leads Found For Selected Filter</h4>
              <p className="text-xs text-[#a89f91] max-w-sm mx-auto font-sinhala">
                තෝරාගත් Status හෝ Campaign එකට අදාළ ශිෂ්‍ය තොරතුරු මෙහි නොමැත. "All Leads" තෝරා සම්පූර්ණ ලැයිස්තුව බලන්න.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLeadCallStatusFilter('ALL');
                  setSelectedCampaignForLeads('ALL');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0c090a] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140b0e] text-[#dfb56c] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Direct Contact &amp; WhatsApp</th>
                      <th className="p-3">Location / Study Mode</th>
                      <th className="p-3">Campaign Source</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Call Outcome &amp; Status</th>
                      <th className="p-3">Discussion Notes (Monawada Kiwwe)</th>
                      <th className="p-3">Follow-ups &amp; Reminders</th>
                      <th className="p-3 text-right">CRM Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredLeads.map((lead) => {
                      const effStatus = lead.callStatus || lead.status;
                      const statusConfig =
                        activeCallOutcomes.find((c) => c.id === effStatus) ||
                        CALL_OUTCOME_CONFIGS.find((c) => c.id === effStatus) ||
                        activeCallOutcomes[0] || {
                          id: effStatus,
                          label: effStatus,
                          labelSinhala: '',
                          badgeBg: 'bg-zinc-900',
                          badgeBorder: 'border-zinc-700',
                          badgeText: 'text-zinc-300',
                        };

                      return (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          {/* Student Info */}
                          <td className="p-3 font-bold text-white">
                            <div className="flex flex-col">
                              <span className="text-sm">{lead.fullName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-[#a89f91] font-mono">{lead.id}</span>
                                {lead.experienceLevel && (
                                  <span className="text-[10px] text-[#dfb56c] font-normal truncate max-w-[140px]">
                                    • {lead.experienceLevel}
                                  </span>
                                )}
                              </div>
                              {lead.email && (
                                <span className="text-[10px] text-[#8e8579] font-mono">{lead.email}</span>
                              )}

                              {/* Custom Form Field Responses Preview (if student filled custom fields) */}
                              {lead.customFieldResponses && Object.keys(lead.customFieldResponses).length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {Object.entries(lead.customFieldResponses).map(([fieldKey, val]) => (
                                    <span
                                      key={fieldKey}
                                      className="px-1.5 py-0.5 rounded bg-black/70 border border-white/15 text-[9px] font-mono text-[#f7e2a9] max-w-[170px] truncate"
                                      title={`${fieldKey}: ${val}`}
                                    >
                                      <strong>{fieldKey}:</strong> {String(val)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Direct Contact & WhatsApp */}
                          <td className="p-3 font-mono">
                            <div className="flex flex-col gap-1.5">
                              {/* Direct Clickable WhatsApp Phone Link: Opens student WhatsApp chat directly */}
                              <a
                                href={getDirectWhatsAppUrl(lead)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => showToast(`Opening WhatsApp chat for ${lead.fullName} (${lead.whatsappNumber})...`)}
                                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold group cursor-pointer"
                                title="Click number to open student's WhatsApp chat with prefilled message"
                              >
                                <div className="w-5 h-5 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-black transition-all">
                                  <MessageSquare className="w-2.5 h-2.5 text-[#25D366] group-hover:text-black fill-current" />
                                </div>
                                <span className="underline decoration-emerald-500/60 group-hover:decoration-emerald-300 text-xs">
                                  {lead.whatsappNumber}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60 text-emerald-400 group-hover:opacity-100" />
                              </a>

                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                {/* 1-Click WhatsApp Direct Chat */}
                                <a
                                  href={getDirectWhatsAppUrl(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => showToast(`Direct WhatsApp chat opened for ${lead.fullName}!`)}
                                  className="px-2 py-0.5 rounded bg-[#25D366] text-black hover:bg-[#20ba59] transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer shadow hover:scale-105"
                                  title="Open WhatsApp chat directly with prefilled admission message"
                                >
                                  <MessageSquare className="w-3 h-3 fill-black" />
                                  <span>Chat</span>
                                </a>

                                {/* 1-Click Template: No Answer */}
                                <a
                                  href={getDirectWhatsAppUrl(lead, 'tpl-no-answer')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => showToast(`Opening "No Answer" WhatsApp chat for ${lead.fullName}...`)}
                                  className="px-1.5 py-0.5 rounded bg-red-950/70 border border-red-500/50 text-red-300 hover:bg-red-900 transition-all flex items-center gap-0.5 text-[9px] font-mono cursor-pointer"
                                  title="1-Click WhatsApp: Send Call No Answer template directly to student"
                                >
                                  <span>📵 No Answer</span>
                                </a>

                                {/* 1-Click Template: Payment */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWhatsappModalLead(lead);
                                    setSelectedTemplateId('tpl-payment');
                                    const defBank =
                                      bankAccounts.find((b) => b.isDefault && b.isActive) ||
                                      bankAccounts.find((b) => b.isActive) ||
                                      bankAccounts[0];
                                    if (defBank) {
                                      setSelectedBankAccountId(defBank.id);
                                    }
                                    setCustomWhatsappMessage(getWhatsAppMessageText(lead, 'tpl-payment', defBank));
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 hover:bg-amber-900 transition-all flex items-center gap-0.5 text-[9px] font-mono cursor-pointer"
                                  title="Open Bank Payment template with academy account details"
                                >
                                  <span>💳 Bank</span>
                                </button>

                                {/* Template Picker & Message Customizer Modal */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWhatsappModalLead(lead);
                                    const initialTpl =
                                      lead.callStatus === 'CALL_NO_ANSWER'
                                        ? 'tpl-no-answer'
                                        : lead.callStatus === 'PAYMENT_PENDING'
                                        ? 'tpl-payment'
                                        : 'tpl-welcome';
                                    setSelectedTemplateId(initialTpl);
                                    const defBank =
                                      bankAccounts.find((b) => b.isDefault && b.isActive) ||
                                      bankAccounts.find((b) => b.isActive) ||
                                      bankAccounts[0];
                                    if (defBank) {
                                      setSelectedBankAccountId(defBank.id);
                                    }
                                    setCustomWhatsappMessage(getWhatsAppMessageText(lead, initialTpl, defBank));
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-[#140b0e] border border-white/20 text-[#d5cfc4] hover:text-white hover:border-[#dfb56c] transition-all flex items-center gap-1 text-[9px] font-mono cursor-pointer"
                                  title="Choose any saved template, customize text & send"
                                >
                                  <span>Templates...</span>
                                </button>

                                {/* Direct Call Button */}
                                <a
                                  href={`tel:${lead.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                                  className="p-1 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                                  title="Direct Phone Call"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Location & Study Mode */}
                          <td className="p-3 text-[#d5cfc4]">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-xs">
                                {lead.preferredLocation || lead.city || lead.district || 'Kurunegala Atelier'}
                              </span>
                              <span
                                className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold w-fit ${
                                  lead.studyMode === 'PHYSICAL'
                                    ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                                    : 'bg-blue-950/80 border border-blue-500/40 text-blue-300'
                                }`}
                              >
                                {lead.studyMode === 'PHYSICAL' ? 'Physical Atelier' : 'Live Zoom'}
                              </span>
                            </div>
                          </td>

                          {/* Campaign */}
                          <td className="p-3 text-[#a89f91] text-[11px] font-mono">
                            <span className="truncate block max-w-[130px]" title={lead.campaignTitle}>
                              {lead.campaignSlug}
                            </span>
                          </td>

                          {/* Submission Date */}
                          <td className="p-3 text-[#a89f91] text-[10px] font-mono whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>

                          {/* Call Outcome Status Dropdown */}
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              <select
                                value={effStatus}
                                onChange={(e) => {
                                  const newStatus = e.target.value as CampaignCallOutcome;
                                  updateCampaignLeadStatus(lead.id, newStatus);
                                  const targetObj = activeCallOutcomes.find((c) => c.id === newStatus);
                                  showToast(`Status updated to "${targetObj?.label || newStatus}"!`);
                                }}
                                className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase border bg-black outline-none cursor-pointer ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
                              >
                                {activeCallOutcomes.map((out) => (
                                  <option key={out.id} value={out.id} className="bg-[#120a0d] text-white">
                                    {out.label} {out.labelSinhala ? `(${out.labelSinhala})` : ''}
                                  </option>
                                ))}
                              </select>
                              <span className="text-[9px] text-[#a89f91] font-sinhala">
                                {statusConfig.labelSinhala}
                              </span>
                            </div>
                          </td>

                          {/* Discussion Notes / Monawada Kiwwe */}
                          <td className="p-3 max-w-[200px]">
                            <div className="flex flex-col gap-1">
                              {lead.lastCallNotes || lead.adminNotes ? (
                                <p className="text-xs text-[#d5cfc4] line-clamp-2 leading-relaxed bg-[#140b0e] p-1.5 rounded border border-white/5">
                                  {lead.lastCallNotes || lead.adminNotes}
                                </p>
                              ) : (
                                <span className="text-[10px] text-zinc-500 italic">No call notes logged</span>
                              )}

                              <div className="flex items-center gap-2 text-[9px] font-mono text-[#a89f91]">
                                {lead.callLogs && lead.callLogs.length > 0 && (
                                  <span className="text-emerald-400 font-bold">
                                    {lead.callLogs.length} call{lead.callLogs.length > 1 ? 's' : ''} logged
                                  </span>
                                )}
                                {lead.lastCallDate && (
                                  <span>{new Date(lead.lastCallDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Individual Follow-ups & Reminders */}
                          <td className="p-3 min-w-[170px]">
                            <div className="flex flex-col gap-1.5">
                              <button
                                type="button"
                                onClick={() => openFollowUpModal(lead)}
                                className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold flex items-center justify-between gap-1.5 cursor-pointer transition-all shadow ${
                                  (lead.followUps || []).some((f) => f.status === 'PENDING')
                                    ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 hover:bg-amber-900/80 ring-1 ring-amber-500/40'
                                    : (lead.followUps || []).length > 0
                                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/70'
                                    : 'bg-[#180f13] border-white/10 text-[#c7beaf] hover:text-white hover:border-[#dfb56c]/40'
                                }`}
                                title="Manage Individual Follow-ups & Reminders for this student"
                              >
                                <div className="flex items-center gap-1.5">
                                  <ClipboardList className="w-3.5 h-3.5 text-[#dfb56c]" />
                                  <span>Follow-ups ({lead.followUps?.length || 0})</span>
                                </div>
                                {(lead.followUps || []).some((f) => f.status === 'PENDING') && (
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Pending follow-up due" />
                                )}
                              </button>

                              {lead.followUps && lead.followUps.length > 0 ? (
                                <div className="text-[10px] text-[#a89f91] font-sans truncate max-w-[180px]" title={lead.followUps[0].title}>
                                  <span className="text-[#dfb56c] font-medium">Next:</span> {lead.followUps[0].title}
                                </div>
                              ) : (
                                <span className="text-[9px] text-zinc-500 italic font-mono">No follow-ups added</span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Follow-up Manager */}
                              <button
                                type="button"
                                onClick={() => openFollowUpModal(lead)}
                                className="px-2 py-1 rounded bg-[#27131b] hover:bg-[#3d1a28] border border-[#dfb56c]/40 text-[#f7e2a9] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
                                title="Add or Edit Individual Follow-up for this Student"
                              >
                                <ClipboardList className="w-3 h-3 text-[#dfb56c]" />
                                <span className="hidden sm:inline">Follow-up</span>
                              </button>

                              {/* Open Call Logger & Notes Dialog */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCallLoggingLead(lead);
                                  setCallOutcomeInput((lead.callStatus || lead.status) as CampaignCallOutcome);
                                  setCallDiscussionInput(lead.lastCallNotes || '');
                                  setCallbackDateInput('');
                                }}
                                className="px-2.5 py-1 rounded bg-[#540d18] hover:bg-[#6e1220] border border-[#dfb56c]/50 text-[#f7e2a9] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
                                title="Log Call Outcome & Discussion Notes"
                              >
                                <PhoneCall className="w-3 h-3 text-[#dfb56c]" />
                                <span>Log Call</span>
                              </button>

                              {/* Delete Lead */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete lead "${lead.fullName}"?`)) {
                                    deleteCampaignLead(lead.id);
                                    showToast(`Lead "${lead.fullName}" deleted.`);
                                  }
                                }}
                                className="p-1 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300 cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

          {/* ========================================================= */}
          {/* TAB 3: WHATSAPP MESSAGE TEMPLATES MANAGER (BACKEND)       */}
          {/* ========================================================= */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d1f14] via-[#09150d] to-[#0c090a] border border-[#25D366]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/60 text-[#25D366] text-[10px] font-mono font-bold tracking-widest uppercase">
                      Backend CRM Messaging Engine
                    </span>
                    <span className="text-[10px] font-mono text-[#a89f91]">
                      {whatsappTemplates.length} Active Templates Saved
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#25D366]" />
                    <span>WhatsApp Message Templates Customizer</span>
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-1 font-sinhala leading-relaxed max-w-3xl">
                    ශිෂ්‍යයින්ට ක්ෂණිකව Direct WhatsApp පණිවිඩ යැවීමට අවශ්‍ය Templates මෙතැනින් නිර්මාණය, සංස්කරණය සහ Firebase Backend හි ස්ථිරව සුරැකිය හැක. View Leads CRM හි එක් එක් ශිෂ්‍යයාගේ අංකය මත ක්ලික් කළ විට (<span className="font-mono text-[#25D366]">wa.me/&lt;number&gt;?text=...</span>) මෙම පණිවිඩ කෙලින්ම සූදානම්ව විවෘත වේ.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetTemplates}
                    className="px-3.5 py-2 rounded bg-black/60 border border-white/20 hover:border-white/40 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Restore default system templates"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplate(null);
                      setIsAddingTemplate(true);
                      setTemplateName('');
                      setTemplateNameSinhala('');
                      setTemplateBadge('Custom');
                      setTemplateCategory('lead_crm');
                      setTemplateMessage(
                        'හෙලෝ {student_name}, Ceylon Style Studio වෙතින්.\n\nඔබ "{campaign_title}" පාඨමාලාව සඳහා ලියාපදිංචි වීමට කැමැත්ත පළකර තිබුණි (Ref: {ref_id}). ඔබගේ ආසනය වෙන්කරවා ගැනීමට අදාළ වැඩිදුර තොරතුරු ලබාගැනීමට කරුණාකර අප හා සම්බන්ධ වන්න.'
                      );
                      setTemplateDescription('New custom lead follow-up message');
                    }}
                    className="px-4 py-2 rounded bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 fill-black" />
                    <span>Create New Template</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Template Form */}
              {(isAddingTemplate || editingTemplate) && (
                <div className="p-5 sm:p-6 rounded-xl bg-[#0f0a0c] border-2 border-[#25D366] shadow-2xl space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-[#25D366]/20 border border-[#25D366] text-[#25D366]">
                        <Edit className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-mono font-bold uppercase text-white">
                          {editingTemplate ? `Edit Template: "${editingTemplate.name}"` : 'Create New WhatsApp Template'}
                        </h4>
                        <span className="text-[11px] text-[#a89f91] font-sinhala">
                          පණිවිඩ ආකෘතිය සකස් කර Firebase Database හි ස්ථිරව Save කරන්න
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTemplate(null);
                        setIsAddingTemplate(false);
                      }}
                      className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Template Name (English) */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Template Name (English) *
                      </label>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g. Call No Answer Follow-up"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-[#25D366] outline-none"
                      />
                    </div>

                    {/* Template Name (Sinhala) */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Template Name (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={templateNameSinhala}
                        onChange={(e) => setTemplateNameSinhala(e.target.value)}
                        placeholder="e.g. ඇමතුමට පිළිතුරු නොදුන් පසු"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-[#25D366] outline-none font-sinhala"
                      />
                    </div>

                    {/* Badge Label */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Badge / Icon Label
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={templateBadge}
                          onChange={(e) => setTemplateBadge(e.target.value)}
                          placeholder="e.g. 📵 No Answer, 💳 Bank Info, ✨ Welcome"
                          className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-[#25D366] outline-none"
                        />
                        <div className="flex gap-1 shrink-0">
                          {['📵 No Answer', '💳 Bank', '✨ Welcome', '🚨 Urgency'].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setTemplateBadge(chip)}
                              className="px-2 py-1 rounded bg-[#1c1013] border border-white/10 text-[10px] text-[#dfb56c] hover:border-[#dfb56c] cursor-pointer"
                            >
                              {chip.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Category / වර්ගය
                      </label>
                      <select
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-[#25D366] outline-none cursor-pointer"
                      >
                        <option value="lead_crm">Lead CRM &amp; Phone Call Follow-up</option>
                        <option value="payment">Bank Account &amp; Fee Payment Details</option>
                        <option value="followup">Seat Confirmation &amp; Class Schedule Reminders</option>
                        <option value="general">General Welcome &amp; Atelier Inquiries</option>
                      </select>
                    </div>

                    {/* Internal Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Internal Staff Usage Description / උපදෙස්
                      </label>
                      <input
                        type="text"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="e.g. Use this immediately after calling when student doesn't answer the phone"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-[#25D366] outline-none"
                      />
                    </div>

                    {/* Message Body with Dynamic Tags */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                          WhatsApp Message Body / පණිවිඩයේ පෙළ *
                        </label>
                        <span className="text-[10px] font-mono text-[#a89f91]">
                          {templateMessage.length} characters
                        </span>
                      </div>

                      {/* Tag insertion chips */}
                      <div className="mb-2 p-2 rounded bg-black/60 border border-white/10 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#a89f91] mr-1">Insert Dynamic Tag:</span>
                        {[
                          { tag: '{student_name}', label: 'Student Name / නම' },
                          { tag: '{campaign_title}', label: 'Course Title / පාඨමාලා නම' },
                          { tag: '{ref_id}', label: 'Ref ID / ලියාපදිංචි අංකය' },
                          { tag: '{fee}', label: 'Fee / පාඨමාලා ගාස්තුව' },
                          { tag: '{location}', label: 'Location / ස්ථානය' },
                          { tag: '{mode}', label: 'Study Mode / ඉගෙනුම් ක්‍රමය' },
                          { tag: '{phone}', label: 'WhatsApp Phone' },
                        ].map((item) => (
                          <button
                            key={item.tag}
                            type="button"
                            onClick={() => setTemplateMessage((prev) => prev + ' ' + item.tag)}
                            className="px-2 py-0.5 rounded bg-[#1c1013] hover:bg-[#281318] border border-[#dfb56c]/30 text-[#f7e2a9] text-[10px] font-mono cursor-pointer transition-all"
                            title={`Insert ${item.tag} dynamic tag`}
                          >
                            + {item.label}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={7}
                        value={templateMessage}
                        onChange={(e) => setTemplateMessage(e.target.value)}
                        placeholder="Type message text here. Use dynamic tags like {student_name}, {campaign_title}, {ref_id}, {fee}..."
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white focus:border-[#25D366] outline-none leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* Real-time sample preview */}
                  <div className="p-3.5 rounded-lg bg-[#0d1a10] border border-[#25D366]/30">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#25D366] font-bold block mb-1">
                      Live Sample Preview (with mock student data):
                    </span>
                    <p className="text-xs text-zinc-200 whitespace-pre-line font-sans leading-relaxed">
                      {formatTemplateForLead(templateMessage, {
                        id: 'REF-7890',
                        campaignId: 'sample-camp',
                        campaignSlug: 'fb-masterclass',
                        campaignTitle: 'Fashion Design & Pattern Making Masterclass',
                        fullName: 'Nimali Senanayake',
                        whatsappNumber: '0771234567',
                        preferredLocation: 'Kurunegala Atelier',
                        studyMode: 'PHYSICAL',
                        callStatus: 'CALL_NO_ANSWER',
                        status: 'NEW',
                        createdAt: new Date().toISOString(),
                      } as CampaignLead)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTemplate(null);
                        setIsAddingTemplate(false);
                      }}
                      className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveTemplate}
                      className="px-6 py-2 rounded bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      <Save className="w-4 h-4 fill-black" />
                      <span>{editingTemplate ? 'Update & Save to Backend' : 'Save New Template to Backend'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Templates Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {whatsappTemplates.map((tpl, idx) => {
                  return (
                    <div
                      key={tpl.id}
                      className="p-5 rounded-xl bg-[#0c090a] border border-white/15 hover:border-[#25D366]/60 transition-all flex flex-col justify-between shadow-lg group"
                    >
                      <div>
                        {/* Top Meta Row */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                tpl.badgeBg || 'bg-emerald-950/80'
                              } ${tpl.badgeText || 'text-emerald-300'} border ${
                                tpl.badgeBorder || 'border-emerald-500/40'
                              }`}
                            >
                              {tpl.badge || tpl.name}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a89f91] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                              {tpl.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {tpl.isDefault ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/10">
                                System Default
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                Custom
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-editorial font-bold text-white group-hover:text-[#25D366] transition-colors">
                          {tpl.name}
                        </h4>
                        {tpl.nameSinhala && (
                          <h5 className="text-xs font-sinhala text-[#d5cfc4] mt-0.5">{tpl.nameSinhala}</h5>
                        )}

                        {tpl.description && (
                          <p className="text-[11px] text-[#a89f91] mt-1.5 italic font-sans">{tpl.description}</p>
                        )}

                        {/* Message Preview Box */}
                        <div className="mt-3 p-3 rounded-lg bg-black/70 border border-white/10 max-h-40 overflow-y-auto">
                          <p className="text-xs text-zinc-300 whitespace-pre-line font-sans leading-relaxed">
                            {tpl.message}
                          </p>
                        </div>

                        {/* Detected Dynamic Tags */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[9px] font-mono text-[#a89f91]">
                          <span className="text-zinc-500">Dynamic tags:</span>
                          {(tpl.message.match(/\{[a-zA-Z0-9_]+\}/g) || []).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.2 rounded bg-[#1c1013] text-[#dfb56c] border border-[#dfb56c]/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditTemplate(tpl)}
                            className="px-3 py-1.5 rounded bg-[#1f1418] hover:bg-[#321721] border border-[#dfb56c]/40 text-[#f7e2a9] text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                            title="Edit template content"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#dfb56c]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(tpl.message);
                                showToast(`Template "${tpl.name}" copied to clipboard!`);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded bg-black/60 hover:bg-black border border-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                            title="Copy template message text"
                          >
                            <Copy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Test Link */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(tpl.message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded bg-[#0f2416] hover:bg-[#163822] border border-[#25D366]/40 text-[#25D366] text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                            title="Preview message in WhatsApp"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview</span>
                          </a>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                            className="p-1.5 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300 cursor-pointer"
                            title="Delete this template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informational Guidance Box */}
              <div className="p-4 rounded-xl bg-[#0c090a] border border-[#dfb56c]/30 flex items-start gap-3 text-xs font-sans">
                <span className="text-xl shrink-0">💡</span>
                <div className="space-y-1 text-[#d5cfc4]">
                  <strong className="text-[#dfb56c] block font-mono uppercase tracking-wider text-[11px]">
                    Direct WhatsApp Messaging Architecture
                  </strong>
                  <p className="leading-relaxed font-sinhala">
                    ඔබ මෙතැනින් සාදන හෝ සංස්කරණය කරන සියලුම WhatsApp Templates ස්වයංක්‍රීයව Database හි සුරැකෙන අතර, View Leads CRM හි එක් එක් ශිෂ්‍යයාගේ WhatsApp Button එක මත ක්ලික් කළ විට ක්ෂණිකව භාවිතා කළ හැක. ශිෂ්‍යයාගේ නම, දුරකථන අංකය, පාඨමාලා ගාස්තුව, ලියාපදිංචි Reference අංකය ආදිය ස්වයංක්‍රීයව ආදේශ වී <span className="font-mono text-[#25D366]">wa.me/&lt;number&gt;?text=...</span> හරහා එම ශිෂ්‍යයාගේ WhatsApp Chat එකටම කෙලින්ම ගමන් කරනු ඇත.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: OFFICIAL BANK ACCOUNTS MANAGER (BACKEND & CRM)     */}
          {/* ========================================================= */}
          {activeTab === 'banks' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#1f1708] via-[#161005] to-[#0c090a] border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      <span>Financial CRM &amp; Bank Accounts Engine</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#a89f91]">
                      {bankAccounts.length} Official Accounts Configured
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    <span>Official Bank Accounts &amp; Payment Manager</span>
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-1 font-sinhala leading-relaxed max-w-3xl">
                    Ceylon Style Studio ආයතනික බැංකු ගිණුම් මෙතැනින් එකතු කිරීම, සංස්කරණය සහ Default ගිණුම තේරීම සිදුකළ හැක. මෙම ගිණුම් සජීවීව Firebase Firestore හි සුරැකෙන අතර, View Leads CRM හිදී ශිෂ්‍යයාට ගෙවීම් පණිවිඩ යැවීමේදී තෝරාගත හැක.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetBankAccounts}
                    className="px-3.5 py-2 rounded bg-black/60 border border-white/20 hover:border-white/40 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Restore default system bank accounts"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingBankAccount(null);
                      setIsAddingBankAccount(true);
                      setBankNameInput('');
                      setAccountNumberInput('');
                      setAccountNameInput('Ceylon Style Studio (Pvt) Ltd');
                      setBranchInput('');
                      setSwiftCodeInput('');
                      setCurrencyInput('LKR');
                      setBankNotesInput('Please deposit the course fee and send the deposit slip or screenshot to this WhatsApp number.');
                      setIsDefaultBankInput(bankAccounts.length === 0);
                      setIsActiveBankInput(true);
                    }}
                    className="px-4 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 fill-black" />
                    <span>Add New Bank Account</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Bank Account Form */}
              {(isAddingBankAccount || editingBankAccount) && (
                <div className="p-5 sm:p-6 rounded-xl bg-[#0f0a0c] border-2 border-amber-400 shadow-2xl space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-amber-400/20 border border-amber-400 text-amber-300">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-mono font-bold uppercase text-white">
                          {editingBankAccount ? `Edit Bank Account: "${editingBankAccount.bankName}"` : 'Add New Official Bank Account'}
                        </h4>
                        <span className="text-[11px] text-[#a89f91] font-sinhala">
                          බැංකු ගිණුම් විස්තර ඇතුළත් කර Firebase Database හි ස්ථිරව සුරකින්න
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBankAccount(null);
                        setIsAddingBankAccount(false);
                      }}
                      className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Bank Presets */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#dfb56c] mb-1.5 font-bold">
                      Quick Bank Presets / ජනප්‍රිය බැංකු තෝරන්න:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Commercial Bank of Ceylon',
                        'Sampath Bank PLC',
                        'Bank of Ceylon (BOC)',
                        'Hatton National Bank (HNB)',
                        "People's Bank",
                        'Seylan Bank PLC',
                        'Nations Trust Bank (NTB)',
                        'DFCC Bank',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBankNameInput(preset)}
                          className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                            bankNameInput === preset
                              ? 'bg-amber-400 text-black border-amber-300 font-bold'
                              : 'bg-[#181114] border-white/10 text-[#d5cfc4] hover:border-amber-400/50 hover:text-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Bank Name / බැංකුවේ නම *
                      </label>
                      <input
                        type="text"
                        value={bankNameInput}
                        onChange={(e) => setBankNameInput(e.target.value)}
                        placeholder="e.g. Commercial Bank of Ceylon"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Account Number / ගිණුම් අංකය *
                      </label>
                      <input
                        type="text"
                        value={accountNumberInput}
                        onChange={(e) => setAccountNumberInput(e.target.value)}
                        placeholder="e.g. 1000548923 or 004510009822"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                      />
                    </div>

                    {/* Account Holder / Company Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Account Holder / Company Name *
                      </label>
                      <input
                        type="text"
                        value={accountNameInput}
                        onChange={(e) => setAccountNameInput(e.target.value)}
                        placeholder="e.g. Ceylon Style Studio (Pvt) Ltd"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Branch / ශාඛාව *
                      </label>
                      <input
                        type="text"
                        value={branchInput}
                        onChange={(e) => setBranchInput(e.target.value)}
                        placeholder="e.g. Kurunegala Super Grade, Kegalle, Colombo"
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    {/* SWIFT / Branch Code & Currency */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          SWIFT / Branch Code
                        </label>
                        <input
                          type="text"
                          value={swiftCodeInput}
                          onChange={(e) => setSwiftCodeInput(e.target.value)}
                          placeholder="e.g. CCEYLKAX"
                          className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white font-mono focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Currency
                        </label>
                        <select
                          value={currencyInput}
                          onChange={(e) => setCurrencyInput(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white font-mono focus:border-amber-400 outline-none cursor-pointer"
                        >
                          <option value="LKR">LKR (රුපියල්)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    {/* Checkboxes: Default & Active */}
                    <div className="flex items-center gap-6 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-200">
                        <input
                          type="checkbox"
                          checked={isDefaultBankInput}
                          onChange={(e) => setIsDefaultBankInput(e.target.checked)}
                          className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                        />
                        <span className="font-bold flex items-center gap-1 text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-300" />
                          Set as Primary Default Account
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-200">
                        <input
                          type="checkbox"
                          checked={isActiveBankInput}
                          onChange={(e) => setIsActiveBankInput(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                        />
                        <span>Active for CRM</span>
                      </label>
                    </div>

                    {/* Instructions / Notes for Students */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Special Instructions / Student Payment Notes (උපදෙස්)
                      </label>
                      <input
                        type="text"
                        value={bankNotesInput}
                        onChange={(e) => setBankNotesInput(e.target.value)}
                        placeholder="e.g. මුදල් තැන්පත් කිරීමෙන් පසු රිසිට්පත (Bank Slip / Screenshot) මෙම WhatsApp අංකයට යොමුකරන්න."
                        className="w-full px-3 py-2 rounded bg-black border border-white/20 text-xs text-white font-sinhala focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Template Format Preview */}
                  <div className="p-3.5 rounded-lg bg-[#140f06] border border-amber-400/40">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                      Live Preview (How &#123;bank_details&#125; tag will appear in WhatsApp messages):
                    </span>
                    <pre className="text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed">
{`• Bank: ${bankNameInput || 'Commercial Bank of Ceylon'}
• Account Name: ${accountNameInput || 'Ceylon Style Studio (Pvt) Ltd'}
• Account Number: ${accountNumberInput || '1000548923'}
• Branch: ${branchInput || 'Kurunegala Super Grade'}${
  swiftCodeInput ? `\n• SWIFT / Branch Code: ${swiftCodeInput}` : ''
}${bankNotesInput ? `\n• උපදෙස්: ${bankNotesInput}` : ''}`}
                    </pre>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBankAccount(null);
                        setIsAddingBankAccount(false);
                      }}
                      className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveBankAccount}
                      className="px-6 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      <Save className="w-4 h-4 fill-black" />
                      <span>{editingBankAccount ? 'Update & Save Bank Account' : 'Save Bank Account to Backend'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bank Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankAccounts.map((acc, idx) => {
                  return (
                    <div
                      key={acc.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between shadow-lg group ${
                        acc.isDefault
                          ? 'bg-gradient-to-br from-[#191104] to-[#0c090a] border-amber-400/80 ring-1 ring-amber-400/40'
                          : 'bg-[#0c090a] border-white/15 hover:border-amber-400/50'
                      }`}
                    >
                      <div>
                        {/* Top Badge Row */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            {acc.isDefault ? (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-black flex items-center gap-1 shadow">
                                <Star className="w-3 h-3 fill-black" />
                                <span>PRIMARY DEFAULT</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#a89f91] bg-black/50 border border-white/10">
                                Alternate Account
                              </span>
                            )}

                            {acc.isActive ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 bg-emerald-950/70 border border-emerald-500/40">
                                Active in CRM
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-white/10">
                                Inactive
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                        </div>

                        {/* Bank Name & Branch */}
                        <div className="flex items-start justify-between gap-2 mt-1">
                          <div>
                            <h4 className="text-base font-editorial font-bold text-white group-hover:text-amber-300 transition-colors">
                              {acc.bankName}
                            </h4>
                            <p className="text-xs text-[#a89f91] font-mono flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{acc.branch} Branch</span>
                              {acc.swiftCode && <span className="text-zinc-500">• {acc.swiftCode}</span>}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-xs font-mono font-bold text-amber-300">
                            {acc.currency || 'LKR'}
                          </span>
                        </div>

                        {/* Account Number Box with 1-click Copy */}
                        <div className="mt-3 p-3 rounded-lg bg-black/80 border border-white/15 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#a89f91] block">Account Number</span>
                            <strong className="text-base sm:text-lg font-mono font-bold text-white tracking-wider text-amber-300">
                              {acc.accountNumber}
                            </strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(acc.accountNumber);
                                showToast(`Account number ${acc.accountNumber} copied!`);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded bg-amber-400/20 hover:bg-amber-400 hover:text-black border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all shrink-0"
                            title="Copy Account Number"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>

                        {/* Account Name */}
                        <div className="mt-2 text-xs font-mono text-[#d5cfc4]">
                          <span className="text-[10px] text-zinc-500 block uppercase">Account Name / Holder</span>
                          <strong className="text-zinc-200">{acc.accountName}</strong>
                        </div>

                        {/* Notes */}
                        {acc.notes && (
                          <div className="mt-2 p-2 rounded bg-[#160f08] border border-amber-400/20 text-[11px] text-[#f7e2a9] font-sinhala italic">
                            💡 {acc.notes}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {!acc.isDefault && (
                            <button
                              type="button"
                              onClick={() => {
                                setDefaultBankAccount(acc.id);
                                showToast(`${acc.bankName} set as primary default account!`);
                              }}
                              className="px-2.5 py-1 rounded bg-[#2b1e0a] hover:bg-amber-400 hover:text-black border border-amber-400/40 text-amber-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                              title="Set this bank account as default"
                            >
                              <Star className="w-3 h-3" />
                              <span>Set Default</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleStartEditBankAccount(acc)}
                            className="px-2.5 py-1 rounded bg-[#1f1418] hover:bg-[#321721] border border-[#dfb56c]/40 text-[#f7e2a9] text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                            title="Edit Bank Details"
                          >
                            <Edit className="w-3 h-3 text-[#dfb56c]" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const details = `• Bank: ${acc.bankName}\n• Account Name: ${acc.accountName}\n• Account Number: ${acc.accountNumber}\n• Branch: ${acc.branch}${acc.swiftCode ? `\n• SWIFT: ${acc.swiftCode}` : ''}${acc.notes ? `\n• උපදෙස්: ${acc.notes}` : ''}`;
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(details);
                                showToast(`Full bank details for ${acc.bankName} copied!`);
                              }
                            }}
                            className="px-2 py-1 rounded bg-black/60 hover:bg-black border border-white/10 text-zinc-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                            title="Copy full bank details for sharing"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBankAccount(acc.id, acc.bankName)}
                            className="p-1.5 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300 cursor-pointer"
                            title="Delete this bank account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informational Guidance Box */}
              <div className="p-4 rounded-xl bg-[#0c090a] border border-amber-400/30 flex items-start gap-3 text-xs font-sans">
                <span className="text-xl shrink-0">💡</span>
                <div className="space-y-1 text-[#d5cfc4]">
                  <strong className="text-amber-300 block font-mono uppercase tracking-wider text-[11px]">
                    Automatic CRM Bank Account Synchronization
                  </strong>
                  <p className="leading-relaxed font-sinhala">
                    ඔබ මෙහි එක් කරන හෝ සංස්කරණය කරන ඕනෑම බැංකු ගිණුමක් ස්වයංක්‍රීයව View Leads CRM හා සම්බන්ධ වේ. ශිෂ්‍යයෙකුට WhatsApp පණිවිඩයක් යැවීමේදී ඔබට අවශ්‍ය බැංකු ගිණුම (Commercial, Sampath, BOC, HNB ආදී) එක ක්ලික් එකකින් තෝරාගත හැකි අතර, එම ගිණුමේ විස්තර පණිවිඩයේ &#123;bank_details&#125; ඇති තැනට ස්වයංක්‍රීයව ආදේශ වේ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CALL OUTCOMES & STATUS WORDS MANAGER                 */}
          {/* ========================================================= */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6">
              {/* Top Info Banner */}
              <div className="p-4 rounded-xl bg-[#0c090a] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-300 shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                        Lead Funnel &amp; CRM Customizer
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Total Status Words: {activeCallOutcomes.length}
                      </span>
                    </div>
                    <h3 className="text-base font-editorial font-bold text-white">
                      Call Outcomes &amp; Status Words Manager (දුරකථන ඇමතුම් ප්‍රතිඵල සහ තත්වයන්)
                    </h3>
                    <p className="text-xs text-[#d5cfc4] font-sinhala leading-relaxed max-w-3xl">
                      Student Leads CRM හි 'Call Outcome &amp; Status' යටතේ එන Dropdown එකෙහි ඇති වචන (Words/Labels), සිංහල අර්ථයන් සහ පාට මෙතැනින් සංස්කරණය කළ හැක හෝ අලුතින් එක් කර Backend හි ස්ථිරව සුරැකිය හැක. ඔබ මෙහි සිදුකරන වෙනස්කම් Leads Table එකෙහි Dropdown, Call Logger Modal එක, සහ Leads Filter Pills වලට ස්වයංක්‍රීයව අදාළ වේ.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOutcome(null);
                      setIsAddingOutcome(true);
                      setOutcomeIdInput('');
                      setOutcomeLabelInput('');
                      setOutcomeLabelSinhalaInput('');
                      setOutcomeDescriptionInput('');
                      setOutcomeThemeIndex(0);
                    }}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs font-mono uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 fill-black" />
                    <span>Add New Status Word</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCallOutcomes}
                    className="px-3 py-2 bg-[#1b1013] hover:bg-[#281318] border border-white/15 text-zinc-300 hover:text-white text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer"
                    title="Restore default status words"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Defaults</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Modal or Card */}
              {(isAddingOutcome || editingOutcome) && (
                <div className="p-5 rounded-xl bg-[#0f0a0c] border-2 border-purple-500/60 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                        <Edit3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-editorial font-bold text-white">
                          {editingOutcome
                            ? `Edit Status Word: "${editingOutcome.label}"`
                            : 'Create New Call Outcome / Status Word (නව තත්වයක් එක් කරන්න)'}
                        </h4>
                        <span className="text-[10px] font-mono text-[#a89f91]">
                          Dropdown Label, Sinhala Translation &amp; Badge Color Styling
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingOutcome(false);
                        setEditingOutcome(null);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* English Label */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Status Word / Name (English) *
                      </label>
                      <input
                        type="text"
                        value={outcomeLabelInput}
                        onChange={(e) => setOutcomeLabelInput(e.target.value)}
                        placeholder="e.g. WhatsApp Catalog Sent / Awaiting Parent Approval"
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded text-xs text-white focus:border-purple-400 outline-none"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        Dropdown එකෙහි සහ Lead record එකෙහි පෙන්වන ප්‍රධාන නම
                      </span>
                    </div>

                    {/* Sinhala Label */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Status Word / Name (Sinhala) *
                      </label>
                      <input
                        type="text"
                        value={outcomeLabelSinhalaInput}
                        onChange={(e) => setOutcomeLabelSinhalaInput(e.target.value)}
                        placeholder="e.g. WhatsApp විස්තර යැවීය / දෙමාපියන්ගේ අනුමැතිය අපේක්ෂාවෙන්"
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded text-xs text-white focus:border-purple-400 outline-none font-sinhala"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        සිංහල මාතෘකාව හෝ විස්තරාත්මක සටහන
                      </span>
                    </div>

                    {/* Code / Unique ID */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Status Code ID (Unique System Key)
                      </label>
                      <input
                        type="text"
                        value={outcomeIdInput}
                        onChange={(e) => setOutcomeIdInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                        placeholder="e.g. WHATSAPP_CATALOG_SENT"
                        disabled={!!editingOutcome}
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded text-xs text-purple-300 font-mono focus:border-purple-400 outline-none disabled:opacity-50"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        {editingOutcome ? 'Code ID cannot be changed once created.' : 'හිස්ව තැබුවහොත් English නම අනුව ස්වයංක්‍රීයව සෑදේ.'}
                      </span>
                    </div>

                    {/* Optional Guidance / Description */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Agent Guidance / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={outcomeDescriptionInput}
                        onChange={(e) => setOutcomeDescriptionInput(e.target.value)}
                        placeholder="e.g. Sent syllabus brochure via WhatsApp and awaiting response"
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded text-xs text-white focus:border-purple-400 outline-none"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        ඇමතුම් ගන්නා නිලධාරියාට උපදෙස්
                      </span>
                    </div>
                  </div>

                  {/* Color Theme Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-2 font-bold">
                      Select Badge Color &amp; Visual Style / වර්ණය සහ පෙනුම
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {OUTCOME_COLOR_PRESETS.map((preset, pIdx) => {
                        const isSelected = outcomeThemeIndex === pIdx;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setOutcomeThemeIndex(pIdx)}
                            className={`p-2.5 rounded border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              isSelected
                                ? `${preset.bg} ${preset.border} ring-2 ring-purple-400 shadow-md`
                                : `${preset.bg} border-white/10 opacity-70 hover:opacity-100`
                            }`}
                          >
                            <span className={`text-[11px] font-mono font-bold ${preset.text} truncate`}>
                              {preset.name.split(' (')[0]}
                            </span>
                            <span className="text-[9px] text-zinc-400 truncate">
                              {preset.name.split(' (')[1]?.replace(')', '') || ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Preview Bar */}
                  <div className="p-3 rounded-lg bg-black/80 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">Live Preview:</span>
                      {(() => {
                        const p = OUTCOME_COLOR_PRESETS[outcomeThemeIndex] || OUTCOME_COLOR_PRESETS[0];
                        return (
                          <span className={`px-2.5 py-1 rounded border text-xs font-mono font-bold ${p.bg} ${p.border} ${p.text}`}>
                            {outcomeLabelInput || 'Preview Status Word'}
                          </span>
                        );
                      })()}
                      {outcomeLabelSinhalaInput && (
                        <span className="text-xs text-[#dfb56c] font-sinhala">
                          ({outcomeLabelSinhalaInput})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingOutcome(false);
                          setEditingOutcome(null);
                        }}
                        className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveCallOutcome}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-black font-bold text-xs font-mono uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Call Outcome / සුරකින්න</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of Configured Call Outcomes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold">
                    Active Dropdown Words &amp; Status Badges ({activeCallOutcomes.length})
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Click "Edit" on any status to modify its English/Sinhala word or color
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeCallOutcomes.map((out, idx) => {
                    const leadsWithThisStatus = campaignLeads.filter(
                      (l) => (l.callStatus || l.status) === out.id
                    ).length;

                    return (
                      <div
                        key={out.id}
                        className="p-3.5 rounded-lg bg-[#0c090a] border border-white/10 hover:border-purple-500/40 transition-all shadow-md flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold ${out.badgeBg} ${out.badgeBorder} ${out.badgeText} shadow-sm`}
                            >
                              {out.label}
                            </span>

                            <span className="text-[10px] font-mono text-zinc-500">
                              #{idx + 1}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-sinhala text-[#dfb56c] font-medium leading-snug">
                              {out.labelSinhala}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                              <span className="text-zinc-600">ID:</span>
                              <span className="text-zinc-300 font-bold">{out.id}</span>
                            </div>
                            {out.description && (
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                                {out.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-[11px] text-zinc-400">
                            Used in <strong className="text-white">{leadsWithThisStatus}</strong> lead{leadsWithThisStatus === 1 ? '' : 's'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditCallOutcome(out)}
                              className="px-2 py-1 rounded bg-[#1f1418] hover:bg-[#321721] border border-purple-500/40 text-purple-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                              title="Edit this status word & color"
                            >
                              <Edit className="w-3 h-3 text-purple-300" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCallOutcome(out.id, out.label)}
                              className="p-1 rounded text-red-400 hover:text-red-200 hover:bg-red-950/60 cursor-pointer"
                              title="Delete status word"
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

              {/* Informational Guidance Box */}
              <div className="p-4 rounded-xl bg-[#0c090a] border border-purple-500/30 flex items-start gap-3 text-xs font-sans">
                <span className="text-xl shrink-0">💡</span>
                <div className="space-y-1 text-[#d5cfc4]">
                  <strong className="text-purple-300 block font-mono uppercase tracking-wider text-[11px]">
                    Real-Time CRM Dropdown Synchronization
                  </strong>
                  <p className="leading-relaxed font-sinhala">
                    ඔබ මෙහි එක් කරන හෝ සංස්කරණය කරන ඕනෑම තත්වයක් (Status Word) ස්වයංක්‍රීයව Student Leads CRM වගුවේ <strong>"Call Outcome &amp; Status"</strong> dropdown එකෙහි සහ Call Logger හි දිස්වේ. අවශ්‍ය ඕනෑම අවස්ථාවක නව වචන එක් කළ හැකි අතර, පැරණි වචන සංස්කරණය කර Backend හි සුරැකිය හැක.
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================= */}
          {/* CRM CALL LOGGER & NOTES MODAL                             */}
          {/* ========================================================= */}
          {callLoggingLead && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className="bg-[#0f0a0c] border-2 border-[#dfb56c] rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1c1013] to-[#120a0d] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-[#540d18] border border-[#dfb56c] text-[#dfb56c]">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                        Lead CRM Call Logger &amp; Discussion Notes
                      </span>
                      <h3 className="text-base font-editorial font-bold text-white">
                        {callLoggingLead.fullName} • {callLoggingLead.whatsappNumber}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCallLoggingLead(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-4 flex-1">
                  {/* Lead Quick Summary Card */}
                  <div className="p-3.5 rounded bg-black/60 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#a89f91] block">Campaign</span>
                      <strong className="text-[#dfb56c] truncate block">{callLoggingLead.campaignTitle}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a89f91] block">Study Mode</span>
                      <strong className="text-white">{callLoggingLead.studyMode}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a89f91] block">Location</span>
                      <strong className="text-white">{callLoggingLead.preferredLocation || callLoggingLead.city || 'Kurunegala'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a89f91] block">Current Status</span>
                      <strong className="text-amber-300">{callLoggingLead.callStatus || callLoggingLead.status}</strong>
                    </div>
                  </div>

                  {/* Direct Phone & WhatsApp Callout */}
                  <div className="flex flex-wrap items-center gap-2 p-2.5 rounded bg-[#160d10] border border-[#dfb56c]/30">
                    <span className="text-xs text-[#dfb56c] font-mono">Direct Actions:</span>
                    <a
                      href={`tel:${callLoggingLead.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1 rounded bg-blue-900/60 hover:bg-blue-800 border border-blue-400 text-blue-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={getDirectWhatsAppUrl(callLoggingLead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-[#25D366] text-black hover:bg-[#20ba59] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-105 transition-all"
                      title="Direct 1-click WhatsApp chat"
                      onClick={() => showToast(`Opening WhatsApp chat for ${callLoggingLead.fullName}...`)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-black" />
                      <span>Open Direct WhatsApp ({callLoggingLead.whatsappNumber})</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappModalLead(callLoggingLead);
                        setSelectedTemplateId('tpl-no-answer');
                        setCustomWhatsappMessage(getWhatsAppMessageText(callLoggingLead, 'tpl-no-answer'));
                      }}
                      className="px-3 py-1 rounded bg-[#25D366]/20 hover:bg-[#25D366] hover:text-black border border-[#25D366]/50 text-[#25D366] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Choose Template</span>
                    </button>
                  </div>

                  {/* Call Outcome Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                        1. Call Outcome / දුරකථන ඇමතුමේ ප්‍රතිඵලය *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCallLoggingLead(null);
                          setActiveTab('outcomes');
                        }}
                        className="text-[10px] font-mono text-[#dfb56c] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Add or edit status words in backend"
                      >
                        <Edit3 className="w-3 h-3 text-[#dfb56c]" />
                        <span>Manage Status Words</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeCallOutcomes.map((out) => {
                        const isSelected = callOutcomeInput === out.id;
                        return (
                          <button
                            key={out.id}
                            type="button"
                            onClick={() => setCallOutcomeInput(out.id)}
                            className={`p-2.5 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? `${out.badgeBg} ${out.badgeBorder} ${out.badgeText} ring-2 ring-[#dfb56c] font-bold shadow-md`
                                : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <span className="text-xs font-mono block">{out.label}</span>
                            <span className="text-[10px] font-sinhala block opacity-80 mt-0.5">
                              {out.labelSinhala}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discussion Notes / Monawada Kiwwe */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      2. Discussion Notes / ශිෂ්‍යයා පැවසූ කරුණු (Monawada Kiwwe) *
                    </label>
                    <p className="text-[11px] text-[#a89f91] font-sinhala mb-2">
                      ශිෂ්‍යයා දුරකථන ඇමතුමේදී පැවසූ විස්තර, පාඨමාලාවට ඇති කැමැත්ත, ගාස්තු ගෙවීමට එකඟ වූ දිනය හෝ ඇසූ ප්‍රශ්න මෙහි සටහන් කරන්න.
                    </p>
                    <textarea
                      rows={3}
                      value={callDiscussionInput}
                      onChange={(e) => setCallDiscussionInput(e.target.value)}
                      placeholder="උදා: weekend batch එකට සම්බන්ධ වෙන්න කැමතියි කිව්වා. හෙට advance රු. 5,000ක් Commercial Bank account එකට දාලා slip එක WhatsApp කරන්නම් කිව්වා..."
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Next Callback Date & Admin Caller */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                        Next Callback Date / Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={callbackDateInput}
                        onChange={(e) => setCallbackDateInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                        Caller / Admin Desk Name
                      </label>
                      <input
                        type="text"
                        value={callerNameInput}
                        onChange={(e) => setCallerNameInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/15 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Past Call History Timeline */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      <span>Past Call History for this Student ({callLoggingLead.callLogs?.length || 0})</span>
                    </span>

                    {(!callLoggingLead.callLogs || callLoggingLead.callLogs.length === 0) ? (
                      <p className="text-xs text-zinc-500 italic font-mono p-3 bg-black/40 rounded border border-white/5">
                        No previous call attempts logged for this student yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {callLoggingLead.callLogs.map((log, lIdx) => {
                          const outConf = CALL_OUTCOME_CONFIGS.find((c) => c.id === log.outcome);
                          return (
                            <div
                              key={log.id || lIdx}
                              className="p-3 rounded bg-black/60 border border-white/10 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    outConf?.badgeBg || 'bg-zinc-800'
                                  } ${outConf?.badgeText || 'text-white'}`}
                                >
                                  {log.outcome}
                                </span>
                                <span className="text-[10px] text-[#a89f91]">
                                  {new Date(log.timestamp).toLocaleString()} • {log.loggedBy || 'Admin'}
                                </span>
                              </div>
                              <p className="text-[#d5cfc4] font-sans leading-relaxed text-xs">
                                {log.notes}
                              </p>
                              {log.callbackDate && (
                                <span className="text-[10px] text-purple-300 font-mono block">
                                  Callback Scheduled: {new Date(log.callbackDate).toLocaleString()}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCallLoggingLead(null)}
                    className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!callDiscussionInput.trim()) {
                        showToast('Please enter discussion notes (Monawada kiwwe)!');
                        return;
                      }

                      await logCampaignLeadCall(
                        callLoggingLead.id,
                        callOutcomeInput,
                        callDiscussionInput.trim(),
                        callbackDateInput || undefined,
                        callerNameInput || undefined
                      );

                      showToast(`Call record saved for ${callLoggingLead.fullName}!`);
                      setCallLoggingLead(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase rounded cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Call Record &amp; Status</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DIRECT WHATSAPP MESSENGER MODAL                           */}
          {/* ========================================================= */}
          {whatsappModalLead && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className="bg-[#0f0a0c] border-2 border-[#25D366] rounded-xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0d1f14] to-[#0a120c] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-[#25D366]/20 border border-[#25D366] text-[#25D366]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#25D366] font-bold block">
                        Direct WhatsApp Messenger
                      </span>
                      <h3 className="text-base font-editorial font-bold text-white">
                        {whatsappModalLead.fullName} • {whatsappModalLead.whatsappNumber}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWhatsappModalLead(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-4 flex-1">
                  {/* Bank Account Selector for this Message */}
                  <div className="p-3 bg-black/60 rounded-lg border border-[#dfb56c]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Select Academy Bank Account / බැංකු ගිණුම තෝරන්න:</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setWhatsappModalLead(null);
                          setActiveTab('banks');
                        }}
                        className="text-[10px] font-mono text-[#dfb56c] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Manage Academy Bank Accounts"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Manage Banks</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {bankAccounts
                        .filter((b) => b.isActive !== false)
                        .map((acc) => {
                          const isAccSelected =
                            selectedBankAccountId === acc.id ||
                            (!selectedBankAccountId && acc.isDefault);

                          return (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => {
                                setSelectedBankAccountId(acc.id);
                                const currentTpl = whatsappTemplates.find((t) => t.id === selectedTemplateId);
                                if (currentTpl) {
                                  setCustomWhatsappMessage(
                                    formatTemplateForLead(currentTpl.message, whatsappModalLead, acc)
                                  );
                                }
                                showToast(`Selected: ${acc.bankName} (${acc.accountNumber})`);
                              }}
                              className={`px-3 py-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 text-xs ${
                                isAccSelected
                                  ? 'bg-[#dfb56c]/20 border-[#dfb56c] text-white shadow-md ring-1 ring-[#dfb56c]/50'
                                  : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:border-white/30 hover:text-white'
                              }`}
                            >
                              <Building
                                className={`w-4 h-4 shrink-0 ${
                                  isAccSelected ? 'text-[#dfb56c]' : 'text-zinc-500'
                                }`}
                              />
                              <div>
                                <div className="flex items-center gap-1 font-bold">
                                  <span>{acc.bankName}</span>
                                  {acc.isDefault && (
                                    <span className="text-[9px] px-1 py-0.2 bg-[#dfb56c]/30 text-[#dfb56c] rounded border border-[#dfb56c]/40">
                                      ⭐ Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-mono text-[#d5cfc4]/80">
                                  {acc.accountNumber} • {acc.branch}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Template Picker Header & Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] font-bold">
                      Choose Message Template / පණිවිඩ ආකෘතිය:
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTemplateInModal(!isAddingTemplateInModal);
                          setIsEditingTemplateInModal(false);
                          setModalTemplateName('');
                          setModalTemplateNameSinhala('');
                          setModalTemplateBadge('Custom');
                          setModalTemplateCategory('lead_crm');
                          setModalTemplateMessage(
                            `ආයුබෝවන් {student_name},\nඔබ {campaign_title} පාඨමාලාව සඳහා සම්බන්ධ වීමට කැමැත්ත පළ කර තිබුණි.\n\nබැංකු තොරතුරු:\n{bank_details}\n\nස්තූතියි!\nCeylon Style Studio Admissions Desk`
                          );
                        }}
                        className="px-2 py-1 rounded bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-black text-[10px] font-bold font-mono flex items-center gap-1 cursor-pointer transition-all"
                        title="Add a brand new WhatsApp template right here"
                      >
                        <Plus className="w-3 h-3" />
                        <span>➕ New Template</span>
                      </button>

                      {selectedTemplateId && (
                        <button
                          type="button"
                          onClick={() => {
                            const cur = whatsappTemplates.find((t) => t.id === selectedTemplateId);
                            if (cur) {
                              setIsEditingTemplateInModal(!isEditingTemplateInModal);
                              setIsAddingTemplateInModal(false);
                              setModalTemplateName(cur.name);
                              setModalTemplateNameSinhala(cur.nameSinhala || '');
                              setModalTemplateBadge(cur.badge || 'Template');
                              setModalTemplateCategory(cur.category || 'lead_crm');
                              setModalTemplateMessage(cur.message);
                            }
                          }}
                          className="px-2 py-1 rounded bg-zinc-800 border border-white/20 text-zinc-300 hover:text-white hover:border-[#dfb56c] text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
                          title="Edit the currently selected template"
                        >
                          <Edit3 className="w-3 h-3 text-[#dfb56c]" />
                          <span>✏️ Edit Template</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setWhatsappModalLead(null);
                          setActiveTab('templates');
                        }}
                        className="text-[10px] font-mono text-[#25D366] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Manage all templates in backend"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Backend Manager</span>
                      </button>
                    </div>
                  </div>

                  {/* In-Modal Template Editor Form (if adding or editing) */}
                  {(isAddingTemplateInModal || isEditingTemplateInModal) && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a120c] to-[#120a0d] border-2 border-[#25D366]/60 shadow-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-mono uppercase text-[#25D366] font-bold flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>
                            {isEditingTemplateInModal
                              ? `Edit Template: ${modalTemplateName}`
                              : 'Create New WhatsApp Template'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTemplateInModal(false);
                            setIsEditingTemplateInModal(false);
                          }}
                          className="text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                            Template Name (English) *
                          </label>
                          <input
                            type="text"
                            value={modalTemplateName}
                            onChange={(e) => setModalTemplateName(e.target.value)}
                            placeholder="e.g. Bank Payment Reminder"
                            className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                            Name (සිංහල විස්තරය)
                          </label>
                          <input
                            type="text"
                            value={modalTemplateNameSinhala}
                            onChange={(e) => setModalTemplateNameSinhala(e.target.value)}
                            placeholder="ගෙවීම් සිහිකැඳවීම"
                            className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded text-xs text-white font-sinhala"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={modalTemplateBadge}
                            onChange={(e) => setModalTemplateBadge(e.target.value)}
                            placeholder="e.g. Bank, Urgent, Offer"
                            className="w-full px-2.5 py-1.5 bg-black border border-white/20 rounded text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-[#a89f91]">
                            Template Message Body (Supports dynamic tokens) *
                          </label>
                          <span className="text-[10px] font-mono text-[#dfb56c]">
                            {modalTemplateMessage.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={modalTemplateMessage}
                          onChange={(e) => setModalTemplateMessage(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/20 rounded text-xs text-white font-sans focus:border-[#25D366] outline-none"
                        />
                        {/* Token Buttons for modal editor */}
                        <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-mono">
                          <span className="text-zinc-500">Insert:</span>
                          {[
                            { tag: '{student_name}', label: 'Student' },
                            { tag: '{campaign_title}', label: 'Course' },
                            { tag: '{fee}', label: 'Fee' },
                            { tag: '{bank_details}', label: '💳 Bank Details' },
                            { tag: '{bank_name}', label: 'Bank Name' },
                            { tag: '{account_no}', label: 'Acc No' },
                            { tag: '{branch}', label: 'Branch' },
                          ].map((t) => (
                            <button
                              key={t.tag}
                              type="button"
                              onClick={() => setModalTemplateMessage((prev) => prev + ' ' + t.tag)}
                              className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[#dfb56c] hover:border-[#dfb56c] cursor-pointer"
                            >
                              +{t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTemplateInModal(false);
                            setIsEditingTemplateInModal(false);
                          }}
                          className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveTemplateFromModal}
                          className="px-4 py-1.5 bg-[#25D366] text-black text-xs font-bold rounded flex items-center gap-1.5 shadow hover:brightness-110 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save to Backend &amp; Select</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Template Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1 border border-white/10 rounded-lg bg-black/40">
                    {whatsappTemplates.map((tpl) => {
                      const isSelected = selectedTemplateId === tpl.id;
                      const activeBank =
                        (selectedBankAccountId
                          ? bankAccounts.find((b) => b.id === selectedBankAccountId)
                          : undefined) ||
                        bankAccounts.find((b) => b.isDefault && b.isActive) ||
                        bankAccounts.find((b) => b.isActive) ||
                        bankAccounts[0];

                      const previewFormatted = formatTemplateForLead(tpl.message, whatsappModalLead, activeBank);
                      const cleanPhone = getCleanWhatsAppPhone(whatsappModalLead.whatsappNumber);
                      const directUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(previewFormatted)}`;

                      return (
                        <div
                          key={tpl.id}
                          className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#25D366]/15 border-[#25D366] text-white shadow-md'
                              : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <div
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              setCustomWhatsappMessage(previewFormatted);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  tpl.badgeBg || 'bg-emerald-950/80'
                                } ${tpl.badgeText || 'text-emerald-300'} border ${
                                  tpl.badgeBorder || 'border-emerald-500/40'
                                }`}
                              >
                                {tpl.badge || tpl.name}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] font-mono text-[#25D366] font-bold">● Active</span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{tpl.name}</h5>
                            {tpl.nameSinhala && (
                              <p className="text-[10px] font-sinhala text-[#d5cfc4] line-clamp-1 mt-0.5">
                                {tpl.nameSinhala}
                              </p>
                            )}
                            <p className="text-[10px] text-zinc-300 line-clamp-2 mt-1.5 font-sans italic bg-black/60 p-1.5 rounded border border-white/5">
                              {previewFormatted}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTemplateId(tpl.id);
                                setCustomWhatsappMessage(previewFormatted);
                              }}
                              className="text-[10px] font-mono text-[#dfb56c] hover:underline cursor-pointer"
                            >
                              Select &amp; Edit
                            </button>
                            <a
                              href={directUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                showToast(`Direct WhatsApp opened for ${whatsappModalLead.fullName}!`);
                                setWhatsappModalLead(null);
                              }}
                              className="px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#20ba59] text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
                              title="Directly open this template into student's WhatsApp chat"
                            >
                              <Send className="w-2.5 h-2.5 fill-black" />
                              <span>1-Click Send</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                        Message Content (Editable before sending)
                      </label>
                      <span className="text-[10px] font-mono text-[#a89f91]">
                        {customWhatsappMessage.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={customWhatsappMessage}
                      onChange={(e) => setCustomWhatsappMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded text-xs text-white focus:border-[#25D366] outline-none leading-relaxed font-sans"
                    />

                    {/* Quick Dynamic Tag Chips */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="text-zinc-500">Insert tag:</span>
                      {[
                        { tag: '{student_name}', label: 'Student Name' },
                        { tag: '{campaign_title}', label: 'Course' },
                        { tag: '{ref_id}', label: 'Ref ID' },
                        { tag: '{fee}', label: 'Fee' },
                        { tag: '{location}', label: 'Location' },
                        { tag: '{mode}', label: 'Mode' },
                        { tag: '{bank_details}', label: '💳 Bank Details' },
                        { tag: '{bank_name}', label: 'Bank Name' },
                        { tag: '{account_no}', label: 'Account No' },
                        { tag: '{branch}', label: 'Branch' },
                      ].map((item) => (
                        <button
                          key={item.tag}
                          type="button"
                          onClick={() => {
                            const activeBank =
                              (selectedBankAccountId
                                ? bankAccounts.find((b) => b.id === selectedBankAccountId)
                                : undefined) ||
                              bankAccounts.find((b) => b.isDefault && b.isActive) ||
                              bankAccounts.find((b) => b.isActive) ||
                              bankAccounts[0];

                            const formattedTag = formatTemplateForLead(item.tag, whatsappModalLead, activeBank);
                            setCustomWhatsappMessage((prev) => prev + ' ' + formattedTag);
                          }}
                          className="px-1.5 py-0.5 rounded bg-[#1c1013] border border-white/10 text-[#dfb56c] hover:border-[#dfb56c] cursor-pointer"
                          title={`Insert ${item.label}`}
                        >
                          +{item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#0d1a10] border border-[#25D366]/30 text-[11px] text-[#b4dfbe] font-sinhala flex items-start gap-2">
                    <span className="text-base shrink-0">💡</span>
                    <span>
                      "Send via WhatsApp Now" හෝ "1-Click Send" ක්ලික් කළ විට එම ශිෂ්‍යයාගේ පුද්ගලික WhatsApp ගිණුමටම (<span className="font-mono text-[#25D366]">wa.me/{getCleanWhatsAppPhone(whatsappModalLead.whatsappNumber)}</span>) පණිවිඩය කෙලින්ම සූදානම්ව විවෘත වේ. තෝරාගත් බැංකු ගිණුම් විස්තර ({'{bank_details}'}) ස්වයංක්‍රීයව එක් වේ.
                    </span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setWhatsappModalLead(null)}
                    className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>

                  <a
                    href={`https://wa.me/${getCleanWhatsAppPhone(whatsappModalLead.whatsappNumber)}?text=${encodeURIComponent(
                      customWhatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setWhatsappModalLead(null);
                      showToast(`WhatsApp message opened for ${whatsappModalLead.fullName}!`);
                    }}
                    className="px-6 py-2.5 bg-[#25D366] text-black text-xs font-bold uppercase rounded cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    <span>Send via WhatsApp Now</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* INDIVIDUAL LEAD FOLLOW-UPS & REMINDERS CRM MODAL          */}
          {/* ========================================================= */}
          {followUpModalLead && (() => {
            const activeLead = campaignLeads.find((l) => l.id === followUpModalLead.id) || followUpModalLead;
            const followUps = activeLead.followUps || [];
            const pendingCount = followUps.filter((f) => f.status === 'PENDING').length;
            const completedCount = followUps.filter((f) => f.status === 'COMPLETED').length;

            return (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <div className="bg-[#0f0a0c] border-2 border-[#dfb56c] rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                  {/* Modal Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1c1013] to-[#120a0d] border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-[#540d18] border border-[#dfb56c] text-[#dfb56c]">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                          Student Follow-ups &amp; Task Reminders CRM
                        </span>
                        <h3 className="text-base sm:text-lg font-editorial font-bold text-white">
                          {activeLead.fullName} • <span className="font-mono text-sm text-[#dfb56c]">{activeLead.whatsappNumber}</span>
                        </h3>
                        <span className="text-[11px] text-[#a89f91] font-sinhala block">
                          එක් එක් ශිෂ්‍යයා සඳහා වෙන වෙනම Follow-up සටහන් කිරීම, සංස්කරණය සහ තත්ත්වය යාවත්කාලීන කිරීම
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFollowUpModalLead(null);
                        setEditingFollowUp(null);
                        setIsAddingFollowUp(false);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Subheader Stats & Actions */}
                  <div className="px-5 py-3 bg-[#140b0e] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded bg-black/60 border border-white/15 text-[#a89f91]">
                        Total Follow-ups: <strong className="text-white">{followUps.length}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300">
                        Pending: <strong>{pendingCount}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300">
                        Completed: <strong>{completedCount}</strong>
                      </span>
                    </div>

                    {!isAddingFollowUp && !editingFollowUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFollowUp(true);
                          setEditingFollowUp(null);
                          setFollowUpTitle('');
                          setFollowUpNotes('');
                          setFollowUpDueDate('');
                        }}
                        className="px-3.5 py-1.5 bg-[#540d18] hover:bg-[#6e1120] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer shadow transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Add New Follow-up / නව පසු විපරමක්</span>
                      </button>
                    )}
                  </div>

                  {/* Modal Body */}
                  <div className="p-5 overflow-y-auto space-y-5 flex-1">
                    {/* Follow-up Creator or Editor Form */}
                    {(isAddingFollowUp || editingFollowUp) && (
                      <div className="p-4 rounded-lg bg-black/80 border-2 border-[#dfb56c] space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                            <Edit className="w-3.5 h-3.5" />
                            <span>{editingFollowUp ? 'Edit Follow-up Record / පසු විපරම සංස්කරණය' : 'New Follow-up Task / නව පසු විපරමක් ඇතුළත් කිරීම'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFollowUp(false);
                              setEditingFollowUp(null);
                            }}
                            className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1.5">
                            ⚡ Quick Templates / ක්ෂණික තේරීම්:
                          </label>
                          <div className="flex flex-wrap gap-1.5 text-xs">
                            {[
                              { title: 'Bank Payment Slip Verification', notes: 'ශිෂ්‍යයා ගාස්තුව ගෙවූ බව පැවසූ බැවින් Commercial Bank ගිණුම පරීක්ෂා කර Slip එක WhatsApp මගින් ලබාගැනීම.' },
                              { title: 'Callback Request Reminder', notes: 'ශිෂ්‍යයා නැවත ඇමතුමක් ලබාදෙන ලෙස ඉල්ලා ඇති බැවින් නියමිත වේලාවට ඇමතුමක් ලබාදීම.' },
                              { title: 'Class Batch Date Confirmation', notes: 'පාඨමාලාව ආරම්භ වන දිනය, වේලාව සහ පැමිණිය යුතු ආකාරය ශිෂ්‍යයාට තහවුරු කිරීම.' },
                              { title: 'Syllabus & Course Outline Send', notes: 'පාඨමාලා විෂය නිර්දේශය (Syllabus PDF) සහ වීඩියෝ ලින්ක් ශිෂ්‍යයාගේ WhatsApp වෙත යැවීම.' },
                              { title: 'Discount Expiry Warning', notes: '50% විශේෂ වට්ටම් දීමනාව අවසන් වීමට පෙර ශිෂ්‍යයා දැනුවත් කර ලියාපදිංචිය තහවුරු කරගැනීම.' },
                            ].map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => {
                                  setFollowUpTitle(preset.title);
                                  setFollowUpNotes(preset.notes);
                                }}
                                className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                              >
                                + {preset.title}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Title and Due Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Follow-up Subject / මාතෘකාව *
                            </label>
                            <input
                              type="text"
                              value={followUpTitle}
                              onChange={(e) => setFollowUpTitle(e.target.value)}
                              placeholder="e.g. Call regarding Commercial Bank slip transfer"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Due Date &amp; Time / ඉලක්කගත දිනය
                            </label>
                            <input
                              type="datetime-local"
                              value={followUpDueDate}
                              onChange={(e) => setFollowUpDueDate(e.target.value)}
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                            Detailed Follow-up Notes / ශිෂ්‍යයා පිළිබඳ සවිස්තරාත්මක සටහන *
                          </label>
                          <textarea
                            rows={3}
                            value={followUpNotes}
                            onChange={(e) => setFollowUpNotes(e.target.value)}
                            placeholder="ශිෂ්‍යයා සමඟ කළ කතාබහ, ඉදිරියේදී කළ යුතු දේ, මුදල් ගෙවීමට එකඟ වූ දිනය හෝ විශේෂ අවශ්‍යතා මෙහි සටහන් කරන්න..."
                            className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-sans focus:border-[#dfb56c] outline-none leading-relaxed"
                          />
                        </div>

                        {/* Priority, Status, Assigned To */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Priority / ප්‍රමුඛතාව
                            </label>
                            <select
                              value={followUpPriority}
                              onChange={(e) => setFollowUpPriority(e.target.value as CampaignFollowUpPriority)}
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                            >
                              <option value="LOW">🟢 Low (සාමාන්‍ය)</option>
                              <option value="NORMAL">🔵 Normal (නියමිත)</option>
                              <option value="HIGH">🟡 High (වැදගත්)</option>
                              <option value="URGENT">🔴 Urgent (ඉතා හදිසි)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Status / තත්ත්වය
                            </label>
                            <select
                              value={followUpStatus}
                              onChange={(e) => setFollowUpStatus(e.target.value as CampaignFollowUpStatus)}
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                            >
                              <option value="PENDING">⏳ Pending (ක්‍රියාත්මක වෙමින් පවතී)</option>
                              <option value="IN_PROGRESS">🔄 In Progress (විමසමින්)</option>
                              <option value="COMPLETED">✅ Completed (අවසන් විය)</option>
                              <option value="CANCELLED">❌ Cancelled (අවලංගු කළා)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Assigned Desk / නිලධාරියා
                            </label>
                            <input
                              type="text"
                              value={followUpAssignedTo}
                              onChange={(e) => setFollowUpAssignedTo(e.target.value)}
                              placeholder="Academic Admissions Desk"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFollowUp(false);
                              setEditingFollowUp(null);
                            }}
                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveFollowUp}
                            className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase rounded cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingFollowUp ? 'Update Follow-up' : 'Save Follow-up Record'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Follow-ups List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5" />
                          <span>Follow-up History ({followUps.length})</span>
                        </span>
                        {followUps.length > 0 && !isAddingFollowUp && !editingFollowUp && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFollowUp(true);
                              setEditingFollowUp(null);
                              setFollowUpTitle('');
                              setFollowUpNotes('');
                              setFollowUpDueDate('');
                            }}
                            className="text-xs text-[#dfb56c] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add another note
                          </button>
                        )}
                      </div>

                      {followUps.length === 0 ? (
                        <div className="p-8 text-center rounded-lg bg-black/40 border border-dashed border-white/10 space-y-2">
                          <ClipboardList className="w-8 h-8 text-[#dfb56c]/50 mx-auto" />
                          <h4 className="text-sm font-bold text-white">No follow-ups recorded yet</h4>
                          <p className="text-xs text-[#a89f91] max-w-sm mx-auto font-sinhala">
                            මෙම ශිෂ්‍යයා සඳහා තවම පසු විපරම් සටහනක් ඇතුළත් කර නැත. ඉහත "Add New Follow-up" බොත්තම ක්ලික් කර නව සටහනක් එක් කරන්න.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFollowUp(true);
                              setEditingFollowUp(null);
                              setFollowUpTitle('');
                              setFollowUpNotes('');
                              setFollowUpDueDate('');
                            }}
                            className="mt-2 px-4 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add First Follow-up</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {followUps.map((fu, fuIdx) => {
                            const isDone = fu.status === 'COMPLETED';
                            const priorityColor =
                              fu.priority === 'URGENT'
                                ? 'bg-red-950/80 border-red-500/70 text-red-300'
                                : fu.priority === 'HIGH'
                                ? 'bg-amber-950/80 border-amber-500/70 text-amber-300'
                                : fu.priority === 'LOW'
                                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                : 'bg-blue-950/80 border-blue-500/70 text-blue-300';

                            return (
                              <div
                                key={fu.id || fuIdx}
                                className={`p-4 rounded-lg border transition-all ${
                                  isDone
                                    ? 'bg-black/40 border-emerald-500/30 opacity-75'
                                    : 'bg-black/80 border-white/15 hover:border-[#dfb56c]/50'
                                } space-y-2.5`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleFollowUpStatus(fu)}
                                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                                        isDone
                                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                          : 'bg-amber-950 border-amber-500 text-amber-300 hover:bg-amber-900'
                                      }`}
                                      title="Click to toggle status"
                                    >
                                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                      <span>{fu.status}</span>
                                    </button>

                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${priorityColor}`}>
                                      {fu.priority} PRIORITY
                                    </span>

                                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                                      {fu.title}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditFollowUp(fu)}
                                      className="px-2.5 py-1 rounded bg-[#540d18] border border-[#dfb56c]/60 text-[#dfb56c] text-[11px] font-mono flex items-center gap-1 cursor-pointer hover:brightness-110"
                                      title="Edit this follow-up"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteFollowUp(fu.id)}
                                      className="p-1 rounded bg-red-950/60 border border-red-500/50 text-red-400 hover:text-red-200 cursor-pointer"
                                      title="Delete follow-up"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-xs text-[#d5cfc4] font-sans leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-[#dfb56c]/40">
                                  {fu.notes}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px] font-mono text-[#a89f91]">
                                  <div className="flex items-center gap-3">
                                    {fu.dueDate && (
                                      <span className="flex items-center gap-1 text-[#dfb56c]">
                                        <Calendar className="w-3 h-3" />
                                        <span>Due: {new Date(fu.dueDate).toLocaleString()}</span>
                                      </span>
                                    )}
                                    {fu.assignedTo && (
                                      <span className="flex items-center gap-1 text-zinc-400">
                                        <Users className="w-3 h-3" />
                                        <span>{fu.assignedTo}</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-zinc-500">
                                    <span>Created: {new Date(fu.createdAt).toLocaleString()}</span>
                                    {fu.completedAt && (
                                      <span className="ml-2 text-emerald-400">
                                        • Completed: {new Date(fu.completedAt).toLocaleTimeString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-[#140b0e] border-t border-white/10 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-mono text-[#a89f91]">
                      Lead Reference ID: <strong className="text-white">{activeLead.id}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFollowUpModalLead(null);
                        setEditingFollowUp(null);
                        setIsAddingFollowUp(false);
                      }}
                      className="px-5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

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
                { id: 'basics', label: '1. Basics & Cover Image' },
                { id: 'about', label: `2. About Course Points (${editingCampaign.aboutPoints?.length || 0})` },
                { id: 'posts', label: `3. Promo Posts (${editingCampaign.postImages?.length || 0})` },
                { id: 'banners', label: `4. Web Banners (${editingCampaign.sectionBanners?.length || 0})` },
                { id: 'videos', label: `5. Videos (${editingCampaign.videos?.length || 0})` },
                { id: 'gallery', label: `6. Gallery (${editingCampaign.galleryImages?.length || 0})` },
                { id: 'certificate', label: '7. Certificate Showcase' },
                { id: 'pdf', label: '8. PDF Brochure' },
                { id: 'reviews', label: `9. Student Reviews (${editingCampaign.studentReviews?.length || 0})` },
                { id: 'pricing', label: '10. Pricing & Urgency' },
                { id: 'form', label: '11. Form & Date Lines Customizer' },
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

                  {/* Campaign Traffic & Visits Analytics / Baseline Customizer */}
                  <div className="p-4 rounded-lg bg-black/60 border border-emerald-500/40 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono uppercase text-emerald-300 font-bold">
                          Campaign Traffic &amp; Visit Counter / පැමිණි සිසුන් ගණන
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded font-bold">
                        ● Live Tracking Active
                      </span>
                    </div>

                    <p className="text-xs text-[#a89f91] font-sinhala leading-relaxed">
                      Facebook / Instagram Ads හරහා මෙම Campaign Page වෙත පැමිණෙන ශිෂ්‍ය පිවිසුම් (Traffic / Visits) මෙහි ස්වයංක්‍රීයව ගණනය වේ. ශිෂ්‍ය පෝරමයේ Social Proof ලෙස පෙන්වීමට අවශ්‍ය නම් ආරම්භක Baseline Visits ගණන මෙහි සකසා Save කළ හැක.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 rounded bg-[#140b0e] border border-white/10 space-y-1">
                        <label className="text-[10px] text-[#a89f91] uppercase block font-bold">
                          Total Page Visits / මුළු පිවිසුම්
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editingCampaign.viewsCount ?? 0}
                          onChange={(e) =>
                            setEditingCampaign({
                              ...editingCampaign,
                              viewsCount: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-full px-3 py-1.5 bg-black border border-emerald-500/50 rounded text-sm text-emerald-300 font-bold focus:border-emerald-400 outline-none font-mono"
                        />
                      </div>

                      <div className="p-3 rounded bg-[#140b0e] border border-white/10 space-y-1">
                        <label className="text-[10px] text-[#a89f91] uppercase block font-bold">
                          Leads Captured / ලියාපදිංචි වූ සිසුන්
                        </label>
                        <div className="px-3 py-2 bg-black/60 border border-white/10 rounded text-sm font-bold text-white">
                          {editingCampaign.leadsCount ?? campaignLeads.filter(l => l.campaignSlug === editingCampaign.slug || l.campaignId === editingCampaign.id).length}
                        </div>
                      </div>

                      <div className="p-3 rounded bg-[#140b0e] border border-white/10 space-y-1">
                        <label className="text-[10px] text-[#a89f91] uppercase block font-bold">
                          Conversion Rate / සාර්ථකත්ව ප්‍රතිශතය
                        </label>
                        <div className="px-3 py-2 bg-black/60 border border-white/10 rounded text-sm font-bold text-[#dfb56c]">
                          {(((editingCampaign.leadsCount ?? campaignLeads.filter(l => l.campaignSlug === editingCampaign.slug || l.campaignId === editingCampaign.id).length) / Math.max(1, editingCampaign.viewsCount || 1)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cover Page Hero Image Customizer */}
                  <div className="p-4 rounded-lg bg-black/60 border border-[#dfb56c]/40 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#dfb56c]" />
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                          Cover Page Hero Image / ප්‍රධාන කවර ඡායාරූපය
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a89f91]">Banner &amp; Form Header</span>
                    </div>

                    <p className="text-xs text-[#a89f91] font-sinhala leading-relaxed">
                      ශිෂ්‍යයාට Landing Page එකෙහි ඉහළින්ම ආකර්ෂණීය ලෙස පෙනෙන ප්‍රධාන කවර ඡායාරූපය (Cover Image) මෙහි යොදන්න. ඔබට පරිගණකයෙන් හෝ දුරකථනයෙන් සෘජුවම Image Upload කළ හැක, නැතහොත් Image Link (URL) එකක් ලබාදිය හැක.
                    </p>

                    {/* Method 1: Direct File Upload from Device */}
                    <div className="p-3.5 rounded-lg bg-[#140b0e] border border-dashed border-[#dfb56c]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>Option 1: Upload Image File (Local Device / Phone / PC)</span>
                        </span>
                        {isUploadingCoverImage && (
                          <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing &amp; Setting...
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2.5 rounded bg-gradient-to-r from-[#540d18] to-[#3a0910] hover:from-[#6b111f] hover:to-[#4d0c15] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow hover:scale-[1.02]">
                          <Upload className="w-4 h-4 text-[#dfb56c]" />
                          <span>Upload Local Image File / ඡායාරූපයක් තෝරන්න</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageFileChange}
                            disabled={isUploadingCoverImage}
                            className="hidden"
                          />
                        </label>

                        <span className="text-[11px] text-[#a89f91] font-sinhala text-center sm:text-left">
                          PNG, JPG, WEBP formats (ස්වයංක්‍රීයව ප්‍රශස්ත කර (Optimized) Save වේ)
                        </span>
                      </div>
                    </div>

                    {/* Method 2: Direct Image URL */}
                    <div>
                      <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                        Option 2: Cover Image URL (Direct Web Link / Unsplash)
                      </label>
                      <input
                        type="url"
                        value={editingCampaign.coverImageUrl || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, coverImageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/... or paste image URL"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    {/* Quick Presets for Cover Image */}
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-[#a89f91] mb-1.5">
                        ⚡ Quick Luxury Atelier Presets / උසස් තත්ත්වයේ ආකෘති:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { name: '👗 Haute Couture Studio', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80' },
                          { name: '✂️ Pattern Drafting Table', url: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=1200&q=80' },
                          { name: '🧵 Sewing Machines Atelier', url: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1200&q=80' },
                          { name: '📏 Tailoring & Luxury Fabrics', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80' },
                          { name: '👠 Runway Fashion Collection', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setEditingCampaign({ ...editingCampaign, coverImageUrl: preset.url });
                              showToast(`Applied preset: ${preset.name}`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview if coverImageUrl exists */}
                    {editingCampaign.coverImageUrl ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Active Cover Image Set (Click "Save Campaign" below to save)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCampaign({ ...editingCampaign, coverImageUrl: '' });
                              showToast('Cover Image removed.');
                            }}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Cover Image
                          </button>
                        </div>

                        <div className="relative rounded-lg overflow-hidden border-2 border-[#dfb56c] h-44 bg-black shadow-xl">
                          <img
                            src={editingCampaign.coverImageUrl}
                            alt="Cover Banner Preview"
                            className="w-full h-full object-cover filter brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                            <span className="text-xs font-mono text-[#dfb56c] bg-black/80 px-2.5 py-1 rounded border border-[#dfb56c]/40 font-bold shadow">
                              Cover Page Hero Image Active Preview
                            </span>
                            <span className="text-[10px] font-mono text-zinc-300 bg-black/70 px-2 py-0.5 rounded">
                              {editingCampaign.coverImageUrl.startsWith('data:') ? 'Local Upload (Base64)' : 'External URL'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded border border-dashed border-white/10 text-center text-xs text-zinc-500 font-mono">
                        No cover image set yet. Upload an image file or choose a preset above.
                      </div>
                    )}
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

                  {/* Dynamic Course Points & Highlights with Symbols Builder */}
                  <div className="space-y-4 pt-3 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                          <span>Course Highlights &amp; Points with Symbols / ලස්සන සංකේත සහිත කරුණු</span>
                        </h4>
                        <p className="text-[11px] text-[#a89f91] font-sinhala">
                          දීර්ඝ ඡේද වෙනුවට සිත් ඇදගන්නාසුළු Symbols (✂️, 👗, 💎, 🏆, ✨ ආදී) සහිතව පාඨමාලාවේ ප්‍රධාන කරුණු මෙහි ලැයිස්තුගත කරන්න.
                        </p>
                      </div>

                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] self-start sm:self-auto">
                        Total Points: {(editingCampaign.aboutPoints || []).length}
                      </span>
                    </div>

                    {/* Point Creator Form */}
                    <div className="p-3.5 rounded-lg bg-black/70 border border-[#dfb56c]/40 space-y-3 shadow-md">
                      <div>
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1.5 font-bold">
                          1. Choose Symbol / සංකේතය තෝරන්න:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['✨', '✂️', '👗', '💎', '🏆', '⭐', '🧵', '🎓', '📐', '🪡', '✅', '💡', '🏷️', '🎯', '🔥', '👑'].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setPointSymbol(sym)}
                              className={`w-8 h-8 rounded text-base flex items-center justify-center transition-all cursor-pointer ${
                                pointSymbol === sym
                                  ? 'bg-[#dfb56c] text-black ring-2 ring-white scale-110 shadow-lg'
                                  : 'bg-[#140b0e] hover:bg-white/10 border border-white/10'
                              }`}
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Point texts in English & Sinhala */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-[#dfb56c] mb-1 font-bold">
                            Point Text (English) *
                          </label>
                          <input
                            type="text"
                            value={pointText}
                            onChange={(e) => setPointText(e.target.value)}
                            placeholder="e.g. Standard Pattern Drafting & Grading from Scratch"
                            className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#dfb56c] mb-1 font-bold">
                            Point Text (Sinhala / සිංහල)
                          </label>
                          <input
                            type="text"
                            value={pointTextSinhala}
                            onChange={(e) => setPointTextSinhala(e.target.value)}
                            placeholder="උදා: මුලසිටම ප්‍රමිතිගත පැටර්න් නිර්මාණය සහ ග්‍රේඩින් පුහුණුව"
                            className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                          />
                        </div>
                      </div>

                      {/* Badge and Add button */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={pointBadge}
                            onChange={(e) => setPointBadge(e.target.value)}
                            placeholder="Optional Tag (e.g. 100% Practical, NVQ Aligned, Zero Experience OK)"
                            className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-zinc-300 font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {editingAboutPointId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAboutPointId(null);
                                setPointText('');
                                setPointTextSinhala('');
                                setPointBadge('');
                                setPointSymbol('✨');
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded cursor-pointer transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (!pointText.trim() && !pointTextSinhala.trim()) {
                                showToast('Please enter point text!');
                                return;
                              }
                              const current = editingCampaign.aboutPoints || [];
                              if (editingAboutPointId) {
                                const updated = current.map((p) =>
                                  p.id === editingAboutPointId
                                    ? {
                                        ...p,
                                        symbol: pointSymbol || '✨',
                                        text: pointText.trim() || pointTextSinhala.trim(),
                                        textSinhala: pointTextSinhala.trim() || undefined,
                                        badge: pointBadge.trim() || undefined,
                                      }
                                    : p
                                );
                                setEditingCampaign({
                                  ...editingCampaign,
                                  aboutPoints: updated,
                                });
                                setEditingAboutPointId(null);
                                showToast('Course point updated successfully!');
                              } else {
                                const newPoint: CampaignCoursePoint = {
                                  id: `pt-${Date.now()}`,
                                  symbol: pointSymbol || '✨',
                                  text: pointText.trim() || pointTextSinhala.trim(),
                                  textSinhala: pointTextSinhala.trim() || undefined,
                                  badge: pointBadge.trim() || undefined,
                                };
                                setEditingCampaign({
                                  ...editingCampaign,
                                  aboutPoints: [...current, newPoint],
                                });
                                showToast('Course point added with symbol!');
                              }
                              setPointText('');
                              setPointTextSinhala('');
                              setPointBadge('');
                            }}
                            className="px-4 py-1.5 bg-[#540d18] hover:bg-[#6e1322] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all shrink-0"
                          >
                            {editingAboutPointId ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                                <span>Update Course Point (කරුණ සුරකින්න)</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-[#dfb56c]" />
                                <span>Add Point with Symbol (+ කරුණක් එක් කරන්න)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quick Presets for Fashion Academy */}
                      <div className="pt-2 border-t border-white/5">
                        <span className="block text-[10px] font-mono text-[#a89f91] mb-1">
                          ⚡ Instant Presets / ක්ෂණික කරුණු ආකෘති:
                        </span>
                        <div className="flex flex-wrap gap-1 text-xs">
                          {[
                            { sym: '✂️', en: 'Standard Pattern Drafting & Grading from Scratch', si: 'මුලසිටම ප්‍රමිතිගත පැටර්න් නිර්මාණය සහ ග්‍රේඩින් පුහුණුව', tag: '100% Practical' },
                            { sym: '👗', en: 'Haute Couture & Wedding Dress Construction', si: 'උසස් මංගල සහ උත්සව ඇඳුම් නිම කිරීමේ තාක්ෂණය', tag: 'Couture Finish' },
                            { sym: '🧵', en: 'Industrial High-speed Sewing Machine Training', si: 'කාර්මික අධිවේගී මැහුම් යන්ත්‍ර ප්‍රායෝගික පුහුණුව', tag: 'Hands-on Atelier' },
                            { sym: '🎓', en: 'TVEC / NVQ Government Aligned Recognized Certificate', si: 'රජයේ පිළිගත් නිල ඩිප්ලෝමා සහතිකය හිමිවේ', tag: 'NVQ Aligned' },
                            { sym: '💎', en: 'Clothing Boutique & Brand Startup Mentorship', si: 'ස්වයං ඇඳුම් ව්‍යාපාරයක් සාර්ථකව ආරම්භ කිරීමේ මඟපෙන්වීම', tag: 'Business Mentorship' },
                            { sym: '📐', en: '100% Guaranteed Practical Individual Hands-on Attention', si: 'සෑම සිසුවෙකුටම තනි තනිව ප්‍රායෝගික අවධානය', tag: 'Individual Focus' },
                          ].map((pre, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => {
                                const current = editingCampaign.aboutPoints || [];
                                const newPoint: CampaignCoursePoint = {
                                  id: `pt-${Date.now()}-${pIdx}`,
                                  symbol: pre.sym,
                                  text: pre.en,
                                  textSinhala: pre.si,
                                  badge: pre.tag,
                                };
                                setEditingCampaign({
                                  ...editingCampaign,
                                  aboutPoints: [...current, newPoint],
                                });
                                showToast(`Added: ${pre.en}`);
                              }}
                              className="px-2 py-0.5 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[10px] font-mono cursor-pointer transition-all"
                            >
                              + {pre.sym} {pre.en.split(' ')[0]} {pre.en.split(' ')[1]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Existing Points Display */}
                    <div className="space-y-2 pt-1">
                      {(!editingCampaign.aboutPoints || editingCampaign.aboutPoints.length === 0) ? (
                        <div className="p-4 text-center rounded bg-black/40 border border-dashed border-white/10 text-xs text-[#a89f91] font-sinhala">
                          තවම Symbols සහිත කරුණු එක් කර නැත. ඉහත "Add Point with Symbol" හෝ Quick Presets භාවිතයෙන් කරුණු එක් කරන්න.
                        </div>
                      ) : (
                        editingCampaign.aboutPoints.map((pt, ptIdx) => (
                          <div
                            key={pt.id || ptIdx}
                            className={`p-3 rounded-lg bg-black/70 border flex items-start justify-between gap-3 transition-all shadow-sm ${
                              editingAboutPointId === pt.id ? 'border-[#dfb56c] ring-1 ring-[#dfb56c]/50' : 'border-white/15 hover:border-[#dfb56c]/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-9 h-9 rounded-lg bg-[#540d18] border border-[#dfb56c] flex items-center justify-center text-lg shrink-0 shadow">
                                {pt.symbol || '✨'}
                              </span>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-white leading-snug">{pt.text}</span>
                                  {pt.badge && (
                                    <span className="px-2 py-0.2 rounded bg-[#38070e] text-[#dfb56c] border border-[#dfb56c]/30 text-[10px] font-mono font-bold">
                                      {pt.badge}
                                    </span>
                                  )}
                                  {editingAboutPointId === pt.id && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono">
                                      Editing Now...
                                    </span>
                                  )}
                                </div>
                                {pt.textSinhala && (
                                  <p className="text-xs text-[#d5cfc4] font-sinhala leading-snug">
                                    {pt.textSinhala}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAboutPointId(pt.id);
                                  setPointSymbol(pt.symbol || '✨');
                                  setPointText(pt.text || '');
                                  setPointTextSinhala(pt.textSinhala || '');
                                  setPointBadge(pt.badge || '');
                                  showToast('Editing point. Update details above and click "Update Course Point".');
                                }}
                                className="p-1 rounded text-[#dfb56c] hover:text-[#f7e2a9] hover:bg-white/10 cursor-pointer"
                                title="Edit point"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingCampaign.aboutPoints || []).filter((_, i) => i !== ptIdx);
                                  setEditingCampaign({ ...editingCampaign, aboutPoints: updated });
                                  if (editingAboutPointId === pt.id) {
                                    setEditingAboutPointId(null);
                                  }
                                  showToast('Point removed');
                                }}
                                className="p-1 rounded text-red-400 hover:text-red-200 hover:bg-red-950/60 cursor-pointer"
                                title="Delete point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Highlights Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold">
                        Additional Bullet Points (Optional)
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

              {/* TAB 3: PROMOTIONAL POST IMAGES */}
              {campaignEditorTab === 'posts' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#dfb56c]" />
                        <span>Promotional Post Images &amp; Ad Creatives (ෆේස්බුක් දැන්වීම් / පෝස්ට් ඡායාරූප)</span>
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala mt-0.5">
                        Landing Page එකෙහි පෙන්වන ප්‍රවර්ධන දැන්වීම් පෝස්ට් (Facebook Ad Creative Flyers) මෙහි එක් කරන්න. මේවා 100% පැහැදිලිව (Crystal Clear - කිසිදු අඳුරු Filter එකක් නොමැතිව) සහ HD Zoom Lightbox සහිතව පෙන්වයි.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1c1013] border border-[#dfb56c]/40 text-[#dfb56c] font-bold shrink-0">
                      Total Posts: {editingCampaign.postImages?.length || 0}
                    </span>
                  </div>

                  {/* Add New Post Image Box */}
                  <div className="p-4 rounded-xl bg-black/60 border border-[#dfb56c]/40 space-y-4 shadow-lg">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Add New Promotional Post Image / නව දැන්වීම් පෝස්ට් එකක් එක් කරන්න</span>
                    </span>

                    {/* Method 1: Local Device Upload */}
                    <div className="p-3.5 rounded-lg bg-[#140b0e] border border-dashed border-[#dfb56c]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>Option 1: Upload Post Image File (Local Device / Phone / PC)</span>
                        </span>
                        {isUploadingPostImage && (
                          <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing Image...
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-r from-[#540d18] to-[#3a0910] hover:from-[#6b111f] hover:to-[#4d0c15] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow hover:scale-[1.02]">
                          <Upload className="w-4 h-4 text-[#dfb56c]" />
                          <span>Choose Post Image File / ඡායාරූපය තෝරන්න</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePostImageFileChange}
                            disabled={isUploadingPostImage}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-[#a89f91] font-sinhala text-center sm:text-left">
                          PNG, JPG, WEBP (HD Quality, 100% පැහැදිලිව සුරැකේ)
                        </span>
                      </div>
                    </div>

                    {/* Method 2: Direct URL */}
                    <div>
                      <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                        Option 2: Direct Image URL / වෙබ් ලින්ක් මගින්
                      </label>
                      <input
                        type="url"
                        value={postImageUrl}
                        onChange={(e) => setPostImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or paste image URL"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-[#a89f91] mb-1.5">
                        ⚡ Quick Creative Flyer Presets / උසස් ආකෘති:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { name: '👗 Haute Couture Studio', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', badge: '🔥 LIMITED SEATS' },
                          { name: '✂️ Pattern Drafting Table', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', badge: 'BATCH ENROLLMENT' },
                          { name: '🧵 Tailoring Masterclass', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80', badge: 'POPULAR' },
                          { name: '🎓 Diploma Runway & Convocation', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80', badge: 'TVEC RECOGNIZED' },
                          { name: '🎨 Fashion Illustration', url: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=1200&q=80', badge: 'CREATIVE ATELIER' },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setPostImageUrl(preset.url);
                              setPostBadge(preset.badge);
                              showToast(`Applied preset: ${preset.name}`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metadata: Title & Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Badge / Tag Label
                        </label>
                        <input
                          type="text"
                          value={postBadge}
                          onChange={(e) => setPostBadge(e.target.value)}
                          placeholder="e.g. 🔥 NEW BATCH / SPECIAL OFFER"
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Post Title (English)
                        </label>
                        <input
                          type="text"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          placeholder="e.g. Weekend Intensive Masterclass"
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Post Title (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={postTitleSinhala}
                          onChange={(e) => setPostTitleSinhala(e.target.value)}
                          placeholder="e.g. සති අන්ත ප්‍රායෝගික වැඩමුළුව"
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                        />
                      </div>
                    </div>

                    {/* Metadata: Captions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Caption (English)
                        </label>
                        <input
                          type="text"
                          value={postCaption}
                          onChange={(e) => setPostCaption(e.target.value)}
                          placeholder="e.g. Direct hands-on couture draping & garment construction"
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Caption (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={postCaptionSinhala}
                          onChange={(e) => setPostCaptionSinhala(e.target.value)}
                          placeholder="e.g. ප්‍රවීණ දේශකයන් යටතේ ප්‍රායෝගික මෝස්තර නිර්මාණ පුහුණුව"
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                        />
                      </div>
                    </div>

                    {/* Image Preview if URL/Upload set */}
                    {postImageUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-[#dfb56c]/50 h-36 bg-black flex items-center justify-center">
                        <img
                          src={postImageUrl}
                          alt="Post Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[11px] font-mono text-[#dfb56c] font-bold">
                            Preview: {postTitle || 'Untitled Post'} ({postBadge})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!postImageUrl.trim()) {
                          showToast('Please select or upload a post image first!');
                          return;
                        }
                        const current = editingCampaign.postImages || [];
                        const newPost: CampaignPostImage = {
                          id: `post-${Date.now()}-${current.length + 1}`,
                          imageUrl: postImageUrl.trim(),
                          title: postTitle.trim() || undefined,
                          titleSinhala: postTitleSinhala.trim() || undefined,
                          caption: postCaption.trim() || undefined,
                          captionSinhala: postCaptionSinhala.trim() || undefined,
                          badge: postBadge.trim() || undefined,
                          order: current.length + 1,
                        };
                        setEditingCampaign({
                          ...editingCampaign,
                          postImages: [...current, newPost],
                        });
                        setPostImageUrl('');
                        setPostTitle('');
                        setPostTitleSinhala('');
                        setPostCaption('');
                        setPostCaptionSinhala('');
                        showToast('Promotional post image added to campaign! Click "Save Campaign" below to save.');
                      }}
                      className="w-full py-2.5 rounded bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      {editingPostImageId ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Update Promotional Post / පෝස්ට් එක යාවත්කාලීන කරන්න</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Promotional Post Image / පෝස්ට් එකතු කරන්න</span>
                        </>
                      )}
                    </button>
                    {editingPostImageId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostImageId(null);
                          setPostImageUrl('');
                          setPostTitle('');
                          setPostTitleSinhala('');
                          setPostCaption('');
                          setPostCaptionSinhala('');
                          setPostBadge('🔥 New Workshop');
                        }}
                        className="w-full py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs cursor-pointer transition-all text-center"
                      >
                        Cancel Post Edit
                      </button>
                    )}
                  </div>

                  {/* Existing Post Images List */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center justify-between">
                      <span>Current Promotional Post Images ({editingCampaign.postImages?.length || 0})</span>
                      <span className="text-[10px] text-zinc-400 font-normal">Displayed on landing page in full clear HD</span>
                    </h5>

                    {(!editingCampaign.postImages || editingCampaign.postImages.length === 0) ? (
                      <div className="p-6 rounded-lg border border-dashed border-white/10 text-center text-xs text-zinc-500 font-mono">
                        No promotional post images added yet. Upload an image above or use a preset to add ad creatives.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {editingCampaign.postImages.map((post, pIdx) => (
                          <div
                            key={post.id || pIdx}
                            className={`p-3 rounded-lg bg-black/70 border flex flex-col justify-between gap-2.5 transition-all shadow-sm ${
                              editingPostImageId === post.id ? 'border-[#dfb56c] ring-1 ring-[#dfb56c]/50' : 'border-white/15 hover:border-[#dfb56c]/50'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="relative rounded overflow-hidden h-36 bg-zinc-900 border border-white/10">
                                <img
                                  src={post.imageUrl}
                                  alt={post.title || `Post ${pIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {post.badge && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[#dfb56c] border border-[#dfb56c]/40 text-[10px] font-mono font-bold">
                                    {post.badge}
                                  </span>
                                )}
                                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                                  #{pIdx + 1}
                                </span>
                                {editingPostImageId === post.id && (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-mono font-bold shadow">
                                    Editing
                                  </span>
                                )}
                              </div>

                              <div>
                                {post.title && (
                                  <div className="text-xs font-bold text-white leading-tight">
                                    {post.title}
                                  </div>
                                )}
                                {post.titleSinhala && (
                                  <div className="text-xs text-[#dfb56c] font-sinhala leading-tight">
                                    {post.titleSinhala}
                                  </div>
                                )}
                                {post.caption && (
                                  <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2">
                                    {post.caption}
                                  </p>
                                )}
                                {post.captionSinhala && (
                                  <p className="text-[11px] text-zinc-400 font-sinhala line-clamp-2">
                                    {post.captionSinhala}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-1">
                                {pIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const posts = [...(editingCampaign.postImages || [])];
                                      const temp = posts[pIdx - 1];
                                      posts[pIdx - 1] = posts[pIdx];
                                      posts[pIdx] = temp;
                                      setEditingCampaign({ ...editingCampaign, postImages: posts });
                                    }}
                                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {pIdx < (editingCampaign.postImages?.length || 0) - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const posts = [...(editingCampaign.postImages || [])];
                                      const temp = posts[pIdx + 1];
                                      posts[pIdx + 1] = posts[pIdx];
                                      posts[pIdx] = temp;
                                      setEditingCampaign({ ...editingCampaign, postImages: posts });
                                    }}
                                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPostImageId(post.id);
                                    setPostImageUrl(post.imageUrl);
                                    setPostTitle(post.title || '');
                                    setPostTitleSinhala(post.titleSinhala || '');
                                    setPostCaption(post.caption || '');
                                    setPostCaptionSinhala(post.captionSinhala || '');
                                    setPostBadge(post.badge || '🔥 New Workshop');
                                    showToast('Editing post. Update details above and click "Update Promotional Post".');
                                  }}
                                  className="px-2 py-1 rounded bg-[#38070e] hover:bg-[#540d18] text-[#dfb56c] border border-[#dfb56c]/30 flex items-center gap-1 cursor-pointer"
                                  title="Edit promotional post"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (editingCampaign.postImages || []).filter((_, i) => i !== pIdx);
                                    setEditingCampaign({ ...editingCampaign, postImages: updated });
                                    if (editingPostImageId === post.id) {
                                      setEditingPostImageId(null);
                                    }
                                    showToast('Promotional post removed');
                                  }}
                                  className="px-2 py-1 rounded text-red-400 hover:text-red-200 hover:bg-red-950/60 flex items-center gap-1 cursor-pointer"
                                  title="Delete post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: INTER-SECTION WEB BANNERS */}
              {campaignEditorTab === 'banners' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#dfb56c]" />
                        <span>Inter-Section Web Banners (අන්තර්-කොටස් වෙබ් බැනර්)</span>
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala mt-0.5">
                        Landing Page එකෙහි එක් එක් කොටස් අතර (Section to Section) ආකර්ෂණීය වෙබ් බැනර් ඇතුළත් කරන්න. විශේෂ වට්ටම්, ප්‍රසාද දීමනා හෝ වැදගත් නිවේදන ශිෂ්‍යයාට නිරන්තරයෙන් අවධානය යොමු කරවයි.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1c1013] border border-[#dfb56c]/40 text-[#dfb56c] font-bold shrink-0">
                      Total Banners: {editingCampaign.sectionBanners?.length || 0}
                    </span>
                  </div>

                  {/* Add New Section Banner Box */}
                  <div className="p-4 rounded-xl bg-black/60 border border-[#dfb56c]/40 space-y-4 shadow-lg">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Configure &amp; Add Inter-Section Banner / නව වෙබ් බැනරයක් එක් කරන්න</span>
                    </span>

                    {/* Position & Banner Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Banner Placement Position / ස්ථානය තෝරන්න *
                        </label>
                        <select
                          value={bannerPosition}
                          onChange={(e) => setBannerPosition(e.target.value as CampaignBannerPosition)}
                          className="w-full px-3 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                        >
                          <option value="after_hero">1. Directly Below Urgency Bar &amp; Above Form (ප්‍රධාන Form එකට ඉහළින්)</option>
                          <option value="after_form">2. Directly Below Lead Registration Form (Form එකට පහළින්)</option>
                          <option value="after_about">3. Below Course Points &amp; Description (විෂය කරුණු වලට පහළින්)</option>
                          <option value="after_posts">4. Below Promotional Post Creatives (Promo Posts වලට පහළින්)</option>
                          <option value="after_gallery">5. Below Student Creations Gallery (Gallery එකට පහළින්)</option>
                          <option value="after_certificate">6. Below Diploma Certificate Showcase (සහතිකයට පහළින්)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Banner Format Type / බැනර් ආකෘතිය *
                        </label>
                        <select
                          value={bannerType}
                          onChange={(e) => setBannerType(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                        >
                          <option value="graphic">Graphic Announcement Banner (රන්වන් මාතෘකා, උපශීර්ෂ හා CTA බොත්තම සහිත)</option>
                          <option value="image">Full-width Photo/Creative Web Banner (සම්පූර්ණ පලල ඡායාරූප බැනරය)</option>
                        </select>
                      </div>
                    </div>

                    {bannerType === 'graphic' ? (
                      <div className="space-y-3 p-3.5 rounded-lg bg-[#140b0e] border border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Badge Tag
                            </label>
                            <input
                              type="text"
                              value={bannerBadge}
                              onChange={(e) => setBannerBadge(e.target.value)}
                              placeholder="e.g. 💎 EXCLUSIVE BONUS / LIMITED OFFER"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              CTA Button Text (English)
                            </label>
                            <input
                              type="text"
                              value={bannerButtonText}
                              onChange={(e) => setBannerButtonText(e.target.value)}
                              placeholder="e.g. Claim Discount Now"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              CTA Button Text (Sinhala)
                            </label>
                            <input
                              type="text"
                              value={bannerButtonTextSinhala}
                              onChange={(e) => setBannerButtonTextSinhala(e.target.value)}
                              placeholder="e.g. දැන්ම ලියාපදිංචි වන්න"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Banner Headline (English) *
                            </label>
                            <input
                              type="text"
                              value={bannerTitle}
                              onChange={(e) => setBannerTitle(e.target.value)}
                              placeholder="e.g. Enroll This Week & Get Rs. 7,500 Discount!"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Banner Headline (Sinhala)
                            </label>
                            <input
                              type="text"
                              value={bannerTitleSinhala}
                              onChange={(e) => setBannerTitleSinhala(e.target.value)}
                              placeholder="e.g. මෙම සතියේ ලියාපදිංචි වන සිසුන්ට රු. 7,500 ක සුවිශේෂී වට්ටමක්!"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Subtitle Description (English)
                            </label>
                            <input
                              type="text"
                              value={bannerSubtitle}
                              onChange={(e) => setBannerSubtitle(e.target.value)}
                              placeholder="e.g. Includes Free Professional Pattern Kit & Lifetime Atelier Support"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Subtitle Description (Sinhala)
                            </label>
                            <input
                              type="text"
                              value={bannerSubtitleSinhala}
                              onChange={(e) => setBannerSubtitleSinhala(e.target.value)}
                              placeholder="e.g. නොමිලේ Pattern Drafting Kit එක සහ ජීවිත කාලයටම උපදෙස් සහය"
                              className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                            />
                          </div>
                        </div>

                        {/* Background Themes */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                            Banner Color Gradient Theme
                          </label>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {[
                              { label: '🍷 Ruby Atelier Burgundy', val: 'from-[#3a0910] via-[#1a080d] to-[#0d0507]' },
                              { label: '🏆 Golden Amber Royalty', val: 'from-[#38260b] via-[#1d1204] to-[#0c0802]' },
                              { label: '🌿 Emerald Distinction', val: 'from-[#092b18] via-[#04170d] to-[#020d07]' },
                              { label: '💎 Sapphire Midnight', val: 'from-[#0a1e38] via-[#050f1c] to-[#02070e]' },
                            ].map((thm, tIdx) => (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => setBannerBgColor(thm.val)}
                                className={`px-3 py-1.5 rounded border text-xs font-mono cursor-pointer transition-all ${
                                  bannerBgColor === thm.val
                                    ? 'border-[#dfb56c] text-[#dfb56c] bg-[#2a1017]'
                                    : 'border-white/10 text-zinc-400 hover:text-white bg-black/40'
                                }`}
                              >
                                {thm.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Image Banner Fields */
                      <div className="space-y-3 p-3.5 rounded-lg bg-[#140b0e] border border-white/10">
                        <div className="p-3 rounded-lg border border-dashed border-[#dfb56c]/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-[#dfb56c]" />
                              <span>Upload Banner Image File (PC / Phone)</span>
                            </span>
                            {isUploadingBannerImage && (
                              <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Processing Banner...
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-r from-[#540d18] to-[#3a0910] hover:from-[#6b111f] hover:to-[#4d0c15] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow hover:scale-[1.02]">
                              <Upload className="w-4 h-4 text-[#dfb56c]" />
                              <span>Choose Banner Graphic File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerImageFileChange}
                                disabled={isUploadingBannerImage}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[11px] text-[#a89f91] font-sinhala">
                              Landscape/wide format නිර්දේශිතයි (16:4 හෝ 16:5 අනුපාතය)
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                            Or Paste Banner Image URL
                          </label>
                          <input
                            type="url"
                            value={bannerImageUrl}
                            onChange={(e) => setBannerImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/... or paste image URL"
                            className="w-full px-3 py-2 bg-black border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                          />
                        </div>

                        {/* Banner Image Preview */}
                        {bannerImageUrl && (
                          <div className="relative rounded overflow-hidden h-28 bg-black border border-[#dfb56c]/40">
                            <img
                              src={bannerImageUrl}
                              alt="Banner Graphic Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-mono text-[#dfb56c] font-bold">
                              Preview: Full-width Banner Graphic
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add / Update Banner Button */}
                    <div className="flex items-center gap-2">
                      {editingBannerId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBannerId(null);
                            setBannerImageUrl('');
                            setBannerTitle('Get Rs. 7,500 Off When You Enroll This Week!');
                            setBannerTitleSinhala('මෙම සතියේ ලියාපදිංචි වන සිසුන්ට රු. 7,500 ක සුවිශේෂී වට්ටමක්!');
                            setBannerSubtitle('Includes Free Pattern Drafting Kit & Lifetime Atelier Support');
                            setBannerSubtitleSinhala('නොමිලේ Pattern Drafting Kit එක සහ ජීවිත කාලයටම උපදෙස් සහය');
                            setBannerBadge('💎 EXCLUSIVE BONUS');
                            setBannerButtonText('Claim Discount Now');
                            setBannerButtonTextSinhala('දැන්ම ලියාපදිංචි වන්න');
                          }}
                          className="px-4 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (bannerType === 'image' && !bannerImageUrl.trim()) {
                            showToast('Please upload or enter a banner image URL!');
                            return;
                          }
                          if (bannerType === 'graphic' && !bannerTitle.trim()) {
                            showToast('Please enter a banner headline!');
                            return;
                          }

                          const current = editingCampaign.sectionBanners || [];
                          if (editingBannerId) {
                            const updated = current.map((bn) =>
                              bn.id === editingBannerId
                                ? {
                                    ...bn,
                                    position: bannerPosition,
                                    bannerType: bannerType,
                                    imageUrl: bannerType === 'image' ? bannerImageUrl.trim() : undefined,
                                    title: bannerType === 'graphic' ? bannerTitle.trim() : undefined,
                                    titleSinhala: bannerType === 'graphic' ? bannerTitleSinhala.trim() || undefined : undefined,
                                    subtitle: bannerType === 'graphic' ? bannerSubtitle.trim() || undefined : undefined,
                                    subtitleSinhala: bannerType === 'graphic' ? bannerSubtitleSinhala.trim() || undefined : undefined,
                                    badge: bannerType === 'graphic' ? bannerBadge.trim() || undefined : undefined,
                                    buttonText: bannerButtonText.trim() || 'Claim Offer Now',
                                    buttonTextSinhala: bannerButtonTextSinhala.trim() || 'දැන්ම ලියාපදිංචි වන්න',
                                    buttonLink: bannerButtonLink.trim() || '#register-form',
                                    bgColor: bannerBgColor,
                                  }
                                : bn
                            );
                            setEditingCampaign({
                              ...editingCampaign,
                              sectionBanners: updated,
                            });
                            setEditingBannerId(null);
                            showToast(`Web banner updated! Click "Save Campaign" below to save.`);
                          } else {
                            const newBanner: CampaignSectionBanner = {
                              id: `banner-${Date.now()}-${current.length + 1}`,
                              position: bannerPosition,
                              bannerType: bannerType,
                              imageUrl: bannerType === 'image' ? bannerImageUrl.trim() : undefined,
                              title: bannerType === 'graphic' ? bannerTitle.trim() : undefined,
                              titleSinhala: bannerType === 'graphic' ? bannerTitleSinhala.trim() || undefined : undefined,
                              subtitle: bannerType === 'graphic' ? bannerSubtitle.trim() || undefined : undefined,
                              subtitleSinhala: bannerType === 'graphic' ? bannerSubtitleSinhala.trim() || undefined : undefined,
                              badge: bannerType === 'graphic' ? bannerBadge.trim() || undefined : undefined,
                              buttonText: bannerButtonText.trim() || 'Claim Offer Now',
                              buttonTextSinhala: bannerButtonTextSinhala.trim() || 'දැන්ම ලියාපදිංචි වන්න',
                              buttonLink: bannerButtonLink.trim() || '#register-form',
                              bgColor: bannerBgColor,
                              isActive: true,
                              order: current.length + 1,
                            };

                            setEditingCampaign({
                              ...editingCampaign,
                              sectionBanners: [...current, newBanner],
                            });
                            showToast(`Web banner added at position "${bannerPosition}"! Click "Save Campaign" below to save.`);
                          }
                        }}
                        className="flex-1 py-2.5 rounded bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                      >
                        {editingBannerId ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Update Section Web Banner / වෙබ් බැනරය සුරකින්න</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add Section Web Banner / වෙබ් බැනරය එක් කරන්න</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Existing Section Banners List */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center justify-between">
                      <span>Configured Section Banners ({editingCampaign.sectionBanners?.length || 0})</span>
                      <span className="text-[10px] text-zinc-400 font-normal">Active banners display between page sections</span>
                    </h5>

                    {(!editingCampaign.sectionBanners || editingCampaign.sectionBanners.length === 0) ? (
                      <div className="p-6 rounded-lg border border-dashed border-white/10 text-center text-xs text-zinc-500 font-mono">
                        No inter-section web banners configured yet. Add announcement or graphic banners above to break up sections.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {editingCampaign.sectionBanners.map((bn, bIdx) => {
                          const posLabels: Record<string, string> = {
                            after_hero: 'Below Urgency Bar (Above Form)',
                            after_form: 'Below Registration Form',
                            after_about: 'Below About Course Points',
                            after_posts: 'Below Promotional Posts',
                            after_gallery: 'Below Student Gallery',
                            after_certificate: 'Below Diploma Certificate',
                            after_reviews: 'Below Reviews',
                          };

                          return (
                            <div
                              key={bn.id || bIdx}
                              className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
                                editingBannerId === bn.id
                                  ? 'bg-black/90 border-[#dfb56c] ring-1 ring-[#dfb56c]/60'
                                  : bn.isActive !== false
                                  ? 'bg-black/80 border-[#dfb56c]/40'
                                  : 'bg-black/40 border-white/10 opacity-60'
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                <span className="w-8 h-8 rounded bg-[#1c1013] border border-[#dfb56c]/50 text-[#dfb56c] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                  #{bIdx + 1}
                                </span>

                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded bg-[#38070e] text-[#dfb56c] border border-[#dfb56c]/30 text-[10px] font-mono font-bold">
                                      📍 {posLabels[bn.position] || bn.position}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/10 text-[10px] font-mono">
                                      {bn.bannerType === 'graphic' ? '🎨 Graphic Announcement' : '🖼️ Image Banner'}
                                    </span>
                                    {bn.isActive !== false ? (
                                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-zinc-500">
                                        Inactive (Hidden)
                                      </span>
                                    )}
                                    {editingBannerId === bn.id && (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-mono font-bold shadow">
                                        Editing
                                      </span>
                                    )}
                                  </div>

                                  {bn.bannerType === 'graphic' ? (
                                    <div>
                                      <div className="text-xs font-bold text-white truncate">
                                        {bn.title || 'Untitled Banner'}
                                      </div>
                                      {bn.titleSinhala && (
                                        <div className="text-xs text-[#dfb56c] font-sinhala truncate">
                                          {bn.titleSinhala}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      {bn.imageUrl && (
                                        <img
                                          src={bn.imageUrl}
                                          alt="Banner"
                                          className="w-16 h-8 object-cover rounded border border-white/10"
                                        />
                                      )}
                                      <span className="text-xs text-zinc-300 font-mono truncate">
                                        {bn.imageUrl}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingBannerId(bn.id);
                                    setBannerPosition(bn.position);
                                    setBannerType(bn.bannerType === 'image' ? 'image' : 'graphic');
                                    setBannerImageUrl(bn.imageUrl || '');
                                    setBannerTitle(bn.title || '');
                                    setBannerTitleSinhala(bn.titleSinhala || '');
                                    setBannerSubtitle(bn.subtitle || '');
                                    setBannerSubtitleSinhala(bn.subtitleSinhala || '');
                                    setBannerBadge(bn.badge || '');
                                    setBannerButtonText(bn.buttonText || 'Claim Offer Now');
                                    setBannerButtonTextSinhala(bn.buttonTextSinhala || 'දැන්ම ලියාපදිංචි වන්න');
                                    setBannerButtonLink(bn.buttonLink || '#register-form');
                                    setBannerBgColor(bn.bgColor || 'from-[#3a0910] via-[#1a080d] to-[#0d0507]');
                                    showToast('Editing banner. Update details above and click "Update Section Web Banner".');
                                  }}
                                  className="px-2 py-1 rounded bg-[#38070e] hover:bg-[#540d18] text-[#dfb56c] border border-[#dfb56c]/30 flex items-center gap-1 cursor-pointer text-xs font-mono"
                                  title="Edit banner"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const banners = [...(editingCampaign.sectionBanners || [])];
                                    banners[bIdx] = {
                                      ...banners[bIdx],
                                      isActive: bn.isActive === false ? true : false,
                                    };
                                    setEditingCampaign({ ...editingCampaign, sectionBanners: banners });
                                    showToast(`Banner ${bn.isActive === false ? 'activated' : 'deactivated'}`);
                                  }}
                                  className={`px-2.5 py-1 rounded text-xs font-mono border cursor-pointer ${
                                    bn.isActive !== false
                                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                                      : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {bn.isActive !== false ? 'Active' : 'Hidden'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (editingCampaign.sectionBanners || []).filter((_, i) => i !== bIdx);
                                    setEditingCampaign({ ...editingCampaign, sectionBanners: updated });
                                    if (editingBannerId === bn.id) {
                                      setEditingBannerId(null);
                                    }
                                    showToast('Banner removed');
                                  }}
                                  className="p-1.5 rounded text-red-400 hover:text-red-200 hover:bg-red-950/60 cursor-pointer"
                                  title="Delete banner"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: VIDEOS */}
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

              {/* TAB: IMAGE GALLERY CUSTOMIZER */}
              {campaignEditorTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#dfb56c]" />
                        <span>Atelier &amp; Workshop Image Gallery / ඡායාරූප ගැලරිය</span>
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala">
                        පාඨමාලාවේ ප්‍රායෝගික වැඩමුළු, සිසුන්ගේ මෝස්තර නිර්මාණ සහ වැඩබිම් ඡායාරූප ශිෂ්‍යයාට පෙන්වීමට මෙහි එක් කරන්න.
                      </p>
                    </div>

                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] self-start sm:self-auto">
                      Photos: {(editingCampaign.galleryImages || []).length}
                    </span>
                  </div>

                  {/* Add / Edit Gallery Image Box */}
                  <div className="p-4 rounded-lg bg-black/70 border border-[#dfb56c]/40 space-y-3.5 shadow-lg">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                      {editingGalleryImageId ? '✏️ Edit Gallery Image / ඡායාරූපය සංස්කරණය කිරීම' : '+ Add New Gallery Image / අලුත් ඡායාරූපයක් එක් කිරීම'}
                    </span>

                    {/* Method 1: Local File Upload */}
                    <div className="p-3 rounded-lg bg-[#140b0e] border border-dashed border-[#dfb56c]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>Option 1: Upload Image File (Phone / PC / Tablet)</span>
                        </span>
                        {isUploadingGalleryImage && (
                          <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing Photo...
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-r from-[#540d18] to-[#3a0910] hover:from-[#6b111f] hover:to-[#4d0c15] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow hover:scale-[1.02]">
                          <Upload className="w-4 h-4 text-[#dfb56c]" />
                          <span>Choose Gallery Image File / ඡායාරූපය තෝරන්න</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryImageFileChange}
                            disabled={isUploadingGalleryImage}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-[#a89f91] font-sinhala text-center sm:text-left">
                          PNG, JPG, WEBP (HD පැහැදිලි බව, ස්වයංක්‍රීයව Optimize වේ)
                        </span>
                      </div>
                    </div>

                    {/* Method 2: Image URL */}
                    <div>
                      <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                        Option 2: Direct Image URL / වෙබ් ලින්ක් මගින්
                      </label>
                      <input
                        type="url"
                        value={galleryImageUrl}
                        onChange={(e) => setGalleryImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or paste image URL"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    {/* Image Preview */}
                    {galleryImageUrl && (
                      <div className="relative rounded overflow-hidden h-32 bg-black border border-[#dfb56c]/50">
                        <img
                          src={galleryImageUrl}
                          alt="Gallery Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[11px] font-mono text-[#dfb56c] font-bold">
                            Preview: {galleryCaption || 'Untitled Photo'} ({galleryTag})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Presets */}
                    <div>
                      <span className="block text-[10px] font-mono text-[#a89f91] mb-1">
                        ⚡ Luxury Atelier Photography Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { title: 'Pattern Drafting & Cutting Masterclass', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', tag: 'Pattern Atelier' },
                          { title: 'Mannequin Draping & Gown Fitting', url: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80', tag: 'Couture Draping' },
                          { title: 'High-speed Industrial Sewing Stations', url: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80', tag: 'Sewing Lab' },
                          { title: 'Fashion Fabrics Selection & Textures', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', tag: 'Materials' },
                          { title: 'Student Garment Collection Showcase', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', tag: 'Runway Showcase' },
                          { title: 'Precision Tailoring & Hand Finishing', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', tag: 'Tailoring' },
                        ].map((pre, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setGalleryImageUrl(pre.url);
                              setGalleryCaption(pre.title);
                              setGalleryTag(pre.tag);
                            }}
                            className="px-2 py-0.5 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[10px] font-mono cursor-pointer transition-all"
                          >
                            + {pre.tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                          Photo Caption (English)
                        </label>
                        <input
                          type="text"
                          value={galleryCaption}
                          onChange={(e) => setGalleryCaption(e.target.value)}
                          placeholder="e.g. Masterclass Pattern Cutting Demonstration"
                          className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                          Photo Caption (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={galleryCaptionSinhala}
                          onChange={(e) => setGalleryCaptionSinhala(e.target.value)}
                          placeholder="උදා: ප්‍රායෝගික පැටර්න් කැපීමේ වැඩමුළුව"
                          className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-sinhala"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                          Category Tag / අංශය
                        </label>
                        <input
                          type="text"
                          value={galleryTag}
                          onChange={(e) => setGalleryTag(e.target.value)}
                          placeholder="Atelier Studio"
                          className="w-full px-3 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      {editingGalleryImageId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGalleryImageId(null);
                            setGalleryImageUrl('');
                            setGalleryCaption('');
                            setGalleryCaptionSinhala('');
                            setGalleryTag('Atelier Studio');
                          }}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (!galleryImageUrl.trim()) {
                            showToast('Please select or upload an image first!');
                            return;
                          }
                          const current = editingCampaign.galleryImages || [];
                          if (editingGalleryImageId) {
                            const updated = current.map((img) =>
                              img.id === editingGalleryImageId
                                ? {
                                    ...img,
                                    imageUrl: galleryImageUrl.trim(),
                                    caption: galleryCaption.trim() || undefined,
                                    captionSinhala: galleryCaptionSinhala.trim() || undefined,
                                    tag: galleryTag.trim() || 'Atelier Studio',
                                  }
                                : img
                            );
                            setEditingCampaign({
                              ...editingCampaign,
                              galleryImages: updated,
                            });
                            setEditingGalleryImageId(null);
                            showToast('Gallery image updated successfully!');
                          } else {
                            const newImg: CampaignGalleryImage = {
                              id: `img-${Date.now()}`,
                              imageUrl: galleryImageUrl.trim(),
                              caption: galleryCaption.trim() || undefined,
                              captionSinhala: galleryCaptionSinhala.trim() || undefined,
                              tag: galleryTag.trim() || 'Atelier Studio',
                            };
                            setEditingCampaign({
                              ...editingCampaign,
                              galleryImages: [...current, newImg],
                            });
                            showToast('Gallery image added!');
                          }
                          setGalleryImageUrl('');
                          setGalleryCaption('');
                          setGalleryCaptionSinhala('');
                          setGalleryTag('Atelier Studio');
                        }}
                        className="px-5 py-2 bg-[#540d18] hover:bg-[#6e1322] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer shadow transition-all"
                      >
                        {editingGalleryImageId ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                            <span>Update Gallery Image / ඡායාරූපය යාවත්කාලීන කරන්න</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#dfb56c]" />
                            <span>Add to Gallery / ගැලරියට එක් කරන්න</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Gallery Grid List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                      Active Gallery Images ({(editingCampaign.galleryImages || []).length})
                    </span>

                    {(!editingCampaign.galleryImages || editingCampaign.galleryImages.length === 0) ? (
                      <div className="p-6 text-center rounded-lg bg-black/40 border border-dashed border-white/10 text-xs text-[#a89f91] font-sinhala">
                        තවම ගැලරියට ඡායාරූප එක් කර නැත. ඉහත Upload බොත්තම, Presets හෝ Image URL භාවිතයෙන් ඡායාරූප එක් කරන්න.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {editingCampaign.galleryImages.map((img, iIdx) => (
                          <div
                            key={img.id || iIdx}
                            className={`rounded-lg overflow-hidden border bg-black/70 group relative shadow-md transition-all ${
                              editingGalleryImageId === img.id ? 'border-[#dfb56c] ring-2 ring-[#dfb56c]/70' : 'border-white/15'
                            }`}
                          >
                            <div className="aspect-video w-full bg-zinc-900 relative">
                              <img
                                src={img.imageUrl}
                                alt={img.caption || 'Gallery photo'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingGalleryImageId(img.id);
                                    setGalleryImageUrl(img.imageUrl);
                                    setGalleryCaption(img.caption || '');
                                    setGalleryCaptionSinhala(img.captionSinhala || '');
                                    setGalleryTag(img.tag || 'Atelier Studio');
                                    showToast('Editing gallery image. Update details above and click "Update Gallery Image".');
                                  }}
                                  className="p-1 rounded-full bg-black/80 border border-[#dfb56c] text-[#dfb56c] hover:bg-[#540d18] cursor-pointer shadow"
                                  title="Edit image details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (editingCampaign.galleryImages || []).filter((_, i) => i !== iIdx);
                                    setEditingCampaign({ ...editingCampaign, galleryImages: updated });
                                    if (editingGalleryImageId === img.id) {
                                      setEditingGalleryImageId(null);
                                    }
                                    showToast('Gallery image removed');
                                  }}
                                  className="p-1 rounded-full bg-red-950/80 border border-red-500 text-red-200 hover:bg-red-900 cursor-pointer shadow"
                                  title="Delete image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {img.tag && (
                                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-[#dfb56c] border border-white/10">
                                  {img.tag}
                                </span>
                              )}
                              {editingGalleryImageId === img.id && (
                                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500 text-black font-bold shadow">
                                  Editing
                                </span>
                              )}
                            </div>
                            <div className="p-2 space-y-0.5">
                              <p className="text-[11px] font-bold text-white truncate">
                                {img.caption || `Image #${iIdx + 1}`}
                              </p>
                              {img.captionSinhala && (
                                <p className="text-[10px] text-[#a89f91] font-sinhala truncate">
                                  {img.captionSinhala}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: CERTIFICATE SHOWCASE CUSTOMIZER */}
              {campaignEditorTab === 'certificate' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#dfb56c]" />
                        <span>Course Certificate Showcase / රජයේ පිළිගත් ඩිප්ලෝමා සහතිකය</span>
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala">
                        පාඨමාලාව සාර්ථකව අවසන් කිරීමෙන් පසු සිසුවාට පිරිනමන රජයේ පිළිගත් සහතිකයේ ඡායාරූපය සහ විස්තර මෙහි සකසන්න.
                      </p>
                    </div>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300">
                      TVEC / NVQ Aligned
                    </span>
                  </div>

                  {/* Certificate Image Upload & URL input & presets */}
                  <div className="p-4 rounded-lg bg-black/70 border border-[#dfb56c]/40 space-y-3.5 shadow-lg">
                    {/* Method 1: Local File Upload */}
                    <div className="p-3.5 rounded-lg bg-[#140b0e] border border-dashed border-[#dfb56c]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>Option 1: Upload Certificate Image File (Phone / PC / Tablet)</span>
                        </span>
                        {isUploadingCertificateImage && (
                          <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing Certificate...
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2.5 rounded bg-gradient-to-r from-[#540d18] to-[#3a0910] hover:from-[#6b111f] hover:to-[#4d0c15] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow hover:scale-[1.02]">
                          <Upload className="w-4 h-4 text-[#dfb56c]" />
                          <span>Choose Certificate File / සහතිකයේ ඡායාරූපය තෝරන්න</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCertificateImageFileChange}
                            disabled={isUploadingCertificateImage}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-[#a89f91] font-sinhala text-center sm:text-left">
                          PNG, JPG, WEBP (උසස් HD පැහැදිලි බවකින් සුරැකේ)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Option 2: Certificate Preview Image URL
                      </label>
                      <input
                        type="url"
                        value={editingCampaign.certificateImageUrl || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, certificateImageUrl: e.target.value })
                        }
                        placeholder="https://... or paste certificate sample image link"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    {/* Quick Presets for Certificate */}
                    <div>
                      <span className="block text-[10px] font-mono text-[#a89f91] mb-1">
                        ⚡ Quick Presets / ආදර්ශ සහතික ආකෘති:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { label: '📜 Gold Foil Diplôme de Haute Couture', url: 'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=1000&q=80' },
                          { label: '🎖️ TVEC Recognized Fashion Certificate', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80' },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() =>
                              setEditingCampaign({
                                ...editingCampaign,
                                certificateImageUrl: preset.url,
                                certificateHeading: editingCampaign.certificateHeading || 'Diploma in Professional Dressmaking & Fashion Tech',
                                certificateHeadingSinhala: editingCampaign.certificateHeadingSinhala || 'වෘත්තීය මෝස්තර නිර්මාණ සහ ඇඳුම් මැහුම් ඩිප්ලෝමා සහතිකය',
                                certificateIssuer: editingCampaign.certificateIssuer || 'Tertiary and Vocational Education Commission (TVEC) Aligned',
                                certificateIssuerSinhala: editingCampaign.certificateIssuerSinhala || 'තෘතියික හා වෘත්තීය අධ්‍යාපන කොමිෂන් සභා (TVEC) ප්‍රමිතීන්ට අනුකූලයි',
                              })
                            }
                            className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certificate Titles & Texts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Certificate Heading (English)
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.certificateHeading || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, certificateHeading: e.target.value })
                        }
                        placeholder="e.g. Diploma in Professional Dressmaking & Fashion Tech"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Certificate Heading (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.certificateHeadingSinhala || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, certificateHeadingSinhala: e.target.value })
                        }
                        placeholder="උදා: වෘත්තීය මෝස්තර නිර්මාණ සහ ඇඳුම් මැහුම් ඩිප්ලෝමා සහතිකය"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-sinhala"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Accreditation Authority (English)
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.certificateIssuer || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, certificateIssuer: e.target.value })
                        }
                        placeholder="TVEC / NVQ Government Aligned Academy Certification"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Accreditation Authority (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={editingCampaign.certificateIssuerSinhala || ''}
                        onChange={(e) =>
                          setEditingCampaign({ ...editingCampaign, certificateIssuerSinhala: e.target.value })
                        }
                        placeholder="තෘතියික හා වෘත්තීය අධ්‍යාපන කොමිෂන් සභා ප්‍රමිතීන්ට අනුකූලයි"
                        className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-sinhala"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Certificate Description &amp; Career Value (Sinhala &amp; English)
                    </label>
                    <textarea
                      rows={3}
                      value={editingCampaign.certificateDescriptionSinhala || editingCampaign.certificateDescription || ''}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          certificateDescriptionSinhala: e.target.value,
                          certificateDescription: e.target.value,
                        })
                      }
                      placeholder="පාඨමාලා කටයුතු, ප්‍රායෝගික පරීක්ෂණ සහ ඇඳුම් නිර්මාණ එකතුව සාර්ථකව අවසන් කිරීමෙන් පසු රජයේ පිළිගත් නිල සහතිකය පිරිනැමේ. දේශීය සහ විදේශීය රැකියා සඳහා සුදුසුකම් ලබයි."
                      className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white leading-relaxed font-sinhala"
                    />
                  </div>

                  {/* Certificate Live Preview */}
                  {editingCampaign.certificateImageUrl && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#1c1013] to-[#120a0d] border-2 border-[#dfb56c] flex flex-col sm:flex-row items-center gap-4 shadow-xl">
                      <div className="w-36 h-28 shrink-0 rounded-lg overflow-hidden border border-[#dfb56c] bg-black shadow-lg">
                        <img
                          src={editingCampaign.certificateImageUrl}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-[#dfb56c] text-black font-mono text-[10px] font-bold">
                          Official Certificate
                        </span>
                        <h4 className="text-sm font-bold text-white font-editorial">
                          {editingCampaign.certificateHeading || 'Diploma in Professional Dressmaking'}
                        </h4>
                        <p className="text-xs text-[#dfb56c] font-sinhala">
                          {editingCampaign.certificateIssuerSinhala || editingCampaign.certificateIssuer || 'TVEC / NVQ Aligned'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: PDF BROCHURE */}
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

                  {/* Countdown Timer End Date & Time Box */}
                  <div className="p-4 rounded-lg bg-black/70 border border-[#dfb56c]/40 space-y-3.5 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <label className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#dfb56c]" />
                        <span>Countdown Timer End Date &amp; Time / අවසන් දිනය සහ වේලාව</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#a89f91]">
                        Type freely or use calendar picker
                      </span>
                    </div>

                    <p className="text-xs text-[#a89f91] font-sinhala leading-relaxed">
                      Landing Page එකෙහි ඉහළින් දිවෙන Countdown Timer එක අවසන් වන දිනය සහ වේලාව පහතින් Type කරන්න (නැතහොත් Calendar මඟින් තෝරන්න).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Direct Typable Input */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                          Type Date &amp; Time (Free Text / ඕනෑම දිනයක් Type කරන්න) *
                        </label>
                        <input
                          type="text"
                          value={editingCampaign.countdownEndDate || ''}
                          onChange={(e) =>
                            setEditingCampaign({
                              ...editingCampaign,
                              countdownEndDate: e.target.value,
                            })
                          }
                          placeholder="e.g. 2026-11-30 23:59:00 or 2026-12-15 18:30"
                          className="w-full px-3.5 py-2.5 bg-[#140b0e] border border-white/15 rounded text-xs text-[#dfb56c] font-mono focus:border-[#dfb56c] outline-none"
                        />
                      </div>

                      {/* Visual Datetime Picker */}
                      <div>
                        <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                          Or Pick via Calendar
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            editingCampaign.countdownEndDate && !isNaN(new Date(editingCampaign.countdownEndDate).getTime())
                              ? new Date(new Date(editingCampaign.countdownEndDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const d = new Date(e.target.value);
                            if (!isNaN(d.getTime())) {
                              setEditingCampaign({
                                ...editingCampaign,
                                countdownEndDate: `${e.target.value.replace('T', ' ')}:00`,
                              });
                            }
                          }}
                          className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-[#a89f91] mb-1">
                        ⚡ Quick Presets / ක්ෂණික දිනයන්:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { label: '+2 Days', days: 2 },
                          { label: '+5 Days', days: 5 },
                          { label: '+7 Days (1 Week)', days: 7 },
                          { label: '+14 Days (2 Weeks)', days: 14 },
                          { label: '+30 Days (1 Month)', days: 30 },
                        ].map((pr, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              const target = new Date();
                              target.setDate(target.getDate() + pr.days);
                              target.setHours(23, 59, 59, 0);
                              const yyyy = target.getFullYear();
                              const mm = String(target.getMonth() + 1).padStart(2, '0');
                              const dd = String(target.getDate()).padStart(2, '0');
                              const formatted = `${yyyy}-${mm}-${dd} 23:59:59`;
                              setEditingCampaign({
                                ...editingCampaign,
                                countdownEndDate: formatted,
                              });
                              showToast(`Countdown set to ${pr.label} (${formatted})`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Parsed Live Preview Status */}
                    {editingCampaign.countdownEndDate && (
                      <div className="p-2.5 rounded bg-black/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {!isNaN(new Date(editingCampaign.countdownEndDate).getTime()) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">
                                Target: {new Date(editingCampaign.countdownEndDate).toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-300">
                                Typed Target: "{editingCampaign.countdownEndDate}"
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          Active Countdown Target
                        </span>
                      </div>
                    )}
                  </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                        Intake Subtitle / ඇතුළත් කරගන්නා කාණ්ඩය
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
              )}

              {/* TAB 7: STEP 2 FORM & DATE LINES CUSTOMIZER */}
              {campaignEditorTab === 'form' && (
                <div className="space-y-6">
                  {/* SECTION A: DATE LINES & DEADLINES MANAGER */}
                  <div className="p-4 rounded-lg bg-[#140b0e] border border-[#dfb56c]/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#dfb56c]" />
                          <span>Campaign Date Lines &amp; Deadlines / වැදගත් දිනයන්</span>
                        </h4>
                        <p className="text-xs text-[#a89f91] font-sinhala">
                          ශිෂ්‍යයින්ට පෙන්විය යුතු ලියාපදිංචි වීමේ අවසන් දිනයන්, පන්ති ආරම්භක දිනයන් හෝ විශේෂ දීමනා අවසන් වන දිනයන් මෙහි සකසන්න.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const current = editingCampaign.dateLines || [];
                          const newDl: CampaignDateLine = {
                            id: `dl-${Date.now()}-${current.length + 1}`,
                            label: `Special Milestone #${current.length + 1}`,
                            labelSinhala: `විශේෂ දිනය #${current.length + 1}`,
                            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            highlight: true,
                            description: 'Important milestone for students',
                          };
                          setEditingCampaign({
                            ...editingCampaign,
                            dateLines: [...current, newDl],
                          });
                        }}
                        className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer hover:brightness-110 self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Date Line</span>
                      </button>
                    </div>

                    {/* Standard Registration & Batch Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          1. Registration Closing Deadline / ලියාපදිංචිය අවසන් දිනය
                        </label>
                        <input
                          type="date"
                          value={editingCampaign.registrationDeadline || ''}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, registrationDeadline: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          2. Batch Commencement Date / පන්ති ආරම්භක දිනය
                        </label>
                        <input
                          type="date"
                          value={editingCampaign.batchStartDate || ''}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, batchStartDate: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    </div>

                    {/* Dynamic Date Lines List */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                        Custom Highlighted Date Lines ({editingCampaign.dateLines?.length || 0})
                      </span>

                      {(!editingCampaign.dateLines || editingCampaign.dateLines.length === 0) ? (
                        <div className="p-3 text-center rounded bg-black/40 border border-dashed border-white/10 text-xs text-zinc-500 font-mono">
                          No custom date lines added yet. Click "+ Add Date Line" above to create milestones.
                        </div>
                      ) : (
                        editingCampaign.dateLines.map((dl, dIdx) => (
                          <div
                            key={dl.id || dIdx}
                            className="p-3.5 rounded bg-black/70 border border-white/10 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-[#dfb56c]">
                                Date Line #{dIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingCampaign.dateLines || []).filter((_, i) => i !== dIdx);
                                  setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                }}
                                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                                  Label (English) *
                                </label>
                                <input
                                  type="text"
                                  value={dl.label}
                                  placeholder="e.g. 50% Discount Deadline"
                                  onChange={(e) => {
                                    const updated = [...(editingCampaign.dateLines || [])];
                                    updated[dIdx] = { ...dl, label: e.target.value };
                                    setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                                  Label (Sinhala)
                                </label>
                                <input
                                  type="text"
                                  value={dl.labelSinhala || ''}
                                  placeholder="උදා: 50% වට්ටම අවසන් දිනය"
                                  onChange={(e) => {
                                    const updated = [...(editingCampaign.dateLines || [])];
                                    updated[dIdx] = { ...dl, labelSinhala: e.target.value };
                                    setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-sinhala"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-mono text-[#a89f91] mb-1">
                                  Target Date *
                                </label>
                                <input
                                  type="date"
                                  value={dl.date}
                                  onChange={(e) => {
                                    const updated = [...(editingCampaign.dateLines || [])];
                                    updated[dIdx] = { ...dl, date: e.target.value };
                                    setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                              <div className="flex-1 w-full sm:w-auto">
                                <input
                                  type="text"
                                  value={dl.description || ''}
                                  placeholder="Short note (e.g. Only 15 seats available for physical atelier)"
                                  onChange={(e) => {
                                    const updated = [...(editingCampaign.dateLines || [])];
                                    updated[dIdx] = { ...dl, description: e.target.value };
                                    setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                  }}
                                  className="w-full px-2.5 py-1 bg-[#140b0e] border border-white/10 rounded text-xs text-[#d5cfc4]"
                                />
                              </div>

                              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#f7e2a9] shrink-0">
                                <input
                                  type="checkbox"
                                  checked={dl.highlight ?? true}
                                  onChange={(e) => {
                                    const updated = [...(editingCampaign.dateLines || [])];
                                    updated[dIdx] = { ...dl, highlight: e.target.checked };
                                    setEditingCampaign({ ...editingCampaign, dateLines: updated });
                                  }}
                                  className="accent-[#dfb56c]"
                                />
                                <span>Highlight with Urgent Red/Gold Badge</span>
                              </label>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION B: STUDENT REGISTRATION FORM CUSTOMIZER */}
                  <div className="p-4 rounded-lg bg-[#140b0e] border border-[#dfb56c]/40 space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-[#dfb56c]" />
                        <span>Form Fields Customizer / ශිෂ්‍යයා පිරවිය යුතු තොරතුරු</span>
                      </h4>
                      <p className="text-xs text-[#a89f91] font-sinhala">
                        Landing Page එකෙහි පෝරමය පිරවීමේදී ශිෂ්‍යයාගෙන් ඇසිය යුතු තොරතුරු සහ අනිවාර්ය කළ යුතු (Required) තොරතුරු මෙතැනින් Toggle කරන්න.
                      </p>
                    </div>

                    {/* Field Toggles Table */}
                    <div className="space-y-2.5">
                      {/* Fixed mandatory fields notice */}
                      <div className="p-2.5 rounded bg-black/60 border border-white/10 text-xs font-mono flex items-center justify-between">
                        <span className="text-white font-bold">1. Full Name (සම්පූර්ණ නම)</span>
                        <span className="text-emerald-400 font-bold text-[11px]">Always Visible • Mandatory *</span>
                      </div>

                      <div className="p-2.5 rounded bg-black/60 border border-white/10 text-xs font-mono flex items-center justify-between">
                        <span className="text-white font-bold">2. WhatsApp Number (දුරකථන අංකය)</span>
                        <span className="text-emerald-400 font-bold text-[11px]">Always Visible • Mandatory *</span>
                      </div>

                      {/* Configurable fields */}
                      {[
                        {
                          key: 'Email',
                          name: '3. Student Email Address',
                          nameSinhala: 'විද්‍යුත් තැපැල් ලිපිනය',
                          showKey: 'showEmail',
                          reqKey: 'requireEmail',
                        },
                        {
                          key: 'District',
                          name: '4. District Selection',
                          nameSinhala: 'දිස්ත්‍රික්කය',
                          showKey: 'showDistrict',
                          reqKey: 'requireDistrict',
                        },
                        {
                          key: 'City',
                          name: '5. Nearest City / Town',
                          nameSinhala: 'ළඟම නගරය',
                          showKey: 'showCity',
                          reqKey: 'requireCity',
                        },
                        {
                          key: 'StudyMode',
                          name: '6. Study Mode (Physical Atelier vs Live Zoom)',
                          nameSinhala: 'ඉගෙනුම් ක්‍රමය (Physical / Zoom)',
                          showKey: 'showStudyMode',
                          reqKey: 'requireStudyMode',
                        },
                        {
                          key: 'Location',
                          name: '7. Campus / Atelier Branch Location',
                          nameSinhala: 'කැමති ශාඛාව (Kegalle / Kurunegala / Piliyandala)',
                          showKey: 'showLocation',
                          reqKey: 'requireLocation',
                        },
                        {
                          key: 'Experience',
                          name: '8. Prior Sewing Experience Level',
                          nameSinhala: 'මැහුම් පළපුරුද්ද / දැනුම මට්ටම',
                          showKey: 'showExperience',
                          reqKey: 'requireExperience',
                        },
                      ].map((f) => {
                        const formCfg = editingCampaign.formConfig || {
                          showEmail: true,
                          requireEmail: false,
                          showDistrict: true,
                          requireDistrict: false,
                          showCity: true,
                          requireCity: false,
                          showStudyMode: true,
                          requireStudyMode: true,
                          showLocation: true,
                          requireLocation: true,
                          showExperience: true,
                          requireExperience: false,
                          showNotes: true,
                        };

                        const isShown = (formCfg as any)[f.showKey] !== false;
                        const isRequired = (formCfg as any)[f.reqKey] === true;

                        return (
                          <div
                            key={f.key}
                            className="p-3 rounded bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-bold text-white block">{f.name}</span>
                              <span className="text-[11px] text-[#a89f91] font-sinhala">{f.nameSinhala}</span>
                            </div>

                            <div className="flex items-center gap-4 font-mono text-[11px]">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[#d5cfc4]">
                                <input
                                  type="checkbox"
                                  checked={isShown}
                                  onChange={(e) => {
                                    const nextCfg = {
                                      ...formCfg,
                                      [f.showKey]: e.target.checked,
                                    };
                                    setEditingCampaign({ ...editingCampaign, formConfig: nextCfg });
                                  }}
                                  className="accent-[#dfb56c]"
                                />
                                <span>Show on Form</span>
                              </label>

                              {isShown && (
                                <label className="flex items-center gap-1.5 cursor-pointer text-[#dfb56c]">
                                  <input
                                    type="checkbox"
                                    checked={isRequired}
                                    onChange={(e) => {
                                      const nextCfg = {
                                        ...formCfg,
                                        [f.reqKey]: e.target.checked,
                                      };
                                      setEditingCampaign({ ...editingCampaign, formConfig: nextCfg });
                                    }}
                                    className="accent-[#dfb56c]"
                                  />
                                  <span>Required *</span>
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Notes toggle */}
                      <div className="p-3 rounded bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">9. Special Questions &amp; Notes Textarea</span>
                          <span className="text-[11px] text-[#a89f91] font-sinhala">විශේෂ සටහන් හෝ ප්‍රශ්න ඇතුළත් කිරීමේ කොටුව</span>
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#d5cfc4] font-mono text-[11px]">
                          <input
                            type="checkbox"
                            checked={editingCampaign.formConfig?.showNotes !== false}
                            onChange={(e) => {
                              const nextCfg = {
                                ...(editingCampaign.formConfig || {}),
                                showNotes: e.target.checked,
                              };
                              setEditingCampaign({ ...editingCampaign, formConfig: nextCfg });
                            }}
                            className="accent-[#dfb56c]"
                          />
                          <span>Show on Form</span>
                        </label>
                      </div>
                    </div>

                    {/* Campus Locations Configuration */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <label className="block text-xs font-mono uppercase text-[#dfb56c] font-bold">
                        Allowed Atelier Locations for this Form:
                      </label>
                      <p className="text-[11px] text-[#a89f91] font-sinhala mb-2">
                        ශිෂ්‍යයාට තෝරාගත හැකි වැඩමුළු ශාඛා ලැයිස්තුව මෙහි යොදන්න (කොමාවෙන් වෙන් කරන්න).
                      </p>
                      <input
                        type="text"
                        value={(editingCampaign.allowedLocations || []).join(', ')}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setEditingCampaign({ ...editingCampaign, allowedLocations: list });
                        }}
                        placeholder="KEGALLE ATELIER, KURUNEGALA ATELIER, PILIYANDALA ATELIER, ONLINE ZOOM"
                        className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* SECTION B2: CUSTOM FORM FIELDS BUILDER (Add & Edit Dynamic Questions / Inputs) */}
                  <div className="p-4 rounded-lg bg-[#140b0e] border border-[#dfb56c]/60 space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white font-editorial flex items-center gap-2">
                          <ListPlus className="w-4 h-4 text-[#dfb56c]" />
                          <span>Custom Form Fields / ශිෂ්‍යයා පිරවිය යුතු අමතර තොරතුරු සහ ප්‍රශ්න</span>
                        </h4>
                        <p className="text-xs text-[#a89f91] font-sinhala">
                          ශිෂ්‍යයා ලියාපදිංචි වීමේදී ඇසිය යුතු අමතර තොරතුරු (NIC, Occupation, Sewing Machine details ආදිය) මෙතැනින් අලුතින් එක් කර (Add), සංස්කරණය (Edit) කරන්න.
                        </p>
                      </div>

                      {!isAddingCustomField && !editingCustomField && (
                        <button
                          type="button"
                          onClick={handleOpenAddField}
                          className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer hover:brightness-110 self-start sm:self-auto shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Form Field (+ අලුත් තොරතුරක්)</span>
                        </button>
                      )}
                    </div>

                    {/* Add / Edit Custom Field Form Box */}
                    {(isAddingCustomField || editingCustomField) && (
                      <div className="p-4 rounded-lg bg-black/80 border-2 border-[#dfb56c] space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{editingCustomField ? 'Edit Custom Form Field / තොරතුරු කොටුව සංස්කරණය' : 'Create New Form Field / අලුත් තොරතුරු කොටුවක් එක් කිරීම'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCustomField(false);
                              setEditingCustomField(null);
                            }}
                            className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Quick Presets for common institute questions */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#a89f91] mb-1.5">
                            ⚡ Quick Field Presets / නිතර අසන ප්‍රශ්න ආකෘති:
                          </label>
                          <div className="flex flex-wrap gap-1.5 text-xs">
                            {[
                              { label: 'National Identity Card (NIC)', sinhala: 'ජාතික හැඳුනුම්පත් අංකය (NIC)', type: 'text' as CampaignCustomFieldType, placeholder: 'e.g. 200012345678 / 987654321V', req: true },
                              { label: 'Do you own a sewing machine?', sinhala: 'ඔබට මැහුම් යන්ත්‍රයක් තිබේද?', type: 'select' as CampaignCustomFieldType, options: 'Yes - Electric Motor Machine, Yes - Manual Treadle Machine, No - Planning to buy, No - Not planning to buy', req: false },
                              { label: 'Current Occupation / Employment', sinhala: 'වත්මන් රැකියාව හෝ අධ්‍යාපන තත්ත්වය', type: 'text' as CampaignCustomFieldType, placeholder: 'e.g. Student, Teacher, Garment Supervisor, Homemaker', req: false },
                              { label: 'Preferred Class Batch Timing', sinhala: 'කැමති පන්ති වේලාව', type: 'select' as CampaignCustomFieldType, options: 'Saturday Full Day (9:00 AM - 4:00 PM), Sunday Full Day (9:00 AM - 4:00 PM), Weekday Evening Zoom (7:00 PM - 9:30 PM)', req: true },
                              { label: 'Age / උපන් වර්ෂය හෝ වයස', sinhala: 'වයස හෝ උපන් වර්ෂය', type: 'number' as CampaignCustomFieldType, placeholder: 'e.g. 24', req: false },
                            ].map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => {
                                  setCustomFieldLabel(preset.label);
                                  setCustomFieldLabelSinhala(preset.sinhala);
                                  setCustomFieldType(preset.type);
                                  setCustomFieldPlaceholder(preset.placeholder || '');
                                  setCustomFieldRequired(preset.req);
                                  setCustomFieldOptions(preset.options || '');
                                }}
                                className="px-2.5 py-1 rounded bg-[#1c1013] border border-white/10 hover:border-[#dfb56c] text-[#dfb56c] text-[11px] font-mono cursor-pointer transition-all hover:bg-[#540d18]/40"
                              >
                                + {preset.label.split('/')[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Labels (English & Sinhala) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Field Label (English) *
                            </label>
                            <input
                              type="text"
                              value={customFieldLabel}
                              onChange={(e) => setCustomFieldLabel(e.target.value)}
                              placeholder="e.g. National Identity Card (NIC)"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Field Label (Sinhala / සිංහල)
                            </label>
                            <input
                              type="text"
                              value={customFieldLabelSinhala}
                              onChange={(e) => setCustomFieldLabelSinhala(e.target.value)}
                              placeholder="උදා: ජාතික හැඳුනුම්පත් අංකය (NIC)"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                            />
                          </div>
                        </div>

                        {/* Field Type & Placeholder */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Field Type / දත්ත වර්ගය *
                            </label>
                            <select
                              value={customFieldType}
                              onChange={(e) => setCustomFieldType(e.target.value as CampaignCustomFieldType)}
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                            >
                              <option value="text">📝 Short Text (කෙටි පෙළ)</option>
                              <option value="number">🔢 Number (සංඛ්‍යාත්මක)</option>
                              <option value="select">📋 Dropdown Select (තේරීම් ලැයිස්තුවක්)</option>
                              <option value="textarea">📄 Long Textarea (දීර්ඝ විස්තරයක්)</option>
                              <option value="date">📅 Date (දිනය)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Placeholder / ඉඟිය
                            </label>
                            <input
                              type="text"
                              value={customFieldPlaceholder}
                              onChange={(e) => setCustomFieldPlaceholder(e.target.value)}
                              placeholder="e.g. Enter your 12-digit NIC or old 9-digit NIC"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                            />
                          </div>
                        </div>

                        {/* Options for dropdown select */}
                        {customFieldType === 'select' && (
                          <div>
                            <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                              Dropdown Choices / තේරීම් ලැයිස්තුව (Comma-separated) *
                            </label>
                            <input
                              type="text"
                              value={customFieldOptions}
                              onChange={(e) => setCustomFieldOptions(e.target.value)}
                              placeholder="Option 1, Option 2, Option 3 (කොමාවෙන් වෙන් කරන්න)"
                              className="w-full px-3 py-2 bg-[#140b0e] border border-white/15 rounded text-xs text-white font-mono focus:border-[#dfb56c] outline-none"
                            />
                            <span className="text-[10px] text-[#a89f91] font-mono mt-1 block">
                              Enter options separated by comma. E.g: Yes, No, Planning to buy
                            </span>
                          </div>
                        )}

                        {/* Required toggle */}
                        <div className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-white/10">
                          <div>
                            <span className="text-xs font-bold text-white block">Mandatory Field / අනිවාර්යයෙන් පිරවිය යුතු තොරතුරක්ද?</span>
                            <span className="text-[11px] text-[#a89f91] font-sinhala">ශිෂ්‍යයා මෙම කොටුව පුරවන තුරු Registration Form එක Submit කළ නොහැක</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#dfb56c]">
                            <input
                              type="checkbox"
                              checked={customFieldRequired}
                              onChange={(e) => setCustomFieldRequired(e.target.checked)}
                              className="accent-[#dfb56c] w-4 h-4 cursor-pointer"
                            />
                            <span className="font-bold">Required *</span>
                          </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCustomField(false);
                              setEditingCustomField(null);
                            }}
                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveCustomField}
                            className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase rounded cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingCustomField ? 'Update Field' : 'Save Field to Form'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Existing Custom Fields List */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                        Custom Fields on Form ({((editingCampaign.customFields || editingCampaign.formConfig?.customFields) || []).length})
                      </span>

                      {(!editingCampaign.customFields || editingCampaign.customFields.length === 0) &&
                       (!editingCampaign.formConfig?.customFields || editingCampaign.formConfig.customFields.length === 0) ? (
                        <div className="p-4 text-center rounded bg-black/40 border border-dashed border-white/10 text-xs text-[#a89f91] font-sinhala">
                          තවම අමතර තොරතුරු කොටු (Custom Fields) කිසිවක් එක් කර නැත. ඉහත "+ Add New Form Field" ක්ලික් කර අවශ්‍ය ප්‍රශ්න එක් කරන්න.
                        </div>
                      ) : (
                        (editingCampaign.customFields || editingCampaign.formConfig?.customFields || []).map((cf, cIdx) => (
                          <div
                            key={cf.id || cIdx}
                            className="p-3 rounded bg-black/70 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm hover:border-[#dfb56c]/50 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] text-[10px] font-mono font-bold uppercase">
                                  #{cIdx + 1} • {cf.fieldType.toUpperCase()}
                                </span>
                                <span className="font-bold text-white text-sm">{cf.label}</span>
                                {cf.required ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/60 text-amber-300 font-mono text-[10px] font-bold">
                                    Mandatory *
                                  </span>
                                ) : (
                                  <span className="text-zinc-500 font-mono text-[10px]">Optional</span>
                                )}
                              </div>

                              {cf.labelSinhala && (
                                <p className="text-[11px] text-[#dfb56c] font-sinhala">
                                  සිංහල ලේබලය: {cf.labelSinhala}
                                </p>
                              )}

                              {cf.fieldType === 'select' && cf.options && cf.options.length > 0 && (
                                <p className="text-[10px] text-[#a89f91] font-mono truncate max-w-lg">
                                  Options: {cf.options.join(' | ')}
                                </p>
                              )}
                              {cf.placeholder && (
                                <p className="text-[10px] text-zinc-400 font-mono italic">
                                  Placeholder: "{cf.placeholder}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditField(cf)}
                                className="px-3 py-1.5 rounded bg-[#540d18] border border-[#dfb56c]/60 text-[#dfb56c] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:brightness-110"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCustomField(cf.id)}
                                className="p-1.5 rounded bg-red-950/60 border border-red-500/50 text-red-400 hover:text-red-200 cursor-pointer"
                                title="Remove Field"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION C: FORM HEADINGS & GUIDANCE TEXTS */}
                  <div className="p-4 rounded-lg bg-[#140b0e] border border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white font-editorial">
                      Form Headings &amp; WhatsApp Settings
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Step 2 Form Heading (English)
                        </label>
                        <input
                          type="text"
                          value={editingCampaign.formHeading || ''}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, formHeading: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Step 2 Form Heading (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={editingCampaign.formHeadingSinhala || ''}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, formHeadingSinhala: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white font-sinhala"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Admissions WhatsApp Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editingCampaign.whatsappNumber || '+94703755312'}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, whatsappNumber: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                          Default WhatsApp Pre-Fill Message
                        </label>
                        <input
                          type="text"
                          value={editingCampaign.whatsappPrefillText || ''}
                          onChange={(e) =>
                            setEditingCampaign({ ...editingCampaign, whatsappPrefillText: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-black border border-white/15 rounded text-xs text-white"
                        />
                      </div>
                    </div>
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
