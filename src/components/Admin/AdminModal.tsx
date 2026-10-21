import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileText,
  Sliders,
  Video,
  Image as ImageIcon,
  MapPin,
  HelpCircle,
  Layers,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  RotateCcw,
  Plus,
  Save,
  Upload,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  ExternalLink,
  LogIn,
  LogOut,
  Lock,
  Unlock,
  CreditCard,
  BookOpen,
  MessageSquare,
  Check,
  Building,
  Play,
  Award,
  Palette,
  Copy,
  Ruler,
  Camera,
  ArrowRight,
  Monitor,
  Tv,
  Smartphone,
  GraduationCap,
  Flame,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Registration,
  RegistrationStatus,
  CourseType,
  SiteSettings,
  CourseItem,
  CourseModuleItem,
  WhyFeatureItem,
  YouTubeVideoItem,
  GalleryImageItem,
  LocationItem,
  FAQItem,
  Lesson,
  LessonVideoItem,
  LessonMaterialItem,
  PaymentSlip,
  BodyMeasurementItem,
} from '../../types';
import {
  exportRegistrationsToExcel,
  exportRegistrationsToPDF,
  exportRegistrationsToCSV,
  exportPaymentsToExcel,
  exportPaymentsToCSV,
} from '../../lib/exportUtils';
import { SRI_LANKA_DISTRICTS, DEFAULT_BODY_MEASUREMENTS, DEFAULT_YOUTUBE_VIDEOS } from '../../lib/defaults';
import { parseYouTubeVideoId, getYouTubeThumbnailUrl, compressImage } from '../../lib/mediaUtils';
import { CourseCMSAdminManager } from './CourseCMSAdminManager';
import { FBCampaignAdminManager } from './FBCampaignAdminManager';

interface AdminModalProps {
  onOpenAdmin?: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const LANDING_PAGE_SECTIONS = [
  { id: 'hero', name: '1. Cover / Hero Section', nameSinhala: 'කවරය / ප්‍රධාන Hero අංශය' },
  { id: 'videos', name: '2. Course Videos & Masterclasses', nameSinhala: 'පාඨමාලා වීඩියෝ' },
  { id: 'intro', name: '3. Course Introduction & Philosophy', nameSinhala: 'පාඨමාලා හැඳින්වීම' },
  { id: 'whyCourse', name: '4. Why Course Pillars', nameSinhala: 'සුවිශේෂීතා' },
  { id: 'journey', name: '5. 6-Month Curriculum Journey', nameSinhala: 'මාස 6ක ගමන් මග' },
  { id: 'fabrics', name: '6. Pattern Anatomy & Mini Dummy Studio', nameSinhala: 'පැටර්න් සහ මැනික්වින් ඩමි ස්ටුඩියෝ' },
  { id: 'aiFashion', name: '7. AI Fashion Tech', nameSinhala: 'AI විලාසිතා තාක්ෂණය' },
  { id: 'marketing', name: '8. Digital Marketing & E-Commerce', nameSinhala: 'ඩිජිටල් අලෙවිකරණය' },
  { id: 'styles', name: '9. Exclusive Style Collection Slider', nameSinhala: 'විලාසිතා එකතුව' },
  { id: 'branding', name: '10. Brand Building Masterclass', nameSinhala: 'සන්නාමකරණය' },
  { id: 'mockup', name: '11. 3D Brand Book Mockup', nameSinhala: 'සන්නාම පොත 3D' },
  { id: 'certificate', name: '12. Gold Diploma Certificate', nameSinhala: 'ඩිප්ලෝමා සහතිකය' },
  { id: 'studentReviews', name: '13. Student Video Reviews & Testimonials', nameSinhala: 'ශිෂ්‍ය ප්‍රතිචාර වීඩියෝ' },
  { id: 'audience', name: '14. Target Audience', nameSinhala: 'ඉලක්කගත පිරිස' },
  { id: 'pricing', name: '15. Pricing & Installments', nameSinhala: 'ගාස්තු සහ වාරික' },
  { id: 'locations', name: '16. Academy Locations', nameSinhala: 'ශාඛා ජාලය' },
  { id: 'benefits', name: '17. Course Benefits', nameSinhala: 'පාඨමාලා ප්‍රතිලාභ' },
  { id: 'gallery', name: '18. Atelier Image Gallery', nameSinhala: 'ඡායාරූප ගැලරිය' },
  { id: 'register', name: '19. Student Registration Form', nameSinhala: 'ලියාපදිංචි පෝරමය' },
  { id: 'faq', name: '20. FAQ Section', nameSinhala: 'නිතර අසන ප්‍රශ්න' },
  { id: 'finalCta', name: '21. Final Call to Action', nameSinhala: 'අවසන් ඇරයුම' },
];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { user, isAdmin, signInWithGoogle, signOut, loginAdminWithCredentials, logoutAdmin } = useAuth();
  const [selectedBgSectionKey, setSelectedBgSectionKey] = useState<string>('hero');
  const [selectedAdminMeasurementId, setSelectedAdminMeasurementId] = useState<string>('bm-01');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [adminAuthSubmitting, setAdminAuthSubmitting] = useState(false);

