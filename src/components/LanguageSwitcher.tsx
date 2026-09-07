import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
      <div className="flex items-center px-2 text-slate-500 dark:text-slate-400">
        <Languages className="w-4 h-4" />
      </div>
      <button
        id="lang-btn-en"
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        English
      </button>
      <button
        id="lang-btn-my"
        type="button"
        onClick={() => toggleLanguage('my')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
          currentLang === 'my'
            ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        မြန်မာ
      </button>
    </div>
  );
};
