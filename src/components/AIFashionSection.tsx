import React, { useState } from 'react';
import { Cpu, Wand2, Sparkles, Eye, ArrowRight, Layers, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AIFashionSectionProps {
  onOpenMentor?: () => void;
}

export const AIFashionSection: React.FC<AIFashionSectionProps> = ({ onOpenMentor }) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'ai-render'>('side-by-side');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const { isSinhalaMode } = useLanguage();

  const aiCapabilities = [
    {
      title: 'Style Development',
      titleSinhala: 'විලාසිතා සංවර්ධනය (Style Development)',
      desc: 'Transform rough pencil sketches into textured fabric silhouettes in seconds.',
      descSinhala: 'රළු පැන්සල් සටහනක් (Sketch) තත්පර කිහිපයකින් සැබෑ රෙදි මතුපිට හැඩතල සහිත මෝස්තරයක් බවට පත්කිරීම.',
    },
    {
      title: 'Fashion Concept Generation',
      titleSinhala: 'විලාසිතා සංකල්ප උත්පාදනය (Concept Generation)',
      desc: 'Explore endless avant-garde silhouettes, seasonal palettes, and textile drape.',
      descSinhala: 'නිමක් නැති නවීන විලාසිතා හැඩතල, නව වර්ණ සංයෝජන සහ රෙදි විලාසිතා ක්ෂණිකව ගවේෂණය කිරීම.',
    },
    {
      title: 'Design Exploration',
      titleSinhala: 'ඩිසයින් අත්හදා බැලීම (Design Exploration)',
      desc: 'Rapidly iterate necklines, sleeve variations, and pleating before touching fabric.',
      descSinhala: 'රෙදි කැපීමට පෙර විවිධ කරවල්, අත් මෝස්තර සහ ප්ලීට්ස් වර්ග පරිගණකයෙන් පරික්ෂා කිරීම.',
    },
    {
      title: 'AI Image & Lookbook Generation',
      titleSinhala: 'AI ඡායාරූප සහ Lookbook සැකසීම (Lookbook Generation)',
      desc: 'Create hyper-realistic runway & editorial model photo shoots without hiring models or studios.',
      descSinhala: 'මිල අධික මොඩලයන් හෝ චිත්‍රාගාර කුලියට නොගෙනම ලෝක මට්ටමේ Haute Couture Lookbooks නිපදවීම.',
    },
    {
      title: 'AI Video Creation',
      titleSinhala: 'AI Fashion වීඩියෝ නිර්මාණය (AI Video Creation)',
      desc: 'Generate cinematic motion reels and digital fashion runway catwalk clips for TikTok & Reels.',
      descSinhala: 'TikTok සහ Reels සඳහා සජීවී Catwalk සහ Runway ඇවිදීමේ වීඩියෝ තත්පර ගණනින් නිර්මාණය.',
    },
    {
      title: 'Content & Marketing Copy',
      titleSinhala: 'අලෙවිකරණ අන්තර්ගතය හා දැන්වීම් (Marketing Content)',
      desc: 'Generate high-converting brand stories, captions, and ad scripts powered by LLMs.',
      descSinhala: 'පාරිභෝගිකයින් ආකර්ෂණය කරගන්නා සන්නාම කතාන්දර, කැප්ෂන් සහ දැන්වීම් පිටපත් සැකසීම.',
    },
    {
      title: 'Fashion Brand Development',
      titleSinhala: 'සන්නාම අනන්‍යතාවය නිර්මාණය (Brand Development)',
      desc: 'Design brand packaging, logo moodboards, and digital store showcases effortlessly.',
      descSinhala: 'සුඛෝපභෝගී Packaging, ලෝගෝ මෝස්තර සහ ඩිජිටල් Storefronts පහසුවෙන්ම නිර්මාණය.',
    },
  ];

  return (
    <section id="ai-fashion" className="py-24 bg-gradient-to-b from-[#0a0708] via-[#120a0d] to-[#0a0708] relative overflow-hidden border-t border-[#c99a45]/20">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c99a45]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#540d18]/50 border border-[#dfb56c]/40 text-[#f7e2a9] text-xs font-semibold mb-4 font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>Futuristic Generative AI Fashion</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            AI සමඟ Fashion Design එකේ අලුත් යුගයකට
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#b8afa2] font-sinhala max-w-2xl mx-auto">
            {isSinhalaMode
              ? 'සාම්ප්‍රදායික Fashion Designer කෙනෙකුට වඩා 10 ගුණයක් වේගයෙන් නවීන AI මෙවලම් (Midjourney, Prompt Engineering, Neural Rendering) භාවිතා කර ඔබේ නිර්මාණ දෘශ්‍යමාන කරගන්නා ආකාරය ඉගෙනගන්න.'
              : 'Learn how modern AI models empower fashion creators to visualize seasonal collections 10x faster before cutting a single yard of fabric.'}
          </p>
        </div>

        {/* Split Interactive Layout: Sketch vs AI Transformation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Interactive Split Transformation Showcase (7 Cols) */}
          <div className="lg:col-span-7 bg-[#141011] p-4 sm:p-6 rounded-sm border border-[#c99a45]/30 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="text-xs uppercase font-mono tracking-wider text-[#dfb56c] flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" /> Interactive Concept Engine
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#a89f91]">{isSinhalaMode ? 'ස්ලයිඩරය අදින්න:' : 'Drag slider:'}</span>
                <span className="text-[#f7e2a9] font-mono font-bold">{sliderPos}% AI</span>
              </div>
            </div>

            {/* Comparison Visualizer with Slider */}
            <div className="relative h-[380px] sm:h-[460px] rounded overflow-hidden select-none border border-white/10">
              {/* Left Image: Traditional Sketch & Pattern */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
                  alt="Original Pattern Sketch"
                  className="w-full h-full object-cover filter contrast-125 grayscale"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 rounded border border-white/20 text-[11px] font-mono uppercase text-[#e0dad0]">
                  {isSinhalaMode ? 'මූලික පැටර්න් ඇඳීම (Pattern Blueprint)' : 'Original Pattern & Drafting'}
                </div>
              </div>

              {/* Right Image: AI Generated Haute Couture Render (Clipped by slider) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
                  alt="AI Generated Haute Couture Lookbook"
                  className="w-full h-full object-cover filter brightness-105 contrast-110"
                />
                <div className="absolute bottom-4 right-4 bg-[#540d18]/90 px-3 py-1.5 rounded border border-[#dfb56c] text-[11px] font-mono uppercase text-[#f7e2a9] shadow-lg">
                  ✨ {isSinhalaMode ? 'AI ත්‍රිමාණ Lookbook (AI Render)' : 'AI Photorealistic Lookbook'}
                </div>
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#dfb56c] via-white to-[#c99a45] shadow-[0_0_15px_rgba(201,154,69,0.8)] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1c1214] border-2 border-[#dfb56c] flex items-center justify-center shadow-lg text-[10px] text-[#f7e2a9] font-bold">
                  ↔
                </div>
              </div>

              {/* Native range slider input overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                aria-label="Slide to compare Pattern Sketch vs AI Render"
              />
            </div>

            <p className="mt-3 text-[11px] text-[#a89f91] text-center italic font-sinhala">
              {isSinhalaMode
                ? 'ස්ලයිඩරය වමට හෝ දකුණට අදින්න: පැටර්න් සටහනක් AI තාක්ෂණයෙන් ජාත්‍යන්තර Lookbook එකක් බවට පරිවර්තනය වන ආකාරය නරඹන්න.'
                : 'Slide left or right: See how an atelier blueprint evolves into a photorealistic luxury campaign asset using AI.'}
            </p>
          </div>

          {/* AI Feature Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold font-editorial text-[#f7e2a9] mb-4 luxury-heading-anim">
              {isSinhalaMode ? 'AI මොඩියුල හරහා ඔබ ඉගෙන ගන්නා දෑ:' : 'What You Will Learn In AI Modules:'}
            </h3>

            {aiCapabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-4 rounded-sm bg-[#141011] border border-white/5 hover:border-[#c99a45]/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb56c] group-hover:scale-150 transition-transform" />
                  <h4 className="text-sm font-bold text-[#f7f3eb] group-hover:text-[#dfb56c] transition-colors font-sinhala">
                    {isSinhalaMode ? cap.titleSinhala : cap.title}
                  </h4>
                </div>
                <p className="text-xs text-[#b8afa2] pl-4 leading-relaxed font-sinhala">
                  {isSinhalaMode ? cap.descSinhala : cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Philosophy Callout */}
        <div className="p-6 rounded-sm bg-[#1c1316] border border-[#c99a45]/30 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-left">
            <p className="text-sm font-semibold text-[#f7f3eb] font-sinhala">
              "AI මඟින් Designer කෙනෙකු ප්‍රතිස්ථාපනය නොකරයි; නමුත් AI භාවිතා කරන Designer කෙනෙක්, සාමාන්‍ය Designer කෙනෙකුව අභිබවා යයි."
            </p>
            <span className="text-[11px] text-[#c99a45] font-mono uppercase tracking-wider block mt-1">
              CEYLON STYLE STUDIO PHILOSOPHY
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenMentor && (
              <button
                onClick={onOpenMentor}
                className="btn-3d-burgundy px-4 py-2.5 text-[#f7e2a9] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>{isSinhalaMode ? 'AI සහායකයා අත්හදා බලන්න' : 'Try AI Assistant'}</span>
              </button>
            )}
            <a
              href="#register"
              className="btn-3d-gold px-5 py-2.5 text-black text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              <span>{isSinhalaMode ? 'AI Fashion ඉගෙනගන්න' : 'Learn AI Fashion'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
