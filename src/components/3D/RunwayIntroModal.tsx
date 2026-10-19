import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, FastForward, Crown, Sparkles, X } from 'lucide-react';
import { RunwayCanvas } from './RunwayCanvas';
import { soundFx } from '../../lib/soundFx';
import { useData } from '../../context/DataContext';

interface RunwayIntroModalProps {
  onFinish: () => void;
  isOpen: boolean;
}

export const RunwayIntroModal: React.FC<RunwayIntroModalProps> = ({ onFinish, isOpen }) => {
  const data = useData() as any;
  const siteSettings = data.siteSettings;
  const outfits: any[] = data.outfits || [];
  const threeDSettings = data.threeDSettings || {};
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [stage, setStage] = useState<'loading' | 'runway' | 'complete'>('loading');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());

  // Find default outfit
  const defaultOutfit =
    outfits.find((o: any) => o.id === threeDSettings?.defaultOutfitId) ||
    outfits.find((o: any) => o.isDefault) ||
    outfits[0];

  // Allow closing with ESC key at any time
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setLoadPercent(0);
    setStage('loading');

    // 0% to 100% smooth luxury loading animation
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStage('runway');
          soundFx.play('RUNWAY_START');
        }, 400);
      }
      setLoadPercent(current);
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Periodic footstep audio during runway
  useEffect(() => {
    if (stage !== 'runway' || isMuted) return;

    let count = 0;
    const stepTimer = setInterval(() => {
      count++;
      soundFx.playRunwayStepSound();
      if (count >= 10) clearInterval(stepTimer);
    }, 620);

    return () => clearInterval(stepTimer);
  }, [stage, isMuted]);

  if (!isOpen) return null;

  const handleSkip = () => {
    soundFx.playClickSound();
    soundFx.playWhooshSound();
    onFinish();
  };

  const handleToggleSound = () => {
    const next = soundFx.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080507] text-[#f4efe6] overflow-hidden flex flex-col justify-between select-none animate-in fade-in duration-300">
      {/* Top Floating Controls */}
      <header className="relative z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          {Boolean(siteSettings.logoUrl && siteSettings.logoUrl.trim()) ? (
            <img
              src={siteSettings.logoUrl.trim()}
              alt="Ceylon Style Studio"
              className="h-9 w-auto max-w-[120px] object-contain drop-shadow"
            />
          ) : (
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#dfb56c] to-[#9e7225] p-[1px] shadow-lg">
              <div className="w-full h-full bg-[#141011] rounded-sm flex items-center justify-center">
                <span className="font-editorial text-sm font-bold text-[#f7e2a9]">CSS</span>
              </div>
            </div>
          )}

          <div>
            <span className="font-editorial text-xs sm:text-sm font-bold tracking-widest text-[#f7f3eb] block">
              {siteSettings.brandName || 'CEYLON STYLE STUDIO'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#c99a45] block font-mono">
              3D Digital Fashion Runway Experience • Intake 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-2 sm:px-3 sm:py-1.5 rounded-sm bg-[#141011]/90 border border-white/20 hover:border-[#dfb56c] text-[#dfb56c] transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* SKIP INTRO BUTTON */}
          <button
            onClick={handleSkip}
            className="btn-3d-secondary px-3 sm:px-4 py-1.5 sm:py-2 text-xs uppercase tracking-widest flex items-center gap-1.5 font-bold cursor-pointer"
            title="Skip Runway Animation"
          >
            <span className="hidden sm:inline">Skip Runway</span>
            <FastForward className="w-3.5 h-3.5 text-[#dfb56c]" />
          </button>

          {/* PROMINENT CLOSE BUTTON (Immediately closes modal & reveals site) */}
          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 sm:py-2 rounded-sm bg-[#540d18] hover:bg-[#6e1322] border-2 border-[#dfb56c] text-[#f7e2a9] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-lg hover:shadow-[#dfb56c]/40"
            title="Close / වසන්න (Esc)"
            aria-label="Close Runway Intro"
          >
            <X className="w-4 h-4 text-[#f7e2a9]" />
            <span className="font-mono uppercase tracking-wider text-xs">Close (වසන්න)</span>
          </button>
        </div>
      </header>

      {/* Center Display Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        {/* STAGE 1: CINEMATIC PRELOADER */}
        {stage === 'loading' && (
          <div className="relative z-20 max-w-lg mx-auto px-6 text-center space-y-6 animate-in zoom-in-95 duration-500">
            {/* Monogram Seal */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-[#540d18] to-[#1c1214] border-2 border-[#dfb56c] flex items-center justify-center shadow-2xl shadow-[#dfb56c]/30">
              <Crown className="w-10 h-10 text-[#f7e2a9] animate-pulse" />
            </div>

            {/* Brand Title */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#dfb56c] font-mono block mb-2">
                Haute Couture Fashion Academy
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-editorial font-bold text-[#f7f3eb] tracking-widest luxury-heading-anim">
                {siteSettings.brandName || 'CEYLON STYLE STUDIO'}
              </h1>
            </div>

            {/* Slogan */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#dfb56c] font-sans">
                "DESIGN YOUR SKILL."
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#dfb56c] font-sans">
                "BUILD YOUR BRAND."
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#dfb56c] font-sans">
                "CREATE YOUR FUTURE."
              </p>
            </div>

            {/* Counter 0% -> 100% */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between text-xs font-mono text-[#a89f91]">
                <span>INITIALIZING RUNWAY</span>
                <span className="text-[#f7e2a9] font-bold">{loadPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1c1214] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#540d18] via-[#dfb56c] to-[#f7e2a9] transition-all duration-100"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7d7469] font-mono block">
                Loading 3D Models, PBR Shaders &amp; Reflective Lighting...
              </span>

              {/* Instant Close / Enter Website Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn-3d-gold w-full py-2.5 px-4 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <X className="w-3.5 h-3.5 text-black" />
                  <span>වෙබ් අඩවියට පිවිසෙන්න (Close &amp; Enter)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: 3D RUNWAY EXPERIENCE */}
        {stage === 'runway' && (
          <div className="absolute inset-0 w-full h-full">
            <RunwayCanvas
              mode="intro"
              dressColor={defaultOutfit?.color || '#6e1322'}
              accentColor={defaultOutfit?.secondaryColor || '#dfb56c'}
              metallic={defaultOutfit?.metallic ?? 0.35}
              roughness={defaultOutfit?.roughness ?? 0.25}
              modelUrl={defaultOutfit?.modelUrl}
              lightingIntensity={threeDSettings.lightingIntensity ?? 1.2}
              onAnimationComplete={() => {
                soundFx.play('RUNWAY_END');
                setTimeout(() => onFinish(), 700);
              }}
              className="w-full h-full"
            />

            {/* Runway Title Overlay (Lower Left) */}
            <div className="absolute bottom-8 left-6 sm:left-10 z-20 max-w-md pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#dfb56c] bg-black/80 px-2.5 py-1 rounded border border-[#dfb56c]/30 backdrop-blur-sm inline-block mb-2">
                Featured Haute Couture: {defaultOutfit?.category || 'EVENING GOWN'}
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial font-bold text-[#f7f3eb] drop-shadow-md">
                {defaultOutfit?.name || 'Royal Crimson Gala Evening Gown'}
              </h2>
              <p className="text-xs text-[#d5cfc4] font-sinhala mt-1 line-clamp-2 drop-shadow">
                {defaultOutfit?.descriptionSinhala || 'සාම්ප්‍රදායික ටේලරින් තාක්ෂණයෙන් AI රන්වේ විලාසිතා දක්වා ඔබව රැගෙන යන එකම පාඨමාලාව.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Strip */}
      <footer className="relative z-30 px-6 py-4 border-t border-[#c99a45]/20 bg-black/70 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between text-xs text-[#a89f91] gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
          <span className="font-sinhala text-[11px] sm:text-xs">
            ශ්‍රී ලංකාවේ ප්‍රථම 3D Digital Fashion Academy වේදිකාව
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-[#dfb56c] hover:underline font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <span>Enter Academy Website →</span>
        </button>
      </footer>
    </div>
  );
};
