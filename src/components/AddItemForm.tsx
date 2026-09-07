import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Tag, StickyNote, Hash, AlertCircle, Sparkles, Flag } from 'lucide-react';
import { GroceryCategory, PriorityLevel } from '../types';
import { CATEGORIES } from '../data/categories';

interface AddItemFormProps {
  onAddItem: (item: {
    name: string;
    note?: string;
    quantity?: string;
    category: GroceryCategory;
    priority: PriorityLevel;
  }) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('produce');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [error, setError] = useState('');
  const [showMoreFields, setShowMoreFields] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t('requiredError'));
      return;
    }

    setError('');
    onAddItem({
      name: trimmedName,
      note: note.trim() || undefined,
      quantity: quantity.trim() || undefined,
      category,
      priority,
    });

    // Reset Form
    setName('');
    setNote('');
    setQuantity('');
    setCategory('produce');
    setPriority('normal');
    setShowMoreFields(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          {t('addItem')}
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>EN ↔ MY Auto-Translate</span>
          </span>
          <button
            type="button"
            onClick={() => setShowMoreFields(!showMoreFields)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {showMoreFields ? '— Less details' : '+ Extra options'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Main Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          {/* Name Field */}
          <div className="flex-1 relative">
            <input
              id="item-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('itemNamePlaceholder')}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all ${
                error
                  ? 'border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
            {error && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              id="item-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as GroceryCategory)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {t(cat.translationKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            id="add-item-submit-btn"
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addItem')}</span>
          </button>
        </div>

        {/* Optional Expanded Fields */}
        {showMoreFields && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                {t('quantityOptional')}
              </label>
              <input
                id="item-quantity-input"
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('quantityPlaceholder')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                {t('noteOptional')}
              </label>
              <input
                id="item-note-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('notePlaceholder')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                {t('priority')}
              </label>
              <select
                id="item-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
              >
                <option value="low">{t('priorityLow')}</option>
                <option value="normal">{t('priorityNormal')}</option>
                <option value="high">{t('priorityHigh')} 🔥</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
