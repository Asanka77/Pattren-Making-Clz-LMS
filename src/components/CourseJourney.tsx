import React, { useRef, useState } from 'react';
import { COURSE_JOURNEY_STEPS } from '../lib/defaults';
import { ChevronRight, ChevronLeft, ArrowRight, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CourseJourneyProps {
  onOpenSyllabus?: () => void;
}

export const CourseJourney: React.FC<CourseJourneyProps> = ({ onOpenSyllabus }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isSinhalaMode } = useLanguage();
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepNumber: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="journey" className="py-20 sm:py-24 bg-[#0a0708] relative overflow-hidden border-t border-[#c99a45]/20">
      {/* Background Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#540d18]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#c99a45]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-2 font-mono">
              {isSinhalaMode ? 'පියවර 12ක ප්‍රායෝගික ගමන් මග' : 'The 12-Step Progression Timeline'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
              {isSinhalaMode ? 'පාඨමාලා ගමන් මග' : 'COURSE JOURNEY'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#b8afa2] font-sinhala max-w-xl">
              {isSinhalaMode
                ? 'මුල්ම ශරීර මිණුම් ලබාගැනීමේ සිට ලෝක වෙළඳපොළට අපනයනය කිරීම දක්වා පියවරෙන් පියවර ගමන් කරන අපගේ ක්‍රමානුකූල මගපෙන්වීම.'
                : 'From the very first measurement milestone to global export execution. Your structured step-by-step ascent in haute fashion.'}
            </p>
          </div>

          {/* Timeline Nav Controls with 3D buttons & Syllabus Trigger */}
          <div className="mt-5 md:mt-0 flex flex-wrap items-center gap-2.5">
            {onOpenSyllabus && (
              <button
                type="button"
                onClick={onOpenSyllabus}
                className="btn-3d-secondary px-3.5 py-2 rounded-sm text-xs flex items-center gap-1.5 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] transition-all cursor-pointer shadow-md"
                title={isSinhalaMode ? 'පාඨමාලා විෂය නිර්දේශය බලන්න' : 'View Course Syllabus'}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span className="font-sinhala font-bold">
                  {isSinhalaMode ? 'විෂය නිර්දේශය (Syllabus)' : 'Course Syllabus'}
                </span>
              </button>
            )}

            <button
              onClick={scrollLeft}
              className="btn-3d-secondary p-2.5 rounded-sm"
              aria-label="Previous Steps"
            >
              <ChevronLeft className="w-4 h-4 text-[#dfb56c]" />
            </button>
            <button
              onClick={scrollRight}
              className="btn-3d-secondary p-2.5 rounded-sm"
              aria-label="Next Steps"
            >
              <ChevronRight className="w-4 h-4 text-[#dfb56c]" />
            </button>
          </div>
        </div>

        {/* Horizontal Timeline Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {COURSE_JOURNEY_STEPS.map((step, idx) => {
            const isExpanded = !!expandedSteps[step.step];
            return (
              <div
                key={step.step}
                className="min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 snap-start relative group"
              >
                {/* Connecting Top Line */}
                <div className="flex items-center mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c1214] border-2 border-[#c99a45] group-hover:border-[#dfb56c] group-hover:bg-[#540d18] flex items-center justify-center font-editorial font-bold text-xs sm:text-sm text-[#f7e2a9] shrink-0 transition-colors shadow-lg shadow-[#c99a45]/20">
                    {step.step}
                  </div>
                  {idx < COURSE_JOURNEY_STEPS.length - 1 ? (
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-[#c99a45] to-white/10 mx-2" />
                  ) : (
                    <div className="flex-1 h-[2px] bg-[#dfb56c] mx-2" />
                  )}
                </div>

                {/* Card Body with Editorial Image */}
                <div className="rounded-sm bg-[#141011] border border-white/10 group-hover:border-[#c99a45]/60 group-hover:bg-[#1a1315] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl">
                  {/* Step Image */}
                  {Boolean(step.imageUrl && step.imageUrl.trim()) && (
                    <div className="relative h-32 w-full overflow-hidden bg-black/40">
                      <img
                        src={step.imageUrl.trim()}
                        alt={step.title}
                        className="w-full h-full object-cover filter brightness-85 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141011] via-transparent to-black/30" />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/80 text-[#dfb56c] border border-white/10">
                        STEP {step.step}/12
                      </span>
                    </div>
                  )}

                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-mono tracking-widest text-[#dfb56c] block mb-1">
                      PHASE 0{idx + 1} • {step.title}
                    </span>

                    <h3 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] tracking-wider mb-2 leading-snug luxury-heading-anim">
                      {isSinhalaMode ? (step.titleSinhala || step.title) : step.title}
                    </h3>

                    {/* Description with Mobile Truncation and Downward Expand */}
                    <p
                      className={`text-xs text-[#b8afa2] leading-relaxed font-sinhala transition-all duration-200 ${
                        isExpanded ? 'block' : 'line-clamp-2 sm:line-clamp-none'
                      }`}
                    >
                      {isSinhalaMode ? (step.descSinhala || step.desc) : step.desc}
                    </p>

                    {/* Mobile toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleStep(step.step)}
                      className="sm:hidden mt-2 text-[10px] font-mono text-[#dfb56c] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>අඩු කරන්න</span>
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>විස්තර පහළට බලන්න ↓</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#a89f91]">
                      <span className="font-mono text-[#dfb56c]">Milestone #{idx + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#c99a45] group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
