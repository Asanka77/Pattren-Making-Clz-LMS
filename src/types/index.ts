export type CourseType = 'PHYSICAL CLASS' | 'ZOOM CLASS';

export type RegistrationStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type CourseAccessStatus = 'PENDING' | 'ACTIVE' | 'LOCKED';

export interface Registration {
  id: string;
  regNumber: string; // e.g. CSS-2026-0001
  fullName: string;
  whatsappNumber: string;
  email?: string;
  authUid?: string; // Firebase Auth User ID
  district: string;
  city?: string;
  age?: string;
  occupation?: string;
  educationalQualification: string;
  courseId?: string;
  courseTitle?: string;
  courseType: CourseType;
  location?: string;
  previousPatternCourse: 'YES' | 'NO';
  previousCourseDetails?: string;
  whyJoin?: string;
  expectedAchievements?: string;
  preferredContactTime?: string;
  status: RegistrationStatus;
  paymentStatus: PaymentVerificationStatus;
  courseAccess: CourseAccessStatus;
  password?: string;
  adminNotes?: string;
  completedLessonIds?: string[];
  brandModuleApproved?: boolean;
  lastAccessedLessonId?: string;
  paidMonths?: number[]; // e.g. [1, 2] indicating which specific months the user has paid for
  paidMonthsByCourse?: Record<string, number[]>; // courseId -> [1, 2, ...]
  enrolledCourseIds?: string[]; // courses the student has enrolled in
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSlip {
  id: string;
  studentId?: string;
  regNumber: string;
  studentName: string;
  whatsappNumber: string;
  courseId?: string;
  courseTitle?: string;
  month?: number; // specific month of the course (1..6)
  paymentType: string; // 'Monthly Fee' | 'Registration Fee' | 'Full Course Fee'
  amount: number;
  paymentDate: string;
  bankName: string;
  transactionReference: string;
  slipUrl: string; // data URL or hosted link
  status: PaymentVerificationStatus;
  adminNotes?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface StudentSubscription {
  id: string;
  studentId: string;
  regNumber: string;
  courseId: string;
  courseTitle: string;
  activeMonths: number[]; // e.g. [1, 2]
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  monthlyFee: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveZoomClass {
  id: string;
  courseId: string;
  courseTitle: string;
  month: number;
  title: string;
  titleSinhala?: string;
  date: string;
  time: string;
  zoomUrl: string;
  meetingId: string;
  passcode: string;
  mentorName: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  notes?: string;
}

export interface CourseSectionItem {
  id: string;
  title: string;
  titleSinhala?: string;
  content: string; // rich text or markdown paragraphs
  order: number;
  isVisible: boolean;
}

export interface CourseVideoItem {
  id: string;
  title: string;
  titleSinhala?: string;
  youtubeUrl: string;
  videoId?: string;
  isPlaylist?: boolean;
  playlistId?: string;
  description?: string;
  order: number;
  isVisible?: boolean;
}

export interface CourseResourceItem {
  id: string;
  title: string;
  titleSinhala?: string;
  description?: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string; // 'pdf' | 'doc' | etc
  isProtected?: boolean; // Requires active enrolled student status or public
  isRestricted?: boolean;
  order?: number;
  isVisible?: boolean;
}

export interface CourseTestimonialItem {
  id: string;
  studentName: string;
  courseTitle?: string;
  youtubeUrl?: string;
  videoId?: string;
  writtenFeedback?: string;
  feedback?: string; // convenient alias
  rating?: number; // 1-5
  avatarUrl?: string;
  isApproved?: boolean;
  order?: number;
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  titleSinhala?: string;
  subtitle?: string;
  subtitleSinhala?: string;
  badge?: string;
  badgeSinhala?: string;
  description: string;
  descriptionSinhala?: string;
  aboutCourse?: string; // Long rich text description for dynamic course detail page
  aboutCourseSinhala?: string;
  category: string;
  duration: string;
  courseMode?: 'PHYSICAL' | 'ZOOM' | 'HYBRID';
  schedule?: string;
  locations?: string[]; // e.g. ['KEGALLE', 'KURUNEGALA', 'PILIYANDALA']
  physicalFee: number;
  zoomFee: number;
  registrationFee: number;
  intakeText?: string;
  intakeTextSinhala?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  promoVideoUrl?: string;
  features?: string[];
  syllabusOverview?: string[];
  learningOutcomes?: string[];
  learningOutcomesSinhala?: string[];
  instructorName?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorAvatar?: string;
  sections?: CourseSectionItem[];
  videos?: CourseVideoItem[];
  pdfResources?: CourseResourceItem[];
  testimonials?: CourseTestimonialItem[];
  customFormId?: string; // Optional linked custom form
  cardBgImageUrl?: string; // High-fashion background image or luxury texture for card
  cardOverlayOpacity?: number; // Background overlay opacity (0-100)
  accentColor?: string; // Custom card accent / border / badge color
  textColor?: string; // Custom card title and text color
  isFeatured?: boolean;
  isPublished: boolean;
  isArchived?: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface CustomFormField {
  id: string;
  name?: string;
  type: FormFieldType;
  label: string;
  labelSinhala?: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[]; // for dropdown, radio, checkbox
  order?: number;
}

export interface CustomForm {
  id: string;
  slug: string;
  title: string;
  titleSinhala?: string;
  instructions?: string;
  instructionsSinhala?: string;
  successMessage?: string;
  successMessageSinhala?: string;
  associatedCourseId?: string;
  associatedCourseTitle?: string;
  fields: CustomFormField[];
  isPublished: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formSlug: string;
  formVersion: number;
  courseId?: string;
  courseTitle?: string;
  submittedData: Record<string, any>;
  createdAt: string;
  status: 'NEW' | 'REVIEWED' | 'ARCHIVED';
  notes?: string;
}

export interface StudentReviewItem {
  id: string;
  studentName: string;
  studentBatch?: string;
  courseId?: string;
  courseTitle?: string;
  youtubeUrl: string;
  videoId?: string;
  writtenFeedback?: string;
  rating?: number;
  avatarUrl?: string;
  isApproved: boolean;
  isFeatured?: boolean;
  order: number;
  createdAt: string;
}

export interface CampaignVideoEmbed {
  id: string;
  heading: string;
  headingSinhala?: string;
  youtubeUrl: string;
  description?: string;
  descriptionSinhala?: string;
}

export interface CampaignReviewEmbed {
  id: string;
  heading?: string;
  studentName: string;
  studentBatch?: string;
  youtubeUrl: string;
  rating?: number;
  feedback?: string;
}

export interface CampaignPdfResource {
  id: string;
  title: string;
  titleSinhala?: string;
  pdfUrl: string;
  fileSize?: string;
  description?: string;
}

export interface CampaignPage {
  id: string;
  slug: string;
  title: string;
  titleSinhala?: string;
  badge?: string;
  badgeSinhala?: string;
  associatedCourseId?: string;
  associatedCourseTitle?: string;
  aboutHeading?: string;
  aboutHeadingSinhala?: string;
  aboutDescription: string;
  aboutDescriptionSinhala?: string;
  highlights?: string[];
  highlightsSinhala?: string[];
  videos: CampaignVideoEmbed[];
  pdfResource?: CampaignPdfResource;
  studentReviews: CampaignReviewEmbed[];
  regularPrice?: number;
  discountPrice?: number;
  currency?: string;
  intakeText?: string;
  intakeTextSinhala?: string;
  countdownEndDate?: string;
  spotsLeft?: number;
  whatsappNumber?: string;
  whatsappPrefillText?: string;
  formHeading?: string;
  formHeadingSinhala?: string;
  formSubheading?: string;
  formSubheadingSinhala?: string;
  requireExperience?: boolean;
  requireLocation?: boolean;
  allowedLocations?: string[];
  successTitle?: string;
  successTitleSinhala?: string;
  successMessage?: string;
  successMessageSinhala?: string;
  isPublished: boolean;
  viewsCount?: number;
  leadsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignLead {
  id: string;
  campaignId: string;
  campaignSlug: string;
  campaignTitle: string;
  fullName: string;
  whatsappNumber: string;
  email?: string;
  district?: string;
  city?: string;
  studyMode: 'PHYSICAL' | 'ZOOM';
  preferredLocation?: string;
  experienceLevel?: string;
  notes?: string;
  paymentSlipUrl?: string;
  status: 'NEW' | 'CONTACTED' | 'ENROLLED' | 'CANCELLED';
  adminNotes?: string;
  createdAt: string;
}

export interface LessonVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  videoId?: string;
  duration?: string;
}

export interface LessonMaterialItem {
  id: string;
  title: string;
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  courseId?: string;
  courseTitle?: string;
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  lessonNumber: string;
  title: string;
  titleSinhala?: string;
  description: string;
  descriptionSinhala?: string;
  videoUrl: string;
  videoId?: string;
  videoUrls?: LessonVideoItem[];
  duration: string;
  notes: string;
  pdfTitle?: string;
  pdfUrl?: string;
  pdfMaterials?: LessonMaterialItem[];
  thumbnailUrl?: string;
  imageUrls?: string[];
  month?: number; // 1 to 6
  isPublished: boolean;
  order: number;
}

export interface SiteSettings {
  id?: string;
  logoUrl?: string; // Custom brand logo URL or data URL editable from backend
  brandName?: string; // Brand name (e.g. CEYLON STYLE STUDIO)
  heroMediaType: 'IMAGE' | 'VIDEO';
  heroTitle: string;
  heroSubtitle: string;
  heroCourseTitle: string;
  heroBadge?: string;
  heroCtaText: string;
  heroCtaLink?: string;
  heroImageUrl: string;
  heroVideoUrl: string; // Authentic YouTube video URL
  heroAnimation?: string;
  introBadge?: string;
  introTitle?: string;
  introHighlightTitle?: string;
  introHighlightDesc?: string;
  physicalFee: number;
  zoomFee: number;
  registrationFee: number;
  currency: string;
  courseDuration: string;
  discountNote: string;
  whatsappContactNumber: string;
  whatsappDefaultMessage: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  paymentInstructions: string;
  announcement?: string;
  // Full Website Background & Color Theme
  pageBgImageUrl?: string; // Full landing page background image or luxury texture
  pageBgOverlayOpacity?: number; // Background dark overlay opacity (0-100)
  pageTextColor?: string; // Global body text color
  headingTextColor?: string; // Global heading text color
  cardBgColor?: string; // Global card background tone
  // Section Background Images & Gaps
  sectionBgImages?: Record<string, string>; // Maps section key -> custom background image URL
  sectionBgOverlayOpacity?: number; // Section background overlay opacity (0-100)
  sectionGapSize?: 'none' | 'small' | 'medium' | 'large'; // Spacing / gaps between sections
  sectionGlassmorphism?: boolean; // Translucent frosted glass effect on sections
  // Gold Diploma Certificate Template Customizer (Editable from Backend)
  certAcademyTitle?: string; // Academy Name on certificate (default: CEYLON STYLE STUDIO)
  certSubTitle?: string; // Academy Subtitle / Accreditation
  certAwardText?: string; // Solemn certification text
  certCourseTitle?: string; // Default Specialization / Diploma Title
  certDescription?: string; // Descriptive curriculum mastery text
  certSignatory1Name?: string; // Lead Designer signature name
  certSignatory1Title?: string; // Lead Designer title
  certSignatory2Name?: string; // Academic Dean signature name
  certSignatory2Title?: string; // Academic Dean title
  certLogoUrl?: string; // Custom certificate crest / seal logo (falls back to siteSettings.logoUrl)
  certBorderColor?: string; // Custom certificate accent / border color

  // Course Completion Recognized Certificate Showcase (Backend Managed)
  courseCertificateImageUrl?: string; // Official certificate image URL or uploaded file
  courseCertificateTitle?: string; // Certificate title in English
  courseCertificateTitleSinhala?: string; // Certificate title in Sinhala
  courseCertificateSubtitle?: string;
  courseCertificateSubtitleSinhala?: string;
  courseCertificateDescription?: string;
  courseCertificateDescriptionSinhala?: string;
  courseCertificateBadges?: string[];

  // Graduate Runway Fashion Show Showcase (Backend Managed)
  fashionShowTitle?: string;
  fashionShowTitleSinhala?: string;
  fashionShowSubtitle?: string;
  fashionShowSubtitleSinhala?: string;
  fashionShowDescription?: string;
  fashionShowDescriptionSinhala?: string;
  fashionShowImageUrl?: string;
  fashionShowDateVenue?: string;
  fashionShowDateVenueSinhala?: string;
  fashionShowPerks?: string[];

  // Custom Body Measurement Guides (Backend Managed)
  bodyMeasurements?: BodyMeasurementItem[];

  // Pinterest Curated Sewing Tutorials Settings (Backend Managed)
  sewingTutorialsBadgeText?: string;
  sewingTutorialsBadgeTextSinhala?: string;
  sewingTutorialsTitle?: string;
  sewingTutorialsTitleSinhala?: string;
  sewingTutorialsSubtitle?: string;
  sewingTutorialsSubtitleSinhala?: string;
  sewingTutorialsDescription?: string;
  sewingTutorialsDescriptionSinhala?: string;
  sewingTutorialsFeature1Sinhala?: string;
  sewingTutorialsFeature2Sinhala?: string;
  sewingTutorialsVerifyNoteSinhala?: string;
  sewingTutorialsPinterestBoardUrl?: string;
  sewingTutorialsPinterestTabId?: string;
  sewingTutorialsShowDescription?: boolean;
  sewingTutorialsPlayerAspect?: 'adaptive' | 'portrait' | 'widescreen';

  // Advanced Security Settings (Configurable by Master Admin)
  securitySessionTimeoutMinutes?: number;
  securityMaxFailedAttempts?: number;
  securityLockoutDurationMinutes?: number;
  securityRequirePINForSensitiveActions?: boolean;
  securityMasterPIN?: string;
  securityEnforceTwoFactor?: boolean;
  securityIpWhitelistEnabled?: boolean;
  securityAllowedOrigins?: string;
  securityAuditLogRetentionDays?: number;
  securityEmailAlertsOnFailedLogin?: boolean;

  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    whatsapp: string;
  };
  updatedAt?: string;
}

export interface BodyMeasurementItem {
  id: string;
  name: string;
  nameSinhala: string;
  category: 'upper' | 'lower' | 'length' | 'circumference';
  imageUrl: string;
  howToMeasure: string;
  howToMeasureSinhala: string;
  standardRange: string;
  tip: string;
  tipSinhala: string;
  patternImpact: string;
  patternImpactSinhala: string;
  order?: number;
}

export interface CourseModuleItem {
  id: string;
  number: string;
  title: string;
  titleSinhala?: string;
  description: string;
  descriptionSinhala?: string;
  category?: string;
  order: number;
  isPublished: boolean;
  iconName?: string;
  imageUrl?: string;
}

export interface WhyFeatureItem {
  id: string;
  number: string;
  title: string;
  titleSinhala: string;
  description: string;
  descriptionSinhala: string;
  imageUrl: string;
  iconName: string;
  order: number;
  isPublished: boolean;
  category?: string;
  badge?: string;
  badgeSinhala?: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  titleSinhala?: string;
  description: string;
  descriptionSinhala?: string;
  youtubeUrl: string;
  videoId: string;
  thumbnailUrl?: string;
  category: string;
  categorySinhala?: string;
  duration?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
}

export interface GalleryImageItem {
  id: string;
  title: string;
  titleSinhala?: string;
  description: string;
  descriptionSinhala?: string;
  imageUrl: string;
  category: string;
  tag?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  mapUrl?: string;
  schedule?: string;
  phone?: string;
  isActive: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

export interface VideoCategoryItem {
  id: string;
  slug: string;
  name: string;
  nameSinhala?: string;
  description?: string;
  coverImageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface LessonProgressItem {
  id: string;
  studentRegNo: string;
  lessonId: string;
  videoStarted?: boolean;
  videoProgress?: number; // percentage 0-100
  videoCompleted?: boolean;
  lessonCompleted: boolean;
  lastPosition?: number; // in seconds
  pdfViewed?: boolean;
  resourceViewed?: boolean;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface BusinessCalculationItem {
  id: string;
  studentRegNo?: string;
  studentId?: string;
  title: string;
  fabricCost: number;
  sewingCost: number;
  accessoriesCost: number;
  packagingCost: number;
  marketingCost: number;
  transportCost: number;
  labourCost: number;
  otherCost: number;
  quantity: number;
  totalCost: number;
  unitCost: number;
  sellingPrice: number;
  profitPerUnit: number;
  totalProfit: number;
  markupPercent: number;
  profitMargin: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCreationItem {
  id: string;
  studentRegNo: string;
  studentName: string;
  projectTitle: string;
  collectionName?: string;
  category: string;
  description: string;
  designImageUrl: string;
  patternImageUrl: string;
  garmentImageUrl: string;
  additionalImageUrls?: string[];
  videoUrl?: string;
  socialLink?: string;
  privacyLevel: 'FULL_NAME' | 'FIRST_NAME_ONLY' | 'ANONYMOUS';
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_CHANGES';
  isFeatured?: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RunwayOutfitItem {
  id: string;
  title: string;
  collectionName: string;
  category: string;
  style: string;
  fabric: string;
  description: string;
  model3DUrl?: string;
  textureUrl?: string;
  thumbnailUrl: string;
  color?: string;
  metallic?: number;
  roughness?: number;
  studentDesigner?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface FollowUpTaskItem {
  id: string;
  studentName: string;
  regNumber: string;
  whatsappNumber: string;
  courseType: CourseType;
  location?: string;
  district: string;
  registrationDate: string;
  lastAction: string;
  paymentStatus: PaymentVerificationStatus;
  status: 'NEW' | 'FOLLOW_UP_DUE' | 'WAITING_FOR_PAYMENT' | 'PAYMENT_REVIEW' | 'COMPLETED';
  notes?: string;
}

export interface FollowUpHistoryItem {
  id: string;
  regNumber: string;
  studentName: string;
  messageType: string;
  messageContent: string;
  adminEmail: string;
  actionDate: string;
  status: string;
}

export interface AnalyticsEventItem {
  id: string;
  eventName: string;
  regNumber?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  target: 'ADMIN' | 'STUDENT';
  studentRegNo?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'STUDENT' | 'MENTOR' | 'ADMIN';
  authorRegNumber?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  courseId: string;
  courseTitle: string;
  month?: number;
  authorId: string;
  authorName: string;
  authorRole: 'STUDENT' | 'MENTOR' | 'ADMIN';
  authorRegNumber?: string;
  title: string;
  content: string;
  category: 'QUESTION' | 'SHOWCASE' | 'TECHNIQUE' | 'ANNOUNCEMENT' | 'GENERAL';
  tags?: string[];
  imageUrl?: string;
  likesCount: number;
  likedBy: string[];
  comments: CommunityComment[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
}
