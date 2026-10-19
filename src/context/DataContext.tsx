import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType,
  testConnection,
} from '../lib/firebase';
import {
  Registration,
  SiteSettings,
  CourseModuleItem,
  WhyFeatureItem,
  YouTubeVideoItem,
  GalleryImageItem,
  LocationItem,
  FAQItem,
  RegistrationStatus,
  PaymentSlip,
  Lesson,
  CourseItem,
  PaymentVerificationStatus,
  CourseAccessStatus,
  AuditLogItem,
  VideoCategoryItem,
  RunwayOutfitItem,
  StudentCreationItem,
  BusinessCalculationItem,
  LessonProgressItem,
  FollowUpHistoryItem,
  AnalyticsEventItem,
  CustomForm,
  FormSubmission,
  StudentReviewItem,
  CampaignPage,
  CampaignLead,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_MODULES,
  DEFAULT_WHY_FEATURES,
  DEFAULT_YOUTUBE_VIDEOS,
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_LOCATIONS,
  DEFAULT_FAQS,
  DEFAULT_LESSONS,
  DEFAULT_COURSES,
  DEFAULT_VIDEO_CATEGORIES,
  DEFAULT_RUNWAY_OUTFITS,
  DEFAULT_STUDENT_CREATIONS,
  DEFAULT_BUSINESS_CALCULATIONS,
  DEFAULT_ZOOM_CLASSES,
  DEFAULT_COMMUNITY_POSTS,
  DEFAULT_CUSTOM_FORMS,
  DEFAULT_STUDENT_REVIEWS,
  DEFAULT_CAMPAIGNS,
  DEFAULT_CAMPAIGN_LEADS,
} from '../lib/defaults';
import { useAuth } from './AuthContext';
import { parseYouTubeVideoId, getYouTubeThumbnailUrl } from '../lib/mediaUtils';
import { LiveZoomClass, StudentSubscription, CommunityPost, CommunityComment, CourseType } from '../types';

