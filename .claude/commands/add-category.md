---
description: Add a new grocery category across all 4 required files
argument-hint: <category-id> <lucide-icon-name> "<English label>" "<Myanmar label>"
---

Add a new grocery category: **$ARGUMENTS**

This change must touch exactly these four places, consistently:

1. `src/types.ts` — add the id to the `GroceryCategory` union (keep `'other'` last).
2. `src/data/categories.ts` — add a `CategoryInfo` entry before the `other` entry:
   pick a Tailwind color family not already heavily used, and fill
   `colorClass` / `badgeBg` / `badgeText` following the exact pattern of siblings.
   Set `iconName` to the given lucide icon name.
3. `src/components/GroceryItem.tsx` — import the icon from `lucide-react` and add a
   `case '<id>':` to `getCategoryIcon` returning `<Icon className="w-3.5 h-3.5" />`.
4. `src/i18n/translations.ts` — add `categories.<id>` under BOTH `en.translation.categories`
   and `my.translation.categories`. Use the provided labels; the Myanmar label must
   be real Burmese script.

Then run `npm run lint` and confirm it passes. Show me the diff for each file.
