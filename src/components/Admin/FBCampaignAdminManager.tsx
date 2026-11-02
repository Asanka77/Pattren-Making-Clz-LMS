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
    courses,
  } = useData();

  // Tab state within Campaign Admin
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads'>('campaigns');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [selectedCampaignForLeads, setSelectedCampaignForLeads] = useState<string>('ALL');
  const [leadCallStatusFilter, setLeadCallStatusFilter] = useState<'ALL' | CampaignCallOutcome>('ALL');

  // Edit Campaign State
  const [editingCampaign, setEditingCampaign] = useState<CampaignPage | null>(null);
  const [campaignEditorTab, setCampaignEditorTab] = useState<'basics' | 'about' | 'videos' | 'pdf' | 'reviews' | 'pricing' | 'form'>('basics');

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
  const [whatsappTemplateType, setWhatsappTemplateType] = useState<'welcome' | 'no_answer' | 'payment' | 'custom'>('no_answer');
  const [customWhatsappMessage, setCustomWhatsappMessage] = useState<string>('');

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

  // WhatsApp Message Generator
  const getWhatsAppMessageText = (lead: CampaignLead, template: 'welcome' | 'no_answer' | 'payment' | 'custom'): string => {
    const campaign = campaigns.find((c) => c.slug === lead.campaignSlug || c.id === lead.campaignId);
    const campaignTitle = campaign?.title || lead.campaignTitle;
    const priceText = campaign ? `රු. ${(campaign.discountPrice ?? 7500).toLocaleString()}` : '50% විශේෂ වට්ටම';

    if (template === 'no_answer') {
      return `හෙලෝ ${lead.fullName}, Ceylon Style Studio වෙතින්.\n\nඔබ අපගේ "${campaignTitle}" පාඨමාලාව සඳහා Facebook හරහා ආසනයක් වෙන්කරගෙන තිබුණි (Ref: ${lead.id}). ඒ පිළිබඳව වැඩිදුර තොරතුරු ලබාදීමට අපි ඔබට දුරකථන ඇමතුමක් ගත්තද සම්බන්ධ කරගත නොහැකි විය.\n\nඔබට පන්ති ආරම්භක දිනයන් සහ ගාස්තු ගෙවීමේ ක්‍රම පිළිබඳව විස්තර දැනගැනීමට අවශ්‍ය නම් කරුණාකර මෙම WhatsApp අංකයට පණිවිඩයක් එවන්න. ස්තූතියි!`;
    }
    if (template === 'payment') {
      return `හෙලෝ ${lead.fullName}, Ceylon Style Studio වෙතින්.\n\nඔබගේ "${campaignTitle}" ආසනය සහ ${priceText} විශේෂ වට්ටම තහවුරු කරගැනීම සඳහා බැංකු ගිණුම් විස්තර පහත පරිදි වේ:\n\n• Bank: Commercial Bank\n• Account Name: Ceylon Style Studio (Pvt) Ltd\n• Account Number: 1000548923\n• Branch: Kurunegala\n\nමුදල් තැන්පත් කිරීමෙන් පසු රිසිට්පත (Bank Slip / Screenshot) මෙම WhatsApp අංකයට යොමුකරන්න. Ref ID: ${lead.id}. ස්තූතියි!`;
    }
    if (template === 'welcome') {
      return `හෙලෝ ${lead.fullName}, Ceylon Style Studio විලාසිතා ඇකඩමිය වෙත සාදරයෙන් පිළිගනිමු!\n\nඔබ "${campaignTitle}" පාඨමාලාව සඳහා සාර්ථකව ලියාපදිංචි වී ඇත. (Ref: ${lead.id})\n\n• පාඨමාලා ගාස්තුව: ${priceText}\n• තෝරාගත් ශාඛාව: ${lead.preferredLocation || lead.city || 'Kurunegala Atelier'}\n• ඉගෙනුම් ක්‍රමය: ${lead.studyMode === 'PHYSICAL' ? 'ප්‍රායෝගික වැඩමුළු (Physical)' : 'සජීවී ඔන්ලයින් (Live Zoom)'}\n\nඅපගේ ඇතුළත් කිරීම් අංශය මගින් වැඩිදුර තොරතුරු සහ කාලසටහන ඔබට දැනුම් දෙනු ඇත. ඔබට කිසියම් ගැටලුවක් ඇත්නම් මෙහි සටහන් කරන්න.`;
    }
    return customWhatsappMessage;
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#a89f91] font-bold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>Filter Leads by Call Outcome / Status:</span>
              </span>
              {leadCallStatusFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setLeadCallStatusFilter('ALL')}
                  className="text-[11px] font-mono text-[#dfb56c] hover:underline cursor-pointer"
                >
                  Show All Leads ({campaignLeads.length})
                </button>
              )}
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

              {CALL_OUTCOME_CONFIGS.map((out) => {
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
                        CALL_OUTCOME_CONFIGS.find((c) => c.id === effStatus) ||
                        CALL_OUTCOME_CONFIGS[0];

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
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <span>{lead.whatsappNumber}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* 1-Click WhatsApp Direct Message Template Modal */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWhatsappModalLead(lead);
                                    setWhatsappTemplateType('no_answer');
                                    setCustomWhatsappMessage(getWhatsAppMessageText(lead, 'no_answer'));
                                  }}
                                  className="px-2 py-1 rounded bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                                  title="Send Customized WhatsApp Message"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>

                                {/* Direct Call Button */}
                                <a
                                  href={`tel:${lead.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                                  className="p-1 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                                  title="Call Student"
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
                                  showToast(`Status updated to "${newStatus}"!`);
                                }}
                                className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase border bg-black outline-none cursor-pointer ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
                              >
                                {CALL_OUTCOME_CONFIGS.map((out) => (
                                  <option key={out.id} value={out.id} className="bg-[#120a0d] text-white">
                                    {out.label}
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
                      <span>Call Now ({callLoggingLead.whatsappNumber})</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappModalLead(callLoggingLead);
                        setWhatsappTemplateType('no_answer');
                        setCustomWhatsappMessage(getWhatsAppMessageText(callLoggingLead, 'no_answer'));
                      }}
                      className="px-3 py-1 rounded bg-[#25D366]/20 hover:bg-[#25D366] hover:text-black border border-[#25D366]/50 text-[#25D366] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send WhatsApp Message</span>
                    </button>
                  </div>

                  {/* Call Outcome Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-2 font-bold">
                      1. Call Outcome / දුරකථන ඇමතුමේ ප්‍රතිඵලය *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CALL_OUTCOME_CONFIGS.map((out) => {
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
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-2 font-bold">
                      Choose Message Template / පණිවිඩ ආකෘතිය:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setWhatsappTemplateType('no_answer');
                          setCustomWhatsappMessage(getWhatsAppMessageText(whatsappModalLead, 'no_answer'));
                        }}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                          whatsappTemplateType === 'no_answer'
                            ? 'bg-[#25D366]/20 border-[#25D366] text-white font-bold'
                            : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:text-white'
                        }`}
                      >
                        <span className="block text-[11px] text-red-300 font-bold mb-1">📵 Call No Answer</span>
                        <span className="text-[10px] font-sinhala block text-[#d5cfc4]">ඇමතුමට පිළිතුරු නොදුන් පසු</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setWhatsappTemplateType('payment');
                          setCustomWhatsappMessage(getWhatsAppMessageText(whatsappModalLead, 'payment'));
                        }}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                          whatsappTemplateType === 'payment'
                            ? 'bg-[#25D366]/20 border-[#25D366] text-white font-bold'
                            : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:text-white'
                        }`}
                      >
                        <span className="block text-[11px] text-yellow-300 font-bold mb-1">💳 Bank &amp; Payment</span>
                        <span className="text-[10px] font-sinhala block text-[#d5cfc4]">බැංකු ගිණුම් විස්තර</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setWhatsappTemplateType('welcome');
                          setCustomWhatsappMessage(getWhatsAppMessageText(whatsappModalLead, 'welcome'));
                        }}
                        className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                          whatsappTemplateType === 'welcome'
                            ? 'bg-[#25D366]/20 border-[#25D366] text-white font-bold'
                            : 'bg-[#140b0e] border-white/10 text-[#a89f91] hover:text-white'
                        }`}
                      >
                        <span className="block text-[11px] text-emerald-300 font-bold mb-1">✨ Welcome &amp; Details</span>
                        <span className="text-[10px] font-sinhala block text-[#d5cfc4]">සාදරයෙන් පිළිගැනීම</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#dfb56c] mb-1 font-bold">
                      Message Content (Editable before sending)
                    </label>
                    <textarea
                      rows={8}
                      value={customWhatsappMessage}
                      onChange={(e) => setCustomWhatsappMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded text-xs text-white focus:border-[#25D366] outline-none leading-relaxed font-sans"
                    />
                  </div>

                  <div className="p-3 rounded bg-[#0d1a10] border border-[#25D366]/30 text-[11px] text-[#b4dfbe] font-sinhala">
                    💡 "Send via WhatsApp" ක්ලික් කළ විට ඔබගේ WhatsApp Web හෝ Mobile App එක කෙලින්ම විවෘත වී මෙම පණිවිඩය සූදානම්ව පෙන්වනු ඇත.
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
                    href={`https://wa.me/${whatsappModalLead.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
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
                { id: 'form', label: '7. Form & Date Lines Customizer' },
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
