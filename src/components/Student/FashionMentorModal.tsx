import React from 'react';
import { X, Sparkles, Bot, ShieldCheck } from 'lucide-react';
import { FashionMentorChat } from './FashionMentorChat';
import { useAuth } from '../../context/AuthContext';

interface FashionMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'chat' | 'specs' | 'measurements' | 'course';
}

export const FashionMentorModal: React.FC<FashionMentorModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'chat',
}) => {
  const { studentUser, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#0c090a] rounded-sm border-2 border-[#dfb56c]/70 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Modal Top Close Bar */}
        <div className="px-3 sm:px-4 py-2.5 bg-[#1c1214] border-b border-[#dfb56c]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-[#f7e2a9]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-editorial font-bold text-[#f7f3eb]">
                  Ceylon Style Studio — Personal AI Fashion &amp; Pattern Assistant
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#dfb56c]/20 text-[#dfb56c] border border-[#dfb56c]/40 font-bold uppercase">
                  OAuth Integration
                </span>
              </div>
              <p className="text-[10px] text-[#a89f91] font-mono">
                Grounded in Spec Sheets, Measurement Charts, 34-Module Curriculum &amp; Business Pricing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#a89f91] hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat & RAG Knowledge Component */}
        <div className="flex-1 overflow-hidden p-1.5 sm:p-3 bg-[#0a0708]">
          <FashionMentorChat
            studentName={studentUser?.fullName || user?.displayName || 'Student / Designer'}
            className="h-full"
            initialTab={initialTab}
          />
        </div>
      </div>
    </div>
  );
};
