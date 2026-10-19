import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Video,
  Lock,
  Phone,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';

interface InteractiveFloatingDockProps {
  onOpenStudentLogin: () => void;
  onOpenStudentDashboard: () => void;
  onOpenSyllabus: () => void;
}

export const InteractiveFloatingDock: React.FC<InteractiveFloatingDockProps> = ({
  onOpenStudentLogin,
  onOpenStudentDashboard,
  onOpenSyllabus,
}) => {
  const { studentUser } = useAuth();
  const { isSinhalaMode } = useLanguage();
  const { siteSettings, zoomClasses } = useData();

  // Scroll visibility & Minimized state
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Check if any live zoom class is currently in progress
  const hasLiveClass = zoomClasses.some((z) => z.status === 'LIVE');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show when scrolled down past 220px
      if (currentScrollY > 220) {
        setIsVisible(true);
        setHasScrolled(true);
      } else {
        setIsVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 pointer-events-none flex justify-center px-3 sm:px-6">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 90, opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: 90, opacity: 0, scale: 0.9, rotateX: 20 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30,
            }}
            className="pointer-events-auto"
          >
            {isMinimized ? (
              /* Minimized Floating Jewel Pill (Hidden/minimized state) */
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsMinimized(false)}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#1c1214]/95 via-[#2b0811]/95 to-[#140e10]/95 backdrop-blur-md border border-[#dfb56c]/70 text-[#f7e2a9] text-xs font-mono font-bold shadow-2xl shadow-black/80 flex items-center gap-2 group transition-all"
                title="Expand quick actions"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#dfb56c] animate-pulse" />
                <span className="tracking-wider uppercase text-[11px]">
                  {isSinhalaMode ? 'ක්ෂණික ප්‍රවේශය' : 'Quick Actions'}
                </span>
                <ChevronUp className="w-4 h-4 text-[#dfb56c] group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            ) : (
              /* Full Interactive Sliding Luxury Dock with 3D Tactile Buttons */
              <motion.div
                layout
                className="relative bg-gradient-to-r from-[#140f11]/95 via-[#230910]/95 to-[#120e10]/95 backdrop-blur-xl border border-[#c99a45]/50 rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl shadow-black/90 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full"
                style={{
                  perspective: 1000,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 1. Register / Enroll CTA Button */}
                <motion.a
                  href="#register"
                  onClick={handleEnrollClick}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>{isSinhalaMode ? 'ලියාපදිංචි වන්න' : 'Enroll Now'}</span>
                </motion.a>

                {/* 2. Student LMS Portal Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (studentUser) onOpenStudentDashboard();
                    else onOpenStudentLogin();
                  }}
                  className="px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-full bg-[#540d18] hover:bg-[#6e1322] border border-[#dfb56c]/70 text-[#f7e2a9] text-[11px] sm:text-xs font-bold tracking-wide flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>
                    {studentUser
                      ? `LMS (${studentUser.regNumber})`
                      : isSinhalaMode
                      ? 'ශිෂ්‍ය පිවිසුම'
                      : 'Student LMS'}
                  </span>
                  {studentUser && (
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-0.5" />
                  )}
                </motion.button>

                {/* 3. Live Zoom Attendance Quick Trigger */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (studentUser) onOpenStudentDashboard();
                    else onOpenStudentLogin();
                  }}
                  className="px-2.5 sm:px-3 py-2 rounded-xl sm:rounded-full bg-black/60 hover:bg-[#38070e] border border-white/15 text-[#f7f3eb] text-[11px] sm:text-xs font-medium flex items-center gap-1.5 shrink-0"
                  title="Live Zoom Classes"
                >
                  <Video className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span className="hidden sm:inline">
                    {isSinhalaMode ? 'සජීවී Zoom' : 'Live Zoom'}
                  </span>
                  {hasLiveClass && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-600 text-white font-bold animate-pulse">
                      LIVE
                    </span>
                  )}
                </motion.button>

                {/* 4. Course Curriculum / Syllabus */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenSyllabus}
                  className="hidden md:flex px-2.5 sm:px-3 py-2 rounded-xl sm:rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-[#d5cfc4] hover:text-[#f7e2a9] text-[11px] font-medium items-center gap-1.5 shrink-0"
                  title="View Course Syllabus"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Syllabus</span>
                </motion.button>

                {/* 5. Direct WhatsApp Atelier Inquiry */}
                <motion.a
                  href={`https://wa.me/${siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Hello Ceylon Style Studio, I would like to inquire about the Fashion & Branding Diploma course.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2.5 sm:px-3 py-2 rounded-xl sm:rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-green-300 text-[11px] font-bold flex items-center gap-1.5 shrink-0"
                  title="Chat on WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5 text-green-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </motion.a>

                {/* Minimize Toggle Icon */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#a89f91] hover:text-white transition-colors ml-0.5"
                  title="Minimize bar"
                  aria-label="Minimize bar"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
