# Grocery List — Architecture Review & Target Design

_Author: Software Architecture review • Date: 2026-09-06_

---

## 1. Executive summary

Grocery List is a small, well-executed **client-heavy single-page application**
with a thin server whose only real job is proxying a Gemini translation call. It
was scaffolded as a **Google AI Studio applet** and carries that DNA: Cloud Run
deploy target, server-side Gemini capability flag, `localStorage` as the entire
persistence layer, and a **simulated auth flow** with no backend.

The code quality is good — consistent styling, a thoughtful bilingual data model,
clean one-way data flow. The architectural risks are all about **scope
boundaries**: the app _looks_ like a multi-user product (login, register,
"remember me", per-user greeting) but is architected as a single-browser demo.
The main decision to make is **which of those two things it actually is**, then
close the gap.

| Aspect | Current state | Risk |
|---|---|---|
| Persistence | `localStorage`, single global key | Data loss, no sync, not per-user |
| Auth | Fake (`useAuth`), client-only | Not security; misleading |
| State | One 356-line god component | Change-friction, testability |
| Server | 1 route, no validation/limits | Cost abuse on `/api/translate` |
| Tests | None | Regression risk on refactor |
| Tooling | Typecheck only; 2 lockfiles | Inconsistent installs |

---

## 2. Current architecture

### 2.1 Context

```
                 ┌─────────────────────────────┐
   Browser  ───▶ │  Express (server.ts)        │
                 │   • POST /api/translate ────┼──▶ Google Gemini (@google/genai)
                 │   • Vite middleware (dev)    │
                 │   • static dist/ (prod)      │
                 └─────────────────────────────┘
   localStorage  ◀── all app + auth + language state (client only)
```

Single deployable (Cloud Run). No database. No external services except Gemini.

### 2.2 Frontend container

```
main.tsx
  └─ App.tsx ................ auth gate
       ├─ LoginPage / RegisterPage        (unauthenticated)
       └─ GroceryApp.tsx ................. authenticated shell — OWNS ALL STATE
            ├─ Header (+ LanguageSwitcher)
            ├─ Statistics (confetti side-effect)
            ├─ QuickAddSuggestions
            ├─ AddItemForm
            ├─ SearchBar
            ├─ FilterButtons
            ├─ GroceryList → GroceryItem[]
            ├─ EditItemModal
            └─ ConfirmationModal
```

**State ownership:** `GroceryApp` holds `items` plus 6 UI-state hooks. Children are
purely presentational (props in, callbacks out). Derived data (`filteredAndSortedItems`,
`counts`) via `useMemo`. Persistence is a single `useEffect([items])` → `localStorage`.

**Cross-cutting layers:**
- **i18n** — `i18next` singleton, `resources` bundled at build time, language
  persisted to `localStorage`, `<html lang>` synced on change.
- **Bilingual domain model** — `LocalizedString { en, my }` for user content
  (`name`, `note`), always accessed via `getLocalizedText()`. New items are created
  optimistically in one language, then `autoTranslateGroceryItem()` patches in the
  other (local dictionary → `/api/translate` → echo fallback).
- **`normalizeGroceryItems()`** — a migration shim that upgrades legacy
  plain-string data on load. This is effectively a schema-version boundary with
  no version number.

### 2.3 Backend

`server.ts` — one meaningful route. Prompt-engineers a JSON translation from
Gemini (`gemini-3.6-flash`, `responseSchema`-constrained). Always returns HTTP 200;
callers branch on a `success` boolean. Graceful degradation when `GEMINI_API_KEY`
is absent.

### 2.4 Observations

**Strengths**
- Clean unidirectional data flow; no prop-drilling pain yet at this size.
- Bilingual model is a genuine design asset — content and UI i18n are correctly
  separated concerns.
- Optimistic add + async translate is the right UX pattern.
- Graceful AI degradation; API key correctly server-only.
- Consistent, accessible-ish component style; stable `id`s for automation.

