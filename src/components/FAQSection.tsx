import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { faqs, siteSettings } = useData();
  const { isSinhalaMode } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const publishedFaqs = faqs.filter((f) => f.isPublished !== false);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-24 bg-[#0c090a] relative border-t border-[#c99a45]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3 font-mono">
            {isSinhalaMode ? 'නිතර අසන ප්‍රශ්න සහ පිළිතුරු' : 'Questions & Answers'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'නිතර අසන ගැටලු' : 'FREQUENTLY ASKED QUESTIONS'}
          </h2>
          <p className="mt-3 text-sm text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'පාඨමාලාව පිළිබඳ සිසුන් විසින් බහුලව විමසන ප්‍රශ්න සහ සම්පූර්ණ පැහැදිලි කිරීම්.'
              : 'Everything you need to know about the curriculum, schedule, certifications, and payment flexibility.'}
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {publishedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-sm bg-[#141011] border border-white/5 hover:border-[#c99a45]/30 transition-all overflow-hidden shadow-md"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-editorial font-bold text-[#f7f3eb] hover:text-[#f7e2a9] transition-colors font-sinhala luxury-heading-anim">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-[#1c1214] border border-[#c99a45]/30 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#540d18] text-[#f7e2a9]' : 'text-[#a89f91]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#b8afa2] font-sinhala leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Inquiry Prompt */}
        <div className="mt-12 p-6 rounded-sm bg-[#1a1215] border border-[#c99a45]/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-left">
            <h4 className="text-sm font-bold text-[#f7f3eb]">
              {isSinhalaMode ? 'තවත් ප්‍රශ්න තිබේද?' : 'Have More Questions?'}
            </h4>
            <p className="text-xs text-[#a89f91] font-sinhala mt-0.5">
              {isSinhalaMode
                ? 'අපගේ අධ්‍යයන උපදේශක කණ්ඩායම සමඟ සෘජුවම WhatsApp හරහා කතා කරන්න.'
                : 'Connect directly with our admissions counselor team via WhatsApp.'}
            </p>
          </div>
          <a
            href={`https://wa.me/${siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(siteSettings.whatsappDefaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 bg-[#25D366] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
