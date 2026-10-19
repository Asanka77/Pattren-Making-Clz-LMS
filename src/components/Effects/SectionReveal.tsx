import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  sectionKey?: string;
  bgImageUrl?: string;
  noGap?: boolean;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = '',
  delay = 0,
  id,
  sectionKey,
  bgImageUrl,
  noGap = false,
}) => {
  const { siteSettings } = useData();

  // Check if a section-specific background image is configured
  const sectionBg = bgImageUrl || (sectionKey ? siteSettings.sectionBgImages?.[sectionKey] : undefined);
  const hasPageBg = Boolean(siteSettings.pageBgImageUrl);

  // Determine gap spacing between sections based on backend settings
  const getGapClass = () => {
    if (noGap) return '';
    const gap = siteSettings.sectionGapSize || 'medium';
    switch (gap) {
      case 'none':
        return 'my-0';
      case 'small':
        return 'my-4 sm:my-6';
      case 'large':
        return 'my-12 sm:my-20';
      case 'medium':
      default:
        return 'my-8 sm:my-14';
    }
  };

  const gapClass = getGapClass();

  return (
    <motion.div
      id={id}
      data-has-section-bg={Boolean(sectionBg) ? 'true' : 'false'}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.08 }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1], // Luxury cubic-bezier easing
      }}
      className={`relative ${gapClass} ${className}`}
    >
      {/* 1. Section-Specific Background Image (if configured in Backend CMS) */}
      {sectionBg ? (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none rounded-sm"
            style={{ backgroundImage: `url(${sectionBg})` }}
          />
          {/* Section Dark Overlay */}
          <div
            className="absolute inset-0 z-0 bg-black pointer-events-none rounded-sm transition-opacity duration-700"
            style={{ opacity: (siteSettings.sectionBgOverlayOpacity ?? 65) / 100 }}
          />
        </>
      ) : null}

      {/* 2. Translucent Glassmorphism Wrapper when Page Background or Section Background is active */}
      <div
        className={`relative z-10 transition-colors duration-500 ${
          sectionBg
            ? 'bg-[#0c090a]/60 backdrop-blur-sm border border-[#dfb56c]/30 shadow-2xl rounded-sm overflow-hidden'
            : hasPageBg && siteSettings.sectionGlassmorphism !== false
            ? 'bg-[#0c090a]/75 backdrop-blur-md border-y sm:border border-[#c99a45]/20 shadow-2xl rounded-sm overflow-hidden'
            : ''
        }`}
      >
        {children}
      </div>

      {/* 3. Luxury Gold Hairline Divider in the Gap between sections */}
      {hasPageBg && !noGap && (
        <div className="w-full flex items-center justify-center pt-5 sm:pt-8 pointer-events-none select-none">
          <div className="w-32 sm:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#dfb56c]/40 to-transparent" />
        </div>
      )}
    </motion.div>
  );
};
