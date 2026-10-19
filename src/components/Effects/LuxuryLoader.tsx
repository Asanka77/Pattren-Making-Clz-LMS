import React from 'react';

export const LuxuryLoader: React.FC<{ message?: string }> = ({
  message = 'Loading atelier experience...',
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#540d18] animate-ping opacity-30" />
        <div className="w-12 h-12 rounded-full border-2 border-[#dfb56c] border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#dfb56c]/20 to-transparent" />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#dfb56c] block">
          CEYLON STYLE STUDIO
        </span>
        <p className="text-xs text-[#a89f91] font-mono">{message}</p>
      </div>
    </div>
  );
};
