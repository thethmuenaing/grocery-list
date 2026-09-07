import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Share2, RotateCcw, Check, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GroceryItemType } from '../types';
import { AuthUser } from '../hooks/useAuth';
import { getLocalizedText } from '../utils/translationService';

interface HeaderProps {
  items: GroceryItemType[];
  onResetSamples: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ items, onResetSamples, user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyList = () => {
    if (items.length === 0) return;

    const currentLang = i18n.language || 'en';
    const pending = items.filter((item) => !item.purchased);
    const purchased = items.filter((item) => item.purchased);

    let text = `🛒 ${t('appName')} (${new Date().toLocaleDateString()})\n\n`;

    if (pending.length > 0) {
      text += `📌 ${t('pending')} (${pending.length}):\n`;
      pending.forEach((i, index) => {
        const name = getLocalizedText(i.name, currentLang);
        const noteText = getLocalizedText(i.note, currentLang);
        const qty = i.quantity ? ` [${i.quantity}]` : '';
        const note = noteText ? ` (${noteText})` : '';
        text += `${index + 1}. ${name}${qty}${note}\n`;
      });
      text += '\n';
    }

    if (purchased.length > 0) {
      text += `✅ ${t('purchased')} (${purchased.length}):\n`;
      purchased.forEach((i, index) => {
        const name = getLocalizedText(i.name, currentLang);
        text += `• ${name}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden xs:block">
                {t('appTagline')}
              </p>
            </div>
          </div>

          <div className="sm:hidden">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="copy-list-btn"
              type="button"
              onClick={handleCopyList}
              disabled={items.length === 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              title={t('copyList')}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('copied')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden xs:inline">{t('copyList')}</span>
                </>
              )}
            </button>

            <button
              id="reset-samples-btn"
              type="button"
              onClick={onResetSamples}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              title={t('resetSamples')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">{t('resetSamples')}</span>
            </button>

            {user && (
              <button
                id="logout-btn"
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 dark:hover:border-rose-900/50 transition-all duration-200"
                title={t('logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t('logout')}</span>
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
