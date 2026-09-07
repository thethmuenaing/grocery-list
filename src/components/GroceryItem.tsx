import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  Apple,
  Milk,
  Wheat,
  Beef,
  CookingPot,
  Cookie,
  CupSoda,
  Snowflake,
  Home,
  Package,
  StickyNote,
  Tag,
  Flag,
  Globe,
} from 'lucide-react';
import { GroceryItemType, GroceryCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { getLocalizedText } from '../utils/translationService';

interface GroceryItemProps {
  item: GroceryItemType;
  onTogglePurchased: (id: string) => void;
  onEdit: (item: GroceryItemType) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const GroceryItem: React.FC<GroceryItemProps> = ({
  item,
  onTogglePurchased,
  onEdit,
  onDeleteRequest,
}) => {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'en';
  const displayName = getLocalizedText(item.name, currentLang);
  const displayNote = getLocalizedText(item.note, currentLang);
  const altLang = currentLang === 'en' ? 'my' : 'en';
  const altName = getLocalizedText(item.name, altLang);

  const categoryInfo = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[CATEGORIES.length - 1];

  // Map category icon
  const getCategoryIcon = (cat: GroceryCategory) => {
    switch (cat) {
      case 'produce':
        return <Apple className="w-3.5 h-3.5" />;
      case 'dairy':
        return <Milk className="w-3.5 h-3.5" />;
      case 'bakery':
        return <Wheat className="w-3.5 h-3.5" />;
      case 'meat':
        return <Beef className="w-3.5 h-3.5" />;
      case 'pantry':
        return <CookingPot className="w-3.5 h-3.5" />;
      case 'snacks':
        return <Cookie className="w-3.5 h-3.5" />;
      case 'beverages':
        return <CupSoda className="w-3.5 h-3.5" />;
      case 'frozen':
        return <Snowflake className="w-3.5 h-3.5" />;
      case 'household':
        return <Home className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  // Format date cleanly according to current locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString(i18n.language === 'my' ? 'my-MM' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return date.toLocaleDateString(i18n.language === 'my' ? 'my-MM' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 border transition-all duration-200 ${
        item.purchased
          ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 text-slate-400 dark:text-slate-500'
          : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Checkbox & Main Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => onTogglePurchased(item.id)}
            className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
              item.purchased
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400'
            }`}
            title={item.purchased ? t('markPending') : t('markPurchased')}
          >
            {item.purchased && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          {/* Item Text Block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Item Name */}
              <h3
                className={`text-base font-bold tracking-tight transition-all truncate ${
                  item.purchased
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {displayName}
              </h3>

              {/* Alternate Translation Badge */}
              {altName && altName !== displayName && (
                <span
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-1"
                  title={`${altLang.toUpperCase()}: ${altName}`}
                >
                  <Globe className="w-2.5 h-2.5" />
                  <span>{altName}</span>
                </span>
              )}

              {/* Quantity Tag */}
              {item.quantity && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {item.quantity}
                </span>
              )}

              {/* High Priority Badge */}
              {item.priority === 'high' && !item.purchased && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  <Flag className="w-3 h-3 fill-rose-500 text-rose-500" />
                  {t('priorityHigh')}
                </span>
              )}
            </div>

            {/* Note */}
            {displayNote && (
              <p
                className={`text-xs mb-2 flex items-start gap-1.5 ${
                  item.purchased
                    ? 'line-through text-slate-400 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
                <span>{displayNote}</span>
              </p>
            )}

            {/* Category & Date Metadata */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-medium text-[11px] ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
              >
                {getCategoryIcon(item.category)}
                <span>{t(categoryInfo.translationKey)}</span>
              </span>

              {/* Date Created */}
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {t('addedOn')}: {formatDate(item.createdAt)}
                </span>
              </span>

              {/* Date Purchased if applicable */}
              {item.purchased && item.purchasedAt && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    {t('purchasedOn')}: {formatDate(item.purchasedAt)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions (Edit & Delete) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            id={`edit-item-btn-${item.id}`}
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={t('edit')}
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            id={`delete-item-btn-${item.id}`}
            type="button"
            onClick={() => onDeleteRequest(item.id, displayName)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