**Weaknesses / risks**
1. **`GroceryApp.tsx` is a god component** — item CRUD, translation orchestration,
   filtering, sorting, modal routing, toasts, persistence all in one file. Every
   new item feature edits this file.
2. **Persistence is not per-user.** Items live under a single global
   `grocery_app_items_v2` key regardless of which account is "logged in". Two users
   on one browser share a list; logout doesn't scope anything.
3. **`useAuth` is theatre.** No backend, `password.length >= 6` is the only check,
   any email "works". Fine for a demo — dangerous if anyone builds on it or ships
   it believing it's auth.
4. **No persistence abstraction.** `localStorage` calls are inline in `GroceryApp`,
   `useAuth`, and `i18n.ts`. Swapping to an API or IndexedDB later is a
   scavenger hunt.
5. **`/api/translate` is unbounded** — no max length on `text`/`note`, no rate
   limiting, no auth. A public Cloud Run URL here is a metered-cost liability.
6. **Model id `gemini-3.6-flash` is unverified** and failures are silent — the app
   may be running on dictionary-only translation without anyone noticing.
7. **No tests.** The pure logic that _should_ be tested (`translationService`,
   `normalizeGroceryItems`, filter/sort, `useAuth` validation) is exactly what a
   refactor would put at risk.
8. **No error boundary** — a render throw white-screens the app.
9. **Translations are one monolithic 288-line TS file**, bundled eagerly, and
   parity between `en`/`my` is maintained by hand with no check.
10. **Two lockfiles** (`bun.lock` + `package-lock.json`) — non-deterministic
    installs depending on which tool a contributor runs.
11. **Minor:** `handleResetSamples` bypasses `normalizeGroceryItems`; dictionary
    lookup in `autoTranslateGroceryItem` is computed then discarded when the API
    succeeds; `translationService.ts` fallback branches are `x ? a : a` no-ops.

---

## 3. Target architecture

Two tracks. Pick based on product intent.

### Track A — "It's a polished local demo" (low effort, days)

Keep it client-only, but make it honest and maintainable.

1. **Persistence layer.** Introduce `src/services/storage.ts` with a
   `GroceryStore` interface (`list/create/update/remove/clear`) backed by
   `localStorage`, **namespaced by user email/id** (`grocery:v3:<userId>:items`).
   Add an explicit `SCHEMA_VERSION` and route all migrations through it.
2. **Extract item logic** from `GroceryApp` into `useGroceryItems(userId)` —
   ideally a `useReducer` (`ADD / PATCH_TRANSLATION / TOGGLE / UPDATE / DELETE /
   CLEAR_PURCHASED / CLEAR_ALL / RESET`). `GroceryApp` shrinks to layout +
   filter UI state.
3. **Rename the auth surface** to what it is: `useLocalProfile` / "Continue as…".
   Drop the password field or label the screen "Demo — no real account".
4. **Translation cache.** Memoize `/api/translate` results in `localStorage`
   keyed by `normalize(text)|note|lang`. Cuts Gemini calls and cost dramatically.
5. **Error boundary** around `<GroceryApp/>` with a reload affordance.
6. **Harden the server route** even in demo mode: cap `text`/`note` at ~200 chars,
   add `express-rate-limit`, add `GET /healthz`, verify the Gemini model id.
7. **Tooling:** delete `bun.lock`, add ESLint + Prettier, add Vitest + RTL with a
   first suite on `translationService` and the reducer.
8. **Split translations** into `src/i18n/locales/en.json` + `my.json`; add a
   CI/`lint`-time parity check (the `i18n-auditor` agent already does this
   interactively).

### Track B — "It's a real multi-user product" (weeks)

Everything in Track A, plus a real backend.

```
                         ┌──────────────────────────────┐
  React SPA ──HTTPS──▶   │  API (Express / Hono on       │
   (Vite build, CDN)     │  Cloud Run)                   │
                         │   /auth/*   (sessions/JWT)    │
                         │   /items/*  (CRUD, per user)  │
                         │   /translate (cached, rate-   │──▶ Gemini
                         │              limited, authed) │
                         └───────────┬──────────────────┘
                                     ▼
                         ┌──────────────────────────────┐
                         │  Firestore / Postgres        │
                         │   users, grocery_items,      │
                         │   translation_cache          │
                         └──────────────────────────────┘
```

