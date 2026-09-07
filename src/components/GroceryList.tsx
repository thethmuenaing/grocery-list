import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, SearchX, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GroceryItemType } from '../types';
import { GroceryItem } from './GroceryItem';

interface GroceryListProps {
  items: GroceryItemType[];
  searchQuery: string;
  onTogglePurchased: (id: string) => void;
  onEdit: (item: GroceryItemType) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  items,
  searchQuery,
  onTogglePurchased,
  onEdit,
  onDeleteRequest,
}) => {
  const { t } = useTranslation();

  // If no items at all in user's database
  if (items.length === 0) {
    if (searchQuery) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {t('noSearchResults', { query: searchQuery })}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try checking for typos or clear your search term to see all items.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('emptyTitle')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {t('emptySubtitle')}
        </p>
      </div>
    );
  }

  // Group items by status (Pending first, then Purchased)
  const pendingItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);

  return (
    <div className="space-y-6">
      {/* Pending Items Section */}
      {pendingItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{t('pending')}</span>
              <span className="text-slate-400 font-normal">({pendingItems.length})</span>
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 gap-3">
              {pendingItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GroceryItem
                    item={item}
                    onTogglePurchased={onTogglePurchased}
                    onEdit={onEdit}
                    onDeleteRequest={onDeleteRequest}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}

      {/* Purchased Items Section */}
      {purchasedItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('purchased')}</span>
              <span className="text-slate-400 font-normal">({purchasedItems.length})</span>
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 gap-3">
              {purchasedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GroceryItem
                    item={item}
                    onTogglePurchased={onTogglePurchased}
                    onEdit={onEdit}
                    onDeleteRequest={onDeleteRequest}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
