import React from 'react';
import { Shield, Sparkles, MessageSquare, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenSyllabus?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenSyllabus }) => {
  const { siteSettings } = useData();

  const links = [
    { label: 'Home', href: '#' },
    { label: 'Course Overview', href: '#overview' },
    { label: 'Modules', href: '#why-course' },
    { label: 'Curriculum Journey', href: '#journey' },
    { label: 'AI Fashion', href: '#ai-fashion' },
    { label: 'Digital Marketing', href: '#marketing' },
    { label: 'Course Videos', href: '#videos' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Locations', href: '#locations' },
    { label: 'Fees & Pricing', href: '#pricing' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Register Now', href: '#register' },
  ];

  return (
    <footer className="bg-[#080506] border-t border-[#c99a45]/20 text-[#a89f91] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Manifesto (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings.logoUrl && siteSettings.logoUrl.trim() ? (
                <img
                  src={siteSettings.logoUrl.trim()}
                  alt={siteSettings.brandName || 'CSS Logo'}
                  className="h-10 max-w-[140px] object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1px]">
                  <div className="w-full h-full bg-[#141011] rounded-sm flex items-center justify-center">
                    <span className="font-editorial text-lg font-bold text-[#f7e2a9]">CSS</span>
                  </div>
                </div>
              )}
              <div>
                <span className="font-editorial text-lg font-bold text-[#f7f3eb] tracking-widest block">
                  {siteSettings.brandName || 'CEYLON STYLE STUDIO'}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c99a45] block">
                  Fashion &amp; Branding Academy
                </span>
              </div>
            </div>

            <p className="text-xs text-[#b8afa2] leading-relaxed max-w-sm font-sinhala">
              "ඔබේ හැකියාවෙන් ඔබේ අනාගතය නිර්මාණය කරන්න."
            </p>

            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#f7e2a9]">
              DESIGN YOUR SKILL. BUILD YOUR BRAND. CREATE YOUR FUTURE.
            </p>

            <p className="text-[11px] text-[#7d7469] leading-relaxed">
              Sri Lanka's pioneering institute bridging bespoke master pattern making, couture garment finishing, Generative AI design, and global digital marketing.
            </p>
          </div>

          {/* Quick Links (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#f7f3eb] mb-4 font-bold">
              Academy Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#dfb56c] transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              {onOpenSyllabus && (
                <button
                  type="button"
                  onClick={onOpenSyllabus}
                  className="text-left text-[#dfb56c] hover:underline transition-colors py-1 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <BookOpen className="w-3 h-3 text-[#dfb56c]" />
                  <span>Course Syllabus</span>
                </button>
              )}
            </div>
          </div>

          {/* Studios & Contacts (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#f7f3eb] mb-4 font-bold">
              Physical Studios
            </h4>
            <p className="text-xs text-[#b8afa2]">
              • <strong>Kegalle:</strong> Creative Atelier, Main Street<br />
              • <strong>Kurunegala:</strong> Design Academy, Colombo Rd<br />
              • <strong>Piliyandala:</strong> Colombo South Campus
            </p>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-mono text-[#a89f91] block">Direct WhatsApp</span>
              <a
                href={`https://wa.me/${siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono font-bold text-[#dfb56c] hover:underline"
              >
                {siteSettings.whatsappContactNumber}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              {siteSettings.socialLinks.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-sm bg-[#141011] border border-white/10 hover:border-[#dfb56c] flex items-center justify-center text-[#d5cfc4] hover:text-[#f7e2a9] transition-colors"
                  aria-label="Facebook"
                >
                  f
                </a>
              )}
              {siteSettings.socialLinks.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-sm bg-[#141011] border border-white/10 hover:border-[#dfb56c] flex items-center justify-center text-[#d5cfc4] hover:text-[#f7e2a9] transition-colors"
                  aria-label="Instagram"
                >
                  ig
                </a>
              )}
              {siteSettings.socialLinks.tiktok && (
                <a
                  href={siteSettings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-sm bg-[#141011] border border-white/10 hover:border-[#dfb56c] flex items-center justify-center text-[#d5cfc4] hover:text-[#f7e2a9] transition-colors"
                  aria-label="TikTok"
                >
                  tk
                </a>
              )}
              {siteSettings.socialLinks.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-sm bg-[#141011] border border-white/10 hover:border-[#dfb56c] flex items-center justify-center text-[#d5cfc4] hover:text-[#f7e2a9] transition-colors"
                  aria-label="YouTube"
                >
                  yt
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7d7469]">
          <p>
            © {new Date().getFullYear()} CEYLON STYLE STUDIO. All rights reserved. Registered Fashion Academy in Sri Lanka.
          </p>

          <div className="flex items-center gap-4">
            <a href="#register" className="text-[#dfb56c] hover:underline">
              Student Registration
            </a>
            <span className="text-white/20">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#a89f91] hover:text-[#dfb56c] flex items-center gap-1 cursor-pointer transition-colors"
              title="Academy Administrative Control Center"
            >
              <Shield className="w-3 h-3 text-[#dfb56c]" />
              <span>Admin Console (පරිපාලක)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
