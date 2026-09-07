import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

const SAVED_LANGUAGE_KEY = 'grocery_app_language';

const savedLang = localStorage.getItem(SAVED_LANGUAGE_KEY) || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(SAVED_LANGUAGE_KEY, lng);
  document.documentElement.lang = lng;
});

export default i18n;
