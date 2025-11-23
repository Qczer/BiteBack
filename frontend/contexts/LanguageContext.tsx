import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { i18n, translations } from '@/locales/i18n';
import { setItem, getItem } from '@/services/Storage'; 
import { useUser } from './UserContext';

const LANGUAGE_STORAGE_KEY = 'user-language';

const availableLangs = Object.keys(translations) as (keyof typeof translations)[];

type Lang = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  availableLangs: readonly Lang[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser()
  const [lang, setLang] = useState(i18n.locale as Lang);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      try {
        if(user?.lang && availableLangs.includes(user.lang as Lang)) {
          i18n.locale = user.lang;
          setLang(user.lang as Lang);
        }
        else {
          const initialLang =  availableLangs[0];
          i18n.locale = initialLang;
          setLang(initialLang);
        }
      }
      catch (error) {
        console.error("Failed to load language from storage", error);
        i18n.locale = availableLangs[0];
      }
      finally {
        // Zakończ ładowanie, aby aplikacja mogła się wyrenderować
        setIsLoading(false);
      }
    };

    loadLang();
  }, [])

  useEffect(() => {
    if(!isLoading) {
      i18n.locale = lang;
      setForceUpdateKey(prevKey => prevKey + 1);
      if (!lang)
        setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, [lang, isLoading]);

  const value = useMemo(() => {
    i18n.locale = lang;
    return {
      lang,
      setLang,
      t: (key: string) => i18n.t(key),
      availableLangs: availableLangs as Lang[],
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      <React.Fragment key={forceUpdateKey}>
        {children}
      </React.Fragment>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};