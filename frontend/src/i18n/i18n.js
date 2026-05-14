import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations.json';

const savedLang = localStorage.getItem('electropi_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    ar: { translation: translations.ar }
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

// Set document direction on language change
const updateDirection = (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  localStorage.setItem('electropi_lang', lang);
};

updateDirection(savedLang);

i18n.on('languageChanged', updateDirection);

export default i18n;
