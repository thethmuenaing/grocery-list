import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles } from 'lucide-react';
import { GroceryCategory, LocalizedString } from '../types';

interface Suggestion {
  name: LocalizedString;
  category: GroceryCategory;
  quantity?: string;
  emoji: string;
}

const SUGGESTIONS: Suggestion[] = [
  { name: { en: 'Organic Milk', my: 'သဘာဝနို့ဘူး' }, category: 'dairy', quantity: '1 Bottle', emoji: '🥛' },
  { name: { en: 'Fresh Eggs', my: 'ကြက်ဥ' }, category: 'dairy', quantity: '1 Dozen', emoji: '🥚' },
  { name: { en: 'Whole Wheat Bread', my: 'ဂျုံကြမ်း ပေါင်မုန့်' }, category: 'bakery', quantity: '1 Loaf', emoji: '🍞' },
  { name: { en: 'Bananas', my: 'ငှက်ပျောသီး' }, category: 'produce', quantity: '1 Bunch', emoji: '🍌' },
  { name: { en: 'Fresh Apples', my: 'ပန်းသီး' }, category: 'produce', quantity: '1 kg', emoji: '🍎' },
  { name: { en: 'Jasmine Rice', my: 'ပေါ်ဆန်းမွှေး ဆန်' }, category: 'pantry', quantity: '1 Bag', emoji: '🍚' },
  { name: { en: 'Fresh Chicken', my: 'ကြက်သား' }, category: 'meat', quantity: '1 Pack', emoji: '🍗' },
  { name: { en: 'Mineral Water', my: 'သောက်ရေသန့်' }, category: 'beverages', quantity: '1 Case', emoji: '💧' },
];

interface QuickAddProps {
  onQuickAdd: (item: { name: LocalizedString | string; category: GroceryCategory; quantity?: string }) => void;
}

export const QuickAddSuggestions: React.FC<QuickAddProps> = ({ onQuickAdd }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'my' ? 'my' : 'en';

  return (
    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-3.5 sm:p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{t('quickAddTitle')}</span>
        <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal ml-1 hidden xs:inline">
          ({t('quickAddSubtitle')})
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, index) => {
          const displayName = s.name[currentLang];
          return (
            <button
              key={index}
              type="button"
              onClick={() => onQuickAdd({ name: s.name, category: s.category, quantity: s.quantity })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-700 hover:border-emerald-300 transition-all active:scale-95 group cursor-pointer"
            >
              <span>{s.emoji}</span>
              <span>{displayName}</span>
              <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
