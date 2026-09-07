import { LocalizedString } from '../types';

// Built-in Dictionary for common grocery items (English <-> Myanmar)
export const GROCERY_DICTIONARY: Record<string, { en: string; my: string }> = {
  // Meats & Fish
  pork: { en: 'Pork', my: 'ဝက်သား' },
  chicken: { en: 'Chicken', my: 'ကြက်သား' },
  beef: { en: 'Beef', my: 'အမဲသား' },
  fish: { en: 'Fish', my: 'ငါး' },
  mutton: { en: 'Mutton', my: 'ဆိတ်သား' },
  prawns: { en: 'Prawns', my: 'ပုစွန်' },
  shrimp: { en: 'Shrimp', my: 'ပုစွန်' },

  // Essentials & Pantry
  rice: { en: 'Rice', my: 'ဆန်' },
  egg: { en: 'Egg', my: 'ကြက်ဥ' },
  eggs: { en: 'Eggs', my: 'ကြက်ဥ' },
  milk: { en: 'Milk', my: 'နို့' },
  bread: { en: 'Bread', my: 'ပေါင်မုန့်' },
  salt: { en: 'Salt', my: 'ဆား' },
  sugar: { en: 'Sugar', my: 'သကြား' },
  oil: { en: 'Cooking Oil', my: 'ဆီ' },
  'cooking oil': { en: 'Cooking Oil', my: 'ဟင်းချက်ဆီ' },
  butter: { en: 'Butter', my: 'ထောပတ်' },
  cheese: { en: 'Cheese', my: 'ဒိန်ခဲ' },
  coffee: { en: 'Coffee', my: 'ကော်ဖီ' },
  tea: { en: 'Tea', my: 'လက်ဖက်ရည် / ရေနွေးကြမ်း' },
  noodle: { en: 'Noodle', my: 'ခေါက်ဆွဲ' },
  noodles: { en: 'Noodles', my: 'ခေါက်ဆွဲ' },

  // Vegetables & Produce
  onion: { en: 'Onion', my: 'ကြက်သွန်နီ' },
  onions: { en: 'Onions', my: 'ကြက်သွန်နီ' },
  garlic: { en: 'Garlic', my: 'ကြက်သွန်ဖြူ' },
  potato: { en: 'Potato', my: 'အာလူး' },
  potatoes: { en: 'Potatoes', my: 'အာလူး' },
  tomato: { en: 'Tomato', my: 'ခရမ်းချဉ်သီး' },
  tomatoes: { en: 'Tomatoes', my: 'ခရမ်းချဉ်သီး' },
  chili: { en: 'Chili', my: 'ငရုတ်သီး' },
  cabbage: { en: 'Cabbage', my: 'ဂေါ်ဖီထုတ်' },
  carrot: { en: 'Carrot', my: 'မုန်လာဥနီ' },
  ginger: { en: 'Ginger', my: 'ဂျင်း' },

  // Fruits
  apple: { en: 'Apple', my: 'ပန်းသီး' },
  apples: { en: 'Apples', my: 'ပန်းသီး' },
  banana: { en: 'Banana', my: 'ငှက်ပျောသီး' },
  bananas: { en: 'Bananas', my: 'ငှက်ပျောသီး' },
  orange: { en: 'Orange', my: 'လိမ္မော်သီး' },
  oranges: { en: 'Oranges', my: 'လိမ္မော်သီး' },
  mango: { en: 'Mango', my: 'သရက်သီး' },
  watermelon: { en: 'Watermelon', my: 'ဖရဲသီး' },

  // Beverages & Snacks
  water: { en: 'Water', my: 'သောက်ရေသန့်' },
  juice: { en: 'Juice', my: 'အသီးဖျော်ရည်' },
  cookie: { en: 'Cookie', my: 'မုန့်' },
  cookies: { en: 'Cookies', my: 'မုန့်' },
  biscuit: { en: 'Biscuit', my: 'ဘီစကစ်' },
  snack: { en: 'Snack', my: 'မုန့်' },

  // Reverse Myanmar mappings
  ဝက်သား: { en: 'Pork', my: 'ဝက်သား' },
  ကြက်သား: { en: 'Chicken', my: 'ကြက်သား' },
  အမဲသား: { en: 'Beef', my: 'အမဲသား' },
  ငါး: { en: 'Fish', my: 'ငါး' },
  ဆန်: { en: 'Rice', my: 'ဆန်' },
  ကြက်ဥ: { en: 'Eggs', my: 'ကြက်ဥ' },
  နို့: { en: 'Milk', my: 'နို့' },
  ပေါင်မုန့်: { en: 'Bread', my: 'ပေါင်မုန့်' },
  ဆား: { en: 'Salt', my: 'ဆား' },
  သကြား: { en: 'Sugar', my: 'သကြား' },
  ဆီ: { en: 'Cooking Oil', my: 'ဆီ' },
  ပန်းသီး: { en: 'Apples', my: 'ပန်းသီး' },
  ငှက်ပျောသီး: { en: 'Bananas', my: 'ငှက်ပျောသီး' },
  ကြက်သွန်နီ: { en: 'Onions', my: 'ကြက်သွန်နီ' },
  ကြက်သွန်ဖြူ: { en: 'Garlic', my: 'ကြက်သွန်ဖြူ' },
  အာလူး: { en: 'Potatoes', my: 'အာလူး' },
  ခရမ်းချဉ်သီး: { en: 'Tomatoes', my: 'ခရမ်းချဉ်သီး' },
  ရေ: { en: 'Water', my: 'သောက်ရေသန့်' },
  သောက်ရေသန့်: { en: 'Water', my: 'သောက်ရေသန့်' },
};

