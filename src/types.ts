export interface LocalizedString {
  en: string;
  my: string;
}

export type GroceryCategory =
  | 'produce'
  | 'dairy'
  | 'bakery'
  | 'meat'
  | 'pantry'
  | 'snacks'
  | 'beverages'
  | 'frozen'
  | 'household'
  | 'other';

export type PriorityLevel = 'low' | 'normal' | 'high';

export interface GroceryItemType {
  id: string;
  name: LocalizedString;
  note?: LocalizedString;
  quantity?: string;
  category: GroceryCategory;
  priority: PriorityLevel;
  purchased: boolean;
  createdAt: string; // ISO date string
  purchasedAt?: string;
}

export type FilterStatus = 'all' | 'pending' | 'purchased';

export type SortOption = 'dateNewest' | 'dateOldest' | 'nameAsc' | 'priority' | 'category';

export interface ModalConfig {
  isOpen: boolean;
  type: 'delete_one' | 'clear_purchased' | 'clear_all' | null;
  targetId?: string;
  targetName?: string;
}