  // Security Lockout Protection (Strict Max 5 attempts, 15 min lock)
  const MAX_ADMIN_ATTEMPTS = 5;
  const ADMIN_LOCKOUT_MS = 15 * 60 * 1000;

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const val = localStorage.getItem('css_admin_failed_attempts');
    return val ? parseInt(val, 10) : 0;
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    const val = localStorage.getItem('css_admin_lockout_until');
    return val ? parseInt(val, 10) : 0;
  });

  const [remainingLockoutSec, setRemainingLockoutSec] = useState<number>(0);

  React.useEffect(() => {
    const checkLock = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setRemainingLockoutSec(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setRemainingLockoutSec(0);
        if (lockoutUntil > 0 && lockoutUntil <= now) {
          localStorage.removeItem('css_admin_lockout_until');
          localStorage.removeItem('css_admin_failed_attempts');
          setFailedAttempts(0);
          setLockoutUntil(0);
        }
      }
    };
    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = remainingLockoutSec > 0;
  const {
    siteSettings,
    updateSiteSettings,
    courses,
    saveCourse,
    deleteCourse,
    modules,
    saveCourseModule,
    deleteCourseModule,
    whyFeatures,
    saveWhyFeature,
    deleteWhyFeature,
    lessons,
    saveLesson,
    deleteLesson,
    videos,
    saveYouTubeVideo,
    deleteYouTubeVideo,
    gallery,
    saveGalleryImage,
    deleteGalleryImage,
    locations,
    saveLocation,
    deleteLocation,
    faqs,
    saveFAQ,
    deleteFAQ,
    registrations,
    paymentSlips,
    approvePaymentSlip,
    rejectPaymentSlip,
    toggleStudentCourseAccess,
    toggleStudentBrandModuleAccess,
    toggleStudentPaidMonth,
    getStudentPaidMonths,
    updateRegistrationStatus,
    updateRegistrationNotes,
    updateRegistrationFull,
    deleteRegistration,
    auditLogs,
    addAuditLog,
    campaigns,
    campaignLeads,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'campaigns'
    | 'registrations'
    | 'payments'
    | 'courses'
    | 'lessons'
    | 'content'
    | 'why-course'
    | 'modules'
    | 'videos'
    | 'gallery'
    | 'locations'
    | 'faqs'
    | 'security'
  >('dashboard');

  useEffect(() => {
    if (initialTab && [
      'dashboard',
      'campaigns',
      'registrations',
      'payments',
      'courses',
      'lessons',
      'content',
      'why-course',
      'modules',
      'videos',
      'gallery',
      'locations',
      'faqs',
      'security',
    ].includes(initialTab)) {
      setActiveTab(initialTab as any);
    } else {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('security')) {
        setActiveTab('security');
      } else if (hash.includes('campaign')) {
        setActiveTab('campaigns');
      } else if (hash.includes('video') || hash.includes('masterclass') || hash.includes('tab7') || hash.includes('tab-7')) {
        setActiveTab('videos');
      }
    }
  }, [isOpen, initialTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourseType, setFilterCourseType] = useState<string>('ALL');
  const [filterLocation, setFilterLocation] = useState<string>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [editingReg, setEditingReg] = useState<Registration | null>(null);

  // Payment preview modal
  const [viewSlipModal, setViewSlipModal] = useState<PaymentSlip | null>(null);

  // Course Edit state
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Lesson Edit modal & Course-by-course filters
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonCourseFilter, setLessonCourseFilter] = useState<string>('ALL');
  const [lessonMonthFilter, setLessonMonthFilter] = useState<number>(0);
  const [lessonSearchTerm, setLessonSearchTerm] = useState<string>('');

  // Why Feature & Video editing state
  const [editingWhyFeature, setEditingWhyFeature] = useState<WhyFeatureItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('ALL');
  const [pinterestSettingsSaved, setPinterestSettingsSaved] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryImageItem> | null>(null);

  // Pinterest Sewing Tutorials Local Form
  const [sewingForm, setSewingForm] = useState({
    titleSinhala: siteSettings.sewingTutorialsTitleSinhala || 'මැහුම් සහ ටේලරින් වීඩියෝ ටියුටෝරියල්ස්',
    titleEn: siteSettings.sewingTutorialsTitle || 'Tailoring & Sewing Video Masterclass Collection',
    descSinhala:
      siteSettings.sewingTutorialsDescriptionSinhala ||
      'Pinterest හරහා තෝරාගත් වෘත්තීය මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝ පාඩම්, විස්තරාත්මක උපදෙස් සහ පැටර්න් මගපෙන්වීම් පිටතට නොගොස් මෙතැනින්ම නරඹන්න.',
    descEn: siteSettings.sewingTutorialsDescription || '',
    badgeSinhala: siteSettings.sewingTutorialsBadgeTextSinhala || 'Pinterest මැහුම් හා ටේලරින් වීඩියෝ එකතුව',
    boardUrl: siteSettings.sewingTutorialsPinterestBoardUrl || 'https://www.pinterest.com/?tabId=696932179776250726',
    tabId: siteSettings.sewingTutorialsPinterestTabId || '696932179776250726',
    showDescription: siteSettings.sewingTutorialsShowDescription !== false,
    playerAspect: siteSettings.sewingTutorialsPlayerAspect || 'adaptive',
    feature1Sinhala: siteSettings.sewingTutorialsFeature1Sinhala || 'සියලුම වීඩියෝ ඇප් එක තුළින්ම ක්‍රියාත්මක වේ',
    feature2Sinhala: siteSettings.sewingTutorialsFeature2Sinhala || 'පිටතට නොගොස් මෙතැනින්ම Play කරන්න',
  });
  const [isSewingFormDirty, setIsSewingFormDirty] = useState(false);

  useEffect(() => {
    if (!isSewingFormDirty) {
      setSewingForm({
        titleSinhala: siteSettings.sewingTutorialsTitleSinhala || 'මැහුම් සහ ටේලරින් වීඩියෝ ටියුටෝරියල්ස්',
        titleEn: siteSettings.sewingTutorialsTitle || 'Tailoring & Sewing Video Masterclass Collection',
        descSinhala:
          siteSettings.sewingTutorialsDescriptionSinhala ||
          'Pinterest හරහා තෝරාගත් වෘත්තීය මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝ පාඩම්, විස්තරාත්මක උපදෙස් සහ පැටර්න් මගපෙන්වීම් පිටතට නොගොස් මෙතැනින්ම නරඹන්න.',
        descEn: siteSettings.sewingTutorialsDescription || '',
        badgeSinhala: siteSettings.sewingTutorialsBadgeTextSinhala || 'Pinterest මැහුම් හා ටේලරින් වීඩියෝ එකතුව',
        boardUrl: siteSettings.sewingTutorialsPinterestBoardUrl || 'https://www.pinterest.com/?tabId=696932179776250726',
        tabId: siteSettings.sewingTutorialsPinterestTabId || '696932179776250726',
        showDescription: siteSettings.sewingTutorialsShowDescription !== false,
        playerAspect: siteSettings.sewingTutorialsPlayerAspect || 'adaptive',
        feature1Sinhala: siteSettings.sewingTutorialsFeature1Sinhala || 'සියලුම වීඩියෝ ඇප් එක තුළින්ම ක්‍රියාත්මක වේ',
        feature2Sinhala: siteSettings.sewingTutorialsFeature2Sinhala || 'පිටතට නොගොස් මෙතැනින්ම Play කරන්න',
      });
    }
  }, [siteSettings, isSewingFormDirty]);

  const handleSaveSewingSettings = async () => {
    await updateSiteSettings({
      sewingTutorialsTitleSinhala: sewingForm.titleSinhala,
      sewingTutorialsTitle: sewingForm.titleEn,
      sewingTutorialsDescriptionSinhala: sewingForm.descSinhala,
      sewingTutorialsDescription: sewingForm.descEn,
      sewingTutorialsBadgeTextSinhala: sewingForm.badgeSinhala,
      sewingTutorialsPinterestBoardUrl: sewingForm.boardUrl,
      sewingTutorialsPinterestTabId: sewingForm.tabId,
      sewingTutorialsShowDescription: sewingForm.showDescription,
      sewingTutorialsPlayerAspect: sewingForm.playerAspect as any,
      sewingTutorialsFeature1Sinhala: sewingForm.feature1Sinhala,
      sewingTutorialsFeature2Sinhala: sewingForm.feature2Sinhala,
    });
    setIsSewingFormDirty(false);
    setPinterestSettingsSaved(true);
    setTimeout(() => setPinterestSettingsSaved(false), 3500);
  };

  // Settings local form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [hasUserEditedSettings, setHasUserEditedSettings] = useState<boolean>(false);

  React.useEffect(() => {
    if (!hasUserEditedSettings && !isSavingSettings) {
      setSettingsForm(siteSettings);
    }
  }, [siteSettings, hasUserEditedSettings, isSavingSettings]);

  const handleSaveAllSettings = async () => {
    setIsSavingSettings(true);
    try {
      await updateSiteSettings(settingsForm);
      setHasUserEditedSettings(false);
      setSaveSuccessMsg('✓ Saved to Firebase Firestore Database! Changes are live on website.');
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    } catch (_) {
      setSaveSuccessMsg('Failed to save to database. Please check connection.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Advanced Security Settings State
  const [securityForm, setSecurityForm] = useState({
    sessionTimeoutMinutes: siteSettings.securitySessionTimeoutMinutes || 30,
    maxFailedAttempts: siteSettings.securityMaxFailedAttempts || 5,
    lockoutDurationMinutes: siteSettings.securityLockoutDurationMinutes || 15,
    requirePINForSensitiveActions: siteSettings.securityRequirePINForSensitiveActions !== false,
    enforceTwoFactor: siteSettings.securityEnforceTwoFactor || false,
    ipWhitelistEnabled: siteSettings.securityIpWhitelistEnabled || false,
    allowedOrigins: siteSettings.securityAllowedOrigins || '*',
    auditLogRetentionDays: siteSettings.securityAuditLogRetentionDays || 90,
    emailAlertsOnFailedLogin: siteSettings.securityEmailAlertsOnFailedLogin !== false,
  });
  const [securitySaveSuccess, setSecuritySaveSuccess] = useState<string>('');
  const [isSavingSecurity, setIsSavingSecurity] = useState<boolean>(false);

  // Security Master PIN Management
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPinInputText, setShowPinInputText] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Security Audit Log Filtering & Checkpoints
  const [auditFilterCategory, setAuditFilterCategory] = useState<string>('ALL');
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [checkpointInput, setCheckpointInput] = useState('');
  const [showCheckpointInput, setShowCheckpointInput] = useState(false);

  useEffect(() => {
    setSecurityForm({
      sessionTimeoutMinutes: siteSettings.securitySessionTimeoutMinutes || 30,
      maxFailedAttempts: siteSettings.securityMaxFailedAttempts || 5,
      lockoutDurationMinutes: siteSettings.securityLockoutDurationMinutes || 15,
      requirePINForSensitiveActions: siteSettings.securityRequirePINForSensitiveActions !== false,
      enforceTwoFactor: siteSettings.securityEnforceTwoFactor || false,
      ipWhitelistEnabled: siteSettings.securityIpWhitelistEnabled || false,
      allowedOrigins: siteSettings.securityAllowedOrigins || '*',
      auditLogRetentionDays: siteSettings.securityAuditLogRetentionDays || 90,
      emailAlertsOnFailedLogin: siteSettings.securityEmailAlertsOnFailedLogin !== false,
    });
  }, [siteSettings]);

  const handleSaveSecuritySettings = async () => {
    setIsSavingSecurity(true);
    try {
      await updateSiteSettings({
        securitySessionTimeoutMinutes: Number(securityForm.sessionTimeoutMinutes),
        securityMaxFailedAttempts: Number(securityForm.maxFailedAttempts),
        securityLockoutDurationMinutes: Number(securityForm.lockoutDurationMinutes),
        securityRequirePINForSensitiveActions: securityForm.requirePINForSensitiveActions,
        securityEnforceTwoFactor: securityForm.enforceTwoFactor,
        securityIpWhitelistEnabled: securityForm.ipWhitelistEnabled,
        securityAllowedOrigins: securityForm.allowedOrigins,
        securityAuditLogRetentionDays: Number(securityForm.auditLogRetentionDays),
        securityEmailAlertsOnFailedLogin: securityForm.emailAlertsOnFailedLogin,
      });
      await addAuditLog(
        'SECURITY_POLICY_UPDATE',
        `Updated security policies: Timeout ${securityForm.sessionTimeoutMinutes}m, Max Attempts ${securityForm.maxFailedAttempts}, PIN required: ${
          securityForm.requirePINForSensitiveActions ? 'YES' : 'NO'
        }, 2FA: ${securityForm.enforceTwoFactor ? 'ENABLED' : 'DISABLED'}`
      );
      setSecuritySaveSuccess('ආරක්ෂක සැකසුම් සාර්ථකව සුරකින ලදී (Security policies saved & synced live).');
      setTimeout(() => setSecuritySaveSuccess(''), 4000);
    } catch (_) {
      setSecuritySaveSuccess('Security update failed. Please check network.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleUpdateMasterPIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    const existingPIN = siteSettings.securityMasterPIN || '755312';
    if (currentPinInput.trim() !== existingPIN) {
      setPinChangeMsg({ text: 'වත්මන් ආරක්ෂක PIN අංකය වැරදියි (Current Master PIN is incorrect).', isError: true });
      return;
    }
    if (newPinInput.length < 4 || newPinInput.length > 8) {
      setPinChangeMsg({ text: 'නව PIN අංකය සඳහා අංක 4-8ක් අතර තිබිය යුතුය (PIN must be 4 to 8 digits).', isError: true });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ text: 'නව PIN අංකය සහ තහවුරු කළ PIN අංකය සමාන නොවේ (New PIN and confirmation do not match).', isError: true });
      return;
    }
    try {
      await updateSiteSettings({ securityMasterPIN: newPinInput.trim() });
      await addAuditLog('MASTER_PIN_CHANGED', 'Master administrator security PIN changed successfully.');
      setPinChangeMsg({ text: 'පරිපාලන Master PIN අංකය සාර්ථකව වෙනස් කරන ලදී (Master PIN updated successfully).', isError: false });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setTimeout(() => setPinChangeMsg(null), 4000);
    } catch (_) {
      setPinChangeMsg({ text: 'PIN වෙනස් කිරීම අසාර්ථක විය (Failed to update PIN).', isError: true });
    }
  };

  const handleResetLockout = async () => {
    localStorage.removeItem('css_admin_lockout_until');
    localStorage.removeItem('css_admin_failed_attempts');
    setFailedAttempts(0);
    setLockoutUntil(0);
    setRemainingLockoutSec(0);
    await addAuditLog('LOCKOUT_MANUAL_RESET', 'Administrator manually cleared failed attempts and lockout timers.');
    setSecuritySaveSuccess('Login attempt counter and lockout timers have been reset to 0.');
    setTimeout(() => setSecuritySaveSuccess(''), 4000);
  };

  const handleCreateSecurityCheckpoint = async () => {
    if (!checkpointInput.trim()) return;
    await addAuditLog('SECURITY_AUDIT_CHECKPOINT', checkpointInput.trim());
    setCheckpointInput('');
    setShowCheckpointInput(false);
    setSecuritySaveSuccess('Security checkpoint recorded to audit log.');
    setTimeout(() => setSecuritySaveSuccess(''), 4000);
  };

  const handleExportAuditLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,Action,Admin Email,Details\n' +
      auditLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${(l.action || '').replace(/"/g, '""')}","${(l.adminEmail || '').replace(/"/g, '""')}","${(l.details || '').replace(/"/g, '""')}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ceylon_Style_Studio_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchCat =
        auditFilterCategory === 'ALL' ||
        (log.action && log.action.toUpperCase().includes(auditFilterCategory));
      const q = auditSearchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        (log.adminEmail && log.adminEmail.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [auditLogs, auditFilterCategory, auditSearchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = registrations.length;
    const physical = registrations.filter((r) => r.courseType === 'PHYSICAL CLASS').length;
    const zoom = registrations.filter((r) => r.courseType === 'ZOOM CLASS').length;

    const kegalle = registrations.filter(
      (r) => r.location === 'KEGALLE' || (r.courseType === 'PHYSICAL CLASS' && r.district === 'Kegalle')
    ).length;
    const kurunegala = registrations.filter(
      (r) => r.location === 'KURUNEGALA' || (r.courseType === 'PHYSICAL CLASS' && r.district === 'Kurunegala')
    ).length;
    const piliyandala = registrations.filter(
      (r) => r.location === 'PILIYANDALA' || (r.courseType === 'PHYSICAL CLASS' && (r.district === 'Colombo' || r.district === 'Kalutara'))
    ).length;

    const pendingPayments = paymentSlips.filter((s) => s.status === 'PENDING').length;
    const verifiedPayments = paymentSlips.filter((s) => s.status === 'VERIFIED').length;
    const activeAccess = registrations.filter((r) => r.courseAccess === 'ACTIVE').length;

    return { total, physical, zoom, kegalle, kurunegala, piliyandala, pendingPayments, verifiedPayments, activeAccess };
  }, [registrations, paymentSlips]);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        !searchTerm ||
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.whatsappNumber.includes(searchTerm) ||
        reg.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.district && reg.district.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCourse = filterCourseType === 'ALL' || reg.courseType === filterCourseType;
      const matchLoc = filterLocation === 'ALL' || reg.location === filterLocation;
      const matchDist = filterDistrict === 'ALL' || reg.district === filterDistrict;
      const matchStat = filterStatus === 'ALL' || reg.status === filterStatus;

      return matchSearch && matchCourse && matchLoc && matchDist && matchStat;
    });
  }, [registrations, searchTerm, filterCourseType, filterLocation, filterDistrict, filterStatus]);

  // Helper for generating personalized WhatsApp Confirmation message as requested in prompt:
  const getWhatsAppConfirmationUrl = (student: Registration) => {
    const rawPhone = student.whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello ${student.fullName},

Thank you for registering with CEYLON STYLE STUDIO.
Your registration and payment have been successfully confirmed!

Registration Number:
${student.regNumber}

Course:
6-Month Professional Fashion & Branding Program

Class:
${student.courseType}

Location:
${student.location || 'Online Zoom'}

Your Private Recorded Course Lessons are now UNLOCKED in your Student LMS Portal.
You can log in anytime using your WhatsApp Number or Registration Number.

Thank you for joining CEYLON STYLE STUDIO.
We look forward to learning and creating with you.`;

    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

  if (!isOpen) return null;

  // Render Login Screen if not admin
  if (!isAdmin) {
    const handleAdminCredentialsLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLockedOut) return;
      setAdminAuthError(null);
      setAdminAuthSubmitting(true);

      const ok = loginAdminWithCredentials(adminEmailInput, adminPasswordInput);
      if (!ok) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        localStorage.setItem('css_admin_failed_attempts', nextAttempts.toString());

        if (nextAttempts >= MAX_ADMIN_ATTEMPTS) {
          const lockoutTime = Date.now() + ADMIN_LOCKOUT_MS;
          setLockoutUntil(lockoutTime);
          localStorage.setItem('css_admin_lockout_until', lockoutTime.toString());
          setAdminAuthError(
            'අඛණ්ඩ අසාර්ථක උත්සාහයන් 5ක් හේතුවෙන් පද්ධතිය විනාඩි 15කට අගුළු ලන ලදී (System Locked for 15 minutes due to 5 consecutive failed attempts).'
          );
        } else {
          setAdminAuthError(
            `ප්‍රවේශය ප්‍රතික්ෂේප විය! වලංගු නොවන විද්‍යුත් තැපෑල හෝ මුරපදයකි. ඉතිරි උත්සාහයන්: ${MAX_ADMIN_ATTEMPTS - nextAttempts} (Access denied! ${MAX_ADMIN_ATTEMPTS - nextAttempts} attempts remaining before lockout)`
          );
        }
        setAdminAuthSubmitting(false);
        return;
      }

      // Successful login
      setFailedAttempts(0);
      setLockoutUntil(0);
      localStorage.removeItem('css_admin_failed_attempts');
      localStorage.removeItem('css_admin_lockout_until');
      setAdminAuthSubmitting(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#141011] rounded-sm border border-[#c99a45]/40 p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center mx-auto mb-3 shadow-xl">
              <Lock className="w-6 h-6 text-[#f7e2a9]" />
            </div>

            <h2 className="text-xl font-editorial font-bold text-[#f7f3eb] mb-1">
              CEYLON STYLE STUDIO
            </h2>
            <span className="text-xs uppercase font-mono text-[#dfb56c] tracking-widest block">
              Restricted Admin Console (/#admin)
            </span>
            <p className="text-xs text-[#b8afa2] mt-2 font-sinhala leading-relaxed">
              පරිපාලන පද්ධතියට ප්‍රවේශ වීම සඳහා බලයලත් Email සහ Password ඇතුළත් කරන්න.
            </p>
          </div>

          {/* Security Authorization Notice */}
          <div className="mb-4 p-3 rounded-sm bg-[#1c1214] border border-[#dfb56c]/30 text-xs">
            <div className="flex items-center gap-2 text-[#dfb56c] font-bold text-[11px] uppercase tracking-wider font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Master Admin Security Portal</span>
            </div>
            <p className="text-[11px] text-[#a89f91] mt-1 font-sinhala leading-relaxed">
              මෙම පද්ධතිය CEYLON STYLE STUDIO බලයලත් පරිපාලකයින් සඳහා පමණි. අනවසර පිවිසුම් උත්සාහයන් ස්වයංක්‍රීයව සටහන් වන අතර පද්ධතිය අගුළු වැටේ.
            </p>
          </div>

          {isLockedOut ? (
            <div className="mb-4 p-3.5 rounded bg-red-950/90 border border-red-500/80 text-red-200 text-xs flex items-center gap-3 font-sinhala shadow-lg">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
              <div>
                <span className="font-bold block">ආරක්ෂක අගුල සක්‍රියයි (Console Locked)</span>
                <span className="text-[11px] text-red-300 block mt-0.5">
                  අඛණ්ඩ අසාර්ථක උත්සාහයන් නිසා පද්ධතිය අගුළු ලා ඇත. නැවත උත්සාහ කිරීමට: {Math.floor(remainingLockoutSec / 60)}m {remainingLockoutSec % 60}s (Locked for {remainingLockoutSec}s)
                </span>
              </div>
            </div>
          ) : adminAuthError ? (
            <div className="mb-4 p-3 rounded bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-center gap-2 font-sinhala shadow-lg">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{adminAuthError}</span>
            </div>
          ) : null}

          <form onSubmit={handleAdminCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                Administrator Email (විද්‍යුත් තැපෑල)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => {
                    setAdminEmailInput(e.target.value);
                    setAdminAuthError(null);
                  }}
                  placeholder="admin@ceylonstylestudio.lk"
                  disabled={isLockedOut}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] placeholder-zinc-600 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  autoFocus
                />
                <Mail className="w-4 h-4 text-[#a89f91] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                Administrator Password (මුරපදය)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    setAdminAuthError(null);
                  }}
                  placeholder="••••••••••••"
                  disabled={isLockedOut}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] placeholder-zinc-600 outline-none transition-colors tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <Lock className="w-4 h-4 text-[#a89f91] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[#a89f91] text-[10px] font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#dfb56c]" />
                Authorized Admin Personnel Only
              </span>
              <span className="text-zinc-500 text-[10px] font-mono">256-Bit SSL Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={adminAuthSubmitting || isLockedOut}
              className="w-full py-3 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shield className="w-4 h-4 fill-black" />
              <span>
                {isLockedOut
                  ? `Security Locked (${remainingLockoutSec}s)`
                  : adminAuthSubmitting
                  ? 'Verifying...'
                  : 'Verify & Enter Admin Console'}
              </span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/10 text-center space-y-2">
            <span className="text-[10px] uppercase font-mono text-[#a89f91] block">
              Or Sign In with Google
            </span>
            <button
              type="button"
              disabled={isLockedOut || adminAuthSubmitting}
              onClick={async () => {
                if (isLockedOut || adminAuthSubmitting) return;
                try {
                  setAdminAuthSubmitting(true);
                  setAdminAuthError(null);
                  await signInWithGoogle();
                } catch (err: any) {
                  const code = err?.code || '';
                  if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
                    setAdminAuthError(
                      'බ්‍රවුසරය / iframe මගින් Google Popup එක අවහිර කර ඇත (Popup Blocked). කරුණාකර ඔබගේ Administrator Email සහ Password යොදා පිවිසෙන්න.'
                    );
                  } else if (code === 'auth/popup-closed-by-user') {
                    setAdminAuthError('ගූගල් ලොගින් කවුළුව වැසිණි (Popup closed). නැවත උත්සාහ කරන්න.');
                  } else {
                    setAdminAuthError('ගූගල් මගින් පිවිසීම අසාර්ථක විය. කරුණාකර Admin Email සහ Password යොදා පිවිසෙන්න.');
                  }
                } finally {
                  setAdminAuthSubmitting(false);
                }
              }}
              className="w-full py-2.5 bg-[#1e1316] hover:bg-[#2b1b1f] border border-[#dfb56c]/40 text-[#f7e2a9] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#dfb56c]" />
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-[#141011] border-b border-[#c99a45]/30 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#540d18] border border-[#dfb56c] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#f7e2a9]" />
          </div>
          <div>
            <span className="text-sm font-editorial font-bold text-[#f7f3eb] tracking-wider block">
              CEYLON STYLE STUDIO • ACADEMY CONTROL CENTER
            </span>
            <span className="text-[10px] font-mono text-[#dfb56c]">
              Authenticated: {user?.email || 'Master Administrator (Active Session)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const staleKeys = [
                'css_courses',
                'css_why_features',
                'css_lessons',
                'css_video_categories',
                'css_runway_outfits',
                'css_student_creations',
                'css_business_calculations',
                'css_site_settings',
                'css_modules',
                'css_gallery',
                'css_locations',
                'css_faqs',
                'css_videos',
                'css_cache_sync_version',
              ];
              staleKeys.forEach((k) => localStorage.removeItem(k));
              window.location.reload();
            }}
            className="px-3 py-1.5 text-xs text-[#dfb56c] hover:text-[#f7e2a9] border border-[#dfb56c]/30 rounded hover:bg-[#540d18]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear all browser cached data and reload fresh live data from Firebase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Clear Cache & Sync Cloud</span>
          </button>

          <button
            onClick={() => signOut()}
            className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white border border-white/10 rounded hover:bg-white/5 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
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
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-[#0e0a0b] border-r border-[#c99a45]/20 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              {
                id: 'campaigns',
                label: `FB Boost Campaigns (${campaigns.length})`,
                sublabel: `Student Leads: ${campaignLeads.length}`,
                icon: <Flame className="w-4 h-4 text-[#dfb56c]" />,
                badge: campaignLeads.filter((l) => l.status === 'NEW').length > 0,
              },
              { id: 'registrations', label: `Students (${registrations.length})`, icon: <Users className="w-4 h-4" /> },
              {
                id: 'payments',
                label: `Payment Verification (${paymentSlips.filter((s) => s.status === 'PENDING').length})`,
                icon: <CreditCard className="w-4 h-4" />,
                badge: paymentSlips.filter((s) => s.status === 'PENDING').length > 0,
              },
              { id: 'courses', label: `Courses & Programs (${courses.length})`, icon: <Award className="w-4 h-4" /> },
              { id: 'lessons', label: `Private LMS Lessons (${lessons.length})`, icon: <BookOpen className="w-4 h-4" /> },
              { id: 'content', label: 'Landing Page CMS & Fees', icon: <Sliders className="w-4 h-4" /> },
              { id: 'why-course', label: `Why Course (12 Pillars)`, icon: <Sparkles className="w-4 h-4" /> },
              { id: 'modules', label: `Curriculum Modules (${modules.length})`, icon: <Layers className="w-4 h-4" /> },
              {
                id: 'videos',
                label: 'Public YouTube Masterclass Videos (Tab 7)',
                sublabel: `YouTube & Pinterest (${videos.length})`,
                icon: <Video className="w-4 h-4" />,
                isTab7: true,
              },
              { id: 'gallery', label: `Style Collections (${gallery.length})`, icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'locations', label: `Studios (${locations.length})`, icon: <MapPin className="w-4 h-4" /> },
              { id: 'faqs', label: `FAQs (${faqs.length})`, icon: <HelpCircle className="w-4 h-4" /> },
              {
                id: 'security',
                label: 'Advanced Security Console',
                sublabel: 'Audit, Lockout, 2FA, PIN & Protection',
                icon: <ShieldAlert className="w-4 h-4 text-[#dfb56c]" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/80 shadow-md ring-1 ring-[#dfb56c]/40'
                    : tab.id === 'videos'
                    ? 'text-[#f7e2a9] bg-[#1a0f12] border border-[#dfb56c]/40 hover:bg-[#251217]'
                    : 'text-[#a89f91] hover:text-[#f7f3eb] hover:bg-white/5'
                }`}
                title={tab.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={activeTab === tab.id ? 'text-[#dfb56c]' : tab.id === 'videos' ? 'text-[#dfb56c]' : 'text-[#a89f91]'}>
                    {tab.icon}
                  </span>
                  <div className="flex flex-col text-left truncate">
                    <span className="truncate">{tab.label}</span>
                    {tab.id === 'videos' && (
                      <span className="text-[10px] text-[#dfb56c]/90 font-sinhala">
                        {tab.sublabel}
                      </span>
                    )}
                  </div>
                </div>
                {tab.id === 'videos' ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#dfb56c] text-black shrink-0">
                    TAB 7
                  </span>
                ) : tab.badge ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                ) : null}
              </button>
            ))}
          </nav>

          {/* Direct Exports in sidebar */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono text-[#a89f91] block">
              Direct Data Exports
            </span>
            <button
              onClick={() => exportRegistrationsToExcel(filteredRegistrations)}
              className="w-full py-2 bg-[#1c1214] hover:bg-[#241317] border border-[#c99a45]/30 rounded-sm text-xs text-[#dfb56c] flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Students (.xlsx)</span>
            </button>
            <button
              onClick={() => exportPaymentsToExcel(paymentSlips)}
              className="w-full py-2 bg-[#1c1214] hover:bg-[#241317] border border-[#c99a45]/30 rounded-sm text-xs text-[#dfb56c] flex items-center justify-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Export Payments (.xlsx)</span>
            </button>
            <button
              onClick={() => exportRegistrationsToPDF(filteredRegistrations)}
              className="w-full py-2 bg-[#1c1214] hover:bg-[#241317] border border-[#c99a45]/30 rounded-sm text-xs text-[#dfb56c] flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-[#141011] overflow-y-auto p-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                  Academy Management Telemetry
                </h3>
                <p className="text-xs text-[#a89f91] mt-0.5">
                  Admissions, payment verification pipeline, and student enrollment across branches.
                </p>
              </div>

              {/* Statistics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { label: 'TOTAL STUDENTS', value: stats.total, color: 'text-[#f7e2a9]' },
                  { label: 'ACTIVE COURSE ACCESS', value: stats.activeAccess, color: 'text-green-400' },
                  { label: 'PENDING PAYMENT SLIPS', value: stats.pendingPayments, color: 'text-amber-400' },
                  { label: 'VERIFIED PAYMENTS', value: stats.verifiedPayments, color: 'text-emerald-400' },
                  { label: 'PHYSICAL CLASS', value: stats.physical, color: 'text-[#dfb56c]' },
                  { label: 'ZOOM CLASS', value: stats.zoom, color: 'text-blue-400' },
                  { label: 'KEGALLE STUDIO', value: stats.kegalle, color: 'text-purple-300' },
                  { label: 'KURUNEGALA STUDIO', value: stats.kurunegala, color: 'text-purple-300' },
                  { label: 'PILIYANDALA STUDIO', value: stats.piliyandala, color: 'text-purple-300' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 shadow-md"
                  >
                    <span className="text-[10px] font-mono text-[#a89f91] uppercase tracking-wider block mb-1">
                      {s.label}
                    </span>
                    <span className={`text-2xl sm:text-3xl font-mono font-bold ${s.color}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* TAB 7 QUICK ACCESS BANNER: Public YouTube Masterclass Videos */}
              <div className="p-5 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#160e10] border-2 border-[#dfb56c]/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-sm bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shrink-0 shadow-md">
                    <Video className="w-6 h-6 text-[#f7e2a9]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c] text-black">
                        TAB 7
                      </span>
                      <h4 className="text-base font-editorial font-bold text-[#f7e2a9]">
                        Public YouTube Masterclass Videos ({videos.length})
                      </h4>
                    </div>
                    <p className="text-xs text-[#d5cfc4] mt-1 font-sinhala">
                      YouTube මාස්ටර්ක්ලාස්, Pinterest මැහුම් ටියුටෝරියල්ස්, ශිෂ්‍ය ප්‍රතිචාර වීඩියෝ සහ පසුබිම් සැකසුම් (Backend Settings) කළමනාකරණය කරන්න.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('videos')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs rounded-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Tab 7 Videos (වීඩියෝ පාලනයට පිවිසෙන්න)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent Audit Trail */}
              <div className="p-6 rounded-sm bg-[#0c090a] border border-[#c99a45]/20">
                <h4 className="text-sm font-editorial font-bold text-[#f7e2a9] mb-3">
                  Recent Administrative Actions &amp; Audit Trail
                </h4>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-[#a89f91]">No recent audit logs.</p>
                ) : (
                  <div className="divide-y divide-white/5 text-xs">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <strong className="text-[#f7f3eb]">{log.action}</strong>
                          <span className="text-[#a89f91] block text-[11px]">{log.details}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#dfb56c]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FB BOOST AD CAMPAIGN BUILDER & LEAD FUNNEL */}
          {activeTab === 'campaigns' && (
            <div className="animate-in fade-in duration-300">
              <FBCampaignAdminManager
                onPreviewCampaign={(slug) => {
                  window.open(`/#promo/${slug}`, '_blank');
                }}
              />
            </div>
          )}

          {/* TAB 2: STUDENTS MANAGEMENT */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    Student Registry ({filteredRegistrations.length})
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Toggle course access, inspect details, verify payment, and send personalized WhatsApp confirmation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportRegistrationsToExcel(filteredRegistrations)}
                    className="px-3.5 py-2 bg-[#1c1214] hover:bg-[#241317] border border-[#dfb56c] text-[#f7e2a9] rounded-sm text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => exportRegistrationsToPDF(filteredRegistrations)}
                    className="px-3.5 py-2 bg-[#1c1214] hover:bg-[#241317] border border-[#dfb56c] text-[#f7e2a9] rounded-sm text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 text-[#a89f91] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, phone, reg no, district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:outline-none focus:border-[#dfb56c]"
                  />
                </div>

                <div>
                  <select
                    value={filterCourseType}
                    onChange={(e) => setFilterCourseType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                  >
                    <option value="ALL">All Course Types</option>
                    <option value="PHYSICAL CLASS">Physical Class</option>
                    <option value="ZOOM CLASS">Zoom Class</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                  >
                    <option value="ALL">All Locations</option>
                    <option value="KEGALLE">Kegalle</option>
                    <option value="KURUNEGALA">Kurunegala</option>
                    <option value="PILIYANDALA">Piliyandala</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">NEW</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
              </div>

              {/* Students Data Table */}
              <div className="rounded-sm border border-[#c99a45]/20 overflow-x-auto bg-[#0c090a]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1c1214] border-b border-[#c99a45]/30 text-[#dfb56c] font-mono uppercase text-[10px] tracking-wider">
                      <th className="p-3">Reg No</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Class Type</th>
                      <th className="p-3">Course Access</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#a89f91]">
                          No students found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((r) => (
                        <tr key={r.id} className="hover:bg-[#181113] transition-colors">
                          <td className="p-3 font-mono font-bold text-[#f7e2a9]">
                            {r.regNumber}
                          </td>
                          <td className="p-3 font-semibold text-[#f7f3eb]">
                            {r.fullName}
                          </td>
                          <td className="p-3 font-mono text-[#dfb56c]">
                            {r.whatsappNumber}
                          </td>
                          <td className="p-3 text-[#d5cfc4]">
                            {r.courseType} ({r.location || 'Online'})
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1 items-start">
                              <button
                                onClick={() =>
                                  toggleStudentCourseAccess(
                                    r.id,
                                    r.courseAccess === 'ACTIVE' ? 'LOCKED' : 'ACTIVE'
                                  )
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                  r.courseAccess === 'ACTIVE'
                                    ? 'bg-green-950/60 text-green-300 border-green-500'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                                }`}
                                title="Click to toggle course access"
                              >
                                {r.courseAccess === 'ACTIVE' ? '✓ LMS Active' : 'LMS Locked'}
                              </button>
                              <button
                                onClick={() =>
                                  toggleStudentBrandModuleAccess(
                                    r.id,
                                    !r.brandModuleApproved
                                  )
                                }
                                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-colors ${
                                  r.brandModuleApproved
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500'
                                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                                }`}
                                title="Click to approve or lock Brand Making Module 02 access"
                              >
                                {r.brandModuleApproved ? '👑 Brand Mod: Approved' : '+ Approve Brand Mod'}
                              </button>

                              {/* Month-by-Month Paid Access Quick Toggles (මාස අනුව සක්‍රිය කිරීම) */}
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[8px] font-mono text-[#a89f91] uppercase">Pay:</span>
                                {[1, 2, 3, 4, 5, 6].map((m) => {
                                  const studentPaidMonths = getStudentPaidMonths(r.id, r.courseId || 'course-01');
                                  const isPaid = studentPaidMonths.includes(m);
                                  return (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => toggleStudentPaidMonth(r.id, r.courseId || 'course-01', m, !isPaid)}
                                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border transition-colors cursor-pointer ${
                                        isPaid
                                          ? 'bg-green-950/80 text-green-300 border-green-500 hover:bg-red-950/80 hover:text-red-300'
                                          : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-green-950 hover:text-green-300 hover:border-green-600'
                                      }`}
                                      title={`Month 0${m}: ${isPaid ? 'Paid & Active (Click to Lock)' : 'Locked (Click to Activate for Student)'}`}
                                    >
                                      M{m}{isPaid ? '✓' : ''}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c1214] text-[#f7e2a9] border border-[#c99a45]/30">
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Send Personalized WhatsApp Confirmation */}
                              <a
                                href={getWhatsAppConfirmationUrl(r)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-black rounded"
                                title="Send Personalized WhatsApp Confirmation"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setSelectedReg(r)}
                                className="p-1.5 text-[#dfb56c] hover:bg-white/10 rounded"
                                title="View Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingReg(r)}
                                className="p-1.5 text-blue-400 hover:bg-white/10 rounded"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete student record ${r.regNumber}?`)) {
                                    deleteRegistration(r.id);
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT VERIFICATION SYSTEM */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    Bank Deposit Slips Verification ({paymentSlips.length})
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Visually inspect bank slips and approve payments to automatically unlock course access.
                  </p>
                </div>
                <button
                  onClick={() => exportPaymentsToExcel(paymentSlips)}
                  className="px-3.5 py-2 bg-[#1c1214] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Export Payments (.xlsx)</span>
                </button>
              </div>

              {paymentSlips.length === 0 ? (
                <div className="p-8 rounded-sm bg-[#0c090a] border border-white/10 text-center text-xs text-[#a89f91]">
                  No payment slips submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentSlips.map((slip) => (
                    <div
                      key={slip.id}
                      className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/25 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-xs text-[#dfb56c]">
                            {slip.regNumber}
                          </span>
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

                        <h4 className="text-sm font-semibold text-[#f7f3eb]">
                          {slip.studentName} ({slip.whatsappNumber})
                        </h4>
                        <p className="text-xs text-[#d5cfc4] mt-1">
                          Amount: <strong className="text-[#f7e2a9]">Rs. {slip.amount.toLocaleString()}</strong> • Type: {slip.paymentType} • Date: {slip.paymentDate}
                        </p>
                        <span className="text-[11px] text-[#a89f91] block mt-0.5">
                          Bank: {slip.bankName} • Ref: {slip.transactionReference}
                        </span>

                        {/* Slip Image Thumbnail */}
                        <div
                          onClick={() => setViewSlipModal(slip)}
                          className="mt-3 cursor-pointer group relative aspect-[16/9] rounded overflow-hidden bg-black border border-white/10"
                        >
                          <img
                            src={slip.slipUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'}
                            alt="Deposit slip"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white font-bold flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Inspect Full Slip
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Decision Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        {slip.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => approvePaymentSlip(slip.id, slip.regNumber)}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 text-white font-bold text-xs rounded-sm shadow-md flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>APPROVE PAYMENT</span>
                            </button>
                            <button
                              onClick={() => rejectPaymentSlip(slip.id)}
                              className="px-3 py-2 bg-red-950/60 border border-red-500 text-red-300 font-bold text-xs rounded-sm"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] text-[#a89f91]">
                              Status: <strong>{slip.status}</strong>
                            </span>
                            {/* Send WhatsApp Confirmation Button */}
                            {slip.status === 'VERIFIED' && (
                              <a
                                href={`https://wa.me/${slip.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${slip.studentName}, your payment for CEYLON STYLE STUDIO (Reg No: ${slip.regNumber}) has been verified. Your Private Recorded Lessons are now unlocked in your Student LMS Portal!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#25D366] text-black font-bold text-xs rounded-sm flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Send WhatsApp Confirmation</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: COURSES MANAGEMENT & DYNAMIC CMS */}
          {activeTab === 'courses' && (
            <div className="animate-in fade-in duration-300">
              <CourseCMSAdminManager />
            </div>
          )}

          {/* TAB 4: LMS RECORDED LESSONS CMS */}
          {activeTab === 'lessons' && (() => {
            const activeCourseItem = courses.find((c) => c.id === lessonCourseFilter);
            const filteredLessons = lessons.filter((l) => {
              if (lessonCourseFilter !== 'ALL' && l.courseId !== lessonCourseFilter) return false;
              if (lessonMonthFilter !== 0 && (l.month ?? 1) !== lessonMonthFilter) return false;
              if (lessonSearchTerm.trim()) {
                const q = lessonSearchTerm.toLowerCase();
                const matchTitle = l.title?.toLowerCase().includes(q) || l.titleSinhala?.toLowerCase().includes(q);
                const matchDesc = l.description?.toLowerCase().includes(q) || l.descriptionSinhala?.toLowerCase().includes(q);
                const matchMod = l.moduleTitle?.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchMod) return false;
              }
              return true;
            });

            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                  <div>
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#dfb56c]" />
                      <span>Course Videos, Study PDFs &amp; Lesson Diagrams CMS</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#540d18] border border-[#dfb56c]/40 text-[#f7e2a9]">
                        {filteredLessons.length} of {lessons.length} Lessons
                      </span>
                    </h3>
                    <p className="text-xs text-[#a89f91] mt-0.5 font-sinhala">
                      එක් එක් පාඨමාලාවට අදාළව වීඩියෝ (Videos), බාගත හැකි PDF සටහන් සහ තාක්ෂණික මෝස්තර සැලසුම් (Diagrams) මාස අනුව වෙන් වෙන්ව කළමනාකරණය කරන්න.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const targetCId = lessonCourseFilter !== 'ALL' ? lessonCourseFilter : (courses[0]?.id || 'course-01');
                      const targetCourse = courses.find((c) => c.id === targetCId);
                      setEditingLesson({
                        id: `les-${Date.now()}`,
                        courseId: targetCId,
                        courseTitle: targetCourse?.title || courses[0]?.title || '6-Month Professional Fashion & Branding Diploma',
                        month: lessonMonthFilter !== 0 ? lessonMonthFilter : 1,
                        moduleId: modules[0]?.id || 'mod-01',
                        moduleNumber: modules[0]?.number || '01',
                        moduleTitle: modules[0]?.title || 'Body Measurements',
                        lessonNumber: String(lessons.length + 1).padStart(2, '0'),
                        title: '',
                        titleSinhala: '',
                        description: '',
                        descriptionSinhala: '',
                        videoUrl: '',
                        duration: '25:00',
                        notes: '',
                        pdfTitle: '',
                        pdfUrl: '',
                        imageUrls: [],
                        isPublished: true,
                        order: lessons.length + 1,
                      });
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-lg hover:brightness-110 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Private Lesson
                  </button>
                </div>

                {/* 1. SEPARATE COURSE FILTER TABS (පාඨමාලා වෙන් වෙන්ව තේරීම) */}
                <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#dfb56c]" />
                      Dynamic Course Program Tabs (පාඨමාලා අනුව වෙන් වූ ටැබ්):
                    </span>
                    <span className="text-[10px] text-[#a89f91] font-mono">
                      {lessonCourseFilter === 'ALL'
                        ? 'Showing All Courses'
                        : `Active Tab: ${activeCourseItem?.title || 'Selected Course'}`}
                    </span>
                  </div>

                  {/* Course Dynamic Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setLessonCourseFilter('ALL')}
                      className={`px-3.5 py-2 rounded-sm text-xs font-mono uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        lessonCourseFilter === 'ALL'
                          ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-md'
                          : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>All Courses</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/60 border border-white/10">
                        {lessons.length}
                      </span>
                    </button>

                    {courses.map((c) => {
                      const count = lessons.filter((l) => l.courseId === c.id).length;
                      const isSelected = lessonCourseFilter === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setLessonCourseFilter(c.id)}
                          className={`px-3.5 py-2 rounded-sm text-xs font-medium tracking-wide shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-md ring-1 ring-[#dfb56c]/30'
                              : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate max-w-[200px]">{c.title}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                              isSelected ? 'bg-black/60 text-[#dfb56c]' : 'bg-black/40 text-white/60'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Header Banner for Active Selected Course */}
                {activeCourseItem && lessonCourseFilter !== 'ALL' && (
                  <div className="p-4 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#141011] border border-[#dfb56c]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c] text-black">
                          ACTIVE COURSE
                        </span>
                        <span className="text-xs font-mono text-[#a89f91]">
                          {activeCourseItem.badge || activeCourseItem.category || 'Diploma'}
                        </span>
                      </div>
                      <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                        {activeCourseItem.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] font-mono text-[#d5cfc4]">
                        <span>⏱ {activeCourseItem.duration || '6 Months'}</span>
                        <span>•</span>
                        <span>💵 LKR {(activeCourseItem.zoomFee || activeCourseItem.physicalFee || 2500).toLocaleString()}/mo</span>
                        <span>•</span>
                        <span className="text-[#dfb56c] font-bold">
                          👥 Enrolled: {registrations.filter((r) => r.courseId === activeCourseItem.id || r.courseType === activeCourseItem.title).length} Students
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">
                          📚 Lessons: {lessons.filter((l) => l.courseId === activeCourseItem.id).length}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const existingCount = lessons.filter((l) => l.courseId === activeCourseItem.id).length;
                          setEditingLesson({
                            id: `les-${Date.now()}`,
                            courseId: activeCourseItem.id,
                            courseTitle: activeCourseItem.title,
                            month: lessonMonthFilter !== 0 ? lessonMonthFilter : 1,
                            moduleId: modules[0]?.id || 'mod-01',
                            moduleNumber: modules[0]?.number || '01',
                            moduleTitle: modules[0]?.title || 'Body Measurements',
                            lessonNumber: String(existingCount + 1).padStart(2, '0'),
                            title: '',
                            titleSinhala: '',
                            description: '',
                            descriptionSinhala: '',
                            videoUrl: '',
                            videoUrls: [{ id: `vid-${Date.now()}-1`, title: 'Part 01: Demonstration', videoUrl: '', duration: '20:00' }],
                            duration: '20:00',
                            notes: '',
                            pdfTitle: '',
                            pdfUrl: '',
                            pdfMaterials: [],
                            imageUrls: [],
                            isPublished: true,
                            order: existingCount + 1,
                          });
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase rounded-sm hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson to This Course</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. MONTH FILTER TABS & SEARCH BAR (මාසය අනුව පෙරීම සහ සෙවීම) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Month Buttons (0 = All, 1..6 = Specific Month) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setLessonMonthFilter(0)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                        lessonMonthFilter === 0
                          ? 'bg-[#dfb56c] text-black font-bold'
                          : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white'
                      }`}
                    >
                      All Months
                    </button>

                    {[1, 2, 3, 4, 5, 6].map((m) => {
                      const isSelected = lessonMonthFilter === m;
                      const monthCount = lessons.filter((l) => {
                        const matchC = lessonCourseFilter === 'ALL' || l.courseId === lessonCourseFilter;
                        return matchC && (l.month ?? 1) === m;
                      }).length;

                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setLessonMonthFilter(m)}
                          className={`px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#dfb56c] text-black font-bold'
                              : 'bg-[#141011] text-[#a89f91] border border-white/10 hover:text-white'
                          }`}
                        >
                          <span>Month 0{m}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-black/80' : 'text-[#dfb56c]'}`}>
                            ({monthCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lessonSearchTerm}
                      onChange={(e) => setLessonSearchTerm(e.target.value)}
                      placeholder="Search lesson, topic or module..."
                      className="w-full pl-9 pr-3 py-1.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none font-mono"
                    />
                    {lessonSearchTerm && (
                      <button
                        onClick={() => setLessonSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#a89f91] hover:text-white cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. LESSON CARDS GRID */}
                {filteredLessons.length === 0 ? (
                  <div className="p-12 text-center rounded-sm bg-[#0c090a] border border-dashed border-[#c99a45]/30 space-y-3">
                    <BookOpen className="w-8 h-8 text-[#a89f91] mx-auto opacity-40" />
                    <h4 className="text-sm font-bold text-[#f7f3eb]">
                      No lessons found for this course and month selection
                    </h4>
                    <p className="text-xs text-[#a89f91] font-sinhala max-w-md mx-auto">
                      මෙම පාඨමාලාවට හෝ මාසයට අදාළව පාඩම් මෙතෙක් ඇතුළත් කර නොමැත. "Add Private Lesson" බොත්තම ක්ලික් කර නව පාඩමක් (Videos, PDFs &amp; Diagrams සමඟ) ඇතුළත් කරන්න.
                    </p>
                    <button
                      onClick={() => {
                        const targetCId = lessonCourseFilter !== 'ALL' ? lessonCourseFilter : (courses[0]?.id || 'course-01');
                        const targetCourse = courses.find((c) => c.id === targetCId);
                        setEditingLesson({
                          id: `les-${Date.now()}`,
                          courseId: targetCId,
                          courseTitle: targetCourse?.title || courses[0]?.title || 'Course',
                          month: lessonMonthFilter !== 0 ? lessonMonthFilter : 1,
                          moduleId: modules[0]?.id || 'mod-01',
                          moduleNumber: modules[0]?.number || '01',
                          moduleTitle: modules[0]?.title || 'Body Measurements',
                          lessonNumber: String(lessons.length + 1).padStart(2, '0'),
                          title: '',
                          titleSinhala: '',
                          description: '',
                          descriptionSinhala: '',
                          videoUrl: '',
                          videoUrls: [{ id: `vid-${Date.now()}-1`, title: 'Part 01: Demonstration', videoUrl: '', duration: '20:00' }],
                          duration: '20:00',
                          notes: '',
                          pdfTitle: '',
                          pdfUrl: '',
                          pdfMaterials: [],
                          imageUrls: [],
                          isPublished: true,
                          order: lessons.length + 1,
                        });
                      }}
                      className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase rounded-sm inline-flex items-center gap-1.5 hover:bg-[#6e1322] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson for {activeCourseItem?.title || 'This Course'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLessons.map((l) => {
                      const vidCount = (l.videoUrls && l.videoUrls.length > 0) ? l.videoUrls.length : (l.videoUrl ? 1 : 0);
                      const pdfCount = (l.pdfMaterials && l.pdfMaterials.length > 0) ? l.pdfMaterials.length : (l.pdfUrl ? 1 : 0);
                      const imgCount = l.imageUrls?.length || 0;

                      return (
                        <div
                          key={l.id}
                          className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col justify-between space-y-3 group hover:border-[#dfb56c]/60 transition-all shadow-md"
                        >
                          <div>
                            {/* Card Top: Lesson #, Month, Course & Status */}
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c]/20 text-[#dfb56c] border border-[#dfb56c]/40">
                                  Month 0{l.month || 1}
                                </span>
                                <span className="text-[10px] font-mono text-[#a89f91]">
                                  Lesson {l.lessonNumber}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#a89f91] font-mono">⏱ {l.duration}</span>
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                                    l.isPublished !== false
                                      ? 'bg-green-950/60 text-green-300 border-green-500/40'
                                      : 'bg-red-950/60 text-red-300 border-red-500/40'
                                  }`}
                                >
                                  {l.isPublished !== false ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>

                            {/* Associated Course Tag */}
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#f7e2a9] truncate max-w-[280px]">
                                📚 {l.courseTitle || 'Course Program'}
                              </span>
                              <span className="text-[9px] font-mono text-[#a89f91] truncate">
                                • {l.moduleTitle}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="text-sm font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors leading-snug">
                              {l.title}
                            </h4>
                            {l.titleSinhala && l.titleSinhala !== l.title && (
                              <p className="text-xs text-[#d5cfc4] font-sinhala mt-0.5">
                                {l.titleSinhala}
                              </p>
                            )}

                            {l.description && (
                              <p className="text-xs text-[#a89f91] line-clamp-2 mt-1.5 leading-relaxed">
                                {l.description}
                              </p>
                            )}

                            {/* Attached Multi-Media Indicators */}
                            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono">
                              {/* Video Count */}
                              {vidCount > 0 ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 font-bold">
                                  <Video className="w-3 h-3 text-emerald-400" />
                                  <span>{vidCount} {vidCount === 1 ? 'YouTube Video' : 'YouTube Videos'}</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-500">
                                  No Video
                                </span>
                              )}

                              {/* PDF Count */}
                              {pdfCount > 0 ? (
                                <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 text-amber-300 flex items-center gap-1 font-bold">
                                  <FileText className="w-3 h-3 text-amber-400" />
                                  <span>{pdfCount} {pdfCount === 1 ? 'PDF Handout' : 'PDF Handouts'}</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-500">
                                  No PDF
                                </span>
                              )}

                              {/* Diagrams Count */}
                              {imgCount > 0 ? (
                                <span className="px-2 py-0.5 rounded bg-blue-950/50 border border-blue-500/40 text-blue-300 flex items-center gap-1 font-bold">
                                  <ImageIcon className="w-3 h-3 text-blue-400" />
                                  <span>{imgCount} {imgCount === 1 ? 'Diagram' : 'Diagrams'}</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-500">
                                  No Diagrams
                                </span>
                              )}
                            </div>

                            {/* Thumbnail Strip of Attached Pattern Diagrams */}
                            {l.imageUrls && l.imageUrls.length > 0 && (
                              <div className="flex items-center gap-1.5 pt-2 overflow-x-auto">
                                {l.imageUrls.slice(0, 4).map((img, i) => (
                                  <img
                                    key={i}
                                    src={img}
                                    alt="Pattern diagram"
                                    className="w-10 h-10 object-cover rounded border border-white/15 bg-black"
                                  />
                                ))}
                                {l.imageUrls.length > 4 && (
                                  <span className="text-[10px] font-mono text-[#a89f91] px-1">
                                    +{l.imageUrls.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Card Bottom: Actions */}
                          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-[#dfb56c] font-mono">
                              Month 0{l.month || 1} • {l.order ? `Order: ${l.order}` : ''}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const vList = (l.videoUrls && l.videoUrls.length > 0)
                                    ? l.videoUrls
                                    : (l.videoUrl ? [{ id: `vid-${l.id}-1`, title: l.title || 'Part 01: Main Video', videoUrl: l.videoUrl, videoId: l.videoId, duration: l.duration || '20:00' }] : [{ id: `vid-${Date.now()}-1`, title: 'Part 01: Main Video', videoUrl: '', duration: '20:00' }]);

                                  const pList = (l.pdfMaterials && l.pdfMaterials.length > 0)
                                    ? l.pdfMaterials
                                    : (l.pdfUrl ? [{ id: `pdf-${l.id}-1`, title: l.pdfTitle || 'Lesson Study Notes.pdf', url: l.pdfUrl, size: 'PDF Handout' }] : []);

                                  setEditingLesson({
                                    ...l,
                                    videoUrls: vList,
                                    pdfMaterials: pList,
                                    imageUrls: l.imageUrls || [],
                                  });
                                }}
                                className="px-3 py-1.5 bg-[#141011] hover:bg-[#1f1618] border border-white/15 text-xs text-[#dfb56c] hover:border-[#dfb56c] rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer"
                              >
                                <Edit className="w-3 h-3" /> Edit Lesson &amp; Materials
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete lesson "${l.title}"?`)) {
                                    deleteLesson(l.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-red-950/50 text-red-400 rounded transition-colors cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 5: WEBSITE CONTENT & FEES CMS */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                      Hero Media, Tuition Fees &amp; Bank Settings
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-950/60 text-green-300 border border-green-500/40 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Cloud Firestore Synced
                    </span>
                  </div>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Live database settings: brand logo, hero background media, monthly tuition fees, official bank accounts, and CTAs.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {saveSuccessMsg && (
                    <span className="text-xs text-green-400 font-bold animate-pulse">
                      {saveSuccessMsg}
                    </span>
                  )}
                  <button
                    onClick={handleSaveAllSettings}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'Saving...' : 'Save to Database'}</span>
                  </button>
                </div>
              </div>

              {/* BRAND IDENTITY & CUSTOM LOGO CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                    <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold">
                      Brand Logo &amp; Identity (Backend Logo Manager)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a89f91] font-mono">
                    {settingsForm.logoUrl ? '✓ Custom Logo Active' : 'Default Monogram Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Brand Name (Displayed in Header / Footer)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.brandName || ''}
                      placeholder="e.g. CEYLON STYLE STUDIO"
                      onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Logo Image URL (Direct Link to Image)
                    </label>
                    <input
                      type="url"
                      value={settingsForm.logoUrl || ''}
                      placeholder="https://... or upload below"
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, logoUrl: e.target.value });
                        setHasUserEditedSettings(true);
                      }}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                  </div>
                </div>

                {/* File Upload for Logo + Live Preview */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded bg-[#141011] border border-white/10">
                  <div className="flex items-center gap-3">
                    {/* Live Logo Preview Box */}
                    <div className="w-16 h-16 rounded bg-black/70 border border-[#c99a45]/40 flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-inner">
                      {settingsForm.logoUrl && settingsForm.logoUrl.trim() ? (
                        <img
                          src={settingsForm.logoUrl.trim()}
                          alt="Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="font-editorial text-sm font-bold text-[#f7e2a9]">CSS</span>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#f7f3eb] block">
                        {settingsForm.logoUrl ? 'Active Custom Brand Logo' : 'Default Monogram Badge'}
                      </span>
                      <span className="text-[10px] text-[#a89f91] block mt-0.5">
                        Shows in top navigation bar and footer across desktop &amp; mobile.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="btn-3d-secondary px-3 py-1.5 text-xs rounded cursor-pointer">
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file, 360, 360, 0.9);
                              setSettingsForm({ ...settingsForm, logoUrl: compressed });
                              setHasUserEditedSettings(true);
                            } catch (_) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const res = ev.target?.result as string;
                                if (res) {
                                  setSettingsForm({ ...settingsForm, logoUrl: res });
                                  setHasUserEditedSettings(true);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                      />
                    </label>

                    {settingsForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsForm({ ...settingsForm, logoUrl: '' });
                          setHasUserEditedSettings(true);
                        }}
                        className="btn-3d-secondary px-3 py-1.5 text-xs text-red-400 rounded cursor-pointer"
                      >
                        Reset Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* COURSE COMPLETION RECOGNIZED CERTIFICATE CMS (පාඨමාලාවෙන් පසු පිරිනැමෙන වටිනා සහතිකය) */}
              {/* ======================================================== */}
              <div className="p-5 rounded-sm bg-[#0c090a] border-2 border-[#dfb56c]/40 space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#dfb56c]" />
                    <div>
                      <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                        පාඨමාලාවෙන් පසු පිරිනැමෙන වටිනා සහතික කළමනාකරණය (Course Certificate Showcase CMS)
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Upload or set the official recognized certificate photo awarded to graduates after course completion.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold">
                    Official Certificate CMS
                  </span>
                </div>

                {/* Certificate Image Upload & Preview */}
                <div className="p-4 rounded bg-[#141011] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Preview box */}
                    <div className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden bg-black border-2 border-[#dfb56c]/40 relative shadow-lg">
                      <img
                        src={settingsForm.courseCertificateImageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=85'}
                        alt="Course Certificate"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-0.5 rounded text-[10px] text-[#dfb56c] font-mono">
                        Preview
                      </div>
                    </div>

                    {/* Image Controls */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <label className="block text-[11px] text-[#dfb56c] font-mono font-bold mb-1">
                          Certificate Image File Upload / URL (සහතිකයේ ඡායාරූපය)
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="btn-3d-secondary px-3 py-1.5 text-xs rounded cursor-pointer flex items-center gap-1.5 bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] hover:bg-[#dfb56c] hover:text-black transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Certificate Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressImage(file, 1400, 1000, 0.88);
                                    setSettingsForm({ ...settingsForm, courseCertificateImageUrl: compressed });
                                    setHasUserEditedSettings(true);
                                  } catch (_) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res) {
                                        setSettingsForm({ ...settingsForm, courseCertificateImageUrl: res });
                                        setHasUserEditedSettings(true);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                          </label>

                          {settingsForm.courseCertificateImageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setSettingsForm({ ...settingsForm, courseCertificateImageUrl: '' });
                                setHasUserEditedSettings(true);
                              }}
                              className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 rounded border border-red-500/20 bg-red-950/20 cursor-pointer"
                            >
                              Reset Image
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#a89f91] font-mono mb-1">
                          Or Direct Certificate Image URL:
                        </label>
                        <input
                          type="url"
                          value={settingsForm.courseCertificateImageUrl || ''}
                          placeholder="https://images.unsplash.com/... or paste image URL"
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, courseCertificateImageUrl: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="w-full px-3 py-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Certificate Title (English)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.courseCertificateTitle || 'Accredited Professional Fashion & Branding Diploma'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateTitle: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Certificate Title (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.courseCertificateTitleSinhala || 'පාඨමාලාවෙන් පසු පිරිනැමෙන වටිනා නිල ඩිප්ලෝමා සහතිකය'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateTitleSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9] font-sinhala"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Certificate Subtitle (English)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.courseCertificateSubtitle || 'Government Registered • Industry Recognized • Internationally Accredited'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateSubtitle: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#a89f91]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Certificate Subtitle (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.courseCertificateSubtitleSinhala || 'ශ්‍රී ලංකා රජයේ ලියාපදිංචි • ක්ෂේත්‍රයේ ඉහළම පිළිගැනීම • ජාත්‍යන්තර ප්‍රතීතනය'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateSubtitleSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#a89f91] font-sinhala"
                      />
                    </div>
                  </div>

                  {/* Description Sinhala & English */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Description (Sinhala)
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.courseCertificateDescriptionSinhala || 'මාස 6ක පූර්ණ විලාසිතා නිර්මාණකරණ හා සන්නාමකරණ ඩිප්ලෝමා පාඨමාලාව සාර්ථකව අවසන් කරන සෑම සිසුවෙකුටම, රජයේ ලියාපදිංචි අංකය, QR සත්‍යාපන කේතය සහ අධ්‍යක්ෂ මණ්ඩල නිල මුද්‍රාව සහිත මෙම වටිනා වෘත්තීය ඩිප්ලෝමා සහතිකය පිරිනැමේ.'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateDescriptionSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-sinhala"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.courseCertificateDescription || 'Upon successful graduation from the master curriculum, each graduate is awarded an official accredited Professional Diploma complete with secure QR credential verification and gold embossed seal.'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, courseCertificateDescription: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* GRAND RUNWAY FASHION SHOW SHOWCASE CMS (පාඨමාලාවෙන් පසු විලාසිතා දැක්ම) */}
              {/* ======================================================== */}
              <div className="p-5 rounded-sm bg-[#0c090a] border-2 border-[#dfb56c]/40 space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#dfb56c]" />
                    <div>
                      <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                        පාඨමාලාව අවසානයේ පැවැත්වෙන විලාසිතා දැක්ම (Grand Runway Fashion Show CMS)
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Manage runway fashion show photo, title, venue, and gala details presented to graduating students.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38070e] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold">
                    Runway Gala CMS
                  </span>
                </div>

                {/* Fashion Show Image Upload & Preview */}
                <div className="p-4 rounded bg-[#141011] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Preview box */}
                    <div className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden bg-black border-2 border-[#dfb56c]/40 relative shadow-lg">
                      <img
                        src={settingsForm.fashionShowImageUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'}
                        alt="Runway Fashion Show"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-0.5 rounded text-[10px] text-[#dfb56c] font-mono">
                        Runway Photo
                      </div>
                    </div>

                    {/* Image Controls */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <label className="block text-[11px] text-[#dfb56c] font-mono font-bold mb-1">
                          Runway Fashion Show Photo Upload / URL (විලාසිතා දැක්මේ ඡායාරූපය)
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="btn-3d-secondary px-3 py-1.5 text-xs rounded cursor-pointer flex items-center gap-1.5 bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] hover:bg-[#dfb56c] hover:text-black transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Runway Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressImage(file, 1400, 1000, 0.88);
                                    setSettingsForm({ ...settingsForm, fashionShowImageUrl: compressed });
                                    setHasUserEditedSettings(true);
                                  } catch (_) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res) {
                                        setSettingsForm({ ...settingsForm, fashionShowImageUrl: res });
                                        setHasUserEditedSettings(true);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                          </label>

                          {settingsForm.fashionShowImageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setSettingsForm({ ...settingsForm, fashionShowImageUrl: '' });
                                setHasUserEditedSettings(true);
                              }}
                              className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 rounded border border-red-500/20 bg-red-950/20 cursor-pointer"
                            >
                              Reset Image
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#a89f91] font-mono mb-1">
                          Or Direct Runway Image URL:
                        </label>
                        <input
                          type="url"
                          value={settingsForm.fashionShowImageUrl || ''}
                          placeholder="https://images.unsplash.com/... or paste image URL"
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, fashionShowImageUrl: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="w-full px-3 py-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Fashion Show Title (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.fashionShowTitleSinhala || 'පාඨමාලාව අවසානයේ පැවැත්වෙන දැවැන්ත විලාසිතා දැක්ම (Runway Fashion Show)'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowTitleSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9] font-sinhala"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Fashion Show Title (English)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.fashionShowTitle || 'Grand Graduate Runway Gala & Fashion Show'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowTitle: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Venue & Date (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.fashionShowDateVenueSinhala || 'වාර්ෂික විලාසිතා දැක්ම • ග්‍රෑන්ඩ් බෝල්රූම්, කොළඹ'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowDateVenueSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#a89f91] font-sinhala"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Venue & Date (English)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.fashionShowDateVenue || 'Annual Runway Gala • Grand Ballroom, Colombo'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowDateVenue: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#a89f91]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Fashion Show Description (Sinhala)
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.fashionShowDescriptionSinhala || 'පාඨමාලාව සාර්ථකව නිම කරන සෑම සිසුවෙකුටම, තමන් විසින්ම සැලසුම් කර නිමවන ලද අංගසම්පූර්ණ විලාසිතා එකතුව ක්ෂේත්‍රයේ ප්‍රවීණ නිරූපණ ශිල්පීන් සමගින්, ප්‍රධාන පෙළේ මාධ්‍ය නාලිකා සහ විලාසිතා ගැනුම්කරුවන් ඉදිරියේ පැවැත්වෙන වාර්ෂික විලාසිතා දැක්මෙහි ප්‍රදර්ශනය කිරීමේ සුවිශේෂී වරප්‍රසාදය හිමිවේ.'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowDescriptionSinhala: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-sinhala"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                        Fashion Show Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.fashionShowDescription || 'Every graduating designer unveils their signature capsule collection on the grand runway with professional models, hair & makeup teams, and live boutique buyers.'}
                        onChange={(e) => {
                          setSettingsForm({ ...settingsForm, fashionShowDescription: e.target.value });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* BODY MEASUREMENTS CMS (ඇඳුම් පැටර්න් හා මැනික්වින් ඩමි ස්ටුඩියෝ - ශරීර මිණුම් කළමනාකරණය) */}
              {/* ======================================================== */}
              <div className="p-5 rounded-sm bg-[#0c090a] border-2 border-[#dfb56c]/40 space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#dfb56c]" />
                    <div>
                      <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                        ඇඳුම් පැටර්න් හා මැනික්වින් ඩමි - ශරීර මිණුම් කළමනාකරණය (Body Measurements CMS)
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Add, edit, upload guide photos, and manage anatomical body measurements shown in the Pattern &amp; Dummy Studio tab.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                          ? settingsForm.bodyMeasurements
                          : [...DEFAULT_BODY_MEASUREMENTS];
                        const newId = `bm-${Date.now().toString().slice(-4)}`;
                        const newItem: BodyMeasurementItem = {
                          id: newId,
                          name: 'New Custom Measurement',
                          nameSinhala: 'නව ශරීර මිණුම',
                          category: 'circumference',
                          imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
                          howToMeasure: 'Place measuring tape flat and measure comfortably without pulling too tight.',
                          howToMeasureSinhala: 'මිණුම් පටිය ශරීරයට මට්ටම්ව තබා ඕනෑවට වඩා තද නොවන සේ මනින්න.',
                          standardRange: '30" - 36" (76 - 91 cm)',
                          tip: 'Always keep client in relaxed posture while recording this dimension.',
                          tipSinhala: 'මිණුම ගන්නා විට සේවාදායකයා සාමාන්‍ය සැහැල්ලු ඉරියව්වෙන් සිටිය යුතුය.',
                          patternImpact: 'Crucial for accurate garment ease distribution and pattern balance.',
                          patternImpactSinhala: 'පැටර්නයේ නිවැරදි ලිහිල් බව සහ හැඩය රැඳවීමට උපකාරී වේ.',
                        };
                        setSettingsForm({ ...settingsForm, bodyMeasurements: [newItem, ...current] });
                        setHasUserEditedSettings(true);
                      }}
                      className="px-3 py-1.5 rounded bg-[#dfb56c] text-[#0c090a] font-bold text-xs hover:bg-[#f7e2a9] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Measurement</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset all body measurements back to the 10 master tailoring defaults?')) {
                          setSettingsForm({ ...settingsForm, bodyMeasurements: [...DEFAULT_BODY_MEASUREMENTS] });
                          setHasUserEditedSettings(true);
                        }
                      }}
                      className="px-3 py-1.5 rounded bg-[#1e1316] text-[#dfb56c] border border-[#dfb56c]/30 text-xs hover:bg-[#38070e] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#a89f91] font-sinhala">
                  මෙහි ඇති ඕනෑම ශරීර මිණුමක ඡායාරූපය (Guide Image), නම (English/Sinhala), මිණිය යුතු ආකාරය (How to measure), උපදෙස් (Tailor tips) සහ පැටර්නයට බලපාන ආකාරය පහසුවෙන් Upload කර වෙනස් කළ හැක. පරිශීලකයා Studio එකේදී මෙම මිණුම තේරූ විට මෙම ඡායාරූපය හා විස්තර ක්ෂණිකව දිස්වේ.
                </p>

                {/* List of body measurement cards */}
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {(settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                    ? settingsForm.bodyMeasurements
                    : DEFAULT_BODY_MEASUREMENTS
                  ).map((bm, index) => (
                    <div
                      key={bm.id}
                      className="p-4 rounded-lg bg-[#141011] border border-[#dfb56c]/30 space-y-4 hover:border-[#dfb56c] transition-all shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                          {/* Image preview with upload trigger */}
                          <div className="w-16 h-16 rounded-lg bg-black border-2 border-[#dfb56c]/40 overflow-hidden relative group shrink-0">
                            <img
                              src={bm.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'}
                              alt={bm.name}
                              className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-mono">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const compressed = await compressImage(file, 900, 700, 0.88);
                                      const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                        ? [...settingsForm.bodyMeasurements]
                                        : [...DEFAULT_BODY_MEASUREMENTS];
                                      current[index] = { ...bm, imageUrl: compressed };
                                      setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                                      setHasUserEditedSettings(true);
                                    } catch (_) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const res = ev.target?.result as string;
                                        if (res) {
                                          const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                            ? [...settingsForm.bodyMeasurements]
                                            : [...DEFAULT_BODY_MEASUREMENTS];
                                          current[index] = { ...bm, imageUrl: res };
                                          setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                                          setHasUserEditedSettings(true);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38070e] text-[#dfb56c] font-bold border border-[#dfb56c]/30 uppercase">
                                #{index + 1} • {bm.category}
                              </span>
                              <span className="text-xs font-mono text-[#a89f91]">
                                {bm.standardRange}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#f7e2a9] font-sinhala mt-0.5">
                              {bm.nameSinhala} • {bm.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {/* File upload button */}
                          <label className="px-2.5 py-1 rounded bg-[#1e1316] hover:bg-[#dfb56c] text-[#dfb56c] hover:text-black border border-[#dfb56c]/40 text-xs transition-all cursor-pointer flex items-center gap-1 font-mono">
                            <Upload className="w-3 h-3" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressImage(file, 900, 700, 0.88);
                                    const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                      ? [...settingsForm.bodyMeasurements]
                                      : [...DEFAULT_BODY_MEASUREMENTS];
                                    current[index] = { ...bm, imageUrl: compressed };
                                    setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                                    setHasUserEditedSettings(true);
                                  } catch (_) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res) {
                                        const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                          ? [...settingsForm.bodyMeasurements]
                                          : [...DEFAULT_BODY_MEASUREMENTS];
                                        current[index] = { ...bm, imageUrl: res };
                                        setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                                        setHasUserEditedSettings(true);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                          </label>

                          {/* Delete measurement */}
                          <button
                            type="button"
                            onClick={() => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              if (current.length <= 1) {
                                alert('At least one body measurement must remain.');
                                return;
                              }
                              const filtered = current.filter((_, i) => i !== index);
                              setSettingsForm({ ...settingsForm, bodyMeasurements: filtered });
                              setHasUserEditedSettings(true);
                            }}
                            className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                            title="Delete Measurement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            Name (English)
                          </label>
                          <input
                            type="text"
                            value={bm.name}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, name: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            Name (Sinhala)
                          </label>
                          <input
                            type="text"
                            value={bm.nameSinhala}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, nameSinhala: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7e2a9] font-sinhala"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            Category
                          </label>
                          <select
                            value={bm.category}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, category: e.target.value as any };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#dfb56c]"
                          >
                            <option value="circumference">Circumference (වට ප්‍රමාණ)</option>
                            <option value="upper">Upper Body (ඉහළ බඳ)</option>
                            <option value="length">Length (දිග ප්‍රමාණ)</option>
                            <option value="general">General (සාමාන්‍ය)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            Standard Range (e.g. 34"-40")
                          </label>
                          <input
                            type="text"
                            value={bm.standardRange}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, standardRange: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#dfb56c] font-mono"
                          />
                        </div>
                      </div>

                      {/* Image URL direct input */}
                      <div>
                        <label className="block text-[10px] text-[#a89f91] font-mono mb-1">
                          Image Guide URL:
                        </label>
                        <input
                          type="url"
                          value={bm.imageUrl}
                          onChange={(e) => {
                            const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                              ? [...settingsForm.bodyMeasurements]
                              : [...DEFAULT_BODY_MEASUREMENTS];
                            current[index] = { ...bm, imageUrl: e.target.value };
                            setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                            setHasUserEditedSettings(true);
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#a89f91] focus:border-[#dfb56c] outline-none"
                        />
                      </div>

                      {/* Instructions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            How to Measure (Sinhala)
                          </label>
                          <textarea
                            rows={2}
                            value={bm.howToMeasureSinhala}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, howToMeasureSinhala: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-sinhala"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#a89f91] font-mono uppercase mb-1">
                            How to Measure (English)
                          </label>
                          <textarea
                            rows={2}
                            value={bm.howToMeasure}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, howToMeasure: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                          />
                        </div>
                      </div>

                      {/* Atelier Tip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-[#dfb56c] font-mono uppercase mb-1">
                            Master Atelier Tip (Sinhala)
                          </label>
                          <input
                            type="text"
                            value={bm.tipSinhala}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, tipSinhala: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-[#dfb56c]/20 rounded text-xs text-[#f7e2a9] font-sinhala"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#dfb56c] font-mono uppercase mb-1">
                            Master Atelier Tip (English)
                          </label>
                          <input
                            type="text"
                            value={bm.tip}
                            onChange={(e) => {
                              const current = settingsForm.bodyMeasurements && settingsForm.bodyMeasurements.length > 0
                                ? [...settingsForm.bodyMeasurements]
                                : [...DEFAULT_BODY_MEASUREMENTS];
                              current[index] = { ...bm, tip: e.target.value };
                              setSettingsForm({ ...settingsForm, bodyMeasurements: current });
                              setHasUserEditedSettings(true);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#0c090a] border border-[#dfb56c]/20 rounded text-xs text-[#f7e2a9]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FULL LANDING PAGE TOTAL BACKGROUND IMAGE & COLOR CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#dfb56c]" />
                    <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold">
                      Full Landing Page Total Background Image &amp; Theme Colors
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a89f91] font-mono">
                    {settingsForm.pageBgImageUrl ? '✓ Custom Full-Page Background Active' : 'Default Atelier Dark Active'}
                  </span>
                </div>

                <p className="text-xs text-[#a89f91]">
                  Set a luxury full-screen background image behind the entire landing page, adjust overlay darkness for perfect readability, and customize text colors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Full-Page Background Image URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.pageBgImageUrl || ''}
                      placeholder="https://images.unsplash.com/... or upload below"
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, pageBgImageUrl: e.target.value });
                        setHasUserEditedSettings(true);
                      }}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono flex items-center justify-between">
                      <span>Background Dark Overlay Opacity</span>
                      <strong className="text-[#dfb56c] font-mono">
                        {settingsForm.pageBgOverlayOpacity ?? 60}%
                      </strong>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={98}
                      step={1}
                      value={settingsForm.pageBgOverlayOpacity ?? 60}
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, pageBgOverlayOpacity: Number(e.target.value) });
                        setHasUserEditedSettings(true);
                      }}
                      className="w-full accent-[#dfb56c] cursor-pointer mt-1.5"
                    />
                    <span className="text-[10px] text-[#a89f91] block mt-0.5">
                      Recommend 45%-65% so the uploaded background image is clearly visible behind sections.
                    </span>
                  </div>
                </div>

                {/* Upload & Preset Options */}
                <div className="p-4 rounded bg-[#141011] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Live Preview Box */}
                    <div className="w-24 h-16 rounded bg-black/80 border border-[#c99a45]/40 overflow-hidden shrink-0 relative flex items-center justify-center shadow-inner">
                      {settingsForm.pageBgImageUrl && settingsForm.pageBgImageUrl.trim() ? (
                        <>
                          <img
                            src={settingsForm.pageBgImageUrl.trim()}
                            alt="Page Background Preview"
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-black pointer-events-none"
                            style={{ opacity: (settingsForm.pageBgOverlayOpacity ?? 60) / 100 }}
                          />
                          <span className="absolute z-10 text-[9px] font-mono font-bold text-white drop-shadow">
                            Preview
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#a89f91] font-mono text-center px-1">
                          No Custom Background
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#f7f3eb] block">
                        {settingsForm.pageBgImageUrl ? 'Custom Full Page Background Active' : 'Ambient Deep Charcoal Canvas'}
                      </span>
                      <span className="text-[10px] text-[#a89f91] block mt-0.5">
                        Applies behind all landing page sections and between section gaps.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="btn-3d-secondary px-3 py-1.5 text-xs rounded cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Page Background File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file, 1920, 1080, 0.82);
                              setSettingsForm({ ...settingsForm, pageBgImageUrl: compressed });
                              setHasUserEditedSettings(true);
                            } catch (_) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const res = ev.target?.result as string;
                                if (res) {
                                  setSettingsForm({ ...settingsForm, pageBgImageUrl: res });
                                  setHasUserEditedSettings(true);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                      />
                    </label>

                    {settingsForm.pageBgImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsForm({ ...settingsForm, pageBgImageUrl: '' });
                          setHasUserEditedSettings(true);
                        }}
                        className="btn-3d-secondary px-3 py-1.5 text-xs text-red-400 rounded cursor-pointer"
                      >
                        Reset Background
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Gaps & Glassmorphism Controls */}
                <div className="p-4 rounded bg-[#141011] border border-[#c99a45]/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                        සෙක්ෂන් අතර හිඩැස් සහ විනිවිද පෙනීම (Section Gaps &amp; Translucency)
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Adjust spacing between sections so the uploaded background image is clearly visible through the gaps.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gap Size Selector */}
                    <div>
                      <label className="block text-[11px] text-[#a89f91] mb-1.5 font-mono">
                        Section Gap Spacing (සෙක්ෂන් අතර පරතරය)
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(
                          [
                            { id: 'none', label: 'None (0px)' },
                            { id: 'small', label: 'Small (16px)' },
                            { id: 'medium', label: 'Standard (32px)' },
                            { id: 'large', label: 'Spacious (48px)' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSettingsForm({ ...settingsForm, sectionGapSize: opt.id });
                              setHasUserEditedSettings(true);
                            }}
                            className={`px-2 py-1.5 text-[10px] font-mono rounded text-center transition-all ${
                              (settingsForm.sectionGapSize || 'medium') === opt.id
                                ? 'bg-[#dfb56c] text-black font-bold shadow'
                                : 'bg-black/60 border border-white/10 text-[#d5cfc4] hover:border-[#dfb56c]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Translucent Frosted Glass Toggle */}
                    <div>
                      <label className="block text-[11px] text-[#a89f91] mb-1.5 font-mono">
                        Section Translucent Frosted Glass (විනිවිද පෙනීම)
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded bg-black/60 border border-white/10 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.sectionGlassmorphism !== false}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, sectionGlassmorphism: e.target.checked });
                            setHasUserEditedSettings(true);
                          }}
                          className="accent-[#dfb56c] w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-xs text-[#f7f3eb]">
                          Enable Frosted Glass Panels (Lets background shine through sections)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section-by-Section Background Images Manager */}
                <div className="p-4 rounded bg-[#181113] border border-[#dfb56c]/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#dfb56c]" />
                        සෙක්ෂන් එකින් එක සඳහා Background Images (Section-by-Section Backgrounds)
                      </span>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Upload unique background images for individual sections (Hero, Videos, Intro, Fabrics, Pricing, etc.).
                      </span>
                    </div>

                    {/* Section Dark Overlay Opacity */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#a89f91] text-[11px]">Section Dark Overlay:</span>
                      <strong className="text-[#dfb56c]">
                        {settingsForm.sectionBgOverlayOpacity ?? 65}%
                      </strong>
                      <input
                        type="range"
                        min={20}
                        max={90}
                        step={5}
                        value={settingsForm.sectionBgOverlayOpacity ?? 65}
                        onChange={(e) => {
                          setSettingsForm({
                            ...settingsForm,
                            sectionBgOverlayOpacity: Number(e.target.value),
                          });
                          setHasUserEditedSettings(true);
                        }}
                        className="w-24 accent-[#dfb56c] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Section Selector Dropdown */}
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Select Landing Page Section to Customize:
                    </label>
                    <select
                      value={selectedBgSectionKey}
                      onChange={(e) => setSelectedBgSectionKey(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141011] border border-[#dfb56c]/50 rounded text-xs text-[#f7e2a9] font-mono outline-none focus:border-[#dfb56c]"
                    >
                      {LANDING_PAGE_SECTIONS.map((sec) => {
                        const hasCustomBg = Boolean(settingsForm.sectionBgImages?.[sec.id]);
                        return (
                          <option key={sec.id} value={sec.id}>
                            {sec.name} ({sec.nameSinhala}) {hasCustomBg ? '★ [Custom BG Set]' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Active Section Background Editor */}
                  {(() => {
                    const curSection =
                      LANDING_PAGE_SECTIONS.find((s) => s.id === selectedBgSectionKey) ||
                      LANDING_PAGE_SECTIONS[0];
                    const curBgUrl = settingsForm.sectionBgImages?.[curSection.id] || '';

                    return (
                      <div className="p-3.5 rounded bg-[#120a0d] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Section Preview Thumbnail */}
                          <div className="w-28 h-18 rounded bg-black border border-[#c99a45]/40 overflow-hidden shrink-0 relative flex items-center justify-center shadow-md">
                            {Boolean(curBgUrl && curBgUrl.trim()) ? (
                              <>
                                <img
                                  src={curBgUrl.trim()}
                                  alt={`${curSection.name} Background`}
                                  className="w-full h-full object-cover"
                                />
                                <div
                                  className="absolute inset-0 bg-black pointer-events-none"
                                  style={{
                                    opacity: (settingsForm.sectionBgOverlayOpacity ?? 65) / 100,
                                  }}
                                />
                                <span className="absolute z-10 text-[9px] font-mono font-bold text-white drop-shadow">
                                  Custom BG
                                </span>
                              </>
                            ) : settingsForm.pageBgImageUrl && settingsForm.pageBgImageUrl.trim() ? (
                              <>
                                <img
                                  src={settingsForm.pageBgImageUrl.trim()}
                                  alt="Global Background"
                                  className="w-full h-full object-cover opacity-50"
                                />
                                <span className="absolute z-10 text-[9px] font-mono text-[#f7e2a9] text-center px-1 drop-shadow">
                                  Uses Global Page BG
                                </span>
                              </>
                            ) : (
                              <span className="text-[9px] text-[#a89f91] font-mono text-center px-1">
                                Default Theme
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-xs font-bold text-[#f7f3eb] block">
                              {curSection.name}
                            </span>
                            <span className="text-[11px] text-[#dfb56c] font-sinhala block">
                              {curSection.nameSinhala}
                            </span>
                            <span className="text-[10px] text-[#a89f91] font-mono block mt-0.5">
                              {curBgUrl
                                ? '✓ Section has custom background image applied'
                                : 'Inherits full landing page background image'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                          <input
                            type="url"
                            value={curBgUrl}
                            placeholder="Image URL (https://...)"
                            onChange={(e) => {
                              const updatedBg = {
                                ...(settingsForm.sectionBgImages || {}),
                                [curSection.id]: e.target.value,
                              };
                              setSettingsForm({ ...settingsForm, sectionBgImages: updatedBg });
                              setHasUserEditedSettings(true);
                            }}
                            className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-xs text-white font-mono w-full sm:w-60 outline-none focus:border-[#dfb56c]"
                          />

                          <label className="btn-3d-secondary px-3 py-1.5 text-xs rounded cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressImage(file, 1920, 1080, 0.82);
                                    const updatedBg = {
                                      ...(settingsForm.sectionBgImages || {}),
                                      [curSection.id]: compressed,
                                    };
                                    setSettingsForm({ ...settingsForm, sectionBgImages: updatedBg });
                                    setHasUserEditedSettings(true);
                                  } catch (_) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res) {
                                        const updatedBg = {
                                          ...(settingsForm.sectionBgImages || {}),
                                          [curSection.id]: res,
                                        };
                                        setSettingsForm({ ...settingsForm, sectionBgImages: updatedBg });
                                        setHasUserEditedSettings(true);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                          </label>

                          {curBgUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedBg = { ...(settingsForm.sectionBgImages || {}) };
                                delete updatedBg[curSection.id];
                                setSettingsForm({ ...settingsForm, sectionBgImages: updatedBg });
                                setHasUserEditedSettings(true);
                              }}
                              className="btn-3d-secondary px-2.5 py-1.5 text-xs text-red-400 rounded cursor-pointer shrink-0"
                              title="Revert to global background"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Theme Text Colors */}
                <div className="p-4 rounded bg-[#141011] border border-white/10 space-y-3">
                  <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                    Global Typography &amp; Heading Color Customization
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                        Global Body Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsForm.pageTextColor || '#f4efe6'}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, pageTextColor: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="w-9 h-8 bg-transparent border border-white/20 rounded cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={settingsForm.pageTextColor || '#f4efe6'}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, pageTextColor: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsForm({ ...settingsForm, pageTextColor: '#f4efe6' });
                            setHasUserEditedSettings(true);
                          }}
                          className="text-[10px] text-[#a89f91] hover:text-[#dfb56c] underline"
                        >
                          Default
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                        Global Heading / Accent Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsForm.headingTextColor || '#dfb56c'}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, headingTextColor: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="w-9 h-8 bg-transparent border border-white/20 rounded cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={settingsForm.headingTextColor || '#dfb56c'}
                          onChange={(e) => {
                            setSettingsForm({ ...settingsForm, headingTextColor: e.target.value });
                            setHasUserEditedSettings(true);
                          }}
                          className="flex-1 px-3 py-1.5 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsForm({ ...settingsForm, headingTextColor: '#dfb56c' });
                            setHasUserEditedSettings(true);
                          }}
                          className="text-[10px] text-[#a89f91] hover:text-[#dfb56c] underline"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP ANNOUNCEMENT BAR CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                  Top Header Announcement Bar
                </span>
                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                    Announcement Banner Text (Visible at the very top of the website)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement || ''}
                    placeholder="🔥 Registrations Now Open for the 2026 Batch..."
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7e2a9] focus:border-[#dfb56c] outline-none"
                  />
                </div>
              </div>

              {/* HERO COVER SECTION CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold">
                    Hero Section CMS (Front Cover Headline, Media &amp; Buttons)
                  </span>
                  <span className="text-[10px] text-[#a89f91] font-mono">Main Front View</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Hero Badge / Intake Label
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBadge || ''}
                      placeholder="e.g. 2026 OFFICIAL ACADEMIC INTAKE"
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Hero Course Program Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroCourseTitle || ''}
                      placeholder="6-MONTH PROFESSIONAL FASHION & BRANDING PROGRAM"
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroCourseTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                    Hero Main Headline (Multi-line supported)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.heroTitle || ''}
                    placeholder="ඔබේ හැකියාවෙන්&#10;ඔබේ අනාගතය&#10;නිර්මාණය කරන්න."
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-white font-editorial font-bold focus:border-[#dfb56c] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                    Hero Gold Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroSubtitle || ''}
                    placeholder="DESIGN YOUR SKILL. BUILD YOUR BRAND. CREATE YOUR FUTURE."
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#dfb56c] font-mono tracking-wider focus:border-[#dfb56c] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroCtaText || ''}
                      placeholder="REGISTER NOW"
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroCtaText: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Primary CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroCtaLink || '#register'}
                      placeholder="#register"
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroCtaLink: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>

                {/* Hero Media Selector: IMAGE vs VIDEO */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <label className="block text-xs uppercase font-mono text-[#dfb56c] font-bold">
                    Hero Background Media Mode
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 p-3 rounded border text-center cursor-pointer transition-all ${
                        settingsForm.heroMediaType === 'IMAGE'
                          ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold'
                          : 'bg-black/40 border-white/10 text-[#d5cfc4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="IMAGE"
                        checked={settingsForm.heroMediaType === 'IMAGE'}
                        onChange={() => setSettingsForm({ ...settingsForm, heroMediaType: 'IMAGE' })}
                        className="sr-only"
                      />
                      IMAGE HERO (High-Fashion Editorial Cover)
                    </label>

                    <label
                      className={`flex-1 p-3 rounded border text-center cursor-pointer transition-all ${
                        settingsForm.heroMediaType === 'VIDEO'
                          ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold'
                          : 'bg-black/40 border-white/10 text-[#d5cfc4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="VIDEO"
                        checked={settingsForm.heroMediaType === 'VIDEO'}
                        onChange={() => setSettingsForm({ ...settingsForm, heroMediaType: 'VIDEO' })}
                        className="sr-only"
                      />
                      VIDEO HERO (YouTube Video Background)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono text-[#a89f91]">
                        Hero Background Image URL:
                      </label>
                      <input
                        type="url"
                        value={settingsForm.heroImageUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb]"
                      />
                      <label className="btn-3d-secondary px-3 py-1.5 text-[11px] rounded cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Hero Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 1600, 1000, 0.82);
                                setSettingsForm({ ...settingsForm, heroImageUrl: compressed, heroMediaType: 'IMAGE' });
                                setHasUserEditedSettings(true);
                              } catch (_) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (res) {
                                    setSettingsForm({ ...settingsForm, heroImageUrl: res, heroMediaType: 'IMAGE' });
                                    setHasUserEditedSettings(true);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono text-[#a89f91]">
                        Hero Background YouTube Video URL:
                      </label>
                      <input
                        type="url"
                        value={settingsForm.heroVideoUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({
                            ...settingsForm,
                            heroVideoUrl: val,
                            heroMediaType: 'VIDEO',
                          });
                          setHasUserEditedSettings(true);
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded-sm text-xs text-[#f7f3eb]"
                      />
                      <span className="text-[10px] text-[#a89f91] block font-mono">
                        Supports standard YouTube URLs or Shorts. Loops seamlessly without ads.
                      </span>
                    </div>
                  </div>

                  {/* Live Hero Media Preview Box */}
                  <div className="p-3 bg-[#141011] border border-white/10 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#dfb56c] font-bold">
                        Live Preview: {settingsForm.heroMediaType === 'IMAGE' ? 'Image Cover Active' : 'YouTube Video Background Active'}
                      </span>
                      <span className="text-[#a89f91]">Front Website View</span>
                    </div>

                    <div className="relative aspect-video w-full max-h-48 bg-black rounded overflow-hidden border border-white/10 flex items-center justify-center">
                      {settingsForm.heroMediaType === 'IMAGE' ? (
                        Boolean(settingsForm.heroImageUrl && settingsForm.heroImageUrl.trim()) ? (
                          <img
                            src={settingsForm.heroImageUrl.trim()}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-[#a89f91] font-mono">No Image URL Set</span>
                        )
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {parseYouTubeVideoId(settingsForm.heroVideoUrl || '') ? (
                            <>
                              <img
                                src={getYouTubeThumbnailUrl(settingsForm.heroVideoUrl || '')}
                                alt="Hero YouTube Thumbnail"
                                className="w-full h-full object-cover filter brightness-85"
                              />
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                                <Play className="w-9 h-9 text-[#f7e2a9] fill-[#f7e2a9] mb-1 drop-shadow-md" />
                                <span className="text-xs text-[#f7e2a9] font-mono font-bold block drop-shadow">
                                  ✓ Connected (ID: {parseYouTubeVideoId(settingsForm.heroVideoUrl || '')})
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <Play className="w-8 h-8 text-[#dfb56c] mx-auto mb-1 opacity-80" />
                              <span className="text-xs text-[#f7e2a9] font-mono block">
                                Active YouTube Video Cover
                              </span>
                              <span className="text-[10px] text-[#a89f91] font-mono truncate block max-w-xs mx-auto">
                                {settingsForm.heroVideoUrl || 'Default Background Video'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* COURSE INTRO SECTION CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                  Course Introduction &amp; Highlights Section
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Intro Section Badge
                    </label>
                    <input
                      type="text"
                      value={settingsForm.introBadge || ''}
                      placeholder="Course Introduction & Philosophy"
                      onChange={(e) => setSettingsForm({ ...settingsForm, introBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Intro Section Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.introTitle || ''}
                      placeholder="මේ Course එක ඔබ වෙනුවෙන්ද?"
                      onChange={(e) => setSettingsForm({ ...settingsForm, introTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                    Highlight Banner Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.introHighlightTitle || ''}
                    placeholder="මේක Pattern Making Course එකක් විතරක් නෙමෙයි."
                    onChange={(e) => setSettingsForm({ ...settingsForm, introHighlightTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7e2a9] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                    Highlight Banner Description
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.introHighlightDesc || ''}
                    placeholder="සාම්ප්‍රදායිකව ඇඳුම් කපන ආකාරය පමණක් කියාදෙන පන්තියක් වෙනුවට..."
                    onChange={(e) => setSettingsForm({ ...settingsForm, introHighlightDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#d5cfc4]"
                  />
                </div>
              </div>

              {/* Bank Details for Transfer */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                  Official Bank Account for Student Transfers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settingsForm.bankName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1">Account Name</label>
                    <input
                      type="text"
                      value={settingsForm.bankAccountName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1">Account Number</label>
                    <input
                      type="text"
                      value={settingsForm.bankAccountNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1">Branch</label>
                    <input
                      type="text"
                      value={settingsForm.bankBranch}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankBranch: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89f91] mb-1">Payment Instructions for Students</label>
                  <textarea
                    rows={2}
                    value={settingsForm.paymentInstructions}
                    onChange={(e) => setSettingsForm({ ...settingsForm, paymentInstructions: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#d5cfc4]"
                  />
                </div>
              </div>

              {/* Fees configuration */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                  Tuition Fees, Duration &amp; Installments
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#dfb56c] mb-1">
                      Physical Monthly Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.physicalFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, physicalFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#dfb56c] mb-1">
                      Zoom Monthly Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.zoomFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, zoomFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#dfb56c] mb-1">
                      Registration Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.registrationFee || 1000}
                      onChange={(e) => setSettingsForm({ ...settingsForm, registrationFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Course Duration (e.g. 6 Months)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.courseDuration || '6 Months'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, courseDuration: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      Discount / Installment Plan Note
                    </label>
                    <input
                      type="text"
                      value={settingsForm.discountNote || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, discountNote: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>
              </div>

              {/* CONTACT & SOCIAL LINKS CMS */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold block">
                  Official WhatsApp &amp; Social Media Links
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      WhatsApp Contact Number (with country code)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappContactNumber || ''}
                      placeholder="+94771234567"
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappContactNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">
                      WhatsApp Default Welcome Message
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappDefaultMessage || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDefaultMessage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">Facebook Page URL</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks?.facebook || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">Instagram Profile URL</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks?.instagram || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">TikTok Profile URL</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks?.tiktok || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, tiktok: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#a89f91] mb-1 font-mono">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks?.youtube || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleSaveAllSettings}
                  disabled={isSavingSettings}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 flex items-center gap-2 shadow-xl transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving to Database...' : 'Save All Content, Media & Settings to Database'}</span>
                </button>
                {saveSuccessMsg && (
                  <span className="text-xs text-green-400 font-bold animate-pulse">
                    {saveSuccessMsg}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    Course Curriculum Modules ({modules.length})
                  </h3>
                  <p className="text-xs text-[#a89f91]">
                    Manage the 34 comprehensive modules shown on the academy curriculum.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Enter new module title:');
                    if (title) saveCourseModule({ title });
                  }}
                  className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Module
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modules.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-xs text-[#dfb56c]">{m.number}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => {
                              const newDesc = prompt('Edit description:', m.description);
                              if (newDesc !== null) saveCourseModule({ ...m, description: newDesc });
                            }}
                            className="text-blue-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete module ${m.title}?`)) deleteCourseModule(m.id);
                            }}
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[#f7f3eb]">{m.title}</h4>
                      <p className="text-[11px] text-[#a89f91] mt-1 line-clamp-2">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WHY COURSE 12 PILLARS CMS */}
          {activeTab === 'why-course' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    Why This Course: 12 Core Pillars &amp; Features ({whyFeatures.length})
                  </h3>
                  <p className="text-xs text-[#a89f91]">
                    Manage the 12 feature cards shown in the "Why This Course" section. Edit titles, Sinhala translations, descriptions, and high-fashion background images.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Enter new Pillar English Title:');
                    if (title) saveWhyFeature({ title });
                  }}
                  className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5 hover:bg-[#6e1322] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Pillar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {whyFeatures.map((f) => (
                  <div
                    key={f.id}
                    className="p-3.5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col justify-between group hover:border-[#dfb56c] transition-all"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative h-28 w-full rounded overflow-hidden bg-black/60 mb-3 border border-white/10">
                        <img
                          src={f.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                          alt={f.title}
                          className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#dfb56c] border border-white/10">
                          {f.number}
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#540d18]/90 text-[#f7e2a9]">
                          {f.iconName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-[#dfb56c] uppercase">
                          {f.title}
                        </span>
                        <span className="text-[9px] text-green-400 font-mono">
                          {f.isPublished ? 'Live' : 'Draft'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#f7f3eb] font-sinhala line-clamp-1 mb-1">
                        {f.titleSinhala || f.title}
                      </h4>

                      <p className="text-[11px] text-[#a89f91] line-clamp-2 font-sinhala">
                        {f.descriptionSinhala || f.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingWhyFeature(f)}
                        className="text-[#dfb56c] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit &amp; Change Image
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete pillar ${f.title}?`)) deleteWhyFeature(f.id);
                        }}
                        className="text-red-400 hover:underline text-[11px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PUBLIC VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#dfb56c] text-black shadow">
                      TAB 7
                    </span>
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                      Public YouTube Masterclass Videos ({videos.length})
                    </h3>
                  </div>
                  <p className="text-xs text-[#a89f91] font-sinhala">
                    YouTube මාස්ටර්ක්ලාස්, Pinterest මැහුම් ටියුටෝරියල්ස් සහ ශිෂ්‍ය ප්‍රතිචාර වීඩියෝ මෙතැනින් එක් කරන්න, සංස්කරණය කරන්න හෝ මකා දමන්න.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      if (confirm('ප්‍රකෘති Masterclass සහ Pinterest Videos නැවත ප්‍රතිස්ථාපනය කිරීමට අවශ්‍යද? (Restore default videos?)')) {
                        for (const v of DEFAULT_YOUTUBE_VIDEOS) {
                          await saveYouTubeVideo(v);
                        }
                      }
                    }}
                    className="px-3 py-2 bg-[#1c1214] border border-[#dfb56c]/50 text-[#dfb56c] hover:text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5 hover:bg-[#2b181c] transition-colors cursor-pointer shadow"
                    title="Restore default YouTube and Pinterest masterclass videos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingVideo({
                        id: `yt-${Date.now()}`,
                        title: 'Student Success Story & Brand Launch Review',
                        titleSinhala: 'මගේම ඇඳුම් සන්නාමය ආරම්භ කළ හැටි - ශිෂ්‍ය ප්‍රතිචාරය',
                        description: 'Graduate student testimonial sharing how the 6-Month Diploma helped launch their boutique brand.',
                        descriptionSinhala: 'Ceylon Style Studio වෙතින් හැදෑරීමෙන් පසු සාර්ථක සන්නාමයක් ගොඩනැගූ ආකාරය පිළිබඳ ශිෂ්‍ය ප්‍රතිචාරය.',
                        youtubeUrl: '',
                        videoId: '',
                        thumbnailUrl: '',
                        category: 'STUDENT REVIEWS',
                        categorySinhala: 'සිසුන්ගේ ප්‍රතිචාර',
                        duration: '06:30',
                        isFeatured: true,
                        isPublished: true,
                        order: videos.length + 1,
                        createdAt: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold rounded-sm flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Student Review Video
                  </button>

                  <button
                    onClick={() => {
                      setEditingVideo({
                        id: `yt-pin-${Date.now()}`,
                        title: 'Pinterest Sewing Tutorial Masterclass',
                        titleSinhala: 'උසස් මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝව',
                        description: 'Hands-on tailoring and couture sewing technique masterclass guide.',
                        descriptionSinhala: 'ප්‍රායෝගික ටේලරින් හා මැහුම් උපදෙස්, නිවැරදි කැපුම් හා නිමාවන් ඇතුළත් වීඩියෝව.',
                        youtubeUrl: '',
                        videoId: '',
                        thumbnailUrl: '',
                        category: 'PINTEREST SEWING TUTORIALS',
                        categorySinhala: 'Pinterest මැහුම් ටියුටෝරියල්',
                        duration: '14:00',
                        isFeatured: false,
                        isPublished: true,
                        order: videos.length + 1,
                        createdAt: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="px-3.5 py-2 bg-[#e60023] text-white text-xs font-bold rounded-sm flex items-center gap-1.5 hover:bg-[#c9001e] transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Pinterest Sewing Video
                  </button>

                  <button
                    onClick={() => {
                      setEditingVideo({
                        id: `yt-${Date.now()}`,
                        title: '',
                        titleSinhala: '',
                        description: '',
                        descriptionSinhala: '',
                        youtubeUrl: '',
                        videoId: '',
                        thumbnailUrl: '',
                        category: 'COURSE INTRODUCTION',
                        categorySinhala: 'පාඨමාලා හැඳින්වීම',
                        duration: '10:00',
                        isFeatured: false,
                        isPublished: true,
                        order: videos.length + 1,
                        createdAt: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="px-3.5 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5 hover:bg-[#6e1322] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Masterclass Video
                  </button>
                </div>
              </div>

              {/* Pinterest Sewing Tutorials Backend Settings Card (Complete Text & Screen Size Management) */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#160e10] border border-[#dfb56c]/50 space-y-4 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#e60023] text-white flex items-center justify-center font-bold text-xs shadow-md">
                      P
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#f7e2a9] flex items-center gap-2">
                        <span>Pinterest Sewing Tutorials Settings (මැහුම් ටියුටෝරියල් එකතුවේ පාඨ හා පසුබිම් සැකසුම්)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Cloud Synced
                        </span>
                      </h4>
                      <p className="text-[11px] font-mono text-[#a89f91]">
                        Change "Pinterest හරහා තෝරාගත්..." texts, main titles, video screen size auto-adjust mode, and board settings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {pinterestSettingsSaved && (
                      <span className="text-emerald-400 font-mono text-xs flex items-center gap-1 font-bold animate-in fade-in">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>✓ Backend & Cloud Database එකට සුරකින ලදී!</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveSewingSettings}
                      className="px-4 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs rounded hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Settings (සුරකින්න)</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Main Titles and Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#f7e2a9] font-bold mb-1 font-sinhala">
                      සිංහල ප්‍රධාන මාතෘකාව (Section Sinhala Title)
                    </label>
                    <input
                      type="text"
                      value={sewingForm.titleSinhala}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, titleSinhala: e.target.value });
                      }}
                      placeholder="මැහුම් සහ ටේලරින් වීඩියෝ ටියුටෝරියල්ස්"
                      className="w-full p-2.5 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7f3eb] font-sinhala focus:outline-none focus:border-[#dfb56c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono">
                      English Section Title (ඉංග්‍රීසි මාතෘකාව)
                    </label>
                    <input
                      type="text"
                      value={sewingForm.titleEn}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, titleEn: e.target.value });
                      }}
                      placeholder="Tailoring & Sewing Video Masterclass Collection"
                      className="w-full p-2.5 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono focus:outline-none focus:border-[#dfb56c]"
                    />
                  </div>
                </div>

                {/* Section 2: THE REQUESTED "Pinterest හරහා තෝරාගත්..." DESCRIPTION TEXT */}
                <div className="p-3.5 rounded-lg bg-[#0e080a] border border-[#dfb56c]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#f7e2a9] font-bold text-xs font-sinhala flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#dfb56c]" />
                      <span>ප්‍රධාන විස්තර පාඨය ("Pinterest හරහා තෝරාගත්..." පෙළ වෙනස් කරන්න):</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#dfb56c] px-2 py-0.5 rounded bg-black/60 border border-white/10">
                      Live on Website Hero & Header
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={sewingForm.descSinhala}
                    onChange={(e) => {
                      setIsSewingFormDirty(true);
                      setSewingForm({ ...sewingForm, descSinhala: e.target.value });
                    }}
                    placeholder="Pinterest හරහා තෝරාගත් වෘත්තීය මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝ පාඩම්, විස්තරාත්මක උපදෙස් සහ පැටර්න් මගපෙන්වීම් පිටතට නොගොස් මෙතැනින්ම නරඹන්න."
                    className="w-full p-2.5 bg-black/80 border border-[#dfb56c]/40 rounded-lg text-xs sm:text-sm text-[#f7f3eb] font-sinhala leading-relaxed focus:outline-none focus:border-[#dfb56c]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-[#a89f91]">
                    <span>📌 පරිශීලකයා ඉල්ලූ "Pinterest හරහා තෝරාගත්..." පාඨය මෙතැනින් සෘජුවම සංස්කරණය කළ හැක.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSewingFormDirty(true);
                        setSewingForm({
                          ...sewingForm,
                          descSinhala:
                            'Pinterest හරහා තෝරාගත් වෘත්තීය මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝ පාඩම්, විස්තරාත්මක උපදෙස් සහ පැටර්න් මගපෙන්වීම් පිටතට නොගොස් මෙතැනින්ම නරඹන්න.',
                        });
                      }}
                      className="text-[10px] text-[#dfb56c] hover:underline cursor-pointer"
                    >
                      පෙරනිමි පාඨය යොදන්න (Reset to Default)
                    </button>
                  </div>
                </div>

                {/* Section 3: Screen Size Adaptation & Display Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[#f7e2a9] mb-1 font-mono font-bold flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Video Screen Size Mode (තිර ප්‍රමාණ ආකාරය)</span>
                    </label>
                    <select
                      value={sewingForm.playerAspect}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, playerAspect: e.target.value as any });
                      }}
                      className="w-full p-2.5 bg-[#0c090a] border border-[#dfb56c]/40 rounded text-[#f7f3eb] font-mono focus:outline-none focus:border-[#dfb56c]"
                    >
                      <option value="adaptive">📐 Smart Screen Fit (ස්වයංක්‍රීයව තිරයට ගැළපීම - Recommended)</option>
                      <option value="widescreen">🎬 16:9 Widescreen (16:9 සිනමා විලාසය)</option>
                      <option value="portrait">📱 9:16 Vertical Pin/Reel (9:16 සිරස් විලාසය)</option>
                    </select>
                    <span className="text-[10px] text-[#a89f91] mt-1 block">
                      Pinterest video තිර ප්‍රමාණයට ගැලපෙන පරිදි සකසයි
                    </span>
                  </div>

                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono">ඉහළ Badge පෙළ (Top Badge)</label>
                    <input
                      type="text"
                      value={sewingForm.badgeSinhala}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, badgeSinhala: e.target.value });
                      }}
                      placeholder="Pinterest මැහුම් හා ටේලරින් වීඩියෝ එකතුව"
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono">Pinterest Tab ID</label>
                    <input
                      type="text"
                      value={sewingForm.tabId}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, tabId: e.target.value });
                      }}
                      placeholder="696932179776250726"
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono">Pinterest Board / Search URL</label>
                    <input
                      type="url"
                      value={sewingForm.boardUrl}
                      onChange={(e) => {
                        setIsSewingFormDirty(true);
                        setSewingForm({ ...sewingForm, boardUrl: e.target.value });
                      }}
                      placeholder="https://www.pinterest.com/?tabId=696932179776250726"
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                    />
                  </div>

                  <div className="flex items-center pt-3">
                    <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9]">
                      <input
                        type="checkbox"
                        checked={sewingForm.showDescription !== false}
                        onChange={(e) => {
                          setIsSewingFormDirty(true);
                          setSewingForm({ ...sewingForm, showDescription: e.target.checked });
                        }}
                        className="w-4 h-4 accent-[#dfb56c]"
                      />
                      <span>කාඩ්පත් තුළ ටේලරින් තාක්ෂණික විස්තර පෙරනිමියෙන් දිගහැර තබන්න</span>
                    </label>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="p-3.5 rounded-lg bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#dfb56c]">
                    <span className="flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>වෙබ් අඩවියේ දිස්වන සජීවී පෙරදසුන (Live Website Preview):</span>
                    </span>
                    <span className="text-[#a89f91]">
                      Mode: {sewingForm.playerAspect}
                    </span>
                  </div>
                  <div className="text-center py-2 px-3 border border-white/5 rounded bg-[#120a0d] space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1b1013] border border-[#dfb56c]/40 text-[10px] font-mono text-[#f7e2a9]">
                      P {sewingForm.badgeSinhala}
                    </span>
                    <h5 className="text-base sm:text-lg font-editorial font-bold text-white">
                      {sewingForm.titleSinhala}
                    </h5>
                    <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed max-w-xl mx-auto">
                      {sewingForm.descSinhala}
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                {[
                  { id: 'ALL', label: `All Videos (${videos.length})` },
                  {
                    id: 'PINTEREST SEWING TUTORIALS',
                    label: `📌 Pinterest Tutorials (${videos.filter((v) => (v.category || '').toUpperCase().includes('PINTEREST') || (v.category || '').toUpperCase().includes('SEWING')).length})`,
                  },
                  {
                    id: 'STUDENT REVIEWS',
                    label: `Student Reviews (${videos.filter((v) => (v.category || '').toUpperCase().includes('REVIEW')).length})`,
                  },
                  {
                    id: 'COURSE INTRODUCTION',
                    label: `Course Intro (${videos.filter((v) => (v.category || '').toUpperCase().includes('INTRO')).length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setVideoCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-all cursor-pointer font-bold border ${
                      videoCategoryFilter === tab.id
                        ? 'bg-[#dfb56c] text-black border-[#dfb56c]'
                        : 'bg-[#0c090a] text-[#a89f91] hover:text-white border-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.length === 0 ? (
                  <div className="col-span-full p-10 text-center bg-[#0c090a] border-2 border-[#dfb56c]/50 rounded-sm space-y-4 shadow-xl">
                    <Video className="w-12 h-12 text-[#dfb56c] mx-auto opacity-80" />
                    <div>
                      <h4 className="text-base font-bold text-[#f7e2a9]">
                        දැනට Masterclass වීඩියෝ කිසිවක් Backend Storage හි නොමැත (No Videos in Storage)
                      </h4>
                      <p className="text-xs text-[#a89f91] mt-1 max-w-md mx-auto font-sinhala">
                        පද්ධතියේ YouTube Masterclass සහ Pinterest Tutorials වීඩියෝ නැවත ලෝඩ් කරගැනීමට පහත 'Restore Default Masterclass Videos' ක්ලික් කරන්න.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        for (const v of DEFAULT_YOUTUBE_VIDEOS) {
                          await saveYouTubeVideo(v);
                        }
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs rounded-sm hover:brightness-110 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore Default Masterclass Videos (ප්‍රකෘති වීඩියෝ නැවත ලෝඩ් කරන්න)</span>
                    </button>
                  </div>
                ) : videos
                    .filter((v) => {
                      if (videoCategoryFilter === 'ALL') return true;
                      if (videoCategoryFilter === 'PINTEREST SEWING TUTORIALS') {
                        const cat = (v.category || '').toUpperCase();
                        return cat.includes('PINTEREST') || cat.includes('SEWING');
                      }
                      return (v.category || '').toUpperCase().includes(videoCategoryFilter);
                    }).length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-[#0c090a] border border-white/10 rounded-sm space-y-3">
                    <p className="text-xs text-[#a89f91] font-sinhala">
                      මෙම Category එකට අදාළ වීඩියෝ හමු නොවීය.
                    </p>
                    <button
                      type="button"
                      onClick={() => setVideoCategoryFilter('ALL')}
                      className="px-3.5 py-1.5 bg-[#1c1214] border border-[#dfb56c]/30 text-[#dfb56c] rounded-sm text-xs hover:text-white cursor-pointer"
                    >
                      සියලුම වීඩියෝ පෙන්වන්න (Show All {videos.length} Videos)
                    </button>
                  </div>
                ) : (
                  videos
                    .filter((v) => {
                      if (videoCategoryFilter === 'ALL') return true;
                      if (videoCategoryFilter === 'PINTEREST SEWING TUTORIALS') {
                        const cat = (v.category || '').toUpperCase();
                        return cat.includes('PINTEREST') || cat.includes('SEWING');
                      }
                      return (v.category || '').toUpperCase().includes(videoCategoryFilter);
                    })
                    .map((v) => (
                    <div key={v.id} className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col justify-between group hover:border-[#dfb56c] transition-all">
                      <div>
                        {/* Video Thumbnail / Preview */}
                        <div className="relative aspect-video bg-black rounded overflow-hidden mb-3 border border-white/10">
                        <img
                          src={v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeUrl || v.videoId)}
                          alt={v.title}
                          className="w-full h-full object-cover filter brightness-85"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-8 h-8 text-[#f7e2a9] fill-[#f7e2a9]" />
                        </div>
                        {v.isFeatured && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] text-[9px] font-mono border border-[#dfb56c]/40 font-bold">
                            ⭐ FEATURED
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                          {v.duration || 'Video'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-[#dfb56c] uppercase">
                          {v.category}
                        </span>
                        <span className="text-[10px] text-[#a89f91] font-mono">
                          {v.categorySinhala}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#f7f3eb] line-clamp-1 mb-1">{v.title}</h4>
                      <p className="text-[11px] text-[#d5cfc4] font-sinhala line-clamp-1 mb-1">
                        {v.titleSinhala || v.title}
                      </p>
                      {v.descriptionSinhala && (
                        <p className="text-[10px] text-[#dfb56c]/90 font-sinhala line-clamp-2 mb-1">
                          {v.descriptionSinhala}
                        </p>
                      )}
                      <p className="text-[10px] text-[#a89f91] line-clamp-2">{v.description}</p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingVideo(v)}
                        className="text-[#dfb56c] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Video &amp; Image
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete video ${v.title}?`)) deleteYouTubeVideo(v.id);
                        }}
                        className="text-red-400 hover:underline text-[11px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          )}

          {/* TAB 8: GALLERY */}
          {/* TAB 8: STYLE COLLECTIONS & LOOKBOOKS */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                    Style Collections &amp; Haute Couture Lookbooks ({gallery.length})
                  </h3>
                  <p className="text-xs text-[#a89f91] mt-1 font-sinhala">
                    වෙබ් අඩවියේ 3D Style Collection Slider එකෙහි පෙන්වන සියලුම ඇඳුම් මෝස්තර, පින්තූර සහ විස්තර මෙතැනින් කළමනාකරණය කරන්න.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingGalleryItem({
                      title: '',
                      titleSinhala: '',
                      imageUrl: '',
                      category: 'HAUTE COUTURE',
                      tag: 'New Collection',
                      description: '',
                      descriptionSinhala: '',
                    })
                  }
                  className="btn-3d-gold px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add New Style Look
                </button>
              </div>

              {/* Inline Editor / Creation Form Modal */}
              {editingGalleryItem && (
                <div className="p-5 sm:p-6 rounded-sm bg-[#181113] border border-[#dfb56c] shadow-2xl space-y-4 animate-in slide-in-from-top-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-sm font-editorial font-bold text-[#f7e2a9]">
                      {editingGalleryItem.id ? 'Edit Style Collection Look' : 'Create New Style Look'}
                    </span>
                    <button
                      onClick={() => setEditingGalleryItem(null)}
                      className="text-white hover:text-[#dfb56c] text-xs cursor-pointer"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Title (English) *
                      </label>
                      <input
                        type="text"
                        value={editingGalleryItem.title || ''}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                        }
                        placeholder="e.g. Royal Gold Brocade Saree Gown"
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Title (Sinhala)
                      </label>
                      <input
                        type="text"
                        value={editingGalleryItem.titleSinhala || ''}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, titleSinhala: e.target.value })
                        }
                        placeholder="e.g. රාජකීය රන් සාරි ගවුම"
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Category
                      </label>
                      <select
                        value={editingGalleryItem.category || 'HAUTE COUTURE'}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                      >
                        <option value="HAUTE COUTURE">HAUTE COUTURE</option>
                        <option value="BRIDAL & COUTURE">BRIDAL & COUTURE</option>
                        <option value="RUNWAY EVENING">RUNWAY EVENING</option>
                        <option value="AI FUSION">AI FUSION</option>
                        <option value="BATIK LUXURY">BATIK LUXURY</option>
                        <option value="BESPOKE TAILORING">BESPOKE TAILORING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Tag / Look Badge
                      </label>
                      <input
                        type="text"
                        value={editingGalleryItem.tag || ''}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, tag: e.target.value })
                        }
                        placeholder="e.g. Runway Spotlight"
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a89f91] mb-1">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={editingGalleryItem.imageUrl || ''}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-mono"
                    />
                    {Boolean(editingGalleryItem?.imageUrl && editingGalleryItem.imageUrl.trim()) && (
                      <div className="mt-2 w-24 h-28 rounded border border-white/20 overflow-hidden shadow-md">
                        <img
                          src={editingGalleryItem.imageUrl!.trim()}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={editingGalleryItem.description || ''}
                        onChange={(e) =>
                          setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })
                        }
                        placeholder="Garment architecture and fabric details..."
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#a89f91] mb-1">
                        Description (Sinhala)
                      </label>
                      <textarea
                        rows={2}
                        value={editingGalleryItem.descriptionSinhala || ''}
                        onChange={(e) =>
                          setEditingGalleryItem({
                            ...editingGalleryItem,
                            descriptionSinhala: e.target.value,
                          })
                        }
                        placeholder="මැහුම් හා පැටර්න් තාක්ෂණ විස්තරය..."
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded text-xs text-white focus:border-[#dfb56c] outline-none font-sinhala"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingGalleryItem(null)}
                      className="px-4 py-2 rounded bg-black/50 text-[#a89f91] hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!editingGalleryItem.title || !editingGalleryItem.imageUrl) {
                          alert('Title and Image URL are required');
                          return;
                        }
                        await saveGalleryImage({
                          id: editingGalleryItem.id,
                          title: editingGalleryItem.title,
                          titleSinhala: editingGalleryItem.titleSinhala,
                          imageUrl: editingGalleryItem.imageUrl,
                          category: editingGalleryItem.category || 'HAUTE COUTURE',
                          tag: editingGalleryItem.tag || 'Couture Look',
                          description: editingGalleryItem.description || '',
                          descriptionSinhala: editingGalleryItem.descriptionSinhala || '',
                          isFeatured: true,
                          isPublished: true,
                        });
                        setEditingGalleryItem(null);
                      }}
                      className="btn-3d-gold px-6 py-2 text-xs uppercase tracking-wider font-bold"
                    >
                      Save to Collection
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-sm bg-[#120d0f] border border-[#c99a45]/20 hover:border-[#dfb56c] transition-all flex flex-col justify-between shadow-lg group relative"
                  >
                    <div>
                      <div className="relative aspect-[4/5] rounded overflow-hidden mb-3 bg-black">
                        <img
                          src={g.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                          alt={g.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#540d18]/90 text-[9px] font-mono uppercase text-[#f7e2a9] border border-[#dfb56c]/30">
                          {g.tag || g.category}
                        </span>
                      </div>

                      <strong className="text-xs text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors block line-clamp-1">
                        {g.title}
                      </strong>
                      {g.titleSinhala && (
                        <span className="text-[11px] text-[#a89f91] block line-clamp-1 font-sinhala">
                          {g.titleSinhala}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#dfb56c] uppercase block mt-1">
                        {g.category}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingGalleryItem(g)}
                        className="text-[#dfb56c] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete style look "${g.title}" from collection?`)) {
                            deleteGalleryImage(g.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                  Studios &amp; Locations ({locations.length})
                </h3>
                <button
                  onClick={() => {
                    const name = prompt('Enter location name (e.g. KEGALLE):');
                    if (name) saveLocation({ name });
                  }}
                  className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Location
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">{loc.name}</h4>
                      <p className="text-xs text-[#b8afa2] mt-1">{loc.address}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          const newAddress = prompt('Edit address:', loc.address);
                          if (newAddress !== null) saveLocation({ ...loc, address: newAddress });
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete location ${loc.name}?`)) deleteLocation(loc.id);
                        }}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                  FAQs ({faqs.length})
                </h3>
                <button
                  onClick={() => {
                    const question = prompt('Enter Question:');
                    const answer = prompt('Enter Answer:');
                    if (question && answer) saveFAQ({ question, answer });
                  }}
                  className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/20 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#f7f3eb]">{f.question}</h4>
                      <p className="text-xs text-[#b8afa2] mt-1 font-sinhala">{f.answer}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this FAQ?')) deleteFAQ(f.id);
                      }}
                      className="text-xs text-red-400 hover:underline shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ADVANCED SECURITY CONSOLE */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c99a45]/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold">
                      Defense Tier 1
                    </span>
                    <h3 className="text-xl font-editorial font-bold text-[#f7f3eb]">
                      Advanced Security &amp; Access Control Console
                    </h3>
                  </div>
                  <p className="text-xs text-[#b8afa2] mt-1 font-sinhala">
                    අධි-ආරක්ෂිත පරිපාලන සැකසුම්, අනවසර පිවිසුම් අගුළු (Rate-Limiting), Master PIN ආරක්ෂණය, 2FA ප්‍රතිපත්ති සහ සවිස්තරාත්මක Audit Logs කළමනාකරණය කරන්න.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetLockout}
                    className="px-3 py-2 bg-[#1c1214] hover:bg-[#251518] border border-amber-500/40 text-amber-300 rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Clear failed login attempts and reset lockout timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Lockout ({failedAttempts} Fails)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckpointInput(!showCheckpointInput)}
                    className="px-3 py-2 bg-[#1c1214] hover:bg-[#251518] border border-[#dfb56c]/50 text-[#f7e2a9] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Checkpoint</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportAuditLogs}
                    className="px-3 py-2 bg-[#540d18] hover:bg-[#68111e] border border-[#dfb56c] text-[#f7e2a9] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Audit Trail (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Notification Banner */}
              {securitySaveSuccess && (
                <div className="p-3.5 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2.5 font-sinhala shadow-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{securitySaveSuccess}</span>
                </div>
              )}

              {/* Checkpoint Input Drawer */}
              {showCheckpointInput && (
                <div className="p-4 rounded-sm bg-[#181113] border border-[#dfb56c]/60 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Record Security Audit Checkpoint
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCheckpointInput(false)}
                      className="text-[#a89f91] hover:text-white text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#a89f91]">
                    Enter manual audit notes (e.g. system inspection, payment audit, credentials rotation) to log permanently into the tamper-resistant security stream:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkpointInput}
                      onChange={(e) => setCheckpointInput(e.target.value)}
                      placeholder="e.g. Completed bi-weekly student payment verification & security review."
                      className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateSecurityCheckpoint}
                      className="px-4 py-2 bg-[#dfb56c] hover:bg-[#c99a45] text-black font-bold text-xs uppercase rounded-sm"
                    >
                      Save Checkpoint
                    </button>
                  </div>
                </div>
              )}

              {/* Security Health Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#a89f91] mb-2 font-mono">
                    <span>BRUTE-FORCE SHIELD</span>
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-[#f7f3eb]">
                        {failedAttempts}
                      </span>
                      <span className="text-xs text-[#a89f91] font-mono">
                        / {securityForm.maxFailedAttempts} max attempts
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono block mt-1 ${isLockedOut ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                      {isLockedOut ? `LOCKED (${remainingLockoutSec}s)` : '● Armed & Active (15m Lockout)'}
                    </span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#a89f91] mb-2 font-mono">
                    <span>SENSITIVE PIN GUARD</span>
                    <KeyRound className="w-4 h-4 text-[#dfb56c]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-[#dfb56c]">
                        {securityForm.requirePINForSensitiveActions ? 'ENFORCED' : 'OFF'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#a89f91] font-mono block mt-1">
                      Protects Payments &amp; Fee Edits
                    </span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#a89f91] mb-2 font-mono">
                    <span>SESSION TIMEOUT</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-[#f7f3eb]">
                        {securityForm.sessionTimeoutMinutes}
                      </span>
                      <span className="text-xs text-[#a89f91] font-mono">minutes</span>
                    </div>
                    <span className="text-[11px] text-sky-400 font-mono block mt-1">
                      {securityForm.enforceTwoFactor ? '● 2FA Enforced' : '● Inactivity Expiry Active'}
                    </span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#a89f91] mb-2 font-mono">
                    <span>IMMUTABLE AUDIT LOGS</span>
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-[#f7f3eb]">
                        {auditLogs.length}
                      </span>
                      <span className="text-xs text-[#a89f91] font-mono">events</span>
                    </div>
                    <span className="text-[11px] text-purple-400 font-mono block mt-1">
                      {securityForm.auditLogRetentionDays} Days Live Retention
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Policy Controls & Master PIN Manager */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 & 2: Security Policy Settings */}
                <div className="lg:col-span-2 p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#dfb56c]" />
                      <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-[#f7f3eb]">
                        Security Policy &amp; Access Parameters
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#a89f91]">Configurable by Super Admin</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Session Timeout */}
                    <div>
                      <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                        Auto Session Inactivity Timeout
                      </label>
                      <select
                        value={securityForm.sessionTimeoutMinutes}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, sessionTimeoutMinutes: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                      >
                        <option value={15}>15 Minutes (Strict High Security)</option>
                        <option value={30}>30 Minutes (Recommended Standard)</option>
                        <option value={60}>60 Minutes (Extended Operations)</option>
                        <option value={120}>120 Minutes (2 Hours Maximum)</option>
                      </select>
                      <span className="text-[10px] text-[#a89f91] mt-1 block font-sinhala">
                        පරිපාලක විසින් කිසිදු ක්‍රියාවක් නොකරන විට console එක ස්වයංක්‍රීයව sign out වන කාලය.
                      </span>
                    </div>

                    {/* Max Failed Attempts */}
                    <div>
                      <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                        Brute-Force Lockout Threshold
                      </label>
                      <select
                        value={securityForm.maxFailedAttempts}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, maxFailedAttempts: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                      >
                        <option value={3}>3 Failed Attempts (Ultra-Strict)</option>
                        <option value={5}>5 Failed Attempts (Standard Protection)</option>
                        <option value={10}>10 Failed Attempts (Relaxed)</option>
                      </select>
                      <span className="text-[10px] text-[#a89f91] mt-1 block font-sinhala">
                        මුරපදය වැරදුන වාර ගණන ඉක්මවූ විට console එක අගුළු වැටෙන සීමාව.
                      </span>
                    </div>

                    {/* Lockout Duration */}
                    <div>
                      <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                        Lockout Penalty Duration
                      </label>
                      <select
                        value={securityForm.lockoutDurationMinutes}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, lockoutDurationMinutes: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                      >
                        <option value={10}>10 Minutes Temporary Lock</option>
                        <option value={15}>15 Minutes (Recommended)</option>
                        <option value={30}>30 Minutes Extended Lock</option>
                        <option value={60}>60 Minutes Maximum Lockdown</option>
                      </select>
                    </div>

                    {/* Audit Retention */}
                    <div>
                      <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5 font-semibold">
                        Audit Log Retention Period
                      </label>
                      <select
                        value={securityForm.auditLogRetentionDays}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, auditLogRetentionDays: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                      >
                        <option value={30}>30 Days</option>
                        <option value={90}>90 Days (Quarterly Audit)</option>
                        <option value={180}>180 Days (Half Year)</option>
                        <option value={365}>365 Days (1 Full Year)</option>
                      </select>
                    </div>
                  </div>

                  {/* Security Policy Checkbox Toggles */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <label className="flex items-start gap-3 p-3 rounded bg-black/40 border border-white/10 hover:border-[#dfb56c]/40 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={securityForm.requirePINForSensitiveActions}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, requirePINForSensitiveActions: e.target.checked })
                        }
                        className="mt-0.5 accent-[#dfb56c]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#f7f3eb] block font-mono">
                          Require Master Security PIN for High-Risk Actions
                        </span>
                        <span className="text-[11px] text-[#b8afa2] font-sinhala block mt-0.5">
                          සිසුන්ගේ බැංකු රිසිට්පත් අනුමත කිරීම/ප්‍රතික්ෂේප කිරීම, සිසුන් දත්ත මකාදැමීම සහ පාඨමාලා ගාස්තු වෙනස් කිරීම සඳහා ආරක්ෂක Master PIN අංකය අනිවාර්ය කරන්න.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded bg-black/40 border border-white/10 hover:border-[#dfb56c]/40 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={securityForm.enforceTwoFactor}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, enforceTwoFactor: e.target.checked })
                        }
                        className="mt-0.5 accent-[#dfb56c]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#f7f3eb] block font-mono">
                          Enforce Two-Factor Authentication (2FA Policy)
                        </span>
                        <span className="text-[11px] text-[#b8afa2] font-sinhala block mt-0.5">
                          පරිපාලක පිවිසුම සඳහා Google Authenticator / Firebase 2FA ආරක්ෂක තහවුරු කිරීම සක්‍රීය කරන්න.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded bg-black/40 border border-white/10 hover:border-[#dfb56c]/40 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={securityForm.emailAlertsOnFailedLogin}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, emailAlertsOnFailedLogin: e.target.checked })
                        }
                        className="mt-0.5 accent-[#dfb56c]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#f7f3eb] block font-mono">
                          Instant Security Alert Dispatch on Threat Detection
                        </span>
                        <span className="text-[11px] text-[#b8afa2] font-sinhala block mt-0.5">
                          අඛණ්ඩව 3 වරකට වඩා වැරදි මුරපද ඇතුළත් කළහොත් ප්‍රධාන පරිපාලකගේ ඊමේල් ලිපිනය වෙත වහාම ආරක්ෂක අනතුරු ඇඟවීමක් එවන්න.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSavingSecurity}
                      onClick={handleSaveSecuritySettings}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 fill-black" />
                      <span>{isSavingSecurity ? 'Saving Security Policies...' : 'Save & Enforce Security Policies'}</span>
                    </button>
                  </div>
                </div>

                {/* Column 3: Master PIN Management */}
                <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <KeyRound className="w-4 h-4 text-[#dfb56c]" />
                      <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-[#f7f3eb]">
                        Master Security PIN
                      </h4>
                    </div>

                    <p className="text-[11px] text-[#b8afa2] mt-2 font-sinhala leading-relaxed">
                      ගෙවීම් තහවුරු කිරීම් (Payment Verification) සහ සංවේදී දත්ත වෙනස් කිරීම් සඳහා භාවිත වන Master PIN අංකය (Default: 755312) මෙතැනින් ආරක්ෂිතව වෙනස් කරන්න.
                    </p>

                    {pinChangeMsg && (
                      <div
                        className={`p-3 rounded text-xs mt-3 flex items-start gap-2 ${
                          pinChangeMsg.isError
                            ? 'bg-red-950/80 border border-red-500 text-red-200'
                            : 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                        }`}
                      >
                        {pinChangeMsg.isError ? (
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        )}
                        <span className="font-sinhala leading-tight">{pinChangeMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateMasterPIN} className="space-y-3 mt-4">
                      <div>
                        <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1 font-semibold">
                          Current Master PIN
                        </label>
                        <input
                          type={showPinInputText ? 'text' : 'password'}
                          value={currentPinInput}
                          onChange={(e) => setCurrentPinInput(e.target.value)}
                          placeholder="Current PIN (e.g. 755312)"
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] font-mono tracking-widest outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1 font-semibold">
                          New Master PIN (4-8 Digits)
                        </label>
                        <input
                          type={showPinInputText ? 'text' : 'password'}
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value)}
                          placeholder="••••••"
                          maxLength={8}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] font-mono tracking-widest outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1 font-semibold">
                          Confirm New Master PIN
                        </label>
                        <input
                          type={showPinInputText ? 'text' : 'password'}
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value)}
                          placeholder="••••••"
                          maxLength={8}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] font-mono tracking-widest outline-none"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setShowPinInputText(!showPinInputText)}
                          className="text-[11px] text-[#a89f91] hover:text-[#dfb56c] flex items-center gap-1 cursor-pointer"
                        >
                          {showPinInputText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPinInputText ? 'Hide Digits' : 'Show Digits'}</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#540d18] hover:bg-[#68111e] border border-[#dfb56c] text-[#f7e2a9] font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Update Master PIN</span>
                      </button>
                    </form>
                  </div>

                  {/* Tamper Shield Note */}
                  <div className="p-3 rounded bg-[#1c1214] border border-[#dfb56c]/30 text-[11px] text-[#a89f91] font-sinhala leading-relaxed">
                    <span className="font-bold text-[#dfb56c] block mb-1 font-mono uppercase">
                      🔒 Anti-Tamper Shield
                    </span>
                    පාඨමාලා ගාස්තු සහ බැංකු ගිණුම් තොරතුරු client-side හරහා අනවසරයෙන් වෙනස් කළ නොහැකි ලෙස cryptographic token validation මගින් ආරක්ෂා කර ඇත.
                  </div>
                </div>
              </div>

              {/* Real-Time Security Audit Log Stream */}
              <div className="p-5 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <div>
                      <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-[#f7f3eb]">
                        Live Security &amp; Administrative Audit Stream
                      </h4>
                      <span className="text-[10px] text-[#a89f91] font-mono">
                        Showing {filteredAuditLogs.length} of {auditLogs.length} total events
                      </span>
                    </div>
                  </div>

                  {/* Search and Category Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-2.5 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={auditSearchQuery}
                        onChange={(e) => setAuditSearchQuery(e.target.value)}
                        placeholder="Search audit trail..."
                        className="pl-8 pr-3 py-1.5 bg-black/60 border border-white/20 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none w-44"
                      />
                    </div>

                    <select
                      value={auditFilterCategory}
                      onChange={(e) => setAuditFilterCategory(e.target.value)}
                      className="px-2.5 py-1.5 bg-black/60 border border-white/20 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none font-mono"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="SECURITY">Security &amp; PIN</option>
                      <option value="PAYMENT">Payments &amp; Slips</option>
                      <option value="STUDENT">Student Access</option>
                      <option value="LOCKOUT">Lockouts &amp; Auth</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleExportAuditLogs}
                      className="px-2.5 py-1.5 bg-[#1c1214] hover:bg-[#251518] border border-white/20 hover:border-[#dfb56c] rounded-sm text-xs text-[#dfb56c] flex items-center gap-1 font-mono transition-colors"
                      title="Download complete audit log in CSV format"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                {/* Audit Entries List */}
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                      No security audit events found matching the criteria.
                    </div>
                  ) : (
                    filteredAuditLogs.map((log) => {
                      const isSecurity =
                        log.action.includes('SECURITY') ||
                        log.action.includes('PIN') ||
                        log.action.includes('LOCKOUT');
                      const isPayment = log.action.includes('PAYMENT');
                      const isStudent = log.action.includes('STUDENT');

                      return (
                        <div
                          key={log.id}
                          className="p-3 rounded-sm bg-[#141011] border border-white/5 hover:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 mt-0.5 ${
                                isSecurity
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                                  : isPayment
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                  : isStudent
                                  ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                                  : 'bg-zinc-800 text-zinc-300 border border-white/10'
                              }`}
                            >
                              {log.action}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[#f7f3eb] font-sans break-words">{log.details}</p>
                              <div className="flex items-center gap-3 text-[10px] text-[#a89f91] font-mono mt-1">
                                <span>Actor: {log.adminEmail}</span>
                                <span>•</span>
                                <span>ID: {log.id}</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-[11px] font-mono text-[#dfb56c] block">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono block">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* VIEW SLIP FULL PREVIEW MODAL */}
      {viewSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#141011] rounded border border-[#dfb56c] p-6 shadow-2xl">
            <button
              onClick={() => setViewSlipModal(null)}
              className="absolute top-4 right-4 text-white hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <span className="font-mono font-bold text-sm text-[#dfb56c]">
                {viewSlipModal.regNumber} • {viewSlipModal.studentName}
              </span>
              <p className="text-xs text-[#a89f91]">
                Amount: Rs. {viewSlipModal.amount.toLocaleString()} • Ref: {viewSlipModal.transactionReference}
              </p>
            </div>
            <div className="max-h-[65vh] overflow-y-auto rounded border border-white/10 mb-4 bg-black flex items-center justify-center p-2">
              {Boolean(viewSlipModal?.slipUrl && viewSlipModal.slipUrl.trim()) ? (
                <img
                  src={viewSlipModal.slipUrl.trim()}
                  alt="Deposit Slip"
                  className="max-h-[60vh] object-contain"
                />
              ) : (
                <span className="text-xs text-[#a89f91] py-12">No slip image uploaded</span>
              )}
            </div>
            {viewSlipModal.status === 'PENDING' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    approvePaymentSlip(viewSlipModal.id, viewSlipModal.regNumber);
                    setViewSlipModal(null);
                  }}
                  className="flex-1 py-2.5 bg-green-600 text-white font-bold text-xs uppercase rounded"
                >
                  Approve Payment &amp; Unlock Lessons
                </button>
                <button
                  onClick={() => {
                    rejectPaymentSlip(viewSlipModal.id);
                    setViewSlipModal(null);
                  }}
                  className="px-6 py-2.5 bg-red-800 text-white font-bold text-xs uppercase rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW STUDENT DOSSIER MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <span className="font-mono text-xl font-bold text-[#dfb56c]">
                {selectedReg.regNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                {selectedReg.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="text-[#a89f91] block">Full Name:</span>
                <strong className="text-sm text-[#f7f3eb]">{selectedReg.fullName}</strong>
              </div>
              <div>
                <span className="text-[#a89f91] block">WhatsApp:</span>
                <a
                  href={`https://wa.me/${selectedReg.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-[#dfb56c] hover:underline"
                >
                  {selectedReg.whatsappNumber}
                </a>
              </div>
              <div>
                <span className="text-[#a89f91] block">Class Mode:</span>
                <strong className="text-[#f7e2a9]">{selectedReg.courseType} ({selectedReg.location || 'Online'})</strong>
              </div>
              <div>
                <span className="text-[#a89f91] block">Course Access:</span>
                <strong className={selectedReg.courseAccess === 'ACTIVE' ? 'text-green-400' : 'text-zinc-400'}>
                  {selectedReg.courseAccess}
                </strong>
              </div>
            </div>

            {/* Month-by-Month Active Payment Access Control */}
            <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#dfb56c]" />
                  Month-by-Month Fee &amp; LMS Active Access (මාසික ප්‍රවේශය සක්‍රිය කිරීම):
                </span>
                <span className="text-[10px] font-mono text-[#a89f91]">
                  Click to Activate or Lock
                </span>
              </div>
              <p className="text-[11px] text-[#d5cfc4] font-sinhala">
                ගාස්තු ගෙවූ මාස පමණක් සක්‍රිය (Active) කර අනෙක් මාස අගුළු ලා තබන්න. ශිෂ්‍යයාට තම Dashboard හරහා නැරඹිය හැක්කේ මෙහි Active කර ඇති මාස පමණි.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6].map((m) => {
                  const studentPaidMonths = getStudentPaidMonths(selectedReg.id, selectedReg.courseId || 'course-01');
                  const isPaid = studentPaidMonths.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleStudentPaidMonth(selectedReg.id, selectedReg.courseId || 'course-01', m, !isPaid)}
                      className={`p-2 rounded text-xs font-mono font-bold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isPaid
                          ? 'bg-green-950/70 border-green-500 text-green-300 shadow-sm hover:bg-red-950/70 hover:border-red-500 hover:text-red-300'
                          : 'bg-[#141011] border-white/10 text-zinc-400 hover:border-green-600 hover:text-green-300 hover:bg-green-950/40'
                      }`}
                      title={isPaid ? `Month 0${m}: Active (Click to Lock)` : `Month 0${m}: Locked (Click to Activate)`}
                    >
                      <div className="flex items-center gap-1">
                        {isPaid ? <Unlock className="w-3 h-3 text-green-400" /> : <Lock className="w-3 h-3 text-zinc-500" />}
                        <span>M0{m}</span>
                      </div>
                      <span className={`text-[9px] uppercase ${isPaid ? 'text-green-400' : 'text-zinc-500'}`}>
                        {isPaid ? 'Active ✓' : 'Locked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes Section */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <label className="block text-xs uppercase font-mono text-[#dfb56c] mb-1">
                Internal Counselor Notes:
              </label>
              <textarea
                rows={3}
                defaultValue={selectedReg.adminNotes || ''}
                onBlur={(e) => updateRegistrationNotes(selectedReg.id, e.target.value)}
                placeholder="Add private student notes..."
                className="w-full p-2.5 bg-black/50 border border-white/10 rounded text-xs text-[#f7f3eb]"
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT RECORD MODAL */}
      {editingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl">
            <button
              onClick={() => setEditingReg(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-editorial font-bold text-[#f7f3eb] mb-4">
              Edit Student: {editingReg.regNumber}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89f91] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingReg.fullName}
                  onChange={(e) => setEditingReg({ ...editingReg, fullName: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div>
                <label className="block text-[#a89f91] mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={editingReg.whatsappNumber}
                  onChange={(e) => setEditingReg({ ...editingReg, whatsappNumber: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditingReg(null)}
                  className="px-4 py-2 border border-white/10 rounded text-[#a89f91]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await updateRegistrationFull(editingReg.id, editingReg);
                    setEditingReg(null);
                  }}
                  className="px-5 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] font-bold rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT WHY FEATURE MODAL (TITLE, SINHALA TITLE, DESCRIPTION, AND ADVANCE IMAGE URL) */}
      {editingWhyFeature && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8">
            <button
              onClick={() => setEditingWhyFeature(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-editorial font-bold text-[#f7e2a9] mb-1">
              Edit Why Course Pillar #{editingWhyFeature.number}
            </h3>
            <p className="text-xs text-[#a89f91] mb-5">
              Change the image, English &amp; Sinhala titles, descriptions, icon, and display order.
            </p>

            <div className="space-y-4 text-xs">
              {/* Image Preview & URL Field */}
              <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30">
                <label className="block text-[11px] uppercase font-mono text-[#dfb56c] font-bold mb-2">
                  Pillar Background Image URL (Advance High-Fashion Photo)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-44 h-28 rounded overflow-hidden bg-black border border-white/20 shrink-0">
                    <img
                      src={editingWhyFeature.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={editingWhyFeature.imageUrl}
                      onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, imageUrl: e.target.value })}
                      placeholder="Paste Unsplash or hosted image URL..."
                      className="w-full p-2.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                    />
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="text-[#a89f91]">Quick presets:</span>
                      <button
                        type="button"
                        onClick={() => setEditingWhyFeature({ ...editingWhyFeature, imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[#dfb56c]"
                      >
                        Pattern Drafting
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWhyFeature({ ...editingWhyFeature, imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[#dfb56c]"
                      >
                        AI Fashion
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWhyFeature({ ...editingWhyFeature, imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[#dfb56c]"
                      >
                        Runway Haute
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number and Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1">Number (e.g. 01)</label>
                  <input
                    type="text"
                    value={editingWhyFeature.number}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, number: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1">Icon Name</label>
                  <select
                    value={editingWhyFeature.iconName}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, iconName: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  >
                    <option value="Scissors">Scissors</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Monitor">Monitor (CAD)</option>
                    <option value="Cpu">Cpu (AI)</option>
                    <option value="Layers">Layers (Construction)</option>
                    <option value="Crown">Crown (Brand)</option>
                    <option value="TrendingUp">TrendingUp (Marketing)</option>
                    <option value="Share2">Share2 (Social)</option>
                    <option value="Wand2">Wand2 (AI Creative)</option>
                    <option value="Video">Video (Reels)</option>
                    <option value="PackageCheck">PackageCheck (Packaging)</option>
                    <option value="Globe2">Globe2 (Global)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1">Order</label>
                  <input
                    type="number"
                    value={editingWhyFeature.order}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, order: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
              </div>

              {/* English & Sinhala Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase">English Title</label>
                  <input
                    type="text"
                    value={editingWhyFeature.title}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, title: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold">Sinhala Title (සිංහල මාතෘකාව)</label>
                  <input
                    type="text"
                    value={editingWhyFeature.titleSinhala || ''}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, titleSinhala: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                  />
                </div>
              </div>

              {/* English & Sinhala Descriptions */}
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase">English Description</label>
                <textarea
                  rows={2}
                  value={editingWhyFeature.description}
                  onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, description: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div>
                <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold">Sinhala Description (සිංහල විස්තරය)</label>
                <textarea
                  rows={2}
                  value={editingWhyFeature.descriptionSinhala || ''}
                  onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, descriptionSinhala: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                />
              </div>

              {/* Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1">Badge (English)</label>
                  <input
                    type="text"
                    value={editingWhyFeature.badge || ''}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, badge: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-sinhala">Badge (Sinhala)</label>
                  <input
                    type="text"
                    value={editingWhyFeature.badgeSinhala || ''}
                    onChange={(e) => setEditingWhyFeature({ ...editingWhyFeature, badgeSinhala: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-sinhala"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWhyFeature(null)}
                  className="px-4 py-2 border border-white/10 rounded text-[#a89f91]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await saveWhyFeature(editingWhyFeature);
                    setEditingWhyFeature(null);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase rounded shadow-lg"
                >
                  Save Pillar &amp; Publish Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT VIDEO MODAL (TITLE, SINHALA TITLE, THUMBNAIL IMAGE, YOUTUBE URL) */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8">
            <button
              onClick={() => setEditingVideo(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-editorial font-bold text-[#f7e2a9] mb-1">
              Edit Masterclass Video
            </h3>
            <p className="text-xs text-[#a89f91] mb-5">
              Change the custom cover thumbnail, YouTube URL, titles in Sinhala and English, and categories.
            </p>

            <div className="space-y-4 text-xs">
              {/* Custom Thumbnail Image */}
              <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30">
                <label className="block text-[11px] uppercase font-mono text-[#dfb56c] font-bold mb-2">
                  Custom Video Cover Thumbnail Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-48 aspect-video rounded overflow-hidden bg-black border border-white/20 shrink-0 relative">
                    <img
                      src={editingVideo.thumbnailUrl || getYouTubeThumbnailUrl(editingVideo.youtubeUrl || editingVideo.videoId)}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editingVideo.thumbnailUrl || ''}
                        onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                        placeholder="Paste custom cover URL or use official YouTube thumbnail..."
                        className="flex-1 p-2.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const vid = parseYouTubeVideoId(editingVideo.youtubeUrl) || editingVideo.videoId;
                          if (vid) {
                            setEditingVideo({ ...editingVideo, thumbnailUrl: getYouTubeThumbnailUrl(vid) });
                          }
                        }}
                        className="btn-3d-secondary px-3 py-1.5 text-[11px] rounded whitespace-nowrap text-[#dfb56c] cursor-pointer"
                        title="Fetch thumbnail directly from YouTube"
                      >
                        🔄 Auto Thumbnail
                      </button>
                      <label className="btn-3d-secondary px-3 py-1.5 text-[11px] rounded whitespace-nowrap text-[#f7e2a9] cursor-pointer inline-flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 1280, 720, 0.82);
                                setEditingVideo({ ...editingVideo, thumbnailUrl: compressed });
                              } catch (_) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (res) setEditingVideo({ ...editingVideo, thumbnailUrl: res });
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-[#a89f91] block">
                      Upload a file, paste custom image URL, or click Auto Thumbnail to automatically fetch from YouTube.
                    </span>
                  </div>
                </div>
              </div>

              {/* YouTube URL & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase">YouTube URL</label>
                  <input
                    type="url"
                    value={editingVideo.youtubeUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      const vid = parseYouTubeVideoId(url);
                      const isOldOrPlaceholderThumb =
                        !editingVideo.thumbnailUrl ||
                        editingVideo.thumbnailUrl.includes('images.unsplash.com') ||
                        editingVideo.thumbnailUrl.includes('img.youtube.com/vi/');
                      setEditingVideo({
                        ...editingVideo,
                        youtubeUrl: url,
                        videoId: vid,
                        thumbnailUrl: vid && isOldOrPlaceholderThumb ? getYouTubeThumbnailUrl(vid) : editingVideo.thumbnailUrl,
                      });
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1">Duration (e.g. 12:30)</label>
                  <input
                    type="text"
                    value={editingVideo.duration || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
              </div>

              {/* Titles in English and Sinhala */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase">Video Title (English)</label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold">Sinhala Title (සිංහල මාතෘකාව)</label>
                  <input
                    type="text"
                    value={editingVideo.titleSinhala || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, titleSinhala: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                  />
                </div>
              </div>

              {/* Descriptions in English and Sinhala */}
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase">English Description</label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div>
                <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold">Sinhala Description (සිංහල විස්තරය)</label>
                <textarea
                  rows={2}
                  value={editingVideo.descriptionSinhala || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, descriptionSinhala: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                />
              </div>

              {/* Category and Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[#a89f91] mb-1">Category</label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  >
                    <option value="COURSE INTRODUCTION">COURSE INTRODUCTION</option>
                    <option value="PINTEREST SEWING TUTORIALS">PINTEREST SEWING TUTORIALS (Pinterest මැහුම් ටියුටෝරියල්)</option>
                    <option value="PATTERN MAKING">PATTERN MAKING</option>
                    <option value="AI">AI FASHION</option>
                    <option value="BRANDING">BRANDING</option>
                    <option value="STUDENT REVIEWS">STUDENT REVIEWS (ශිෂ්‍ය ප්‍රතිචාර වීඩියෝ)</option>
                    <option value="STUDENT VIDEOS">STUDENT VIDEOS (සිසුන්ගේ නිර්මාණ)</option>
                  </select>
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9]">
                    <input
                      type="checkbox"
                      checked={editingVideo.isFeatured}
                      onChange={(e) => setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#dfb56c]"
                    />
                    <span className="font-bold">Featured Spotlight Masterclass</span>
                  </label>
                </div>

                {editingVideo.category === 'PINTEREST SEWING TUTORIALS' && (
                  <div className="sm:col-span-2">
                    <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold">
                      මැහුම් තාක්ෂණික අනු-ප්‍රවර්ගය (Tailoring Sub-Category)
                    </label>
                    <select
                      value={editingVideo.categorySinhala || 'ඩාට් සහ බඳ හැඩතල'}
                      onChange={(e) => setEditingVideo({ ...editingVideo, categorySinhala: e.target.value })}
                      className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/40 rounded text-[#f7e2a9] font-sinhala"
                    >
                      <option value="ඩාට් සහ බඳ හැඩතල">ඩාට් සහ බඳ හැඩතල (Darts & Shaping)</option>
                      <option value="සිපර් සහ මැහුම්">සිපර් සහ මැහුම් (Zippers & Seams)</option>
                      <option value="කර සහ කරපටි">කර සහ කරපටි (Collars & Lapels)</option>
                      <option value="කෝට් සහ බ්ලේසර්">කෝට් සහ බ්ලේසර් (Coats & Tailoring)</option>
                      <option value="සාය සහ රැලි මෝස්තර">සාය සහ රැලි මෝස්තර (Skirts & Pleats)</option>
                      <option value="අත් සහ කෆ් විලාසිතා">අත් සහ කෆ් විලාසිතා (Sleeves & Cuffs)</option>
                      <option value="මැහුම් වාටි හා නිමාවන්">මැහුම් වාටි හා නිමාවන් (Finishing & Hems)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 border border-white/10 rounded text-[#a89f91]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await saveYouTubeVideo(editingVideo);
                    setEditingVideo(null);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase rounded shadow-lg"
                >
                  Save Video &amp; Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD LMS LESSON MODAL (FULL RICH CMS) */}
      {/* ======================================================== */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                LMS Private Lesson Editor
              </span>
              <h3 className="text-xl font-editorial font-bold text-[#f7e2a9]">
                {editingLesson.id.startsWith('les-') && editingLesson.title ? 'Edit Private Lesson & Handouts' : 'Create New Recorded Lesson'}
              </h3>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Add or edit lesson video lectures, downloadable PDFs, rich notes, and lesson diagrams.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Course, Month, Module, Lesson # & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* 1. Associated Course */}
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-mono uppercase text-[10px] font-bold">
                    Target Course (පාඨමාලාව) *
                  </label>
                  <select
                    value={editingLesson.courseId || courses[0]?.id || ''}
                    onChange={(e) => {
                      const selectedC = courses.find((c) => c.id === e.target.value);
                      setEditingLesson({
                        ...editingLesson,
                        courseId: e.target.value,
                        courseTitle: selectedC?.title || editingLesson.courseTitle,
                      });
                    }}
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/40 rounded text-[#f7e2a9] font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Month Selector for Dynamic Month-based Access */}
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-mono uppercase text-[10px] font-bold">
                    Access Month (අදාළ මාසය) *
                  </label>
                  <select
                    value={editingLesson.month || 1}
                    onChange={(e) => {
                      setEditingLesson({
                        ...editingLesson,
                        month: Number(e.target.value) || 1,
                      });
                    }}
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/40 rounded text-[#f7e2a9] font-mono font-bold"
                  >
                    <option value={1}>Month 01 (මස 01)</option>
                    <option value={2}>Month 02 (මස 02)</option>
                    <option value={3}>Month 03 (මස 03)</option>
                    <option value={4}>Month 04 (මස 04)</option>
                    <option value={5}>Month 05 (මස 05)</option>
                    <option value={6}>Month 06 (මස 06)</option>
                  </select>
                </div>

                {/* 3. Curriculum Module */}
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                    Curriculum Module
                  </label>
                  <select
                    value={editingLesson.moduleId || ''}
                    onChange={(e) => {
                      const selectedM = modules.find((m) => m.id === e.target.value);
                      setEditingLesson({
                        ...editingLesson,
                        moduleId: e.target.value,
                        moduleNumber: selectedM?.number || editingLesson.moduleNumber,
                        moduleTitle: selectedM?.title || editingLesson.moduleTitle,
                      });
                    }}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.number} - {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Lesson Number & Duration */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Lesson #</label>
                    <input
                      type="text"
                      value={editingLesson.lessonNumber}
                      onChange={(e) => setEditingLesson({ ...editingLesson, lessonNumber: e.target.value })}
                      placeholder="01"
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Duration</label>
                    <input
                      type="text"
                      value={editingLesson.duration}
                      onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                      placeholder="25:00"
                      className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lesson Titles (English & Sinhala) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Lesson Title (English) *</label>
                  <input
                    type="text"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    placeholder="e.g. Mastering Anatomical Landmark Points"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Title (සිංහල මාතෘකාව)</label>
                  <input
                    type="text"
                    value={editingLesson.titleSinhala || ''}
                    onChange={(e) => setEditingLesson({ ...editingLesson, titleSinhala: e.target.value })}
                    placeholder="උදා: ශරීරයේ මිනුම් ලක්ෂ්‍ය නිවැරදිව ලබාගැනීම"
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                  />
                </div>
              </div>

              {/* ======================================================== */}
              {/* 1. MULTIPLE YOUTUBE VIDEOS PLAYLIST CMS (වීඩියෝ එකකට වඩා එක් කිරීම) */}
              {/* ======================================================== */}
              {(() => {
                const currentVideos: LessonVideoItem[] = (editingLesson.videoUrls && editingLesson.videoUrls.length > 0)
                  ? editingLesson.videoUrls
                  : (editingLesson.videoUrl
                      ? [{ id: `vid-${editingLesson.id}-1`, title: editingLesson.title || 'Part 01: Masterclass Video', videoUrl: editingLesson.videoUrl, videoId: editingLesson.videoId, duration: editingLesson.duration || '25:00' }]
                      : [{ id: `vid-${Date.now()}-1`, title: 'Part 01: Main Lesson Video', videoUrl: '', duration: '25:00' }]);

                const currentPdfs: LessonMaterialItem[] = (editingLesson.pdfMaterials && editingLesson.pdfMaterials.length > 0)
                  ? editingLesson.pdfMaterials
                  : (editingLesson.pdfUrl
                      ? [{ id: `pdf-${editingLesson.id}-1`, title: editingLesson.pdfTitle || 'Lesson Study Notes.pdf', url: editingLesson.pdfUrl, size: 'Official PDF Handout' }]
                      : []);

                return (
                  <div className="space-y-4">
                    {/* Multi-Video Section */}
                    <div className="p-4 rounded-sm bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-[#dfb56c]" />
                          <span className="text-[#f7e2a9] font-mono uppercase text-xs font-bold">
                            YouTube Video Links &amp; Multi-Video Playlist ({currentVideos.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newVid: LessonVideoItem = {
                              id: `vid-${Date.now()}-${currentVideos.length + 1}`,
                              title: `Part 0${currentVideos.length + 1}: Demonstration`,
                              videoUrl: '',
                              duration: '20:00',
                            };
                            setEditingLesson({
                              ...editingLesson,
                              videoUrls: [...currentVideos, newVid],
                            });
                          }}
                          className="px-3 py-1.5 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase rounded-sm hover:bg-[#6e1322] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Another YouTube Video</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-[#a89f91] font-sinhala">
                        මෙම පාඩමට අදාළව YouTube වීඩියෝ ලින්ක් කිහිපයක් (Multiple Videos / Parts) ඇතුළත් කළ හැක. ශිෂ්‍යයන්ට මේ සියල්ල එකම පාඩම තුළ පිළිවෙළින් නැරඹිය හැක.
                      </p>

                      <div className="space-y-3">
                        {currentVideos.map((vidItem, vIdx) => {
                          const parsedId = vidItem.videoId || parseYouTubeVideoId(vidItem.videoUrl);
                          return (
                            <div
                              key={vidItem.id || vIdx}
                              className="p-3.5 rounded bg-[#141011] border border-white/10 space-y-2.5 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#dfb56c] font-bold flex items-center gap-1.5">
                                  <Play className="w-3.5 h-3.5 fill-[#dfb56c]" />
                                  <span>Video #{vIdx + 1} {vIdx === 0 ? '(Primary Stream)' : ''}</span>
                                </span>
                                {currentVideos.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = currentVideos.filter((_, i) => i !== vIdx);
                                      setEditingLesson({
                                        ...editingLesson,
                                        videoUrls: updated,
                                      });
                                    }}
                                    className="text-red-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                                    title="Remove this video"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Remove Video</span>
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                {/* Title */}
                                <div className="sm:col-span-5">
                                  <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                                    Video Title (e.g. Part {vIdx + 1}: Bodice Drafting)
                                  </label>
                                  <input
                                    type="text"
                                    value={vidItem.title}
                                    onChange={(e) => {
                                      const updated = currentVideos.map((item, i) =>
                                        i === vIdx ? { ...item, title: e.target.value } : item
                                      );
                                      setEditingLesson({ ...editingLesson, videoUrls: updated });
                                    }}
                                    placeholder={`Part 0${vIdx + 1}: Demonstration`}
                                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                                  />
                                </div>

                                {/* URL */}
                                <div className="sm:col-span-5">
                                  <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                                    YouTube URL (https://www.youtube.com/watch?v=...)
                                  </label>
                                  <input
                                    type="url"
                                    value={vidItem.videoUrl}
                                    onChange={(e) => {
                                      const url = e.target.value;
                                      const vId = parseYouTubeVideoId(url);
                                      const updated = currentVideos.map((item, i) =>
                                        i === vIdx ? { ...item, videoUrl: url, videoId: vId } : item
                                      );
                                      setEditingLesson({ ...editingLesson, videoUrls: updated });
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                                  />
                                </div>

                                {/* Duration */}
                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={vidItem.duration || '20:00'}
                                    onChange={(e) => {
                                      const updated = currentVideos.map((item, i) =>
                                        i === vIdx ? { ...item, duration: e.target.value } : item
                                      );
                                      setEditingLesson({ ...editingLesson, videoUrls: updated });
                                    }}
                                    placeholder="20:00"
                                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Thumbnail preview if URL provided */}
                              {parsedId && (
                                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-green-400">
                                  <img
                                    src={`https://img.youtube.com/vi/${parsedId}/hqdefault.jpg`}
                                    alt="Thumb"
                                    className="w-12 h-7 object-cover rounded border border-white/20"
                                  />
                                  <span>✓ YouTube ID: {parsedId} (Protected Stream Ready)</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Lesson Description (English)</label>
                        <textarea
                          rows={2}
                          value={editingLesson.description}
                          onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                          className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Description (සිංහල විස්තරය)</label>
                        <textarea
                          rows={2}
                          value={editingLesson.descriptionSinhala || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, descriptionSinhala: e.target.value })}
                          className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala text-xs"
                        />
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* 2. MULTIPLE PDF DOCUMENTS CMS (PDF කිහිපයක් එක් කිරීම) */}
                    {/* ======================================================== */}
                    <div className="p-4 rounded-sm bg-[#0c090a] border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span className="text-[#f7e2a9] font-mono uppercase text-xs font-bold">
                            Downloadable PDF Study Handouts &amp; Formulas ({currentPdfs.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newPdf: LessonMaterialItem = {
                              id: `pdf-${Date.now()}-${currentPdfs.length + 1}`,
                              title: `Lesson_${editingLesson.lessonNumber || '01'}_Handout_${currentPdfs.length + 1}.pdf`,
                              url: '',
                              size: 'PDF Document',
                            };
                            setEditingLesson({
                              ...editingLesson,
                              pdfMaterials: [...currentPdfs, newPdf],
                            });
                          }}
                          className="px-3 py-1.5 bg-[#540d18] border border-amber-500/60 text-[#f7e2a9] text-xs font-bold uppercase rounded-sm hover:bg-[#6e1322] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Another PDF Handout</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-[#a89f91] font-sinhala">
                        මෙම පාඩමට අදාළව බාගත හැකි PDF සටහන්, මිණුම් වගු සහ සූත්‍ර පත්‍රිකා කිහිපයක් (Multiple PDFs) මෙතැනින් එකතු කළ හැක.
                      </p>

                      {currentPdfs.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-white/10 rounded text-xs text-[#a89f91]">
                          No PDF handouts attached yet. Click "+ Add Another PDF Handout" above to attach PDF documents.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {currentPdfs.map((pdfItem, pIdx) => (
                            <div
                              key={pdfItem.id || pIdx}
                              className="p-3.5 rounded bg-[#141011] border border-white/10 space-y-2.5 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                                  <span>PDF Handout #{pIdx + 1}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentPdfs.filter((_, i) => i !== pIdx);
                                    setEditingLesson({
                                      ...editingLesson,
                                      pdfMaterials: updated,
                                    });
                                  }}
                                  className="text-red-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                                  title="Remove this PDF"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove PDF</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                {/* Title */}
                                <div className="sm:col-span-5">
                                  <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                                    PDF Display Title
                                  </label>
                                  <input
                                    type="text"
                                    value={pdfItem.title}
                                    onChange={(e) => {
                                      const updated = currentPdfs.map((item, i) =>
                                        i === pIdx ? { ...item, title: e.target.value } : item
                                      );
                                      setEditingLesson({ ...editingLesson, pdfMaterials: updated });
                                    }}
                                    placeholder="e.g. Measurement_Formulas.pdf"
                                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb]"
                                  />
                                </div>

                                {/* URL or Direct File Upload */}
                                <div className="sm:col-span-5">
                                  <label className="block text-[10px] font-mono text-[#a89f91] mb-1">
                                    PDF URL or Uploaded Document
                                  </label>
                                  <input
                                    type="text"
                                    value={pdfItem.url}
                                    onChange={(e) => {
                                      const updated = currentPdfs.map((item, i) =>
                                        i === pIdx ? { ...item, url: e.target.value } : item
                                      );
                                      setEditingLesson({ ...editingLesson, pdfMaterials: updated });
                                    }}
                                    placeholder="https://... or upload with button"
                                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                                  />
                                </div>

                                {/* Upload button */}
                                <div className="sm:col-span-2 pt-4 sm:pt-0">
                                  <label className="btn-3d-secondary w-full py-2 px-2 text-[11px] rounded cursor-pointer text-center block">
                                    <span>Upload File</span>
                                    <input
                                      type="file"
                                      accept=".pdf,application/pdf"
                                      className="sr-only"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            const res = ev.target?.result as string;
                                            if (res) {
                                              const updated = currentPdfs.map((item, i) =>
                                                i === pIdx
                                                  ? {
                                                      ...item,
                                                      title: file.name,
                                                      url: res,
                                                      size: `${(file.size / 1024).toFixed(1)} KB`,
                                                    }
                                                  : item
                                              );
                                              setEditingLesson({ ...editingLesson, pdfMaterials: updated });
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>

                              {pdfItem.url && (
                                <div className="text-[10px] text-green-400 font-mono flex items-center gap-1.5">
                                  <span>✓ Attached: {pdfItem.title || 'PDF Document Ready'}</span>
                                  {pdfItem.size && <span className="text-[#a89f91]">({pdfItem.size})</span>}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                    </div>

                    {/* ======================================================== */}
                    {/* 3. MULTIPLE TECHNICAL DIAGRAMS & PATTERN IMAGES GALLERY */}
                    {/* ======================================================== */}
                    <div className="p-4 rounded-sm bg-[#0c090a] border border-blue-500/30 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-[#f7e2a9] font-mono uppercase text-xs font-bold">
                            Downloadable Lesson Diagrams &amp; Pattern Images ({editingLesson.imageUrls?.length || 0})
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-[#a89f91] font-sinhala">
                        ශිෂ්‍යයන්ට විශාලනය කර බැලීමට සහ බාගත කර ගැනීමට හැකි තාක්ෂණික මෝස්තර සැලසුම්, පැටර්න් රූප සටහන් සහ ඡායාරූප කිහිපයක් මෙතැනින් එකතු කරන්න.
                      </p>

                      {/* Image List Preview */}
                      {editingLesson.imageUrls && editingLesson.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          {editingLesson.imageUrls.filter((u) => Boolean(u && u.trim())).map((url, idx) => (
                            <div key={idx} className="relative group aspect-square rounded overflow-hidden bg-black border border-white/10">
                              <img src={url} alt={`Diagram ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = (editingLesson.imageUrls || []).filter((_, i) => i !== idx);
                                  setEditingLesson({ ...editingLesson, imageUrls: filtered });
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remove image"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Image by URL or File Upload */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <input
                          type="url"
                          id="newImageUrlInput"
                          placeholder="Enter Image URL (https://...)"
                          className="flex-1 w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setEditingLesson({
                                  ...editingLesson,
                                  imageUrls: [...(editingLesson.imageUrls || []), input.value.trim()],
                                });
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('newImageUrlInput') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setEditingLesson({
                                ...editingLesson,
                                imageUrls: [...(editingLesson.imageUrls || []), input.value.trim()],
                              });
                              input.value = '';
                            }
                          }}
                          className="px-3 py-2 bg-[#1c1214] border border-[#dfb56c]/40 text-[#f7e2a9] rounded text-xs font-bold cursor-pointer hover:bg-[#251518]"
                        >
                          + Add URL
                        </button>

                        <label className="btn-3d-secondary px-3 py-2 text-xs rounded cursor-pointer shrink-0">
                          <span>Upload Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressImage(file, 1600, 1600, 0.85);
                                  setEditingLesson({
                                    ...editingLesson,
                                    imageUrls: [...(editingLesson.imageUrls || []), compressed],
                                  });
                                } catch (_) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const res = ev.target?.result as string;
                                    if (res) {
                                      setEditingLesson({
                                        ...editingLesson,
                                        imageUrls: [...(editingLesson.imageUrls || []), res],
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Rich Lesson Notes / Formulas */}
                    <div>
                      <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                        Lesson Lecture Notes &amp; Formulas (Markdown supported)
                      </label>
                      <textarea
                        rows={4}
                        value={editingLesson.notes}
                        onChange={(e) => setEditingLesson({ ...editingLesson, notes: e.target.value })}
                        placeholder="### Measurement formulas..."
                        className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono text-xs leading-relaxed"
                      />
                    </div>

                    {/* Published switch */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9]">
                        <input
                          type="checkbox"
                          checked={editingLesson.isPublished !== false}
                          onChange={(e) => setEditingLesson({ ...editingLesson, isPublished: e.target.checked })}
                          className="w-4 h-4 accent-[#dfb56c]"
                        />
                        <span className="font-bold">Publish to Enrolled Students (Visible in LMS)</span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingLesson(null)}
                        className="px-4 py-2 border border-white/10 rounded text-[#a89f91] cursor-pointer hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingLesson.title.trim()) {
                            alert('Please enter a lesson title.');
                            return;
                          }
                          const cleanVideos = currentVideos.filter((v) => Boolean(v && v.videoUrl && v.videoUrl.trim()));
                          const cleanPdfs = currentPdfs.filter((p) => Boolean(p && p.url && p.url.trim()));
                          const primaryVideo = cleanVideos[0];
                          const primaryPdf = cleanPdfs[0];

                          const payload: Lesson = {
                            ...editingLesson,
                            videoUrls: cleanVideos.length > 0 ? cleanVideos : (editingLesson.videoUrl ? [{ id: `vid-${Date.now()}`, title: editingLesson.title || 'Video 1', videoUrl: editingLesson.videoUrl, duration: editingLesson.duration || '25:00' }] : []),
                            videoUrl: primaryVideo?.videoUrl || editingLesson.videoUrl || '',
                            videoId: primaryVideo?.videoId || editingLesson.videoId || '',
                            duration: primaryVideo?.duration || editingLesson.duration || '25:00',
                            pdfMaterials: cleanPdfs,
                            pdfUrl: primaryPdf?.url || editingLesson.pdfUrl || '',
                            pdfTitle: primaryPdf?.title || editingLesson.pdfTitle || '',
                            imageUrls: (editingLesson.imageUrls || []).filter((u) => Boolean(u && u.trim())),
                            month: Number(editingLesson.month) || 1,
                          };

                          await saveLesson(payload);
                          setEditingLesson(null);
                        }}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase rounded-sm shadow-lg hover:brightness-110 cursor-pointer"
                      >
                        Save Lesson, Videos &amp; Materials
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD COURSE PROGRAM MODAL */}
      {/* ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#141011] rounded-sm border-2 border-[#dfb56c] p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 text-[#a89f91] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block">
                Course Program Manager
              </span>
              <h3 className="text-xl font-editorial font-bold text-[#f7e2a9]">
                {editingCourse.title ? `Edit Course: ${editingCourse.title}` : 'Create New Course Program'}
              </h3>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Configure curriculum title, fees, category, schedule, and syllabus highlights.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Course Title (English) *</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    placeholder="e.g. Advanced Haute Couture & Draping"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Title (සිංහල මාතෘකාව)</label>
                  <input
                    type="text"
                    value={editingCourse.titleSinhala || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleSinhala: e.target.value })}
                    placeholder="උදා: උසස් Haute Couture ඩ්‍රේපින් මාස්ටර්ක්ලාස්"
                    className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                  />
                </div>
              </div>

              {/* Category, Badge & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Category</label>
                  <input
                    type="text"
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    placeholder="e.g. Diploma Master Program"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Badge (e.g. Most Popular)</label>
                  <input
                    type="text"
                    value={editingCourse.badge || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                    placeholder="Official Flagship Program"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Course Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="6 Months / 3 Months"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
              </div>

              {/* Fees */}
              <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30 space-y-3">
                <span className="text-[#dfb56c] font-mono uppercase text-[10px] font-bold block">
                  Tuition Fees (LKR)
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
                    <label className="block text-[#a89f91] mb-1 text-[10px]">Registration Fee (LKR)</label>
                    <input
                      type="number"
                      value={editingCourse.registrationFee}
                      onChange={(e) => setEditingCourse({ ...editingCourse, registrationFee: Number(e.target.value) })}
                      className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb]"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Intake Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Class Schedule / Batches</label>
                  <input
                    type="text"
                    value={editingCourse.schedule || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                    placeholder="Physical (Weekend) & Zoom Live"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Intake Announcement Text</label>
                  <input
                    type="text"
                    value={editingCourse.intakeText || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, intakeText: e.target.value })}
                    placeholder="🔥 2026 Batch Admissions Open"
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">English Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                />
              </div>

              <div>
                <label className="block text-[#dfb56c] mb-1 font-sinhala font-bold text-[10px]">Sinhala Description (සිංහල විස්තරය)</label>
                <textarea
                  rows={2}
                  value={editingCourse.descriptionSinhala || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, descriptionSinhala: e.target.value })}
                  className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-sinhala"
                />
              </div>

              {/* Visual Card Styling: Background Image, Colors & Opacity */}
              <div className="p-4 rounded bg-[#0c090a] border border-[#c99a45]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#dfb56c]" />
                    <span className="text-xs uppercase font-mono text-[#dfb56c] font-bold">
                      Course Package Visual Design (Background Image &amp; Colors)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a89f91] font-mono">
                    High-Converting Package Styling
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Background Image */}
                  <div className="space-y-2">
                    <label className="block text-[#a89f91] font-mono uppercase text-[10px]">
                      Package Card Background Image URL
                    </label>
                    <input
                      type="url"
                      value={editingCourse.cardBgImageUrl || ''}
                      placeholder="https://... or upload image below"
                      onChange={(e) => setEditingCourse({ ...editingCourse, cardBgImageUrl: e.target.value })}
                      className="w-full p-2 bg-[#141011] border border-white/10 rounded text-[#f7f3eb] text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <label className="btn-3d-secondary px-3 py-1.5 text-[11px] rounded cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Package Background</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 1200, 800, 0.82);
                                setEditingCourse({ ...editingCourse, cardBgImageUrl: compressed });
                              } catch (_) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (res) setEditingCourse({ ...editingCourse, cardBgImageUrl: res });
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                      {editingCourse.cardBgImageUrl && (
                        <button
                          type="button"
                          onClick={() => setEditingCourse({ ...editingCourse, cardBgImageUrl: '' })}
                          className="text-[11px] text-red-400 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Overlay Opacity */}
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px] flex items-center justify-between">
                      <span>Card Background Dark Overlay</span>
                      <strong className="text-[#dfb56c] font-mono">
                        {editingCourse.cardOverlayOpacity ?? 80}%
                      </strong>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={95}
                      step={1}
                      value={editingCourse.cardOverlayOpacity ?? 80}
                      onChange={(e) => setEditingCourse({ ...editingCourse, cardOverlayOpacity: Number(e.target.value) })}
                      className="w-full accent-[#dfb56c] cursor-pointer mt-2"
                    />
                    <span className="text-[10px] text-[#a89f91] block mt-1">
                      Controls darkness of background photo to keep text crystal clear.
                    </span>
                  </div>
                </div>

                {/* Custom Text Color & Accent Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                      Package Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingCourse.textColor || '#f7f3eb'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, textColor: e.target.value })}
                        className="w-8 h-7 bg-transparent border border-white/20 rounded cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={editingCourse.textColor || '#f7f3eb'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, textColor: e.target.value })}
                        className="flex-1 p-1.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCourse({ ...editingCourse, textColor: '#f7f3eb' })}
                        className="text-[10px] text-[#a89f91] hover:text-[#dfb56c] underline"
                      >
                        Default
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                      Package Accent &amp; Border Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingCourse.accentColor || '#dfb56c'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, accentColor: e.target.value })}
                        className="w-8 h-7 bg-transparent border border-white/20 rounded cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={editingCourse.accentColor || '#dfb56c'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, accentColor: e.target.value })}
                        className="flex-1 p-1.5 bg-[#141011] border border-white/10 rounded text-xs text-[#f7f3eb] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCourse({ ...editingCourse, accentColor: '#dfb56c' })}
                        className="text-[10px] text-[#a89f91] hover:text-[#dfb56c] underline"
                      >
                        Default
                      </button>
                    </div>
                  </div>
                </div>

                {/* LIVE PACKAGE CARD PREVIEW */}
                <div className="mt-3 p-3 rounded bg-black/80 border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-[#dfb56c] font-bold block mb-2">
                    Live Package Card Preview
                  </span>
                  <div
                    className="relative rounded-sm p-5 overflow-hidden transition-all duration-300 border shadow-xl"
                    style={{
                      borderColor: editingCourse.accentColor || '#dfb56c',
                      color: editingCourse.textColor || '#f7f3eb',
                      backgroundColor: '#141011',
                    }}
                  >
                    {editingCourse.cardBgImageUrl && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center pointer-events-none"
                          style={{ backgroundImage: `url(${editingCourse.cardBgImageUrl})` }}
                        />
                        <div
                          className="absolute inset-0 bg-black pointer-events-none"
                          style={{ opacity: (editingCourse.cardOverlayOpacity ?? 80) / 100 }}
                        />
                      </>
                    )}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                          style={{
                            backgroundColor: `${editingCourse.accentColor || '#dfb56c'}25`,
                            color: editingCourse.accentColor || '#dfb56c',
                            border: `1px solid ${editingCourse.accentColor || '#dfb56c'}60`,
                          }}
                        >
                          {editingCourse.category || 'Package'}
                        </span>
                        {editingCourse.badge && (
                          <span className="text-[10px] font-bold" style={{ color: editingCourse.accentColor || '#dfb56c' }}>
                            ★ {editingCourse.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-editorial font-bold">
                        {editingCourse.title || 'Course Package Title'}
                      </h4>
                      <p className="text-xs opacity-80 line-clamp-1">
                        {editingCourse.description || 'High-fashion pattern making and branding curriculum...'}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-white/15">
                        <span>Physical: Rs. {Number(editingCourse.physicalFee || 0).toLocaleString()}</span>
                        <span>Zoom: Rs. {Number(editingCourse.zoomFee || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Image URL & Promo Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Course Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={editingCourse.imageUrl || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">Promo Video YouTube URL</label>
                  <input
                    type="url"
                    value={editingCourse.promoVideoUrl || ''}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => setEditingCourse({ ...editingCourse, promoVideoUrl: e.target.value })}
                    className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb]"
                  />
                  {editingCourse.promoVideoUrl && parseYouTubeVideoId(editingCourse.promoVideoUrl) && (
                    <span className="text-[10px] text-green-400 font-mono block mt-1">
                      ✓ Connected YouTube Video (ID: {parseYouTubeVideoId(editingCourse.promoVideoUrl)})
                    </span>
                  )}
                </div>
              </div>

              {/* Features (one per line) */}
              <div>
                <label className="block text-[#a89f91] mb-1 font-mono uppercase text-[10px]">
                  Course Features / Perks (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={(editingCourse.features || []).join('\n')}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    features: e.target.value.split('\n').filter((line) => line.trim().length > 0),
                  })}
                  placeholder="In-Studio Practical Hands-on or Live Zoom HD Classes&#10;French Mannequin Draping & Swedish Block Drafting&#10;Accredited Professional Diploma Certificate"
                  className="w-full p-2 bg-[#0c090a] border border-white/10 rounded text-[#f7f3eb] font-mono text-xs"
                />
              </div>

              {/* Course Syllabus Overview Highlights (one per line) */}
              <div>
                <label className="block text-[#dfb56c] mb-1 font-mono uppercase text-[10px] font-bold">
                  Course Syllabus Highlights (One milestone per line) / පාඨමාලා විෂය නිර්දේශයේ සාරාංශ කරුණු
                </label>
                <textarea
                  rows={3}
                  value={(editingCourse.syllabusOverview || []).join('\n')}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    syllabusOverview: e.target.value.split('\n').filter((line) => line.trim().length > 0),
                  })}
                  placeholder="Module 01-10: Anatomical Measurements & Foundation Slopers&#10;Module 11-20: Advanced Dart Pivoting & Silhouette Architecture&#10;Module 21-28: AI Design Systems & Digital Pattern Grading&#10;Module 29-34: Brand Identity, Pricing Formulas & Global Export"
                  className="w-full p-2 bg-[#0c090a] border border-[#dfb56c]/30 rounded text-[#f7e2a9] font-mono text-xs"
                />
                <span className="text-[10px] text-[#a89f91] block mt-1">
                  These syllabus highlights appear in the Course Syllabus Modal Form and on course cards.
                </span>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#f7e2a9]">
                  <input
                    type="checkbox"
                    checked={editingCourse.isPublished !== false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#dfb56c]"
                  />
                  <span className="font-bold">Published (Visible on Website)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#dfb56c]">
                  <input
                    type="checkbox"
                    checked={editingCourse.isFeatured || false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#dfb56c]"
                  />
                  <span className="font-bold">Featured Main Program</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-white/10 rounded text-[#a89f91]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!editingCourse.title.trim()) {
                      alert('Please enter a course title.');
                      return;
                    }
                    await saveCourse(editingCourse);
                    setEditingCourse(null);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold uppercase rounded shadow-lg hover:brightness-110"
                >
                  Save Course Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
