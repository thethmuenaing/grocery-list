import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GroceryItemType,
  FilterStatus,
  SortOption,
  GroceryCategory,
  PriorityLevel,
  ModalConfig,
  LocalizedString,
} from './types';
import { INITIAL_GROCERY_ITEMS } from './data/defaultItems';
import { Header } from './components/Header';
import { Statistics } from './components/Statistics';
import { QuickAddSuggestions } from './components/QuickAddSuggestions';
import { AddItemForm } from './components/AddItemForm';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { GroceryList } from './components/GroceryList';
import { EditItemModal } from './components/EditItemModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Check } from 'lucide-react';
import { autoTranslateGroceryItem, getLocalizedText } from './utils/translationService';
import { AuthUser } from './hooks/useAuth';

const LOCAL_STORAGE_KEY = 'grocery_app_items_v2';

function normalizeGroceryItems(rawItems: any[]): GroceryItemType[] {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((i) => {
    let name: LocalizedString;
    if (typeof i.name === 'string') {
      name = { en: i.name, my: i.name };
    } else if (i.name && typeof i.name === 'object') {
      name = { en: i.name.en || i.name.my || '', my: i.name.my || i.name.en || '' };
    } else {
      name = { en: 'Item', my: 'ပစ္စည်း' };
    }

    let note: LocalizedString | undefined = undefined;
    if (typeof i.note === 'string' && i.note.trim()) {
      note = { en: i.note, my: i.note };
    } else if (i.note && typeof i.note === 'object') {
      note = { en: i.note.en || '', my: i.note.my || i.note.en || '' };
    }

    return {
      ...i,
      name,
      note,
    };
  });
}

interface GroceryAppProps {
  user: AuthUser;
  onLogout: () => void;
}

export function GroceryApp({ user, onLogout }: GroceryAppProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language === 'my' ? 'my' : 'en') as 'en' | 'my';

  const [items, setItems] = useState<GroceryItemType[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('grocery_app_items_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeGroceryItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load grocery items from localStorage', e);
    }
    return normalizeGroceryItems(INITIAL_GROCERY_ITEMS);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('dateNewest');
  const [editingItem, setEditingItem] = useState<GroceryItemType | null>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    type: null,
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save grocery items to localStorage', e);
    }
  }, [items]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleAddItem = async (newItem: {
    name: string;
    note?: string;
    quantity?: string;
    category: GroceryCategory;
    priority: PriorityLevel;
  }) => {
    const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const tempItem: GroceryItemType = {
      id: itemId,
      name: { en: newItem.name, my: newItem.name },
      note: newItem.note ? { en: newItem.note, my: newItem.note } : undefined,
      quantity: newItem.quantity,
      category: newItem.category,
      priority: newItem.priority,
      purchased: false,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [tempItem, ...prev]);
    showToast(t('itemAddedSuccess'));

    try {
      const translated = await autoTranslateGroceryItem(newItem.name, newItem.note, currentLang);
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                name: translated.name,
                note: translated.note,
              }
            : i
        )
      );
    } catch (err) {
      console.error('Translation error on add item:', err);
    }
  };

  const handleQuickAdd = async (suggestion: {
    name: LocalizedString | string;
    category: GroceryCategory;
    quantity?: string;
  }) => {
    if (typeof suggestion.name === 'object') {
      const item: GroceryItemType = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: suggestion.name,
        quantity: suggestion.quantity,
        category: suggestion.category,
        priority: 'normal',
        purchased: false,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [item, ...prev]);
      showToast(t('itemAddedSuccess'));
    } else {
      handleAddItem({
        name: suggestion.name,
        category: suggestion.category,
        quantity: suggestion.quantity,
        priority: 'normal',
      });
    }
  };

  const handleTogglePurchased = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isPurchased = !item.purchased;
          return {
            ...item,
            purchased: isPurchased,
            purchasedAt: isPurchased ? new Date().toISOString() : undefined,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItem = (updatedItem: GroceryItemType) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    showToast(t('itemUpdatedSuccess'));
  };

  const handleRequestDelete = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      type: 'delete_one',
      targetId: id,
      targetName: name,
    });
  };

  const handleConfirmAction = () => {
    if (modalConfig.type === 'delete_one' && modalConfig.targetId) {
      setItems((prev) => prev.filter((i) => i.id !== modalConfig.targetId));
    } else if (modalConfig.type === 'clear_purchased') {
      setItems((prev) => prev.filter((i) => !i.purchased));
    } else if (modalConfig.type === 'clear_all') {
      setItems([]);
    }
  };

  const handleResetSamples = () => {
    setItems(INITIAL_GROCERY_ITEMS);
    showToast('Reset to demo list!');
  };

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        if (statusFilter === 'pending' && item.purchased) return false;
        if (statusFilter === 'purchased' && !item.purchased) return false;

        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameEn = getLocalizedText(item.name, 'en').toLowerCase();
          const nameMy = getLocalizedText(item.name, 'my').toLowerCase();
          const noteEn = getLocalizedText(item.note, 'en').toLowerCase();
          const noteMy = getLocalizedText(item.note, 'my').toLowerCase();
          const category = item.category.toLowerCase();

          const matchesName = nameEn.includes(q) || nameMy.includes(q);
          const matchesNote = noteEn.includes(q) || noteMy.includes(q);
          const matchesCategory = category.includes(q);

          return matchesName || matchesNote || matchesCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'dateNewest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === 'dateOldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOption === 'nameAsc') {
          const nameA = getLocalizedText(a.name, currentLang);
          const nameB = getLocalizedText(b.name, currentLang);
          return nameA.localeCompare(nameB);
        }
        if (sortOption === 'priority') {
          const pOrder: Record<PriorityLevel, number> = { high: 3, normal: 2, low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        if (sortOption === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [items, statusFilter, selectedCategory, searchQuery, sortOption, currentLang]);

  const counts = useMemo(() => {
    const total = items.length;
    const purchased = items.filter((i) => i.purchased).length;
    const pending = total - purchased;
    return { all: total, pending, purchased };
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-emerald-600 dark:text-white text-xs font-semibold shadow-xl border border-slate-700 dark:border-emerald-500 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{toast}</span>
        </div>
      )}

      <Header items={items} onResetSamples={handleResetSamples} user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        <Statistics
          total={counts.all}
          pending={counts.pending}
          purchased={counts.purchased}
        />

        <QuickAddSuggestions onQuickAdd={handleQuickAdd} />

        <AddItemForm onAddItem={handleAddItem} />

        <div className="space-y-3">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredAndSortedItems.length}
          />

          <FilterButtons
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            counts={counts}
            onOpenClearPurchased={() =>
              setModalConfig({ isOpen: true, type: 'clear_purchased' })
            }
            onOpenClearAll={() =>
              setModalConfig({ isOpen: true, type: 'clear_all' })
            }
          />
        </div>

        <GroceryList
          items={filteredAndSortedItems}
          searchQuery={searchQuery}
          onTogglePurchased={handleTogglePurchased}
          onEdit={(item) => setEditingItem(item)}
          onDeleteRequest={handleRequestDelete}
        />
      </main>

      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1">
          <span>🛒 {t('appName')}</span>
          <span>•</span>
          <span>{t('appTagline')}</span>
        </p>
      </footer>

      <EditItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdateItem}
      />

      <ConfirmationModal
        config={modalConfig}
        onClose={() => setModalConfig({ isOpen: false, type: null })}
        onConfirm={handleConfirmAction}
        purchasedCount={counts.purchased}
        totalCount={counts.all}
      />
    </div>
  );
}
