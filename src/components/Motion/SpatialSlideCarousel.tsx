import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Sparkles, Eye, Maximize2 } from 'lucide-react';

export interface SpatialSlideItem {
  id: string;
  title: string;
  titleSinhala?: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
  category?: string;
  tag?: string;
  duration?: string;
}

interface SpatialSlideCarouselProps {
  items: SpatialSlideItem[];
  onPlayVideo?: (url: string) => void;
  onInspectImage?: (url: string, title: string) => void;
  title?: string;
  subtitle?: string;
  isSinhalaMode?: boolean;
}

export const SpatialSlideCarousel: React.FC<SpatialSlideCarouselProps> = ({
  items,
  onPlayVideo,
  onInspectImage,
  title = '3D SPATIAL MEDIA SHOWCASE',
  subtitle = 'Swipe through high-fashion visuals with fluid 3D spatial depth',
  isSinhalaMode = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  return (
    <div className="w-full py-8 select-none overflow-hidden">
      {/* Header with Title and 3D navigation controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#dfb56c]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dfb56c] font-bold">
              {title}
            </span>
          </div>
          <p className="text-xs text-[#a89f91] font-mono">{subtitle}</p>
        </div>

        {/* 3D Arrow Navigation Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-[#141011] border border-[#c99a45]/40 hover:border-[#dfb56c] text-[#f7e2a9] flex items-center justify-center shadow-lg transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <span className="text-xs font-mono text-[#dfb56c] px-2 font-bold">
            {activeIndex + 1} / {items.length}
          </span>

          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-[#141011] border border-[#c99a45]/40 hover:border-[#dfb56c] text-[#f7e2a9] flex items-center justify-center shadow-lg transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            // Calculate distance offset relative to active index
            let offset = index - activeIndex;
            // Wrap offset for circular effect
            if (offset < -Math.floor(items.length / 2)) {
              offset += items.length;
            } else if (offset > Math.floor(items.length / 2)) {
              offset -= items.length;
            }

            // Only render items within visual range (-2 to 2)
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const isCenter = offset === 0;

            // 3D transform metrics
            const xOffset = offset * 260; // horizontal separation
            const rotateY = offset * -28; // 3D perspective rotation
            const zDistance = -Math.abs(offset) * 160; // depth placement
            const scale = isCenter ? 1 : 0.82;
            const opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);

            return (
              <motion.div
                key={item.id}
                animate={{
                  x: xOffset,
                  rotateY: rotateY,
                  z: zDistance,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute w-[290px] sm:w-[340px] md:w-[380px] h-[340px] sm:h-[390px] md:h-[430px] rounded-sm overflow-hidden select-none transition-shadow ${
                  isCenter
                    ? 'shadow-2xl shadow-[#540d18]/60 border-2 border-[#dfb56c] z-30 cursor-default'
                    : 'border border-white/10 z-10 hover:border-white/30 cursor-pointer shadow-lg'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Background Image / Photo */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Ambient Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Category Badge & Duration */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                  {item.category && (
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-black/80 text-[#dfb56c] border border-[#dfb56c]/40 font-bold backdrop-blur-md">
                      {item.category}
                    </span>
                  )}
                  {item.duration && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white font-bold backdrop-blur-md">
                      ⏱ {item.duration}
                    </span>
                  )}
                </div>

                {/* Center Play Button for Videos or Inspect for Graphics */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {item.videoUrl ? (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPlayVideo) onPlayVideo(item.videoUrl!);
                      }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1.5px] shadow-2xl shadow-black group"
                      title="Play Video"
                    >
                      <div className="w-full h-full rounded-full bg-[#141011] flex items-center justify-center group-hover:bg-[#540d18] transition-colors">
                        <Play className="w-6 h-6 text-[#f7e2a9] fill-[#f7e2a9] ml-1" />
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onInspectImage) onInspectImage(item.imageUrl, item.title);
                      }}
                      className="w-12 h-12 rounded-full bg-black/70 border border-[#dfb56c] text-[#f7e2a9] flex items-center justify-center backdrop-blur-md hover:bg-[#540d18] transition-colors"
                      title="Inspect Photo"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Bottom Card Meta Details */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 space-y-1 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h4 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  {item.titleSinhala && isSinhalaMode && (
                    <p className="text-xs text-[#d5cfc4] font-sinhala line-clamp-1">
                      {item.titleSinhala}
                    </p>
                  )}
                  {item.subtitle && (
                    <p className="text-[11px] text-[#a89f91] line-clamp-1 font-mono">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Interactive Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? 'w-7 h-2 bg-gradient-to-r from-[#dfb56c] to-[#c99a45]'
                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
