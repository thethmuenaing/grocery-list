import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Tag, StickyNote, Hash, Flag, AlertCircle, Sparkles, Globe, Loader2 } from 'lucide-react';
import { GroceryItemType, GroceryCategory, PriorityLevel } from '../types';
import { CATEGORIES } from '../data/categories';
import { autoTranslateGroceryItem, getLocalizedText } from '../utils/translationService';

interface EditItemModalProps {
  item: GroceryItemType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: GroceryItemType) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t, i18n } = useTranslation();

  const [nameEn, setNameEn] = useState('');
  const [nameMy, setNameMy] = useState('');
  const [noteEn, setNoteEn] = useState('');
  const [noteMy, setNoteMy] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('produce');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (item) {
      setNameEn(getLocalizedText(item.name, 'en'));
      setNameMy(getLocalizedText(item.name, 'my'));
      setNoteEn(getLocalizedText(item.note, 'en'));
      setNoteMy(getLocalizedText(item.note, 'my'));
      setQuantity(item.quantity || '');
      setCategory(item.category || 'produce');
      setPriority(item.priority || 'normal');
      setError('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleAutoTranslate = async () => {
    const baseText = nameEn.trim() || nameMy.trim();
    const baseNote = noteEn.trim() || noteMy.trim();

    if (!baseText) {
      setError(t('requiredError'));
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await autoTranslateGroceryItem(baseText, baseNote, i18n.language as 'en' | 'my');
      setNameEn(translated.name.en);
      setNameMy(translated.name.my);
      if (translated.note) {
        setNoteEn(translated.note.en);
        setNoteMy(translated.note.my);
      }
    } catch (err) {
      console.error('Auto translate failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEn = nameEn.trim();
    const trimmedMy = nameMy.trim();

    if (!trimmedEn && !trimmedMy) {
      setError(t('requiredError'));
      return;
    }

    const finalEn = trimmedEn || trimmedMy;
    const finalMy = trimmedMy || trimmedEn;

    onSave({
      ...item,
      name: {
        en: finalEn,
        my: finalMy,
      },
      note: (noteEn.trim() || noteMy.trim())
        ? {
            en: noteEn.trim() || noteMy.trim(),
            my: noteMy.trim() || noteEn.trim(),
          }
        : undefined,
      quantity: quantity.trim() || undefined,
      category,
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pr-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('updateItem')}</span>
          </h2>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Auto re-translate both languages using Gemini AI"
          >
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-300" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>Auto-Translate</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name Inputs (Bilingual) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('itemNameRequired')}
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">English & Myanmar</span>
            </div>

            {/* English Name */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                English (EN)
              </span>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Pork, Rice, Milk"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Myanmar Name */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                Myanmar / မြန်မာ (MY)
              </span>
              <input
                type="text"
                value={nameMy}
                onChange={(e) => {
                  setNameMy(e.target.value);
                  if (error) setError('');
                }}
                placeholder="ဥပမာ - ဝက်သား၊ ဆန်၊ နို့"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {error && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {t('category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GroceryCategory)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {t(cat.translationKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              {t('quantityOptional')}
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t('quantityPlaceholder')}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
            />
          </div>

          {/* Note Inputs (Bilingual) */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <StickyNote className="w-3.5 h-3.5 text-slate-400" />
              {t('noteOptional')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={noteEn}
                onChange={(e) => setNoteEn(e.target.value)}
                placeholder="Note in English"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
              />
              <input
                type="text"
                value={noteMy}
                onChange={(e) => setNoteMy(e.target.value)}
                placeholder="မှတ်ချက် (မြန်မာ)"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              {t('priority')}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
            >
              <option value="low">{t('priorityLow')}</option>
              <option value="normal">{t('priorityNormal')}</option>
              <option value="high">{t('priorityHigh')} 🔥</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              id="save-item-modal-btn"
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

