import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-[#0c090a] via-[#241317] to-[#0c090a] relative overflow-hidden border-t border-[#c99a45]/30">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,154,69,0.12)_0,transparent_70%)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141011] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-semibold mb-6 shadow-lg shadow-[#540d18]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
          <span>CEYLON STYLE STUDIO • INTAKE 2026</span>
        </div>

        {/* Powerful Sinhala Quotes */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] font-sinhala leading-tight max-w-2xl mx-auto mb-3 luxury-heading-anim text-balance">
          "ඔබේ හීනය තවත් හීනයක් විතරක් කරගෙන ඉන්න එපා."
        </h2>

        <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-editorial text-[#f7e2a9] font-sinhala leading-tight mb-6 luxury-heading-anim text-balance">
          "ඔබේ හැකියාවෙන් ඔබේ අනාගතය නිර්මාණය කරන්න."
        </h3>

        <div className="my-6">
          <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase gold-gradient-text">
            DESIGN YOUR SKILL. BUILD YOUR BRAND. CREATE YOUR FUTURE.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            className="btn-3d-gold w-full sm:w-auto px-9 py-4 text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <span>REGISTER NOW • ලියාපදිංචි වන්න</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#videos"
            className="btn-3d-secondary w-full sm:w-auto px-8 py-4 text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-[#dfb56c]" />
            <span>WATCH COURSE VIDEOS</span>
          </a>
        </div>
      </div>
    </section>
  );
};
