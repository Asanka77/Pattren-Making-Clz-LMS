import React from 'react';
import {
  TrendingUp,
  Target,
  Share2,
  Zap,
  BarChart3,
  ArrowRight,
  ShoppingBag,
  Flame,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DigitalMarketingSection: React.FC = () => {
  const { isSinhalaMode } = useLanguage();

  const funnels = [
    {
      step: '01',
      title: 'CONTENT',
      titleSinhala: 'අන්තර්ගතය (CONTENT)',
      subtitle: 'Luxury Visuals & Hooks',
      subtitleSinhala: 'ආකර්ෂණීය ඡායාරූප හා රීල්ස්',
      desc: 'AI lookbooks, atelier craftsmanship reels, and aesthetic lifestyle content that stops the scroll.',
      descSinhala: 'AI Lookbooks, සජීවී මැහුම් වීඩියෝ සහ පාරිභෝගිකයා වශීවන Reels නිර්මාණය කිරීම.',
    },
    {
      step: '02',
      title: 'REACH',
      titleSinhala: 'ප්‍රවේශය (REACH)',
      subtitle: 'Targeted Paid Ads',
      subtitleSinhala: 'ඉලක්කගත Meta දැන්වීම්',
      desc: 'Meta Ads Manager, TikTok Spark Ads, lookalike audiences, and precision demographic boosting.',
      descSinhala: 'මිලදී ගැනීමට හැකියාව ඇති ධනවත් පාරිභෝගිකයින් ඉලක්ක කර Facebook & Instagram දැන්වීම් ධාවනය කිරීම.',
    },
    {
      step: '03',
      title: 'ENGAGE',
      titleSinhala: 'සම්බන්ධතාව (ENGAGE)',
      subtitle: 'Social Community',
      subtitleSinhala: 'සමාජ මාධ්‍ය පාරිභෝගික සබඳතා',
      desc: 'Instagram DMs automation, WhatsApp Business catalog funnels, and emotional fashion storytelling.',
      descSinhala: 'WhatsApp Business Catalogs සහ Instagram DM automation මගින් විශ්වාසය ගොඩනැගීම.',
    },
    {
      step: '04',
      title: 'CONVERT',
      titleSinhala: 'විකුණුම් (CONVERT)',
      subtitle: 'High-Ticket Orders',
      subtitleSinhala: 'ඉහළ ලාභ සහිත ඇණවුම්',
      desc: 'Direct website checkouts, cash-on-delivery in Sri Lanka & stripe international card payments.',
      descSinhala: 'වෙබ් අඩවි හරහා සෘජු ඇණවුම්, ශ්‍රී ලංකාව තුළ COD සහ විදේශිකයින්ගෙන් ඩොලර් ගෙවීම් ලබාගැනීම.',
    },
    {
      step: '05',
      title: 'GROW',
      titleSinhala: 'වර්ධනය (GROW)',
      subtitle: 'Global Scaling',
      subtitleSinhala: 'ගෝලීය ව්‍යාප්තිය',
      desc: 'Repeat customer retention, brand ambassador VIP programs, and global overseas retail export.',
      descSinhala: 'නැවත නැවත මිලදී ගන්නා විශ්වාසවන්ත පාරිභෝගික පදනමක් සහ ලෝක වෙළඳපොළට අපනයනය කිරීම.',
    },
  ];

  const channels = [
    { name: 'Facebook Marketing', nameSinhala: 'Facebook අලෙවිකරණය', badge: 'High-Volume Retargeting' },
    { name: 'Instagram Marketing', nameSinhala: 'Instagram Luxury Branding', badge: 'Luxury Aesthetic & Reels' },
    { name: 'TikTok Viral Marketing', nameSinhala: 'TikTok වෛරල් වීඩියෝ', badge: 'Gen-Z Organic Virality' },
    { name: 'YouTube Marketing', nameSinhala: 'YouTube අධිකාරීත්වය', badge: 'Long-Form Designer Authority' },
    { name: 'Paid Advertising & Boosting', nameSinhala: 'දැන්වීම් ප්‍රවර්ධනය (Boosting)', badge: 'Optimized ROAS & CBO' },
    { name: 'Audience Targeting', nameSinhala: 'ඉහළ පාරිභෝගික ඉලක්කගත කිරීම', badge: 'High-Net-Worth Demographics' },
    { name: 'Brand Positioning', nameSinhala: 'ප්‍රිමියම් මිල උපායමාර්ග', badge: 'Premium Pricing Strategy' },
    { name: 'AI Copy & Campaign Planning', nameSinhala: 'AI මගින් දැන්වීම් සැලසුම් කිරීම', badge: 'Instant Ad Creatives' },
  ];

  return (
    <section id="marketing" className="py-24 bg-[#0c090a] relative overflow-hidden border-t border-[#c99a45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3 font-mono">
            {isSinhalaMode ? 'ඩිජිටල් අලෙවිකරණය සහ ගෝලීය වෙළඳපොළ' : 'Digital Commerce & Global Reach'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            Design කළාට පස්සේ... ඒක ලෝකයට ගෙනියන්නේ කොහොමද?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#b8afa2] font-sinhala max-w-2xl mx-auto leading-relaxed">
            {isSinhalaMode
              ? 'විශිෂ්ට ඇඳුමක් නිර්මාණය කළද, එය නිවැරදි පාරිභෝගිකයා වෙත රැගෙන යාමට ඩිජිටල් අලෙවිකරණය නොමැතිව කළ නොහැක. අපි ඔබට සැබෑ විකුණුම් සහ ඉහළ ආදායම් ගෙනෙන නවීන සන්නාමකරණය උගන්වමු.'
              : 'Creating a magnificent garment is only half the battle. Discover how our students launch high-converting fashion campaigns, generate global client inquiries, and scale profitably.'}
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Visual Funnel Flow: CONTENT → REACH → ENGAGE → CONVERT → GROW */}
        <div className="mb-16">
          <h3 className="text-center text-xs font-mono uppercase tracking-[0.25em] text-[#dfb56c] mb-6">
            {isSinhalaMode ? 'පියවර 5ක විකුණුම් පරිවර්තන ක්‍රියාවලිය' : 'The Omnichannel Conversion Funnel'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {funnels.map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-sm bg-[#141011] border border-[#c99a45]/20 hover:border-[#dfb56c] transition-all relative group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#dfb56c]">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#a89f91]">
                      Stage
                    </span>
                  </div>

                  <h4 className="text-sm font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] transition-colors mb-1 font-sinhala">
                    {isSinhalaMode ? item.titleSinhala : item.title}
                  </h4>

                  <span className="text-[10px] font-mono text-[#dfb56c] block mb-2 font-sinhala">
                    {isSinhalaMode ? item.subtitleSinhala : item.subtitle}
                  </span>

                  <p className="text-xs text-[#a89f91] leading-relaxed font-sinhala">
                    {isSinhalaMode ? item.descSinhala : item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#dfb56c]">
                  <span>{isSinhalaMode ? 'ක්‍රමවේදය' : 'Strategy'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Core Marketing Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {channels.map((ch) => (
            <div
              key={ch.name}
              className="p-4 rounded-sm bg-[#181113] border border-white/5 hover:border-[#c99a45]/40 transition-colors flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#dfb56c] block mb-1">
                  {ch.badge}
                </span>
                <h4 className="text-sm font-bold text-[#f7f3eb] font-sinhala">
                  {isSinhalaMode ? ch.nameSinhala : ch.name}
                </h4>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-green-400 font-mono">
                <span>✓ {isSinhalaMode ? 'ප්‍රායෝගික පුහුණුව' : 'Live Case Studies'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