/**
 * Safely extracts localized string for the active language ('en' | 'my')
 */
export function getLocalizedText(
  field: LocalizedString | string | undefined | null,
  lang: string = 'en'
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  const l = (lang === 'my' ? 'my' : 'en') as 'en' | 'my';
  return field[l] || field.en || field.my || '';
}

/**
 * Checks if a string contains Myanmar characters
 */
export function isMyanmarText(text: string): boolean {
  // Myanmar Unicode block: \u1000-\u109F, \uAA60-\uAA7F
  return /[\u1000-\u109F\uAA60-\uAA7F]/.test(text);
}

/**
 * Automatically translates grocery item name and note into both English and Myanmar
 */
export async function autoTranslateGroceryItem(
  name: string,
  note?: string,
  currentLang: 'en' | 'my' = 'en'
): Promise<{ name: LocalizedString; note?: LocalizedString }> {
  const cleanName = name.trim();
  const cleanNote = note ? note.trim() : '';

  if (!cleanName) {
    return {
      name: { en: '', my: '' },
      note: cleanNote ? { en: cleanNote, my: cleanNote } : undefined,
    };
  }

  const detectedLang = isMyanmarText(cleanName) ? 'my' : currentLang;

  // 1. Try local dictionary fast lookup
  const lowerName = cleanName.toLowerCase();
  const dictMatch = GROCERY_DICTIONARY[lowerName] || GROCERY_DICTIONARY[cleanName];

  let localNameResult: LocalizedString | null = null;
  if (dictMatch) {
    localNameResult = { en: dictMatch.en, my: dictMatch.my };
  }

  // 2. Try API call to server-side Gemini translation endpoint
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanName,
        note: cleanNote,
        currentLang: detectedLang,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data?.name) {
        return {
          name: {
            en: result.data.name.en || (localNameResult?.en ?? cleanName),
            my: result.data.name.my || (localNameResult?.my ?? cleanName),
          },
          note: cleanNote
            ? {
                en: result.data.note?.en || cleanNote,
                my: result.data.note?.my || cleanNote,
              }
            : undefined,
        };
      }
    }
  } catch (err) {
    console.warn('Backend translation unavailable, using client dictionary/fallback:', err);
  }

  // 3. Fallback to dictionary + input text
  const finalName: LocalizedString = localNameResult || {
    en: detectedLang === 'en' ? cleanName : cleanName,
    my: detectedLang === 'my' ? cleanName : cleanName,
  };

  const finalNote: LocalizedString | undefined = cleanNote
    ? {
        en: cleanNote,
        my: cleanNote,
      }
    : undefined;

  return { name: finalName, note: finalNote };
}
