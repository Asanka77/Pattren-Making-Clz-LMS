import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const WhatsAppButton: React.FC = () => {
  const { siteSettings } = useData();

  const phone = siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(siteSettings.whatsappDefaultMessage);
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <span className="hidden md:block mr-3 px-3 py-1.5 rounded-sm bg-[#141011] border border-[#dfb56c]/50 text-[#f7e2a9] text-xs font-semibold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with Academy Advisor
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Ceylon Style Studio via WhatsApp"
        className="btn-3d-whatsapp relative w-13 h-13 sm:w-14 sm:h-14 !rounded-full text-white flex items-center justify-center !shadow-[0_4px_0_#127a37,0_8px_20px_rgba(37,211,102,0.4)] hover:scale-108 active:scale-95 transition-all duration-200 border-2 border-white/30"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </a>
    </aside>
  );
};
