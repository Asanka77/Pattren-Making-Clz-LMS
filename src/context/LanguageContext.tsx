import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'si' | 'en';

interface LanguageContextType {
  language: Language;
  isSinhalaMode: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, enDefault: string, siDefault: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Sinhala mode as requested by user
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('css_preferred_language');
    return (saved === 'en' || saved === 'si') ? (saved as Language) : 'si';
  });

  useEffect(() => {
    localStorage.setItem('css_preferred_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'si' ? 'en' : 'si'));
  };

  const t = (key: string, enDefault: string, siDefault: string): string => {
    return language === 'si' ? siDefault : enDefault;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isSinhalaMode: language === 'si',
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
