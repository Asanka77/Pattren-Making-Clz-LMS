import React from 'react';
import { Crown, Sparkles, Box, Tag, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BrandBuildingSection: React.FC = () => {
  const { isSinhalaMode } = useLanguage();

  const brandPillars = [
    {
      title: 'Brand Identity & DNA',
      titleSinhala: 'සන්නාම අනන්‍යතාවය (Brand Identity & DNA)',
      desc: 'Craft your origin narrative, aesthetic codes, signature fonts, and values that resonate with luxury buyers.',
      descSinhala: 'ඔබේ සන්නාමයේ පසුබිම් කතාව, සෞන්දර්යාත්මක නීති සහ ධනවත් පාරිභෝගිකයින් ආකර්ෂණය වන Brand DNA එකක් ගොඩනැගීම.',
    },
    {
      title: 'Logo & Typography',
      titleSinhala: 'ලෝගෝ සහ මුද්‍රණ අකුරු (Logo & Typography)',
      desc: 'Develop modern, timeless logotypes and monograms tailored for luxury fabric embroidery and metallic tags.',
      descSinhala: 'රෙදිපිළි මත ගෙත්තම් කිරීමට සහ ලෝහමය ටැග් සඳහා ගැළපෙන නවීන ලෝගෝ සහ මොනොග්‍රෑම් නිර්මාණය.',
    },
    {
      title: 'Product Presentation',
      titleSinhala: 'නිෂ්පාදන ඉදිරිපත් කිරීම (Lookbook Styling)',
      desc: 'Lookbook art direction, styling, flat-lay compositions, and emotional garment photography.',
      descSinhala: 'Lookbook මෝස්තර ගැන්වීම, ඡායාරූප කලාව සහ පාරිභෝගිකයාගේ සිත වශීවන විලාසිතා ඡායාරූපකරණය.',
    },
    {
      title: 'Luxury Packaging',
      titleSinhala: 'සුඛෝපභෝගී ඇසුරුම් (Luxury Packaging)',
      desc: 'Unboxing psychology: rigid debossed boxes, satin ribbons, custom tissue wraps, and sustainable hangtags.',
      descSinhala: 'රන්වන් අකුරු සහිත debossed පෙට්ටි, සැටින් පටි, මුද්‍රිත ටිෂූ කඩදාසි සහ වටිනාකම පෙන්වන Hangtags.',
    },
    {
      title: 'Customer Positioning',
      titleSinhala: 'පාරිභෝගික ස්ථානගත කිරීම (Premium Pricing)',
      desc: 'Stop competing on lowest price. Position your label as high-ticket premium couture.',
      descSinhala: 'අඩුම මිලට විකුණන තරඟයෙන් ඉවත් වී, ඉහළ මිලකට විකිණිය හැකි High-Ticket Luxury Label එකක් බවට පත්කිරීම.',
    },
    {
      title: 'Online Global Presence',
      titleSinhala: 'ගෝලීය ඔන්ලයින් පැවැත්ම (Global Online Store)',
      desc: 'Direct-to-consumer online boutique, automated order processing, and overseas currency handling.',
      descSinhala: 'ස්වයංක්‍රීය ඔන්ලයින් ඇඳුම් සාප්පුවක්, විදේශීය මුදල් ගෙවීම් සහ DHL/FedEx මගින් ලොව වටා භාණ්ඩ බෙදාහැරීම.',
    },
  ];

  const brandFlow = [
    { name: 'IDEA', nameSinhala: 'අදහස', sub: 'Concept' },
    { name: 'DESIGN', nameSinhala: 'පැටර්න්', sub: 'Pattern' },
    { name: 'PRODUCT', nameSinhala: 'නිෂ්පාදනය', sub: 'Garment' },
    { name: 'BRAND', nameSinhala: 'සන්නාමය', sub: 'Packaging' },
    { name: 'CUSTOMER', nameSinhala: 'පාරිභෝගිකයා', sub: 'Marketing' },
    { name: 'GLOBAL MARKET', nameSinhala: 'ලෝක වෙළඳපොළ', sub: 'Export' },
  ];

  return (
    <section id="branding" className="py-24 bg-[#0a0708] relative overflow-hidden border-t border-[#c99a45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#540d18]/40 border border-[#c99a45]/30 text-[#f7e2a9] text-xs font-semibold mb-3 font-mono">
            <Crown className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>Fashion Entrepreneurship Accelerator</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            ඔබේම Fashion Brand එකක් ගොඩනගන්න.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#b8afa2] font-sinhala max-w-2xl mx-auto leading-relaxed">
            {isSinhalaMode
              ? 'සාමාන්‍ය මැහුම්කරුවෙකුගෙන් ඔබ්බට ගොස්, තමන්ගේම Label එකක් සහිත ව්‍යවසායකයෙකු (Brand Owner) ලෙස ලෝක වෙළඳපොළට පිවිසෙන්න.'
              : 'Evolve from a seamstress into an esteemed Creative Director. Build a distinguished fashion house that commands premium margins.'}
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Brand Evolution Pipeline */}
        <div className="max-w-5xl mx-auto mb-16 bg-[#141011] p-6 rounded-sm border border-[#c99a45]/30 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandFlow.map((item, idx) => (
              <div
                key={item.name}
                className="p-4 bg-black/60 border border-white/5 rounded-sm text-center relative group hover:border-[#dfb56c]/60 transition-colors"
              >
                <span className="text-[10px] font-mono text-[#dfb56c] block">0{idx + 1}</span>
                <span className="text-sm font-bold font-editorial text-[#f7f3eb] group-hover:text-[#f7e2a9] block mt-1">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#a89f91] block mt-0.5 font-sinhala">
                  {isSinhalaMode ? item.nameSinhala : item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Core Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {brandPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-sm bg-[#141011] border border-white/5 hover:border-[#c99a45]/40 hover:bg-[#181113] transition-all group duration-300 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#540d18]/50 border border-[#c99a45]/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold font-editorial text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors font-sinhala luxury-heading-anim">
                  {isSinhalaMode ? pillar.titleSinhala : pillar.title}
                </h3>
              </div>
              <p className="text-xs text-[#b8afa2] leading-relaxed font-sinhala">
                {isSinhalaMode ? pillar.descSinhala : pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
