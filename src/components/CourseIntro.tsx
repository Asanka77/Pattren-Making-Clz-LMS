import React from 'react';
import { CheckCircle2, Sparkles, Layers, ArrowRight, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CourseIntroProps {
  onOpenSyllabus?: () => void;
}

export const CourseIntro: React.FC<CourseIntroProps> = ({ onOpenSyllabus }) => {
  const { siteSettings } = useData();

  const targetProfiles = [
    'Fashion වලට සහ නව විලාසිතා නිර්මාණයට දැඩිව ආදරය කරන ඔබ',
    'Creative Designs අඳින්න, කපන්න සහ මවන්න කැමති ඔබ',
    'Fashion Industry එකේ ඉහළ වැටුපක් ලබන Career එකක් ගොඩනගන්න කැමති ඔබ',
    'තමන්ගේම නමින් Luxury Clothing Brand එකක් ආරම්භ කිරීමේ සිහිනය ඇති ඔබ',
    'දැනට කරගෙන යන Garment / Clothing Business එක නවීන තාක්ෂණයෙන් ඉදිරියට ගෙන යාමට අවශ්‍ය ඔබ',
    'Fashion Design & Pattern Making හරහා ඉහළ අමතර ආදායමක් (High-Ticket Income) උපයාගැනීමට අපේක්ෂා කරන ඔබ',
  ];

  const valuePillars = [
    { title: 'Pattern', desc: 'Flat drafting, dart pivot, couture precision' },
    { title: 'Style', desc: 'Couture draping & contemporary trends' },
    { title: 'Garment', desc: 'Master tailoring, finishes & sample sewing' },
    { title: 'Brand', desc: 'Brand DNA, packaging & luxury identity' },
    { title: 'Market', desc: 'AI marketing, social ads & global export' },
  ];

  return (
    <section id="overview" className="py-24 bg-[#0e0a0b] relative overflow-hidden border-t border-b border-[#c99a45]/15">
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#540d18]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#c99a45]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3">
            {siteSettings.introBadge || 'Course Introduction & Philosophy'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            {siteSettings.introTitle || 'මේ Course එක ඔබ වෙනුවෙන්ද?'}
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-5" />
        </div>

        {/* Highlight Callout Banner */}
        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-sm bg-gradient-to-br from-[#1a1214] via-[#241317] to-[#141011] border border-[#c99a45]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c99a45]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-[#540d18] border border-[#c99a45]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#dfb56c]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold font-editorial text-[#f7e2a9] mb-2 luxury-heading-anim">
                {siteSettings.introHighlightTitle ? `"${siteSettings.introHighlightTitle}"` : '"මේක Pattern Making Course එකක් විතරක් නෙමෙයි."'}
              </h3>
              <p className="text-sm text-[#d5cfc4] leading-relaxed">
                {siteSettings.introHighlightDesc || 'සාම්ප්‍රදායිකව ඇඳුම් කපන ආකාරය පමණක් කියාදෙන පන්තියක් වෙනුවට, අදහසක (Idea) සිට ලෝක වෙළඳපොළ (Global Market) දක්වා ඔබේම Fashion Brand එකක් ගොඩනගන සම්පූර්ණ Business Transformation එකක්!'}
              </p>
            </div>
          </div>

          {/* Sequential Journey Pipeline */}
          <div className="mt-8 pt-6 border-t border-[#c99a45]/20 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {valuePillars.map((p, idx) => (
              <div key={p.title} className="p-3 bg-black/40 border border-[#c99a45]/15 rounded text-center group hover:border-[#dfb56c]/50 transition-colors">
                <span className="text-[10px] text-[#c99a45] font-mono block">STEP 0{idx + 1}</span>
                <span className="text-sm font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] block mt-0.5">{p.title}</span>
                <span className="text-[10px] text-[#a89f91] block mt-1 leading-tight">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Target Audience Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {targetProfiles.map((text, idx) => (
            <div
              key={idx}
              className="p-6 rounded-sm bg-[#141011]/90 border border-white/5 hover:border-[#c99a45]/40 hover:bg-[#1a1416] transition-all group duration-300 flex items-start gap-4"
            >
              <div className="w-7 h-7 rounded-full bg-[#540d18]/60 border border-[#c99a45]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#540d18] transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#dfb56c]" />
              </div>
              <p className="text-sm sm:text-base text-[#eae3d2] leading-relaxed font-sinhala">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {onOpenSyllabus && (
            <button
              type="button"
              onClick={onOpenSyllabus}
              className="btn-3d-secondary px-6 py-3 text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 border border-[#dfb56c]/70 text-[#f7e2a9] hover:bg-[#540d18] transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#dfb56c]" />
              <span>පාඨමාලා විෂය නිර්දේශය (Course Syllabus)</span>
            </button>
          )}

          <a
            href="#register"
            className="btn-3d-gold px-6 py-3 text-xs uppercase tracking-wider font-bold rounded text-black flex items-center gap-2"
          >
            <span>ඔබේ සුදුසුකම් සනාථ කර ලියාපදිංචි වන්න</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </a>
        </div>
      </div>
    </section>
  );
};
