import React from 'react';
import { MapPin, Phone, Calendar, ExternalLink, Navigation } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const LocationsSection: React.FC = () => {
  const { locations } = useData();
  const { isSinhalaMode } = useLanguage();

  const activeLocations = locations.filter((l) => l.isActive !== false);

  return (
    <section id="locations" className="py-24 bg-[#0c090a] relative border-t border-[#c99a45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-3 font-mono">
            {isSinhalaMode ? 'භෞතික පන්ති පැවැත්වෙන ශාඛා' : 'Physical Academy Studios'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wider text-balance luxury-heading-anim">
            {isSinhalaMode ? 'අපගේ ශාඛා ජාලය' : 'CLASS LOCATIONS'}
          </h2>
          <p className="mt-3 text-sm text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'ලංකාවේ පහසු ප්‍රධාන නගර 3ක අපගේ physical studios ක්‍රියාත්මක වේ: කෑගල්ල, කුරුණෑගල සහ පිළියන්දල. ඔබේ පහසු ශාඛාව තෝරාගන්න.'
              : 'Our physical couture ateliers operate in 3 premier hubs: Kegalle, Kurunegala, and Piliyandala. Select your preferred studio.'}
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activeLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-8 rounded-sm bg-[#141011] border border-[#c99a45]/25 hover:border-[#dfb56c] hover:bg-[#1a1315] transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[#241317] border border-[#c99a45]/40 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#dfb56c]" />
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#540d18] text-[10px] font-mono uppercase tracking-wider text-[#f7e2a9] border border-[#dfb56c]/30">
                    {isSinhalaMode ? 'සක්‍රිය ශාඛාව' : 'Studio Active'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-editorial font-bold text-[#f7f3eb] group-hover:text-[#f7e2a9] tracking-wider mb-2 luxury-heading-anim">
                  {loc.name}
                </h3>

                <p className="text-xs text-[#b8afa2] mb-6 flex items-start gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#dfb56c] shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </p>

                <div className="space-y-2.5 text-xs text-[#d5cfc4] pt-4 border-t border-white/10">
                  {loc.schedule && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>{loc.schedule}</span>
                    </div>
                  )}
                  {loc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span className="font-mono">{loc.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                {loc.mapUrl ? (
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#dfb56c] hover:text-white font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>{isSinhalaMode ? 'Google Maps බලන්න' : 'Google Maps Directions'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-[#a89f91]">Studio Directions</span>
                )}

                <a
                  href="#register"
                  className="text-xs uppercase font-mono tracking-wider text-[#f7e2a9] hover:underline"
                >
                  {isSinhalaMode ? 'ලියාපදිංචිය →' : 'Enroll Here →'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
