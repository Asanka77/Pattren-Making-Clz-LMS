import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StyleCollectionSlider } from './components/StyleCollectionSlider';
import { CourseIntro } from './components/CourseIntro';
import { VideoGallery } from './components/VideoGallery';
import { WhyCourse } from './components/WhyCourse';
import { CourseJourney } from './components/CourseJourney';
import { AIFashionSection } from './components/AIFashionSection';
import { DigitalMarketingSection } from './components/DigitalMarketingSection';
import { BrandBuildingSection } from './components/BrandBuildingSection';
import { TargetAudience } from './components/TargetAudience';
import { PricingSection } from './components/PricingSection';
import { LocationsSection } from './components/LocationsSection';
import { CourseBenefits } from './components/CourseBenefits';
import { ImageGallery } from './components/ImageGallery';
import { RegistrationForm } from './components/RegistrationForm';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { StudentLoginModal } from './components/Student/StudentLoginModal';
import { SilkParticleCanvas } from './components/Effects/SilkParticleCanvas';
import { SectionReveal } from './components/Effects/SectionReveal';
import { PinterestSewingTutorials } from './components/SewingTutorials/PinterestSewingTutorials';
import { CourseCertificateAndFashionShow } from './components/Certificate/CourseCertificateAndFashionShow';
import { StudentReviewVideos } from './components/StudentReviewVideos';
import { CourseDetailPage } from './components/Course/CourseDetailPage';
import { FBCampaignLandingPage } from './components/Campaign/FBCampaignLandingPage';

