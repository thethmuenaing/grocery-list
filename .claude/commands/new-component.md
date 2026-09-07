---
description: Scaffold a new presentational component matching house style
argument-hint: <ComponentName> <one-line purpose>
---

Create `src/components/$1.tsx` for: $ARGUMENTS

Follow the conventions in CLAUDE.md and mirror an existing sibling
(`src/components/Statistics.tsx` or `FilterButtons.tsx` are good templates):

- `import React from 'react'` + `useTranslation` if it renders any text.
- Explicit `interface {Name}Props`; component typed `React.FC<{Name}Props>`.
- Presentational only — take data and callbacks via props, no `localStorage`,
  no `fetch`, no direct `i18n.changeLanguage`.
- All user-visible text via `t('key')`; add every new key to BOTH `en` and `my`
  in `src/i18n/translations.ts`.
- Tailwind inline, brand accent `emerald`/`teal`, `slate` neutrals, a `dark:`
  variant on every color. Use `rounded-xl`/`rounded-2xl` and the card pattern
  `bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80`.
- Interactive elements get a stable kebab-case `id`.
- Icons from `lucide-react` only.

Do NOT wire it into `GroceryApp.tsx` unless I ask — just create the component and
its translation keys, then run `npm run lint`.
