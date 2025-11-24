import { I18n } from 'i18n-js';

import en from './en.json';
import pl from './pl.json';

export const translations = {
  en: en,
  pl: pl,
} 

export const i18n = new I18n(translations);

export default function t(key: string): string {
  return i18n.t(key);
}

const localeMap: Record<string, string> = {
  pl: 'pl-PL',
  en: 'en-EN'
};

export function normalizeLocale(lang: string) {
  return localeMap[lang.toLowerCase()] || lang;
}

i18n.enableFallback = true;