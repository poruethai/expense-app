import { defaultLanguage, Language } from './config';
import { th } from './locales/th';
import { en } from './locales/en';

export const translations = {
  th,
  en,
};

export function getTranslations(language: Language = defaultLanguage) {
  return translations[language];
}