// Performance Optimization: Code-splitting and lazy loading for heavy modals
const AdminModal = React.lazy(() =>
  import('./components/Admin/AdminModal').then((m) => ({ default: m.AdminModal }))
);
const StudentDashboardModal = React.lazy(() =>
  import('./components/Student/StudentDashboardModal').then((m) => ({ default: m.StudentDashboardModal }))
);
const FashionMentorModal = React.lazy(() =>
  import('./components/Student/FashionMentorModal').then((m) => ({ default: m.FashionMentorModal }))
);
const CourseSyllabusModal = React.lazy(() =>
  import('./components/Syllabus/CourseSyllabusModal').then((m) => ({ default: m.CourseSyllabusModal }))
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App ErrorBoundary caught runtime exception:', error, errorInfo);
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch (_) {
      window.location.href = '/';
    }
  };

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (_) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c090a] text-[#f4efe6] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-lg bg-gradient-to-b from-[#1c1214] via-[#160e10] to-[#120d0f] border-2 border-[#dfb56c] shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#540d18] border-2 border-[#dfb56c] mx-auto flex items-center justify-center shadow-lg text-[#dfb56c] text-2xl font-bold">
              ✦
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-editorial font-bold text-[#f7e2a9]">
                Ceylon Style Studio
              </h2>
              <p className="text-xs text-[#d5cfc4] font-sinhala leading-relaxed">
                වෙබ් පිටුව පූරණය කිරීමේදී දෝෂයක් හඳුනාගන්නා ලදී. කරුණාකර පහත බොත්තම ඔබා පිටුව නැවත Load කරන්න.
              </p>
              <p className="text-[11px] text-[#a89f91] font-mono break-words bg-black/40 p-2 rounded border border-white/5">
                {this.state.error?.message || 'A temporary runtime error was handled safely.'}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                පිටුව නැවත Load කරන්න (Reload Page)
              </button>
              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="w-full py-2 px-4 rounded bg-[#540d18]/60 hover:bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30 text-[11px] font-mono transition-all cursor-pointer"
              >
                Clear Cache &amp; Fresh Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface MainAppContentProps {
  onOpenAdmin: () => void;
  onOpenStudentLogin: () => void;
  onOpenStudentDashboard: () => void;
  onOpenMentor: () => void;
  onOpenSyllabus: (courseId?: string) => void;
  onOpenCoursePage: (courseSlug: string) => void;
}

function MainAppContent({
  onOpenAdmin,
  onOpenStudentLogin,
  onOpenStudentDashboard,
  onOpenMentor,
  onOpenSyllabus,
  onOpenCoursePage,
}: MainAppContentProps) {
  const { siteSettings } = useData();

  return (
    <div
      className={`min-h-screen text-[#f4efe6] selection:bg-[#c99a45] selection:text-black font-sans relative transition-colors duration-500 ${
        siteSettings.pageBgImageUrl ? 'has-page-bg bg-transparent' : 'bg-[#0c090a]'
      }`}
      style={{
        color: siteSettings.pageTextColor || '#f4efe6',
      }}
    >
      {/* Dynamic Full Landing Page Background Image from Backend CMS */}
      {siteSettings.pageBgImageUrl ? (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url(${siteSettings.pageBgImageUrl})` }}
        />
      ) : null}

      {/* Dark Ambient Overlay with customizable opacity for luxury contrast */}
      {siteSettings.pageBgImageUrl ? (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-black transition-opacity duration-700"
          style={{ opacity: (siteSettings.pageBgOverlayOpacity ?? 55) / 100 }}
        />
      ) : null}

      {/* Smooth Ambient Silk Particle Background */}
      <SilkParticleCanvas />

      {/* Main Top Navigation */}
      <Navbar
        onOpenAdmin={onOpenAdmin}
        onOpenStudentLogin={onOpenStudentLogin}
        onOpenStudentDashboard={onOpenStudentDashboard}
        onOpenMentor={onOpenMentor}
        onOpenSyllabus={() => onOpenSyllabus()}
      />

      {/* Public Landing Page Sections with Staggered Viewport Reveal & Section-Specific Background Support */}
      <main className="relative z-10">
        {/* 1. Cover / Hero Page */}
        <Hero onOpenSyllabus={() => onOpenSyllabus()} />

        {/* 2. Course Videos & Masterclasses */}
        <SectionReveal sectionKey="videos">
          <VideoGallery
            onOpenStudentLogin={onOpenStudentLogin}
            onOpenRegister={() => {
              const el = document.getElementById('pricing') || document.getElementById('register');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </SectionReveal>

        {/* 3. Course Introduction & Overview */}
        <SectionReveal sectionKey="intro">
          <CourseIntro onOpenSyllabus={() => onOpenSyllabus()} />
        </SectionReveal>

        {/* 4. Why Course Pillars */}
        <SectionReveal sectionKey="whyCourse">
          <WhyCourse />
        </SectionReveal>

        {/* 5. 6-Month Journey Timeline */}
        <SectionReveal sectionKey="journey">
          <CourseJourney onOpenSyllabus={() => onOpenSyllabus()} />
        </SectionReveal>

        {/* Pinterest Curated Sewing & Tailoring Tutorials (In-App Reader) */}
        <SectionReveal id="sewing-tutorials" sectionKey="sewingTutorials">
          <PinterestSewingTutorials />
        </SectionReveal>

        {/* 6. AI Fashion Tech Integration */}
        <SectionReveal sectionKey="aiFashion">
          <AIFashionSection onOpenMentor={onOpenMentor} />
        </SectionReveal>

        {/* 7. Digital Marketing & E-Commerce */}
        <SectionReveal sectionKey="marketing">
          <DigitalMarketingSection />
        </SectionReveal>

        {/* 8. Exclusive Style Collection 3D Motion Slider */}
        <SectionReveal sectionKey="styles">
          <StyleCollectionSlider onOpenAdmin={onOpenAdmin} />
        </SectionReveal>

        {/* 9. Brand Building Masterclass */}
        <SectionReveal sectionKey="branding">
          <BrandBuildingSection />
        </SectionReveal>

        {/* NEW: Recognized Professional Diploma & Grand Graduate Fashion Show */}
        <SectionReveal id="certificate" sectionKey="certificate">
          <CourseCertificateAndFashionShow />
        </SectionReveal>

        {/* NEW: Student Video Reviews & Graduate Testimonials */}
        <SectionReveal id="student-reviews" sectionKey="studentReviews">
          <StudentReviewVideos />
        </SectionReveal>

        <SectionReveal sectionKey="audience">
          <TargetAudience />
        </SectionReveal>

        <SectionReveal sectionKey="pricing">
          <PricingSection
            onOpenSyllabus={(courseId) => onOpenSyllabus(courseId)}
            onOpenCoursePage={onOpenCoursePage}
          />
        </SectionReveal>

        <SectionReveal sectionKey="locations">
          <LocationsSection />
        </SectionReveal>

        <SectionReveal sectionKey="benefits">
          <CourseBenefits />
        </SectionReveal>

        <SectionReveal sectionKey="gallery">
          <ImageGallery />
        </SectionReveal>

        <SectionReveal sectionKey="register">
          <RegistrationForm
            onOpenStudentDashboard={onOpenStudentDashboard}
          />
        </SectionReveal>

        <SectionReveal sectionKey="faq">
          <FAQSection />
        </SectionReveal>

        <SectionReveal sectionKey="finalCta">
          <FinalCTA />
        </SectionReveal>
      </main>

      <Footer onOpenAdmin={onOpenAdmin} onOpenSyllabus={() => onOpenSyllabus()} />
      <WhatsAppButton />

      {/* Floating AI Fashion Mentor Trigger */}
      <aside
        aria-label="AI Fashion Mentor Assistant"
        className="fixed bottom-6 left-6 z-40 flex items-center group"
      >
        <button
          onClick={onOpenMentor}
          className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#241317] via-[#540d18] to-[#1c1214] border-2 border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase tracking-wider shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Ask Madame Celine (AI Fashion Mentor)"
        >
          <div className="w-5 h-5 rounded-full bg-[#38070e] border border-[#dfb56c] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-pulse" />
          </div>
          <span className="font-mono text-[11px]">AI Fashion Mentor</span>
        </button>
      </aside>
    </div>
  );
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string | undefined>();
  const [studentLoginOpen, setStudentLoginOpen] = useState(false);
  const [studentDashboardOpen, setStudentDashboardOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [syllabusCourseId, setSyllabusCourseId] = useState<string | undefined>();
  const [activeCourseSlug, setActiveCourseSlug] = useState<string | null>(null);
  const [activeCampaignSlug, setActiveCampaignSlug] = useState<string | null>(null);

  const handleOpenSyllabus = (courseId?: string) => {
    setSyllabusCourseId(courseId);
    setSyllabusOpen(true);
  };

  // Secure URL detection (/#admin, #/admin, /admin, /course/:slug, ?course=:slug, #promo/:slug, ?promo=:slug, #syllabus, #tab7)
  useEffect(() => {
    const checkRoutes = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      // 0. FB Boost Campaign & Lead Promo Route (/promo/:slug, ?promo=:slug, #promo/:slug)
      const promoParam = params.get('promo') || params.get('campaign') || params.get('fb');
      if (promoParam) {
        setActiveCampaignSlug(promoParam);
        setActiveCourseSlug(null);
      } else if (path.startsWith('/promo/') || path.startsWith('/campaign/') || path.startsWith('/fb/')) {
        const slug = window.location.pathname.replace(/^\/(promo|campaign|fb)\//, '').split('/')[0];
        if (slug) {
          setActiveCampaignSlug(slug);
          setActiveCourseSlug(null);
        }
      } else if (
        hash.startsWith('#promo/') ||
        hash.startsWith('#/promo/') ||
        hash.startsWith('#campaign/') ||
        hash.startsWith('#/campaign/') ||
        hash.startsWith('#fb/') ||
        hash.startsWith('#/fb/')
      ) {
        const slug = window.location.hash.replace(/^#\/?(promo|campaign|fb)\//, '').split('?')[0];
        if (slug) {
          setActiveCampaignSlug(slug);
          setActiveCourseSlug(null);
        }
      } else {
        setActiveCampaignSlug(null);
      }

      // 1. Course Detail Route
      const courseParam = params.get('course');
      if (courseParam) {
        setActiveCourseSlug(courseParam);
      } else if (path.startsWith('/course/')) {
        const slug = window.location.pathname.replace(/^\/course\//, '').split('/')[0];
        if (slug) setActiveCourseSlug(slug);
      } else if (hash.startsWith('#course/') || hash.startsWith('#/course/')) {
        const slug = window.location.hash.replace(/^#\/?course\//, '').split('?')[0];
        if (slug) setActiveCourseSlug(slug);
      }

      // 2. Direct register jump with prefilled course
      if (params.get('registerCourse')) {
        setActiveCourseSlug(null);
        setActiveCampaignSlug(null);
        setTimeout(() => {
          const el = document.getElementById('register');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }

      // 3. Admin Route
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        hash.startsWith('#admin') ||
        hash.includes('tab7') ||
        hash.includes('tab-7') ||
        hash.includes('admin-videos') ||
        hash.includes('campaign') ||
        path === '/admin' ||
        path.startsWith('/admin')
      ) {
        if (hash.includes('campaign')) {
          setAdminInitialTab('campaigns');
        } else if (hash.includes('video') || hash.includes('masterclass') || hash.includes('tab7') || hash.includes('tab-7')) {
          setAdminInitialTab('videos');
        } else {
          setAdminInitialTab(undefined);
        }
        setAdminOpen(true);
      }

      // 4. Syllabus Route
      if (
        hash === '#syllabus' ||
        hash === '#/syllabus' ||
        hash.startsWith('#syllabus') ||
        hash.startsWith('#/syllabus')
      ) {
        setSyllabusOpen(true);
      }
    };

    checkRoutes();

    window.addEventListener('hashchange', checkRoutes);
    window.addEventListener('popstate', checkRoutes);

    // Secret Admin keyboard shortcut: Ctrl+Shift+A or Alt+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkRoutes);
      window.removeEventListener('popstate', checkRoutes);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (_) {}
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <LanguageProvider>
              {activeCampaignSlug ? (
                <FBCampaignLandingPage
                  campaignSlug={activeCampaignSlug}
                  onBackToMain={() => {
                    setActiveCampaignSlug(null);
                    try {
                      const cleanUrl =
                        window.location.pathname.startsWith('/promo/') ||
                        window.location.pathname.startsWith('/campaign/') ||
                        window.location.pathname.startsWith('/fb/')
                          ? '/'
                          : window.location.pathname;
                      window.history.pushState(null, '', cleanUrl);
                      window.location.hash = '';
                    } catch (_) {}
                  }}
                />
              ) : activeCourseSlug ? (
                <CourseDetailPage
                  courseSlug={activeCourseSlug}
                  onBack={() => {
                    setActiveCourseSlug(null);
                    try {
                      const cleanUrl = window.location.pathname.startsWith('/course/') ? '/' : window.location.pathname;
                      window.history.pushState(null, '', cleanUrl);
                    } catch (_) {}
                  }}
                  onOpenRegisterWithCourse={(slug) => {
                    setActiveCourseSlug(null);
                    try {
                      window.location.hash = 'register';
                    } catch (_) {}
                    setTimeout(() => {
                      const el = document.getElementById('register');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                />
              ) : (
                <MainAppContent
                  onOpenAdmin={() => setAdminOpen(true)}
                  onOpenStudentLogin={() => setStudentLoginOpen(true)}
                  onOpenStudentDashboard={() => setStudentDashboardOpen(true)}
                  onOpenMentor={() => setMentorOpen(true)}
                  onOpenSyllabus={handleOpenSyllabus}
                  onOpenCoursePage={(slug) => {
                    setActiveCourseSlug(slug);
                    try {
                      window.location.hash = `course/${slug}`;
                    } catch (_) {}
                  }}
                />
              )}

              <React.Suspense
                fallback={
                  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
                    <div className="w-10 h-10 border-2 border-[#dfb56c] border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-xs font-mono text-[#f7e2a9] uppercase tracking-widest">
                      Loading Studio Portal...
                    </span>
                  </div>
                }
              >
                {/* AI Fashion Mentor Modal */}
                <FashionMentorModal
                  isOpen={mentorOpen}
                  onClose={() => setMentorOpen(false)}
                />

                {/* Course Syllabus & Comprehensive Curriculum Modal Form */}
                <CourseSyllabusModal
                  isOpen={syllabusOpen}
                  onClose={() => setSyllabusOpen(false)}
                  initialCourseId={syllabusCourseId}
                  onOpenRegister={() => {
                    setSyllabusOpen(false);
                    const el = document.getElementById('register');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Admin Management Suite */}
                <AdminModal isOpen={adminOpen} onClose={handleCloseAdmin} initialTab={adminInitialTab} />

                {/* Student LMS Dashboard & Payment Portal */}
                <StudentDashboardModal
                  isOpen={studentDashboardOpen}
                  onClose={() => setStudentDashboardOpen(false)}
                />
              </React.Suspense>

              {/* Student Login Modal */}
              <StudentLoginModal
                isOpen={studentLoginOpen}
                onClose={() => setStudentLoginOpen(false)}
                onOpenDashboard={() => setStudentDashboardOpen(true)}
                onOpenRegister={() => {
                  const el = document.getElementById('register');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </LanguageProvider>
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
