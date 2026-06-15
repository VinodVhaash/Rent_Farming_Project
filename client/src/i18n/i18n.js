import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ── Translation resources ──────────────────────────────────────────
// Only non-English files are strictly required because the English
// text lives as the `defaultValue` right inside JSX.  We still keep
// en.json as the "source-of-truth reference" for translators.
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

// ── Available languages (used by the LanguageSwitcher UI) ──────────
export const LANGUAGES = [
  { code: 'en', label: 'English',  nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',    flag: '🇮🇳' },
];

// ── Initialise i18next ─────────────────────────────────────────────
i18n
  .use(initReactI18next)          // binds i18next to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    lng: localStorage.getItem('rf_lang') || 'en', // persisted choice
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,         // React already escapes
    },
  });

export default i18n;
