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
          <VideoGallery />
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
  );
}
