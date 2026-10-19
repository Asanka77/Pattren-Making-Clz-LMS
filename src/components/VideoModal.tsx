import React, { useEffect } from 'react';
import { X, Play, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../lib/soundFx';

interface VideoModalProps {
  videoUrlOrId: string | null;
  title?: string;
  titleSinhala?: string;
  description?: string;
  descriptionSinhala?: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  videoUrlOrId,
  title,
  titleSinhala,
  description,
  descriptionSinhala,
  onClose,
}) => {
  const { isSinhalaMode } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (videoUrlOrId) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      soundFx.play('VIDEO_OPEN');
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoUrlOrId, onClose]);

  if (!videoUrlOrId) return null;

  // Extract clean video ID
  let videoId = videoUrlOrId;
  if (videoUrlOrId.includes('http') || videoUrlOrId.includes('youtu')) {
    const match = videoUrlOrId.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    if (match) videoId = match[1];
  }

  // Parameters prevent suggested external videos and keep controls minimal
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&iv_load_policy=3&fs=1`;

  const displayTitle = isSinhalaMode
    ? titleSinhala || title || 'CEYLON STYLE STUDIO Masterclass'
    : title || 'CEYLON STYLE STUDIO Masterclass';

  const displayDesc = isSinhalaMode
    ? descriptionSinhala || description || 'මෙම පාඩම Ceylon Style Studio නිල අධ්‍යාපන පද්ධතිය තුළ සෘජුව නැරඹිය හැක.'
    : description || 'Streamed securely within the official Ceylon Style Studio digital cinema portal.';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => {
        soundFx.playClickSound();
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-[#141011] rounded-sm border border-[#c99a45]/60 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinema Player Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1c1214] border-b border-white/10 text-xs text-[#f7e2a9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-editorial font-bold tracking-wider text-xs sm:text-sm">
              CEYLON STYLE STUDIO • IN-APP CINEMA PLAYER
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-700/50">
              <ShieldCheck className="w-3 h-3" /> External Links Blocked
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded bg-black/50 hover:bg-[#540d18] text-[#dfb56c] hover:text-white border border-[#c99a45]/30 transition-all cursor-pointer flex items-center gap-1 text-xs"
            aria-label="Close Cinema Player"
          >
            <span className="hidden sm:inline font-mono text-[10px] uppercase">වසා දමන්න (Close)</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Frame - Original Colors, Shielded from external YouTube clicks */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={displayTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Protective top barrier: catches accidental clicks on YouTube header title so it NEVER opens youtube.com */}
          <div
            className="absolute top-0 inset-x-0 h-14 z-10 pointer-events-auto bg-transparent cursor-default"
            title="Ceylon Style Studio Protected Cinema"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Bottom right corner barrier: catches clicks on YouTube logo */}
          <div
            className="absolute bottom-0 right-0 w-28 h-12 z-10 pointer-events-auto bg-transparent cursor-default"
            title="Ceylon Style Studio Protected Cinema"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Video Meta & Action Strip */}
        <div className="p-4 sm:p-5 bg-[#141011] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-y-auto">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#540d18] text-[10px] font-mono text-[#f7e2a9] border border-[#dfb56c]/30">
                Official Masterclass
              </span>
              <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In-App Streaming (Never Leaves App)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb]">
              {displayTitle}
            </h3>
            <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed">
              {displayDesc}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href="#register"
              onClick={() => {
                soundFx.playClickSound();
                onClose();
              }}
              className="btn-3d-gold px-5 py-2.5 text-xs uppercase tracking-wider font-bold"
            >
              <span>{isSinhalaMode ? 'දැන්ම ලියාපදිංචි වන්න' : 'Enroll Now'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
