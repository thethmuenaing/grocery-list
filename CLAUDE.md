# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Grocery List** — a bilingual (English / Myanmar) shopping-list SPA. Originally
scaffolded as a Google AI Studio applet (`metadata.json`,
`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`), deployed to Cloud Run via an Express
server that also proxies a Gemini translation endpoint.

Single user-facing feature set: add / edit / delete grocery items, mark purchased,
search / filter / sort, stats + confetti, share list as text, EN⇄MY auto-translation.

## Tech stack

| Area        | Choice                                                        |
|-------------|--------------------------------------------------------------|
| UI          | React 19, TypeScript (strict-ish, `noEmit`), Vite 6          |
| Styling     | Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`, `@tailwindcss/vite`) |
| Icons       | `lucide-react` only                                           |
| Animation   | `motion` (aka framer-motion) — `motion/react`                 |
| i18n        | `i18next` + `react-i18next`, resources in `src/i18n/translations.ts` |
| Server      | Express 4, `server.ts`, run with `tsx` in dev                 |
| AI          | `@google/genai`, server-side only, key = `GEMINI_API_KEY`     |
| Persistence | Browser `localStorage` only — no database                    |

## Commands

```bash
npm run dev      # Express + Vite middleware on http://localhost:3000
npm run lint     # tsc --noEmit — the ONLY automated check; run before finishing
npm run build    # vite build + esbuild bundle of server.ts -> dist/
npm run start    # run the production bundle (needs dist/)
```

There is **no test runner, no ESLint, no Prettier**. `npm run lint` (typecheck) is
the gate. Always run it after changes.

Package manager: use **npm** (`package-lock.json` is the source of truth).
`bun.lock` is stale — do not use bun, do not update it.

## Architecture map

```
src/main.tsx            -> mounts <App/>
src/App.tsx             -> auth gate: LoginPage / RegisterPage / <GroceryApp/>
src/GroceryApp.tsx      -> the whole app: item state, filters, handlers, layout (~356 lines, god component)
src/hooks/useAuth.ts    -> FAKE auth. localStorage only, no server, no real password check
src/types.ts            -> all shared types (LocalizedString, GroceryItemType, ...)
src/i18n/               -> i18n.ts (config + persistence), translations.ts (en + my dicts)
src/data/categories.ts  -> the 10 categories: id, translationKey, Tailwind badge classes, icon NAME
src/data/defaultItems.ts-> demo seed list
src/utils/translationService.ts -> local EN/MY dictionary + /api/translate fetch + helpers
src/components/         -> presentational components, all driven by props from GroceryApp
server.ts              -> Express: POST /api/translate (Gemini), else Vite middleware / static dist
```

Data flows one way: `GroceryApp` owns `items` state, passes data + callbacks down.
Persistence is a `useEffect` writing `items` to `localStorage['grocery_app_items_v2']`.

## Project-specific conventions — follow these

### Bilingual data model
- User-entered `name` and `note` are **`LocalizedString` (`{ en, my }`)**, not plain
  strings. Always read them through `getLocalizedText(field, lang)` from
  `src/utils/translationService.ts`. Never do `item.name` directly in JSX.
- New items are created with both languages set to the raw input, then
  `autoTranslateGroceryItem()` fills the other language asynchronously and patches
  state by `id`. Keep that optimistic pattern.
- `normalizeGroceryItems()` in `GroceryApp.tsx` migrates old/plain-string data on
  load — keep it backward-compatible if you change the shape.

### i18n (static UI strings)
- Every user-visible string goes through `t('key')`. No hardcoded UI text.
  (Some legacy hardcoded strings exist — don't add more; fix if you touch them.)
- **Every key MUST be added to BOTH `en` and `my`** in
  `src/i18n/translations.ts`. A key in one but not the other is a bug. Myanmar
  translations must be real Burmese — if you can't produce one, say so, don't
  paste English.
- Interpolation uses `{{name}}` / `{{count}}` style.

### Styling
- Tailwind utility classes inline. Match the existing visual language:
  `rounded-xl`/`rounded-2xl`, `emerald`/`teal` as the brand accent, `slate` for
  neutrals, and **every color needs a `dark:` variant**.
- Font stack already handles Burmese (`Noto Sans Myanmar`) — don't add font logic.
- Interactive elements get a stable `id` (see existing `id="add-item-submit-btn"`
  etc.) — these are used as test/automation hooks. Preserve them; follow the
  naming when adding controls.

### Components
- Function components with `React.FC<Props>` + an explicit `Props` interface.
- Presentational only. State and business logic live in `GroceryApp` (or a hook).
  Don't add `localStorage` / `fetch` calls inside `src/components/*`.
- Icons: import named icons from `lucide-react`. `categories.ts` stores an icon
  **name string**; the actual icon mapping is a `switch` in `GroceryItem.tsx` —
  update both when adding a category.

### Adding a grocery category (touches 4 places)
1. `src/types.ts` — add to the `GroceryCategory` union
2. `src/data/categories.ts` — add a `CategoryInfo` entry (classes + `iconName`)
3. `src/components/GroceryItem.tsx` — add a `case` in `getCategoryIcon`
4. `src/i18n/translations.ts` — add `categories.<id>` under BOTH `en` and `my`

## Server / AI notes
- `server.ts` `POST /api/translate` calls Gemini with model `'gemini-3.6-flash'`.
  **Verify this model id is valid** before relying on it — failures are swallowed
  and the client silently falls back to the local dictionary / echo.
- No input length cap, no rate limiting on `/api/translate`. If you touch that
  route, add a length guard on `text`/`note`.
- The endpoint returns `200` even on failure with a `success: false` + fallback
  payload — clients branch on `result.success`, not HTTP status. Keep that contract.
- Never move the Gemini key to the client. Never log request bodies with the key.

## Known weaknesses (don't treat as reference architecture)
- `useAuth` is not real auth — do not build security-sensitive features on it.
- `localStorage` items are **not namespaced per user** — all users on one browser
  share one list.
- `GroceryApp.tsx` is a god component — prefer extracting a `useGroceryItems`
  hook / `useReducer` when adding item logic.
- No error boundary, no request cache for translations.

See `docs/ARCHITECTURE.md` for the full review and target design.

## Definition of done
1. `npm run lint` passes (zero errors).
2. New i18n keys present in both `en` and `my`.
3. New interactive elements have stable `id`s and `dark:` classes.
4. If `server.ts` or build config changed: `npm run build` succeeds.
