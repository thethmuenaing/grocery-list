import { GroceryCategory } from '../types';

export interface CategoryInfo {
  id: GroceryCategory;
  translationKey: string;
  iconName: string; // lucide icon name representation
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'produce',
    translationKey: 'categories.produce',
    iconName: 'Apple',
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'dairy',
    translationKey: 'categories.dairy',
    iconName: 'Milk',
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 'bakery',
    translationKey: 'categories.bakery',
    iconName: 'Wheat',
    colorClass: 'text-orange-600 bg-orange-50 border-orange-200',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
    badgeText: 'text-orange-700 dark:text-orange-300',
  },
  {
    id: 'meat',
    translationKey: 'categories.meat',
    iconName: 'Beef',
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/30',
    badgeText: 'text-rose-700 dark:text-rose-300',
  },
  {
    id: 'pantry',
    translationKey: 'categories.pantry',
    iconName: 'CookingPot',
    colorClass: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    badgeText: 'text-yellow-700 dark:text-yellow-300',
  },
  {
    id: 'snacks',
    translationKey: 'categories.snacks',
    iconName: 'Cookie',
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/30',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  {
    id: 'beverages',
    translationKey: 'categories.beverages',
    iconName: 'CupSoda',
    colorClass: 'text-sky-600 bg-sky-50 border-sky-200',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/30',
    badgeText: 'text-sky-700 dark:text-sky-300',
  },
  {
    id: 'frozen',
    translationKey: 'categories.frozen',
    iconName: 'Snowflake',
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: 'household',
    translationKey: 'categories.household',
    iconName: 'Home',
    colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'other',
    translationKey: 'categories.other',
    iconName: 'Package',
    colorClass: 'text-gray-600 bg-gray-50 border-gray-200',
    badgeBg: 'bg-gray-100 dark:bg-gray-800/50',
    badgeText: 'text-gray-700 dark:text-gray-300',
  },
];
