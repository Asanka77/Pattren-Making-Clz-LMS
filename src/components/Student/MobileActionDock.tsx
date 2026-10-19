import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  BookOpen,
  Video,
  Upload,
  Layers,
  Bot,
  User,
  ChevronUp,
  ChevronDown,
  Sparkles,
  X,
  Lock,
  Unlock,
  MessageSquare,
} from 'lucide-react';

interface MobileActionDockProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  activePaidMonths: number[];
  isCourseUnlocked: boolean;
  unreadCount?: number;
}

export const MobileActionDock: React.FC<MobileActionDockProps> = ({
  activeTab,
  setActiveTab,
  activePaidMonths,
  isCourseUnlocked,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const dockItems = [
    {
      id: 'subscriptions',
      label: 'Monthly Subscription',
      labelSi: 'මාසික ගෙවීම්',
      icon: <CreditCard className="w-5 h-5 text-[#dfb56c]" />,
      badge: `M${activePaidMonths.join(',') || 'None'}`,
      isSpecial: true,
      color: 'border-[#dfb56c] bg-[#38070e] text-[#f7e2a9]',
    },
    {
      id: 'lessons',
      label: 'Lessons & PDFs',
      labelSi: 'වීඩියෝ & PDF',
      icon: <BookOpen className="w-5 h-5 text-[#dfb56c]" />,
      badge: null,
      isSpecial: false,
      color: '',
    },
    {
      id: 'zoom',
      label: 'Live Zoom',
      labelSi: 'සජීවී පන්ති',
      icon: <Video className="w-5 h-5 text-red-400" />,
      badge: 'LIVE',
      isSpecial: false,
      color: '',
    },
    {
      id: 'community',
      label: 'Community',
      labelSi: 'සාකච්ඡා සභාව',
      icon: <MessageSquare className="w-5 h-5 text-[#dfb56c]" />,
      badge: null,
      isSpecial: false,
      color: '',
    },
    {
      id: 'upload_payment',
      label: 'Upload Slip',
      labelSi: 'රිසිට්පත එවන්න',
      icon: <Upload className="w-5 h-5 text-amber-300" />,
      badge: null,
      isSpecial: false,
      color: '',
    },
    {
      id: 'tracker',
      label: '6-Mo Progress',
      labelSi: 'ප්‍රගතිය',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      badge: null,
      isSpecial: false,
      color: '',
    },
    {
      id: 'mentor',
      label: 'AI Mentor',
      labelSi: 'AI උපදේශක',
      icon: <Bot className="w-5 h-5 text-[#f7e2a9]" />,
      badge: 'AI',
      isSpecial: false,
      color: '',
    },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex flex-col items-center">
      <AnimatePresence>
        {/* EXPANDED FULL INTERACTIVE ACTION DRAWER */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto w-full max-w-lg mb-2 p-4 rounded-xl bg-[#141011]/95 border-2 border-[#dfb56c]/70 shadow-2xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#f7e2a9] font-bold">
                  Quick Portal Access Menu • ඉක්මන් මෙනුව
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-[#a89f91] hover:text-white rounded"
                aria-label="Minimize Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Sinhala Highlight for "meke monthly subcription kaa koheda tiyenea" */}
            <div
              onClick={() => {
                setActiveTab('subscriptions');
                setIsExpanded(false);
              }}
              className="p-3 rounded-lg bg-gradient-to-r from-[#540d18] via-[#38070e] to-[#241317] border border-[#dfb56c] flex items-center justify-between cursor-pointer hover:brightness-110 shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dfb56c] text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                  <CreditCard className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#f7f3eb] uppercase tracking-wider">
                      Monthly Subscriptions &amp; Active Months
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-green-950 text-green-300 border border-green-500 font-bold">
                      HERE / මෙතැනින්
                    </span>
                  </div>
                  <p className="text-xs text-[#dfb56c] font-sinhala font-medium mt-0.5">
                    මාසික දායකත්ව සහ ගෙවීම් තහවුරු කළ මාස බලාගන්න (Click to open)
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-green-300 block">
                  {activePaidMonths.length > 0 ? `M0${activePaidMonths.join(', 0')}` : 'Pending'}
                </span>
                <span className="text-[10px] text-[#f7e2a9] font-bold">Open →</span>
              </div>
            </div>

            {/* Grid of interactive buttons */}
            <div className="grid grid-cols-3 gap-2">
              {dockItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsExpanded(false);
                    }}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                      isActive
                        ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] shadow-lg shadow-[#540d18]/50'
                        : 'bg-black/50 border-white/10 hover:border-[#dfb56c]/50 text-[#d5cfc4]'
                    }`}
                  >
                    <div className="mb-1">{item.icon}</div>
                    <span className="text-[11px] font-bold leading-tight block">{item.label}</span>
                    <span className="text-[9px] text-[#a89f91] font-sinhala block mt-0.5">{item.labelSi}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED FLOATING ACTION PILL (Slides in smoothly and remains compact otherwise) */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="pointer-events-auto flex items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#241317] via-[#540d18] to-[#141011] border-2 border-[#dfb56c] text-[#f7e2a9] text-xs font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 backdrop-blur-xl"
        >
          <Sparkles className="w-4 h-4 text-[#dfb56c] animate-pulse" />
          <span>Quick Actions • ඉක්මන් මෙනුව</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#dfb56c]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#dfb56c]" />
          )}
        </motion.button>

        {/* Quick Direct Button for Monthly Subscription - Answer to "meke monthly subcription kaa koheda tiyenea" */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('subscriptions')}
          className={`px-3.5 py-2.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xl backdrop-blur-xl transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-[#dfb56c] text-black border-[#f7e2a9]'
              : 'bg-[#0c090a]/90 text-[#f7e2a9] border-[#dfb56c]/70 hover:bg-[#540d18]'
          }`}
          title="Direct link to Monthly Subscriptions (මාසික ගෙවීම්)"
        >
          <CreditCard className="w-4 h-4 text-[#dfb56c]" />
          <span className="hidden xs:inline">Monthly Subscription</span>
          <span className="xs:hidden">M. Sub</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping ml-0.5" />
        </motion.button>
      </motion.div>
    </div>
  );
};
