import { GroceryItemType } from '../types';

export const INITIAL_GROCERY_ITEMS: GroceryItemType[] = [
  {
    id: 'item-1',
    name: {
      en: 'Fresh Organic Milk',
      my: 'လတ်ဆတ်သော သဘာဝနို့',
    },
    quantity: '2 Bottles',
    note: {
      en: 'Buy low-fat or whole milk',
      my: 'အဆီနည်း သို့မဟုတ် နို့စိမ်းဝယ်ရန်',
    },
    category: 'dairy',
    priority: 'high',
    purchased: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'item-2',
    name: {
      en: 'Whole Grain Bread',
      my: 'ဂျုံကြမ်း ပေါင်မုန့်',
    },
    quantity: '1 Loaf',
    note: {
      en: 'Check expiration date',
      my: 'သက်တမ်းကုန်ဆုံးရက် စစ်ဆေးရန်',
    },
    category: 'bakery',
    priority: 'normal',
    purchased: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'item-3',
    name: {
      en: 'Organic Bananas & Apples',
      my: 'သဘာဝ ငှက်ပျောသီး နှင့် ပန်းသီး',
    },
    quantity: '1 Bunch',
    note: {
      en: 'Slightly green bananas preferred',
      my: 'အစိမ်းရောင် သန်းသော ငှက်ပျောသီး ပိုကြိုက်သည်',
    },
    category: 'produce',
    priority: 'normal',
    purchased: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'item-4',
    name: {
      en: 'Jasmine Rice (5kg)',
      my: 'ပေါ်ဆန်းမွှေး ဆန် (၅ ကီလို)',
    },
    quantity: '1 Bag',
    note: {
      en: 'Premium brand',
      my: 'အဆင့်မြင့် အမျိုးအစား',
    },
    category: 'pantry',
    priority: 'high',
    purchased: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    purchasedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'item-5',
    name: {
      en: 'Eggs (Grade A)',
      my: 'ကြက်ဥ (ဂရိတ် အေ)',
    },
    quantity: '1 Tray (12 pcs)',
    note: {
      en: 'Large size',
      my: 'အရွယ်အစားကြီး',
    },
    category: 'dairy',
    priority: 'normal',
    purchased: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    purchasedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];