Key decisions:

| Decision | Recommendation | Rationale |
|---|---|---|
| Auth | Managed (Firebase Auth / Auth.js / Clerk) | Don't hand-roll password storage |
| DB | Firestore | Matches Cloud Run/AI Studio origin; real-time sync for lists; low ops |
| API style | REST, thin | CRUD-shaped domain; no need for GraphQL |
| Client data | TanStack Query over a typed API client | Cache, optimistic updates, retries — replaces the manual `setItems` patching |
| Translation | Server-owned `translation_cache` collection | Shared across users; one Gemini call per unique term ever |
| Offline | Firestore offline persistence, or keep the `localStorage` store as an offline mirror behind the same `GroceryStore` interface | List apps are used in shops with bad signal |
| Realtime | Firestore snapshot listeners | "Shared list" becomes a natural next feature |

Migration path: the Track A `GroceryStore` interface is the seam — add a
`FirestoreGroceryStore` implementation and switch the provider. The reducer and
components don't change.

### 3.1 Recommended near-term module layout

```
src/
  app/            App.tsx, providers (i18n, ErrorBoundary, Store, Query)
  features/
    auth/         useLocalProfile (or useAuth), LoginPage, RegisterPage
    grocery/
      state/      groceryReducer.ts, useGroceryItems.ts
      components/ AddItemForm, GroceryList, GroceryItem, EditItemModal, ...
      Statistics.tsx, FilterButtons.tsx
  services/
    storage.ts        GroceryStore interface + LocalStorageGroceryStore
    translation.ts    autoTranslateGroceryItem + cache (was utils/translationService)
  i18n/
    index.ts, locales/{en,my}.json
  domain/
    types.ts, categories.ts, normalize.ts
  server/           (if Track B) route modules, validation schemas
```

---

## 4. Prioritized backlog

| # | Item | Track | Effort | Impact |
|---|---|---|---|---|
| 1 | Namespace `localStorage` per user + `SCHEMA_VERSION` | A | S | High — correctness |
| 2 | Cap length + rate-limit `/api/translate`; add `/healthz`; verify model id | A | S | High — cost/abuse |
| 3 | Extract `GroceryStore` service + `useGroceryItems` reducer | A | M | High — maintainability |
| 4 | Translation response cache | A | S | High — cost/latency |
| 5 | Delete `bun.lock`; add ESLint + Prettier + Vitest; first test suite | A | M | Medium |
| 6 | Error boundary + toast context | A | S | Medium |
| 7 | Split translations to JSON + parity check in `lint` | A | S | Medium |
| 8 | Rename/relabel the fake-auth surface | A | S | Medium — honesty |
| 9 | Real backend: Auth + Firestore + per-user `/items` | B | L | Product-defining |
| 10 | TanStack Query + typed API client | B | M | High (with #9) |
| 11 | Shared/collaborative lists (realtime) | B | M | Feature |

---

## 5. Cross-cutting recommendations

- **Type safety:** `tsconfig` has no explicit `"strict": true`. Turn it on;
  fix fallout. Add `noUncheckedIndexedAccess` when touching the category lookups.
- **Validation:** adopt `zod` for the server route body and for
  `normalizeGroceryItems` (parse, don't hand-roll).
- **Observability (Track B):** structured request logging (no bodies), Gemini
  call latency/error metrics, a dashboard for translation cache hit rate.
- **CI:** GitHub Actions running `npm ci && npm run lint && npm test && npm run build`
  on PR. Add the i18n parity check as a step.
- **Accessibility:** modals need focus trap + `Esc` to close + `role="dialog"`
  `aria-modal`; the checkbox buttons need `aria-pressed`. Low effort, real value.
- **Security posture:** document clearly that current auth is non-functional; gate
  any future PII behind Track B.
