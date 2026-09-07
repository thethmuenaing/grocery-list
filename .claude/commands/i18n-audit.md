---
description: Audit i18n key parity and hardcoded UI strings
---

Audit internationalization health. Read `src/i18n/translations.ts` and all files
under `src/components/` plus `src/GroceryApp.tsx`.

Report:

1. **Key parity** — every key present under `en.translation` but missing from
   `my.translation`, and vice versa. Include nested `categories.*` keys. This is
   the most important section.
2. **Missing keys** — any `t('...')` call in the codebase whose key does not exist
   in `translations.ts`.
3. **Suspect Myanmar values** — `my` entries whose value is byte-identical to the
   `en` value or contains no Myanmar-script characters (`က-႟`), i.e.
   probably an untranslated placeholder. Ignore intentionally-shared tokens like
   `english`/`myanmar` proper nouns.
4. **Hardcoded UI strings** — JSX text nodes or `placeholder=`/`title=` props with
   literal English (not wrapped in `t()`).

Output as four short lists. If a section is clean, say "OK". Do not fix anything
unless I ask — this is a report.
