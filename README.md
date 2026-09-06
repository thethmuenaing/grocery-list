# Grocery List - Personal Shopping Assistant 🛒

A modern, responsive, and intuitive Grocery List web application built with **React**, **TypeScript**, and **Tailwind CSS**. Designed to ensure you never forget an item on shopping day again.

---

## ✨ Features

1. **Add Grocery Item**:
   - Required item name with validation.
   - Optional notes (e.g., "Buy low sugar version", "Need 2 packs").
   - Quantity/Unit picker (e.g., "1 kg", "2 packs", "1 bottle").
   - Categorization (Fruits & Veggies, Dairy, Bakery, Meat, Pantry, Snacks, Drinks, Frozen, Household, Others).
   - Priority levels (Low, Normal, High) with high-priority highlight.
   - Auto-generated timestamps.

2. **Quick Suggestions**:
   - 1-click popular grocery chips (Milk, Eggs, Bread, Rice, Apples, Chicken, Water) for fast entry.

3. **Grocery List Display**:
   - Categorized badges with distinct icons and theme colors.
   - Interactive checkbox to mark items as **Purchased**.
   - Strikethrough visual indication and completion date tracking for purchased items.
   - Smooth layout transitions powered by `motion/react`.

4. **Edit & Delete**:
   - Full edit modal to update item details.
   - Delete individual items.
   - Confirmation dialog for safe deletions.

5. **Search & Filter**:
   - Real-time search by item name, note, or category.
   - Status filters: **All**, **Pending**, **Purchased**.
   - Category filtering dropdown.
   - Sorting options: **Newest First**, **Oldest First**, **Name (A-Z)**, **High Priority**, **Category**.

6. **Statistics & Celebration**:
   - Real-time statistics counters for Total, Pending, and Purchased items.
   - Visual progress bar.
   - Confetti celebration when all items on the shopping list are completed!

7. **Clear Actions**:
   - "Clear Purchased" button with confirmation modal.
   - "Clear All List" button with confirmation modal.
   - "Reload Demo List" button to quickly reset sample items.

8. **Internationalization (i18n)**:
   - Built-in support for **English** and **Myanmar (Burmese)** (`မြန်မာ`).
   - Top-navigation language toggle switch.
   - Complete localized translations for UI, form fields, modals, and sample items.

9. **Local Persistence**:
   - Automatically saves list data and language preference in browser `localStorage`.

---

## 🛠️ Project Structure

```text
├── index.html
├── package.json
├── metadata.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types.ts                   # Type definitions for items, categories, modal configs
    ├── i18n/
    │   ├── i18n.ts                # i18next configuration & localStorage persistence
    │   └── translations.ts        # English & Myanmar translation dictionaries
    ├── data/
    │   ├── categories.ts          # Category icons, badge styles, translation keys
    │   └── defaultItems.ts        # Default sample grocery items
    └── components/
        ├── Header.tsx             # Top bar with title, tagline, share list & language switcher
        ├── LanguageSwitcher.tsx   # EN / MY language switch toggle
        ├── Statistics.tsx         # Total, Pending, Purchased cards & progress bar
        ├── QuickAddSuggestions.tsx# Popular item quick-add chips
        ├── AddItemForm.tsx        # Add item form with extra details toggle
        ├── SearchBar.tsx          # Realtime search bar with clear button
        ├── FilterButtons.tsx      # All/Pending/Purchased tabs, categories, sort & clear actions
        ├── GroceryItem.tsx        # Card display for individual items
        ├── GroceryList.tsx        # Motion-animated list container & empty states
        ├── EditItemModal.tsx      # Modal form to edit item details
        └── ConfirmationModal.tsx  # Modal dialog for delete & clear confirmations
```

---

## 🚀 Local Installation & Setup

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### 1. Clone or Download Repository
```bash
git clone <repository-url>
cd grocery-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will launch locally at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Language Support

The application seamlessly translates between **English** and **Myanmar (Burmese)**. 

Language preference is preserved in `localStorage`, so your selection persists across page refreshes.
