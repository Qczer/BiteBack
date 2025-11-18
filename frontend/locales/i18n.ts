import { getLocales } from 'expo-localization';
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

i18n.locale = getLocales()[0].languageCode || 'en';
i18n.locale = 'pl';
i18n.enableFallback = true;