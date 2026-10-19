import React from 'react';
import { Check, Lock, Sparkles, ChevronRight, Award, Compass } from 'lucide-react';
import { DEFAULT_JOURNEY_STAGES } from '../../lib/defaults';

interface FashionJourneyPathProps {
  completedLessonCount: number;
  totalLessonCount: number;
  completedLessonIds: string[];
  currentStageIndex?: number;
  onSelectStage?: (stageId: string, moduleIds: string[]) => void;
  className?: string;
  isCompact?: boolean;
}

export const FashionJourneyPath: React.FC<FashionJourneyPathProps> = ({
  completedLessonCount,
  totalLessonCount,
  completedLessonIds,
  currentStageIndex = 0,
  onSelectStage,
  className = '',
  isCompact = false,
}) => {
  const stages = DEFAULT_JOURNEY_STAGES;
  const overallPercent = totalLessonCount > 0 ? Math.round((completedLessonCount / totalLessonCount) * 100) : 0;

  // Compute status for each stage based on lessons completed
  const stageStatuses = stages.map((st, idx) => {
    // If progress is advanced enough or explicitly completed
    const stageThreshold = ((idx + 1) / stages.length) * 100;
    const prevThreshold = (idx / stages.length) * 100;

    let status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED' = 'LOCKED';
    let percent = 0;

    if (overallPercent >= stageThreshold) {
      status = 'COMPLETED';
      percent = 100;
    } else if (overallPercent >= prevThreshold) {
      status = 'IN_PROGRESS';
      percent = Math.round(((overallPercent - prevThreshold) / (100 / stages.length)) * 100);
    } else {
      status = 'LOCKED';
      percent = 0;
    }

    return { ...st, status, percent };
  });

  // Motivational message based on overall progress
  const getMotivationalQuote = (pct: number) => {
    if (pct === 0) return { en: "Your fashion journey starts here.", si: "ඔබේ විලාසිතා ගමන අදින් ආරම්භ වේ." };
    if (pct < 25) return { en: "Your technical foundation is getting stronger.", si: "ඔබේ මූලික තාක්ෂණික පදනම ශක්තිමත් වෙමින් පවතී." };
    if (pct < 50) return { en: "Mastering precision cuts and bespoke draping.", si: "නිවැරදි කැපුම් සහ මෝස්තර හැඩතල ප්‍රගුණ කෙරේ." };
    if (pct < 75) return { en: "You are halfway through your fashion journey. Your skills are becoming your brand.", si: "ඔබගේ හැකියාවන් දැන් ඔබේම සන්නාමයක් (Brand) බවට පත්වෙමින් තිබේ." };
    if (pct < 100) return { en: "Final luxury runway collection and global export readiness.", si: "අවසන් Runway එකතුව සහ ගෝලීය වෙළඳපොළට සූදානම් වීම." };
    return { en: "Your journey continues beyond the classroom. Certified Atelier Designer!", si: "සුභපැතුම්! ඔබ දැන් වෘත්තීය Couture Designer කෙනෙකි." };
  };

  const motivation = getMotivationalQuote(overallPercent);

  return (
    <div className={`p-5 sm:p-7 rounded-sm bg-[#120c0e] border border-[#dfb56c]/30 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#540d18]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#dfb56c]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#dfb56c]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#dfb56c] font-bold">
              Personal Progression Runway
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] flex items-center gap-2">
            <span>YOUR FASHION JOURNEY</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-mono">
              {overallPercent}% Complete
            </span>
          </h3>
        </div>

        {/* Motivational pill banner */}
        <div className="p-2.5 px-4 rounded bg-black/60 border border-[#dfb56c]/20 max-w-md text-right sm:text-right">
          <p className="text-xs text-[#f7e2a9] font-medium italic">"{motivation.en}"</p>
          <p className="text-[11px] text-[#b8afa2] font-sinhala mt-0.5">{motivation.si}</p>
        </div>
      </div>

      {/* Desktop Horizontal Curved Runway Path */}
      <div className="hidden lg:block relative z-10 my-8">
        {/* Continuous Connecting Gold Line */}
        <div className="absolute top-8 left-6 right-6 h-1 bg-[#241317] rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#dfb56c] rounded-full transition-all duration-700 shadow-[0_0_12px_#dfb56c]"
            style={{ width: `${Math.min(100, Math.max(0, overallPercent))}%` }}
          />
        </div>

        <div className="grid grid-cols-8 gap-2 relative z-10">
          {stageStatuses.map((st, i) => {
            const isCompleted = st.status === 'COMPLETED';
            const isInProgress = st.status === 'IN_PROGRESS';
            const isLocked = st.status === 'LOCKED';

            return (
              <div
                key={st.id}
                onClick={() => onSelectStage && onSelectStage(st.id, st.moduleIds)}
                className={`flex flex-col items-center text-center group cursor-pointer transition-transform duration-200 ${
                  onSelectStage ? 'hover:-translate-y-1' : ''
                }`}
              >
                {/* Node Ring */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative shadow-xl ${
                    isCompleted
                      ? 'bg-[#dfb56c] text-black border-2 border-[#fff3d1] shadow-[0_0_16px_rgba(223,181,108,0.7)]'
                      : isInProgress
                      ? 'bg-gradient-to-br from-[#540d18] to-[#1c070b] text-[#f7e2a9] border-2 border-[#dfb56c] animate-pulse shadow-[0_0_20px_rgba(84,13,24,0.8)]'
                      : 'bg-[#1a1214] text-[#7d7469] border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : isInProgress ? (
                    <div className="flex flex-col items-center">
                      <Sparkles className="w-4 h-4 text-[#dfb56c] animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-[10px] font-mono font-bold">{st.percent}%</span>
                    </div>
                  ) : (
                    <Lock className="w-4 h-4 text-[#594f47]" />
                  )}

                  {/* Stage number tag */}
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded text-[9px] font-mono bg-black text-[#dfb56c] border border-[#dfb56c]/30">
                    {st.num}
                  </span>
                </div>

                {/* Stage Title */}
                <div className="mt-3 w-full px-1">
                  <h4
                    className={`text-[11px] font-editorial font-bold line-clamp-1 transition-colors ${
                      isCompleted
                        ? 'text-[#f7e2a9]'
                        : isInProgress
                        ? 'text-white'
                        : 'text-[#8e8579]'
                    }`}
                  >
                    {st.title}
                  </h4>
                  <span className="text-[10px] text-[#a89f91] font-sinhala block truncate">
                    {st.titleSinhala}
                  </span>

                  <span
                    className={`mt-1 inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-[#dfb56c]/20 text-[#f7e2a9]'
                        : isInProgress
                        ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/40 font-bold'
                        : 'text-[#6e6459]'
                    }`}
                  >
                    {isCompleted ? '100% ✓' : isInProgress ? `${st.percent}%` : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Journey */}
      <div className="lg:hidden relative z-10 space-y-3.5 my-4">
        {stageStatuses.map((st, i) => {
          const isCompleted = st.status === 'COMPLETED';
          const isInProgress = st.status === 'IN_PROGRESS';
          const isLocked = st.status === 'LOCKED';

          return (
            <div
              key={st.id}
              onClick={() => onSelectStage && onSelectStage(st.id, st.moduleIds)}
              className={`p-3.5 rounded-sm border transition-all flex items-center gap-3.5 cursor-pointer ${
                isCompleted
                  ? 'bg-[#181113] border-[#dfb56c]/50'
                  : isInProgress
                  ? 'bg-gradient-to-r from-[#241317] to-[#141011] border-[#dfb56c] shadow-lg'
                  : 'bg-[#0f0b0c] border-white/5 opacity-75'
              }`}
            >
              {/* Node Icon */}
              <div
                className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                  isCompleted
                    ? 'bg-[#dfb56c] text-black shadow-[0_0_12px_#dfb56c]'
                    : isInProgress
                    ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] animate-pulse'
                    : 'bg-[#1c1416] text-[#7d7469]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : isLocked ? <Lock className="w-4 h-4" /> : st.num}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-editorial font-bold text-[#f7f3eb] truncate">
                    {st.num}. {st.title}
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      isCompleted
                        ? 'bg-[#dfb56c]/20 text-[#f7e2a9]'
                        : isInProgress
                        ? 'bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/40'
                        : 'text-[#6e6459]'
                    }`}
                  >
                    {isCompleted ? 'Completed ✓' : isInProgress ? `In Progress (${st.percent}%)` : 'Locked'}
                  </span>
                </div>
                <p className="text-[11px] text-[#b8afa2] font-sinhala truncate mt-0.5">
                  {st.titleSinhala} • {st.desc}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-[#dfb56c] shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
