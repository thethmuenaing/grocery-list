import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ArrowUpDown, Trash2, CheckCheck } from 'lucide-react';
import { FilterStatus, SortOption, GroceryCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface FilterButtonsProps {
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    pending: number;
    purchased: number;
  };
  onOpenClearPurchased: () => void;
  onOpenClearAll: () => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  statusFilter,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  counts,
  onOpenClearPurchased,
  onOpenClearAll,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        <button
          id="filter-tab-all"
          type="button"
          onClick={() => onStatusChange('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>{t('filterAll')}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {counts.all}
          </span>
        </button>

        <button
          id="filter-tab-pending"
          type="button"
          onClick={() => onStatusChange('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>{t('filterPending')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
          }`}>
            {counts.pending}
          </span>
        </button>

        <button
          id="filter-tab-purchased"
          type="button"
          onClick={() => onStatusChange('purchased')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'purchased'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>{t('filterPurchased')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            statusFilter === 'purchased' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
          }`}>
            {counts.purchased}
          </span>
        </button>
      </div>

      {/* Category Dropdown & Sort Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            id="category-filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto pl-3 pr-7 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
          >
            <option value="all">{t('allCategories')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {t(cat.translationKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="relative flex-1 sm:flex-none">
          <select
            id="sort-option-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full sm:w-auto pl-3 pr-7 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
          >
            <option value="dateNewest">{t('sortNewest')}</option>
            <option value="dateOldest">{t('sortOldest')}</option>
            <option value="nameAsc">{t('sortNameAsc')}</option>
            <option value="priority">{t('sortPriority')}</option>
            <option value="category">{t('sortCategory')}</option>
          </select>
        </div>

        {/* Clear Actions */}
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          {counts.purchased > 0 && (
            <button
              id="clear-purchased-btn"
              type="button"
              onClick={onOpenClearPurchased}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 transition-all cursor-pointer"
              title={t('clearPurchased')}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('clearPurchased')}</span>
            </button>
          )}

          {counts.all > 0 && (
            <button
              id="clear-all-btn"
              type="button"
              onClick={onOpenClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800 transition-all cursor-pointer"
              title={t('clearAll')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('clearAll')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