interface DataContextType {
  siteSettings: SiteSettings;
  courses: CourseItem[];
  modules: CourseModuleItem[];
  whyFeatures: WhyFeatureItem[];
  videos: YouTubeVideoItem[];
  gallery: GalleryImageItem[];
  locations: LocationItem[];
  faqs: FAQItem[];
  lessons: Lesson[];
  registrations: Registration[];
  paymentSlips: PaymentSlip[];
  auditLogs: AuditLogItem[];
  videoCategories: VideoCategoryItem[];
  runwayOutfits: RunwayOutfitItem[];
  studentCreations: StudentCreationItem[];
  businessCalculations: BusinessCalculationItem[];
  lessonProgress: LessonProgressItem[];
  followUpHistory: FollowUpHistoryItem[];
  analyticsEvents: AnalyticsEventItem[];
  customForms: CustomForm[];
  formSubmissions: FormSubmission[];
  studentReviews: StudentReviewItem[];
  campaigns: CampaignPage[];
  campaignLeads: CampaignLead[];
  isLoading: boolean;
  submitRegistration: (formData: any) => Promise<Registration>;
  submitTwoStepRegistration: (data: {
    courseId: string;
    courseTitle: string;
    courseType: CourseType;
    location?: string;
    fullName: string;
    whatsappNumber: string;
    email?: string;
    district?: string;
    city?: string;
    priorExperience?: string;
    experienceDetails?: string;
    goals?: string;
    consent: boolean;
    paymentSlipUrl?: string;
    paymentAmount?: number;
    paymentDate?: string;
  }) => Promise<Registration>;
  loginStudentWithCredentials: (identifier: string, pass: string) => Promise<Registration | null>;
  loginOrRegisterFirebaseStudent: (
    firebaseUser: User,
    extraDetails?: { fullName?: string; whatsappNumber?: string; courseId?: string }
  ) => Promise<Registration>;
  uploadPaymentSlip: (slipData: Omit<PaymentSlip, 'id' | 'createdAt' | 'status'>) => Promise<PaymentSlip>;
  approvePaymentSlip: (slipId: string, regNumber: string, adminNotes?: string) => Promise<void>;
  rejectPaymentSlip: (slipId: string, adminNotes?: string) => Promise<void>;
  toggleStudentCourseAccess: (id: string, access: CourseAccessStatus) => Promise<void>;
  toggleStudentBrandModuleAccess: (id: string, approved: boolean) => Promise<void>;
  recordLastAccessedLesson: (regId: string, lessonId: string) => Promise<void>;
  saveStudentBrandModuleData: (studentId: string, data: any) => Promise<void>;
  getStudentBrandModuleData: (studentId: string) => any;
  markLessonCompleted: (regId: string, lessonId: string) => Promise<void>;
  toggleLessonCompleted: (regId: string, lessonId: string) => Promise<void>;
  updateLessonProgressRecord: (data: Partial<LessonProgressItem> & { studentRegNo: string; lessonId: string }) => Promise<void>;
  updateRegistrationStatus: (id: string, status: RegistrationStatus) => Promise<void>;
  updateRegistrationNotes: (id: string, adminNotes: string) => Promise<void>;
  updateRegistrationFull: (id: string, data: Partial<Registration>) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  saveCourse: (course: Partial<CourseItem> & { title: string }) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  archiveCourse: (id: string, archived: boolean) => Promise<void>;
  publishCourse: (id: string, published: boolean) => Promise<void>;
  saveCustomForm: (form: Partial<CustomForm> & { title: string }) => Promise<void>;
  deleteCustomForm: (id: string) => Promise<void>;
  submitCustomForm: (formSlug: string, submittedData: Record<string, any>) => Promise<FormSubmission>;
  updateFormSubmissionStatus: (id: string, status: FormSubmission['status'], notes?: string) => Promise<void>;
  deleteFormSubmission: (id: string) => Promise<void>;
  saveCampaign: (campaign: Partial<CampaignPage> & { title: string }) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  submitCampaignLead: (campaignSlug: string, leadData: Omit<CampaignLead, 'id' | 'createdAt' | 'status'>) => Promise<CampaignLead>;
  updateCampaignLeadStatus: (id: string, status: CampaignLead['status'], notes?: string) => Promise<void>;
  deleteCampaignLead: (id: string) => Promise<void>;
  saveStudentReview: (rev: Partial<StudentReviewItem> & { studentName: string; youtubeUrl: string }) => Promise<void>;
  deleteStudentReview: (id: string) => Promise<void>;
  toggleReviewApproval: (id: string, approved: boolean) => Promise<void>;
  saveCourseModule: (mod: Partial<CourseModuleItem> & { title: string }) => Promise<void>;
  deleteCourseModule: (id: string) => Promise<void>;
  saveWhyFeature: (feat: Partial<WhyFeatureItem> & { title: string }) => Promise<void>;
  deleteWhyFeature: (id: string) => Promise<void>;
  saveLesson: (lesson: Partial<Lesson> & { title: string }) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  saveYouTubeVideo: (video: Partial<YouTubeVideoItem> & { title: string; youtubeUrl: string }) => Promise<void>;
  deleteYouTubeVideo: (id: string) => Promise<void>;
  saveGalleryImage: (image: Partial<GalleryImageItem> & { title: string; imageUrl: string }) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  saveLocation: (location: Partial<LocationItem> & { name: string }) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  saveFAQ: (faq: Partial<FAQItem> & { question: string; answer: string }) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  saveVideoCategory: (cat: Partial<VideoCategoryItem> & { name: string }) => Promise<void>;
  deleteVideoCategory: (id: string) => Promise<void>;
  saveRunwayOutfit: (outfit: Partial<RunwayOutfitItem> & { title: string }) => Promise<void>;
  deleteRunwayOutfit: (id: string) => Promise<void>;
  submitStudentCreation: (creation: Omit<StudentCreationItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<StudentCreationItem>;
  updateStudentCreationStatus: (id: string, status: StudentCreationItem['status'], adminNotes?: string, isFeatured?: boolean) => Promise<void>;
  deleteStudentCreation: (id: string) => Promise<void>;
  saveBusinessCalculation: (calc: Omit<BusinessCalculationItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<BusinessCalculationItem>;
  deleteBusinessCalculation: (id: string) => Promise<void>;
  addFollowUpHistory: (item: Omit<FollowUpHistoryItem, 'id' | 'actionDate'>) => Promise<void>;
  trackAnalyticsEvent: (eventName: string, metadata?: Record<string, any>) => Promise<void>;
  addAuditLog: (action: string, details: string) => Promise<void>;
  zoomClasses: LiveZoomClass[];
  subscriptions: StudentSubscription[];
  saveZoomClass: (cls: Partial<LiveZoomClass> & { title: string }) => Promise<void>;
  deleteZoomClass: (id: string) => Promise<void>;
  toggleStudentPaidMonth: (studentId: string, courseId: string, month: number, active: boolean) => Promise<void>;
  getStudentPaidMonths: (studentId?: string, courseId?: string) => number[];
  communityPosts: CommunityPost[];
  createCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy' | 'comments'>) => Promise<CommunityPost>;
  toggleLikeCommunityPost: (postId: string, userId: string) => Promise<void>;
  addCommentToCommunityPost: (postId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>) => Promise<void>;
  deleteCommunityPost: (postId: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, user, studentUser, setStudentUser } = useAuth();

  // Helper to load initial state from localStorage cache, falling back to defaults
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(fallback)) {
          if (Array.isArray(parsed) && parsed.length > 0) return parsed as unknown as T;
        } else if (parsed && typeof parsed === 'object') {
          return { ...fallback, ...parsed };
        }
      }
    } catch (_) {}
    return fallback;
  };

  // 1. Initial State Definitions (Fresh from localStorage cache if present, otherwise defaults)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadInitial<SiteSettings>('css_site_settings', DEFAULT_SITE_SETTINGS)
  );
  const [courses, setCourses] = useState<CourseItem[]>(() =>
    loadInitial<CourseItem[]>('css_courses', DEFAULT_COURSES)
  );
  const [modules, setModules] = useState<CourseModuleItem[]>(() =>
    loadInitial<CourseModuleItem[]>('css_course_modules', DEFAULT_MODULES)
  );
  const [whyFeatures, setWhyFeatures] = useState<WhyFeatureItem[]>(() =>
    loadInitial<WhyFeatureItem[]>('css_why_features', DEFAULT_WHY_FEATURES)
  );
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(() => {
    const fromYt = loadInitial<YouTubeVideoItem[]>('css_youtube_videos', []);
    if (fromYt.length > 0) return fromYt;
    return loadInitial<YouTubeVideoItem[]>('css_videos', DEFAULT_YOUTUBE_VIDEOS);
  });
  const [gallery, setGallery] = useState<GalleryImageItem[]>(() =>
    loadInitial<GalleryImageItem[]>('css_gallery_images', DEFAULT_GALLERY_IMAGES)
  );
  const [locations, setLocations] = useState<LocationItem[]>(() =>
    loadInitial<LocationItem[]>('css_locations', DEFAULT_LOCATIONS)
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(() =>
    loadInitial<FAQItem[]>('css_faqs', DEFAULT_FAQS)
  );
  const [lessons, setLessons] = useState<Lesson[]>(() =>
    loadInitial<Lesson[]>('css_lessons', DEFAULT_LESSONS)
  );
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    loadInitial<Registration[]>('css_local_registrations', [])
  );
  const [paymentSlips, setPaymentSlips] = useState<PaymentSlip[]>(() =>
    loadInitial<PaymentSlip[]>('css_payment_slips', [])
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategoryItem[]>(() =>
    loadInitial<VideoCategoryItem[]>('css_video_categories', DEFAULT_VIDEO_CATEGORIES)
  );
  const [runwayOutfits, setRunwayOutfits] = useState<RunwayOutfitItem[]>(() =>
    loadInitial<RunwayOutfitItem[]>('css_runway_outfits', DEFAULT_RUNWAY_OUTFITS)
  );
  const [studentCreations, setStudentCreations] = useState<StudentCreationItem[]>(() =>
    loadInitial<StudentCreationItem[]>('css_student_creations', DEFAULT_STUDENT_CREATIONS)
  );
  const [businessCalculations, setBusinessCalculations] = useState<BusinessCalculationItem[]>(() =>
    loadInitial<BusinessCalculationItem[]>('css_business_calculations', DEFAULT_BUSINESS_CALCULATIONS)
  );
  const [lessonProgress, setLessonProgress] = useState<LessonProgressItem[]>(() =>
    loadInitial<LessonProgressItem[]>('css_lesson_progress', [])
  );
  const [followUpHistory, setFollowUpHistory] = useState<FollowUpHistoryItem[]>(() =>
    loadInitial<FollowUpHistoryItem[]>('css_followup_history', [])
  );
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEventItem[]>([]);
  const [zoomClasses, setZoomClasses] = useState<LiveZoomClass[]>(() =>
    loadInitial<LiveZoomClass[]>('css_zoom_classes', DEFAULT_ZOOM_CLASSES)
  );
  const [subscriptions, setSubscriptions] = useState<StudentSubscription[]>(() =>
    loadInitial<StudentSubscription[]>('css_subscriptions', [])
  );
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() =>
    loadInitial<CommunityPost[]>('css_community_posts', DEFAULT_COMMUNITY_POSTS)
  );
  const [customForms, setCustomForms] = useState<CustomForm[]>(() =>
    loadInitial<CustomForm[]>('css_custom_forms', DEFAULT_CUSTOM_FORMS)
  );
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(() =>
    loadInitial<FormSubmission[]>('css_form_submissions', [])
  );
  const [studentReviews, setStudentReviews] = useState<StudentReviewItem[]>(() =>
    loadInitial<StudentReviewItem[]>('css_student_reviews', DEFAULT_STUDENT_REVIEWS)
  );
  const [campaigns, setCampaigns] = useState<CampaignPage[]>(() =>
    loadInitial<CampaignPage[]>('css_campaigns', DEFAULT_CAMPAIGNS)
  );
  const [campaignLeads, setCampaignLeads] = useState<CampaignLead[]>(() =>
    loadInitial<CampaignLead[]>('css_campaign_leads', DEFAULT_CAMPAIGN_LEADS)
  );
  const [isLoading, setIsLoading] = useState(true);

  // 2. Real-Time Cloud Firestore Sync for ALL Content & Backend Changes
  useEffect(() => {
    let isMounted = true;
    const unsubscribers: (() => void)[] = [];

    // Test Firestore connection
    testConnection().catch(() => {});

    // Helper to safely bind real-time onSnapshot with automatic bidirectional state synchronization
    const bindSync = <T,>(
      colName: string,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      defaultSeed?: T[],
      sortFn?: (a: T, b: T) => number
    ) => {
      try {
        const initializedKey = `css_${colName}_synced_v2`;
        const unsub = onSnapshot(
          collection(db, colName),
          (snapshot) => {
            if (!isMounted) return;
            const isAlreadySynced = localStorage.getItem(initializedKey) === 'true';

            if (!snapshot.empty) {
              let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T));
              if (sortFn) items.sort(sortFn);
              setter(items);
              try {
                localStorage.setItem(`css_${colName}`, JSON.stringify(items));
                localStorage.setItem(initializedKey, 'true');
                if (colName === 'youtube_videos') {
                  localStorage.setItem('css_videos', JSON.stringify(items));
                }
              } catch (_) {}
            } else {
              // Handle empty collection: seed on initial setup if never initialized, otherwise preserve empty
              if (!isAlreadySynced && defaultSeed && defaultSeed.length > 0) {
                let seedItems = defaultSeed;
                try {
                  const saved = localStorage.getItem(`css_${colName}`) || (colName === 'youtube_videos' ? localStorage.getItem('css_videos') : null);
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      seedItems = parsed;
                    }
                  }
                } catch (_) {}

                setter(seedItems);
                try {
                  localStorage.setItem(`css_${colName}`, JSON.stringify(seedItems));
                  localStorage.setItem(initializedKey, 'true');
                  if (colName === 'youtube_videos') {
                    localStorage.setItem('css_videos', JSON.stringify(seedItems));
                  }
                } catch (_) {}

                // Populate Firestore with initial seed items in background
                seedItems.forEach((item: any) => {
                  if (item && item.id) {
                    setDoc(doc(db, colName, item.id), item, { merge: true }).catch(() => {});
                  }
                });
              } else {
                setter([]);
                try {
                  localStorage.setItem(`css_${colName}`, JSON.stringify([]));
                  if (colName === 'youtube_videos') {
                    localStorage.setItem('css_videos', JSON.stringify([]));
                  }
                } catch (_) {}
              }
            }
          },
          (err) => {
            console.warn(`Firestore real-time sync for ${colName} notice:`, err);
          }
        );
        unsubscribers.push(unsub);
      } catch (e) {
        console.warn(`Could not attach listener for ${colName}:`, e);
      }
    };

    // 1. Site Settings Persistent Real-Time Live Sync (Instantaneously updates on any mutation)
    try {
      const unsubSettings = onSnapshot(
        collection(db, 'site_settings'),
        (snapshot) => {
          if (!isMounted) return;
          if (!snapshot.empty) {
            const mainDoc = snapshot.docs.find((d) => d.id === 'main') || snapshot.docs[0];
            const data = mainDoc.data() as SiteSettings;
            const merged: SiteSettings = { ...DEFAULT_SITE_SETTINGS, ...data };
            setSiteSettings(merged);
            try {
              localStorage.setItem('css_site_settings', JSON.stringify(merged));
            } catch (_) {}
          } else {
            // Seed current settings from local cache if present, otherwise defaults
            let initialSettings = DEFAULT_SITE_SETTINGS;
            try {
              const saved = localStorage.getItem('css_site_settings');
              if (saved) {
                initialSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
              }
            } catch (_) {}
            setDoc(doc(db, 'site_settings', 'main'), initialSettings, { merge: true }).catch(() => {});
          }
        },
        (err) => console.warn('site_settings sync fallback notice:', err)
      );
      unsubscribers.push(unsubSettings);
    } catch (e) {
      console.warn('Could not attach site_settings listener:', e);
    }

    // 2. Bind persistent real-time listeners for all CMS content collections
    bindSync<CourseItem>('courses', setCourses, DEFAULT_COURSES, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<CourseModuleItem>('course_modules', setModules, DEFAULT_MODULES, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<WhyFeatureItem>('why_features', setWhyFeatures, DEFAULT_WHY_FEATURES, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<Lesson>('lessons', setLessons, DEFAULT_LESSONS, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<YouTubeVideoItem>('youtube_videos', setVideos, DEFAULT_YOUTUBE_VIDEOS, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<GalleryImageItem>('gallery_images', setGallery, DEFAULT_GALLERY_IMAGES, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<LocationItem>('locations', setLocations, DEFAULT_LOCATIONS, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<FAQItem>('faqs', setFaqs, DEFAULT_FAQS, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<VideoCategoryItem>('video_categories', setVideoCategories, DEFAULT_VIDEO_CATEGORIES, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<RunwayOutfitItem>('runway_outfits', setRunwayOutfits, DEFAULT_RUNWAY_OUTFITS, (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    bindSync<StudentCreationItem>('student_creations', setStudentCreations, DEFAULT_STUDENT_CREATIONS);
    bindSync<BusinessCalculationItem>('business_calculations', setBusinessCalculations, DEFAULT_BUSINESS_CALCULATIONS);
    bindSync<LessonProgressItem>('lesson_progress', setLessonProgress, []);
    bindSync<LiveZoomClass>('zoom_classes', setZoomClasses, DEFAULT_ZOOM_CLASSES, (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    bindSync<StudentSubscription>('subscriptions', setSubscriptions, []);
    bindSync<CommunityPost>('community_posts', setCommunityPosts, DEFAULT_COMMUNITY_POSTS, (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    bindSync<CustomForm>('custom_forms', setCustomForms, DEFAULT_CUSTOM_FORMS);
    bindSync<FormSubmission>('form_submissions', setFormSubmissions, [], (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    bindSync<StudentReviewItem>('student_reviews', setStudentReviews, DEFAULT_STUDENT_REVIEWS, (a, b) => (a.order ?? 0) - (b.order ?? 0));
    bindSync<CampaignPage>('campaigns', setCampaigns, DEFAULT_CAMPAIGNS, (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    bindSync<CampaignLead>('campaign_leads', setCampaignLeads, DEFAULT_CAMPAIGN_LEADS, (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 3. Registrations Persistent Real-Time Sync (Instantaneously updates upon document mutation)
    try {
      const unsubRegs = onSnapshot(
        collection(db, 'registrations'),
        (snap) => {
          if (!isMounted) return;
          const list: Registration[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Registration));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setRegistrations(list);
          try {
            localStorage.setItem('css_local_registrations', JSON.stringify(list));
          } catch (_) {}
        },
        (err) => console.warn('registrations live sync notice:', err)
      );
      unsubscribers.push(unsubRegs);
    } catch (e) {
      console.warn('Could not attach registrations listener:', e);
    }

    // 4. Payment Slips Persistent Real-Time Sync (Instantaneously updates upon document mutation)
    try {
      const unsubSlips = onSnapshot(
        collection(db, 'payment_slips'),
        (snap) => {
          if (!isMounted) return;
          const list: PaymentSlip[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentSlip));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setPaymentSlips(list);
          try {
            localStorage.setItem('css_payment_slips', JSON.stringify(list));
          } catch (_) {}
        },
        (err) => console.warn('payment_slips live sync notice:', err)
      );
      unsubscribers.push(unsubSlips);
    } catch (e) {
      console.warn('Could not attach payment_slips listener:', e);
    }

    // 5. Audit Logs Persistent Real-Time Sync
    try {
      const unsubAudit = onSnapshot(
        collection(db, 'audit_logs'),
        (snap) => {
          if (!isMounted) return;
          const list: AuditLogItem[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLogItem));
          list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
          setAuditLogs(list.slice(0, 300));
        },
        (err) => console.warn('audit_logs live sync notice:', err)
      );
      unsubscribers.push(unsubAudit);
    } catch (e) {
      console.warn('Could not attach audit_logs listener:', e);
    }

    // 6. Follow-Up History Persistent Real-Time Sync
    try {
      const unsubFollowUp = onSnapshot(
        collection(db, 'follow_up_history'),
        (snap) => {
          if (!isMounted) return;
          const list: FollowUpHistoryItem[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FollowUpHistoryItem));
          list.sort((a, b) => new Date(b.actionDate || 0).getTime() - new Date(a.actionDate || 0).getTime());
          setFollowUpHistory(list);
          try {
            localStorage.setItem('css_followup_history', JSON.stringify(list));
          } catch (_) {}
        },
        (err) => console.warn('follow_up_history live sync notice:', err)
      );
      unsubscribers.push(unsubFollowUp);
    } catch (e) {
      console.warn('Could not attach follow_up_history listener:', e);
    }

    // 7. Student Brand Modules (Module 02) Real-Time Sync
    try {
      const unsubBrandModules = onSnapshot(
        collection(db, 'student_brand_modules'),
        (snap) => {
          if (!isMounted) return;
          snap.docs.forEach((d) => {
            try {
              localStorage.setItem(`css_brand_module_${d.id}`, JSON.stringify(d.data()));
            } catch (_) {}
          });
        },
        (err) => console.warn('student_brand_modules live sync notice:', err)
      );
      unsubscribers.push(unsubBrandModules);
    } catch (e) {
      console.warn('Could not attach student_brand_modules listener:', e);
    }

    setIsLoading(false);

    return () => {
      isMounted = false;
      unsubscribers.forEach((u) => u());
    };
  }, []);

  // Synchronize active studentUser in real time if any backend document mutation occurs
  useEffect(() => {
    if (!studentUser) return;
    const latest = registrations.find(
      (r) => r.id === studentUser.id || r.regNumber === studentUser.regNumber
    );
    if (latest) {
      const hasChanged =
        latest.brandModuleApproved !== studentUser.brandModuleApproved ||
        latest.courseAccess !== studentUser.courseAccess ||
        latest.paymentStatus !== studentUser.paymentStatus ||
        latest.status !== studentUser.status ||
        latest.lastAccessedLessonId !== studentUser.lastAccessedLessonId ||
        latest.fullName !== studentUser.fullName ||
        latest.adminNotes !== studentUser.adminNotes ||
        JSON.stringify(latest.completedLessonIds || []) !== JSON.stringify(studentUser.completedLessonIds || []);

      if (hasChanged) {
        setStudentUser({
          ...studentUser,
          brandModuleApproved: latest.brandModuleApproved,
          courseAccess: latest.courseAccess,
          paymentStatus: latest.paymentStatus,
          status: latest.status,
          lastAccessedLessonId: latest.lastAccessedLessonId,
          fullName: latest.fullName,
          adminNotes: latest.adminNotes,
          completedLessonIds: latest.completedLessonIds || [],
        });
      }
    }
  }, [registrations, studentUser, setStudentUser]);

  // Submit registration with AUTOMATIC SEQUENTIAL REGISTRATION NUMBER: CSS-2026-0001, CSS-2026-0002...
  const submitRegistration = async (
    formData: any
  ): Promise<Registration> => {
    const timestamp = new Date().toISOString();
    
    // Calculate sequential number based on current registered count + 1
    const nextSeq = registrations.length + 1;
    const regNumber = `CSS-2026-${String(nextSeq).padStart(4, '0')}`;

    const newRecord: Omit<Registration, 'id'> = {
      ...formData,
      regNumber,
      status: 'NEW',
      paymentStatus: 'PENDING',
      courseAccess: 'PENDING',
      completedLessonIds: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const createdId = 'reg-' + Date.now();
    const created: Registration = { id: createdId, ...newRecord };
    try {
      await setDoc(doc(db, 'registrations', createdId), created, { merge: true });
    } catch (error) {
      console.warn('Firestore write failed, saved locally:', error);
    }

    setRegistrations((prev) => [created, ...prev]);
    localStorage.setItem('css_local_registrations', JSON.stringify([created, ...registrations]));
    
    // Automatically log in the newly registered student
    setStudentUser(created);
    
    addAuditLog('New Student Registration', `Student registered: ${created.fullName} (${regNumber})`);
    return created;
  };

  // Student Login with WhatsApp Number, Email, or Reg Number + Password
  const loginStudentWithCredentials = async (
    identifier: string,
    pass?: string
  ): Promise<Registration | null> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[\s-]/g, '');

    const found = registrations.find((r) => {
      const matchReg = r.regNumber.toLowerCase() === cleanId;
      const matchEmail = r.email && r.email.toLowerCase() === cleanId;
      const matchPhone = r.whatsappNumber.replace(/[\s-]/g, '') === cleanPhone;
      return matchReg || matchEmail || matchPhone;
    });

    if (found) {
      // If password provided and account has password, verify or accept matching
      if (pass && found.password && found.password !== pass) {
        return null;
      }
      setStudentUser(found);
      return found;
    }
    return null;
  };

  // Firebase Authentication Integration: auto-match or provision student in Firestore & Subscriptions
  const loginOrRegisterFirebaseStudent = async (
    firebaseUser: User,
    extraDetails?: { fullName?: string; whatsappNumber?: string; courseId?: string }
  ): Promise<Registration> => {
    const emailMatch = firebaseUser.email?.toLowerCase();
    const existing = registrations.find(
      (r) =>
        (r.authUid && r.authUid === firebaseUser.uid) ||
        (emailMatch && r.email && r.email.toLowerCase() === emailMatch)
    );

    if (existing) {
      if (!existing.authUid) {
        try {
          await updateDoc(doc(db, 'registrations', existing.id), {
            authUid: firebaseUser.uid,
            updatedAt: new Date().toISOString(),
          });
        } catch (_) {}
      }
      setStudentUser(existing);
      return existing;
    }

    // Provision new student profile in Firestore
    const nextSeq = registrations.length + 1;
    const regNumber = `CSS-2026-${String(nextSeq).padStart(4, '0')}`;
    const timestamp = new Date().toISOString();
    const targetCourseId = extraDetails?.courseId || 'course-01';
    const targetCourse = courses.find((c) => c.id === targetCourseId);

    const newStudent: Registration = {
      id: 'reg-' + firebaseUser.uid.slice(0, 12),
      authUid: firebaseUser.uid,
      regNumber,
      fullName:
        extraDetails?.fullName ||
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'Enrolled Student',
      email: firebaseUser.email || '',
      whatsappNumber: extraDetails?.whatsappNumber || firebaseUser.phoneNumber || '',
      district: 'Colombo',
      educationalQualification: 'G.C.E. Advanced Level',
      courseId: targetCourseId,
      courseTitle: targetCourse?.title || '6-Month Professional Fashion & Branding Diploma',
      courseType: 'ZOOM CLASS',
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      courseAccess: 'PENDING',
      enrolledCourseIds: [targetCourseId],
      paidMonthsByCourse: { [targetCourseId]: [1] },
      paidMonths: [1],
      previousPatternCourse: 'NO',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'registrations', newStudent.id), newStudent, { merge: true });
    } catch (e) {
      console.warn('Firestore newStudent save fallback to local:', e);
    }

    setRegistrations((prev) => [newStudent, ...prev]);
    localStorage.setItem('css_local_registrations', JSON.stringify([newStudent, ...registrations]));

    // Provision corresponding subscription record in Firestore 'subscriptions'
    const subId = `sub-${newStudent.id}-${targetCourseId}`;
    const subRecord: StudentSubscription = {
      id: subId,
      studentId: newStudent.id,
      regNumber: newStudent.regNumber,
      courseId: targetCourseId,
      courseTitle: newStudent.courseTitle || '6-Month Professional Fashion & Branding Diploma',
      activeMonths: [1],
      status: 'ACTIVE',
      monthlyFee: targetCourse?.zoomFee || 2500,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      await setDoc(doc(db, 'subscriptions', subId), subRecord, { merge: true });
    } catch (e) {
      console.warn('Firestore subscription save fallback:', e);
    }
    setSubscriptions((prev) => [subRecord, ...prev]);

    setStudentUser(newStudent);
    addAuditLog('Firebase Student Account Provisioned', `Account created for ${newStudent.fullName} (${regNumber}) via Firebase Auth`);
    return newStudent;
  };

  // Student upload payment slip with Firestore persistence & Subscriptions tracking
  const uploadPaymentSlip = async (
    slipData: Omit<PaymentSlip, 'id' | 'createdAt' | 'status'>
  ): Promise<PaymentSlip> => {
    const timestamp = new Date().toISOString();
    const targetCourseId = slipData.courseId || studentUser?.courseId || 'course-01';
    const targetMonth = slipData.month || 1;

    const newSlip: Omit<PaymentSlip, 'id'> = {
      ...slipData,
      courseId: targetCourseId,
      month: targetMonth,
      status: 'PENDING',
      createdAt: timestamp,
    };

    const slipId = 'slip-' + Date.now();
    const createdSlip: PaymentSlip = { id: slipId, ...newSlip };
    try {
      await setDoc(doc(db, 'payment_slips', slipId), createdSlip, { merge: true });
    } catch (error) {
      console.warn('Payment slip save fallback to local:', error);
    }

    const updatedList = [createdSlip, ...paymentSlips];
    setPaymentSlips(updatedList);
    localStorage.setItem('css_payment_slips', JSON.stringify(updatedList));

    // Update / create student subscription record in Firestore 'subscriptions'
    const studentIdentifier = slipData.studentId || (studentUser ? studentUser.id : slipData.regNumber);
    const subId = `sub-${studentIdentifier}-${targetCourseId}`;
    const subRecord: StudentSubscription = {
      id: subId,
      studentId: studentIdentifier,
      regNumber: slipData.regNumber,
      courseId: targetCourseId,
      courseTitle: slipData.courseTitle || studentUser?.courseTitle || '6-Month Professional Fashion & Branding Diploma',
      activeMonths: studentUser?.paidMonthsByCourse?.[targetCourseId] || [1],
      status: 'PENDING',
      monthlyFee: Number(slipData.amount) || 2500,
      lastPaymentDate: slipData.paymentDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      await setDoc(doc(db, 'subscriptions', subId), subRecord, { merge: true });
    } catch (_) {}
    setSubscriptions((prev) => {
      const idx = prev.findIndex((s) => s.id === subId);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = subRecord;
        return cp;
      }
      return [subRecord, ...prev];
    });

    // Update student payment status to PENDING
    if (studentUser && studentUser.regNumber === slipData.regNumber) {
      const updatedStudent = { ...studentUser, paymentStatus: 'PENDING' as PaymentVerificationStatus };
      setStudentUser(updatedStudent);
    }

    addAuditLog('Payment Slip Uploaded', `Slip submitted by ${slipData.studentName} (${slipData.regNumber}) - Rs. ${slipData.amount} for Month ${targetMonth}`);
    return createdSlip;
  };

  // Admin approves payment slip: immediately unlocks course & month access in Firestore!
  const approvePaymentSlip = async (slipId: string, regNumber: string, adminNotes?: string) => {
    const timestamp = new Date().toISOString();

    // 1. Update slip status to VERIFIED in Firestore & local state
    try {
      await setDoc(
        doc(db, 'payment_slips', slipId),
        {
          status: 'VERIFIED',
          adminNotes: adminNotes || 'Payment verified by administrator',
          verifiedAt: timestamp,
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore payment_slips approval notice:', err);
    }

    setPaymentSlips((prev) =>
      prev.map((s) =>
        s.id === slipId
          ? { ...s, status: 'VERIFIED', adminNotes: adminNotes || 'Payment verified', verifiedAt: timestamp }
          : s
      )
    );

    // 2. Update Student registration to VERIFIED & courseAccess: ACTIVE in Firestore & local state
    const student = registrations.find((r) => r.regNumber === regNumber);
    const slip = paymentSlips.find((s) => s.id === slipId);
    if (student) {
      const targetCourseId = slip?.courseId || student.courseId || 'course-01';
      const slipMonth = slip?.month || 1;
      const currentMap = student.paidMonthsByCourse || {};
      const existingMonths = currentMap[targetCourseId] || student.paidMonths || [1];
      const updatedMonths = Array.from(new Set([...existingMonths, slipMonth])).sort((a, b) => a - b);
      const updatedMap = {
        ...currentMap,
        [targetCourseId]: updatedMonths,
      };

      try {
        await setDoc(
          doc(db, 'registrations', student.id),
          {
            paymentStatus: 'VERIFIED',
            courseAccess: 'ACTIVE',
            status: 'CONFIRMED',
            paidMonths: updatedMonths,
            paidMonthsByCourse: updatedMap,
            updatedAt: timestamp,
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore registrations approval notice:', err);
      }

      // Update Firestore 'subscriptions' collection
      const subId = `sub-${student.id}-${targetCourseId}`;
      const subRecord: StudentSubscription = {
        id: subId,
        studentId: student.id,
        regNumber: student.regNumber,
        courseId: targetCourseId,
        courseTitle: slip?.courseTitle || student.courseTitle || '6-Month Professional Fashion & Branding Diploma',
        activeMonths: updatedMonths,
        status: 'ACTIVE',
        monthlyFee: slip?.amount || 2500,
        lastPaymentDate: slip?.paymentDate || timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      try {
        await setDoc(doc(db, 'subscriptions', subId), subRecord, { merge: true });
      } catch (_) {}
      setSubscriptions((prev) => {
        const idx = prev.findIndex((s) => s.id === subId);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = subRecord;
          return cp;
        }
        return [subRecord, ...prev];
      });

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === student.id
            ? {
                ...r,
                paymentStatus: 'VERIFIED',
                courseAccess: 'ACTIVE',
                status: 'CONFIRMED',
                paidMonths: updatedMonths,
                paidMonthsByCourse: updatedMap,
                updatedAt: timestamp,
              }
            : r
        )
      );

      // If current logged in student is this student, update session
      if (studentUser && studentUser.regNumber === regNumber) {
        setStudentUser({
          ...studentUser,
          paymentStatus: 'VERIFIED',
          courseAccess: 'ACTIVE',
          status: 'CONFIRMED',
          paidMonths: updatedMonths,
          paidMonthsByCourse: updatedMap,
        });
      }
    }

    addAuditLog('Payment Approved', `Payment verified for student ${regNumber}. Month access activated!`);
  };

  const toggleStudentPaidMonth = async (
    studentId: string,
    courseId: string,
    month: number,
    active: boolean
  ) => {
    const student = registrations.find((r) => r.id === studentId || r.regNumber === studentId);
    if (!student) return;

    const currentMap = student.paidMonthsByCourse || {};
    const courseMonths = currentMap[courseId] || student.paidMonths || [1];
    let updatedMonths: number[];
    if (active) {
      updatedMonths = Array.from(new Set([...courseMonths, month])).sort((a, b) => a - b);
    } else {
      updatedMonths = courseMonths.filter((m) => m !== month);
    }

    const updatedMap = {
      ...currentMap,
      [courseId]: updatedMonths,
    };

    const timestamp = new Date().toISOString();
    try {
      await setDoc(
        doc(db, 'registrations', student.id),
        {
          paidMonthsByCourse: updatedMap,
          paidMonths: updatedMonths,
          courseAccess: updatedMonths.length > 0 ? 'ACTIVE' : 'LOCKED',
          updatedAt: timestamp,
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Firestore toggleStudentPaidMonth error:', e);
    }

    // Sync to Firestore 'subscriptions'
    const subId = `sub-${student.id}-${courseId}`;
    const subRecord: StudentSubscription = {
      id: subId,
      studentId: student.id,
      regNumber: student.regNumber,
      courseId,
      courseTitle: student.courseTitle || 'Course Program',
      activeMonths: updatedMonths,
      status: updatedMonths.length > 0 ? 'ACTIVE' : 'EXPIRED',
      monthlyFee: 2500,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      await setDoc(doc(db, 'subscriptions', subId), subRecord, { merge: true });
    } catch (_) {}
    setSubscriptions((prev) => {
      const idx = prev.findIndex((s) => s.id === subId);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = subRecord;
        return cp;
      }
      return [subRecord, ...prev];
    });

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === student.id
          ? {
              ...r,
              paidMonthsByCourse: updatedMap,
              paidMonths: updatedMonths,
              courseAccess: updatedMonths.length > 0 ? 'ACTIVE' : 'LOCKED',
              updatedAt: timestamp,
            }
          : r
      )
    );

    if (studentUser && (studentUser.id === student.id || studentUser.regNumber === student.regNumber)) {
      setStudentUser({
        ...studentUser,
        paidMonthsByCourse: updatedMap,
        paidMonths: updatedMonths,
        courseAccess: updatedMonths.length > 0 ? 'ACTIVE' : 'LOCKED',
      });
    }
  };

  const getStudentPaidMonths = (studentId?: string, courseId?: string): number[] => {
    const targetStudent = studentId
      ? registrations.find((r) => r.id === studentId || r.regNumber === studentId)
      : studentUser;
    if (!targetStudent) return [1];

    const cid = courseId || targetStudent.courseId || 'course-01';

    // 1. Check subscriptions collection
    const sub = subscriptions.find(
      (s) => (s.studentId === targetStudent.id || s.regNumber === targetStudent.regNumber) && s.courseId === cid
    );
    if (sub && Array.isArray(sub.activeMonths) && sub.activeMonths.length > 0) {
      return sub.activeMonths;
    }

    // 2. Check student's paidMonthsByCourse map
    if (targetStudent.paidMonthsByCourse && targetStudent.paidMonthsByCourse[cid]) {
      return targetStudent.paidMonthsByCourse[cid];
    }

    // 3. Check legacy paidMonths
    if (targetStudent.paidMonths && targetStudent.paidMonths.length > 0) {
      return targetStudent.paidMonths;
    }

    return targetStudent.courseAccess === 'ACTIVE' ? [1] : [];
  };

  const saveZoomClass = async (cls: Partial<LiveZoomClass> & { title: string }) => {
    const id = cls.id || 'zoom-' + Date.now();
    const item: LiveZoomClass = {
      id,
      courseId: cls.courseId || 'course-01',
      courseTitle: cls.courseTitle || '6-Month Professional Fashion & Branding Diploma',
      month: cls.month || 1,
      title: cls.title,
      titleSinhala: cls.titleSinhala || cls.title,
      date: cls.date || new Date().toISOString().split('T')[0],
      time: cls.time || '07:30 PM - 09:30 PM (SLST)',
      zoomUrl: cls.zoomUrl || 'https://zoom.us/j/94520261100',
      meetingId: cls.meetingId || '945 2026 1100',
      passcode: cls.passcode || 'CSS2026',
      mentorName: cls.mentorName || 'Lead Couturier & Master Designer',
      status: cls.status || 'UPCOMING',
      notes: cls.notes || '',
    };
    try {
      await setDoc(doc(db, 'zoom_classes', id), item, { merge: true });
    } catch (e) {
      console.warn('Firestore saveZoomClass notice:', e);
    }
    setZoomClasses((prev) => {
      const idx = prev.findIndex((z) => z.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
    addAuditLog('Live Zoom Class Saved', `Saved class: ${item.title} (Month ${item.month})`);
  };

  const deleteZoomClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'zoom_classes', id));
    } catch (e) {
      console.warn('Firestore deleteZoomClass notice:', e);
    }
    setZoomClasses((prev) => prev.filter((z) => z.id !== id));
    addAuditLog('Live Zoom Class Deleted', `Deleted class ID: ${id}`);
  };

  // Community Post & Discussion Methods (Stored in Cloud Firestore)
  const createCommunityPost = async (
    post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy' | 'comments'>
  ): Promise<CommunityPost> => {
    const id = 'post-' + Date.now();
    const timestamp = new Date().toISOString();
    const newPost: CommunityPost = {
      ...post,
      id,
      likesCount: 0,
      likedBy: [],
      comments: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      await setDoc(doc(db, 'community_posts', id), newPost, { merge: true });
    } catch (e) {
      console.warn('Firestore createCommunityPost notice:', e);
    }
    setCommunityPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const toggleLikeCommunityPost = async (postId: string, userId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedBy?.includes(userId);
        const nextLikedBy = alreadyLiked ? p.likedBy.filter((uid) => uid !== userId) : [...(p.likedBy || []), userId];
        const nextLikesCount = nextLikedBy.length;
        const updated = { ...p, likedBy: nextLikedBy, likesCount: nextLikesCount };
        setDoc(doc(db, 'community_posts', postId), { likedBy: nextLikedBy, likesCount: nextLikesCount }, { merge: true }).catch(() => {});
        return updated;
      })
    );
  };

  const addCommentToCommunityPost = async (
    postId: string,
    comment: Omit<CommunityComment, 'id' | 'createdAt'>
  ) => {
    const commentId = 'c-' + Date.now();
    const newComment: CommunityComment = {
      ...comment,
      id: commentId,
      createdAt: new Date().toISOString(),
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updatedComments = [...(p.comments || []), newComment];
        const updated = { ...p, comments: updatedComments, updatedAt: new Date().toISOString() };
        setDoc(doc(db, 'community_posts', postId), { comments: updatedComments, updatedAt: updated.updatedAt }, { merge: true }).catch(() => {});
        return updated;
      })
    );
  };

  const deleteCommunityPost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'community_posts', postId));
    } catch (e) {
      console.warn('Firestore deleteCommunityPost notice:', e);
    }
    setCommunityPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Admin rejects payment slip
  const rejectPaymentSlip = async (slipId: string, adminNotes?: string) => {
    const timestamp = new Date().toISOString();
    try {
      await setDoc(
        doc(db, 'payment_slips', slipId),
        {
          status: 'REJECTED',
          adminNotes: adminNotes || 'Payment slip rejected',
          verifiedAt: timestamp,
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore payment_slips rejection notice:', err);
    }

    setPaymentSlips((prev) =>
      prev.map((s) =>
        s.id === slipId
          ? { ...s, status: 'REJECTED', adminNotes: adminNotes || 'Payment slip rejected', verifiedAt: timestamp }
          : s
      )
    );
    addAuditLog('Payment Rejected', `Payment slip ${slipId} marked as rejected.`);
  };

  // Toggle student course access
  const toggleStudentCourseAccess = async (id: string, access: CourseAccessStatus) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', id), { courseAccess: access, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations course access notice:', err);
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, courseAccess: access, updatedAt } : r))
    );

    if (studentUser && studentUser.id === id) {
      setStudentUser({ ...studentUser, courseAccess: access });
    }
  };

  // Toggle student brand module access (Module 02 TANI Brand Builder)
  const toggleStudentBrandModuleAccess = async (id: string, approved: boolean) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', id), { brandModuleApproved: approved, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations brand module notice:', err);
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, brandModuleApproved: approved, updatedAt } : r))
    );

    if (studentUser && studentUser.id === id) {
      setStudentUser({ ...studentUser, brandModuleApproved: approved });
    }
    addAuditLog('Brand Module Access Toggled', `Student ${id} brand module access set to ${approved ? 'APPROVED' : 'LOCKED'}`);
  };

  // Record last accessed lesson for Continue Learning
  const recordLastAccessedLesson = async (regId: string, lessonId: string) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', regId), { lastAccessedLessonId: lessonId, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations record last lesson notice:', err);
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, lastAccessedLessonId: lessonId, updatedAt } : r))
    );

    if (studentUser && studentUser.id === regId) {
      setStudentUser({ ...studentUser, lastAccessedLessonId: lessonId });
    }
  };

  // Save student brand module form data to localStorage & cloud database
  const saveStudentBrandModuleData = async (studentId: string, data: any) => {
    try {
      localStorage.setItem(`css_brand_module_${studentId}`, JSON.stringify(data));
      await setDoc(doc(db, 'student_brand_modules', studentId), {
        ...data,
        studentId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Brand module data save to cloud fallback:', e);
    }
  };

  const getStudentBrandModuleData = (studentId: string) => {
    const cached = localStorage.getItem(`css_brand_module_${studentId}`);
    if (cached) {
      try { return JSON.parse(cached); } catch (_) {}
    }
    return null;
  };

  // Student marks lesson as completed
  const markLessonCompleted = async (regId: string, lessonId: string) => {
    const student = registrations.find((r) => r.id === regId) || studentUser;
    if (!student) return;

    const currentCompleted = student.completedLessonIds || [];
    if (currentCompleted.includes(lessonId)) return;

    const nextCompleted = [...currentCompleted, lessonId];
    try {
      await setDoc(
        doc(db, 'registrations', regId),
        { completedLessonIds: nextCompleted, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (_) {}

    try {
      const progressDocId = `${student.regNumber || regId}_${lessonId}`;
      await setDoc(
        doc(db, 'lesson_progress', progressDocId),
        {
          studentRegNo: student.regNumber || regId,
          studentName: student.fullName,
          lessonId,
          completed: true,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (_) {}

    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, completedLessonIds: nextCompleted } : r))
    );

    if (studentUser && studentUser.id === regId) {
      setStudentUser({ ...studentUser, completedLessonIds: nextCompleted });
    }
  };

  // Interactive toggle completed status for video lessons in 6-month progress tracker
  const toggleLessonCompleted = async (regId: string, lessonId: string) => {
    const student = registrations.find((r) => r.id === regId) || studentUser;
    if (!student) return;

    const currentCompleted = student.completedLessonIds || [];
    const isCompleted = currentCompleted.includes(lessonId);
    const nextCompleted = isCompleted
      ? currentCompleted.filter((id) => id !== lessonId)
      : [...currentCompleted, lessonId];

    try {
      await setDoc(
        doc(db, 'registrations', regId),
        { completedLessonIds: nextCompleted, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not update registrations in Firestore:', err);
    }

    try {
      const progressDocId = `${student.regNumber || regId}_${lessonId}`;
      await setDoc(
        doc(db, 'lesson_progress', progressDocId),
        {
          studentRegNo: student.regNumber || regId,
          studentName: student.fullName,
          lessonId,
          completed: !isCompleted,
          completedAt: !isCompleted ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (_) {}

    setRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, completedLessonIds: nextCompleted } : r))
    );

    if (studentUser && studentUser.id === regId) {
      setStudentUser({ ...studentUser, completedLessonIds: nextCompleted });
    }
  };

  const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', id), { status, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations update status notice:', err);
    }
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, updatedAt } : r))
    );
  };

  const updateRegistrationNotes = async (id: string, adminNotes: string) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', id), { adminNotes, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations update notes notice:', err);
    }
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, adminNotes, updatedAt } : r))
    );
  };

  const updateRegistrationFull = async (id: string, data: Partial<Registration>) => {
    const updatedAt = new Date().toISOString();
    try {
      await setDoc(doc(db, 'registrations', id), { ...data, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Firestore registrations update full notice:', err);
    }
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data, updatedAt } : r))
    );
  };

  const deleteRegistration = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (err) {
      console.warn('Firestore registrations delete notice:', err);
    }
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated: SiteSettings = { ...siteSettings, ...newSettings, updatedAt: new Date().toISOString() };
    setSiteSettings(updated);
    try {
      localStorage.setItem('css_site_settings', JSON.stringify(updated));
    } catch (_) {}

    // Synchronize tuition fees with primary courses if fees were changed in settings
    if (
      newSettings.physicalFee !== undefined ||
      newSettings.zoomFee !== undefined ||
      newSettings.registrationFee !== undefined
    ) {
      setCourses((prevCourses) => {
        const next = prevCourses.map((c, idx) =>
          idx === 0
            ? {
                ...c,
                physicalFee: newSettings.physicalFee !== undefined ? Number(newSettings.physicalFee) : c.physicalFee,
                zoomFee: newSettings.zoomFee !== undefined ? Number(newSettings.zoomFee) : c.zoomFee,
                registrationFee: newSettings.registrationFee !== undefined ? Number(newSettings.registrationFee) : c.registrationFee,
              }
            : c
        );
        try {
          localStorage.setItem('css_courses', JSON.stringify(next));
        } catch (_) {}
        if (next[0]) {
          setDoc(doc(db, 'courses', next[0].id), next[0], { merge: true }).catch(() => {});
        }
        return next;
      });
    }

    try {
      await setDoc(doc(db, 'site_settings', 'main'), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore site_settings update notice:', err);
    }
    addAuditLog('Settings Updated', 'Logo, Hero Media, Tuition Fees & Bank Settings saved to database.');
  };

  const saveCourseModule = async (mod: Partial<CourseModuleItem> & { title: string }) => {
    const id = mod.id || `mod-${Date.now()}`;
    const item: CourseModuleItem = {
      id,
      number: mod.number || String(modules.length + 1).padStart(2, '0'),
      title: mod.title,
      description: mod.description || '',
      category: mod.category || 'General',
      order: mod.order ?? modules.length + 1,
      isPublished: mod.isPublished !== undefined ? mod.isPublished : true,
      iconName: mod.iconName || 'Sparkles',
      imageUrl: mod.imageUrl || '',
    };
    const nextModules = [...modules.filter((m) => m.id !== id), item].sort((a, b) => a.order - b.order);
    setModules(nextModules);
    try {
      localStorage.setItem('css_course_modules', JSON.stringify(nextModules));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'course_modules', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save course_modules to Firestore:', err);
    }
  };

  const deleteCourseModule = async (id: string) => {
    const nextModules = modules.filter((m) => m.id !== id);
    setModules(nextModules);
    try {
      localStorage.setItem('css_course_modules', JSON.stringify(nextModules));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'course_modules', id));
    } catch (err) {
      console.warn('Could not delete course_modules from Firestore:', err);
    }
  };

  const saveWhyFeature = async (feat: Partial<WhyFeatureItem> & { title: string }) => {
    const id = feat.id || `why-${Date.now()}`;
    const item: WhyFeatureItem = {
      id,
      number: feat.number || String(whyFeatures.length + 1).padStart(2, '0'),
      title: feat.title,
      titleSinhala: feat.titleSinhala || feat.title,
      description: feat.description || '',
      descriptionSinhala: feat.descriptionSinhala || feat.description || '',
      imageUrl: feat.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      iconName: feat.iconName || 'Sparkles',
      order: feat.order ?? whyFeatures.length + 1,
      isPublished: feat.isPublished !== undefined ? feat.isPublished : true,
      badge: feat.badge || 'Featured',
      badgeSinhala: feat.badgeSinhala || 'සුවිශේෂී',
    };
    const nextWhy = [...whyFeatures.filter((w) => w.id !== id), item].sort((a, b) => a.order - b.order);
    setWhyFeatures(nextWhy);
    try {
      localStorage.setItem('css_why_features', JSON.stringify(nextWhy));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'why_features', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save why_features to Firestore:', err);
    }
    addAuditLog('Why Feature Saved', `Feature "${item.title}" saved.`);
  };

  const deleteWhyFeature = async (id: string) => {
    const nextWhy = whyFeatures.filter((w) => w.id !== id);
    setWhyFeatures(nextWhy);
    try {
      localStorage.setItem('css_why_features', JSON.stringify(nextWhy));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'why_features', id));
    } catch (err) {
      console.warn('Could not delete why_features from Firestore:', err);
    }
  };

  const saveCourse = async (course: Partial<CourseItem> & { title: string }) => {
    const id = course.id || `course-${Date.now()}`;
    const slug = course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item: CourseItem = {
      id,
      slug,
      title: course.title,
      titleSinhala: course.titleSinhala || course.title,
      subtitle: course.subtitle || '',
      subtitleSinhala: course.subtitleSinhala || '',
      badge: course.badge || '',
      badgeSinhala: course.badgeSinhala || course.badge || '',
      description: course.description || '',
      descriptionSinhala: course.descriptionSinhala || course.description || '',
      aboutCourse: course.aboutCourse || '',
      aboutCourseSinhala: course.aboutCourseSinhala || '',
      category: course.category || 'Diploma Master Program',
      duration: course.duration || '6 Months',
      courseMode: course.courseMode || 'HYBRID',
      schedule: course.schedule || 'Physical & Zoom Classes',
      locations: course.locations || ['KEGALLE', 'KURUNEGALA', 'PILIYANDALA'],
      physicalFee: Number(course.physicalFee ?? 3500),
      zoomFee: Number(course.zoomFee ?? 2000),
      registrationFee: Number(course.registrationFee ?? 1000),
      intakeText: course.intakeText || '2026 Batch Intake Open',
      intakeTextSinhala: course.intakeTextSinhala || course.intakeText || '2026 නව කණ්ඩායම සඳහා ලියාපදිංචිය විවෘතයි',
      imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      bannerImageUrl: course.bannerImageUrl || course.imageUrl || '',
      cardBgImageUrl: course.cardBgImageUrl || course.imageUrl || '',
      cardOverlayOpacity: course.cardOverlayOpacity ?? 85,
      accentColor: course.accentColor || '#dfb56c',
      textColor: course.textColor || '#f7f3eb',
      promoVideoUrl: course.promoVideoUrl ? course.promoVideoUrl.trim() : '',
      features: course.features || [],
      syllabusOverview: course.syllabusOverview || [],
      learningOutcomes: course.learningOutcomes || [],
      learningOutcomesSinhala: course.learningOutcomesSinhala || [],
      instructorName: course.instructorName || 'Madame Celine & Master Atelier Team',
      instructorTitle: course.instructorTitle || 'Head of Couture Engineering',
      instructorBio: course.instructorBio || '',
      instructorAvatar: course.instructorAvatar || '',
      sections: course.sections || [],
      videos: course.videos || [],
      pdfResources: course.pdfResources || [],
      testimonials: course.testimonials || [],
      customFormId: course.customFormId || '',
      isFeatured: course.isFeatured ?? false,
      isPublished: course.isPublished !== undefined ? course.isPublished : true,
      isArchived: course.isArchived ?? false,
      order: course.order ?? courses.length + 1,
      createdAt: course.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    const nextCourses = [...courses.filter((c) => c.id !== id), item].sort((a, b) => a.order - b.order);
    setCourses(nextCourses);
    try {
      localStorage.setItem('css_courses', JSON.stringify(nextCourses));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'courses', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save courses to Firestore:', err);
    }
    addAuditLog('Course Saved', `Course "${item.title}" saved.`);
  };

  const deleteCourse = async (id: string) => {
    const nextCourses = courses.filter((c) => c.id !== id);
    setCourses(nextCourses);
    try {
      localStorage.setItem('css_courses', JSON.stringify(nextCourses));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      console.warn('Could not delete courses from Firestore:', err);
    }
    addAuditLog('Course Deleted', `Course ID ${id} deleted.`);
  };

  const archiveCourse = async (id: string, archived: boolean) => {
    const updatedAt = new Date().toISOString();
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: archived, updatedAt } : c))
    );
    try {
      await setDoc(doc(db, 'courses', id), { isArchived: archived, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Archive course notice:', err);
    }
    addAuditLog('Course Archive Status', `Course ${id} archive status set to ${archived}`);
  };

  const publishCourse = async (id: string, published: boolean) => {
    const updatedAt = new Date().toISOString();
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: published, updatedAt } : c))
    );
    try {
      await setDoc(doc(db, 'courses', id), { isPublished: published, updatedAt }, { merge: true });
    } catch (err) {
      console.warn('Publish course notice:', err);
    }
    addAuditLog('Course Publish Status', `Course ${id} publish status set to ${published}`);
  };

  const saveCustomForm = async (form: Partial<CustomForm> & { title: string }) => {
    const id = form.id || `form-${Date.now()}`;
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item: CustomForm = {
      id,
      slug,
      title: form.title,
      titleSinhala: form.titleSinhala || form.title,
      instructions: form.instructions || '',
      instructionsSinhala: form.instructionsSinhala || '',
      successMessage: form.successMessage || 'Thank you! Your submission has been received.',
      successMessageSinhala: form.successMessageSinhala || 'ඔබගේ අයදුම්පත සාර්ථකව ලැබුණි.',
      associatedCourseId: form.associatedCourseId || '',
      associatedCourseTitle: form.associatedCourseTitle || '',
      fields: form.fields || [],
      isPublished: form.isPublished !== undefined ? form.isPublished : true,
      version: (form.version || 0) + 1,
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextForms = [...customForms.filter((f) => f.id !== id), item];
    setCustomForms(nextForms);
    try {
      localStorage.setItem('css_custom_forms', JSON.stringify(nextForms));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'custom_forms', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save custom_forms to Firestore:', err);
    }
    addAuditLog('Custom Form Saved', `Form "${item.title}" saved.`);
  };

  const deleteCustomForm = async (id: string) => {
    setCustomForms((prev) => prev.filter((f) => f.id !== id));
    try {
      await deleteDoc(doc(db, 'custom_forms', id));
    } catch (err) {
      console.warn('Could not delete custom_forms from Firestore:', err);
    }
    addAuditLog('Custom Form Deleted', `Form ID ${id} deleted.`);
  };

  const submitCustomForm = async (formSlug: string, submittedData: Record<string, any>): Promise<FormSubmission> => {
    const timestamp = new Date().toISOString();
    const id = 'subm-' + Date.now();
    const targetForm = customForms.find((f) => f.slug === formSlug || f.id === formSlug);

    const submission: FormSubmission = {
      id,
      formId: targetForm?.id || formSlug,
      formSlug,
      formVersion: targetForm?.version || 1,
      courseId: targetForm?.associatedCourseId,
      courseTitle: targetForm?.associatedCourseTitle,
      submittedData,
      status: 'NEW',
      createdAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'form_submissions', id), submission, { merge: true });
    } catch (err) {
      console.warn('Firestore form_submissions save error:', err);
    }

    setFormSubmissions((prev) => [submission, ...prev]);
    addAuditLog('Custom Form Submission', `Form "${targetForm?.title || formSlug}" submitted.`);
    return submission;
  };

  const updateFormSubmissionStatus = async (id: string, status: FormSubmission['status'], notes?: string) => {
    setFormSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, notes: notes !== undefined ? notes : s.notes } : s))
    );
    try {
      await setDoc(doc(db, 'form_submissions', id), { status, notes }, { merge: true });
    } catch (err) {
      console.warn('Firestore form_submissions update notice:', err);
    }
  };

  const deleteFormSubmission = async (id: string) => {
    setFormSubmissions((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'form_submissions', id));
    } catch (err) {
      console.warn('Firestore form_submissions delete notice:', err);
    }
  };

  const saveCampaign = async (campaign: Partial<CampaignPage> & { title: string }) => {
    const id = campaign.id || `camp-${Date.now()}`;
    const cleanSlug = (campaign.slug || campaign.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const item: CampaignPage = {
      id,
      slug: cleanSlug,
      title: campaign.title,
      titleSinhala: campaign.titleSinhala || campaign.title,
      badge: campaign.badge || '🔥 Special Facebook Offer',
      badgeSinhala: campaign.badgeSinhala || '🔥 Facebook විශේෂ දීමනාව',
      associatedCourseId: campaign.associatedCourseId || '',
      associatedCourseTitle: campaign.associatedCourseTitle || '',
      aboutHeading: campaign.aboutHeading || 'About This Course',
      aboutHeadingSinhala: campaign.aboutHeadingSinhala || 'පාඨමාලාව පිළිබඳ විස්තරය',
      aboutDescription: campaign.aboutDescription || '',
      aboutDescriptionSinhala: campaign.aboutDescriptionSinhala || campaign.aboutDescription || '',
      highlights: campaign.highlights || [],
      highlightsSinhala: campaign.highlightsSinhala || campaign.highlights || [],
      videos: campaign.videos || [],
      pdfResource: campaign.pdfResource,
      studentReviews: campaign.studentReviews || [],
      regularPrice: campaign.regularPrice ?? 15000,
      discountPrice: campaign.discountPrice ?? 7500,
      currency: campaign.currency || 'LKR',
      intakeText: campaign.intakeText || '2026 Academic Intake',
      intakeTextSinhala: campaign.intakeTextSinhala || '2026 නව බඳවා ගැනීම්',
      countdownEndDate: campaign.countdownEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      spotsLeft: campaign.spotsLeft ?? 8,
      whatsappNumber: campaign.whatsappNumber || '+94703755312',
      whatsappPrefillText: campaign.whatsappPrefillText || `Hello Ceylon Style Studio, I am interested in registering for ${campaign.title}!`,
      formHeading: campaign.formHeading || 'Step 2: Student Details & Batch Reservation',
      formHeadingSinhala: campaign.formHeadingSinhala || 'පියවර 02: ශිෂ්‍ය තොරතුරු සහ ආසනය වෙන්කරවා ගැනීම',
      formSubheading: campaign.formSubheading || 'Fill out the form below to lock in your promotional discount.',
      formSubheadingSinhala: campaign.formSubheadingSinhala || 'විශේෂ වට්ටම සහිතව ඔබගේ ආසනය වෙන්කරවා ගැනීමට පහත තොරතුරු සම්පූර්ණ කරන්න.',
      requireExperience: campaign.requireExperience ?? false,
      requireLocation: campaign.requireLocation ?? true,
      allowedLocations: campaign.allowedLocations && campaign.allowedLocations.length > 0
        ? campaign.allowedLocations
        : ['KEGALLE ATELIER', 'KURUNEGALA ATELIER', 'PILIYANDALA ATELIER', 'ONLINE ZOOM INTERACTIVE'],
      successTitle: campaign.successTitle || 'Registration Received Successfully!',
      successTitleSinhala: campaign.successTitleSinhala || 'ඔබගේ ලියාපදිංචිය සාර්ථකව ලැබිණි!',
      successMessage: campaign.successMessage || 'Your seat has been tentatively reserved. Click below to confirm on WhatsApp!',
      successMessageSinhala: campaign.successMessageSinhala || 'ඔබගේ ආසනය වෙන්කෙරිණි. දැන්ම WhatsApp හරහා සම්බන්ධ වී තහවුරු කරගන්න!',
      isPublished: campaign.isPublished !== undefined ? campaign.isPublished : true,
      viewsCount: campaign.viewsCount ?? 0,
      leadsCount: campaign.leadsCount ?? 0,
      createdAt: campaign.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextCampaigns = [...campaigns.filter((c) => c.id !== id), item];
    setCampaigns(nextCampaigns);
    try {
      localStorage.setItem('css_campaigns', JSON.stringify(nextCampaigns));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'campaigns', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save campaign to Firestore:', err);
    }
    addAuditLog('Campaign Saved', `Campaign "${item.title}" (${item.slug}) saved to database.`);
  };

  const deleteCampaign = async (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    try {
      localStorage.setItem('css_campaigns', JSON.stringify(campaigns.filter((c) => c.id !== id)));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (err) {
      console.warn('Could not delete campaign from Firestore:', err);
    }
    addAuditLog('Campaign Deleted', `Campaign ID ${id} deleted.`);
  };

  const submitCampaignLead = async (
    campaignSlug: string,
    leadData: Omit<CampaignLead, 'id' | 'createdAt' | 'status'>
  ): Promise<CampaignLead> => {
    const timestamp = new Date().toISOString();
    const id = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const targetCampaign = campaigns.find((c) => c.slug === campaignSlug || c.id === campaignSlug);

    const lead: CampaignLead = {
      ...leadData,
      id,
      campaignId: targetCampaign?.id || campaignSlug,
      campaignSlug,
      campaignTitle: targetCampaign?.title || leadData.campaignTitle || 'Facebook Campaign',
      status: 'NEW',
      createdAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'campaign_leads', id), lead, { merge: true });
    } catch (err) {
      console.warn('Firestore campaign_leads save notice:', err);
    }

    setCampaignLeads((prev) => [lead, ...prev]);

    // Also increment lead counter on campaign
    if (targetCampaign) {
      const updatedCount = (targetCampaign.leadsCount || 0) + 1;
      setCampaigns((prev) =>
        prev.map((c) => (c.id === targetCampaign.id ? { ...c, leadsCount: updatedCount } : c))
      );
      try {
        await updateDoc(doc(db, 'campaigns', targetCampaign.id), { leadsCount: updatedCount });
      } catch (_) {}
    }

    addAuditLog('FB Campaign Lead Received', `New lead from "${lead.fullName}" (${lead.whatsappNumber}) for ${lead.campaignTitle}`);
    return lead;
  };

  const updateCampaignLeadStatus = async (
    id: string,
    status: CampaignLead['status'],
    notes?: string
  ) => {
    setCampaignLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, adminNotes: notes !== undefined ? notes : l.adminNotes } : l))
    );
    try {
      await setDoc(doc(db, 'campaign_leads', id), { status, adminNotes: notes }, { merge: true });
    } catch (err) {
      console.warn('Firestore campaign_leads update notice:', err);
    }
  };

  const deleteCampaignLead = async (id: string) => {
    setCampaignLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteDoc(doc(db, 'campaign_leads', id));
    } catch (err) {
      console.warn('Firestore campaign_leads delete notice:', err);
    }
  };

  const saveStudentReview = async (rev: Partial<StudentReviewItem> & { studentName: string; youtubeUrl: string }) => {
    const id = rev.id || `rev-${Date.now()}`;
    let videoId = rev.videoId || '';
    if (!videoId && rev.youtubeUrl) {
      const match = rev.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      videoId = match ? match[1] : '';
    }
    const item: StudentReviewItem = {
      id,
      studentName: rev.studentName,
      studentBatch: rev.studentBatch || 'Academy Graduate',
      courseId: rev.courseId || 'course-01',
      courseTitle: rev.courseTitle || '6-Month Professional Fashion & Branding Diploma',
      youtubeUrl: rev.youtubeUrl,
      videoId,
      writtenFeedback: rev.writtenFeedback || '',
      rating: rev.rating ?? 5,
      avatarUrl: rev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isApproved: rev.isApproved !== undefined ? rev.isApproved : true,
      isFeatured: rev.isFeatured ?? false,
      order: rev.order ?? studentReviews.length + 1,
      createdAt: rev.createdAt || new Date().toISOString().split('T')[0],
    };

    const nextReviews = [...studentReviews.filter((r) => r.id !== id), item].sort((a, b) => a.order - b.order);
    setStudentReviews(nextReviews);
    try {
      localStorage.setItem('css_student_reviews', JSON.stringify(nextReviews));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'student_reviews', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save student_reviews to Firestore:', err);
    }
    addAuditLog('Student Review Saved', `Review by ${item.studentName} saved.`);
  };

  const deleteStudentReview = async (id: string) => {
    setStudentReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteDoc(doc(db, 'student_reviews', id));
    } catch (err) {
      console.warn('Could not delete student_reviews from Firestore:', err);
    }
  };

  const toggleReviewApproval = async (id: string, approved: boolean) => {
    setStudentReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: approved } : r))
    );
    try {
      await setDoc(doc(db, 'student_reviews', id), { isApproved: approved }, { merge: true });
    } catch (err) {
      console.warn('Review approval toggle notice:', err);
    }
  };

  const submitTwoStepRegistration = async (data: {
    courseId: string;
    courseTitle: string;
    courseType: CourseType;
    location?: string;
    fullName: string;
    whatsappNumber: string;
    email?: string;
    district?: string;
    city?: string;
    priorExperience?: string;
    experienceDetails?: string;
    goals?: string;
    consent: boolean;
    paymentSlipUrl?: string;
    paymentAmount?: number;
    paymentDate?: string;
  }): Promise<Registration> => {
    const timestamp = new Date().toISOString();
    const nextSeq = registrations.length + 1;
    const regNumber = `CSS-2026-${String(nextSeq).padStart(4, '0')}`;
    const id = 'reg-' + Date.now();

    const newRecord: Registration = {
      id,
      regNumber,
      fullName: data.fullName.trim(),
      whatsappNumber: data.whatsappNumber.trim(),
      email: data.email?.trim() || '',
      district: data.district || 'Colombo',
      city: data.city?.trim() || '',
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      courseType: data.courseType,
      location: data.courseType === 'PHYSICAL CLASS' ? (data.location || 'KEGALLE') : 'ONLINE ZOOM',
      educationalQualification: 'G.C.E. Advanced Level',
      previousPatternCourse: data.priorExperience === 'YES' ? 'YES' : 'NO',
      previousCourseDetails: data.experienceDetails?.trim() || '',
      whyJoin: data.goals?.trim() || '',
      status: 'NEW',
      paymentStatus: 'PENDING',
      courseAccess: 'PENDING',
      enrolledCourseIds: [data.courseId],
      paidMonthsByCourse: { [data.courseId]: [1] },
      paidMonths: [1],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'registrations', id), newRecord, { merge: true });
    } catch (e) {
      console.warn('Firestore write failed, saved locally:', e);
    }

    if (data.paymentSlipUrl) {
      const slipId = 'slip-' + Date.now();
      const newSlip: PaymentSlip = {
        id: slipId,
        studentId: id,
        regNumber,
        studentName: data.fullName,
        whatsappNumber: data.whatsappNumber,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        month: 1,
        paymentType: 'Course Registration Deposit',
        amount: Number(data.paymentAmount) || 1000,
        paymentDate: data.paymentDate || timestamp.split('T')[0],
        bankName: siteSettings.bankName || 'Commercial Bank',
        transactionReference: 'ONLINE-REG-' + Date.now().toString().slice(-6),
        slipUrl: data.paymentSlipUrl,
        status: 'PENDING',
        createdAt: timestamp,
      };
      try {
        await setDoc(doc(db, 'payment_slips', slipId), newSlip, { merge: true });
        setPaymentSlips((prev) => [newSlip, ...prev]);
      } catch (_) {}
    }

    setRegistrations((prev) => [newRecord, ...prev]);
    try {
      localStorage.setItem('css_local_registrations', JSON.stringify([newRecord, ...registrations]));
    } catch (_) {}

    addAuditLog('Two-Step Course Registration', `Student registered for ${data.courseTitle}: ${newRecord.fullName} (${regNumber})`);
    return newRecord;
  };

  const saveLesson = async (lesson: Partial<Lesson> & { title: string }) => {
    const id = lesson.id || `les-${Date.now()}`;
    let videoId = lesson.videoId || '';
    if (!videoId && lesson.videoUrl) {
      const match = lesson.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      videoId = match ? match[1] : '';
    }

    const item: Lesson = {
      id,
      courseId: lesson.courseId || 'course-01',
      courseTitle: lesson.courseTitle || '6-Month Professional Fashion & Branding Diploma',
      moduleId: lesson.moduleId || 'mod-01',
      moduleNumber: lesson.moduleNumber || '01',
      moduleTitle: lesson.moduleTitle || 'General',
      lessonNumber: lesson.lessonNumber || String(lessons.length + 1).padStart(2, '0'),
      title: lesson.title,
      titleSinhala: lesson.titleSinhala || lesson.title,
      description: lesson.description || '',
      descriptionSinhala: lesson.descriptionSinhala || lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      videoUrls: lesson.videoUrls || (lesson.videoUrl ? [{ id: `vid-${Date.now()}`, title: lesson.title, videoUrl: lesson.videoUrl, videoId, duration: lesson.duration || '20:00' }] : []),
      duration: lesson.duration || '20:00',
      notes: lesson.notes || '',
      pdfTitle: lesson.pdfTitle || '',
      pdfUrl: lesson.pdfUrl || '',
      pdfMaterials: lesson.pdfMaterials || (lesson.pdfUrl ? [{ id: `pdf-${Date.now()}`, title: lesson.pdfTitle || 'Lecture Notes.pdf', url: lesson.pdfUrl }] : []),
      thumbnailUrl: lesson.thumbnailUrl || '',
      imageUrls: lesson.imageUrls || [],
      month: Number(lesson.month) || 1,
      isPublished: lesson.isPublished !== undefined ? lesson.isPublished : true,
      order: lesson.order ?? lessons.length + 1,
    };

    const nextLessons = [...lessons.filter((l) => l.id !== id), item].sort((a, b) => a.order - b.order);
    setLessons(nextLessons);
    try {
      localStorage.setItem('css_lessons', JSON.stringify(nextLessons));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'lessons', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save lessons to Firestore:', err);
    }
    addAuditLog('Lesson Saved', `Lesson "${item.title}" saved.`);
  };

  const deleteLesson = async (id: string) => {
    const nextLessons = lessons.filter((l) => l.id !== id);
    setLessons(nextLessons);
    try {
      localStorage.setItem('css_lessons', JSON.stringify(nextLessons));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'lessons', id));
    } catch (err) {
      console.warn('Could not delete lessons from Firestore:', err);
    }
  };

  const saveYouTubeVideo = async (video: Partial<YouTubeVideoItem> & { title: string; youtubeUrl: string }) => {
    const id = video.id || `yt-${Date.now()}`;
    const videoId = parseYouTubeVideoId(video.youtubeUrl) || video.videoId || '';
    const cleanUrl = video.youtubeUrl?.trim() || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

    // Auto-generate official YouTube thumbnail if videoId exists and thumbnail is empty, placeholder, or existing yt thumb
    let thumbnail = video.thumbnailUrl?.trim();
    if (
      !thumbnail ||
      thumbnail.includes('images.unsplash.com') ||
      (videoId && thumbnail.includes('img.youtube.com/vi/'))
    ) {
      thumbnail = videoId ? getYouTubeThumbnailUrl(videoId) : (thumbnail || '');
    }

    const item: YouTubeVideoItem = {
      id,
      title: video.title?.trim() || 'Untitled Masterclass',
      titleSinhala: video.titleSinhala?.trim() || video.title?.trim() || 'පාඨමාලා වීඩියෝව',
      description: video.description || '',
      descriptionSinhala: video.descriptionSinhala || video.description || '',
      youtubeUrl: cleanUrl,
      videoId,
      thumbnailUrl: thumbnail,
      category: video.category || 'COURSE INTRODUCTION',
      categorySinhala: video.categorySinhala || video.category || 'පාඨමාලා හැඳින්වීම',
      duration: video.duration || '10:00',
      isFeatured: video.isFeatured ?? false,
      isPublished: video.isPublished !== undefined ? video.isPublished : true,
      order: video.order ?? videos.length + 1,
      createdAt: video.createdAt || new Date().toISOString().split('T')[0],
    };

    const nextVideos = [...videos.filter((v) => v.id !== id), item].sort((a, b) => a.order - b.order);
    setVideos(nextVideos);
    try {
      localStorage.setItem('css_youtube_videos', JSON.stringify(nextVideos));
      localStorage.setItem('css_videos', JSON.stringify(nextVideos));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'youtube_videos', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save youtube_videos to Firestore:', err);
    }
    addAuditLog('Video Saved', `Video "${item.title}" saved to database.`);
  };

  const deleteYouTubeVideo = async (id: string) => {
    const nextVideos = videos.filter((v) => v.id !== id);
    setVideos(nextVideos);
    try {
      localStorage.setItem('css_youtube_videos', JSON.stringify(nextVideos));
      localStorage.setItem('css_videos', JSON.stringify(nextVideos));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'youtube_videos', id));
    } catch (err) {
      console.warn('Could not delete youtube_videos from Firestore:', err);
    }
    addAuditLog('Video Deleted', `Video ID ${id} deleted from database.`);
  };

  const saveGalleryImage = async (image: Partial<GalleryImageItem> & { title: string; imageUrl: string }) => {
    const id = image.id || `gal-${Date.now()}`;
    const item: GalleryImageItem = {
      id,
      title: image.title,
      titleSinhala: image.titleSinhala || '',
      description: image.description || '',
      descriptionSinhala: image.descriptionSinhala || '',
      imageUrl: image.imageUrl,
      category: image.category || 'FASHION',
      tag: image.tag || '',
      isFeatured: image.isFeatured ?? false,
      isPublished: image.isPublished !== undefined ? image.isPublished : true,
      order: image.order ?? gallery.length + 1,
      createdAt: image.createdAt || new Date().toISOString().split('T')[0],
    };

    const nextGallery = [...gallery.filter((g) => g.id !== id), item].sort((a, b) => a.order - b.order);
    setGallery(nextGallery);
    try {
      localStorage.setItem('css_gallery_images', JSON.stringify(nextGallery));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'gallery_images', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save gallery_images to Firestore:', err);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const nextGallery = gallery.filter((g) => g.id !== id);
    setGallery(nextGallery);
    try {
      localStorage.setItem('css_gallery_images', JSON.stringify(nextGallery));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'gallery_images', id));
    } catch (err) {
      console.warn('Could not delete gallery_images from Firestore:', err);
    }
  };

  const saveLocation = async (loc: Partial<LocationItem> & { name: string }) => {
    const id = loc.id || `loc-${Date.now()}`;
    const item: LocationItem = {
      id,
      name: loc.name,
      address: loc.address || '',
      mapUrl: loc.mapUrl || '',
      schedule: loc.schedule || '',
      phone: loc.phone || '',
      isActive: loc.isActive !== undefined ? loc.isActive : true,
      order: loc.order ?? locations.length + 1,
    };

    const nextLocations = [...locations.filter((l) => l.id !== id), item].sort((a, b) => a.order - b.order);
    setLocations(nextLocations);
    try {
      localStorage.setItem('css_locations', JSON.stringify(nextLocations));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'locations', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save locations to Firestore:', err);
    }
  };

  const deleteLocation = async (id: string) => {
    const nextLocations = locations.filter((l) => l.id !== id);
    setLocations(nextLocations);
    try {
      localStorage.setItem('css_locations', JSON.stringify(nextLocations));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'locations', id));
    } catch (err) {
      console.warn('Could not delete locations from Firestore:', err);
    }
  };

  const saveFAQ = async (faq: Partial<FAQItem> & { question: string; answer: string }) => {
    const id = faq.id || `faq-${Date.now()}`;
    const item: FAQItem = {
      id,
      question: faq.question,
      answer: faq.answer,
      order: faq.order ?? faqs.length + 1,
      isPublished: faq.isPublished !== undefined ? faq.isPublished : true,
    };

    const nextFaqs = [...faqs.filter((f) => f.id !== id), item].sort((a, b) => a.order - b.order);
    setFaqs(nextFaqs);
    try {
      localStorage.setItem('css_faqs', JSON.stringify(nextFaqs));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'faqs', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save faqs to Firestore:', err);
    }
  };

  const deleteFAQ = async (id: string) => {
    const nextFaqs = faqs.filter((f) => f.id !== id);
    setFaqs(nextFaqs);
    try {
      localStorage.setItem('css_faqs', JSON.stringify(nextFaqs));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (err) {
      console.warn('Could not delete faqs from Firestore:', err);
    }
  };

  // Update Lesson Progress
  const updateLessonProgressRecord = async (
    data: Partial<LessonProgressItem> & { studentRegNo: string; lessonId: string }
  ) => {
    const id = `${data.studentRegNo}_${data.lessonId}`;
    const timestamp = new Date().toISOString();
    const existing = lessonProgress.find((p) => p.id === id);
    const updated: LessonProgressItem = {
      id,
      studentRegNo: data.studentRegNo,
      lessonId: data.lessonId,
      videoStarted: data.videoStarted ?? existing?.videoStarted ?? true,
      videoProgress: data.videoProgress ?? existing?.videoProgress ?? 0,
      videoCompleted: data.videoCompleted ?? existing?.videoCompleted ?? false,
      lessonCompleted: data.lessonCompleted ?? existing?.lessonCompleted ?? false,
      lastPosition: data.lastPosition ?? existing?.lastPosition ?? 0,
      pdfViewed: data.pdfViewed ?? existing?.pdfViewed ?? false,
      resourceViewed: data.resourceViewed ?? existing?.resourceViewed ?? false,
      lastAccessedAt: timestamp,
      completedAt: data.lessonCompleted ? (existing?.completedAt || timestamp) : existing?.completedAt,
    };

    setLessonProgress((prev) => {
      const next = [...prev.filter((p) => p.id !== id), updated];
      try {
        localStorage.setItem('css_lesson_progress', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      await setDoc(doc(db, 'lesson_progress', id), updated, { merge: true });
    } catch (err) {
      console.warn('Could not save lesson_progress to Firestore:', err);
    }
  };

  // Video Category CRUD
  const saveVideoCategory = async (cat: Partial<VideoCategoryItem> & { name: string }) => {
    const id = cat.id || `cat-${Date.now()}`;
    const item: VideoCategoryItem = {
      id,
      slug: cat.slug || cat.name.toUpperCase().replace(/\s+/g, '_'),
      name: cat.name,
      nameSinhala: cat.nameSinhala || cat.name,
      description: cat.description || '',
      coverImageUrl: cat.coverImageUrl || '',
      order: cat.order ?? videoCategories.length + 1,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    };

    const nextCats = [...videoCategories.filter((c) => c.id !== id), item].sort((a, b) => a.order - b.order);
    setVideoCategories(nextCats);
    try {
      localStorage.setItem('css_video_categories', JSON.stringify(nextCats));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'video_categories', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save video_categories to Firestore:', err);
    }
  };

  const deleteVideoCategory = async (id: string) => {
    const next = videoCategories.filter((c) => c.id !== id);
    setVideoCategories(next);
    try {
      localStorage.setItem('css_video_categories', JSON.stringify(next));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'video_categories', id));
    } catch (err) {
      console.warn('Could not delete video_categories from Firestore:', err);
    }
  };

  // Runway Outfits CRUD
  const saveRunwayOutfit = async (outfit: Partial<RunwayOutfitItem> & { title: string }) => {
    const id = outfit.id || `runway-${Date.now()}`;
    const item: RunwayOutfitItem = {
      id,
      title: outfit.title,
      collectionName: outfit.collectionName || 'Atelier Collection 2026',
      category: outfit.category || '01 PARTY DRESS',
      style: outfit.style || 'Couture Silhouette',
      fabric: outfit.fabric || 'Luxury Silk',
      description: outfit.description || '',
      model3DUrl: outfit.model3DUrl || '',
      textureUrl: outfit.textureUrl || '',
      thumbnailUrl: outfit.thumbnailUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      color: outfit.color || '#6e1322',
      metallic: outfit.metallic ?? 0.4,
      roughness: outfit.roughness ?? 0.25,
      studentDesigner: outfit.studentDesigner || 'Ceylon Style Studio Atelier',
      isFeatured: outfit.isFeatured !== undefined ? outfit.isFeatured : true,
      isPublished: outfit.isPublished !== undefined ? outfit.isPublished : true,
      displayOrder: outfit.displayOrder ?? runwayOutfits.length + 1,
      createdAt: outfit.createdAt || new Date().toISOString(),
    };

    const nextOutfits = [...runwayOutfits.filter((o) => o.id !== id), item].sort((a, b) => a.displayOrder - b.displayOrder);
    setRunwayOutfits(nextOutfits);
    try {
      localStorage.setItem('css_runway_outfits', JSON.stringify(nextOutfits));
    } catch (_) {}
    try {
      await setDoc(doc(db, 'runway_outfits', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save runway_outfits to Firestore:', err);
    }
  };

  const deleteRunwayOutfit = async (id: string) => {
    const next = runwayOutfits.filter((o) => o.id !== id);
    setRunwayOutfits(next);
    try {
      localStorage.setItem('css_runway_outfits', JSON.stringify(next));
    } catch (_) {}
    try {
      await deleteDoc(doc(db, 'runway_outfits', id));
    } catch (err) {
      console.warn('Could not delete runway_outfits from Firestore:', err);
    }
  };

  // Student Creations CRUD & Moderation
  const submitStudentCreation = async (
    creation: Omit<StudentCreationItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<StudentCreationItem> => {
    const id = `cre-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const item: StudentCreationItem = {
      ...creation,
      id,
      status: 'PENDING',
      isFeatured: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setStudentCreations((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem('css_student_creations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      await setDoc(doc(db, 'student_creations', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save student_creations to Firestore:', err);
    }

    return item;
  };

  const updateStudentCreationStatus = async (
    id: string,
    status: StudentCreationItem['status'],
    adminNotes?: string,
    isFeatured?: boolean
  ) => {
    const timestamp = new Date().toISOString();
    setStudentCreations((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            adminNotes: adminNotes !== undefined ? adminNotes : item.adminNotes,
            isFeatured: isFeatured !== undefined ? isFeatured : item.isFeatured,
            updatedAt: timestamp,
          };
        }
        return item;
      });
      try {
        localStorage.setItem('css_student_creations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      const updates: any = { status, updatedAt: timestamp };
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;
      if (isFeatured !== undefined) updates.isFeatured = isFeatured;
      await setDoc(doc(db, 'student_creations', id), updates, { merge: true });
    } catch (err) {
      console.warn('Could not update student_creations in Firestore:', err);
    }
  };

  const deleteStudentCreation = async (id: string) => {
    setStudentCreations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('css_student_creations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    try {
      await deleteDoc(doc(db, 'student_creations', id));
    } catch (err) {
      console.warn('Could not delete student_creations from Firestore:', err);
    }
  };

  // Business Calculator CRUD
  const saveBusinessCalculation = async (
    calc: Omit<BusinessCalculationItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<BusinessCalculationItem> => {
    const id = calc.id || `calc-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const item: BusinessCalculationItem = {
      ...calc,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setBusinessCalculations((prev) => {
      const next = [...prev.filter((c) => c.id !== id), item];
      try {
        localStorage.setItem('css_business_calculations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      await setDoc(doc(db, 'business_calculations', id), item, { merge: true });
    } catch (err) {
      console.warn('Could not save business_calculations to Firestore:', err);
    }

    return item;
  };

  const deleteBusinessCalculation = async (id: string) => {
    setBusinessCalculations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('css_business_calculations', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    try {
      await deleteDoc(doc(db, 'business_calculations', id));
    } catch (err) {
      console.warn('Could not delete business_calculations from Firestore:', err);
    }
  };

  // Follow-Up History
  const addFollowUpHistory = async (item: Omit<FollowUpHistoryItem, 'id' | 'actionDate'>) => {
    const id = `fu-${Date.now()}`;
    const record: FollowUpHistoryItem = {
      ...item,
      id,
      actionDate: new Date().toISOString(),
    };

    setFollowUpHistory((prev) => {
      const next = [record, ...prev];
      localStorage.setItem('css_followup_history', JSON.stringify(next));
      return next;
    });

    try {
      await setDoc(doc(db, 'follow_up_history', id), record);
    } catch (_) {}
  };

  // Analytics Event Tracking
  const trackAnalyticsEvent = async (eventName: string, metadata?: Record<string, any>) => {
    const event: AnalyticsEventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventName,
      regNumber: studentUser?.regNumber,
      metadata,
      timestamp: new Date().toISOString(),
    };

    setAnalyticsEvents((prev) => [event, ...prev].slice(0, 500));
    try {
      await addDoc(collection(db, 'analytics_events'), event);
    } catch (_) {}
  };

  // Audit Logging
  const addAuditLog = async (action: string, details: string) => {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action,
      details,
      adminEmail: user?.email || (isAdmin ? 'admin@ceylonstylestudio.lk' : 'System'),
      timestamp: new Date().toISOString(),
    };

    setAuditLogs((prev) => [log, ...prev].slice(0, 300));
    try {
      await addDoc(collection(db, 'audit_logs'), log);
    } catch (_) {}
  };

  const resetToDefaults = async () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setModules(DEFAULT_MODULES);
    setVideos(DEFAULT_YOUTUBE_VIDEOS);
    setGallery(DEFAULT_GALLERY_IMAGES);
    setLocations(DEFAULT_LOCATIONS);
    setFaqs(DEFAULT_FAQS);
    setLessons(DEFAULT_LESSONS);
    setVideoCategories(DEFAULT_VIDEO_CATEGORIES);
    setRunwayOutfits(DEFAULT_RUNWAY_OUTFITS);
    setStudentCreations(DEFAULT_STUDENT_CREATIONS);
    setBusinessCalculations(DEFAULT_BUSINESS_CALCULATIONS);
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        courses,
        saveCourse,
        deleteCourse,
        modules,
        whyFeatures,
        videos,
        gallery,
        locations,
        faqs,
        lessons,
        registrations,
        paymentSlips,
        auditLogs,
        videoCategories,
        runwayOutfits,
        studentCreations,
        businessCalculations,
        lessonProgress,
        followUpHistory,
        analyticsEvents,
        isLoading,
        submitRegistration,
        loginStudentWithCredentials,
        uploadPaymentSlip,
        approvePaymentSlip,
        rejectPaymentSlip,
        toggleStudentCourseAccess,
        toggleStudentBrandModuleAccess,
        recordLastAccessedLesson,
        saveStudentBrandModuleData,
        getStudentBrandModuleData,
        markLessonCompleted,
        toggleLessonCompleted,
        updateLessonProgressRecord,
        updateRegistrationStatus,
        updateRegistrationNotes,
        updateRegistrationFull,
        deleteRegistration,
        updateSiteSettings,
        saveCourseModule,
        deleteCourseModule,
        saveWhyFeature,
        deleteWhyFeature,
        saveLesson,
        deleteLesson,
        saveYouTubeVideo,
        deleteYouTubeVideo,
        saveGalleryImage,
        deleteGalleryImage,
        saveLocation,
        deleteLocation,
        saveFAQ,
        deleteFAQ,
        saveVideoCategory,
        deleteVideoCategory,
        saveRunwayOutfit,
        deleteRunwayOutfit,
        submitStudentCreation,
        updateStudentCreationStatus,
        deleteStudentCreation,
        saveBusinessCalculation,
        deleteBusinessCalculation,
        addFollowUpHistory,
        trackAnalyticsEvent,
        addAuditLog,
        resetToDefaults,
        loginOrRegisterFirebaseStudent,
        zoomClasses,
        subscriptions,
        saveZoomClass,
        deleteZoomClass,
        toggleStudentPaidMonth,
        getStudentPaidMonths,
        communityPosts,
        createCommunityPost,
        toggleLikeCommunityPost,
        addCommentToCommunityPost,
        deleteCommunityPost,
        customForms,
        formSubmissions,
        studentReviews,
        saveCustomForm,
        deleteCustomForm,
        submitCustomForm,
        updateFormSubmissionStatus,
        deleteFormSubmission,
        campaigns,
        campaignLeads,
        saveCampaign,
        deleteCampaign,
        submitCampaignLead,
        updateCampaignLeadStatus,
        deleteCampaignLead,
        saveStudentReview,
        deleteStudentReview,
        toggleReviewApproval,
        archiveCourse,
        publishCourse,
        submitTwoStepRegistration,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
