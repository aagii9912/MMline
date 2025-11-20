import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import mn from '../locales/mn.json';
import zh from '../locales/zh.json';
import ru from '../locales/ru.json';

// Initialize i18n instance with resources
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      mn: { translation: mn },
      zh: { translation: zh },
      ru: { translation: ru },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
