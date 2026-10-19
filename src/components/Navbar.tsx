import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Shield, Languages, Sun, Moon, BookOpen, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenStudentLogin: () => void;
  onOpenStudentDashboard: () => void;
  onOpenMentor?: () => void;
  onOpenSyllabus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenStudentLogin,
  onOpenStudentDashboard,
  onOpenMentor,
  onOpenSyllabus,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, studentUser } = useAuth();
  const { siteSettings } = useData();
  const { isSinhalaMode, toggleLanguage } = useLanguage();
  const { isLightMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: isSinhalaMode ? 'වීඩියෝ' : 'Videos', href: '#videos' },
    { label: isSinhalaMode ? 'හැඳින්වීම' : 'Overview', href: '#overview' },
    { label: isSinhalaMode ? 'සුවිශේෂතා' : 'Why CSS', href: '#why-course' },
    { label: isSinhalaMode ? 'ගමන් මග' : 'Curriculum', href: '#journey' },
    { label: isSinhalaMode ? 'මැහුම් Tutorials' : 'Sewing Tutorials', href: '#sewing-tutorials' },
    { label: isSinhalaMode ? 'AI තාක්ෂණය' : 'AI Fashion', href: '#ai-fashion' },
    { label: isSinhalaMode ? 'අලෙවිකරණය' : 'Marketing', href: '#marketing' },
    { label: isSinhalaMode ? '✨ විලාසිතා එකතුව' : '✨ Style Collection', href: '#collections' },
    { label: isSinhalaMode ? 'සන්නාමකරණය' : 'Branding', href: '#branding' },
    { label: isSinhalaMode ? 'ඩිප්ලෝමාව' : 'Diploma', href: '#certificate' },
    { label: isSinhalaMode ? 'ගාස්තු' : 'Fees', href: '#pricing' },
    { label: isSinhalaMode ? 'ශාඛා' : 'Locations', href: '#locations' },
    { label: isSinhalaMode ? 'ප්‍රශ්න' : 'FAQs', href: '#faqs' },
  ];

  const brandDisplayName = siteSettings.brandName || 'CEYLON STYLE STUDIO';

  return (
    <>
      {/* Top Announcement Bar */}
      {siteSettings.announcement && (
        <div className="bg-gradient-to-r from-[#38070e] via-[#540d18] to-[#38070e] text-[#f7e2a9] text-[11px] py-1.5 px-4 text-center font-medium tracking-wider border-b border-[#c99a45]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse shrink-0" />
            <span className="font-sinhala line-clamp-1">{siteSettings.announcement}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar - Slim & Compact Luxury Header */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c090a]/95 backdrop-blur-md border-b border-[#c99a45]/25 shadow-xl py-2'
            : 'bg-gradient-to-b from-[#0c090a]/95 via-[#0c090a]/85 to-transparent py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo (from Backend if set, or Custom Monogram) */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            {siteSettings.logoUrl && siteSettings.logoUrl.trim() ? (
              <img
                src={siteSettings.logoUrl.trim()}
                alt={brandDisplayName}
                className="h-8 sm:h-9 max-w-[130px] object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1px] shadow-md shadow-[#c99a45]/15 group-hover:shadow-[#c99a45]/30 transition-all shrink-0">
                <div className="w-full h-full bg-[#141011] rounded-sm flex items-center justify-center">
                  <span className="font-editorial text-sm sm:text-base font-bold tracking-tighter text-[#f7e2a9]">
                    CSS
                  </span>
                </div>
              </div>
            )}
            <div className="leading-tight">
              <span className="font-editorial text-xs sm:text-sm font-bold tracking-widest text-[#f7f3eb] group-hover:text-[#dfb56c] transition-colors block">
                {brandDisplayName}
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#c99a45] block font-medium">
                Fashion &amp; Branding Academy
              </span>
            </div>
          </a>

          {/* Desktop Nav Links - Compact Height & Clean Typography */}
          <div className="hidden xl:flex items-center space-x-4 text-[11px] uppercase tracking-wider text-[#d5cfc4]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#f7e2a9] transition-colors font-medium py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c99a45] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Controls: Theme Switch, Sinhala Mode, Student Portal, 3D CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* THEME TOGGLE (LIGHT / DARK) */}
            <button
              onClick={toggleTheme}
              className="btn-3d-secondary px-2 sm:px-2.5 py-1 text-xs rounded flex items-center gap-1"
              title={isLightMode ? 'Switch to Dark Mode (අඳුරු තේමාව)' : 'Switch to Light Mode (ආලෝක තේමාව)'}
              aria-label="Toggle Light and Dark Theme"
            >
              {isLightMode ? (
                <Moon className="w-3.5 h-3.5 text-[#dfb56c]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#f7e2a9]" />
              )}
              <span className="text-[10px] hidden sm:inline uppercase font-mono font-bold text-[#f7e2a9]">
                {isLightMode ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* SINHALA MODE TOGGLE SWITCH BUTTON */}
            <button
              onClick={toggleLanguage}
              className={`btn-3d-secondary px-2 sm:px-2.5 py-1 text-xs rounded flex items-center gap-1 transition-all ${
                isSinhalaMode ? 'border-[#dfb56c] text-[#f7e2a9]' : 'text-[#d5cfc4]'
              }`}
              title="සිංහල මාදිලිය මාරු කරන්න (Toggle Sinhala Mode)"
            >
              <Languages className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span className="font-sinhala font-bold text-[11px]">
                {isSinhalaMode ? '🇱🇰 සිංහල' : 'English'}
              </span>
            </button>

            {/* Student LMS Membership Portal Button */}
            {studentUser ? (
              <button
                onClick={onOpenStudentDashboard}
                className="btn-3d-burgundy text-xs px-2 sm:px-2.5 py-1 rounded flex items-center gap-1"
                title="Open Student Membership Portal"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold text-[10.5px] sm:text-[11px]">Portal ({studentUser.regNumber})</span>
              </button>
            ) : (
              <button
                onClick={onOpenStudentLogin}
                className="btn-3d-secondary text-xs px-2 sm:px-2.5 py-1 rounded font-medium text-[10.5px] sm:text-[11px] flex items-center gap-1"
                title="Student Membership Portal Login"
              >
                <Lock className="w-3 h-3 text-[#dfb56c]" />
                <span>{isSinhalaMode ? 'සාමාජික පිවිසුම' : 'Portal Login'}</span>
              </button>
            )}

            {/* Admin Console Access - Strictly hidden from public visitors, accessible via /#admin */}
            {isAdmin && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="btn-3d-secondary text-xs px-2 py-1 rounded flex items-center gap-1 border-[#dfb56c] text-[#f7e2a9]"
                title="Admin Console (/#admin)"
              >
                <Shield className="w-3 h-3 text-[#dfb56c]" />
                <span className="hidden lg:inline text-[10px] font-mono font-bold">
                  {isSinhalaMode ? 'පරිපාලක' : 'Admin'}
                </span>
              </button>
            )}

            {/* AI Fashion & Spec Sheet Assistant Button */}
            {onOpenMentor && (
              <button
                onClick={onOpenMentor}
                className="btn-3d-burgundy text-xs px-2 sm:px-2.5 py-1 rounded flex items-center gap-1.5 border border-[#dfb56c]/70 text-[#f7e2a9] hover:scale-105 active:scale-95 transition-all shadow-md group"
                title="Open AI Fashion & Spec Sheet Assistant (OAuth Plugin)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline font-mono font-bold text-[10px] tracking-wide uppercase">AI Assistant</span>
                <span className="sm:hidden font-mono font-bold text-[10px]">AI</span>
              </button>
            )}

            {/* Course Syllabus Modal Trigger */}
            {onOpenSyllabus && (
              <button
                onClick={onOpenSyllabus}
                className="btn-3d-secondary px-2.5 sm:px-3 py-1 text-xs rounded flex items-center gap-1.5 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] transition-all cursor-pointer shadow-md"
                title={isSinhalaMode ? 'පාඨමාලා විෂය නිර්දේශය බලන්න (Course Syllabus)' : 'View Course Syllabus'}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span className="font-sinhala font-bold text-[11px] hidden lg:inline">
                  {isSinhalaMode ? 'විෂය නිර්දේශය' : 'Syllabus'}
                </span>
              </button>
            )}

            {/* Register CTA with 3D Look */}
            <a
              href="#register"
              className="btn-3d-gold px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-wider rounded text-black"
            >
              <span>{isSinhalaMode ? 'ලියාපදිංචිය' : 'Enroll'}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-[#d5cfc4] hover:text-[#f7e2a9] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#141011] border-b border-[#c99a45]/20 px-5 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Language and Theme Toggles */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <button
                onClick={toggleTheme}
                className="btn-3d-secondary px-3 py-1 text-xs rounded flex items-center gap-1.5"
              >
                {isLightMode ? (
                  <Moon className="w-3.5 h-3.5 text-[#dfb56c]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[#f7e2a9]" />
                )}
                <span>{isLightMode ? 'Dark Theme (අඳුරු)' : 'Light Theme (ආලෝක)'}</span>
              </button>

              <button
                onClick={toggleLanguage}
                className="btn-3d-burgundy px-3 py-1 rounded text-xs font-sinhala font-bold"
              >
                {isSinhalaMode ? '🇱🇰 සිංහල මාදිලිය' : 'English Mode'}
              </button>
            </div>

            {/* Nav links */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded hover:bg-[#540d18]/40 text-[#d5cfc4] hover:text-[#dfb56c] font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Student Login & AI Assistant */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {onOpenMentor && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMentor();
                  }}
                  className="btn-3d-burgundy w-full py-2 text-xs font-bold flex items-center justify-center gap-2 border border-[#dfb56c]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>AI Fashion &amp; Spec Sheet Assistant</span>
                </button>
              )}

              {onOpenSyllabus && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSyllabus();
                  }}
                  className="btn-3d-secondary w-full py-2 text-xs font-bold flex items-center justify-center gap-2 border border-[#dfb56c]/70 text-[#f7e2a9]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>{isSinhalaMode ? '📑 පාඨමාලා විෂය නිර්දේශය (Course Syllabus)' : 'Course Syllabus & Curriculum'}</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (studentUser) onOpenStudentDashboard();
                    else onOpenStudentLogin();
                  }}
                  className="btn-3d-secondary flex-1 py-1.5 text-xs font-semibold"
                >
                  {studentUser
                    ? `LMS Dashboard (${studentUser.regNumber})`
                    : isSinhalaMode
                    ? 'ශිෂ්‍ය පිවිසුම (Student Login)'
                    : 'Student Login'}
                </button>

                <a
                  href="#register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-3d-gold flex-1 py-1.5 text-xs text-center font-bold uppercase tracking-wider"
                >
                  {isSinhalaMode ? 'දැන්ම ලියාපදිංචි වන්න' : 'Register Now'}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
