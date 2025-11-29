import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { i18n, translations } from '@/locales/i18n';
import { useUser } from './UserContext';
import { getItem, setItem } from "@/services/Storage";

const availableLangs = Object.keys(translations) as (keyof typeof translations)[];
type Lang = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  availableLangs: readonly Lang[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isUserLoading } = useUser()
  const [lang, setLangState] = useState(i18n.locale as Lang);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const setLang = async (newLang: Lang) => {
    setLangState(newLang);
    i18n.locale = newLang;
    await setItem("appLanguage", newLang);
  };

  useEffect(() => {
    const loadStoredLang = async () => {
      try {
        const storedLang = await getItem("appLanguage");
        if(storedLang && availableLangs.includes(storedLang as Lang)) {
          setLangState(storedLang as Lang);
          i18n.locale = storedLang;
        }
        else {
          const defaultLang = availableLangs[0];
          setLangState(defaultLang);
          i18n.locale = defaultLang;
        }
      }
      catch (e) {
        console.error("Failed to load language from storage", e);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadStoredLang();
  }, [])

  useEffect(() => {
    if (!isUserLoading && user?.lang && availableLangs.includes(user.lang as Lang)) {
      if (user.lang !== lang) {
        console.log(`Syncing language from User profile: ${user.lang}`);
        setLang(user.lang as Lang);
      }
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if(!isLoading) {
      i18n.locale = lang;
      setForceUpdateKey(prev => prev + 1);
    }
  }, [lang, isLoading]);

  const value = useMemo(() => {
    i18n.locale = lang;
    return {
      lang,
      setLang,
      t: (key: string) => i18n.t(key),
      availableLangs: availableLangs as Lang[],
      isLoading
    };
  }, [lang, isLoading]);

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